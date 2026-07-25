// Observation harness for dig excavate-rule-runtime-contract.
// Drives the BUILT plugin (dist/index.js) through eslint Linter with the
// same wiring as the repo dogfood config (markdown/gfm + frontmatter: yaml).
// Prints one JSON line per case: { case, opts, filename, md, result }.
// Usage: node matrix.mjs [caseIdFilter]
import { Linter } from 'eslint';
import markdown from '@eslint/markdown';

const R =
	'/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema';
const FX = new URL('./fx/', import.meta.url).pathname;
const plugin = (await import(`${R}/dist/index.js`)).default;

const linter = new Linter();

function config(ruleOpts) {
	return [
		{
			files: ['**/*.md'],
			language: 'markdown/gfm',
			languageOptions: { frontmatter: 'yaml' },
			plugins: { markdown, 'frontmatter-schema': plugin },
			rules: { 'frontmatter-schema/frontmatter-schema': ruleOpts },
		},
	];
}

function run(md, ruleOpts, filename) {
	const t0 = performance.now();
	try {
		const messages = linter.verify(md, config(ruleOpts), filename);
		return { ms: Math.round(performance.now() - t0), messages };
	} catch (error) {
		return {
			ms: Math.round(performance.now() - t0),
			threw: String(error?.message ?? error),
		};
	}
}

const DOC = `${FX}doc.md`;
const objDefault = (extra) => [
	'error',
	{ defaultSchema: { type: 'object', ...extra } },
];

