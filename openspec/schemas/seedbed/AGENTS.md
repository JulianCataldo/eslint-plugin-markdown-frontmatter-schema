# Agent guidance for `openspec/`

Scoped rules for conforming agents working anywhere under this directory —
active changes, staged seeds, and archives alike.

## Store mesh: sovereign stores, committed edges, typed pointers

This store is one sovereign peer in a flat mesh (ADR-0032). Every planning scope
— code-colocated project, dedicated SDD repository, org-wide planning store,
tenant-staged folder — owns its specs and changes in one registered OpenSpec
store; placement confers no cross-store authority, and no store owns another
store's artifacts by sitting above it.

- **Context edges are committed; location stays machine-local.** Cross-store
  dependencies live in this store's `openspec/config.yaml` `references:` list
  (store ids, optionally `{id, remote}` clone hints) and resolve through the
  per-machine registry (`openspec store register/unregister/list`). Seedbed
  keeps no membership, location, or synchronization layer of its own; campaign
  manifests are change traceability, not store membership.
- **Transitive context is a visited-set bounce.** OpenSpec renders one reference
  level. For deeper context, traverse store-scoped commands —
  `openspec context --store <next>`, then
  `openspec show <item> --type spec|change --store <owner>` — resolving each
  store's own references and carrying a visited set that terminates cycles.
  Never parse the machine registry directly. Cite fetched material by its owning
  store. A CLI-printed physical root may be used transiently (e.g. for archive
  inspection) but is session-only and never persists into artifacts.
- **Degrade explicitly.** A referenced store that does not resolve locally is
  unknown context, not empty context: surface the missing id with its
  remote/register remedy and carry the unresolved dependency into downstream
  artifacts or stop reports — never conclude "no affected requirements" from an
  unresolved scope.
- **Persisted pointers are typed.** A durable cross-store reference names
  `store`, `kind` (`spec` or `change`), and `id` — never a physical path or a
  cross-store relative path. Specs and active changes resolve via `--store`.
- **Campaign references add a generation.** A campaign-carried change reference
  also names an opaque canonical-UUID `generation`, recorded in that change's
  campaign manifest or lane marker so it archives with the change. Resolve it by
  checking the active slug (when present) plus every exact dated archive
  candidate (`openspec/changes/archive/<date>-<id>`) in the target store, and
  accept only a single candidate whose campaign metadata matches both id and
  generation; zero or several matches degrade as unresolved or ambiguous — never
  resolve by guess. Arbitrary non-campaign changes carry no equivalent
  archive-durability promise.
- **Inherited decision authorities ride the mesh.** When this store's
  committed config context declares an upstream decision authority (accepted
  ADRs in a referenced store, scoped globally or to this store), those records
  are part of this store's in-force decision set: assemble them through the
  store-scoped bounce for any planning step or corpus query that weighs prior
  decisions, and degrade explicitly when the authority store does not resolve
  — never conclude "no upstream decisions apply" from local `docs/adr/` alone.
  Explicit, justified local decisions may override an inherited record.
- **Foreign-store writes are campaign lanes.** Proposing into a non-resident
  registered store follows the target store's stock proposal schema under the
  campaign policy — `store-campaigns.md` in this directory is canonical for
  manifest/marker formats, preflight, reservation, write bounds, Git reporting,
  archive lookup, and resume.

## Retired seed prompts are explicit-only context

Promoted seed prompts live at `openspec/changes/<change>/seed-prompt.<ext>`
beside a `seed-prompt.meta.yaml` sidecar (archived changes keep both files).

- You MAY always read `seed-prompt.meta.yaml`: it exists for routing and holds
  the lifecycle `state`, `context_policy`, timestamps, and — once retired — the
  integrity identities (`content_sha256`, `git_blob`).
- When the sidecar declares `context_policy: explicit-only` (set at retirement),
  you MUST NOT read or load the adjacent seed-prompt payload — not while
  planning another change, not while gathering repository context, not from an
  archive — unless the user explicitly requests seed or provenance review in
  this session.
