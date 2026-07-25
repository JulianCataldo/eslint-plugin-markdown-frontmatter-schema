# Archeology doctrine

<!-- Revisable strategy; zero pool authority. Every topology claim carries
observable pointers (paths, symbols, commands). Amend freely; git is history.
Booted 2026-07-24 from repository observables only (no user hints). -->

## Project typology

A single-rule ESLint plugin that validates YAML frontmatter in Markdown files
against JSON Schema. Small surface, real published consumers, empty knowledge
pool.

- **Shape**: plugin default export carrying one rule, `frontmatter-schema`
  (`src/index.ts:5-9`, `src/rules/frontmatter-schema.ts`). ~390 lines of
  TypeScript source; rule logic delegates to a linear pipeline in
  `src/create-reports.ts:21-40`: options → `parseGlobalSchema`; whole-file text
  → `parseFrontmatter` (yaml `parseDocument`, file-global offsets); inline
  `$schema` wins over `defaultSchema` (`src/create-reports.ts:34`); schema
  bundled through a synckit worker wrapping
  `@apidevtools/json-schema-ref-parser` (`src/schema-loader.worker.ts`,
  `src/prepare.ts:18-20`); Ajv with `allErrors: true, strict: false` plus
  ajv-formats (`src/validate.ts:15-16`); enum failures get ESLint suggestions
  (`src/validate.ts:62-70`).
- **Origin**: a port of `remark-lint-frontmatter-schema` with "the API kept
  very similar" (`README.md:20`); `meta.docs.url` still points at the upstream
  repo (`src/rules/frontmatter-schema.ts:25`). The upstream corpus is the
  external intent oracle for parity questions.
- **Distribution**: published — `npm view eslint-plugin-markdown-frontmatter-schema version`
  → `0.0.1`. Exports map is a single `"."` → `./dist/index.js`
  (`package.json:23-25`); types resolve implicitly via sibling `dist/*.d.ts`
  (no `types` field). The release workflow is entirely commented out and
  targets `master` while the repo lives on `main`
  (`.github/workflows/release.yml`); semantic-release is configured
  (`package.json` devDependencies, `scripts.release`) but evidently unused —
  the publish was manual.
- **Repo meta**: four substantive commits by a single author — git history is
  thin evidence. `/docs` is gitignored (`.gitignore:34`), so this cartography
  and all installed normative docs under `docs/` are currently untracked
  (conflicts with "history is ordinary git"; steward decision pending, see
  campaign 02). The store participates in the Julian OSS mesh
  (`openspec/config.yaml`): hub ADRs in `julian-oss-factory` govern global
  conventions before change planning.

### Evidence classes available

- **Executable suite**: `pnpm test` (node:test over `dist/tests`; `dist/` is
  newer than `src/` as of this boot). Currently **red**: 7 tests, 3 pass,
  4 fail — leaf failures `Empty frontmatter` (`src/tests/empty-no.test.ts`)
  and `Invalid: Should not pass, with 2 errors`
  (`src/tests/inline-linked.test.ts`). The suite is network-dependent (one
  fixture fetches `https://json.schemastore.org/prettierrc.json`).
- **Coverage**: c8 table from the same run. Uncovered hot spots:
  `src/prepare.ts:34-36,40-47` (schema-not-found paths),
  `src/schema-loader.worker.ts:21-25` (loader failure path),
  `src/validate.ts:65-69` (suggestion builder — currently has zero executable
  evidence).
- **Dogfood config**: `eslint.config.js:131-161` wires the built plugin
  against `**/*.md` — and is also loaded implicitly by the test suite (ESLint
  discovers it from cwd; it appears in the c8 table).
- **Fixtures**: `fixtures/` — including one referenced by no test
  (`fixtures/sample.md`) and one untracked via the `.dev*` gitignore pattern
  (`fixtures/.dev.invalid.schema.json`).
- **External**: upstream `remark-lint-frontmatter-schema` repo; npm registry
  tarball of 0.0.1; SchemaStore availability.

## Consumer threads

Pulled from consumer observables inward (visible surface underestimates real
dependency).

- **T1 — config authors**: plugin export, rule id
  `frontmatter-schema/frontmatter-schema`, options object
  `{ defaultSchema, schemas }` (`src/rules/frontmatter-schema.ts:37-52`).
  `schemas` is declared in the options schema but read nowhere
  (`grep -rn "schemas" src/` → only the declaration).
- **T2 — markdown authors**: inline `$schema` key — relative paths resolve
  against the markdown file's directory, `https://` strings are treated as
  URLs, everything else falls into path resolution
  (`src/prepare.ts:106-119`); message inventory
  (`src/rules/frontmatter-schema.ts:30-35`); enum suggestions surfaced in IDEs
  (`README.md:109-111`).
- **T3 — CI/CLI pipelines**: error reports drive exit codes; `meta.fixable:
'code'` is declared (`src/rules/frontmatter-schema.ts:27`) yet no report
  ever attaches a `fix` (only `suggest`, `src/validate.ts:62-70`); remote
  schemas are fetched synchronously during the lint pass
  (`src/schema-loader.worker.ts:15`).
- **T4 — npm downstreams**: tarball contents governed by
  `files: ["dist", "!dist/test"]` while the built directory is `dist/tests`
  (`package.json:27-30`); implicit types resolution.
- **T5 — the repo itself**: dogfood config plus the test suite's hidden
  dependence on it — test overrideConfigs declare no `language:`; the markdown
  language comes from the repo's own `eslint.config.js:131-141`.

## Fog map

- **Thickest — failure paths** (behavior-without-either): YAML syntax errors
  are swallowed (`document.toJS() ?? {}`, `src/prepare.ts:64`; `yamlSyntaxError`
  declared but unreached; loader failures downgrade to `console.warn` on
  stderr plus a generic `schemaNotFound`, `src/schema-loader.worker.ts:21-25`).
  → campaign 01.
- **Contract fog**: resolution precedence, validated payload (the `$schema`
  key itself is part of the validated object, `src/create-reports.ts:37`),
  whole-file YAML parse with file-global offsets, composite-schema error
  noise (root-level `oneOf` errors observed in the boot test run). → campaign 01.
- **Drift belt** (doc↔behavior, test↔fixture, meta↔repo): the red suite is the
  anchor; plus README `--fix` claim, layout paths, upstream `docs.url`,
  files-glob mismatch, commented-out CI vs a published package, gitignored
  `/docs`. → campaign 02.
- **Discontinuities**: `schemas` option, two dead messageIds, orphaned
  fixtures, the `fixable` flag — elimination questions only; the dig
  certificate machinery adjudicates, never this map. → campaign 03.

## Certified territory

None yet. The knowledge pool is empty: `openspec/specs/` has no entries and
`openspec/changes/` holds only an empty `archive/`. First accruals will be
recorded here as pool pointers, not prose.

## Campaign roster

- `01-campaign-reference` — recover the rule's actual runtime contract
  (resolution, precedence, failure paths, validated payload, suggestions).
  Status: active.
- `02-campaign-drift` — reconcile every declared or documented claim with
  executed behavior; the red test suite is the anchor. Status: active.
- `03-campaign-elimination` — adjudicate declared-but-unreachable surface via
  dig certificates. Status: active.
