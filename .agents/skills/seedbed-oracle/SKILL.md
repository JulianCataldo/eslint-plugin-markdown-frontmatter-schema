---
name: seedbed-oracle
description:
  Answers read-only eagle-eye questions over the SDD corpus through Seedbed's
  own semantic lens — onboarding routing, low-hanging fruit, what-next
  prioritization, false-finished detection, acceptance-blocked summaries, and a
  hand-holding mode for low-energy sessions. Analysis and pointers only; never
  mutates workflow state.
---

# Query the project oracle

Use this skill as a thin entrypoint. All oracle policy lives in
`openspec/schemas/seedbed/oracle-playbook.md`; load and follow it instead of
creating a second policy here.

## Resolve and load the corpus

1. If the user names a registered OpenSpec store, or the work lives in one, run
   `openspec store list --json` and retain `--store <id>` on every command that
   supports it.
2. Read `openspec/schemas/seedbed/oracle-playbook.md` (reached through the
   planning root's `openspec/schemas` path or symlink) and
   `openspec/schemas/seedbed/AGENTS.md`; they are the policy source of truth.
3. Gather evidence structured-first, exactly as the playbook's lens orders it;
   open artifact bodies only where the question routes.

## Hard rules carried by the playbook

- Read-only: no artifact edits, no lifecycle transitions, no platform writes.
- Answers cite Seedbed-lens evidence and route at the what/where/who level.
- Vague low-energy prompts enter hand-holding mode without interrogation.
- A `pm-sync.yaml` binding may be read for drift/timeframe checks; absent one,
  answer repo-only and say so.

Do not duplicate, reinterpret, or extend oracle policy in this shim; policy
changes belong in the schema folder.
