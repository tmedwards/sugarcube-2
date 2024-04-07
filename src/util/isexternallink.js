/***********************************************************************************************************************

	util/isexternallink.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns, Story */

/*
	Returns whether the given link source is external (probably).
*/
var isExternalLink = (() => { // eslint-disable-line no-unused-vars, no-var
	const externalUrlRE = new RegExp(`^${Patterns.externalUrl}`, 'gim');
	const fingerprintRE = /[/\\?]/;

	function isExternalLink(link) {
		return !Story.has(link) && (externalUrlRE.test(link) || fingerprintRE.test(link));
	}

	return isExternalLink;
})();
