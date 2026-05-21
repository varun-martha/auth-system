---
name: review-github-pr
description: Reviews a GitHub Pull Request using the GitHub CLI, generates review comments, and posts them only after explicit user approval.
---

# Review GitHub Pull Request

This skill reviews a GitHub Pull Request using the GitHub CLI (`gh`).

The user provides a Pull Request URL, and the agent:
1. Fetches PR details and diff
2. Reviews the code changes
3. Generates review comments
4. Shows the comments to the user
5. Posts the comments only after user approval

The agent must NEVER publish comments automatically.

---

# Instructions

## 1. Ask for Pull Request URL

Request the GitHub Pull Request URL from the user.

Example:

```text
Please provide the GitHub Pull Request URL you want me to review.
```

---

## 2. Extract PR Information

Extract:
- Repository owner
- Repository name
- Pull Request number

Example PR URL:

```text
https://github.com/org/repo/pull/123
```

Extracted values:
- owner: `org`
- repo: `repo`
- PR number: `123`

---

## 3. Fetch Pull Request Details

Use GitHub CLI commands to retrieve PR information.

### View PR Summary

```bash
gh pr view <pr-number> --repo <owner>/<repo>
```

### Fetch Changed Files

```bash
gh pr diff <pr-number> --repo <owner>/<repo>
```

### Get Commit History

```bash
gh pr view <pr-number> --repo <owner>/<repo> --json commits
```

### Get PR Metadata

```bash
gh pr view <pr-number> --repo <owner>/<repo> --json title,body,files
```

---

## 4. Review the Pull Request

Analyze:
- Code quality
- Logic issues
- Edge cases
- Error handling
- Security concerns
- Performance issues
- Naming consistency
- Architecture concerns
- Missing tests
- Maintainability

Generate only meaningful and actionable comments.

Avoid:
- Low-value nitpicks
- Duplicate comments
- Subjective style-only feedback unless impactful

---

## 5. Generate Review Summary

Provide a structured review report.

Example:

```md
# PR Review Summary

## Findings

### 1. Missing Error Handling
**File:** `src/services/auth.service.ts`

Issue:
API response parsing assumes a successful response without validation.

Suggestion:
Add defensive checks for unexpected response structures and failed requests.

---

### 2. Missing Test Coverage
**File:** `src/controllers/user.controller.ts`

Issue:
New validation logic does not appear to have test coverage.

Suggestion:
Add unit tests covering invalid payload scenarios.
```

---

## 6. Request User Approval

Before posting comments, explicitly ask for approval.

Example:

```text
Review completed. Would you like me to publish these comments to the PR?
```

The agent must wait for confirmation.

---

## 7. Publish Comments Using GitHub CLI

Only after explicit user approval.

### Submit General Review Comment

```bash
gh pr review <pr-number> \
  --repo <owner>/<repo> \
  --comment \
  --body "<review-comment>"
```

### Submit Request Changes Review

```bash
gh pr review <pr-number> \
  --repo <owner>/<repo> \
  --request-changes \
  --body "<review-summary>"
```

### Submit Approval Review

```bash
gh pr review <pr-number> \
  --repo <owner>/<repo> \
  --approve \
  --body "<approval-message>"
```

### Inline Review Comments (Optional)

```bash
gh api \
  repos/<owner>/<repo>/pulls/<pr-number>/comments \
  -f body='<comment>' \
  -f commit_id='<commit-id>' \
  -f path='<file-path>' \
  -F line=<line-number>
```

---

# Important Rules

- Never publish comments without explicit user approval.
- Never auto-approve PRs.
- Never auto-request changes.
- Keep feedback constructive and actionable.
- Prioritize high-signal review comments.
- Focus on correctness, maintainability, and reliability.
- If no major issues are found, clearly mention that.
