# Acceptance Contract and Evidence Ledger

## Decision surface

<!-- Everything the human must decide, readable without the evidence protocol
below. Reference rules by id — never restate rule text here. Keep these lines
current as statuses change; write "none" rather than deleting a line. -->

- Tier: <waiver | light | full> —
  <!-- one-line blast-radius rationale (behavioral scope, reversibility, who is affected); when torn between notches, propose the higher -->
- Awaiting confirmation: <!-- rule ids still Status: proposed, or "none" -->
- Judgment checks:
  <!-- rule ids needing a named human or independent-model judgment, or "none" -->
- Open conflicts:
  <!-- conflicts surfaced by triage awaiting a human call, or "none" -->
- Awaiting verdict (post-apply):
  <!-- rule ids whose disposition needs a human verdict, or "none" -->

## Contract

- Intended outcome: <!-- What observable result should this change produce? -->
- Scope boundary: <!-- What is explicitly inside and outside this contract? -->
- File defaults: Priority: <high | medium | low>. Gate: <required | advisory>.
  <!-- Rules state Priority/Gate only when deviating from these defaults, so a stated field always carries signal. -->
- Revision policy: After apply begins, never silently weaken a confirmed rule to
  match results. Record every revision's reason and effect, and keep the
  original wording recoverable here or in git history.
- Waiver:
  <!-- waiver tier only: the explicit reason acceptance rules are not warranted and who confirmed it. Otherwise "None". -->

<!-- One Rule section per acceptance rule. Keep rule ids stable. Assessable
core at every tier: id, outcome, scenario, evidence, assessor. At `full`,
every rule adds example or counterexample plus applicable extras; at `light`,
only rules whose risk earns escalation carry them. -->

### Rule: <stable-kebab-id>

- Status: proposed | confirmed
- Assessor: agent | developer | QA | stakeholder | independent-model review |
  <named human>
- Priority: <!-- only when deviating from the file default -->
- Gate: <!-- only when deviating from the file default -->

<!-- One observable outcome sentence. -->

- GIVEN <!-- starting context -->
- WHEN <!-- action or event -->
- THEN <!-- observable result -->
- Example: <!-- full tier or escalated rule: at least one concrete example -->
- Counterexample: <!-- or at least one concrete counterexample -->
- Required evidence:
  <!-- tests, fixtures, commands, screenshots, benchmarks, or named judgment -->
- Forbidden shortcuts: <!-- when applicable -->
- Judgment checks:
  <!-- properties needing review rather than binary automation -->
- Scope exceptions: <!-- explicit carve-outs, when applicable -->

Human and independent-model assessors require a named external judgment. The
implementing agent must not self-attest their outcome.

#### Disposition

- State:
  <!-- /openspec-sb-assess records accepted | rejected | pending | unable-to-assess -->
- Evidence / judgment: <!-- concrete pointer, or "judged by <name>, <date>" -->
- Revision history:
  <!-- if revised after confirmation, append reason and effect -->
