/***********************************************************************************************************************

	util/encodeentities.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global enumFrom */

/*
	Returns an entity encoded version of the given string.

	NOTE: Only escapes the five primary special characters and the backquote.
*/
var encodeEntities = (() => { // eslint-disable-line no-unused-vars, no-var
	const htmlCharsRE    = /[&<>"'`]/g;
	const hasHtmlCharsRE = new RegExp(htmlCharsRE.source); // to drop the global flag
	const htmlCharsTable = enumFrom({
		'&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		'"' : '&quot;',
		"'" : '&#39;',
		'`' : '&#96;'
	});

	function encodeEntities(str) {
		if (str == null) { // lazy equality for null
			return '';
		}

		const val = String(str);
		return val && hasHtmlCharsRE.test(val)
			? val.replace(htmlCharsRE, ch => htmlCharsTable[ch])
			: val;
	}

	return encodeEntities;
})();
