# Evidence Ledger

<!-- Verbatim and append-only. Record findings exactly as found — never
professionalize, paraphrase, or polish. Interpretation lives in claims.md,
pointing back at entry ids. Correct a wrong entry by appending a correction
that references it, never by rewriting it. -->

Three altitudes: full artifacts live in `attachments/upstream-probes/`
(runner, fixtures, captured output — re-runnable with
`cd attachments/upstream-probes && pnpm install && node probes.mjs`); this
ledger holds index + verbatim hooks; interpretation is claims.md's job.
Upstream corpus: local checkout
`/Volumes/n_1024a-Projects/Repositories/packages/remark-lint-frontmatter-schema`
(read-only) plus the published npm artifact
`remark-lint-frontmatter-schema@3.15.3` (what the probes ran).

## Entries

### E1

- Source: npm registry, `remark-lint-frontmatter-schema` release timeline
- Locator: `npm view remark-lint-frontmatter-schema time`
- Collected: 2026-07-26
- Class: vcs-history

```text
3.15.3 2023-09-15T03:43:28.837Z
3.15.4 2023-10-15T17:25:33.866Z
```

Local checkout HEAD is the 3.15.3 release commit (`7b2192d chore(release):
3.15.3 [skip ci]`); the 3.15.4 release commit is absent from local history.

### E2

- Source: upstream `index.ts`, `Settings` interface
- Locator: index.ts `export interface Settings`
- Collected: 2026-07-26
- Class: period-document

```text
schemas?: Record<string, string[]>;   // "Global workspace file associations mapping (for linter extension)."
embed?: JSONSchema7;                  // "Direct schema embedding (for using inside an `unified` transform pipeline)."
ajvOptions?: AjvOptions;              // "**Documentation**: https://ajv.js.org/options.html"
```

### E3

- Source: upstream `index.ts`, local `$schema` resolution
- Locator: index.ts `validateFrontmatter`, local-association branch
- Collected: 2026-07-26
- Class: period-document

```text
const standardPath = path.join(dirFromCwd, yamlJS.$schema);
if (existsSync(standardPath)) {
    schemaPathFromCwd = standardPath;
} else {
    /* Non standard behavior, like TS / Vite, not JSON Schema resolution.
      Resolving `/my/path` or `my/path` from current remark project root */
    schemaPathFromCwd = path.join(remarkCwd, yamlJS.$schema);
}
```

No URL-scheme branch exists anywhere in the file (grep for `https` finds only
the repo url, a vfile docs link, and the ajv docs url). Two-step fallback:
md-dir-relative if it exists, else remark-project-root-relative.

### E4

- Source: upstream `index.ts`, `$schema` key removal before validation
- Locator: index.ts `validateFrontmatter`, after schema bundling
- Collected: 2026-07-26
- Class: period-document

```text
/* Schema is now extracted,
  remove in-file `$schema` key, so it will not interfere later */

if (hasLocalAssoc && yamlJS && typeof yamlJS.$schema === 'string') {
    delete yamlJS.$schema;
}
```

### E5

- Source: upstream `index.ts`, global glob-map association
- Locator: index.ts `validateFrontmatter`, `settings.schemas` block
- Collected: 2026-07-26
- Class: period-document

```text
/* Global schemas associations, only if no local schema is set */
if (yamlDoc && yamlJS && !hasLocalAssoc) {
    Object.entries(settings.schemas ?? {}).forEach(
        ...
            if (minimatch(vFilePathRel, mdPathCleaned)) {
                schemaPathFromCwd = path.join(remarkCwd, globSchemaPath);
            }
```

Guarded by `yamlJS` truthiness; `vFilePathRel = path.relative(remarkCwd,
vFile.path)`. `remarkCwd` comes from `getRemarkCwd`: `findUp` over seven
`.remarkrc*` names from the md file's directory, else `process.cwd()`.

### E6

- Source: upstream `index.ts`, schema source precedence
- Locator: index.ts `validateFrontmatter`, schema selection chain
- Collected: 2026-07-26
- Class: period-document

