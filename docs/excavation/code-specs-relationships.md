# Code→spec relationship annotations — trial convention

<!-- Detail companion to docs/adr/0001-code-spec-relationship-annotations.md.
Experimental probe, project-local; revisable between excavation slices under
human judgment. A differently shaped spec lands upstream in Seedbed once the
pattern is validated — deliberately NO local spec pipeline here. -->

## Tag vocabulary (draft grammar — moniker shape)

Code→SDD relationships are `@spec`/`@adr` tags carrying monikers, not
Markdown links — as JSDoc tags at declaration level, as `// @spec` line
comments at module and inline levels (see Placement):

- ``@spec `<spec-id>``` — the backticked spec id alone, no path or anchor.
  Sub-requirements/scenarios group under it, one per line, as
  `+ <verbatim heading text>` — prefixes ("Requirement:", "Scenario:")
  dropped; `+` reads like `-` in Markdown (hover renders it as a list) and
  fits better in raw JSDoc.
- `@adr <NNNN> — [<title>](<relative-path>.md)` — number-first, scanning like
  the familiar "ADR-123" idiom. Untouched by the moniker round; reshape when
  first used in practice.

Navigation contract (what replaces the links):

- Spec id → Cmd+P, paste, enter — lands on the spec file. Not quite an ID,
  close to a moniker.
- Sub-requirement → select the `+` line text, Cmd+Shift+F — lands on the
  exact spec section. Verbatim heading text is greppable; slugified anchors
  are not.

Trade-off, accepted: hover is less useful and bouncing is arguably slower, in
exchange for not littering code with ugly Markdown links.

The grammar is a napkin draft by design: refinement between slices is part of
the convention, not a violation of it. Earlier link-carrying and
comma-compaction ideas are superseded by moniker grouping (original shapes in
git history).

## Placement — shallowest-crisp across three levels

- **Module** — `// @spec` line comments at the top of the file, NOT a JSDoc
  block: the eternal JSDoc-parser problem — the block attaches to the next
  symbol, and module scope isn't meaningfully capturable even with
  `@module`. Same remedy as inline.
- **Declaration** — class/function JSDoc, the typical level.
- **Inline** — `// @spec` line comments (the `// @ts-expect-error` idiom),
  NOT JSDoc blocks: JSDoc attaches to the next symbol, which a mid-body
  stretch of statements doesn't meaningfully have. Loses hover, gains
  semantic honesty — and with links gone from the grammar, the hover loss is
  smaller than it was.

Annotate at the shallowest level that keeps the relationship crisp. Deeper
tags refine, never enumerate — exhaustive per-line tagging is the named
failure mode (noise defeats the purpose). A function fully covered by one
spec carries a single declaration-level tag.

Corollary: well-scoped functions ("clean code") admit granular req/scenario
mapping; giant scopes are not `// @spec` friendly — and that friction is a
symptom of an upstream cause, not this convention's problem to refactor.
When a stretch can't be mapped cleanly, fall back to grosser scoping (a bit
loose in the internal paths it covers is acceptable).

## Dual legibility — raw code AND hover render

Every form must stay legible in both surfaces: plain text in the source, and
Markdown rendered in VSCode hover popups. VSCode re-massages tag output (e.g.
inserts `—` after the tag name, reflows custom tags) — validate the grammar by
hovering a sample before first real use, and adjust if the render breaks
(e.g. a literal leading `—` in `@adr` colliding with the inserted one).
Moniker shape verified 2026-07-26 on `retrieveViolations` in src/validate.ts:
the popup shows ``*@spec* — `<spec-id>``` with the `+` lines rendered as a
Markdown bullet list.

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
