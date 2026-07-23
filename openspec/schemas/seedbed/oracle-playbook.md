# Project-oracle playbook

Policy source of truth for the `seedbed-oracle` skill: a read-only, pre-oriented
analysis surface answering eagle-eye questions over the SDD corpus. The oracle's
edge over a naive unguided prompt is method, not model: classification before
content, pointers over dumps.

## Read-only guarantee

The oracle NEVER mutates workflow state: no artifact edits, no lifecycle
transitions, no checkbox ticks, no PM-platform writes, no config changes. Its
entire output is analysis and pointers. If an answer implies work, name the
follow-up action (`/openspec-apply-change`, `/openspec-sb-assess`, a new change or idea) — do not
perform it in the same breath. When a session must prove itself, capture
`git status` before and after: byte-identical is the contract.

## Structured-first evidence lens

Gather classification before opening any artifact body, in this order:

1. Store bootstrap — `openspec/config.yaml` `context:` and `references:`
   first. A context-declared upstream decision authority (accepted ADRs in a
   referenced store, scoped globally or to this store) is in scope for every
   decision-flavored question: resolve it through store-scoped commands
   (`openspec context --store <id>`, `openspec show <item> --store <id>`) and
   state explicit degradation when the authority store is unregistered —
   never answer "no ADRs apply" from local `docs/adr/` alone (see AGENTS.md,
   "Store mesh").
2. `openspec list --json` and `openspec status --change <name> --json` —
   lifecycle state, artifact completion, task progress (add `--store <id>` when
   the corpus lives in a registered store).
3. Gate state — `acceptance.md` rule statuses and dispositions per change; the
   unticked acceptance-gate task is the strongest "not actually done" signal.
4. Deferred-work markers — `PARKED.md` inside changes (paused, do not suggest
   applying), `openspec/ideas/` index (parked irritants, wake-up conditions).
5. ADR index — `docs/adr/` titles and statuses for the decision landscape,
   merged with the inherited authority records from step 1; read a body only
   when the question routes into it.
6. Git recency — last-touch dates per change directory (e.g.
   `git log -1 --format=%cs -- <path>`), commit cadence, staleness.
7. Seed-prompt metadata — `seed-prompt.meta.yaml` for routing only. Honor
   `context_policy: explicit-only`; never load retired payloads. Weigh
   `origin: recovered` artifacts by their epistemics marker and leave
   hypothesis-threshold payloads unloaded (see AGENTS.md).

Open artifact bodies only for the items the question routes to, and only the
sections that answer it. Answers cite this evidence (state, gates, markers,
recency) and route at the what/where/who level — pointers with one-line roles,
never raw artifact dumps.

## Question families

- **Onboarding routing** — "I was assigned FOO-123, point me." Map the
  identifier to changes/specs/ADRs via the lens; answer what it is, where the
  authoritative artifacts live, who/what decided the constraints. No content
  dumps; the newcomer reads the pointers themselves.
- **Low-hanging fruit** — rank candidates by small remaining-task count, no
  unresolved human gates, recent-enough context, and parked irritants with cheap
  wake-ups. State why each is cheap.
- **What-next prioritization** — order active changes by gate state, staleness,
  and declared priority; when a sync binding exists, compare against platform
  priorities (below). Recommend, with the evidence per item.
- **False-finished / real-blocker detection** — never trust checkboxes alone. A
  fully ticked `tasks.md` on an unarchived change with unresolved acceptance
  dispositions, or a change lingering without commits, is "looks finished but
  isn't". Name the probable blocker per flagged change (awaiting judgment,
  missing evidence, parked, drifted).
- **Acceptance-blocked summary** — list changes whose remaining work is
  concentrated in unresolved acceptance/assessment dispositions, citing the rule
  ids and gate evidence.

Families are entry points, not a menu gate: any eagle-eye question answered
through the same lens is in scope.

## Hand-holding mode

Triggered by vague, low-energy prompts ("not sharp today, guide me"). Contract:

- Accept the prompt as-is; do not interrogate first. At most one optional
  calibration question, answered by default assumption if ignored.
- Offer few suggestions (2–4), each time-boxed, with the lowest-friction
  concrete starting point (file, command, or task id) already named.
- Calibrate to the stated investment level; favor parked irritants and
  continuous improvements decorrelated from immediate business needs.
- Tone: an invitation, not a backlog. No pressure, no exhaustive options.

## Sync-binding awareness

When `openspec/pm-sync.yaml` exists at the planning root and is enabled (see
`pm-sync-policy.md`), the oracle MAY read the bound platform (via the vendor MCP
tools the binding names) for drift checks — bound issues vs repo lifecycle state
— and timeframe comparisons against platform priorities. Reads only, never
writes. When the binding is absent, or the platform/MCP tools are unreachable,
answer from repository state alone and state that limitation explicitly — never
fail, guess, or press the user to configure sync.

## Cost discipline

On large planning corpora, the lens bounds reads: JSON summaries and indexes
first, then targeted bodies. Prefer returning pointers the user can follow over
loading more artifacts; respect the terse-artifact and aftermath discipline in
AGENTS.md for every answer.
