/***********************************************************************************************************************

	extensions/jquery/miscellaneous-plugins.js

	Copyright © 2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Miscellaneous methods plugin.

	`<jQuery>.getRestrictedInteractiveContentTagNames()`
	Returns an array of tag names of restricted elements within the target element(s).
*/
(() => {
    // TODO: Add more tag names that should be restricted within the content of interactables.
	const RESTRICTED_ELEMENT_SELECTOR = 'a,button,form,input,select';

	jQuery.fn.extend({
		/*
			Extend jQuery's chainable methods with a `getRestrictedInteractiveContentTagNames()` method.
		*/
		getRestrictedInteractiveContentTagNames() {
			// Bail out if there are no target element(s).
			if (this.length === 0) {
				return [];
			}

			const restricted = new Set();

			// Populate the set with the restricted tags contained within the targets.
			sources
				.has(RESTRICTED_ELEMENT_SELECTOR)
				.each((_, el) => restricted.add(el.nodeName.toLowerCase()));

			// Return an array of the restricted set.
			return Array.from(restricted);
		}
	});
})();