```text
let schema: JSONSchema7 | undefined;
if (hasPropSchema) {
    schema = settings.embed;
} else if (schemaPathFromCwd) {
    schema = await $RefParser
        .bundle(schemaPathFromCwd)
```

`hasPropSchema = typeof settings.embed === 'object'` is evaluated first:
`embed` wins over both local `$schema` and the glob map.

### E7

- Source: upstream `index.ts`, Ajv lifecycle
- Locator: index.ts `validateFrontmatter`, Ajv setup inside the per-file call
- Collected: 2026-07-26
- Class: period-document

```text
const ajv = new Ajv({
    /* Defaults */
    allErrors: true /* So it doesn't stop at the first found error */,
    strict: false /* Prevents warnings for valid, but relaxed schemas */,

    /* User settings / overrides */
    ...settings.ajvOptions,
});
addFormats(ajv);
```

A fresh Ajv instance per validated file, inside `validateFrontmatter`.

### E8

- Source: upstream `index.ts`, soft-failure message paths
- Locator: index.ts `validateFrontmatter`, three try/catch banners
- Collected: 2026-07-26
- Class: period-document

```text
const banner = `YAML frontmatter parsing: ${schemaPathFromCwd ?? ''}`;
...
const banner = `YAML schema file load/parse: ${schemaPathFromCwd ?? ''}`;
...
const banner = `JSON schema malformed: ${schemaPathFromCwd ?? ''}`;
vFile.message(`${banner} — ${error.name}: ${error.message}`);
```

Parse errors, schema load errors, and Ajv compile errors are each caught and
downgraded to a vFile message; nothing rethrows.

### E9

- Source: upstream `index.ts`, `pushErrors`
- Locator: index.ts `pushErrors`, position mapping and suggestion seeds
- Collected: 2026-07-26
- Class: period-document

```text
const OPENING_FENCE_LINE_COUNT = 1; /* Takes the `---` into account */
const start = lineCounter.linePos(node.range[0]);
const end = lineCounter.linePos(node.range[1]);
message.position = { start: {...}, end: {...} };
...
/* Auto-fix replacement suggestions for `enum` */
message.expected = error.params.allowedValues;
} else if (typeof error.params.allowedValue === 'string') {
...
/* Auto-fix replacement suggestion for `const` */
message.expected = [error.params.allowedValue];
```

Also sets `message.actual = node.toString()`, `message.fatal = true`, a
multi-line `message.note`, and a custom `.schema` field carrying the raw AJV
error. Root-path errors (non-node) get no position — comment: "squiggling the
opening frontmatter fence for **root** path errors".

### E10

- Source: upstream `index.ts`, rule entry
- Locator: index.ts `remarkFrontmatterSchema` (lintRule callback)
- Collected: 2026-07-26
- Class: period-document

```text
async (ast: Root, vFile: VFile, settings: Settings = {}) => {
    if (ast.children.length) {
        /* Handle only if the processed Markdown file has a frontmatter section */
        const frontmatter = ast.children.find((child): child is YAML => child.type === 'yaml');
        if (frontmatter) {
            await validateFrontmatter(frontmatter, vFile, settings);
```

Fully async; fires only when a yaml node exists (3.15.3: first yaml child
anywhere, per `c09c902 fix: treat first yaml section as frontmatter, even if
it is not the first child`).

### E11

- Source: npm artifacts, 3.15.4 vs 3.15.3
- Locator: `diff` of the two published `dist/index.js` + `package.json`
- Collected: 2026-07-26
- Class: vcs-history

```text
10c10
< import { minimatch } from 'minimatch';
---
> import minimatch from 'minimatch';
257c257
<         if (frontmatter?.type === 'yaml') {
---
>         if (frontmatter) {
```

3.15.4 dependencies are exact-pinned: `minimatch: '9.0.3'`, `find-up:
'6.3.0'`, `ajv: '8.12.0'`, `ajv-formats: '2.1.1'`, `yaml: '2.3.3'`,
`@apidevtools/json-schema-ref-parser: '11.1.0'`, `unified-lint-rule:
'2.1.2'`. No other dist change.

