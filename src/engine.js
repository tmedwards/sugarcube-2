/***********************************************************************************************************************

	engine.js

	Copyright © 2013–2020 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Config, DebugView, Dialog, Has, LoadScreen, Save, State, Story, StyleWrapper, UI, UIBar, Util,
	       Wikifier, postdisplay, postrender, predisplay, prehistory, prerender, setDisplayTitle
*/

var Engine = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Engine state types object (pseudo-enumeration).
	const States = Util.toEnum({
		Idle      : 'idle',
		Playing   : 'playing',
		Rendering : 'rendering'
	});

	// Minimum delay for DOM actions (in milliseconds).
	const minDomActionDelay = 40;

	// Current state of the engine (default: `Engine.States.Idle`).
	let _state = States.Idle;

	// Last time `enginePlay()` was called (in milliseconds).
	let _lastPlay = null;

	// Cache of the debug view for the StoryInit special passage.
	let _storyInitDebugView = null;

	// Cache of the outline patching <style> element (`StyleWrapper`-wrapped).
	let _outlinePatch = null;

	// List of objects describing `StoryInterface` elements to update via passages during navigation.
	let _updating = null;


	/*******************************************************************************************************************
		Engine Functions.
	*******************************************************************************************************************/
	/*
		Initialize the core story elements and perform some bookkeeping.
	*/
	function engineInit() {
		if (DEBUG) { console.log('[Engine/engineInit()]'); }

		/*
			Remove #init-no-js & #init-lacking from #init-screen.
		*/
		jQuery('#init-no-js,#init-lacking').remove();

		/*
			Generate the core story elements and insert them into the page before the store area.
		*/
		(() => {
			const $elems = jQuery(document.createDocumentFragment());
			const markup = Story.has('StoryInterface') && Story.get('StoryInterface').text.trim();

			if (markup) {
				// Remove the UI bar, its styles, and events.
				UIBar.destroy();

				// Remove the core display area styles.
				jQuery(document.head).find('#style-core-display').remove();

				$elems.append(markup);

				if ($elems.find('#passages').length === 0) {
					throw new Error('no element with ID "passages" found within "StoryInterface" special passage');
				}

				const updating = [];

				$elems.find('[data-passage]').each((i, el) => {
					if (el.id === 'passages') {
						throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} id="passages"> must not contain a "data-passage" content attribute`);
					}

					const passage = el.getAttribute('data-passage').trim();

					if (el.firstElementChild !== null) {
						throw new Error(`"StoryInterface" element <${el.nodeName.toLowerCase()} data-passage="${passage}"> contains child elements`);
					}

					if (Story.has(passage)) {
						updating.push({
							passage,
							element : el
						});
					}
				});

				if (updating.length > 0) {
					_updating = updating;
				}

				Config.ui.updateStoryElements = false;
			}
			else {
				$elems.append('<div id="story" role="main"><div id="passages"></div></div>');
			}

			// Insert the core UI elements into the page before the main script.
			$elems.insertBefore('body>script#script-sugarcube');
		})();

		/*
			Generate and cache the ARIA outlines <style> element (`StyleWrapper`-wrapped)
			and set up the handler to manipulate the outlines.

			IDEA: http://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
		*/
		_outlinePatch = new StyleWrapper((
			() => jQuery(document.createElement('style'))
				.attr({
					id   : 'style-aria-outlines',
					type : 'text/css'
				})
				.appendTo(document.head)
				.get(0) // return the <style> element itself
		)());
		let _lastOutlineEvent;
		jQuery(document).on(
			'mousedown.aria-outlines keydown.aria-outlines',
			ev => {
				if (ev.type !== _lastOutlineEvent) {
					_lastOutlineEvent = ev.type;

					if (ev.type === 'keydown') {
						_showOutlines();
					}
					else {
						_hideOutlines();
					}
				}
			}
		);
	}

	/*
		Starts the story.
	*/
	function engineStart() {
		if (DEBUG) { console.log('[Engine/engineStart()]'); }

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
					_storyInitDebugView = debugView.output;
				}
			}
			catch (ex) {
				console.error(ex);
				Alert.error('StoryInit', ex.message);
			}
		}

		// Sanity checks.
		if (Config.passages.start == null) { // lazy equality for null
			throw new Error('starting passage not selected');
		}
		if (!Story.has(Config.passages.start)) {
			throw new Error(`starting passage ("${Config.passages.start}") not found`);
		}

		// Focus the document element initially.
		jQuery(document.documentElement).focus();

		/*
			Attempt to restore an active session.  Failing that, attempt to autoload the autosave,
			if requested.  Failing that, display the starting passage.
		*/
		if (State.restore()) {
			engineShow();
		}
		else {
			let loadStart = true;

			switch (typeof Config.saves.autoload) {
			case 'boolean':
				if (Config.saves.autoload && Save.autosave.ok() && Save.autosave.has()) {
					if (DEBUG) { console.log(`\tattempting autoload: "${Save.autosave.get().title}"`); }

					loadStart = !Save.autosave.load();
				}
				break;
			case 'string':
				if (Config.saves.autoload === 'prompt' && Save.autosave.ok() && Save.autosave.has()) {
					loadStart = false;
					UI.buildAutoload();
					Dialog.open();
				}
				break;
			case 'function':
				if (Save.autosave.ok() && Save.autosave.has() && !!Config.saves.autoload()) {
					if (DEBUG) { console.log(`\tattempting autoload: "${Save.autosave.get().title}"`); }

					loadStart = !Save.autosave.load();
				}
				break;
			}

			if (loadStart) {
				if (DEBUG) { console.log(`\tstarting passage: "${Config.passages.start}"`); }

				enginePlay(Config.passages.start);
			}
		}
	}

	/*
		Restarts the story.
	*/
	function engineRestart() {
		if (DEBUG) { console.log('[Engine/engineRestart()]'); }

		/*
			Show the loading screen to hide any unsightly rendering shenanigans during the
			page reload.
		*/
		LoadScreen.show();

		/*
			Scroll the window to the top.

			This is required by most browsers for the starting passage or it will remain at
			whatever its current scroll position is after the page reload.  We do it generally,
			rather than only for the currently set starting passage, since the starting passage
			may be dynamically manipulated.
		*/
		window.scroll(0, 0);

		/*
			Delete the active session.
		*/
		State.reset();

		/*
			Trigger an ':enginerestart' event.
		*/
		jQuery.event.trigger(':enginerestart');

		/*
			Reload the page.
		*/
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
	function engineGoTo(idx) {
		const succeded = State.goTo(idx);

		if (succeded) {
			engineShow();
		}

		return succeded;
	}

	/*
		Activate the moment at the given offset from the active moment within the state history
		and show it.
	*/
	function engineGo(offset) {
		const succeded = State.go(offset);

		if (succeded) {
			engineShow();
		}

		return succeded;
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
		if (DEBUG) { console.log(`[Engine/enginePlay(title: "${title}", noHistory: ${noHistory})]`); }

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
		// always refer to `passage.title` and never to the others.
		const passage = Story.get(passageTitle);

		// Execute the pre-history events and tasks.
		jQuery.event.trigger({
			type : ':passageinit',
			passage
		});
		Object.keys(prehistory).forEach(task => {
			if (typeof prehistory[task] === 'function') {
				prehistory[task].call(passage, task);
			}
		});

		// Create a new entry in the history.
		if (!noHistory) {
			State.create(passage.title);
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
		_lastPlay = Util.now();

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
				id             : passage.domId,
				'data-passage' : passage.title,
				'data-tags'    : dataTags
			})
			.addClass(`passage ${passage.className}`);

		// Add the passage's classes and tags to the document body.
		jQuery(document.body)
			.attr('data-tags', dataTags)
			.addClass(passage.className);

		// Add the passage's tags to the document element.
		jQuery(document.documentElement)
			.attr('data-tags', dataTags);

		// Execute pre-render events and tasks.
		jQuery.event.trigger({
			type    : ':passagestart',
			content : passageEl,
			passage
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
			type    : ':passagerender',
			content : passageEl,
			passage
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
				[...containerEl.childNodes].forEach(outgoing => {
					const $outgoing = jQuery(outgoing);

					if (outgoing.nodeType === Node.ELEMENT_NODE && $outgoing.hasClass('passage')) {
						if ($outgoing.hasClass('passage-out')) {
							return;
						}

						$outgoing
							.attr('id', `out-${$outgoing.attr('id')}`)
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
								Math.max(minDomActionDelay, Config.passages.transitionOut)
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

		// Append the passage element to the passage container and set up its transition.
		jQuery(passageEl)
			.addClass('passage-in')
			.appendTo(containerEl);
		setTimeout(() => jQuery(passageEl).removeClass('passage-in'), minDomActionDelay);

		// Update the story display title, if necessary.
		if (Story.has('StoryDisplayTitle')) {
			// NOTE: We don't have an `else` here because that case will be handled later (below).
			if (_updating !== null || !Config.ui.updateStoryElements) {
				setDisplayTitle(Story.get('StoryDisplayTitle').processText());
			}
		}
		else if (Config.passages.displayTitles && passage.title !== Config.passages.start) {
			document.title = `${passage.title} | ${Story.title}`;
		}

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
			type    : ':passagedisplay',
			content : passageEl,
			passage
		});
		Object.keys(postdisplay).forEach(task => {
			if (typeof postdisplay[task] === 'function') {
				postdisplay[task].call(passage, task);
			}
		});

		// Update the other interface elements, if necessary.
		if (_updating !== null) {
			_updating.forEach(pair => {
				jQuery(pair.element).empty();
				new Wikifier(pair.element, Story.get(pair.passage).processText().trim());
			});
		}
		else if (Config.ui.updateStoryElements) {
			UIBar.update();
		}

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

			// Prepend the cached `StoryInit` debug view, if we're showing the first moment/turn.
			if (State.turns === 1 && _storyInitDebugView != null) { // lazy equality for null
				jQuery(passageEl).prepend(_storyInitDebugView);
			}
		}

		// Last second post-processing for accessibility and other things.
		_hideOutlines(); // initially hide outlines
		jQuery('#story')
			// Add `link-external` to all `href` bearing `<a>` elements which don't have it.
			.find('a[href]:not(.link-external)')
			.addClass('link-external')
			.end()
			// Add `tabindex=0` to all interactive elements which don't have it.
			.find('a,link,button,input,select,textarea')
			.not('[tabindex]')
			.attr('tabindex', 0);

		// Handle autosaves.
		switch (typeof Config.saves.autosave) {
		case 'boolean':
			if (Config.saves.autosave) {
				Save.autosave.save();
			}
			break;
		case 'object':
			if (passage.tags.some(tag => Config.saves.autosave.includes(tag))) {
				Save.autosave.save();
			}
			break;
		case 'function':
			if (Config.saves.autosave()) {
				Save.autosave.save();
			}
			break;
		}

		// Execute post-play events.
		jQuery.event.trigger({
			type    : ':passageend',
			content : passageEl,
			passage
		});

		// Reset the engine state.
		_state = States.Idle;

		// Update the last play time.
		_lastPlay = Util.now();

		return passageEl;
	}


	/*******************************************************************************************************************
		Legacy Functions.
	*******************************************************************************************************************/
	/*
		[DEPRECATED] Play the given passage, optionally without altering the history.
	*/
	function engineDisplay(title, link, option) {
		if (DEBUG) { console.log('[Engine/engineDisplay()]'); }

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


	/*******************************************************************************************************************
		Utility Functions.
	*******************************************************************************************************************/
	function _hideOutlines() {
		_outlinePatch.set('*:focus{outline:none;}');
	}

	function _showOutlines() {
		_outlinePatch.clear();
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		/*
			Constants.
		*/
		States            : { value : States },
		minDomActionDelay : { value : minDomActionDelay },

		/*
			Core Functions.
		*/
		init        : { value : engineInit },
		start       : { value : engineStart },
		restart     : { value : engineRestart },
		state       : { get : engineState },
		isIdle      : { value : engineIsIdle },
		isPlaying   : { value : engineIsPlaying },
		isRendering : { value : engineIsRendering },
		lastPlay    : { get : engineLastPlay },
		goTo        : { value : engineGoTo },
		go          : { value : engineGo },
		backward    : { value : engineBackward },
		forward     : { value : engineForward },
		show        : { value : engineShow },
		play        : { value : enginePlay },

		/*
			Legacy Functions.
		*/
		display : { value : engineDisplay }
	}));
})();
