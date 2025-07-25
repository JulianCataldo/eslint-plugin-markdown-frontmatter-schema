import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AbsolutePath } from '../types.js';

/**
 * Make a relative path absolute.
 * @param path - The path.
 * @returns - The absolute path.
 */
export function getPath(path: string): AbsolutePath {
	return join(dirname(fileURLToPath(import.meta.url)), path) as AbsolutePath;
}
