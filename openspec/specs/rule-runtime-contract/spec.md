```epistemics
origin: recovered
reliability: B
corroboration: 2
threshold: anchor
provenance: openspec/changes/excavate-rule-runtime-contract/claims.md#C1–#C16
  (grades confirmed by the steward in corroboration.md, 2026-07-26)
verified-as-of: 2026-07-26
```

<!-- Axis derivation: normative content rests on C1–C13 (A1/A2, observed +
re-runnable); intent-status annotations rest on C14–C16 (B1, testimony/period
documents). Weakest reliability used = B, weakest corroboration used = 2
(C11's un-instrumented fetch-count inference). B ∧ 2 ⇒ anchor threshold.
Verified-as-of retained: behavior decays with any change to src/. -->

# rule-runtime-contract

The de-facto runtime contract of the single rule
`frontmatter-schema/frontmatter-schema` (schema resolution, loading,
frontmatter parsing, validated payload, reporting, suggestions, options
edges), recovered by characterization in dig
`excavate-rule-runtime-contract` (campaign 01, Q1–Q6).

Executable twin: `src/tests/runtime-contract.characterization.test.ts`
(27 locked tests). Re-verify any statement below with
`pnpm build && pnpm test`. The tests lock OBSERVED behavior, bugs included;
desired-behavior changes belong in separate red tests, never in edits to
the twin.

## Intent status

This spec deliberately does NOT carry uniform intent status. Three zones:

- **Schema ingestion — NON-RATIFIED (C14).** Resolution, loading, and
  options behavior is author-acknowledged accident ("murky", "I screwed
  up", "semi clean slate"), produced without disciplined design or
  testing. Its requirements below bind the characterization snapshot as a
  refactoring safety net for the pending ingestion redesign. They MUST NOT
  be read as design intent, and future changes to this zone are not
  spec violations — they retire the snapshot. Subsequent dig
  `excavate-upstream-parity` (C17, B2, 2026-07-26): the steward sides with
  upstream's delete-`$schema`-before-validation direction, pending LS
  behavior-mapping — the payload-validation requirement below stays
  de-facto only. Dig `excavate-drift-reconciliation` (C5, B2, 2026-07-26):
  absence of an associated schema is intended as an acceptable freeform
  state — 'No explicit schema = no constraints = no errors'; both the
  current `schemaMalformed` actual and the red test's `schemaNotFound`
  expectation diverge from this intent, which the planned error-surfacing
  repass supersedes.
- **Parsing and validated payload — de-facto.** No intent testimony either
  way; candidates for ratification in a later pass.
- **Reporting and suggestions — de-facto with known intent delta (C15).**
  Author intent for locations is real-location mapping; the current
  root-error 1:1 default is an acknowledged bug. The eventual resolution
  is expected to build on branch `pr/2-ksh-actual-squiggle-positions`
  (`10e458f`, Andrew Petersen) with commit-authorship credit. Corroborated
  2026-07-26: real ranges were original, initially-working upstream
  behavior (`excavate-upstream-parity` C19, B1) — the point-location
  behavior is a port regression, not a design. Same-day dig
  `excavate-drift-reconciliation` (C8, B1; C6/C7, A1): fix affordances,
  YAML-parse-error surfacing, and rule metadata are indispensable planned
  capabilities — `meta.fixable` and the unreported `yamlSyntaxError`
  messageId are retained as capability cues; `--fix` verifiably applies
  nothing today and the README's day-one claim never matched any commit.

## Requirements

### Requirement: Inline `$schema` wins over `defaultSchema`

Zone: schema ingestion (non-ratified). A string inline `$schema` in the
frontmatter SHALL govern schema selection; `options.defaultSchema` is
consulted only when no usable inline value exists (`??` fallback). (C1)

#### Scenario: Inline present alongside a conflicting default

- **WHEN** a document carries a valid string `$schema` and options carry a
  `defaultSchema` that would fail the document
- **THEN** validation runs against the inline schema only and the default
  produces no report

### Requirement: Only the literal `https://` prefix is a URL

Zone: schema ingestion (non-ratified). Inline `$schema` values SHALL route
to remote loading only when they start with the literal `https://`.
`http://`, protocol-relative `//…`, and `file:` values fall into
local-path resolution against the markdown file's directory (with
`resolve()` collapsing doubled slashes); an absolute POSIX path is used
as-is. (C2)

#### Scenario: `http://` value resolved as a local path

- **WHEN** frontmatter declares `$schema: http://json.schemastore.org/x.json`
- **THEN** the rule reports `schemaNotFound` naming a local path containing
  `…/http:/json.schemastore.org/…`

### Requirement: Non-string inline `$schema` is silently ignored

Zone: schema ingestion (non-ratified). A non-string or empty-string inline
`$schema` SHALL be ignored (falling through to the global schema or none),
and when `schemaNotFound` is reported without schema data the message
SHALL render the literal `{{schemaPath}}` placeholder. (C3)

#### Scenario: Numeric inline value, no default

- **WHEN** frontmatter declares `$schema: 123` and no `defaultSchema` is
  configured
- **THEN** the report message is exactly
  `Schema not found for frontmatter at "{{schemaPath}}"`

### Requirement: Options-shape edges

Zone: schema ingestion (non-ratified). With no options object the rule
SHALL proceed (reporting `schemaNotFound` when nothing else provides a
schema). An options object without a `defaultSchema` key — `{}` or a
`schemas`-only object — SHALL produce `schemaMalformed` (`Schema is
malformed ` — trailing space) on every yaml node. A STRING `defaultSchema`
never reaches the rule: ESLint flat-config options validation rejects it
at config time (`should be object`), making `parseGlobalSchema`'s string
branch unreachable under standard validation — a trap already hit by
consumers in the wild (issue #1). The declared `schemas` glob-map option
is read nowhere. (C10, C16)

#### Scenario: Empty options object

- **WHEN** the rule is configured as `['error', {}]`
- **THEN** every yaml node reports `schemaMalformed`

#### Scenario: String `defaultSchema`

- **WHEN** the rule is configured as
  `['error', { defaultSchema: './x.schema.json' }]`
- **THEN** ESLint rejects the config before linting with `should be object`

### Requirement: Zero memoization in schema loading

Zone: schema ingestion (non-ratified). Every `getSchema` call SHALL
round-trip the synckit worker: N linted files mean N `$RefParser.bundle`
calls, relinting the same file issues a new call, and an object
`defaultSchema` costs one round-trip per file. Because the worker builds
fresh bundle state per call, remote schemas are re-downloaded per linted
file per pass (fetch count inferred from per-call counts plus worker
source — the corroboration-2 axis of this spec). (C11)

#### Scenario: Same schema across files and passes

- **WHEN** one schema serves several files, or one file is relinted
- **THEN** worker bundle calls scale 1:1 with lint invocations; nothing is
  cached at any layer

### Requirement: Loader failures degrade to a warning plus `schemaNotFound`

Zone: schema ingestion (non-ratified). All loader failures (missing file,
unparseable schema, network refusal) SHALL degrade to `console.warn` on
stderr — invisible to ESLint output — plus a generic `schemaNotFound`
report. Schema files are parsed as YAML (JSON as a subset), so
YAML-format schema files load and validate (undocumented capability) and
malformed JSON produces YAML-flavored parse warnings. (C12)

#### Scenario: YAML-format schema file

- **WHEN** frontmatter points `$schema` at a `.schema.yaml` file
- **THEN** the schema loads and its violations are reported normally

### Requirement: Known crash classes in repeated compilation

Zone: schema ingestion (non-ratified); status: DEFECT — recorded for
awareness, not a contract consumers may rely on. The module-singleton Ajv
plus per-call `compile` SHALL crash the lint run on real-world schemas: a
second compile of any `$id`-carrying schema (second file, or relint of the
SAME file, e.g. an IDE save) throws `schema with key or id "…" already
exists`, and any schema declaring the draft-2020-12 meta-schema throws
`no schema with key or ref …`. Both surface as rule crashes, not reports.
(C13)

#### Scenario: `$id` schema, second compile

- **WHEN** a schema carrying `$id` is compiled a second time in the same
  process
- **THEN** the lint run throws `… already exists` instead of reporting

### Requirement: Malformed YAML frontmatter is never reported

Zone: parsing and validated payload (de-facto). The rule SHALL never
report YAML syntax problems: the parser runs in recovering mode,
`document.errors` is never read, and the declared `yamlSyntaxError`
messageId is unreachable from any input. Validation runs on the recovered
content; for duplicate keys the LAST value wins silently. (C4)

#### Scenario: Tab-indented frontmatter satisfying the schema

- **WHEN** frontmatter is malformed (e.g. tab indentation) but its
  recovered content satisfies the schema
- **THEN** the file lints with zero reports

### Requirement: The whole markdown file is parsed as one YAML stream

Zone: parsing and validated payload (de-facto). The rule SHALL parse the
entire file as YAML: frontmatter is the first document, the markdown body
becomes swallowed extra documents (`MULTIPLE_DOCS`, unread). This
whole-file parse is what makes in-frontmatter offsets file-global, so
reported in-block locations land correctly. (C5)

#### Scenario: YAML-lookalike markdown body

- **WHEN** the body contains `---`-fenced YAML-lookalike content
- **THEN** it never affects validation results

### Requirement: The `$schema` key is part of the validated payload

Zone: parsing and validated payload (de-facto). The validated object SHALL
include the `$schema` key itself, so any schema with
`additionalProperties: false` fails at root on every file using inline
association. (C6)

#### Scenario: Inline association plus `additionalProperties: false`

- **WHEN** a document associates its schema inline and that schema sets
  `additionalProperties: false`
- **THEN** validation reports `must NOT have additional properties` at root

### Requirement: Point locations with a 1:1 root default

Zone: reporting (de-facto; intent delta per C15 — see Intent status).
Reported locations SHALL be point locations (start = end) at the offending
value node when `document.getIn(instancePath)` resolves; root and
unresolvable paths silently default to 1:1 (the opening fence) — the
behavior consumers experience as "everything at Ln 1, Col 1", an
acknowledged bug. For duplicate keys the location points at the FIRST
occurrence while validation used the LAST value. (C7, C15)

#### Scenario: Root-level `required` violation

- **WHEN** the schema reports a missing required property at root
- **THEN** the message lands at line 1, column 1 with `end == start`

### Requirement: Suggestions exist only for enum violations

Zone: reporting (de-facto). ESLint suggestions SHALL be attached only to
enum violations — one `Replace with "<value>"` suggestion per allowed
value, with absolute file-offset text ranges (correct thanks to the
whole-file parse). No other keyword produces suggestions. (C8)

#### Scenario: Enum violation

- **WHEN** a value violates an `enum` of N allowed values
- **THEN** the report carries exactly N replacement suggestions with
  correct absolute ranges

### Requirement: `meta.fixable` is inert

Zone: reporting (de-facto). Although the rule declares
`meta.fixable: 'code'`, no report SHALL ever attach a `fix`;
`--fix`/`verifyAndFix` leaves the text unchanged (`fixed: false`). The
README's "Auto-fix via `--fix`" claim does not describe current behavior.
(C9)

#### Scenario: `verifyAndFix` over a violating document

- **WHEN** `--fix` runs on a document with violations
- **THEN** the output text is byte-identical and `fixed` is `false`
