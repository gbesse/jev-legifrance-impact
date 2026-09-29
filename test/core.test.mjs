// Objectif : vérifier les règles déterministes et les décisions sémantiques soumises à revue.
import test from "node:test";
import assert from "node:assert/strict";
import { diffSections, assessImpact } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
test("finds added modified and removed sections", () =>
  assert.deepEqual(
    diffSections(
      [
        { id: "a", text: "1" },
        { id: "b", text: "x" },
      ],
      [
        { id: "a", text: "2" },
        { id: "c", text: "y" },
      ],
    )
      .map((x) => x.type)
      .sort(),
    ["added", "modified", "removed"],
  ));
test("marks unknown for review", async () => {
  const p = createFakeProvider(() => ({
    model: "jev-1.13.0",
    answers: {
      impact: {
        type: "choice",
        choice: "unknown",
        probabilities: { direct: 0.1, indirect: 0.1, none: 0.2, unknown: 0.6 },
        confidence: 0.6,
      },
    },
    usage: { input_tokens: 1, output_tokens: 0 },
  }));
  assert.equal(
    (
      await assessImpact(
        { id: "a", type: "added", after: { text: "x" } },
        {},
        p,
      )
    ).review,
    true,
  );
});