### E12

- Source: upstream checkout, committed vs working-tree dependencies
- Locator: `git show HEAD:package.json` dependencies vs `package.json` +
  installed `node_modules`
- Collected: 2026-07-26
- Class: period-document

```text
committed (3.15.3): "minimatch": "^7.4.6", "find-up": "^6.3.0",
  "ajv-formats": "^2.1.1", "@apidevtools/json-schema-ref-parser": "^10.1.0"
working tree / installed: minimatch 10.0.1, find-up 7.0.0, ajv-formats 3.0.1,
  @apidevtools/json-schema-ref-parser 11.7.0, yaml 2.5.1, ajv 8.17.1
```

### E13

- Source: upstream checkout, uncommitted working tree
- Locator: `git status --short` in the upstream repo
- Collected: 2026-07-26
- Class: other (undated steward-intent trace)

```text
 M demo/.vscode/settings.json
A  demo/content/creative-work/with-empty-frontmatter.md
 M demo/package.json
 M package.json
 M pnpm-lock.yaml
 M tsconfig.json
?? demo/__.remarkrc.yaml
?? "index copy.ts"
?? index.test.ts
?? "package copy.json"
```

`index copy.ts` (untracked) carries `import { minimatch } from 'minimatch';`
(same fix 3.15.4 shipped), drops the copyright banner, comments out the
custom `.schema` message field (`test: string;` placeholder), and adds
`message as VFileMessage;` no-op lines. `index.test.ts` (untracked) is a
demo-pipeline-style smoke script under `node:test`, not an assertion suite.

### E14

- Source: observed run, local upstream dist import
- Locator: attachments/upstream-probes/local-dist-probe.mjs + output
- Collected: 2026-07-26
- Class: observed-behavior

```text
LOCAL DIST IMPORT FAILED: SyntaxError: The requested module 'minimatch' does not provide an export named 'default'
```

The local checkout (committed 3.15.3 dist + working-tree-bumped
node_modules) fails at import time.

### E15

- Source: observed run, probe U1 ($schema key + additionalProperties:false)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U1
- Collected: 2026-07-26
- Class: observed-behavior

```text
md: "---\n$schema: ./basic.schema.json\ntitle: hi\n---\n"
messages (0):
```

Schema has `"additionalProperties": false` and does not declare `$schema`;
upstream reports nothing (the key was deleted before validation).

### E16

- Source: observed run, probe U2 (local `$schema` vs `embed`)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U2
- Collected: 2026-07-26
- Class: observed-behavior

```text
settings: {"embed":{"required":["zzz"],"type":"object"}}
{"message":"Must have required property 'zzz' • content/basic.schema.json • #/required", ...}
```

The md's local `$schema` points at a schema the document satisfies; the
reported violation comes from `embed` — embed won. (Banner quirk: the message
still prints the local schema's path while validating against `embed`.)

### E17

- Source: observed run, probe U3 (tab-indent YAML)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U3
- Collected: 2026-07-26
- Class: observed-behavior

```text
md: "---\n\tfoo: 1\n---\n"
settings: {"embed":{"required":["foo"],"type":"object"}}
messages (0):
```

Tab-indented (invalid) YAML: total silence — parser recovered `{foo: 1}`,
which satisfies the schema. The `YAML frontmatter parsing:` catch did not
fire.

### E18

- Source: observed run, probe U3b (duplicate keys)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U3b
- Collected: 2026-07-26
- Class: observed-behavior

```text
md: "---\na: 1\na: 2\n---\n"
settings: {"embed":{"properties":{"a":{"const":2}},"required":["a"],"type":"object"}}
messages (0):
```

`const: 2` passes — the duplicate key resolved last-wins, silently.

### E19

- Source: observed run, probe U4 (squiggle positions)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U4
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"Must be string • content/basic.schema.json • #/properties/title/type","line":3,"column":8,"position":{"start":{"line":3,"column":8},"end":{"line":3,"column":12}},"actual":"1234","note":"Keyword: type\nType: string\nSchema path: content/basic.schema.json · #/properties/title/type","name":"Markdown YAML frontmatter error (JSON Schema)","fatal":false,...}
```

Real start AND end positions on the offending value token (`title: 1234` on
md line 3 → 3:8–3:12). Note `fatal:false` at runtime despite source setting
`message.fatal = true`.

### E20

- Source: observed run, probe U5 (enum + const suggestion seeds)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U5
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"Must be equal to one of the allowed values: `Movie`, `Song` • ...","expected":["Movie","Song"],"actual":"Rock",...}
{"message":"Must be equal to constant: `draft` • ...","expected":["draft"],"actual":"published",...}
```

