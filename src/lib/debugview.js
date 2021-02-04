/***********************************************************************************************************************

	lib/debugview.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	TODO: Make this use jQuery throughout.
*/
var DebugView = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		DebugView Class.
	*******************************************************************************************************************/
	class DebugView {
		constructor(parent, type, name, title) {
			Object.defineProperties(this, {
				parent : {
					value : parent
				},

				view : {
					value : document.createElement('span')
				},

				break : {
					value : document.createElement('wbr')
				}
			});

			// Set up the wrapper (`<span>`) element.
			jQuery(this.view)
				.attr({
					title,
					'aria-label' : title,
					'data-type'  : type != null ? type : '', // lazy equality for null
					'data-name'  : name != null ? name : ''  // lazy equality for null
				})
				.addClass('debug');

			// Set up the word break (`<wbr>`) element.
			jQuery(this.break).addClass('debug hidden');

			// Add the wrapper (`<span>`) and word break (`<wbr>`) elements to the `parent` element.
			this.parent.appendChild(this.view);
			this.parent.appendChild(this.break);
		}

		get output() {
			return this.view;
		}

		get type() {
			return this.view.getAttribute('data-type');
		}
		set type(type) {
			this.view.setAttribute('data-type', type != null ? type : ''); // lazy equality for null
		}

		get name() {
			return this.view.getAttribute('data-name');
		}
		set name(name) {
			this.view.setAttribute('data-name', name != null ? name : ''); // lazy equality for null
		}

		get title() {
			return this.view.title;
		}
		set title(title) {
			this.view.title = title;
		}

		append(el) {
			jQuery(this.view).append(el);
			return this;
		}

		modes(options) {
			if (options == null) { // lazy equality for null
				const current = {};

				this.view.className.splitOrEmpty(/\s+/).forEach(name => {
					if (name !== 'debug') {
						current[name] = true;
					}
				});

				return current;
			}
			else if (typeof options === 'object') {
				Object.keys(options).forEach(function (name) {
					this[options[name] ? 'addClass' : 'removeClass'](name);
				}, jQuery(this.view));

				return this;
			}

			throw new Error('DebugView.prototype.modes options parameter must be an object or null/undefined');
		}

		remove() {
			const $view = jQuery(this.view);

			if (this.view.hasChildNodes()) {
				$view.contents().appendTo(this.parent);
			}

			$view.remove();
			jQuery(this.break).remove();
		}

		static isEnabled() {
			return jQuery(document.documentElement).attr('data-debug-view') === 'enabled';
		}

		static enable() {
			jQuery(document.documentElement).attr('data-debug-view', 'enabled');
			jQuery.event.trigger(':debugviewupdate');
		}

		static disable() {
			jQuery(document.documentElement).removeAttr('data-debug-view');
			jQuery.event.trigger(':debugviewupdate');
		}

		static toggle() {
			if (jQuery(document.documentElement).attr('data-debug-view') === 'enabled') {
				DebugView.disable();
			}
			else {
				DebugView.enable();
			}
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return DebugView;
})();
