# Copilot Customization

User-level GitHub Copilot agents, skills, instructions, and supporting documentation.

## Contents

- [`AGENTS.md`](AGENTS.md): workspace entry point and Git inspection policy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): shared contribution, validation, review, and Git safety practices.
- [`agents/README.md`](agents/README.md): agent index, role boundaries, and ownership.
- [`skills/README.md`](skills/README.md): skill index, resource ownership, and validation entry points.

Generated benchmark runs and snapshots live under `skills/*-workspace/`; they are local evaluation output rather than configuration source.

## Configuration Ownership

Each concern has one canonical owner:

- [`AGENTS.md`](AGENTS.md) defines workspace-wide instructions.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) defines shared contribution practices.
- [`agents/README.md`](agents/README.md) defines agent navigation and ownership.
- [`skills/README.md`](skills/README.md) defines skill navigation and resource ownership.
- This README provides workspace-wide navigation and scope.

## Git Tracking

[`.gitignore`](.gitignore) uses a whitelist. Git can see `.gitignore`, the three root documentation files, and source files under `agents/` and `skills/`. Root settings, logs, caches, command history, session state, root evaluation harness files, and generated `skills/*-workspace/` directories remain ignored.

## Scope

This configuration is generic and project-aware. Each target repository remains authoritative for its stack, architecture, instructions, implementation boundaries, and validation commands.
