---
name: code-review
description: Review committed, staged, or uncommitted changes and named-path current-tree content against repository standards and intended requirements. Use for code review, branch review, PR review, fixed-point review, content review, standards review, spec review, or finding bugs and regressions.
---

# Code Review

Perform a read-only two-axis review. Keep Standards and Spec findings separate. Do not modify files, commit, push, or silently widen scope.

## Inputs

Accept these optional caller inputs:

- Fixed point: commit SHA, branch, tag, or merge-base.
- Spec or requirements: inline caller requirements or a path to an issue export, PRD, requirements document, or feature specification.
- Standards path: repository coding standards or scoped instruction file.
- Review scope: committed history, current changes, staged-only changes, or current-tree content at a named path.

If the caller supplies no fixed point:

- For a request explicitly about current or uncommitted changes, use `HEAD` as the baseline for tracked changes.
- For a staged-only request, use `HEAD` as the baseline and inspect only the index.
- For a named-path review that does not request change history, perform a current-tree content review and label it as such. Do not invent a Git baseline.
- For a branch, PR, or history review, ask for a commit SHA, branch, tag, or merge-base. Never guess.

## Phase 1: Establish review scope

1. Identify repository root and read applicable `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, scoped instructions, and relevant project guidance.
2. Classify the request as exactly one review mode:
   - **Fixed-point history:** changes from a caller-supplied commit, branch, tag, or merge-base to `HEAD`.
   - **Current changes:** staged and unstaged tracked changes plus in-scope untracked files.
   - **Staged only:** changes currently in the index.
   - **Current-tree content:** named files as they exist now, without claiming to review a change set.
3. For fixed-point history review, validate the reference with `git rev-parse <fixed-point>`, then capture:

   ```text
   git diff <fixed-point>...HEAD
   git log <fixed-point>..HEAD --oneline
   ```

4. For current-change review, capture tracked changes once and use status to identify in-scope untracked files:

   ```text
   git status --short
   git diff HEAD
   ```

   `git diff HEAD` already combines staged and unstaged tracked changes. Read relevant untracked files directly; never treat ignored or unrelated files as part of the review.

5. For staged-only review, capture:

   ```text
   git diff --cached
   ```

6. For current-tree content review, read only the named paths, governing guidance, and direct dependencies needed to assess them. Do not run `git status`, `git diff`, `git log`, `git rev-parse`, or equivalent Git discovery commands. State explicitly that no Git change set was reviewed. Preserve unrelated work through the declared path scope, not by inventorying the working tree.
7. Stop and report a blocked review when a supplied fixed point is invalid or a diff-based mode has no in-scope changed content. An empty tracked diff is not empty scope when relevant untracked files are present.
8. Record the review mode, exact paths, and selectors in scope. Do not inspect unrelated files except governing guidance and direct dependencies needed to understand a finding.

## Phase 2: Discover requirements

Find intended behavior in this order:

1. Inline requirements or a spec, issue export, PRD, or requirements path supplied by the caller.
2. For fixed-point history review only, issue references in commit messages within `<fixed-point>..HEAD`, such as `#123`, `Closes #45`, or GitLab `!67`.
3. Repository files under `docs/`, `specs/`, `.scratch/`, or another clearly named requirements location.

Only fetch issue details when the repository provides an issue-tracker workflow and the required configuration exists. Never claim issue-linked requirements were fetched when that configuration is missing.

If no requirements are found, ask the caller for an issue, PRD, or spec path. If the caller confirms that no requirements exist, skip the Spec axis and report `no spec available` under `## Spec`.

## Phase 3: Standards review

Review every in-scope hunk against:

- Repository and scoped coding standards.
- Existing architecture, naming, dependency direction, API contracts, generated-file policy, and test conventions.
- The Fowler smell baseline below when no documented standard overrides it.

Documented standards are hard requirements. Smells are labelled judgement calls, never automatic violations. Skip checks already enforced by tooling unless the diff shows a meaningful failure.

Use this smell baseline:

- Mysterious Name: a name does not reveal what a value or operation means.
- Duplicated Code: the same logic shape appears in multiple changed locations.
- Feature Envy: a method reaches into another object's data more than its own.
- Data Clumps: the same fields or parameters repeatedly travel together.
- Primitive Obsession: a primitive represents a domain concept that deserves a type.
- Repeated Switches: the same conditional cascade recurs for one type.
- Shotgun Surgery: one logical change scatters edits across many modules.
- Divergent Change: one file changes for several unrelated reasons.
- Speculative Generality: abstraction exists without a requirement for it.
- Message Chains: callers depend on long navigation chains.
- Middle Man: a class or function only delegates without adding value.
- Refused Bequest: an inheritor ignores most of its inherited contract.

Each Standards finding must include:

- Severity: blocking, high, medium, or low.
- File and line or hunk.
- Impact.
- Concrete remediation.
- Standard citation for documented violations, or `judgement call: <smell>` for baseline smells.

## Phase 4: Spec review

When requirements exist, compare implementation against them. Check:

- Requirements that are missing or only partially implemented.
- Behavior added without requirement support, including scope creep.
- Requirements that appear implemented but have incorrect behavior.
- Tests, error paths, security boundaries, and public contracts required by the spec.

Each Spec finding must include:

- Severity: blocking, high, medium, or low.
- File and line or hunk.
- The relevant requirement or spec quote.
- Implementation impact.
- Concrete remediation.

Do not invent requirements. Treat missing evidence as an evidence gap, not a defect, unless the repository standard makes the evidence mandatory.

## Phase 5: Report

Return exactly these top-level sections, in this order:

```markdown
## Standards

## Spec
```

Keep axes separate. Do not merge, cross-rank, or choose one overall winner. Keep findings lean and decision-ready. Put findings first, ordered by severity within each axis. If an axis has no findings, say so and name remaining validation gaps.

End with one concise line stating:

- Standards finding count and worst issue, if any.
- Spec finding count and worst issue, if any.
- Whether review is ready for publishing handoff.

Never claim tests, issue lookups, or review steps that did not run. State commands and skipped or blocked checks explicitly.
