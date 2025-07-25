import type { ESLint } from 'eslint';

import { frontmatterSchema } from './rules/frontmatter-schema.js';

const plugin: ESLint.Plugin = {
	rules: {
		'frontmatter-schema': frontmatterSchema,
	},
};

export default plugin;
