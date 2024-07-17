/***********************************************************************************************************************

	extensions/ecmascript-polyfills.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns */

/*
	ECMAScript Polyfills.

	NOTE: The ES5 and ES6 polyfills come from the vendored `es5-shim.js` and `es6-shim.js` libraries.
*/
(() => {
	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	/*
		Trims whitespace from either the start or end of the given string.
	*/
	const _trimString = (() => {
		// Whitespace regular expressions.
		const startWSRe = new RegExp(`^${Patterns.space}${Patterns.space}*`);
		const endWSRe   = new RegExp(`${Patterns.space}${Patterns.space}*$`);

		function trimString(str, where) {
			const val = String(str);

			if (!val) {
				return val;
			}

			switch (where) {
				case 'start':
					return startWSRe.test(val) ? val.replace(startWSRe, '') : val;

				case 'end':
					return endWSRe.test(val) ? val.replace(endWSRe, '') : val;

				default:
					throw new Error(`_trimString called with incorrect where parameter value: "${where}"`);
			}
		}

		return trimString;
	})();

	/*
		Generates a pad string based upon the given string and length.
	*/
	function _createPadString(length, padding) {
		const targetLength = Number.parseInt(length, 10) || 0;

		if (targetLength < 1) {
			return '';
		}

		let padString = typeof padding === 'undefined' ? '' : String(padding);

		if (padString === '') {
			padString = ' ';
		}

		while (padString.length < targetLength) {
			const curPadLength    = padString.length;
			const remainingLength = targetLength - curPadLength;

			padString += curPadLength > remainingLength
				? padString.slice(0, remainingLength)
				: padString;
		}

		if (padString.length > targetLength) {
			padString = padString.slice(0, targetLength);
		}

		return padString;
	}


	/*******************************************************************************
		Polyfills.
	*******************************************************************************/

	/*
		[ES2019] Returns a new array consisting of the source array with all sub-array elements
		concatenated into it recursively up to the given depth.
	*/
	if (!Array.prototype.flat) {
		Object.defineProperty(Array.prototype, 'flat', {
			configurable : true,
			writable     : true,
			value        : (() => {
				function flat(/* depth */) {
					if (this == null) { // lazy equality for null
						throw new TypeError('Array.prototype.flat called on null or undefined');
					}

					const depth = arguments.length === 0 ? 1 : Number(arguments[0]) || 0;

					if (depth < 1) {
						return Array.prototype.slice.call(this);
					}

					const push = Array.prototype.push;

					return Array.prototype.reduce.call(
						this,
						(acc, cur) => {
							if (cur instanceof Array) {
								push.apply(acc, flat.call(cur, depth - 1));
							}
							else {
								acc.push(cur);
							}

							return acc;
						},
						[]
					);
				}

				return flat;
			})()
		});
	}

	/*
		[ES2019] Returns a new array consisting of the result of calling the given mapping function
		on every element in the source array and then concatenating all sub-array elements into it
		recursively up to a depth of `1`.  Identical to calling `<Array>.map(fn).flat()`.
	*/
	if (!Array.prototype.flatMap) {
		Object.defineProperty(Array.prototype, 'flatMap', {
			configurable : true,
			writable     : true,

			value(/* callback [, thisArg] */) {
				if (this == null) { // lazy equality for null
					throw new TypeError('Array.prototype.flatMap called on null or undefined');
				}

				return Array.prototype.map.apply(this, arguments).flat();
			}
		});
	}

	/*
		[ES2016] Returns whether the given element was found within the array.
	*/
	if (!Array.prototype.includes) {
		Object.defineProperty(Array.prototype, 'includes', {
			configurable : true,
			writable     : true,

			value(/* needle [, fromIndex] */) {
				if (this == null) { // lazy equality for null
					throw new TypeError('Array.prototype.includes called on null or undefined');
				}

				if (arguments.length === 0) {
					return false;
				}

				const length = this.length >>> 0;

				if (length === 0) {
					return false;
				}

				const needle = arguments[0];
				let i = Number(arguments[1]) || 0;

				if (i < 0) {
					i = Math.max(0, length + i);
				}

				for (/* empty */; i < length; ++i) {
					const value = this[i];

					if (value === needle || value !== value && needle !== needle) {
						return true;
					}
				}

				return false;
			}
		});
	}

	/*
		[ES2017] Returns a new array consisting of the given object's own enumerable property/value
		pairs as `[key, value]` arrays.
	*/
	if (!Object.entries) {
		Object.defineProperty(Object, 'entries', {
			configurable : true,
			writable     : true,

			value(obj) {
				if (typeof obj !== 'object' || obj === null) {
					throw new TypeError('Object.entries object parameter must be an object');
				}

				return Object.keys(obj).map(key => [key, obj[key]]);
			}
		});
	}

	/*
		[ES2019] Returns a new generic object consisting of the given list's key/value pairs.
	*/
	if (!Object.fromEntries) {
		Object.defineProperty(Object, 'fromEntries', {
			configurable : true,
			writable     : true,

			value(iter) {
				return Array.from(iter).reduce(
					(acc, pair) => {
						if (Object(pair) !== pair) {
							throw new TypeError('Object.fromEntries iterable parameter must yield objects');
						}

						if (pair[0] in acc) {
							Object.defineProperty(acc, pair[0], {
								configurable : true,
								enumerable   : true,
								writable     : true,
								value        : pair[1]
							});
						}
						else {
							acc[pair[0]] = pair[1]; // eslint-disable-line no-param-reassign
						}

						return acc;
					},
					{}
				);
			}
		});
	}

	/*
		[ES2017] Returns all own property descriptors of the given object.
	*/
	if (!Object.getOwnPropertyDescriptors) {
		Object.defineProperty(Object, 'getOwnPropertyDescriptors', {
			configurable : true,
			writable     : true,

			value(obj) {
				if (obj == null) { // lazy equality for null
					throw new TypeError('Object.getOwnPropertyDescriptors object parameter is null or undefined');
				}

				const O = Object(obj);

				return Reflect.ownKeys(O).reduce(
					(acc, key) => {
						const desc = Object.getOwnPropertyDescriptor(O, key);

						if (typeof desc !== 'undefined') {
							if (key in acc) {
								Object.defineProperty(acc, key, {
									configurable : true,
									enumerable   : true,
									writable     : true,
									value        : desc
								});
							}
							else {
								acc[key] = desc; // eslint-disable-line no-param-reassign
							}
						}

						return acc;
					},
					{}
				);
			}
		});
	}

	/*
		[ES2022] Returns whether the given object has an own property by the given name.
	*/
	if (!Object.hasOwn) {
		// Cache the `<Object>.hasOwnProperty()` method.
		const hasOwnProperty = Object.prototype.hasOwnProperty;

		Object.defineProperty(Object, 'hasOwn', {
			configurable : true,
			writable     : true,

			value(O, P) {
				return hasOwnProperty.call(Object(O), P);
			}
		});
	}

	/*
		[ES2017] Returns a new array consisting of the given object's own enumerable property values.
	*/
	if (!Object.values) {
		Object.defineProperty(Object, 'values', {
			configurable : true,
			writable     : true,

			value(obj) {
				if (typeof obj !== 'object' || obj === null) {
					throw new TypeError('Object.values object parameter must be an object');
				}

				return Object.keys(obj).map(key => obj[key]);
			}
		});
	}

	/*
		[ES2017] Returns a string based on concatenating the given padding, repeated as necessary,
		to the start of the string so that the given length is reached.

		NOTE: This pads based upon Unicode code units, rather than code points.
	*/
	if (!String.prototype.padStart) {
		Object.defineProperty(String.prototype, 'padStart', {
			configurable : true,
			writable     : true,

			value(length, padding) {
				if (this == null) { // lazy equality for null
					throw new TypeError('String.prototype.padStart called on null or undefined');
				}

				const baseString   = String(this);
				const baseLength   = baseString.length;
				const targetLength = Number.parseInt(length, 10);

				if (targetLength <= baseLength) {
					return baseString;
				}

				return _createPadString(targetLength - baseLength, padding) + baseString;
			}
		});
	}

	/*
		[ES2017] Returns a string based on concatenating the given padding, repeated as necessary,
		to the end of the string so that the given length is reached.

		NOTE: This pads based upon Unicode code units, rather than code points.
	*/
	if (!String.prototype.padEnd) {
		Object.defineProperty(String.prototype, 'padEnd', {
			configurable : true,
			writable     : true,

			value(length, padding) {
				if (this == null) { // lazy equality for null
					throw new TypeError('String.prototype.padEnd called on null or undefined');
				}

				const baseString   = String(this);
				const baseLength   = baseString.length;
				const targetLength = Number.parseInt(length, 10);

				if (targetLength <= baseLength) {
					return baseString;
				}

				return baseString + _createPadString(targetLength - baseLength, padding);
			}
		});
	}

	/*
		[ES2019] Returns a string with all whitespace removed from the start of the string.
	*/
	if (!String.prototype.trimStart) {
		Object.defineProperty(String.prototype, 'trimStart', {
			configurable : true,
			writable     : true,

			value() {
				if (this == null) { // lazy equality for null
					throw new TypeError('String.prototype.trimStart called on null or undefined');
				}

				return _trimString(this, 'start');
			}
		});
	}

	if (!String.prototype.trimLeft) {
		Object.defineProperty(String.prototype, 'trimLeft', {
			configurable : true,
			writable     : true,

			value() {
				if (this == null) { // lazy equality for null
					throw new TypeError('String.prototype.trimLeft called on null or undefined');
				}

				return _trimString(this, 'start');
			}
		});
	}

	/*
		[ES2019] Returns a string with all whitespace removed from the end of the string.
	*/
	if (!String.prototype.trimEnd) {
		Object.defineProperty(String.prototype, 'trimEnd', {
			configurable : true,
			writable     : true,

			value() {
				if (this == null) { // lazy equality for null
					throw new TypeError('String.prototype.trimEnd called on null or undefined');
				}

				return _trimString(this, 'end');
			}
		});
	}

	if (!String.prototype.trimRight) {
		Object.defineProperty(String.prototype, 'trimRight', {
			configurable : true,
			writable     : true,

			value() {
				if (this == null) { // lazy equality for null
					throw new TypeError('String.prototype.trimRight called on null or undefined');
				}

				return _trimString(this, 'end');
			}
		});
	}
})();
