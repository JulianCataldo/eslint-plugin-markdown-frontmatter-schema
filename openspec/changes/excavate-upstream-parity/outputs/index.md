# Outputs — promotion checklist

<!-- Each output files to its destination only after an explicit human
promotion confirmation recorded in corroboration.md. The drafting agent
never confirms promotions. -->

## 1. Drafted outputs

- [x] 1.1 (promotion confirmed by the steward and filed 2026-07-26)
      `shadow-adr-0002-port-to-eslint.md` →
      `docs/adr/0002-port-to-eslint.md` — shadow ADR (epistemics B2,
      anchor), files as `Status: proposed` under the ordinary ADR lifecycle
      and numbering (next free number after 0001). Its later
      proposed → accepted review is the ADR lifecycle's own human act, not
      part of this dig.
- [x] 1.2 (promotion confirmed by the steward and merged 2026-07-26)
      Pool-spec intent-delta touch-up →
      `openspec/specs/rule-runtime-contract/spec.md` § Intent status —
      destination EXISTS: explicit merge decision required, never a silent
      overwrite. Proposed delta, verbatim:
      1. Schema-ingestion zone, append: "Subsequent dig
         `excavate-upstream-parity` (C17, B2, 2026-07-26): the steward
         sides with upstream's delete-`$schema`-before-validation direction,
         pending LS behavior-mapping — the payload-validation requirement
         below stays de-facto only."
      2. Reporting zone, append to the intent-delta note: "Corroborated
         2026-07-26: real ranges were original, initially-working upstream
         behavior (`excavate-upstream-parity` C19, B1) — the point-location
         behavior is a port regression, not a design."

## 2. Deliberately not drafted

- **Negative certificates** (campaign 03 Q1/Q2 candidates): testimony
  killed the elimination direction — the `schemas` option is consciously
  deferred capability (C14) and the unreported messageIds are retained
  "aborted or miswired" cues (C15). A certificate would assert an
  elimination the evidence contradicts. Campaign 03 adjudicates with these
  claims instead.
- **Participant spec**: the divergence matrix is comparative reference, not
  a runtime contract of this repo — the port's contract is already filed
  (`openspec/specs/rule-runtime-contract/spec.md`). The matrix lives as the
  shadow ADR's appendix.
