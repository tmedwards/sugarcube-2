/***********************************************************************************************************************

	util/convertbreaks.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns */

/*
	Within the given node tree, gathers sequences of top-level text nodes and
	inline elements that are separated by two <br> elements, wraps them within
	<p> elements, and removes the <br> elements.

	TODO: Update the list of default block-level elements (below) as necessary.
	Last checked: Apr 2020.
*/
var convertBreaks = (() => { // eslint-disable-line no-unused-vars, no-var
	const isNotSpaceRE = new RegExp(Patterns.notSpace);

	function isParagraphEmpty(para) {
		if (!para.hasChildNodes()) {
			return true;
		}

		const nodes  = para.childNodes;
		const length = nodes.length;

		for (let i = 0; i < length; ++i) {
			const node = nodes[i];

			switch (node.nodeType) {
				case Node.TEXT_NODE: {
					if (isNotSpaceRE.test(node.nodeValue)) {
						return false;
					}

					break;
				}

				case Node.COMMENT_NODE:
					break;

				default:
					return false;
			}
		}

		return true;
	}

	function convertBreaks(source) {
		const output = document.createDocumentFragment();
		let para = document.createElement('p');
		let node;

		while ((node = source.firstChild) !== null) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const tagName = node.nodeName.toUpperCase();

				switch (tagName) {
					case 'BR': {
						if (
							node.nextSibling !== null
							&& node.nextSibling.nodeType === Node.ELEMENT_NODE
							&& node.nextSibling.nodeName.toUpperCase() === 'BR'
						) {
							source.removeChild(node.nextSibling);
							source.removeChild(node);

							if (!isParagraphEmpty(para)) {
								output.appendChild(para);
							}

							para = document.createElement('p');
							continue;
						}
						else if (isParagraphEmpty(para)) {
							source.removeChild(node);
							continue;
						}

						break;
					}

					// Default block-level elements.
					case 'ADDRESS':
					case 'ARTICLE':
					case 'ASIDE':
					case 'BLOCKQUOTE':
					case 'CENTER':
					case 'DIV':
					case 'DL':
					case 'FIGURE':
					case 'FOOTER':
					case 'FORM':
					case 'H1':
					case 'H2':
					case 'H3':
					case 'H4':
					case 'H5':
					case 'H6':
					case 'HEADER':
					case 'HR':
					case 'MAIN':
					case 'NAV':
					case 'OL':
					case 'P':
					case 'PRE':
					case 'SECTION':
					case 'TABLE':
					case 'UL': {
						if (!isParagraphEmpty(para)) {
							output.appendChild(para);
							para = document.createElement('p');
						}

						output.appendChild(node);
						continue;
					}
				}
			}

			para.appendChild(node);
		}

		if (!isParagraphEmpty(para)) {
			output.appendChild(para);
		}

		source.appendChild(output);
	}

	return convertBreaks;
})();
