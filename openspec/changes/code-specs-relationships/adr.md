# ADR Review Manifest

## ADR Review Completed

- Date: 2026-07-26
- Reviewer: agent (Claude) — artifact distillation only; human decision
  approval pending
- Change: code-specs-relationships

## In-Force ADR Context Reviewed

- None: no existing durable ADRs were present under docs/adr/ (README only).

## Durable ADRs Created

- docs/adr/0001-code-spec-relationship-annotations.md - adopts the
  `@spec`/`@adr` JSDoc annotation convention with mandatory excavation/apply
  post-processing hooks; details unrolled in the companion
  docs/excavation/code-specs-relationships.md. Status: proposed, awaiting
  human review.

## Notes

- Distillation completed; the durable ADR awaits an independent human
  accept/reject recorded in its status block. It is not an in-force
  constraint until accepted.
- The companion detail doc stays revisable between slices; the ADR freezes
  on acceptance.
