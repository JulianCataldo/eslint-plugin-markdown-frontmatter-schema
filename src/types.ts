import type { RuleModule } from '@eslint/markdown';
import type { ErrorObject } from 'ajv';

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

// NOTE: This type isn't easily accessible or constructible, that's why we pick it like this.
export type RuleContext = Parameters<RuleModule['create']>[0];

export type RuleViolation = Parameters<RuleContext['report']>[0];

export type Url = string & { __urlBrand: never };
