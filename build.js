#!/usr/bin/env node
/***********************************************************************************************************************

	build.js (v1.4.18, 2020-11-08)
		A Node.js-hosted build script for SugarCube.

	Copyright © 2013–2020 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* eslint-env node, es6 */
/* eslint-disable strict */
'use strict';

/*******************************************************************************
	Configuration
*******************************************************************************/
const CONFIG = {
	js : {
		main : [
			// The ordering herein is significant.
			'src/lib/alert.js',
			'src/lib/patterns.js',
			'src/lib/extensions.js',
			'src/lib/browser.js',
			'src/lib/has.js',
			'src/lib/visibility.js',
			'src/lib/fullscreen.js',
			'src/lib/helpers.js',
			'src/lib/jquery-plugins.js',
			'src/lib/util.js',
			'src/lib/simplestore/simplestore.js',
			'src/lib/simplestore/adapters/webstorage.js',
			'src/lib/simplestore/adapters/cookie.js',
			'src/lib/debugview.js',
			'src/lib/nodetyper.js',
			'src/lib/prngwrapper.js',
			'src/lib/stylewrapper.js',
			'src/lib/diff.js',
			'src/l10n/l10n.js',
			'src/l10n/legacy.js',
			'src/l10n/strings.js',
			'src/config.js',
			'src/simpleaudio.js',
			'src/state.js',
			'src/markup/scripting.js',
			'src/markup/lexer.js',
			'src/markup/wikifier.js',
			'src/markup/parserlib.js',
			'src/markup/template.js',
			'src/macros/macro.js',
			'src/macros/macrocontext.js',
			'src/macros/macrolib.js',
			'src/dialog.js',
			'src/engine.js',
			'src/passage.js',
			'src/save.js',
			'src/setting.js',
			'src/story.js',
			'src/ui.js',
			'src/uibar.js',
			'src/debugbar.js',
			'src/loadscreen.js',
			'src/sugarcube.js'
		],
		wrap : {
			intro : 'src/templates/intro.js',
			outro : 'src/templates/outro.js'
		}
	},
	css : [
		// The ordering herein is significant.
		'src/vendor/normalize.css',
		'src/css/init-screen.css',
		'src/css/font.css',
		'src/css/core.css',
		'src/css/core-display.css',
		'src/css/core-passage.css',
		'src/css/core-macro.css',
		'src/css/ui-dialog.css',
		'src/css/ui.css',
		'src/css/ui-bar.css',
		'src/css/ui-debug.css'
	],
	libs : [
		// The ordering herein is significant.
		'src/vendor/classList.min.js',
		'src/vendor/es5-shim.min.js',
		'src/vendor/es6-shim.min.js',
		'src/vendor/jquery.min.js',
		'src/vendor/jquery.ba-throttle-debounce.min.js',
		'src/vendor/imagesloaded.pkgd.min.js',
		'src/vendor/lz-string.min.js',
		'src/vendor/FileSaver.min.js',
		'src/vendor/seedrandom.min.js',
		'src/vendor/console-hack.min.js'
	],
	twine1 : {
		build : {
			src  : 'src/templates/twine1/html.tpl',
			dest : 'build/twine1/sugarcube-2/header.html'
		},
		copy : [
			{
				src  : 'src/templates/twine1/sugarcube-2.py',
				dest : 'build/twine1/sugarcube-2/sugarcube-2.py'
			},
			{
				src  : 'LICENSE',
				dest : 'build/twine1/sugarcube-2/LICENSE'
			}
		]
	},
	twine2 : {
		build : {
			src  : 'src/templates/twine2/html.tpl',
			dest : 'build/twine2/sugarcube-2/format.js',
			json : 'src/templates/twine2/config.json'
		},
		copy : [
			{
				src  : 'icon.svg',
				dest : 'build/twine2/sugarcube-2/icon.svg'
			},
			{
				src  : 'LICENSE',
				dest : 'build/twine2/sugarcube-2/LICENSE'
			}
		]
	}
};


