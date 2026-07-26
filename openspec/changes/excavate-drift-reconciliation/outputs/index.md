# Outputs — promotion checklist

<!-- Each output files to its destination only after an explicit human
promotion confirmation recorded in corroboration.md. The drafting agent
never confirms promotions. -->

## 1. Drafted outputs

- [ ] 1.1 `shadow-adr-0003-drift-dispositions.md` →
      `docs/adr/0003-drift-dispositions.md` — shadow ADR (epistemics B2,
      anchor), files as `Status: proposed` under the ordinary ADR lifecycle
      and numbering (next free number after 0002). Its later
      proposed → accepted review is the ADR lifecycle's own human act, not
      part of this dig.
- [ ] 1.2 Pool-spec intent-delta touch-up →
      `openspec/specs/rule-runtime-contract/spec.md` § Intent status —
      destination EXISTS: explicit merge decision required, never a silent
      overwrite. Proposed delta, verbatim:
      1. Schema-ingestion zone bullet, append: "Dig
         `excavate-drift-reconciliation` (C5, B2, 2026-07-26): absence of
         an associated schema is intended as an acceptable freeform state —
         'No explicit schema = no constraints = no errors'; both the
         current `schemaMalformed` actual and the red test's
         `schemaNotFound` expectation diverge from this intent, which the
         planned error-surfacing repass supersedes."
      2. Reporting zone bullet, append: "Same dig (C8, B1; C6/C7, A1): fix
         affordances, YAML-parse-error surfacing, and rule metadata are
         indispensable planned capabilities — `meta.fixable` and the
         unreported `yamlSyntaxError` messageId are retained as capability
         cues; `--fix` verifiably applies nothing today and the README's
         day-one claim never matched any commit."

## 2. Deliberately not drafted

- **Negative certificates** (03-Q3 candidates): declined by testimony — the
  steward imposed a fixture/test moratorium pending the post-excavation
  clean-slate redesign (C21); `sample.md` is a live IDE-demo surface (C22).
  A certificate would assert an elimination the disposal authority hasn't
  made.
- **Participant spec**: the drift register is comparative/dispositional
  reference, not a runtime contract — it lives as ADR 0003's appendix; the
  runtime contract is already filed
  (`openspec/specs/rule-runtime-contract/spec.md`).
- **Ordinary-work edits** (README wording/layout, `meta.docs.url` repoint,
  `files` packaging fix, `# /docs` breadcrumb removal): sanctioned by ADR
  0003 decision 7 but not dig outputs — they belong to a normal change/tend
  pass, not to promotion.