`message.expected` is populated for BOTH `enum` and `const` violations.

### E21

- Source: observed run, probes U6a/U6b/U6c ($id schema, three sequential lints)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U6a–U6c
- Collected: 2026-07-26
- Class: observed-behavior

```text
U6a (content/a.md): {"message":"Must be string • content/withid.schema.json • ...",...}
U6b (content/b.md): {"message":"Must be string • content/withid.schema.json • ...",...}
U6c (content/a.md again): {"message":"Must be string • content/withid.schema.json • ...",...}
```

A schema carrying `$id: https://example.com/withid.json` validates three
times in one process — no crash, identical output each time.

### E22

- Source: observed run, probe U7 (draft-2020-12 meta-schema)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U7
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"JSON schema malformed: content/draft2020.schema.json — Error: no schema with key or ref \"https://json-schema.org/draft/2020-12/schema\"","name":"content/doc.md:1:1","fatal":false,...}
```

Compile failure is a soft per-file message; the run continues.

### E23

- Source: observed run, probe U8 (glob map association)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U8
- Collected: 2026-07-26
- Class: observed-behavior

```text
settings: {"schemas":{"content/basic.schema.json":["content/*.md"]}}
{"message":"Must be string • /private/tmp/[…]/upstream-probes/content/basic.schema.json • #/properties/title/type","line":2,"column":8,"position":{...},...}
```

The glob map associates and validates (md has no `$schema`). The reported
schema path is the absolute `path.join(remarkCwd, globSchemaPath)`.

### E24

- Source: observed run, probe U8b (local `$schema` vs glob map)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U8b
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"Must be equal to one of the allowed values: `Movie`, `Song` • content/enum.schema.json • ...",...}
```

With both a matching glob entry and a local `$schema`, the local schema's
violation is the one reported — local beats glob.

### E25

- Source: observed run, probe U9 (https:// `$schema`)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U9
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"YAML schema file load/parse: /private/tmp/[…]/upstream-probes/https:/json.schemastore.org/prettierrc.json — ResolverError: Error opening file \"/private/tmp/[…]/https:/json.schemastore.org/prettierrc.json\" \nENOENT: no such file or directory, ...","name":"content/doc.md:1:1",...}
```

The URL is path-joined into a local path (`https://` collapses to `https:/`)
and fails as a missing file. No network fetch exists upstream.

### E26

- Source: observed run, probe U10 (empty frontmatter + embed)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U10
- Collected: 2026-07-26
- Class: observed-behavior

```text
md: "---\n---\n"
settings: {"embed":{"required":["title"],"type":"object"}}
{"message":"Must be object • #/type","note":"Keyword: type\nType: object\nSchema path:  · #/type",...}
```

Empty frontmatter yields `yamlJS = null`; embed still validates it → "Must
be object" at the root (1:1 fence).

### E27

- Source: observed run, probe U10b (empty frontmatter + glob map)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U10b
- Collected: 2026-07-26
- Class: observed-behavior

```text
md: "---\n---\n"
settings: {"schemas":{"content/basic.schema.json":["content/*.md"]}}
messages (0):
```

The glob-map block is guarded by `yamlJS` truthiness — an empty frontmatter
file matched by the map is silently never validated.

### E28

