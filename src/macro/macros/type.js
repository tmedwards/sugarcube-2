/***********************************************************************************************************************

	macro/macros/type.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Macro, NodeTyper, State, TempState, Wikifier, cssTimeToMS, scrubEventKey, triggerEvent */

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

		const speed = cssTimeToMS(this.args[0]); // in milliseconds

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
					start = cssTimeToMS(value);

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
		const allowCleanup = this.self.allowCleanup;
		TempState.macroTypeQueue.push({
			id      : selfId,
			handler : this.shadowHandler(() => {
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
				new Wikifier($wrapper, contents, allowCleanup(elTag) ? undefined : { cleanup : false });

				// Cache info about the current turn.
				const passage = State.passage;
				const turn    = State.turns;

				// Skip typing if…
				if (
					// …speed is zero.
					speed === 0

					// …we've visited the passage before.
					|| !Config.macros.typeVisitedPassages
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
							scrubEventKey(ev.key) === skipKey
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
								triggerEvent(typingCompleteId);
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
						// Stop typing if…
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
							triggerEvent(typingStopId, $wrapper);

							// Add the done class to the wrapper.
							$wrapper.addClass(`${className}-done`);

							// Add the cursor class to the wrapper, if we're keeping it.
							if (cursor === 'keep') {
								$wrapper.addClass(`${className}-cursor`);
							}
						}
					};

					// Fire the typing start event.
					triggerEvent(typingStartId, $wrapper);

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
			})
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
	},

	allowCleanup(tagName) {
		switch (tagName.toUpperCase()) {
			case 'ARTICLE':
			case 'DIV':
			case 'FOOTER':
			case 'FORM':
			case 'HEADER':
			case 'MAIN':
			case 'SECTION':
				return true;
		}

		return false;
	}
});
