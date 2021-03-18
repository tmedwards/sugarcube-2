/***********************************************************************************************************************

	macros/macrolib.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Config, DebugView, Engine, Has, L10n, Macro, NodeTyper, Patterns, Scripting, SimpleAudio, State,
	       Story, TempState, Util, Wikifier, postdisplay, prehistory, storage, stringFrom
*/

(() => {
	'use strict';

	/*******************************************************************************************************************
		Variables Macros.
	*******************************************************************************************************************/
	/*
		<<capture>>
	*/
	Macro.add('capture', {
		skipArgs : true,
		tags     : null,
		tsVarRe  : new RegExp(`(${Patterns.variable})`,'g'),

		handler() {
			if (this.args.raw.length === 0) {
				return this.error('no story/temporary variable list specified');
			}

			const valueCache = {};

			/*
				There's no catch clause because this try/finally is here simply to ensure that
				proper cleanup is done in the event that an exception is thrown during the
				`Wikifier` call.
			*/
			try {
				const tsVarRe = this.self.tsVarRe;
				let match;

				/*
					Cache the existing values of the variables and add a shadow.
				*/
				while ((match = tsVarRe.exec(this.args.raw)) !== null) {
					const varName = match[1];
					const varKey  = varName.slice(1);
					const store   = varName[0] === '$' ? State.variables : State.temporary;

					if (store.hasOwnProperty(varKey)) {
						valueCache[varKey] = store[varKey];
					}

					this.addShadow(varName);
				}

				new Wikifier(this.output, this.payload[0].contents);
			}
			finally {
				// Revert the variable shadowing.
				this.shadows.forEach(varName => {
					const varKey = varName.slice(1);
					const store  = varName[0] === '$' ? State.variables : State.temporary;

					if (valueCache.hasOwnProperty(varKey)) {
						store[varKey] = valueCache[varKey];
					}
					else {
						delete store[varKey];
					}
				});
			}
		}
	});

	/*
		<<set>>
	*/
	Macro.add('set', {
		skipArgs : true,

		handler() {
			if (this.args.full.length === 0) {
				return this.error('no expression specified');
			}

			try {
				Scripting.evalJavaScript(this.args.full);
			}
			catch (ex) {
				return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<unset>>
	*/
	Macro.add('unset', {
		skipArgs : true,
		jsVarRe  : new RegExp(
			`State\\.(variables|temporary)\\.(${Patterns.identifier})`,
			'g'
		),

		handler() {
			if (this.args.full.length === 0) {
				return this.error('no story/temporary variable list specified');
			}

			const jsVarRe = this.self.jsVarRe;
			let match;

			while ((match = jsVarRe.exec(this.args.full)) !== null) {
				const store = State[match[1]];
				const name  = match[2];

				if (store.hasOwnProperty(name)) {
					delete store[name];
				}
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<remember>>
	*/
	Macro.add('remember', {
		skipArgs : true,
		jsVarRe  : new RegExp(`State\\.variables\\.(${Patterns.identifier})`, 'g'),

		handler() {
			if (this.args.full.length === 0) {
				return this.error('no expression specified');
			}

			try {
				Scripting.evalJavaScript(this.args.full);
			}
			catch (ex) {
				return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
			}

			const remember = storage.get('remember') || {};
			const jsVarRe  = this.self.jsVarRe;
			let match;

			while ((match = jsVarRe.exec(this.args.full)) !== null) {
				const name = match[1];
				remember[name] = State.variables[name];
			}

			if (!storage.set('remember', remember)) {
				return this.error(`unknown error, cannot remember: ${this.args.raw}`);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		},

		init() {
			const remember = storage.get('remember');

			if (remember) {
				Object.keys(remember).forEach(name => State.variables[name] = remember[name]);
			}
		}
	});

	/*
		<<forget>>
	*/
	Macro.add('forget', {
		skipArgs : true,
		jsVarRe  : new RegExp(`State\\.variables\\.(${Patterns.identifier})`, 'g'),

		handler() {
			if (this.args.full.length === 0) {
				return this.error('no story variable list specified');
			}

			const remember = storage.get('remember');
			const jsVarRe  = this.self.jsVarRe;
			let match;
			let needStore = false;

			while ((match = jsVarRe.exec(this.args.full)) !== null) {
				const name = match[1];

				if (State.variables.hasOwnProperty(name)) {
					delete State.variables[name];
				}

				if (remember && remember.hasOwnProperty(name)) {
					needStore = true;
					delete remember[name];
				}
			}

			if (needStore) {
				if (Object.keys(remember).length === 0) {
					if (!storage.delete('remember')) {
						return this.error('unknown error, cannot update remember store');
					}
				}
				else if (!storage.set('remember', remember)) {
					return this.error('unknown error, cannot update remember store');
				}
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});


	/*******************************************************************************************************************
		Scripting Macros.
	*******************************************************************************************************************/
	/*
		<<run>>
	*/
	Macro.add('run', 'set'); // add <<run>> as an alias of <<set>>

	/*
		<<script>>
	*/
	Macro.add('script', {
		skipArgs : true,
		tags     : null,

		handler() {
			const output = document.createDocumentFragment();

			try {
				Scripting.evalJavaScript(this.payload[0].contents, output);
			}
			catch (ex) {
				return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.createDebugView();
			}

			if (output.hasChildNodes()) {
				this.output.appendChild(output);
			}
		}
	});


	/*******************************************************************************************************************
		Display Macros.
	*******************************************************************************************************************/
	/*
		<<include>>
	*/
	Macro.add('include', {
		handler() {
			if (this.args.length === 0) {
				return this.error('no passage specified');
			}

			let passage;

			if (typeof this.args[0] === 'object') {
				// Argument was in wiki link syntax.
				passage = this.args[0].link;
			}
			else {
				// Argument was simply the passage name.
				passage = this.args[0];
			}

			if (!Story.has(passage)) {
				return this.error(`passage "${passage}" does not exist`);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			passage = Story.get(passage);
			let $el;

			if (this.args[1]) {
				$el = jQuery(document.createElement(this.args[1]))
					.addClass(`${passage.domId} macro-${this.name}`)
					.attr('data-passage', passage.title)
					.appendTo(this.output);
			}
			else {
				$el = jQuery(this.output);
			}

			$el.wiki(passage.processText());
		}
	});

	/*
		<<nobr>>
	*/
	Macro.add('nobr', {
		skipArgs : true,
		tags     : null,

		handler() {
			/*
				Wikify the contents, after removing all leading & trailing newlines and compacting
				all internal sequences of newlines into single spaces.
			*/
			new Wikifier(this.output, this.payload[0].contents.replace(/^\n+|\n+$/g, '').replace(/\n+/g, ' '));
		}
	});

	/*
		<<print>>, <<=>>, & <<->>
	*/
	Macro.add(['print', '=', '-'], {
		skipArgs : true,

		handler() {
			if (this.args.full.length === 0) {
				return this.error('no expression specified');
			}

			try {
				const result = stringFrom(Scripting.evalJavaScript(this.args.full));

				if (result !== null) {
					new Wikifier(this.output, this.name === '-' ? Util.escape(result) : result);
				}
			}
			catch (ex) {
				return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
			}
		}
	});

	/*
		<<silently>>
	*/
	Macro.add('silently', {
		skipArgs : true,
		tags     : null,

		handler() {
			const frag = document.createDocumentFragment();
			new Wikifier(frag, this.payload[0].contents.trim());

			if (Config.debug) {
				// Custom debug view setup.
				this.debugView.modes({ block : true, hidden : true });
				this.output.appendChild(frag);
			}
			else {
				// Discard the output, unless there were errors.
				const errList = [...frag.querySelectorAll('.error')].map(errEl => errEl.textContent);

				if (errList.length > 0) {
					return this.error(`error${errList.length === 1 ? '' : 's'} within contents (${errList.join('; ')})`);
				}
			}
		}
	});

	/*
		<<type speed [start delay] [class classes] [element tag] [id ID] [keep|none] [skipkey key]>>
	*/
	Macro.add('type', {
		isAsync : true,
		tags    : null,
		typeId  : 0,

		handler() {
			if (this.args.length === 0) {
				return this.error('no speed specified');
			}

			const speed = Util.fromCssTime(this.args[0]); // in milliseconds

			if (speed < 0) {
				return this.error(`speed time value must be non-negative (received: ${this.args[0]})`);
			}

			let cursor;
			let elClass = '';
			let elId    = '';
			let elTag   = 'div';
			let skipKey = Config.macros.typeSkipKey;
			let start   = 400; // in milliseconds

			// Process optional arguments.
			const options = this.args.slice(1);

			while (options.length > 0) {
				const option = options.shift();

				switch (option) {
				case 'class': {
					if (options.length === 0) {
						return this.error('class option missing required class name(s)');
					}

					elClass = options.shift();

					if (elClass === '') {
						throw new Error('class option class name(s) must be non-empty (received: "")');
					}

					break;
				}

				case 'element': {
					if (options.length === 0) {
						return this.error('element option missing required element tag name');
					}

					elTag = options.shift();

					if (elTag === '') {
						throw new Error('element option tag name must be non-empty (received: "")');
					}

					break;
				}

				case 'id': {
					if (options.length === 0) {
						return this.error('id option missing required ID');
					}

					elId = options.shift();

					if (elId === '') {
						throw new Error('id option ID must be non-empty (received: "")');
					}

					break;
				}

				case 'keep':
					cursor = 'keep';
					break;

				case 'none':
					cursor = 'none';
					break;

				case 'skipkey': {
					if (options.length === 0) {
						return this.error('skipkey option missing required key value');
					}

					skipKey = options.shift();

					if (skipKey === '') {
						throw new Error('skipkey option key value must be non-empty (received: "")');
					}

					break;
				}

				case 'start': {
					if (options.length === 0) {
						return this.error('start option missing required time value');
					}

					const value = options.shift();
					start = Util.fromCssTime(value);

					if (start < 0) {
						throw new Error(`start option time value must be non-negative (received: ${value})`);
					}

					break;
				}

				default:
					return this.error(`unknown option: ${option}`);
				}
			}

			const contents = this.payload[0].contents;

			// Do nothing if there's no content to type out.
			if (contents.trim() === '') {
				return;
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			// Set up our base class name and event namespace.
			const className = `macro-${this.name}`;
			const namespace = `.${className}`;

			// Create a target to be later replaced by the typing wrapper.
			const $target = jQuery(document.createElement(elTag))
				.addClass(`${className} ${className}-target`)
				.appendTo(this.output);

			// Initialize the queue and clean up handlers.
			if (!TempState.macroTypeQueue) {
				// Set up the typing handler queue for all invocations.
				TempState.macroTypeQueue = [];

				// Immediately clear any existing handlers from our namespace and set up a
				// `:passageinit` event handler to clean up after navigation.
				$(document)
					.off(namespace)
					.one(`:passageinit${namespace}`, () => $(document).off(namespace));
			}

			// If the queue is empty at this point, set the start typing flag.
			const startTyping = TempState.macroTypeQueue.length === 0;

			// Generate our unique ID.
			const selfId = ++this.self.typeId;

			// Push our typing handler onto the queue.
			TempState.macroTypeQueue.push({
				id : selfId,

				handler() {
					const $wrapper = jQuery(document.createElement(elTag))
						.addClass(className);

					// Add the user ID, if any.
					if (elId) {
						$wrapper.attr('id', elId);
					}

					// Add the user class(es), if any.
					if (elClass) {
						$wrapper.addClass(elClass);
					}

					// Wikify the contents into `$wrapper`.
					new Wikifier($wrapper, contents);

					// Cache info about the current turn.
					const passage = State.passage;
					const turn    = State.turns;

					// Skip typing if….
					if (
						// …we've visited the passage before.
						!Config.macros.typeVisitedPassages
						&& State.passages.slice(0, -1).some(title => title === passage)

						// …there were any content errors.
						|| $wrapper.find('.error').length > 0
					) {
						$target.replaceWith($wrapper);

						// Remove this handler from the queue.
						TempState.macroTypeQueue.shift();

						// Run the next typing handler in the queue, if any.
						if (TempState.macroTypeQueue.length > 0) {
							TempState.macroTypeQueue.first().handler();
						}

						// Exit.
						return;
					}

					// Create a new `NodeTyper` instance for the wrapper's contents and
					// replace the target with the typing wrapper.
					const typer = new NodeTyper({
						targetNode : $wrapper.get(0),
						classNames : cursor === 'none' ? null : `${className}-cursor`
					});
					$target.replaceWith($wrapper);

					// Set up event IDs.
					const typingCompleteId = ':typingcomplete';
					const typingStartId    = ':typingstart';
					const typingStopId     = ':typingstop';
					const keydownAndNS     = `keydown${namespace}`;
					const typingStopAndNS  = `${typingStopId}${namespace}`;

					// Set up handlers for spacebar aborting and continuations.
					$(document)
						.off(keydownAndNS)
						.on(keydownAndNS, ev => {
							// Finish typing if the player aborts via the skip key.
							if (
								Util.scrubEventKey(ev.key) === skipKey
								&& (ev.target === document.body || ev.target === document.documentElement)
							) {
								ev.preventDefault();
								$(document).off(keydownAndNS);
								typer.finish();
							}
						})
						.one(typingStopAndNS, () => {
							if (TempState.macroTypeQueue) {
								// If the queue is empty, fire the typing complete event.
								if (TempState.macroTypeQueue.length === 0) {
									jQuery.event.trigger(typingCompleteId);
								}
								// Elsewise, run the next typing handler in the queue.
								else {
									TempState.macroTypeQueue.first().handler();
								}
							}
						});

					// Set up the typing interval and start/stop event firing.
					const typeNode = function typeNode() {
						const typeNodeMember = function typeNodeMember(typeIntervalId) {
							// Stop typing if….
							if (
								// …we've navigated away.
								State.passage !== passage
								|| State.turns !== turn

								// …we're done typing.
								|| !typer.type()
							) {
								// Terminate the timer, if it exists.
								if (typeIntervalId) {
									clearInterval(typeIntervalId);
								}

								// Remove this handler from the queue, if the queue still exists and the
								// handler IDs match.
								if (
									TempState.macroTypeQueue
									&& TempState.macroTypeQueue.length > 0
									&& TempState.macroTypeQueue.first().id === selfId
								) {
									TempState.macroTypeQueue.shift();
								}

								// Fire the typing stop event.
								$wrapper.trigger(typingStopId);

								// Add the done class to the wrapper.
								$wrapper.addClass(`${className}-done`);

								// Add the cursor class to the wrapper, if we're keeping it.
								if (cursor === 'keep') {
									$wrapper.addClass(`${className}-cursor`);
								}
							}
						};

						// Fire the typing start event.
						$wrapper.trigger(typingStartId);

						// Type the initial node member.
						typeNodeMember();

						// Set up the interval to continue typing.
						const typeNodeMemberId = setInterval(() => typeNodeMember(typeNodeMemberId), speed);
					};

					// Kick off typing the node.
					if (start) {
						setTimeout(typeNode, start);
					}
					else {
						typeNode();
					}
				}
			});

			// If we're to start typing, then either set up a `:passageend` event handler
			// to do so or start it immediately, depending on the engine state.
			if (startTyping) {
				if (Engine.isPlaying()) {
					$(document).one(`:passageend${namespace}`, () => TempState.macroTypeQueue.first().handler());
				}
				else {
					TempState.macroTypeQueue.first().handler();
				}
			}
		}
	});

	/*
		[DEPRECATED] <<display>>
	*/
	Macro.add('display', 'include'); // add <<display>> as an alias of <<include>>


	/*******************************************************************************************************************
		Control Macros.
	*******************************************************************************************************************/
	/*
		<<if>>, <<elseif>>, & <<else>>
	*/
	Macro.add('if', {
		skipArgs   : true,
		tags       : ['elseif', 'else'],
		elseifWsRe : /^\s*if\b/i,
		ifAssignRe : /[^!=&^|<>*/%+-]=[^=>]/,

		handler() {
			let i;

			try {
				const len = this.payload.length;

				// Sanity checks.
				const elseifWsRe = this.self.elseifWsRe;
				const ifAssignRe = this.self.ifAssignRe;

				for (/* declared previously */ i = 0; i < len; ++i) {
					/* eslint-disable prefer-template */
					switch (this.payload[i].name) {
					case 'else':
						if (this.payload[i].args.raw.length > 0) {
							if (elseifWsRe.test(this.payload[i].args.raw)) {
								return this.error(`whitespace is not allowed between the "else" and "if" in <<elseif>> clause${i > 0 ? ' (#' + i + ')' : ''}`);
							}

							return this.error(`<<else>> does not accept a conditional expression (perhaps you meant to use <<elseif>>), invalid: ${this.payload[i].args.raw}`);
						}

						if (i + 1 !== len) {
							return this.error('<<else>> must be the final clause');
						}
						break;

					default:
						if (this.payload[i].args.full.length === 0) {
							return this.error(`no conditional expression specified for <<${this.payload[i].name}>> clause${i > 0 ? ' (#' + i + ')' : ''}`);
						}
						else if (
							   Config.macros.ifAssignmentError
							&& ifAssignRe.test(this.payload[i].args.full)
						) {
							return this.error(`assignment operator found within <<${this.payload[i].name}>> clause${i > 0 ? ' (#' + i + ')' : ''} (perhaps you meant to use an equality operator: ==, ===, eq, is), invalid: ${this.payload[i].args.raw}`);
						}
						break;
					}
					/* eslint-enable prefer-template */
				}

				const evalJavaScript = Scripting.evalJavaScript;
				let success = false;

				// Evaluate the clauses.
				for (/* declared previously */ i = 0; i < len; ++i) {
					// Custom debug view setup for the current clause.
					if (Config.debug) {
						this
							.createDebugView(this.payload[i].name, this.payload[i].source)
							.modes({ nonvoid : false });
					}

					// Conditional test.
					if (this.payload[i].name === 'else' || !!evalJavaScript(this.payload[i].args.full)) {
						success = true;
						new Wikifier(this.output, this.payload[i].contents);
						break;
					}
					else if (Config.debug) {
						// Custom debug view setup for a failed conditional.
						this.debugView.modes({
							hidden  : true,
							invalid : true
						});
					}
				}

				// Custom debug view setup for the remaining clauses.
				if (Config.debug) {
					for (++i; i < len; ++i) {
						this
							.createDebugView(this.payload[i].name, this.payload[i].source)
							.modes({
								nonvoid : false,
								hidden  : true,
								invalid : true
							});
					}

					/*
						Fake a debug view for `<</if>>`.  We do this to aid the checking of nesting
						and as a quick indicator of if any of the clauses matched.
					*/
					this
						.createDebugView(`/${this.name}`, `<</${this.name}>>`)
						.modes({
							nonvoid : false,
							hidden  : !success,
							invalid : !success
						});
				}
			}
			catch (ex) {
				return this.error(`bad conditional expression in <<${i === 0 ? 'if' : 'elseif'}>> clause${i > 0 ? ' (#' + i + ')' : ''}: ${typeof ex === 'object' ? ex.message : ex}`); // eslint-disable-line prefer-template
			}
		}
	});

	/*
		<<switch>>, <<case>>, & <<default>>
	*/
	Macro.add('switch', {
		skipArgs : ['switch'],
		tags     : ['case', 'default'],

		handler() {
			if (this.args.full.length === 0) {
				return this.error('no expression specified');
			}

			const len = this.payload.length;

			// if (len === 1 || !this.payload.some(p => p.name === 'case')) {
			if (len === 1) {
				return this.error('no cases specified');
			}

			let i;

			// Sanity checks.
			for (/* declared previously */ i = 1; i < len; ++i) {
				switch (this.payload[i].name) {
				case 'default':
					if (this.payload[i].args.length > 0) {
						return this.error(`<<default>> does not accept values, invalid: ${this.payload[i].args.raw}`);
					}

					if (i + 1 !== len) {
						return this.error('<<default>> must be the final case');
					}
					break;

				default:
					if (this.payload[i].args.length === 0) {
						return this.error(`no value(s) specified for <<${this.payload[i].name}>> (#${i})`);
					}
					break;
				}
			}

			let result;

			try {
				result = Scripting.evalJavaScript(this.args.full);
			}
			catch (ex) {
				return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
			}

			const debugView = this.debugView; // cache it now, to be modified later
			let success = false;

			// Initial debug view setup for `<<switch>>`.
			if (Config.debug) {
				debugView
					.modes({
						nonvoid : false,
						hidden  : true
					});
			}

			// Evaluate the clauses.
			for (/* declared previously */ i = 1; i < len; ++i) {
				// Custom debug view setup for the current case.
				if (Config.debug) {
					this
						.createDebugView(this.payload[i].name, this.payload[i].source)
						.modes({ nonvoid : false });
				}

				// Case test(s).
				if (this.payload[i].name === 'default' || this.payload[i].args.some(val => val === result)) {
					success = true;
					new Wikifier(this.output, this.payload[i].contents);
					break;
				}
				else if (Config.debug) {
					// Custom debug view setup for a failed case.
					this.debugView.modes({
						hidden  : true,
						invalid : true
					});
				}
			}

			// Custom debug view setup for the remaining cases.
			if (Config.debug) {
				for (++i; i < len; ++i) {
					this
						.createDebugView(this.payload[i].name, this.payload[i].source)
						.modes({
							nonvoid : false,
							hidden  : true,
							invalid : true
						});
				}

				/*
					Finalize the debug view for `<<switch>>` and fake a debug view for `<</switch>>`.
					We do both as a quick indicator of if any of the cases matched and the latter
					to aid the checking of nesting.
				*/
				debugView
					.modes({
						nonvoid : false,
						hidden  : true, // !success,
						invalid : !success
					});
				this
					.createDebugView(`/${this.name}`, `<</${this.name}>>`)
					.modes({
						nonvoid : false,
						hidden  : true, // !success,
						invalid : !success
					});
			}
		}
	});

	/*
		<<for>>, <<break>>, & <<continue>>
	*/
	Macro.add('for', {
		/* eslint-disable max-len */
		skipArgs    : true,
		tags        : null,
		hasRangeRe  : new RegExp(`^\\S${Patterns.anyChar}*?\\s+range\\s+\\S${Patterns.anyChar}*?$`),
		rangeRe     : new RegExp(`^(?:State\\.(variables|temporary)\\.(${Patterns.identifier})\\s*,\\s*)?State\\.(variables|temporary)\\.(${Patterns.identifier})\\s+range\\s+(\\S${Patterns.anyChar}*?)$`),
		threePartRe : /^([^;]*?)\s*;\s*([^;]*?)\s*;\s*([^;]*?)$/,
		forInRe     : /^\S+\s+in\s+\S+/i,
		forOfRe     : /^\S+\s+of\s+\S+/i,
		/* eslint-enable max-len */

		handler() {
			const argsStr = this.args.full.trim();
			const payload = this.payload[0].contents.replace(/\n$/, '');

			// Empty form.
			if (argsStr.length === 0) {
				this.self.handleFor.call(this, payload, null, true, null);
			}

			// Range form.
			else if (this.self.hasRangeRe.test(argsStr)) {
				const parts = argsStr.match(this.self.rangeRe);

				if (parts === null) {
					return this.error('invalid range form syntax, format: [index ,] value range collection');
				}

				this.self.handleForRange.call(
					this,
					payload,
					{ type : parts[1], name : parts[2] },
					{ type : parts[3], name : parts[4] },
					parts[5]
				);
			}

			// Conditional forms.
			else {
				let init;
				let condition;
				let post;

				// Conditional-only form.
				if (argsStr.indexOf(';') === -1) {
					// Sanity checks.
					if (this.self.forInRe.test(argsStr)) {
						return this.error('invalid syntax, for…in is not supported; see: for…range');
					}
					else if (this.self.forOfRe.test(argsStr)) {
						return this.error('invalid syntax, for…of is not supported; see: for…range');
					}

					condition = argsStr;
				}

				// 3-part conditional form.
				else {
					const parts = argsStr.match(this.self.threePartRe);

					if (parts === null) {
						return this.error('invalid 3-part conditional form syntax, format: [init] ; [condition] ; [post]');
					}

					init      = parts[1];
					condition = parts[2].trim();
					post      = parts[3];

					if (condition.length === 0) {
						condition = true;
					}
				}

				this.self.handleFor.call(this, payload, init, condition, post);
			}
		},

		handleFor(payload, init, condition, post) {
			const evalJavaScript = Scripting.evalJavaScript;
			let first  = true;
			let safety = Config.macros.maxLoopIterations;

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			try {
				TempState.break = null;

				if (init) {
					try {
						evalJavaScript(init);
					}
					catch (ex) {
						return this.error(`bad init expression: ${typeof ex === 'object' ? ex.message : ex}`);
					}
				}

				while (evalJavaScript(condition)) {
					if (--safety < 0) {
						return this.error(`exceeded configured maximum loop iterations (${Config.macros.maxLoopIterations})`);
					}

					new Wikifier(this.output, first ? payload.replace(/^\n/, '') : payload);

					if (first) {
						first = false;
					}

					if (TempState.break != null) { // lazy equality for null
						if (TempState.break === 1) {
							TempState.break = null;
						}
						else if (TempState.break === 2) {
							TempState.break = null;
							break;
						}
					}

					if (post) {
						try {
							evalJavaScript(post);
						}
						catch (ex) {
							return this.error(`bad post expression: ${typeof ex === 'object' ? ex.message : ex}`);
						}
					}
				}
			}
			catch (ex) {
				return this.error(`bad conditional expression: ${typeof ex === 'object' ? ex.message : ex}`);
			}
			finally {
				TempState.break = null;
			}
		},

		handleForRange(payload, indexVar, valueVar, rangeExp) {
			let first     = true;
			let rangeList;

			try {
				rangeList = this.self.toRangeList(rangeExp);
			}
			catch (ex) {
				return this.error(ex.message);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			try {
				TempState.break = null;

				for (let i = 0; i < rangeList.length; ++i) {
					if (indexVar.name) {
						State[indexVar.type][indexVar.name] = rangeList[i][0];
					}

					State[valueVar.type][valueVar.name] = rangeList[i][1];

					new Wikifier(this.output, first ? payload.replace(/^\n/, '') : payload);

					if (first) {
						first = false;
					}

					if (TempState.break != null) { // lazy equality for null
						if (TempState.break === 1) {
							TempState.break = null;
						}
						else if (TempState.break === 2) {
							TempState.break = null;
							break;
						}
					}
				}
			}
			catch (ex) {
				return this.error(typeof ex === 'object' ? ex.message : ex);
			}
			finally {
				TempState.break = null;
			}
		},

		toRangeList(rangeExp) {
			const evalJavaScript = Scripting.evalJavaScript;
			let value;

			try {
				/*
					NOTE: If the first character is the left curly brace, then we
					assume that it's part of an object literal and wrap it within
					parenthesis to ensure that it is not mistaken for a block
					during evaluation—which would cause an error.
				*/
				value = evalJavaScript(rangeExp[0] === '{' ? `(${rangeExp})` : rangeExp);
			}
			catch (ex) {
				if (typeof ex !== 'object') {
					throw new Error(`bad range expression: ${ex}`);
				}

				ex.message = `bad range expression: ${ex.message}`;
				throw ex;
			}

			let list;

			switch (typeof value) {
			case 'string':
				list = [];
				for (let i = 0; i < value.length; /* empty */) {
					const obj = Util.charAndPosAt(value, i);
					list.push([i, obj.char]);
					i = 1 + obj.end;
				}
				break;

			case 'object':
				if (Array.isArray(value)) {
					list = value.map((val, i) => [i, val]);
				}
				else if (value instanceof Set) {
					list = [...value].map((val, i) => [i, val]);
				}
				else if (value instanceof Map) {
					list = [...value.entries()];
				}
				else if (Util.toStringTag(value) === 'Object') {
					list = Object.keys(value).map(key => [key, value[key]]);
				}
				else {
					throw new Error(`unsupported range expression type: ${Util.toStringTag(value)}`);
				}
				break;

			default:
				throw new Error(`unsupported range expression type: ${typeof value}`);
			}

			return list;
		}
	});
	Macro.add(['break', 'continue'], {
		skipArgs : true,

		handler() {
			if (this.contextHas(ctx => ctx.name === 'for')) {
				TempState.break = this.name === 'continue' ? 1 : 2;
			}
			else {
				return this.error('must only be used in conjunction with its parent macro <<for>>');
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});


	/*******************************************************************************************************************
		Interactive Macros.
	*******************************************************************************************************************/
	/*
		<<button>> & <<link>>
	*/
	Macro.add(['button', 'link'], {
		isAsync : true,
		tags    : null,

		handler() {
			if (this.args.length === 0) {
				return this.error(`no ${this.name === 'button' ? 'button' : 'link'} text specified`);
			}

			const $link = jQuery(document.createElement(this.name === 'button' ? 'button' : 'a'));
			let passage;

			if (typeof this.args[0] === 'object') {
				if (this.args[0].isImage) {
					// Argument was in wiki image syntax.
					const $image = jQuery(document.createElement('img'))
						.attr('src', this.args[0].source)
						.appendTo($link);

					if (this.args[0].hasOwnProperty('passage')) {
						$image.attr('data-passage', this.args[0].passage);
					}

					if (this.args[0].hasOwnProperty('title')) {
						$image.attr('title', this.args[0].title);
					}

					if (this.args[0].hasOwnProperty('align')) {
						$image.attr('align', this.args[0].align);
					}

					passage = this.args[0].link;
				}
				else {
					// Argument was in wiki link syntax.
					$link.append(document.createTextNode(this.args[0].text));
					passage = this.args[0].link;
				}
			}
			else {
				// Argument was simply the link text.
				$link.wikiWithOptions({ profile : 'core' }, this.args[0]);
				passage = this.args.length > 1 ? this.args[1] : undefined;
			}

			if (passage != null) { // lazy equality for null
				$link.attr('data-passage', passage);

				if (Story.has(passage)) {
					$link.addClass('link-internal');

					if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
						$link.addClass('link-visited');
					}
				}
				else {
					$link.addClass('link-broken');
				}
			}
			else {
				$link.addClass('link-internal');
			}

			$link
				.addClass(`macro-${this.name}`)
				.ariaClick({
					namespace : '.macros',
					one       : passage != null // lazy equality for null
				}, this.createShadowWrapper(
					this.payload[0].contents !== ''
						? () => Wikifier.wikifyEval(this.payload[0].contents.trim())
						: null,
					passage != null // lazy equality for null
						? () => Engine.play(passage)
						: null
				))
				.appendTo(this.output);
		}
	});

	/*
		<<checkbox>>
	*/
	Macro.add('checkbox', {
		isAsync : true,

		handler() {
			if (this.args.length < 3) {
				const errors = [];
				if (this.args.length < 1) { errors.push('variable name'); }
				if (this.args.length < 2) { errors.push('unchecked value'); }
				if (this.args.length < 3) { errors.push('checked value'); }
				return this.error(`no ${errors.join(' or ')} specified`);
			}

			// Ensure that the variable name argument is a string.
			if (typeof this.args[0] !== 'string') {
				return this.error('variable name argument is not a string');
			}

			const varName = this.args[0].trim();

			// Try to ensure that we receive the variable's name (incl. sigil), not its value.
			if (varName[0] !== '$' && varName[0] !== '_') {
				return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
			}

			const varId        = Util.slugify(varName);
			const uncheckValue = this.args[1];
			const checkValue   = this.args[2];
			const el           = document.createElement('input');

			/*
				Set up and append the input element to the output buffer.
			*/
			jQuery(el)
				.attr({
					id       : `${this.name}-${varId}`,
					name     : `${this.name}-${varId}`,
					type     : 'checkbox',
					tabindex : 0 // for accessiblity
				})
				.addClass(`macro-${this.name}`)
				.on('change.macros', this.createShadowWrapper(function () {
					State.setVar(varName, this.checked ? checkValue : uncheckValue);
				}))
				.appendTo(this.output);

			/*
				Set the variable and input element to the appropriate value and state, as requested.
			*/
			switch (this.args[3]) {
			case 'autocheck':
				if (State.getVar(varName) === checkValue) {
					el.checked = true;
				}
				else {
					State.setVar(varName, uncheckValue);
				}
				break;
			case 'checked':
				el.checked = true;
				State.setVar(varName, checkValue);
				break;
			default:
				State.setVar(varName, uncheckValue);
				break;
			}
		}
	});

	/*
		<<cycle>>, <<listbox>>, <<option>>, & <<optionsfrom>>
	*/
	Macro.add(['cycle', 'listbox'], {
		isAsync  : true,
		skipArgs : ['optionsfrom'],
		tags     : ['option', 'optionsfrom'],

		handler() {
			if (this.args.length === 0) {
				return this.error('no variable name specified');
			}

			// Ensure that the variable name argument is a string.
			if (typeof this.args[0] !== 'string') {
				return this.error('variable name argument is not a string');
			}

			const varName = this.args[0].trim();

			// Try to ensure that we receive the variable's name (incl. sigil), not its value.
			if (varName[0] !== '$' && varName[0] !== '_') {
				return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
			}

			const varId = Util.slugify(varName);
			const len   = this.payload.length;

			if (len === 1) {
				return this.error('no options specified');
			}

			const autoselect = this.args.length > 1 && this.args[1] === 'autoselect';
			const options    = [];
			const tagCount   = { option : 0, optionsfrom : 0 };
			let selectedIdx = -1;

			// Get the options and selected index, if any.
			for (let i = 1; i < len; ++i) {
				const payload = this.payload[i];

				// <<option label value [selected]>>
				if (payload.name === 'option') {
					++tagCount.option;

					if (payload.args.length === 0) {
						return this.error(`no arguments specified for <<${payload.name}>> (#${tagCount.option})`);
					}

					options.push({
						label : String(payload.args[0]),
						value : payload.args.length === 1 ? payload.args[0] : payload.args[1]
					});

					if (payload.args.length > 2 && payload.args[2] === 'selected') {
						if (autoselect) {
							return this.error('cannot specify both the autoselect and selected keywords');
						}
						else if (selectedIdx !== -1) {
							return this.error(`multiple selected keywords specified for <<${payload.name}>> (#${selectedIdx + 1} & #${tagCount.option})`);
						}

						selectedIdx = options.length - 1;
					}
				}

				// <<optionsfrom expression>>
				else {
					++tagCount.optionsfrom;

					if (payload.args.full.length === 0) {
						return this.error(`no expression specified for <<${payload.name}>> (#${tagCount.optionsfrom})`);
					}

					let result;

					try {
						/*
							NOTE: If the first character is the left curly brace, then we
							assume that it's part of an object literal and wrap it within
							parenthesis to ensure that it is not mistaken for a block
							during evaluation—which would cause an error.
						*/
						const exp = payload.args.full;
						result = Scripting.evalJavaScript(exp[0] === '{' ? `(${exp})` : exp);
					}
					catch (ex) {
						return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
					}

					if (typeof result !== 'object' || result === null) {
						return this.error(`expression must yield a supported collection or generic object (type: ${result === null ? 'null' : typeof result})`);
					}

					if (result instanceof Array || result instanceof Set) {
						result.forEach(val => options.push({ label : String(val), value : val }));
					}
					else if (result instanceof Map) {
						result.forEach((val, key) => options.push({ label : String(key), value : val }));
					}
					else {
						const oType = Util.toStringTag(result);

						if (oType !== 'Object') {
							return this.error(`expression must yield a supported collection or generic object (object type: ${oType})`);
						}

						Object.keys(result).forEach(key => options.push({ label : key, value : result[key] }));
					}
				}
			}

			// No options were selected by the user, so we must select one.
			if (selectedIdx === -1) {
				// Attempt to automatically select an option by matching the variable's current value.
				if (autoselect) {
					// NOTE: This will usually fail for objects due to a variety of reasons.
					const sameValueZero = Util.sameValueZero;
					const curValue      = State.getVar(varName);
					const curValueIdx   = options.findIndex(opt => sameValueZero(opt.value, curValue));
					selectedIdx = curValueIdx === -1 ? 0 : curValueIdx;
				}

				// Simply select the first option.
				else {
					selectedIdx = 0;
				}
			}

			// Set up and append the appropriate element to the output buffer.
			if (this.name === 'cycle') {
				let cycleIdx = selectedIdx;
				jQuery(document.createElement('a'))
					.wikiWithOptions({ profile : 'core' }, options[selectedIdx].label)
					.attr('id', `${this.name}-${varId}`)
					.addClass(`macro-${this.name}`)
					.ariaClick({ namespace : '.macros' }, this.createShadowWrapper(function () {
						cycleIdx = (cycleIdx + 1) % options.length;
						$(this).empty().wikiWithOptions({ profile : 'core' }, options[cycleIdx].label);
						State.setVar(varName, options[cycleIdx].value);
					}))
					.appendTo(this.output);
			}
			else { // this.name === 'listbox'
				const $select = jQuery(document.createElement('select'));

				options.forEach((opt, i) => {
					jQuery(document.createElement('option'))
						.val(i)
						.text(opt.label)
						.appendTo($select);
				});

				$select
					.attr({
						id       : `${this.name}-${varId}`,
						name     : `${this.name}-${varId}`,
						tabindex : 0 // for accessiblity
					})
					.addClass(`macro-${this.name}`)
					.val(selectedIdx)
					.on('change.macros', this.createShadowWrapper(function () {
						State.setVar(varName, options[Number(this.value)].value);
					}))
					.appendTo(this.output);
			}

			// Set the variable to the appropriate value, as requested.
			State.setVar(varName, options[selectedIdx].value);
		}
	});

	/*
		<<linkappend>>, <<linkprepend>>, & <<linkreplace>>
	*/
	Macro.add(['linkappend', 'linkprepend', 'linkreplace'], {
		isAsync : true,
		tags    : null,
		t8nRe   : /^(?:transition|t8n)$/,

		handler() {
			if (this.args.length === 0) {
				return this.error('no link text specified');
			}

			const $link      = jQuery(document.createElement('a'));
			const $insert    = jQuery(document.createElement('span'));
			const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);

			$link
				.wikiWithOptions({ profile : 'core' }, this.args[0])
				.addClass(`link-internal macro-${this.name}`)
				.ariaClick({
					namespace : '.macros',
					one       : true
				}, this.createShadowWrapper(
					() => {
						if (this.name === 'linkreplace') {
							$link.remove();
						}
						else {
							$link
								.wrap(`<span class="macro-${this.name}"></span>`)
								.replaceWith(() => $link.html());
						}

						if (this.payload[0].contents !== '') {
							const frag = document.createDocumentFragment();
							new Wikifier(frag, this.payload[0].contents);
							$insert.append(frag);
						}

						if (transition) {
							setTimeout(() => $insert.removeClass(`macro-${this.name}-in`), Engine.minDomActionDelay);
						}
					}
				))
				.appendTo(this.output);

			$insert.addClass(`macro-${this.name}-insert`);

			if (transition) {
				$insert.addClass(`macro-${this.name}-in`);
			}

			if (this.name === 'linkprepend') {
				$insert.insertBefore($link);
			}
			else {
				$insert.insertAfter($link);
			}
		}
	});

	/*
		<<numberbox>> & <<textbox>>
	*/
	Macro.add(['numberbox', 'textbox'], {
		isAsync : true,

		handler() {
			if (this.args.length < 2) {
				const errors = [];
				if (this.args.length < 1) { errors.push('variable name'); }
				if (this.args.length < 2) { errors.push('default value'); }
				return this.error(`no ${errors.join(' or ')} specified`);
			}

			// Ensure that the variable name argument is a string.
			if (typeof this.args[0] !== 'string') {
				return this.error('variable name argument is not a string');
			}

			const varName = this.args[0].trim();

			// Try to ensure that we receive the variable's name (incl. sigil), not its value.
			if (varName[0] !== '$' && varName[0] !== '_') {
				return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			const asNumber     = this.name === 'numberbox';
			const defaultValue = asNumber ? Number(this.args[1]) : this.args[1];

			if (asNumber && Number.isNaN(defaultValue)) {
				return this.error(`default value "${this.args[1]}" is neither a number nor can it be parsed into a number`);
			}

			const varId = Util.slugify(varName);
			const el    = document.createElement('input');
			let autofocus = false;
			let passage;

			if (this.args.length > 3) {
				passage   = this.args[2];
				autofocus = this.args[3] === 'autofocus';
			}
			else if (this.args.length > 2) {
				if (this.args[2] === 'autofocus') {
					autofocus = true;
				}
				else {
					passage = this.args[2];
				}
			}

			if (typeof passage === 'object') {
				// Argument was in wiki link syntax.
				passage = passage.link;
			}

			// Set up and append the input element to the output buffer.
			jQuery(el)
				.attr({
					id        : `${this.name}-${varId}`,
					name      : `${this.name}-${varId}`,
					type      : asNumber ? 'number' : 'text',
					inputmode : asNumber ? 'decimal' : 'text',
					tabindex  : 0 // for accessiblity
				})
				.addClass(`macro-${this.name}`)
				.on('change.macros', this.createShadowWrapper(function () {
					State.setVar(varName, asNumber ? Number(this.value) : this.value);
				}))
				.on('keypress.macros', this.createShadowWrapper(function (ev) {
					// If Return/Enter is pressed, set the variable and, optionally, forward to another passage.
					if (ev.which === 13) { // 13 is Return/Enter
						ev.preventDefault();
						State.setVar(varName, asNumber ? Number(this.value) : this.value);

						if (passage != null) { // lazy equality for null
							Engine.play(passage);
						}
					}
				}))
				.appendTo(this.output);

			// Set the step value for `<input type="number">`.
			if (asNumber) {
				el.step = 'any';
			}

			// Set the variable and input element to the default value.
			State.setVar(varName, defaultValue);
			el.value = defaultValue;

			// Autofocus the input element, if requested.
			if (autofocus) {
				// Set the element's "autofocus" attribute.
				el.setAttribute('autofocus', 'autofocus');

				// Set up a single-use post-display task to autofocus the element.
				postdisplay[`#autofocus:${el.id}`] = task => {
					delete postdisplay[task]; // single-use task
					setTimeout(() => el.focus(), Engine.minDomActionDelay);
				};
			}
		}
	});

	/*
		<<radiobutton>>
	*/
	Macro.add('radiobutton', {
		isAsync : true,

		handler() {
			if (this.args.length < 2) {
				const errors = [];
				if (this.args.length < 1) { errors.push('variable name'); }
				if (this.args.length < 2) { errors.push('checked value'); }
				return this.error(`no ${errors.join(' or ')} specified`);
			}

			// Ensure that the variable name argument is a string.
			if (typeof this.args[0] !== 'string') {
				return this.error('variable name argument is not a string');
			}

			const varName = this.args[0].trim();

			// Try to ensure that we receive the variable's name (incl. sigil), not its value.
			if (varName[0] !== '$' && varName[0] !== '_') {
				return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
			}

			const varId      = Util.slugify(varName);
			const checkValue = this.args[1];
			const el         = document.createElement('input');

			/*
				Set up and initialize the group counter.
			*/
			if (!TempState.hasOwnProperty(this.name)) {
				TempState[this.name] = {};
			}

			if (!TempState[this.name].hasOwnProperty(varId)) {
				TempState[this.name][varId] = 0;
			}

			/*
				Set up and append the input element to the output buffer.
			*/
			jQuery(el)
				.attr({
					id       : `${this.name}-${varId}-${TempState[this.name][varId]++}`,
					name     : `${this.name}-${varId}`,
					type     : 'radio',
					tabindex : 0 // for accessiblity
				})
				.addClass(`macro-${this.name}`)
				.on('change.macros', this.createShadowWrapper(function () {
					if (this.checked) {
						State.setVar(varName, checkValue);
					}
				}))
				.appendTo(this.output);

			/*
				Set the variable to the checked value and the input element to checked, if requested.
			*/
			switch (this.args[2]) {
			case 'autocheck':
				if (State.getVar(varName) === checkValue) {
					el.checked = true;
				}
				break;
			case 'checked':
				el.checked = true;
				State.setVar(varName, checkValue);
				break;
			}
		}
	});

	/*
		<<textarea>>
	*/
	Macro.add('textarea', {
		isAsync : true,

		handler() {
			if (this.args.length < 2) {
				const errors = [];
				if (this.args.length < 1) { errors.push('variable name'); }
				if (this.args.length < 2) { errors.push('default value'); }
				return this.error(`no ${errors.join(' or ')} specified`);
			}

			// Ensure that the variable name argument is a string.
			if (typeof this.args[0] !== 'string') {
				return this.error('variable name argument is not a string');
			}

			const varName = this.args[0].trim();

			// Try to ensure that we receive the variable's name (incl. sigil), not its value.
			if (varName[0] !== '$' && varName[0] !== '_') {
				return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			const varId        = Util.slugify(varName);
			const defaultValue = this.args[1];
			const autofocus    = this.args[2] === 'autofocus';
			const el           = document.createElement('textarea');

			/*
				Set up and append the textarea element to the output buffer.
			*/
			jQuery(el)
				.attr({
					id       : `${this.name}-${varId}`,
					name     : `${this.name}-${varId}`,
					rows     : 4,
					// cols     : 68, // instead of setting "cols" we set the `min-width` in CSS
					tabindex : 0 // for accessiblity
				})
				.addClass(`macro-${this.name}`)
				.on('change.macros', this.createShadowWrapper(function () {
					State.setVar(varName, this.value);
				}))
				.appendTo(this.output);

			/*
				Set the variable and textarea element to the default value.
			*/
			State.setVar(varName, defaultValue);
			// Ideally, we should be setting `.defaultValue` here, but IE doesn't support it,
			// so we have to use `.textContent`, which is equivalent.
			el.textContent = defaultValue;

			/*
				Autofocus the textarea element, if requested.
			*/
			if (autofocus) {
				// Set the element's "autofocus" attribute.
				el.setAttribute('autofocus', 'autofocus');

				// Set up a single-use post-display task to autofocus the element.
				postdisplay[`#autofocus:${el.id}`] = task => {
					delete postdisplay[task]; // single-use task
					setTimeout(() => el.focus(), Engine.minDomActionDelay);
				};
			}
		}
	});

	/*
		[DEPRECATED] <<click>>
	*/
	Macro.add('click', 'link'); // add <<click>> as an alias of <<link>>


	/*******************************************************************************************************************
		Links Macros.
	*******************************************************************************************************************/
	/*
		<<actions>>
	*/
	Macro.add('actions', {
		handler() {
			const $list = jQuery(document.createElement('ul'))
				.addClass(this.name)
				.appendTo(this.output);

			for (let i = 0; i < this.args.length; ++i) {
				let passage;
				let text;
				let $image;
				let setFn;

				if (typeof this.args[i] === 'object') {
					if (this.args[i].isImage) {
						// Argument was in wiki image syntax.
						$image = jQuery(document.createElement('img'))
							.attr('src', this.args[i].source);

						if (this.args[i].hasOwnProperty('passage')) {
							$image.attr('data-passage', this.args[i].passage);
						}

						if (this.args[i].hasOwnProperty('title')) {
							$image.attr('title', this.args[i].title);
						}

						if (this.args[i].hasOwnProperty('align')) {
							$image.attr('align', this.args[i].align);
						}

						passage = this.args[i].link;
						setFn   = this.args[i].setFn;
					}
					else {
						// Argument was in wiki link syntax.
						text    = this.args[i].text;
						passage = this.args[i].link;
						setFn   = this.args[i].setFn;
					}
				}
				else {
					// Argument was simply the passage name.
					text = passage = this.args[i];
				}

				if (
					   State.variables.hasOwnProperty('#actions')
					&& State.variables['#actions'].hasOwnProperty(passage)
					&& State.variables['#actions'][passage]
				) {
					continue;
				}

				jQuery(Wikifier.createInternalLink(
					jQuery(document.createElement('li')).appendTo($list),
					passage,
					null,
					((passage, fn) => () => {
						if (!State.variables.hasOwnProperty('#actions')) {
							State.variables['#actions'] = {};
						}

						State.variables['#actions'][passage] = true;

						if (typeof fn === 'function') {
							fn();
						}
					})(passage, setFn)
				))
					.addClass(`macro-${this.name}`)
					.append($image || document.createTextNode(text));
			}
		}
	});

	/*
		<<back>> & <<return>>
	*/
	Macro.add(['back', 'return'], {
		handler() {
			/* legacy */
			if (this.args.length > 1) {
				return this.error('too many arguments specified, check the documentation for details');
			}
			/* /legacy */

			let momentIndex = -1;
			let passage;
			let text;
			let $image;

			if (this.args.length === 1) {
				if (typeof this.args[0] === 'object') {
					if (this.args[0].isImage) {
						// Argument was in wiki image syntax.
						$image = jQuery(document.createElement('img'))
							.attr('src', this.args[0].source);

						if (this.args[0].hasOwnProperty('passage')) {
							$image.attr('data-passage', this.args[0].passage);
						}

						if (this.args[0].hasOwnProperty('title')) {
							$image.attr('title', this.args[0].title);
						}

						if (this.args[0].hasOwnProperty('align')) {
							$image.attr('align', this.args[0].align);
						}

						if (this.args[0].hasOwnProperty('link')) {
							passage = this.args[0].link;
						}
					}
					else {
						// Argument was in wiki link syntax.
						if (this.args[0].count === 1) {
							// Simple link syntax: `[[...]]`.
							passage = this.args[0].link;
						}
						else {
							// Pretty link syntax: `[[...|...]]`.
							text    = this.args[0].text;
							passage = this.args[0].link;
						}
					}
				}
				else if (this.args.length === 1) {
					// Argument was simply the link text.
					text = this.args[0];
				}
			}

			if (passage == null) { // lazy equality for null
				/*
					Find the index and title of the most recent moment whose title does not match
					that of the active (present) moment's.
				*/
				for (let i = State.length - 2; i >= 0; --i) {
					if (State.history[i].title !== State.passage) {
						momentIndex = i;
						passage = State.history[i].title;
						break;
					}
				}

				// If we failed to find a passage and we're `<<return>>`, fallback to `State.expired`.
				if (passage == null && this.name === 'return') { // lazy equality for null
					for (let i = State.expired.length - 1; i >= 0; --i) {
						if (State.expired[i] !== State.passage) {
							passage = State.expired[i];
							break;
						}
					}
				}
			}
			else {
				if (!Story.has(passage)) {
					return this.error(`passage "${passage}" does not exist`);
				}

				if (this.name === 'back') {
					/*
						Find the index of the most recent moment whose title matches that of the
						specified passage.
					*/
					for (let i = State.length - 2; i >= 0; --i) {
						if (State.history[i].title === passage) {
							momentIndex = i;
							break;
						}
					}

					if (momentIndex === -1) {
						return this.error(`cannot find passage "${passage}" in the current story history`);
					}
				}
			}

			if (passage == null) { // lazy equality for null
				return this.error('cannot find passage');
			}

			// if (this.name === "back" && momentIndex === -1) {
			// 	// no-op; we're already at the first passage in the current story history
			// 	return;
			// }

			let $el;

			if (this.name !== 'back' || momentIndex !== -1) {
				$el = jQuery(document.createElement('a'))
					.addClass('link-internal')
					.ariaClick(
						{ one : true },
						this.name === 'return'
							? () => Engine.play(passage)
							: () => Engine.goTo(momentIndex)
					);
			}
			else {
				$el = jQuery(document.createElement('span'))
					.addClass('link-disabled');
			}

			$el
				.addClass(`macro-${this.name}`)
				.append($image || document.createTextNode(text || L10n.get(`macro${this.name.toUpperFirst()}Text`)))
				.appendTo(this.output);
		}
	});

	/*
		<<choice>>
	*/
	Macro.add('choice', {
		handler() {
			if (this.args.length === 0) {
				return this.error('no passage specified');
			}

			const choiceId = State.passage;
			let passage;
			let text;
			let $image;
			let setFn;

			if (this.args.length === 1) {
				if (typeof this.args[0] === 'object') {
					if (this.args[0].isImage) {
						// Argument was in wiki image syntax.
						$image = jQuery(document.createElement('img'))
							.attr('src', this.args[0].source);

						if (this.args[0].hasOwnProperty('passage')) {
							$image.attr('data-passage', this.args[0].passage);
						}

						if (this.args[0].hasOwnProperty('title')) {
							$image.attr('title', this.args[0].title);
						}

						if (this.args[0].hasOwnProperty('align')) {
							$image.attr('align', this.args[0].align);
						}

						passage = this.args[0].link;
						setFn   = this.args[0].setFn;
					}
					else {
						// Argument was in wiki link syntax.
						text    = this.args[0].text;
						passage = this.args[0].link;
						setFn   = this.args[0].setFn;
					}
				}
				else {
					// Argument was simply the passage name.
					text = passage = this.args[0];
				}
			}
			else {
				// NOTE: The arguments here are backwards.
				passage = this.args[0];
				text    = this.args[1];
			}

			if (
				   State.variables.hasOwnProperty('#choice')
				&& State.variables['#choice'].hasOwnProperty(choiceId)
				&& State.variables['#choice'][choiceId]
			) {
				jQuery(document.createElement('span'))
					.addClass(`link-disabled macro-${this.name}`)
					.attr('tabindex', -1)
					.append($image || document.createTextNode(text))
					.appendTo(this.output);
				return;
			}

			jQuery(Wikifier.createInternalLink(this.output, passage, null, () => {
				if (!State.variables.hasOwnProperty('#choice')) {
					State.variables['#choice'] = {};
				}

				State.variables['#choice'][choiceId] = true;

				if (typeof setFn === 'function') {
					setFn();
				}
			}))
				.addClass(`macro-${this.name}`)
				.append($image || document.createTextNode(text));
		}
	});


	/*******************************************************************************************************************
		DOM Macros.
	*******************************************************************************************************************/
	/*
		<<addclass>> & <<toggleclass>>
	*/
	Macro.add(['addclass', 'toggleclass'], {
		handler() {
			if (this.args.length < 2) {
				const errors = [];
				if (this.args.length < 1) { errors.push('selector'); }
				if (this.args.length < 2) { errors.push('class names'); }
				return this.error(`no ${errors.join(' or ')} specified`);
			}

			const $targets = jQuery(this.args[0]);

			if ($targets.length === 0) {
				return this.error(`no elements matched the selector "${this.args[0]}"`);
			}

			switch (this.name) {
			case 'addclass':
				$targets.addClass(this.args[1].trim());
				break;

			case 'toggleclass':
				$targets.toggleClass(this.args[1].trim());
				break;
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<removeclass>>
	*/
	Macro.add('removeclass', {
		handler() {
			if (this.args.length === 0) {
				return this.error('no selector specified');
			}

			const $targets = jQuery(this.args[0]);

			if ($targets.length === 0) {
				return this.error(`no elements matched the selector "${this.args[0]}"`);
			}

			if (this.args.length > 1) {
				$targets.removeClass(this.args[1].trim());
			}
			else {
				$targets.removeClass();
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<copy>>
	*/
	Macro.add('copy', {
		handler() {
			if (this.args.length === 0) {
				return this.error('no selector specified');
			}

			const $targets = jQuery(this.args[0]);

			if ($targets.length === 0) {
				return this.error(`no elements matched the selector "${this.args[0]}"`);
			}

			jQuery(this.output).append($targets.html());

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<append>>, <<prepend>>, & <<replace>>
	*/
	Macro.add(['append', 'prepend', 'replace'], {
		tags  : null,
		t8nRe : /^(?:transition|t8n)$/,

		handler() {
			if (this.args.length === 0) {
				return this.error('no selector specified');
			}

			const $targets = jQuery(this.args[0]);

			if ($targets.length === 0) {
				return this.error(`no elements matched the selector "${this.args[0]}"`);
			}

			if (this.payload[0].contents !== '') {
				const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);
				let $insert;

				if (transition) {
					$insert = jQuery(document.createElement('span'));
					$insert.addClass(`macro-${this.name}-insert macro-${this.name}-in`);
					setTimeout(() => $insert.removeClass(`macro-${this.name}-in`), Engine.minDomActionDelay);
				}
				else {
					$insert = jQuery(document.createDocumentFragment());
				}

				$insert.wiki(this.payload[0].contents);

				switch (this.name) {
				case 'replace':
					$targets.empty();
					/* falls through */

				case 'append':
					$targets.append($insert);
					break;

				case 'prepend':
					$targets.prepend($insert);
					break;
				}
			}
			else if (this.name === 'replace') {
				$targets.empty();
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<remove>>
	*/
	Macro.add('remove', {
		handler() {
			if (this.args.length === 0) {
				return this.error('no selector specified');
			}

			const $targets = jQuery(this.args[0]);

			if ($targets.length === 0) {
				return this.error(`no elements matched the selector "${this.args[0]}"`);
			}

			$targets.remove();

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});


	/*******************************************************************************************************************
		Audio Macros.
	*******************************************************************************************************************/
	if (Has.audio) {
		const errorOnePlaybackAction = (cur, prev) => `only one playback action allowed per invocation, "${cur}" cannot be combined with "${prev}"`;

		/*
			<<audio>>
		*/
		Macro.add('audio', {
			handler() {
				if (this.args.length < 2) {
					const errors = [];
					if (this.args.length < 1) { errors.push('track and/or group IDs'); }
					if (this.args.length < 2) { errors.push('actions'); }
					return this.error(`no ${errors.join(' or ')} specified`);
				}

				let selected;

				// Process the track and/or group IDs.
				try {
					selected = SimpleAudio.select(this.args[0]);
				}
				catch (ex) {
					return this.error(ex.message);
				}

				const args = this.args.slice(1);
				let action;
				let fadeOver = 5;
				let fadeTo;
				let loop;
				let mute;
				let passage;
				let time;
				let volume;

				// Process arguments.
				while (args.length > 0) {
					const arg = args.shift();
					let raw;

					switch (arg) {
					case 'load':
					case 'pause':
					case 'play':
					case 'stop':
					case 'unload':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = arg;
						break;

					case 'fadein':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = 'fade';
						fadeTo = 1;
						break;

					case 'fadeout':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = 'fade';
						fadeTo = 0;
						break;

					case 'fadeto':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						if (args.length === 0) {
							return this.error('fadeto missing required level value');
						}

						action = 'fade';
						raw = args.shift();
						fadeTo = Number.parseFloat(raw);

						if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
							return this.error(`cannot parse fadeto: ${raw}`);
						}
						break;

					case 'fadeoverto':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						if (args.length < 2) {
							const errors = [];
							if (args.length < 1) { errors.push('seconds'); }
							if (args.length < 2) { errors.push('level'); }
							return this.error(`fadeoverto missing required ${errors.join(' and ')} value${errors.length > 1 ? 's' : ''}`);
						}

						action = 'fade';
						raw = args.shift();
						fadeOver = Number.parseFloat(raw);

						if (Number.isNaN(fadeOver) || !Number.isFinite(fadeOver)) {
							return this.error(`cannot parse fadeoverto: ${raw}`);
						}

						raw = args.shift();
						fadeTo = Number.parseFloat(raw);

						if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
							return this.error(`cannot parse fadeoverto: ${raw}`);
						}
						break;

					case 'volume':
						if (args.length === 0) {
							return this.error('volume missing required level value');
						}

						raw = args.shift();
						volume = Number.parseFloat(raw);

						if (Number.isNaN(volume) || !Number.isFinite(volume)) {
							return this.error(`cannot parse volume: ${raw}`);
						}
						break;

					case 'mute':
					case 'unmute':
						mute = arg === 'mute';
						break;

					case 'time':
						if (args.length === 0) {
							return this.error('time missing required seconds value');
						}

						raw = args.shift();
						time = Number.parseFloat(raw);

						if (Number.isNaN(time) || !Number.isFinite(time)) {
							return this.error(`cannot parse time: ${raw}`);
						}
						break;

					case 'loop':
					case 'unloop':
						loop = arg === 'loop';
						break;

					case 'goto':
						if (args.length === 0) {
							return this.error('goto missing required passage title');
						}

						raw = args.shift();

						if (typeof raw === 'object') {
							// Argument was in wiki link syntax.
							passage = raw.link;
						}
						else {
							// Argument was simply the passage name.
							passage = raw;
						}

						if (!Story.has(passage)) {
							return this.error(`passage "${passage}" does not exist`);
						}
						break;

					default:
						return this.error(`unknown action: ${arg}`);
					}
				}

				try {
					if (volume != null) { // lazy equality for null
						selected.volume(volume);
					}

					if (time != null) { // lazy equality for null
						selected.time(time);
					}

					if (mute != null) { // lazy equality for null
						selected.mute(mute);
					}

					if (loop != null) { // lazy equality for null
						selected.loop(loop);
					}

					if (passage != null) { // lazy equality for null
						const nsEnded = `ended.macros.macro-${this.name}_goto`;
						selected
							.off(nsEnded)
							.one(nsEnded, () => {
								selected.off(nsEnded);
								Engine.play(passage);
							});
					}

					switch (action) {
					case 'fade':
						selected.fade(fadeOver, fadeTo);
						break;

					case 'load':
						selected.load();
						break;

					case 'pause':
						selected.pause();
						break;

					case 'play':
						selected.playWhenAllowed();
						break;

					case 'stop':
						selected.stop();
						break;

					case 'unload':
						selected.unload();
						break;
					}

					// Custom debug view setup.
					if (Config.debug) {
						this.debugView.modes({ hidden : true });
					}
				}
				catch (ex) {
					return this.error(`error executing action: ${ex.message}`);
				}
			}
		});

		/*
			<<cacheaudio track_id source_list>>
		*/
		Macro.add('cacheaudio', {
			handler() {
				if (this.args.length < 2) {
					const errors = [];
					if (this.args.length < 1) { errors.push('track ID'); }
					if (this.args.length < 2) { errors.push('sources'); }
					return this.error(`no ${errors.join(' or ')} specified`);
				}

				const id       = String(this.args[0]).trim();
				const oldFmtRe = /^format:\s*([\w-]+)\s*;\s*/i;

				try {
					SimpleAudio.tracks.add(id, this.args.slice(1).map(source => {
						/* legacy */
						// Transform an old format specifier into the new style.
						if (oldFmtRe.test(source)) {
							// If in Test Mode, return an error.
							if (Config.debug) {
								return this.error(`track ID "${id}": format specifier migration required, "format:formatId;" \u2192 "formatId|"`);
							}

							source = source.replace(oldFmtRe, '$1|'); // eslint-disable-line no-param-reassign
						}

						return source;
						/* /legacy */
					}));
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// If in Test Mode and no supported sources were specified, return an error.
				if (Config.debug && !SimpleAudio.tracks.get(id).hasSource()) {
					return this.error(`track ID "${id}": no supported audio sources found`);
				}

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			<<createaudiogroup group_id>>
				<<track track_id>>
				…
			<</createaudiogroup>>
		*/
		Macro.add('createaudiogroup', {
			tags : ['track'],

			handler() {
				if (this.args.length === 0) {
					return this.error('no group ID specified');
				}

				if (this.payload.length === 1) {
					return this.error('no tracks defined via <<track>>');
				}

				// Initial debug view setup for `<<createaudiogroup>>`.
				if (Config.debug) {
					this.debugView
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}

				const groupId  = String(this.args[0]).trim();
				const trackIds = [];

				for (let i = 1, len = this.payload.length; i < len; ++i) {
					if (this.payload[i].args.length < 1) {
						return this.error('no track ID specified');
					}

					trackIds.push(String(this.payload[i].args[0]).trim());

					// Custom debug view setup for the current `<<track>>`.
					if (Config.debug) {
						this
							.createDebugView(this.payload[i].name, this.payload[i].source)
							.modes({
								nonvoid : false,
								hidden  : true
							});
					}
				}

				try {
					SimpleAudio.groups.add(groupId, trackIds);
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// Custom fake debug view setup for `<</createaudiogroup>>`.
				if (Config.debug) {
					this
						.createDebugView(`/${this.name}`, `<</${this.name}>>`)
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}
			}
		});

		/*
			<<createplaylist list_id>>
				<<track track_id action_list>>
				…
			<</createplaylist>>
		*/
		Macro.add('createplaylist', {
			tags : ['track'],

			handler() {
				if (this.args.length === 0) {
					return this.error('no list ID specified');
				}

				if (this.payload.length === 1) {
					return this.error('no tracks defined via <<track>>');
				}

				const playlist = Macro.get('playlist');

				if (playlist.from !== null && playlist.from !== 'createplaylist') {
					return this.error('a playlist has already been defined with <<setplaylist>>');
				}

				// Initial debug view setup for `<<createplaylist>>`.
				if (Config.debug) {
					this.debugView
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}

				const listId    = String(this.args[0]).trim();
				const trackObjs = [];

				for (let i = 1, len = this.payload.length; i < len; ++i) {
					if (this.payload[i].args.length === 0) {
						return this.error('no track ID specified');
					}

					const trackObj = { id : String(this.payload[i].args[0]).trim() };
					const args     = this.payload[i].args.slice(1);

					// Process arguments.
					while (args.length > 0) {
						const arg = args.shift();
						let raw;
						let parsed;

						switch (arg) {
						case 'copy': // [DEPRECATED]
						case 'own':
							trackObj.own = true;
							break;

						case 'rate':
							// if (args.length === 0) {
							// 	return this.error('rate missing required speed value');
							// }
							//
							// raw = args.shift();
							// parsed = Number.parseFloat(raw);
							//
							// if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
							// 	return this.error(`cannot parse rate: ${raw}`);
							// }
							//
							// trackObj.rate = parsed;
							if (args.length > 0) {
								args.shift();
							}
							break;

						case 'volume':
							if (args.length === 0) {
								return this.error('volume missing required level value');
							}

							raw = args.shift();
							parsed = Number.parseFloat(raw);

							if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
								return this.error(`cannot parse volume: ${raw}`);
							}

							trackObj.volume = parsed;
							break;

						default:
							return this.error(`unknown action: ${arg}`);
						}
					}

					trackObjs.push(trackObj);

					// Custom debug view setup for the current `<<track>>`.
					if (Config.debug) {
						this
							.createDebugView(this.payload[i].name, this.payload[i].source)
							.modes({
								nonvoid : false,
								hidden  : true
							});
					}
				}

				try {
					SimpleAudio.lists.add(listId, trackObjs);
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// Lock `<<playlist>>` into our syntax.
				if (playlist.from === null) {
					playlist.from = 'createplaylist';
				}

				// Custom fake debug view setup for `<</createplaylist>>`.
				if (Config.debug) {
					this
						.createDebugView(`/${this.name}`, `<</${this.name}>>`)
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}
			}
		});

		/*
			<<masteraudio action_list>>
		*/
		Macro.add('masteraudio', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no actions specified');
				}

				const args = this.args.slice(0);
				let action;
				let mute;
				let muteOnHide;
				let volume;

				// Process arguments.
				while (args.length > 0) {
					const arg = args.shift();
					let raw;

					switch (arg) {
					case 'load':
					case 'stop':
					case 'unload':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = arg;
						break;

					case 'mute':
					case 'unmute':
						mute = arg === 'mute';
						break;

					case 'muteonhide':
					case 'nomuteonhide':
						muteOnHide = arg === 'muteonhide';
						break;

					case 'volume':
						if (args.length === 0) {
							return this.error('volume missing required level value');
						}

						raw = args.shift();
						volume = Number.parseFloat(raw);

						if (Number.isNaN(volume) || !Number.isFinite(volume)) {
							return this.error(`cannot parse volume: ${raw}`);
						}
						break;

					default:
						return this.error(`unknown action: ${arg}`);
					}
				}

				try {
					if (mute != null) { // lazy equality for null
						SimpleAudio.mute(mute);
					}

					if (muteOnHide != null) { // lazy equality for null
						SimpleAudio.muteOnHidden(muteOnHide);
					}

					if (volume != null) { // lazy equality for null
						SimpleAudio.volume(volume);
					}

					switch (action) {
					case 'load':
						SimpleAudio.load();
						break;

					case 'stop':
						SimpleAudio.stop();
						break;

					case 'unload':
						SimpleAudio.unload();
						break;
					}

					// Custom debug view setup.
					if (Config.debug) {
						this.debugView.modes({ hidden : true });
					}
				}
				catch (ex) {
					return this.error(`error executing action: ${ex.message}`);
				}
			}
		});

		/*
			<<playlist list_id action_list>>  ← <<createplaylist>> syntax
			<<playlist action_list>>          ← <<setplaylist>> syntax
		*/
		Macro.add('playlist', {
			from : null,

			handler() {
				const from = this.self.from;

				if (from === null) {
					return this.error('no playlists have been created');
				}

				let list;
				let args;

				if (from === 'createplaylist') {
					if (this.args.length < 2) {
						const errors = [];
						if (this.args.length < 1) { errors.push('list ID'); }
						if (this.args.length < 2) { errors.push('actions'); }
						return this.error(`no ${errors.join(' or ')} specified`);
					}

					const id = String(this.args[0]).trim();

					if (!SimpleAudio.lists.has(id)) {
						return this.error(`playlist "${id}" does not exist`);
					}

					list = SimpleAudio.lists.get(id);
					args = this.args.slice(1);
				}
				else {
					if (this.args.length === 0) {
						return this.error('no actions specified');
					}

					list = SimpleAudio.lists.get('setplaylist');
					args = this.args.slice(0);
				}

				let action;
				let fadeOver = 5;
				let fadeTo;
				let loop;
				let mute;
				let shuffle;
				let volume;

				// Process arguments.
				while (args.length > 0) {
					const arg = args.shift();
					let raw;

					switch (arg) {
					case 'load':
					case 'pause':
					case 'play':
					case 'skip':
					case 'stop':
					case 'unload':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = arg;
						break;

					case 'fadein':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = 'fade';
						fadeTo = 1;
						break;

					case 'fadeout':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						action = 'fade';
						fadeTo = 0;
						break;

					case 'fadeto':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						if (args.length === 0) {
							return this.error('fadeto missing required level value');
						}

						action = 'fade';
						raw = args.shift();
						fadeTo = Number.parseFloat(raw);

						if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
							return this.error(`cannot parse fadeto: ${raw}`);
						}
						break;

					case 'fadeoverto':
						if (action) {
							return this.error(errorOnePlaybackAction(arg, action));
						}

						if (args.length < 2) {
							const errors = [];
							if (args.length < 1) { errors.push('seconds'); }
							if (args.length < 2) { errors.push('level'); }
							return this.error(`fadeoverto missing required ${errors.join(' and ')} value${errors.length > 1 ? 's' : ''}`);
						}

						action = 'fade';
						raw = args.shift();
						fadeOver = Number.parseFloat(raw);

						if (Number.isNaN(fadeOver) || !Number.isFinite(fadeOver)) {
							return this.error(`cannot parse fadeoverto: ${raw}`);
						}

						raw = args.shift();
						fadeTo = Number.parseFloat(raw);

						if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
							return this.error(`cannot parse fadeoverto: ${raw}`);
						}
						break;

					case 'volume':
						if (args.length === 0) {
							return this.error('volume missing required level value');
						}

						raw = args.shift();
						volume = Number.parseFloat(raw);

						if (Number.isNaN(volume) || !Number.isFinite(volume)) {
							return this.error(`cannot parse volume: ${raw}`);
						}
						break;

					case 'mute':
					case 'unmute':
						mute = arg === 'mute';
						break;

					case 'loop':
					case 'unloop':
						loop = arg === 'loop';
						break;

					case 'shuffle':
					case 'unshuffle':
						shuffle = arg === 'shuffle';
						break;

					default:
						return this.error(`unknown action: ${arg}`);
					}
				}

				try {
					if (volume != null) { // lazy equality for null
						list.volume(volume);
					}

					if (mute != null) { // lazy equality for null
						list.mute(mute);
					}

					if (loop != null) { // lazy equality for null
						list.loop(loop);
					}

					if (shuffle != null) { // lazy equality for null
						list.shuffle(shuffle);
					}

					switch (action) {
					case 'fade':
						list.fade(fadeOver, fadeTo);
						break;

					case 'load':
						list.load();
						break;

					case 'pause':
						list.pause();
						break;

					case 'play':
						list.playWhenAllowed();
						break;

					case 'skip':
						list.skip();
						break;

					case 'stop':
						list.stop();
						break;

					case 'unload':
						list.unload();
						break;
					}

					// Custom debug view setup.
					if (Config.debug) {
						this.debugView.modes({ hidden : true });
					}
				}
				catch (ex) {
					return this.error(`error executing action: ${ex.message}`);
				}
			}
		});

		/*
			<<removeaudiogroup group_id>>
		*/
		Macro.add('removeaudiogroup', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no group ID specified');
				}

				const id = String(this.args[0]).trim();

				if (!SimpleAudio.groups.has(id)) {
					return this.error(`group "${id}" does not exist`);
				}

				SimpleAudio.groups.delete(id);

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			<<removeplaylist list_id>>
		*/
		Macro.add('removeplaylist', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no list ID specified');
				}

				const id = String(this.args[0]).trim();

				if (!SimpleAudio.lists.has(id)) {
					return this.error(`playlist "${id}" does not exist`);
				}

				SimpleAudio.lists.delete(id);

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			<<waitforaudio>>
		*/
		Macro.add('waitforaudio', {
			skipArgs : true,

			handler() {
				SimpleAudio.loadWithScreen();
			}
		});

		/*
			[DEPRECATED] <<setplaylist track_id_list>>
		*/
		Macro.add('setplaylist', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no track ID(s) specified');
				}

				const playlist = Macro.get('playlist');

				if (playlist.from !== null && playlist.from !== 'setplaylist') {
					return this.error('playlists have already been defined with <<createplaylist>>');
				}

				// Create the new playlist.
				try {
					SimpleAudio.lists.add('setplaylist', this.args.slice(0));
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// Lock `<<playlist>>` into our syntax.
				if (playlist.from === null) {
					playlist.from = 'setplaylist';
				}

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			[DEPRECATED] <<stopallaudio>>
		*/
		Macro.add('stopallaudio', {
			skipArgs : true,

			handler() {
				SimpleAudio.select(':all').stop();

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});
	}
	else {
		/* The HTML5 <audio> API appears to be missing or disabled, set up no-op macros. */
		Macro.add([
			'audio',
			'cacheaudio',
			'createaudiogroup',
			'createplaylist',
			'masteraudio',
			'playlist',
			'removeaudiogroup',
			'removeplaylist',
			'waitforaudio',

			// Deprecated.
			'setplaylist',
			'stopallaudio'
		], {
			skipArgs : true,

			handler() {
				/* no-op */

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});
	}


	/*******************************************************************************************************************
		Miscellaneous Macros.
	*******************************************************************************************************************/
	/*
		<<done>>
	*/
	Macro.add('done', {
		skipArgs : true,
		tags     : null,

		handler() {
			const contents = this.payload[0].contents.trim();

			// Do nothing if there's no content to process.
			if (contents === '') {
				return;
			}

			$(document).one(':passagedisplay', this.createShadowWrapper(
				() => $.wiki(contents)
			));
		}
	});

	/*
		<<goto>>
	*/
	Macro.add('goto', {
		handler() {
			if (this.args.length === 0) {
				return this.error('no passage specified');
			}

			let passage;

			if (typeof this.args[0] === 'object') {
				// Argument was in wiki link syntax.
				passage = this.args[0].link;
			}
			else {
				// Argument was simply the passage name.
				passage = this.args[0];
			}

			if (!Story.has(passage)) {
				return this.error(`passage "${passage}" does not exist`);
			}

			/*
				Call `Engine.play()` asynchronously.

				NOTE: This does not terminate the current Wikifier call chain,
				though, ideally, it should.  Doing so would not be trivial, however,
				and there's also the question of whether that behavior would be
				unwanted by users, who are used to the current behavior from
				similar macros and constructs.
			*/
			setTimeout(() => Engine.play(passage), Engine.minDomActionDelay);
		}
	});

	/*
		<<repeat>> & <<stop>>
	*/
	Macro.add('repeat', {
		isAsync : true,
		tags    : null,
		timers  : new Set(),
		t8nRe   : /^(?:transition|t8n)$/,

		handler() {
			if (this.args.length === 0) {
				return this.error('no time value specified');
			}

			let delay;

			try {
				delay = Math.max(Engine.minDomActionDelay, Util.fromCssTime(this.args[0]));
			}
			catch (ex) {
				return this.error(ex.message);
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);
			const $wrapper   = jQuery(document.createElement('span'))
				.addClass(`macro-${this.name}`)
				.appendTo(this.output);

			// Register the timer.
			this.self.registerInterval(this.createShadowWrapper(() => {
				const frag = document.createDocumentFragment();
				new Wikifier(frag, this.payload[0].contents);

				let $output = $wrapper;

				if (transition) {
					$output = jQuery(document.createElement('span'))
						.addClass('macro-repeat-insert macro-repeat-in')
						.appendTo($output);
				}

				$output.append(frag);

				if (transition) {
					setTimeout(() => $output.removeClass('macro-repeat-in'), Engine.minDomActionDelay);
				}
			}), delay);
		},

		registerInterval(callback, delay) {
			if (typeof callback !== 'function') {
				throw new TypeError('callback parameter must be a function');
			}

			// Cache info about the current turn.
			const passage = State.passage;
			const turn    = State.turns;

			// Timer info.
			const timers = this.timers;
			let timerId = null;

			// Set up the interval.
			timerId = setInterval(() => {
				// Terminate if we've navigated away.
				if (State.passage !== passage || State.turns !== turn) {
					clearInterval(timerId);
					timers.delete(timerId);
					return;
				}

				let timerIdCache;
				/*
					There's no catch clause because this try/finally is here simply to ensure that
					proper cleanup is done in the event that an exception is thrown during the
					`Wikifier` call.
				*/
				try {
					TempState.break = null;

					// Set up the `repeatTimerId` value, caching the existing value, if necessary.
					if (TempState.hasOwnProperty('repeatTimerId')) {
						timerIdCache = TempState.repeatTimerId;
					}

					TempState.repeatTimerId = timerId;

					// Execute the callback.
					callback.call(this);
				}
				finally {
					// Teardown the `repeatTimerId` property, restoring the cached value, if necessary.
					if (typeof timerIdCache !== 'undefined') {
						TempState.repeatTimerId = timerIdCache;
					}
					else {
						delete TempState.repeatTimerId;
					}

					TempState.break = null;
				}
			}, delay);
			timers.add(timerId);

			// Set up a single-use `prehistory` task to remove pending timers.
			if (!prehistory.hasOwnProperty('#repeat-timers-cleanup')) {
				prehistory['#repeat-timers-cleanup'] = task => {
					delete prehistory[task]; // single-use task
					timers.forEach(timerId => clearInterval(timerId));
					timers.clear();
				};
			}
		}
	});
	Macro.add('stop', {
		skipArgs : true,

		handler() {
			if (!TempState.hasOwnProperty('repeatTimerId')) {
				return this.error('must only be used in conjunction with its parent macro <<repeat>>');
			}

			const timers  = Macro.get('repeat').timers;
			const timerId = TempState.repeatTimerId;
			clearInterval(timerId);
			timers.delete(timerId);
			TempState.break = 2;

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ hidden : true });
			}
		}
	});

	/*
		<<timed>> & <<next>>
	*/
	Macro.add('timed', {
		isAsync : true,
		tags    : ['next'],
		timers  : new Set(),
		t8nRe   : /^(?:transition|t8n)$/,

		handler() {
			if (this.args.length === 0) {
				return this.error('no time value specified in <<timed>>');
			}

			const items = [];

			try {
				items.push({
					name    : this.name,
					source  : this.source,
					delay   : Math.max(Engine.minDomActionDelay, Util.fromCssTime(this.args[0])),
					content : this.payload[0].contents
				});
			}
			catch (ex) {
				return this.error(`${ex.message} in <<timed>>`);
			}

			if (this.payload.length > 1) {
				let i;

				try {
					let len;

					for (i = 1, len = this.payload.length; i < len; ++i) {
						items.push({
							name   : this.payload[i].name,
							source : this.payload[i].source,
							delay  : this.payload[i].args.length === 0
								? items[items.length - 1].delay
								: Math.max(Engine.minDomActionDelay, Util.fromCssTime(this.payload[i].args[0])),
							content : this.payload[i].contents
						});
					}
				}
				catch (ex) {
					return this.error(`${ex.message} in <<next>> (#${i})`);
				}
			}

			// Custom debug view setup.
			if (Config.debug) {
				this.debugView.modes({ block : true });
			}

			const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);
			const $wrapper   = jQuery(document.createElement('span'))
				.addClass(`macro-${this.name}`)
				.appendTo(this.output);

			// Register the timer.
			this.self.registerTimeout(this.createShadowWrapper(item => {
				const frag = document.createDocumentFragment();
				new Wikifier(frag, item.content);

				// Output.
				let $output = $wrapper;

				// Custom debug view setup for `<<next>>`.
				if (Config.debug && item.name === 'next') {
					$output = jQuery(new DebugView( // eslint-disable-line no-param-reassign
						$output[0],
						'macro',
						item.name,
						item.source
					).output);
				}

				if (transition) {
					$output = jQuery(document.createElement('span'))
						.addClass('macro-timed-insert macro-timed-in')
						.appendTo($output);
				}

				$output.append(frag);

				if (transition) {
					setTimeout(() => $output.removeClass('macro-timed-in'), Engine.minDomActionDelay);
				}
			}), items);
		},

		registerTimeout(callback, items) {
			if (typeof callback !== 'function') {
				throw new TypeError('callback parameter must be a function');
			}

			// Cache info about the current turn.
			const passage = State.passage;
			const turn    = State.turns;

			// Timer info.
			const timers = this.timers;
			let timerId  = null;
			let nextItem = items.shift();

			const worker = function () {
				// Bookkeeping.
				timers.delete(timerId);

				// Terminate if we've navigated away.
				if (State.passage !== passage || State.turns !== turn) {
					return;
				}

				// Set the current item and set up the next worker, if any.
				const curItem = nextItem;

				if ((nextItem = items.shift()) != null) { // lazy equality for null
					timerId = setTimeout(worker, nextItem.delay);
					timers.add(timerId);
				}

				// Execute the callback.
				callback.call(this, curItem);
			};

			// Setup the timeout.
			timerId = setTimeout(worker, nextItem.delay);
			timers.add(timerId);

			// Set up a single-use `prehistory` task to remove pending timers.
			if (!prehistory.hasOwnProperty('#timed-timers-cleanup')) {
				prehistory['#timed-timers-cleanup'] = task => {
					delete prehistory[task]; // single-use task
					timers.forEach(timerId => clearTimeout(timerId)); // eslint-disable-line no-shadow
					timers.clear();
				};
			}
		}
	});

	/*
		<<widget>>
	*/
	Macro.add('widget', {
		tags : null,

		handler() {
			if (this.args.length === 0) {
				return this.error('no widget name specified');
			}

			const widgetName = this.args[0];

			if (Macro.has(widgetName)) {
				if (!Macro.get(widgetName).isWidget) {
					return this.error(`cannot clobber existing macro "${widgetName}"`);
				}

				// Delete the existing widget.
				Macro.delete(widgetName);
			}

			try {
				Macro.add(widgetName, {
					isWidget : true,
					handler  : (function (contents) {
						return function () {
							let argsCache;

							// Cache the existing value of the `$args` variable, if necessary.
							if (State.variables.hasOwnProperty('args')) {
								argsCache = State.variables.args;
							}

							// Set up the widget `$args` variable and add a shadow.
							State.variables.args = [...this.args];
							State.variables.args.raw = this.args.raw;
							State.variables.args.full = this.args.full;
							this.addShadow('$args');

							try {
								// Set up the error trapping variables.
								const resFrag = document.createDocumentFragment();
								const errList = [];

								// Wikify the widget contents.
								new Wikifier(resFrag, contents);

								// Carry over the output, unless there were errors.
								Array.from(resFrag.querySelectorAll('.error')).forEach(errEl => {
									errList.push(errEl.textContent);
								});

								if (errList.length === 0) {
									this.output.appendChild(resFrag);
								}
								else {
									return this.error(`error${errList.length > 1 ? 's' : ''} within widget contents (${errList.join('; ')})`);
								}
							}
							catch (ex) {
								return this.error(`cannot execute widget: ${ex.message}`);
							}
							finally {
								// Revert the `$args` variable shadowing.
								if (typeof argsCache !== 'undefined') {
									State.variables.args = argsCache;
								}
								else {
									delete State.variables.args;
								}
							}
						};
					})(this.payload[0].contents)
				});

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
			catch (ex) {
				return this.error(`cannot create widget macro "${widgetName}": ${ex.message}`);
			}
		}
	});
})();
