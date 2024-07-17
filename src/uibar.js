/***********************************************************************************************************************

	uibar.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Config, Dialog, Engine, L10n, Save, Setting, State, Story, UI, Wikifier, setDisplayTitle
*/

var UIBar = (() => { // eslint-disable-line no-unused-vars, no-var
	// jQuery-wrapped UI bar element.
	let _$uiBar = null;

	// jQuery event namespace.
	const EVENT_NS = '.ui-bar';


	/*******************************************************************************
		Initialization Functions.
	*******************************************************************************/

	function init() {
		if (BUILD_DEBUG) { console.log('[UIBar/init()]'); }

		// UI bar already exists, so bail out.
		if (document.getElementById('ui-bar')) {
			return;
		}

		// Generate the UI bar elements.
		const $elems = (() => {
			const toggleLabel   = L10n.get('uiBarLabelToggle');
			const backwardLabel = L10n.get('uiBarLabelBackward');
			const jumptoLabel   = L10n.get('uiBarLabelJumpto');
			const forwardLabel  = L10n.get('uiBarLabelForward');

			return jQuery(document.createDocumentFragment())
				.append(
					/* eslint-disable max-len */
					  '<div id="ui-bar" aria-live="polite">'
					+     '<div id="ui-bar-tray">'
					+         `<button id="ui-bar-toggle" tabindex="0" title="${toggleLabel}" aria-label="${toggleLabel}"></button>`
					+         '<div id="ui-bar-history">'
					+             `<button id="history-backward" tabindex="0" title="${backwardLabel}" aria-label="${backwardLabel}"></button>`
					+             `<button id="history-jumpto" tabindex="0" title="${jumptoLabel}" aria-label="${jumptoLabel}"></button>`
					+             `<button id="history-forward" tabindex="0" title="${forwardLabel}" aria-label="${forwardLabel}"></button>`
					+         '</div>'
					+     '</div>'
					+     '<div id="ui-bar-body">'
					+         '<header id="title" role="banner">'
					+             '<div id="story-banner"></div>'
					+             '<h1 id="story-title"></h1>'
					+             '<div id="story-subtitle"></div>'
					+             '<div id="story-title-separator"></div>'
					+             '<p id="story-author"></p>'
					+         '</header>'
					+         '<div id="story-caption"></div>'
					+         '<nav id="menu" role="navigation">'
					+             '<ul id="menu-story"></ul>'
					+             '<ul id="menu-core">'
					+                 `<li id="menu-item-continue"><a tabindex="0">${L10n.get('continueTitle')}</a></li>`
					+                 `<li id="menu-item-saves"><a tabindex="0">${L10n.get('savesTitle')}</a></li>`
					+                 `<li id="menu-item-settings"><a tabindex="0">${L10n.get('settingsTitle')}</a></li>`
					+                 `<li id="menu-item-restart"><a tabindex="0">${L10n.get('restartTitle')}</a></li>`
					+                 `<li id="menu-item-share"><a tabindex="0">${L10n.get('shareTitle')}</a></li>`
					+             '</ul>'
					+         '</nav>'
					+     '</div>'
					+ '</div>'
					/* eslint-enable max-len */
				);
		})();

		/*
			Cache the UI bar element, since its going to be used often.

			NOTE: We rewrap the element itself, rather than simply using the result
			of `find()`, so that we cache an uncluttered jQuery-wrapper—i.e., `context`
			refers to the element and there is no `prevObject`.
		*/
		_$uiBar = jQuery($elems.find('#ui-bar').get(0));

		// Insert the UI bar elements into the page before the main script.
		$elems.insertBefore('body>script#script-sugarcube');

		// Set up the UI bar's global event handlers.
		jQuery(document)
			// Set up a handler for the history-backward/-forward buttons.
			.on(`:historyupdate${EVENT_NS}`, (($backward, $forward) => () => {
				$backward.ariaDisabled(State.length < 2);
				$forward.ariaDisabled(State.length === State.size);
			})(jQuery('#history-backward'), jQuery('#history-forward')));
	}


	/*******************************************************************************
		Core Functions.
	*******************************************************************************/

	function destroy() {
		if (BUILD_DEBUG) { console.log('[UIBar/destroy()]'); }

		if (!_$uiBar) {
			return;
		}

		// Hide the UI bar.
		_$uiBar.hide();

		// Remove its namespaced events.
		jQuery(document).off(EVENT_NS);

		// Remove its styles.
		jQuery(document.head).find('#style-ui-bar').remove();

		// Remove it from the DOM.
		_$uiBar.remove();

		// Drop the reference to the element.
		_$uiBar = null;
	}

	function hide() {
		if (_$uiBar) {
			_$uiBar.hide();
		}

		return UIBar;
	}

	function isHidden() {
		return _$uiBar && _$uiBar.css('display') === 'none';
	}

	function isStowed() {
		return _$uiBar && _$uiBar.hasClass('stowed');
	}

	function show() {
		if (_$uiBar) {
			_$uiBar.show();
		}

		return UIBar;
	}

	function start() {
		if (BUILD_DEBUG) { console.log('[UIBar/start()]'); }

		if (!_$uiBar) {
			return;
		}

		// Set up the #ui-bar's initial state.
		if (
			typeof Config.ui.stowBarInitially === 'boolean'
				? Config.ui.stowBarInitially
				: jQuery(window).width() <= Config.ui.stowBarInitially
		) {
			stow(true);
		}

		// Set up the #ui-bar-toggle and #ui-bar-history widgets.
		jQuery('#ui-bar-toggle')
			.ariaClick({
				label : L10n.get('uiBarLabelToggle')
			}, () => _$uiBar.toggleClass('stowed'));

		if (Config.history.controls) {
			jQuery('#history-backward')
				.ariaDisabled(State.length < 2)
				.ariaClick({
					label : L10n.get('uiBarLabelBackward')
				}, () => Engine.backward());

			/* [DEPRECATED] */
			if (Story.filter(passage => passage.tags.includes('bookmark')).length > 0) {
				jQuery('#history-jumpto')
					.ariaClick({
						label : L10n.get('uiBarLabelJumpto')
					}, () => UI.jumpto());
			}
			else {
				jQuery('#history-jumpto').remove();
			}
			/* /[DEPRECATED] */

			jQuery('#history-forward')
				.ariaDisabled(State.length === State.size)
				.ariaClick({
					label : L10n.get('uiBarLabelForward')
				}, () => Engine.forward());
		}
		else {
			jQuery('#ui-bar-history').remove();
		}

		// Create a few `:uiupdate` event helpers.
		const addUiUpdateHandler = handler => jQuery(document)[
			Config.ui.updateStoryElements ? 'on' : 'one'
		](`:uiupdate${EVENT_NS}`, handler);
		const addUpdaterOrRemove = (selector, passageName) => {
			const $el = jQuery(selector);

			if (Story.has(passageName)) {
				addUiUpdateHandler(() => {
					const frag = document.createDocumentFragment();
					new Wikifier(frag, Story.get(passageName).processText().trim());
					$el.empty().append(frag);
				});
			}
			else {
				$el.remove();
			}
		};

		// Set up the story display title.
		{
			let storyTitleHandler;

			if (Story.has('StoryDisplayTitle')) {
				storyTitleHandler = () => setDisplayTitle(Story.get('StoryDisplayTitle').processText());
			}
			else {
				// For Twine 1.
				if (BUILD_TWINE1) { // for Twine 1
					storyTitleHandler = () => setDisplayTitle(Story.get('StoryTitle').processText());
				}

				// For Twine 2.
				else {
					storyTitleHandler = () => setDisplayTitle(Story.name, true);
				}
			}

			addUiUpdateHandler(storyTitleHandler);
		}

		// Set up our dynamic elements.
		addUpdaterOrRemove('#story-banner', 'StoryBanner');
		addUpdaterOrRemove('#story-subtitle', 'StorySubtitle');
		addUpdaterOrRemove('#story-author', 'StoryAuthor');
		addUpdaterOrRemove('#story-caption', 'StoryCaption');

		if (Story.has('StoryMenu')) {
			const $menuStory = jQuery('#menu-story');

			jQuery(document).on(`:uiupdate${EVENT_NS}`, () => {
				try {
					const frag = UI.assembleLinkList('StoryMenu', document.createDocumentFragment());
					$menuStory.empty().append(frag);
				}
				catch (ex) {
					console.error(ex);
					Alert.error('StoryMenu', ex.message);
				}
			});
		}
		else {
			jQuery('#menu-story').remove();
		}

		// Set up the Continue menu item.
		if (Save.browser.size > 0) {
			jQuery('#menu-item-continue a')
				.ariaClick({
					role : 'button'
				}, ev => {
					ev.preventDefault();
					Save.browser.continue()
						.then(
							() => {
								jQuery(document).off('.menu-item-continue');
								jQuery('#menu-item-continue').remove();
								Engine.show();
							},
							ex => UI.alert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('textAborting')}.`)
						);
				})
				.text(L10n.get('continueTitle'));
			jQuery(document).on(':passagestart.menu-item-continue', () => {
				if (State.turns > 1) {
					jQuery(document).off('.menu-item-continue');
					jQuery('#menu-item-continue').remove();
				}
			});
		}
		else {
			jQuery('#menu-item-continue').remove();
		}

		// Set up the Saves menu item.
		jQuery('#menu-item-saves a')
			.ariaClick({
				role : 'button'
			}, ev => {
				ev.preventDefault();
				UI.buildSaves();
				Dialog.open();
			})
			.text(L10n.get('savesTitle'));

		// Set up the Settings menu item.
		if (!Setting.isEmpty()) {
			jQuery('#menu-item-settings a')
				.ariaClick({
					role : 'button'
				}, ev => {
					ev.preventDefault();
					UI.buildSettings();
					Dialog.open();
				})
				.text(L10n.get('settingsTitle'));
		}
		else {
			jQuery('#menu-item-settings').remove();
		}

		// Set up the Restart menu item.
		jQuery('#menu-item-restart a')
			.ariaClick({
				role : 'button'
			}, ev => {
				ev.preventDefault();
				UI.buildRestart();
				Dialog.open();
			})
			.text(L10n.get('restartTitle'));

		// Set up the Share menu item.
		if (Story.has('StoryShare')) {
			jQuery('#menu-item-share a')
				.ariaClick({
					role : 'button'
				}, ev => {
					ev.preventDefault();
					UI.buildShare();
					Dialog.open();
				})
				.text(L10n.get('shareTitle'));
		}
		else {
			jQuery('#menu-item-share').remove();
		}
	}

	function stow(noAnimation) {
		if (_$uiBar && !_$uiBar.hasClass('stowed')) {
			let $story;

			if (noAnimation) {
				$story = jQuery('#story');
				$story.addClass('no-transition');
				_$uiBar.addClass('no-transition');
			}

			_$uiBar.addClass('stowed');

			if (noAnimation) {
				setTimeout(() => {
					$story.removeClass('no-transition');
					_$uiBar.removeClass('no-transition');
				}, Engine.DOM_DELAY);
			}
		}

		return UIBar;
	}

	function unstow(noAnimation) {
		if (_$uiBar && _$uiBar.hasClass('stowed')) {
			let $story;

			if (noAnimation) {
				$story = jQuery('#story');
				$story.addClass('no-transition');
				_$uiBar.addClass('no-transition');
			}

			_$uiBar.removeClass('stowed');

			if (noAnimation) {
				setTimeout(() => {
					$story.removeClass('no-transition');
					_$uiBar.removeClass('no-transition');
				}, Engine.DOM_DELAY);
			}
		}

		return UIBar;
	}


	/*******************************************************************************
		Deprecated Functions.
	*******************************************************************************/

	// [DEPRECATED]
	function update() {
		if (BUILD_DEBUG) { console.log('[UIBar/update()]'); }

		console.warn('[DEPRECATED] UIBar.update() is deprecated.');

		if (!_$uiBar) {
			return;
		}

		UI.update();

		return UIBar;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Initialization Functions.
		init : { value : init },

		// Core Functions.
		destroy  : { value : destroy },
		hide     : { value : hide },
		isHidden : { value : isHidden },
		isStowed : { value : isStowed },
		show     : { value : show },
		start    : { value : start },
		stow     : { value : stow },
		unstow   : { value : unstow },

		// Deprecated Functions.
		setStoryElements : { value : update },
		update           : { value : update }
	}));
})();
