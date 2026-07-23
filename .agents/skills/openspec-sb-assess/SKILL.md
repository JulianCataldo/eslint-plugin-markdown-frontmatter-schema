---
name: openspec-sb-assess
description:
  Assesses an implemented OpenSpec change against its confirmed acceptance
  contract, records evidence-backed dispositions, delegates human or
  independent-model judgments, and closes the acceptance gate. Use after apply,
  after fixes from a prior assessment, or before archive when required
  acceptance remains unresolved.
---

# Assess an OpenSpec change

Use this skill as a thin entrypoint. Treat the resolved schema's
acceptance-artifact and apply instructions as the policy source of truth; load
and follow them instead of creating a second policy here.

## Resolve and load the change

1. If the user names a registered OpenSpec store, or the work lives in one, run
   `openspec store list --json` and retain `--store <id>` on every command that
   supports it.
2. Use an explicitly named change. Otherwise infer it from the conversation,
   auto-select it only when exactly one active change exists, or run
   `openspec list --json` and ask the user to choose.
3. Announce `Using change: <name>` and explain how to override it.
4. Run `openspec status --change "<name>" --json`,
   `openspec instructions acceptance --change "<name>" --json`, and
   `openspec instructions apply --change "<name>" --json`, retaining the store
   flag when applicable. Read the concrete policy and context paths they
   identify, including `acceptance.md` and `tasks.md`.
5. Require a human-confirmed contract or waiver. If the acceptance artifact is
   absent, blocked, or still proposed, stop and request the missing artifact or
   confirmation.

## Assess the rules

- Work rule by rule and make the action re-enterable. Preserve still-valid
  accepted evidence; reassess rejected or pending rules after follow-up apply
  work.
- Gather the cheapest trustworthy evidence that proves each rule, with one job
  per evidence layer. Record exactly one disposition: `accepted`, `rejected`,
  `pending`, or `unable-to-assess`, with a concrete evidence pointer or named
  judgment. Record missing, stale, or unproduced evidence as `pending` or
  `unable-to-assess`, never as acceptance.
- Stop and delegate whenever evidence depends on human judgment. Prepare the
  cheapest assessable preview, leave the rule pending, and request a named human
  judgment. Never self-attest a human-judgment rule.
- Never substitute sleep-heavy end-to-end loops imitating judgment, weak
  timeouts presented as prompt behavior, fixture creation presented as fixture
  confirmation, or telemetry presented as good user experience.
- For an `independent-model review` assessor, use the same stop-and-delegate
  flow: prepare a self-contained review brief, stop, and ask the developer to
  run the independent review. Do not spawn another vendor's tooling or
  self-attest its outcome.

## Close the gate

- Update the ledger in `acceptance.md` without silently weakening confirmed
  rules.
- Tick the tasks acceptance-gate checkbox only when the schema policy classifies
  every `required` rule as resolved. Otherwise leave it unticked and report
  concrete findings for the next apply round.
- If a human explicitly overrides unresolved required acceptance for archive,
  record the override and its durable reason in `acceptance.md` before archive
  proceeds. Never invent or infer an override.
- Report dispositions, evidence pointers, delegated judgments, remaining
  findings, and whether the change is ready for another apply round or for
  archive.
