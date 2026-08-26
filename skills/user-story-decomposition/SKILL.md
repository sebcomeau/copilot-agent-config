---
name: user-story-decomposition
description: "Refine and decompose user stories into implementation-ready child tasks grounded in tracker requirements, repository code, supporting artifacts, tests, and dependencies. Use for Azure DevOps or issue-tracker story decomposition, task planning, design or specification review including Figma, child task creation, Markdown task descriptions, or predecessor/successor links. Plan first and never mutate the tracker without explicit approval."
argument-hint: "Story ID or URL; optionally say plan only"
---

# User Story Decomposition

Refine a user story collaboratively, produce a dependency-aware implementation plan,
and optionally publish approved child tasks. Do not implement product code as part of
this workflow.

## Operating Modes

- **Plan** is always the default. Inspect, interview, and draft without mutating the
  issue tracker.
- **Publish** is allowed only after the user explicitly approves the final task set and
  asks to create or publish it.
- Praise, discussion, agreement with one decision, or a request to keep refining is not
  publishing approval.
- If the user changes scope after approval, revise the plan and obtain approval again.

## Inputs

Accept these optional inputs:

- Story ID or URL.
- Tracker organization, project, repository, or team context.
- Product specification, parent story, design links, or supporting documentation.
- Desired task count, parallelism, ownership split, or exclusions.
- A request to remain plan-only or to publish an already approved plan.

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

Before publishing, show the user:

- Parent story ID and title.
- Exact task count, titles, and descriptions or an approved summary of them.
- Tracker-specific classification and scheduling fields, and their inheritance behavior.
- Description format.
- Parent, predecessor, and successor links to be created.
- Remaining blockers and external dependencies.

State explicitly that no tracker mutations have occurred. Publish only after an
unambiguous request such as "create the tasks" or "publish this approved plan."

## Phase 7: Publish to Azure DevOps

When Azure DevOps is the tracker, load available Azure DevOps tooling guidance before
mutation and follow these safeguards:

1. Re-read the parent and its children immediately before creation.
2. Inherit Area and Iteration exactly from the parent unless the user approved an
   override.
3. Detect duplicates by parent plus normalized task title. Reuse verified existing tasks
   rather than creating copies.
4. Create each child as a `Task` with its description and Markdown format in the same
   JSON Patch request.
5. Add the parent relation using `System.LinkTypes.Hierarchy-Reverse`.
6. Create tasks that supply internal dependencies before their successors.
7. Add a `Predecessor` relation to each successor. Verify that Azure DevOps exposes the
   reciprocal `Successor` relation on the predecessor.
8. Use operating-system temporary files for long JSON request bodies and remove them
   afterward. Do not create publishing artifacts in the product repository.
9. Never print authentication material or place secrets in command arguments, files, or
   task descriptions.

For Markdown work item creation, the JSON Patch must include both operations in the
initial request:

```json
{
  "op": "add",
  "path": "/fields/System.Description",
  "value": "## Summary\n..."
},
{
  "op": "add",
  "path": "/multilineFieldsFormat/System.Description",
  "value": "Markdown"
}
```

Use the Work Item REST resource through `az devops invoke` with media type
`application/json-patch+json` when descriptions are long or Markdown formatting is
required. Do not rely on `az boards work-item create --description` for this workflow.

On Windows, avoid passing long bodies through `az.cmd`. Prefer `--in-file` with
`az devops invoke`; resolve the installed CLI normally rather than hard-coding a local
installation path.

If publishing fails partway through, stop, re-read the parent and children, report what
was created, and resume idempotently only after the current state is known. Never delete
or recreate successful tasks merely to simplify recovery.

## Phase 8: Validate Published Work

Read every created or reused task back from the tracker and verify:

- Work item type and exact title.
- Parent relation.
- Inherited Area and Iteration.
- Markdown description format.
- Required description sections and direct design links.
- Internal and cross-story predecessor relations.
- Reciprocal successor relations on predecessors.
- No duplicate children under the parent.

Check the product repository working tree and confirm it remains unchanged unless the
user separately requested repository edits.

Report created task IDs and clickable URLs, dependency validation, any reused tasks,
and unresolved external dependencies. Never claim a tracker write or validation that
did not complete.

## Boundaries

- Do not implement product code while decomposing a story.
- Do not create, update, link, close, or delete work items without explicit approval.
- Do not invent requirements to make the task plan appear complete.
- Backend, frontend, infrastructure, audit, E2E, shared-workflow, and cross-team stories
   are all valid. Include every surface directly required by the story, its acceptance
   criteria, repository evidence, or an explicit user decision.
- Do not expand into additional stacks, services, repositories, or team ownership without
   evidence or approval. When required scope crosses a boundary, make ownership,
   dependencies, and validation for every affected side explicit.
- Do not treat provisional visual placement as more authoritative than an approved
  business rule.
- Do not commit or push customization or product repository changes unless explicitly
  requested.