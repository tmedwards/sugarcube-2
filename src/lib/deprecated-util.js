/***********************************************************************************************************************

	lib/deprecated-util.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Scripting, charAndPosAt, encodeEntities, encodeMarkup, cssPropToDOMProp, cssTimeToMS, getTypeOf,
	       hasMediaQuery, exceptionFrom, now, parseURL, sameValueZero, createFilename, scrubEventKey, createSlug,
	       msToCSSTime, enumFrom, getToStringTag, decodeEntities, decodeEntities, encodeEntities
*/

/*
	Legacy `Util` Exports.
*/
var Util = Object.preventExtensions(Object.create(null, { // eslint-disable-line no-unused-vars, no-var
	charAndPosAt     : { value : charAndPosAt },
	escape           : { value : encodeEntities },
	escapeMarkup     : { value : encodeMarkup },
	fromCssProperty  : { value : cssPropToDOMProp },
	fromCssTime      : { value : cssTimeToMS },
	getType          : { value : getTypeOf },
	hasMediaQuery    : { value : hasMediaQuery },
	newExceptionFrom : { value : exceptionFrom },
	now              : { value : now },
	parseUrl         : { value : parseURL },
	sameValueZero    : { value : sameValueZero },
	sanitizeFilename : { value : createFilename },
	scrubEventKey    : { value : scrubEventKey },
	slugify          : { value : createSlug },
	toCssTime        : { value : msToCSSTime },
	toEnum           : { value : enumFrom },
	toStringTag      : { value : getToStringTag },
	unescape         : { value : decodeEntities },

	// Ancient legacy.
	entityDecode   : { value : decodeEntities },
	entityEncode   : { value : encodeEntities },
	evalExpression : { value : Scripting.evalJavaScript }, // SEE: `markup/scripting.js`.
	evalStatements : { value : Scripting.evalJavaScript }, // SEE: `markup/scripting.js`.
	random         : { value : Math.random }
}));
