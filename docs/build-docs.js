#!/usr/bin/env node
/***********************************************************************************************************************

	build-docs.js (v1.3.3, 2023-07-25)
		A Node.js-hosted build script for SugarCube's documentation.

	Copyright © 2020–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* eslint-env node, es2021 */
/* eslint-disable strict */
'use strict';


/*******************************************************************************
	Configuration
*******************************************************************************/

const CONFIG = {
	// WARNING: The ordering within the following arrays is significant.
	md : {
		files : [
			// Table of Contents
			'table-of-contents.md',

			// Introduction
			'introduction.md',

			// Core
			'core/markup.md',
			'core/twinescript.md',
			'core/macros.md',
			'core/functions.md',
			'core/methods.md',
			'core/special-names.md',
			'core/css.md',
			'core/html.md',
			'core/events.md',

			// APIs
			'api/api-config.md',
			'api/api-dialog.md',
			'api/api-engine.md',
			'api/api-fullscreen.md',
			'api/api-loadscreen.md',
			'api/api-macro.md',
			'api/api-macrocontext.md',
			'api/api-passage.md',
			'api/api-save.md',
			'api/api-setting.md',
			'api/api-simpleaudio.md',
			'api/api-simpleaudio-audiotrack.md',
			'api/api-simpleaudio-audiorunner.md',
			'api/api-simpleaudio-audiolist.md',
			'api/api-state.md',
			'api/api-story.md',
			'api/api-template.md',
			'api/api-ui.md',
			'api/api-uibar.md',

			// Guides
			'guides/guide-state-sessions-and-saving.md',
			'guides/guide-non-generic-object-types.md',
			'guides/guide-tips.md',
			'guides/guide-media-passages.md',
			'guides/guide-icon-font.md',
			'guides/guide-harlowe-to-sugarcube.md',
			'guides/guide-test-mode.md',
			'guides/guide-typescript.md',
			'guides/guide-installation.md',
			'guides/guide-code-updates.md',
			'guides/guide-localization.md'
		]
	},
	js : {
		intro : {
			files : [
				'templates/js/intro-scdocs.js',
				'templates/js/intro-enhancement.js'
			],
			intro : 'templates/js/intro.js',
			outro : 'templates/js/outro.js'
		},
		nav : {
			files : [
				'templates/js/nav-enhancement.js'
			],
			intro : 'templates/js/intro.js',
			outro : 'templates/js/outro.js'
		}
	},
	css : {
		files : [
			'templates/css/core.css'
		]
	},
	html : {
		intro : 'templates/html/intro.html',
		outro : 'templates/html/outro.html'
	},
	build : {
		dest : 'build/index.html'
	}
};


/*******************************************************************************
	Main Script
*******************************************************************************/

// NOTICE!
//
// Where string replacements are done, we use the replacement function style to
// disable all special replacement patterns, since some of them may exist within
// the replacement strings—e.g., `$&` within the HTML or JavaScript sources.

const process = require('process');
process.env.BROWSERSLIST_CONFIG = '../.browserslistrc';

const {
	log,
	die,
	makePath,
	readFileContents,
	writeFileContents,
	concatFiles
} = require('../scripts/build-utils');
const _path = require('path');
const _opts = require('commander')
	.program
	.option('-u, --unminified', 'Suppress minification stages.')
	.helpOption('-h, --help', 'Print this help, then exit.')
	.parse()
	.opts();

// Build the documentation.
(async () => {
	console.log('Starting build...\n');

	// Set build constants.
	const BUILD_VERSION  = require('../package.json').version;
	const BUILD_DATETIME = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
	const BUILD_DATE     = new Date().toISOString().slice(0, 10);

 	// Compile the JavaScript.
	log('compiling JavaScript...');
	const jsIntro = await compileJavaScript(CONFIG.js.intro);
	const jsNav   = await compileJavaScript(CONFIG.js.nav);

	// Compile the CSS.
	log('compiling CSS...');
	const css = compileStyles(CONFIG.css);

	// Compile the Markdown.
	log('compiling Markdown...');
	const markdown = compileMarkdown(CONFIG.md);

	// Assemble the basic document.
	log('assembling document...');
	let output = readFileContents(CONFIG.html.intro)
		+ markdown
		+ readFileContents(CONFIG.html.outro);

	// Add permalinks to ID-bearing headings.
	output = output.replace(
		/<([Hh]\d)>(.+?)\{#([^}]+)\}<\/\1>/g,
		(_, heading, text, id) => `<${heading} id="${id}"><a href="#${id}" class="permalink" title="Permanent link" aria-label="Permanent link"></a>\u00A0<span>${text}</span></${heading}>`
	);

	// Build the final document.
	const outfile = _path.normalize(CONFIG.build.dest);
	log(`building: "${outfile}"`);

	// Process the source replacement tokens. (First!)
	output = output.replace(/\{\{\.SCRIPT_CORE\}\}/, () => jsIntro);
	output = output.replace(/\{\{\.SCRIPT_NAV\}\}/, () => jsNav);
	output = output.replace(/\{\{\.STYLE_CORE\}\}/, () => css);

	// Process the build replacement tokens.
	output = output.replace(/\{\{\.VERSION\}\}/g, () => BUILD_VERSION);
	output = output.replace(/\{\{\.ISO_DATE\}\}/g, () => BUILD_DATETIME);
	output = output.replace(/\{\{\.DATE\}\}/g, () => BUILD_DATE);

	// Write the outfile.
	makePath(_path.dirname(outfile));
	writeFileContents(outfile, output);
})()
	.then(() => console.log('\nBuild complete!  (check the "build" directory)'))
	.catch(reason => console.log('\nERROR:', reason));


/*******************************************************************************
	Utility Functions
*******************************************************************************/
function compileMarkdown(sourceConfig) {
	const gfm = require('cmark-gfm-js');
	return concatFiles(sourceConfig.files, (contents /* , filename */) => {
		try {
			return gfm.convertUnsafe(contents);
		}
		catch (ex) {
			die(`markdown error: ${ex.message}`, ex);
		}
	});
}

function compileJavaScript(sourceConfig) {
	return (async source => {
		if (_opts.unminified) {
			return source;
		}

		// Minify the code with Terser.
		const { minify } = require('terser');
		const minified   = await minify(source, {
			compress : {
				keep_infinity : true // eslint-disable-line camelcase
			},
			mangle : true
		});

		if (minified.error) {
			const { message, line, col, pos } = minified.error;
			die(`JavaScript minification error: ${message}\n[@: ${line}/${col}/${pos}]`);
		}

		return `<script type="text/javascript">${minified.code}</script>`;
	})(
		  readFileContents(sourceConfig.intro)
		+ concatFiles(sourceConfig.files)
		+ readFileContents(sourceConfig.outro)
	);
}

function compileStyles(sourceConfig) {
	const autoprefixer  = require('autoprefixer');
	const postcss       = require('postcss');
	const CleanCss      = require('clean-css');
	return concatFiles(sourceConfig.files, (contents, filename) => {
		const processed = postcss([autoprefixer]).process(contents, { from : filename });
		processed.warnings().forEach(mesg => console.warn(mesg.text));

		let css = processed.css;

		if (!_opts.unminified) {
			css = new CleanCss({
				level         : 1,
				compatibility : 'ie9'
			})
				.minify(css)
				.styles;
		}

		const fileSlug = _path.basename(filename, '.css').toLowerCase().replace(/[^0-9a-z]+/g, '-');

		return `<style id="style-${fileSlug}" type="text/css">${css}</style>`;
	});
}
