# GitHub Issue to PR Workflow Script
# Usage: .\scripts\github-workflow.ps1 -IssueNumber 123
# or: .\scripts\github-workflow.ps1 -ListIssues

param(
    [int]$IssueNumber,
    [switch]$ListIssues,
    [string]$GithubToken = $env:GITHUB_TOKEN,
    [string]$Repo = "lukegrady1/rec-hub"
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { param($Message) Write-Host $Message -ForegroundColor Green }
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host $Message -ForegroundColor Red }

# Check if gh CLI is available, otherwise use curl
$useGhCli = $false
try {
    $ghVersion = gh --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $useGhCli = $true
        Write-Info "✓ Using GitHub CLI"
    }
} catch {
    Write-Info "✓ GitHub CLI not found, using REST API"
}

# Validate GitHub token
if (-not $useGhCli -and -not $GithubToken) {
    Write-Error "ERROR: GitHub token required. Set GITHUB_TOKEN environment variable or pass -GithubToken"
    Write-Info "Create token at: https://github.com/settings/tokens (needs 'repo' scope)"
    exit 1
}

# Function to make GitHub API calls
function Invoke-GithubApi {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )

    if ($useGhCli) {
        $apiUrl = "repos/$Repo/$Endpoint"
        if ($Method -eq "GET") {
            $result = gh api $apiUrl | ConvertFrom-Json
        } else {
            $bodyJson = $Body | ConvertTo-Json -Depth 10
            $result = gh api $apiUrl -X $Method --input - <<< $bodyJson | ConvertFrom-Json
        }
        return $result
    } else {
        $headers = @{
            "Authorization" = "token $GithubToken"
            "Accept" = "application/vnd.github.v3+json"
            "User-Agent" = "RecHub-Workflow"
        }

        $uri = "https://api.github.com/repos/$Repo/$Endpoint"

        if ($Method -eq "GET") {
            return Invoke-RestMethod -Uri $uri -Headers $headers -Method $Method
        } else {
            $bodyJson = $Body | ConvertTo-Json -Depth 10
            return Invoke-RestMethod -Uri $uri -Headers $headers -Method $Method -Body $bodyJson -ContentType "application/json"
        }
    }
}

# List open issues
function Get-OpenIssues {
    Write-Info "`n📋 Fetching open issues from $Repo..."
    $issues = Invoke-GithubApi -Endpoint "issues?state=open&per_page=20"

    if ($issues.Count -eq 0) {
        Write-Warning "No open issues found."
        return
    }

    Write-Success "`nOpen Issues:`n"
    foreach ($issue in $issues) {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
        Write-Host "#$($issue.number) " -NoNewline -ForegroundColor Yellow
        Write-Host $issue.title -ForegroundColor White
        Write-Host "   Author: $($issue.user.login) | Created: $($issue.created_at)" -ForegroundColor Gray

        if ($issue.labels.Count -gt 0) {
            $labelNames = ($issue.labels | ForEach-Object { $_.name }) -join ", "
            Write-Host "   Labels: $labelNames" -ForegroundColor Magenta
        }

        if ($issue.body) {
            $preview = $issue.body.Substring(0, [Math]::Min(100, $issue.body.Length))
            Write-Host "   $preview..." -ForegroundColor Gray
        }
    }
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray
}

# Get specific issue details
function Get-IssueDetails {
    param([int]$Number)

    Write-Info "📄 Fetching issue #$Number..."
    $issue = Invoke-GithubApi -Endpoint "issues/$Number"

    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "Issue #$Number" -ForegroundColor Yellow
    Write-Host $issue.title -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

    if ($issue.body) {
        Write-Host "Description:" -ForegroundColor Cyan
        Write-Host $issue.body
        Write-Host ""
    }

    if ($issue.labels.Count -gt 0) {
        $labelNames = ($issue.labels | ForEach-Object { $_.name }) -join ", "
        Write-Host "Labels: $labelNames" -ForegroundColor Magenta
    }

    return $issue
}

# Create branch from issue
function New-IssueBranch {
    param([object]$Issue)

    # Create branch name from issue title
    $branchName = "feature/issue-$($Issue.number)-" + ($Issue.title -replace '[^a-zA-Z0-9]', '-' -replace '-+', '-').ToLower().Substring(0, [Math]::Min(50, ($Issue.title -replace '[^a-zA-Z0-9]', '-').Length))

    Write-Info "`n🌿 Creating branch: $branchName"

    # Ensure we're on main and up to date
    git checkout main 2>&1 | Out-Null

    # Check if remote exists
    $remoteExists = git remote | Select-String "origin"
    if ($remoteExists) {
        Write-Info "   Pulling latest changes from main..."
        git pull origin main 2>&1 | Out-Null
    }

    # Create and checkout new branch
    $existingBranch = git branch --list $branchName
    if ($existingBranch) {
        Write-Warning "   Branch already exists, checking out..."
        git checkout $branchName 2>&1 | Out-Null
    } else {
        git checkout -b $branchName 2>&1 | Out-Null
        Write-Success "   ✓ Branch created and checked out"
    }

    return $branchName
}

