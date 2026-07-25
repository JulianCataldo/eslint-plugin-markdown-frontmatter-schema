# Evidence Ledger

<!-- Verbatim and append-only. Record findings exactly as found — never
professionalize, paraphrase, or polish. Interpretation lives in claims.md,
pointing back at entry ids. Correct a wrong entry by appending a correction
that references it, never by rewriting it. -->

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

- Source: GitHub pull request,
  JulianCataldo/eslint-plugin-markdown-frontmatter-schema
- Locator: PR #2, metadata via `gh pr view 2 --json`
- Collected: 2026-07-26
- Class: period-document

```text
{"author":"kirbysayshi","comments":[],"createdAt":"2026-04-24T06:02:44Z",
"files":["fixtures/additional-property.invalid.md",
"fixtures/sample-with-linked-remote-schema.md",
"fixtures/sample-with-linked-schema.invalid.md",
"fixtures/yaml-tab-indent.invalid.md","package.json",
"src/create-reports.ts","src/index.ts","src/prepare.ts",
"src/rules/frontmatter-schema.ts","src/tests/additional-properties.test.ts",
"src/tests/empty-no.test.ts","src/tests/inline-linked.test.ts",
"src/tests/yaml-syntax.test.ts","src/types.ts","src/validate.ts",
"tsconfig.json"],"state":"OPEN",
"title":"fix: root errors were always tied to frontmatter start (---)"}
```

### E7

- Source: GitHub pull request diff, PR #2
- Locator: PR #2 diff, hunk for src/rules/frontmatter-schema.ts (whole-file
  change for that path; shows type-plumbing only, no `meta.schema` change)
- Collected: 2026-07-26
- Class: period-document

```text
-import type { RuleModule } from '@eslint/markdown';
-
 import { createReports } from '../create-reports.js';
+import { Rule, Yaml } from '../types.js';
 
-export const frontmatterSchema: RuleModule = {
+export const frontmatterSchema: Rule.RuleModule = {
 	create(context) {
 		return {
-			yaml(node) {
+			yaml(node: Yaml) {
 				const filePath = context.physicalFilename;
 				const fileContent = context.sourceCode.getText();
 
-				const options = context.options[0];
+				const options: unknown = context.options[0];
```

### E8

- Source: repository source at HEAD 58e4bba
- Locator: src/prepare.ts > parseInlineSchemaPath
- Collected: 2026-07-26
- Class: other

```text
	const inlineSchemaPath: string | undefined =
		'$schema' in yamlJS && typeof yamlJS.$schema === 'string'
			? yamlJS.$schema
			: undefined;

	if (inlineSchemaPath?.startsWith('https://')) return inlineSchemaPath as Url;

	if (inlineSchemaPath)
		return resolve(dirname(filePath), inlineSchemaPath) as AbsolutePath;
```

### E9

- Source: repository source at HEAD 58e4bba
- Locator: src/prepare.ts > parseGlobalSchema
- Collected: 2026-07-26
- Class: other

```text
	if (options === undefined) return { ok: true, value: undefined };

	const globalSchema =
		typeof options === 'object' &&
		options &&
		'defaultSchema' in options &&
		options.defaultSchema;
	if (globalSchema === undefined) return { ok: true, value: undefined };

	if (
		typeof globalSchema !== 'string' &&
		(typeof globalSchema !== 'object' || !globalSchema)
	)
		return {
			error: { messageId: 'schemaMalformed', node },
			ok: false,
		};

	return { ok: true, value: globalSchema as AnyJSONSchema };
```

### E10

- Source: repository source at HEAD 58e4bba
- Locator: src/create-reports.ts > createReports
- Collected: 2026-07-26
- Class: other

```text
	const globalSchema = parseGlobalSchema(options, yaml);
	if (!globalSchema.ok) return [globalSchema.error];

	const { document, lineCounter, yamlJS } = parseFrontmatter(fileContent);

	const inlineSchemaPath = parseInlineSchemaPath(yamlJS, filePath);

	const schema = getSchema(inlineSchemaPath ?? globalSchema.value, yaml);
	if (!schema.ok) return [schema.error];

	const errors = validateFrontmatter(yamlJS, schema.value);

	return retrieveViolations(errors, document, yaml, lineCounter);
```

