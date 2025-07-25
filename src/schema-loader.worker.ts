import type { JSONSchema7 } from 'json-schema';

import $RefParser from '@apidevtools/json-schema-ref-parser';
import { runAsWorker } from 'synckit';

/**
 * Load a JSON schema from the given path.
 * @param pathOrSchema - The path to the JSON schema file -OR- a schema definition object.
 * @returns A Promise resolving to the loaded schema object or null if loading fails.
 */
async function loadSchemaAsync(
	pathOrSchema: object | string,
): Promise<JSONSchema7 | null> {
	try {
		const schema = (await $RefParser.bundle(
			pathOrSchema,
		)) as JSONSchema7 | null;

		return schema;
	} catch (error) {
		console.warn(
			`Error loading schema from ${typeof pathOrSchema === 'string' ? pathOrSchema : '[embedded]'}: ${(error as Error).message}`,
		);
		return null;
	}
}

runAsWorker(async (schemaPath: string) => {
	const schema = await loadSchemaAsync(schemaPath);
	return schema;
});

export type LoadSchemaAsync = typeof loadSchemaAsync;
