// Cas limite : la structure des versions est comparée de manière déterministe.
import assert from "node:assert/strict";
import { diffSections } from "../src/index.mjs";

const resultat = diffSections(
  [
    { id: "A", text: "Durée : deux ans" },
    { id: "B", text: "Disposition supprimée" },
  ],
  [
    { id: "A", text: "Durée : cinq ans" },
    { id: "C", text: "Nouvelle disposition" },
  ],
);
const types = resultat.map(({ type }) => type).sort();
assert.deepEqual(types, ["added", "modified", "removed"]);
console.log(JSON.stringify({ types, changements: resultat }, null, 2));
