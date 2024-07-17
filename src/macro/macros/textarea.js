/***********************************************************************************************************************

	macro/macros/textarea.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Macro, State, createSlug */

/*
	<<textarea>>
*/
Macro.add('textarea', {
	isAsync : true,

	handler() {
		if (this.args.length < 2) {
			const errors = [];
			if (this.args.length < 1) { errors.push('variable name'); }
			if (this.args.length < 2) { errors.push('default value'); }
			return this.error(`no ${errors.join(' or ')} specified`);
		}

		// Ensure that the variable name argument is a string.
		if (typeof this.args[0] !== 'string') {
			return this.error('variable name argument is not a string');
		}

		const varName = this.args[0].trim();

		// Try to ensure that we receive the variable's name (incl. sigil), not its value.
		if (varName[0] !== '$' && varName[0] !== '_') {
			return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ block : true });
		}

		const varId        = createSlug(varName);
		const defaultValue = this.args[1];
		const autofocus    = this.args[2] === 'autofocus';
		const el           = document.createElement('textarea');

		// Set up and append the textarea element to the output buffer.
		jQuery(el)
			.attr({
				id       : `${this.name}-${varId}`,
				name     : `${this.name}-${varId}`,
				rows     : 4,
				// cols     : 68, // instead of setting "cols" we set the `min-width` in CSS
				tabindex : 0 // for accessibility
			})
			.addClass(`macro-${this.name}`)
			.on('change.macros', this.shadowHandler(function () {
				State.setVar(varName, this.value);
			}))
			.appendTo(this.output);

		// Set the variable and textarea element to the default value.
		State.setVar(varName, defaultValue);
		// Ideally, we should be setting `.defaultValue` here, but IE doesn't support it,
		// so we have to use `.textContent`, which is equivalent.
		el.textContent = defaultValue;

		// Autofocus the textarea element, if requested.
		if (autofocus) {
			// Set the element's "autofocus" attribute.
			el.setAttribute('autofocus', 'autofocus');

			// Set up a single-use task to autofocus the element.
			if (Engine.isPlaying()) {
				jQuery(document).one(':passageend', () => {
					setTimeout(() => el.focus(), Engine.DOM_DELAY);
				});
			}
			else {
				setTimeout(() => el.focus(), Engine.DOM_DELAY);
			}
		}
	}
});
