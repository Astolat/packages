const fs = require('fs');
const path = require('path');

const {
	utils: {
		getPackages,
	},
} = require('@commitlint/config-lerna-scopes');


const getWorkflows = (context) => {
	return new Promise((resolve, reject) => {
		const ctx = context || {};
		const cwd = ctx.cwd || process.cwd();
		const workflowDir = path.join(cwd, './.github/workflows');

		fs.readdir(workflowDir, (err, items) => {
			if (err) {
				return reject(err);
			}

			const workflows = items
				.filter(item => path.extname(item) === '.yml')
				.map(filename => path.basename(filename, '.yml'))

			resolve(workflows);
		});
	});
};

module.exports = {
	extends: [
		'@commitlint/config-conventional',
		'@commitlint/config-lerna-scopes',
	],
	rules: {
		'scope-enum': async ctx => [2, 'always', [
			...(await getPackages(ctx)),
			...(await getWorkflows(ctx)),
		]],
	},
};
