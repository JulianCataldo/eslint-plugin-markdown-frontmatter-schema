// Probe: which eslint.config.js wins — the one nearest the linted FILE or the
// one found from CWD? (ADR 0002 C20 verification flag + campaign 02 Q6.)
// cwdlab/root/eslint.config.js requires 'rootMarker'; cwdlab/root/sub/
// eslint.config.js requires 'subMarker'; the linted file lives in sub/.
import { ESLint } from 'eslint';

const base = new URL('./cwdlab/root/', import.meta.url).pathname;
const file = base + 'sub/doc.md';
console.log('eslint version:', ESLint.version);

async function run(label, opts) {
	try {
		const eslint = new ESLint(opts);
		const [res] = await eslint.lintFiles([file]);
		console.log(label, '→', res.messages.map((m) => m.message));
	} catch (error) {
		console.log(label, '→ ERROR:', String(error.message).split('\n')[0]);
	}
}

await run('cwd=root                 ', { cwd: base });
await run('cwd=root/sub             ', { cwd: base + 'sub' });
await run('cwd=root flag[unstable_config_lookup_from_file]', {
	cwd: base,
	flags: ['unstable_config_lookup_from_file'],
});
await run('cwd=root flag[v10_config_lookup_from_file]', {
	cwd: base,
	flags: ['v10_config_lookup_from_file'],
});
