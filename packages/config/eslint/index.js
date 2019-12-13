const path = require('path');
const [OFF,WARN,ERROR] = [0,1,2];

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		project: path.join(process.cwd(), 'tsconfig.json'),
		tsconfigRootDir: process.cwd(),
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		es6: true,
	},
	ignorePatterns: [
		'**/node_modules/**',
		'**/dist/**',
	],
	plugins: [
		'@typescript-eslint',
		'jest',
		'react',
		'react-hooks',
		'import',
	],
	settings: {
		react: {
			version: 'detect',
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	overrides: [
		{
			files: ['*.spec.*'],
			extends: [
				'plugin:jest/recommended',
				'plugin:jest/style',
			],
			env: {
				jest: true,
			},
		},
		{
			files: ['*.js'],
			env: {
				node: true,
			},
		},
		{
			files: ['*.ts', '*.tsx'],
			extends: [
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:import/typescript',
			],
		},
	],
	rules: {
		'react-hooks/rules-of-hooks': ERROR,
		'react-hooks/exhaustive-deps': WARN,

		'comma-dangle': [ERROR, {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always-multiline',
		}],
		'quotes': [ERROR, 'single', { allowTemplateLiterals: true }],
		'sort-imports': OFF,
	},
};
