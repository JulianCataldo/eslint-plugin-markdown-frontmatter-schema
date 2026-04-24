import type { RuleViolation, Yaml } from './types.js';

import {
	getSchema,
	parseFrontmatter,
	parseGlobalSchema,
	parseInlineSchemaPath,
} from './prepare.js';
import { retrieveViolations, retrieveYamlParseErrors, validateFrontmatter } from './validate.js';

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

	// MULTIPLE_DOCS is expected for markdown: the body after the closing --- is
	// a second "document" as far as the YAML parser is concerned.
	const yamlErrors = document.errors.filter(e => e.code !== 'MULTIPLE_DOCS');
	if (yamlErrors.length > 0)
		return retrieveYamlParseErrors(yamlErrors, yaml, lineCounter);

	const inlineSchemaPath = parseInlineSchemaPath(yamlJS, filePath);

	const schema = getSchema(inlineSchemaPath ?? globalSchema.value, yaml);
	if (!schema.ok) return [schema.error];

	const errors = validateFrontmatter(yamlJS, schema.value);

	return retrieveViolations(errors, document, yaml, lineCounter);
}
