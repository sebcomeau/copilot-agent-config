# Agent Instructions

## Git inspection policy

Git state is not default task context. Do not run `git status`, `git diff`, `git log`, `git rev-parse`, or equivalent commands merely to discover scope, preserve unrelated work, confirm an edit, or prepare a report.

Git inspection is allowed only when:

- the caller explicitly requests a staged, unstaged, committed, branch, PR, or history review;
- the assigned operation inherently requires Git state, such as committing, pushing, merging, rebasing, or branch management; or
- a validation command explicitly listed in CONTRIBUTING.md or a project config file (e.g., package.json, Makefile) depends on Git metadata.

For named-file review, implementation, exploration, planning, and validation, use explicit path ownership and path-limited reads and writes. After editing, reread affected content or run focused validation instead of using Git diff to confirm the change.

## Contribution standards

Before making changes, read [CONTRIBUTING.md](CONTRIBUTING.md) for shared contribution, validation, review, and Git practices.

If CONTRIBUTING.md cannot be read, notify the caller and pause until the file is available or the caller provides explicit guidance.
