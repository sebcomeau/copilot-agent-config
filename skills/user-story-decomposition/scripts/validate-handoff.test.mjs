import assert from "node:assert/strict";
import test from "node:test";
import { hasCycle, validateHandoff } from "./validate-handoff.mjs";

const description = `## Summary\nOutcome.\n\n## Scope\nBounded.\n\n## Acceptance criteria\nObservable.\n\n## Verification\nnode --test.\n`;

function handoff(overrides = {}) {
  return {
    version: 1,
    revision: "R1",
    approval: { approved: true, publishRequested: true, evidence: "approved" },
    tracker: {
      organization: "org",
      project: "project",
      team: "team",
      targetStoryId: 1,
    },
    transportPolicy: "auto",
    metadata: {
      "System.AreaPath": { action: "inherit" },
      "System.State": { action: "tracker-default" },
      "System.Tags": { action: "omit" },
    },
    tasks: [
      {
        key: "T1",
        title: "Task",
        descriptionMarkdown: description,
        dependsOn: [],
      },
    ],
    relations: [{ type: "parent", from: "T1", to: "1" }],
    blockers: "none",
    ...overrides,
  };
}

test("accepts valid handoff", () => {
  assert.deepEqual(validateHandoff(handoff()), []);
});

test("rejects incomplete task description", () => {
  const errors = validateHandoff(
    handoff({
      tasks: [
        {
          key: "T1",
          title: "Task",
          descriptionMarkdown: "## Summary",
          dependsOn: [],
        },
      ],
    }),
  );
  assert.ok(errors.some((error) => error.includes("missing ## Verification")));
});

test("rejects cyclic dependencies", () => {
  const graph = new Map([
    ["T1", ["T2"]],
    ["T2", ["T1"]],
  ]);
  assert.equal(hasCycle(graph), true);
});

test("rejects explicit metadata without value", () => {
  const errors = validateHandoff(
    handoff({ metadata: { Priority: { action: "explicit" } } }),
  );
  assert.ok(errors.some((error) => error.includes("metadata.Priority.value")));
});
