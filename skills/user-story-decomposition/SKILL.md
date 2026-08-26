---
name: user-story-decomposition
description: "Refine and decompose user stories into implementation-ready child-task plans grounded in tracker requirements, repository code, supporting artifacts, tests, and dependencies. Use for Azure DevOps or issue-tracker story decomposition, task planning, design or specification review including Figma, Markdown task descriptions, dependency DAGs, or approval-ready publishing handoffs. This skill is plan-only and never mutates trackers."
argument-hint: "Story ID or URL; optionally say plan only"
---

# User Story Decomposition

Refine a user story collaboratively, produce a dependency-aware implementation plan,
and prepare an approval-ready handoff for the manually selected `story-publisher` agent.
Do not implement product code or mutate tracker data as part of this workflow.

## Operating Mode

- **Plan only.** Inspect, interview, and draft without mutating the issue tracker.
- Praise, discussion, agreement with one decision, or a request to keep refining is not
  publishing approval.
- If the user changes scope after approval, revise the plan and obtain approval again.
- Even after approval, return only the exact publishing handoff. Never create, update,
  link, close, or delete tracker items.

## Inputs

Accept these optional inputs:

- Story ID or URL.
- Tracker organization, project, repository, or team context.
- Product specification, parent story, design links, or supporting documentation.
- Desired task count, parallelism, ownership split, or exclusions.
- A request to prepare a publishing handoff for an approved plan.

Before asking for tracker details, inspect repository guidance and any tracker
configuration explicitly documented by the repository. Prefer a full story URL because
it identifies the tracker organization and project. When the user supplies only a numeric
ID and multiple tracker contexts are possible, confirm the organization and project before
accessing or mutating the tracker. Never request or expose passwords, personal access
tokens, API keys, or other secrets.

## Phase 1: Establish Scope

1. Identify the repository root and read applicable `AGENTS.md`, `CONTRIBUTING.md`,
   `README.md`, scoped instructions, and tracker guidance.
2. Record language, package, module, infrastructure, and generated-file boundaries.
3. Resolve the story and read its available tracker fields, including title, type, state,
   description, acceptance criteria, classification and scheduling fields, tags, parent,
   links, and existing children. Do not choose a global board or team when the repository
   spans multiple work-management contexts.
4. Inspect the parent story when it carries business policy or acceptance criteria.
   Derive child classification and scheduling fields from the parent when the tracker
   supports them, unless the user approves an override.
5. List existing child IDs and titles before drafting or publishing to prevent
   duplicates.
6. State whether the current phase is plan-only. Do not modify code or tracker data.

If the story cannot be resolved, stop and ask for the missing organization, project,
or story reference. Do not guess tracker context.

## Phase 2: Ground the Story in the Repository

1. Search only the stack and modules allowed by repository instructions.
2. Locate the nearest code that directly owns the requested behavior, then inspect
   nearby routes, models, services, persistence, tests, and localization.
3. Distinguish clearly between:
   - existing behavior that can be reused;
   - partial behavior that must be completed;
   - new behavior and state ownership;
   - external contracts or shared flows owned elsewhere.
4. Keep separate business concepts separate even when their names or screens look
   similar. Do not reuse state merely because a nearby implementation exists.
5. Identify the narrow validation commands and existing test patterns each task should
   use.
6. Report evidence gaps instead of inventing backend APIs, policies, data sources, or
   audit behavior.

Use a read-only exploration subagent when discovery spans many files. Do not edit product
files during decomposition.

## Phase 3: Review Supporting Artifacts

When the story references designs, specifications, diagrams, data models, runbooks, or
other supporting artifacts:

1. Confirm whether the artifact is already accessible through a supplied link, shared
   browser page, repository file, or approved integration.
2. If required evidence is referenced but inaccessible, ask the user to share the active
   browser page, provide a stable deep link, or supply a safe export of the relevant
   sections. Never ask for credentials, tokens, or access secrets.
3. Open the supplied artifact and inspect only the sections relevant to the story.
4. Capture stable deep links or anchors. For Figma, preserve direct node-specific links.
5. Trace the behavior, contracts, data, states, operations, deployment, or user workflow
   that the artifact defines.
6. Separate artifact guidance from authoritative policy. If an artifact, acceptance
   criteria, and repository evidence disagree, surface the conflict for a decision.
7. Mark actively changing artifacts as provisional and record the authoritative rule in
   the task plan.

If a required referenced artifact remains inaccessible after requesting a safe access
path, record it as a dependency and identify which planning decisions it blocks. If the
story does not require or reference supporting artifacts, skip this phase and omit the
`Design` section from task descriptions. Do not fabricate artifact details or links.

## Phase 4: Refine With the User

