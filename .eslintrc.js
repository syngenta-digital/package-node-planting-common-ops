module.exports = {
	'parser': '@typescript-eslint/parser',
	'env': {
		'browser': true,
		'node': true,
		'es2021': true,
		'jest': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module',
		'ecmaFeatures': {
			'modules': true
		}
	},
	'plugins': [
		'@typescript-eslint'
	],
	'settings': {
	},
	'rules': {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. '@typescript-eslint/explicit-function-return-type': 'off',
		'brace-style': [ 'error', 'allman', { 'allowSingleLine': true } ],
		'@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { parameterProperties: 'off' } }],
    '@typescript-eslint/explicit-member-accessibility': 'off',
		'indent': [ 'error', 'tab' ],
		'no-mixed-spaces-and-tabs': 'error',
		'no-trailing-spaces': 'off',
		'no-unused-vars': 'off',
		'react/prop-types': 'off',
		'semi': [ 'error', 'always' ],
		'quotes': [ 'error', 'single' ]
	}
};
