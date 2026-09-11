---
name: user-story-decomposition
description: "Plan and decompose user stories into implementation-ready child tasks using tracker, repository, contract, test, and design evidence. Use for story refinement, Azure DevOps or issue-tracker task planning, Figma or specification review, dependency DAGs, metadata decisions, or approval-ready publishing handoffs. Plan-only; never mutates trackers or product code."
argument-hint: "Story ID or URL; optionally say plan only"
---

# User Story Decomposition

Use these eight gates in order. Scale discovery to story risk; simple stories can pass
quickly. An incomplete gate blocks final implementation-ready decomposition, approval,
and handoff. It does not block recording safely derivable provisional boundaries,
decision or artifact dependencies, conditional acceptance behavior, and verification
intent. Label that content provisional, tie each uncertainty to its blocker, and never
invent missing details. Resume at the first incomplete gate when its evidence or decision
becomes available.

## Operating Contract

- Remain plan-only: inspect, ask, and draft without changing product code or tracker data.
- Ground every proposed task in tracker requirements, repository evidence, a supporting
  artifact, or an explicit user decision.
- Follow repository boundaries and applicable instructions before inspecting code.
- Keep separate business concepts and ownership boundaries separate even when nearby
  implementations look reusable.
- Record inaccessible required evidence as a blocker and request a safe link, shared
  browser page, repository path, approved integration, or export. Never request secrets.
- For Azure DevOps reads, prefer an available authenticated MCP integration. Use read-only
  `az boards` or GET-only `az devops invoke` only when MCP is unavailable or lacks the
  required read capability. A tracker rejection is a blocker, not a reason to switch
  transports. Record which transport supplied tracker evidence.

For example, when route ownership is known but required design or copy is inaccessible,
record the known implementation boundary and artifact dependencies, then outline
conditional behavior and verification intent. Do not invent exact layout or wording,
create final task descriptions, or issue the canonical handoff.

## Gate 1: Frame

Identify the target story, tracker context, repository root, requested outcome, scope,
exclusions, and governing instructions. Read the story's available fields, parent,
relations, and existing children. A numeric ID is sufficient only when organization and
project are unambiguous.

**Complete when:** tracker target, repository scope, boundaries, exclusions, and existing
child IDs and titles are recorded. Missing target context stops the workflow.

## Gate 2: Discover

Inspect the nearest code that owns the behavior, then the relevant contracts, tests,
configuration, and linked artifacts. Distinguish existing reusable behavior, partial
behavior, new behavior, and externally owned behavior. Capture direct artifact anchors
where available and mark provisional artifacts as provisional.

**Complete when:** current behavior, owning components, affected boundaries, available
validation paths, and evidence gaps are explicit. Required inaccessible evidence is tied
to the exact decisions it blocks.

## Gate 3: Reconcile

Compare tracker requirements, parent policy, contracts, repository behavior, tests, and
supporting artifacts. Surface conflicts instead of silently choosing a source. When
relevant, resolve data availability and sequencing, state ownership, atomicity,
idempotency, retries, stale state, authorization, privacy, audit, localization,
accessibility, compatibility, rollout, and operational ownership.

**Complete when:** authoritative evidence is identified for every conflict and each
material conflict is either resolved by the user or recorded as a blocker.

## Gate 4: Decide

Ask a small grouped set of questions only for choices that change behavior, scope,
ownership, sequencing, acceptance criteria, dependencies, risk, or task metadata.
Maintain a decision log with confirmed decisions, non-blocking assumptions, external
dependencies, and blockers.

For child-task metadata, present this default map once and ask the user to confirm or
override it:

- Work item type: explicit `Task`.
- `System.AreaPath`: `inherit` from the target story.
- `System.IterationPath`: `inherit` from the target story.
- `System.State`: `tracker-default`.
- `System.Tags`: `omit`.
- `System.AssignedTo`: `omit`.
- Priority, activity, and effort fields: `omit`.
- Custom fields: `omit` unless each field and value is explicitly approved.

A documented repository policy may propose a different value, but the grouped metadata
review must expose that value for approval. Parent or story tags are never copied by
default. Represent every supported field as `inherit`, `explicit`, `tracker-default`, or
`omit`.

