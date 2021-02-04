/***********************************************************************************************************************

	lib/jquery-plugins.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Wikifier, errorPrologRegExp, safeActiveElement */

/*
	WAI-ARIA methods plugin.

	`<jQuery>.ariaClick([options,] handler)`
	    Makes the target element(s) WAI-ARIA compatible clickables.

	`<jQuery>.ariaDisabled(state)`
	    Changes the disabled state of the target WAI-ARIA-compatible clickable element(s).

	`<jQuery>.ariaIsDisabled()`
	    Checks the disabled status of the target WAI-ARIA-compatible clickable element(s).
*/
(() => {
	'use strict';

	/*
		Event handler & utility functions.

		NOTE: Do not replace the anonymous functions herein with arrow functions.
	*/
	function onKeypressFn(ev) {
		// 13 is Enter/Return, 32 is Space.
		if (ev.which === 13 || ev.which === 32) {
			ev.preventDefault();

			// To allow delegation, attempt to trigger the event on `document.activeElement`,
			// if possible, elsewise on `this`.
			jQuery(safeActiveElement() || this).trigger('click');
		}
	}

	function onClickFnWrapper(fn) {
		return function () {
			const $this = jQuery(this);

			// Exit if the element is disabled.
			//
			// NOTE: This should only be necessary for elements which are not disableable
			// per the HTML specification as disableable elements should be made inert
			// automatically.
			if ($this.ariaIsDisabled()) {
				return;
			}

			// Toggle "aria-pressed" status, if the attribute exists.
			if ($this.is('[aria-pressed]')) {
				$this.attr('aria-pressed', $this.attr('aria-pressed') === 'true' ? 'false' : 'true');
			}

			// Call the true handler.
			fn.apply(this, arguments);
		};
	}

	function oneClickFnWrapper(fn) {
		return onClickFnWrapper(function () {
			// Remove both event handlers (keypress & click) and the other components.
			jQuery(this)
				.off('.aria-clickable')
				.removeAttr('tabindex aria-controls aria-pressed')
				.not('a,button')
				.removeAttr('role')
				.end()
				.filter('button')
				.prop('disabled', true);

			// Call the true handler.
			fn.apply(this, arguments);
		});
	}

	jQuery.fn.extend({
		/*
			Extend jQuery's chainable methods with an `ariaClick()` method.
		*/
		ariaClick(options, handler) {
			// Bail out if there are no target element(s) or parameters.
			if (this.length === 0 || arguments.length === 0) {
				return this;
			}

			let opts = options;
			let fn   = handler;

			if (fn == null) { // lazy equality for null
				fn   = opts;
				opts = undefined;
			}

			opts = jQuery.extend({
				namespace : undefined,
				one       : false,
				selector  : undefined,
				data      : undefined,
				controls  : undefined,
				pressed   : undefined,
				label     : undefined
			}, opts);

			if (typeof opts.namespace !== 'string') {
				opts.namespace = '';
			}
			else if (opts.namespace[0] !== '.') {
				opts.namespace = `.${opts.namespace}`;
			}

			if (typeof opts.pressed === 'boolean') {
				opts.pressed = opts.pressed ? 'true' : 'false';
			}

			// Set `type` to `button` to suppress "submit" semantics, for <button> elements.
			this.filter('button').prop('type', 'button');

			// Set `role` to `button`, for non-<a>/-<button> elements.
			this.not('a,button').attr('role', 'button');

			// Set `tabindex` to `0` to make them focusable (unnecessary on <button> elements, but it doesn't hurt).
			this.attr('tabindex', 0);

			// Set `aria-controls`.
			if (opts.controls != null) { // lazy equality for null
				this.attr('aria-controls', opts.controls);
			}

			// Set `aria-pressed`.
			if (opts.pressed != null) { // lazy equality for null
				this.attr('aria-pressed', opts.pressed);
			}

			// Set `aria-label` and `title`.
			if (opts.label != null) { // lazy equality for null
				this.attr({
					'aria-label' : opts.label,
					title        : opts.label
				});
			}

			// Set the keypress handlers, for non-<button> elements.
			// NOTE: For the single-use case, the click handler will also remove this handler.
			this.not('button').on(
				`keypress.aria-clickable${opts.namespace}`,
				opts.selector,
				onKeypressFn
			);

			// Set the click handlers.
			// NOTE: To ensure both handlers are properly removed, `one()` must not be used here.
			this.on(
				`click.aria-clickable${opts.namespace}`,
				opts.selector,
				opts.data,
				opts.one ? oneClickFnWrapper(fn) : onClickFnWrapper(fn)
			);

			// Return `this` for further chaining.
			return this;
		},

		/*
			Extend jQuery's chainable methods with an `ariaDisabled()` method.
		*/
		ariaDisabled(disable) {
			// Bail out if there are no target element(s) or parameters.
			if (this.length === 0 || arguments.length === 0) {
				return this;
			}

			/*
				NOTE: We use `<jQuery>.each()` callbacks to invoke the `<Element>.setAttribute()`
				methods in the following because the `<jQuery>.attr()` method does not allow you
				to set a content attribute without a value, which is recommended for boolean
				content attributes by the HTML specification.
			*/

			const $nonDisableable = this.not('button,fieldset,input,menuitem,optgroup,option,select,textarea');
			const $disableable    = this.filter('button,fieldset,input,menuitem,optgroup,option,select,textarea');

			if (disable) {
				// Add boolean content attribute `disabled` and set non-boolean content attribute
				// `aria-disabled` to `'true'`, for non-disableable elements.
				$nonDisableable.each(function () {
					this.setAttribute('disabled', '');
					this.setAttribute('aria-disabled', 'true');
				});

				// Set IDL attribute `disabled` to `true` and set non-boolean content attribute
				// `aria-disabled` to `'true'`, for disableable elements.
				$disableable.each(function () {
					this.disabled = true;
					this.setAttribute('aria-disabled', 'true');
				});
			}
			else {
				// Remove content attributes `disabled` and `aria-disabled`, for non-disableable elements.
				$nonDisableable.each(function () {
					this.removeAttribute('disabled');
					this.removeAttribute('aria-disabled');
				});

				// Set IDL attribute `disabled` to `false` and remove content attribute `aria-disabled`,
				// for disableable elements.
				$disableable.each(function () {
					this.disabled = false;
					this.removeAttribute('aria-disabled');
				});
			}

			// Return `this` for further chaining.
			return this;
		},

		/*
			Extend jQuery's chainable methods with an `ariaIsDisabled()` method.
		*/
		ariaIsDisabled() {
			// Check content attribute `disabled`.
			//
			// NOTE: We simply check the `disabled` content attribute for all elements
			// since we have to check it for non-disableable elements and it may also
			// be used for disableable elements since their `disabled` IDL attribute
			// is required to reflect the status of their `disabled` content attribute,
			// and vice versa, by the HTML specification.
			// return this.toArray().some(el => el.hasAttribute('disabled'));
			return this.is('[disabled]');
		}
	});
})();

