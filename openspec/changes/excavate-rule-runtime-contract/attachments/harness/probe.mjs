// Mechanism probes: WHY malformed YAML is silent (yaml lib recovery),
// whether schema errors still report on recovered content, YAML schema files.
import { Linter } from 'eslint';
import markdown from '@eslint/markdown';

const R =
	'/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema';
const FX = new URL('./fx/', import.meta.url).pathname;
const plugin = (await import(`${R}/dist/index.js`)).default;
const { parseFrontmatter } = await import(`${R}/dist/prepare.js`);

// --- Probe A: parseFrontmatter recovery on whole-file text (as the rule calls it)
const samples = {
	'tab-indent': `---\n\tfoo: 1\n---\n`,
	'unclosed-flow': `---\nfoo: [unclosed\n---\n`,
	'duplicate-key': `---\na: 1\na: 2\n---\n`,
	'valid-with-body': `---\ntitle: hi\n---\n\nBody text.\n\n---\nfake: yaml\n---\n`,
	'empty-frontmatter': `---\n---\n`,
};
for (const [name, text] of Object.entries(samples)) {
	const { document, yamlJS } = parseFrontmatter(text);
	console.log(
		JSON.stringify({
			probe: `A-parseFrontmatter:${name}`,
			errors: document.errors.map(
				(e) =>
					`${e.code} ${e.message.split('\n')[0]} pos=${JSON.stringify(e.pos)}`,
			),
			warnings: document.warnings.map(
				(w) => `${w.code} ${w.message.split('\n')[0]}`,
			),
			toJS: document.toJS() ?? null,
			yamlJSUsedByRule: yamlJS,
		}),
	);
}

// --- Probe B: schema violations reported ON recovered malformed YAML
const linter = new Linter();
const config = (ruleOpts) => [
	{
		files: ['**/*.md'],
		language: 'markdown/gfm',
		languageOptions: { frontmatter: 'yaml' },
		plugins: { markdown, 'frontmatter-schema': plugin },
		rules: { 'frontmatter-schema/frontmatter-schema': ruleOpts },
	},
];
const lint = (md, opts, file = `${FX}doc.md`) => {
	try {
		return linter.verify(md, config(opts), file);
	} catch (error) {
		return { threw: String(error?.message ?? error) };
	}
};
const intFoo = [
	'error',
	{
		defaultSchema: {
			properties: { foo: { type: 'integer' } },
			required: ['foo'],
			type: 'object',
		},
	},
];
console.log(
	JSON.stringify({
		probe: 'B-tab-indent-type-violation',
		result: lint(`---\n\tfoo: hello\n---\n`, intFoo),
	}),
);
console.log(
	JSON.stringify({
		probe: 'B-unclosed-flow-type-violation',
		result: lint(`---\nfoo: [unclosed\n---\n`, intFoo),
	}),
);
console.log(
	JSON.stringify({
		probe: 'B-dupkey-which-value-wins',
		result: lint(`---\nfoo: 7\nfoo: hello\n---\n`, intFoo),
	}),
);

// --- Probe C: YAML schema file via inline $schema
console.log(
	JSON.stringify({
		probe: 'C-yaml-schema-file',
		result: lint(`---\n$schema: ./yamlform.schema.yaml\n---\n`, ['error']),
	}),
);

// --- Probe D: empty-string inline $schema falls through
console.log(
	JSON.stringify({
		probe: 'D-empty-string-inline',
		result: lint(`---\n$schema: ''\ntitle: hi\n---\n`, ['error']),
	}),
);
