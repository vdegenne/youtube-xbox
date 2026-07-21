import {config, nodeResolve, terser} from '@vdegenne/rollup'

const plugins = [
	{
		name: 'replace-import-meta',
		transform(code) {
			return {
				code: code.replace(/\bimport\.meta\b/g, '({env:{DEV:false}})'),
				map: null,
			}
		},
	},
	nodeResolve(),
	terser(),
]

export default config([
	{
		input: './lib/content.js',
		output: {file: './content.js', format: 'iife'},
		plugins,
	},
	{
		input: './lib/background.js',
		output: {file: './background.js', format: 'iife'},
		plugins,
	},
])
