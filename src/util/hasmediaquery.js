/***********************************************************************************************************************

	util/hasmediaquery.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns whether the given media query matches.
*/
var hasMediaQuery = (() => { // eslint-disable-line no-unused-vars, no-var
	// If the browser does not support `matchMedia()`, then return
	// a version of `hasMediaQuery()` that simply returns `false`.
	if (typeof window.matchMedia !== 'function') {
		return function utilHasMediaQuery() {
			return false;
		};
	}

	// Elsewise, return the regular `hasMediaQuery()` function.
	return function hasMediaQuery(mediaQuery) {
		return window.matchMedia(mediaQuery).matches;
	};
})();
