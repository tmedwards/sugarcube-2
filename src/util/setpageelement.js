/***********************************************************************************************************************

	util/setpageelement.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Story, Wikifier */

/*
	Wikifies a passage into a DOM element corresponding to the given ID and
	returns the element.
*/
function setPageElement(idOrElement, titles, defaultText) { // eslint-disable-line no-unused-vars
	const el = typeof idOrElement === 'object'
		? idOrElement
		: document.getElementById(idOrElement);

	if (el == null) { // lazy equality for null
		return null;
	}

	const ids = titles instanceof Array ? titles : [titles];

	jQuery(el).empty();

	for (let i = 0; i < ids.length; ++i) {
		if (Story.has(ids[i])) {
			new Wikifier(el, Story.get(ids[i]).processText().trim());
			return el;
		}
	}

	if (defaultText != null) { // lazy equality for null
		const text = String(defaultText).trim();

		if (text !== '') {
			new Wikifier(el, text);
		}
	}

	return el;
}
