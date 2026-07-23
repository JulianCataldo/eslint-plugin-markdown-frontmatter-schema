# Excavation cartography

The strategy layer above the gated dig flow: a singular, revisable **archeology
doctrine** (`doctrine.md`) and numbered, question-driven **excavation
campaigns** (`NN-campaign-<kind>.md`). Cartography plans where to dig; digs —
OpenSpec changes under the `seedbed-excavation` schema — execute and alone
mutate the knowledge pool. This installed file is the self-contained normative
reference for both shapes; the `seedbed-chart` skill is a thin entrypoint that
delegates here.

**Context posture** — cartography documents are agent-load-bearing during
cartography and dig work only. Do NOT load `docs/excavation/` for unrelated
pipeline actions (propose, apply, assess, sync, archive): it is a third context
class, distinct from always-on pipeline guidance (`openspec/schemas/`) and from
human-first docs (`docs/seedbed/`).

## The advisory boundary — zero pool authority

The authority arrow points one way, and safety comes from authority-stripping,
not gating:

- Doctrine and campaigns are drafted and amended **autonomously** by an agent
  from repository observables, with no human gate before a draft exists. User
  hints are optional bootstrap input, never required.
- Cartography artifacts carry **zero pool authority**. They MUST NOT gate,
  license, or substitute for any dig gate (survey scope, grade confirmation,
  output promotion), pool entry, or destructive decision. No doctrine claim —
  whatever its apparent strength — enters the pool directly; knowledge enters
  only as a graded, gated dig output.
- In the reverse direction: any flow citing doctrine or campaign content as a
  basis to skip a dig gate, promote an output, or delete behavior is making an
  invalid citation — refuse it. All pool mutation flows through the gated dig
  flow (`openspec/schemas/seedbed-excavation/`).

Cartography documents are living operational files — never change-shaped, never
archived, forever amendable. History and rollback are ordinary git.

## The doctrine — `doctrine.md`

One singular, revisable strategy document tailoring dig strategy to the
project's typology.

- **Layered shallow→deep.** Open with the cheapest useful map (what the project
  is, who consumes it, where the fog is thickest) and add depth only where
  campaigns need it. A doctrine that boils the ocean has failed its purpose.
- **Observable pointers are mandatory.** Every topology claim carries pointers
  to repository observables — paths, symbols, commands. A claim with no pointer
  is a guess and does not belong in the doctrine.
- **Revisable, not graded.** The doctrine has no grade machinery; pointers and
  revisability stand in for grades at this layer. Walking the map corrects it.
- **Amendments cite certified territory.** When digs certify ground (pool
  artifacts, negative certificates), the next amendment points at the certified
  territory instead of re-describing it in prose.

### Thread strategies

The doctrine organizes campaigns by pulling threads from **consumer
observables** — public API, rendered output, operational consumers — inward (the
Hyrum's-law rationale: visible surface underestimates real dependency). It MAY
additionally project intended knowledge through the Diátaxis quadrants
(tutorial, how-to, reference, explanation; Procida) in reverse: user stories →
named quadrant gaps → ordered driving questions.

Threads are parallelizable; record cross-cutting dependencies in the campaign
rather than discovering them twice. An influence-tree discontinuity — code no
visible consumer reaches — nominates an **elimination question** routed to the
dig flow; it is NEVER treated as proof of dead code (invisible consumers exist;
the dig's certificate machinery adjudicates deletion).

## Campaigns — `NN-campaign-<kind>.md`

A campaign is a numbered question backlog materializing the fog-of-war frontier:
contiguous, practical driving questions ("where did they eat?" → "how?").
Numbers are monotonic across the folder; `<kind>` is a free tag with named
examples — `onboarding`, `reference`, `elimination`, `drift` — until a second
adoption corroborates a fixed set.

### Question lifecycle

Each question holds exactly one state, each state with its pointer kind:

| State      | Meaning                       | Required pointer                    |
| ---------- | ----------------------------- | ----------------------------------- |
| `open`     | on the frontier, undug        | none                                |
| `in-dig`   | picked up for excavation      | the OpenSpec dig change             |
| `answered` | resolved by a promoted output | the pool artifact                   |
| `parked`   | deferred deliberately         | the idea record (`openspec/ideas/`) |

When a question is picked up, a dig change is scaffolded under the excavation
flow, the question moves to `in-dig` with the change pointer, and the dig's
survey cites the question as its driving question. Answering records the pool
pointer back in the campaign. Parked questions route to idea records — they
never rot in place.

### Gap classes — brownfield and greenfield alike

Campaigns admit gap questions from natively spec-driven projects, so the
cartography is a general cognitive-debt sink, not a brownfield-only instrument.
The admissible classes, at minimum:

- **spec-without-doc** — behavior specified, never documented for humans
- **doc-without-spec** — documented promises with no governing spec
- **behavior-without-either** — code doing un-spec'ed, un-documented work
- **doc↔behavior drift** — documentation and observed behavior disagree

On a spec-synced project with lagging docs, answers point at existing specs to
render rather than re-excavating behavior.

### Honest progress — no percentages

Progress is reported as **frontier burn-down** (questions resolved per campaign)
plus **pool accrual** (artifacts promoted). A completion percentage of total
un-spec'ed behavior MUST NOT be claimed — the denominator is unknowable by
design.

### Self-consumption — shrinkage is the goal state

Walking the map redraws and reduces it:

- An `answered` question collapses to one pointer line — question, state, pool
  pointer — dropping its working notes.
- A campaign whose frontier is empty (every question answered or parked) closes:
  mark it closed with a one-line accrual summary and keep the file as history.
- New unknowns surfaced by digs enter as new `open` questions or parked ideas —
  never as silently growing prose.
- Doctrine amendments record certified territory instead of restating it.

## Skeletons

Maps are per-project; no separate template files exist. Boot from these.

### `doctrine.md`

```markdown
# Archeology doctrine

<!-- Revisable strategy; zero pool authority. Every topology claim carries
observable pointers (paths, symbols, commands). Amend freely; git is history. -->

## Project typology

<!-- What this is, who consumes it, evidence classes available. Pointers. -->

## Consumer threads

<!-- Thread per consumer observable, pulled inward. Pointers per claim. -->

## Fog map

<!-- Where knowledge is thinnest; which campaigns cover it. -->

## Certified territory

<!-- Pointers to pool artifacts and certificates; do not re-describe them. -->

## Campaign roster

<!-- NN-campaign-<kind> — one line each: aim, status (active | closed). -->
```

### `NN-campaign-<kind>.md`

```markdown
# Campaign NN: <kind> — <aim>

<!-- Question backlog; zero pool authority. States: open | in-dig | answered |
parked, each with its pointer kind. Closed campaigns stay as history. -->

## Frontier

- [ ] Q1 (`open`) — <driving question>
- [ ] Q2 (`in-dig` → `openspec/changes/<dig>/`) — <driving question>

## Resolved

- [x] Q0 (`answered` → <pool artifact>) — <driving question>
- [x] Q3 (`parked` → `openspec/ideas/<id>.md`) — <driving question>

## Cross-cutting dependencies

<!-- Wires between threads/questions, recorded once. -->

## Accrual

<!-- Pool artifacts this campaign produced; closure line when frontier empties. -->
```
