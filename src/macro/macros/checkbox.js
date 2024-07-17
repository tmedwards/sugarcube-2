/***********************************************************************************************************************

	macro/macros/checkbox.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, State, createSlug */

/*
	<<checkbox>>
*/
Macro.add('checkbox', {
	isAsync : true,

	handler() {
		if (this.args.length < 3) {
			const errors = [];
			if (this.args.length < 1) { errors.push('variable name'); }
			if (this.args.length < 2) { errors.push('unchecked value'); }
			if (this.args.length < 3) { errors.push('checked value'); }
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

		const varId        = createSlug(varName);
		const uncheckValue = this.args[1];
		const checkValue   = this.args[2];
		const el           = document.createElement('input');

		/*
			Set up and append the input element to the output buffer.
		*/
		jQuery(el)
			.attr({
				id       : `${this.name}-${varId}`,
				name     : `${this.name}-${varId}`,
				type     : 'checkbox',
				tabindex : 0 // for accessibility
			})
			.addClass(`macro-${this.name}`)
			.on('change.macros', this.shadowHandler(function () {
				State.setVar(varName, this.checked ? checkValue : uncheckValue);
			}))
			.appendTo(this.output);

		/*
			Set the variable and input element to the appropriate value and state, as requested.
		*/
		switch (this.args[3]) {
			case 'autocheck': {
				if (State.getVar(varName) === checkValue) {
					el.checked = true;
				}
				else {
					State.setVar(varName, uncheckValue);
				}

				break;
			}

			case 'checked': {
				el.checked = true;
				State.setVar(varName, checkValue);
				break;
			}

			default: {
				State.setVar(varName, uncheckValue);
				break;
			}
		}
	}
});
