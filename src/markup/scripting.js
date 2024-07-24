/***********************************************************************************************************************

	markup/scripting.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, Patterns, State, Story, enumFrom, getTypeOf, now, parseURL, stringFrom */

var Scripting = (() => { // eslint-disable-line no-unused-vars, no-var
	/* eslint-disable no-unused-vars */

	/*******************************************************************************
		Deprecated Legacy Functions.
	*******************************************************************************/

	/*
		[DEPRECATED] Returns the simple string representation of the passed value or,
		if there is none, the passed default value.

		NOTE: Unused, included only for compatibility.
	*/
	function toStringOrDefault(value /* , defValue */) {
		console.warn('[DEPRECATED] toStringOrDefault() is deprecated.');

		return stringFrom(value);
	}


	/*******************************************************************************
		User Functions.
	*******************************************************************************/

	/*
		Returns a random value from its given arguments.
	*/
	function either(/* variadic */) {
		if (arguments.length === 0) {
			return;
		}

		return Array.prototype.concat.apply([], arguments).random();
	}

	/*
		Removes the given key, and its value, from the story metadata store.
	*/
	function forget(key) {
		if (typeof key !== 'string') {
			throw new TypeError(`forget key parameter must be a string (received: ${getTypeOf(key)})`);
		}

		State.metadata.delete(key);
	}

	/*
		Returns whether a passage with the given title exists within the story
		history.  If multiple passage titles are given, returns the logical-AND
		aggregate of the set.
	*/
	function hasVisited(/* variadic */) {
		if (arguments.length === 0) {
			throw new Error('hasVisited called with insufficient parameters');
		}

		if (State.isEmpty()) {
			return false;
		}

		const needles = Array.prototype.concat.apply([], arguments);
		const played  = State.passages;

		for (let i = 0; i < needles.length; ++i) {
			if (!played.includes(needles[i])) {
				return false;
			}
		}

		return true;
	}

	/*
		Returns the number of turns that have passed since the last instance of the given passage
		occurred within the story history or `-1` if it does not exist.  If multiple passages are
		given, returns the lowest count (which can be `-1`).
	*/
	function lastVisited(/* variadic */) {
		if (arguments.length === 0) {
			throw new Error('lastVisited called with insufficient parameters');
		}

		if (State.isEmpty()) {
			return -1;
		}

		const needles = Array.prototype.concat.apply([], arguments);
		const played  = State.passages;
		const uBound  = played.length - 1;
		let turns = State.turns;

		for (let i = 0; i < needles.length && turns > -1; ++i) {
			const lastIndex = played.lastIndexOf(needles[i]);
			turns = Math.min(turns, lastIndex === -1 ? -1 : uBound - lastIndex);
		}

		return turns;
	}

	/*
		Sets the given key/value pair within the story metadata store.
	*/
	function memorize(key, value) {
		if (typeof key !== 'string') {
			throw new TypeError(`memorize key parameter must be a string (received: ${getTypeOf(key)})`);
		}

		State.metadata.set(key, value);
	}

	/*
		Returns the title of the current passage.
	*/
	function passage() {
		return State.passage;
	}

	/*
		Returns the title of a previous passage, either the most recent one whose title does not
		match that of the active passage or the one at the optional offset, or an empty string,
		if there is no such passage.
	*/
	function previous(/* legacy: offset */) {
		const passages = State.passages;

		/* legacy: behavior with an offset */
		if (arguments.length > 0) {
			const offset = Number(arguments[0]);

			if (!Number.isSafeInteger(offset) || offset < 1) {
				throw new RangeError('previous offset parameter must be a positive integer greater than zero');
			}

			return passages.length > offset ? passages[passages.length - 1 - offset] : '';
		}
		/* /legacy */

		for (let i = passages.length - 2; i >= 0; --i) {
			if (passages[i] !== State.passage) {
				return passages[i];
			}
		}

		return '';
	}

	/*
		Returns a pseudo-random whole number (integer) within the range of the given bounds.
	*/
	function random(/* [min ,] max */) {
		let min;
		let max;

		switch (arguments.length) {
			case 0:
				throw new Error('random called with insufficient parameters');
			case 1:
				min = 0;
				max = Math.trunc(arguments[0]);
				break;
			default:
				min = Math.trunc(arguments[0]);
				max = Math.trunc(arguments[1]);
				break;
		}

		if (!Number.isInteger(min)) {
			throw new TypeError('random min parameter must be an integer');
		}
		if (!Number.isInteger(max)) {
			throw new TypeError('random max parameter must be an integer');
		}

		if (min > max) {
			[min, max] = [max, min];
		}

		return Math.floor(State.random() * (max - min + 1)) + min;
	}

	/*
		Returns a pseudo-random real number (floating-point) within the range of the given bounds.

		NOTE: Unlike with its sibling function `random()`, the `max` parameter
		is exclusive, not inclusive—i.e. the range goes to, but does not include,
		the given value.
	*/
	function randomFloat(/* [min ,] max */) {
		let min;
		let max;

		switch (arguments.length) {
			case 0:
				throw new Error('randomFloat called with insufficient parameters');
			case 1:
				min = 0.0;
				max = Number(arguments[0]);
				break;
			default:
				min = Number(arguments[0]);
				max = Number(arguments[1]);
				break;
		}

		if (Number.isNaN(min) || !Number.isFinite(min)) {
			throw new TypeError('randomFloat min parameter must be a number');
		}
		if (Number.isNaN(max) || !Number.isFinite(max)) {
			throw new TypeError('randomFloat max parameter must be a number');
		}

		if (min > max) {
			[min, max] = [max, min];
		}

		return State.random() * (max - min) + min;
	}

	/*
		Returns the value of the given key from the story metadata store
		or the given default value if the key does not exist.
	*/
	function recall(key, defaultValue) {
		if (typeof key !== 'string') {
			throw new TypeError(`recall key parameter must be a string (received: ${getTypeOf(key)})`);
		}

		return State.metadata.has(key) ? State.metadata.get(key) : defaultValue;
	}

	/*
		Returns a new array consisting of all of the tags of the given passages.
	*/
	function tags(/* variadic */) {
		if (arguments.length === 0) {
			return Story.get(State.passage).tags;
		}

		const passages = Array.prototype.concat.apply([], arguments);
		let tags = [];

		for (let i = 0; i < passages.length; ++i) {
			tags = tags.concat(Story.get(passages[i]).tags);
		}

		return tags;
	}

	/*
		Returns a reference to the current temporary _variables store.
	*/
	function temporary() {
		return State.temporary;
	}

	/*
		Returns the number of milliseconds which have passed since the current passage was rendered.
	*/
	function time() {
		return Engine.lastPlay === null ? 0 : now() - Engine.lastPlay;
	}

	/*
		Returns the number of passages that the player has visited.

		NOTE: Passages which were visited but have been undone—e.g. via the backward
		button or the `<<back>>` macro—are no longer part of the in-play story
		history and thus are not tallied.  Passages which were visited but have
		expired from the story history, on the other hand, are tallied.
	*/
	function turns() {
		return State.turns;
	}

	/*
		Returns a reference to the current story $variables store.
	*/
	function variables() {
		return State.variables;
	}

	/*
		Returns the number of times that the passage with the given title exists within the story
		history.  If multiple passage titles are given, returns the lowest count.
	*/
	function visited(/* variadic */) {
		if (State.isEmpty()) {
			return 0;
		}

		const needles = Array.prototype.concat.apply([], arguments.length === 0 ? [State.passage] : arguments);
		const played  = State.passages;
		let count = State.turns;

		for (let i = 0; i < needles.length && count > 0; ++i) {
			count = Math.min(count, played.count(needles[i]));
		}

		return count;
	}

	/*
		Returns the number of passages within the story history which are tagged with all of the given tags.
	*/
	function visitedTags(/* variadic */) {
		if (arguments.length === 0) {
			throw new Error('visitedTags called with insufficient parameters');
		}

		if (State.isEmpty()) {
			return 0;
		}

		const needles = Array.prototype.concat.apply([], arguments);
		const nLength = needles.length;
		const played  = State.passages;
		const seen    = new Map();
		let count = 0;

		for (let i = 0; i < played.length; ++i) {
			const title = played[i];

			if (seen.has(title)) {
				if (seen.get(title)) {
					++count;
				}
			}
			else {
				const tags = Story.get(title).tags;

				if (tags.length > 0) {
					let found = 0;

					for (let j = 0; j < nLength; ++j) {
						if (tags.includes(needles[j])) {
							++found;
						}
					}

					if (found === nLength) {
						++count;
						seen.set(title, true);
					}
					else {
						seen.set(title, false);
					}
				}
			}
		}

		return count;
	}

	/* eslint-enable no-unused-vars */


	/*******************************************************************************
		Import Functions.
	*******************************************************************************/

	var { // eslint-disable-line no-var
		/* eslint-disable no-unused-vars */
		importScripts,
		importStyles
		/* eslint-enable no-unused-vars */
	} = (() => {
		// Slugify the given URL.
		function slugifyUrl(url) {
			return parseURL(url).path
				.replace(/^[^\w]+|[^\w]+$/g, '')
				.replace(/[^\w]+/g, '-')
				.toLocaleLowerCase();
		}

		// Add a <script> element which will load the script from the given URL.
		function addScript(url) {
			return new Promise((resolve, reject) => {
				let kind;
				let src;

				if (typeof url === 'string') {
					kind = url.trim().toLowerCase().endsWith('.mjs') ? 'module' : 'text/javascript';
					src  = url;
				}
				else if (typeof url === 'object') {
					kind = url.type;
					src  = url.src;
				}
				else {
					throw new Error('importScripts url parameter must be a string or object');
				}

				/*
					WARNING: The ordering of the code within this function is important,
					as some browsers don't play well with different arrangements, so
					be careful when mucking around with it.

					The best supported ordering seems be: events → DOM append → attributes.
				*/
				jQuery(document.createElement('script'))
					.one('load abort error', ev => {
						jQuery(ev.target).off();

						if (ev.type === 'load') {
							resolve(ev.target);
						}
						else {
							reject(new Error(`importScripts failed to load the script "${src}"`));
						}
					})
					.appendTo(document.head)
					.attr({
						id   : `script-imported-${slugifyUrl(src)}`,
						type : kind,
						src
					});
			});
		}

		// Add a <link> element which will load the stylesheet from the given URL.
		function addStyle(url) {
			return new Promise((resolve, reject) => {
				if (typeof url !== 'string') {
					throw new Error('importStyles url parameter must be a string');
				}

				/*
					WARNING: The ordering of the code within this function is important,
					as some browsers don't play well with different arrangements, so
					be careful when mucking around with it.

					The best supported ordering seems be: events → DOM append → attributes.
				*/
				jQuery(document.createElement('link'))
					.one('load abort error', ev => {
						jQuery(ev.target).off();

						if (ev.type === 'load') {
							resolve(ev.target);
						}
						else {
							reject(new Error(`importStyles failed to load the stylesheet "${url}"`));
						}
					})
					.appendTo(document.head)
					.attr({
						id   : `style-imported-${slugifyUrl(url)}`,
						rel  : 'stylesheet',
						href : url
					});
			});
		}

		// Turn a list of callbacks into a sequential chain of `Promise` objects.
		function sequence(callbacks) {
			return callbacks.reduce((seq, fn) => seq = seq.then(fn), Promise.resolve()); // eslint-disable-line no-param-reassign
		}

		/*
			Import scripts from a URL.
		*/
		function importScripts(...urls) {
			return Promise.all(urls.map(oneOrSeries => {
				// Array of URLs to be imported in sequence.
				if (Array.isArray(oneOrSeries)) {
					return sequence(oneOrSeries.map(url => () => addScript(url)));
				}

				// Single URL to be imported.
				return addScript(oneOrSeries);
			}));
		}

		/*
			Import stylesheets from a URL.
		*/
		function importStyles(...urls) {
			return Promise.all(urls.map(oneOrSeries => {
				// Array of URLs to be imported in sequence.
				if (Array.isArray(oneOrSeries)) {
					return sequence(oneOrSeries.map(url => () => addStyle(url)));
				}

				// Single URL to be imported.
				return addStyle(oneOrSeries);
			}));
		}

		// Exports.
		return {
			importScripts,
			importStyles
		};
	})();


	/*******************************************************************************
		Desugaring Functions.
	*******************************************************************************/

	/*
		Returns the given string after converting all TwineScript syntactical sugars
		to their native JavaScript counterparts.
	*/
	const desugar = (() => {
		const tokenTable = enumFrom({
			/* eslint-disable quote-props */
			// Story $variable sigil-prefix.
			'$'     : 'State.variables.',
			// Temporary _variable sigil-prefix.
			'_'     : 'State.temporary.',
			// Assignment operator.
			'to'    : '=',
			// Equality operators.
			'eq'    : '==',
			'neq'   : '!=',
			'is'    : '===',
			'isnot' : '!==',
			// Relational operators.
			'gt'    : '>',
			'gte'   : '>=',
			'lt'    : '<',
			'lte'   : '<=',
			// Logical operators.
			'and'   : '&&',
			'or'    : '||',
			// Unary operators.
			'not'   : '!',
			'def'   : '"undefined" !== typeof',
			'ndef'  : '"undefined" === typeof'
			/* eslint-enable quote-props */
		});
		const desugarRE = new RegExp([
			'(?:""|\'\'|``)',                                     //   Empty quotes (incl. template literal)
			'(?:"(?:\\\\.|[^"\\\\])+")',                          //   Double quoted, non-empty
			"(?:'(?:\\\\.|[^'\\\\])+')",                          //   Single quoted, non-empty
			'(`(?:\\\\.|[^`\\\\])+`)',                            // 1=Template literal, non-empty
			'(?:[=+\\-*\\/%<>&\\|\\^~!?:,;\\(\\)\\[\\]{}]+)',     //   Operator characters
			'(?:\\.{3})',                                         //   Spread/rest syntax
			'([^"\'=+\\-*\\/%<>&\\|\\^~!?:,;\\(\\)\\[\\]{}\\s]+)' // 2=Barewords
		].join('|'), 'g');
		const varTest = new RegExp(`^${Patterns.variable}`);

		function desugar(sugaredCode) {
			desugarRE.lastIndex = 0;

			let code  = sugaredCode;
			let match;

			while ((match = desugarRE.exec(code)) !== null) {
				// no-op: Empty quotes, Double quoted, Single quoted, Operator characters, Spread/rest syntax

				// Template literal, non-empty.
				if (match[1]) {
					const sugaredTemplate = match[1];
					const template = desugarTemplate(sugaredTemplate);

					if (template !== sugaredTemplate) {
						code = code.splice(
							match.index,            // starting index
							sugaredTemplate.length, // replace how many
							template                // replacement string
						);
						desugarRE.lastIndex += template.length - sugaredTemplate.length;
					}
				}

				// Barewords.
				else if (match[2]) {
					let token = match[2];

					// If the token is simply a dollar-sign or underscore, then it's either
					// just the raw character or, probably, a function alias, so skip it.
					if (token === '$' || token === '_') {
						continue;
					}

					// If the token is a story $variable or temporary _variable, then reset
					// it to just its sigil for replacement.
					if (varTest.test(token)) {
						token = token[0];
					}

					// If the finalized token has a mapping, replace it within the code string
					// with its counterpart.
					if (tokenTable[token]) {
						code = code.splice(
							match.index,      // starting index
							token.length,     // replace how many
							tokenTable[token] // replacement string
						);
						desugarRE.lastIndex += tokenTable[token].length - token.length;
					}
				}
			}

			return code;
		}

		const templateGroupStartRE = /\$\{/g;
		const templateGroupParseRE = new RegExp([
			'(?:""|\'\')',               //   Empty quotes
			'(?:"(?:\\\\.|[^"\\\\])+")', //   Double quoted, non-empty
			"(?:'(?:\\\\.|[^'\\\\])+')", //   Single quoted, non-empty
			'(\\{)',                     // 1=Opening curly brace
			'(\\})'                      // 2=Closing curly brace
		].join('|'), 'g');

		// WARNING: Does not currently handle nested template strings.
		function desugarTemplate(sugaredLiteral) {
			templateGroupStartRE.lastIndex = 0;

			let template   = sugaredLiteral;
			let startMatch;

			while ((startMatch = templateGroupStartRE.exec(template)) !== null) {
				const startIndex = startMatch.index + 2;
				let endIndex = startIndex;
				let depth    = 1;
				let endMatch;

				templateGroupParseRE.lastIndex = startIndex;

				while ((endMatch = templateGroupParseRE.exec(template)) !== null) {
					// Opening curly brace.
					if (endMatch[1]) {
						++depth;
					}
					// Closing curly brace.
					else if (endMatch[2]) {
						--depth;
					}

					if (depth === 0) {
						endIndex = endMatch.index;
						break;
					}
				}

				// If the group is not empty, replace it within the template
				// with its desugared counterpart.
				if (endIndex > startIndex) {
					const desugarREIndex = desugarRE.lastIndex;
					const sugaredGroup   = template.slice(startIndex, endIndex);
					const group          = desugar(sugaredGroup);
					desugarRE.lastIndex = desugarREIndex;

					template = template.splice(
						startIndex,          // starting index
						sugaredGroup.length, // replace how many
						group                // replacement string
					);
					templateGroupStartRE.lastIndex += group.length - sugaredGroup.length;
				}
			}

			return template;
		}

		return desugar;
	})();


	/*******************************************************************************
		Eval Functions.
	*******************************************************************************/

	/* eslint-disable no-eval, no-extra-parens, no-unused-vars */
	/*
		Evaluates the given JavaScript code and returns the result, throwing if there were errors.
	*/
	function evalJavaScript(code, output, data) {
		return (function (code, output, SCRIPT$DATA$) {
			return eval(code);
		}).call(output ? { output } : null, String(code), output, data);
	}

	/*
		Evaluates the given TwineScript code and returns the result, throwing if there were errors.
	*/
	function evalTwineScript(code, output, data) {
		// WARNING: Do not use a dollar sign or underscore as the first character of the
		// data variable, `SCRIPT$DATA$`, as `desugar()` will break references to it within
		// the code string.
		return (function (code, output, SCRIPT$DATA$) {
			return eval(code);
		}).call(output ? { output } : null, desugar(String(code)), output, data);
	}
	/* eslint-enable no-eval, no-extra-parens, no-unused-vars */


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		desugar         : { value : desugar },
		evalJavaScript  : { value : evalJavaScript },
		evalTwineScript : { value : evalTwineScript },

		/*
			Legacy Functions.
		*/
		parse : { value : desugar }
	}));
})();
