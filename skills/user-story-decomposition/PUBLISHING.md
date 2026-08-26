# Tracker Publication Workflow

This workflow is publisher-only. It is not an Agent Skill and must be loaded only by the
manually selected `story-publisher` agent after its approval preconditions pass.

## Approval Revalidation

Before any mutation, verify the current conversation contains all of the following:

- `Publishing approval: yes` and an explicit user request to publish.
- Parent story ID and tracker organization, project, and team context.
- Exact approved task titles and complete descriptions.
- Approved tracker-specific classification and scheduling behavior.
- Approved parent relations and dependency DAG.
- No unresolved blocker or scope change after approval.

If any item is absent or ambiguous, stop without mutation. Never substitute a summary
for the complete approved tracker content.

## Publish to Azure DevOps

When Azure DevOps is the tracker, load available Azure DevOps tooling guidance before
mutation and follow these safeguards:

1. Re-read the parent and its children immediately before creation.
2. Inherit Area and Iteration exactly from the parent unless the user approved an
   override.
3. Detect duplicates by parent plus normalized task title. Reuse verified existing tasks
   rather than creating copies.
4. Create each child as a `Task` with its complete approved description and Markdown
   format in the same JSON Patch request.
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

## Validate Published Work

Read every created or reused task back from the tracker and verify:

- Work item type and exact title.
- Complete description and Markdown format.
- Parent relation.
- Inherited Area and Iteration.
- Required description sections and direct design links.
- Internal and cross-story predecessor relations.
- Reciprocal successor relations on predecessors.
- No duplicate children under the parent.

Report that this workflow made no intentional repository edits. Do not inspect Git state
as publication validation; repository-state validation requires a separate, explicitly
Git-scoped task.

Report created task IDs and clickable URLs, dependency validation, reused tasks, and
unresolved external dependencies. Never call partial or blocked publication complete.