/*
	Wikifier methods plugin.

	`jQuery.wikiWithOptions(options, sources…)`
	    Wikifies the given content source(s), as directed by the given options.

	`jQuery.wiki(sources…)`
	    Wikifies the given content source(s).

	`<jQuery>.wikiWithOptions(options, sources…)`
	    Wikifies the given content source(s) and appends the result to the target
	    element(s), as directed by the given options.

	`<jQuery>.wiki(sources…)`
	    Wikifies the given content source(s) and appends the result to the target
	    element(s).
*/
(() => {
	'use strict';

	jQuery.extend({
		/*
			Extend jQuery's static methods with a `wikiWithOptions()` method.
		*/
		wikiWithOptions(options, ...sources) {
			// Bail out, if there are no content sources.
			if (sources.length === 0) {
				return;
			}

			// Wikify the content sources into a fragment.
			const frag = document.createDocumentFragment();
			sources.forEach(content => new Wikifier(frag, content, options));

			// Gather the text of any error elements within the fragment…
			const errors = [...frag.querySelectorAll('.error')]
				.map(errEl => errEl.textContent.replace(errorPrologRegExp, ''));

			// …and throw an exception, if there were any errors.
			if (errors.length > 0) {
				throw new Error(errors.join('; '));
			}
		},

		/*
			Extend jQuery's static methods with a `wiki()` method.
		*/
		wiki(...sources) {
			this.wikiWithOptions(undefined, ...sources);
		}
	});

	jQuery.fn.extend({
		/*
			Extend jQuery's chainable methods with a `wikiWithOptions()` method.
		*/
		wikiWithOptions(options, ...sources) {
			// Bail out if there are no target element(s) or content sources.
			if (this.length === 0 || sources.length === 0) {
				return this;
			}

			// Wikify the content sources into a fragment.
			const frag = document.createDocumentFragment();
			sources.forEach(content => new Wikifier(frag, content, options));

			// Append the fragment to the target element(s).
			this.append(frag);

			// Return `this` for further chaining.
			return this;
		},

		/*
			Extend jQuery's chainable methods with a `wiki()` method.
		*/
		wiki(...sources) {
			return this.wikiWithOptions(undefined, ...sources);
		}
	});
})();
