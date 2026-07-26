import type { RuleModule } from '@eslint/markdown';

import { createReports } from '../create-reports.js';

/**
 * @spec `rule-runtime-contract`
 */
export const frontmatterSchema: RuleModule = {
	create(context) {
		return {
			yaml(node) {
				const filePath = context.physicalFilename;
				const fileContent = context.sourceCode.getText();

				const options = context.options[0];

				const reports = createReports(filePath, fileContent, options, node);

				for (const report of reports) context.report(report);
			},
		};
	},

	meta: {
		docs: {
			description: 'Validate YAML frontmatter using JSON Schema',
			recommended: true,
			url: 'https://github.com/JulianCataldo/remark-lint-frontmatter-schema',
		},
		// @spec `rule-runtime-contract`
		// + `meta.fixable` is inert
		// @adr 0003 — `drift-dispositions`
		fixable: 'code',

		hasSuggestions: true,
		// @adr 0002 — `port-to-eslint`
		messages: {
			fixDescription: 'Fix the frontmatter by replacing with a valid value.',
			schemaMalformed: 'Schema is malformed ',
			schemaNotFound: 'Schema not found for frontmatter at "{{schemaPath}}"',
			// @spec `rule-runtime-contract`
			// + Malformed YAML frontmatter is never reported
			yamlSyntaxError: 'Invalid YAML frontmatter syntax.',
		},

		// @spec `rule-runtime-contract`
		// + Options-shape edges
		// @adr 0002 — `port-to-eslint`
		schema: [
			{
				additionalProperties: false,
				properties: {
					defaultSchema: { type: 'object' },
					schemas: {
						additionalProperties: {
							items: { type: 'string' },
							type: 'array',
						},
						type: 'object',
					},
				},
				type: 'object',
			},
		],
		type: 'problem',
	},
};
