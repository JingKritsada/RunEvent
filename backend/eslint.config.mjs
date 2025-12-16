import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	{
		rules: {
			indent: ['off'], // Let Prettier handle indentation
			'no-unused-vars': 'warn',
		},
	},
];
