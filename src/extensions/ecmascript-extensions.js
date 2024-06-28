/***********************************************************************************************************************

	extensions/ecmascript-extensions.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Serial */

/*
	ECMAScript Extensions.
*/
(() => {
	// Attempt to cache the native `Math.random`, in case it's replaced later.
	const _nativeMathRandom = Math.random;


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	/*
		Returns a pseudo-random whole number (integer) within the given bounds.
	*/
	function _random(/* [min ,] max */) {
		let min;
		let max;

		switch (arguments.length) {
			case 0:
				throw new Error('_random called with insufficient parameters');
			case 1:
				min = 0;
				max = arguments[0];
				break;
			default:
				min = arguments[0];
				max = arguments[1];
				break;
		}

		if (min > max) {
			[min, max] = [max, min];
		}

		return Math.floor(_nativeMathRandom() * (max - min + 1)) + min;
	}

	/*
		Returns a randomly selected index within the given length and bounds.
		Bounds may be negative.
	*/
	function _randomIndex(length, boundsArgs) {
		let min;
		let max;

		switch (boundsArgs.length) {
			case 1:
				min = 0;
				max = length - 1;
				break;
			case 2:
				min = 0;
				max = Math.trunc(boundsArgs[1]);
				break;
			default:
				min = Math.trunc(boundsArgs[1]);
				max = Math.trunc(boundsArgs[2]);
				break;
		}

		if (Number.isNaN(min)) {
			min = 0;
		}
		else if (!Number.isFinite(min) || min >= length) {
			min = length - 1;
		}
		else if (min < 0) {
			min = length + min;

			if (min < 0) {
				min = 0;
			}
		}

		if (Number.isNaN(max)) {
			max = 0;
		}
		else if (!Number.isFinite(max) || max >= length) {
			max = length - 1;
		}
		else if (max < 0) {
			max = length + max;

			if (max < 0) {
				max = length - 1;
			}
		}

		return _random(min, max);
	}

	/*
		Returns an object (`{ char, start, end }`) containing the Unicode character at
		position `pos`, its starting position, and its ending position—surrogate pairs
		are properly handled.  If `pos` is out-of-bounds, returns an object containing
		the empty string and start/end positions of `-1`.

		This function is necessary because JavaScript strings are sequences of UTF-16
		code units, so surrogate pairs are exposed and thus must be handled.  While the
		ES6/2015 standard does improve the situation somewhat, it does not alleviate
		the need for this function.

		NOTE: Will throw exceptions on invalid surrogate pairs.

		IDEA: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
	*/
	function _getCodePointStartAndEnd(str, pos) {
		const code = str.charCodeAt(pos);

		// Given position was out-of-bounds.
		if (Number.isNaN(code)) {
			return { char : '', start : -1, end : -1 };
		}

		// Code unit is not a UTF-16 surrogate.
		if (code < 0xD800 || code > 0xDFFF) {
			return {
				char  : str.charAt(pos),
				start : pos,
				end   : pos
			};
		}

		// Code unit is a high surrogate (D800–DBFF).
		if (code >= 0xD800 && code <= 0xDBFF) {
			const nextPos = pos + 1;

			// End of string.
			if (nextPos >= str.length) {
				throw new Error('high surrogate without trailing low surrogate');
			}

			const nextCode = str.charCodeAt(nextPos);

			// Next code unit is not a low surrogate (DC00–DFFF).
			if (nextCode < 0xDC00 || nextCode > 0xDFFF) {
				throw new Error('high surrogate without trailing low surrogate');
			}

			return {
				char  : str.charAt(pos) + str.charAt(nextPos),
				start : pos,
				end   : nextPos
			};
		}

		// Code unit is a low surrogate (DC00–DFFF) in the first position.
		if (pos === 0) {
			throw new Error('low surrogate without leading high surrogate');
		}

		const prevPos  = pos - 1;
		const prevCode = str.charCodeAt(prevPos);

		// Previous code unit is not a high surrogate (D800–DBFF).
		if (prevCode < 0xD800 || prevCode > 0xDBFF) {
			throw new Error('low surrogate without leading high surrogate');
		}

		return {
			char  : str.charAt(prevPos) + str.charAt(pos),
			start : prevPos,
			end   : pos
		};
	}


	/*******************************************************************************
		`Array` Extensions.
	*******************************************************************************/

	/*
		Concatenates one or more unique elements to the end of the base array
		and returns the result as a new array.  Elements which are arrays will
		be merged—i.e. their elements will be concatenated, rather than the
		array itself.
	*/
	Object.defineProperty(Array.prototype, 'concatUnique', {
		configurable : true,
		writable     : true,

		value(/* variadic */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.concatUnique called on null or undefined');
			}

			const result = Array.from(this);

			if (arguments.length === 0) {
				return result;
			}

			const items   = Array.prototype.reduce.call(arguments, (prev, cur) => prev.concat(cur), []);
			const addSize = items.length;

			if (addSize === 0) {
				return result;
			}

			const indexOf = Array.prototype.indexOf;
			const push    = Array.prototype.push;

			for (let i = 0; i < addSize; ++i) {
				const value = items[i];

				if (indexOf.call(result, value) === -1) {
					push.call(result, value);
				}
			}

			return result;
		}
	});

	/*
		Returns the number of times the given element was found within the array.
	*/
	Object.defineProperty(Array.prototype, 'count', {
		configurable : true,
		writable     : true,

		value(/* needle [, fromIndex ] */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.count called on null or undefined');
			}

			const indexOf = Array.prototype.indexOf;
			const needle  = arguments[0];
			let pos   = Number(arguments[1]) || 0;
			let count = 0;

			while ((pos = indexOf.call(this, needle, pos)) !== -1) {
				++count;
				++pos;
			}

			return count;
		}
	});

	/*
		Returns the number elements within the array that pass the test
		implemented by the given predicate function.
	*/
	Object.defineProperty(Array.prototype, 'countWith', {
		configurable : true,
		writable     : true,

		value(predicate, thisArg) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.countWith called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new Error('Array.prototype.countWith predicate parameter must be a function');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return 0;
			}

			let count = 0;

			for (let i = 0; i < length; ++i) {
				if (predicate.call(thisArg, this[i], i, this)) {
					++count;
				}
			}

			return count;
		}
	});

	/*
		Removes and returns all instances of the given elements from
		the array.
	*/
	Object.defineProperty(Array.prototype, 'deleteAll', {
		configurable : true,
		writable     : true,

		value(/* needles */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.deleteAll called on null or undefined');
			}

			if (arguments.length === 0) {
				return [];
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return [];
			}

			const needles       = Array.prototype.concat.apply([], arguments);
			const needlesLength = needles.length;
			const indices       = [];

			for (let i = 0; i < length; ++i) {
				const value = this[i];

				for (let j = 0; j < needlesLength; ++j) {
					const needle = needles[j];

					if (value === needle || value !== value && needle !== needle) {
						indices.push(i);
						break;
					}
				}
			}

			const result = [];

			// Copy the elements (in original order).
			for (let i = 0, iend = indices.length; i < iend; ++i) {
				result[i] = this[indices[i]];
			}

			const splice = Array.prototype.splice;

			// Delete the elements (in reverse order).
			for (let i = indices.length - 1; i >= 0; --i) {
				splice.call(this, indices[i], 1);
			}

			return result;
		}
	});

	/*
		Removes and returns all instances of the elements at the given
		indices from the array.
	*/
	Object.defineProperty(Array.prototype, 'deleteAt', {
		configurable : true,
		writable     : true,

		value(/* indices */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.deleteAt called on null or undefined');
			}

			if (arguments.length === 0) {
				return [];
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return [];
			}

			const splice     = Array.prototype.splice;
			const cpyIndices = Array.from(new Set(
				// Map negative indices to their positive counterparts,
				// so the Set can properly filter out duplicates.
				Array.from(arguments).map(x => x < 0 ? Math.max(0, length + x) : x)
			).values());
			const delIndices = Array.from(cpyIndices).sort((a, b) => b - a);
			const result     = [];

			// Copy the elements (in originally specified order).
			for (let i = 0, iend = cpyIndices.length; i < iend; ++i) {
				result[i] = this[cpyIndices[i]];
			}

			// Delete the elements (in descending numeric order).
			for (let i = 0, iend = delIndices.length; i < iend; ++i) {
				splice.call(this, delIndices[i], 1);
			}

			return result;
		}
	});

	/*
		Removes and returns the first instance of all of the given elements
		from the array.

		TODO: (v3) This should be → `delete`.
	*/
	Object.defineProperty(Array.prototype, 'deleteFirst', {
		configurable : true,
		writable     : true,

		value(/* needles */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.deleteFirst called on null or undefined');
			}

			if (arguments.length === 0) {
				return;
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return;
			}

			const splice  = Array.prototype.splice;
			const needles = Array.prototype.concat.apply([], arguments);
			const result  = [];

			// Find and remove the first instance of each needle.
			for (let i = 0; i < length && needles.length > 0; ++i) {
				const value = this[i];

				for (let j = 0; j < needles.length; ++j) {
					const needle = needles[j];

					if (value === needle || value !== value && needle !== needle) {
						result.push(value);
						splice.call(this, i--, 1);
						needles.splice(j--, 1);
						break;
					}
				}
			}

			return result;
		}
	});

	/*
		Removes and returns the last instance of all of the given elements
		from the array.
	*/
	Object.defineProperty(Array.prototype, 'deleteLast', {
		configurable : true,
		writable     : true,

		value(/* needles */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.deleteLast called on null or undefined');
			}

			if (arguments.length === 0) {
				return;
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return;
			}

			const splice  = Array.prototype.splice;
			const needles = Array.prototype.concat.apply([], arguments);
			const result  = [];

			// Find and remove the last instance of each needle.
			for (let i = length - 1; i >= 0 && needles.length > 0; --i) {
				const value = this[i];

				for (let j = 0; j < needles.length; ++j) {
					const needle = needles[j];

					if (value === needle || value !== value && needle !== needle) {
						result.push(value);
						splice.call(this, i++, 1);
						needles.splice(j--, 1);
						break;
					}
				}
			}

			return result;
		}
	});

	/*
		Removes and returns all of the elements that pass the test implemented
		by the given predicate function from the array.
	*/
	Object.defineProperty(Array.prototype, 'deleteWith', {
		configurable : true,
		writable     : true,

		value(predicate, thisArg) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.deleteWith called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new Error('Array.prototype.deleteWith predicate parameter must be a function');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return [];
			}

			const splice  = Array.prototype.splice;
			const indices = [];
			const result  = [];

			// Copy the elements (in original order).
			for (let i = 0; i < length; ++i) {
				if (predicate.call(thisArg, this[i], i, this)) {
					result.push(this[i]);
					indices.push(i);
				}
			}

			// Delete the elements (in reverse order).
			for (let i = indices.length - 1; i >= 0; --i) {
				splice.call(this, indices[i], 1);
			}

			return result;
		}
	});

	/*
		Returns the first element from the array.
	*/
	Object.defineProperty(Array.prototype, 'first', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.first called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return;
			}

			return this[0];
		}
	});

	/*
		Returns whether all of the given elements were found within the array.
	*/
	Object.defineProperty(Array.prototype, 'includesAll', {
		configurable : true,
		writable     : true,

		value(/* needles */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.includesAll called on null or undefined');
			}

			if (arguments.length === 1) {
				if (Array.isArray(arguments[0])) {
					return Array.prototype.includesAll.apply(this, arguments[0]);
				}

				return Array.prototype.includes.apply(this, arguments);
			}

			for (let i = 0, iend = arguments.length; i < iend; ++i) {
				if (
					!Array.prototype.some.call(this, function (val) {
						return val === this.val || val !== val && this.val !== this.val;
					}, { val : arguments[i] })
				) {
					return false;
				}
			}

			return true;
		}
	});

	/*
		Returns whether any of the given elements were found within the array.
	*/
	Object.defineProperty(Array.prototype, 'includesAny', {
		configurable : true,
		writable     : true,

		value(/* needles */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.includesAny called on null or undefined');
			}

			if (arguments.length === 1) {
				if (Array.isArray(arguments[0])) {
					return Array.prototype.includesAny.apply(this, arguments[0]);
				}

				return Array.prototype.includes.apply(this, arguments);
			}

			for (let i = 0, iend = arguments.length; i < iend; ++i) {
				if (
					Array.prototype.some.call(this, function (val) {
						return val === this.val || val !== val && this.val !== this.val;
					}, { val : arguments[i] })
				) {
					return true;
				}
			}

			return false;
		}
	});

	/*
		Returns the last element from the array.
	*/
	Object.defineProperty(Array.prototype, 'last', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.last called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return;
			}

			return this[length - 1];
		}
	});

	/*
		Randomly removes an element from the base array and returns it.
		[DEPRECATED] Optionally, from within the given bounds.
	*/
	Object.defineProperty(Array.prototype, 'pluck', {
		configurable : true,
		writable     : true,

		value(/* DEPRECATED: [min ,] max */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.pluck called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return;
			}

			const index = arguments.length === 0
				? _random(0, length - 1)
				: _randomIndex(length, Array.from(arguments));

			return Array.prototype.splice.call(this, index, 1)[0];
		}
	});

	/*
		Randomly removes the given number of unique elements from the base array
		and returns the removed elements as a new array.
	*/
	Object.defineProperty(Array.prototype, 'pluckMany', {
		configurable : true,
		writable     : true,

		value(wantSize) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.pluckMany called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return [];
			}

			let want = Math.trunc(wantSize);

			if (!Number.isInteger(want)) {
				throw new Error('Array.prototype.pluckMany want parameter must be an integer');
			}

			if (want < 1) {
				return [];
			}

			if (want > length) {
				want = length;
			}

			const splice = Array.prototype.splice;
			const result = [];
			let max = length - 1;

			do {
				result.push(splice.call(this, _random(0, max--), 1)[0]);
			} while (result.length < want);

			return result;
		}
	});

	/*
		Appends one or more unique elements to the end of the base array and
		returns its new length.
	*/
	Object.defineProperty(Array.prototype, 'pushUnique', {
		configurable : true,
		writable     : true,

		value(/* variadic */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.pushUnique called on null or undefined');
			}

			const addSize = arguments.length;

			if (addSize === 0) {
				return this.length >>> 0;
			}

			const indexOf = Array.prototype.indexOf;
			const push    = Array.prototype.push;

			for (let i = 0; i < addSize; ++i) {
				const value = arguments[i];

				if (indexOf.call(this, value) === -1) {
					push.call(this, value);
				}
			}

			return this.length >>> 0;
		}
	});

	/*
		Randomly selects an element from the base array and returns it.
		[DEPRECATED] Optionally, from within the given bounds.
	*/
	Object.defineProperty(Array.prototype, 'random', {
		configurable : true,
		writable     : true,

		value(/* DEPRECATED: [min ,] max */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.random called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return;
			}

			const index = arguments.length === 0
				? _random(0, length - 1)
				: _randomIndex(length, Array.from(arguments));

			return this[index];
		}
	});

	/*
		Randomly selects the given number of unique elements from the base array
		and returns the selected elements as a new array.
	*/
	Object.defineProperty(Array.prototype, 'randomMany', {
		configurable : true,
		writable     : true,

		value(wantSize) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.randomMany called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return [];
			}

			let want = Math.trunc(wantSize);

			if (!Number.isInteger(want)) {
				throw new Error('Array.prototype.randomMany want parameter must be an integer');
			}

			if (want < 1) {
				return [];
			}

			if (want > length) {
				want = length;
			}

			const picked = new Map();
			const result = [];
			const max    = length - 1;

			do {
				let i;
				do {
					i = _random(0, max);
				} while (picked.has(i));
				picked.set(i, true);
				result.push(this[i]);
			} while (result.length < want);

			return result;
		}
	});

	/*
		Randomly shuffles the array and returns it.
	*/
	Object.defineProperty(Array.prototype, 'shuffle', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.shuffle called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return this;
			}

			for (let i = length - 1; i > 0; --i) {
				const j = Math.floor(_nativeMathRandom() * (i + 1));

				if (i === j) {
					continue;
				}

				const swap = this[i];
				this[i] = this[j];
				this[j] = swap;
			}

			return this;
		}
	});

	/*
		Creates a copy of the base array where all elements shuffled
		and returns the new array.
	*/
	Object.defineProperty(Array.prototype, 'toShuffled', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.toShuffled called on null or undefined');
			}

			return Array.from(this).shuffle();
		}
	});

	/*
		Creates a copy of the base array where all elements are made unique
		and returns the new array.
	*/
	Object.defineProperty(Array.prototype, 'toUnique', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.toUnique called on null or undefined');
			}

			return Array.from(new Set(this));
		}
	});

	/*
		Prepends one or more unique elements to the beginning of the base array
		and returns its new length.
	*/
	Object.defineProperty(Array.prototype, 'unshiftUnique', {
		configurable : true,
		writable     : true,

		value(/* variadic */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.unshiftUnique called on null or undefined');
			}

			const addSize = arguments.length;

			if (addSize === 0) {
				return this.length >>> 0;
			}

			const indexOf = Array.prototype.indexOf;
			const unshift = Array.prototype.unshift;

			for (let i = 0; i < addSize; ++i) {
				const value = arguments[i];

				if (indexOf.call(this, value) === -1) {
					unshift.call(this, value);
				}
			}

			return this.length >>> 0;
		}
	});


	/*******************************************************************************
		`Function` Extensions.
	*******************************************************************************/

	/*
		Returns a bound function that supplies the given arguments to the base
		function, followed by the arguments are supplied to the bound function,
		whenever it is called.
	*/
	Object.defineProperty(Function.prototype, 'partial', {
		configurable : true,
		writable     : true,

		value(/* variadic */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('Function.prototype.partial called on null or undefined');
			}

			const slice = Array.prototype.slice;
			const fn    = this;
			const bound = slice.call(arguments, 0);

			return function () {
				const applied = [];
				let argc = 0;

				for (let i = 0; i < bound.length; ++i) {
					applied.push(bound[i] === undefined ? arguments[argc++] : bound[i]);
				}

				return fn.apply(this, applied.concat(slice.call(arguments, argc)));
			};
		}
	});


	/*******************************************************************************
		`Math` Extensions.
	*******************************************************************************/

	/*
		Returns the given numerical clamped to the specified bounds.
	*/
	Object.defineProperty(Math, 'clamp', {
		configurable : true,
		writable     : true,

		value(num, min, max) {
			if (arguments.length !== 3) {
				throw new Error(`Math.clamp called with an incorrect number of parameters (want: 3, received: ${arguments.length})`);
			}

			const value = Number(num);
			let minVal = Number(min);
			let maxVal = Number(max);

			if (minVal > maxVal) {
				[minVal, maxVal] = [maxVal, minVal];
			}

			return Math.min(Math.max(value, minVal), maxVal);
		}
	});


	/*******************************************************************************
		`RegExp` Extensions.
	*******************************************************************************/

	/*
		Returns a copy of the given string with all RegExp metacharacters escaped.
	*/
	if (!RegExp.escape) {
		(() => {
			const _regExpMetaCharsRe    = /[\\^$*+?.()|[\]{}]/g;
			const _hasRegExpMetaCharsRe = new RegExp(_regExpMetaCharsRe.source); // to drop the global flag

			Object.defineProperty(RegExp, 'escape', {
				configurable : true,
				writable     : true,

				value(str) {
					const val = String(str);
					return val && _hasRegExpMetaCharsRe.test(val)
						? val.replace(_regExpMetaCharsRe, '\\$&')
						: val;
				}
			});
		})();
	}


	/*******************************************************************************
		`String` Extensions.
	*******************************************************************************/

	/*
		Returns a formatted string, after replacing each format item in the given
		format string with the text equivalent of the corresponding argument's value.
	*/
	(() => {
		const _formatRegExp    = /{(\d+)(?:,([+-]?\d+))?}/g;
		const _hasFormatRegExp = new RegExp(_formatRegExp.source); // to drop the global flag

		Object.defineProperty(String, 'format', {
			configurable : true,
			writable     : true,

			value(format) {
				function padString(str, align, pad) {
					if (!align) {
						return str;
					}

					const plen = Math.abs(align) - str.length;

					if (plen < 1) {
						return str;
					}

					// const padding = Array(plen + 1).join(pad);
					const padding = String(pad).repeat(plen);
					return align < 0 ? str + padding : padding + str;
				}

				if (arguments.length < 2) {
					return arguments.length === 0 ? '' : format;
				}

				const args = arguments.length === 2 && Array.isArray(arguments[1])
					? Array.from(arguments[1])
					: Array.prototype.slice.call(arguments, 1);

				if (args.length === 0) {
					return format;
				}

				if (!_hasFormatRegExp.test(format)) {
					return format;
				}

				// Possibly required by some old buggy browsers.
				_formatRegExp.lastIndex = 0;

				return format.replace(_formatRegExp, (match, index, align) => {
					let retval = args[index];

					if (retval == null) { // lazy equality for null
						return '';
					}

					while (typeof retval === 'function') {
						retval = retval();
					}

					switch (typeof retval) {
						case 'string': /* no-op */ break;
						case 'object': retval = JSON.stringify(retval); break;
						default:       retval = String(retval); break;
					}

					return padString(retval, !align ? 0 : Number.parseInt(align, 10), ' ');
				});
			}
		});
	})();

	/*
		Returns the number of times the given substring was found within the string.
	*/
	Object.defineProperty(String.prototype, 'count', {
		configurable : true,
		writable     : true,

		value(/* needle [, fromIndex ] */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.count called on null or undefined');
			}

			const needle = String(arguments[0] || '');

			if (needle === '') {
				return 0;
			}

			const indexOf = String.prototype.indexOf;
			const step    = needle.length;
			let pos     = Number(arguments[1]) || 0;
			let count   = 0;

			while ((pos = indexOf.call(this, needle, pos)) !== -1) {
				++count;
				pos += step;
			}

			return count;
		}
	});

	/*
		Returns the first Unicode code point from the string.
	*/
	Object.defineProperty(String.prototype, 'first', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.first called on null or undefined');
			}

			// Required as `this` could be a `String` object or come from a `call()` or `apply()`.
			const str = String(this);

			// Get the first code point—may be one or two code units—and its end position.
			const { char } = _getCodePointStartAndEnd(str, 0);

			return char;
		}
	});

	/*
		Returns the last Unicode code point from the string.
	*/
	Object.defineProperty(String.prototype, 'last', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.last called on null or undefined');
			}

			// Required as `this` could be a `String` object or come from a `call()` or `apply()`.
			const str = String(this);

			// Get the last code point—may be one or two code units—and its end position.
			const { char } = _getCodePointStartAndEnd(str, str.length - 1);

			return char;
		}
	});

	/*
		Returns a copy of the base string with `delCount` characters replaced with
		`replacement`, starting at `startAt`.
	*/
	Object.defineProperty(String.prototype, 'splice', {
		configurable : true,
		writable     : true,

		value(startAt, delCount, replacement) {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.splice called on null or undefined');
			}

			const length = this.length >>> 0;

			if (length === 0) {
				return '';
			}

			let start = Number(startAt);

			if (!Number.isSafeInteger(start)) {
				start = 0;
			}
			else if (start < 0) {
				start += length;

				if (start < 0) {
					start = 0;
				}
			}

			if (start > length) {
				start = length;
			}

			let count = Number(delCount);

			if (!Number.isSafeInteger(count) || count < 0) {
				count = 0;
			}

			let res = this.slice(0, start);

			if (typeof replacement !== 'undefined') {
				res += replacement;
			}

			if (start + count < length) {
				res += this.slice(start + count);
			}

			return res;
		}
	});

	/*
		Returns an array of strings, split from the string, or an empty array if the
		string is empty.
	*/
	Object.defineProperty(String.prototype, 'splitOrEmpty', {
		configurable : true,
		writable     : true,

		value(/* [ separator [, limit ]] */) {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.splitOrEmpty called on null or undefined');
			}

			// Required as `this` could be a `String` object or come from a `call()` or `apply()`.
			if (String(this) === '') {
				return [];
			}

			return String.prototype.split.apply(this, arguments);
		}
	});

	/*
		Returns a copy of the base string with the first Unicode code point uppercased,
		according to any locale-specific rules.
	*/
	Object.defineProperty(String.prototype, 'toLocaleUpperFirst', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.toLocaleUpperFirst called on null or undefined');
			}

			// Required as `this` could be a `String` object or come from a `call()` or `apply()`.
			const str = String(this);

			// Get the first code point—may be one or two code units—and its end position.
			const { char, end } = _getCodePointStartAndEnd(str, 0);

			return end === -1 ? '' : char.toLocaleUpperCase() + str.slice(end + 1);
		}
	});

	/*
		Returns a copy of the base string with the first Unicode code point uppercased.
	*/
	Object.defineProperty(String.prototype, 'toUpperFirst', {
		configurable : true,
		writable     : true,

		value() {
			if (this == null) { // lazy equality for null
				throw new TypeError('String.prototype.toUpperFirst called on null or undefined');
			}

			// Required as `this` could be a `String` object or come from a `call()` or `apply()`.
			const str = String(this);

			// Get the first code point—may be one or two code units—and its end position.
			const { char, end } = _getCodePointStartAndEnd(str, 0);

			return end === -1 ? '' : char.toUpperCase() + str.slice(end + 1);
		}
	});


	/*******************************************************************************
		Deprecated Extensions.
	*******************************************************************************/

	/*
		[DEPRECATED] Removes and returns all instances of the given elements from the array.
		*/
	Object.defineProperty(Array.prototype, 'delete', {
		configurable : true,
		writable     : true,

		value(/* needles */) {
			console.warn('[DEPRECATED] <Array>.delete() is deprecated.');

			if (this == null) { // lazy equality for null
				throw new TypeError('Array.prototype.delete called on null or undefined');
			}

			return Array.prototype.deleteAll.apply(this, arguments);
		}
	});

	/*
		[DEPRECATED] Allow users to easily wrap their code in the revive wrapper.
	*/
	Object.defineProperty(JSON, 'reviveWrapper', {
		configurable : true,
		writable     : true,

		value(code, data) {
			console.warn('[DEPRECATED] JSON.reviveWrapper() is deprecated.');

			if (typeof code !== 'string') {
				throw new TypeError('JSON.reviveWrapper code parameter must be a string');
			}

			return Serial.createReviver(code, data);
		}
	});

	/*
		[DEPRECATED] Returns a decimal number eased from 0 to 1.

		NOTE: The magnitude of the returned value decreases if num < 0.5 or increases if num > 0.5.
	*/
	Object.defineProperty(Math, 'easeInOut', {
		configurable : true,
		writable     : true,

		value(num) {
			console.warn('[DEPRECATED] Math.easeInOut() is deprecated.');

			return 1 - (Math.cos(Number(num) * Math.PI) + 1) / 2;
		}
	});

	/*
		[DEPRECATED] Returns the number clamped to the specified bounds.
	*/
	Object.defineProperty(Number.prototype, 'clamp', {
		configurable : true,
		writable     : true,

		value(/* min, max */) {
			console.warn('[DEPRECATED] <Number>.clamp() is deprecated.');

			if (this == null) { // lazy equality for null
				throw new TypeError('Number.prototype.clamp called on null or undefined');
			}

			if (arguments.length !== 2) {
				throw new Error(`Number.prototype.clamp called with an incorrect number of parameters (want: 2, received: ${arguments.length})`);
			}

			return Math.clamp(this, arguments[0], arguments[1]);
		}
	});
})();
