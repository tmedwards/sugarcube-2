/***********************************************************************************************************************

	extensions/jquery/miscellaneous-plugins.js

	Copyright © 2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Miscellaneous methods plugin.

	`<jQuery>.getForbiddenInteractiveContentTagNames()`
	Returns an array of tag names of forbidden elements within the target element(s).
*/
(() => {
	jQuery.fn.extend({
		/*
			Extend jQuery's chainable methods with a `getForbiddenInteractiveContentTagNames()` method.
		*/
		getForbiddenInteractiveContentTagNames() {
			// Bail out if there are no target element(s).
			if (this.length === 0) {
				return [];
			}

			const forbidden = new Set();

			// Populate the set with the forbidden tags contained within the targets.
			this
				.find('a,button,fieldset,form,input,menuitem,optgroup,option,select,textarea')
				.each((_, el) => forbidden.add(el.nodeName.toLowerCase()));

			// Return an array of the forbidden set.
			return Array.from(forbidden);
		}
	});
})();
