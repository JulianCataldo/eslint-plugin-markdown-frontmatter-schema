<!-- Human-first documentation. Agents: do not load this file
during pipeline actions; it is meta-guidance for humans driving Seedbed.
The normative rules live in openspec/schemas/. -->

# Working a change through Seedbed

This is the everyday seat: you have an intent — a feature, a fix, a "we should
really…" — and Seedbed walks it from that first thought to archived, reviewable
history. This guide is the narrative tour; the binding rules live with the
machinery, in your planning root's `openspec/schemas/seedbed/` (README,
AGENTS.md, and schema instructions).

## The lifecycle at a glance

```text
(seed) → proposal → specs → design → ADR review → tasks   ← planning
       → apply    → assess → archive                      ← delivery
```

- **`/openspec-propose`** — creates the change and generates the planning artifacts.
- **`/openspec-apply-change`** — implements the task list; discoveries flow back into the
  artifacts (nothing is phase-locked).
- **`/openspec-sb-assess`** — resolves the acceptance contract, rule by rule, with
  evidence.
- **`/openspec-archive-change`** — closes the change; deltas are synchronized into the main
  capability specs (`/openspec-sync-specs` also exists standalone).
- **`/openspec-explore`** — thinking room before any of the above.

Everything is re-enterable. Pausing mid-apply, amending a spec after
implementation started, assessing twice — all normal.

## Start from a seed — or don't

A **seed prompt** is your human-authored ignition text, staged under the
planning root's `openspec/seed-prompts/` (see its README) while you draft it.
Plain `.md`, `.txt`, or `.html` all work; SpecMark tags are opt-in sugar for
murky, decision-heavy prompts, never a requirement.

What makes seeds unusual here:

- **Promotion is consent.** Naming a staged seed at proposal time moves it into
  the change — after you consent and review it for secrets. No workflow step may
  pressure you to commit one; a change with no archived seed is fully
  legitimate.
- **Follow-ups append; nothing rewrites.** Until archival, the promoted seed
  file is the single home of the change's whole prompt history. You append new
  rounds (mid-implementation corrections included); previously ingested intent
  is never silently revised — and an agent never writes seed text at all, not
  even your own words transcribed verbatim from chat. It indicates instead:
  append-ready text and where to put it, the write is yours.
- **Mid-pass follow-ups are noticed at checkpoints.** While a change is being
  worked, the agent rechecks your seed at bounded points — turn start, before
  finalizing artifacts or handing back, major artifact boundaries — never
  claiming continuous monitoring. A round you committed or restated in the live
  session steers immediately; a complete-but-uncommitted round is provisional
  (announced, reversible in-scope refinements only) until you commit or confirm
  it; a half-typed round waits untouched. Nothing observed on disk expands
  authority or decides a gate, and the agent never edits your seed.
- **Archival retires it.** The archive pre-check records the prompt history's
  integrity identities and flips it to explicit-only context: it stays in git
  for humans, but stops competing for agent attention by default.

## What the pipeline writes

| Artifact   | Job                                                       |
| ---------- | --------------------------------------------------------- |
| `proposal` | why this change, what it touches, which capabilities      |
| `specs`    | behavior as requirements with WHEN/THEN scenarios         |
| `design`   | the decisions, alternatives, risks                        |
| `adr.md`   | review manifest; durable decisions distilled to ADR files |
| `tasks`    | the implementation plan, checked off during apply         |

Artifacts default to terse — attention is budgeted like complexity, and depth is
spent where you signal it ("be thorough on X", "still split on the outcomes").
If a report or artifact feels short, that is the contract working.

Durable decisions get their own files under `docs/adr/`, created as **proposed**
and waiting for your independent review — each record gets its own accept/reject
outcome, acceptance freezes the file forever, and changing a frozen decision
means a new superseding record. Reviewing one ADR never batch-approves its
siblings.

## The acceptance contract and the assessment gate

Checked tasks prove motion, not outcomes — so a change carries an
`acceptance.md`: a compact contract of rules ("the install leaves no trace on
failure", "the guide walks scenario X"), each with the cheapest trustworthy
evidence that would resolve it. You confirm the contract; proposed rules bind
only after that.

Two things are deliberately impossible for an agent:

- **Ticking the gate.** Apply ends "ready for assessment", never "ready for
  archive". Only `/openspec-sb-assess` closes the gate, after each required rule is
  resolved with evidence.
- **Self-attesting your judgment.** Rules that need a human check (or an
  independent model's) are delegated and come back as recorded dispositions —
  missing evidence is reported as missing, never laundered into a pass.

Waivers exist and are explicit: declining a rule is a recorded decision, not a
silent skip. Archive only proceeds on a resolved contract.

## Parking: two shapes of "not now"

- **A blurry idea** goes to the planning root's `openspec/ideas/` — one short
  file with origin, gist, reason postponed, wake-up condition. Deliberately
  _not_ an OpenSpec change, so it can't pollute the change inventory.
- **A fully planned change that must pause** gets a `PARKED.md` marker in its
  directory: reason, wake-up condition, owner, date. Agents stop applying its
  tasks until a human deletes the marker and revalidates.

Neither is ever auto-deleted. Both directories' READMEs carry the activation and
resumption recipes.

## Reading the reports

Completion reports follow one discipline: exceptions lead (wrinkles, deviations,
judgment calls, blockers), routine confirmation follows compressed, and nothing
paraphrases what a persisted artifact already says — you get pointers instead. A
one-line report after a clean run is the norm, not laziness.

## When you don't know what's next

The `seedbed-oracle` skill answers read-only, eagle-eye questions over the whole
corpus: "what should I pick up next", "any low-hanging fruit", "which changes
look finished but aren't", "what's blocked on acceptance" — plus a hand-holding
mode for low-energy sessions. It analyzes and points; it never mutates workflow
state. Policy: `openspec/schemas/seedbed/oracle-playbook.md` at the planning
root.

Committing as you go, and syncing progress to a PM board, have their own opt-in
helpers — see [steward operations](steward-operations.md).

## Do / Don't

| Do                                       | Don't                                   |
| ---------------------------------------- | --------------------------------------- |
| Confirm the acceptance contract yourself | Let checked tasks stand in for outcomes |
| Append seed follow-ups as new rounds     | Rewrite already-ingested intent         |
| Park blurry ideas as ideas               | Draft half-changes to "hold the slot"   |
| Review each proposed ADR on its own      | Batch-approve a change's ADR set        |
| Expect terse artifacts and short reports | Read brevity as skipped work            |

Deeper, at your planning root (locate it with `openspec context --store <id>`
when planning lives outside this repository): schema guidance in
`openspec/schemas/seedbed/AGENTS.md` · workflow schema in
`openspec/schemas/seedbed/README.md` · seed staging in
`openspec/seed-prompts/README.md` · parked work in `openspec/ideas/README.md`
