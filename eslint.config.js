const nx = require('@nx/eslint-plugin');

module.exports = [
	...nx.configs['flat/base'],
	...nx.configs['flat/typescript'],
	...nx.configs['flat/javascript'],
	{
		ignores: ['**/dist'],
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
					depConstraints: [
						{
							sourceTag: '*',
							onlyDependOnLibsWithTags: ['*'],
						},
					],
				},
			],
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		// Override or add rules here
		rules: {},
	},
	// {
	//   plugins: [
	//     "prettier",
	//     "import",
	//     "tailwindcss"
	//   ],
	//   extends: [
	//     "plugin:prettier/recommended",
	//     "plugin:import/recommended",
	//     "plugin:import/typescript",
	//     "plugin:tailwindcss/recommended"
	//   ],
	//   "rules": {
	//     "@typescript-eslint/no-empty-interface": "off",
	//     "@typescript-eslint/consistent-type-imports": [
	//       "error",
	//       {
	//         "prefer": "type-imports",
	//         "fixStyle": "inline-type-imports",
	//         "disallowTypeAnnotations": false
	//       }
	//     ],
	//     "@nx/enforce-module-boundaries": "off",
	//     "import/exports-last": "off",
	//     "import/first": "error",
	//     "import/no-deprecated": "error",
	//     "import/consistent-type-specifier-style": [
	//       "error",
	//       "prefer-inline"
	//     ],
	//     "import/newline-after-import": [
	//       "error",
	//       {
	//         "considerComments": true
	//       }
	//     ],
	//     "import/no-useless-path-segments": [
	//       "error",
	//       {
	//         "noUselessIndex": true
	//       }
	//     ],
	//     "import/order": [
	//       "error",
	//       {
	//         "newlines-between": "always",
	//         "distinctGroup": true,
	//         "pathGroups": [
	//           {
	//             "pattern": "*.css",
	//             "group": "index",
	//             "position": "after"
	//           },
	//           {
	//             "pattern": "@/**",
	//             "group": "internal",
	//             "position": "after"
	//           }
	//         ],
	//         "groups": [
	//           [
	//             "builtin",
	//             "external"
	//           ],
	//           "internal",
	//           [
	//             "parent",
	//             "sibling",
	//             "index"
	//           ]
	//         ],
	//         "alphabetize": {
	//           "order": "asc",
	//           "caseInsensitive": true,
	//           "orderImportKind": "asc"
	//         }
	//       }
	//     ],
	//   },
	//   "overrides": [
	//     {
	//       "files": [
	//         "*.ts",
	//         "*.tsx",
	//         "*.js",
	//         "*.jsx"
	//       ],
	//       "rules": {
	//         "@nx/enforce-module-boundaries": [
	//           "error",
	//           {
	//             "enforceBuildableLibDependency": true,
	//             "allow": [],
	//             "depConstraints": [
	//               {
	//                 "sourceTag": "*",
	//                 "onlyDependOnLibsWithTags": [
	//                   "*"
	//                 ]
	//               }
	//             ]
	//           }
	//         ]
	//       }
	//     },
	//     {
	//       "files": [
	//         "*.ts",
	//         "*.tsx"
	//       ],
	//       "extends": [
	//         "plugin:@nx/typescript"
	//       ],
	//       "rules": {}
	//     },
	//     {
	//       "files": [
	//         "*.js",
	//         "*.jsx"
	//       ],
	//       "extends": [
	//         "plugin:@nx/javascript"
	//       ],
	//       "rules": {}
	//     },
	//     {
	//       "files": [
	//         "*.spec.ts",
	//         "*.spec.tsx",
	//         "*.spec.js",
	//         "*.spec.jsx"
	//       ],
	//       "env": {
	//         "jest": true
	//       },
	//       "rules": {}
	//     }
	//   ],
	//   "settings": {
	//     "import/extensions": [
	//       ".js",
	//       ".jsx",
	//       ".ts",
	//       ".tsx"
	//     ],
	//     "import/resolver": {
	//       "typescript": true,
	//       "node": true
	//     },
	//     "import/parsers": {
	//       "@typescript-eslint/parser": [
	//         ".ts",
	//         ".tsx"
	//       ]
	//     },
	//     "import/internal-regex": "^@astolat/"
	//   }
	// }
];