# Create PR from current branch
function New-PullRequest {
    param(
        [object]$Issue,
        [string]$BranchName
    )

    Write-Info "`n📤 Preparing to create pull request..."

    # Check if there are any commits
    $commitCount = git rev-list --count HEAD ^main 2>$null
    if (-not $commitCount -or $commitCount -eq "0") {
        Write-Error "ERROR: No commits on this branch yet. Make changes and commit first."
        return $null
    }

    # Push branch to remote
    Write-Info "   Pushing branch to remote..."
    git push -u origin $BranchName 2>&1 | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-Error "ERROR: Failed to push branch to remote"
        return $null
    }

    Write-Success "   ✓ Branch pushed to remote"

    # Create PR title and body
    $prTitle = "Fix #$($Issue.number): $($Issue.title)"
    $prBody = @"
## Summary
Closes #$($Issue.number)

$($Issue.title)

## Changes Made
<!-- Describe the changes you made to resolve this issue -->

## Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Related Issue
Resolves #$($Issue.number)

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
"@

    # Create PR
    Write-Info "   Creating pull request..."

    try {
        if ($useGhCli) {
            $pr = gh pr create --title $prTitle --body $prBody --base main --head $BranchName | ConvertFrom-Json
        } else {
            $prData = @{
                title = $prTitle
                body = $prBody
                head = $BranchName
                base = "main"
            }
            $pr = Invoke-GithubApi -Endpoint "pulls" -Method "POST" -Body $prData
        }

        Write-Success "`n✅ Pull request created successfully!"
        Write-Info "   URL: $($pr.html_url)"
        return $pr
    } catch {
        Write-Error "ERROR: Failed to create pull request: $_"
        return $null
    }
}

# Main workflow
function Start-IssueWorkflow {
    param([int]$Number)

    # Get issue details
    $issue = Get-IssueDetails -Number $Number

    if (-not $issue) {
        Write-Error "ERROR: Issue #$Number not found"
        exit 1
    }

    # Confirm workflow start
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "Workflow Plan:" -ForegroundColor Yellow
    Write-Host "  1. Create feature branch from issue" -ForegroundColor Gray
    Write-Host "  2. You implement the changes" -ForegroundColor Gray
    Write-Host "  3. You commit the changes" -ForegroundColor Gray
    Write-Host "  4. Run this script again with -CreatePR to open PR" -ForegroundColor Gray
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

    $confirm = Read-Host "Continue? (y/n)"
    if ($confirm -ne "y") {
        Write-Info "Workflow cancelled."
        exit 0
    }

    # Create branch
    $branchName = New-IssueBranch -Issue $issue

    Write-Success "`n✅ Branch created successfully!"
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Make your changes to resolve issue #$Number" -ForegroundColor White
    Write-Host "  2. Stage and commit your changes:" -ForegroundColor White
    Write-Host "     git add ." -ForegroundColor Gray
    Write-Host "     git commit -m 'Fix #$Number: Description of changes'" -ForegroundColor Gray
    Write-Host "  3. Create PR with:" -ForegroundColor White
    Write-Host "     .\scripts\github-workflow.ps1 -CreatePR" -ForegroundColor Gray
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

    # Save workflow state
    $workflowState = @{
        issueNumber = $Number
        branchName = $branchName
        timestamp = Get-Date -Format "o"
    } | ConvertTo-Json

    $workflowState | Out-File -FilePath ".github-workflow-state.json" -Encoding UTF8
}

# Create PR from current branch
function Start-CreatePR {
    # Load workflow state
    if (-not (Test-Path ".github-workflow-state.json")) {
        Write-Error "ERROR: No workflow state found. Start with -IssueNumber first."
        exit 1
    }

    $state = Get-Content ".github-workflow-state.json" | ConvertFrom-Json
    $currentBranch = git rev-parse --abbrev-ref HEAD

    if ($currentBranch -ne $state.branchName) {
        Write-Warning "WARNING: Current branch '$currentBranch' doesn't match workflow branch '$($state.branchName)'"
        $confirm = Read-Host "Continue anyway? (y/n)"
        if ($confirm -ne "y") {
            exit 0
        }
    }

    # Get issue details
    $issue = Invoke-GithubApi -Endpoint "issues/$($state.issueNumber)"

    # Create PR
    $pr = New-PullRequest -Issue $issue -BranchName $state.branchName

    if ($pr) {
        # Clean up workflow state
        Remove-Item ".github-workflow-state.json" -ErrorAction SilentlyContinue
    }
}

# Main execution
if ($ListIssues) {
    Get-OpenIssues
} elseif ($IssueNumber -gt 0) {
    Start-IssueWorkflow -Number $IssueNumber
} elseif ($args -contains "-CreatePR") {
    Start-CreatePR
} else {
    Write-Host @"
GitHub Issue to PR Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  List open issues:
    .\scripts\github-workflow.ps1 -ListIssues

  Start workflow for an issue:
    .\scripts\github-workflow.ps1 -IssueNumber 123

  Create PR after committing changes:
    .\scripts\github-workflow.ps1 -CreatePR

Environment:
  Set GITHUB_TOKEN environment variable for API access
  Or install GitHub CLI (gh) for automatic authentication

Example workflow:
  1. .\scripts\github-workflow.ps1 -ListIssues
  2. .\scripts\github-workflow.ps1 -IssueNumber 42
  3. # Make your changes and commit
  4. .\scripts\github-workflow.ps1 -CreatePR
"@
}
