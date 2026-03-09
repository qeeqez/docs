---
trigger: always_on
description: Commit workflow rules for incremental development.
---

# Commit Workflow Rules

- Make step-by-step commits as coding work progresses
- Keep each commit scoped to one logical change
- Use conventional commit messages for every commit
- During commit, our lefthook will run lint, react-doctor and format automatically, reporting lint or doctor issues
- Before committing run relevant tests for touched code
- Before commiting run code-simplifier skill
