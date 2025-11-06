#!/bin/bash
# GitHub Issue to PR Workflow Script
# Usage: ./scripts/github-workflow.sh list
#        ./scripts/github-workflow.sh start 123
#        ./scripts/github-workflow.sh pr

set -e

REPO="lukegrady1/rec-hub"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
WORKFLOW_STATE_FILE=".github-workflow-state.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Check if gh CLI is available
USE_GH_CLI=false
if command -v gh &> /dev/null; then
    USE_GH_CLI=true
    echo -e "${CYAN}✓ Using GitHub CLI${NC}"
elif [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}ERROR: GitHub token required. Set GITHUB_TOKEN environment variable${NC}"
    echo -e "${CYAN}Create token at: https://github.com/settings/tokens (needs 'repo' scope)${NC}"
    exit 1
fi

# Make GitHub API call
github_api() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-}

    if [ "$USE_GH_CLI" = true ]; then
        if [ "$method" = "GET" ]; then
            gh api "repos/$REPO/$endpoint"
        else
            echo "$data" | gh api "repos/$REPO/$endpoint" -X "$method" --input -
        fi
    else
        local url="https://api.github.com/repos/$REPO/$endpoint"
        if [ "$method" = "GET" ]; then
            curl -s -H "Authorization: token $GITHUB_TOKEN" \
                 -H "Accept: application/vnd.github.v3+json" \
                 "$url"
        else
            curl -s -H "Authorization: token $GITHUB_TOKEN" \
                 -H "Accept: application/vnd.github.v3+json" \
                 -H "Content-Type: application/json" \
                 -X "$method" \
                 -d "$data" \
                 "$url"
        fi
    fi
}

# List open issues
list_issues() {
    echo -e "\n${CYAN}📋 Fetching open issues from $REPO...${NC}"

    local issues=$(github_api "issues?state=open&per_page=20")
    local count=$(echo "$issues" | jq '. | length')

    if [ "$count" -eq 0 ]; then
        echo -e "${YELLOW}No open issues found.${NC}"
        return
    fi

    echo -e "\n${GREEN}Open Issues:${NC}\n"
    echo "$issues" | jq -r '.[] | "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n#\(.number) \(.title)\n   Author: \(.user.login) | Created: \(.created_at)\n   \(.body[:100] // "")...\n"'
}

# Get issue details
get_issue() {
    local issue_number=$1

    echo -e "${CYAN}📄 Fetching issue #$issue_number...${NC}"

    local issue=$(github_api "issues/$issue_number")

    if [ "$(echo "$issue" | jq -r '.number')" = "null" ]; then
        echo -e "${RED}ERROR: Issue #$issue_number not found${NC}"
        exit 1
    fi

    echo -e "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}Issue #$issue_number${NC}"
    echo "$issue" | jq -r '.title'
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

    echo -e "${CYAN}Description:${NC}"
    echo "$issue" | jq -r '.body // "No description"'
    echo ""

    local labels=$(echo "$issue" | jq -r '.labels | map(.name) | join(", ")')
    if [ -n "$labels" ]; then
        echo -e "${YELLOW}Labels: $labels${NC}"
    fi

    echo "$issue"
}

