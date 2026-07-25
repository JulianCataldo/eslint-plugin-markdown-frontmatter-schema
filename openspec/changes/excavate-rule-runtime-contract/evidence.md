# Evidence Ledger

<!-- Verbatim and append-only. Record findings exactly as found — never
professionalize, paraphrase, or polish. Interpretation lives in claims.md,
pointing back at entry ids. Correct a wrong entry by appending a correction
that references it, never by rewriting it. -->

Conventions (this dig). Adopted mid-flight 2026-07-26; the steward suspended
append-only for one structural restructure to this shape (E-ids stable,
substance unchanged):

- Three altitudes: attachments/ is the archive (full bytes + re-run
  procedure), this ledger is the index (provenance + verbatim hooks),
  claims.md is the interpretation.
- Entries inline content in full ONLY when this file is the sole durable
  home (testimony, external tracker text). When bytes live in an attachment
  or a git object (source @ commit, fetched branch, committed test), the
  entry is a semantic locator + hooks + high-level findings.
- Hooks are byte-exact lines or contiguous fragments from the referenced
  file (single-line hooks may be whitespace-trimmed); they grep identically
  here and in the archive. Never summaries.
- Run outputs are captured shell-side (tee → attachments/captures/), never
  hand-transcribed; hooks are mechanically verified against their files
  (attachments/harness/verify-hooks.py).

## Entries

### E1

- Source: Julian Cataldo (steward), in-session statement
- Locator: dig session 2026-07-26, scoping exchange (also quoted in
  survey.md > Recon delta)
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
The MURKY schema config ingestion story.
It is CLEARLY the achille heels of my remark-lint-frontmatter schema porting
(this one already had problems, too, but it was less deceptive)

By murky I mean "I screwed up" and will fix later. semi clean slate (for
this specific part of the eslint rule)
```

### E2

- Source: Julian Cataldo (steward), in-session statement
- Locator: dig session 2026-07-26, scoping exchange
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
that AJV full capability is NOT ENSURED. AJV is a beast.
There is definitely TYPICAL (widespread in the JS ecosystem for AJV
consumers) dead angles regarding PHYSICAL files path / id resolution.
```

### E3

- Source: Julian Cataldo (steward), in-session statement
- Locator: dig session 2026-07-26, scoping exchange
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
This is both area that definitely needed a proper design + testing that was
not done in a disciplined manner (or at all)
```

### E4

- Source: GitHub issue tracker,
  JulianCataldo/eslint-plugin-markdown-frontmatter-schema
- Locator: issue #1, original body, title "[Feature Request] can you make it
  underline errors where they're at, not in frontmatter dashed line start",
  label `bug`
- Collected: 2026-07-26
- Class: testimony
- Witness: VityaSchel (GitHub), 2025-10-12T15:55:33Z

```text
Hi, thanks for your work.

I'm currently using this plugin and it works good but I wish it was
highlighting errors with schema where they are happening, not at frontmatter
dashed start.

Currently all problems are reported at "Ln 1, Col 1".

Also please update readme, looks like `defaultSchema` in
`frontmatter-schema/frontmatter-schema` rule setting requires an object
schema rather than path to the schema cause it throws "expected object"
while validating estling.config.js
```

### E5

- Source: GitHub issue tracker,
  JulianCataldo/eslint-plugin-markdown-frontmatter-schema
- Locator: issue #1, owner reply comment
- Collected: 2026-07-26
- Class: testimony
- Witness: JulianCataldo (GitHub, owner), 2025-10-13T09:38:57Z

```text
That's a bug, the "Ln 1, Col 1" thing.
Should be correctly mapped at real location (as in tests). I'll investigate
that.

Regarding IntelliSense (completions, hover, go to def, references…), it's
not possible. ESLint only produce _**diagnostics**_.

For you goal, we would have to create a VSCode extension that :

