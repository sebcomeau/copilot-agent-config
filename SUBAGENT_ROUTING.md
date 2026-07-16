# Subagent Routing

## Project-Aware Routing

Established project configuration, stack, instructions, and guidelines are source of truth. Every task starts with project discovery. Before delegating implementation:

- Identify repository root and target project or module.
- Read applicable local guidance first: `AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`, `CONTRIBUTING.md`, `README.md`, `.github/` instructions, and scoped instruction files.
- Inspect project manifests and build configuration to determine runtime, language, framework, package manager, compiler, formatter, linter, test runner, and supported versions. Examples: `package.json`, workspace files, `pom.xml`, `build.gradle`, `pyproject.toml`, `go.mod`, solution files, container definitions, and CI configuration.
- If repository root, target scope, or governing guidance remains unclear, delegate a read-only explorer to resolve it before implementation delegation.
- Use established project commands and tools. Do not introduce competing tooling without explicit need.
- Preserve established architecture, module boundaries, naming, dependency direction, API contracts, generated-file policy, and documentation conventions.
- Scope discovery and ownership to affected application, package, service, or module. Cross language, service, or infrastructure boundaries only when task requires it.
- Respect project restrictions for infrastructure, deployment, generated, vendor, and migration directories. Do not access restricted paths without explicit user scope or governing instructions.
- Run narrowest established validation for affected stack: build, lint, format, type-check, unit, integration, or end-to-end tests.
- For cross-stack or shared-contract changes, state ownership and validate every affected side with its established commands and tests.
- Resolve instruction conflicts by specificity: target-path guidance, nearest project guidance, repository guidance, then these rules. Escalate true contradictions.
- Include the discovered stack, governing guidance, owned paths, and validation commands in the delegated handoff below.

Optimize monetary cost above latency. Delegate when work requires multi-file discovery, behavior changes, diagnosis, tests, review, validation, or publishing; handle directly only a known-line mechanical edit, one short command, or a factual response. Use `quick-implementer` for localized one- or two-file changes that need implementation or a focused check.

At task start, delegate qualifying workstreams or record why delegation is not worthwhile. Reassess after major checkpoints. Delegate bounded workstreams with explicit, non-overlapping ownership.

Keep tightly coupled experiment-selection loops in parent; delegate execution or result analysis when independently separable. Do not delegate overall objective without a bounded slice, success criteria, and validation scope.

Execute directly only for truly trivial operations where agent startup would exceed the work: a single known-line edit, one short command, or a factual response. Do not delegate trivial conversation. The parent may run ordinary commands needed for routing, integration, or concise final verification, but should delegate repository execution rather than handling substantial discovery, implementation, conflict resolution, or review itself. A slow command alone is not a reason to delegate runner work; use an execution agent when diagnosis, output analysis, or independent parallel execution is substantial.

When delegation is justified:

- Prefer one subagent per task. Add more only for non-overlapping work that materially saves time; never fill concurrency slots automatically.
- For broad exploration with multiple independent discovery questions, run `code-explorer` agents in parallel. Give each explorer a distinct concern or repository boundary and require non-overlapping, decision-ready reports. Prefer two explorers; add more only when the workstreams are clearly independent. Keep exploration sequential when one finding determines the next investigation or when agents would search substantially the same files.
- Reuse agents, completed discovery, and cited evidence for related follow-ups.
- Give task-local prompts using the delegated handoff below. Require decision-ready reports with evidence locations, risks, and next action; exclude narration and raw dumps.
- For parallel implementation, assign explicit, non-overlapping file or module ownership in every subagent prompt.
- Trust cited findings unless verification is necessary. For weak or failed results, retry with a narrower task before switching roles or repeating discovery.
- Detach behavioral verification from `implementer` by default. After implementation and cheap structural checks, keep the original implementer available and delegate focused test, build, lint, or type-check scopes to `code-validator`. Build a complete affected-test manifest from every added or changed test file plus directly affected existing tests. Every validator prompt must state the exact targeted command, assigned manifest entries, scope, and concurrency plan. Run all manifest entries with test-file, test-class, package, or equivalent selectors instead of substituting a whole-suite command; for example, use Gradle `test --tests ...` selectors. Prefer one validator using up to three test-runner workers when supported and concurrency-safe. Otherwise partition the complete manifest across up to three `code-validator` agents with distinct, non-overlapping shards; each shard may contain multiple test selectors. Three limits concurrent workers or agents, not the number of affected tests that must run. Do not parallelize commands that share mutable databases, fixtures, snapshots, generated files, ports, caches, or coverage outputs unless those resources are isolated.
- When every affected unit-test manifest entry passes, do not rerun the global unit-test suite by default. Treat integration and end-to-end validation as separate scopes only when explicitly required by the task or a later routing policy. The parent classifies validator failures before requesting repairs. For likely implementation failures, re-invoke `implementer` with the original handoff, validator evidence, same file ownership, and affected validation scope; then send the affected checks back to a validator. Prefer no more than two repair cycles before escalating unresolved, flaky, environmental, or contract-level failures.
- For a truly trivial change with one fast and obvious check, `quick-implementer` may validate directly instead of spawning a validator.
- Use `code-reviewer` only when caller supplies a valid fixed Git reference. Reviewer must inspect changes since that reference and report Standards and Spec separately; no fixed reference means no review delegation.
- Use `commit-pusher` only when caller explicitly requests both commit and push. It must verify branch, upstream, status, and scoped diff before staging anything.

Select custom agents by their exact `name` from `~/.copilot/agents`:

- Broad repository discovery, contract or data-flow tracing -> `code-explorer`
- Mechanical one- or two-file change -> `quick-implementer`
- Multi-file behavior change, debugging, or substantial tests -> `implementer`
- Focused read-only test, build, lint, or type-check execution -> `code-validator`
- Independent review only for high-risk, security-sensitive, architectural, public-API, migration, concurrency, or difficult-to-validate changes -> `code-reviewer`
- Commit and push, only when the user explicitly requests both -> `commit-pusher`

### Delegated Handoff

All delegated agents share the workspace. Preserve unrelated user and agent changes, and do not assume exclusive ownership outside the assigned paths.

Every handoff states:

- Goal and observable success criteria
- Repository root, target paths, and explicit excluded paths
- Governing project instructions and discovered stack
- Agent role and file or module ownership
- Existing user changes to preserve
- Exact command or test selectors for validation
- Required report format and unresolved questions

Do not use a fixed command-count threshold for exploration. Use `code-explorer` only when discovery is expected to cross several files, require meaningful tracing, or add substantial raw evidence to the parent context. Do not use it to reread known files.

Use the cheapest role and reasoning effort that can reliably complete the work. Do not substitute built-in generic agents when the matching custom agent is available. Avoid parallel write-heavy delegation.
