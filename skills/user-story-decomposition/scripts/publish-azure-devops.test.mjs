import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPlan,
  normalizeTitle,
  topologicalTasks,
} from "./publish-azure-devops.mjs";

const description = `## Summary\nOutcome.\n\n## Scope\nBounded.\n\n## Acceptance criteria\nObservable.\n\n## Verification\nnode --test.\n`;

function handoff(overrides = {}) {
  return {
    version: 1,
    revision: "R2",
    approval: { approved: true, publishRequested: true, evidence: "approved" },
    tracker: {
      organization: "discovered-org",
      project: "discovered-project",
      team: "discovered-team",
      targetStoryId: 42,
    },
    transportPolicy: "cli",
    metadata: {
      "System.AreaPath": { action: "inherit" },
      "System.IterationPath": {
        action: "explicit",
        value: "discovered\\iteration",
      },
      "System.Tags": { action: "omit" },
    },
    tasks: [
      {
        key: "T1",
        title: "First",
        descriptionMarkdown: description,
        dependsOn: [],
      },
      {
        key: "T2",
        title: "Second",
        descriptionMarkdown: description,
        dependsOn: ["T1"],
      },
    ],
    relations: [
      { type: "parent", from: "T1", to: "42" },
      { type: "predecessor", from: "T1", to: "T2" },
    ],
    blockers: "none",
    ...overrides,
  };
}

test("normalizes titles only for matching", () => {
  assert.equal(normalizeTitle("  First   Task "), "first task");
});

test("orders tasks by dependencies", () => {
  const tasks = topologicalTasks([
    { key: "T2", dependsOn: ["T1"] },
    { key: "T1", dependsOn: [] },
  ]);
  assert.deepEqual(
    tasks.map((task) => task.key),
    ["T1", "T2"],
  );
});

test("uses discovered tracker context and plans missing tasks", () => {
  const plan = buildPlan(handoff(), {
    targetStoryId: 42,
    targetStoryFields: { "System.AreaPath": "discovered\\area" },
    children: [],
    relations: [],
  });
  assert.equal(plan.status, "ready");
  assert.deepEqual(plan.tracker, handoff().tracker);
  assert.deepEqual(plan.metadata, {
    "System.AreaPath": "discovered\\area",
    "System.IterationPath": "discovered\\iteration",
  });
  assert.deepEqual(
    plan.taskPlans.map((task) => task.operation),
    ["create", "create"],
  );
});

test("blocks duplicate normalized titles", () => {
  const plan = buildPlan(
    handoff({
      tasks: [handoff().tasks[0]],
      relations: [{ type: "parent", from: "T1", to: "42" }],
    }),
    {
      targetStoryId: 42,
      targetStoryFields: { "System.AreaPath": "area" },
      children: [
        {
          id: 100,
          title: " First ",
          descriptionMarkdown: description,
          fields: {},
        },
        {
          id: 101,
          title: "first",
          descriptionMarkdown: description,
          fields: {},
        },
      ],
      relations: [],
    },
  );
  assert.equal(plan.status, "blocked");
  assert.equal(plan.taskPlans[0].operation, "conflict");
});
