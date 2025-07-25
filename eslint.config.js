import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unicornPlugin from 'eslint-plugin-unicorn';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'url';
import jsdoc from 'eslint-plugin-jsdoc';
import markdown from '@eslint/markdown';
import { default as frontmatterSchema } from './dist/index.js';

import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsconfigPath = resolve(__dirname, `./tsconfig.json`);

export default [
	{
		ignores: [
			'**/dist/**',
			'*.js',
			'*.cjs',
			'**/*.dev*',
			'**/*.old*',
			'**/*.config.ts',
			'example-app',
			'src/ambient.ts',
		],
	},

	{
		files: [`src/**/*.ts`],
		...jsdoc.configs['flat/recommended'],
	},

	// Package-specific configs
	{
		files: [`src/**/*.ts`],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: tsconfigPath,
				ecmaVersion: 'latest',
				sourceType: 'module',
				tsconfigRootDir: __dirname,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			unicorn: unicornPlugin,
			perfectionist: perfectionistPlugin,
			sonarjs: sonarjsPlugin,
			import: importPlugin,
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: tsconfigPath,
				},
			},
		},
		rules: {
			...tsPlugin.configs['strict-type-checked'].rules,
			...tsPlugin.configs['stylistic-type-checked'].rules,

			...unicornPlugin.configs.recommended.rules,
			...perfectionistPlugin.configs['recommended-natural'].rules,
			...sonarjsPlugin.configs.recommended.rules,
			...prettier.rules,

			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports' },
			],
			'max-lines': [
				'warn',
				{ max: 250, skipComments: true, skipBlankLines: true },
			],

			'unicorn/no-null': 'off',

			'sonarjs/todo-tag': 'warn',
			'sonarjs/fixme-tag': 'warn',
			'sonarjs/no-commented-code': 'warn',
			'unicorn/no-empty-file': 'warn',
			'sonarjs/public-static-readonly': 'off',

			// '@typescript-eslint/no-unsafe-assignment': 'off',
			// '@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-import-type-side-effects': 'off',
			'unicorn/prefer-module': 'off',
			'unicorn/prefer-native-coercion-functions': 'off',
			'unicorn/import-style': 'off',
			'unicorn/no-abusive-eslint-disable': 'off',
			'sonarjs/no-empty-test-file': 'off',
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'error',

			//

			'jsdoc/require-jsdoc': [
				'warn',
				{
					require: {
						ClassDeclaration: true,
						MethodDefinition: true,
						FunctionDeclaration: true,
					},
				},
			],
			'jsdoc/require-description': 'warn',
			'jsdoc/check-tag-names': 'warn',
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns-type': 'off',

			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
		},
	},

	{
		files: ['**/*.md'],
		language: 'markdown/gfm',
		plugins: {
			markdown,

			'frontmatter-schema': frontmatterSchema,
		},
		// extends: ["markdown/recommended"],
		languageOptions: {
			frontmatter: 'yaml',
		},
		rules: {
			'markdown/no-html': 'error',

			'frontmatter-schema/frontmatter-schema': [
				'error',
				{
					defaultSchema: {
						properties: {
							description: { type: 'string' },
							foo: { type: 'null' },
							title: { type: 'string' },
						},
						required: ['title', 'foo'],
						type: 'object',
					},
				},
			],
		},
	},
	// {
	// 	files: [`src/**/*.ts`],
	// 	rules: [],
	// },
];
