---
name: openspec-sb-multi-propose
description:
  Hosts a multi-store proposal campaign from the invoking store — read-only
  all-target preflight, host-first durable reservation with generation-bound
  lane markers, then the stock store-scoped proposal flow for the host and
  every lane, with resumable partial failure. Thin entrypoint — the campaign
  policy lives in the Seedbed schema (store-campaigns.md). Proposals only;
  never apply, commits, or code edits.
---

# Multi-store proposal campaign

Use this skill as a thin entrypoint. The canonical campaign policy — manifest
and marker schema version 1, the validation battery, preflight checks, write
bounds, Git reporting, archive-aware lookup, and failure/resume rules — lives
in the invoking store's `openspec/schemas/seedbed/store-campaigns.md`, and
each target store's own Seedbed schema governs its lane. Load and follow
those; never fork policy here.

## Procedure

1. **Resolve stores.** Run `openspec store list --json`. Identify the invoking
   (host) store and every target store id. Keep canonical `--store <id>` on
   every store-touching command, for the host exactly like every lane.
2. **Read policy and context.** Read the host store's
   `openspec/schemas/seedbed/store-campaigns.md` and the "Store mesh" section
   of its `openspec/schemas/seedbed/AGENTS.md`. Assemble host context
   (`openspec context --store <host>`) and confirm every target is reachable
   through the host's committed reference graph (visited-set bounce; an
   unresolved store degrades explicitly and blocks that lane).
3. **Decompose and allocate.** Draft the campaign: host change id, one child
   per target — `{store, change, generation, role, depends?}` — with fresh
   canonical UUID generations for the campaign and every child, pairwise
   distinct, dependencies acyclic and naming manifest entries only.
4. **Preflight read-only — all targets, zero writes.** Validate the draft
   manifest and run every preflight check in the policy: registry resolution,
   active-id collisions, reused generations across active plus dated archive
   candidates, and every output path known at decomposition. Capture each
   store's Git report (registered root; enclosing worktree branch and dirty
   pre-state, or `not-git-backed`). On any failure, report every blocking
   lane and graph error and stop — no store is written.
5. **Reserve durably — host first.** Atomically publish the fresh
   stock-schema host scaffold with its complete `child-changes.yaml`; then
   atomically publish each child scaffold with its generation-bound
   `campaign-lane.yaml` marker. Reservation is complete only when every
   declared marker exists and matches its pre-allocated identity; no final
   reservation path may be observable without its generation metadata.
6. **Generate stock artifacts.** Only after reservation completes anywhere,
   run the stock proposal flow for the host and each lane with `--store <id>`
   in that store's schema artifact order, augmented only by the campaign
   brief, sibling typed identities, marker, and back-pointer. Preflight any
   newly determined external output (for example a proposed durable ADR path)
   before writing it; install outputs atomically per file. Lanes that do not
   share an enclosing Git worktree may run in parallel; serialize every
   host/lane flow that shares one worktree so numbering and state reports
   stay deterministic.
7. **Report.** Name every created path per store, each Git pre-state report,
   and every failed, blocked, or unstarted host/lane flow. Never roll back
   foreign trees.

## Resume after partial failure

Rerun the skill with the same campaign. Verify the existing host directory is
the matching-generation reservation — anything else is a collision to report,
never to attach to. For each lane whose marker matches its manifest identity:
create only the missing declared outputs, leave already valid outputs
byte-untouched, and report an incomplete or invalid existing output as a
conflict, never a silent repair. Never write lifecycle status anywhere; derive
lane state (active, archived, unresolved, ambiguous) by the policy's
active-plus-archive resolution.

## Bounds

Proposals only: no implementation code edits, no commits, no foreign
`references:` edits, no overwriting paths that predate reservation or belong
to another generation, and no multi-store apply. Committing results stays a
human decision (the seedbed-tend skill drafts scoped slices on request).
