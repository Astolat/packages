const path = require('path');
const { sync: glob } = require('globby');

const packages = glob('./packages/**/package.json', {
	cwd: __dirname,
	realpath: true,
	ignore: '**/node_modules/**',
})

module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	rootDir: __dirname,
	roots: packages.map(pkgJson => path.dirname(pkgJson)),
	projects: packages.map((pkgJson) => {
		const {
			name,
		} = require(pkgJson);

		return {
			displayName: name,
			testMatch: [
				path.resolve(pkgJson, '../**/*.spec.[tj]s?(x)'),
			],
		};
	}),
	testRegex: '\\.spec\\.[tj]sx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
