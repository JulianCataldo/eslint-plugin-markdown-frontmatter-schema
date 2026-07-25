# Campaign 02: drift — declared claims vs executed behavior

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

Aim: reconcile every place where documentation, metadata, tests, or packaging
say one thing and the executable evidence says another. Anchor observable:
`pnpm test` on 2026-07-24 → 7 tests, 3 pass, **4 fail**. Gap class throughout:
doc↔behavior drift, except where noted.

## Frontier

- [ ] Q1 (`open`) — Which side of the red suite is intended?
      (a) `Invalid: Should not pass, with 2 errors` expects enum/type errors from
      `fixtures/valid.schema.json` (`src/tests/inline-linked.test.ts:50-86`), but
      the fixture on disk now targets the remote prettierrc schema and a
      `printWidth` key (`fixtures/sample-with-linked-schema.invalid.md`) — the
      fixture changed after the expectations were written. Restore the fixture or
      rewrite the test? (b) `Empty frontmatter` expects `schemaNotFound`
      (`src/tests/empty-no.test.ts:34-37`) but fails — see 01-Q6 for the trace.
- [ ] Q2 (`open`) — README claims "Auto-fix via `--fix` for simple cases"
      (`README.md:110`) but the implementation only ever attaches `suggest`, never
      `fix` (`src/validate.ts:62-70`). Fix the doc or implement the fix?
- [ ] Q3 (`open`) — `meta.docs.url` points at the upstream remark plugin repo,
      not this one (`src/rules/frontmatter-schema.ts:25`); and the README's WIP
      caveat promises "remaining tuning on how schemas are loaded"
      (`README.md:18`) with no spec of what that tuning is (doc-without-spec).
- [ ] Q4 (`open`) — README project layout names `src/fixtures/` and describes
      `src/tests/` (`README.md:132-136`); fixtures actually live at repo root
      `fixtures/`.
- [ ] Q5 (`open`) — `files: ["dist", "!dist/test"]` (`package.json:27-30`)
      but the built directory is `dist/tests` — does the published 0.0.1 tarball
      ship compiled tests? Observable: `npm pack --dry-run`, or the registry
      tarball itself.
- [ ] Q6 (`open`) — The test suite silently depends on the repo's own
      `eslint.config.js`: test overrideConfigs declare no `language:`
      (`src/tests/empty-no.test.ts:12-21`), the markdown language comes from
      `eslint.config.js:131-141`, and the config file appears in the c8 coverage
      table of a test run. Intended harness design or accident? It makes the
      executable evidence class cwd-dependent.
- [ ] Q7 (`open`) — What is the release contract? The only workflow is fully
      commented out and targets `master` while the repo is on `main`
      (`.github/workflows/release.yml`); semantic-release is configured
      (`package.json` scripts/devDeps); yet npm has 0.0.1 published. Repo-meta
      drift.
- [ ] Q8 (`open`) — `/docs` is gitignored (`.gitignore:34`) — plausibly a
      legacy ignore for generated docs — yet the installed SDD normative docs and
      this cartography live under `docs/` and are therefore untracked. Steward
      decision; fast park candidate (route to an idea record if not dug soon).

## Resolved

(none yet)

## Cross-cutting dependencies

- Q1(a) changes fixtures — sequence it with `03-campaign-elimination` Q3
  (orphaned fixtures) so fixture churn happens once.
- Q1(a) also restores executable evidence for the suggestion branch
  (`01-campaign-reference` Q5).
- Q1(b) and `01-campaign-reference` Q6 are the same root trace.
- Q2 and `03-campaign-elimination` Q4 (the `fixable` flag) resolve together:
  either fixes exist, or the claim and the flag both go.

## Accrual

(no pool artifacts yet)
