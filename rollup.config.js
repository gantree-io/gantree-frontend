import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import autoPreprocess from 'svelte-preprocess'
import svg from 'rollup-plugin-svg-import';
import dotenv from 'dotenv';
import css from "rollup-plugin-css-only";

//TODO: get https://sveltematerialui.com/demo/ working

const production = !process.env.ROLLUP_WATCH;

// needs to be duplicated to /postcss.config.js
const postcssOptions = () => ({
	extensions: [".scss", ".sass"],
	extract: false,
	minimize: true,
	plugins: [require("autoprefixer")],
	use: [
		[
			"sass",
			{
				includePaths: [
					"./src/theme",
					"./node_modules",
				]
			}
		]
	]
});

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		builtins(),
		
		replace({
			_env: JSON.stringify(dotenv.config().parsed),
		}),
		
		svg({ stringify: true }),
		
		alias({
			 entries: [
			 	{ find: '@app', replacement: __dirname + '/src' },
			 	{ find: '@routes', replacement: __dirname + '/src/routes' },
			 	{ find: '@archetypes', replacement: __dirname + '/src/archetypes' },
			 	{ find: '@components', replacement: __dirname + '/src/components' },
			 	{ find: '@layouts', replacement: __dirname + '/src/layouts' },
			 	{ find: '@icons', replacement: __dirname + '/src/icons' },
			 	{ find: '@util', replacement: __dirname + '/src/util' },
			 ]
		}),

		css({ output: "public/build/extra.css" }),
		
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			preprocess: autoPreprocess({ postcss: true }),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			},
			
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs({
			include: /node_modules/,
			namedExports: {
				'prop-types': [
					'array',
					'bool',
					'func',
					'number',
					'object',
					'string',
					'symbol',
					'any',
					'arrayOf',
					'element',
					'elementType',
					'instanceOf',
					'node',
					'objectOf',
					'oneOf',
					'oneOfType',
					'shape',
					'exact',
				],
			},
		}),
		
		postcss(postcssOptions()),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
