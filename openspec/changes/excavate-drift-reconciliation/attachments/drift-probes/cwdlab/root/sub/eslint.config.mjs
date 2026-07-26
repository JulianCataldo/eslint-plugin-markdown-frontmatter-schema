import markdown from '@eslint/markdown';
import plugin from '/Volumes/n_1024a-Projects/Repositories/packages/eslint-plugin-markdown-frontmatter-schema/dist/index.js';

export default [
	{
		files: ['**/*.md'],
		language: 'markdown/gfm',
		plugins: { markdown, 'frontmatter-schema': plugin },
		languageOptions: { frontmatter: 'yaml' },
		rules: {
			'frontmatter-schema/frontmatter-schema': [
				'error',
				{ defaultSchema: { type: 'object', required: ['subMarker'] } },
			],
		},
	},
];
