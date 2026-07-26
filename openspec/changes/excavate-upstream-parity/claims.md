# Claims

<!-- Separate, attributed, revisable interpretation. Every claim points at
ledger entries and carries a two-axis grade per the legend in the excavation
schema's AGENTS.md. Grades proposed here are unconfirmed until a human
confirms them in corroboration.md. Intent inferred without testimony or
period documents is capped at hypothesis; observed, re-runnable behavior may
reach anchor. -->

Claims C1–C12 are behavioral (the divergence matrix, probe-anchored against
the immutable npm artifact `remark-lint-frontmatter-schema@3.15.3`); claims
C13–C22 are the intent map (testimony-led). Port-side behavior cited for
contrast comes from the filed spec
`openspec/specs/rule-runtime-contract/spec.md` and is not re-claimed here.

## C1

- Claim: Upstream removes a local `$schema` key from the frontmatter object
  before validation; a document whose only undeclared key is `$schema`
  passes an `additionalProperties: false` schema. (Port contrast: the key is
  validated as payload.)
- By: model (dig agent), interpreting code + probe
- Evidence: E4, E15
- Falsified by: a re-run of probe U1 against `3.15.3` reporting an
  additional-properties violation
- Grade: A1 — anchor

## C2

- Claim: Upstream schema-source precedence is `embed` > local `$schema` >
  `schemas` glob map. (Port contrast: inline `$schema` > `defaultSchema`,
  glob map dead — the default/inline relationship is inverted.)
- By: model (dig agent)
- Evidence: E6, E16, E24
- Falsified by: a re-run of U2/U8b where the local schema's violations win
  over `embed`'s, or the glob map's over a local `$schema`
- Grade: A1 — anchor

## C3

- Claim: The upstream `schemas` glob map is a working feature: minimatch
  association of remark-cwd-relative md paths to schema paths, validated and
  reported with the absolute joined schema path.
- By: model (dig agent)
- Evidence: E5, E23
- Falsified by: U8 re-run producing no message
- Grade: A1 — anchor

## C4

- Claim: Empty frontmatter behaves asymmetrically upstream: with `embed` the
  `null` payload is validated ("Must be object" at the 1:1 fence); a
  glob-mapped file with empty frontmatter is silently never validated (the
  association block is guarded by `yamlJS` truthiness).
- By: model (dig agent)
- Evidence: E26, E27, E5
- Falsified by: U10/U10b re-runs showing symmetric behavior
- Grade: A1 — anchor

## C5

- Claim: Upstream's YAML parse-error report path is unreachable for common
  malformed input — the recovering parser yields a best-effort object that
  validates silently (tab-indent recovered, duplicate keys last-wins). This
  is behavioral parity with the port's never-reported malformed YAML.
- By: model (dig agent)
- Evidence: E17, E18, E8
- Falsified by: any common malformed-YAML input that fires the
  `YAML frontmatter parsing:` banner
- Grade: A1 — anchor

## C6

- Claim: Upstream degrades schema-load failures and Ajv compile failures to
  per-file in-band vFile messages (full resolver/compiler error text, run
  continues, nothing on stderr). (Port contrast: loader failure → stderr
  warn + generic `schemaNotFound`; compile failure → uncaught crash.)
- By: model (dig agent)
- Evidence: E22, E25, E29, E8
- Falsified by: U7/U9/U12 re-runs throwing or writing to stderr
- Grade: A1 — anchor

## C7

- Claim: Upstream is crash-free across repeated compiles of an
  `$id`-carrying schema because it builds a fresh Ajv per validated file.
  (Port contrast: module-singleton Ajv with locked crash classes.) The
  port's crash classes are a port-era regression, not inherited behavior.
- By: model (dig agent)
- Evidence: E7, E21
- Falsified by: U6a–c re-run crashing on the second compile
- Grade: A1 — anchor

## C8