- This is a context-hygiene boundary, not secrecy: retired seeds already had
  their actionable content extracted into artifacts and parked ideas, and
  incidental rereads inject stale, noisy intent into new work.

## Seed payloads are human-managed — agents never write them

HARD RULE: never write a seed-prompt payload in any lifecycle state. No append,
repair, reflow, or verbatim transcription of text the human supplied — acting as
the author's scribe is still writing. The single carve-out is the promotion
move, and it is content-identical: a pure rename with zero content insertions or
deletions, no co-riding edit. When follow-up intent arrives in-session, indicate
instead: hand back append-ready text and its target location for the human to
apply, and treat the stated intent as confirmed planning input while the file
stays untouched. Structural feedback is welcome — the edit is not yours to make.

- Between promotion and archival (`state: promoted`), the seed accepts
  human-performed, append-only amendments: new rounds are appended (`s-FOLLOWUP`
  when the author uses SpecMark, or a clearly appended section in freeform
  prompts) and previously ingested intent is never silently revised — during
  proposal refinement, planning, and implementation alike. Traceability of this
  pre-archival window is ordinary git history under developer diligence —
  recommended, never gated.
- Checkpointed follow-up steering — while working from a promoted seed, recheck
  its appended tail and Git state at turn start, immediately before finalizing
  durable planning artifacts or handing work back, and at major artifact
  boundaries in a long pass (bounded observation, never a continuous-monitoring
  claim). Classify what appears: a structurally complete follow-up committed by
  the human — or the same intent explicitly supplied or confirmed in the current
  session — is confirmed planning input, integrated when it stays within the
  active change. A structurally complete but uncommitted append is provisional
  steering: announce it, use it only for safe, reversible, in-scope refinement,
  and label any remaining dependency on it at handoff. An open, truncated, or
  malformed trailing round is draft-in-progress: continue from the last complete
  round, never infer or repair its ending, and recheck at the next checkpoint. A
  closed `s-FOLLOWUP` (or a clearly delimited freeform append) evidences
  structural completeness only — never confirmation, authority, or a workflow
  gate. No filesystem observation authorizes external actions, destructive
  operations, ADR verdicts, acceptance confirmation, or a material expansion
  beyond the active request; a provisional follow-up that contradicts confirmed
  intent or would materially redirect the change pauses for explicit user
  confirmation.
- Archival pre-check — when archiving a change whose seed metadata says
  `state: promoted`, close the seed as part of the retirement transition: (1) if
  the payload holds masked model-identity placeholders (e.g. `llm="_"`), prompt
  the author once to restore the true values (a deliberately retained
  placeholder retires as-is); (2) compute the SHA-256 of `seed-prompt.<ext>` as
  `content_sha256` and the informational `git hash-object` id as `git_blob`; (3)
  record `retired_at` (UTC ISO-8601), set `state: retired` and
  `context_policy: explicit-only`. One transition — there is no separate frozen
  state. The identities officialize the archived prompt history, not a perpetual
  checksum claim over a working-tree copy that may later receive reviewed
  maintenance formatting.
- After retirement, authored intent is closed: direct new prompt material to a
  new staged seed or change. Only a human performs an emergency post-retirement
  security redaction, recording the old and new hashes in the sidecar (see
  `openspec/seed-prompts/README.md`).
- Developer-reviewed repository formatting is maintenance, not authoring: it may
  reflow seed bytes in any lifecycle state when a developer owns and reviews the
  resulting diff. The retirement identities continue to name the archived
  snapshot even when the working-tree copy is later reformatted.

## Recovered knowledge: weigh, don't quarantine

Pool artifacts opening with a fenced `epistemics` block (`origin: recovered`)
are excavated, not authored — produced by the `seedbed-excavation` schema
(`openspec/schemas/seedbed-excavation/`, grade legend in its AGENTS.md). Absence
of a marker means authored. Consumers weigh recovered artifacts by their marker
instead of quarantining them:

