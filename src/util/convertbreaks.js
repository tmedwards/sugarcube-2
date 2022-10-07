/***********************************************************************************************************************

	util/convertbreaks.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Converts <br> elements to <p> elements within the given node tree.

	TODO: Recheck all current elements (ca. Apr 2020) to see which are block-level
	and which should be recurively processed—e.g., as `<div>` has been.  When doing
	so, however, care should be taken so that controls are not processed.

	FIXME: Controls are being processed.  Fix it!
*/
function convertBreaks(source) { // eslint-disable-line no-unused-vars
	const output = document.createDocumentFragment();
	let para = document.createElement('p');
	let node;

	while ((node = source.firstChild) !== null) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const tagName = node.nodeName.toUpperCase();

			switch (tagName) {
				case 'BR':
					if (
						node.nextSibling !== null
						&& node.nextSibling.nodeType === Node.ELEMENT_NODE
						&& node.nextSibling.nodeName.toUpperCase() === 'BR'
					) {
						source.removeChild(node.nextSibling);
						source.removeChild(node);
						output.appendChild(para);
						para = document.createElement('p');
						continue;
					}
					else if (!para.hasChildNodes()) {
						source.removeChild(node);
						continue;
					}

					break;

				case 'DIV':
					convertBreaks(node);
					/* falls through */

				case 'ADDRESS':
				case 'ARTICLE':
				case 'ASIDE':
				case 'BLOCKQUOTE':
				case 'CENTER':
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
				case 'UL':
					if (para.hasChildNodes()) {
						output.appendChild(para);
						para = document.createElement('p');
					}

					output.appendChild(node);
					continue;
			}
		}

		para.appendChild(node);
	}

	if (para.hasChildNodes()) {
		output.appendChild(para);
	}

	source.appendChild(output);
}
