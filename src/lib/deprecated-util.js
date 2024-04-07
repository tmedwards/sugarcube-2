/***********************************************************************************************************************

	lib/deprecated-util.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global charAndPosAt, encodeEntities, encodeMarkup, cssPropToDOMProp, cssTimeToMS, getTypeOf, hasMediaQuery,
	       exceptionFrom, now, parseURL, sameValueZero, createFilename, scrubEventKey, createSlug, msToCSSTime,
	       enumFrom, getToStringTag, decodeEntities, decodeEntities, encodeEntities
*/

/*
	Legacy `Util` Exports.
*/
var Util = Object.preventExtensions(Object.create(null, { // eslint-disable-line no-unused-vars, no-var
	charAndPosAt : {
		value(...args) {
			console.warn('[DEPRECATED] Util.charAndPosAt() is deprecated.');
			return charAndPosAt(...args);
		}
	},
	escape : {
		value(...args) {
			console.warn('[DEPRECATED] Util.escape() is deprecated.');
			return encodeEntities(...args);
		}
	},
	escapeMarkup : {
		value(...args) {
			console.warn('[DEPRECATED] Util.escapeMarkup() is deprecated.');
			return encodeMarkup(...args);
		}
	},
	fromCssProperty : {
		value(...args) {
			console.warn('[DEPRECATED] Util.fromCssProperty() is deprecated.');
			return cssPropToDOMProp(...args);
		}
	},
	fromCssTime : {
		value(...args) {
			console.warn('[DEPRECATED] Util.fromCssTime() is deprecated.');
			return cssTimeToMS(...args);
		}
	},
	getType : {
		value(...args) {
			console.warn('[DEPRECATED] Util.getType() is deprecated.');
			return getTypeOf(...args);
		}
	},
	hasMediaQuery : {
		value(...args) {
			console.warn('[DEPRECATED] Util.hasMediaQuery() is deprecated.');
			return hasMediaQuery(...args);
		}
	},
	newExceptionFrom : {
		value(...args) {
			console.warn('[DEPRECATED] Util.newExceptionFrom() is deprecated.');
			return exceptionFrom(...args);
		}
	},
	now : {
		value(...args) {
			console.warn('[DEPRECATED] Util.now() is deprecated.');
			return now(...args);
		}
	},
	parseUrl : {
		value(...args) {
			console.warn('[DEPRECATED] Util.parseUrl() is deprecated.');
			return parseURL(...args);
		}
	},
	sameValueZero : {
		value(...args) {
			console.warn('[DEPRECATED] Util.sameValueZero() is deprecated.');
			return sameValueZero(...args);
		}
	},
	sanitizeFilename : {
		value(...args) {
			console.warn('[DEPRECATED] Util.sanitizeFilename() is deprecated.');
			return createFilename(...args);
		}
	},
	scrubEventKey : {
		value(...args) {
			console.warn('[DEPRECATED] Util.scrubEventKey() is deprecated.');
			return scrubEventKey(...args);
		}
	},
	slugify : {
		value(...args) {
			console.warn('[DEPRECATED] Util.slugify() is deprecated.');
			return createSlug(...args);
		}
	},
	toCssTime : {
		value(...args) {
			console.warn('[DEPRECATED] Util.toCssTime() is deprecated.');
			return msToCSSTime(...args);
		}
	},
	toEnum : {
		value(...args) {
			console.warn('[DEPRECATED] Util.toEnum() is deprecated.');
			return enumFrom(...args);
		}
	},
	toStringTag : {
		value(...args) {
			console.warn('[DEPRECATED] Util.toStringTag() is deprecated.');
			return getToStringTag(...args);
		}
	},
	unescape : {
		value(...args) {
			console.warn('[DEPRECATED] Util.unescape() is deprecated.');
			return decodeEntities(...args);
		}
	}
}));
