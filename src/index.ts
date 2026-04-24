import { frontmatterSchema } from './rules/frontmatter-schema.js';
import { ESLint } from './types.js';

const plugin: ESLint.Plugin = {
	rules: {
		'frontmatter-schema': frontmatterSchema,
	},
};

export default plugin;