/*******************************************************************************
	Main Script
*******************************************************************************/
/*
	NOTICE!

	Where string replacements are done, we use the replacement function style here to
	disable all special replacement patterns, since some of them likely exist within
	the replacement strings (e.g. '$&' within the application source).
*/

const _fs   = require('fs');
const _path = require('path');

const _indent = ' -> ';
const _opt    = require('node-getopt').create([
	['b', 'build=VERSION', 'Build only for Twine major version: 1 or 2; default: build for all.'],
	['d', 'debug',         'Keep debugging code; gated by DEBUG symbol.'],
	['u', 'unminified',    'Suppress minification stages.'],
	['6', 'es6',           'Suppress JavaScript transpilation stages.'],
	['h', 'help',          'Print this help, then exit.']
])
	.bindHelp()     // bind option 'help' to default action
	.parseSystem(); // parse command line

// uglify-js (v2) does not currently support ES6, so force `unminified` when `es6` is enabled.
if (_opt.options.es6 && !_opt.options.unminified) {
	_opt.options.unminified = true;
}

let _buildForTwine1 = true;
let _buildForTwine2 = true;

// build selection
if (_opt.options.build) {
	switch (_opt.options.build) {
	case '1':
		_buildForTwine2 = false;
		break;

	case '2':
		_buildForTwine1 = false;
		break;

	default:
		die(`unknown Twine major version: ${_opt.options.build}; valid values: 1 or 2`);
		break;
	}
}

