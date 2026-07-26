/* Does the LOCAL upstream checkout (mid dep-migration, uncommitted) even load?
 * Expected per code read: minimatch@10 has no default export while committed
 * dist does `import minimatch from 'minimatch'`. */
try {
	await import(
		'/Volumes/n_1024a-Projects/Repositories/packages/remark-lint-frontmatter-schema/dist/index.js'
	);
	console.log('LOCAL DIST LOADED OK');
} catch (err) {
	console.log(`LOCAL DIST IMPORT FAILED: ${err.name}: ${err.message}`);
}
