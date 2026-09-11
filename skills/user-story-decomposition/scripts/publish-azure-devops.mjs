#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validateHandoff } from "./validate-handoff.mjs";

const MODES = new Set(["validate", "dry-run"]);
const OMITTED_ACTIONS = new Set(["omit", "tracker-default"]);

function usage() {
  return "Usage: node publish-azure-devops.mjs --mode <validate|dry-run> --handoff <path> [--state <path>]";
}

function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function topologicalTasks(tasks) {
  const remaining = new Map(tasks.map((task) => [task.key, task]));
  const ordered = [];
  while (remaining.size > 0) {
    const ready = [...remaining.values()].filter((task) =>
      task.dependsOn.every((dependency) =>
        ordered.some((completed) => completed.key === dependency),
      ),
    );
    if (ready.length === 0) return tasks;
    for (const task of ready) {
      ordered.push(task);
      remaining.delete(task.key);
    }
  }
  return ordered;
}

function effectiveMetadata(handoff, state) {
  const result = {};
  for (const [field, rule] of Object.entries(handoff.metadata)) {
    if (OMITTED_ACTIONS.has(rule.action)) continue;
    if (rule.action === "explicit") result[field] = rule.value;
    if (rule.action === "inherit") {
      if (!(field in (state.targetStoryFields ?? {}))) {
        throw new Error(
          `Missing target-story value for inherited field ${field}`,
        );
      }
      result[field] = state.targetStoryFields[field];
    }
  }
  return result;
}

function matchesExactly(task, current, metadata) {
  if (task.title !== current.title) return false;
  if (task.descriptionMarkdown !== current.descriptionMarkdown) return false;
  if ((current.descriptionFormat ?? "Markdown") !== "Markdown") return false;
  return Object.entries(metadata).every(
    ([field, value]) => current.fields?.[field] === value,
  );
}

function buildPlan(handoff, state) {
  const validationErrors = validateHandoff(handoff);
  if (validationErrors.length > 0) {
    return { status: "blocked", errors: validationErrors };
  }
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return {
      status: "blocked",
      errors: ["state: expected tracker state JSON object"],
    };
  }
  if (state.targetStoryId !== handoff.tracker.targetStoryId) {
    return {
      status: "blocked",
      errors: [
        "state.targetStoryId does not match handoff tracker.targetStoryId",
      ],
    };
  }

  let metadata;
  try {
    metadata = effectiveMetadata(handoff, state);
  } catch (error) {
    return { status: "blocked", errors: [error.message] };
  }

  const children = Array.isArray(state.children) ? state.children : [];
  const byTitle = new Map();
  for (const child of children) {
    const key = normalizeTitle(child.title ?? "");
    const matches = byTitle.get(key) ?? [];
    matches.push(child);
    byTitle.set(key, matches);
  }

  const taskIds = new Map();
  const taskPlans = [];
  for (const task of topologicalTasks(handoff.tasks)) {
    const matches = byTitle.get(normalizeTitle(task.title)) ?? [];
    if (matches.length > 1) {
      taskPlans.push({
        key: task.key,
        operation: "conflict",
        reason: "duplicate normalized title",
        ids: matches.map((child) => child.id),
      });
      continue;
    }
    const current = matches[0];
    if (!current) {
      taskPlans.push({
        key: task.key,
        operation: "create",
        title: task.title,
        dependsOn: task.dependsOn,
      });
      continue;
    }
    taskIds.set(task.key, current.id);
    const exact = matchesExactly(
      task,
      { ...current, fields: current.fields },
      metadata,
    );
    taskPlans.push({
      key: task.key,
      operation: exact ? "reuse" : "conflict",
      id: current.id,
      title: task.title,
      ...(exact
        ? {}
        : { reason: "existing work item differs from approved handoff" }),
    });
  }

  const relationPlans = handoff.relations
    .filter((relation) => relation.type === "predecessor")
    .map((relation) => {
      const fromId = taskIds.get(relation.from);
      const toId = taskIds.get(relation.to);
      const present = (state.relations ?? []).some(
        (current) =>
          current.type === "predecessor" &&
          current.from === fromId &&
          current.to === toId,
      );
      return {
        type: relation.type,
        from: relation.from,
        to: relation.to,
        operation: present ? "reuse" : "add",
        ...(fromId ? { fromId } : {}),
        ...(toId ? { toId } : {}),
      };
    });

  const conflicts = taskPlans.filter((task) => task.operation === "conflict");
  return {
    status: conflicts.length > 0 ? "blocked" : "ready",
    revision: handoff.revision,
    tracker: handoff.tracker,
    transportPolicy: handoff.transportPolicy ?? "auto",
    metadata,
    taskPlans,
    relationPlans,
    nextAction:
      conflicts.length > 0
        ? "Resolve conflicts before any mutation"
        : "Review plan, then implement a separately validated CLI mutation adapter",
  };
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value.startsWith("--"))
      options[value.slice(2)] = argv[index + 1] ?? true;
  }
  return options;
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (!MODES.has(options.mode) || !options.handoff) {
    console.error(usage());
    return 2;
  }

  let handoff;
  try {
    handoff = await readJson(options.handoff);
  } catch (error) {
    console.error(`Cannot read handoff: ${error.message}`);
    return 2;
  }

  const validationErrors = validateHandoff(handoff);
  if (options.mode === "validate") {
    console.log(
      JSON.stringify(
        validationErrors.length
          ? { valid: false, errors: validationErrors }
          : { valid: true, revision: handoff.revision },
        null,
        2,
      ),
    );
    return validationErrors.length > 0 ? 1 : 0;
  }
  if (!options.state) {
    console.error("State file required for dry-run");
    return 2;
  }

  let state;
  try {
    state = await readJson(options.state);
  } catch (error) {
    console.error(`Cannot read state: ${error.message}`);
    return 2;
  }
  const plan = buildPlan(handoff, state);
  console.log(JSON.stringify(plan, null, 2));
  return plan.status === "ready" ? 0 : 1;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  process.exitCode = await main();
}

export { buildPlan, normalizeTitle, topologicalTasks };
