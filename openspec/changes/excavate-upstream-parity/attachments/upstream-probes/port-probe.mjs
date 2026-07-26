/* Port-side probe for matrix rows the filed spec does not cover:
 * format keyword (port has no ajv-formats). Uses the port's built dist +
 * its own node_modules; nothing in the port repo is modified. */
import { createRequire } from 'node:module';

const PORT =
	'/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema';
const req = createRequire(`${PORT}/package.json`);
const { Linter } = req('eslint');
const markdown = (await import(`${PORT}/node_modules/@eslint/markdown/dist/esm/index.js`)).default;
const plugin = (await import(`${PORT}/dist/index.js`)).default;

const linter = new Linter();
const config = [
	{
		files: ['**/*.md'],
		language: 'markdown/gfm',
		languageOptions: { frontmatter: 'yaml' },
		plugins: { 'frontmatter-schema': plugin, markdown },
		rules: { 'frontmatter-schema/frontmatter-schema': ['error'] },
	},
];

const SCRATCH = new URL('./content/doc.md', import.meta.url).pathname;
const md = `---\n$schema: ./format.schema.json\nwhen: not-a-date\n---\n`;

console.log('===== P1 — port: format keyword without ajv-formats');
try {
	const messages = linter.verify(md, config, SCRATCH);
	console.log(`messages (${messages.length}):`);
	for (const m of messages) console.log(JSON.stringify(m));
} catch (err) {
	console.log(`THREW: ${err.name}: ${err.message}`);
}
