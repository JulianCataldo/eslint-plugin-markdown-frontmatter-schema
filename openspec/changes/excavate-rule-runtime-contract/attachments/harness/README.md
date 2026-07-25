# Dig harness — excavate-rule-runtime-contract

Re-run procedure (macOS/darwin, node + pnpm versions in
../captures/env-versions.txt):

1. `pnpm build` in the repo root (dist is gitignored).
2. From a directory containing these files plus a `node_modules` symlink to
   the repo's node_modules and the `fx/` fixtures:
   - `node matrix.mjs > matrix-out.jsonl 2> matrix-stderr.txt`
   - `node probe.mjs > probe-out.jsonl`
3. Worker call count: copy the built `dist` somewhere with the same
   node_modules trick, apply the wrapper in
   `instrument-patch.applied.txt` to its `prepare.js` (wraps `bundleSchema`,
   appends one JSON line per call to `$DIG_COUNT_FILE`), then
   `DIG_COUNT_FILE=/tmp/count.log node count.mjs`.

Captures in ../captures/ are the verbatim outputs cited by evidence.md.
