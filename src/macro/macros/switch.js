/***********************************************************************************************************************

	macro/macros/switch.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Scripting, Wikifier, getErrorMessage */

/*
	<<switch>>, <<case>>, & <<default>>
*/
Macro.add('switch', {
	skipArgs : ['switch'],
	tags     : ['case', 'default'],

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no expression specified');
		}

		const len = this.payload.length;

		// if (len === 1 || !this.payload.some(p => p.name === 'case')) {
		if (len === 1) {
			return this.error('no cases specified');
		}

		let i;

		// Sanity checks.
		for (/* declared previously */ i = 1; i < len; ++i) {
			switch (this.payload[i].name) {
				case 'default': {
					if (this.payload[i].args.length > 0) {
						return this.error(`<<default>> does not accept values, invalid: ${this.payload[i].args.raw}`);
					}

					if (i + 1 !== len) {
						return this.error('<<default>> must be the final case');
					}

					break;
				}

				default: {
					if (this.payload[i].args.length === 0) {
						return this.error(`no value(s) specified for <<${this.payload[i].name}>> (#${i})`);
					}

					break;
				}
			}
		}

		let result;

		try {
			result = Scripting.evalJavaScript(this.args.full);
		}
		catch (ex) {
			return this.error(`bad evaluation: ${getErrorMessage(ex)}`);
		}

		const debugView = this.debugView; // cache it now, to be modified later
		let success = false;

		// Initial debug view setup for `<<switch>>`.
		if (Config.debug) {
			debugView
				.modes({
					nonvoid : false,
					hidden  : true
				});
		}

		// Evaluate the clauses.
		for (/* declared previously */ i = 1; i < len; ++i) {
			// Custom debug view setup for the current case.
			if (Config.debug) {
				this
					.createDebugView(this.payload[i].name, this.payload[i].source)
					.modes({ nonvoid : false });
			}

			// Case test(s).
			if (this.payload[i].name === 'default' || this.payload[i].args.some(val => val === result)) {
				success = true;
				new Wikifier(this.output, this.payload[i].contents);
				break;
			}
			else if (Config.debug) {
				// Custom debug view setup for a failed case.
				this.debugView.modes({
					hidden  : true,
					invalid : true
				});
			}
		}

		// Custom debug view setup for the remaining cases.
		if (Config.debug) {
			for (++i; i < len; ++i) {
				this
					.createDebugView(this.payload[i].name, this.payload[i].source)
					.modes({
						nonvoid : false,
						hidden  : true,
						invalid : true
					});
			}

			/*
				Finalize the debug view for `<<switch>>` and fake a debug view for `<</switch>>`.
				We do both as a quick indicator of if any of the cases matched and the latter
				to aid the checking of nesting.
			*/
			debugView
				.modes({
					nonvoid : false,
					hidden  : true, // !success,
					invalid : !success
				});
			this
				.createDebugView(`/${this.name}`, `<</${this.name}>>`)
				.modes({
					nonvoid : false,
					hidden  : true, // !success,
					invalid : !success
				});
		}
	}
});
