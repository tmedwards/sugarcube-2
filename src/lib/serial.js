/***********************************************************************************************************************

	lib/serial.js

	Copyright © 2018–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Serial API static object.
*/
var Serial = (() => { // eslint-disable-line no-unused-vars, no-var
	// Supported type collection.
	const supportedTypes = Object.freeze([
		{
			id : 'Date',
			get reference() { return Date.prototype; },
			method() {
				return ['(revive:date)', this.toISOString()];
			}
		},
		{
			// TODO: Deprecate this!
			id : 'Function',
			get reference() { return Function.prototype; },
			method() {
				// The enclosing parenthesis here are necessary to force the function expression code
				// string, returned by `this.toString()`, to be evaluated as an expression during
				// revival.  Without them, the function expression, which may be nameless, will be
				// evaluated as a function definition—which will throw a syntax error exception, since
				// function definitions must have a name.
				return ['(revive:)', [`(${this.toString()})`]];
			}
		},
		{
			id : 'Map',
			get reference() { return Map.prototype; },
			method() {
				return ['(revive:map)', Array.from(this)];
			}
		},
		{
			id : 'RegExp',
			get reference() { return RegExp.prototype; },
			method() {
				return ['(revive:)', [this.toString()]];
			}
		},
		{
			id : 'Set',
			get reference() { return Set.prototype; },
			method() {
				return ['(revive:set)', Array.from(this)];
			}
		}
	]);


	/*******************************************************************************
		API Functions.
	*******************************************************************************/

	// Allow users to easily prepare their class code for revival.
	function createReviver(code, data) {
		if (typeof code !== 'string') {
			throw new TypeError('Serial.createReviver code parameter must be a string');
		}

		return ['(revive:)', [code, data]];
	}

	function parse(text, reviver) {
		return JSON.parse(text, (key, val) => {
			let value = val;

			// Attempt to revive wrapped values.
			if (value instanceof Array && value.length === 2) {
				switch (value[0]) {
					case '(revive:set)':
						value = new Set(value[1]);
						break;

					case '(revive:map)':
						value = new Map(value[1]);
						break;

					case '(revive:date)':
						value = new Date(value[1]);
						break;

					case '(revive:eval)': /* legacy */
					case '(revive:)': {
						try {
							const $ReviveData$ = value[1][1]; // eslint-disable-line no-unused-vars
							value = eval(value[1][0]); // eslint-disable-line no-eval
						}
						catch (ex) { /* no-op; though, perhaps we should handle this somehow */ }

						break;
					}
				}
			}

			// Call the custom reviver, if specified.
			if (typeof reviver === 'function') {
				try {
					value = reviver(key, value);
				}
				catch (ex) { /* no-op; though, perhaps we should handle this somehow */ }
			}

			return value;
		});
	}

	function stringify(value, replacer, space) {
		const origMethodCache = new Map();

		// Attach our `toJSON` methods to the supported types, caching existent
		// methods for later restoration.
		supportedTypes.forEach(({ id, reference, method }) => {
			if (Object.hasOwn(reference, 'toJSON')) {
				origMethodCache.set(id, reference.toJSON);
			}

			Object.defineProperty(reference, 'toJSON', {
				configurable : true,
				writable     : true,
				value        : method
			});
		});

		const notation = JSON.stringify(value, (key, val) => {
			let value = val;

			// Call the custom replacer, if specified.
			if (typeof replacer === 'function') {
				try {
					value = replacer(key, value);
				}
				catch (ex) { /* no-op; though, perhaps we should handle this somehow */ }
			}

			// Handle supported primitive values unsupported by JSON.
			switch (value) {
				case undefined:
					value = ['(revive:)', ['undefined']];
					break;

				case Infinity:
					value = ['(revive:)', ['Infinity']];
					break;
			}

			return value;
		}, space);

		// Restore supported types to their original state.
		supportedTypes.forEach(({ id, reference }) => {
			if (origMethodCache.has(id)) {
				Object.defineProperty(reference, 'toJSON', {
					configurable : true,
					writable     : true,
					value        : origMethodCache.get(id)
				});
				origMethodCache.delete(id);
			}
			else {
				delete reference.toJSON; // eslint-disable-line no-param-reassign
			}
		});

		return notation;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		createReviver : { value : createReviver },
		parse         : { value : parse },
		stringify     : { value : stringify }
	}));
})();
