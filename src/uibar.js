/***********************************************************************************************************************

	uibar.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Dialog, Engine, L10n, Setting, State, Story, UI, Config, setDisplayTitle, setPageElement
*/

var UIBar = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// UI bar element cache.
	let _$uiBar = null;


	/*******************************************************************************
		UI Bar Functions.
	*******************************************************************************/

	function uiBarDestroy() {
		if (DEBUG) { console.log('[UIBar/uiBarDestroy()]'); }

		if (!_$uiBar) {
			return;
		}

		// Hide the UI bar.
		_$uiBar.hide();

		// Remove its namespaced events.
		jQuery(document).off('.ui-bar');

		// Remove its styles.
		jQuery(document.head).find('#style-ui-bar').remove();

		// Remove it from the DOM.
		_$uiBar.remove();

		// Drop the reference to the element.
		_$uiBar = null;
	}

	function uiBarHide() {
		if (_$uiBar) {
			_$uiBar.hide();
		}

		return this;
	}

	function uiBarInit() {
		if (DEBUG) { console.log('[UIBar/uiBarInit()]'); }

		if (document.getElementById('ui-bar')) {
			return;
		}

		// Generate the UI bar elements.
		const $elems = (() => {
			const toggleLabel   = L10n.get('uiBarToggle');
			const backwardLabel = L10n.get('uiBarBackward');
			const jumptoLabel   = L10n.get('uiBarJumpto');
			const forwardLabel  = L10n.get('uiBarForward');

			return jQuery(document.createDocumentFragment())
				.append(
					/* eslint-disable max-len */
					  '<div id="ui-bar">'
					+     '<div id="ui-bar-tray">'
					+         `<button id="ui-bar-toggle" tabindex="0" title="${toggleLabel}" aria-label="${toggleLabel}"></button>`
					+         '<div id="ui-bar-history">'
					+             `<button id="history-backward" tabindex="0" title="${backwardLabel}" aria-label="${backwardLabel}">\uE821</button>`
					+             `<button id="history-jumpto" tabindex="0" title="${jumptoLabel}" aria-label="${jumptoLabel}">\uE839</button>`
					+             `<button id="history-forward" tabindex="0" title="${forwardLabel}" aria-label="${forwardLabel}">\uE822</button>`
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
			of `find()`, so that we cache an uncluttered jQuery-wrapper (i.e. `context`
			refers to the element and there is no `prevObject`).
		*/
		_$uiBar = jQuery($elems.find('#ui-bar').get(0));

		// Insert the UI bar elements into the page before the main script.
		$elems.insertBefore('body>script#script-sugarcube');

		// Set up the UI bar's global event handlers.
		jQuery(document)
			// Set up a handler for the history-backward/-forward buttons.
			.on(':historyupdate.ui-bar', (($backward, $forward) => () => {
				$backward.ariaDisabled(State.length < 2);
				$forward.ariaDisabled(State.length === State.size);
			})(jQuery('#history-backward'), jQuery('#history-forward')));
	}

	function uiBarIsHidden() {
		return _$uiBar && _$uiBar.css('display') === 'none';
	}

	function uiBarIsStowed() {
		return _$uiBar && _$uiBar.hasClass('stowed');
	}

	function uiBarShow() {
		if (_$uiBar) {
			_$uiBar.show();
		}

		return this;
	}

	function uiBarStart() {
		if (DEBUG) { console.log('[UIBar/uiBarStart()]'); }

		if (!_$uiBar) {
			return;
		}

		// Set up the #ui-bar's initial state.
		if (
			typeof Config.ui.stowBarInitially === 'boolean'
				? Config.ui.stowBarInitially
				: jQuery(window).width() <= Config.ui.stowBarInitially
		) {
			uiBarStow(true);
		}

		// Set up the #ui-bar-toggle and #ui-bar-history widgets.
		jQuery('#ui-bar-toggle')
			.ariaClick({
				label : L10n.get('uiBarToggle')
			}, () => _$uiBar.toggleClass('stowed'));

		if (Config.history.controls) {
			jQuery('#history-backward')
				.ariaDisabled(State.length < 2)
				.ariaClick({
					label : L10n.get('uiBarBackward')
				}, () => Engine.backward());

			if (Story.lookup('tags', 'bookmark').length > 0) {
				jQuery('#history-jumpto')
					.ariaClick({
						label : L10n.get('uiBarJumpto')
					}, () => UI.jumpto());
			}
			else {
				jQuery('#history-jumpto').remove();
			}

			jQuery('#history-forward')
				.ariaDisabled(State.length === State.size)
				.ariaClick({
					label : L10n.get('uiBarForward')
				}, () => Engine.forward());
		}
		else {
			jQuery('#ui-bar-history').remove();
		}

		// Set up the story display title.
		if (Story.has('StoryDisplayTitle')) {
			setDisplayTitle(Story.get('StoryDisplayTitle').processText());
		}
		else {
			if (TWINE1) { // for Twine 1
				setPageElement('story-title', 'StoryTitle', Story.title);
			}
			else { // for Twine 2
				jQuery('#story-title').text(Story.title);
			}
		}

		// Set up the dynamic page elements.
		if (!Story.has('StoryCaption')) {
			jQuery('#story-caption').remove();
		}

		if (!Story.has('StoryMenu')) {
			jQuery('#menu-story').remove();
		}

		if (!Config.ui.updateStoryElements) {
			// We only need to set the story elements here if `Config.ui.updateStoryElements`
			// is falsy, since otherwise they will be set by `Engine.play()`.
			uiBarUpdate();
		}

		// Set up the Saves menu item.
		jQuery('#menu-item-saves a')
			.ariaClick(ev => {
				ev.preventDefault();
				UI.buildSaves();
				Dialog.open();
			})
			.text(L10n.get('savesTitle'));

		// Set up the Settings menu item.
		if (!Setting.isEmpty()) {
			jQuery('#menu-item-settings a')
				.ariaClick(ev => {
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
			.ariaClick(ev => {
				ev.preventDefault();
				UI.buildRestart();
				Dialog.open();
			})
			.text(L10n.get('restartTitle'));

		// Set up the Share menu item.
		if (Story.has('StoryShare')) {
			jQuery('#menu-item-share a')
				.ariaClick(ev => {
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

	function uiBarStow(noAnimation) {
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
				}, Engine.minDomActionDelay);
			}
		}

		return this;
	}

	function uiBarUnstow(noAnimation) {
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
				}, Engine.minDomActionDelay);
			}
		}

		return this;
	}

	function uiBarUpdate() {
		if (DEBUG) { console.log('[UIBar/uiBarUpdate()]'); }

		if (!_$uiBar) {
			return;
		}

		// Set up the (non-navigation) dynamic page elements.
		setPageElement('story-banner', 'StoryBanner');
		if (Story.has('StoryDisplayTitle')) {
			setDisplayTitle(Story.get('StoryDisplayTitle').processText());
		}
		setPageElement('story-subtitle', 'StorySubtitle');
		setPageElement('story-author', 'StoryAuthor');
		setPageElement('story-caption', 'StoryCaption');

		// Set up the #menu-story items.
		const menuStory = document.getElementById('menu-story');

		if (menuStory !== null) {
			jQuery(menuStory).empty();

			if (Story.has('StoryMenu')) {
				try {
					UI.assembleLinkList('StoryMenu', menuStory);
				}
				catch (ex) {
					console.error(ex);
					Alert.error('StoryMenu', ex.message);
				}
			}
		}
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze(Object.defineProperties({}, {
		destroy  : { value : uiBarDestroy },
		hide     : { value : uiBarHide },
		init     : { value : uiBarInit },
		isHidden : { value : uiBarIsHidden },
		isStowed : { value : uiBarIsStowed },
		show     : { value : uiBarShow },
		start    : { value : uiBarStart },
		stow     : { value : uiBarStow },
		unstow   : { value : uiBarUnstow },
		update   : { value : uiBarUpdate },

		// Legacy Functions.
		setStoryElements : { value : uiBarUpdate }
	}));
})();
