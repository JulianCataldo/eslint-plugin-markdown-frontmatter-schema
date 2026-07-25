# Proposal: code-specs-relationships

## Why

Excavated specs-after-the-fact need anchors back into the ~425-LOC code.
Decision-only probe: conventionalize `@spec`/`@adr` JSDoc annotations now,
validate the pattern on the first excavation round.

## What Changes

- docs/adr/0001-code-spec-relationship-annotations.md adopts the convention;
  details unrolled in docs/excavation/code-specs-relationships.md.
- ADR-only change: no spec pipeline (a differently shaped spec lands upstream
  in Seedbed once validated). Archive with `--skip-specs`.

## Capabilities

### New Capabilities

None — ADR-only experimental probe.

### Modified Capabilities

None.

## Impact

Docs only (`docs/adr/`, `docs/excavation/`, hook lines in
`openspec/config.yaml`); `src/` gains annotations later, per excavation
slice. No runtime impact.
