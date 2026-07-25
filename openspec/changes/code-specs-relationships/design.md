# Design: code-specs-relationships

ADR-only probe: the decision and its details are self-contained in
docs/adr/0001-code-spec-relationship-annotations.md +
docs/excavation/code-specs-relationships.md. This file records only the
shape choices.

## Context

No excavation yet (cartography only), no in-force local ADRs. Original
architect available to validate the pattern by diffing.

## Goals / Non-Goals

**Goals:** conventionalized code→spec JSDoc mapping, hooked as
post-processing into excavation slices and apply passes.

**Non-Goals:** local spec pipeline (upstream Seedbed spec later),
enforcement tooling, syntax finalization, the portable tracking system.

## Decisions

- **ADR-as-pointer**: the ADR stays frozen once accepted; the companion doc
  in docs/excavation/ stays revisable between slices — matching the
  napkin-draft posture.
- **Hooks via store guidance**: pointer lines in `openspec/config.yaml`
  `context:` (reaches every future dig/apply session) rather than editing
  installed schema files, which would drift on upstream updates.
- **Archive shape**: `openspec archive --skip-specs` (doc-only change);
  `validate`'s zero-delta error is expected and accepted.

## Risks / Trade-offs

- [Annotation noise erodes value after full excavation] → convention
  revisable between slices; reassessment deliberately deferred.
- [Relative links rot] → compact codebase, diff review catches it.
