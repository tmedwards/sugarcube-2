/***********************************************************************************************************************

	util/createfilename.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns a sanitized version of the given string that should be safe for use
	as a filename under both Windows and Unix-based/-like operating systems.
*/
var createFilename = (() => { // eslint-disable-line no-unused-vars, no-var
	// The range of illegal characters consists of: C0 controls, double quote,
	// number, dollar, percent, ampersand, single quote, asterisk, plus, comma,
	// forward slash, colon, semi-colon, less-than, equals, greater-than, question,
	// backslash, caret, backquote/grave, pipe/vertical line, delete, C1 controls.
	const illegalCharsRE = /[\x00-\x1f"#$%&'*+,/:;<=>?\\^`|\x7f-\x9f]+/g; // eslint-disable-line no-control-regex

	function createFilename(str) {
		return String(str).trim().replace(illegalCharsRE, '');
	}

	return createFilename;
})();
