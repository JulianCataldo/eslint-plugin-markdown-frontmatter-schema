import { ESLint } from 'eslint';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import frontmatterSchema from '../index.js';
import { getPath } from './test-utilities.js';

const { DEBUG } = process.env;
if (DEBUG) console.warn('DEBUG MODE');

await test('ESLint plugin: Validate linked $schema in frontmatter', async (t) => {
	const eslint = new ESLint({
		overrideConfig: [
			{
				files: ['**/*.md'],
				plugins: {
					'frontmatter-schema': frontmatterSchema,
				},
				rules: {
					'frontmatter-schema/frontmatter-schema': ['error'],
				},
			},
		],
	});

	await t.test('Valid: Should pass without errors', async () => {
		const validFilePath = getPath(
			'../../fixtures/sample-with-linked-schema.md',
		);
		const results = await eslint.lintFiles([validFilePath]);

		if (DEBUG) console.log({ results });

		assert.strictEqual(results.length, 1);
		const [result] = results;
		assert.strictEqual(result.errorCount, 0);
		assert.strictEqual(result.warningCount, 0);
	});

	await t.test('Invalid: Should not pass, with 2 errors', async () => {
		const validFilePath = getPath(
			'../../fixtures/sample-with-linked-schema.invalid.md',
		);
		const results = await eslint.lintFiles([validFilePath]);

		if (DEBUG) console.dir({ results }, { depth: null });

		assert.equal(results.length, 1);
		const [result] = results;
		assert.deepEqual(result.messages, [
			{
				column: 14,
				endColumn: 14,
				endLine: 3,
				line: 3,
				message: 'YAML schema validation error: must be string at /description',
				nodeType: 'yaml',
				ruleId: 'frontmatter-schema/frontmatter-schema',
				severity: 2,
			},
			{
				column: 11,
				endColumn: 11,
				endLine: 4,
				line: 4,
				message:
					'YAML schema validation error: must be equal to one of the allowed values at /category',
				nodeType: 'yaml',
				ruleId: 'frontmatter-schema/frontmatter-schema',
				severity: 2,
				suggestions: [
					{
						desc: 'Replace with "Book"',
						fix: { range: [58, 64], text: 'Book' },
					},
					{
						desc: 'Replace with "Movie"',
						fix: { range: [58, 64], text: 'Movie' },
					},
					{
						desc: 'Replace with "Song"',
						fix: { range: [58, 64], text: 'Song' },
					},
				],
			},
		]);
	});
});
