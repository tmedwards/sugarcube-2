/***********************************************************************************************************************

	macro/macros/capture.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, Patterns, State, Wikifier */

/*
	<<capture>>
*/
Macro.add('capture', {
	skipArgs : true,
	tags     : null,
	tsVarRe  : new RegExp(`(${Patterns.variable})`,'g'),

	handler() {
		if (this.args.raw.length === 0) {
			return this.error('no story/temporary variable list specified');
		}

		const valueCache = {};

		/*
			There's no catch clause because this try/finally is here simply to ensure that
			proper cleanup is done in the event that an exception is thrown during the
			`Wikifier` call.
		*/
		try {
			const tsVarRe = this.self.tsVarRe;
			let match;

			/*
				Cache the existing values of the variables and add a shadow.
			*/
			while ((match = tsVarRe.exec(this.args.raw)) !== null) {
				const varName = match[1];
				const varKey  = varName.slice(1);
				const store   = varName[0] === '$' ? State.variables : State.temporary;

				if (Object.hasOwn(store, varKey)) {
					valueCache[varKey] = store[varKey];
				}

				this.addShadow(varName);
			}

			new Wikifier(this.output, this.payload[0].contents);
		}
		finally {
			// Revert the variable shadowing.
			this.shadows.forEach(varName => {
				const varKey = varName.slice(1);
				const store  = varName[0] === '$' ? State.variables : State.temporary;

				if (Object.hasOwn(valueCache, varKey)) {
					store[varKey] = valueCache[varKey];
				}
				else {
					delete store[varKey];
				}
			});
		}
	}
});
