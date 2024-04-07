/***********************************************************************************************************************

	util/stringfrom.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns the simple string representation of the given value or, if there is
	none, a square bracketed representation.
*/
function stringFrom(value) { // eslint-disable-line no-unused-vars
	switch (typeof value) {
		case 'function':
			return '[function]';

		case 'number': {
			if (Number.isNaN(value)) {
				return '[number NaN]';
			}

			break;
		}

		case 'object': {
			if (value === null) {
				return '[null]';
			}
			else if (value instanceof Array) {
				return value.map(val => stringFrom(val)).join(', ');
			}
			else if (value instanceof Set) {
				return Array.from(value).map(val => stringFrom(val)).join(', ');
			}
			else if (value instanceof Map) {
				const result = Array.from(value).map(([key, val]) => `${stringFrom(key)} \u2192 ${stringFrom(val)}`);
				return `{\u202F${result.join(', ')}\u202F}`;
			}
			else if (value instanceof Date) {
				return value.toLocaleString();
			}
			else if (value instanceof Element) {
				if (
					value === document.documentElement
					|| value === document.head
					|| value === document.body
				) {
					throw new Error('illegal operation; attempting to convert the <html>, <head>, or <body> tags to string is not allowed');
				}

				return value.outerHTML;
			}
			else if (value instanceof Node) {
				return value.textContent;
			}

			// Defer to `.[@@toPrimitive]('string')` or `.toString()`.
			break;
		}

		case 'symbol': {
			const desc = typeof value.description !== 'undefined' ? ` "${value.description}"` : '';
			return `[symbol${desc}]`;
		}

		case 'undefined':
			return '[undefined]';
	}

	return String(value);
}
