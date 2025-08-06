<!-- # eslint-plugin-markdown-frontmatter-schema

> [!CAUTION]
> WORK IN PROGRESS.

This is a port of [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) for ESLint with the Markdown language support, via `@eslint/markdown`.

It also uses `mdast`, `yaml` and `json-schema-ref-parser` under the hood.

The API is kept very similar.
 -->

# eslint-plugin-markdown-frontmatter-schema 📄

Validate **YAML frontmatter** in your Markdown files using **JSON Schema** — right in ESLint.

> 🚧 **This plugin is under active development.** Some features may change!  
> You can give it a try, it works fine but with remaining tuning on how schemas are loaded.

This is a port of [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) that uses `remark-lint` rule API, but for ESLint with its now official Markdown language support (`@eslint/markdown`).

---

## ✨ Features

- **Schema validation** (types, enums, formats…)
- **Error localization** and **code frames**
- **IDE integration** (VS Code ESLint extension)
- **Smart suggestions** (e.g. auto-fix enum mismatches)
- **Global or per-file schema associations**
- **Zero-config when using `$schema` key**
- Works with [@eslint/markdown](https://eslint.org/docs/latest/user-guide/configuring/plugins#using-plugins-with-file-types) out of the box

---

## 📸 Demo

TODO

---

## 🚀 Getting Started

### 1. Install

```bash
pnpm add -D eslint @eslint/markdown eslint-plugin-markdown-frontmatter-schema
```

### 2. Configure ESLint (Flat Config)

```ts
// eslint.config.js
import markdown from '@eslint/markdown';
import frontmatterSchema from 'eslint-plugin-markdown-frontmatter-schema';

const sharedMarkdownConfig = {
  language: 'markdown/gfm',
  plugins: {
    markdown,
    'frontmatter-schema': frontmatterSchema,
  },
  languageOptions: { frontmatter: 'yaml' },
};

export default [
  {
    ...sharedMarkdownConfig,
    files: ['**/*.md'],
    rules: {
      'markdown/no-html': 'error',
    },
  },
  {
    ...sharedMarkdownConfig,
    files: ['blog/**/*.md'],
    rules: {
      'frontmatter-schema/frontmatter-schema': [
        'error',
        { defaultSchema: './schemas/blog.schema.json' },
      ],
    },
  },
];
```

---

## 🔌 Usage

### 💡 Inline `$schema`

```md
---
$schema: ../blog.schema.json
title: Hello world
category: Book
---

# Content
```

The schema is resolved relative to the Markdown file. Remote URLs (e.g. from SchemaStore) are also supported.

---

## 💬 IDE / CLI Integration

- 🧠 Suggestions for enum mismatches
- 🛠 Auto-fix via `--fix` for simple cases
- 📦 Compatible with the [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

---

## 🧱 Behind the Scenes

- ✅ Uses [AJV](https://ajv.js.org) for JSON Schema validation
- 🧵 Bundles schema refs with [`json-schema-ref-parser`](https://github.com/APIDevTools/json-schema-ref-parser)
- 🧠 Leverages ESLint [`@eslint/markdown`](https://eslint.org/docs/latest/user-guide/configuring/plugins#using-plugins-with-file-types) and [`eemeli/yaml`](https://github.com/eemeli/yaml) parser infrastructure
- 🛠 Fix suggestions are inserted when `enum` values mismatch

---

## 🛠 Troubleshooting

- **Schema not found**: Make sure `$schema` path is correct or `defaultSchema` is set.
- **No errors reported**: Check that `@eslint/markdown` config is applied, and frontmatter is parsed as YAML.
- Ultimately, clone this project, install the dependencies and try the [fixtures](./fixtures) in your IDE.

---

## 📦 Project Layout

- `src/` — rule logic, validation pipeline, and schema loading
- `src/fixtures/` — Markdown test files and schemas
- `src/tests/` — ESLint-based integration test suites

---

## 📎 Related

- [`remark-lint-frontmatter-schema`](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) — original `remark-lint` plugin
- [JSON Schema](https://json-schema.org/)

## 👀 Other Projects

- [Web Elements Analyzer](https://github.com/JulianCataldo/web-elements-analyzer) — A cross-framework template analyzer, for deep insights on standard HTML, SVG and Custom Elements.
- [Gracile](https://github.com/gracile-web/gracile) — A thin, full-stack, web framework, with standards in mind.
- [JSON Schema Form Element](https://github.com/json-schema-form-element/jsfe) — A Custom Element that auto-generates forms, declaratively.