- Claim: Upstream reports real start+end squiggle ranges (+1 fence offset)
  with `actual`, a multi-line `note`, and populates suggestion seeds
  (`message.expected`) for BOTH `enum` and `const` violations. (Port
  contrast: point locations, enum-only suggestions.)
- By: model (dig agent)
- Evidence: E9, E19, E20
- Falsified by: U4/U5 re-runs lacking end positions or `const` expected
  values
- Grade: A1 — anchor

## C9

- Claim: No remote schema loading exists upstream: an `https://` `$schema`
  is path-joined into a local path (collapsing `//`) and fails as a missing
  file. The port's `https://` fetch branch is a port-only addition.
- By: model (dig agent)
- Evidence: E3, E25
- Falsified by: U9 re-run performing a network fetch
- Grade: A1 — anchor

## C10

- Claim: Upstream exposes a live `ajvOptions` passthrough (probe:
  `allErrors:false` honored) and validates `format` keywords via
  ajv-formats.
- By: model (dig agent)
- Evidence: E30, E28, E7
- Falsified by: U13b re-run still reporting two messages
- Grade: A1 — anchor

## C11

- Claim: The port validates `format` keywords identically at the keyword
  level (ajv-formats and the same Ajv defaults carried); fidelity differs
  only in location shape (port point 3:7–3:7 vs upstream range 3:7–3:17 on
  the same input). Format validation is carried parity, not a gap.
- By: model (dig agent)
- Evidence: E32, E33, E28
- Falsified by: the port probe reporting no message or an unknown-format
  crash
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C12

- Claim: The local upstream checkout is import-broken mid-migration
  (minimatch default-import against installed v10) and its history predates
  the published 3.15.4, whose entire dist delta is the minimatch named
  import plus a `?.type === 'yaml'` gating hardening, with exact-pinned
  deps.
- By: model (dig agent)
- Evidence: E14, E11, E1, E12, E13
- Falsified by: the local dist importing cleanly, or a 3.15.4 tarball diff
  showing other behavioral changes
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C13

- Claim: The port's governing parity target is mainstream language-server
  behavior (VS Code JSON LS, RedHat YAML LS) — near-1:1 developer
  common-expectations across `.json`/`.yaml`/`.md` plus deliberate extras —
  NOT upstream-remark behavior. Upstream is a learnings source, not the
  reference; the README's "API is kept very similar" describes surface
  continuity, not an intent oracle.
- By: model (dig agent), interpreting witness testimony (Julian Cataldo)
- Evidence: E37, E44, E40, E41, E34, E35
- Falsified by: steward testimony or period documents establishing
  upstream-remark behavior as the binding reference
- Grade: B1 — anchor (multiple convergent testimony statements plus prior
  recorded testimony E35)

## C14

- Claim: The dead `schemas` option is consciously deferred capability, not
  abandonware: per-glob association is wanted (LS-style), but its
  materialization awaits a semi-clean-slate schema-ingestion redesign
  blueprinted on reverse-engineered LS specifications — and its
  minimatch-shaped form is already obsolete ("the `minimatch` reliance is
  null and void" under ESLint).
- By: model (dig agent), interpreting witness testimony
- Evidence: E37, E44, E2, E23
- Falsified by: steward decision to drop glob association from the roadmap,
  or an implemented replacement contradicting the deferral story
- Grade: B2 — anchor

## C15

- Claim: The port's unreported messageIds (`yamlSyntaxError`,
  `fixDescription`) are "aborted or miswired" attempts retained as cues for
  a planned full error-surfacing repass over ESLint's API capabilities —
  explicitly not authoritative, and explicitly not dead code to delete.
- By: model (dig agent), interpreting witness testimony
- Evidence: E38, E5, E8
- Falsified by: steward decision to remove them, or an error-surfacing
  redesign that discards syntax-error reporting
- Grade: B2 — anchor

## C16

