# Seed prompts — staging area

A seed prompt is the human-authored input that ignites an OpenSpec change. This
directory is its waiting room: seeds live here while they are drafted,
discussed, redacted, or withheld — before any change exists.

Lifecycle: `staged → promoted → retired`. Promotion happens at proposal
creation; the integrity freeze happens at archival, folded into retirement — one
hard transition, no intermediate frozen state.

## Staging

- Path: `openspec/seed-prompts/<name>.<ext>` with `.html`, `.md`, and `.txt`
  supported. SpecMark tags are opt-in — the SpecMark reference ships with the
  agent/editor support surface at the installation anchor (`docs/specmark/`; in
  the Seedbed source repository, `specmark/`). Plain prose in any supported
  extension is equally valid — there is no conversion requirement and no warning
  for not using SpecMark.
- While staged, a seed is entirely human-controlled: iterate collaboratively,
  keep it untracked, redact it, or decline to commit it at all. Several
  engineers may refine one staged seed before the "big ingestion".

## Consent and privacy review

Promotion turns a seed into tracked change history. Before that happens:

- The author explicitly consents to promotion. No workflow gate may pressure an
  author to commit or reconstruct a seed; a change may legitimately proceed with
  no archived seed.
- A human reviews the seed for secrets and sensitive personal, client, or
  project data, and the redaction outcome is declared in metadata
  (`redaction: none` or a description of what was redacted). Do not assume an
  LLM provider or every future repository reader "has already seen it".
- Attachment pointers instead of payloads: a seed references large supporting
  material (logs, dumps) by pointer. Pointers must be credential-free and must
  say when the target is access-restricted.

## Promotion (at proposal creation)

When a proposal request explicitly names a staged seed, the proposal step
promotes it before writing the proposal:

1. `git mv` it to `openspec/changes/<change-id>/seed-prompt.<ext>`, preserving
   the extension and the content exactly. The promotion diff is a pure rename —
   zero content insertions or deletions, no co-riding edit; pending follow-up
   material is left for the human to append afterward.
2. Create `seed-prompt.meta.yaml` beside it with `schema_version: 2`,
   `state: promoted`, `source_path`, `promoted_at` (UTC ISO-8601), `redaction`,
   `context_policy` (initially `change-scoped`), and the recorded consent and
   secrets review. No content hash is recorded at promotion — the integrity
   boundary comes later, at archival retirement.

## Follow-ups (promoted, unarchived)

Hard rule first: an agent never writes a seed file, in any lifecycle state — no
append, repair, reflow, or verbatim transcription of text you supplied in chat.
Acting as your scribe is still writing; the promotion move above is the single,
content-identical exception. An agent handed follow-up intent in-session
**indicates**: it gives back append-ready text and where to put it, you perform
the write, and meanwhile it may treat your stated intent as confirmed planning
input without the file changing.

Until the change is archived, the promoted seed file is the single home for the
change's whole prompt history: the initial prompt plus every follow-up round
(cross-model reviews, corrections, mid-implementation dead-angle fixes).
Amendments are **append-only as an authoring/intent rule**: a human appends the
new round — wrapped in `s-FOLLOWUP` when using SpecMark (optionally with `stage`
recording when the round happened), or as a clearly appended section in freeform
prompts — and never silently revises previously ingested intent. This is not a
byte-prefix invariant: developer-reviewed repository formatting may reflow
earlier bytes. Follow-ups during `/openspec-apply-change` are first-class — apply is a
re-enterable action, and its learnings may flow back into the change's planning
artifacts.

Model-identity attributes (such as `llm`) may hold a `_` placeholder while
models ingest the seed, to avoid biasing model judgment; the archival pre-check
prompts the author once to restore the true values.

Traceability of this pre-archival window is ordinary git history under developer
diligence: committing after promotion and after each follow-up — with
formatting-only diffs kept separate — is recommended, never required.

Mid-pass discovery is checkpointed, not real-time: an agent already working the
change rechecks the seed tail and its Git state at turn start, before finalizing
durable planning artifacts or handing back, and at major artifact boundaries. A
complete round you have committed — or restated in the live session — counts as
confirmed planning input. A complete round that is still uncommitted is treated
as provisional steering: the agent announces it, uses it only for safe,
reversible, in-scope refinement, and labels the dependency at handoff until you
commit or confirm it. A round still being typed (an open `s-FOLLOWUP`, a
dangling section) is left alone: the agent continues from the last complete
round and never guesses or repairs your draft. No follow-up observed on disk
can, by itself, approve an ADR, resolve acceptance, expand authorization, or
trigger an external side effect — and the agent never edits the seed file.

The sidecar may gain an optional, free-form `implementation.llm_hint` during
apply — a coarse best-effort note of which model executed the implementation. It
is never parsed, required, or treated as exhaustive attribution.

## Integrity and formatting

An LLM never writes a seed payload in any lifecycle state — authoring,
rewriting, "professionalizing", and verbatim appending alike. Structural
feedback ("do my rationales have dead angles?") is legitimate assistance, and a
human performs any resulting edits.

Seed files are **not** excluded from repository formatting: a formatting pass
that touches a promoted or retired seed is developer-reviewed repository
maintenance, visible as an ordinary Git diff. For retired seeds the recorded
hash/blob remain the trail to the archived snapshot even when the working-tree
bytes have since been reformatted.

## Emergency redaction (post-promotion)

If sensitive data is discovered after promotion, a human removes it — never
preserve a secret to protect a checksum or the append-only convention. Before
archival there is no hash to maintain: redact, declare it in `redaction:`, and
move on. After retirement, the metadata must record the transition honestly:
keep the prior hash, and add the replacement hash, the date, and the human
reason. For example:

```yaml
content_sha256: <new-hash>
redaction:
  - redacted_at: 2026-08-01T12:00:00Z
    by: '<human>'
    reason: removed a leaked staging credential
    previous_sha256: <old-hash>
```

## Retirement at archive (freeze included) and explicit-only context

Archival is the one hard transition that officializes the seed prompt and ALL
its follow-up rounds, independently of when they were authored. The
`/openspec-archive-change` pre-check closes the seed in a single step: prompt the author to
restore any masked identity placeholders (a deliberately retained placeholder
retires as-is), compute `content_sha256` and the informational `git_blob`,
record `retired_at`, set `state: retired` and `context_policy: explicit-only`.
These identities name the archived snapshot — not a perpetual checksum claim
over a working-tree copy that may later receive reviewed maintenance formatting.
After retirement, authored intent is closed: new prompt material goes to a new
staged seed or a new change.

From then on, conforming agents (see the
[Seedbed schema guidance](../schemas/seedbed/AGENTS.md) and schema
instructions):

- MAY read `seed-prompt.meta.yaml` for routing;
- MUST NOT load the seed payload — in active changes or archives — unless the
  user explicitly requests seed or provenance review.

This is context hygiene, not secrecy: the payload stays in Git for humans and
for explicitly requested provenance work, but it no longer competes for LLM
attention by default.
