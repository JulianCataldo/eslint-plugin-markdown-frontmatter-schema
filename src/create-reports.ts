import type { Yaml } from 'mdast';

import type { RuleViolation } from './types.js';

import {
	getSchema,
	parseFrontmatter,
	parseGlobalSchema,
	parseInlineSchemaPath,
} from './prepare.js';
import { retrieveViolations, validateFrontmatter } from './validate.js';

/**
 * This is the main entrypoint for the rule that will provide reports for ESLint.
 * @param filePath - The physical file path.
 * @param fileContent - The file content as text.
 * @param options - User options.
 * @param yaml - The YAML frontmatter literal data.
 * @returns The rule violations.
 */
export function createReports(
	filePath: string,
	fileContent: string,
	options: unknown,
	yaml: Yaml,
): RuleViolation[] {
	const globalSchema = parseGlobalSchema(options, yaml);
	if (!globalSchema.ok) return [globalSchema.error];

	const { document, lineCounter, yamlJS } = parseFrontmatter(fileContent);

	const inlineSchemaPath = parseInlineSchemaPath(yamlJS, filePath);

	const schema = getSchema(inlineSchemaPath ?? globalSchema.value, yaml);
	if (!schema.ok) return [schema.error];

	const errors = validateFrontmatter(yamlJS, schema.value);

	return retrieveViolations(errors, document, yaml, lineCounter);
}