- Extract frontmatter region
- Forward this to YAML Language Server
- Remap back to the extension registerers
```

### E6

- Source: GitHub PR #2, fetched locally (SHA-pinned)
- Locator: PR JulianCataldo/eslint-plugin-markdown-frontmatter-schema#2 >
  local branch `pr/2-ksh-actual-squiggle-positions` @
  10e458fb9647191eb452d061e6c95e658227b1c2 (single commit); re-fetch:
  `git fetch origin pull/2/head:pr/2-ksh-actual-squiggle-positions`;
  fetch-time facts in attachments/captures/pr2.txt
- Collected: 2026-07-26
- Class: period-document
- Findings: OPEN, unmerged, no review comments; encodes desired post-fix
  behavior, not current behavior. Authorship lives on the branch commit for
  future credit.

```text
10e458fb9647191eb452d061e6c95e658227b1c2 | Andrew Petersen <kirbysayshi@gmail.com> | 2026-04-24 01:28:25 -0400 | fix: root errors were always tied to frontmatter start (---)
```

### E7

- Source: PR #2 branch content vs merge-base (git; diffs re-derivable on
  demand, not inlined)
- Locator: `git diff --stat main...pr/2-ksh-actual-squiggle-positions`;
  capture attachments/captures/pr2.txt
- Collected: 2026-07-26
- Class: period-document
- Findings (high level): reworks the error-location pipeline (validate.ts
  +100 gross lines; create-reports, prepare, types touched) and adds
  desired-behavior tests + fixtures for yaml-syntax (Q2),
  additional-properties (Q4), a remote schema (Q3), updates empty-no and
  inline-linked expectations, plus build plumbing (package.json,
  tsconfig.json). Does NOT touch the options meta-schema: 0 `defaultSchema`
  occurrences in the rules-file diff, so the config-time string rejection
  (C16) is unaddressed. Forward hint: the resolution path for C7/C15 is
  expected to build on this branch with commit-authorship credit — outside
  this dig's scope.

```text
16 files changed, 272 insertions(+), 64 deletions(-)
```

### E8

- Source: repository source (git object)
- Locator: src/prepare.ts > parseInlineSchemaPath @ b549418
- Collected: 2026-07-26
- Class: other
- Findings: only the literal `https://` prefix short-circuits to URL; every
  other truthy string is path-resolved against the md file's dir.

```text
if (inlineSchemaPath?.startsWith('https://')) return inlineSchemaPath as Url;
return resolve(dirname(filePath), inlineSchemaPath) as AbsolutePath;
```

### E9

- Source: repository source (git object)
- Locator: src/prepare.ts > parseGlobalSchema @ b549418
- Collected: 2026-07-26
- Class: other
- Findings: `undefined` options proceed; `'defaultSchema' in options`
  evaluating false yields `false` (not undefined), which falls into the
  malformed guard — the `['error', {}]` / schemas-only trap.

```text
if (globalSchema === undefined) return { ok: true, value: undefined };
error: { messageId: 'schemaMalformed', node },
```

### E10

- Source: repository source (git object)
- Locator: src/create-reports.ts > createReports @ b549418
- Collected: 2026-07-26
- Class: other
- Findings: whole-file text goes into parseFrontmatter; inline-over-default
  precedence is a single `??`; the full yamlJS (including `$schema`) is
  what gets validated.

```text
const { document, lineCounter, yamlJS } = parseFrontmatter(fileContent);
const schema = getSchema(inlineSchemaPath ?? globalSchema.value, yaml);
```

### E11

- Source: repository source (git object)
- Locator: src/validate.ts > module scope, validateFrontmatter,
  retrieveViolations @ b549418
- Collected: 2026-07-26
- Class: other
- Findings: module-singleton Ajv; compile per validation call; loc via
  document.getIn with a 1:1 default when unresolved; suggestions gated on
  enum errors only.

```text
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const offendingNode = document.getIn(instancePath, true);
range && isEnumError(error)
```

### E12

- Source: repository source (git object)
- Locator: src/schema-loader.worker.ts > loadSchemaAsync @ b549418
- Collected: 2026-07-26
- Class: other
- Findings: fresh `$RefParser.bundle` per worker call; all failures become
  console.warn + `return null` (which the caller maps to schemaNotFound).

```text
const schema = (await $RefParser.bundle(
`Error loading schema from ${typeof pathOrSchema === 'string' ? pathOrSchema : '[embedded]'}: ${(error as Error).message}`,
```

### E13

- Source: repository source (git object)
- Locator: src/rules/frontmatter-schema.ts > frontmatterSchema.meta
  @ b549418
