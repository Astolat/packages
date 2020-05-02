const path = require('path');
const { sync: glob } = require('globby');

/**
 * Check if all of the given packages are installed
 *
 * @param {string[]} names The package names to check for
 * @returns {boolean}
 */
const hasPkg = (...names) => {
	try {
		return !!(
			names.map(name => require.resolve(name))
		);
	} catch (err) {
		return false;
	}
};

const {
	workspaces: workspacesConfig,
} = require(path.join(process.cwd(), 'package.json'));

// const workspacesConfig = Object.entries(process.env)
// 	.reduce(
// 		(values, [key, val]) => {
// 		if (
// 			(/^npm_package_workspaces_[0-9]+$/i).test(key) &&
// 			typeof val === 'string'
// 		) {
// 			values.push(val);
// 		}

// 		return values;
// 	}, /** @type {string[]} */ ([]));
const hasWorkspaces = workspacesConfig.length > 0;
const hasWorkspacesWatch = hasWorkspaces && hasPkg('jest-watch-yarn-workspaces');
const hasReact = hasPkg('react');
const reactVersion = hasReact && (
	require('react/package.json').version.split('.')[0]
);
const hasEnzyme = (
	hasReact &&
	hasPkg('jest-enzyme') &&
	hasPkg('jest-environment-enzyme') &&
	hasPkg(`enzyme-adapter-react-${ reactVersion }`)
);
const packages = hasWorkspaces && glob(
	workspacesConfig.map(pattern => path.join(pattern, 'package.json')),
	{
		cwd: process.cwd(),
		absolute: true,
		ignore: [
			'**/node_modules/**',
		],
	}
)
	// .filter(pkgJson => glob('**/*.spec.*', {
	// 	cwd: path.dirname(pkgJson),
	// }).length > 0)
	.reduce((pkgs, pkgJson) => ({
		...pkgs,
		[require(pkgJson).name]: path.dirname(path.relative(process.cwd(), pkgJson)),
	}), {});
const isProd = process.env.NODE_ENV === 'production';

// console.dir({
// 	hasWorkspaces,
// 	hasReact,
// 	hasEnzyme,
// }, {
// 	colors: true,
// });

module.exports = {
	...(hasWorkspaces && {
		roots: Object.values(packages).map(dirname => path.join('<rootDir>', dirname)),
		projects: Object.entries(packages).map(([displayName, dirname]) => ({
			displayName,
			rootDir: path.join(process.cwd(), dirname),
			transform: {
				'\\.tsx?$': 'ts-jest',
			},
			setupFiles: [
				path.join(__dirname, 'jest-setup.js'),
			],
			clearMocks: true,
			testEnvironment: 'node',
			testRegex: `\\.spec\\.[jt]sx?$`,
			moduleFileExtensions: [
				'js', 'jsx', 'json', 'ts', 'tsx',
			],
			moduleNameMapper: Object.entries(packages)
				.filter(([name]) => name !== displayName)
				.reduce((obj, [name, dir]) => ({
					...obj,
					[name]: path.join(process.cwd(), dir, 'src'),
				}), {}),
			resolver: 'jest-workspace-resolver',
			timers: 'fake',
			testURL: 'http://astolat.com',
			...(hasEnzyme && {
				setupFilesAfterEnv: ['jest-enzyme'],
				testEnvironment: 'enzyme',
				testEnvironmentOptions: {
					enzymeAdapter: `react${ reactVersion }`,
				},
			}),
		})),
	}),
	...(hasWorkspacesWatch && {
		watchPlugins: [
			'jest-watch-yarn-workspaces',
		],
	}),
	...(!isProd && {
		notify: true,
	}),
};

// console.dir(module.exports.projects);
// process.exit;