const cases = [
	// Q1 — resolution
	[
		'q1-rel-path',
		`---\n$schema: ./enum.schema.json\nkind: Movie\n---\n`,
		['error'],
		DOC,
	],
	[
		'q1-precedence-inline-vs-default',
		`---\n$schema: ./enum.schema.json\nkind: Movie\n---\n`,
		objDefault({ required: ['zzz'] }),
		DOC,
	],
	[
		'q1-http-not-url',
		`---\n$schema: http://json.schemastore.org/prettierrc.json\nkind: Movie\n---\n`,
		['error'],
		DOC,
	],
	[
		'q1-protocol-relative',
		`---\n$schema: //example.com/x.schema.json\nkind: Movie\n---\n`,
		['error'],
		DOC,
	],
	[
		'q1-file-url',
		`---\n$schema: file://${FX}enum.schema.json\nkind: Movie\n---\n`,
		['error'],
		DOC,
	],
	[
		'q1-absolute-path',
		`---\n$schema: ${FX}enum.schema.json\nkind: Movie\n---\n`,
		['error'],
		DOC,
	],
	[
		'q1-nonstring-inline',
		`---\n$schema: 123\nkind: Movie\n---\n`,
		['error'],
		DOC,
	],
	// Q2 — malformed YAML
	[
		'q2-unclosed-flow',
		`---\nfoo: [unclosed\n---\n`,
		objDefault({ required: ['foo'] }),
		DOC,
	],
	[
		'q2-tab-indent',
		`---\n\tfoo: 1\n---\n`,
		objDefault({ required: ['foo'] }),
		DOC,
	],
	[
		'q2-duplicate-key',
		`---\na: 1\na: 2\n---\n`,
		objDefault({ required: ['a'] }),
		DOC,
	],
	// Q4 — validated payload + offsets
	[
		'q4-schema-key-vs-apfalse',
		`---\n$schema: ./ap-false.schema.json\ntitle: hi\n---\n`,
		['error'],
		DOC,
	],
	[
		'q4-root-required-loc',
		`---\ntitle: hi\n---\n`,
		objDefault({ required: ['missing'] }),
		DOC,
	],
	[
		'q4-offsets-multiline',
		`---\ntitle: hi\ndesc: |\n  multi\n  line\nnum: nope\n---\n\n# Body\n`,
		[
			'error',
			{
				defaultSchema: JSON.parse(
					await (
						await import('node:fs/promises')
					).readFile(`${FX}num.schema.json`, 'utf8'),
				),
			},
		],
		DOC,
	],
	[
		'q4-body-yaml-lookalike',
		`---\ntitle: hi\n---\n\nSome paragraph.\n\n---\nfake: yaml\nalso: here\n---\n`,
		objDefault({ required: ['title'] }),
		DOC,
	],
	[
		'q4-no-frontmatter',
		`# Just markdown\n\nNo frontmatter here.\n`,
		objDefault({ required: ['title'] }),
		DOC,
	],
	// Q5 — suggestions / fix
	[
		'q5-enum-suggestions',
		`---\nkind: Rock\n---\n`,
		[
			'error',
			{
				defaultSchema: JSON.parse(
					await (
						await import('node:fs/promises')
					).readFile(`${FX}enum.schema.json`, 'utf8'),
				),
			},
		],
		DOC,
	],
	// Q6 — options shapes
	['q6-bare-error-no-schema', `---\ntitle: hi\n---\n`, ['error'], DOC],
	['q6-empty-options-object', `---\ntitle: hi\n---\n`, ['error', {}], DOC],
	[
		'q6-string-defaultSchema',
		`---\ntitle: hi\n---\n`,
		['error', { defaultSchema: './enum.schema.json' }],
		DOC,
	],
	['q6-unknown-option', `---\ntitle: hi\n---\n`, ['error', { bogus: 1 }], DOC],
	[
		'q6-schemas-glob-option',
		`---\ntitle: hi\n---\n`,
		['error', { schemas: { './enum.schema.json': ['**/*.md'] } }],
		DOC,
	],
	['q6-empty-fm-bare', `---\n---\n`, ['error'], DOC],
	['q6-empty-fm-empty-obj', `---\n---\n`, ['error', {}], DOC],
	[
		'q6-empty-fm-valid-default',
		`---\n---\n`,
		objDefault({ required: ['title'] }),
		DOC,
	],
	// Ajv edges
	[
		'ajv-id-file-a',
		`---\n$schema: ./withid.schema.json\ntitle: hi\n---\n`,
		['error'],
		`${FX}a.md`,
	],
	[
		'ajv-id-file-b-second-compile',
		`---\n$schema: ./withid.schema.json\ntitle: hi\n---\n`,
		['error'],
		`${FX}b.md`,
	],
	[
		'ajv-id-file-a-relint',
		`---\n$schema: ./withid.schema.json\ntitle: hi\n---\n`,
		['error'],
		`${FX}a.md`,
	],
	[
		'ajv-draft-2020-meta',
		`---\n$schema: ./draft2020.schema.json\ntitle: hi\n---\n`,
		['error'],
		DOC,
	],
	// Q3 — loader failure paths (run individually for stderr capture)
	[
		'q3-missing-local',
		`---\n$schema: ./nope.schema.json\ntitle: hi\n---\n`,
		['error'],
		DOC,
	],
	[
		'q3-malformed-schema-file',
		`---\n$schema: ./bad-json.schema.json\ntitle: hi\n---\n`,
		['error'],
		DOC,
	],
	[
		'q3-remote-connection-refused',
		`---\n$schema: https://127.0.0.1:9/x.schema.json\ntitle: hi\n---\n`,
		['error'],
		DOC,
	],
];

const filter = process.argv[2];
for (const [id, md, opts, filename] of cases) {
	if (filter && id !== filter) continue;
	const result = run(md, opts, filename);
	const record = {
		case: id,
		filename: filename.replace(FX, 'FX/'),
		md,
		opts,
		result,
	};
	console.log(JSON.stringify(record));
}

// Fix pass observation for the enum case: does --fix change the text?
if (!filter || filter === 'q5-enum-suggestions') {
	const md = `---\nkind: Rock\n---\n`;
	const enumSchema = JSON.parse(
		await (
			await import('node:fs/promises')
		).readFile(`${FX}enum.schema.json`, 'utf8'),
	);
	const res = linter.verifyAndFix(
		md,
		config(['error', { defaultSchema: enumSchema }]),
		DOC,
	);
	console.log(
		JSON.stringify({
			case: 'q5-verifyAndFix',
			fixed: res.fixed,
			outputChanged: res.output !== md,
		}),
	);
}
