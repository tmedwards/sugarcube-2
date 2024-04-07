/***********************************************************************************************************************

	util/clone.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global getTypeOf */

/*
	Returns a deep copy of the given value.

	Supports: arrays, booleans, dates, functions, generic objects, maps,
	numbers, null, regexps, sets, strings, symbols, and undefined.  Throws
	an error for any other value.

	WARNING: Referential relationships between objects are not maintained—i.e.,
	after cloning multiple references to an object will refer to seperate yet
	equivalent objects, as each reference receives its own clone of the original.

	WARNING: Generic objects have only their own enumerable properties copied.
	Non-enumerable properties and property descriptors—e.g., getters/setters
	and configuration metadata—are not duplicated and likely will never be.

	WARNING: Functions are returned as-is as behavior is immutable.  Neither
	expando properties nor scope are copied—the former is a choice and the
	latter is impossible.
*/
function clone(O) { // eslint-disable-line no-unused-vars
	// Immediately return primitives and functions.
	if (typeof O !== 'object' || O === null) {
		return O;
	}

	// Immediately defer to objects' native `clone` method.
	if (typeof O.clone === 'function') {
		return O.clone(true);
	}

	// Handle instances of supported object types and generic objects.
	//
	// NOTE: Each non-generic object that we support must be explicitly
	// handled below.

	let copy;

	// Initialize copies of `Array` objects.
	if (O instanceof Array) {
		copy = new Array(O.length);
	}

	// Copy `Date` objects.
	else if (O instanceof Date) {
		copy = new Date(O.getTime());
	}

	// Copy `Map` objects.
	else if (O instanceof Map) {
		copy = new Map();
		O.forEach((val, key) => copy.set(clone(key), clone(val)));
	}

	// Copy `RegExp` objects.
	else if (O instanceof RegExp) {
		copy = new RegExp(O);
	}

	// Copy `Set` objects.
	else if (O instanceof Set) {
		copy = new Set();
		O.forEach(val => copy.add(clone(val)));
	}

	else {
		const type = getTypeOf(O);

		// Initialize copies of generic objects.
		if (type === 'Object') {
			// We try to ensure that the returned copy has the same prototype as
			// the original, but this may produce less than satisfactory results
			// on non-generics.
			copy = Object.create(Object.getPrototypeOf(O));
		}

		// Unsupported type, so get out the hot irons.
		else {
			throw new TypeError(`attempted to clone unsupported type: ${type}`);
		}
	}

	// Duplicate the original's own enumerable properties, including expando
	// properties.
	//
	// WARNING: This preserves neither symbol properties nor ES5 property
	// attributes.  Neither does the delta coding nor the serialization code,
	// however, so it's not really an issue at the moment.
	Object.keys(O).forEach(P => copy[P] = clone(O[P]));

	return copy;
}
