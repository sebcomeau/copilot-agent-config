#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const REQUIRED_SECTIONS = [
  "## Summary",
  "## Scope",
  "## Acceptance criteria",
  "## Verification",
];
const ACTIONS = new Set(["inherit", "explicit", "tracker-default", "omit"]);
const MODES = new Set(["validate"]);

function usage() {
  return "Usage: node validate-handoff.mjs <handoff.json> [--mode validate]";
}

function addError(errors, path, message) {
  errors.push(`${path}: ${message}`);
}

function validateHandoff(handoff) {
  const errors = [];
  if (!handoff || typeof handoff !== "object" || Array.isArray(handoff)) {
    return ["handoff: expected JSON object"];
  }

  if (handoff.version !== 1) addError(errors, "version", "must be 1");
  if (!/^R[1-9][0-9]*$/.test(handoff.revision ?? ""))
    addError(errors, "revision", "must match R<number>");
  if (handoff.approval?.approved !== true)
    addError(errors, "approval.approved", "must be true");
  if (handoff.approval?.publishRequested !== true)
    addError(errors, "approval.publishRequested", "must be true");
  if (
    typeof handoff.approval?.evidence !== "string" ||
    handoff.approval.evidence.trim() === ""
  ) {
    addError(errors, "approval.evidence", "must be non-empty");
  }

  for (const field of ["organization", "project", "team"]) {
    if (
      typeof handoff.tracker?.[field] !== "string" ||
      handoff.tracker[field].trim() === ""
    ) {
      addError(errors, `tracker.${field}`, "must be non-empty");
    }
  }
  if (
    !Number.isInteger(handoff.tracker?.targetStoryId) ||
    handoff.tracker.targetStoryId < 1
  ) {
    addError(errors, "tracker.targetStoryId", "must be positive integer");
  }
  if (
    handoff.transportPolicy !== undefined &&
    !["auto", "mcp", "cli"].includes(handoff.transportPolicy)
  ) {
    addError(errors, "transportPolicy", "must be auto, mcp, or cli");
  }

  if (
    !handoff.metadata ||
    typeof handoff.metadata !== "object" ||
    Array.isArray(handoff.metadata)
  ) {
    addError(errors, "metadata", "must be non-empty object");
  } else {
    for (const [field, rule] of Object.entries(handoff.metadata)) {
      if (!rule || typeof rule !== "object" || !ACTIONS.has(rule.action)) {
        addError(errors, `metadata.${field}`, "must have an approved action");
      } else if (rule.action === "explicit" && !Object.hasOwn(rule, "value")) {
        addError(
          errors,
          `metadata.${field}.value`,
          "required for explicit action",
        );
      }
    }
  }

  const tasks = Array.isArray(handoff.tasks) ? handoff.tasks : [];
  if (tasks.length === 0)
    addError(errors, "tasks", "must contain at least one task");
  const taskKeys = new Set();
  for (const [index, task] of tasks.entries()) {
    const path = `tasks[${index}]`;
    if (!/^T[1-9][0-9]*$/.test(task?.key ?? ""))
      addError(errors, `${path}.key`, "must match T<number>");
    if (taskKeys.has(task?.key))
      addError(errors, `${path}.key`, "duplicate task key");
    taskKeys.add(task?.key);
    if (typeof task?.title !== "string" || task.title.trim() === "")
      addError(errors, `${path}.title`, "must be non-empty");
    if (
      typeof task?.descriptionMarkdown !== "string" ||
      task.descriptionMarkdown.trim() === ""
    ) {
      addError(errors, `${path}.descriptionMarkdown`, "must be non-empty");
    } else {
      for (const section of REQUIRED_SECTIONS) {
        if (!task.descriptionMarkdown.includes(section))
          addError(errors, `${path}.descriptionMarkdown`, `missing ${section}`);
      }
    }
    if (!Array.isArray(task?.dependsOn))
      addError(errors, `${path}.dependsOn`, "must be array");
    for (const dependency of task?.dependsOn ?? []) {
      if (dependency === task.key)
        addError(errors, `${path}.dependsOn`, "cannot depend on itself");
      if (typeof dependency !== "string")
        addError(errors, `${path}.dependsOn`, "dependency key must be string");
    }
  }

  const graph = new Map(tasks.map((task) => [task.key, task.dependsOn ?? []]));
  for (const [key, dependencies] of graph) {
    for (const dependency of dependencies) {
      if (!graph.has(dependency))
        addError(
          errors,
          `tasks.${key}.dependsOn`,
          `unknown task ${dependency}`,
        );
    }
  }
  if (hasCycle(graph))
    addError(errors, "tasks", "dependency graph must be acyclic");

  if (!Array.isArray(handoff.relations))
    addError(errors, "relations", "must be array");
  else {
    for (const [index, relation] of handoff.relations.entries()) {
      if (!["parent", "predecessor"].includes(relation?.type))
        addError(
          errors,
          `relations[${index}].type`,
          "must be parent or predecessor",
        );
      if (typeof relation?.from !== "string" || relation.from.trim() === "")
        addError(errors, `relations[${index}].from`, "must be non-empty");
      if (typeof relation?.to !== "string" || relation.to.trim() === "")
        addError(errors, `relations[${index}].to`, "must be non-empty");
      if (
        relation?.type === "predecessor" &&
        (!graph.has(relation.from) || !graph.has(relation.to))
      ) {
        addError(
          errors,
          `relations[${index}]`,
          "predecessor endpoints must be task keys",
        );
      }
    }
  }
  if (handoff.blockers !== "none") addError(errors, "blockers", "must be none");

  return errors;
}

function hasCycle(graph) {
  const visiting = new Set();
  const visited = new Set();
  function visit(node) {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const dependency of graph.get(node) ?? []) {
      if (graph.has(dependency) && visit(dependency)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }
  return [...graph.keys()].some(visit);
}

async function main(argv = process.argv.slice(2)) {
  const [handoffPath, mode = "validate"] = argv;
  if (!handoffPath || !MODES.has(mode)) {
    console.error(usage());
    return 2;
  }
  let handoff;
  try {
    handoff = JSON.parse(await readFile(handoffPath, "utf8"));
  } catch (error) {
    console.error(`Cannot read handoff: ${error.message}`);
    return 2;
  }
  const errors = validateHandoff(handoff);
  if (errors.length > 0) {
    console.error(JSON.stringify({ valid: false, errors }, null, 2));
    return 1;
  }
  console.log(
    JSON.stringify(
      {
        valid: true,
        revision: handoff.revision,
        taskCount: handoff.tasks.length,
      },
      null,
      2,
    ),
  );
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  process.exitCode = await main();
}

export { hasCycle, validateHandoff };
