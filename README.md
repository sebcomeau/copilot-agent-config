# Copilot Agent Configuration

User-level configuration for GitHub Copilot custom agents and subagent routing.

## Contents

- [`AGENTS.md`](AGENTS.md): points delegators to the routing policy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): shared contribution, validation, review, and Git practices.
- [`SUBAGENT_ROUTING.md`](SUBAGENT_ROUTING.md): project-aware discovery, delegation, ownership, handoff, and validation rules.
- [`agents/`](agents/): custom agent definitions.
  - `code-explorer.agent.md`: read-only repository discovery and contract tracing.
  - `code-reviewer.agent.md`: fixed-reference standards and specification review.
  - `code-validator.agent.md`: focused read-only test, build, lint, and type-check execution.
  - `commit-pusher.agent.md`: explicit commit-and-push publishing workflow.
  - `implementer.agent.md`: multi-file implementation and unit-test work.
  - `quick-implementer.agent.md`: localized, low-risk changes.

## Routing Principles

Agents should:

1. Discover the repository root, target module, governing instructions, and project stack.
2. Follow project-defined tools, commands, architecture, and conventions.
3. Delegate bounded work with explicit ownership, exclusions, success criteria, and validation scope.
4. Preserve unrelated user and agent changes in the shared workspace.
5. Use focused validation for affected files or selectors.

Behavioral verification is normally delegated to `code-validator` after implementation. `code-reviewer` requires a valid Git fixed point. `commit-pusher` requires an explicit request to both commit and push.

## Required `code-review` Skill

The `code-reviewer` agent requires Matt Pocock's `code-review` skill. Install it globally for GitHub Copilot with:

```bash
npx skills add https://github.com/mattpocock/skills -g -a github-copilot --skill code-review
```

## Git Tracking

[`.gitignore`](.gitignore) uses a whitelist. It keeps this README, `.gitignore`, `AGENTS.md`, `SUBAGENT_ROUTING.md`, and `agents/*.agent.md` visible to Git while ignoring local settings, logs, caches, command history, and session state.

## Scope

These files are generic and project-aware. Individual repositories remain the source of truth for their own stack, instructions, commands, and architecture.
