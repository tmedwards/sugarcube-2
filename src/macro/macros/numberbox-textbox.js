/***********************************************************************************************************************

	macro/macros/numberbox-textbox.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Macro, State, createSlug */

/*
	<<numberbox>> & <<textbox>>
*/
Macro.add(['numberbox', 'textbox'], {
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

		const asNumber     = this.name === 'numberbox';
		const defaultValue = asNumber ? Number(this.args[1]) : this.args[1];

		if (asNumber && Number.isNaN(defaultValue)) {
			return this.error(`default value "${this.args[1]}" is neither a number nor can it be parsed into a number`);
		}

		const varId = createSlug(varName);
		const el    = document.createElement('input');
		let autofocus = false;
		let passage;

		if (this.args.length > 3) {
			passage   = this.args[2];
			autofocus = this.args[3] === 'autofocus';
		}
		else if (this.args.length > 2) {
			if (this.args[2] === 'autofocus') {
				autofocus = true;
			}
			else {
				passage = this.args[2];
			}
		}

		if (typeof passage === 'object') {
			// Argument was in wiki link syntax.
			passage = passage.link;
		}

		// Set up and append the input element to the output buffer.
		jQuery(el)
			.attr({
				id        : `${this.name}-${varId}`,
				name      : `${this.name}-${varId}`,
				type      : asNumber ? 'number' : 'text',
				inputmode : asNumber ? 'decimal' : 'text',
				tabindex  : 0 // for accessibility
			})
			.addClass(`macro-${this.name}`)
			.on('change.macros', this.shadowHandler(function () {
				State.setVar(varName, asNumber ? Number(this.value) : this.value);
			}))
			.on('keypress.macros', this.shadowHandler(function (ev) {
				// If Enter/Return is pressed, set the variable and, optionally, forward to another passage.
				if (ev.which === 13) { // 13 is Enter/Return
					ev.preventDefault();
					State.setVar(varName, asNumber ? Number(this.value) : this.value);

					if (passage != null) { // lazy equality for null
						Engine.play(passage);
					}
				}
			}))
			.appendTo(this.output);

		// Set the step value for `<input type="number">`.
		if (asNumber) {
			el.step = 'any';
		}

		// Set the variable and input element to the default value.
		State.setVar(varName, defaultValue);
		el.value = defaultValue;

		// Autofocus the input element, if requested.
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
