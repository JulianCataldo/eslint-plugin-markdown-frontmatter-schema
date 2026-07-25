# Acceptance Contract and Evidence Ledger

## Decision surface

- Tier: light — docs-only ADR probe, fully reversible, author-only blast
  radius.
- Awaiting confirmation: first-round-click, noise-balance
- Judgment checks: both rules ("wet finger" human judgment per the seed)
- Open conflicts: none
- Awaiting verdict (post-apply): none

## Contract

- Intended outcome: the ADR + companion doc + hooks exist such that the
  first excavation round produces crisp, diff-reviewable code→spec mappings
  the author judges valuable.
- Scope boundary: inside — ADR, companion doc, hook lines, first-round
  evaluation. Outside — any spec pipeline, the excavation round itself,
  syntax finalization, the parked tracking system, the
  post-full-excavation noise reassessment.
- File defaults: Priority: high. Gate: required.
- Revision policy: after apply begins, never silently weaken a confirmed
  rule; record revisions with reason and effect.
- Waiver: None.
- Revision note (pre-confirmation, 2026-07-26): trimmed to ADR-bound shape
  per author follow-up; dropped inferred rule `hooks-documented` (hook
  presence is directly verifiable via tasks 1.x; original wording in git
  history).

### Rule: first-round-click

- Status: proposed
- Assessor: the author (ju)

The first excavation round's annotated diff "clicks": each relationship
reads crisp, the pattern adds value worth officializing. (Seed s-RULE.)

- GIVEN the first excavation slice promoted at least one spec
- WHEN the author reviews the annotated diff
- THEN each annotation's governing spec is evident and the pattern is judged
  worth wrapping
- Required evidence: author verdict recorded in this ledger
- Scope exceptions: shape refinement after the round is expected, not a
  failure

### Rule: noise-balance

- Status: proposed
- Assessor: the author (ju)

Acceptable affordance/verbosity/visual-noise balance in BOTH surfaces — raw
code and VSCode hover render (Markdown brackets and relative paths are the
known ugliness drivers). (Seed acceptance s-GOAL.)

- GIVEN annotated code from the first round
- WHEN the author reads raw source and hovers symbols in VSCode
- THEN neither surface reads as unacceptably noisy or broken (VSCode's tag
  re-massaging accounted for)
- Required evidence: author judgment on real annotated code; hover
  screenshot or note suffices

Human assessors require a named external judgment; the implementing agent
must not self-attest their outcome.

#### Disposition

- State: <!-- /openspec-sb-assess records accepted | rejected | pending | unable-to-assess -->
- Evidence / judgment: <!-- concrete pointer, or "judged by <name>, <date>" -->
- Revision history: <!-- if revised after confirmation, append reason and effect -->