// build the project
(() => {
	console.log('Starting builds...');

	// Create the build ID file, if nonexistent.
	if (!_fs.existsSync('.build')) {
		writeFileContents('.build', '0');
	}

	// Get the version info and build metadata.
	const version = (() => {
		const semver = require('semver');
		const { name, version } = require('./package.json'); // relative path must be prefixed ('./')
		const prerelease = semver.prerelease(version);

		return {
			title      : name,
			major      : semver.major(version),
			minor      : semver.minor(version),
			patch      : semver.patch(version),
			prerelease : prerelease && prerelease.length > 0 ? prerelease.join('.') : null,
			build      : Number(readFileContents('.build')) + 1,
			date       : (new Date()).toISOString(),

			toString() {
				const prerelease = this.prerelease ? `-${this.prerelease}` : '';
				return `${this.major}.${this.minor}.${this.patch}${prerelease}`;
			}
		};
	})();

	// Build for Twine 1.x.
	if (_buildForTwine1 && CONFIG.twine1) {
		console.log('\nBuilding Twine 1.x version:');

		// Process the header templates and write the outfiles.
		projectBuild({
			build     : CONFIG.twine1.build,
			version   : version, // eslint-disable-line object-shorthand
			libSource : assembleLibraries(CONFIG.libs),                  // combine the libraries
			appSource : compileJavaScript(CONFIG.js, { twine1 : true }), // combine and minify the app JS
			cssSource : compileStyles(CONFIG.css)                        // combine and minify the app CSS
		});

		// Process the files that simply need copied into the build.
		projectCopy(CONFIG.twine1.copy);
	}

	// Build for Twine 2.x.
	if (_buildForTwine2 && CONFIG.twine2) {
		console.log('\nBuilding Twine 2.x version:');

		// Process the story format templates and write the outfiles.
		projectBuild({
			build     : CONFIG.twine2.build,
			version   : version, // eslint-disable-line object-shorthand
			libSource : assembleLibraries(CONFIG.libs),                   // combine the libraries
			appSource : compileJavaScript(CONFIG.js, { twine1 : false }), // combine and minify the app JS
			cssSource : compileStyles(CONFIG.css),                        // combine and minify the app CSS

			postProcess(sourceString) {
				// Load the output format.
				let output = require(`./${_path.normalize(this.build.json)}`); // relative path must be prefixed ('./')

				// Merge data into the output format.
				output = Object.assign(output, {
					description : output.description.replace(
						/(['"`])\{\{BUILD_VERSION_MAJOR\}\}\1/g,
						() => this.version.major
					),
					version : this.version.toString(),
					source  : sourceString
				});

				// Wrap the output in the `storyFormat()` function.
				output = `window.storyFormat(${JSON.stringify(output)});`;

				return output;
			}
		});

		// Process the files that simply need copied into the build.
		projectCopy(CONFIG.twine2.copy);
	}

	// Update the build ID.
	writeFileContents('.build', String(version.build));
})();

// That's all folks!
console.log('\nBuilds complete!  (check the "build" directory)');


/*******************************************************************************
	Utility Functions
*******************************************************************************/
function log(message, indent) {
	console.log('%s%s', indent ? indent : _indent, message);
}

// function warn(message) {
// 	console.warn('%swarning: %s', _indent, message);
// }

function die(message, error) {
	if (error) {
		console.error('error: %s\n[@: %d/%d] Trace:\n', message, error.line, error.col, error.stack);
	}
	else {
		console.error('error: %s', message);
	}

	process.exit(1);
}

function makePath(pathname) {
	const pathBits = _path.normalize(pathname).split(_path.sep);

	for (let i = 0; i < pathBits.length; ++i) {
		const dirPath = i === 0 ? pathBits[i] : pathBits.slice(0, i + 1).join(_path.sep);

		if (!_fs.existsSync(dirPath)) {
			_fs.mkdirSync(dirPath);
		}
	}
}

function copyFile(srcFilename, destFilename) {
	const srcPath  = _path.normalize(srcFilename);
	const destPath = _path.normalize(destFilename);
	let buf;

	try {
		buf = _fs.readFileSync(srcPath);
	}
	catch (ex) {
		die(`cannot open file "${srcPath}" for reading (reason: ${ex.message})`);
	}

	try {
		_fs.writeFileSync(destPath, buf);
	}
	catch (ex) {
		die(`cannot open file "${destPath}" for writing (reason: ${ex.message})`);
	}

	return true;
}

function readFileContents(filename) {
	const filepath = _path.normalize(filename);

	try {
		// the replace() is necessary because Node.js only offers binary mode file
		// access, regardless of platform, so we convert DOS-style line terminators
		// to UNIX-style, just in case someone adds/edits a file and gets DOS-style
		// line termination all over it
		return _fs.readFileSync(filepath, { encoding : 'utf8' }).replace(/\r\n/g, '\n');
	}
	catch (ex) {
		die(`cannot open file "${filepath}" for reading (reason: ${ex.message})`);
	}
}

function writeFileContents(filename, data) {
	const filepath = _path.normalize(filename);

	try {
		_fs.writeFileSync(filepath, data, { encoding : 'utf8' });
	}
	catch (ex) {
		die(`cannot open file "${filepath}" for writing (reason: ${ex.message})`);
	}
}

function concatFiles(filenames, callback) {
	const output = filenames.map(filename => {
		const contents = readFileContents(filename);
		return typeof callback === 'function' ? callback(contents, filename) : contents;
	});
	return output.join('\n');
}

function assembleLibraries(filenames) {
	log('assembling libraries...');

	return concatFiles(filenames, contents => contents.replace(/^\n+|\n+$/g, ''));
}

function compileJavaScript(filenameObj, options) {
	/* eslint-disable camelcase, prefer-template */
	log('compiling JavaScript...');

	const babelCore = require('babel-core');
	const babelOpts = {
		code     : true,
		compact  : false,
		presets  : ['env'],
		filename : 'sugarcube.js'
	};

	// Join the files and transpile (ES6 → ES5) with Babel.
	let	jsSource = concatFiles(filenameObj.main);
	jsSource = readFileContents(filenameObj.wrap.intro)
		+ '\n'
		+ (_opt.options.es6 ? jsSource : babelCore.transform(jsSource, babelOpts).code)
		+ '\n'
		+ readFileContents(filenameObj.wrap.outro);

	if (_opt.options.unminified) {
		return [
			'window.TWINE1=' + String(!!options.twine1),
			'window.DEBUG=' + String(_opt.options.debug || false)
		].join(';\n') + ';\n' + jsSource;
	}

	try {
		const uglifyjs = require('uglify-js');
		const uglified = uglifyjs.minify(jsSource, {
			fromString : true,
			compress   : {
				global_defs : {
					TWINE1 : !!options.twine1,
					DEBUG  : _opt.options.debug || false
				},
				screw_ie8 : true
			},
			mangle : {
				screw_ie8 : true
			},
			output : {
				screw_ie8 : true
			}
		});
		return uglified.code;
	}
	catch (ex) {
		let mesg = 'uglification error';

		if (ex.line > 0) {
			const begin = ex.line > 4 ? ex.line - 4 : 0;
			const end   = ex.line + 3 < jsSource.length ? ex.line + 3 : jsSource.length;
			mesg += ':\n >> ' + jsSource.split(/\n/).slice(begin, end).join('\n >> ');
		}

		die(mesg, ex);
	}
	/* eslint-enable camelcase, prefer-template */
}

function compileStyles(filenames) {
	/* eslint-disable prefer-template */
	log('compiling CSS...');

	const postcss         = require('postcss');
	const CleanCss        = require('clean-css');
	const normalizeRegExp = /normalize\.css$/;

	return concatFiles(filenames, (contents, filename) => {
		let css = contents;

		// Don't run autoprefixer on 'normalize.css'.
		if (!normalizeRegExp.test(filename)) {
			const processed = postcss([require('autoprefixer')]).process(css, { from : filename });

			css = processed.css;

			processed.warnings().forEach(mesg => console.warn(mesg.text));
		}

		if (!_opt.options.unminified) {
			css = new CleanCss({
				level         : 1,    // [clean-css v4] `1` is the default, but let's be specific
				compatibility : 'ie9' // [clean-css v4] 'ie10' is the default, so restore IE9 support
			})
				.minify(css)
				.styles;
		}

		return '<style id="style-' + _path.basename(filename, '.css').toLowerCase().replace(/[^0-9a-z]+/g, '-')
			+ '" type="text/css">' + css + '</style>';
	});
	/* eslint-enable prefer-template */
}

function projectBuild(project) {
	const infile  = _path.normalize(project.build.src);
	const outfile = _path.normalize(project.build.dest);

	log(`building: "${outfile}"`);

	let output  = readFileContents(infile); // load the story format template

	// Process the source replacement tokens. (First!)
	output = output.replace(/(['"`])\{\{BUILD_LIB_SOURCE\}\}\1/, () => project.libSource);
	output = output.replace(/(['"`])\{\{BUILD_APP_SOURCE\}\}\1/, () => project.appSource);
	output = output.replace(/(['"`])\{\{BUILD_CSS_SOURCE\}\}\1/, () => project.cssSource);

	// Process the build replacement tokens.
	const prerelease = JSON.stringify(project.version.prerelease);
	const date       = JSON.stringify(project.version.date);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_MAJOR\}\}\1/g, () => project.version.major);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_MINOR\}\}\1/g, () => project.version.minor);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_PATCH\}\}\1/g, () => project.version.patch);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_PRERELEASE\}\}\1/g, () => prerelease);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_BUILD\}\}\1/g, () => project.version.build);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_DATE\}\}\1/g, () => date);
	output = output.replace(/(['"`])\{\{BUILD_VERSION_VERSION\}\}\1/g, () => project.version);

	// Post-process hook.
	if (typeof project.postProcess === 'function') {
		output = project.postProcess(output);
	}

	// Write the outfile.
	makePath(_path.dirname(outfile));
	writeFileContents(outfile, output);
}

function projectCopy(fileObjs) {
	fileObjs.forEach(file => {
		const infile  = _path.normalize(file.src);
		const outfile = _path.normalize(file.dest);

		log(`copying : "${outfile}"`);

		makePath(_path.dirname(outfile));
		copyFile(infile, outfile);
	});
}
