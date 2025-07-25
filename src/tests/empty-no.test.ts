import { ESLint } from 'eslint';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import frontmatterSchema from '../index.js';

const { DEBUG } = process.env;
if (DEBUG) console.warn('DEBUG MODE');
//
await test('ESLint plugin: Empty/No schema', async (t) => {
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

	await t.test('Empty frontmatter', async () => {
		const results = await eslint.lintText(
			`---

---
`,
			{ filePath: 'empty-frontmatter.md' },
		);

		console.dir({ results }, { depth: null });

		assert.deepStrictEqual(
			results.at(0)?.messages.at(0)?.messageId,
			'schemaNotFound',
		);
	});
	//

	// 	await t.test('No schema set => Schema not found', async () => {
	// 		const results = await eslint.lintText(`---
	// foo: bar
	// ---
	// `);

	// 		console.dir({ results }, { depth: null });

	// 		assert.deepStrictEqual(results.at(0)?.messages.at(0), {
	// 			column: 1,
	// 			endColumn: 4,
	// 			endLine: 3,
	// 			line: 1,
	// 			message: 'Schema not found for frontmatter',
	// 			messageId: 'schemaNotFound',
	// 			nodeType: 'yaml',
	// 			ruleId: 'frontmatter-schema/frontmatter-schema',
	// 			severity: 2,
	// 		});
	// 	});
});
