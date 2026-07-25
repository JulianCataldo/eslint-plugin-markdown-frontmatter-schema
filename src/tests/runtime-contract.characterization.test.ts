/**
 * Characterization tests — dig `excavate-rule-runtime-contract` (2026-07-26).
 *
 * Each test locks OBSERVED behavior of the current pipeline, including
 * behaviors recorded as bugs or accidents in the dig's evidence ledger
 * (openspec/changes/excavate-rule-runtime-contract/evidence.md). Locking is
 * deliberate: these tests are the refactoring safety net. Do NOT "fix" an
 * expectation here to a desired value — desired behavior belongs in its own
 * (possibly failing) test, like the pre-existing red suite entries.
 *
 * Self-contained on purpose: wires Linter + markdown language explicitly
 * instead of inheriting the repo eslint.config.js, so the locked behavior
 * does not depend on the dogfood config.
 */
import markdown from '@eslint/markdown';
import { Linter } from 'eslint';
import * as assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import frontmatterSchema from '../index.js';

const FIXTURES = fileURLToPath(
	new URL('../../fixtures/characterization/', import.meta.url),
);
const DOC = `${FIXTURES}doc.md`;

const linter = new Linter();

type RuleOptions = unknown[];

function config(ruleOptions: RuleOptions) {
	return [
		{
			files: ['**/*.md'],
			language: 'markdown/gfm',
			languageOptions: { frontmatter: 'yaml' },
			plugins: { markdown, 'frontmatter-schema': frontmatterSchema },
			rules: {
				'frontmatter-schema/frontmatter-schema': ruleOptions,
			},
		},
	] as never;
}

function lint(md: string, ruleOptions: RuleOptions, filename = DOC) {
	return linter.verify(md, config(ruleOptions), filename);
}

