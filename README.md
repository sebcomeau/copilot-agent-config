# Copilot Agent Configuration

User-level configuration for GitHub Copilot custom agents.

## Contents

- [`AGENTS.md`](AGENTS.md): points delegators to the policy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): shared contribution, validation, review, and Git practices.
- [`agents/`](agents/): custom agent definitions.
  - `code-explorer.agent.md`: read-only repository discovery and contract tracing.
  - `code-reviewer.agent.md`: two-axis change and current-tree content review.
  - `code-validator.agent.md`: focused read-only test, build, lint, type-check, parsing, and documentation validation.
  - `commit-pusher.agent.md`: explicit commit-and-push publishing workflow.
  - `implementer.agent.md`: multi-file implementation and unit-test work.
  - `quick-implementer.agent.md`: localized, low-risk changes.
  - `story-planner.agent.md`: plan-only, evidence-based user-story refinement and task decomposition.
  - `story-publisher.agent.md`: manual-only publication of explicitly approved tracker tasks.
- [`skills/`](skills/): repository-owned Agent Skills.
  - [`code-review`](skills/code-review/SKILL.md): Copilot-native two-axis Standards and Spec review.
  - [`user-story-decomposition`](skills/user-story-decomposition/SKILL.md): plan-only story refinement, implementation task decomposition, and exact approval-ready publishing handoffs.

## Configuration Ownership

Each concern has one canonical owner to limit policy drift:

- `AGENTS.md` is the short workspace entry point.
- `CONTRIBUTING.md` owns shared contribution, validation, review, and Git safety practices.
- `agents/*.agent.md` owns each role's boundaries and report contract.
- `skills/*/SKILL.md` owns detailed domain workflows.
- `README.md` provides navigation and concise summaries.

Secondary files should link to the canonical owner instead of repeating procedural mechanics. Critical safety invariants may remain repeated as defense in depth.

## Git Tracking

[`.gitignore`](.gitignore) uses a whitelist. It keeps `.gitignore`, `AGENTS.md`, `CONTRIBUTING.md` and `README.md`, plus all files and subdirectories under `agents/` and `skills/`, visible to Git. Everything outside that whitelist remains ignored, including root-level local settings, logs, caches, command history, and session state.

## Scope

These files are generic and project-aware. Individual repositories remain the source of truth for their own stack, instructions, commands, and architecture.
