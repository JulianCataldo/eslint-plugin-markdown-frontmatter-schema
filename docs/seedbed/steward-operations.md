<!-- Human-first documentation. Agents: do not load this file
during pipeline actions; it is meta-guidance for humans driving Seedbed.
The normative rules live in openspec/schemas/. -->

# Steward operations: git tending and PM sync

Two helpers orbit the change lifecycle without being part of it: an advisory git
steward and an opt-in PM-platform bridge. They share one temperament — they
recommend and ask; they never gate a lifecycle step, and declining them is
always conforming.

## Git tending (`seedbed-tend`)

Dogfooding SDD under several concurrent changes produces a familiar mess: dirty
planning files from three different lanes, a durable decision record belonging
to one of them, seed follow-ups nobody committed. `seedbed-tend` is the on-demand
janitor for exactly that — and only that.

What a run looks like:

1. It rebuilds lane state from the working tree, git history, and the
   `openspec/` tree alone — a fresh session plans exactly like an in-flow one.
2. Dirty **Seedbed-owned** paths are bucketed by change lane
   (`openspec/changes/<name>/**` prefixes; seeds and ideas form a garden
   bucket). Whatever fits no single lane becomes one explicit question for you —
   "leave it" is always a valid answer.
3. It proposes scoped commit plans: exact path set, exact message. Nothing is
   staged while you read.
4. It commits **only** the plan you explicitly approve, exactly as approved —
   never enlarged, never a silent commit.

Boundaries that hold no matter what:

- **Owned paths only.** Your product code is never staged, named, or narrated —
  out-of-scope dirty files appear at most as a count, even when they sit in the
  same working tree.
- **Message style is mirrored, not imposed:** a declaration in
  `openspec/config.yaml` wins, then the style observed in your own history, then
  Seedbed's default lifecycle vocabulary (Plant, Propose, Refine, Apply, Assess,
  Archive).
- The lifecycle itself only **nudges** — at apply pre-flight ("commit the dirty
  change directory first?"), at apply end, before archive ("keep the archive
  commit a pure rename wave"). Every nudge is declinable; seed-prompt commits
  are never pushed at all.

### The changesets facet

Where your repository already uses `.changeset/` (or you opt in explicitly),
tend can also draft compact SDD changelog entries riding the commit slices it
proposes. The facet stays silent otherwise — no bootstrap pressure. Planning
tissue (changes, seeds, ideas, parked records) never bumps a release-bearing
package: where SDD infrastructure is not the product, entries target a dedicated
private stream or are omitted, and summaries state the lifecycle event instead
of paraphrasing artifacts. If your changeset config couples the SDD stream to
product releases, tend surfaces the coupling and stands down.

## PM-platform sync (`seedbed-pm-sync`)

**Off by default, and silent when off.** Without an explicit
`openspec/pm-sync.yaml` at the planning root, every workflow behaves purely
locally — no platform reads, no setup nudges, ever. Only your explicit request
starts configuration.

When on, one ownership split governs everything:

- **The platform owns the "what":** business-facing summary, use cases,
  stakeholder-level acceptance, status, a link back to the repo.
- **The repository owns the "how":** specs, design, tasks, evidence. Sync never
  copies technical detail to the board and never treats board text as the
  specification source of truth — divergence is surfaced to you, not
  auto-repaired in either direction.

Lifecycle hooks under an active binding:

| Moment  | Board effect                                                    |
| ------- | --------------------------------------------------------------- |
| propose | issue selected or created, binding recorded, summary + link set |
| apply   | status moves to in-progress; short comments at real boundaries  |
| archive | **only now** may the issue transition to Done                   |

Task checkboxes stay in `tasks.md` — never mirrored as platform sub-tasks. Done
strictly follows archival: an issue may show progress before the acceptance gate
closes, never completion.

Failures are non-blocking by design: platform or MCP unavailability completes
the local action and reports exactly which sync updates were skipped. Every
board write names the change that produced it, so any mutation traces back to
repo history. Access itself is delegated to the platform vendor's MCP tools
(Linear first; other adapters are documented slots) — Seedbed ships
instructions, never integrations, and stores no credentials anywhere.

One guardrail worth knowing before setup: supported board shapes are dedicated,
low-human-intervention ones — an internal tool, a tech-debt family, an
autonomous feature-team board. Pointing sync at a scrutinized production triage
board or a month-spanning epic triggers a warning and an explicit confirmation,
because human attention dominates there and conflicts are likely.

## Do / Don't

| Do                                       | Don't                                   |
| ---------------------------------------- | --------------------------------------- |
| Approve the exact commit plan you read   | Expect (or fear) silent commits         |
| Declare a subject style in your config   | Let a tool impose one on your history   |
| Keep the board at business altitude      | Mirror tasks or specs onto the platform |
| Let archive alone flip issues to Done    | Close board items at apply time         |
| Treat sync failures as reports to act on | Retry-loop or hand-repair half-writes   |

Deeper, at your planning root (locate it with `openspec context --store <id>`
when planning lives outside this repository): git stewardship rules in
`openspec/schemas/seedbed/AGENTS.md` · PM sync policy in
`openspec/schemas/seedbed/pm-sync-policy.md`
