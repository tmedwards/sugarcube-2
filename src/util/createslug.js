/***********************************************************************************************************************

	util/createslug.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns a sanitized version of the given string that should be safe for use
	as a DOM ID or class name.
*/
var createSlug = (() => { // eslint-disable-line no-unused-vars, no-var
	// The range of illegal characters consists of: C0 controls, space, exclamation,
	// double quote, number, dollar, percent, ampersand, single quote, left paren,
	// right paren, asterisk, plus, comma, hyphen, period, forward slash, colon,
	// semi-colon, less-than, equals, greater-than, question, at, left bracket,
	// backslash, right bracket, caret, backquote/grave, left brace, pipe/vertical
	// line, right brace, tilde, delete, C1 controls.
	const illegalCharsRE = /[\x00-\x20!-/:-@[-^`{-\x9f]+/g; // eslint-disable-line no-control-regex

	/* legacy */
	// Matches the empty string or one comprised solely of hyphens.
	const isInvalidSlugRE = /^-*$/;
	/* /legacy */

	// Special cases for story and temporary variables.
	const storySigilRE = /^\$/;
	const tempSigilRE  = /^_/;

	function createSlug(str) {
		const base = String(str).trim();

		/* legacy */
		const legacy = base
			.replace(/[^\w\s\u2013\u2014-]+/g, '')
			.replace(/[_\s\u2013\u2014-]+/g, '-')
			.toLocaleLowerCase();

		if (!isInvalidSlugRE.test(legacy)) {
			return legacy;
		}
		/* /legacy */

		return base
			.replace(storySigilRE, '')
			.replace(tempSigilRE, '-')
			.replace(illegalCharsRE, '');
	}

	return createSlug;
})();