- Source: observed run, probe U11 (format keyword upstream)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U11
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"Must match format \"date\" • content/format.schema.json • #/properties/when/format","line":3,"column":7,"position":{"start":{"line":3,"column":7},"end":{"line":3,"column":17}},...}
```

### E29

- Source: observed run, probe U12 (missing local schema)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U12
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"message":"YAML schema file load/parse: /private/tmp/[…]/upstream-probes/nope.schema.json — ResolverError: Error opening file \"[…]\" \nENOENT: no such file or directory, ...","name":"content/doc.md:1:1",...}
```

Load failure is an in-band vFile message carrying the resolver's full error;
nothing goes to stderr.

### E30

- Source: observed run, probes U13a/U13b (ajvOptions passthrough)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U13a–U13b
- Collected: 2026-07-26
- Class: observed-behavior

```text
U13a default: messages (2): required 'a', required 'b'
U13b ajvOptions {"allErrors":false}: messages (1): required 'a'
```

### E31

- Source: observed run, probe U14 (no frontmatter)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § U14
- Collected: 2026-07-26
- Class: observed-behavior

```text
md: "# just a heading\n\nbody\n"
settings: {"embed":{"required":["title"],"type":"object"}}
messages (0):
```

### E32

- Source: observed run, port-side probe P1 (format keyword in the port)
- Locator: attachments/upstream-probes/probe-output-2026-07-26.txt § P1 +
  port-probe.mjs
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must match format \"date\" at /when","line":3,"column":7,"nodeType":"yaml","endLine":3,"endColumn":7}
```

The port validates `format` too (point location 3:7–3:7, vs upstream's
3:7–3:17 range on the same input).

### E33

- Source: port repo, dependency and Ajv wiring
- Locator: package.json `dependencies` + src/validate.ts imports/`ajv` const
- Collected: 2026-07-26
- Class: period-document

```text
"ajv": "^8.17.1", "ajv-formats": "^3.0.1",  (no find-up, no minimatch)
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
```

Same Ajv defaults as upstream, `addFormats` carried; the singleton is
module-level (upstream's is per-call). No user-facing `ajvOptions` exists.

### E34

- Source: port repo, README parity claims
- Locator: README.md intro ("This is a port of …")
- Collected: 2026-07-26
- Class: period-document

```text
6:This is a port of [remark-lint-frontmatter-schema](…) for ESLint with the Markdown language support, via `@eslint/markdown`.
10:The API is kept very similar.
20:This is a port of [remark-lint-frontmatter-schema](…) that uses `remark-lint` rule API, but for ESLint with its now official Markdown language support (`@eslint/markdown`).
142:- [`remark-lint-frontmatter-schema`](…) — original `remark-lint` plugin
```

### E35

- Source: Julian Cataldo (steward), testimony recorded in dig
  `excavate-rule-runtime-contract`
- Locator: openspec/changes/excavate-rule-runtime-contract/evidence.md
  (testimony entries) + docs/excavation/01-campaign-reference.md
  § Cross-cutting dependencies
- Collected: 2026-07-26 (cross-dig pointer; statements dated 2026-07-26)
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
schema-config ingestion is acknowledged accidental ("murky", "I screwed up",
semi clean slate) and upstream had the same class of problems ("less
deceptive") — recorded verbatim in the prior dig's ledger; weakens the
upstream intent oracle for ingestion parity.
```

### E36

- Source: port repo VCS
- Locator: `git log --oneline` (port) + branch
  `pr/2-ksh-actual-squiggle-positions`
- Collected: 2026-07-26
- Class: vcs-history

```text
58e4bba docs: experimental spec relationship code annotations
040dabf chore: experimental excavation relationship
4de64c9 chore: setup seedbed + archeology campaigns
9bbddcd build: add inline source maps, remove old deps
7bf90fb docs: initial readme
```

Five commits, all 2026; no port-era history reaches back to the porting act
itself. PR #2 (Andrew Petersen, `10e458f`, on the branch above) restores
real squiggle positions — the upstream behavior of E19.

### E37

