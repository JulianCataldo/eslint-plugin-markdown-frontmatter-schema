# Claims

<!-- Separate, attributed, revisable interpretation. Every claim points at
ledger entries and carries a two-axis grade per the legend in the excavation
schema's AGENTS.md. Grades proposed here are unconfirmed until a human
confirms them in corroboration.md. Intent inferred without testimony or
period documents is capped at hypothesis; observed, re-runnable behavior may
reach anchor. -->

All grades below are PROPOSALS pending the corroboration gate. Behavior
claims cite the locked characterization suite
(src/tests/runtime-contract.characterization.test.ts, E32/E33) — re-runnable
by `pnpm build && pnpm test` — plus the harness captures (E22–E31).

## C1

- Claim: A string inline `$schema` always wins over `options.defaultSchema`
  (`??` fallback); the default is consulted only when no usable inline value
  exists.
- By: Claude Fable 5 (dig agent)
- Evidence: E8, E10, E22 (q1-precedence-inline-vs-default), E32
- Falsified by: any lint where a valid string inline `$schema` is present
  but defaultSchema governs the reported errors
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C2

- Claim: Only the literal prefix `https://` routes an inline `$schema` to
  URL loading; `http://`, protocol-relative `//…`, and `file:` values all
  fall into local-path resolution against the markdown file's directory
  (with `resolve()` collapsing double slashes, e.g. `…/http:/…`), and an
  absolute POSIX path is used as-is.
- By: Claude Fable 5 (dig agent)
- Evidence: E8, E22 (q1-http-not-url, q1-protocol-relative, q1-file-url,
  q1-rel-path, q1-absolute-path), E28, E32
- Falsified by: an `http://` or `file:` value observed reaching the remote
  download path
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C3

- Claim: A non-string or empty-string inline `$schema` is silently ignored
  (falls through to the global schema or none), and when no schema data
  accompanies `schemaNotFound` the report renders the literal
  `{{schemaPath}}` placeholder to the user.
- By: Claude Fable 5 (dig agent)
- Evidence: E8, E22 (q1-nonstring-inline), E26 (q6-bare-error-no-schema),
  E30 (D-empty-string-inline), E32
- Falsified by: a run rendering a human-readable message for those inputs
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C4

- Claim: Malformed YAML frontmatter is never reported: the `yaml` parser
  recovers (tabs, unclosed flow, duplicate keys), `document.errors` is never
  read, and validation runs on the recovered object (duplicate keys:
  last-wins). No code path emits the declared `yamlSyntaxError` messageId.
- By: Claude Fable 5 (dig agent)
- Evidence: E29, E23, E30 (B-*), E11, E13, E32
- Falsified by: any input observed producing a `yamlSyntaxError` report, or
  a malformed-YAML input whose syntax problem surfaces in any report
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C5

- Claim: The rule parses the WHOLE markdown file as one YAML stream:
  frontmatter is the first document, the body becomes swallowed extra
  documents (`MULTIPLE_DOCS` error, unread), and this whole-file parse is
  what makes in-frontmatter offsets file-global and the reported locations
  land correctly.
- By: Claude Fable 5 (dig agent)
- Evidence: E10, E29 (A-parseFrontmatter:valid-with-body), E24
  (q4-offsets-multiline, q4-body-yaml-lookalike), E32
- Falsified by: body content observed affecting validation results, or a
  frontmatter-local parse producing the same offsets
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C6

- Claim: The validated object includes the `$schema` key itself, so any
  schema with `additionalProperties: false` fails at root on every file
  that uses inline association.
- By: Claude Fable 5 (dig agent)
- Evidence: E10, E24 (q4-schema-key-vs-apfalse), E32
- Falsified by: a lint where inline `$schema` plus
  `additionalProperties: false` passes
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C7

- Claim: Reported locations are point locations (start = end) at the
  offending value node when `document.getIn(instancePath)` resolves; root
  and unresolvable paths silently default to 1:1 (the opening fence) — the
  behavior consumers experience as "everything at Ln 1, Col 1". For
  duplicate keys the location points at the FIRST occurrence while
  validation used the LAST value.
- By: Claude Fable 5 (dig agent)
- Evidence: E11, E24 (q4-root-required-loc), E20, E30
  (B-dupkey-which-value-wins), E4, E32
- Falsified by: a root-level error reported away from 1:1, or a range-style
  loc (start ≠ end) from this pipeline
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C8

- Claim: ESLint suggestions are attached ONLY to enum violations — one
  `Replace with "<value>"` suggestion per allowed value, with absolute
  file-offset text ranges that are correct thanks to the whole-file parse
  (C5).
- By: Claude Fable 5 (dig agent)
- Evidence: E11, E25 (q5-enum-suggestions), E32
- Falsified by: a suggestion observed on any non-enum violation, or a wrong
  replacement range
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C9

- Claim: `meta.fixable: 'code'` is inert: no report ever attaches a `fix`,
  `--fix`/`verifyAndFix` leaves the text unchanged (`fixed: false`), so the
  README's "Auto-fix via `--fix`" claim does not describe current behavior.
