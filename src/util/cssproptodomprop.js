/***********************************************************************************************************************

	util/cssproptodomprop.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns the DOM property name represented by the given CSS property name.
*/
function cssPropToDOMProp(cssName) { // eslint-disable-line no-unused-vars
	if (!cssName.includes('-')) {
		switch (cssName) {
			case 'bgcolor': return 'backgroundColor';
			case 'float':   return 'cssFloat';
			default:        return cssName;
		}
	}

	// Strip the leading hyphen from the `-ms-` vendor prefix, so it stays lowercased.
	const normalized = cssName.slice(0, 4) === '-ms-' ? cssName.slice(1) : cssName;

	return normalized
		.split('-')
		.map((part, i) => i === 0 ? part : part.toUpperFirst())
		.join('');
}
