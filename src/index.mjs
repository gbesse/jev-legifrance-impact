// Objectif : implémenter la frontière de décision métier propre au dépôt.
export function diffSections(before = [], after = []) {
  const a = new Map(before.map((x) => [x.id, x])),
    b = new Map(after.map((x) => [x.id, x])),
    changes = [];
  for (const [id, next] of b) {
    const prev = a.get(id);
    if (!prev) changes.push({ id, type: "added", before: null, after: next });
    else if (prev.text !== next.text)
      changes.push({ id, type: "modified", before: prev, after: next });
  }
  for (const [id, prev] of a)
    if (!b.has(id))
      changes.push({ id, type: "removed", before: prev, after: null });
  return changes;
}
export async function assessImpact(change, profile, provider, options = {}) {
  if (!change?.id || !change?.type)
    throw new TypeError("change needs id and type");
  const r = await provider.decide({
    state: { change, activity_profile: profile },
    questions: {
      impact: {
        type: "choice",
        instructions:
          "Classify whether this changed legal provision may alter an obligation, right, procedure, deadline, cost, or eligibility for the described activity. Do not offer legal advice.",
        criteria: {
          direct: "The provision explicitly covers the activity or entity",
          indirect:
            "The provision may affect a supplier, process, or related obligation",
          none: "No material connection is stated",
          unknown: "The text is insufficient or ambiguous",
        },
      },
    },
  });
  const a = r.answers.impact;
  return {
    sectionId: change.id,
    impact: a.choice,
    probability: a.probabilities[a.choice],
    confidence: a.confidence,
    review:
      a.choice === "unknown" || a.confidence < (options.minConfidence ?? 0.85),
    sourceId: change.after?.sourceId || change.before?.sourceId || null,
    usage: r.usage,
  };
}
export async function analyzeVersions(
  before,
  after,
  profile,
  provider,
  options = {},
) {
  const changes = diffSections(before, after),
    results = [];
  for (const c of changes)
    results.push({
      change: c,
      assessment: await assessImpact(c, profile, provider, options),
    });
  return results;
}
export async function runCli(argv, io = console) {
  io.log(
    JSON.stringify(
      {
        files: argv,
        next: "Normalize two legal versions and call analyzeVersions.",
      },
      null,
      2,
    ),
  );
}
