```epistemics
origin: recovered
reliability: B
corroboration: 2
threshold: anchor
provenance: openspec/changes/excavate-upstream-parity/claims.md#C1–#C21 (grades confirmed 2026-07-26, corroboration.md); evidence.md E1–E45
verified-as-of: 2026-07-26
```

<!-- Axis derivation: normative content and rationale draw on intent claims
C13–C21 (weakest confirmed: B2) and behavioral claims C1–C12 (A1); each axis
takes the weakest value used → B, 2. C22 (ajvOptions) is hypothesis-grade
and appears below ONLY as a flagged open question, never as rationale.
verified-as-of stamps the port-side contrast column of the appendix, which
drifts as the port evolves; the upstream column is frozen (immutable npm
artifact 3.15.3). -->

# ADR-0002: Port frontmatter-schema linting to ESLint; remark rule in dormancy

- Status: proposed
- Date: 2026-07-26
- Evidently decided circa: 2025–2026 (after upstream v3.15.4, 2023-10, and
  the abandoned modernization attempt E13/C12; port repo history starts
  2026, E36)
- Supersedes: none

## Context

Recovered, not authored: this backfilled record documents a decision
evidently already made; rationale is graded reconstruction from steward
testimony (E37–E44), period documents, and probes — see provenance.

`remark-lint-frontmatter-schema` (published to v3.15.4, 2023-10) validates
markdown frontmatter against JSON Schemas inside the remark/unified
ecosystem. By the steward's testimony, maintaining it there ran into
persistent friction: "remark has some issues and oddities, and is really
hard to maintain properly (IMHO), PRECISELY because of the loose ecosystem,
the need to bring ubiquitous linting helpers that are all considered
'standards' in ESLint" (E44). A local modernization attempt (dep bumps,
`index copy.ts`) stalled and left the checkout import-broken (C12); the
motivation loss came from "many minor issues that were unrelated to my core
endeavors" (E44). Meanwhile ESLint gained official markdown language support
(`@eslint/markdown`, E34).

## Decision

Evidently decided (corroborated by testimony, C21/C13/C14):

1. **Port the rule to ESLint** on `@eslint/markdown`, and **put the remark
   rule in dormancy** — "I put this rule in dormance, and took my learnings
   with me for the ESLint one" (E44). The port is the successor; upstream is
   a learnings corpus, not a maintained reference (C21).
2. **The parity target is language-server behavior, not upstream behavior**:
   the goal is near-1:1 developer common-expectations with VS Code JSON LS /
   RedHat YAML LS across `.json`/`.yaml`/`.md`, "plus our 'little extras'"
   (E37, C13). The port README's "The API is kept very similar" (E34)
   records surface continuity, not a binding upstream-parity contract.
3. **Schema ingestion is deferred, not carried**: upstream's ingestion
   surface (association, resolution, loading) was itself acknowledged
   struggling ("I struggled to materialize the full-scope of schema
   ingestion", E37; prior testimony E35), so the port carries a minimal
   de-facto version awaiting a "semi-clean-slate" redesign blueprinted on
   reverse-engineered LS specifications (C14). Prior shortcomings "don't
   indicate a capability constraining intent" (E37).
4. **Error surfacing gets a full repass** on ESLint's API capabilities; the
   port's unreported messageIds are retained as "aborted or miswired"
   attempt cues, not dead code (C15).
5. **Capability ceiling**: everything the AJV ecosystem allows as used by
   mainstream LSes, with `@apidevtools/json-schema-ref-parser` as the
   central ingestion piece ("étalon", E41, C18).

## Consequences

Observed (anchor, probe-backed):

- The behavioral divergence matrix below (C1–C12). Two port-era
  **regressions against intent**: repeated-compile crash classes from the
  singleton Ajv (C7 — upstream's per-call Ajv is crash-free) and point
  locations where real ranges "where working … initially" (C8/C19; PR #2
  restores them).
- One port-only **addition along intended direction**: remote `https://`
  schema fetching (C9/C18) — direction endorsed, implementation
  un-instrumented and non-ratified.
- **Carried parity**: format validation via ajv-formats with identical Ajv
  defaults (C11); silent recovery on malformed YAML (C5); silent skip of
  frontmatter-less files (E31, observed parity).
- **Deliberate drop**: `.remarkrc` find-up cwd discovery was a polyfill for
  a missing remark affordance (period comment E45); ESLint's own config
  resolution is expected to cover it (C20, verification flag open).

Standing consequences (testimony-backed, anchor):

- Upstream stays dormant; no upstream release is expected to change the
  reference corpus (C21). The abandoned modernization should not be
  completed ("Don't bother", E44).
- Deferred backlog inherited by the port: ingestion redesign (LS blueprint,
  C14), precedence redesign — neither upstream's embed-wins nor the port's
  inline-wins is a settled design (C16), `$schema`-in-payload resolution
  leaning to upstream's deletion pending LS behavior-mapping (C17),
  error-surfacing repass (C15), empty-frontmatter refinement (C4, E44).
- Campaign 03 adjudication: the `schemas` option and the unreported
  messageIds are **not** negative-certificate candidates — both are
  deferred/miswired intent (C14, C15). The glob-map's minimatch shape is
  already obsolete under ESLint ("null and void", E44).

Flagged open question (hypothesis, C22): whether an `ajvOptions`-style user
passthrough belongs to the port's intended surface — unaddressed by
testimony; do not treat as settled either way.

## Appendix — divergence matrix (upstream 3.15.3 vs port, 2026-07-26)

| Surface | Upstream 3.15.3 (frozen) | Port (drifts) | Intent status |
| --- | --- | --- | --- |
| Local `$schema` association | md-dir relative, remark-root fallback | md-dir relative only | carried de-facto; ingestion redesign zone (C14) |
| `schemas` glob map | working, minimatch vs remark cwd (C3) | declared, dead | deferred; shape obsolete (C14) |
| Embedded schema | `embed` | `defaultSchema` | carried renamed (C2) |
| Precedence | `embed` > local > glob (C2) | inline > `defaultSchema` | undesigned; redesign planned (C16) |
| `$schema` key in payload | deleted before validation (C1) | validated as payload | upstream endorsed, pending LS mapping (C17) |
| Remote URLs | none — mangles to local path (C9) | `https://` fetch branch | port addition, direction-aligned (C18) |
| Workspace cwd | `.remarkrc` find-up polyfill (E45) | dropped | deliberate (C20) |
| Malformed YAML | silent recovery; catch unreachable (C5) | silent recovery | parity; repass planned (C15) |
| Empty frontmatter | `embed` validates null; glob map skips (C4) | `schemaNotFound`/`schemaMalformed` split | known refinement area (E44) |
| Ajv lifecycle | fresh per call, crash-free (C7) | singleton; crash classes | port regression (C7) |
| Failure surfacing | soft in-band messages, full error text (C6) | stderr warn + generic id; compile crash | repass planned (C15) |
| Locations | real ranges, +1 fence offset (C8) | point locs; PR #2 restores | regression vs intent (C19) |
| Suggestion seeds | `enum` AND `const` (C8) | `enum` only | repass scope (C15) |
| `ajvOptions` | live passthrough (C10) | absent | hypothesis only (C22) |
| Formats | ajv-formats (C10) | ajv-formats, same defaults (C11) | carried parity |
| No frontmatter | silent skip (E10) | silent skip (E31) | observed parity |
