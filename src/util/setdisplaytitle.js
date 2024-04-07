/***********************************************************************************************************************

	util/setdisplaytitle.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, State, Wikifier, getTypeOf */

/*
	Sets the display title.
*/
var setDisplayTitle = (() => { // eslint-disable-line no-unused-vars, no-var
	function getTextContent(source) {
		const copy = source.cloneNode(true);
		const frag = document.createDocumentFragment();
		let node;

		while ((node = copy.firstChild) !== null) {
			// Insert spaces before various elements.
			if (node.nodeType === Node.ELEMENT_NODE) {
				switch (node.nodeName.toUpperCase()) {
					case 'BR':
					case 'DIV':
					case 'P':
						frag.appendChild(document.createTextNode(' '));
						break;
				}
			}

			frag.appendChild(node);
		}

		return frag.textContent;
	}

	function setDisplayTitle(title, isPlainText) {
		if (typeof title !== 'string') {
			throw new TypeError(`title parameter must be a string (received: ${getTypeOf(title)})`);
		}

		let render;
		let text;

		if (isPlainText) {
			render = title.trim();
			text = render;
		}
		else {
			render = document.createDocumentFragment();
			new Wikifier(render, title, { noCleanup : true });
			text = getTextContent(render).trim();
		}

		// document.title = text;
		document.title = Config.passages.displayTitles && State.passage !== '' && State.passage !== Config.passages.start
			? `${State.passage} | ${text}`
			: text;

		jQuery('#story-title')
			.empty()
			.append(render);
	}

	return setDisplayTitle;
})();
