/***********************************************************************************************************************

	lib/diff.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global clone, enumFrom */

var Diff = (() => { // eslint-disable-line no-unused-vars, no-var
	// Diff operations object.
	const Op = enumFrom({
		Delete      : 0,
		SpliceArray : 1,
		Copy        : 2,

		/* legacy */
		CopyDate : 3
		/* /legacy */
	});


	/*******************************************************************************
		Diff Functions.
	*******************************************************************************/

	// Returns whether the given value is a finite number or a numeric string
	// that yields a finite number when parsed.
	function isNumeric(O) {
		let num;

		switch (typeof O) {
			case 'number': num = O; break;
			case 'string': num = Number(O); break;
			default:       return false;
		}

		return !Number.isNaN(num) && Number.isFinite(num);
	}

	// Returns a delta object generated from comparing the `a` and `b` objects.
	function diff(a, b) /* delta object */ {
		const toString = Object.prototype.toString;
		const aIsArray = a instanceof Array;
		const delta    = Object.create(null);
		const keys     = [...Object.keys(a), ...Object.keys(b)]
			.sort()
			.filter((val, i, arr) => i === 0 || arr[i - 1] !== val);
		let aOpKey;

		// Array operation predicate.
		const isAOpKey = key => key === aOpKey;

		/* eslint-disable max-depth */
		for (let i = 0, klen = keys.length; i < klen; ++i) {
			const key  = keys[i];
			const aVal = a[key];
			const bVal = b[key];

			// Key exists in `a`.
			if (Object.hasOwn(a, key)) {
				// Key exists in both.
				if (Object.hasOwn(b, key)) {
					// Values are exactly the same, so do nothing.
					if (aVal === bVal) {
						continue;
					}

					// Values are of the same basic type.
					if (typeof aVal === typeof bVal) {
						// Values are functions.
						if (typeof aVal === 'function') {
							/* delta[key] = [Op.Copy, bVal]; */
							if (aVal.toString() !== bVal.toString()) {
								delta[key] = [Op.Copy, bVal];
							}
						}

						// Values are primitives.
						else if (typeof aVal !== 'object' || aVal === null) {
							delta[key] = [Op.Copy, bVal];
						}

						// Values are objects.
						else {
							const aValType = toString.call(aVal);
							const bValType = toString.call(bVal);

							// Values are objects of the same reported type.
							if (aValType === bValType) {
								// Supported natives and generic objects.
								if (aVal instanceof Date) {
									if (aVal.getTime() !== bVal.getTime()) {
										delta[key] = [Op.Copy, clone(bVal)];
									}
								}
								else if (aVal instanceof Map) {
									delta[key] = [Op.Copy, clone(bVal)];
								}
								else if (aVal instanceof RegExp) {
									if (aVal.toString() !== bVal.toString()) {
										delta[key] = [Op.Copy, clone(bVal)];
									}
								}
								else if (aVal instanceof Set) {
									delta[key] = [Op.Copy, clone(bVal)];
								}
								else if (aVal instanceof Array || aValType === '[object Object]') {
									const subDelta = diff(aVal, bVal);

									if (subDelta !== null) {
										delta[key] = subDelta;
									}
								}

								// Unknown non-generic objects (custom or unsupported natives).
								else {
									// We cannot know how to process these objects,
									// so we simply accept them as-is.
									delta[key] = [Op.Copy, clone(bVal)];
								}
							}

							// Values are objects of different reported types.
							else {
								delta[key] = [Op.Copy, clone(bVal)];
							}
						}
					}

					// Values are of different types.
					else {
						delta[key] = [
							Op.Copy,
							typeof bVal !== 'object' || bVal === null ? bVal : clone(bVal)
						];
					}
				}

				// Key exists only in `a`.
				else {
					if (aIsArray && isNumeric(key)) {
						const index = Number(key);

						if (!aOpKey) {
							aOpKey = '';

							do {
								aOpKey += '~';
							} while (keys.some(isAOpKey));

							delta[aOpKey] = [Op.SpliceArray, index, index];
						}

						if (index < delta[aOpKey][1]) {
							delta[aOpKey][1] = index;
						}

						if (index > delta[aOpKey][2]) {
							delta[aOpKey][2] = index;
						}
					}
					else {
						delta[key] = Op.Delete;
					}
				}
			}

			// Key exists only in `b`.
			else {
				delta[key] = [
					Op.Copy,
					typeof bVal !== 'object' || bVal === null ? bVal : clone(bVal)
				];
			}
		}
		/* eslint-enable max-depth */

		return Object.keys(delta).length > 0 ? delta : null;
	}

	// Returns the object resulting from updating the `orig` object with the
	// `delta` object.
	function patch(orig, delta) /* patched object */ {
		const keys    = delta ? Object.keys(delta) : [];
		const patched = clone(orig);

		for (let i = 0, klen = keys.length; i < klen; ++i) {
			const key   = keys[i];
			const value = delta[key];

			if (value === Op.Delete) {
				delete patched[key];
			}
			else if (value instanceof Array) {
				switch (value[0]) {
					case Op.SpliceArray:
						patched.splice(value[1], value[2] - value[1] + 1);
						break;

					case Op.Copy:
						patched[key] = clone(value[1]);
						break;

					/* legacy */
					case Op.CopyDate:
						patched[key] = new Date(value[1]);
						break;
					/* /legacy */
				}
			}
			else {
				patched[key] = patch(patched[key], value);
			}
		}

		return patched;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		Op    : { value : Op },
		diff  : { value : diff },
		patch : { value : patch }
	}));
})();
