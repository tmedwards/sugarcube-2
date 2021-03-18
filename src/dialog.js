/***********************************************************************************************************************

	dialog.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Has, L10n, safeActiveElement */

var Dialog = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Dialog element caches.
	let _$overlay       = null;
	let _$dialog        = null;
	let _$dialogTitle   = null;
	let _$dialogBody    = null;

	// The last active/focused non-dialog element.
	let _lastActive     = null;

	// The width of the browser's scrollbars.
	let _scrollbarWidth = 0;

	// Dialog mutation resize handler.
	let _dialogObserver = null;


	/*******************************************************************************
		Dialog Functions.
	*******************************************************************************/

	/*
		[DEPRECATED] Adds a click hander to the target element(s) which opens the dialog modal.
	*/
	function dialogAddClickHandler(targets, options, startFn, doneFn, closeFn) {
		return jQuery(targets).ariaClick(ev => {
			ev.preventDefault();

			// Call the start function.
			if (typeof startFn === 'function') {
				startFn(ev);
			}

			// Open the dialog.
			dialogOpen(options, closeFn);

			// Call the done function.
			if (typeof doneFn === 'function') {
				doneFn(ev);
			}
		});
	}

	function dialogBodyAppend(...args) {
		_$dialogBody.append(...args);
		return Dialog;
	}

	function dialogBody() {
		return _$dialogBody.get(0);
	}

	function dialogClose(ev) {
		// Trigger a `:dialogclosing` event on the dialog body.
		_$dialogBody.trigger(':dialogclosing');

		// Largely reverse the actions taken in `dialogOpen()`.
		jQuery(document)
			.off('.dialog-close');
		if (_dialogObserver) {
			_dialogObserver.disconnect();
			_dialogObserver = null;
		}
		else {
			_$dialogBody
				.off('.dialog-resize');
		}
		jQuery(window)
			.off('.dialog-resize');
		_$dialog
			.removeClass('open')
			.css({ left : '', right : '', top : '', bottom : '' });

		jQuery('#ui-bar,#story')
			.find('[tabindex=-2]')
			.removeAttr('aria-hidden')
			.attr('tabindex', 0);
		jQuery('body>[tabindex=-3]')
			.removeAttr('aria-hidden')
			.removeAttr('tabindex');

		_$overlay
			.removeClass('open');
		jQuery(document.documentElement)
			.removeAttr('data-dialog');

		// Clear the dialog's content.
		_$dialogTitle
			.empty();
		_$dialogBody
			.empty()
			.removeClass();

		// Attempt to restore focus to whichever element had it prior to opening the dialog.
		if (_lastActive !== null) {
			jQuery(_lastActive).focus();
			_lastActive = null;
		}

		// Call the given "on close" callback function, if any.
		if (ev && ev.data && typeof ev.data.closeFn === 'function') {
			ev.data.closeFn(ev);
		}

		// Trigger a `:dialogclosed` event on the dialog body.
		/* legacy */
		_$dialogBody.trigger(':dialogclose');
		/* /legacy */
		_$dialogBody.trigger(':dialogclosed');

		return Dialog;
	}

	function dialogInit() {
		if (DEBUG) { console.log('[Dialog/dialogInit()]'); }

		if (document.getElementById('ui-dialog')) {
			return;
		}

		/*
			Calculate and cache the width of scrollbars.
		*/
		_scrollbarWidth = (() => {
			let scrollbarWidth;

			try {
				const inner = document.createElement('p');
				const outer = document.createElement('div');

				inner.style.width      = '100%';
				inner.style.height     = '200px';
				outer.style.position   = 'absolute';
				outer.style.left       = '0px';
				outer.style.top        = '0px';
				outer.style.width      = '100px';
				outer.style.height     = '100px';
				outer.style.visibility = 'hidden';
				outer.style.overflow   = 'hidden';

				outer.appendChild(inner);
				document.body.appendChild(outer);

				const w1 = inner.offsetWidth;
				/*
					The `overflow: scroll` style property value does not work consistently
					with scrollbars which are styled with `::-webkit-scrollbar`, so we use
					`overflow: auto` with dimensions guaranteed to force a scrollbar.
				*/
				outer.style.overflow = 'auto';
				let w2 = inner.offsetWidth;

				if (w1 === w2) {
					w2 = outer.clientWidth;
				}

				document.body.removeChild(outer);

				scrollbarWidth = w1 - w2;
			}
			catch (ex) { /* no-op */ }

			return scrollbarWidth || 17; // 17px is a reasonable failover
		})();

		/*
			Generate the dialog elements.
		*/
		const $elems = jQuery(document.createDocumentFragment())
			.append(
				/* eslint-disable max-len */
				  '<div id="ui-overlay" class="ui-close"></div>'
				+ '<div id="ui-dialog" tabindex="0" role="dialog" aria-labelledby="ui-dialog-title">'
				+     '<div id="ui-dialog-titlebar">'
				+         '<h1 id="ui-dialog-title"></h1>'
				+         `<button id="ui-dialog-close" class="ui-close" tabindex="0" aria-label="${L10n.get('close')}">\uE804</button>`
				+     '</div>'
				+     '<div id="ui-dialog-body"></div>'
				+ '</div>'
				/* eslint-enable max-len */
			);

		/*
			Cache the dialog elements, since they're going to be used often.

			NOTE: We rewrap the elements themselves, rather than simply using
			the results of `find()`, so that we cache uncluttered jQuery-wrappers
			(i.e. `context` refers to the elements and there is no `prevObject`).
		*/
		_$overlay     = jQuery($elems.find('#ui-overlay').get(0));
		_$dialog      = jQuery($elems.find('#ui-dialog').get(0));
		_$dialogTitle = jQuery($elems.find('#ui-dialog-title').get(0));
		_$dialogBody  = jQuery($elems.find('#ui-dialog-body').get(0));

		/*
			Insert the dialog elements into the page before the main script.
		*/
		$elems.insertBefore('body>script#script-sugarcube');
	}

	function dialogIsOpen(classNames) {
		return _$dialog.hasClass('open')
			&& (classNames ? classNames.splitOrEmpty(/\s+/).every(cn => _$dialogBody.hasClass(cn)) : true);
	}

	function dialogOpen(options, closeFn) {
		// Trigger a `:dialogopening` event on the dialog body.
		_$dialogBody.trigger(':dialogopening');

		// Grab the options we care about.
		const { top } = jQuery.extend({ top : 50 }, options);

		// Record the last active/focused non-dialog element.
		if (!dialogIsOpen()) {
			_lastActive = safeActiveElement();
		}

		// Add the `data-dialog` attribute to <html> (mostly used to style <body>).
		jQuery(document.documentElement)
			.attr('data-dialog', 'open');

		// Display the overlay.
		_$overlay
			.addClass('open');

		/*
			Add the imagesLoaded handler to the dialog body, if necessary.

			NOTE: We use `querySelector()` here as jQuery has no simple way to
			check if, and only if, at least one element of the specified type
			exists.  The best that jQuery offers is analogous to `querySelectorAll()`,
			which enumerates all elements of the specified type.
		*/
		if (_$dialogBody[0].querySelector('img') !== null) {
			_$dialogBody
				.imagesLoaded()
				.always(() => _resizeHandler({ data : { top } }));
		}

		// Add `aria-hidden=true` to all direct non-dialog-children of <body> to
		// hide the underlying page from screen readers while the dialog is open.
		jQuery('body>:not(script,#store-area,tw-storydata,#ui-bar,#ui-overlay,#ui-dialog)')
			.attr('tabindex', -3)
			.attr('aria-hidden', true);
		jQuery('#ui-bar,#story')
			.find('[tabindex]:not([tabindex^=-])')
			.attr('tabindex', -2)
			.attr('aria-hidden', true);

		// Display the dialog.
		_$dialog
			.css(_calcPosition(top))
			.addClass('open')
			.focus();

		// Add the UI resize handler.
		jQuery(window)
			.on('resize.dialog-resize', null, { top }, jQuery.throttle(40, _resizeHandler));

		// Add the dialog mutation resize handler.
		if (Has.mutationObserver) {
			_dialogObserver = new MutationObserver(mutations => {
				for (let i = 0; i < mutations.length; ++i) {
					if (mutations[i].type === 'childList') {
						_resizeHandler({ data : { top } });
						break;
					}
				}
			});
			_dialogObserver.observe(_$dialogBody[0], {
				childList : true,
				subtree   : true
			});
		}
		else {
			_$dialogBody
				.on(
					'DOMNodeInserted.dialog-resize DOMNodeRemoved.dialog-resize',
					null,
					{ top },
					jQuery.throttle(40, _resizeHandler)
				);
		}

		// Set up the delegated UI close handler.
		jQuery(document)
			.one('click.dialog-close', '.ui-close', { closeFn }, ev => {
				// NOTE: Do not allow this event handler to return the `Dialog` static object,
				// as doing so causes Edge (ca. 18) to throw a "Number expected" exception due
				// to `Dialog` not having a prototype.
				dialogClose(ev);
				/* implicit `return undefined;` */
			})
			.one('keypress.dialog-close', '.ui-close', function (ev) {
				// 13 is Enter/Return, 32 is Space.
				if (ev.which === 13 || ev.which === 32) {
					jQuery(this).trigger('click');
				}
			});

		// Trigger a `:dialogopened` event on the dialog body.
		/* legacy */
		_$dialogBody.trigger(':dialogopen');
		/* /legacy */
		_$dialogBody.trigger(':dialogopened');

		return Dialog;
	}

	function dialogResize(data) {
		return _resizeHandler(typeof data === 'object' ? { data } : undefined);
	}

	function dialogSetup(title, classNames) {
		_$dialogBody
			.empty()
			.removeClass();

		if (classNames != null) { // lazy equality for null
			_$dialogBody.addClass(classNames);
		}

		_$dialogTitle
			.empty()
			.append((title != null ? String(title) : '') || '\u00A0'); // lazy equality for null

		// TODO: In v3 this should return `Dialog` for chaining.
		return _$dialogBody.get(0);
	}

	function dialogBodyWiki(...args) {
		_$dialogBody.wiki(...args);
		return Dialog;
	}


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function _calcPosition(topPos) {
		const top       = topPos != null ? topPos : 50; // lazy equality for null
		const $parent   = jQuery(window);
		const dialogPos = { left : '', right : '', top : '', bottom : '' };

		// Unset the dialog's positional properties before checking its dimensions.
		_$dialog.css(dialogPos);

		let horzSpace = $parent.width() - _$dialog.outerWidth(true) - 1;   // -1 to address a Firefox issue
		let vertSpace = $parent.height() - _$dialog.outerHeight(true) - 1; // -1 to address a Firefox issue

		if (horzSpace <= 32 + _scrollbarWidth) {
			vertSpace -= _scrollbarWidth;
		}

		if (vertSpace <= 32 + _scrollbarWidth) {
			horzSpace -= _scrollbarWidth;
		}

		if (horzSpace <= 32) {
			dialogPos.left = dialogPos.right = 16;
		}
		else {
			dialogPos.left = dialogPos.right = horzSpace / 2 >> 0;
		}

		if (vertSpace <= 32) {
			dialogPos.top = dialogPos.bottom = 16;
		}
		else {
			if (vertSpace / 2 > top) {
				dialogPos.top = top;
			}
			else {
				dialogPos.top = dialogPos.bottom = vertSpace / 2 >> 0;
			}
		}

		Object.keys(dialogPos).forEach(key => {
			if (dialogPos[key] !== '') {
				dialogPos[key] += 'px';
			}
		});

		return dialogPos;
	}

	function _resizeHandler(ev) {
		const top = ev && ev.data && typeof ev.data.top !== 'undefined' ? ev.data.top : 50;

		if (_$dialog.css('display') === 'block') {
			// Stow the dialog.
			_$dialog.css({ display : 'none' });

			// Restore the dialog with its new positional properties.
			_$dialog.css(jQuery.extend({ display : '' }, _calcPosition(top)));
		}
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze(Object.defineProperties({}, {
		append : { value : dialogBodyAppend },
		body   : { value : dialogBody },
		close  : { value : dialogClose },
		init   : { value : dialogInit },
		isOpen : { value : dialogIsOpen },
		open   : { value : dialogOpen },
		resize : { value : dialogResize },
		setup  : { value : dialogSetup },
		wiki   : { value : dialogBodyWiki },

		// Legacy Functions.
		addClickHandler : { value : dialogAddClickHandler }
	}));
})();
