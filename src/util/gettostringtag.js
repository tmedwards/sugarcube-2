/***********************************************************************************************************************

	util/gettostringtag.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns the value of the `@@toStringTag` internal property of the given object.

	NOTE: In ≤ES5, returns the value of the `[[Class]]` internal slot.
*/
var getToStringTag = (() => { // eslint-disable-line no-unused-vars, no-var
	// Cache built-in object method.
	const toString = Object.prototype.toString;
	const slice    = String.prototype.slice;

	// If the browser is using the `Map()` and `Set()` polyfills, then return a
	// version of `getToStringTag()` that contains special cases for them, since
	// they do not have a `[[Class]]` internal slot and the `@@toStringTag`
	// internal property is unavailable to them.
	if (toString.call(new Map()) === '[object Object]') {
		return function getToStringTag(O) {
			// Special cases for the `Map` and `Set` polyfills.
			//
			// NOTE: We don't special case the `WeakMap` and `WeakSet` polyfills
			// here since they're (a) unlikely to be used and (b) broken anyway.
			if (O instanceof Map) { return 'Map'; }
			if (O instanceof Set) { return 'Set'; }

			return slice.call(toString.call(O), 8, -1);
		};
	}

	// Elsewise, return the regular `getToStringTag()` function.
	return function getToStringTag(O) {
		return slice.call(toString.call(O), 8, -1);
	};
})();
