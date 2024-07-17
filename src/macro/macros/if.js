/***********************************************************************************************************************

	macro/macros/if.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Scripting, Wikifier, getErrorMessage */

/*
	<<if>>, <<elseif>>, & <<else>>
*/
Macro.add('if', {
	skipArgs : true,
	tags     : ['elseif', 'else'],

	// Sanity check regular expressions.
	isElseifWsRE : /^\s*if\b/i,
	isAssignRE   : /[^!%&*+\-/<=>?^|]=[^=>]/,
	isLiteralRE  : new RegExp([
		// Empty string & template literals
		'(?:""|\'\'|``)',
		// Double quoted string literal
		'(?:"(?:\\\\.|[^"\\\\])+")',
		// Single quoted string literal
		"(?:'(?:\\\\.|[^'\\\\])+')",
		// Template literal
		'(?:`(?:\\\\.|[^`\\\\])+`)'
	].join('|'), 'g'),

	handler() {
		let i;

		try {
			const len = this.payload.length;

			// Sanity checks.
			const isElseifWsRE = this.self.isElseifWsRE;
			const isAssignRE   = this.self.isAssignRE;
			const isLiteralRE  = this.self.isLiteralRE;

			for (/* declared previously */ i = 0; i < len; ++i) {
				switch (this.payload[i].name) {
					case 'else': {
						if (this.payload[i].args.raw.length > 0) {
							if (isElseifWsRE.test(this.payload[i].args.raw)) {
								return this.error(`whitespace is not allowed between the "else" and "if" in <<elseif>> clause${i > 0 ? ` (#${i})` : ''}`);
							}

							return this.error(`<<else>> does not accept a conditional expression (perhaps you meant to use <<elseif>>), invalid: ${this.payload[i].args.raw}`);
						}

						if (i + 1 !== len) {
							return this.error('<<else>> must be the final clause');
						}

						break;
					}

					default: {
						if (this.payload[i].args.full.length === 0) {
							return this.error(`no conditional expression specified for <<${this.payload[i].name}>> clause${i > 0 ? ` (#${i})` : ''}`);
						}
						else if (
							(Config.debug || Config.enableOptionalDebugging)
							&& isAssignRE.test(this.payload[i].args.full.replace(isLiteralRE, ''))
						) {
							return this.error(`assignment operator found within <<${this.payload[i].name}>> clause${i > 0 ? ` (#${i})` : ''} (perhaps you meant to use an equality operator: ==, ===, eq, is), invalid: ${this.payload[i].args.raw}`);
						}

						break;
					}
				}
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
				for (/* declared previously */ ++i; i < len; ++i) {
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
			return this.error(`bad conditional expression in <<${i === 0 ? 'if' : 'elseif'}>> clause${i > 0 ? ` (#${i})` : ''}: ${getErrorMessage(ex)}`);
		}
	}
});
