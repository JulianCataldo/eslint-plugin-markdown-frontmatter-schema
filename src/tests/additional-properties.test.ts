import { ESLint } from 'eslint';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import frontmatterSchema from '../index.js';
import { getPath } from './test-utilities.js';

await test('ESLint plugin: additionalProperties error positions', async (t) => {
	const eslint = new ESLint({
		overrideConfig: [
			{
				files: ['**/*.md'],
				plugins: { 'frontmatter-schema': frontmatterSchema },
				rules: {
					'frontmatter-schema/frontmatter-schema': [
						'error',
						{
							defaultSchema: {
								additionalProperties: false,
								properties: {
									title: { type: 'string' },
								},
								type: 'object',
							},
						},
					],
				},
			},
		],
	});

	await t.test(
		'additionalProperties: exactly one error pointing to the offending key',
		async () => {
			const fixturePath = getPath('../../fixtures/additional-property.invalid.md');
			const results = await eslint.lintFiles([fixturePath]);

			assert.strictEqual(results.length, 1);
			const [result] = results;

			assert.strictEqual(result.errorCount, 1, 'one error for one additional property');

			const [message] = result.messages;

			assert.strictEqual(message.line, 3, 'error matches extra key line');
			assert.strictEqual(message.endLine, 3, 'error does not flow into the next line');

			assert.strictEqual(message.column, 1, 'error starts at first char');
			assert.strictEqual(message.endColumn, 10, 'error ends at last char');
		},
	);
});