- Collected: 2026-07-26
- Class: other
- Findings: docs.url points at the upstream remark repo; `fixable` declared;
  four messageIds declared (incl. yamlSyntaxError, fixDescription);
  meta.schema types defaultSchema as object-only and declares the unread
  `schemas` glob map.

```text
url: 'https://github.com/JulianCataldo/remark-lint-frontmatter-schema',
fixable: 'code',
schemaNotFound: 'Schema not found for frontmatter at "{{schemaPath}}"',
defaultSchema: { type: 'object' },
```

### E14

- Source: repository documentation (git object)
- Locator: README.md @ b549418 — porting statement (intro) and feature
  bullets
- Collected: 2026-07-26
- Class: period-document

```text
The API is kept very similar.
- **Smart suggestions** (e.g. auto-fix enum mismatches)
- 🛠 Auto-fix via `--fix` for simple cases
```

### E15

- Source: git history, origin
  git@github.com:JulianCataldo/eslint-plugin-markdown-frontmatter-schema.git
- Locator: `git log --format='%h %ad %s' --date=short`, full history;
  HEAD = b549418 at collection (b549418 landed mid-session after E8–E14
  were excerpted; it touches only eslint.config.js and openspec/*, so the
  source excerpts hold for it too)
- Collected: 2026-07-26 (dates corrected in the restructure; the first
  transcription was wrong — see E17)
- Class: vcs-history

```text
b549418 2026-07-26 docs: apply 'code-specs-relationships'
58e4bba 2026-07-26 docs: experimental spec relationship code annotations
040dabf 2026-07-25 chore: experimental excavation relationship
4de64c9 2026-07-24 chore: setup seedbed + archeology campaigns
9bbddcd 2025-08-07 build: add inline source maps, remove old deps
7bf90fb 2025-07-25 docs: initial readme
555a2a7 2025-07-25 test: add initial tests and fixtures
07f5024 2025-07-25 feat: initial plugin
c477455 2025-07-25 chore: init
```

### E16

- Source: npm registry
- Locator: `npm view eslint-plugin-markdown-frontmatter-schema version
  dist-tags`
- Collected: 2026-07-26
- Class: other

```text
version = '0.0.1'
dist-tags = { latest: '0.0.1' }
```

### E17

- Source: dig process note (was: correction entry for E15)
- Locator: this ledger, restructure of 2026-07-26
- Collected: 2026-07-26
- Class: other
- Findings: the original E15 was hand-transcribed and carried two wrong
  commit dates plus a stale HEAD; that incident produced the shell-side
  capture rule now in Conventions. E15 above holds the verified values;
  the erroneous transcription is preserved in this file's git history, not
  here.

### E18

- Source: baseline suite run; dist rebuilt from src via `pnpm build` (tsc,
  exit 0; dist is gitignored), working tree = b549418 with src clean
- Locator: attachments/captures/baseline-test.txt (`pnpm test`, c8 +
  node:test over dist/tests, network-dependent) and
  attachments/captures/env-versions.txt
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: 7 tests, 3 pass, 4 fail (2 leaf failures + their 2 parent
  suites) — matches the doctrine's boot-run red set.

```text
ℹ tests 7
ℹ pass 3
ℹ fail 4
✖ Empty frontmatter (4565.445595ms)
✖ Invalid: Should not pass, with 2 errors (4498.40373ms)
v25.8.2
```

### E19

- Source: baseline suite run (same run as E18)
- Locator: attachments/captures/baseline-test.txt > failing test
  src/tests/empty-no.test.ts > "Empty frontmatter"
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: authored expectation schemaNotFound; actual schemaMalformed —
  the Q6 divergence observed in the authored suite itself.

```text
actual: 'schemaMalformed',
expected: 'schemaNotFound',
```

### E20

- Source: baseline suite run (same run as E18)
- Locator: attachments/captures/baseline-test.txt > failing test
  src/tests/inline-linked.test.ts > "Invalid: Should not pass, with 2
  errors" (assertion object, actual vs expected)
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: actual = two root-level errors at 1:1 plus a property error at
  2:13 against the (drifted) remote prettierrc fixture; expected = the
  authored description/category errors with suggestions at real locations.

```text
must be string at root', line: 1, column: 1
must match exactly one schema in oneOf at root', line: 1, column: 1
must be integer at /printWidth', line: 2, column: 13
{ column: 14, endColumn: 14, endLine: 3, line: 3,
```

### E21

- Source: baseline suite run (same run as E18)
- Locator: attachments/captures/baseline-test.txt > c8 coverage table
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: pre-characterization uncovered hot spots — prepare.ts
  (not-found paths), schema-loader.worker.ts (failure path), validate.ts
  (suggestion builder).

```text
34-36,40-47
21-25
65-69
96.08
```

### E22

- Source: observation harness over built dist (same build as E18), eslint
  Linter wired as the dogfood config (markdown/gfm + frontmatter: yaml)
- Locator: attachments/captures/matrix-out.jsonl > cases q1-rel-path,
  q1-precedence-inline-vs-default, q1-http-not-url, q1-protocol-relative,
  q1-file-url, q1-absolute-path, q1-nonstring-inline; procedure
  attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: relative and absolute paths load and validate; inline beats
  defaultSchema (no zzz error); http://, protocol-relative, and file: all
  fall into local path resolution (resolve() collapses the double slash);
  non-string `$schema` is ignored and the notFound message renders its raw
  placeholder.

```text
fx/http:/json.schemastore.org/prettierrc.json
Schema not found for frontmatter at \"/example.com/x.schema.json\"
Schema not found for frontmatter at \"{{schemaPath}}\"
```

### E23

- Source: observation harness (same run as E22)
- Locator: attachments/captures/matrix-out.jsonl > cases q2-unclosed-flow,
  q2-tab-indent, q2-duplicate-key
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: all three malformed-YAML cases return zero messages — the
  recurring hook below is each case's entire messages payload.

```text
"messages":[]
```

### E24

- Source: observation harness (same run as E22)
- Locator: attachments/captures/matrix-out.jsonl > cases
  q4-schema-key-vs-apfalse, q4-root-required-loc, q4-offsets-multiline,
  q4-body-yaml-lookalike, q4-no-frontmatter
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: the `$schema` key itself trips additionalProperties:false at
  root 1:1; root required errors land at 1:1; a property error after a
  multiline block maps to 6:6; YAML-lookalike markdown body changes
  nothing; no frontmatter → no yaml node → silence.

```text
must NOT have additional properties at root
must be integer at /num","line":6,"column":6
```

### E25

- Source: observation harness (same run as E22)
- Locator: attachments/captures/matrix-out.jsonl > cases
  q5-enum-suggestions, q5-verifyAndFix
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: enum violation yields one suggestion per allowed value with
  absolute text ranges ([10,14] in the fixture md); a verifyAndFix pass
  changes nothing.

```text
Replace with \"Movie\"
{"case":"q5-verifyAndFix","fixed":false,"outputChanged":false}
```

### E26

- Source: observation harness (same run as E22)
- Locator: attachments/captures/matrix-out.jsonl > cases
  q6-bare-error-no-schema, q6-empty-options-object, q6-string-defaultSchema,
  q6-unknown-option, q6-schemas-glob-option, q6-empty-fm-bare,
  q6-empty-fm-empty-obj, q6-empty-fm-valid-default
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: bare `['error']` → schemaNotFound (placeholder leak, E22 hook);
  `{}` and schemas-only → schemaMalformed (trailing-space message); string
  defaultSchema and unknown options THROW at config validation, never
  reaching the rule; empty frontmatter validates `{}` against a real
  default (root required error at 1:1).

```text
Schema is malformed 
Value \"./enum.schema.json\" should be object.
Unexpected property \"bogus\"
```

### E27

- Source: observation harness (same run as E22)
- Locator: attachments/captures/matrix-out.jsonl > cases ajv-id-file-a,
  ajv-id-file-b-second-compile, ajv-id-file-a-relint, ajv-draft-2020-meta
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: first `$id` compile passes; second compile — different file OR
  relint of the SAME file — throws and crashes the lint run; declaring the
  draft-2020-12 meta-schema throws immediately.

```text
schema with key or id \"https://example.com/withid.json\" already exists
no schema with key or ref \"https://json-schema.org/draft/2020-12/schema\"
```

### E28

- Source: observation harness (same run as E22), reports + worker stderr
- Locator: attachments/captures/matrix-out.jsonl > cases q3-missing-local,
  q3-malformed-schema-file, q3-remote-connection-refused;
  attachments/captures/matrix-stderr.txt (whole run)
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: every loader failure = console.warn on stderr + generic
  schemaNotFound report with the resolved path; a malformed JSON schema
  produces a YAML-flavored parse warning (ref-parser reads schemas as
  YAML); a refused remote reports the same way in ~18ms.

```text
ENOENT: no such file or directory
unexpected end of the stream within a flow collection (2:1)
Error downloading https://127.0.0.1:9/x.schema.json 
fetch failed
```

### E29

- Source: mechanism probe A — dist/prepare.js parseFrontmatter called
  directly on whole-file text (as the rule calls it)
- Locator: attachments/captures/probe-out.jsonl > probes
  A-parseFrontmatter:tab-indent, :unclosed-flow, :duplicate-key,
  :valid-with-body, :empty-frontmatter
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: the yaml parser RECOVERS — document.errors fills
  (TAB_AS_INDENT, BAD_INDENT, DUPLICATE_KEY, and MULTIPLE_DOCS whenever a
  body exists) while toJS() still returns content (dup keys: last wins);
  empty frontmatter is the only case where toJS() is null (the `?? {}`
  branch). document.errors is read by no caller.

```text
TAB_AS_INDENT Tabs are not allowed as indentation
MULTIPLE_DOCS Source contains multiple documents
"toJS":{"foo":1}
"toJS":{"a":2}
"toJS":null
```

### E30

- Source: mechanism probes B/C/D (same run as E29)
- Locator: attachments/captures/probe-out.jsonl > probes
  B-tab-indent-type-violation, B-unclosed-flow-type-violation,
  B-dupkey-which-value-wins, C-yaml-schema-file, D-empty-string-inline
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: schema violations DO report on recovered malformed YAML, mapped
  inside the broken block (2:7 / 2:6); for duplicate keys the loc points at
  the FIRST occurrence while validation used the LAST value; YAML-format
  schema files load and validate; empty-string `$schema` falls through to
  the placeholder-leak notFound.

```text
must be integer at /foo","line":2,"column":7
required property 'yamltitle'
```

### E31

- Source: instrumented dist copy — bundleSchema wrapped to append one line
  per call to $DIG_COUNT_FILE; driver: 4 path-schema lints (3 files + 1
  relint of the first) then 2 object-defaultSchema lints
- Locator: attachments/captures/count.log (6 lines = 6 calls); wrapper
  attachments/harness/instrument-patch.applied.txt; driver
  attachments/harness/count.mjs
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: one worker round-trip per getSchema call — no memoization for
  repeated paths, relints, or per-file object schemas.

```text
scratchpad/hx/fx/enum.schema.json"}
{"arg":"[object schema]"}
const __digCountFile = process.env.DIG_COUNT_FILE;
```

### E32

- Source: characterization battery locked into the repo suite
- Locator: src/tests/runtime-contract.characterization.test.ts (new file,
  uncommitted; fixtures under fixtures/characterization/); isolated first
  run capture attachments/captures/char-test-run.txt
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: 27 locked tests, all green on first run — resolution forms,
  malformed-YAML silence + recovered-content validation, $schema-in-payload,
  root-at-1:1, enum suggestions, inert --fix, options edges, $id and
  2020-12 crashes, loader edges, YAML schema files.

```text
ℹ tests 27
ℹ pass 27
ℹ fail 0
```

### E33

- Source: full `pnpm test` after adding the characterization file (same
  working tree as E18)
- Locator: attachments/captures/suite-with-char.txt; pre-existing red set
  unchanged (Empty frontmatter; Invalid: Should not pass, with 2 errors —
  plus their two parent suites)
- Collected: 2026-07-26
- Class: observed-behavior
- Findings: 34 tests, 30 pass, 4 fail (the same pre-existing reds);
  coverage on prepare.ts / schema-loader.worker.ts / validate.ts now 100%
  lines (remaining gaps are branch-only: 41,64,86 / 22 / 35).

```text
ℹ tests 34
ℹ pass 30
ℹ fail 4
41,64,86
88.46
94.44
```

## Testimony requests

<!-- When intent is unrecoverable from artifacts, request testimony by name
instead of inventing a plausible story. An exhausted request is recorded
honestly; the downstream output may then be at most a negative certificate. -->

(none open)
