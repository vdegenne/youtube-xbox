import {config, nodeResolve, terser, typescript} from '@vdegenne/rollup'

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
	typescript(),
	terser(),
]

export default config([
	{
		input: './src/content.ts',
		output: {file: './content.js', format: 'iife'},
		plugins,
	},
	{
		input: './src/background.ts',
		output: {file: './background.js', format: 'iife'},
		plugins,
	},
])
