# Campaign 01: reference — the rule's actual runtime contract

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

Aim: excavate the de-facto behavior of `frontmatter-schema/frontmatter-schema`
into pool specs — what the rule really does, not what the README sketches.
Gap class throughout: behavior-without-either, except where noted.

## Frontier

Dig `excavate-rule-runtime-contract` covers Q1–Q6 as one sizeable chunk (Q7
stays out — own dig, shared with campaign 03). Survey scope confirmed by the
steward 2026-07-26; evidence complete (E1–E33, 27 locked characterization
tests); grades C1–C16 and the promotion both confirmed by the steward
2026-07-26 — the participant spec is filed to the pool. Q1–Q6 are
`answered`. Dig `excavate-upstream-parity` (scope, grades C1–C22, and both
promotions confirmed by the steward 2026-07-26) answered Q7 the same day:
shadow ADR 0002 filed as `proposed`, intent-delta lines merged into the
pool spec, adjudication inputs delivered to campaign 03 Q1/Q2. The
campaign's frontier is clear. Campaign closed 2026-07-26 (all questions
answered; entries below retained as history).

- [x] Q1 (`answered` → `openspec/specs/rule-runtime-contract/spec.md`) — What is the exact schema resolution contract? Inline
      `$schema` beats `defaultSchema` via `??` (`src/create-reports.ts:34`);
      relative paths resolve against the markdown file's dir
      (`src/prepare.ts:118`); only the literal prefix `https://` is treated as a
      URL (`src/prepare.ts:115`) — what happens to `http://`, protocol-relative,
      or `file:` values (they fall into local path resolution)?
- [x] Q2 (`answered` → `openspec/specs/rule-runtime-contract/spec.md`) — What happens on malformed YAML frontmatter?
      `parseDocument` errors are never read; `document.toJS() ?? {}`
      (`src/prepare.ts:64`) means broken YAML likely validates `{}` and yields
      misleading required-property errors. Is the declared `yamlSyntaxError`
      messageId (`src/rules/frontmatter-schema.ts:34`) reachable at all today?
- [x] Q3 (`answered` → `openspec/specs/rule-runtime-contract/spec.md`) — What is the schema loading contract? Synchronous synckit
      worker per `bundleSchema` call with no memoization (`src/prepare.ts:18-20`)
      — is a remote schema re-fetched for every linted file? Failure path:
      `console.warn` to stderr outside ESLint plus generic `schemaNotFound`
      (`src/schema-loader.worker.ts:21-25`). Offline/timeout semantics for remote
      schemas are unobserved (coverage gap: worker lines 21-25).
- [x] Q4 (`answered` → `openspec/specs/rule-runtime-contract/spec.md`) — What exactly is validated? The full frontmatter object
      including the `$schema` key itself (`src/create-reports.ts:30-37`) — how
      does that interact with `additionalProperties: false` schemas? The whole
      markdown file text is parsed as YAML with file-global offsets
      (`src/create-reports.ts:30`, loc mapping `src/validate.ts:44-52`) — which
      assumptions make the line/column numbers land correctly?
- [x] Q5 (`answered` → `openspec/specs/rule-runtime-contract/spec.md`) — What is the suggestion/fix contract? Suggestions exist
      only for `enum` errors, with absolute text ranges
      (`src/validate.ts:62-70`); `meta.fixable: 'code'` is set
      (`src/rules/frontmatter-schema.ts:27`) but no `fix` is ever attached — does
      `--fix` ever modify a file? Note: the suggestion branch currently has zero
      executable evidence (c8: `src/validate.ts:65-69` uncovered since the
      fixture changed — see 02-Q1).
- [x] Q6 (`answered` → `openspec/specs/rule-runtime-contract/spec.md`) — What is the options-shape contract at the edges? Trace
      suggests `['error', {}]` (options present, no `defaultSchema`) short-circuits
      `parseGlobalSchema` to `false` and falls into the `schemaMalformed` guard
      (`src/prepare.ts:81-95`), while `['error']` yields `undefined` and proceeds
      — the red `Empty frontmatter` test observes this divergence
      (`src/tests/empty-no.test.ts:17,34-37`, expects `schemaNotFound`). What
      should each shape do, including for empty frontmatter blocks?
- [x] Q7 (`answered` → `docs/adr/0002-port-to-eslint.md`) — Which upstream `remark-lint-frontmatter-schema` behaviors
      were intended to carry over? The README claims "the API is kept very
      similar" (`README.md:20`); the declared-but-dead `schemas` glob map option
      mirrors upstream's global association feature
      (`src/rules/frontmatter-schema.ts:42-48`). External corpus read; its answer
      gates adjudication in campaign 03 (Q1, Q2 there).

## Resolved

(none yet)

## Cross-cutting dependencies

- Q7's upstream-parity answer is the adjudication input for
  `03-campaign-elimination` Q1/Q2 — delivered 2026-07-26 (dig
  `excavate-upstream-parity` claims C14/C15; both flipped to answered).
- Q5 shares its root cause with `02-campaign-drift` Q1(a): restoring an
  enum-invalid fixture would restore the suggestion branch's executable
  evidence.
- Q6 and `02-campaign-drift` Q1(b) are the same trace viewed as contract
  question vs suite-red reconciliation.
- Steward testimony (2026-07-26, recorded in dig
  `excavate-rule-runtime-contract` survey): schema-config ingestion is
  acknowledged accidental ("murky", "I screwed up", semi clean slate) and
  upstream had the same class of problems ("less deceptive") — weakens the
  upstream intent oracle for ingestion parity. Adjudication input for Q7
  here and for `03-campaign-elimination` Q1/Q2. (Extended 2026-07-26 by the
  Q7 dig's testimony round, E37–E44 there: LS-parity is the governing
  target; upstream dormant, port successor.)

## Accrual

- `openspec/specs/rule-runtime-contract/spec.md` — recovered participant
  spec (epistemics B2, anchor; schema-ingestion zone explicitly
  non-ratified per steward testimony), promoted 2026-07-26 from dig
  `excavate-rule-runtime-contract`. Executable twin:
  `src/tests/runtime-contract.characterization.test.ts` (27 locked tests).
- `docs/adr/0002-port-to-eslint.md` — shadow ADR (epistemics B2, anchor;
  `proposed`), promoted 2026-07-26 from dig `excavate-upstream-parity`
  (Q7); carries the upstream/port divergence matrix as appendix. Probe rig
  re-runnable from that dig's `attachments/upstream-probes/`. Its C20
  verification flag was resolved 2026-07-26 by dig
  `excavate-drift-reconciliation` (C16): ESLint v9 config lookup is
  cwd-based; nearest-from-file ships behind `v10_config_lookup_from_file`
  and becomes the v10 default (ADR 0003 decision 8).
- Pool-spec intent-delta (C17 ingestion, C19 reporting) merged into
  `openspec/specs/rule-runtime-contract/spec.md` § Intent status,
  2026-07-26, same dig.
