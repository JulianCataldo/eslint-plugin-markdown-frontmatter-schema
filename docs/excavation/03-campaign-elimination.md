# Campaign 03: elimination — declared-but-unreachable surface

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

Aim: nominate influence-tree discontinuities for the dig certificate
machinery. Nothing here is proof of dead code — invisible consumers exist
(IDE affordances, manual fixture use, upstream-parity intent); only a dig's
negative certificate licenses deletion.

## Frontier

- [x] Q1 (`answered` → `docs/adr/0002-port-to-eslint.md`, C14) — The `schemas` option: declared in the rule's options
      schema (`src/rules/frontmatter-schema.ts:42-48`) and read by no code path
      (`grep -rn "schemas" src/` → the declaration only). It mirrors upstream's
      glob-association map. Implement it (parity, see 01-Q7) or certify and
      delete it? Adjudicated 2026-07-26: NOT a certificate candidate —
      consciously deferred capability awaiting the semi-clean-slate
      ingestion redesign (LS blueprint); its minimatch-glob shape is
      already obsolete under ESLint (steward: "null and void"). Deletion
      off the table; the implementation shape belongs to the redesign.
- [x] Q2 (`answered` → `docs/adr/0002-port-to-eslint.md`, C15) — MessageIds `fixDescription` and `yamlSyntaxError`
      (`src/rules/frontmatter-schema.ts:31,34`): declared, never passed to any
      report. Latent intent (planned YAML-syntax reporting, see 01-Q2) or dead
      weight? Adjudicated 2026-07-26: NOT dead weight — "aborted or
      miswired" attempts retained as cues for the planned error-surfacing
      repass over ESLint's API capabilities. No certificate; the repass
      decides their final form.
- [ ] Q3 (`open`) — Orphaned fixtures: `fixtures/sample.md` is referenced by
      no test (grep over `src/tests/`), and `fixtures/.dev.invalid.schema.json`
      is untracked via the `.dev*` ignore (`.gitignore`). Invisible-consumer
      caveat: `README.md:128` invites cloning and trying the fixtures manually in
      an IDE, and the dogfood config lints all `**/*.md`
      (`eslint.config.js:131-161`).
- [ ] Q4 (`open`) — `meta.fixable: 'code'` (`src/rules/frontmatter-schema.ts:27`)
      with no `fix` ever attached: inert or load-bearing for editor affordances?
      Resolves jointly with `02-campaign-drift` Q2 — either fixes arrive or flag
      and README claim go together.

## Resolved

(none yet)

## Cross-cutting dependencies

- Q1 and Q2 adjudication delivered 2026-07-26 by dig
  `excavate-upstream-parity` (01-Q7): claims C14/C15, filed in ADR 0002.
- Q3 sequences with `02-campaign-drift` Q1(a) so fixture churn happens once.
- Q4 pairs with `02-campaign-drift` Q2.

## Accrual

- `docs/adr/0002-port-to-eslint.md` — shadow ADR carrying the Q1/Q2
  adjudication (C14/C15) and the upstream/port divergence matrix, promoted
  2026-07-26 from dig `excavate-upstream-parity` (campaign 01 Q7).
