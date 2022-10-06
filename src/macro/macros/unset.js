/***********************************************************************************************************************

	macro/macros/unset.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Patterns, State */

/*
	<<unset>>
*/
Macro.add('unset', {
	skipArgs : true,
	jsVarRe  : new RegExp(
		`State\\.(variables|temporary)\\.(${Patterns.identifier})`,
		'g'
	),

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no story/temporary variable list specified');
		}

		const jsVarRe = this.self.jsVarRe;
		let match;

		while ((match = jsVarRe.exec(this.args.full)) !== null) {
			const store = State[match[1]];
			const name  = match[2];

			if (store.hasOwnProperty(name)) {
				delete store[name];
			}
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});
