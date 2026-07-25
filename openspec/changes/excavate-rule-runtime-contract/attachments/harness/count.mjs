// Worker-call count: does anything memoize schema loading?
import { Linter } from 'eslint';
import markdown from '@eslint/markdown';
const S = '/private/tmp/claude-502/-Volumes-n-1024a-Projects-Repositories-packages-eslint-plugin-markdown-frontmatter-schema/94c93d17-17b9-4319-8066-ed1d3a3d65d5/scratchpad';
const FX = `${S}/hx/fx/`;
const plugin = (await import(`${S}/idist/index.js`)).default;
const linter = new Linter();
const config = (ruleOpts) => [{
  files: ['**/*.md'], language: 'markdown/gfm', languageOptions: { frontmatter: 'yaml' },
  plugins: { markdown, 'frontmatter-schema': plugin },
  rules: { 'frontmatter-schema/frontmatter-schema': ruleOpts },
}];
const md = `---\n$schema: ./enum.schema.json\nkind: Movie\n---\n`;
linter.verify(md, config(['error']), `${FX}c1.md`);
linter.verify(md, config(['error']), `${FX}c2.md`);
linter.verify(md, config(['error']), `${FX}c3.md`);
linter.verify(md, config(['error']), `${FX}c1.md`); // relint same file
const objOpts = ['error', { defaultSchema: { type: 'object', required: ['title'], properties: { title: { type: 'string' } } } }];
const md2 = `---\ntitle: hi\n---\n`;
linter.verify(md2, config(objOpts), `${FX}d1.md`);
linter.verify(md2, config(objOpts), `${FX}d2.md`);
console.log('done: 4 path-schema lints (3 files + 1 relint) + 2 object-schema lints');
