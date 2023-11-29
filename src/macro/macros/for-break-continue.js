/***********************************************************************************************************************

	macro/macros/for-break-continue.js

	Copyright © 2013–2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
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
		let rangeList;

		try {
			rangeList = this.self.toRangeList(rangeExp, Boolean(keyVar.name), Boolean(valueVar.name));
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

			for (let i = 0; i < rangeList.length; ++i) {
				if (keyVar.name) {
					State[keyVar.type][keyVar.name] = rangeList[i].key;
				}

				if (valueVar.name) {
					State[valueVar.type][valueVar.name] = rangeList[i].val;
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

	toRangeList(rangeExp, wantKey, wantValue) {
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

		let list;

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
					list = [];
					break;
				}

				list = new Array(collection);

				if (wantKey || wantValue) {
					for (let i = 0; i < collection; ++i) {
						const entry = {};

						if (wantKey) {
							entry.key = i;
						}

						if (wantValue) {
							entry.val = i;
						}

						list[i] = entry;
					}
				}

				break;
			}

			case 'string': {
				list = [];

				for (let i = 0; i < collection.length; /* empty */) {
					const O     = charAndPosAt(collection, i);
					const entry = {};

					if (wantKey) {
						entry.key = i;
					}

					if (wantValue) {
						entry.val = O.char;
					}

					list.push(entry);
					i = 1 + O.end;
				}

				break;
			}

			case 'object': {
				if (collection instanceof Array) {
					list = new Array(collection.length);

					if (wantKey || wantValue) {
						// NOTE: We use a `for ()` statement here to properly handle sparse arrays,
						// since `Array` methods skip empty slots.
						for (let i = 0; i < collection.length; ++i) {
							const entry = {};

							if (wantKey) {
								entry.key = i;
							}

							if (wantValue) {
								entry.val = collection[i];
							}

							list[i] = entry;
						}
					}
				}
				else if (collection instanceof Set) {
					list = new Array(collection.size);

					if (wantKey || wantValue) {
						let i = 0;

						collection.forEach(val => {
							const entry = {};

							if (wantKey) {
								entry.key = i;
							}

							if (wantValue) {
								entry.val = val;
							}

							list[i] = entry;
							++i;
						});
					}
				}
				else if (collection instanceof Map) {
					list = new Array(collection.size);

					if (wantKey || wantValue) {
						let i = 0;

						collection.forEach((val, key) => {
							const entry = {};

							if (wantKey) {
								entry.key = key;
							}

							if (wantValue) {
								entry.val = val;
							}

							list[i] = entry;
							++i;
						});
					}
				}
				else if (getToStringTag(collection) === 'Object') {
					const keys = Object.keys(collection);
					list = new Array(keys.length);

					if (wantKey || wantValue) {
						keys.forEach((key, i) => {
							const entry = {};

							if (wantKey) {
								entry.key = key;
							}

							if (wantValue) {
								entry.val = collection[key];
							}

							list[i] = entry;
						});
					}
				}
				else {
					throw new Error(`unsupported range expression type: ${getToStringTag(collection)}`);
				}

				break;
			}

			default:
				throw new Error(`unsupported range expression type: ${typeof collection}`);
		}

		return list;
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
