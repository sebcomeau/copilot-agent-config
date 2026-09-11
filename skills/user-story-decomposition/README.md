# User Story Decomposition

Reusable workflow for turning a user story into evidence-based, implementation-ready child tasks.

## Source Files

- [`references/workflow.md`](references/workflow.md): human-facing workflow overview and safety summary.
- [`SKILL.md`](SKILL.md): eight planning gates, metadata policy, revision approval, and canonical handoff.
- [`PUBLISHING.md`](PUBLISHING.md): Azure DevOps publication workflow.
- [`references/handoff.schema.json`](references/handoff.schema.json): machine-readable handoff contract.
- [`scripts/validate-handoff.mjs`](scripts/validate-handoff.mjs): structural handoff validator.
- [`scripts/publish-azure-devops.mjs`](scripts/publish-azure-devops.mjs): non-mutating CLI reconciliation and dry-run planner.
- [`evals/evals.json`](evals/evals.json): behavioral regression scenarios.

## Validation

```text
node scripts/validate-handoff.mjs path/to/handoff.json
node --test scripts/*.test.mjs
```

The dry-run planner consumes tracker organization, project, team, and target story from the approved handoff. It does not discover, hardcode, or mutate tracker context.

## Scope

Planning remains tracker- and repository-aware but plan-only. Azure DevOps mutation requires the manually selected publisher and an approved canonical handoff.
