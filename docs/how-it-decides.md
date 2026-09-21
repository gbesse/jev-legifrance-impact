# How it decides

Jev Légifrance Impact computes exact section changes, then evaluates only those changes against a bounded activity profile. Results retain the source identifiers and require review when confidence is low.

The exact question and criteria live beside the call in [src/index.mjs](../src/index.mjs), making review and version control straightforward. Dates, identifiers, arithmetic, candidate generation, thresholds and state transitions remain code-owned. Synthetic demo probabilities are illustrative. Calibrate review thresholds on representative human labels before operational use.
