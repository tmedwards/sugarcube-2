/***********************************************************************************************************************

	util/enquote.js

	Copyright © 2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns a sanitized version of the given `KeyboardEvent.key` value from
	previous incarnations of the specification that should better reflect the
	current incarnation.

	Returns the given string quoted by double or single quotes, as appropriate.
	Preexisting unescaped quotes of same type are escaped.
*/
var enquote = (() => { // eslint-disable-line no-unused-vars, no-var
	// Unescaped double and single quote regular expressions.
	//
	// NOTE: Being unable to use negative lookbehind assertions sucks.
	const unescapedDQuoteRE = /(^|[^\\])(")/g;
	const unescapedSQuoteRE = /(^|[^\\])(')/g;

	// Quotes strings,
	function enquote(string) {
		let dqCount = 0;
		let sqCount = 0;

		for (let i = 0; i < string.length; ++i) {
			switch (string[i]) {
				case '\\': ++i; break;
				case '"': ++dqCount; break;
				case "'": ++sqCount; break;
			}
		}

		if (dqCount === 0) {
			return `"${string}"`;
		}
		else if (sqCount === 0) {
			return `'${string}'`;
		}
		else {
			const quote = dqCount <= sqCount ? '"' : "'";
			return `${quote}${string.replace(quote === '"' ? unescapedDQuoteRE : unescapedSQuoteRE, '$1\\$2')}${quote}`;
		}
	}

	return enquote;
})();
