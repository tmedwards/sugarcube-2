/***********************************************************************************************************************

	l10n/l10n.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global l10nStrings */

var L10n = (() => { // eslint-disable-line no-unused-vars, no-var
	// Maximum replacement depth.
	const MAX_DEPTH = 50;

	// Replacement regular expressions.
	const replaceRE    = /\{\w+\}/g;
	const hasReplaceRE = new RegExp(replaceRE.source); // to drop the global flag


	/*******************************************************************************
		Localization Functions.
	*******************************************************************************/

	function init() {
		/* currently no-op */
	}


	/*******************************************************************************
		Localized String Functions.
	*******************************************************************************/

	function get(ids, overrides) {
		if (!ids) {
			return '';
		}

		const id = (Array.isArray(ids) ? ids : [ids]).find(id => Object.hasOwn(l10nStrings, id));

		if (!id) {
			return '';
		}

		let value = l10nStrings[id];
		let i     = 0;

		while (hasReplaceRE.test(value)) {
			if (++i > MAX_DEPTH) {
				throw new Error('L10n.get exceeded maximum replacement depth, probable infinite loop');
			}

			// Possibly required by some old buggy browsers.
			replaceRE.lastIndex = 0;

			value = value.replace(replaceRE, replacement => {
				const rid = replacement.slice(1, -1);

				if (overrides && Object.hasOwn(overrides, rid)) {
					return overrides[rid];
				}
				else if (Object.hasOwn(l10nStrings, rid)) {
					return l10nStrings[rid];
				}
			});
		}

		return value;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Localization Functions.
		init : { value : init },

		// Localized String Functions.
		get : { value : get }
	}));
})();
