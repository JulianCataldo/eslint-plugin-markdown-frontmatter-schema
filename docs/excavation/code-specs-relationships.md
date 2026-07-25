# Code→spec relationship annotations — trial convention

<!-- Detail companion to docs/adr/0001-code-spec-relationship-annotations.md.
Experimental probe, project-local; revisable between excavation slices under
human judgment. A differently shaped spec lands upstream in Seedbed once the
pattern is validated — deliberately NO local spec pipeline here. -->

## Tag vocabulary (draft grammar)

Code→SDD relationships are JSDoc tags carrying Markdown links:

- ``@spec [`<spec-id>`](<relative-path>.md)`` — optionally `#sub-section`
  anchored; label is the backticked spec id (short, reads well raw and
  rendered).
- `@adr <NNNN> — [<title>](<relative-path>.md)` — number-first, scanning like
  the familiar "ADR-123" idiom.

The grammar is a napkin draft by design: refinement between slices is part of
the convention, not a violation of it. Multi-spec compaction (comma-separated
ids in one tag) is left to practice.

## Placement — shallowest-crisp across three levels

- **Module** — file-level JSDoc for file-wide governance.
- **Declaration** — class/function JSDoc, the typical level.
- **Inline** — `/** @spec ... */` on a statement implementing a distinct spec
  sub-section.

Annotate at the shallowest level that keeps the relationship crisp. Deeper
tags refine, never enumerate — exhaustive per-line tagging is the named
failure mode (noise defeats the purpose). A function fully covered by one
spec carries a single declaration-level tag.

## Dual legibility — raw code AND hover render

Every form must stay legible in both surfaces: plain text in the source, and
Markdown rendered in VSCode hover popups. VSCode re-massages tag output (e.g.
inserts `—` after the tag name, reflows custom tags) — validate the grammar by
hovering a sample before first real use, and adjust if the render breaks
(e.g. a literal leading `—` in `@adr` colliding with the inserted one).

## Workflow hooks — mappings land in the motivating diff

- **Excavation post-processing**: when a dig slice promotes a spec to the
  pool, annotate the code it governs before the slice closes
  (1 spec excavated => reference it in code, then next slice).
- **Apply post-processing**: when an OpenSpec apply writes or modifies code,
  record/update the touched code's relationships in the same apply pass, not
  as deferred cleanup.

Human diff review is the only gate: each annotation is validated (or
rejected/reshaped) while diffing. No enforcement tooling, no coverage
percentage — on this compact codebase the endgame claim is a human-judged
"all bits of code covered".

## Trial posture

Project-local experimental probe. Known trade-offs: the codebase gets
arguably uglier (Markdown brackets, relative paths); links can rot on file
moves; accumulated noise after full excavation may erode value — that
reassessment is deliberately deferred. Generalizing into a portable opt-in
tracking system (and the upstream Seedbed spec) waits on the trial verdict.
