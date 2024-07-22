/***********************************************************************************************************************

	engine.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Config, DebugView, Dialog, Has, LoadScreen, Save, Scripting, State, Story, StyleWrapper, UI,
	       UIBar, Wikifier, enumFrom, getErrorMessage, now, postdisplay, postrender, predisplay, prehistory,
	       prerender, triggerEvent
*/

var Engine = (() => { // eslint-disable-line no-unused-vars, no-var
	// Engine state types object.
	const States = enumFrom({
		Init      : 'init',
		Idle      : 'idle',
		Playing   : 'playing',
		Rendering : 'rendering'
	});

	// Minimum delay for DOM actions (in milliseconds).
	const DOM_DELAY = 40;

	// Cache of the debug view(s) for initialization special passage(s).
	const _initDebugViews = [];

	// Current state of the engine.
	let _state = States.Init;

	// Last time `enginePlay()` was called (in milliseconds).
	let _lastPlay = null;

	// jQuery event namespace.
	const EVENT_NS = '.engine';


	/*******************************************************************************
		Engine Functions.
	*******************************************************************************/

	/*
		Initialize the core story elements and perform some bookkeeping.
	*/
	function engineInit() {
		if (BUILD_DEBUG) { console.log('[Engine/engineInit()]'); }

		if (_state !== States.Init) {
			return;
		}

		// Remove #init-no-js & #init-lacking from #init-screen.
		jQuery('#init-no-js,#init-lacking').remove();

		// Generate the main UI container.
		const $main = jQuery('<div id="story" role="main"></div>');

		// Get the user's UI markup, if any.
		const markup = Story.has('StoryInterface') && Story.get('StoryInterface').text.trim();

		// If user markup exists, remove unnecessary default UI and process the markup.
		if (markup) {
			// Disable updates on default UI elements.
			Config.ui.updateStoryElements = false;

			// Remove the default UI bar, including its styles and events.
			UIBar.destroy();

			// Remove the default passage display area styles.
			jQuery(document.head).find('#style-core-display').remove();

			// Append the user's UI elements to the main UI container.
			$main.append(markup);

			// Bail out if a child `#story` exists.
			if ($main.find('#story').length > 0) {
				throw new Error('element with ID "story" found within "StoryInterface" special passage');
			}

			// Cache the `#passages` element.
			const $passages = $main.find('#passages');

			// Bail out if `#passages` is nonexistent.
			if ($passages.length === 0) {
				throw new Error('no element with ID "passages" found within "StoryInterface" special passage');
			}

			// Empty `#passages` and, if necessary, add an `aria-live="polite"` content attribute.
			$passages
				.empty()
				// Without an existing `aria-live`.
				.not('[aria-live]')
				.attr('aria-live', 'polite')
				.end();

			// Cache the data passage elements now to prevent recursive processing.
			const $dataInitPassages = $main.find('[data-init-passage]');
			const $dataPassages     = $main.find('[data-passage]');

			// Data passage elements updated once during initialization.
			$dataInitPassages.each((i, el) => {
				if (el.id === 'passages') {
					throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} id="passages"> must not contain a "data-init-passage" content attribute`);
				}

				const passage = el.getAttribute('data-init-passage').trim();

				if (el.hasAttribute('data-passage')) {
					throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} data-init-passage="${passage}"> must not contain a "data-passage" content attribute`);
				}

				if (el.firstElementChild !== null) {
					throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} data-init-passage="${passage}"> contains child elements`);
				}

				if (Story.has(passage)) {
					jQuery(document).one(`:uiupdate${EVENT_NS}`, () => {
						const frag = document.createDocumentFragment();
						new Wikifier(frag, Story.get(passage).processText().trim());
						jQuery(el).empty().append(frag);
					});
				}
			});

			// Data passage elements updated upon navigation.
			$dataPassages.each((i, el) => {
				if (el.id === 'passages') {
					throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} id="passages"> must not contain a "data-passage" content attribute`);
				}

				const passage = el.getAttribute('data-passage').trim();

				if (el.firstElementChild !== null) {
					throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} data-passage="${passage}"> contains child elements`);
				}

				if (Story.has(passage)) {
					jQuery(document).on(`:uiupdate${EVENT_NS}`, () => {
						const frag = document.createDocumentFragment();
						new Wikifier(frag, Story.get(passage).processText().trim());
						jQuery(el).empty().append(frag);
					});
				}
			});
		}

		// Elsewise, generate the default passage display area UI elements.
		else {
			$main.append('<div id="passages" aria-live="polite"></div>');
		}

		// Insert the main UI into the page before the main script.
		$main.insertBefore('body>script#script-sugarcube');
	}

	/*
		Run user scripts (user stylesheet, JavaScript, and widgets).
	*/
	function engineRunUserScripts() {
		if (BUILD_DEBUG) { console.log('[Engine/engineRunUserScripts()]'); }

		if (_state !== States.Init) {
			return;
		}

		// Load the user styles.
		(() => {
			const storyStyle = document.createElement('style');

			new StyleWrapper(storyStyle)
				.add(Story.getStyles().map(style => style.text.trim()).join('\n'));

			jQuery(storyStyle)
				.appendTo(document.head)
				.attr({
					id   : 'style-story',
					type : 'text/css'
				});
		})();

		// Load the user scripts.
		Story.getScripts().forEach(script => {
			try {
				Scripting.evalJavaScript(script.text);
			}
			catch (ex) {
				console.error(ex);
				Alert.error(script.name, getErrorMessage(ex));
			}
		});

		// Load the user widgets.
		Story.getWidgets().forEach(widget => {
			try {
				Wikifier.wikifyEval(widget.processText());
			}
			catch (ex) {
				console.error(ex);
				Alert.error(widget.name, getErrorMessage(ex));
			}
		});
	}

	/*
		Run the user init passages.
	*/
	function engineRunUserInit() {
		if (BUILD_DEBUG) { console.log('[Engine/engineRunUserInit()]'); }

		if (_state !== States.Init) {
			return;
		}

		/*
			Execute `init`-tagged special passages.
		*/
		Story.getInits().forEach(passage => {
			try {
				const debugBuffer = Wikifier.wikifyEval(passage.text);

				if (Config.debug) {
					const debugView = new DebugView(
						document.createDocumentFragment(),
						'special',
						`${passage.name} [init-tagged]`,
						`${passage.name} [init-tagged]`
					);
					debugView.modes({ hidden : true });
					debugView.append(debugBuffer);
					_initDebugViews.push(debugView.output);
				}
			}
			catch (ex) {
				console.error(ex);
				Alert.error(`${passage.name} [init-tagged]`, getErrorMessage(ex));
			}
		});

		/*
			Execute the StoryInit special passage.
		*/
		if (Story.has('StoryInit')) {
			try {
				const debugBuffer = Wikifier.wikifyEval(Story.get('StoryInit').text);

				if (Config.debug) {
					const debugView = new DebugView(
						document.createDocumentFragment(),
						'special',
						'StoryInit',
						'StoryInit'
					);
					debugView.modes({ hidden : true });
					debugView.append(debugBuffer);
					_initDebugViews.push(debugView.output);
				}
			}
			catch (ex) {
				console.error(ex);
				Alert.error('StoryInit', getErrorMessage(ex));
			}
		}
	}

	/*
		Starts the story.
	*/
	function engineStart() {
		if (BUILD_DEBUG) { console.log('[Engine/engineStart()]'); }

		if (_state !== States.Init) {
			return;
		}

		// Sanity checks.
		if (Config.passages.start == null) { // lazy equality for null
			throw new Error('starting passage not selected');
		}
		if (!Story.has(Config.passages.start)) {
			throw new Error(`starting passage ("${Config.passages.start}") not found`);
		}

		// Update the engine state.
		_state = States.Idle;

		// Focus the document element initially.
		document.documentElement.focus();

		// Attempt to restore an active session.  Failing that, attempt to
		// autoload the auto save, if requested.  Failing that, display the
		// starting passage.
		if (State.restore()) {
			engineShow();
		}
		else {
			const autoloadType = typeof Config.saves._internal_autoload_;

			if (autoloadType === 'string') {
				if (Config.saves._internal_autoload_ === 'prompt') {
					UI.buildAutoload();
					Dialog.open();
				}
			}
			else {
				new Promise((resolve, reject) => {
					if (
						Save.browser.size > 0
						&& (
							autoloadType === 'boolean' && Config.saves._internal_autoload_
							|| autoloadType === 'function' && Config.saves._internal_autoload_()
						)
					) {
						return resolve();
					}

					reject(); // eslint-disable-line prefer-promise-reject-errors
				})
					.then(() => {
						if (BUILD_DEBUG) { console.log('\tattempting autoload of browser continue'); }

						Save.browser.continue();
						engineShow();
					})
					.catch(() => {
						if (BUILD_DEBUG) { console.log(`\tstarting passage: "${Config.passages.start}"`); }

						enginePlay(Config.passages.start);
					});
			}
		}
	}

	/*
		Restarts the story.
	*/
	function engineRestart() {
		if (BUILD_DEBUG) { console.log('[Engine/engineRestart()]'); }

		// Show the loading screen to hide any unsightly rendering shenanigans
		// during the page reload.
		LoadScreen.show();

		// Scroll the window to the top.
		//
		// NOTE: This is required by most browsers for the starting passage or
		// it will remain at whatever its current scroll position is after the
		// page reload.  We do it generally, rather than only for the currently
		// set starting passage, since the starting passage may be dynamically
		// manipulated.
		window.scroll(0, 0);

		// Delete the active session.
		State.reset();

		// Trigger an ':enginerestart' event.
		triggerEvent(':enginerestart');

		// Reload the page.
		window.location.reload();
	}

	/*
		Returns the current state of the engine.
	*/
	function engineState() {
		return _state;
	}

	/*
		Returns whether the engine is idle.
	*/
	function engineIsIdle() {
		return _state === States.Idle;
	}

	/*
		Returns whether the engine is playing.
	*/
	function engineIsPlaying() {
		return _state !== States.Idle;
	}

	/*
		Returns whether the engine is rendering.
	*/
	function engineIsRendering() {
		return _state === States.Rendering;
	}

	/*
		Returns a timestamp representing the last time `Engine.play()` was called.
	*/
	function engineLastPlay() {
		return _lastPlay;
	}

	/*
		Activate the moment at the given index within the state history and show it.
	*/
	function engineGoTo(index) {
		const succeeded = State.goTo(index);

		if (succeeded) {
			engineShow();
		}

		return succeeded;
	}

	/*
		Activate the moment at the given offset from the active moment within the state history
		and show it.
	*/
	function engineGo(offset) {
		const succeeded = State.go(offset);

		if (succeeded) {
			engineShow();
		}

		return succeeded;
	}

	/*
		Go to the moment which directly precedes the active moment and show it.
	*/
	function engineBackward() {
		return engineGo(-1);
	}

	/*
		Go to the moment which directly follows the active moment and show it.
	*/
	function engineForward() {
		return engineGo(1);
	}

	/*
		Renders and displays the active (present) moment's associated passage without adding
		a new moment to the history.
	*/
	function engineShow() {
		return enginePlay(State.passage, true);
	}

	/*
		Renders and displays the passage referenced by the given title, optionally without
		adding a new moment to the history.
	*/
	function enginePlay(title, noHistory) {
		if (_state === States.Init) {
			return false;
		}

		if (BUILD_DEBUG) { console.log(`[Engine/enginePlay(title: "${title}", noHistory: ${noHistory})]`); }

		let passageTitle = title;

		// Update the engine state.
		_state = States.Playing;

		// Reset the temporary state and variables objects.
		TempState = {}; // eslint-disable-line no-undef
		State.clearTemporary();

		// Debug view setup.
		let passageReadyOutput;
		let passageDoneOutput;

		// Execute the navigation override callback.
		if (typeof Config.navigation.override === 'function') {
			try {
				const overrideTitle = Config.navigation.override(passageTitle);

				if (overrideTitle) {
					passageTitle = overrideTitle;
				}
			}
			catch (ex) { /* no-op */ }
		}

		// Retrieve the passage by the given title.
		//
		// NOTE: The values of the `title` parameter and `passageTitle` variable
		// may be empty, strings, or numbers (though using a number as reference
		// to a numeric title should be discouraged), so after loading the passage,
		// always refer to `passage.name` and never to the others.
		const passage = Story.get(passageTitle);

		// Execute the pre-history events and tasks.
		jQuery.event.trigger({
			/* legacy */
			passage,
			/* /legacy */

			type   : ':passageinit',
			detail : {
				passage
			}
		});
		Object.keys(prehistory).forEach(task => {
			if (typeof prehistory[task] === 'function') {
				prehistory[task].call(passage, task);
			}
		});

		// Create a new entry in the history.
		if (!noHistory) {
			State.create(passage.name);
		}

		// Clear the document body's classes.
		if (document.body.className) {
			document.body.className = '';
		}

		// Update the last play time.
		//
		// NOTE: This is mostly for event, task, and special passage code,
		// though the likelihood of it being needed this early is low.  This
		// will be updated again later at the end.
		_lastPlay = now();

		// Execute pre-display tasks and the `PassageReady` special passage.
		Object.keys(predisplay).forEach(task => {
			if (typeof predisplay[task] === 'function') {
				predisplay[task].call(passage, task);
			}
		});

		if (Story.has('PassageReady')) {
			try {
				passageReadyOutput = Wikifier.wikifyEval(Story.get('PassageReady').text);
			}
			catch (ex) {
				console.error(ex);
				Alert.error('PassageReady', ex.message);
			}
		}

		// Update the engine state.
		_state = States.Rendering;

		// Get the passage's tags as a string, or `null` if there aren't any.
		const dataTags = passage.tags.length > 0 ? passage.tags.join(' ') : null;

		// Create and set up the incoming passage element.
		const passageEl = document.createElement('div');
		jQuery(passageEl)
			.attr({
				id             : passage.id,
				'data-passage' : passage.name,
				'data-tags'    : dataTags
			})
			.addClass(`passage passage-in ${passage.className}`);

		// Add the passage's classes and tags to the document body.
		jQuery(document.body)
			.attr('data-tags', dataTags)
			.addClass(passage.className);

		// Add the passage's tags to the document element.
		jQuery(document.documentElement)
			.attr('data-tags', dataTags);

		// Execute pre-render events and tasks.
		jQuery.event.trigger({
			/* legacy */
			content : passageEl,
			passage,
			/* /legacy */

			type   : ':passagestart',
			detail : {
				content : passageEl,
				passage
			}
		});
		Object.keys(prerender).forEach(task => {
			if (typeof prerender[task] === 'function') {
				prerender[task].call(passage, passageEl, task);
			}
		});

		// Render the `PassageHeader` passage, if it exists, into the passage element.
		if (Story.has('PassageHeader')) {
			new Wikifier(passageEl, Story.get('PassageHeader').processText());
		}

		// Render the passage into its element.
		passageEl.appendChild(passage.render());

		// Render the `PassageFooter` passage, if it exists, into the passage element.
		if (Story.has('PassageFooter')) {
			new Wikifier(passageEl, Story.get('PassageFooter').processText());
		}

		// Execute post-render events and tasks.
		jQuery.event.trigger({
			/* legacy */
			content : passageEl,
			passage,
			/* /legacy */

			type   : ':passagerender',
			detail : {
				content : passageEl,
				passage
			}
		});
		Object.keys(postrender).forEach(task => {
			if (typeof postrender[task] === 'function') {
				postrender[task].call(passage, passageEl, task);
			}
		});

		// Cache the passage container.
		const containerEl = document.getElementById('passages');

		// Empty the passage container.
		if (containerEl.hasChildNodes()) {
			if (
				typeof Config.passages.transitionOut === 'number'
				|| typeof Config.passages.transitionOut === 'string'
				&& Config.passages.transitionOut !== ''
				&& Has.transitionEndEvent
			) {
				Array.from(containerEl.childNodes).forEach(outgoing => {
					const $outgoing = jQuery(outgoing);

					if (outgoing.nodeType === Node.ELEMENT_NODE && $outgoing.hasClass('passage')) {
						if ($outgoing.hasClass('passage-out')) {
							return;
						}

						$outgoing
							.attr({
								id            : `out-${$outgoing.attr('id')}`,
								'aria-hidden' : 'true',
								'aria-live'   : 'off'
							})
							.addClass('passage-out');

						if (typeof Config.passages.transitionOut === 'string') {
							$outgoing.on(Has.transitionEndEvent, ev => {
								if (ev.originalEvent.propertyName === Config.passages.transitionOut) {
									$outgoing.remove();
								}
							});
						}
						else {
							setTimeout(
								() => $outgoing.remove(),
								Math.max(DOM_DELAY, Config.passages.transitionOut)
							);
						}
					}
					else {
						$outgoing.remove();
					}
				});
			}
			else {
				jQuery(containerEl).empty();
			}
		}

		// Append the passage element to the passage container and initiate
		// its transition animation.
		jQuery(passageEl).appendTo(containerEl);
		setTimeout(() => jQuery(passageEl).removeClass('passage-in'), DOM_DELAY / 2);

		// Scroll the window to the top.
		window.scroll(0, 0);

		// Update the engine state.
		_state = States.Playing;

		// Execute post-display events, tasks, and the `PassageDone` special passage.
		if (Story.has('PassageDone')) {
			try {
				passageDoneOutput = Wikifier.wikifyEval(Story.get('PassageDone').text);
			}
			catch (ex) {
				console.error(ex);
				Alert.error('PassageDone', ex.message);
			}
		}

		jQuery.event.trigger({
			/* legacy */
			content : passageEl,
			passage,
			/* /legacy */

			type   : ':passagedisplay',
			detail : {
				content : passageEl,
				passage
			}
		});
		Object.keys(postdisplay).forEach(task => {
			if (typeof postdisplay[task] === 'function') {
				postdisplay[task].call(passage, task);
			}
		});

		// Execute UI update events.
		UI.update();

		// Add the completed debug views for `StoryInit`, `PassageReady`, and `PassageDone`
		// to the incoming passage element.
		if (Config.debug) {
			let debugView;

			// Prepend the `PassageReady` debug view.
			if (passageReadyOutput != null) { // lazy equality for null
				debugView = new DebugView(
					document.createDocumentFragment(),
					'special',
					'PassageReady',
					'PassageReady'
				);
				debugView.modes({ hidden : true });
				debugView.append(passageReadyOutput);
				jQuery(passageEl).prepend(debugView.output);
			}

			// Append the `PassageDone` debug view.
			if (passageDoneOutput != null) { // lazy equality for null
				debugView = new DebugView(
					document.createDocumentFragment(),
					'special',
					'PassageDone',
					'PassageDone'
				);
				debugView.modes({ hidden : true });
				debugView.append(passageDoneOutput);
				jQuery(passageEl).append(debugView.output);
			}

			// Prepend the cached initialization debug views, if we're showing the first moment/turn.
			if (State.turns === 1 && _initDebugViews.length > 0) {
				jQuery(passageEl).prepend(_initDebugViews);
			}
		}

		// Last second post-processing for accessibility and other things.
		jQuery('#story')
			// Add `tabindex=0` to all interactive elements that don't have it.
			.find('a,link,button,input,select,textarea')
			.not('[tabindex]')
			.attr('tabindex', 0);

		// Handle autosaves.
		if (State.turns > 1 && Save.browser.auto.isEnabled()) {
			Save.browser.auto.save();
		}

		// Execute post-play events.
		jQuery.event.trigger({
			/* legacy */
			content : passageEl,
			passage,
			/* /legacy */

			type   : ':passageend',
			detail : {
				content : passageEl,
				passage
			}
		});

		// Reset the engine state.
		_state = States.Idle;

		// Update the last play time.
		_lastPlay = now();

		return passageEl;
	}


	/*******************************************************************************
		Deprecated Functions.
	*******************************************************************************/

	/*
		[DEPRECATED] Play the given passage, optionally without altering the history.
	*/
	function engineDisplay(title, link, option) {
		if (BUILD_DEBUG) { console.log('[Engine/engineDisplay()]'); }

		console.warn('[DEPRECATED] Engine.display() is deprecated.');

		let noHistory = false;

		// Process the option parameter.
		switch (option) {
			case undefined:
				/* no-op */
				break;

			case 'replace':
			case 'back':
				noHistory = true;
				break;

			default:
				throw new Error(`Engine.display option parameter called with obsolete value "${option}"; please notify the developer`);
		}

		enginePlay(title, noHistory);
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Constants.
		States    : { value : States },
		DOM_DELAY : { get : () => DOM_DELAY },

		// Core Functions.
		init           : { value : engineInit },
		runUserScripts : { value : engineRunUserScripts },
		runUserInit    : { value : engineRunUserInit },
		start          : { value : engineStart },
		restart        : { value : engineRestart },
		state          : { get : engineState },
		isIdle         : { value : engineIsIdle },
		isPlaying      : { value : engineIsPlaying },
		isRendering    : { value : engineIsRendering },
		lastPlay       : { get : engineLastPlay },
		goTo           : { value : engineGoTo },
		go             : { value : engineGo },
		backward       : { value : engineBackward },
		forward        : { value : engineForward },
		show           : { value : engineShow },
		play           : { value : enginePlay },

		// Deprecated Functions.
		display           : { value : engineDisplay },
		minDomActionDelay : { get : () => DOM_DELAY }
	}));
})();
