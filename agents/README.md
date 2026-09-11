# Agents

Custom agents define roles, tools, invocation boundaries, and completion contracts.

## Available Agents

- [`story-planner/README.md`](story-planner/README.md): role-specific planner usage and boundaries.
- [`story-publisher/README.md`](story-publisher/README.md): role-specific publisher usage and boundaries.
- [`story-planner.agent.md`](story-planner.agent.md): read-only story refinement and canonical publishing-handoff generation.
- [`story-publisher.agent.md`](story-publisher.agent.md): manually invoked Azure DevOps publisher for an exact approved handoff.

## Ownership

- Agent files define role mechanics and boundaries.
- Planning behavior belongs to [`../skills/user-story-decomposition/SKILL.md`](../skills/user-story-decomposition/SKILL.md).
- Publication behavior belongs to [`../skills/user-story-decomposition/PUBLISHING.md`](../skills/user-story-decomposition/PUBLISHING.md).
- Planner never mutates trackers or product code.
- Publisher mutates Azure DevOps only after explicit approval and publication request.

Do not duplicate workflow policy here. Link to the owning skill or reference instead.
