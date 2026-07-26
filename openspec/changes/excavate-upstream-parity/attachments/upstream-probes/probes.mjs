/* Upstream characterization probes — dig excavate-upstream-parity.
 * Runs the PUBLISHED remark-lint-frontmatter-schema@3.15.3 npm artifact.
 * Output is the verbatim ledger material; do not prettify semantics. */
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkLintFrontmatterSchema from 'remark-lint-frontmatter-schema';

function show(m) {
	return {
		message: m.message,
		line: m.line,
		column: m.column,
		position: m.position,
		expected: m.expected,
		actual: m.actual,
		note: m.note,
		name: m.name,
		fatal: m.fatal,
		ruleId: m.ruleId,
		source: m.source,
	};
}

async function probe(id, desc, { md, path, settings = {} }) {
	console.log(`\n===== ${id} — ${desc}`);
	console.log(`md: ${JSON.stringify(md)}`);
	console.log(`path: ${path} | settings: ${JSON.stringify(settings)}`);
	try {
		const out = await remark()
			.use(remarkFrontmatter)
			.use(remarkLintFrontmatterSchema, settings)
			.process({ path, value: md });
		console.log(`messages (${out.messages.length}):`);
		for (const m of out.messages) console.log(JSON.stringify(show(m)));
	} catch (err) {
		console.log(`THREW: ${err.name}: ${err.message}`);
	}
}

await probe('U1', '$schema key + additionalProperties:false (deletion check)', {
	md: `---\n$schema: ./basic.schema.json\ntitle: hi\n---\n`,
	path: 'content/doc.md',
});

await probe('U2', 'precedence: local $schema vs embed (embed-wins check)', {
	md: `---\n$schema: ./basic.schema.json\ntitle: hi\n---\n`,
	path: 'content/doc.md',
	settings: { embed: { required: ['zzz'], type: 'object' } },
});

await probe('U3', 'tab-indent YAML (recovering parser check)', {
	md: `---\n\tfoo: 1\n---\n`,
	path: 'content/doc.md',
	settings: { embed: { required: ['foo'], type: 'object' } },
});

await probe('U3b', 'duplicate keys (last-wins check via const)', {
	md: `---\na: 1\na: 2\n---\n`,
	path: 'content/doc.md',
	settings: {
		embed: { properties: { a: { const: 2 } }, required: ['a'], type: 'object' },
	},
});

await probe('U4', 'real squiggle positions for a type violation', {
	md: `---\n$schema: ./basic.schema.json\ntitle: 1234\n---\n`,
	path: 'content/doc.md',
});

await probe('U5', 'enum + const suggestions (message.expected)', {
	md: `---\n$schema: ./enum.schema.json\nkind: Rock\nstatus: published\n---\n`,
	path: 'content/doc.md',
});

await probe('U6a', '$id schema, file a (fresh-Ajv-per-call check)', {
	md: `---\n$schema: ./withid.schema.json\ntitle: 1234\n---\n`,
	path: 'content/a.md',
});
await probe('U6b', '$id schema, file b — port crashes here, upstream?', {
	md: `---\n$schema: ./withid.schema.json\ntitle: 1234\n---\n`,
	path: 'content/b.md',
});
await probe('U6c', '$id schema, file a AGAIN (IDE-resave analog)', {
	md: `---\n$schema: ./withid.schema.json\ntitle: 1234\n---\n`,
	path: 'content/a.md',
});

await probe('U7', 'draft-2020-12 meta-schema (compile-failure catch check)', {
	md: `---\n$schema: ./draft2020.schema.json\ntitle: hi\n---\n`,
	path: 'content/doc.md',
});

await probe('U8', 'schemas glob map association (no local $schema)', {
	md: `---\ntitle: 1234\n---\n`,
	path: 'content/globbed.md',
	settings: { schemas: { 'content/basic.schema.json': ['content/*.md'] } },
});

await probe('U8b', 'local $schema beats the glob map', {
	md: `---\n$schema: ./enum.schema.json\nkind: Rock\n---\n`,
	path: 'content/globbed.md',
	settings: { schemas: { 'content/basic.schema.json': ['content/*.md'] } },
});

await probe('U9', 'https:// $schema (URL handling check — expect mangled path)', {
	md: `---\n$schema: https://json.schemastore.org/prettierrc.json\ntitle: hi\n---\n`,
	path: 'content/doc.md',
});

await probe('U10', 'empty frontmatter + embed (validate(null) check)', {
	md: `---\n---\n`,
	path: 'content/doc.md',
	settings: { embed: { required: ['title'], type: 'object' } },
});

await probe('U10b', 'empty frontmatter + glob map (association skip check)', {
	md: `---\n---\n`,
	path: 'content/globbed.md',
	settings: { schemas: { 'content/basic.schema.json': ['content/*.md'] } },
});

await probe('U11', 'format keyword (ajv-formats check)', {
	md: `---\n$schema: ./format.schema.json\nwhen: not-a-date\n---\n`,
	path: 'content/doc.md',
});

await probe('U12', 'missing local schema (load-failure message shape)', {
	md: `---\n$schema: ./nope.schema.json\ntitle: hi\n---\n`,
	path: 'content/doc.md',
});

await probe('U13a', 'two violations, default ajv options (allErrors:true)', {
	md: `---\nx: 1\n---\n`,
	path: 'content/doc.md',
	settings: { embed: { required: ['a', 'b'], type: 'object' } },
});
await probe('U13b', 'same, ajvOptions:{allErrors:false} passthrough', {
	md: `---\nx: 1\n---\n`,
	path: 'content/doc.md',
	settings: {
		ajvOptions: { allErrors: false },
		embed: { required: ['a', 'b'], type: 'object' },
	},
});

await probe('U14', 'no frontmatter at all (gating check)', {
	md: `# just a heading\n\nbody\n`,
	path: 'content/doc.md',
	settings: { embed: { required: ['title'], type: 'object' } },
});
