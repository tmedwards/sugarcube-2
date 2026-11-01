/***********************************************************************************************************************

	markup/wikifier-util.js

	Copyright © 2025 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Lexer, Patterns, Scripting, State, Story, Wikifier, cssPropToDOMProp, enumFrom
*/

var WikifierUtil = (() => { // eslint-disable-line no-unused-vars, no-var
	/*******************************************************************************
		Wikifier Utility Static Methods.
	*******************************************************************************/

	/*
		Evaluate a passage name and return it.
	*/
	function evalPassageName(passageName) {
		// NOTE: `0` is a valid name, so we cannot simply evaluate `passageName`
		if (passageName == null || Story.has(passageName)) { // nullish test
			return passageName;
		}

		return evalText(passageName);
	}

	/*
		Evaluate given text attempting to avoid leakage of auto-globals.
	*/
	function evalText(text) {
		let result;

		try {
			result = Scripting.evalTwineScript(text);

			// Attempt to prevent the leakage of auto-globals by enforcing that
			// the resultant value be either a string or a number.
			//
			// NOTE: This is not a foolproof solution to the problem of auto-global
			// leakage.  Various auto-globals, which return strings or numbers, can
			// still leak through—e.g. `window.status` → string.
			switch (typeof result) {
				case 'string':
					if (result.trim() === '') {
						result = text;
					}
					break;
				case 'number':
					result = String(result);
					break;
				default:
					result = text;
					break;
			}
		}
		catch (ex) {
			result = text;
		}

		return result;
	}

	const inlineCss = (() => {
		const lookaheadRe = new RegExp(Patterns.inlineCss, 'gm');
		const idOrClassRe = new RegExp(`(${Patterns.cssIdOrClassSigil})(${Patterns.anyLetter}+)`, 'g');

		function parseInlineCss(w, terminator) {
			const end = terminator ? w.source.indexOf(terminator, w.nextMatch) : -1;
			const source = end === -1 ? w.source : w.source.slice(0, end);
			const css = { classes : [], id : '', styles : {} };
			let matched;

			do {
				lookaheadRe.lastIndex = w.nextMatch;

				const match = lookaheadRe.exec(source);

				matched = match && match.index === w.nextMatch;

				if (matched) {
					if (match[1]) {
						css.styles[cssPropToDOMProp(match[1])] = match[2].trim();
					}
					else if (match[3]) {
						let subMatch;

						idOrClassRe.lastIndex = 0;

						while ((subMatch = idOrClassRe.exec(match[3])) !== null) {
							if (subMatch[1] === '.') {
								css.classes.push(subMatch[2]);
							}
							else {
								css.id = subMatch[2];
							}
						}
					}

					w.nextMatch = lookaheadRe.lastIndex; // eslint-disable-line no-param-reassign
				}
			} while (matched);

			return css;
		}

		return parseInlineCss;
	})();

	const parseSquareBracketedMarkup = (() => {
		/* eslint-disable no-param-reassign */
		// Lexing constant.
		const EOF = Lexer.EOF;

		// Lex item types object.
		const Item = enumFrom([
			'Error',     // error
			'DelimLTR',  // '|' or '->'
			'DelimRTL',  // '<-'
			'InnerMeta', // ']['
			'ImageMeta', // '[img[', '[<img[', or '[>img['
			'LinkMeta',  // '[['
			'Link',      // link destination
			'RightMeta', // ']]'
			'Setter',    // setter expression
			'Source',    // image source
			'Text'       // link text or image alt text
		]);

		// Delimiter state object.
		const Delim = enumFrom([
			'None', // no delimiter encountered
			'LTR',  // '|' or '->'
			'RTL'   // '<-'
		]);

		// Lexing functions.
		function slurpQuote(lexer, endQuote) {
			loop: for (;;) {
				switch (lexer.next()) {
					case '\\': {
						const ch = lexer.next();

						if (ch !== EOF && ch !== '\n') {
							break;
						}
					}
					/* falls through */
					case EOF:
					case '\n':
						return EOF;

					case endQuote:
						break loop;
				}
			}

			return lexer.pos;
		}

		function lexLeftMeta(lexer) {
			if (!lexer.accept('[')) {
				return lexer.error(Item.Error, 'malformed square-bracketed markup');
			}

			// Is link markup.
			if (lexer.accept('[')) {
				lexer.data.isLink = true;
				lexer.emit(Item.LinkMeta);
			}

			// May be image markup.
			else {
				lexer.accept('<>'); // aligner syntax

				if (!lexer.accept('Ii') || !lexer.accept('Mm') || !lexer.accept('Gg') || !lexer.accept('[')) {
					return lexer.error(Item.Error, 'malformed square-bracketed markup');
				}

				lexer.data.isLink = false;
				lexer.emit(Item.ImageMeta);
			}

			lexer.depth = 2; // account for both initial left square brackets
			return lexCoreComponents;
		}

		function lexCoreComponents(lexer) {
			const what = lexer.data.isLink ? 'link' : 'image';
			let delim = Delim.None;

			for (;;) {
				switch (lexer.next()) {
					case EOF:
					case '\n':
						return lexer.error(Item.Error, `unterminated ${what} markup`);

					case '"':
						// This is not entirely reliable within sections that allow raw strings, since
						// it's possible, however unlikely, for a raw string to contain unpaired double
						// quotes.  The likelihood is low enough, however, that I'm deeming the risk as
						// acceptable—for now, at least.
						if (slurpQuote(lexer, '"') === EOF) {
							return lexer.error(Item.Error, `unterminated double quoted string in ${what} markup`);
						}
						break;

					case '|': // possible pipe ('|') delimiter
						if (delim === Delim.None) {
							delim = Delim.LTR;
							lexer.backup();
							lexer.emit(Item.Text);
							lexer.forward();
							lexer.emit(Item.DelimLTR);
							// lexer.ignore();
						}
						break;

					case '-': // possible right arrow ('->') delimiter
						if (delim === Delim.None && lexer.peek() === '>') {
							delim = Delim.LTR;
							lexer.backup();
							lexer.emit(Item.Text);
							lexer.forward(2);
							lexer.emit(Item.DelimLTR);
							// lexer.ignore();
						}
						break;

					case '<': // possible left arrow ('<-') delimiter
						if (delim === Delim.None && lexer.peek() === '-') {
							delim = Delim.RTL;
							lexer.backup();
							lexer.emit(lexer.data.isLink ? Item.Link : Item.Source);
							lexer.forward(2);
							lexer.emit(Item.DelimRTL);
							// lexer.ignore();
						}
						break;

					case '[':
						++lexer.depth;
						break;

					case ']': {
						--lexer.depth;

						if (lexer.depth === 1) {
							switch (lexer.peek()) {
								case '[':
									++lexer.depth;
									lexer.backup();

									if (delim === Delim.RTL) {
										lexer.emit(Item.Text);
									}
									else {
										lexer.emit(lexer.data.isLink ? Item.Link : Item.Source);
									}

									lexer.forward(2);
									lexer.emit(Item.InnerMeta);
									// lexer.ignore();
									return lexer.data.isLink ? lexSetter : lexImageLink;

								case ']':
									--lexer.depth;
									lexer.backup();

									if (delim === Delim.RTL) {
										lexer.emit(Item.Text);
									}
									else {
										lexer.emit(lexer.data.isLink ? Item.Link : Item.Source);
									}

									lexer.forward(2);
									lexer.emit(Item.RightMeta);
									// lexer.ignore();
									return null;

								default:
									return lexer.error(Item.Error, `malformed ${what} markup`);
							}
						}

						break;
					}
				}
			}
		}

		function lexImageLink(lexer) {
			const what = lexer.data.isLink ? 'link' : 'image';

			for (;;) {
				switch (lexer.next()) {
					case EOF:
					case '\n':
						return lexer.error(Item.Error, `unterminated ${what} markup`);

					case '"':
						// This is not entirely reliable within sections that allow raw strings, since
						// it's possible, however unlikely, for a raw string to contain unpaired double
						// quotes.  The likelihood is low enough, however, that I'm deeming the risk as
						// acceptable—for now, at least.
						if (slurpQuote(lexer, '"') === EOF) {
							return lexer.error(Item.Error, `unterminated double quoted string in ${what} markup link component`);
						}
						break;

					case '[':
						++lexer.depth;
						break;

					case ']': {
						--lexer.depth;

						if (lexer.depth === 1) {
							switch (lexer.peek()) {
								case '[': {
									++lexer.depth;
									lexer.backup();
									lexer.emit(Item.Link);
									lexer.forward(2);
									lexer.emit(Item.InnerMeta);
									// lexer.ignore();
									return lexSetter;
								}

								case ']': {
									--lexer.depth;
									lexer.backup();
									lexer.emit(Item.Link);
									lexer.forward(2);
									lexer.emit(Item.RightMeta);
									// lexer.ignore();
									return null;
								}

								default:
									return lexer.error(Item.Error, `malformed ${what} markup`);
							}
						}

						break;
					}
				}
			}
		}

		function lexSetter(lexer) {
			const what = lexer.data.isLink ? 'link' : 'image';

			for (;;) {
				switch (lexer.next()) {
					case EOF:
					case '\n':
						return lexer.error(Item.Error, `unterminated ${what} markup`);

					case '"':
						if (slurpQuote(lexer, '"') === EOF) {
							return lexer.error(Item.Error, `unterminated double quoted string in ${what} markup setter component`);
						}
						break;

					case "'":
						if (slurpQuote(lexer, "'") === EOF) {
							return lexer.error(Item.Error, `unterminated single quoted string in ${what} markup setter component`);
						}
						break;

					case '[':
						++lexer.depth;
						break;

					case ']': {
						--lexer.depth;

						if (lexer.depth === 1) {
							if (lexer.peek() !== ']') {
								return lexer.error(Item.Error, `malformed ${what} markup`);
							}

							--lexer.depth;
							lexer.backup();
							lexer.emit(Item.Setter);
							lexer.forward(2);
							lexer.emit(Item.RightMeta);
							// lexer.ignore();
							return null;
						}

						break;
					}
				}
			}
		}

		// Parse function.
		function parseSquareBracketedMarkup(w) {
			// Initialize the lexer.
			const lexer  = new Lexer(w.source, lexLeftMeta);

			// Set the initial positions within the source string.
			lexer.start = lexer.pos = w.matchStart;

			// Lex the raw argument string.
			const markup = Object.create(null);
			const items  = lexer.run();
			const last   = items.last();

			if (last && last.type === Item.Error) {
				markup.error = last.message;
			}
			else {
				items.forEach(item => {
					const text = item.text.trim();

					switch (item.type) {
						case Item.ImageMeta:
							markup.isImage = true;

							if (text[1] === '<') {
								markup.align = 'left';
							}
							else if (text[1] === '>') {
								markup.align = 'right';
							}
							break;

						case Item.LinkMeta:
							markup.isLink = true;
							break;

						case Item.Link:
							if (text[0] === '~') {
								markup.forceInternal = true;
								markup.link = text.slice(1);
							}
							else {
								markup.link = text;
							}
							break;

						case Item.Setter:
							markup.setter = text;
							break;

						case Item.Source:
							markup.source = text;
							break;

						case Item.Text:
							markup.text = text;
							break;
					}
				});
			}

			markup.pos = lexer.pos;
			return markup;
		}

		return parseSquareBracketedMarkup;
		/* eslint-enable no-param-reassign */
	})();

	const shadowHandler = (() => {
		let macroParser = null;

		function cacheMacroParser() {
			if (!macroParser) {
				macroParser = Wikifier.Parser.get('macro');

				if (!macroParser) {
					throw new Error('cannot find "macro" parser');
				}
			}

			return macroParser;
		}

		function shadowHandler(code) {
			const shadowStore = Object.create(null);

			if (!macroParser) {
				cacheMacroParser();
			}

			if (macroParser.context) {
				macroParser.context.shadowView.forEach(varName => {
					const varKey = varName.slice(1);
					const store  = varName[0] === '$' ? State.variables : State.temporary;
					shadowStore[varName] = store[varKey];
				});
			}

			return function () {
				const shadowNames = Object.keys(shadowStore);
				const valueCache  = shadowNames.length > 0 ? {} : null;

				// There's no catch clause because this try/finally is here simply to ensure that
				// proper cleanup is done in the event that an exception is thrown during the
				// evaluation.
				try {
					// Cache the existing values of the variables to be shadowed and assign the
					// shadow values.
					shadowNames.forEach(varName => {
						const varKey = varName.slice(1);
						const store  = varName[0] === '$' ? State.variables : State.temporary;

						if (Object.hasOwn(store, varKey)) {
							valueCache[varKey] = store[varKey];
						}

						store[varKey] = shadowStore[varName];
					});

					// Evaluate the JavaScript.
					return Scripting.evalJavaScript(code);
				}
				finally {
					// Revert the variable shadowing.
					shadowNames.forEach(varName => {
						const varKey = varName.slice(1);
						const store  = varName[0] === '$' ? State.variables : State.temporary;

						// Update the shadow store with the variable's current value, in case it
						// was modified during the callback.
						shadowStore[varName] = store[varKey];

						if (Object.hasOwn(valueCache, varKey)) {
							store[varKey] = valueCache[varKey];
						}
						else {
							delete store[varKey];
						}
					});
				}
			};
		}

		return shadowHandler;
	})();


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		evalPassageName            : { value : evalPassageName },
		evalText                   : { value : evalText },
		inlineCss                  : { value : inlineCss },
		parseSquareBracketedMarkup : { value : parseSquareBracketedMarkup },
		shadowHandler              : { value : shadowHandler }
	}));
})();
