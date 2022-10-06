/***********************************************************************************************************************

	utils/characterandposat.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns an object (`{ char, start, end }`) containing the Unicode character at
	position `pos`, its starting position, and its ending position—surrogate pairs
	are properly handled.  If `pos` is out-of-bounds, returns an object containing
	the empty string and start/end positions of `-1`.

	This function is necessary because JavaScript strings are sequences of UTF-16
	code units, so surrogate pairs are exposed and thus must be handled.  While the
	ES6/2015 standard does improve the situation somewhat, it does not alleviate
	the need for this function.

	NOTE: Returns the individual code units of invalid surrogate pairs as-is.

	IDEA: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
*/
function characterAndPosAt(text, position) { // eslint-disable-line no-unused-vars
	const str  = String(text);
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
