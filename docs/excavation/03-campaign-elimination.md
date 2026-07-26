# Campaign 03: elimination — declared-but-unreachable surface

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

Aim: nominate influence-tree discontinuities for the dig certificate
machinery. Nothing here is proof of dead code — invisible consumers exist
(IDE affordances, manual fixture use, upstream-parity intent); only a dig's
negative certificate licenses deletion.

Digs `excavate-upstream-parity` (Q1/Q2, 2026-07-26) and
`excavate-drift-reconciliation` (Q3/Q4, grades C1–C23 and promotions
confirmed 2026-07-26) adjudicated the whole frontier — with ZERO negative
certificates: every candidate resolved to deferred capability, live
surface, or retained cue. The campaign is closed; frontier clear.

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
- [x] Q3 (`answered` → `docs/adr/0003-drift-dispositions.md`, C21/C22) —
      Orphaned fixtures: `fixtures/sample.md` referenced by no test;
      `fixtures/.dev.invalid.schema.json` untracked via `.dev*`.
      Adjudicated 2026-07-26: NO certificate — the invisible consumer is
      real (`sample.md` is an intentionally-erroring in-IDE demo under the
      dogfood config, 2 live errors, C22) and the steward imposed a
      fixture/test moratorium pending the post-excavation clean-slate
      redesign (C21). `.dev.invalid.schema.json` (untracked byte-duplicate
      of `valid.schema.json`) awaits the same redesign's broom.
- [x] Q4 (`answered` → `docs/adr/0003-drift-dispositions.md`, C6/C8) —
      `meta.fixable: 'code'` with no `fix` ever attached. Adjudicated
      2026-07-26: inert today (`--fix` verifiably applies nothing, C6) but
      NOT dead weight — fix affordances are indispensable planned
      capability; the flag stays as a capability cue and the
      error-surfacing repass decides its final form (C8). Resolved jointly
      with `02-campaign-drift` Q2, third way: neither "fixes arrive now"
      nor "flag and claim go" — cue retained, claim wording aligns in
      ordinary work.

## Resolved

(none yet)

## Cross-cutting dependencies

- Q1 and Q2 adjudication delivered 2026-07-26 by dig
  `excavate-upstream-parity` (01-Q7): claims C14/C15, filed in ADR 0002.
- Q3 sequences with `02-campaign-drift` Q1(a) so fixture churn happens once.
  Delivered 2026-07-26 by dig `excavate-drift-reconciliation`: no churn —
  moratorium (C21); churn authority is the post-excavation clean slate.
- Q4 pairs with `02-campaign-drift` Q2. Delivered 2026-07-26, same dig:
  cue retained (C8).

## Accrual

- `docs/adr/0002-port-to-eslint.md` — shadow ADR carrying the Q1/Q2
  adjudication (C14/C15) and the upstream/port divergence matrix, promoted
  2026-07-26 from dig `excavate-upstream-parity` (campaign 01 Q7).
- `docs/adr/0003-drift-dispositions.md` — shadow ADR carrying the Q3/Q4
  adjudication (C21/C22, C6/C8: moratorium, zero certificates, cue
  retained) and the 11-row drift register, promoted 2026-07-26 from dig
  `excavate-drift-reconciliation`.
