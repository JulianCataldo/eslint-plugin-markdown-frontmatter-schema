import type { ErrorObject } from 'ajv';
import type { Rule } from 'eslint';
export type { Rule } from 'eslint';

import type { LoadSchemaAsync } from './schema-loader.worker.js';

export type AbsolutePath = string & { __absolutePathBrand: never };

export type AnyFrontmatter = object & { __frontmatterPathBrand: never };
export type AnyJSONSchema = object & { __jsonSchemaPathBrand: never };

export interface EnumError extends ErrorObject<'enum'> {
	params: { allowedValues: unknown[] };
}

export type LoadSchemaSync = (
	..._arguments: Parameters<LoadSchemaAsync>
) => Awaited<ReturnType<LoadSchemaAsync>>;

/**
 * This can be used to pass down a violation to ESLint if something goes wrong.
 */
export type Result<T, E> = { error: E; ok: false } | { ok: true; value: T };

export type RuleContext = Rule.RuleContext;
export type RuleViolation = Parameters<RuleContext['report']>[0];

export type { ESLint } from 'eslint';
export type { Yaml } from 'mdast';

export type Url = string & { __urlBrand: never };
