# Contributing Best Practices

This guide defines contribution best practices for software projects where humans and AI agents work together. It covers scope, ownership, discovery, validation, review, and Git safety. Project-specific instructions, architecture, commands, and conventions remain authoritative.

## Scope and focus

Keep each pull request tightly scoped. Each pull request should make one coherent change that can be reviewed, validated, and reverted independently.

A focused change might fix one bug, add one feature, update one agent contract, or clarify one workflow. Fixing a directly related documentation error is fine, but unrelated cleanup should be proposed separately.

For example:

- Good: clarify one component's input contract and update its focused tests.
- Too broad: rewrite several agent prompts, change Git tracking policy, and reorganize session logs in one pull request.

If work grows beyond its original concern, split it into separate changes or surface the scope decision to the human contributor.

## Understand before changing

Before editing, establish enough context to make the change safely:

1. Identify the repository root and the paths you intend to change.
2. Read applicable guidance: `AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`, `CONTRIBUTING.md`, `README.md`, `.github/` instructions, and scoped instruction files.
3. Inspect project manifests and build configuration before assuming a language, package manager, formatter, linter, or test command.
4. If no manifests or build configuration exist, record that result and rely on repository guidance, available tests, and documented validation commands. Do not invent a stack or commands.
5. Trace relevant callers, consumers, tests, and contracts before changing behavior.
6. State owned paths, explicit exclusions, success criteria, existing changes to preserve, and validation scope.

Do not guess when project context is unclear. Ask the human contributor or delegate bounded read-only discovery.

## Ownership and collaboration

Every task needs clear ownership. A handoff should identify the goal, repository root, owned paths, exclusions, governing instructions, existing edits to preserve, success criteria, validation command or selectors, and required report format.

Humans remain responsible for intent, prioritization, access, secrets, and irreversible decisions. Agents may inspect, implement, validate, review, or publish only within assigned boundaries. Preserve unrelated work in the shared workspace and surface conflicts instead of overwriting it.

## Code and documentation quality

- Always follow established project patterns when they exist; use these general practices only where the project is silent.
- Follow existing architecture, naming, dependency direction, APIs, and documentation conventions.
- Make the smallest change that satisfies the requested behavior.
- Avoid unrelated refactors, speculative improvements, and competing tooling.
- Keep comments and documentation focused on decisions, constraints, and non-obvious behavior.
- Never add credentials, secrets, or sensitive data.

## Testing and validation

Use project-established checks and the narrowest useful scope:

- Run formatting, parsing, compilation, lint, type-check, unit, integration, or end-to-end checks appropriate to the changed surface.
- Prefer focused test files, classes, packages, or selectors over whole-suite commands.
- Separate implementation checks from independent behavioral validation when the agent workflow supports it.
- Report exact commands, selectors, results, skipped checks, blocked checks, and likely failure classification.
- Do not call partial or blocked validation green.

Projects without test tooling may use simpler checks such as rendering documentation, checking local links, reviewing changed contracts, or manually verifying the affected workflow. Do not add test infrastructure solely to validate a documentation-only change.

## Working with AI agents

AI agents follow the same contribution standards as human contributors: understand context, stay within assigned scope, preserve unrelated work, validate claims, and surface uncertainty.

Use project-specific agent instructions for role definitions, delegation, handoffs, and validation details. When no such instructions exist, give agents explicit ownership, exclusions, success criteria, and validation expectations before work begins.

Agents must not invent requirements, claim checks that did not run, approve their own work as reviewed, or perform irreversible actions without human authorization.

## Review

Review changes against project requirements and local standards. Reviewers should identify concrete risks, behavioral regressions, missing tests, scope problems, and unsupported claims. Treat missing specification or validation evidence as a gap, not as permission to invent assumptions.

## Git and pull request safety

Preserve unrelated user and agent changes in the shared workspace. Before publishing:

- Stage explicit in-scope paths only; never use `git add .` or `git add -A` when unrelated changes may exist.
- Never commit secrets, `.env` files, credentials, caches, logs, or generated sensitive data.
- Do not reset, clean, amend, rebase, delete branches, force-push, or bypass hooks unless the user explicitly requests that exact operation.
- Do not commit or push unless the user explicitly requests both operations.
- Require completed focused validation and, when applicable, a completed review before publishing.
- Inspect the staged diff before creating a commit and verify that it matches the approved scope.

Use concise Conventional Commit messages. Examples:

```text
fix(auth): reject expired refresh tokens
docs: clarify subagent validation routing
```

For dependency updates, use `chore` with an optional scope. Copy each changed dependency's version specification verbatim from its source manifest, including prefixes and ranges, and format each body entry as `<dependency>: <old-version-spec> → <new-version-spec>`.

Node.js without a scope:

```text
chore: bump Node.js dependencies

- lodash: ^4.17.20 → ^4.17.21
- typescript: ~5.4.4 → ~5.4.5
```

Java with a Maven scope:

```text
chore(maven): bump Java dependencies

- org.springframework.boot:spring-boot-dependencies: 3.2.4 → 3.2.5
- org.junit.jupiter:junit-jupiter: 5.10.1 → 5.10.2
```

.NET with a NuGet scope:

```text
chore(nuget): bump .NET dependencies

- Microsoft.NET.Test.Sdk: 17.9.0 → 17.10.0
- Microsoft.Extensions.Hosting: 8.0.0 → 8.0.1
```

## PR expectations

Use a clear, single-sentence title describing the one change, prefixed with a [Conventional Commits](https://www.conventionalcommits.org/) type such as `feat:`, `fix:`, `docs:`, or `chore:`. For example: `feat: add Fireworks to the model provider list`.

The pull request should briefly explain:

- **What and why:** what the change does and the reason for it.
- **How it was tested:** which unit, integration, or end-to-end checks verify the change and protect existing behavior. Note any tests that were added or updated.
- Which files or agent boundaries are affected.
- The issue, request, or other context for non-trivial changes.

## Local guidance

When working in this workspace, use these files:

- [`AGENTS.md`](AGENTS.md)
- [`README.md`](README.md)
- [`agents/`](agents/)
- [`skills/`](skills/)
