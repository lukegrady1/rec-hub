# GitHub Issue to PR Workflow

Automated workflow for reading GitHub issues, creating feature branches, and opening pull requests after implementation.

## Overview

This workflow streamlines the development process by:
1. Fetching open issues from your GitHub repository
2. Creating feature branches automatically from issue details
3. Opening pull requests that reference the original issue

## Prerequisites

### Option 1: GitHub CLI (Recommended)
Install the GitHub CLI for the best experience:

**Windows (PowerShell):**
```powershell
winget install --id GitHub.cli
```

**Mac:**
```bash
brew install gh
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh
```

Then authenticate:
```bash
gh auth login
```

### Option 2: Personal Access Token
If you don't have GitHub CLI, create a personal access token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Rec Hub Workflow"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. Copy the token and save it securely

**Set the token in your environment:**

Windows (PowerShell):
```powershell
$env:GITHUB_TOKEN = "your_token_here"
# Or add to your PowerShell profile for persistence
```

Mac/Linux (Bash):
```bash
export GITHUB_TOKEN="your_token_here"
# Or add to ~/.bashrc or ~/.zshrc for persistence
```

## Scripts

Two scripts are provided:
- `scripts/github-workflow.ps1` - Windows PowerShell
- `scripts/github-workflow.sh` - Mac/Linux Bash

Both provide the same functionality.

## Usage

### 1. List Open Issues

See all open issues in your repository:

**Windows:**
```powershell
.\scripts\github-workflow.ps1 -ListIssues
```

**Mac/Linux:**
```bash
./scripts/github-workflow.sh list
```

**Output:**
```
📋 Fetching open issues from lukegrady1/rec-hub...

Open Issues:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#42 Add email notifications for booking approvals
   Author: lukegrady1 | Created: 2024-11-05T10:30:00Z
   Labels: enhancement, email
   Users should receive email notifications when their booking requests...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Start Workflow for an Issue

Create a feature branch for a specific issue:

**Windows:**
```powershell
.\scripts\github-workflow.ps1 -IssueNumber 42
```

**Mac/Linux:**
```bash
./scripts/github-workflow.sh start 42
```

**What happens:**
1. Fetches issue #42 details
2. Shows you the issue title and description
3. Asks for confirmation
4. Creates a branch like `feature/issue-42-add-email-notifications-for-booking`
5. Checks out the new branch
6. Saves workflow state for later

**Output:**
```
📄 Fetching issue #42...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issue #42
Add email notifications for booking approvals
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Description:
When an admin approves or declines a booking request, the resident
should receive an email notification...

Workflow Plan:
  1. Create feature branch from issue
  2. You implement the changes
  3. You commit the changes
  4. Run this script again to open PR

Continue? (y/n): y

🌿 Creating branch: feature/issue-42-add-email-notifications-for-booking
   Pulling latest changes from main...
   ✓ Branch created and checked out

✅ Branch created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next Steps:
  1. Make your changes to resolve issue #42
  2. Stage and commit your changes:
     git add .
     git commit -m 'Fix #42: Add email notifications'
  3. Create PR with:
     .\scripts\github-workflow.ps1 -CreatePR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Implement Your Changes

Now you're on the feature branch. Make your changes:

```bash
# Edit files to resolve the issue
code apps/backend/pkg/handlers/bookings.go
code apps/backend/pkg/mail/templates.go

# Test your changes
make test

# Stage and commit
git add .
git commit -m "Fix #42: Add email notifications for booking status changes

- Send email when booking is approved
- Send email when booking is declined
- Include booking details in email template
- Add unit tests for email notifications"
```

**Commit message best practices:**
- Start with `Fix #<issue-number>:` to auto-link to the issue
- Use imperative mood ("Add feature" not "Added feature")
- Include a detailed description of what changed
- Reference the issue number

### 4. Create Pull Request

Once you've committed your changes, create a PR:

