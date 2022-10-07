/***********************************************************************************************************************

	utils/hasown.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns whether the given object has an own property by the given name.
*/
var hasOwn = (() => { // eslint-disable-line no-unused-vars, no-var
	// Return the native `Object.hasOwn()` static method, if it exists.
	if (Object.hasOwn) {
		return Object.hasOwn;
	}

	// Cache the `<Object>.hasOwnProperty()` method.
	const hasOwnProperty = Object.prototype.hasOwnProperty;

	function hasOwn(O, P) {
		if (O == null) { // lazy equality for null
			throw new TypeError('object parameter may not be undefined or null');
		}

		return hasOwnProperty.call(Object(O), P);
	}

	return hasOwn;
})();
