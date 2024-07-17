/***********************************************************************************************************************

	macro/macros/for-break-continue.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Config, Macro, Patterns, Scripting, State, TempState, Wikifier, charAndPosAt, getErrorMessage,
	       getToStringTag, stringFrom
*/

/*
	<<for>>, <<break>>, & <<continue>>
*/
Macro.add('for', {
	/* eslint-disable max-len */
	skipArgs    : true,
	tags        : null,
	isRangeRe   : new RegExp(`^(?:\\S${Patterns.anyChar}*?\\s+)?range\\s+\\S${Patterns.anyChar}*?$`),
	rangeRe     : new RegExp(`^(?:(?:State\\.(variables|temporary)\\.(${Patterns.identifier})\\s*,\\s*)?State\\.(variables|temporary)\\.(${Patterns.identifier})\\s+)?range\\s+(\\S${Patterns.anyChar}*?)$`),
	threePartRe : /^([^;]*?)\s*;\s*([^;]*?)\s*;\s*([^;]*?)$/,
	forInRe     : /^\S+\s+in\s+\S+/i,
	forOfRe     : /^\S+\s+of\s+\S+/i,
	/* eslint-enable max-len */

	handler() {
		const argsStr = this.args.full.trim();
		const payload = this.payload[0].contents.replace(/\n$/, '');

		// Empty form.
		if (argsStr.length === 0) {
			this.self.handleFor.call(this, payload, null, true, null);
		}

		// Range form.
		else if (this.self.isRangeRe.test(argsStr)) {
			const parts = argsStr.match(this.self.rangeRe);

			if (parts === null) {
				return this.error('invalid range form syntax, format: [[index ,] value] range collection');
			}

			this.self.handleForRange.call(
				this,
				payload,
				{ type : parts[1], name : parts[2] },
				{ type : parts[3], name : parts[4] },
				parts[5]
			);
		}

		// Conditional forms.
		else {
			let init;
			let condition;
			let post;

			// Conditional-only form.
			if (argsStr.indexOf(';') === -1) {
				// Sanity checks.
				if (this.self.forInRe.test(argsStr)) {
					return this.error('invalid syntax, for…in is not supported; see: for…range');
				}
				else if (this.self.forOfRe.test(argsStr)) {
					return this.error('invalid syntax, for…of is not supported; see: for…range');
				}

				condition = argsStr;
			}

			// 3-part conditional form.
			else {
				const parts = argsStr.match(this.self.threePartRe);

				if (parts === null) {
					return this.error('invalid 3-part conditional form syntax, format: [init] ; [condition] ; [post]');
				}

				init      = parts[1];
				condition = parts[2].trim();
				post      = parts[3];

				if (condition.length === 0) {
					condition = true;
				}
			}

			this.self.handleFor.call(this, payload, init, condition, post);
		}
	},

	handleFor(payload, init, condition, post) {
		const evalJavaScript = Scripting.evalJavaScript;
		let first  = true;
		let safety = Config.macros.maxLoopIterations;

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ block : true });
		}

		try {
			TempState.break = null;

			if (init) {
				try {
					evalJavaScript(init);
				}
				catch (ex) {
					return this.error(`bad init expression: ${getErrorMessage(ex)}`);
				}
			}

			while (evalJavaScript(condition)) {
				if (--safety < 0) {
					return this.error(`exceeded configured maximum loop iterations (${Config.macros.maxLoopIterations})`);
				}

				new Wikifier(this.output, first ? payload.replace(/^\n/, '') : payload);

				if (first) {
					first = false;
				}

				if (TempState.break != null) { // lazy equality for null
					if (TempState.break === 1) {
						TempState.break = null;
					}
					else if (TempState.break === 2) {
						TempState.break = null;
						break;
					}
				}

				if (post) {
					try {
						evalJavaScript(post);
					}
					catch (ex) {
						return this.error(`bad post expression: ${getErrorMessage(ex)}`);
					}
				}
			}
		}
		catch (ex) {
			return this.error(`bad conditional expression: ${getErrorMessage(ex)}`);
		}
		finally {
			TempState.break = null;
		}
	},

	handleForRange(payload, keyVar, valueVar, rangeExp) {
		let first     = true;
		let rangeable;

		try {
			rangeable = this.self.toRangeable(rangeExp);
		}
		catch (ex) {
			return this.error(ex.message);
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ block : true });
		}

		try {
			TempState.break = null;

			for (;;) {
				const entry = rangeable.next();

				if (entry.done) {
					break;
				}

				if (keyVar.name) {
					State[keyVar.type][keyVar.name] = entry.key;
				}

				if (valueVar.name) {
					State[valueVar.type][valueVar.name] = entry.value;
				}

				new Wikifier(this.output, first ? payload.replace(/^\n/, '') : payload);

				if (first) {
					first = false;
				}

				if (TempState.break != null) { // lazy equality for null
					if (TempState.break === 1) {
						TempState.break = null;
					}
					else if (TempState.break === 2) {
						TempState.break = null;
						break;
					}
				}
			}
		}
		catch (ex) {
			return this.error(getErrorMessage(ex));
		}
		finally {
			TempState.break = null;
		}
	},

	toRangeable(rangeExp) {
		let collection;

		try {
			/*
				NOTE: If the first character is the left curly brace, then we
				assume that it's part of an object literal and wrap it within
				parenthesis to ensure that it is not mistaken for a block
				during evaluation—which would cause an error.
			*/
			collection = Scripting.evalJavaScript(rangeExp[0] === '{' ? `(${rangeExp})` : rangeExp);
		}
		catch (ex) {
			if (typeof ex !== 'object') {
				throw new Error(`bad range expression: ${ex}`);
			}

			ex.message = `bad range expression: ${ex.message}`;
			throw ex;
		}

		switch (typeof collection) {
			case 'number': {
				if (Number.isNaN(collection) || !Number.isFinite(collection)) {
					throw new Error(`unsupported range expression type: ${stringFrom(collection)}`);
				}
				if (!Number.isInteger(collection)) {
					throw new Error('unsupported range expression type: floating-point number');
				}
				if (!Number.isSafeInteger(collection)) {
					throw new Error('unsupported range expression type: unsafe integer');
				}

				if (collection <= 0) {
					return {
						next() {
							return { done : true };
						}
					};
				}

				return {
					end : collection,
					pos : 0,

					next() {
						if (this.pos < this.end) {
							const key = this.pos++;
							return {
								key,
								value : key,
								done  : false
							};
						}

						return { done : true };
					}
				};
			}

			case 'string': {
				return {
					list : collection,
					end  : collection.length,
					pos  : 0,

					next() {
						if (this.pos < this.end) {
							const O   = charAndPosAt(this.list, this.pos);
							const key = this.pos;
							this.pos = O.end + 1;
							return {
								key,
								value : O.char,
								done  : false
							};
						}

						return { done : true };
					}
				};
			}

			case 'object': {
				if (collection instanceof Array) {
					return {
						list : collection,
						end  : collection.length,
						pos  : 0,

						next() {
							if (this.pos < this.end) {
								const key = this.pos++;
								return {
									key,
									value : this.list[key],
									done  : false
								};
							}

							return { done : true };
						}
					};
				}
				else if (collection instanceof Set) {
					/* legacy */
					// Convert the `Set` to an `Array` to provide indicies.
					//
					// TODO: Check what the polyfill's `<Set>.values()` method returns.
					collection = Array.from(collection);
					return {
						list : collection,
						end  : collection.length,
						pos  : 0,

						next() {
							if (this.pos < this.end) {
								const key = this.pos++;
								return {
									key,
									value : this.list[key],
									done  : false
								};
							}

							return { done : true };
						}
					};
					/* /legacy */
				}
				else if (collection instanceof Map) {
					const keys = Array.from(collection.keys());
					return {
						keys,
						list : collection,
						end  : keys.length,
						pos  : 0,

						next() {
							if (this.pos < this.end) {
								const key = this.keys[this.pos++];
								return {
									key,
									value : this.list.get(key),
									done  : false
								};
							}

							return { done : true };
						}
					};
				}
				else if (getToStringTag(collection) === 'Object') {
					const keys = Object.keys(collection);
					return {
						keys,
						list : collection,
						end  : keys.length,
						pos  : 0,

						next() {
							if (this.pos < this.end) {
								const key = this.keys[this.pos++];
								return {
									key,
									value : this.list[key],
									done  : false
								};
							}

							return { done : true };
						}
					};
				}

				throw new Error(`unsupported range expression type: ${getToStringTag(collection)}`);
			}

			default:
				throw new Error(`unsupported range expression type: ${typeof collection}`);
		}
	}
});
Macro.add(['break', 'continue'], {
	skipArgs : true,

	handler() {
		if (this.contextSome(ctx => ctx.name === 'for')) {
			TempState.break = this.name === 'continue' ? 1 : 2;
		}
		else {
			return this.error('must only be used in conjunction with its parent macro <<for>>');
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});
