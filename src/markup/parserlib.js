/***********************************************************************************************************************

	markup/parserlib.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Config, DebugView, EOF, Engine, Lexer, Macro, MacroContext, Patterns, Scripting, State, Story, Template,
	       Wikifier, stringFrom, throwError
*/
/* eslint "no-param-reassign": [ 2, { "props" : false } ] */

(() => {
	'use strict';

	/*******************************************************************************************************************
		Utility Functions.
	*******************************************************************************************************************/
	function _verbatimTagHandler(w) {
		this.lookahead.lastIndex = w.matchStart;

		const match = this.lookahead.exec(w.source);

		if (match && match.index === w.matchStart) {
			w.nextMatch = this.lookahead.lastIndex;

			jQuery(document.createDocumentFragment())
				.append(match[1])
				.appendTo(w.output);
		}
	}


	/*******************************************************************************************************************
		Parsers.
	*******************************************************************************************************************/
	Wikifier.Parser.add({
		name       : 'quoteByBlock',
		profiles   : ['block'],
		match      : '^<<<\\n',
		terminator : '^<<<\\n',

		handler(w) {
			if (!Wikifier.helpers.hasBlockContext(w.output.childNodes)) {
				jQuery(w.output).append(document.createTextNode(w.matchText));
				return;
			}

			w.subWikify(
				jQuery(document.createElement('blockquote'))
					.appendTo(w.output)
					.get(0),
				this.terminator
			);
		}
	});

	Wikifier.Parser.add({
		name       : 'quoteByLine',
		profiles   : ['block'],
		match      : '^>+',
		lookahead  : /^>+/gm,
		terminator : '\\n',

		handler(w) {
			if (!Wikifier.helpers.hasBlockContext(w.output.childNodes)) {
				jQuery(w.output).append(document.createTextNode(w.matchText));
				return;
			}

			const destStack = [w.output];
			let curLevel = 0;
			let newLevel = w.matchLength;
			let matched;
			let i;

			do {
				if (newLevel > curLevel) {
					for (i = curLevel; i < newLevel; ++i) {
						destStack.push(
							jQuery(document.createElement('blockquote'))
								.appendTo(destStack[destStack.length - 1])
								.get(0)
						);
					}
				}
				else if (newLevel < curLevel) {
					for (i = curLevel; i > newLevel; --i) {
						destStack.pop();
					}
				}

				curLevel = newLevel;
				w.subWikify(destStack[destStack.length - 1], this.terminator);
				jQuery(document.createElement('br')).appendTo(destStack[destStack.length - 1]);

				this.lookahead.lastIndex = w.nextMatch;

				const match = this.lookahead.exec(w.source);

				matched = match && match.index === w.nextMatch;

				if (matched) {
					newLevel = match[0].length;
					w.nextMatch += match[0].length;
				}
			} while (matched);
		}
	});

	Wikifier.Parser.add({
		name      : 'macro',
		profiles  : ['core'],
		match     : '<<',
		lookahead : new RegExp(`<<(/?${Patterns.macroName})(?:\\s*)((?:(?:/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/)|(?://.*\\n)|(?:\`(?:\\\\.|[^\`\\\\])*\`)|(?:"(?:\\\\.|[^"\\\\])*")|(?:'(?:\\\\.|[^'\\\\])*')|(?:\\[(?:[<>]?[Ii][Mm][Gg])?\\[[^\\r\\n]*?\\]\\]+)|[^>]|(?:>(?!>)))*)>>`, 'gm'),
		working   : { source : '', name : '', arguments : '', index : 0 }, // the working parse object
		context   : null, // last execution context object (top-level macros, hierarchically, have a null context)

		handler(w) {
			const matchStart = this.lookahead.lastIndex = w.matchStart;

			if (this.parseTag(w)) {
				/*
					If `parseBody()` is called below, it will modify the current working
					values, so we must cache them now.
				*/
				const nextMatch = w.nextMatch;
				const name      = this.working.name;
				const rawArgs   = this.working.arguments;
				let macro;

				try {
					macro = Macro.get(name);

					if (macro) {
						let payload = null;

						if (typeof macro.tags !== 'undefined') {
							payload = this.parseBody(w, macro);

							if (!payload) {
								w.nextMatch = nextMatch; // we must reset `w.nextMatch` here, as `parseBody()` modifies it
								return throwError(
									w.output,
									`cannot find a closing tag for macro <<${name}>>`,
									`${w.source.slice(matchStart, w.nextMatch)}\u2026`
								);
							}
						}

						if (typeof macro.handler === 'function') {
							const args = !payload
								? this.createArgs(rawArgs, this.skipArgs(macro, macro.name))
								: payload[0].args;

							/*
								New-style macros.
							*/
							if (typeof macro._MACRO_API !== 'undefined') {
								/*
									Add the macro's execution context to the context chain.
								*/
								this.context = new MacroContext({
									macro,
									name,
									args,
									payload,
									source : w.source.slice(matchStart, w.nextMatch),
									parent : this.context,
									parser : w
								});

								/*
									Call the handler.

									NOTE: There's no catch clause here because this try/finally exists solely
									to ensure that the execution context is properly restored in the event
									that an uncaught exception is thrown during the handler call.
								*/
								try {
									macro.handler.call(this.context);
									/*
										QUESTION: Swap to the following, which passes macro arguments in
										as parameters to the handler function, in addition to them being
										available on its `this`?  If so, it might still be something to
										hold off on until v3, when the legacy macro API is removed.

										macro.handler.apply(this.context, this.context.args);
									*/
								}
								finally {
									this.context = this.context.parent;
								}
							}

							/*
								[DEPRECATED] Old-style/legacy macros.
							*/
							else {
								/*
									Set up the raw arguments string.
								*/
								const prevRawArgs = w._rawArgs;
								w._rawArgs = rawArgs;

								/*
									Call the handler.

									NOTE: There's no catch clause here because this try/finally exists solely
									to ensure that the previous raw arguments string is properly restored in
									the event that an uncaught exception is thrown during the handler call.
								*/
								try {
									macro.handler(w.output, name, args, w, payload);
								}
								finally {
									w._rawArgs = prevRawArgs;
								}
							}
						}
						else {
							return throwError(
								w.output,
								`macro <<${name}>> handler function ${typeof macro.handler === 'undefined' ? 'does not exist' : 'is not a function'}`,
								w.source.slice(matchStart, w.nextMatch)
							);
						}
					}
					else if (Macro.tags.has(name)) {
						const tags = Macro.tags.get(name);
						return throwError(
							w.output,
							`child tag <<${name}>> was found outside of a call to its parent macro${tags.length === 1 ? '' : 's'} <<${tags.join('>>, <<')}>>`,
							w.source.slice(matchStart, w.nextMatch)
						);
					}
					else {
						return throwError(
							w.output,
							`macro <<${name}>> does not exist`,
							w.source.slice(matchStart, w.nextMatch)
						);
					}
				}
				catch (ex) {
					return throwError(
						w.output,
						`cannot execute ${macro && macro.isWidget ? 'widget' : 'macro'} <<${name}>>: ${ex.message}`,
						w.source.slice(matchStart, w.nextMatch)
					);
				}
				finally {
					this.working.source    = '';
					this.working.name      = '';
					this.working.arguments = '';
					this.working.index     = 0;
				}
			}
			else {
				w.outputText(w.output, w.matchStart, w.nextMatch);
			}
		},

		parseTag(w) {
			const match = this.lookahead.exec(w.source);

			if (match && match.index === w.matchStart && match[1]) {
				w.nextMatch = this.lookahead.lastIndex;

				this.working.source    = w.source.slice(match.index, this.lookahead.lastIndex);
				this.working.name      = match[1];
				this.working.arguments = match[2];
				this.working.index     = match.index;

				return true;
			}

			return false;
		},

		parseBody(w, macro) {
			const openTag  = this.working.name;
			const closeTag = `/${openTag}`;
			const closeAlt = `end${openTag}`;
			const bodyTags = Array.isArray(macro.tags) ? macro.tags : false;
			const payload  = [];
			let end          = -1;
			let opened       = 1;
			let curSource    = this.working.source;
			let curTag       = this.working.name;
			let curArgument  = this.working.arguments;
			let contentStart = w.nextMatch;

			while ((w.matchStart = w.source.indexOf(this.match, w.nextMatch)) !== -1) {
				if (!this.parseTag(w)) {
					this.lookahead.lastIndex = w.nextMatch = w.matchStart + this.match.length;
					continue;
				}

				const tagSource = this.working.source;
				const tagName   = this.working.name;
				const tagArgs   = this.working.arguments;
				const tagBegin  = this.working.index;
				const tagEnd    = w.nextMatch;
				const hasArgs   = tagArgs.trim() !== '';

				switch (tagName) {
				case openTag:
					++opened;
					break;

				case closeAlt:
				case closeTag:
					if (hasArgs) {
						// Skip over malformed closing tags and throw.
						w.nextMatch = tagBegin + 2 + tagName.length;
						throw new Error(`malformed closing tag: "${tagSource}"`);
					}
					--opened;
					break;

				default:
					if (hasArgs && (tagName.startsWith('/') || tagName.startsWith('end'))) {
						// Skip over malformed alien closing tags.
						this.lookahead.lastIndex = w.nextMatch = tagBegin + 2 + tagName.length;
						continue;
					}
					if (opened === 1 && bodyTags) {
						for (let i = 0, iend = bodyTags.length; i < iend; ++i) {
							if (tagName === bodyTags[i]) {
								payload.push({
									source    : curSource,
									name      : curTag,
									arguments : curArgument,
									args      : this.createArgs(curArgument, this.skipArgs(macro, curTag)),
									contents  : w.source.slice(contentStart, tagBegin)
								});
								curSource    = tagSource;
								curTag       = tagName;
								curArgument  = tagArgs;
								contentStart = tagEnd;
							}
						}
					}
					break;
				}

				if (opened === 0) {
					payload.push({
						source    : curSource,
						name      : curTag,
						arguments : curArgument,
						args      : this.createArgs(curArgument, this.skipArgs(macro, curTag)),
						contents  : w.source.slice(contentStart, tagBegin)
					});
					end = tagEnd;
					break;
				}
			}

			if (end !== -1) {
				w.nextMatch = end;
				return payload;
			}

			return null;
		},

		createArgs(rawArgsString, skipArgs) {
			const args = skipArgs ? [] : this.parseArgs(rawArgsString);

			// Extend the args array with the raw and full argument strings.
			Object.defineProperties(args, {
				raw : {
					value : rawArgsString
				},
				full : {
					value : Scripting.parse(rawArgsString)
				}
			});

			return args;
		},

		skipArgs(macro, tagName) {
			if (typeof macro.skipArgs !== 'undefined') {
				const sa = macro.skipArgs;

				return typeof sa === 'boolean' && sa || Array.isArray(sa) && sa.includes(tagName);
			}
			/* legacy */
			else if (typeof macro.skipArg0 !== 'undefined') {
				return macro.skipArg0 && macro.name === tagName;
			}
			/* /legacy */

			return false;
		},

		parseArgs : (() => {
			const Item = Lexer.enumFromNames([ // lex item types object (pseudo-enumeration)
				'Error',        // error
				'Bareword',     // bare identifier
				'Expression',   // expression (backquoted)
				'String',       // quoted string (single or double)
				'SquareBracket' // [[…]] or [img[…]]
			]);
			const spaceRe    = new RegExp(Patterns.space);
			const notSpaceRe = new RegExp(Patterns.notSpace);
			const varTest    = new RegExp(`^${Patterns.variable}`);

			// Lexing functions.
			function slurpQuote(lexer, endQuote) {
				loop: for (;;) {
					/* eslint-disable indent */
					switch (lexer.next()) {
					case '\\':
						{
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
					/* eslint-enable indent */
				}

				return lexer.pos;
			}

			function lexSpace(lexer) {
				const offset = lexer.source.slice(lexer.pos).search(notSpaceRe);

				if (offset === EOF) {
					// no non-whitespace characters, so bail
					return null;
				}
				else if (offset !== 0) {
					lexer.pos += offset;
					lexer.ignore();
				}

				// determine what the next state is
				switch (lexer.next()) {
				case '`':
					return lexExpression;
				case '"':
					return lexDoubleQuote;
				case "'":
					return lexSingleQuote;
				case '[':
					return lexSquareBracket;
				default:
					return lexBareword;
				}
			}

			function lexExpression(lexer) {
				if (slurpQuote(lexer, '`') === EOF) {
					return lexer.error(Item.Error, 'unterminated backquote expression');
				}

				lexer.emit(Item.Expression);
				return lexSpace;
			}

			function lexDoubleQuote(lexer) {
				if (slurpQuote(lexer, '"') === EOF) {
					return lexer.error(Item.Error, 'unterminated double quoted string');
				}

				lexer.emit(Item.String);
				return lexSpace;
			}

			function lexSingleQuote(lexer) {
				if (slurpQuote(lexer, "'") === EOF) {
					return lexer.error(Item.Error, 'unterminated single quoted string');
				}

				lexer.emit(Item.String);
				return lexSpace;
			}

			function lexSquareBracket(lexer) {
				const imgMeta = '<>IiMmGg';
				let what;

				if (lexer.accept(imgMeta)) {
					what = 'image';
					lexer.acceptRun(imgMeta);
				}
				else {
					what = 'link';
				}

				if (!lexer.accept('[')) {
					return lexer.error(Item.Error, `malformed ${what} markup`);
				}

				lexer.depth = 2; // account for both initial left square brackets

				loop: for (;;) {
					/* eslint-disable indent */
					switch (lexer.next()) {
					case '\\':
						{
							const ch = lexer.next();

							if (ch !== EOF && ch !== '\n') {
								break;
							}
						}
						/* falls through */
					case EOF:
					case '\n':
						return lexer.error(Item.Error, `unterminated ${what} markup`);

					case '[':
						++lexer.depth;
						break;

					case ']':
						--lexer.depth;

						if (lexer.depth < 0) {
							return lexer.error(Item.Error, "unexpected right square bracket ']'");
						}

						if (lexer.depth === 1) {
							if (lexer.next() === ']') {
								--lexer.depth;
								break loop;
							}
							lexer.backup();
						}
						break;
					}
					/* eslint-enable indent */
				}

				lexer.emit(Item.SquareBracket);
				return lexSpace;
			}

			function lexBareword(lexer) {
				const offset = lexer.source.slice(lexer.pos).search(spaceRe);
				lexer.pos = offset === EOF ? lexer.source.length : lexer.pos + offset;
				lexer.emit(Item.Bareword);
				return offset === EOF ? null : lexSpace;
			}

			// Parse function.
			function parseMacroArgs(rawArgsString) {
				// Initialize the lexer.
				const lexer = new Lexer(rawArgsString, lexSpace);
				const args  = [];

				// Lex the raw argument string.
				lexer.run().forEach(item => {
					let arg = item.text;

					switch (item.type) {
					case Item.Error:
						throw new Error(`unable to parse macro argument "${arg}": ${item.message}`);

					case Item.Bareword:
						// A variable, so substitute its value.
						if (varTest.test(arg)) {
							arg = State.getVar(arg);
						}

						// Property access on the settings or setup objects, so try to evaluate it.
						else if (/^(?:settings|setup)[.[]/.test(arg)) {
							try {
								arg = Scripting.evalTwineScript(arg);
							}
							catch (ex) {
								throw new Error(`unable to parse macro argument "${arg}": ${ex.message}`);
							}
						}

						// Null literal, so convert it into null.
						else if (arg === 'null') {
							arg = null;
						}

						// Undefined literal, so convert it into undefined.
						else if (arg === 'undefined') {
							arg = undefined;
						}

						// Boolean true literal, so convert it into true.
						else if (arg === 'true') {
							arg = true;
						}

						// Boolean false literal, so convert it into false.
						else if (arg === 'false') {
							arg = false;
						}

						// NaN literal, so convert it into NaN.
						else if (arg === 'NaN') {
							arg = NaN;
						}

						// Attempt to convert it into a number, in case it's a numeric literal.
						else {
							const argAsNum = Number(arg);

							if (!Number.isNaN(argAsNum)) {
								arg = argAsNum;
							}
						}
						break;

					case Item.Expression:
						arg = arg.slice(1, -1).trim(); // remove the backquotes and trim the expression

						// Empty backquotes.
						if (arg === '') {
							arg = undefined;
						}

						// Evaluate the expression.
						else {
							try {
								/*
									The enclosing parenthesis here are necessary to force a code string
									consisting solely of an object literal to be evaluated as such, rather
									than as a code block.
								*/
								arg = Scripting.evalTwineScript(`(${arg})`);
							}
							catch (ex) {
								throw new Error(`unable to parse macro argument expression "${arg}": ${ex.message}`);
							}
						}
						break;

					case Item.String:
						// Evaluate the string to handle escaped characters.
						try {
							arg = Scripting.evalJavaScript(arg);
						}
						catch (ex) {
							throw new Error(`unable to parse macro argument string "${arg}": ${ex.message}`);
						}
						break;

					case Item.SquareBracket:
						{
							const markup = Wikifier.helpers.parseSquareBracketedMarkup({
								source     : arg,
								matchStart : 0
							});

							if (markup.hasOwnProperty('error')) {
								throw new Error(`unable to parse macro argument "${arg}": ${markup.error}`);
							}

							if (markup.pos < arg.length) {
								throw new Error(`unable to parse macro argument "${arg}": unexpected character(s) "${arg.slice(markup.pos)}" (pos: ${markup.pos})`);
							}

							// Convert to a link or image object.
							if (markup.isLink) {
								// .isLink, [.text], [.forceInternal], .link, [.setter]
								arg = { isLink : true };
								arg.count    = markup.hasOwnProperty('text') ? 2 : 1;
								arg.link     = Wikifier.helpers.evalPassageId(markup.link);
								arg.text     = markup.hasOwnProperty('text') ? Wikifier.helpers.evalText(markup.text) : arg.link;
								arg.external = !markup.forceInternal && Wikifier.isExternalLink(arg.link);
								arg.setFn    = markup.hasOwnProperty('setter')
									? Wikifier.helpers.createShadowSetterCallback(Scripting.parse(markup.setter))
									: null;
							}
							else if (markup.isImage) {
								// .isImage, [.align], [.title], .source, [.forceInternal], [.link], [.setter]
								arg = (source => {
									const imgObj = {
										source,
										isImage : true
									};

									// Check for Twine 1.4 Base64 image passage transclusion.
									if (source.slice(0, 5) !== 'data:' && Story.has(source)) {
										const passage = Story.get(source);

										if (passage.tags.includes('Twine.image')) {
											imgObj.source  = passage.text;
											imgObj.passage = passage.title;
										}
									}

									return imgObj;
								})(Wikifier.helpers.evalPassageId(markup.source));

								if (markup.hasOwnProperty('align')) {
									arg.align = markup.align;
								}

								if (markup.hasOwnProperty('text')) {
									arg.title = Wikifier.helpers.evalText(markup.text);
								}

								if (markup.hasOwnProperty('link')) {
									arg.link     = Wikifier.helpers.evalPassageId(markup.link);
									arg.external = !markup.forceInternal && Wikifier.isExternalLink(arg.link);
								}

								arg.setFn = markup.hasOwnProperty('setter')
									? Wikifier.helpers.createShadowSetterCallback(Scripting.parse(markup.setter))
									: null;
							}
						}
						break;
					}

					args.push(arg);
				});

				return args;
			}

			return parseMacroArgs;
		})()
	});

	Wikifier.Parser.add({
		name     : 'link',
		profiles : ['core'],
		match    : '\\[\\[[^[]',

		handler(w) {
			const markup = Wikifier.helpers.parseSquareBracketedMarkup(w);

			if (markup.hasOwnProperty('error')) {
				w.outputText(w.output, w.matchStart, w.nextMatch);
				return;
			}

			w.nextMatch = markup.pos;

			// text=(text), forceInternal=(~), link=link, setter=(setter)
			const link  = Wikifier.helpers.evalPassageId(markup.link);
			const text  = markup.hasOwnProperty('text') ? Wikifier.helpers.evalText(markup.text) : link;
			const setFn = markup.hasOwnProperty('setter')
				? Wikifier.helpers.createShadowSetterCallback(Scripting.parse(markup.setter))
				: null;

			// Debug view setup.
			const output = (Config.debug
				? new DebugView(w.output, 'link-markup', '[[link]]', w.source.slice(w.matchStart, w.nextMatch))
				: w
			).output;

			if (markup.forceInternal || !Wikifier.isExternalLink(link)) {
				Wikifier.createInternalLink(output, link, text, setFn);
			}
			else {
				Wikifier.createExternalLink(output, link, text);
			}
		}
	});

	Wikifier.Parser.add({
		name     : 'urlLink',
		profiles : ['core'],
		match    : Patterns.url,

		handler(w) {
			w.outputText(Wikifier.createExternalLink(w.output, w.matchText), w.matchStart, w.nextMatch);
		}
	});

	Wikifier.Parser.add({
		name     : 'image',
		profiles : ['core'],
		match    : '\\[[<>]?[Ii][Mm][Gg]\\[',

		handler(w) {
			const markup = Wikifier.helpers.parseSquareBracketedMarkup(w);

			if (markup.hasOwnProperty('error')) {
				w.outputText(w.output, w.matchStart, w.nextMatch);
				return;
			}

			w.nextMatch = markup.pos;

			// Debug view setup.
			let debugView;

			if (Config.debug) {
				debugView = new DebugView(
					w.output,
					'image-markup',
					markup.hasOwnProperty('link') ? '[img[][link]]' : '[img[]]',
					w.source.slice(w.matchStart, w.nextMatch)
				);
				debugView.modes({ block : true });
			}

			// align=(left|right), title=(title), source=source, forceInternal=(~), link=(link), setter=(setter)
			const setFn = markup.hasOwnProperty('setter')
				? Wikifier.helpers.createShadowSetterCallback(Scripting.parse(markup.setter))
				: null;
			let el     = (Config.debug ? debugView : w).output;
			let source;

			if (markup.hasOwnProperty('link')) {
				const link = Wikifier.helpers.evalPassageId(markup.link);

				if (markup.forceInternal || !Wikifier.isExternalLink(link)) {
					el = Wikifier.createInternalLink(el, link, null, setFn);
				}
				else {
					el = Wikifier.createExternalLink(el, link);
				}

				el.classList.add('link-image');
			}

			el = jQuery(document.createElement('img'))
				.appendTo(el)
				.get(0);
			source = Wikifier.helpers.evalPassageId(markup.source);

			// Check for image passage transclusion.
			if (source.slice(0, 5) !== 'data:' && Story.has(source)) {
				const passage = Story.get(source);

				if (passage.tags.includes('Twine.image')) {
					el.setAttribute('data-passage', passage.title);
					source = passage.text.trim();
				}
			}

			el.src = source;

			if (markup.hasOwnProperty('text')) {
				el.title = Wikifier.helpers.evalText(markup.text);
			}

			if (markup.hasOwnProperty('align')) {
				el.align = markup.align;
			}
		}
	});

	Wikifier.Parser.add({
		name      : 'monospacedByBlock',
		profiles  : ['block'],
		match     : '^\\{\\{\\{\\n',
		lookahead : /^\{\{\{\n((?:^[^\n]*\n)+?)(^\}\}\}$\n?)/gm,

		handler(w) {
			this.lookahead.lastIndex = w.matchStart;

			const match = this.lookahead.exec(w.source);

			if (match && match.index === w.matchStart) {
				const pre = jQuery(document.createElement('pre'));
				jQuery(document.createElement('code'))
					.text(match[1])
					.appendTo(pre);
				pre.appendTo(w.output);
				w.nextMatch = this.lookahead.lastIndex;
			}
		}
	});

	Wikifier.Parser.add({
		name     : 'formatByChar',
		profiles : ['core'],
		match    : "''|//|__|\\^\\^|~~|==|\\{\\{\\{",

		handler(w) {
			switch (w.matchText) {
			case "''":
				w.subWikify(jQuery(document.createElement('strong')).appendTo(w.output).get(0), "''");
				break;

			case '//':
				w.subWikify(jQuery(document.createElement('em')).appendTo(w.output).get(0), '//');
				break;

			case '__':
				w.subWikify(jQuery(document.createElement('u')).appendTo(w.output).get(0), '__');
				break;

			case '^^':
				w.subWikify(jQuery(document.createElement('sup')).appendTo(w.output).get(0), '\\^\\^');
				break;

			case '~~':
				w.subWikify(jQuery(document.createElement('sub')).appendTo(w.output).get(0), '~~');
				break;

			case '==':
				w.subWikify(jQuery(document.createElement('s')).appendTo(w.output).get(0), '==');
				break;

			case '{{{':
				{
					const lookahead = /\{\{\{((?:.|\n)*?)\}\}\}/gm;

					lookahead.lastIndex = w.matchStart;

					const match = lookahead.exec(w.source);

					if (match && match.index === w.matchStart) {
						jQuery(document.createElement('code'))
							.text(match[1])
							.appendTo(w.output);
						w.nextMatch = lookahead.lastIndex;
					}
				}
				break;
			}
		}
	});

	Wikifier.Parser.add({
		name       : 'customStyle',
		profiles   : ['core'],
		match      : '@@',
		terminator : '@@',
		blockRe    : /\s*\n/gm,

		handler(w) {
			const css = Wikifier.helpers.inlineCss(w);

			this.blockRe.lastIndex = w.nextMatch; // must follow the call to `inlineCss()`

			const blockMatch = this.blockRe.exec(w.source);
			const blockLevel = blockMatch && blockMatch.index === w.nextMatch;
			const $el        = jQuery(document.createElement(blockLevel ? 'div' : 'span'))
				.appendTo(w.output);

			if (css.classes.length === 0 && css.id === '' && Object.keys(css.styles).length === 0) {
				$el.addClass('marked');
			}
			else {
				css.classes.forEach(className => $el.addClass(className));

				if (css.id !== '') {
					$el.attr('id', css.id);
				}

				$el.css(css.styles);
			}

			if (blockLevel) {
				// Skip the leading and, if it exists, trailing newlines.
				w.nextMatch += blockMatch[0].length;
				w.subWikify($el[0], `\\n?${this.terminator}`);
			}
			else {
				w.subWikify($el[0], this.terminator);
			}
		}
	});

	Wikifier.Parser.add({
		name      : 'verbatimText',
		profiles  : ['core'],
		match     : '"{3}|<[Nn][Oo][Ww][Ii][Kk][Ii]>',
		lookahead : /(?:"{3}((?:.|\n)*?)"{3})|(?:<[Nn][Oo][Ww][Ii][Kk][Ii]>((?:.|\n)*?)<\/[Nn][Oo][Ww][Ii][Kk][Ii]>)/gm,

		handler(w) {
			this.lookahead.lastIndex = w.matchStart;

			const match = this.lookahead.exec(w.source);

			if (match && match.index === w.matchStart) {
				w.nextMatch = this.lookahead.lastIndex;

				jQuery(document.createElement('span'))
					.addClass('verbatim')
					.text(match[1] || match[2])
					.appendTo(w.output);
			}
		}
	});

	Wikifier.Parser.add({
		name     : 'horizontalRule',
		profiles : ['core'],
		match    : '^----+$\\n?|<[Hh][Rr]\\s*/?>\\n?',

		handler(w) {
			jQuery(document.createElement('hr')).appendTo(w.output);
		}
	});

	Wikifier.Parser.add({
		name     : 'emdash',
		profiles : ['core'],
		match    : '--',

		handler(w) {
			jQuery(document.createTextNode('\u2014')).appendTo(w.output);
		}
	});

	Wikifier.Parser.add({
		name     : 'doubleDollarSign',
		profiles : ['core'],
		match    : '\\${2}', // eslint-disable-line no-template-curly-in-string

		handler(w) {
			jQuery(document.createTextNode('$')).appendTo(w.output);
		}
	});

	Wikifier.Parser.add({
		/*
			Supported syntax:
				$variable
				$variable.property
				$variable[numericIndex]
				$variable["property"]
				$variable['property']
				$variable[$indexOrPropertyVariable]

			NOTE: I really do not like how the initial bit of the regexp matches.
		*/
		name     : 'nakedVariable',
		profiles : ['core'],
		match    : `${Patterns.variable}(?:(?:\\.${Patterns.identifier})|(?:\\[\\d+\\])|(?:\\["(?:\\\\.|[^"\\\\])+"\\])|(?:\\['(?:\\\\.|[^'\\\\])+'\\])|(?:\\[${Patterns.variable}\\]))*`,

		handler(w) {
			const result = State.getVar(w.matchText);

			if (result == null) { // lazy equality for null
				jQuery(document.createTextNode(w.matchText)).appendTo(w.output);
			}
			else {
				new Wikifier(
					(Config.debug
						? new DebugView(w.output, 'variable', w.matchText, w.matchText) // Debug view setup.
						: w
					).output,
					stringFrom(result)
				);
			}
		}
	});

	Wikifier.Parser.add({
		name     : 'template',
		profiles : ['core'],
		match    : `\\?${Patterns.templateName}`,

		handler(w) {
			const name = w.matchText.slice(1);
			let template = Template.get(name);
			let result   = null;

			// If we have an array of templates, randomly choose one.
			if (template instanceof Array) {
				template = template.random();
			}

			switch (typeof template) {
			case 'function':
				try {
					result = stringFrom(template.call({ name }));
				}
				catch (ex) {
					return throwError(
						w.output,
						`cannot execute function template ?${name}: ${ex.message}`,
						w.source.slice(w.matchStart, w.nextMatch)
					);
				}
				break;
			case 'string':
				result = template;
				break;
			}

			if (result === null) {
				jQuery(document.createTextNode(w.matchText)).appendTo(w.output);
			}
			else {
				new Wikifier(
					(Config.debug
						? new DebugView(w.output, 'template', w.matchText, w.matchText) // Debug view setup.
						: w
					).output,
					result
				);
			}
		}
	});

	Wikifier.Parser.add({
		name       : 'heading',
		profiles   : ['block'],
		match      : '^!{1,6}',
		terminator : '\\n',

		handler(w) {
			if (!Wikifier.helpers.hasBlockContext(w.output.childNodes)) {
				jQuery(w.output).append(document.createTextNode(w.matchText));
				return;
			}

			w.subWikify(
				jQuery(document.createElement(`h${w.matchLength}`)).appendTo(w.output).get(0),
				this.terminator
			);
		}
	});

	Wikifier.Parser.add({
		name           : 'table',
		profiles       : ['block'],
		match          : '^\\|(?:[^\\n]*)\\|(?:[fhck]?)$',
		lookahead      : /^\|([^\n]*)\|([fhck]?)$/gm,
		rowTerminator  : '\\|(?:[cfhk]?)$\\n?',
		cellPattern    : '(?:\\|([^\\n\\|]*)\\|)|(\\|[cfhk]?$\\n?)',
		cellTerminator : '(?:\\u0020*)\\|',
		rowTypes       : { c : 'caption', f : 'tfoot', h : 'thead', '' : 'tbody' }, // eslint-disable-line id-length

		handler(w) {
			if (!Wikifier.helpers.hasBlockContext(w.output.childNodes)) {
				jQuery(w.output).append(document.createTextNode(w.matchText));
				return;
			}

			const table       = jQuery(document.createElement('table')).appendTo(w.output).get(0);
			const prevColumns = [];
			let curRowType    = null;
			let $rowContainer = null;
			let rowCount      = 0;
			let matched;

			w.nextMatch = w.matchStart;

			do {
				this.lookahead.lastIndex = w.nextMatch;

				const match = this.lookahead.exec(w.source);

				matched = match && match.index === w.nextMatch;

				if (matched) {
					const nextRowType = match[2];

					if (nextRowType === 'k') {
						table.className = match[1];
						w.nextMatch += match[0].length + 1;
					}
					else {
						if (nextRowType !== curRowType) {
							curRowType = nextRowType;
							$rowContainer = jQuery(document.createElement(this.rowTypes[nextRowType]))
								.appendTo(table);
						}

						if (curRowType === 'c') {
							$rowContainer.css('caption-side', rowCount === 0 ? 'top' : 'bottom');
							w.nextMatch += 1;
							w.subWikify($rowContainer[0], this.rowTerminator);
						}
						else {
							this.rowHandler(
								w,
								jQuery(document.createElement('tr'))
									.appendTo($rowContainer)
									.get(0),
								prevColumns
							);
						}

						++rowCount;
					}
				}
			} while (matched);
		},

		rowHandler(w, rowEl, prevColumns) {
			const cellRe = new RegExp(this.cellPattern, 'gm');
			let col         = 0;
			let curColCount = 1;
			let matched;

			do {
				cellRe.lastIndex = w.nextMatch;

				const cellMatch = cellRe.exec(w.source);

				matched = cellMatch && cellMatch.index === w.nextMatch;

				if (matched) {
					if (cellMatch[1] === '~') {
						const last = prevColumns[col];

						if (last) {
							++last.rowCount;
							last.$element
								.attr('rowspan', last.rowCount)
								.css('vertical-align', 'middle');
						}

						w.nextMatch = cellMatch.index + cellMatch[0].length - 1;
					}
					else if (cellMatch[1] === '>') {
						++curColCount;
						w.nextMatch = cellMatch.index + cellMatch[0].length - 1;
					}
					else if (cellMatch[2]) {
						w.nextMatch = cellMatch.index + cellMatch[0].length;
						break;
					}
					else {
						++w.nextMatch;

						const css = Wikifier.helpers.inlineCss(w);
						let spaceLeft  = false;
						let spaceRight = false;
						let $cell;

						while (w.source.substr(w.nextMatch, 1) === ' ') {
							spaceLeft = true;
							++w.nextMatch;
						}

						if (w.source.substr(w.nextMatch, 1) === '!') {
							$cell = jQuery(document.createElement('th')).appendTo(rowEl);
							++w.nextMatch;
						}
						else {
							$cell = jQuery(document.createElement('td')).appendTo(rowEl);
						}

						prevColumns[col] = {
							rowCount : 1,
							$element : $cell
						};

						if (curColCount > 1) {
							$cell.attr('colspan', curColCount);
							curColCount = 1;
						}

						w.subWikify($cell[0], this.cellTerminator);

						if (w.matchText.substr(w.matchText.length - 2, 1) === ' ') {
							spaceRight = true;
						}

						css.classes.forEach(className => $cell.addClass(className));

						if (css.id !== '') {
							$cell.attr('id', css.id);
						}

						if (spaceLeft && spaceRight) {
							css.styles['text-align'] = 'center';
						}
						else if (spaceLeft) {
							css.styles['text-align'] = 'right';
						}
						else if (spaceRight) {
							css.styles['text-align'] = 'left';
						}

						$cell.css(css.styles);

						w.nextMatch = w.nextMatch - 1;
					}

					++col;
				}
			} while (matched);
		}
	});

	Wikifier.Parser.add({
		name       : 'list',
		profiles   : ['block'],
		match      : '^(?:(?:\\*+)|(?:#+))',
		lookahead  : /^(?:(\*+)|(#+))/gm,
		terminator : '\\n',

		handler(w) {
			if (!Wikifier.helpers.hasBlockContext(w.output.childNodes)) {
				jQuery(w.output).append(document.createTextNode(w.matchText));
				return;
			}

			w.nextMatch = w.matchStart;

			const destStack = [w.output];
			let curType  = null;
			let curLevel = 0;
			let matched;
			let i;

			do {
				this.lookahead.lastIndex = w.nextMatch;

				const match = this.lookahead.exec(w.source);

				matched = match && match.index === w.nextMatch;

				if (matched) {
					const newType  = match[2] ? 'ol' : 'ul';
					const newLevel = match[0].length;

					w.nextMatch += match[0].length;

					if (newLevel > curLevel) {
						for (i = curLevel; i < newLevel; ++i) {
							destStack.push(
								jQuery(document.createElement(newType))
									.appendTo(destStack[destStack.length - 1])
									.get(0)
							);
						}
					}
					else if (newLevel < curLevel) {
						for (i = curLevel; i > newLevel; --i) {
							destStack.pop();
						}
					}
					else if (newLevel === curLevel && newType !== curType) {
						destStack.pop();
						destStack.push(
							jQuery(document.createElement(newType))
								.appendTo(destStack[destStack.length - 1])
								.get(0)
						);
					}

					curLevel = newLevel;
					curType = newType;
					w.subWikify(
						jQuery(document.createElement('li'))
							.appendTo(destStack[destStack.length - 1])
							.get(0),
						this.terminator
					);
				}
			} while (matched);
		}
	});

	Wikifier.Parser.add({
		name      : 'commentByBlock',
		profiles  : ['core'],
		match     : '(?:/(?:%|\\*))|(?:<!--)',
		lookahead : /(?:\/(%|\*)(?:(?:.|\n)*?)\1\/)|(?:<!--(?:(?:.|\n)*?)-->)/gm,

		handler(w) {
			this.lookahead.lastIndex = w.matchStart;

			const match = this.lookahead.exec(w.source);

			if (match && match.index === w.matchStart) {
				w.nextMatch = this.lookahead.lastIndex;
			}
		}
	});

	Wikifier.Parser.add({
		name     : 'lineContinuation',
		profiles : ['core'],

		// WARNING: The ordering here is important: end-of-line, start-of-line, end-of-string, start-of-string.
		match : `\\\\${Patterns.spaceNoTerminator}*\\n|\\n${Patterns.spaceNoTerminator}*\\\\|\\n?\\\\${Patterns.spaceNoTerminator}*$|^${Patterns.spaceNoTerminator}*\\\\\\n?`,

		handler(w) {
			w.nextMatch = w.matchStart + w.matchLength;
		}
	});

	Wikifier.Parser.add({
		name     : 'lineBreak',
		profiles : ['core'],
		match    : '\\n|<[Bb][Rr]\\s*/?>',

		handler(w) {
			if (!w.options.nobr) {
				jQuery(document.createElement('br')).appendTo(w.output);
			}
		}
	});

	Wikifier.Parser.add({
		name     : 'htmlCharacterReference',
		profiles : ['core'],
		match    : '(?:(?:&#?[0-9A-Za-z]{2,8};|.)(?:&#?(?:x0*(?:3[0-6][0-9A-Fa-f]|1D[C-Fc-f][0-9A-Fa-f]|20[D-Fd-f][0-9A-Fa-f]|FE2[0-9A-Fa-f])|0*(?:76[89]|7[7-9][0-9]|8[0-7][0-9]|761[6-9]|76[2-7][0-9]|84[0-3][0-9]|844[0-7]|6505[6-9]|6506[0-9]|6507[0-1]));)+|&#?[0-9A-Za-z]{2,8};)',

		handler(w) {
			jQuery(document.createDocumentFragment())
				.append(w.matchText)
				.appendTo(w.output);
		}
	});

	Wikifier.Parser.add({
		name     : 'xmlProlog',
		profiles : ['core'],
		match    : '<\\?[Xx][Mm][Ll][^>]*\\?>',

		handler(w) {
			w.nextMatch = w.matchStart + w.matchLength;
		}
	});

	Wikifier.Parser.add({
		name      : 'verbatimHtml',
		profiles  : ['core'],
		match     : '<[Hh][Tt][Mm][Ll]>',
		lookahead : /<[Hh][Tt][Mm][Ll]>((?:.|\n)*?)<\/[Hh][Tt][Mm][Ll]>/gm,
		handler   : _verbatimTagHandler
	});

	Wikifier.Parser.add({
		name      : 'verbatimScriptTag',
		profiles  : ['core'],
		match     : '<[Ss][Cc][Rr][Ii][Pp][Tt][^>]*>',
		lookahead : /(<[Ss][Cc][Rr][Ii][Pp][Tt]*>(?:.|\n)*?<\/[Ss][Cc][Rr][Ii][Pp][Tt]>)/gm,
		handler   : _verbatimTagHandler
	});

	Wikifier.Parser.add({
		name           : 'styleTag',
		profiles       : ['core'],
		match          : '<[Ss][Tt][Yy][Ll][Ee][^>]*>',
		lookahead      : /(<[Ss][Tt][Yy][Ll][Ee]*>)((?:.|\n)*?)(<\/[Ss][Tt][Yy][Ll][Ee]>)/gm,
		imageMarkup    : new RegExp(Patterns.cssImage, 'g'),
		hasImageMarkup : new RegExp(Patterns.cssImage),

		handler(w) {
			this.lookahead.lastIndex = w.matchStart;

			const match = this.lookahead.exec(w.source);

			if (match && match.index === w.matchStart) {
				w.nextMatch = this.lookahead.lastIndex;

				let css = match[2];

				// Check for wiki image transclusion.
				if (this.hasImageMarkup.test(css)) {
					this.imageMarkup.lastIndex = 0;

					css = css.replace(this.imageMarkup, wikiImage => {
						const markup = Wikifier.helpers.parseSquareBracketedMarkup({
							source     : wikiImage,
							matchStart : 0
						});

						if (markup.hasOwnProperty('error') || markup.pos < wikiImage.length) {
							return wikiImage;
						}

						let source = markup.source;

						// Handle image passage transclusion.
						if (source.slice(0, 5) !== 'data:' && Story.has(source)) {
							const passage = Story.get(source);

							if (passage.tags.includes('Twine.image')) {
								source = passage.text;
							}
						}

						/*
							The source may be URI- or Base64-encoded, so we cannot use `encodeURIComponent()`
							here.  Instead, we simply encode any double quotes, since the URI will be
							delimited by them.
						*/
						return `url("${source.replace(/"/g, '%22')}")`;
					});
				}

				jQuery(document.createDocumentFragment())
					.append(match[1] + css + match[3])
					.appendTo(w.output);
			}
		}
	});

	Wikifier.Parser.add({
		name      : 'svgTag',
		profiles  : ['core'],
		match     : '<[Ss][Vv][Gg][^>]*>',
		lookahead : /<(\/?)[Ss][Vv][Gg][^>]*>/gm,
		namespace : 'http://www.w3.org/2000/svg',

		handler(w) {
			this.lookahead.lastIndex = w.nextMatch;

			let depth = 1;
			let match;

			while (depth > 0 && (match = this.lookahead.exec(w.source)) !== null) {
				depth += match[1] === '/' ? -1 : 1;
			}

			if (depth === 0) {
				w.nextMatch = this.lookahead.lastIndex;

				const svgTag = w.source.slice(w.matchStart, this.lookahead.lastIndex);
				const $frag  = jQuery(document.createDocumentFragment()).append(svgTag);

				// Postprocess the relevant SVG element nodes.
				$frag.find('a[data-passage],image[data-passage]').each((_, el) => {
					const tagName = el.tagName.toLowerCase();

					try {
						this.processAttributeDirectives(el);
					}
					catch (ex) {
						return throwError(
							w.output,
							`svg|<${tagName}>: ${ex.message}`,
							`${w.matchText}\u2026`
						);
					}

					if (el.hasAttribute('data-passage')) {
						this.processDataAttributes(el, tagName);
					}
				});

				$frag.appendTo(w.output);
			}
		},

		processAttributeDirectives(el) {
			// NOTE: The `.attributes` property yields a live collection, so we
			// must make a non-live copy of it as we will be adding and removing
			// members of said collection if any directives are found.
			[...el.attributes].forEach(({ name, value }) => {
				const evalShorthand = name[0] === '@';

				if (evalShorthand || name.startsWith('sc-eval:')) {
					const newName = name.slice(evalShorthand ? 1 : 8); // Remove eval directive prefix.

					if (newName === 'data-setter') {
						throw new Error(`evaluation directive is not allowed on the data-setter attribute: "${name}"`);
					}

					let result;

					// Evaluate the value as TwineScript.
					try {
						result = Scripting.evalTwineScript(value);
					}
					catch (ex) {
						throw new Error(`bad evaluation from attribute directive "${name}": ${ex.message}`);
					}

					// Assign the result to the new attribute and remove the old one.
					try {
						/*
							NOTE: Most browsers (ca. Nov 2017) have broken `setAttribute()`
							method implementations that throw on attribute names that start
							with, or contain, various symbols that are completely valid per
							the specification.  Thus this code could fail if the user chooses
							attribute names that, after removing the directive prefix, are
							unpalatable to `setAttribute()`.
						*/
						el.setAttribute(newName, result);
						el.removeAttribute(name);
					}
					catch (ex) {
						throw new Error(`cannot transform attribute directive "${name}" into attribute "${newName}"`);
					}
				}
			});
		},

		processDataAttributes(el, tagName) {
			let passage = el.getAttribute('data-passage');

			if (passage == null) { // lazy equality for null
				return;
			}

			const evaluated = Wikifier.helpers.evalPassageId(passage);

			if (evaluated !== passage) {
				passage = evaluated;
				el.setAttribute('data-passage', evaluated);
			}

			if (passage !== '') {
				// '<image>' element, so attempt media passage transclusion.
				if (tagName === 'image') {
					if (passage.slice(0, 5) !== 'data:' && Story.has(passage)) {
						passage = Story.get(passage);

						if (passage.tags.includes('Twine.image')) {
							// NOTE: SVG `.href` IDL attribute is read-only,
							// so set its `href` content attribute instead.
							el.setAttribute('href', passage.text.trim());
						}
					}
				}

				// Elsewise, assume a link element of some type—e.g., '<a>'.
				else {
					let setter = el.getAttribute('data-setter');
					let setFn;

					if (setter != null) { // lazy equality for null
						setter = String(setter).trim();

						if (setter !== '') {
							setFn = Wikifier.helpers.createShadowSetterCallback(Scripting.parse(setter));
						}
					}

					if (Story.has(passage)) {
						el.classList.add('link-internal');

						if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
							el.classList.add('link-visited');
						}
					}
					else {
						el.classList.add('link-broken');
					}

					jQuery(el).ariaClick({ one : true }, function () {
						if (typeof setFn === 'function') {
							setFn.call(this);
						}

						Engine.play(passage);
					});
				}
			}
		}
	});

	Wikifier.Parser.add({
		/*
			NOTE: This parser MUST come after any parser which handles HTML tag-
			like constructs—e.g. 'verbatimText', 'horizontalRule', 'lineBreak',
			'xmlProlog', 'verbatimHtml', 'verbatimSvgTag', 'verbatimScriptTag',
			and 'styleTag'.
		*/
		name      : 'htmlTag',
		profiles  : ['core'],
		match     : `<${Patterns.htmlTagName}(?:\\s+[^\\u0000-\\u001F\\u007F-\\u009F\\s"'>\\/=]+(?:\\s*=\\s*(?:"[^"]*?"|'[^']*?'|[^\\s"'=<>\`]+))?)*\\s*\\/?>`,
		tagRe     : new RegExp(`^<(${Patterns.htmlTagName})`),
		mediaTags : ['audio', 'img', 'source', 'track', 'video'], // NOTE: The `<picture>` element should not be in this list.
		nobrTags  : ['audio', 'colgroup', 'datalist', 'dl', 'figure', 'meter', 'ol', 'optgroup', 'picture', 'progress', 'ruby', 'select', 'table', 'tbody', 'tfoot', 'thead', 'tr', 'ul', 'video'],
		voidTags  : ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'],

		handler(w) {
			const tagMatch = this.tagRe.exec(w.matchText);
			const tag      = tagMatch && tagMatch[1];
			const tagName  = tag && tag.toLowerCase();

			if (tagName) {
				const isVoid = this.voidTags.includes(tagName) || w.matchText.endsWith('/>');
				const isNobr = this.nobrTags.includes(tagName);
				let terminator;
				let terminatorMatch;

				if (!isVoid) {
					terminator = `<\\/${tagName}\\s*>`;

					const terminatorRe = new RegExp(terminator, 'gim'); // ignore case during match

					terminatorRe.lastIndex = w.matchStart;
					terminatorMatch = terminatorRe.exec(w.source);
				}

				if (isVoid || terminatorMatch) {
					let output    = w.output;
					let el        = document.createElement(w.output.tagName);
					let debugView;

					el.innerHTML = w.matchText;

					/*
						NOTE: The use of a `while` statement here is curious, however,
						I'm hesitant to change it for fear of breaking some edge case.
					*/
					while (el.firstChild) {
						el = el.firstChild;
					}

					try {
						this.processAttributeDirectives(el);
					}
					catch (ex) {
						return throwError(
							w.output,
							`<${tagName}>: ${ex.message}`,
							`${w.matchText}\u2026`
						);
					}

					if (el.hasAttribute('data-passage')) {
						this.processDataAttributes(el, tagName);

						// Debug view setup.
						if (Config.debug) {
							debugView = new DebugView(
								w.output,
								`html-${tagName}`,
								tagName,
								w.matchText
							);
							debugView.modes({
								block   : tagName === 'img',
								nonvoid : terminatorMatch
							});
							output = debugView.output;
						}
					}

					if (terminatorMatch) {
						/*
							NOTE: There's no catch clause here because this try/finally exists
							solely to ensure that the options stack is properly restored in
							the event that an uncaught exception is thrown during the call to
							`subWikify()`.
						*/
						try {
							Wikifier.Option.push({ nobr : isNobr });
							w.subWikify(el, terminator, { ignoreTerminatorCase : true });
						}
						finally {
							Wikifier.Option.pop();
						}

						/*
							Debug view modification.  If the current element has any debug
							view descendants who have "block" mode set, then set its debug
							view to the same.  It just makes things look a bit nicer.
						*/
						if (debugView && jQuery(el).find('.debug.block').length > 0) {
							debugView.modes({ block : true });
						}
					}

					/*
						NOTE: The use of `cloneNode(true)` here for `<track>` elements
						is necessary to workaround a poorly understood rehoming issue.
					*/
					output.appendChild(tagName === 'track' ? el.cloneNode(true) : el);
				}
				else {
					return throwError(
						w.output,
						`cannot find a closing tag for HTML <${tag}>`,
						`${w.matchText}\u2026`
					);
				}
			}
		},

		processAttributeDirectives(el) {
			// NOTE: The `.attributes` property yields a live collection, so we
			// must make a non-live copy of it as we will be adding and removing
			// members of said collection if any directives are found.
			[...el.attributes].forEach(({ name, value }) => {
				const evalShorthand = name[0] === '@';

				if (evalShorthand || name.startsWith('sc-eval:')) {
					const newName = name.slice(evalShorthand ? 1 : 8); // Remove eval directive prefix.

					if (newName === 'data-setter') {
						throw new Error(`evaluation directive is not allowed on the data-setter attribute: "${name}"`);
					}

					let result;

					// Evaluate the value as TwineScript.
					try {
						result = Scripting.evalTwineScript(value);
					}
					catch (ex) {
						throw new Error(`bad evaluation from attribute directive "${name}": ${ex.message}`);
					}

					// Assign the result to the new attribute and remove the old one.
					try {
						/*
							NOTE: Most browsers (ca. Nov 2017) have broken `setAttribute()`
							method implementations that throw on attribute names that start
							with, or contain, various symbols that are completely valid per
							the specification.  Thus this code could fail if the user chooses
							attribute names that, after removing the directive prefix, are
							unpalatable to `setAttribute()`.
						*/
						el.setAttribute(newName, result);
						el.removeAttribute(name);
					}
					catch (ex) {
						throw new Error(`cannot transform attribute directive "${name}" into attribute "${newName}"`);
					}
				}
			});
		},

		processDataAttributes(el, tagName) {
			let passage = el.getAttribute('data-passage');

			if (passage == null) { // lazy equality for null
				return;
			}

			const evaluated = Wikifier.helpers.evalPassageId(passage);

			if (evaluated !== passage) {
				passage = evaluated;
				el.setAttribute('data-passage', evaluated);
			}

			if (passage !== '') {
				// Media element, so attempt media passage transclusion.
				if (this.mediaTags.includes(tagName)) {
					if (passage.slice(0, 5) !== 'data:' && Story.has(passage)) {
						passage = Story.get(passage);

						let parentName;
						let twineTag;

						switch (tagName) {
						case 'audio':
						case 'video':
							twineTag = `Twine.${tagName}`;
							break;
						case 'img':
							twineTag = 'Twine.image';
							break;
						case 'track':
							twineTag = 'Twine.vtt';
							break;
						case 'source':
							{
								const $parent = $(el).closest('audio,picture,video');

								if ($parent.length) {
									parentName = $parent.get(0).tagName.toLowerCase();
									twineTag = `Twine.${parentName === 'picture' ? 'image' : parentName}`;
								}
							}
							break;
						}

						if (passage.tags.includes(twineTag)) {
							el[parentName === 'picture' ? 'srcset' : 'src'] = passage.text.trim();
						}
					}
				}

				// Elsewise, assume a link element of some type—e.g., '<a>', '<area>', '<button>', etc.
				else {
					let setter = el.getAttribute('data-setter');
					let setFn;

					if (setter != null) { // lazy equality for null
						setter = String(setter).trim();

						if (setter !== '') {
							setFn = Wikifier.helpers.createShadowSetterCallback(Scripting.parse(setter));
						}
					}

					if (Story.has(passage)) {
						el.classList.add('link-internal');

						if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
							el.classList.add('link-visited');
						}
					}
					else {
						el.classList.add('link-broken');
					}

					jQuery(el).ariaClick({ one : true }, function () {
						if (typeof setFn === 'function') {
							setFn.call(this);
						}

						Engine.play(passage);
					});
				}
			}
		}
	});
})();
