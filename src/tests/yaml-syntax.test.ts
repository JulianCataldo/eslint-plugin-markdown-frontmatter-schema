import { ESLint } from 'eslint';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import frontmatterSchema from '../index.js';
import { getPath } from './test-utilities.js';

await test('ESLint plugin: YAML syntax errors reported at source location', async (t) => {
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
								properties: {
									categories: {
										items: {
											enum: [
												'Blabbering Musings',
												'AI',
												'JavaScript',
											],
											type: 'string',
										},
										type: 'array',
									},
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
		'tab indentation: YAML parse errors reported at offending line, not root',
		async () => {
			const fixturePath = getPath(
				'../../fixtures/yaml-tab-indent.invalid.md',
			);
			const results = await eslint.lintFiles([fixturePath]);

			assert.strictEqual(results.length, 1);
			const [result] = results;

			// Should report YAML parse errors, not confusing AJV errors at root.
			assert.ok(result.messages.length >= 1, 'expected at least one error');

			// Every error must point at the tab line (4), not the root --- (1).
			for (const msg of result.messages) {
				assert.notStrictEqual(msg.line, 1, `error fell back to root: ${msg.message}`);
			}

			const [first] = result.messages;
			assert.strictEqual(first.line, 4);
			assert.strictEqual(first.column, 1);
			assert.ok(
				first.message.includes('Tabs are not allowed'),
				`unexpected message: ${first.message}`,
			);
		},
	);
});
