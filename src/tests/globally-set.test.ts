import { ESLint } from 'eslint';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import frontmatterSchema from '../index.js';
import { getPath } from './test-utilities.js';

const { DEBUG } = process.env;
if (DEBUG) console.warn('DEBUG MODE');

await test('ESLint plugin: Globally associated', async (t) => {
	const eslint = new ESLint({
		overrideConfig: [
			{
				files: ['**/*.md'],
				plugins: {
					'frontmatter-schema': frontmatterSchema,
				},
				rules: {
					'frontmatter-schema/frontmatter-schema': [
						'error',
						{
							defaultSchema: {
								properties: {
									description: { type: 'string' },
									foo: { type: 'null' },
									title: { type: 'string' },
								},
								required: ['title', 'foo'],
								type: 'object',
							},
						},
					],
				},
			},
		],
	});

	await t.test('Valid: Should produce errors', async () => {
		const validFilePath = getPath('../../fixtures/sample-globally-set.md');
		if (DEBUG) console.log({ validFilePath });

		const results = await eslint.lintFiles([validFilePath]);

		if (DEBUG) console.log({ results });

		assert.strictEqual(results.length, 1);
		const [result] = results;
		assert.strictEqual(result.errorCount, 2);
		assert.strictEqual(result.warningCount, 0);
		assert.strictEqual(
			result.messages.at(0)?.message,
			"YAML schema validation error: must have required property 'foo' at root",
		);
	});
});
