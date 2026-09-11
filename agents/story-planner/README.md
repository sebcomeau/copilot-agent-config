# Story Planner

Plan-only agent for refining one user story into evidence-based child tasks.

## Use For

- tracker, repository, contract, test, and design evidence review;
- blocker and conflict reconciliation;
- stable task keys and dependency DAGs;
- metadata decisions and approval-ready planning;
- canonical publishing-handoff preparation.

## Boundaries

- Reads evidence; does not mutate product code or tracker data.
- Requires explicit latest-revision approval before handoff.
- Requires explicit publication request before handoff.
- Never invokes `story-publisher` automatically.

## Source Of Truth

- Agent mechanics: [`../story-planner.agent.md`](../story-planner.agent.md)
- Planning workflow: [`../../skills/user-story-decomposition/SKILL.md`](../../skills/user-story-decomposition/SKILL.md)
- Publication workflow: [`../../skills/user-story-decomposition/PUBLISHING.md`](../../skills/user-story-decomposition/PUBLISHING.md)
