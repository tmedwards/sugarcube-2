/***********************************************************************************************************************

	lib/patterns.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	TODO: Move all markup patterns into here.
*/

/* eslint-disable max-len */
var Patterns = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		Patterns.
	*******************************************************************************************************************/
	/*
		Whitespace patterns.

		Space class (equivalent to `\s`):
			[\u0020\f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]
		Space class, sans line terminators:
			[\u0020\f\t\v\u00a0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]
		Line Terminator class:
			[\n\r\u2028\u2029]
	*/
	const space = (() => {
		/*
			Some browsers still supported by SugarCube have faulty space classes (`\s`).
			We check for that lossage here and, if necessary, build our own class from
			the component pieces.
		*/
		const wsMap = new Map([
			['\u0020', '\\u0020'],
			['\f', '\\f'],
			['\n', '\\n'],
			['\r', '\\r'],
			['\t', '\\t'],
			['\v', '\\v'],
			['\u00a0', '\\u00a0'],
			['\u1680', '\\u1680'],
			['\u180e', '\\u180e'],
			['\u2000', '\\u2000'],
			['\u2001', '\\u2001'],
			['\u2002', '\\u2002'],
			['\u2003', '\\u2003'],
			['\u2004', '\\u2004'],
			['\u2005', '\\u2005'],
			['\u2006', '\\u2006'],
			['\u2007', '\\u2007'],
			['\u2008', '\\u2008'],
			['\u2009', '\\u2009'],
			['\u200a', '\\u200a'],
			['\u2028', '\\u2028'],
			['\u2029', '\\u2029'],
			['\u202f', '\\u202f'],
			['\u205f', '\\u205f'],
			['\u3000', '\\u3000'],
			['\ufeff', '\\ufeff']
		]);
		const wsRe = /^\s$/;
		let missing = '';

		wsMap.forEach((pat, char) => {
			if (!wsRe.test(char)) {
				missing += pat;
			}
		});

		return missing ? `[\\s${missing}]` : '\\s';
	})();
	const spaceNoTerminator = '[\\u0020\\f\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]';
	const lineTerminator    = '[\\n\\r\\u2028\\u2029]';
	const notSpace          = space === '\\s' ? '\\S' : space.replace(/^\[/, '[^');

	/*
		Character patterns.
	*/
	const anyChar = `(?:.|${lineTerminator})`;

	/*
		Letter patterns.

		FIXME:
			1. The existing set, which is a TiddlyWiki holdover, should probably
			   encompass a significantly greater range of BMP code points.
			2. Should we include the surrogate pair code units (\uD800-\uDBFF &
			   \uDC00-\uDFFF) to handle non-BMP code points?  Further, should we
			   simply be checking for the code units themselves or checking for
			   properly mated pairs?
	*/
	const anyLetter       = '[0-9A-Z_a-z\\-\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff\\u0150\\u0170\\u0151\\u0171]';
	const anyLetterStrict = anyLetter.replace('\\-', ''); // anyLetter sans hyphen

	/*
		Identifier patterns.

		NOTE: Since JavaScript's RegExp syntax does not support Unicode character
		classes, the correct regular expression to match a valid identifier name,
		within the scope of our needs, would be on the order of approximately 5–6
		or 11–16 KiB, depending on how the pattern was built.  That being the case,
		for the moment we restrict valid TwineScript identifiers to US-ASCII.

		FIXME: Fix this to, at least, approximate the correct range.
	*/
	const identifierFirstChar = '[$A-Z_a-z]';
	const identifierNextChar  = '[$0-9A-Z_a-z]';
	const identifier          = `${identifierFirstChar}${identifierNextChar}*`;

	// Variable patterns.
	const variableSigil = '[$_]';
	const variable      = variableSigil + identifier;

	// Macro name pattern.
	const macroName = '[A-Za-z][\\w-]*|[=-]';

	// Template name pattern.
	const templateName = '[A-Za-z][\\w-]*';

	// HTML tag name pattern.
	const htmlTagName = (() => {
		/*
			Element Name:
				[A-Za-z] [0-9A-Za-z]*

			Custom Element Name:
				[a-z] (CENChar)* '-' (CENChar)*
			CENChar:
				"-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
		*/
		const cENChar = '(?:[\\x2D.0-9A-Z_a-z\\xB7\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u037D\\u037F-\\u1FFF\\u200C\\u200D\\u203F\\u2040\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD]|[\\uD800-\\uDB7F][\\uDC00-\\uDFFF])';

		return `[A-Za-z](?:${cENChar}*-${cENChar}*|[0-9A-Za-z]*)`;
	})();

	// CSS ID or class sigil pattern.
	const cssIdOrClassSigil = '[#.]';

	// CSS image transclusion template pattern.
	//
	// NOTE: The alignment syntax isn't supported, but removing it might break uses
	// of the template in the wild, so we leave it alone for now.
	const cssImage = '\\[[<>]?[Ii][Mm][Gg]\\[(?:\\s|\\S)*?\\]\\]+';

	// Inline CSS pattern.
	const inlineCss = (() => {
		/* legacy */
		const twStyle   = `(${anyLetter}+)\\(([^\\)\\|\\n]+)\\):`;
		/* /legacy */
		const cssStyle  = `${spaceNoTerminator}*(${anyLetter}+)${spaceNoTerminator}*:([^;\\|\\n]+);`;
		const idOrClass = `${spaceNoTerminator}*((?:${cssIdOrClassSigil}${anyLetter}+${spaceNoTerminator}*)+);`;

		// [1,2] = style(value):
		// [3,4] = style:value;
		// [5]   = #id.className;
		return `${twStyle}|${cssStyle}|${idOrClass}`;
	})();

	// URL pattern.
	const url = '(?:file|https?|mailto|ftp|javascript|irc|news|data):[^\\s\'"]+';


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze({
		space,
		spaceNoTerminator,
		lineTerminator,
		notSpace,
		anyChar,
		anyLetter,
		anyLetterStrict,
		identifierFirstChar,
		identifierNextChar,
		identifier,
		variableSigil,
		variable,
		macroName,
		templateName,
		htmlTagName,
		cssIdOrClassSigil,
		cssImage,
		inlineCss,
		url
	});
})();
/* eslint-enable max-len */