- By: Claude Fable 5 (dig agent)
- Evidence: E13, E11, E25 (q5-verifyAndFix), E14, E32
- Falsified by: any `--fix` run modifying a file via this rule
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C10

- Claim: The options-shape contract at the edges is: no options → proceeds
  (schemaNotFound when nothing else provides a schema); `{}` or a
  `schemas`-only object → `schemaMalformed` ("Schema is malformed ", with
  trailing space) on every yaml node because `'defaultSchema' in options`
  yields `false` which falls into the malformed guard; a STRING
  `defaultSchema` never reaches the rule — ESLint flat-config options
  validation rejects it at config time ("should be object") per
  `meta.schema`, making `parseGlobalSchema`'s string branch unreachable
  under standard config validation. The declared `schemas` glob-map option
  is read nowhere.
- By: Claude Fable 5 (dig agent)
- Evidence: E9, E13, E26, E19, E32
- Falsified by: a standard flat-config run where a string `defaultSchema`
  reaches `parseGlobalSchema`, or where `schemas` affects any behavior
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C11

- Claim: Schema loading has zero memoization at every layer: each
  `getSchema` call round-trips the synckit worker (N files → N bundle
  calls; relinting the same file → a new call; an object `defaultSchema` →
  one round-trip per file), and because the worker creates fresh
  `$RefParser.bundle` state per call, remote schemas are re-downloaded per
  linted file per pass (fetch count itself not instrumented; inferred from
  per-call counts plus worker source).
- By: Claude Fable 5 (dig agent)
- Evidence: E31, E12, E18
- Falsified by: a second lint of the same schema observed skipping the
  worker call, or an observed fetch count lower than the bundle-call count
- Grade: A2 — anchor (the un-instrumented fetch-count inference is why
  corroboration is 2, not 1)
- Verified-as-of: 2026-07-26

## C12

- Claim: All loader failures (missing file, unparseable schema, network
  refusal) degrade to `console.warn` on stderr — invisible to ESLint — plus
  a generic `schemaNotFound` report; schema files are parsed as YAML (JSON
  as a subset), so YAML-format schema files load and validate (undocumented
  capability) and malformed JSON produces YAML-flavored parse warnings.
- By: Claude Fable 5 (dig agent)
- Evidence: E12, E28, E30 (C-yaml-schema-file), E32
- Falsified by: a loader failure surfacing as a distinct ESLint report, or
  a YAML-format schema failing to load
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C13

- Claim: The module-singleton Ajv plus per-call `compile` crashes the lint
  run on real-world schemas: a second compile of any `$id`-carrying schema
  (second file, or relint of the SAME file, e.g. IDE save) throws `schema
  with key or id "…" already exists`, and any schema declaring the
  draft-2020-12 meta-schema throws `no schema with key or ref …`. Both
  surface as rule crashes, not reports.
- By: Claude Fable 5 (dig agent)
- Evidence: E11, E27, E32
- Falsified by: repeated lints of an `$id` schema completing without a
  throw on this code
- Grade: A1 — anchor
- Verified-as-of: 2026-07-26

## C14

- Claim: The schema-ingestion area (options guards, resolution edge cases,
  loader silence) is NOT ratified design: the author declares it accidental
  ("murky", "I screwed up", "semi clean slate"), produced without
  disciplined design or testing — so its observed behavior must not be
  promoted as intended contract, only as a de-facto snapshot.
- By: Julian Cataldo (witness); interpretation by Claude Fable 5 (dig agent)
- Evidence: E1, E2, E3 (testimony); consistent with E22/E26/E27/E31
- Falsified by: period documents or testimony showing these edge behaviors
  were deliberately designed
- Grade: B1 — anchor (first-hand author testimony, corroborated by the
  observed edge chaos)

## C15

- Claim: Author intent for error reporting is real-location mapping: the
  "everything at Ln 1, Col 1" root-error behavior (C7) is an acknowledged
  bug, not intent — owner reply on issue #1 ("That's a bug … Should be
  correctly mapped at real location"), the `bug` label, and community PR #2
  targeting exactly that.
- By: Julian Cataldo (witness, 2025-10-13); VityaSchel and kirbysayshi
  (external witnesses via tracker); interpretation by Claude Fable 5
- Evidence: E4, E5, E6
- Falsified by: testimony that 1:1 root reporting was a deliberate choice
- Grade: B1 — anchor

## C16

- Claim: The `defaultSchema`-rejects-paths trap (C10's config-time
  rejection) is consumer-visible in the wild — reported by VityaSchel in
  issue #1 ("throws 'expected object'"), reproduced here as the ESLint
  config error "should be object", and left unaddressed by PR #2.
- By: VityaSchel (witness, 2025-10-12); interpretation by Claude Fable 5
- Evidence: E4, E6, E7, E26 (q6-string-defaultSchema)
- Falsified by: a released version accepting string paths, or evidence the
  issue report concerned a different option
- Grade: B1 — anchor
