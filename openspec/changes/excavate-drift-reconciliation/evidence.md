# Evidence Ledger

<!-- Verbatim and append-only. Record findings exactly as found — never
professionalize, paraphrase, or polish. Interpretation lives in claims.md,
pointing back at entry ids. Correct a wrong entry by appending a correction
that references it, never by rewriting it. -->

Repo state during collection: HEAD `ccf4f91` ("docs: finish
'01-campaign-reference' + code/specs rels. refinements"), working tree clean
except this dig's untracked directory. Repo eslint: 9.26.0. Probe rig:
session scratchpad `probes/` (eslint 9.39.5 + @eslint/markdown 6.x fresh
install; plugin imported from repo `dist/` by absolute path). Copies of probe
scripts and raw outputs: `attachments/drift-probes/`.

## Entries

<!-- Q1(a) — invalid-fixture vs test expectations -->

### E1

- Source: git history
- Locator: `fixtures/sample-with-linked-schema.invalid.md` — full commit list
- Collected: 2026-07-26
- Class: vcs-history

```text
$ git log --oneline -- fixtures/sample-with-linked-schema.invalid.md
555a2a7 test: add initial tests and fixtures
```

Single commit. The fixture was never modified after birth (2025-07-25).

### E2

- Source: git object store
- Locator: `fixtures/sample-with-linked-schema.invalid.md` at `555a2a7`
  (birth state, byte-identical to today's working tree)
- Collected: 2026-07-26
- Class: vcs-history

```text
---
printWidth: '12345'

$schema: https://json.schemastore.org/prettierrc.json
---

# Linked Schema Test

Testing schema linking with frontmatter.

{{ some.value }}

{% tes  %}
```

### E3

- Source: current source
- Locator: `src/tests/inline-linked.test.ts` — subtest
  `Invalid: Should not pass, with 2 errors`, expected messages array
- Collected: 2026-07-26
- Class: other (current source, unchanged since `555a2a7` — same commit as E2)

```text
assert.deepEqual(result.messages, [
  {
    column: 14, endColumn: 14, endLine: 3, line: 3,
    message: 'YAML schema validation error: must be string at /description',
    ...
  },
  {
    column: 11, endColumn: 11, endLine: 4, line: 4,
    message: 'YAML schema validation error: must be equal to one of the allowed values at /category',
    ...
    suggestions: [
      { desc: 'Replace with "Book"',  fix: { range: [58, 64], text: 'Book'  } },
      { desc: 'Replace with "Movie"', fix: { range: [58, 64], text: 'Movie' } },
      { desc: 'Replace with "Song"',  fix: { range: [58, 64], text: 'Song'  } },
    ],
  },
]);
```

The expectations assert `/description` string + `/category` enum errors —
the shape of `valid.schema.json` (E4) — while the fixture they lint (E2) has
pointed at the remote prettierrc schema since the same commit. The mismatch
is congenital, not later drift: both sides born mismatched in `555a2a7`.

### E4

- Source: current source + git object store
- Locator: `fixtures/valid.schema.json` (current == at `555a2a7`)
- Collected: 2026-07-26
- Class: other (current source)

```text
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "description": { "type": "string" },
    "category": { "type": "string", "enum": ["Book", "Movie", "Song"] }
  },
  "required": ["title", "description", "category"]
}
```

### E5

- Source: current source
- Locator: `fixtures/sample-with-linked-schema.md` (the VALID twin)
- Collected: 2026-07-26
- Class: other (current source)

```text
---
title: 'Linked Schema Test'
description: Hey there!
category: Book
'$schema': ./valid.schema.json
---
```

The valid twin points at the LOCAL `valid.schema.json` and its subtest passes
today (E6 run: `✔ Valid: Should pass without errors`).

### E6

- Source: test run
- Locator: `node --enable-source-maps --test dist/tests/inline-linked.test.js`
  — actual messages for the `Invalid` subtest
- Collected: 2026-07-26
- Class: observed-behavior

```text
actual: [
 { ..., message: 'YAML schema validation error: must be string at root', line: 1, column: 1, endLine: 1, endColumn: 1 },
 { ..., message: 'YAML schema validation error: must match exactly one schema in oneOf at root', line: 1, column: 1, endLine: 1, endColumn: 1 },
 { ..., message: 'YAML schema validation error: must be integer at /printWidth', line: 2, column: 13, endLine: 2, endColumn: 13 } ]
expected: [ ...two messages of E3... ]
operator: 'deepStrictEqual'
```

Actual = THREE errors from the remote prettierrc schema (its top-level
`oneOf` object|string), all with point locations (start == end), no
suggestions. Expected = TWO local-schema errors with real-range suggestion
fixes.

### E7

- Source: current source
- Locator: `fixtures/sample.md` (whole file)
- Collected: 2026-07-26
- Class: other (current source)

```text
---
title: 'Test Document'
description: 42
---

# Sample Content

This markdown has an invalid frontmatter.
```

Note recorded without interpretation: `description: 42` is exactly the value
class the E3 expectation (`must be string at /description`) requires, and no
test references this file (E31).

<!-- Q1(b) — Empty frontmatter red -->

### E8

- Source: current source
- Locator: `src/tests/empty-no.test.ts` — harness, live expectation, and the
  fully commented-out sibling subtest
- Collected: 2026-07-26
- Class: other (current source)

```text
const eslint = new ESLint({
  overrideConfig: [
    {
      files: ['**/*.md'],
      plugins: { 'frontmatter-schema': frontmatterSchema },
      rules: {
        'frontmatter-schema/frontmatter-schema': ['error', {} /* {} */],
      },
    },
  ],
});
...
assert.deepStrictEqual(
  results.at(0)?.messages.at(0)?.messageId,
  'schemaNotFound',
);
...
// 	await t.test('No schema set => Schema not found', async () => {
// 		const results = await eslint.lintText(`---
// foo: bar
// ---
// `);
...
// 		assert.deepStrictEqual(results.at(0)?.messages.at(0), {
// 			...
// 			message: 'Schema not found for frontmatter',
// 			messageId: 'schemaNotFound',
```

No `language:` in the overrideConfig; a second `schemaNotFound` expectation
sits wholly commented out.

### E9

- Source: test run
- Locator: `node --test dist/tests/empty-no.test.js` (repo cwd) — actual
- Collected: 2026-07-26
- Class: observed-behavior

```text
messages: [
  {
    ruleId: 'frontmatter-schema/frontmatter-schema',
    severity: 2,
    message: 'Schema is malformed ',
    line: 1, column: 1,
    nodeType: 'yaml',
    messageId: 'schemaMalformed',
    endLine: 3, endColumn: 4
  }
]
...
+ actual - expected
+ 'schemaMalformed'
- 'schemaNotFound'
```

### E10

- Source: pool artifact (prior dig)
- Locator: `openspec/specs/rule-runtime-contract/spec.md` — options-shape
  edges requirement + § Intent status; executable twin
  `src/tests/runtime-contract.characterization.test.ts`
- Collected: 2026-07-26
- Class: adjacent-doc

The `['error', {}]` → `parseGlobalSchema` → `false` → `schemaMalformed`
trace is already characterized and filed (dig `excavate-rule-runtime-contract`,
promoted 2026-07-26). This dig adds no new mechanism evidence for Q1(b); the
open half is purely which side is intended.

<!-- Q2 + 03-Q4 — --fix claim vs suggestions-only -->

### E11

- Source: README + git history
- Locator: `README.md` § 💬 IDE / CLI Integration; introduction commit
- Collected: 2026-07-26
- Class: adjacent-doc / vcs-history

```text
- 🧠 Suggestions for enum mismatches
- 🛠 Auto-fix via `--fix` for simple cases
- 📦 Compatible with the [VS Code ESLint extension](...)

$ git log -S 'Auto-fix via' --oneline -- README.md
7bf90fb docs: initial readme
```

Day-one claim (2025-07-25), never edited since.

### E12

- Source: current source
- Locator: `src/validate.ts` — the only fix-bearing code path
- Collected: 2026-07-26
- Class: other (current source)

```text
suggest:
  error.keyword === 'enum' && Array.isArray(error.params?.allowedValues)
    ? error.params.allowedValues.map((suggestion: unknown) => ({
        desc: `Replace with "${String(suggestion)}"`,
        fix: (fixer: Rule.RuleFixer) =>
          fixer.replaceTextRange(range, String(suggestion)),
      }))
    : undefined,
```

`fix` exists only INSIDE `suggest` entries. No report ever carries a
top-level `fix` (grep over `src/validate.ts` + `src/create-reports.ts`).

### E13

- Source: probe run
- Locator: `attachments/drift-probes/probe-fix.mjs` + `probe-fix-output.txt`
  — ESLint API `fix: false` vs `fix: true` on an enum-invalid document
- Collected: 2026-07-26
- Class: observed-behavior

```text
{ "fix": true,
  "errorCount": 1,
  "outputProperty": "(absent — nothing applied)",
  "fileChangedOnDisk": false,
  "messages": [ { "message": "YAML schema validation error: must be equal to one of the allowed values at /category",
                  "suggestionCount": 3,
                  "firstSuggestionFix": { "range": [14, 19], "text": "Book" } } ] }
```

`fix: true` (the API form of `--fix`) applies nothing and the file is
unchanged on disk after `ESLint.outputFixes`, while the same message carries
three applicable suggestions. Identical result with `fix: false`.

### E14

- Source: current source
- Locator: `src/rules/frontmatter-schema.ts` — `meta`
- Collected: 2026-07-26
- Class: other (current source)

```text
// @spec `rule-runtime-contract`
// + `meta.fixable` is inert
fixable: 'code',

hasSuggestions: true,
```

<!-- Q3 — docs.url + WIP caveat -->

### E15

- Source: current source + git history
- Locator: `src/rules/frontmatter-schema.ts` — `meta.docs.url`
- Collected: 2026-07-26
- Class: other (current source) / vcs-history

```text
url: 'https://github.com/JulianCataldo/remark-lint-frontmatter-schema',

$ git log -S 'github.com/JulianCataldo/remark-lint-frontmatter-schema' --oneline -- src/
07f5024 feat: initial plugin
```

Points at the UPSTREAM remark plugin repo since the initial plugin commit.

### E16

- Source: git history (README diff `7bf90fb` → `9bbddcd`)
- Locator: `README.md` WIP banner; commit `9bbddcd` 2025-08-07
- Collected: 2026-07-26
- Class: period-document / vcs-history

```text
-> 🚧 **This plugin is under active development.** Some features may change.
+> 🚧 **This plugin is under active development.** Some features may change!
+> You can give it a try, it works fine but with remaining tuning on how schemas are loaded.
```

The "remaining tuning on how schemas are loaded" caveat was ADDED in
`9bbddcd` (2025-08-07, "build: add inline source maps, remove old deps") —
the same night as the 0.0.1 publish (2025-08-06T22:16:58Z = 00:16 +0200 on
Aug 7, see E28). Same diff also added the fixtures IDE invite (E33) and the
"Other Projects" section.

### E17

- Source: pool artifact (prior dig)
- Locator: `docs/adr/0002-port-to-eslint.md` — claims C14 (ingestion
  consciously deferred, semi-clean-slate redesign), C17 ($schema-deletion
  direction pending LS mapping), C21 (upstream dormant, port successor)
- Collected: 2026-07-26
- Class: adjacent-doc

The 2025-08-07 caveat's subject ("how schemas are loaded") is the exact zone
the steward later (2026-07-26 testimony, dig `excavate-upstream-parity`)
declared deferred for redesign.

<!-- Q4 — README project layout -->

### E18

- Source: README + git history
- Locator: `README.md` § 📦 Project Layout; `src/fixtures` path history
- Collected: 2026-07-26
- Class: adjacent-doc / vcs-history

```text
- `src/` — rule logic, validation pipeline, and schema loading
- `src/fixtures/` — Markdown test files and schemas
- `src/tests/` — ESLint-based integration test suites

$ git log --all --oneline -- src/fixtures
(empty)
```

`src/fixtures/` never existed at any commit; fixtures were born at repo root
`fixtures/` in `555a2a7`, one commit BEFORE the README (`7bf90fb`). The
layout section is unchanged since `7bf90fb` — drift-at-birth.

<!-- Q5 — published tarball contents -->

### E19

- Source: npm registry + manifests
- Locator: `package.json` `files` (current == published 0.0.1 manifest);
  0.0.0 tarball listing
- Collected: 2026-07-26 (registry artifacts immutable; stamps below)
- Class: period-document

```text
"files": [
  "dist",
  "!dist/test"
],

$ tar -tzf eslint-plugin-markdown-frontmatter-schema-0.0.0.tgz
package/package.json
(tarball size on disk: 168 bytes)

npm time: "created": "2025-07-25T20:59:07.533Z", "0.0.0": "2025-07-25T20:59:07.706Z"
```

0.0.0 (published day one, ~3h before the local evening commits) contains
ONLY `package/package.json` — no dist existed in the pack.

### E20

- Source: npm registry
- Locator: 0.0.1 tarball listing (`attachments/drift-probes/tarball-listings.txt`)
- Collected: 2026-07-26
- Class: period-document

```text
package/dist/tests/empty-no.test.js
package/dist/tests/globally-set.test.js
package/dist/tests/inline-linked.test.js
package/dist/tests/test-utilities.js
(+ matching .js.map, .d.ts, .d.ts.map — 16 dist/tests/ paths total)

npm time: "0.0.1": "2025-08-06T22:16:58.238Z"
```

The published 0.0.1 ships the compiled test suite: the exclusion pattern
`!dist/test` does not match the actual directory `dist/tests`.

### E21

- Source: local pack simulation
- Locator: `npm pack --dry-run` in the current working tree
- Collected: 2026-07-26
- Class: observed-behavior

```text
npm notice 1.6kB dist/tests/empty-no.test.js
npm notice 2.0kB dist/tests/globally-set.test.js
(+ .map/.d.ts siblings)
```

A publish from today's tree would ship `dist/tests` again — the drift is
live, not historical.

### E22

- Source: npm registry (0.0.1 manifest)
- Locator: published `package/package.json` — dependencies
- Collected: 2026-07-26
- Class: period-document

```text
"dependencies": {
  "@apidevtools/json-schema-ref-parser": "^12.0.2",
  "@eslint/markdown": "^6.4.0",
  "ajv": "^8.17.1",
  "ajv-formats": "^3.0.1",
  "eslint": "^9.26.0",
  "synckit": "^0.11.5",
  "yaml": "^2.7.1"
},
"scripts": { ..., "release": "semantic-release", ... }
```

Identical `files` field and dependency ranges to the current tree.

<!-- Q6 + ADR 0002 C20 — harness config-file dependence, cwd semantics -->

### E23

- Source: current source
- Locator: `src/tests/{empty-no,inline-linked,globally-set}.test.ts` —
  ESLint instantiation
- Collected: 2026-07-26
- Class: other (current source)

All three suites instantiate `new ESLint({ overrideConfig: [...] })` with no
`language:` in the override, no `cwd`, and no `overrideConfigFile` (E8 shows
one verbatim; the other two are structurally identical). `overrideConfig`
MERGES onto a discovered config file; nothing in the tests supplies the
markdown language.

### E24

- Source: probe run
- Locator: `node --test <repo>/dist/tests/empty-no.test.js` with cwd =
  session scratchpad (no eslint.config.* on that path)
- Collected: 2026-07-26
- Class: observed-behavior

```text
✖ Empty frontmatter (7.152491ms)
  Error: Could not find config file.
      at assertConfigurationExists (.../eslint@9.26.0/.../config-loader.js:80:17)
      ...
    messageTemplate: 'config-file-missing'
```

Same built test, only the cwd changed: the suite hard-requires a
discoverable `eslint.config.*` and silently composes with whichever one the
cwd supplies. Run from repo root, that file is the repo's own
`eslint.config.js` (E26).

### E25

- Source: probe run
- Locator: `attachments/drift-probes/probe-cwd.mjs` + `probe-cwd-output.txt`
  — two nested configs (root requires `rootMarker`, sub requires
  `subMarker`), linted file lives in sub/
- Collected: 2026-07-26
- Class: observed-behavior

```text
eslint version: 9.39.5
cwd=root                  → [ "...must have required property 'rootMarker' at root" ]
cwd=root/sub              → [ "...must have required property 'subMarker' at root" ]
(node:12310) ESLintInactiveFlag_unstable_config_lookup_from_file: The flag
'unstable_config_lookup_from_file' is inactive: This flag has been renamed
'v10_config_lookup_from_file' to reflect its stabilization. Please use
'v10_config_lookup_from_file' instead.
cwd=root flag[unstable_config_lookup_from_file] → [ "...'subMarker'..." ]
cwd=root flag[v10_config_lookup_from_file]      → [ "...'subMarker'..." ]
```

ESLint v9 DEFAULT: the config file is resolved from the CWD, not from the
linted file's directory (root's config wins for a file sitting next to
sub's config). The from-file ("nearest config") lookup exists behind
`v10_config_lookup_from_file` and per the deprecation text stabilizes as the
v10 default. Repo pins eslint 9.26.0 (same v9 default family).

### E26

- Source: current source
- Locator: `eslint.config.js` — the `**/*.md` dogfood block
- Collected: 2026-07-26
- Class: other (current source)

```text
{
  files: ['**/*.md'],
  language: 'markdown/gfm',
  plugins: { markdown, 'frontmatter-schema': frontmatterSchema },
  languageOptions: { frontmatter: 'yaml' },
  rules: {
    'markdown/no-html': 'error',
    'frontmatter-schema/frontmatter-schema': [
      'error',
      { defaultSchema: {
          properties: { description: { type: 'string' }, foo: { type: 'null' }, title: { type: 'string' } },
          required: ['title', 'foo'],
          type: 'object' } },
    ],
  },
},
```

This is the block every test run silently inherits when the suite executes
from repo root (its `language: 'markdown/gfm'` is what makes the md files
parse at all).

<!-- Q7 — release contract -->

### E27

- Source: workflow files (this repo + upstream read-only checkout)
- Locator: `.github/workflows/release.yml` vs upstream
  `remark-lint-frontmatter-schema/.github/workflows/release.yml`
- Collected: 2026-07-26
- Class: vcs-history / period-document

```text
$ sed 's/^# //; s/^#$//' .github/workflows/release.yml | diff - <upstream>/.github/workflows/release.yml
IDENTICAL after uncommenting
```

The workflow is a byte-identical copy of the upstream repo's live release
workflow (pnpm 7.1.7 era, `master` branch), committed here fully commented
out — copied wholesale, never activated.

### E28

- Source: git + npm registry + package.json
- Locator: tags, publish stamps, publisher, semantic-release surface
- Collected: 2026-07-26
- Class: vcs-history / period-document

```text
$ git tag -l
(empty)

npm time: { "created": "2025-07-25T20:59:07.533Z",
            "0.0.0": "2025-07-25T20:59:07.706Z",
            "0.0.1": "2025-08-06T22:16:58.238Z",
            "modified": "2025-08-06T22:16:58.428Z" }
maintainers/_npmUser: julian.cataldo <co@jc0.eu>

package.json: "release": "semantic-release" + @semantic-release/* devDeps
$ ls -a | grep -iE "releaserc|changelog|\.npmrc"
(no matches)
```

semantic-release is configured (script + plugins in devDeps, no rc file) but
evidently never ran: it creates git tags and changelogs on every release,
and there are none. Both publishes carry no corresponding tag → manual
`npm publish`.

### E29

- Source: cross-correlation (npm stamp vs commit date)
- Locator: 0.0.1 publish vs commit `9bbddcd`
- Collected: 2026-07-26
- Class: vcs-history / period-document

```text
0.0.1 published: 2025-08-06T22:16:58Z  (= 2025-08-07 00:16 +0200)
9bbddcd:         2025-08-07  build: add inline source maps, remove old deps
```

Publish and the build-config commit happened the same night; the published
tarball still contains separate `.js.map` files (pre-inline-source-maps
state).

<!-- Q8 — /docs gitignore -->

### E30

- Source: git history
- Locator: `.gitignore` `/docs` line across `c477455` → `4de64c9`; tracked
  state of `docs/`
- Collected: 2026-07-26
- Class: vcs-history

```text
$ git show c477455:.gitignore | sed -n '28,38p'   # init, 2025-07-25
.turbo*
.old*
.dev*

/docs

integration/**/*.js.map

$ git blame -L 34,34 .gitignore
4de64c9a (ju 2026-07-24 02:22:07 +0200 34) # /docs

$ git check-ignore -v docs/adr/0002-port-to-eslint.md docs/excavation/02-campaign-drift.md
(no output — nothing ignored)

$ git ls-files docs/ | head
docs/adr/0001-code-spec-relationship-annotations.md
docs/adr/0002-port-to-eslint.md
docs/adr/README.md
docs/certificates/README.md
docs/excavation/01-campaign-reference.md
...
```

`/docs` was ACTIVE from init (2025-07-25) and was commented out in
`4de64c9` (2026-07-24) — the very commit that installed the seedbed +
campaign files. The campaign 02 Q8 text (same commit) still describes the
ignore as active: the premise was stale the moment it landed. All SDD docs,
both ADRs, and the cartography are tracked today.

<!-- 03-Q3 — fixture consumer sweep -->

### E31

- Source: grep sweep
- Locator: each fixture name over `src/`, `eslint.config.js`, `README.md`
- Collected: 2026-07-26
- Class: observed-behavior

```text
--- sample.md ---
(no matches)
--- sample-globally-set.md ---
src/tests/globally-set.test.ts:  getPath('../../fixtures/sample-globally-set.md')
--- sample-with-linked-schema.md ---
src/tests/inline-linked.test.ts:  '../../fixtures/sample-with-linked-schema.md'
--- sample-with-linked-schema.invalid.md ---
src/tests/inline-linked.test.ts:  '../../fixtures/sample-with-linked-schema.invalid.md'
--- valid.schema.json ---
(no matches in src/, config, README — consumed via frontmatter of
 sample-with-linked-schema.md `$schema: ./valid.schema.json`, E5, and via
 the E3 test expectations' error shapes)
--- .dev.invalid.schema.json ---
(no matches)
```

Also present: `fixtures/characterization/` (5 schemas), consumed by
`src/tests/runtime-contract.characterization.test.ts` (dig-1 twin).

### E32

- Source: current tree
- Locator: `fixtures/.dev.invalid.schema.json` — content + tracked state
- Collected: 2026-07-26
- Class: other

```text
(content byte-identical to fixtures/valid.schema.json, E4)

.gitignore (since init): .dev*
$ git ls-files fixtures/   → does NOT list .dev.invalid.schema.json
```

An untracked scratch duplicate of `valid.schema.json`, named "invalid",
referenced by nothing.

### E33

- Source: lint run + package.json + README
- Locator: `npx eslint fixtures/sample.md` (repo cwd, repo config); scripts;
  README § Troubleshooting
- Collected: 2026-07-26
- Class: observed-behavior / adjacent-doc

```text
/…/fixtures/sample.md
  1:1   error  YAML schema validation error: must have required property 'foo' at root  frontmatter-schema/frontmatter-schema
  3:14  error  YAML schema validation error: must be string at /description             frontmatter-schema/frontmatter-schema
✖ 2 problems (2 errors, 0 warnings)

package.json scripts: build / clean / dev / release / test / test:dev
(NO lint script — the dogfood surface is IDE/manual-CLI only)

README.md § Troubleshooting (added in 9bbddcd):
- Ultimately, clone this project, install the dependencies and try the
  [fixtures](./fixtures) in your IDE.
```

`sample.md` is a live in-IDE demo surface (two deliberate errors against the
dogfood defaultSchema) despite having no test consumer.

### E34

- Source: git history
- Locator: commit `013bec1` ("style: format all", 2026-07-26) touching
  `fixtures/sample.md`
- Collected: 2026-07-26
- Class: vcs-history

```text
fixtures/sample.md | 2 +-
```

Cosmetic only (formatting pass); content semantics unchanged since birth.

<!-- Campaign anchor refresh -->

### E35

- Source: test runs
- Locator: full suite baseline vs campaign 02 header claim
- Collected: 2026-07-26
- Class: observed-behavior

```text
Campaign 02 header (written 2026-07-24): "pnpm test on 2026-07-24 → 7 tests, 3 pass, 4 fail"
Current baseline (2026-07-26, unchanged since dig-2 close): ℹ tests 34 / ℹ pass 30 / ℹ fail 4
Isolated run of the two red files: ℹ tests 5 / pass 1 / fail 4 (2 subtest fails + their 2 parents)
```

The 4 fails are the same two red subtests (E6, E9) plus their parent
wrappers; dig-1's 27 characterization tests account for the growth.

<!-- Testimony round, answered in-session 2026-07-26 — verbatim -->

### E36

- Source: steward testimony (answer to TR1)
- Locator: in-session testimony round, answer 1
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
I don't remember this one. Going forward, the intent is
to exerce all useful tests we'll have to identify with a fresh stance, regardless of past attempts
```

### E37

- Source: steward testimony (answer to TR2)
- Locator: in-session testimony round, answer 2
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
I think that an empty frontmatter should not raise a schema not found error, IF there is no associated schema I guess?
Looks like a misconception
Absence of schema is an acceptable state, not eligible for error raising. A user can have "freeform" YAML frontmatter. No explicit schema = no constraints = no errors
```

### E38

- Source: steward testimony (answer to TR3)
- Locator: in-session testimony round, answer 3
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
YAML parsing error and ESLint "fix" affordances (and metadatas etc.) are indispensable, and must be clearly communicated to the user.
```

### E39

- Source: steward testimony (answer to TR4)
- Locator: in-session testimony round, answer 4
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
I think I did this because the upstream project had better docs at this moment. It's obviously not something to keep.
```

Note: the TR4 second half (WIP-caveat rewording) was not addressed.

### E40

- Source: steward testimony (answer to TR5)
- Locator: in-session testimony round, answer 5
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
It's a detail. The end goal is that we'll need a fixtures folder probably, regardless of the layout
```

### E41

- Source: steward testimony (answer to TR6)
- Locator: in-session testimony round, answer 6
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
Yeah IIRC, I did a 0.0.0 stub publish
And NO, dist/tests must NOT be shipped, it has to be '!' (not exported in "files")
```

### E42

- Source: steward testimony (answer to TR7)
- Locator: in-session testimony round, answer 7
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
'dogfood-as-harness', worked OK for the first init phase. But I think we might want a PROPER, well isolated test fixture. It avoids weird "feedback loops". It was just practical, and some OSS ESLint rules adopt this simple layout, IIRC.
```

### E43

- Source: steward testimony (answer to TR8)
- Locator: in-session testimony round, answer 8
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
The release story is nascent, and might not need a full blast harness (not high frequency lib updates). LATER, I want to homogeneize with my other repos and migrate everything to changesets (I'm more and more annoyed by conventional commit based workflows)
```

### E44

- Source: steward testimony (answer to TR9)
- Locator: in-session testimony round, answer 9
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
It was for autogenerated typedocs. It's NOT a pattern I want to keep. Typedocs should use docs/typedoc or something going forward (not the default 'docs'), everywhere I want to leverage it. It's not the "sole" docs (it was, for simple project, like the remark lint rule, IIRC)
```

Note: the TR9 breadcrumb half (`# /docs` line keep/delete) was not
explicitly addressed; the pattern itself is declared retired.

### E45

- Source: steward testimony (answer to TR10)
- Locator: in-session testimony round, answer 10
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo (steward), 2026-07-26

```text
See 7. The current integration tests are NOT well organized. I want a clean slate here, after the full excavation is done.
```

### E46

- Source: upstream read-only checkout (corroboration spot-check for E44)
- Locator: `remark-lint-frontmatter-schema/package.json` grep `typedoc`;
  upstream `.gitignore` grep `docs`; upstream root listing
- Collected: 2026-07-26
- Class: adjacent-doc

```text
=== upstream typedoc surface ===
(no matches)
=== upstream gitignore docs ===
(no matches)
=== upstream docs dir? ===
docs
```

The upstream repo today has a TRACKED `docs/` directory, no typedoc config
in package.json, and no docs ignore — the "typedoc autogenerated to default
docs/" origin story (E44, hedged "IIRC") is not corroborated by the upstream
artifacts at their current state.

### E47

- Source: git history
- Locator: `src/validate.ts` — full commit list + suggest branch at birth
- Collected: 2026-07-26
- Class: vcs-history

```text
$ git log --oneline -- src/validate.ts
50c02a1 docs: excavate-rule-runtime-contract pass + refine code/specs rels
07f5024 feat: initial plugin

$ git show 07f5024:src/validate.ts | grep -n "suggest\|fix" | head
62:			suggest:
64:					? error.params.allowedValues.map((suggestion: unknown) => ({
65:							desc: `Replace with "${String(suggestion)}"`,
67:							fix: (fixer: Rule.RuleFixer) =>
68:								fixer.replaceTextRange(range, String(suggestion)),

$ git log -S "fix:" --oneline -- src/create-reports.ts src/rules/
(empty)
```

The suggestions-only shape (fix nested inside `suggest`) is unchanged since
the initial plugin commit; no top-level report `fix` ever existed at any
commit. The README's `--fix` claim (E11, born `7bf90fb`) postdates `07f5024`
by the same day and never matched shipped behavior.

## Testimony requests

<!-- When intent is unrecoverable from artifacts, request testimony by name
instead of inventing a plausible story. An exhausted request is recorded
honestly; the downstream output may then be at most a negative certificate. -->

### TR1

- Who to ask: Julian Cataldo (steward, sole author)
- What to ask: The invalid fixture and its test expectations were born
  already mismatched in `555a2a7` (E1–E3): expectations assert
  local-`valid.schema.json` errors while the committed fixture points at the
  remote prettierrc schema. Was the fixture repurposed pre-commit to
  exercise the remote-URL path (with the test left behind), and which side
  is intended going forward — restore a local-schema enum-invalid fixture
  (reviving the suggestion branch's executable evidence, 01-Q5), rewrite
  expectations to the remote actuals, or both (two fixtures)?
- Would corroborate: Q1(a) adjudication; failed-attempt vs repurpose story
- Status: answered (→ E36; origin unremembered — repurpose story stays
  uncorroborated)

### TR2

- Who to ask: Julian Cataldo
- What to ask: `Empty frontmatter` red expects `schemaNotFound` while actual
  is `schemaMalformed` (E8, E9; mechanism filed in the pool spec). Does the
  `schemaNotFound` expectation stand as the desired end-state (to be landed
  by the planned error-surfacing repass), and is the commented-out
  `No schema set` subtest part of that same desired family?
- Would corroborate: Q1(b) adjudication; red-suite = desired-behavior status
- Status: answered (→ E37; the expectation itself adjudicated a
  misconception — new freeform intent supersedes both sides)

### TR3

- Who to ask: Julian Cataldo
- What to ask: README claims "Auto-fix via `--fix` for simple cases"
  (day-one claim, E11) but `fix: true` applies nothing (E13) — only IDE
  suggestions exist, and `meta.fixable: 'code'` is inert (E14). Was the
  claim aspirational from the start? Disposition: soften the README now
  and keep `fixable` + the claim's intent as repass workload (the C15
  "cues" pattern), implement a real `fix`, or drop both flag and claim?
- Would corroborate: Q2 + 03-Q4 joint adjudication
- Status: answered (→ E38)

### TR4

- Who to ask: Julian Cataldo
- What to ask: `meta.docs.url` has pointed at the upstream remark repo since
  the initial commit (E15), and upstream is now dormant with the port as
  successor (ADR 0002 C21). Intended (docs live there) or leftover to
  repoint at this repo? And the WIP caveat "remaining tuning on how schemas
  are loaded" (added the night of the 0.0.1 publish, E16): keep as-is, or
  reword to name the deferred ingestion redesign explicitly?
- Would corroborate: Q3 adjudication
- Status: answered (→ E39; caveat-wording half unaddressed)

### TR5

- Who to ask: Julian Cataldo
- What to ask: README § Project Layout names `src/fixtures/` which never
  existed at any commit (E18). Plain writing error at README birth, or
  fossil of an intended layout move?
- Would corroborate: Q4 adjudication
- Status: answered (→ E40)

### TR6

- Who to ask: Julian Cataldo
- What to ask: 0.0.0 is a 168-byte manifest-only publish from day one (E19);
  0.0.1 ships the compiled test suite because `!dist/test` misses
  `dist/tests` (E20), and today's tree would republish the same (E21). Was
  0.0.0 a name-claim (or accident)? Is shipping `dist/tests` + source maps
  a defect to fix at next publish, or tolerated?
- Would corroborate: Q5 adjudication
- Status: answered (→ E41)

### TR7

- Who to ask: Julian Cataldo
- What to ask: The suite hard-requires a config file from the CWD and
  silently composes every test with the repo's own `eslint.config.js`
  (E23–E26) — including the markdown language registration, without which
  nothing parses. Intended harness design (dogfood-as-harness) or accident?
  Disposition: document it as the harness contract, or isolate tests with
  `overrideConfigFile: true` + explicit `language`? Note: ESLint v9 resolves
  the config from CWD, not nearest-to-file; nearest-from-file arrives as the
  v10 default (E25 — this settles ADR 0002's C20 verification flag).
- Would corroborate: Q6 adjudication; C20 flag resolution
- Status: answered (→ E42)

### TR8

- Who to ask: Julian Cataldo
- What to ask: Both npm versions carry no git tag, semantic-release never
  ran (no tags/changelog, E28), and `release.yml` is a byte-identical
  upstream copy committed fully commented out (E27). Confirm both publishes
  were manual `npm publish`. What is the intended release contract going
  forward — activate semantic-release + workflow (adapted to `main`), keep
  manual publishes, or defer the decision?
- Would corroborate: Q7 adjudication; failed-attempt/copy-over analysis
- Status: answered (→ E43)

### TR9

- Who to ask: Julian Cataldo
- What to ask: `/docs` was ignored from init and un-ignored (commented) in
  the seedbed-setup commit `4de64c9`, which also wrote the campaign text
  still describing it as ignored (E30). Confirm the un-ignore was deliberate
  and tracked-`docs/` is the desired end state; keep or delete the `# /docs`
  breadcrumb line?
- Would corroborate: Q8 (recalibrated) adjudication
- Status: answered (→ E44; breadcrumb line disposition implicit — pattern
  declared retired)

### TR10

- Who to ask: Julian Cataldo
- What to ask: Fixture dispositions (03-Q3): `sample.md` has no test
  consumer but is a live IDE-demo surface erroring on purpose under the
  dogfood config (E31, E33) — keep as demo (and document), or retire?
  `.dev.invalid.schema.json` is an untracked byte-duplicate of
  `valid.schema.json` referenced by nothing (E32) — delete, or keep as
  scratch? (Ties to TR1 if a restored enum-invalid fixture wants the name.)
- Would corroborate: 03-Q3 adjudication (certificate vs retained-with-reason)
- Status: answered (→ E45; no certificate — clean-slate redesign after the
  excavation is the disposal authority)
