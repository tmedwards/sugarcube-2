/***********************************************************************************************************************

	lib/util.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Has, Scripting */

var Util = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		Type Functions.
	*******************************************************************************************************************/
	/*
		Returns the value yielded by `typeof` (for primitives), the `@@toStringTag`
		internal property (for objects), and `'null'` for `null`.

		NOTE: In ≤ES5, returns the value of the `[[Class]]` internal slot for objects.
	*/
	const utilGetType = (() => {
		// Cache the `<Object>.toString()` method.
		const toString = Object.prototype.toString;

		// If the browser is using the `Map()` and `Set()` polyfills, then return
		// a version of `utilGetType()` that contains special cases for them, since
		// they do not have a `[[Class]]` internal slot and the `@@toStringTag`
		// internal property is unavailable to them.
		if (toString.call(new Map()) === '[object Object]') {
			return function utilGetType(O) {
				if (O === null) { return 'null'; }

				// Special cases for the `Map` and `Set` polyfills.
				//
				// NOTE: We don't special case the `WeakMap` and `WeakSet` polyfills
				// here since they're (a) unlikely to be used and (b) broken anyway.
				if (O instanceof Map) { return 'Map'; }
				if (O instanceof Set) { return 'Set'; }

				const baseType = typeof O;
				return baseType === 'object' ? toString.call(O).slice(8, -1) : baseType;
			};
		}

		// Elsewise, return the regular `utilGetType()` function.
		return function utilGetType(O) {
			if (O === null) { return 'null'; }

			const baseType = typeof O;
			return baseType === 'object' ? toString.call(O).slice(8, -1) : baseType;
		};
	})();

	/*
		Returns whether the passed value is a boolean or one of the strings "true"
		or "false".
	*/
	function utilIsBoolean(obj) {
		return typeof obj === 'boolean' || typeof obj === 'string' && (obj === 'true' || obj === 'false');
	}

	/*
		Returns whether the passed value is iterable.
	*/
	function utilIsIterable(obj) {
		return obj != null && typeof obj[Symbol.iterator] === 'function'; // lazy equality for null
	}

	/*
		Returns whether the passed value is a finite number or a numeric string which
		yields a finite number when parsed.
	*/
	function utilIsNumeric(obj) {
		let num;

		switch (typeof obj) {
		case 'number':
			num = obj;
			break;

		case 'string':
			num = Number(obj);
			break;

		default:
			return false;
		}

		return !Number.isNaN(num) && Number.isFinite(num);
	}

	/*
		Returns whether the passed values pass a SameValueZero comparison.

		SEE: http://ecma-international.org/ecma-262/8.0/#sec-samevaluezero
	*/
	function utilSameValueZero(a, b) {
		/*
			NOTE: This comparison could also be implemented thus:

				```
				a === b ||
				typeof a === 'number' && typeof b === 'number' &&
				Number.isNaN(a) && Number.isNaN(b)
				```

			That's needlessly verbose, however, as `NaN` is the only value in
			the language which is not reflexive.
		*/
		return a === b || a !== a && b !== b;
	}

	/*
		Returns a pseudo-enumeration created from the given Array, Map, Set, or generic object.
	*/
	function utilToEnum(obj) {
		const pEnum = Object.create(null);

		if (obj instanceof Array) {
			obj.forEach((val, i) => pEnum[String(val)] = i);
		}
		else if (obj instanceof Set) {
			// NOTE: Use `<Array>.forEach()` here rather than `<Set>.forEach()`
			// as the latter does not provide the indices we require.
			Array.from(obj).forEach((val, i) => pEnum[String(val)] = i);
		}
		else if (obj instanceof Map) {
			obj.forEach((val, key) => pEnum[String(key)] = val);
		}
		else if (
			   typeof obj === 'object'
			&& obj !== null
			&& Object.getPrototypeOf(obj) === Object.prototype
		) {
			Object.assign(pEnum, obj);
		}
		else {
			throw new TypeError('Util.toEnum obj parameter must be an Array, Map, Set, or generic object');
		}

		return Object.freeze(pEnum);
	}

	/*
		Returns the value of the `@@toStringTag` property of the given object.

		NOTE: In ≤ES5, returns the value of the `[[Class]]` internal slot.
	*/
	function utilToStringTag(obj) {
		return Object.prototype.toString.call(obj).slice(8, -1);
	}


	/*******************************************************************************************************************
		String Encoding Functions.
	*******************************************************************************************************************/
	/*
		Returns a trimmed and encoded slug of the passed string that should be safe
		for use as a DOM ID or class name.

		NOTE: The range of illegal characters consists of: C0 controls, space, exclamation,
		double quote, number, dollar, percent, ampersand, single quote, left paren, right
		paren, asterisk, plus, comma, hyphen, period, forward slash, colon, semi-colon,
		less-than, equals, greater-than, question, at, left bracket, backslash, right
		bracket, caret, backquote/grave, left brace, pipe/vertical-bar, right brace, tilde,
		delete, C1 controls.
	*/
	const _illegalSlugCharsRe = /[\x00-\x20!-/:-@[-^`{-\x9f]+/g; // eslint-disable-line no-control-regex
	/* legacy */
	const _isInvalidSlugRe = /^-*$/; // Matches the empty string or one comprised solely of hyphens.
	/* /legacy */

	function utilSlugify(str) {
		const base = String(str).trim();

		/* legacy */
		const _legacy = base
			.replace(/[^\w\s\u2013\u2014-]+/g, '')
			.replace(/[_\s\u2013\u2014-]+/g, '-')
			.toLocaleLowerCase();

		if (!_isInvalidSlugRe.test(_legacy)) {
			return _legacy;
		}
		/* /legacy */

		return base
			.replace(_illegalSlugCharsRe, '')
			.replace(/[_\s\u2013\u2014-]+/g, '-');

		// For v3.
		// return base.replace(_illegalSlugCharsRe, '-');
	}

	/*
		Returns an entity encoded version of the passed string.

		NOTE: Escapes the five primary HTML special characters, the backquote,
		and SugarCube markup metacharacters.
	*/
	const _markupCharsRe    = /[!"#$&'*\-/<=>?@[\\\]^_`{|}~]/g;
	const _hasMarkupCharsRe = new RegExp(_markupCharsRe.source); // to drop the global flag
	const _markupCharsMap   = utilToEnum({
		/* eslint-disable quote-props */
		'!'  : '&#33;',
		'"'  : '&quot;',
		'#'  : '&#35;',
		'$'  : '&#36;',
		'&'  : '&amp;',
		"'"  : '&#39;',
		'*'  : '&#42;',
		'-'  : '&#45;',
		'/'  : '&#47;',
		'<'  : '&lt;',
		'='  : '&#61;',
		'>'  : '&gt;',
		'?'  : '&#63;',
		'@'  : '&#64;',
		'['  : '&#91;',
		'\\' : '&#92;',
		']'  : '&#93;',
		'^'  : '&#94;',
		'_'  : '&#95;',
		'`'  : '&#96;',
		'{'  : '&#123;',
		'|'  : '&#124;',
		'}'  : '&#125;',
		'~'  : '&#126;'
		/* eslint-enable quote-props */
	});

	function utilEscapeMarkup(str) {
		if (str == null) { // lazy equality for null
			return '';
		}

		const val = String(str);
		return val && _hasMarkupCharsRe.test(val)
			? val.replace(_markupCharsRe, ch => _markupCharsMap[ch])
			: val;
	}

	/*
		Returns an entity encoded version of the passed string.

		NOTE: Only escapes the five primary special characters and the backquote.
	*/
	const _htmlCharsRe    = /[&<>"'`]/g;
	const _hasHtmlCharsRe = new RegExp(_htmlCharsRe.source); // to drop the global flag
	const _htmlCharsMap   = utilToEnum({
		'&' : '&amp;',
		'<' : '&lt;',
		'>' : '&gt;',
		'"' : '&quot;',
		"'" : '&#39;',
		'`' : '&#96;'
	});

	function utilEscape(str) {
		if (str == null) { // lazy equality for null
			return '';
		}

		const val = String(str);
		return val && _hasHtmlCharsRe.test(val)
			? val.replace(_htmlCharsRe, ch => _htmlCharsMap[ch])
			: val;
	}

	/*
		Returns a decoded version of the passed entity encoded string.

		NOTE: The extended replacement set here, in contrast to `utilEscape()`,
		is required due to observed stupidity from various sources.
	*/
	const _escapedHtmlRe    = /&(?:amp|#38|#x26|lt|#60|#x3c|gt|#62|#x3e|quot|#34|#x22|apos|#39|#x27|#96|#x60);/gi;
	const _hasEscapedHtmlRe = new RegExp(_escapedHtmlRe.source, 'i'); // to drop the global flag
	const _escapedHtmlMap   = utilToEnum({
		'&amp;'  : '&', // ampersand (HTML character entity, XML predefined entity)
		'&#38;'  : '&', // ampersand (decimal numeric character reference)
		'&#x26;' : '&', // ampersand (hexadecimal numeric character reference)
		'&lt;'   : '<', // less-than (HTML character entity, XML predefined entity)
		'&#60;'  : '<', // less-than (decimal numeric character reference)
		'&#x3c;' : '<', // less-than (hexadecimal numeric character reference)
		'&gt;'   : '>', // greater-than (HTML character entity, XML predefined entity)
		'&#62;'  : '>', // greater-than (decimal numeric character reference)
		'&#x3e;' : '>', // greater-than (hexadecimal numeric character reference)
		'&quot;' : '"', // double quote (HTML character entity, XML predefined entity)
		'&#34;'  : '"', // double quote (decimal numeric character reference)
		'&#x22;' : '"', // double quote (hexadecimal numeric character reference)
		'&apos;' : "'", // apostrophe (XML predefined entity)
		'&#39;'  : "'", // apostrophe (decimal numeric character reference)
		'&#x27;' : "'", // apostrophe (hexadecimal numeric character reference)
		'&#96;'  : '`', // backquote (decimal numeric character reference)
		'&#x60;' : '`'  // backquote (hexadecimal numeric character reference)
	});

	function utilUnescape(str) {
		if (str == null) { // lazy equality for null
			return '';
		}

		const val = String(str);
		return val && _hasEscapedHtmlRe.test(val)
			? val.replace(_escapedHtmlRe, entity => _escapedHtmlMap[entity.toLowerCase()])
			: val;
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

		NOTE: Returns the individual code units of invalid surrogate pairs as-is.

		IDEA: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
	*/
	function utilCharAndPosAt(text, position) {
		const str  = String(text);
		const pos  = Math.trunc(position);
		const code = str.charCodeAt(pos);

		// Given position was out-of-bounds.
		if (Number.isNaN(code)) {
			return { char : '', start : -1, end : -1 };
		}

		const retval = {
			char  : str.charAt(pos),
			start : pos,
			end   : pos
		};

		// Code unit is not a UTF-16 surrogate.
		if (code < 0xD800 || code > 0xDFFF) {
			return retval;
		}

		// Code unit is a high surrogate (D800–DBFF).
		if (code >= 0xD800 && code <= 0xDBFF) {
			const nextPos = pos + 1;

			// End of string.
			if (nextPos >= str.length) {
				return retval;
			}

			const nextCode = str.charCodeAt(nextPos);

			// Next code unit is not a low surrogate (DC00–DFFF).
			if (nextCode < 0xDC00 || nextCode > 0xDFFF) {
				return retval;
			}

			retval.char = retval.char + str.charAt(nextPos);
			retval.end = nextPos;
			return retval;
		}

		// Code unit is a low surrogate (DC00–DFFF) in the first position.
		if (pos === 0) {
			return retval;
		}

		const prevPos  = pos - 1;
		const prevCode = str.charCodeAt(prevPos);

		// Previous code unit is not a high surrogate (D800–DBFF).
		if (prevCode < 0xD800 || prevCode > 0xDBFF) {
			return retval;
		}

		retval.char = str.charAt(prevPos) + retval.char;
		retval.start = prevPos;
		return retval;
	}


	/*******************************************************************************************************************
		Time Functions.
	*******************************************************************************************************************/
	/*
		Returns the number of milliseconds elapsed since a reference epoch.

		NOTE: Use the Performance API, if available, elsewise use Date as a
		failover.  The Performance API is preferred for its monotonic clock—
		meaning, it's not subject to the vagaries of timezone changes and leap
		periods, as is Date.
	*/
	const _nowSource = Has.performance ? performance : Date;

	function utilNow() {
		return _nowSource.now();
	}


	/*******************************************************************************************************************
		Conversion Functions.
	*******************************************************************************************************************/
	/*
		Returns the number of miliseconds represented by the passed CSS time string.
	*/
	const _cssTimeRe = /^([+-]?(?:\d*\.)?\d+)([Mm]?[Ss])$/;

	function utilFromCssTime(cssTime) {
		const match = _cssTimeRe.exec(String(cssTime));

		if (match === null) {
			throw new SyntaxError(`invalid time value syntax: "${cssTime}"`);
		}

		let msec = Number(match[1]);

		if (match[2].length === 1) {
			msec *= 1000;
		}

		if (Number.isNaN(msec) || !Number.isFinite(msec)) {
			throw new RangeError(`invalid time value: "${cssTime}"`);
		}

		return msec;
	}

	/*
		Returns the CSS time string represented by the passed number of milliseconds.
	*/
	function utilToCssTime(msec) {
		if (typeof msec !== 'number' || Number.isNaN(msec) || !Number.isFinite(msec)) {
			let what;

			switch (typeof msec) {
			case 'string':
				what = `"${msec}"`;
				break;

			case 'number':
				what = String(msec);
				break;

			default:
				what = utilToStringTag(msec);
				break;
			}

			throw new Error(`invalid milliseconds: ${what}`);
		}

		return `${msec}ms`;
	}

	/*
		Returns the DOM property name represented by the passed CSS property name.
	*/
	function utilFromCssProperty(cssName) {
		if (!cssName.includes('-')) {
			switch (cssName) {
			case 'bgcolor': return 'backgroundColor';
			case 'float':   return 'cssFloat';
			default:        return cssName;
			}
		}

		// Strip the leading hyphen from the `-ms-` vendor prefix, so it stays lowercased.
		const normalized = cssName.slice(0, 4) === '-ms-' ? cssName.slice(1) : cssName;

		return normalized
			.split('-')
			.map((part, i) => i === 0 ? part : part.toUpperFirst())
			.join('');
	}

	/*
		Returns an object containing the component properties parsed from the passed URL.
	*/
	function utilParseUrl(url) {
		const el       = document.createElement('a');
		const queryObj = Object.create(null);

		// Let the `<a>` element parse the URL.
		el.href = url;

		// Populate the `queryObj` object with the query string attributes.
		if (el.search) {
			el.search
				.replace(/^\?/, '')
				.splitOrEmpty(/(?:&(?:amp;)?|;)/)
				.forEach(query => {
					const [key, value] = query.split('=');
					queryObj[key] = value;
				});
		}

		/*
			Caveats by browser:
				Edge and Internet Explorer (≥8) do not support authentication
				information within a URL at all and will throw a security exception
				on *any* property access if it's included.

				Internet Explorer does not include the leading forward slash on
				`pathname` when required.

				Opera (Presto) strips the authentication information from `href`
				and does not supply `username` or `password`.

				Safari (ca. v5.1.x) does not supply `username` or `password` and
				peforms URI decoding on `pathname`.
		*/

		// Patch for IE not including the leading slash on `pathname` when required.
		const pathname = el.host && el.pathname[0] !== '/' ? `/${el.pathname}` : el.pathname;

		return {
			// The full URL that was originally parsed.
			href : el.href,

			// The request protocol, lowercased.
			protocol : el.protocol,

			// // The full authentication information.
			// auth : el.username || el.password // eslint-disable-line no-nested-ternary
			// 	? `${el.username}:${el.password}`
			// 	: typeof el.username === 'string' ? '' : undefined,
			//
			// // The username portion of the auth info.
			// username : el.username,
			//
			// // The password portion of the auth info.
			// password : el.password,

			// The full host information, including port number, lowercased.
			host : el.host,

			// The hostname portion of the host info, lowercased.
			hostname : el.hostname,

			// The port number portion of the host info.
			port : el.port,

			// The full path information, including query info.
			path : `${pathname}${el.search}`,

			// The pathname portion of the path info.
			pathname,

			// The query string portion of the path info, including the leading question mark.
			query  : el.search,
			search : el.search,

			// The attributes portion of the query string, parsed into an object.
			queries  : queryObj,
			searches : queryObj,

			// The fragment string, including the leading hash/pound sign.
			hash : el.hash
		};
	}

	/*
		Returns a new exception based on the given exception.

		NOTE: Mostly useful for making a standard JavaScript exception type copy
		of a host exception type—e.g. `DOMException` → `Error`.
	*/
	function utilNewExceptionFrom(original, exceptionType, override) {
		if (typeof original !== 'object' || original === null) {
			throw new Error('Util.newExceptionFrom original parameter must be an object');
		}
		if (typeof exceptionType !== 'function') {
			throw new Error('Util.newExceptionFrom exceptionType parameter must be an error type constructor');
		}

		const ex = new exceptionType(original.message); // eslint-disable-line new-cap

		if (typeof original.name !== 'undefined') {
			ex.name = original.name;
		}
		if (typeof original.code !== 'undefined') {
			ex.code = original.code;
		}
		if (typeof original.columnNumber !== 'undefined') {
			ex.columnNumber = original.columnNumber;
		}
		if (typeof original.description !== 'undefined') {
			ex.description = original.description;
		}
		if (typeof original.fileName !== 'undefined') {
			ex.fileName = original.fileName;
		}
		if (typeof original.lineNumber !== 'undefined') {
			ex.lineNumber = original.lineNumber;
		}
		if (typeof original.number !== 'undefined') {
			ex.number = original.number;
		}
		if (typeof original.stack !== 'undefined') {
			ex.stack = original.stack;
		}

		const overrideType = typeof override;

		if (overrideType !== 'undefined') {
			if (overrideType === 'object' && override !== null) {
				Object.assign(ex, override);
			}
			else if (overrideType === 'string') {
				ex.message = override;
			}
			else {
				throw new Error('Util.newExceptionFrom override parameter must be an object or string');
			}
		}

		return ex;
	}

	/*
		Returns a sanitized version of the passed `KeyboardEvent.key` value from
		previous incarnations of the specification that should better reflect the
		current incarnation.
	*/
	const utilScrubEventKey = (() => {
		let separatorKey;
		let decimalKey;

		// Attempt to determine the player's 'Separator' and 'Decimal' key values
		// based on their current locale.
		if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function') {
			const match = new Intl.NumberFormat().format(111111.5).match(/(\D*)\d+(\D*)/);

			if (match) {
				separatorKey = match[1];
				decimalKey   = match[2];
			}
		}

		// Failover to US-centric values, if using `Intl.NumberFormat` failed.
		if (!separatorKey && !decimalKey) {
			separatorKey = ',';
			decimalKey   = '.';
		}

		// Maps older `KeyboardEvent.key` values to more current/correct ones.
		function utilScrubEventKey(key) {
			switch (key) {
			// case 'OS':                 return 'Meta'; // Unreliable.
			case 'Scroll':             return 'ScrollLock';
			case 'Spacebar':           return '\x20';
			case 'Left':               return 'ArrowLeft';
			case 'Right':              return 'ArrowRight';
			case 'Up':                 return 'ArrowUp';
			case 'Down':               return 'ArrowDown';
			case 'Del':                return 'Delete';
			case 'Crsel':              return 'CrSel';
			case 'Exsel':              return 'ExSel';
			case 'Esc':                return 'Escape';
			case 'Apps':               return 'ContextMenu';
			case 'Nonconvert':         return 'NonConvert';
			case 'MediaNextTrack':     return 'MediaTrackNext';
			case 'MediaPreviousTrack': return 'MediaTrackPrevious';
			case 'VolumeUp':           return 'AudioVolumeUp';
			case 'VolumeDown':         return 'AudioVolumeDown';
			case 'VolumeMute':         return 'AudioVolumeMute';
			case 'Zoom':               return 'ZoomToggle';
			case 'SelectMedia':        /* see below */
			case 'MediaSelect':        return 'LaunchMediaPlayer';
			case 'Add':                return '+';
			case 'Divide':             return '/';
			case 'Multiply':           return '*';
			case 'Subtract':           return '-';
			case 'Decimal':            return decimalKey;
			case 'Separator':          return separatorKey;
			}

			return key;
		}

		return utilScrubEventKey;
	})();


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		/*
			Type Functions.
		*/
		getType       : { value : utilGetType },
		isBoolean     : { value : utilIsBoolean },
		isIterable    : { value : utilIsIterable },
		isNumeric     : { value : utilIsNumeric },
		sameValueZero : { value : utilSameValueZero },
		toEnum        : { value : utilToEnum },
		toStringTag   : { value : utilToStringTag },

		/*
			String Encoding Functions.
		*/
		slugify      : { value : utilSlugify },
		escapeMarkup : { value : utilEscapeMarkup },
		escape       : { value : utilEscape },
		unescape     : { value : utilUnescape },
		charAndPosAt : { value : utilCharAndPosAt },

		/*
			Time Functions.
		*/
		now : { value : utilNow },

		/*
			Conversion Functions.
		*/
		fromCssTime      : { value : utilFromCssTime },
		toCssTime        : { value : utilToCssTime },
		fromCssProperty  : { value : utilFromCssProperty },
		parseUrl         : { value : utilParseUrl },
		newExceptionFrom : { value : utilNewExceptionFrom },
		scrubEventKey    : { value : utilScrubEventKey },

		/*
			Legacy Aliases.
		*/
		random         : { value : Math.random },
		entityEncode   : { value : utilEscape },
		entityDecode   : { value : utilUnescape },
		evalExpression : { value : (...args) => Scripting.evalJavaScript(...args) }, // SEE: `markup/scripting.js`.
		evalStatements : { value : (...args) => Scripting.evalJavaScript(...args) }  // SEE: `markup/scripting.js`.
	}));
})();
