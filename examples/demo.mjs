// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { analyzeVersions } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const p = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    impact: {
      type: "choice",
      choice: "direct",
      probabilities: {
        direct: 0.88,
        indirect: 0.07,
        none: 0.02,
        unknown: 0.03,
      },
      confidence: 0.88,
    },
  },
  usage: { input_tokens: 110, output_tokens: 0 },
}));
const resultat = await analyzeVersions(
  [
    {
      id: "R1",
      text: "Conserver les justificatifs pendant deux ans.",
      sourceId: "LEGIA",
    },
  ],
  [
    {
      id: "R1",
      text: "Conserver les justificatifs pendant cinq ans.",
      sourceId: "LEGIB",
    },
  ],
  { activity: "place de marché en ligne" },
  p,
);
assert.equal(resultat[0].assessment.impact, "direct");
console.log(JSON.stringify(resultat, null, 2));
