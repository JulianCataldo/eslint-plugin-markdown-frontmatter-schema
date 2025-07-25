import type { Yaml } from 'mdast';

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSyncFn } from 'synckit';
import { type Document, LineCounter, parseDocument } from 'yaml';

import type {
	AbsolutePath,
	AnyFrontmatter,
	AnyJSONSchema,
	LoadSchemaSync,
	Result,
	RuleViolation,
	Url,
} from './types.js';

export const bundleSchema = createSyncFn(
	join(dirname(fileURLToPath(import.meta.url)), './schema-loader.worker.js'),
) as LoadSchemaSync;

/**
 * Dereference and bundle the global or inline path schema.
 * @param pathOrSchema - The current markdown file path
 * @param node - The current YAML node.
 * @returns The schema result, or a preformatted ESLint rule violation.
 */
export function getSchema(
	pathOrSchema: AbsolutePath | AnyJSONSchema | undefined | Url,
	node: Yaml,
): Result<AnyJSONSchema, RuleViolation> {
	if (!pathOrSchema)
		return {
			error: { messageId: 'schemaNotFound', node },
			ok: false,
		};

	const schema = bundleSchema(pathOrSchema);
	if (!schema) {
		const data = {
			schemaPath: typeof pathOrSchema === 'string' ? pathOrSchema : '<inlined>',
		};
		return {
			error: { data, messageId: 'schemaNotFound', node },
			ok: false,
		};
	}
	return { ok: true, value: schema as AnyJSONSchema };
}

/**
 * Parse the YAML frontmatter raw string.
 * @param yamlContent - The raw YAML content as a string.
 * @returns An object containing the parsed document, JS representation, and a LineCounter instance.
 */
export function parseFrontmatter(yamlContent: string): {
	document: Document.Parsed;
	lineCounter: LineCounter;
	yamlJS: AnyFrontmatter;
} {
	const lineCounter = new LineCounter();
	const document = parseDocument(yamlContent, { lineCounter });

	const yamlJS = (document.toJS() ?? {}) as AnyFrontmatter;

	return { document, lineCounter, yamlJS };
}

/**
 * Load the userland ESLint options for this rule.
 * @param options - User provided options, from ESLint config.
 * @param node - The current YAML node.
 * @returns A path to a schema on disk, or an unknown JSON schema object.
 */
export function parseGlobalSchema(
	options: unknown,
	node: Yaml,
): Result<AbsolutePath | AnyJSONSchema | undefined, RuleViolation> {
	if (options === undefined) return { ok: true, value: undefined };

	const globalSchema =
		typeof options === 'object' &&
		options &&
		'defaultSchema' in options &&
		options.defaultSchema;
	if (globalSchema === undefined) return { ok: true, value: undefined };

	if (
		typeof globalSchema !== 'string' &&
		(typeof globalSchema !== 'object' || !globalSchema)
	)
		return {
			error: { messageId: 'schemaMalformed', node },
			ok: false,
		};

	return { ok: true, value: globalSchema as AnyJSONSchema };
}

/**
 * Parse the inline `$schema` key in user's current markdown file.
 * @param yamlJS - The YAML frontmatter unknown object.
 * @param filePath - The current markdown file path.
 * @returns A path to a schema on disk, or an unknown JSON schema object.
 */
export function parseInlineSchemaPath(
	yamlJS: AnyFrontmatter,
	filePath: string,
): AbsolutePath | undefined | Url {
	const inlineSchemaPath: string | undefined =
		'$schema' in yamlJS && typeof yamlJS.$schema === 'string'
			? yamlJS.$schema
			: undefined;

	if (inlineSchemaPath?.startsWith('https://')) return inlineSchemaPath as Url;

	if (inlineSchemaPath)
		return resolve(dirname(filePath), inlineSchemaPath) as AbsolutePath;
}