- Source: Julian Cataldo (steward), answer to TR1
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
"Implement-later intent, conscious deferral". The goal is to have a similar
behavior as with VS Code JSON language server or the RedHat YAML language
server. It's not trivial to be "100% AJV capabilities implemented and
aligned" (parse, dereference, flatten, bundle, resolve paths,…). That part
(I'm repeating myself) need a proper "semi-clean-slate" approach later.
Which means: "don't be contaminated by prior shortcomings, they don't
indicate a capability constraining intent", but more "I struggled to
materialize the full-scope of schema ingestion". Our blueprint will be based
on the widespread Language Servers specifications (that we will have to
reverse engineer and build a precise requirements cartography to match).
GOAL: I could use a .json, a .yaml or a .md and have a nearly 1:1 (outside a
few peculiarities around config/syntax that is bounded to each
medium+toolchain) developer "common expectations" satisfaction + our "little
extras" (meaning we can go _beyond_, without side-stepping, or trying to be
"original").
```

### E38

- Source: Julian Cataldo (steward), answer to TR2
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
The story around "errors surfacing" needs a full unbiased repass. We want to
identify and exploit all ESLint API capabilities in that field, in a
pertinent manner. There is no "dead code", but more "aborted or miswired"
attempts. Nothing authoritative, again, but valuable cues.
```

### E39

- Source: Julian Cataldo (steward), answer to TR3
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
Excellent question. Schema precedence rules need a (LLM assisted) re-design.
The task will be "let's materialize the most common scenarios and see what
are the most sensible default, and the most ergonomic customization
handles".
```

### E40

- Source: Julian Cataldo (steward), answer to TR4
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
Upstream seems to be in the right, there. Notice that it's how VSCode JSON
LS works, FWIW (to be confirmed, during behavior mapping) in practice. This
needs a reflection about edge cases and on "how others are dealing with
this?" For example, YAML LS use a special
`# yaml-language-server: $schema=/home/what/somefolder/schema.json` key,
while VSC JSON LS use "$schema". I think it's a cue about how other
developers tried to manage this seemingly fundamental issue.
```

### E41

- Source: Julian Cataldo (steward), answer to TR5
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
Again, we want to work like other developer tools works. There is no reason
for NOT allowing everything that AJV allows, theoretically, when it's used
in the mainstreams LSes I mentionned. BTW, maybe they don't use AJV, which I
doubt, but that's the result that count, and the fact that the AJV
ecosystem, with `@apidevtools/json-schema-ref-parser` [that I forgot to
mention before, which is unfortunate, it's a central piece] and is
considered as the most capable, _étalon_ (fr) for this non trivial tasks.
```

### E42

- Source: Julian Cataldo (steward), answer to TR6
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
I recall that ranges where working when I built this tool, initially. I
think there might be a few holes in the racket.
```

### E43

- Source: Julian Cataldo (steward), answer to TR7
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
I think ESLint already handles "nearest eslint config", that's the point (to
be verified), and is why I had to hack a "find-up" in the remark rule. To
polyfill a behavior we are supposed to get for free with ESLint. It's not
really the work of a rule to do this.
```

### E44

- Source: Julian Cataldo (steward), answer to TR8
- Locator: this dig, in-session written reply
- Collected: 2026-07-26
- Class: testimony
- Witness: Julian Cataldo, 2026-07-26

```text
Don't bother with my aborted attempt at trying to update
remark-lint-frontmatter-schema. I ported to ESLint because
  remark has some issues and oddities, and is really hard to maintain
  properly (IMHO), PRECISELY because of the loose
  ecosystem, the need to bring ubiquitous linting helpers that are all
  considered "standards" in ESLint, well battle-tested world.
  I put this rule in dormance, and took my learnings with me for the ESLint
  one. The empty frontmatter case is part of those empirical discoveries
  that needed refinements, but I lost motivations due to many minor issues
  that were unrelated to my core endeavors. For example, with the ESLint
  rule, IIRC the `minimatch` reliance is null and void (that's one less
  dependency to worry about)
```

### E45

- Source: upstream `index.ts`, comment above `getRemarkCwd`
- Locator: index.ts `getRemarkCwd` leading block comment
- Collected: 2026-07-26
- Class: period-document

