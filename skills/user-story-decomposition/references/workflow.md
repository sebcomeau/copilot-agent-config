# Story Planning Workflow

High-level flow for this skill. Normative instructions live in [`../SKILL.md`](../SKILL.md); publication details live in [`../PUBLISHING.md`](../PUBLISHING.md).

1. **Frame**: identify story, tracker context, repository scope, boundaries, exclusions, and existing children.
2. **Discover**: inspect owning code, contracts, tests, configuration, and linked artifacts.
3. **Reconcile**: compare evidence, surface conflicts, and record unresolved material decisions as blockers.
4. **Decide**: confirm behavior, ownership, sequencing, dependencies, risk, and child-task metadata.
5. **Decompose**: create stable-key tasks with bounded outcomes, ownership, verification, and typed dependencies.
6. **Validate**: map requirements, check task independence, verify dependency direction, and confirm an acyclic DAG.
7. **Approve revision**: present the exact revision; require explicit approval and an explicit publication request.
8. **Hand off**: provide the canonical approved handoff. No tracker mutation occurs during planning.

## Safety

- Planning remains read-only.
- Missing evidence blocks final approval but still permits clearly labeled provisional planning.
- Organization, project, team, and story context come from planning evidence.
- Transport follows explicit environment policy; tracker errors never justify transport switching.
- Publication belongs to the manually selected publisher.