**Windows:**
```powershell
.\scripts\github-workflow.ps1 -CreatePR
```

**Mac/Linux:**
```bash
./scripts/github-workflow.sh pr
```

**What happens:**
1. Verifies you're on the correct branch
2. Checks that you have commits
3. Pushes your branch to GitHub
4. Creates a pull request with:
   - Title: `Fix #42: Add email notifications for booking approvals`
   - Body: Auto-generated template with issue link
   - Base branch: `main`
   - Head branch: Your feature branch

**Output:**
```
📤 Preparing to create pull request...
   Pushing branch to remote...
   ✓ Branch pushed to remote
   Creating pull request...

✅ Pull request created successfully!
   URL: https://github.com/lukegrady1/rec-hub/pull/123
```

### 5. Review and Merge

1. Visit the PR URL
2. Review the changes
3. Run CI checks (if configured)
4. Request reviews if needed
5. Merge when ready

When the PR is merged, issue #42 will automatically close because of the `Fix #42` or `Closes #42` reference.

## Complete Example Workflow

```bash
# 1. List open issues to find what to work on
./scripts/github-workflow.sh list

# 2. Start working on issue #42
./scripts/github-workflow.sh start 42

# 3. Make your changes
# ... edit files ...

# 4. Commit your changes
git add .
git commit -m "Fix #42: Add email notifications for booking approvals

- Implemented email sending on booking status change
- Added email templates for approved/declined bookings
- Updated booking handler to trigger emails
- Added unit tests for email functionality"

# 5. Create pull request
./scripts/github-workflow.sh pr

# 6. Visit the PR URL, review, and merge
```

## Branch Naming Convention

Branches are automatically named using this pattern:
```
feature/issue-<number>-<sanitized-title>
```

Examples:
- Issue #42: "Add email notifications" → `feature/issue-42-add-email-notifications`
- Issue #15: "Fix: Login button not working!" → `feature/issue-15-fix-login-button-not-working`

The title is:
- Converted to lowercase
- Special characters replaced with hyphens
- Multiple hyphens collapsed to one
- Truncated to 50 characters for readability

## Pull Request Template

PRs are created with this template:

```markdown
## Summary
Closes #42

<Issue title>

## Changes Made
<!-- Describe the changes you made to resolve this issue -->

## Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Related Issue
Resolves #42

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

You can edit the PR description after creation to fill in the details.

## Troubleshooting

### "GitHub token required"
**Problem:** Script can't authenticate with GitHub

**Solution:**
- Install GitHub CLI and run `gh auth login`, OR
- Set `GITHUB_TOKEN` environment variable with a personal access token

### "No commits on this branch yet"
**Problem:** Trying to create PR without any commits

**Solution:**
- Make your changes
- Stage and commit them: `git add .` and `git commit -m "..."`
- Then run the PR command again

### "Issue not found"
**Problem:** Invalid issue number

**Solution:**
- Run list command to see valid issue numbers
- Check that you typed the number correctly
- Make sure the issue exists and isn't closed

### "Failed to push branch to remote"
**Problem:** Can't push to GitHub

**Solution:**
- Check your git credentials: `git config --list`
- Verify you have push access to the repository
- Make sure you're connected to the internet

### "Current branch doesn't match workflow branch"
**Problem:** You switched branches after starting the workflow

**Solution:**
- The script will warn you and ask for confirmation
- Either checkout the correct branch or cancel and restart

## Advanced Usage

### Working on Multiple Issues

You can work on multiple issues simultaneously:

```bash
# Start issue #42
./scripts/github-workflow.sh start 42
# ... work on it, commit ...

# Switch to issue #43 before finishing #42
./scripts/github-workflow.sh start 43
# ... work on it, commit ...

# Finish #42
git checkout feature/issue-42-...
./scripts/github-workflow.sh pr

