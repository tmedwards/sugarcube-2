/***********************************************************************************************************************

	util/encodemarkup.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global enumFrom */

/*
	Returns an entity encoded version of the given string.

	NOTE: Escapes the five primary HTML special characters, the backquote,
	and SugarCube markup metacharacters.
*/
var encodeMarkup = (() => { // eslint-disable-line no-unused-vars, no-var
	const markupCharsRE    = /[!"#$&'*\-/<=>?@[\\\]^_`{|}~]/g;
	const hasMarkupCharsRE = new RegExp(markupCharsRE.source); // to drop the global flag
	const markupCharsTable = enumFrom({
		'!'  : '&#33;',
		'"'  : '&quot;',
		'#'  : '&#35;',
		'$'  : '&#36;', // eslint-disable-line quote-props
		'&'  : '&amp;',
		"'"  : '&#39;',
		'*'  : '&#42;',
		'-'  : '&#45;',
		'/'  : '&#47;',
		'<'  : '&lt;',
		'='  : '&#61;',
		'>'  : '&gt;',
		'?'  : '&#63;',
		'@'  : '&#64;',
		'['  : '&#91;',
		'\\' : '&#92;',
		']'  : '&#93;',
		'^'  : '&#94;',
		'_'  : '&#95;', // eslint-disable-line quote-props
		'`'  : '&#96;',
		'{'  : '&#123;',
		'|'  : '&#124;',
		'}'  : '&#125;',
		'~'  : '&#126;'
	});

	function encodeMarkup(str) {
		if (str == null) { // lazy equality for null
			return '';
		}

		const val = String(str);
		return val && hasMarkupCharsRE.test(val)
			? val.replace(markupCharsRE, ch => markupCharsTable[ch])
			: val;
	}

	return encodeMarkup;
})();
