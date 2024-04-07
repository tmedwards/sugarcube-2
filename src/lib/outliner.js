/***********************************************************************************************************************

	lib/outliner.js

	Copyright © 2015–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Outliner API static object.
*/
var Outliner = (() => { // eslint-disable-line no-unused-vars, no-var
	// Cache of the outline patching `<style>` element.
	let styleEl = null;

	// Last event seen.
	let lastEvent;


	/*******************************************************************************
		API Functions.
	*******************************************************************************/

	function outlinerInit() {
		if (styleEl) {
			return;
		}

		// Generate the `<style>` element.
		styleEl = document.createElement('style');

		// Append the element to the document head.
		jQuery(styleEl)
			.attr({
				id   : 'style-outliner',
				type : 'text/css'
			})
			.appendTo(document.head);

		// Attach the event handler to manipulate the outlines.
		jQuery(document).on(
			'mousedown.style-outliner keydown.style-outliner',
			ev => {
				if (ev.type !== lastEvent) {
					lastEvent = ev.type;

					if (ev.type === 'keydown') {
						outlinerShow();
					}
					else {
						outlinerHide();
					}
				}
			}
		);

		// Initially hide outlines.
		lastEvent = 'mousedown';
		outlinerHide();
	}

	function outlinerHide() {
		document.documentElement.removeAttribute('data-outlines');

		// For IE ≤ 10.
		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = '*:focus{outline:none;}';
		}

		// For all other browsers.
		else {
			styleEl.textContent = '*:focus{outline:none;}';
		}
	}

	function outlinerShow() {
		document.documentElement.setAttribute('data-outlines', '');

		// For IE ≤ 10.
		if (styleEl.styleSheet) {
			styleEl.styleSheet.cssText = '';
		}

		// For all other browsers.
		else {
			styleEl.textContent = '';
		}
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		init : { value : outlinerInit },
		hide : { value : outlinerHide },
		show : { value : outlinerShow }
	}));
})();
