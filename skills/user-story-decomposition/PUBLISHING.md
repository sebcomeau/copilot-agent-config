# Azure DevOps Task Publication

This plain reference is publisher-only. Load it only after the manually selected
`story-publisher` receives the canonical handoff produced by `SKILL.md`. That handoff is
the sole source for approved content; this workflow validates and transfers it without
product interpretation.

## 1. Select Transport

Choose transport by explicit environment policy and operation capability before preflight:

1. Under `cli` policy, skip MCP and use Azure CLI for all supported operations.
2. Under `auto` policy, use an authenticated Azure DevOps MCP integration when it supports every field,
   description-format, and relation operation required for that request.
3. When policy permits fallback and MCP is unavailable, disconnected, or lacks an operation, use Azure CLI:
   - `az boards` for supported reads and operations that preserve the approved contract;
   - `az devops invoke` against Work Item Tracking REST for JSON Patch, Markdown format,
     or relation operations not fully supported by `az boards`.
4. Keep the selected transport after Azure DevOps accepts the request path. An
   authorization, validation, conflict, throttling, or service error is a tracker result,
   not permission to retry through another transport.

Record the transport used for every read and mutation. Use the current authenticated
context; never request, print, persist, or pass authentication material explicitly.

The canonical handoff may include `transportPolicy`: `auto`, `mcp`, or `cli`. If absent,
use `auto` unless organization or repository instructions define another policy. A
policy that disables MCP is an instruction to use `cli`, not a reason to probe MCP.

## 2. Preflight Without Mutation

Re-read the target story and all current child work items immediately before the batch.
Validate the complete handoff before making the first write:

- When a machine-readable handoff is supplied, run
  `node scripts/validate-handoff.mjs path/to/handoff.json` and stop on any validation
  error. The script is structural only; tracker state still requires this preflight.

- `Publishing approval: yes`, explicit publication request, and approval evidence refer
  to the latest `Plan revision`.
- Tracker is Azure DevOps and organization, project, team, target story ID, work item
  type, and description format are present.
- Blockers are `none` and no scope or metadata change occurred after approval.
- Stable task keys and normalized titles are unique.
- Every exact description contains its required sections, including `Verification`.
- Every metadata field has one approved action: `inherit`, `explicit`,
  `tracker-default`, or `omit`.
- Every relation references a known task key or an explicit external work item.
- The dependency graph is acyclic and has a deterministic creation order.
- Every current child is classified as `reuse`, `create`, `repair`, or `conflict` using
  the rules below.

Build the full operation plan before mutation. For CLI JSON Patch, generate arrays with a
structured JSON serializer, write them under the operating-system temporary directory,
parse each file back, and compare every value with the handoff before sending it. Preserve
field values byte-for-byte, including Azure DevOps backslashes. RFC 6902 property paths
retain their required forward slashes. Shell heredocs, shell interpolation, blanket slash
replacement, and hard-coded CLI installation paths are not valid payload construction.

If any preflight check fails, report the exact mismatch and stop without mutation. Repeat
preflight after an interruption, uncertain result, detected work-item revision change, or
approved plan revision change.

## 3. Apply Metadata

Apply only fields present in the approved metadata map:

- `inherit`: copy the exact current value from the **target story**, which is the parent
  of the new child task.
- `explicit`: use the exact approved value.
- `tracker-default`: omit the field operation and let Azure DevOps choose its default.
- `omit`: do not send the field.

Create the approved work item type, normally `Task`. Never copy tags, assignee, priority,
activity, effort, or custom fields merely because they exist on the target story or its
parent. An emitted field absent from the approved metadata map fails preflight.

## 4. Classify Existing Children

Normalize titles only by trimming surrounding whitespace, collapsing internal whitespace,
and applying invariant case folding. Do not remove punctuation, words, or accents.

For each approved stable task key:

- `reuse`: one child under the target story has the normalized title and its exact title,
  description, format, approved metadata, parent relation, and approved dependency
  relations already match.
- `create`: no child has that normalized title.
- `repair`: the publisher created or updated the identified work item during the current
  publication attempt, and read-back differs from the same approved revision. Restore it
  to the exact handoff and validate again; this is correction, not new scope.
- `conflict`: a pre-existing or externally changed child has the normalized title but
  differs from approved content, or ownership of the mismatch is uncertain. Report its
  ID and differing fields, then stop for a user decision.

Never create a second child for `reuse`, `repair`, or `conflict`.

## 5. Create Tasks and Relations

Create `create` tasks in topological order. In each initial creation request include:

- exact title;
- exact complete Markdown description;
- `System.Description` format set to `Markdown`;
- fields allowed by the metadata map;
- parent relation using `System.LinkTypes.Hierarchy-Reverse`.

Record the stable task key, returned work item ID, URL, operation, and transport. After all
required task IDs exist, add each approved predecessor relation to its successor only when
that relation is absent. Verify Azure DevOps exposes the reciprocal successor relation on
the predecessor. Treat external predecessor work items the same way without mutating work
outside the approved relation set.

Remove temporary request files after their operation completes. Publication creates no
artifacts in the product repository and does not inspect Git state.

## 6. Recover Idempotently

After a failed or uncertain operation, stop further writes and re-read the target story,
children, and relevant relations. Rebuild the stable-key state table from tracker facts:

- exact completed work remains `reuse`;
- absent work remains `create`;
- publisher-owned mismatch remains `repair`;
- pre-existing, external, or ambiguous mismatch becomes `conflict`.

Resume only missing approved operations in dependency order. Check for each relation
before adding it. Never delete or recreate successful work to simplify recovery, and never
recommend rollback as the default recovery path. An uncertain create result always
requires read-back before retry.

## 7. Validate Read-Back

Read every created, reused, or repaired task and all affected predecessor work items.
Verify:

- work item type and exact title;
- exact complete description;
- Markdown format, allowing only tracker-representation case normalization;
- every `inherit` and `explicit` metadata value;
- absence of every `omit` field introduced by this publication;
- parent relation to the target story;
- every internal and external predecessor relation;
- reciprocal successor relations;
- no duplicate normalized child titles.

Read-back failure triggers the recovery classification; partial or blocked publication is
never complete.

## Report

Report the approved plan revision, transport per operation, created/reused/repaired task
IDs and URLs, conflicts, field validation, parent and dependency validation, and remaining
external dependencies. State whether publication is complete, partial, or blocked and
identify the exact next safe action.
