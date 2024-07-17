/***********************************************************************************************************************

	dialog.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Has, L10n, Story, getActiveElement, getTypeOf, triggerEvent */

var Dialog = (() => { // eslint-disable-line no-unused-vars, no-var
	// Default top position.
	const DEFAULT_TOP = 50; // in pixels w/o unit

	// jQuery-wrapped dialog elements.
	let $overlay = null;
	let $dialog  = null;
	let $title   = null;
	let $body    = null;

	// Last active/focused non-dialog element.
	let lastActive = null;

	// Mutation resize handler.
	let observer = null;

	// Active close callback, if any.
	let onCloseFn = null;

	// Width of the browser's scrollbars.
	let scrollbarWidth = 0;


	/*******************************************************************************
		Initialization Functions.
	*******************************************************************************/

	function init() {
		if (BUILD_DEBUG) { console.log('[Dialog/init()]'); }

		if (document.getElementById('ui-dialog')) {
			return;
		}

		// Calculate and record the width of scrollbars.
		scrollbarWidth = (() => {
			let calcWidth;

			try {
				const inner = document.createElement('p');
				inner.style.width  = '100%';
				inner.style.height = '200px';

				const outer = document.createElement('div');
				outer.style.position   = 'absolute';
				outer.style.left       = '0';
				outer.style.top        = '0';
				outer.style.width      = '100px';
				outer.style.height     = '100px';
				outer.style.visibility = 'hidden';
				outer.style.overflow   = 'hidden';

				outer.appendChild(inner);
				document.body.appendChild(outer);

				const w1 = inner.offsetWidth;
				// The `overflow: scroll` style property value does not work consistently
				// with scrollbars which are styled with `::-webkit-scrollbar`, so we use
				// `overflow: auto` with dimensions guaranteed to force a scrollbar.
				outer.style.overflow = 'auto';
				let w2 = inner.offsetWidth;

				if (w1 === w2) {
					w2 = outer.clientWidth;
				}

				document.body.removeChild(outer);

				calcWidth = w1 - w2;
			}
			catch (ex) { /* no-op */ }

			return calcWidth || 17; // 17px is a reasonable failover
		})();

		// Generate the dialog elements.
		const $elems = jQuery(document.createDocumentFragment())
			.append(
				/* eslint-disable max-len */
				  '<div id="ui-overlay" class="ui-close"></div>'
				+ '<div id="ui-dialog" tabindex="0" role="dialog" aria-labelledby="ui-dialog-title" aria-modal="true">'
				+     '<div id="ui-dialog-titlebar">'
				+         '<h1 id="ui-dialog-title"></h1>'
				+         `<button id="ui-dialog-close" class="ui-close" tabindex="0" aria-label="${L10n.get('textClose')}">\uf00d</button>`
				+     '</div>'
				+     '<div id="ui-dialog-body"></div>'
				+ '</div>'
				/* eslint-enable max-len */
			);

		// Cache the dialog elements, since they're going to be used often.
		//
		// NOTE: We rewrap the elements themselves, rather than simply using
		// the results of `find()`, so that we cache uncluttered jQuery-wrappers
		// (i.e. `context` refers to the elements and there is no `prevObject`).
		$overlay = jQuery($elems.find('#ui-overlay').get(0));
		$dialog  = jQuery($elems.find('#ui-dialog').get(0));
		$title   = jQuery($elems.find('#ui-dialog-title').get(0));
		$body    = jQuery($elems.find('#ui-dialog-body').get(0));

		// Insert the dialog elements into the page before the main script.
		$elems.insertBefore('body>script#script-sugarcube');
	}


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	/*
		Calculate the inset values, in pixels, required to fit the dialog within
		the current viewport based on the size of its contents and the viewport's
		dimentions.
	*/
	function calcInset(top) {
		const $window = jQuery(window);
		const inset   = { left : '', right : '', top : '', bottom : '' };
		const minPos  = 10;

		// Unset the dialog's inset values, so the browser can resize it based on
		// its content.
		$dialog.css(inset);

		// Calculate the dialog's new inset values based on its current dimensions.
		//
		// NOTE: Subtract `1` from both space values to address a Firefox issue.
		// QUESTION: Is this still necessary?
		let horzSpace = $window.width() - $dialog.outerWidth(true) - 1;
		let vertSpace = $window.height() - $dialog.outerHeight(true) - 1;

		if (horzSpace <= minPos * 2 + scrollbarWidth) {
			vertSpace -= scrollbarWidth;
		}

		if (vertSpace <= minPos * 2 + scrollbarWidth) {
			horzSpace -= scrollbarWidth;
		}

		/* eslint-disable prefer-template */
		// Calculate the horizontal inset values in pixels.
		if (horzSpace <= minPos * 2) {
			inset.left = inset.right = minPos + 'px';
		}
		else {
			inset.left = inset.right = (horzSpace / 2 >> 0) + 'px';
		}

		// Calculate the vertical inset values in pixels.
		if (vertSpace <= minPos * 2) {
			inset.top = inset.bottom = minPos + 'px';
		}
		else {
			const vertPos = vertSpace / 2 >> 0;

			if (vertPos > top) {
				inset.top = top + 'px';
			}
			else {
				inset.top = inset.bottom = vertPos + 'px';
			}
		}
		/* eslint-enable prefer-template */

		return inset;
	}

	/*
		Resize handler.
	*/
	function onResize(top) {
		if ($dialog.css('display') === 'block') {
			$dialog.css(calcInset(top != null ? top : DEFAULT_TOP)); // lazy equality for null
		}
	}


	/*******************************************************************************
		API Functions.
	*******************************************************************************/

	/*
		Appends the specified content sources to the dialog's body container.
		Returns `Dialog` for further chaining.
	*/
	function append(...args) {
		$body.append(...args);
		return Dialog;
	}

	/*
		Closes and resets the dialog.
		Returns `Dialog` for further chaining.
	*/
	function close(ev) {
		// Trigger a `:dialogclosing` event on the dialog body.
		triggerEvent(':dialogclosing', $body);

		// Largely reverse the actions taken in `dialogOpen()`.
		jQuery(document).off('.dialog-close');

		if (observer) {
			observer.disconnect();
			observer = null;
		}
		else {
			$body.off('.dialog-resize');
		}

		jQuery(window)
			.off('.dialog-resize');
		$dialog
			.removeClass('open')
			.css({ left : '', right : '', top : '', bottom : '' });

		jQuery('#ui-bar,#story')
			.find('[tabindex=-2]')
			.removeAttr('aria-hidden')
			.attr('tabindex', 0);
		jQuery('body>[tabindex=-3]')
			.removeAttr('aria-hidden')
			.removeAttr('tabindex');

		$overlay
			.removeClass('open');
		jQuery(document.documentElement)
			.removeAttr('data-dialog');

		// Clear the dialog's content.
		$title
			.empty();
		$body
			.empty()
			.removeClass();

		// Attempt to restore focus to whichever element had it prior to opening the dialog.
		if (lastActive) {
			lastActive.focus();
			lastActive = null;
		}

		// Call the given close callback, if any.
		if (onCloseFn) {
			// NOTE: There's no catch clause here because this try/finally exists
			// solely to ensure that the close callback is properly reset in the
			// event that an uncaught exception is thrown during the callback call.
			try {
				onCloseFn(ev);
			}
			finally {
				onCloseFn = null;
			}
		}

		// Trigger a `:dialogclosed` event on the dialog body.
		/* legacy */
		triggerEvent(':dialogclose', $body);
		/* /legacy */
		triggerEvent(':dialogclosed', $body);

		return Dialog;
	}

	/*
		Prepares the dialog for use.
		Returns `Dialog` for further chaining.
	*/
	function create(title, classNames) {
		$title
			.empty()
			.append((title != null ? String(title) : '') || '\u00A0'); // lazy equality for null

		$body
			.empty()
			.removeClass();

		if (classNames != null) { // lazy equality for null
			$body.addClass(classNames);
		}

		return Dialog;
	}

	/*
		Empties the dialog's body container.
		Returns `Dialog` for further chaining.
	*/
	function empty() {
		$body.empty();
		return Dialog;
	}

	/*
		Returns the dialog's body container.
	*/
	function getBody() {
		return $body.get(0);
	}

	/*
		Returns whether the dialog is open.
		The test may be narrowed by specifing class names.
	*/
	function isOpen(classNames) {
		return $dialog.hasClass('open')
			&& (classNames ? classNames.splitOrEmpty(/\s+/).every(cn => $body.hasClass(cn)) : true);
	}

	/*
		Opens the dialog.
		Returns `Dialog` for further chaining.
	*/
	function open(options, onClose) {
		// Grab the options we care about.
		const { top } = Object.assign({ top : DEFAULT_TOP }, options);

		// Record the given close callback.
		if (onClose != null) { // lazy equality for null
			const closeType = getTypeOf(onClose);

			if (closeType !== 'function') {
				throw new TypeError(`Dialog.open onClose parameter must be a function (received: ${closeType})`);
			}

			onCloseFn = onClose;
		}
		else {
			onCloseFn = null;
		}

		// Trigger a `:dialogopening` event on the dialog body.
		triggerEvent(':dialogopening', $body);

		// Record the last active/focused non-dialog element.
		if (!isOpen()) {
			lastActive = getActiveElement();
		}

		// Add the `data-dialog` attribute to <html> (mostly used to style <body>).
		jQuery(document.documentElement).attr('data-dialog', 'open');

		// Display the overlay.
		$overlay.addClass('open');

		// Add `aria-hidden=true` to all direct non-dialog-children of <body> to
		// hide the underlying page from screen readers while the dialog is open.
		jQuery('body>:not(script,#store-area,tw-storydata,#ui-bar,#ui-overlay,#ui-dialog)')
			.attr('tabindex', -3)
			.attr('aria-hidden', true);
		jQuery('#ui-bar,#story')
			.find('[tabindex]:not([tabindex^=-])')
			.attr('tabindex', -2)
			.attr('aria-hidden', true);

		// Create our throttled resize handler.
		const resizeHandler = jQuery.throttle(40, () => onResize(top));

		// Add the imagesLoaded handlers to images.
		$body.imagesLoaded().always(resizeHandler);

		// Display the dialog.
		$dialog
			.css(calcInset(top))
			.addClass('open')
			.focus();

		// Attach the window `resize` event resize handler.
		jQuery(window)
			.off('.dialog-resize')
			.on('resize.dialog-resize', resizeHandler);

		// Add the dialog mutation resize handler.
		if (Has.mutationObserver) {
			observer = new MutationObserver(mutations => {
				for (let i = 0; i < mutations.length; ++i) {
					if (mutations[i].type === 'childList') {
						$body.imagesLoaded().always(resizeHandler);
						resizeHandler();
						break;
					}
				}
			});
			observer.observe(getBody(), {
				childList : true,
				subtree   : true
			});
		}
		else {
			$body
				.off('.dialog-resize')
				.on(
					'DOMNodeInserted.dialog-resize DOMNodeRemoved.dialog-resize',
					() => {
						$body.imagesLoaded().always(resizeHandler);
						resizeHandler();
					}
				);
		}

		// Set up the delegated close handler.
		jQuery(document)
			.off('.dialog-close')
			.one('click.dialog-close', '.ui-close', ev => {
				// NOTE: Do not allow this event handler to return the `Dialog` static object,
				// as doing so causes Edge (ca. 18) to throw a "Number expected" exception due
				// to `Dialog` not having a prototype.
				close(ev);
				/* implicit `return undefined;` */
			})
			.one('keypress.dialog-close', '.ui-close', function (ev) {
				// 13 is Enter/Return, 32 is Space.
				if (ev.which === 13 || ev.which === 32) {
					triggerEvent('click', this);
				}
			});

		// Trigger a `:dialogopened` event on the dialog body.
		/* legacy */
		triggerEvent(':dialogopen', $body);
		/* /legacy */
		triggerEvent(':dialogopened', $body);

		return Dialog;
	}

	/*
		Resize the dialog.
	*/
	function resize(options) {
		return onResize(typeof options === 'object' ? options.top : undefined);
	}

	/*
		Renders and appends the specified content sources to the dialog's body container.
		Returns `Dialog` for further chaining.
	*/
	function wiki(...args) {
		$body.wiki(...args);
		return Dialog;
	}

	/*
		Renders and appends the specified passage to the dialog's body container.
		Returns `Dialog` for further chaining.
	*/
	function wikiPassage(name) {
		return wiki(Story.get(name).processText());
	}


	/*******************************************************************************
		Deprecated Functions.
	*******************************************************************************/

	/*
		[DEPRECATED] Prepares the dialog for use.
		Returns the dialog's body container.
	*/
	function setup(title, classNames) {
		console.warn('[DEPRECATED] Dialog.setup() is deprecated.');

		create(title, classNames);
		return getBody();
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		append      : { value : append },
		body        : { value : getBody },
		close       : { value : close },
		create      : { value : create },
		empty       : { value : empty },
		init        : { value : init },
		isOpen      : { value : isOpen },
		open        : { value : open },
		resize      : { value : resize },
		wiki        : { value : wiki },
		wikiPassage : { value : wikiPassage },

		// Deprecated Functions.
		setup : { value : setup }
	}));
})();