# Finish #43
git checkout feature/issue-43-...
./scripts/github-workflow.sh pr
```

**Note:** The workflow state file (`.github-workflow-state.json`) only tracks the most recent issue, but you can manually create PRs for any branch.

### Manual PR Creation

If you prefer, you can create PRs manually:

```bash
# Start workflow to create branch
./scripts/github-workflow.sh start 42

# Make changes and commit
git add .
git commit -m "Fix #42: Description"

# Push manually
git push -u origin feature/issue-42-...

# Create PR manually using gh CLI
gh pr create --title "Fix #42: Title" --body "Description" --base main
```

### Filtering Issues

To work with specific issue labels or states, modify the API call in the script:

```bash
# In the list_issues function, change:
github_api "issues?state=open&per_page=20"

# To filter by label:
github_api "issues?state=open&labels=bug&per_page=20"

# To filter by assignee:
github_api "issues?state=open&assignee=lukegrady1&per_page=20"
```

## Integration with Claude Code

This workflow is designed to work seamlessly with Claude Code:

1. **List issues** to find what to work on
2. **Start workflow** to create the branch
3. **Ask Claude Code** to implement the changes described in the issue
4. **Review and commit** the changes Claude made
5. **Create PR** automatically

Example conversation with Claude:
```
You: ./scripts/github-workflow.sh start 42
[Script creates branch for issue #42: "Add email notifications"]

You: Can you implement the email notifications for booking approvals as described in issue #42?
Claude: I'll implement email notifications for booking approvals...
[Claude writes the code]

You: git commit -m "Fix #42: Add email notifications for bookings"
You: ./scripts/github-workflow.sh pr
[PR created automatically]
```

## Configuration

### Customizing the Repository

By default, scripts use `lukegrady1/rec-hub`. To use a different repo:

**Windows:**
```powershell
$env:GITHUB_REPO = "username/repo-name"
.\scripts\github-workflow.ps1 -ListIssues
```

**Mac/Linux:**
Edit the script and change the `REPO` variable at the top:
```bash
REPO="your-username/your-repo"
```

### Workflow State File

The workflow saves state to `.github-workflow-state.json`:
```json
{
  "issueNumber": 42,
  "branchName": "feature/issue-42-add-email-notifications",
  "timestamp": "2024-11-05T15:30:00Z"
}
```

This file:
- Tracks the current issue being worked on
- Links the branch to the issue for PR creation
- Is automatically cleaned up after PR creation
- Should be in `.gitignore` (already added)

## Best Practices

1. **One issue per branch** - Keep branches focused on a single issue
2. **Descriptive commits** - Use good commit messages that explain why
3. **Reference issues** - Always include `Fix #<number>` in commits and PRs
4. **Test before PR** - Run tests and manual testing before creating PR
5. **Small PRs** - Break large issues into smaller sub-issues for easier review
6. **Update PR description** - Fill in the template with actual details
7. **Clean up branches** - Delete merged branches to keep repo tidy

## Security Notes

- **Never commit tokens** - `.env` files are already in `.gitignore`
- **Use scoped tokens** - Only grant `repo` scope, nothing more
- **Rotate tokens** - Regenerate tokens periodically
- **Environment variables** - Store tokens in env vars, not in scripts
- **GitHub CLI preferred** - Uses secure OAuth flow instead of tokens

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Verify your GitHub authentication is working: `gh auth status`
3. Check script output for specific error messages
4. Review GitHub API rate limits: `gh api rate_limit`
5. Open an issue in the repository with details

## Future Enhancements

Potential improvements to this workflow:

- [ ] Auto-assign labels to PRs based on issue labels
- [ ] Add draft PR support for work-in-progress
- [ ] Auto-request reviewers based on CODEOWNERS
- [ ] Support for closing multiple issues in one PR
- [ ] Integration with project boards
- [ ] Automatic changelog generation
- [ ] PR template customization based on issue type
- [ ] Slack/Discord notifications when PR is created
- [ ] Automated tests run before PR creation
