/***********************************************************************************************************************

	extensions/jquery/aria-plugin.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global getActiveElement, triggerEvent */

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
			triggerEvent('click', getActiveElement() || this);
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
				.removeAttr('role tabindex aria-controls aria-pressed')
				.filter('button')
				.prop('disabled', true);

			// Call the true handler.
			fn.apply(this, arguments);
		});
	}

	function disableTabindex(el) {
		if (!el.hasAttribute('data-last-tabindex')) {
			const tabindex = el.getAttribute('tabindex');

			el.setAttribute('data-last-tabindex', tabindex !== null ? tabindex.trim() : '');
		}

		el.setAttribute('tabindex', -1);
	}

	function restoreTabindex(el) {
		const lastTabindex = el.getAttribute('data-last-tabindex');

		if (lastTabindex !== null) {
			el.removeAttribute('data-last-tabindex');

			if (lastTabindex === '') {
				el.removeAttribute('tabindex');
			}
			else {
				el.setAttribute('tabindex', lastTabindex);
			}
		}
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
				role      : undefined,
				tabindex  : 0, // Default `0` to make elements focusable.
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

			// Set `role`.
			if (opts.role != null) { // lazy equality for null
				this.attr('role', opts.role);
			}

			// Elsewise, set `role` to default values based on elements.
			else {
				this
					// Elements without an existing `role`.
					.not('[role]')

					// Elements that are `<a>` OR with `data-passage`.
					.filter('a,[data-passage]')
					.attr('role', 'link')
					.end()

					// Elements that are not `<a>` AND without `data-passage`.
					// WARNING: Do not merge the separate `.not()` instances below.  It is correct as-is.
					.not('a')
					.not('[data-passage]')
					.attr('role', 'button')
					.end()
					.end()

					.end();
			}

			// Set `tabindex`.
			this.attr('tabindex', opts.tabindex);

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
				// Set boolean content attribute `disabled` to `'disabled'` and set non-boolean
				// content attribute `aria-disabled` to `'true'`, for non-disableable elements.
				$nonDisableable.each(function () {
					this.setAttribute('disabled', 'disabled');
					this.setAttribute('aria-disabled', 'true');
					disableTabindex(this);
				});

				// Set IDL attribute `disabled` to `true` and set non-boolean content attribute
				// `aria-disabled` to `'true'`, for disableable elements.
				$disableable.each(function () {
					this.disabled = true;
					this.setAttribute('aria-disabled', 'true');
					disableTabindex(this);
				});
			}
			else {
				// Remove content attributes `disabled` and `aria-disabled`, for non-disableable elements.
				$nonDisableable.each(function () {
					this.removeAttribute('disabled');
					this.removeAttribute('aria-disabled');
					restoreTabindex(this);
				});

				// Set IDL attribute `disabled` to `false` and remove content attribute `aria-disabled`,
				// for disableable elements.
				$disableable.each(function () {
					this.disabled = false;
					this.removeAttribute('aria-disabled');
					restoreTabindex(this);
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