### E11

- Source: repository source at HEAD 58e4bba
- Locator: src/validate.ts > module scope (ajv singleton), parseFrontmatter
  consumer validateFrontmatter, retrieveViolations (loc + suggest)
- Collected: 2026-07-26
- Class: other

```text
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
[...]
export function validateFrontmatter(
	frontmatter: AnyFrontmatter,
	schema: AnyJSONSchema,
): ErrorObject[] {
	const validate = ajv.compile(schema);
	return !validate(frontmatter) && validate.errors ? validate.errors : [];
}
[...]
		const instancePath = error.instancePath.slice(1).split('/');
		const offendingNode = document.getIn(instancePath, true);

		let line = 1;
		let column = 1;

		let range: [start: number, end: number] | undefined;

		if (isNode(offendingNode) && offendingNode.range) {
			range = [offendingNode.range[0], offendingNode.range[1]];

			const start = lineCounter.linePos(offendingNode.range[0]);
			line = start.line;
			column = start.col;
		}

		const loc = { end: { column, line }, start: { column, line } };
[...]
			suggest:
				range && isEnumError(error)
					? error.params.allowedValues.map((suggestion: unknown) => ({
							desc: `Replace with "${String(suggestion)}"`,

							fix: (fixer: Rule.RuleFixer) =>
								fixer.replaceTextRange(range, String(suggestion)),
						}))
					: undefined,
```

### E12

- Source: repository source at HEAD 58e4bba
- Locator: src/schema-loader.worker.ts > loadSchemaAsync + runAsWorker
- Collected: 2026-07-26
- Class: other

```text
	try {
		const schema = (await $RefParser.bundle(
			pathOrSchema,
		)) as JSONSchema7 | null;

		return schema;
	} catch (error) {
		console.warn(
			`Error loading schema from ${typeof pathOrSchema === 'string' ? pathOrSchema : '[embedded]'}: ${(error as Error).message}`,
		);
		return null;
	}
}

runAsWorker(async (schemaPath: string) => {
	const schema = await loadSchemaAsync(schemaPath);
	return schema;
});
```

### E13

- Source: repository source at HEAD 58e4bba
- Locator: src/rules/frontmatter-schema.ts > frontmatterSchema.meta
- Collected: 2026-07-26
- Class: other

```text
	meta: {
		docs: {
			description: 'Validate YAML frontmatter using JSON Schema',
			recommended: true,
			url: 'https://github.com/JulianCataldo/remark-lint-frontmatter-schema',
		},
		fixable: 'code',

		hasSuggestions: true,
		messages: {
			fixDescription: 'Fix the frontmatter by replacing with a valid value.',
			schemaMalformed: 'Schema is malformed ',
			schemaNotFound: 'Schema not found for frontmatter at "{{schemaPath}}"',
			yamlSyntaxError: 'Invalid YAML frontmatter syntax.',
		},

		schema: [
			{
				additionalProperties: false,
				properties: {
					defaultSchema: { type: 'object' },
					schemas: {
						additionalProperties: {
							items: { type: 'string' },
							type: 'array',
						},
						type: 'object',
					},
				},
				type: 'object',
			},
		],
		type: 'problem',
	},
```

### E14

- Source: repository documentation at HEAD 58e4bba
- Locator: README.md — porting statement (intro) and feature bullets
- Collected: 2026-07-26
- Class: period-document

```text
The API is kept very similar.
[...]
- **Smart suggestions** (e.g. auto-fix enum mismatches)
[...]
- 🛠 Auto-fix via `--fix` for simple cases
```

### E15

- Source: git history, origin
  git@github.com:JulianCataldo/eslint-plugin-markdown-frontmatter-schema.git
- Locator: `git log --format='%h %ad %s' --date=short`, full history at HEAD
  58e4bba
- Collected: 2026-07-26
- Class: vcs-history

