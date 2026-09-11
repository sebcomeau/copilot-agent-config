# Copilot Story Planning Configuration

User-level GitHub Copilot customization for evidence-based user-story decomposition and controlled Azure DevOps task publication.

## Active Workflow

1. The **story planner** reads tracker, repository, contract, test, and design evidence without changing product code or tracker data.
2. The planner moves through eight gates: frame, discover, reconcile, decide, decompose, validate, approve, and hand off.
3. A plan becomes publishable only after the user explicitly approves its latest revision and explicitly requests publication.
4. The user manually selects the **story publisher**, which validates the canonical handoff before creating or reusing Azure DevOps child tasks.
5. The publisher applies the approved metadata and relations, recovers idempotently from partial attempts, and reads back the result before reporting completion.

The planner cannot invoke the publisher automatically. Any changed scope, task content, metadata, relation, or blocker creates a new plan revision that requires fresh approval.

## Contents

- [`AGENTS.md`](AGENTS.md): workspace entry point and Git inspection policy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): shared contribution, validation, review, and Git safety practices.
- [`agents/story-planner.agent.md`](agents/story-planner.agent.md): plan-only story refinement and approval-ready handoff generation.
- [`agents/story-publisher.agent.md`](agents/story-publisher.agent.md): manually invoked Azure DevOps publisher for an exact approved handoff.
- [`skills/user-story-decomposition/SKILL.md`](skills/user-story-decomposition/SKILL.md): canonical eight-gate planning contract, task format, metadata defaults, revision approval, and handoff schema.
- [`skills/user-story-decomposition/PUBLISHING.md`](skills/user-story-decomposition/PUBLISHING.md): publisher-only transport, preflight, mutation, recovery, and read-back workflow.
- [`skills/user-story-decomposition/evals/evals.json`](skills/user-story-decomposition/evals/evals.json): behavioral scenarios covering planning boundaries, evidence gaps, metadata, approval, transport errors, and recovery.
- [`evals/user-story-decomposition/eval.yaml`](evals/user-story-decomposition/eval.yaml): local trigger and anti-trigger evaluation configuration.

Generated benchmark runs and snapshots live under `skills/user-story-decomposition-workspace/`; they are local evaluation output rather than configuration source.

## Safety Boundaries

- Planning remains read-only and does not modify product repositories or trackers.
- Publication accepts only the planner's complete canonical handoff with no unresolved blockers.
- Azure DevOps reads prefer an authenticated MCP integration, with read-only CLI fallback when needed.
- Publication chooses transport by capability and never switches transport to bypass a tracker rejection.
- Existing children are classified as reuse, create, repair, or conflict to prevent duplicate work items.
- Credentials are never requested, printed, or persisted.

## Configuration Ownership

Each concern has one canonical owner:

- [`AGENTS.md`](AGENTS.md) defines workspace-wide instructions.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) defines shared contribution practices.
- Files under [`agents/`](agents/) define role boundaries and completion contracts.
- [`SKILL.md`](skills/user-story-decomposition/SKILL.md) owns planning behavior.
- [`PUBLISHING.md`](skills/user-story-decomposition/PUBLISHING.md) owns tracker publication behavior.
- This README provides navigation and a concise description of the deployed workflow.

## Git Tracking

[`.gitignore`](.gitignore) uses a whitelist. Git can see `.gitignore`, the three root documentation files, and source files under `agents/` and `skills/`. Root settings, logs, caches, command history, session state, root evaluation harness files, and generated `skills/*-workspace/` directories remain ignored.

## Scope

This configuration is generic and project-aware. Each target repository remains authoritative for its stack, architecture, instructions, implementation boundaries, and validation commands.