- Claim: No settled precedence design carried between the packages: the
  upstream `embed`-wins vs port inline-wins inversion (C2) reflects an
  undesigned area slated for scenario-driven redesign ("most sensible
  default … most ergonomic customization handles"), not a deliberate
  semantic decision either way.
- By: model (dig agent), interpreting witness testimony
- Evidence: E39, E16
- Falsified by: a period document (commit, note) showing the port's `??`
  precedence was a considered decision
- Grade: B2 — anchor

## C17

- Claim: On `$schema`-in-payload the steward sides with upstream's deletion
  ("Upstream seems to be in the right, there"), pending LS behavior-mapping;
  the port's validate-the-key behavior is an acknowledged likely-defect
  inside the non-ratified ingestion zone, and LS association idioms (JSON LS
  `$schema` key, YAML LS magic comment) are the cue set for the redesign.
- By: model (dig agent), interpreting witness testimony
- Evidence: E40, E4, E15
- Falsified by: behavior-mapping showing mainstream LSes validate the
  association key as payload
- Grade: B2 — anchor

## C18

- Claim: The capability ceiling intent is "everything the AJV ecosystem
  allows, as used by mainstream LSes", with
  `@apidevtools/json-schema-ref-parser` as a deliberate central piece
  (steward: "étalon"); the port's remote-`https://` addition points along
  this intended direction (its current implementation remains
  un-instrumented and non-ratified).
- By: model (dig agent), interpreting witness testimony
- Evidence: E41, E33, E25
- Falsified by: steward decision to bound capabilities below AJV's surface
  or to drop ref-parser as the ingestion engine
- Grade: B2 — anchor

## C19

- Claim: Real start+end ranges are original authored intent that worked
  upstream ("ranges where working when I built this tool, initially"); the
  port's point locations are an unintended loss ("holes in the racket"), and
  PR #2 restores intended behavior rather than adding a feature.
- By: model (dig agent), interpreting witness testimony
- Evidence: E42, E19, E36, E35
- Falsified by: evidence the port's point locations were a chosen
  simplification (e.g. a port-era note to that effect)
- Grade: B1 — anchor (testimony + independently observed upstream behavior
  + prior-dig intent delta converge)

## C20

- Claim: The find-up `.remarkrc` cwd machinery was a polyfill for a missing
  remark-platform affordance and its drop in the port is deliberate
  architecture: ESLint's own nearest-config resolution is expected to supply
  the workspace cwd ("It's not really the work of a rule to do this"; open
  verification flag on ESLint's actual cwd semantics).
- By: model (dig agent), interpreting witness testimony + period document
- Evidence: E43, E45, E5
- Falsified by: ESLint cwd semantics proving insufficient AND the steward
  reinstating rule-side config walking
- Grade: B1 — anchor (contemporary testimony + authoring-time period
  comment are independent)

## C21

- Claim: Upstream `remark-lint-frontmatter-schema` is deliberately dormant
  and the ESLint port is its designated successor ("I put this rule in
  dormance, and took my learnings with me"); the uncommitted modernization
  is an abandoned attempt whose cause was remark-ecosystem maintenance
  friction, not feature failure — so revival is unlikely while that context
  holds, and empty-frontmatter handling is a known empirical refinement
  area carried into the port's backlog.
- By: model (dig agent), interpreting witness testimony
- Evidence: E44, E13, E14, E1
- Falsified by: a new upstream release or steward re-investment in the
  remark rule
- Grade: B1 — anchor (testimony + broken tree + npm/VCS timeline are
  independent)
- Verified-as-of: 2026-07-26

## C22

- Claim: An `ajvOptions`-style user passthrough is probably within the
  port's intended capability surface — inferred by bridging C18's
  "everything AJV allows" direction with upstream's live passthrough — but
  no testimony or period document addresses it directly (TR7's ajvOptions
  half went unanswered).
- By: model (dig agent), inference only
- Evidence: E30, E41, E43
- Falsified by: steward testimony either way
- Grade: B3 — hypothesis (intent by inference alone; capped until
  corroborated)
