# Architecture Decision Records

Durable decisions live under `docs/adr/` as `NNNN-kebab-title.md` (MADR-short:
title, status block, context, decision, consequences). Sequence numbers are
monotonic across the repository and never reused. This installed file is the
self-contained normative lifecycle and adoption-boundary reference.

## States

- **proposed** — distilled (by an agent or a human) but not yet decided. A
  proposed ADR is its own review object; there is no separate ADR RFC directory,
  and file creation never implies approval.
- **accepted** — a human recorded acceptance. In force unless superseded.
- **rejected** — a human declined it. It stays as discoverable history and is
  never a constraint.
- **superseded** — an accepted ADR that a _later accepted_ ADR names in its
  `Supersedes:` field. Historical context only.

## Pre-Seedbed ADRs are grandfathered

The ADR inventory present before Seedbed adoption is legacy decision history.
Brownfield adoption records its recursive paths and identities in
`openspec/seedbed.adoption.json`; membership in that reviewed boundary, not a
future agent's guess, determines grandfathering. Preserve every listed file
byte-for-byte; do not retrofit Seedbed status blocks, capitalization, dates,
reviewer identities, filenames, or prose structure. If no adoption boundary
exists, no grandfather exception is inferred.

For this legacy inventory only, interpret status metadata case-insensitively and
with regard for the record's existing format. Accepted records remain accepted
without `Decided:`; a genuinely status-less record is treated as accepted unless
it clearly identifies itself as proposed, draft, rejected, or superseded.
Alternative metadata such as `Owners:` remains informative. When a legacy record
is genuinely ambiguous, preserve it and ask a human how it constrains the
current work rather than rewriting it or manufacturing certainty.

Seedbed's status-block contract below applies to ADRs created after adoption. To
revisit a grandfathered record—or decide a legacy proposed/draft record—add a
new Seedbed-conforming ADR that references or supersedes it; never edit the
legacy file merely to normalize it.

## Independent human review

Each proposed ADR receives its own outcome — `accepted` or `rejected` — with the
reviewer's identity and the decision date recorded in its status block:

```markdown
- Status: accepted
- Date: 2026-07-12 <!-- creation date -->
- Decided: 2026-07-15 by <reviewer>
- Supersedes: none
```

Reviewing one ADR never batch-approves the others in its change; mixed outcomes
across one change's ADR set are valid and expected.

## Immutability

Once accepted, an ADR file is frozen — no edits to status, dates, decision, or
consequences, ever. To change an accepted decision, write a **new** ADR with the
next sequence number, set its `Supersedes:` field to the prior record, and get
it accepted; the prior file stays byte-for-byte unchanged. (The single exception
that touches a proposed file is recording its review outcome — that edit is the
acceptance/rejection itself.)

## What is in force

Only accepted ADRs not superseded by a later accepted ADR constrain new designs.
To gather the in-force set: list every ADR, keep the accepted ones, then drop
any that a later accepted ADR's `Supersedes:` field points at. Proposed and
rejected records are context, not commitments — designs must not treat them as
live constraints.

Change-local review manifests (`openspec/changes/<change>/adr.md`) report which
stage completed: artifact distillation is separate from human decision approval,
and wording like "review completed" must say which one it means.