**Complete when:** every plan-shaping decision is confirmed or classified, and the full
metadata map is explicit. Any unresolved material decision blocks decomposition approval.

## Gate 5: Decompose

Create the smallest coherent set of independently reviewable tasks. Give each task a
stable key such as `T1`; retain the key across revisions while task identity remains the
same. Give each task one outcome and ownership boundary. Keep tests with their owning
task unless a dedicated verification task has a distinct outcome.

Express internal dependencies as directed edges between stable task keys. List external
work, contracts, policies, and shared flows separately from tracker predecessor edges.
Present concise titles and one-line summaries before expanding full descriptions.

Use this task description template:

```markdown
## Summary

Brief statement of the task outcome.

## Design

Relevant artifact links and authoritative notes.

## Scope

- Implementation responsibilities.
- Boundaries and exclusions.

## Acceptance criteria

- Observable, testable completion conditions.

## Verification

- Focused automated commands and required manual checks.

## Dependencies

- Tracker predecessor work items or stable task keys.
- External contracts, policies, or shared flows.
```

`Summary`, `Scope`, `Acceptance criteria`, and `Verification` are required. Omit `Design`
or `Dependencies` when not applicable. Acceptance criteria describe observable behavior,
not implementation activity.

**Complete when:** every task has a stable key, bounded outcome, exact title, complete
description, ownership, verification, and typed dependencies.

## Gate 6: Validate

Map every requirement and confirmed decision to at least one task or explicit exclusion.
Check task independence, dependency direction, missing prerequisites, duplicate overlap
with existing children, and DAG acyclicity. Remove unsupported scope and verify that each
task's checks match repository commands and test patterns.

**Complete when:** coverage is exhaustive, the DAG is acyclic, metadata is complete, no
task depends on invented behavior, and no unresolved blocker remains.

## Gate 7: Approve Revision

Assign the complete plan revision `R1`, then increment it whenever task membership,
titles, descriptions, metadata, relations, blockers, or approved scope changes. Present
the target story, exact task count, stable keys, titles, complete descriptions, metadata
map, description format, parent relation, dependency edges, and external dependencies.

Approval requires both explicit approval of the latest revision and an explicit request
to publish. These may arrive in one message or separate messages. Praise, partial
agreement, and requests to continue refining do not satisfy the gate. Any later plan
change invalidates approval and requires approval of the new revision.

**Complete when:** the latest exact revision has explicit approval, the user has requested
publication, and no blocker remains. State that no tracker mutation has occurred.

## Gate 8: Hand Off

For Azure DevOps, return one canonical handoff using this structure. Copy exact approved
content; never summarize or rephrase it.

```markdown
Publishing approval: yes
Plan revision: R#
Approval evidence: > exact user message

Tracker: Azure DevOps
Organization: ...
Project: ...
Team: ...
Target story: ID - title
Target story URL: ...
Work item type: Task
Description format: Markdown

Metadata policy:
- System.AreaPath: inherit
- System.IterationPath: inherit
- System.State: tracker-default
- System.Tags: omit
- System.AssignedTo: omit
- Priority/activity/effort fields: omit
- Custom fields: omit or exact approved field/value entries

Tasks:
### T1 - exact title
<exact complete Markdown description>

Relations:
- Parent: T1 -> target story ID
- Predecessor: T1 -> T2

External dependencies:
- ... or none

Blockers: none
Tracker mutation performed: no
```

Include every task and relation. For non-Azure trackers, return the approved plan and
state that no compatible publisher is defined rather than implying publication support.
Only the manually selected `story-publisher` may load the publication workflow and mutate
Azure DevOps.

## Planning Report

During refinement, report only sections useful at the current gate:

- Scope
- Evidence
- Decisions
- Proposed tasks
- Dependency DAG
- Open questions
- Handoff

Cite paths, work item IDs, and stable artifact links rather than raw dumps. Keep Git state
outside planning unless the user explicitly makes it evidence. Never claim access,
review, approval, publication, or validation that did not occur.
