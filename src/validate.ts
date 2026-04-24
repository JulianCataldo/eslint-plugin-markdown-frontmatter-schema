import { Ajv, type ErrorObject } from 'ajv';
import * as _addFormats from 'ajv-formats';
import { Document, isMap, isNode, isScalar, LineCounter, type YAMLError } from 'yaml';

import type {
	AnyFrontmatter,
	AnyJSONSchema,
	EnumError,
	Rule,
	RuleViolation,
	Yaml,
} from './types.js';

const ajv = new Ajv({ allErrors: true, strict: false });
// ajv-formats uses CJS `module.exports = formatsPlugin;` NodeNext can't
// represent that, so type hint to what it actually is instead.
(_addFormats as unknown as { default(ajv: Ajv): void }).default(ajv);

interface Position { end: { column: number; line: number }; start: { column: number; line: number } }

/**
 * Report schema validation errors to the ESLint context.
 * @param errors - An array of AJV validation errors.
 * @param document - The parsed YAML document.
 * @param node - The root AST node of the document.
 * @param lineCounter - The line counter to map positions.
 * @returns The violations for incoming errors, if any.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function retrieveViolations(
	errors: ErrorObject[],
	document: Document.Parsed,
	node: Yaml,
	lineCounter: LineCounter,
): RuleViolation[] {
	const violations: RuleViolation[] = [];

	for (const error of errors) {
		const reason = `YAML schema validation error: ${error.message ?? 'unknown'}`;

		// `document.getIn` cannot handle an empty `instanctPath`, which happens
		// when the error is root-level (e.g. required, additionalProperties). Do a
		// best effort to find the offending location (if there is one).
		let offendingNode: ReturnType<typeof document.getIn> = null;
		if (error.instancePath === '') {
			// For additionalProperties, point at the KEY node in the root mapping so we
			// land on the property name line, not the (possibly-empty) value below it.
			if (
				error.keyword === 'additionalProperties' &&
				typeof error.params.additionalProperty === 'string' &&
				isMap(document.contents)
			) {
				const pair = document.contents.items.find(
					item => isScalar(item.key) && item.key.value === error.params.additionalProperty,
				);
				offendingNode = pair?.key ?? null;
			}
		} else {
			offendingNode = document.getIn(error.instancePath.slice(1).split('/'), true);
		}

		let range: [start: number, end: number] | undefined;
		let loc: Position;

		if (isNode(offendingNode) && offendingNode.range) {
			range = [offendingNode.range[0], offendingNode.range[1]];

			const start = lineCounter.linePos(offendingNode.range[0]);
			const end = lineCounter.linePos(offendingNode.range[1]);
			loc = {
				end: { column: end.col, line: end.line },
				start: { column: start.col, line: start.line },
			};
		} else {
			// Fall back to the YAML frontmatter block start in the file.
			const fallbackLine = node.position?.start.line ?? 1;
			const fallbackCol = node.position?.start.column ?? 0;
			loc = {
				// +3 is the `---`
				end: { column: fallbackCol + 3, line: fallbackLine },
				start: { column: fallbackCol, line: fallbackLine },
			};
		}

		violations.push({
			data: error.params,
			loc,
			message: `${reason} at ${Boolean(error.instancePath) ? error.instancePath : 'root'
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
 * Convert YAML parse errors into ESLint rule violations.
 * @param errors - YAML parse errors from Document.errors.
 * @param node - The root AST node of the document.
 * @param lineCounter - The line counter to map positions.
 * @returns Violations for each YAML parse error.
 */
export function retrieveYamlParseErrors(
	errors: YAMLError[],
	node: Yaml,
	lineCounter: LineCounter,
): RuleViolation[] {
	return errors.map(error => {
		const start = lineCounter.linePos(error.pos[0]);
		const end = lineCounter.linePos(error.pos[1]);
		return {
			loc: {
				end: { column: end.col, line: end.line },
				start: { column: start.col, line: start.line },
			},
			message: `Invalid YAML frontmatter: ${error.message.split('\n')[0]}`,
			node,
		};
	});
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