Ask a small number of grouped questions at a time. Resolve only decisions that affect
scope, ownership, sequencing, or acceptance criteria.

Cover these topics when relevant:

- Applicable users, categories, states, channels, and feature flags.
- Domain ownership and separation from adjacent features.
- Source of required data and authoritative reference data.
- Backend API availability versus mock or frontend-owned persistence.
- Create, edit, clear, retry, stale-state, and method-switching behavior.
- Success, blocked, invalid, abandon, referral, and terminal outcomes.
- Existing shared flows versus UI this story must implement.
- Audit, privacy, logging, telemetry, authorization, and sensitive-data constraints.
- Localization and internationalization, accessibility, compatibility, performance, and
  testing expectations.
- Explicit exclusions and future integration boundaries.
- Dependencies on other stories, tasks, teams, contracts, or unsettled designs.

This checklist is not exhaustive. Derive additional questions from the story domain,
repository evidence, supporting artifacts, and affected runtime or operational context.
Ask about any concern that materially changes scope, ownership, sequencing, risk, or
acceptance criteria.

Maintain a concise decision log. Label unresolved items as blockers, external
dependencies, or non-blocking assumptions.

## Phase 5: Build the Task DAG

Create the smallest coherent set of independently reviewable tasks. Do not force a
fixed task count.

Prefer this dependency shape when the story supports it:

1. Shared contracts, domain or data models, configuration, and foundational persistence.
2. Independently implementable modules, services, interfaces, jobs, UI, or infrastructure.
3. Cross-component integration, workflows, migration, deployment, or rollout.
4. Verification, documentation, observability, and operational readiness.

For each task:

- Give it one clear implementation outcome and ownership boundary.
- Include its tests and validation rather than creating generic test-only tasks, unless
  a dedicated verification pass is genuinely needed.
- Identify explicit exclusions and shared-flow dependencies.
- Add direct design links only where they guide that task.
- Express internal and cross-story dependencies as a directed acyclic graph.
- Merge redirect-only behavior into its owning integration task when the destination
  page is implemented elsewhere.
- Avoid catch-all tasks that combine unrelated contracts, UI, integration, and cleanup.

Present task titles with one-line TL;DRs first. Refine the list with the user before
writing full descriptions.

## Task Description Template

Use this template for every task:

```markdown
## Summary

Brief statement of the task outcome.

## Design

Relevant design, specification, architecture, data-model, runbook, or other artifact links
and authoritative notes.

## Scope

- Implementation responsibilities.
- Boundaries and exclusions.

## Acceptance criteria

- Observable, testable completion conditions.

## Dependencies

- Predecessor work items.
- External contracts, policies, or shared flows.
```

`Summary`, `Scope`, and `Acceptance criteria` are required. Omit `Design` or
`Dependencies` when genuinely not applicable; never leave empty sections.

Acceptance criteria must describe behavior and verification, not internal activity such
as "code was written." Keep titles concise and sentence-cased unless repository policy
requires another format.

## Phase 6: Approval Gate

Before producing `Publishing approval: yes`, show the user:

- Parent story ID and title.
- Exact task count, titles, and complete descriptions.
- Tracker-specific classification and scheduling fields, and their inheritance behavior.
- Description format.
- Parent, predecessor, and successor links to be created.
- Remaining blockers and external dependencies.

State explicitly that no tracker mutations have occurred. Treat an unambiguous request
such as "create the tasks" or "publish this approved plan" as permission to prepare the
handoff, not permission for this skill to mutate the tracker.

The publishing handoff must contain:

- `Publishing approval: yes` and the user's explicit publication request.
- Parent story ID and tracker organization, project, and team context.
- Exact approved task titles and complete descriptions.
- Approved tracker-specific classification and scheduling behavior.
- Approved parent relations and dependency DAG.

Tracker mutation belongs only to the manually selected `story-publisher` agent. Do not
load or execute any publisher workflow from this skill.

## Boundaries

- Do not implement product code while decomposing a story.
- Never create, update, link, close, or delete work items. Explicit approval authorizes
  only an exact handoff to the manually selected publisher.
- Do not invent requirements to make the task plan appear complete.
- Backend, frontend, infrastructure, audit, E2E, shared-workflow, and cross-team stories
  are all valid. Include every surface directly required by the story, its acceptance
  criteria, repository evidence, or an explicit user decision.
- Do not expand into additional stacks, services, repositories, or team ownership without
  evidence or approval. When required scope crosses a boundary, make ownership,
  dependencies, and validation for every affected side explicit.
- Do not treat provisional visual placement as more authoritative than an approved
  business rule.
- Do not modify, commit, or push customization or product repository files as part of
  this workflow.
