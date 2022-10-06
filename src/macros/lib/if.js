/***********************************************************************************************************************

	macros/lib/if.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Scripting, Wikifier */

/*
	<<if>>, <<elseif>>, & <<else>>
*/
Macro.add('if', {
	skipArgs   : true,
	tags       : ['elseif', 'else'],
	elseifWsRe : /^\s*if\b/i,
	ifAssignRe : /[^!=&^|<>*/%+-]=[^=>]/,

	handler() {
		let i;

		try {
			const len = this.payload.length;

			// Sanity checks.
			const elseifWsRe = this.self.elseifWsRe;
			const ifAssignRe = this.self.ifAssignRe;

			for (/* declared previously */ i = 0; i < len; ++i) {
				/* eslint-disable prefer-template */
				switch (this.payload[i].name) {
				case 'else':
					if (this.payload[i].args.raw.length > 0) {
						if (elseifWsRe.test(this.payload[i].args.raw)) {
							return this.error(`whitespace is not allowed between the "else" and "if" in <<elseif>> clause${i > 0 ? ' (#' + i + ')' : ''}`);
						}

						return this.error(`<<else>> does not accept a conditional expression (perhaps you meant to use <<elseif>>), invalid: ${this.payload[i].args.raw}`);
					}

					if (i + 1 !== len) {
						return this.error('<<else>> must be the final clause');
					}
					break;

				default:
					if (this.payload[i].args.full.length === 0) {
						return this.error(`no conditional expression specified for <<${this.payload[i].name}>> clause${i > 0 ? ' (#' + i + ')' : ''}`);
					}
					else if (
							Config.macros.ifAssignmentError
						&& ifAssignRe.test(this.payload[i].args.full)
					) {
						return this.error(`assignment operator found within <<${this.payload[i].name}>> clause${i > 0 ? ' (#' + i + ')' : ''} (perhaps you meant to use an equality operator: ==, ===, eq, is), invalid: ${this.payload[i].args.raw}`);
					}
					break;
				}
				/* eslint-enable prefer-template */
			}

			const evalJavaScript = Scripting.evalJavaScript;
			let success = false;

			// Evaluate the clauses.
			for (/* declared previously */ i = 0; i < len; ++i) {
				// Custom debug view setup for the current clause.
				if (Config.debug) {
					this
						.createDebugView(this.payload[i].name, this.payload[i].source)
						.modes({ nonvoid : false });
				}

				// Conditional test.
				if (this.payload[i].name === 'else' || !!evalJavaScript(this.payload[i].args.full)) {
					success = true;
					new Wikifier(this.output, this.payload[i].contents);
					break;
				}
				else if (Config.debug) {
					// Custom debug view setup for a failed conditional.
					this.debugView.modes({
						hidden  : true,
						invalid : true
					});
				}
			}

			// Custom debug view setup for the remaining clauses.
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
					Fake a debug view for `<</if>>`.  We do this to aid the checking of nesting
					and as a quick indicator of if any of the clauses matched.
				*/
				this
					.createDebugView(`/${this.name}`, `<</${this.name}>>`)
					.modes({
						nonvoid : false,
						hidden  : !success,
						invalid : !success
					});
			}
		}
		catch (ex) {
			return this.error(`bad conditional expression in <<${i === 0 ? 'if' : 'elseif'}>> clause${i > 0 ? ' (#' + i + ')' : ''}: ${typeof ex === 'object' ? ex.message : ex}`); // eslint-disable-line prefer-template
		}
	}
});
