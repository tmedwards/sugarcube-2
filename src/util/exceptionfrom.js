/***********************************************************************************************************************

	util/exceptionfrom.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns a new exception based on the given exception.

	NOTE: Most useful for making native ECMAScript `…Error` instance copies
	of host exception instances—e.g., `DOMException` → `Error`.
*/
var exceptionFrom = (() => { // eslint-disable-line no-unused-vars, no-var
	const extraProps = Object.freeze([
		// Baseline `DOMException` properties.
		'code',
		// Firefox `DOMException` extension properties.
		'data',
		'result',
		// Common `…Error` extension properties.
		'stack',
		// Firefox `…Error` extension properties.
		'columnNumber',
		'fileName',
		'lineNumber',
		// Microsoft `…Error` properties.
		'description',
		'number'
	]);

	function exceptionFrom(original, exceptionType, override) {
		if (original === null || typeof original !== 'object') {
			throw new Error('exceptionFrom original parameter must be an object');
		}
		if (typeof exceptionType !== 'function') {
			throw new Error('exceptionFrom exceptionType parameter must be an error type constructor');
		}

		const overrideType = typeof override;

		if (overrideType !== 'undefined' && overrideType !== 'string' && overrideType !== 'object') {
			throw new Error('exceptionFrom override parameter must be an object or string');
		}

		// Gather property values for copying.
		const propValues = new Map();
		extraProps.forEach(name => {
			if (typeof original[name] !== 'undefined') {
				propValues.set(name, original[name]);
			}
		});

		if (overrideType === 'string') {
			propValues.set('message', override);
		}
		else if (overrideType === 'object' && override !== null) {
			Object.getOwnPropertyNames(override).forEach(name => {
				if (typeof override[name] !== 'undefined') {
					propValues.set(name, override[name]);
				}
			});
		}

		// Create the new exception and copy the property values to it.
		const ex = new exceptionType(propValues.get('message')); // eslint-disable-line new-cap
		propValues.delete('message');
		propValues.forEach((value, name) => {
			if (typeof ex[name] === 'undefined') {
				Object.defineProperty(ex, name, {
					value,
					configurable : true,
					writable     : true
				});
			}
			else {
				ex[name] = value;
			}
		});

		return ex;
	}

	return exceptionFrom;
})();
