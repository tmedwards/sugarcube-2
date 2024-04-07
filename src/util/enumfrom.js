/***********************************************************************************************************************

	util/enumfrom.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns a pseudo-enumeration object created from the given Array, Map, Set,
	or generic object.
*/
function enumFrom(O) { // eslint-disable-line no-unused-vars
	const pEnum = Object.create(null);

	if (O instanceof Array) {
		O.forEach((val, i) => pEnum[String(val)] = i);
	}
	else if (O instanceof Set) {
		// NOTE: Use `<Array>.forEach()` here rather than `<Set>.forEach()`
		// as the latter does not provide the indices we require.
		Array.from(O).forEach((val, i) => pEnum[String(val)] = i);
	}
	else if (O instanceof Map) {
		O.forEach((val, key) => pEnum[String(key)] = val);
	}
	else if (
		O !== null
		&& typeof O === 'object'
		&& Object.getPrototypeOf(O) === Object.prototype
	) {
		Object.assign(pEnum, O);
	}
	else {
		throw new TypeError('enumFrom object parameter must be an Array, Map, Set, or generic object');
	}

	return Object.freeze(Object.defineProperties(pEnum, {
		nameFrom : {
			value(needle) {
				const entry = Object.entries(this).find(entry => entry[1] === needle);
				return entry ? entry[0] : undefined;
			}
		}
	}));
}
