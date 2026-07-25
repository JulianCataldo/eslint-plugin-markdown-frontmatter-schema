# Campaign 03: elimination — declared-but-unreachable surface

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

Aim: nominate influence-tree discontinuities for the dig certificate
machinery. Nothing here is proof of dead code — invisible consumers exist
(IDE affordances, manual fixture use, upstream-parity intent); only a dig's
negative certificate licenses deletion.

## Frontier

- [ ] Q1 (`open`) — The `schemas` option: declared in the rule's options
      schema (`src/rules/frontmatter-schema.ts:42-48`) and read by no code path
      (`grep -rn "schemas" src/` → the declaration only). It mirrors upstream's
      glob-association map. Implement it (parity, see 01-Q7) or certify and
      delete it?
- [ ] Q2 (`open`) — MessageIds `fixDescription` and `yamlSyntaxError`
      (`src/rules/frontmatter-schema.ts:31,34`): declared, never passed to any
      report. Latent intent (planned YAML-syntax reporting, see 01-Q2) or dead
      weight?
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

- Q1 and Q2 adjudication waits on the upstream-parity read
  (`01-campaign-reference` Q7).
- Q3 sequences with `02-campaign-drift` Q1(a) so fixture churn happens once.
- Q4 pairs with `02-campaign-drift` Q2.

## Accrual

(no pool artifacts yet)
