import type { Rule } from 'eslint';
import type { Yaml } from 'mdast';

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { Document, isNode, LineCounter } from 'yaml';

import type {
	AnyFrontmatter,
	AnyJSONSchema,
	EnumError,
	RuleViolation,
} from './types.js';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Report schema validation errors to the ESLint context.
 * @param errors - An array of AJV validation errors.
 * @param document - The parsed YAML document.
 * @param node - The root AST node of the document.
 * @param lineCounter - The line counter to map positions.
 * @returns The violations for incoming errors, if any.
 */
export function retrieveViolations(
	errors: ErrorObject[],
	document: Document.Parsed,
	node: Yaml,
	lineCounter: LineCounter,
): RuleViolation[] {
	const violations: RuleViolation[] = [];

	for (const error of errors) {
		const reason = `YAML schema validation error: ${error.message ?? 'unknown'}`;
		const instancePath = error.instancePath.slice(1).split('/');
		const offendingNode = document.getIn(instancePath, true);

		let line = 1;
		let column = 1;

		let range: [start: number, end: number] | undefined;

		if (isNode(offendingNode) && offendingNode.range) {
			range = [offendingNode.range[0], offendingNode.range[1]];

			const start = lineCounter.linePos(offendingNode.range[0]);
			line = start.line;
			column = start.col;
		}

		const loc = { end: { column, line }, start: { column, line } };

		violations.push({
			data: error.params,
			loc,
			message: `${reason} at ${
				Boolean(error.instancePath) ? error.instancePath : 'root'
			}`,
			node,

			suggest:
				range && isEnumError(error)
					? error.params.allowedValues.map((suggestion: unknown) => ({
							desc: `Replace with "${String(suggestion)}"`,

							fix: (fixer: Rule.RuleFixer) =>
								fixer.replaceTextRange(range, String(suggestion)),
						}))
					: undefined,
		});
	}

	return violations;
}

/**
 * Validate the parsed frontmatter against the provided schema.
 * @param frontmatter - The parsed frontmatter object.
 * @param schema - The JSON schema to validate against.
 * @returns An array of validation error objects.
 */
export function validateFrontmatter(
	frontmatter: AnyFrontmatter,
	schema: AnyJSONSchema,
): ErrorObject[] {
	const validate = ajv.compile(schema);
	return !validate(frontmatter) && validate.errors ? validate.errors : [];
}

/**
 * Check if an AJV error is a JSON schema enumeration.
 * AJV doesn't provide assertions for enums params., with allowed values.
 * @param error - The AJV error result.
 * @returns The assertion result.
 */
function isEnumError(error: ErrorObject): error is EnumError {
	return error.keyword === 'enum' && Array.isArray(error.params.allowedValues);
}