# Create branch from issue
create_branch() {
    local issue=$1
    local issue_number=$(echo "$issue" | jq -r '.number')
    local issue_title=$(echo "$issue" | jq -r '.title')

    # Create branch name
    local clean_title=$(echo "$issue_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | cut -c1-50)
    local branch_name="feature/issue-${issue_number}-${clean_title}"

    echo -e "\n${CYAN}🌿 Creating branch: $branch_name${NC}"

    # Ensure we're on main
    git checkout main 2>&1 > /dev/null

    # Pull latest if remote exists
    if git remote | grep -q "origin"; then
        echo -e "   ${CYAN}Pulling latest changes from main...${NC}"
        git pull origin main 2>&1 > /dev/null || true
    fi

    # Create and checkout branch
    if git branch --list | grep -q "$branch_name"; then
        echo -e "   ${YELLOW}Branch already exists, checking out...${NC}"
        git checkout "$branch_name" 2>&1 > /dev/null
    else
        git checkout -b "$branch_name" 2>&1 > /dev/null
        echo -e "   ${GREEN}✓ Branch created and checked out${NC}"
    fi

    echo "$branch_name"
}

# Start workflow for issue
start_workflow() {
    local issue_number=$1

    # Get issue
    local issue=$(get_issue "$issue_number")

    # Confirm
    echo -e "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}Workflow Plan:${NC}"
    echo -e "  ${GRAY}1. Create feature branch from issue${NC}"
    echo -e "  ${GRAY}2. You implement the changes${NC}"
    echo -e "  ${GRAY}3. You commit the changes${NC}"
    echo -e "  ${GRAY}4. Run this script with 'pr' to open PR${NC}"
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${CYAN}Workflow cancelled.${NC}"
        exit 0
    fi

    # Create branch
    local branch_name=$(create_branch "$issue")

    # Save state
    cat > "$WORKFLOW_STATE_FILE" <<EOF
{
  "issueNumber": $issue_number,
  "branchName": "$branch_name",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

    echo -e "\n${GREEN}✅ Branch created successfully!${NC}"
    echo -e "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  ${NC}1. Make your changes to resolve issue #$issue_number${NC}"
    echo -e "  ${NC}2. Stage and commit your changes:${NC}"
    echo -e "     ${GRAY}git add .${NC}"
    echo -e "     ${GRAY}git commit -m 'Fix #$issue_number: Description of changes'${NC}"
    echo -e "  ${NC}3. Create PR with:${NC}"
    echo -e "     ${GRAY}./scripts/github-workflow.sh pr${NC}"
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
}

# Create pull request
create_pr() {
    # Load state
    if [ ! -f "$WORKFLOW_STATE_FILE" ]; then
        echo -e "${RED}ERROR: No workflow state found. Start with 'start <issue-number>' first.${NC}"
        exit 1
    fi

    local issue_number=$(jq -r '.issueNumber' "$WORKFLOW_STATE_FILE")
    local branch_name=$(jq -r '.branchName' "$WORKFLOW_STATE_FILE")
    local current_branch=$(git rev-parse --abbrev-ref HEAD)

    if [ "$current_branch" != "$branch_name" ]; then
        echo -e "${YELLOW}WARNING: Current branch '$current_branch' doesn't match workflow branch '$branch_name'${NC}"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi

    # Check for commits
    local commit_count=$(git rev-list --count HEAD ^main 2>/dev/null || echo "0")
    if [ "$commit_count" = "0" ]; then
        echo -e "${RED}ERROR: No commits on this branch yet. Make changes and commit first.${NC}"
        exit 1
    fi

    # Get issue details
    local issue=$(github_api "issues/$issue_number")
    local issue_title=$(echo "$issue" | jq -r '.title')

    echo -e "\n${CYAN}📤 Preparing to create pull request...${NC}"

    # Push branch
    echo -e "   ${CYAN}Pushing branch to remote...${NC}"
    git push -u origin "$branch_name" 2>&1 > /dev/null

    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to push branch to remote${NC}"
        exit 1
    fi

    echo -e "   ${GREEN}✓ Branch pushed to remote${NC}"

    # Create PR
    local pr_title="Fix #${issue_number}: ${issue_title}"
    local pr_body="## Summary
Closes #${issue_number}

${issue_title}

## Changes Made
<!-- Describe the changes you made to resolve this issue -->

## Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Related Issue
Resolves #${issue_number}

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)"

    echo -e "   ${CYAN}Creating pull request...${NC}"

    local pr_data=$(jq -n \
        --arg title "$pr_title" \
        --arg body "$pr_body" \
        --arg head "$branch_name" \
        --arg base "main" \
        '{title: $title, body: $body, head: $head, base: $base}')

    local pr=$(github_api "pulls" "POST" "$pr_data")
    local pr_url=$(echo "$pr" | jq -r '.html_url')

    if [ "$pr_url" != "null" ]; then
        echo -e "\n${GREEN}✅ Pull request created successfully!${NC}"
        echo -e "   ${CYAN}URL: $pr_url${NC}\n"

        # Clean up
        rm -f "$WORKFLOW_STATE_FILE"
    else
        echo -e "${RED}ERROR: Failed to create pull request${NC}"
        echo "$pr" | jq '.'
        exit 1
    fi
}

# Show usage
usage() {
    cat << EOF
GitHub Issue to PR Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  List open issues:
    ./scripts/github-workflow.sh list

  Start workflow for an issue:
    ./scripts/github-workflow.sh start <issue-number>

  Create PR after committing changes:
    ./scripts/github-workflow.sh pr

Environment:
  Set GITHUB_TOKEN environment variable for API access
  Or install GitHub CLI (gh) for automatic authentication

Example workflow:
  1. ./scripts/github-workflow.sh list
  2. ./scripts/github-workflow.sh start 42
  3. # Make your changes and commit
  4. ./scripts/github-workflow.sh pr

EOF
}

# Main
case "${1:-}" in
    list)
        list_issues
        ;;
    start)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}ERROR: Issue number required${NC}"
            echo "Usage: ./scripts/github-workflow.sh start <issue-number>"
            exit 1
        fi
        start_workflow "$2"
        ;;
    pr)
        create_pr
        ;;
    *)
        usage
        ;;
esac
