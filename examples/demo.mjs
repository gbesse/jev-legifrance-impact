// Purpose: Demonstrate legal-version impact screening offline.
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
console.log(
  await analyzeVersions(
    [{ id: "R1", text: "Keep records for two years.", sourceId: "LEGIA" }],
    [{ id: "R1", text: "Keep records for five years.", sourceId: "LEGIB" }],
    { activity: "online marketplace" },
    p,
  ),
);
