/***********************************************************************************************************************

	util/charandposat.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns an object containing the Unicode character, which may consist of one
	or two UTF-16 code points, at the given position within the given string and
	its starting/ending positions.  If the position is out-of-bounds, returns an
	object containing the empty string and both positions set to `-1`.
*/
function charAndPosAt(string, position) { // eslint-disable-line no-unused-vars
	const str  = String(string);
	const pos  = Math.trunc(position);
	const code = str.charCodeAt(pos);

	// Given position was out-of-bounds.
	if (Number.isNaN(code)) {
		return { char : '', start : -1, end : -1 };
	}

	const retval = {
		char  : str.charAt(pos),
		start : pos,
		end   : pos
	};

	// Code unit is not a UTF-16 surrogate.
	if (code < 0xD800 || code > 0xDFFF) {
		return retval;
	}

	// Code unit is a high surrogate (D800–DBFF).
	if (code >= 0xD800 && code <= 0xDBFF) {
		const nextPos = pos + 1;

		// End of string.
		if (nextPos >= str.length) {
			return retval;
		}

		const nextCode = str.charCodeAt(nextPos);

		// Next code unit is not a low surrogate (DC00–DFFF).
		if (nextCode < 0xDC00 || nextCode > 0xDFFF) {
			return retval;
		}

		retval.char = retval.char + str.charAt(nextPos);
		retval.end = nextPos;
		return retval;
	}

	// Code unit is a low surrogate (DC00–DFFF) in the first position.
	if (pos === 0) {
		return retval;
	}

	const prevPos  = pos - 1;
	const prevCode = str.charCodeAt(prevPos);

	// Previous code unit is not a high surrogate (D800–DBFF).
	if (prevCode < 0xD800 || prevCode > 0xDBFF) {
		return retval;
	}

	retval.char = str.charAt(prevPos) + retval.char;
	retval.start = prevPos;
	return retval;
}