```text
58e4bba 2026-07-25 docs: experimental spec relationship code annotations
040dabf 2026-07-24 chore: experimental excavation relationship
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

- Source: git history (correction to E15)
- Locator: `git log --format='%h %ad %s' --date=short | head -8`, re-run
- Collected: 2026-07-26
- Class: vcs-history

CORRECTION of E15: E15's transcription carried two wrong dates (58e4bba is
2026-07-26, not 2026-07-25; 040dabf is 2026-07-25, not 2026-07-24) and
missed commit b549418, which landed during this session after E8–E14 were
collected. `git show b549418 --stat` touches only eslint.config.js and
openspec/* — no src/ paths — so E8–E13 source excerpts hold for both
58e4bba and b549418. Verbatim re-run:

```text
b549418 2026-07-26 docs: apply 'code-specs-relationships'
58e4bba 2026-07-26 docs: experimental spec relationship code annotations
040dabf 2026-07-25 chore: experimental excavation relationship
4de64c9 2026-07-24 chore: setup seedbed + archeology campaigns
9bbddcd 2025-08-07 build: add inline source maps, remove old deps
7bf90fb 2025-07-25 docs: initial readme
555a2a7 2025-07-25 test: add initial tests and fixtures
07f5024 2025-07-25 feat: initial plugin
```

(head -8 cuts before c477455 2025-07-25 chore: init, which E15 lists and
which is not disputed.) Process note: E15's errors came from hand
transcription; from this entry on, verbatim run blocks are captured
shell-side (tee to scratch + append), never retyped.

### E18

- Source: baseline suite run, this repository working tree (= commit
  b549418, src clean), dist rebuilt from src via `pnpm build` (tsc, exit 0;
  dist is gitignored)
- Locator: `pnpm test` (c8 + node:test over dist/tests), full capture in dig
  scratch `baseline-test.txt`; env: node v25.8.2, pnpm 9.12.3, macOS 15.7.7; network-dependent (schemastore fetch)
- Collected: 2026-07-26
- Class: observed-behavior

```text
▶ ESLint plugin: Empty/No schema
  ✖ Empty frontmatter (4565.445595ms)
✖ ESLint plugin: Empty/No schema (4567.665061ms)
▶ ESLint plugin: Globally associated
  ✔ Valid: Should produce errors (4603.694844ms)
✔ ESLint plugin: Globally associated (4605.477908ms)
▶ ESLint plugin: Validate linked $schema in frontmatter
  ✔ Valid: Should pass without errors (4604.904485ms)
  ✖ Invalid: Should not pass, with 2 errors (4498.40373ms)
