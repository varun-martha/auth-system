---
name: generate-pr-description
description: Automatically generates a Pull Request description by analyzing the current branch changes and formatting them using a predefined template.
---

# Generate PR Description

This skill generates a clean and professional Pull Request description based on the current Git branch changes.

## Instructions

### 1. Analyze Branch Changes

Use the `run_command` tool to inspect the changes introduced in the current branch compared to the default branch (`main` or `master`).

#### Recommended Commands

```bash
git diff main...HEAD
```

Optionally, inspect commit history for additional context:

```bash
git log main...HEAD --oneline
```

If the repository uses `master` instead of `main`, adjust the commands accordingly.

---

### 2. Read Template

Read the PR template located at:

```text
.agents/skills/generate-pr-description/template.md
```

---

### 3. Generate PR Description

Analyze the git diff and commit history, then populate the template with concise and meaningful content.

#### 📌 PR Description
Provide:
- A high-level summary of the PR
- The problem being solved
- The overall goal or feature introduced

#### Changes done
Provide a bulleted list describing:
- Major implementation details
- Refactors
- Bug fixes
- API/UI/backend updates
- Dependency or configuration changes

#### 🧪 Tests added
Mention:
- New tests added
- Existing tests updated
- Manual testing performed
- Or state `"No additional tests were required"` if applicable

---

### 4. Deliver Output

Return the completed PR description in markdown format.

Do not:
- Open a Pull Request
- Push commits
- Modify files

Unless the user explicitly requests it.