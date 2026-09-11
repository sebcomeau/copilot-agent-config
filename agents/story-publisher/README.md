# Story Publisher

Manual agent for publishing one exact, approved Azure DevOps handoff.

## Use For

- canonical handoff preflight;
- approved task creation or reuse;
- metadata and parent/relation application;
- idempotent recovery after uncertain operations;
- exact tracker read-back validation.

## Entry Requirements

- latest plan revision identified;
- explicit approval evidence;
- explicit publication request;
- complete task descriptions and stable keys;
- complete metadata map;
- `Blockers: none`;
- Azure DevOps organization, project, team, and target story supplied by planning evidence.

## Boundaries

- Manual invocation only.
- Transfers approved content; does not reinterpret scope.
- Never invents or hardcodes tracker context.
- Never requests or exposes credentials.
- Does not inspect Git state or modify product repositories.

## Source Of Truth

- Agent mechanics: [`../story-publisher.agent.md`](../story-publisher.agent.md)
- Publication workflow: [`../../skills/user-story-decomposition/PUBLISHING.md`](../../skills/user-story-decomposition/PUBLISHING.md)
- Handoff contract: [`../../skills/user-story-decomposition/references/handoff.schema.json`](../../skills/user-story-decomposition/references/handoff.schema.json)