```text
/* The vFile cwd isn't the same as the one from IDE extension.
Extension will cascade upward from the current processed file and
take the remarkrc file as its cwd. It's multi-level workspace
friendly. We have to mimick this behavior here, as remark lint rules doesn't 
seems to offer an API to hook up on this? */
```

Period corroboration that the find-up machinery was a workaround for a
missing platform affordance, written at authoring time.

## Testimony requests

<!-- When intent is unrecoverable from artifacts, request testimony by name
instead of inventing a plausible story. An exhausted request is recorded
honestly; the downstream output may then be at most a negative certificate. -->

### TR1

- Who to ask: Julian Cataldo (steward, author of both packages)
- What to ask: The `schemas` glob map works upstream (E23) and is declared
  but dead in the port. Was it meant to be implemented in the port later,
  consciously deferred, or copied over without a plan?
- Would corroborate: intent axis of the glob-map divergence; adjudication of
  campaign 03 Q1
- Status: answered (→ E37)

### TR2

- Who to ask: Julian Cataldo
- What to ask: `yamlSyntaxError` and `fixDescription` messageIds are declared
  and never reported in the port. Upstream has a live (if hard-to-reach)
  YAML-parse catch (E8, E17) and no fixDescription analog. Latent plans or
  vestige?
- Would corroborate: campaign 03 Q2 adjudication
- Status: answered (→ E38)

### TR3

- Who to ask: Julian Cataldo
- What to ask: Upstream `embed` beats local `$schema` (E16); the port's
  `defaultSchema` LOSES to inline `$schema`. Was the inversion a deliberate
  semantic fix (a "default" should lose) or an accident of the `??` rewrite?
- Would corroborate: intent axis of the precedence divergence
- Status: answered (→ E39)

### TR4

- Who to ask: Julian Cataldo
- What to ask: Upstream deletes the `$schema` key before validating (E4,
  E15); the port validates it as payload (filed spec, "The `$schema` key is
  part of the validated payload"). Dropped deliberately or lost in the port?
- Would corroborate: intent axis; NOTE standing testimony (E35) already
  marks the whole ingestion zone accidental — this asks only whether the
  deletion specifically was noticed
- Status: answered (→ E40)

### TR5

- Who to ask: Julian Cataldo
- What to ask: Upstream never fetches remote schemas — `https://` mangles
  into a local path (E25). The port added a real `https://` fetch branch.
  Was remote loading an intended new feature of the port?
- Would corroborate: intent axis of the URL divergence (port-only addition)
- Status: answered (→ E41)

### TR6

- Who to ask: Julian Cataldo
- What to ask: Upstream reports real start+end ranges (E19); the port
  reports point locations and PR #2 restores ranges. Was the range loss a
  known porting shortcut ("ship point locs first"), or noticed only when the
  PR arrived?
- Would corroborate: intent axis of the location divergence; context for the
  PR #2 resolution path
- Status: answered (→ E42)

### TR7

- Who to ask: Julian Cataldo
- What to ask: Two workspace affordances vanished in the port: `.remarkrc`
  find-up cwd discovery (E5's `remarkCwd`) and the `ajvOptions` passthrough
  (E30). Deliberate simplification for the ESLint context (which has its own
  config cwd), or dropped by omission?
- Would corroborate: intent axis of the dropped-machinery rows
- Status: answered (→ E43; the find-up half only — `ajvOptions` was not
  addressed and its intent claim stays inference-capped)

### TR8

- Who to ask: Julian Cataldo
- What to ask: The upstream checkout carries uncommitted work (E13): dep
  bumps beyond 3.15.4, `index copy.ts` with the minimatch fix 3.15.4 already
  shipped, a fresh `with-empty-frontmatter.md` demo fixture, and the local
  history lacks the 3.15.4 release commit (E1). What is this tree's story —
  abandoned modernization, parallel machine, or prep for something?
- Would corroborate: failed-attempt/revival analysis of upstream
  maintenance; whether upstream remains the living reference or the port
  supersedes it
- Status: answered (→ E44)
