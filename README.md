# Copilot Agent Configuration

User-level configuration for GitHub Copilot custom agents and subagent routing.

## Contents

- [`AGENTS.md`](AGENTS.md): points delegators to the routing policy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): shared contribution, validation, review, and Git practices.
- [`SUBAGENT_ROUTING.md`](SUBAGENT_ROUTING.md): project-aware discovery, delegation, ownership, handoff, and validation rules.
- [`agents/`](agents/): custom agent definitions.
  - `code-explorer.agent.md`: read-only repository discovery and contract tracing.
  - `code-reviewer.agent.md`: two-axis change and current-tree content review.
  - `code-validator.agent.md`: focused read-only test, build, lint, type-check, parsing, and documentation validation.
  - `commit-pusher.agent.md`: explicit commit-and-push publishing workflow.
  - `implementer.agent.md`: multi-file implementation and unit-test work.
  - `quick-implementer.agent.md`: localized, low-risk changes.
  - `story-planner.agent.md`: evidence-based user-story refinement and approval-gated task publishing.
- [`skills/`](skills/): repository-owned Agent Skills.
  - [`code-review`](skills/code-review/SKILL.md): Copilot-native two-axis Standards and Spec review.
  - [`user-story-decomposition`](skills/user-story-decomposition/SKILL.md): plan-first story refinement, implementation task decomposition, and approval-gated tracker publishing.

## Configuration Ownership

Each concern has one canonical owner to limit policy drift:

- `AGENTS.md` is the short workspace entry point.
- `CONTRIBUTING.md` owns shared contribution, validation, review, and Git safety practices.
- `SUBAGENT_ROUTING.md` owns agent selection, orchestration, and delegated handoff requirements.
- `agents/*.agent.md` owns each role's boundaries and report contract.
- `skills/*/SKILL.md` owns detailed domain workflows.
- `README.md` provides navigation and concise summaries.

Secondary files should link to the canonical owner instead of repeating procedural mechanics. Critical safety invariants may remain repeated as defense in depth.

## Routing Principles

Agents should:

1. Discover the repository root, target module, governing instructions, and project stack.
2. Follow project-defined tools, commands, architecture, and conventions.
3. Delegate bounded work with explicit ownership, exclusions, success criteria, and validation scope.
4. Preserve unrelated user and agent changes in the shared workspace.
5. Use focused validation for affected files or selectors.

Behavioral verification is normally delegated to `code-validator` after implementation. The `code-reviewer` modes are defined by the repository-owned [`code-review` skill](skills/code-review/SKILL.md): branch, PR, and history reviews require an explicit fixed point; explicitly requested current or staged reviews may use `HEAD`; named-path content reviews do not claim a Git change set. `commit-pusher` requires an explicit request to both commit and push.

## `code-review` Skill

The `code-reviewer` agent uses the repository-owned skill at [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md). Because this repository is the user-level `.copilot` directory, the skill is available globally across projects when this folder is used as `~/.copilot`.

## `story-planner` Agent and `user-story-decomposition` Skill

The `story-planner` agent uses the repository-owned [`user-story-decomposition`](skills/user-story-decomposition/SKILL.md) skill to ground tracker stories in repository and supporting-artifact evidence, build dependency-aware task plans, and publish approved child tasks with read-back validation. Planning is the default; tracker mutation requires explicit user approval.

## Git Tracking

[`.gitignore`](.gitignore) uses a whitelist. It keeps `.gitignore`, `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, and `SUBAGENT_ROUTING.md`, plus all files and subdirectories under `agents/` and `skills/`, visible to Git. Everything outside that whitelist remains ignored, including root-level local settings, logs, caches, command history, and session state.

## Scope

These files are generic and project-aware. Individual repositories remain the source of truth for their own stack, instructions, commands, and architecture.