✖ ESLint plugin: Validate linked $schema in frontmatter (9105.748095ms)
ℹ tests 7
ℹ suites 0
ℹ pass 3
ℹ fail 4
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 13763.377742
```

### E19

- Source: baseline suite run (same run as E18)
- Locator: failing test detail, src/tests/empty-no.test.ts > "Empty
  frontmatter"
- Collected: 2026-07-26
- Class: observed-behavior

```text
test at src/tests/empty-no.test.ts:23:10
✖ Empty frontmatter (4565.445595ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected
  
  + 'schemaMalformed'
  - 'schemaNotFound'
           ^
  
      at TestContext.<anonymous> (/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema/src/tests/empty-no.test.ts:34:10)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async TestContext.<anonymous> (/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema/src/tests/empty-no.test.ts:23:2)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
      at async <anonymous> (/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema/src/tests/empty-no.test.ts:10:1) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 'schemaMalformed',
    expected: 'schemaNotFound',
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
```

### E20

- Source: baseline suite run (same run as E18)
- Locator: failing test detail, src/tests/inline-linked.test.ts > "Invalid:
  Should not pass, with 2 errors"; excerpt = test header plus the assertion
  object's actual/expected lines ([...] marks elided diff pretty-print; full
  capture in scratch)
- Collected: 2026-07-26
- Class: observed-behavior

```text
test at src/tests/inline-linked.test.ts:40:10
✖ Invalid: Should not pass, with 2 errors (4498.40373ms)
[...]
    actual: [ { ruleId: 'frontmatter-schema/frontmatter-schema', severity: 2, message: 'YAML schema validation error: must be string at root', line: 1, column: 1, nodeType: 'yaml', endLine: 1, endColumn: 1 }, { ruleId: 'frontmatter-schema/frontmatter-schema', severity: 2, message: 'YAML schema validation error: must match exactly one schema in oneOf at root', line: 1, column: 1, nodeType: 'yaml', endLine: 1, endColumn: 1 }, { ruleId: 'frontmatter-schema/frontmatter-schema', severity: 2, message: 'YAML schema validation error: must be integer at /printWidth', line: 2, column: 13, nodeType: 'yaml', endLine: 2, endColumn: 13 } ],
    expected: [ { column: 14, endColumn: 14, endLine: 3, line: 3, message: 'YAML schema validation error: must be string at /description', nodeType: 'yaml', ruleId: 'frontmatter-schema/frontmatter-schema', severity: 2 }, { column: 11, endColumn: 11, endLine: 4, line: 4, message: 'YAML schema validation error: must be equal to one of the allowed values at /category', nodeType: 'yaml', ruleId: 'frontmatter-schema/frontmatter-schema', severity: 2, suggestions: [Array] } ],
```

### E21

- Source: baseline suite run (same run as E18)
- Locator: c8 coverage table printed at end of `pnpm test`
- Collected: 2026-07-26
- Class: observed-behavior

```text
---------------------------------------|---------|----------|---------|---------|-------------------
File                                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------------------|---------|----------|---------|---------|-------------------
All files                              |   96.08 |    79.59 |     100 |   96.08 |                   
 ...plugin-markdown-frontmatter-schema |     100 |      100 |     100 |     100 |                   
  eslint.config.js                     |     100 |      100 |     100 |     100 |                   
 ...in-markdown-frontmatter-schema/src |   93.04 |    77.27 |     100 |   93.04 |                   
  create-reports.ts                    |     100 |    83.33 |     100 |     100 | 35                
  index.ts                             |     100 |      100 |     100 |     100 |                   
  prepare.ts                           |   90.75 |       75 |     100 |   90.75 | 34-36,40-47       
  schema-loader.worker.ts              |   84.84 |    66.66 |     100 |   84.84 | 21-25             
  validate.ts                          |   94.94 |       80 |     100 |   94.94 | 65-69             
 ...kdown-frontmatter-schema/src/rules |     100 |      100 |     100 |     100 |                   
  frontmatter-schema.ts                |     100 |      100 |     100 |     100 |                   
 ...kdown-frontmatter-schema/src/tests |     100 |      100 |     100 |     100 |                   
  test-utilities.ts                    |     100 |      100 |     100 |     100 |                   
---------------------------------------|---------|----------|---------|---------|-------------------
 ELIFECYCLE  Test failed. See above for more details.
```

### E22

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases q1-* (schema resolution forms and precedence); full capture
  attachments/captures/matrix-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

One JSON line per case: {case, filename, md, opts, result.messages|threw, result.ms}.
```text
{"case":"q1-rel-path","filename":"FX/doc.md","md":"---\n$schema: ./enum.schema.json\nkind: Movie\n---\n","opts":["error"],"result":{"ms":54,"messages":[]}}
{"case":"q1-precedence-inline-vs-default","filename":"FX/doc.md","md":"---\n$schema: ./enum.schema.json\nkind: Movie\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["zzz"]}}],"result":{"ms":3,"messages":[]}}
{"case":"q1-http-not-url","filename":"FX/doc.md","md":"---\n$schema: http://json.schemastore.org/prettierrc.json\nkind: Movie\n---\n","opts":["error"],"result":{"ms":3,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/http:/json.schemastore.org/prettierrc.json\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
{"case":"q1-protocol-relative","filename":"FX/doc.md","md":"---\n$schema: //example.com/x.schema.json\nkind: Movie\n---\n","opts":["error"],"result":{"ms":2,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"/example.com/x.schema.json\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
{"case":"q1-file-url","filename":"FX/doc.md","md":"---\n$schema: file:///private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json\nkind: Movie\n---\n","opts":["error"],"result":{"ms":2,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/file:/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
{"case":"q1-absolute-path","filename":"FX/doc.md","md":"---\n$schema: /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json\nkind: Movie\n---\n","opts":["error"],"result":{"ms":3,"messages":[]}}
{"case":"q1-nonstring-inline","filename":"FX/doc.md","md":"---\n$schema: 123\nkind: Movie\n---\n","opts":["error"],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"{{schemaPath}}\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
```

### E23

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases q2-* (malformed YAML frontmatter, silent outcomes); full capture
  attachments/captures/matrix-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"case":"q2-unclosed-flow","filename":"FX/doc.md","md":"---\nfoo: [unclosed\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["foo"]}}],"result":{"ms":2,"messages":[]}}
{"case":"q2-tab-indent","filename":"FX/doc.md","md":"---\n\tfoo: 1\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["foo"]}}],"result":{"ms":2,"messages":[]}}
{"case":"q2-duplicate-key","filename":"FX/doc.md","md":"---\na: 1\na: 2\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["a"]}}],"result":{"ms":2,"messages":[]}}
```

### E24

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases q4-* (validated payload, root/property locations, body handling); full capture
  attachments/captures/matrix-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"case":"q4-schema-key-vs-apfalse","filename":"FX/doc.md","md":"---\n$schema: ./ap-false.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":3,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must NOT have additional properties at root","line":1,"column":1,"nodeType":"yaml","endLine":1,"endColumn":1}]}}
{"case":"q4-root-required-loc","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["missing"]}}],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must have required property 'missing' at root","line":1,"column":1,"nodeType":"yaml","endLine":1,"endColumn":1}]}}
{"case":"q4-offsets-multiline","filename":"FX/doc.md","md":"---\ntitle: hi\ndesc: |\n  multi\n  line\nnum: nope\n---\n\n# Body\n","opts":["error",{"defaultSchema":{"type":"object","properties":{"num":{"type":"integer"},"title":{},"desc":{}}}}],"result":{"ms":4,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must be integer at /num","line":6,"column":6,"nodeType":"yaml","endLine":6,"endColumn":6}]}}
{"case":"q4-body-yaml-lookalike","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n\nSome paragraph.\n\n---\nfake: yaml\nalso: here\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["title"]}}],"result":{"ms":4,"messages":[]}}
{"case":"q4-no-frontmatter","filename":"FX/doc.md","md":"# Just markdown\n\nNo frontmatter here.\n","opts":["error",{"defaultSchema":{"type":"object","required":["title"]}}],"result":{"ms":1,"messages":[]}}
```

### E25

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases q5-* (enum suggestions; verifyAndFix outcome); full capture
  attachments/captures/matrix-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"case":"q5-enum-suggestions","filename":"FX/doc.md","md":"---\nkind: Rock\n---\n","opts":["error",{"defaultSchema":{"type":"object","properties":{"kind":{"enum":["Movie","Song"]},"title":{"type":"string"}},"required":["kind"]}}],"result":{"ms":2,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must be equal to one of the allowed values at /kind","line":2,"column":7,"nodeType":"yaml","endLine":2,"endColumn":7,"suggestions":[{"desc":"Replace with \"Movie\"","fix":{"range":[10,14],"text":"Movie"}},{"desc":"Replace with \"Song\"","fix":{"range":[10,14],"text":"Song"}}]}]}}
{"case":"q5-verifyAndFix","fixed":false,"outputChanged":false}
```

### E26

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases q6-* (options shapes at the edges, config-time throws); full capture
  attachments/captures/matrix-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"case":"q6-bare-error-no-schema","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n","opts":["error"],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"{{schemaPath}}\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":3,"endColumn":4}]}}
{"case":"q6-empty-options-object","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n","opts":["error",{}],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema is malformed ","line":1,"column":1,"nodeType":"yaml","messageId":"schemaMalformed","endLine":3,"endColumn":4}]}}
{"case":"q6-string-defaultSchema","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n","opts":["error",{"defaultSchema":"./enum.schema.json"}],"result":{"ms":0,"threw":"Key \"rules\": Key \"frontmatter-schema/frontmatter-schema\":\n\tValue \"./enum.schema.json\" should be object.\n"}}
{"case":"q6-unknown-option","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n","opts":["error",{"bogus":1}],"result":{"ms":0,"threw":"Key \"rules\": Key \"frontmatter-schema/frontmatter-schema\":\n\tValue {\"bogus\":1} should NOT have additional properties.\n\t\tUnexpected property \"bogus\". Expected properties: \"defaultSchema\", \"schemas\".\n"}}
{"case":"q6-schemas-glob-option","filename":"FX/doc.md","md":"---\ntitle: hi\n---\n","opts":["error",{"schemas":{"./enum.schema.json":["**/*.md"]}}],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema is malformed ","line":1,"column":1,"nodeType":"yaml","messageId":"schemaMalformed","endLine":3,"endColumn":4}]}}
{"case":"q6-empty-fm-bare","filename":"FX/doc.md","md":"---\n---\n","opts":["error"],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"{{schemaPath}}\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":2,"endColumn":4}]}}
{"case":"q6-empty-fm-empty-obj","filename":"FX/doc.md","md":"---\n---\n","opts":["error",{}],"result":{"ms":2,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema is malformed ","line":1,"column":1,"nodeType":"yaml","messageId":"schemaMalformed","endLine":2,"endColumn":4}]}}
{"case":"q6-empty-fm-valid-default","filename":"FX/doc.md","md":"---\n---\n","opts":["error",{"defaultSchema":{"type":"object","required":["title"]}}],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must have required property 'title' at root","line":1,"column":1,"nodeType":"yaml","endLine":1,"endColumn":1}]}}
```

### E27

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases ajv-* (singleton Ajv $id registry; draft-2020-12 meta-schema); full capture
  attachments/captures/matrix-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"case":"ajv-id-file-a","filename":"FX/a.md","md":"---\n$schema: ./withid.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":2,"messages":[]}}
{"case":"ajv-id-file-b-second-compile","filename":"FX/b.md","md":"---\n$schema: ./withid.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":1,"threw":"schema with key or id \"https://example.com/withid.json\" already exists\nOccurred while linting /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/b.md:1\nRule: \"frontmatter-schema/frontmatter-schema\""}}
{"case":"ajv-id-file-a-relint","filename":"FX/a.md","md":"---\n$schema: ./withid.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":1,"threw":"schema with key or id \"https://example.com/withid.json\" already exists\nOccurred while linting /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/a.md:1\nRule: \"frontmatter-schema/frontmatter-schema\""}}
{"case":"ajv-draft-2020-meta","filename":"FX/doc.md","md":"---\n$schema: ./draft2020.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":1,"threw":"no schema with key or ref \"https://json-schema.org/draft/2020-12/schema\"\nOccurred while linting /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/doc.md:1\nRule: \"frontmatter-schema/frontmatter-schema\""}}
```

### E28

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: matrix cases q3-* (loader failure paths) plus worker stderr of the same run; full capture
  attachments/captures/matrix-out.jsonl and attachments/captures/matrix-stderr.txt; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"case":"q3-missing-local","filename":"FX/doc.md","md":"---\n$schema: ./nope.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":1,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/nope.schema.json\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
{"case":"q3-malformed-schema-file","filename":"FX/doc.md","md":"---\n$schema: ./bad-json.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":3,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/bad-json.schema.json\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
{"case":"q3-remote-connection-refused","filename":"FX/doc.md","md":"---\n$schema: https://127.0.0.1:9/x.schema.json\ntitle: hi\n---\n","opts":["error"],"result":{"ms":18,"messages":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"https://127.0.0.1:9/x.schema.json\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}}
--- stderr (whole run) ---
Error loading schema from /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/http:/json.schemastore.org/prettierrc.json: Error opening file "/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/http:/json.schemastore.org/prettierrc.json" 
ENOENT: no such file or directory, open '/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/http:/json.schemastore.org/prettierrc.json'
Error loading schema from /example.com/x.schema.json: Error opening file "/example.com/x.schema.json" 
ENOENT: no such file or directory, open '/example.com/x.schema.json'
Error loading schema from /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/file:/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json: Error opening file "/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/file:/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json" 
ENOENT: no such file or directory, open '/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/file:/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json'
Error loading schema from /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/nope.schema.json: Error opening file "/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/nope.schema.json" 
ENOENT: no such file or directory, open '/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/nope.schema.json'
Error loading schema from /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/bad-json.schema.json: Error parsing /private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/bad-json.schema.json: unexpected end of the stream within a flow collection (2:1)

 1 | { this is not json
 2 | 
-----^
Error loading schema from https://127.0.0.1:9/x.schema.json: Error downloading https://127.0.0.1:9/x.schema.json 
fetch failed
```

### E29

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: probe A — dist/prepare.js parseFrontmatter called directly on whole-file text: document.errors vs toJS (recovering parser); full capture
  attachments/captures/probe-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"probe":"A-parseFrontmatter:tab-indent","errors":["TAB_AS_INDENT Tabs are not allowed as indentation at line 2, column 1: pos=[4,5]","MULTIPLE_DOCS Source contains multiple documents; please use YAML.parseAllDocuments() at line 3, column 1: pos=[12,15]"],"warnings":[],"toJS":{"foo":1},"yamlJSUsedByRule":{"foo":1}}
{"probe":"A-parseFrontmatter:unclosed-flow","errors":["BAD_INDENT Flow sequence in block collection must be sufficiently indented and end with a ] at line 3, column 1: pos=[19,20]","MULTIPLE_DOCS Source contains multiple documents; please use YAML.parseAllDocuments() at line 3, column 1: pos=[19,22]"],"warnings":[],"toJS":{"foo":["unclosed"]},"yamlJSUsedByRule":{"foo":["unclosed"]}}
{"probe":"A-parseFrontmatter:duplicate-key","errors":["DUPLICATE_KEY Map keys must be unique at line 3, column 1: pos=[9,10]","MULTIPLE_DOCS Source contains multiple documents; please use YAML.parseAllDocuments() at line 4, column 1: pos=[14,17]"],"warnings":[],"toJS":{"a":2},"yamlJSUsedByRule":{"a":2}}
{"probe":"A-parseFrontmatter:valid-with-body","errors":["MULTIPLE_DOCS Source contains multiple documents; please use YAML.parseAllDocuments() at line 3, column 1: pos=[14,30]"],"warnings":[],"toJS":{"title":"hi"},"yamlJSUsedByRule":{"title":"hi"}}
{"probe":"A-parseFrontmatter:empty-frontmatter","errors":["MULTIPLE_DOCS Source contains multiple documents; please use YAML.parseAllDocuments() at line 2, column 1: pos=[4,7]"],"warnings":[],"toJS":null,"yamlJSUsedByRule":{}}
```

### E30

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: probes B/C/D — schema violations on recovered malformed YAML; YAML-format schema file; empty-string inline $schema; full capture
  attachments/captures/probe-out.jsonl; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
{"probe":"B-tab-indent-type-violation","result":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must be integer at /foo","line":2,"column":7,"nodeType":"yaml","endLine":2,"endColumn":7}]}
{"probe":"B-unclosed-flow-type-violation","result":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must be integer at /foo","line":2,"column":6,"nodeType":"yaml","endLine":2,"endColumn":6}]}
{"probe":"B-dupkey-which-value-wins","result":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must be integer at /foo","line":2,"column":6,"nodeType":"yaml","endLine":2,"endColumn":6}]}
{"probe":"C-yaml-schema-file","result":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"YAML schema validation error: must have required property 'yamltitle' at root","line":1,"column":1,"nodeType":"yaml","endLine":1,"endColumn":1}]}
{"probe":"D-empty-string-inline","result":[{"ruleId":"frontmatter-schema/frontmatter-schema","severity":2,"message":"Schema not found for frontmatter at \"{{schemaPath}}\"","line":1,"column":1,"nodeType":"yaml","messageId":"schemaNotFound","endLine":4,"endColumn":4}]}
```

### E31

- Source: observation harness over built dist (working tree = b549418,
  same build as E18), eslint Linter wired as the dogfood config
  (markdown/gfm + languageOptions.frontmatter: yaml)
- Locator: instrumented dist copy — bundleSchema wrapper appending one line per call to DIG_COUNT_FILE; driver count.mjs: 4 path-schema lints (3 files + 1 relint of the first) then 2 object-defaultSchema lints; full capture
  attachments/captures/count.log; wrapper attachments/harness/instrument-patch.applied.txt; procedure attachments/harness/README.md
- Collected: 2026-07-26
- Class: observed-behavior

```text
--- applied wrapper ---
import { appendFileSync as __digAppend } from 'node:fs';
const __digCountFile = process.env.DIG_COUNT_FILE;
const __bundleSchemaInner = createSyncFn(join(dirname(fileURLToPath(import.meta.url)), './schema-loader.worker.js'));
export const bundleSchema = (arg) => {
    if (__digCountFile) __digAppend(__digCountFile, JSON.stringify({ arg: typeof arg === 'string' ? arg : '[object schema]' }) + '\n');
    return __bundleSchemaInner(arg);
};
--- count.log (6 lines = 6 calls) ---
{"arg":"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json"}
{"arg":"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json"}
{"arg":"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json"}
{"arg":"/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad/hx/fx/enum.schema.json"}
{"arg":"[object schema]"}
{"arg":"[object schema]"}
```

### E32

- Source: characterization battery locked into the repo suite
- Locator: src/tests/runtime-contract.characterization.test.ts (new file,
  uncommitted; fixtures under fixtures/characterization/), first isolated
  run via `node --enable-source-maps --test
  dist/tests/runtime-contract.characterization.test.js`; full capture
  attachments/captures/char-test-run.txt
- Collected: 2026-07-26
- Class: observed-behavior

```text
✔ Characterization: schema resolution (campaign 01 Q1) (59.574555ms)
✔ Characterization: malformed YAML frontmatter (campaign 01 Q2) (7.831537ms)
✔ Characterization: validated payload and locations (campaign 01 Q4) (11.961014ms)
✔ Characterization: suggestions and --fix (campaign 01 Q5) (5.026726ms)
✔ Characterization: options shapes at the edges (campaign 01 Q6) (3.804438ms)
✔ Characterization: Ajv singleton edges (campaign 01 Q3/Q4 recon delta) (7.26808ms)
✔ Characterization: loader edges (campaign 01 Q3) (5.066788ms)
ℹ tests 27
ℹ pass 27
ℹ fail 0
```

### E33

- Source: full `pnpm test` after adding the characterization file (same
  working tree as E18)
- Locator: attachments/captures/suite-with-char.txt; pre-existing red set
  unchanged (Empty frontmatter; Invalid: Should not pass, with 2 errors —
  plus their two parent suites); coverage excerpt below
- Collected: 2026-07-26
- Class: observed-behavior

```text
✖ ESLint plugin: Empty/No schema (2303.1762ms)
✔ ESLint plugin: Globally associated (2344.233304ms)
✖ ESLint plugin: Validate linked $schema in frontmatter (3358.987109ms)
✔ Characterization: schema resolution (campaign 01 Q1) (74.122133ms)
✔ Characterization: malformed YAML frontmatter (campaign 01 Q2) (7.407084ms)
✔ Characterization: validated payload and locations (campaign 01 Q4) (12.203206ms)
✔ Characterization: suggestions and --fix (campaign 01 Q5) (5.956672ms)
✔ Characterization: options shapes at the edges (campaign 01 Q6) (4.460766ms)
✔ Characterization: Ajv singleton edges (campaign 01 Q3/Q4 recon delta) (7.953362ms)
✔ Characterization: loader edges (campaign 01 Q3) (6.68657ms)
ℹ tests 34
ℹ suites 0
ℹ pass 30
ℹ fail 4
✖ failing tests:
✖ Empty frontmatter (2300.285031ms)
✖ Invalid: Should not pass, with 2 errors (1014.588724ms)
[... coverage table excerpt ...]
File                                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
All files                              |     100 |    92.06 |     100 |     100 |                   
  create-reports.ts                    |     100 |      100 |     100 |     100 |                   
  index.ts                             |     100 |      100 |     100 |     100 |                   
  prepare.ts                           |     100 |    88.46 |     100 |     100 | 41,64,86          
  schema-loader.worker.ts              |     100 |       80 |     100 |     100 | 22                
  validate.ts                          |     100 |    94.44 |     100 |     100 | 35                
  frontmatter-schema.ts                |     100 |      100 |     100 |     100 |                   
```

## Testimony requests

<!-- When intent is unrecoverable from artifacts, request testimony by name
instead of inventing a plausible story. An exhausted request is recorded
honestly; the downstream output may then be at most a negative certificate. -->

(none open)