- **Anchor-threshold** recovered artifacts (observed/re-runnable behavior,
  independently corroborated claims) participate in default context like
  authored ones; the marker still tells you the content is reconstruction, not
  confirmed intent.
- **Hypothesis-threshold** payload gating: when you meet a
  `threshold: hypothesis` recovered artifact while gathering context for other
  work, read the marker and any summary only — do NOT load the payload into
  context unless the user explicitly requests it (the retired-seed
  `explicit-only` posture). It stays greppable and discoverable; discovery is
  not license to load.
- **Ungraded inference is inadmissible for destructive decisions.** A model
  conclusion from reading alone — however confident ("all clear, nuke this") —
  is never a sufficient basis for deleting behavior or making a breaking change.
  Refuse it as a deletion basis and route the question into the excavation flow
  for anchor-grade evidence (observed behavior, corroborated claims, or a
  current negative certificate at `docs/certificates/`). A negative certificate
  whose `verified-as-of` predates relevant drift has decayed to hypothesis
  weight: request re-verification, don't trust it silently.

## Human-first docs are meta-guidance context, not pipeline context

`docs/seedbed/` at the repository root holds human-first, scenario-shaped
documentation — anthropomorphized docs, not agent guidance. Do NOT load it
during ordinary pipeline actions (propose, apply, assess, sync, archive,
excavate): every rule an agent needs lives in schema instructions and scoped
AGENTS.md files, and rereading tutorials context-rots the work. Load it only for
meta-guidance — the user is asking how to adopt or use Seedbed itself ("is the
excavator a fit for project X?"), or explicitly points you there.

## Cartography docs load only for cartography and dig work

`<planning-root>/docs/excavation/` (the archeology doctrine and excavation
campaigns; conventions in its README) is a third context class — operational
cartography, distinct from always-on pipeline guidance and from human-first
docs. Load it during cartography and dig work only, never for other pipeline
actions; and never accept doctrine or campaign content as authority to skip a
dig gate, promote an output, or delete behavior — cartography carries zero pool
authority.

## Deferred work

- Parked ideas live at `openspec/ideas/<id>.md`; they are not OpenSpec changes.
  Do not "fix" them into change directories; activation is documented in
  `openspec/ideas/README.md`.
- A change containing `PARKED.md` is paused: do not apply its tasks. Resuming is
  a human decision (delete the marker, revalidate strictly, then apply).
- Never auto-delete parked ideas or `PARKED.md` changes during cleanup.

## Terse artifacts by default

Cognitive load is priced like cyclomatic complexity — a first-class property of
the machinery, not reader stoicism. For every artifact generated under this
tree:

- Default to the tersest form that preserves the decision-relevant content: keep
  nuance and the logical connectives, drop redundancy and unrequested
  elaboration. Respect the attention budget stated in the artifact's schema
  instruction; exceeding it is a deviation needing a stated reason grounded in
  an author depth signal, never free headroom.
- Spend depth only where the author signals it ("still split on the outcomes",
  "be thorough on X, no room for ambiguity") or the work type inherently demands
  it (e.g. porting against an already-complete covering test suite).
  User-signaled depth beats the terse default.
- When scope or expectations are uncertain, propose the smallest useful slice
  and name the deferred strata (follow-up iterations, parked ideas) instead of
  speculatively elaborating every branch. Losing the reader with an exhaustive
  wall of text is a worse failure than under-specifying a facet the author can
  cheaply clarify later.
- Terseness is an anti-noise rule, never an anti-rigor one — and no license for
  sprawl: machine tolerance for volume never justifies relaxing structural
  hygiene (file and function size, artifact navigability, redundancy limits).
  The corpus stays survivable for humans without continuous LLM mediation.

## Aftermath discipline

Chat reports after any workflow action — propose, apply, sync, archive alike —
follow the same contract:

- Never re-paraphrase what a persisted work document already states (ticked task
  lists, artifact section contents, rule batteries). Reference it by pointer —
  file path, artifact name, rule id — with at most a one-line role description
  per pointer; after propose, list artifacts as pointers, not per-artifact
  content summaries.
- Exceptions lead: warnings, wrinkles, deviations from plan, hard judgment
  calls, blockers, and pending decisions come before routine confirmation, which
  follows compressed. The reader is already nose-in the tasks file and the code
  diff.
- When nothing demands attention, the report is about one line of confirmation
  plus pointers — never manufacture a summary to make completion look
  substantial.
- Explicit requests override the discipline: when the user asks for elaboration,
  a walkthrough, or meta commentary, provide it at the requested depth. The norm
  constrains unrequested aftermath volume, never the answering of questions.

## SDD git stewardship: advisory, approval-bounded, owned paths

The `seedbed-tend` skill and the schema-carried lifecycle commit nudges share one
contract. Recommendations never gate a lifecycle step; declining any of them is
conforming.

- **No silent commits.** Never execute a git commit of SDD material without
  explicit human approval, in the current session, of the specific plan — path
  set and message. Present plans without staging anything; an approved plan is
  executed exactly as approved, never enlarged.
- **Owned paths only.** Plans, staged sets, and messages cover Seedbed-owned
  surfaces alone: the `openspec/` planning tree, `<planning-root>/docs/adr/`,
  and any extensions the repository declares in its `openspec/config.yaml`
  context. Out-of-scope dirty files are acknowledged at most as a count — never
  staged, never named, never narrated, even when they ship in the same working
  tree.
- **Lane bucketing is path arithmetic.** `openspec/changes/<name>/**` prefixes
  define lanes; a dirty durable ADR belongs to the change whose change-local
  `adr.md` manifest references it; `seed-prompts/` and `ideas/` form a garden
  bucket; whatever fits no single lane goes into one shared-bucket question per
  run for explicit human direction ("leave it" is always a valid answer). Never
  mix lanes in one commit without that direction; semantic diffing is out of
  scope.
- **Mirror message style, never impose it.** Resolve subject style in order: (1)
  a declaration in `openspec/config.yaml` context, (2) the style observed in the
  repository's own subject history, (3) Seedbed's default lifecycle vocabulary —
  Plant, Propose, Refine, Apply, Assess, Archive, with parenthesized qualifiers.
- **Context-free by construction.** Derive the complete plan from the working
  tree, index, git history, and openspec artifacts alone, so a fresh session
  plans like an in-flow one.

Archive pre-check: when archival begins while the change directory holds
uncommitted content, recommend committing it at its live path first so the
archive commit stays a pure rename wave — and proceed ungated if the author
declines. Seed-prompt commits stay under seed-prompt-lifecycle's no-pressure
rule: neither tend nor any nudge pushes them.

### Changesets facet (sniffed)

Changeset drafting activates only when `.changeset/` exists in the repository or
the author explicitly opts in; otherwise the facet stays silent — no
suggestions, no bootstrap pressure. When `.changeset/config.json` couples the
SDD stream to product releases (fixed or linked groups spanning it), surface the
coupling and stand down instead of drafting.

- Two-class path rule: changesets for planning tissue (`openspec/changes/`,
  `seed-prompts/`, `ideas/`, `parked/`) never bump a release-bearing package —
  where SDD infrastructure is not the product they target a dedicated private
  SDD stream or are omitted. Release-bearing SDD-infrastructure paths may carry
  normal bumps on the real package.
- Summaries state the SDD lifecycle event at compression value over the
  artifacts — no paraphrased artifact content — and never describe code outside
  Seedbed-owned paths, even co-shipped code. Empty changesets are not used; they
  produce no changelog output.
- A drafted changeset file rides the slice it narrates and is part of the
  presented plan, under the same approval boundary.