await test('Characterization: schema resolution (campaign 01 Q1)', async (t) => {
	await t.test('relative inline $schema resolves against the md dir', () => {
		const messages = lint(
			`---\n$schema: ./enum.schema.json\nkind: Movie\n---\n`,
			['error'],
		);
		assert.deepStrictEqual(messages, []);
	});

	await t.test('inline $schema wins over defaultSchema', () => {
		const messages = lint(
			`---\n$schema: ./enum.schema.json\nkind: Movie\n---\n`,
			['error', { defaultSchema: { required: ['zzz'], type: 'object' } }],
		);
		assert.deepStrictEqual(messages, []);
	});

	await t.test('http:// is NOT a URL: resolved as a local path', () => {
		const messages = lint(
			`---\n$schema: http://json.schemastore.org/prettierrc.json\nkind: Movie\n---\n`,
			['error'],
		);
		assert.strictEqual(messages.at(0)?.messageId, 'schemaNotFound');
		// resolve() collapses the double slash: .../fixtures/characterization/http:/...
		assert.match(String(messages.at(0)?.message), /\/http:\/json\.schemastore\.org\//);
	});

	await t.test('non-string inline $schema is ignored; message leaks its placeholder', () => {
		const messages = lint(`---\n$schema: 123\nkind: Movie\n---\n`, ['error']);
		assert.strictEqual(messages.at(0)?.messageId, 'schemaNotFound');
		assert.strictEqual(
			messages.at(0)?.message,
			'Schema not found for frontmatter at "{{schemaPath}}"',
		);
	});
});

await test('Characterization: malformed YAML frontmatter (campaign 01 Q2)', async (t) => {
	await t.test('tab-indent YAML: parser recovers, NO report at all', () => {
		// document.errors gets TAB_AS_INDENT but is never read; recovered
		// content {foo: 1} satisfies the schema => total silence.
		const messages = lint(`---\n\tfoo: 1\n---\n`, [
			'error',
			{ defaultSchema: { required: ['foo'], type: 'object' } },
		]);
		assert.deepStrictEqual(messages, []);
	});

	await t.test('recovered content is validated; violations map inside the broken block', () => {
		const messages = lint(`---\n\tfoo: hello\n---\n`, [
			'error',
			{
				defaultSchema: {
					properties: { foo: { type: 'integer' } },
					required: ['foo'],
					type: 'object',
				},
			},
		]);
		assert.strictEqual(messages.length, 1);
		assert.strictEqual(
			messages.at(0)?.message,
			'YAML schema validation error: must be integer at /foo',
		);
		assert.strictEqual(messages.at(0)?.line, 2);
		assert.strictEqual(messages.at(0)?.column, 7);
	});

	await t.test('duplicate keys: last value wins silently', () => {
		const messages = lint(`---\na: 1\na: 2\n---\n`, [
			'error',
			{ defaultSchema: { required: ['a'], type: 'object' } },
		]);
		assert.deepStrictEqual(messages, []);
	});
});

await test('Characterization: validated payload and locations (campaign 01 Q4)', async (t) => {
	await t.test('the $schema key itself is part of the validated object', () => {
		const messages = lint(
			`---\n$schema: ./ap-false.schema.json\ntitle: hi\n---\n`,
			['error'],
		);
		assert.strictEqual(
			messages.at(0)?.message,
			'YAML schema validation error: must NOT have additional properties at root',
		);
	});

	await t.test('root-level errors land at 1:1 (the opening fence)', () => {
		const messages = lint(`---\ntitle: hi\n---\n`, [
			'error',
			{ defaultSchema: { required: ['missing'], type: 'object' } },
		]);
		const first = messages.at(0);
		assert.strictEqual(
			first?.message,
			"YAML schema validation error: must have required property 'missing' at root",
		);
		assert.deepStrictEqual(
			{ column: first?.column, endColumn: first?.endColumn, endLine: first?.endLine, line: first?.line },
			{ column: 1, endColumn: 1, endLine: 1, line: 1 },
		);
	});

	await t.test('markdown body is parsed as extra YAML documents and ignored', () => {
		const messages = lint(
			`---\ntitle: hi\n---\n\nSome paragraph.\n\n---\nfake: yaml\nalso: here\n---\n`,
			['error', { defaultSchema: { required: ['title'], type: 'object' } }],
		);
		assert.deepStrictEqual(messages, []);
	});
});

await test('Characterization: suggestions and --fix (campaign 01 Q5)', async (t) => {
	const enumOptions = [
		'error',
		{
			defaultSchema: {
				properties: { kind: { enum: ['Movie', 'Song'] }, title: { type: 'string' } },
				required: ['kind'],
				type: 'object',
			},
		},
	];

	await t.test('enum violations carry replacement suggestions with absolute ranges', () => {
		const messages = lint(`---\nkind: Rock\n---\n`, enumOptions);
		assert.strictEqual(
			messages.at(0)?.message,
			'YAML schema validation error: must be equal to one of the allowed values at /kind',
		);
		assert.deepStrictEqual(
			messages.at(0)?.suggestions?.map((s) => ({ desc: s.desc, fix: s.fix })),
			[
				{ desc: 'Replace with "Movie"', fix: { range: [10, 14], text: 'Movie' } },
				{ desc: 'Replace with "Song"', fix: { range: [10, 14], text: 'Song' } },
			],
		);
	});

	await t.test('--fix never modifies the file (meta.fixable is inert)', () => {
		const md = `---\nkind: Rock\n---\n`;
		const result = linter.verifyAndFix(md, config(enumOptions), DOC);
		assert.strictEqual(result.fixed, false);
		assert.strictEqual(result.output, md);
	});
});

await test('Characterization: options shapes at the edges (campaign 01 Q6)', async (t) => {
	await t.test("['error'] with no schema anywhere: schemaNotFound", () => {
		const messages = lint(`---\ntitle: hi\n---\n`, ['error']);
		assert.strictEqual(messages.at(0)?.messageId, 'schemaNotFound');
	});

	await t.test("['error', {}]: schemaMalformed (diverges from the red desired-behavior test)", () => {
		// The pre-existing red test src/tests/empty-no.test.ts expects
		// schemaNotFound here; this locks what actually happens today.
		const messages = lint(`---\ntitle: hi\n---\n`, ['error', {}]);
		assert.strictEqual(messages.at(0)?.messageId, 'schemaMalformed');
		assert.strictEqual(messages.at(0)?.message, 'Schema is malformed ');
	});

	await t.test('schemas-only options (the declared glob map): schemaMalformed, option unread', () => {
		const messages = lint(`---\ntitle: hi\n---\n`, [
			'error',
			{ schemas: { './enum.schema.json': ['**/*.md'] } },
		]);
		assert.strictEqual(messages.at(0)?.messageId, 'schemaMalformed');
	});

	await t.test('string defaultSchema is rejected at config validation time', () => {
		assert.throws(
			() => lint(`---\ntitle: hi\n---\n`, ['error', { defaultSchema: './enum.schema.json' }]),
			/should be object/,
		);
	});
});

await test('Characterization: Ajv singleton edges (campaign 01 Q3/Q4 recon delta)', async (t) => {
	await t.test('second compile of an $id-carrying schema crashes the lint run', () => {
		const md = `---\n$schema: ./withid.schema.json\ntitle: hi\n---\n`;
		const first = lint(md, ['error'], `${FIXTURES}a.md`);
		assert.deepStrictEqual(first, []);
		// Different file, same schema path: fresh bundled object, same $id.
		assert.throws(
			() => lint(md, ['error'], `${FIXTURES}b.md`),
			/schema with key or id "https:\/\/example\.com\/withid\.json" already exists/,
		);
		// Even relinting the SAME file (IDE save) crashes.
		assert.throws(
			() => lint(md, ['error'], `${FIXTURES}a.md`),
			/already exists/,
		);
	});

	await t.test('draft-2020-12 meta-schema crashes the lint run', () => {
		assert.throws(
			() => lint(`---\n$schema: ./draft2020.schema.json\ntitle: hi\n---\n`, ['error']),
			/no schema with key or ref "https:\/\/json-schema\.org\/draft\/2020-12\/schema"/,
		);
	});
});

await test('Characterization: loader edges (campaign 01 Q3)', async (t) => {
	await t.test('missing local schema: schemaNotFound with the resolved absolute path', () => {
		const messages = lint(`---\n$schema: ./nope.schema.json\ntitle: hi\n---\n`, ['error']);
		assert.strictEqual(messages.at(0)?.messageId, 'schemaNotFound');
		assert.match(String(messages.at(0)?.message), /characterization\/nope\.schema\.json/);
	});

	await t.test('YAML-format schema files load and validate (undocumented capability)', () => {
		const messages = lint(`---\n$schema: ./yamlform.schema.yaml\n---\n`, ['error']);
		assert.strictEqual(
			messages.at(0)?.message,
			"YAML schema validation error: must have required property 'yamltitle' at root",
		);
	});
});
