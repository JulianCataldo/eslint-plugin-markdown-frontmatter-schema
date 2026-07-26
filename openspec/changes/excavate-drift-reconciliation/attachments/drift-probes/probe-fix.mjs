// Probe: does fix:true (the API equivalent of `eslint --fix`) ever modify a
// file, given the rule only attaches per-suggestion fixes (validate.ts:65-71)?
import { writeFileSync, readFileSync } from 'node:fs';
import { ESLint } from 'eslint';
import markdown from '@eslint/markdown';
import plugin from '/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema/dist/index.js';

const dir = new URL('.', import.meta.url).pathname;
const doc = dir + 'fix-doc.md';
const original = `---\ncategory: Wrong\n---\n\n# T\n`;

const config = [
	{
		files: ['**/*.md'],
		language: 'markdown/gfm',
		plugins: { markdown, 'frontmatter-schema': plugin },
		languageOptions: { frontmatter: 'yaml' },
		rules: {
			'frontmatter-schema/frontmatter-schema': [
				'error',
				{
					defaultSchema: {
						type: 'object',
						properties: { category: { enum: ['Book', 'Movie', 'Song'] } },
					},
				},
			],
		},
	},
];

for (const fix of [false, true]) {
	writeFileSync(doc, original);
	const eslint = new ESLint({
		cwd: dir,
		overrideConfigFile: true,
		overrideConfig: config,
		fix,
	});
	const [res] = await eslint.lintFiles([doc]);
	await ESLint.outputFixes([res]);
	const after = readFileSync(doc, 'utf8');
	console.log(
		JSON.stringify(
			{
				fix,
				errorCount: res.errorCount,
				outputProperty: res.output ?? '(absent — nothing applied)',
				fileChangedOnDisk: after !== original,
				messages: res.messages.map((m) => ({
					messageId: m.messageId,
					message: m.message,
					suggestionCount: m.suggestions?.length ?? 0,
					firstSuggestionFix: m.suggestions?.[0]?.fix ?? null,
				})),
			},
			null,
			1,
		),
	);
}
