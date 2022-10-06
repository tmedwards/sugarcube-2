/***********************************************************************************************************************

	macros/lib/for-break-continue.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Patterns, Scripting, State, TempState, Wikifier, characterAndPosAt, getToStringTag */

/*
	<<for>>, <<break>>, & <<continue>>
*/
Macro.add('for', {
	/* eslint-disable max-len */
	skipArgs    : true,
	tags        : null,
	hasRangeRe  : new RegExp(`^\\S${Patterns.anyChar}*?\\s+range\\s+\\S${Patterns.anyChar}*?$`),
	rangeRe     : new RegExp(`^(?:State\\.(variables|temporary)\\.(${Patterns.identifier})\\s*,\\s*)?State\\.(variables|temporary)\\.(${Patterns.identifier})\\s+range\\s+(\\S${Patterns.anyChar}*?)$`),
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
		else if (this.self.hasRangeRe.test(argsStr)) {
			const parts = argsStr.match(this.self.rangeRe);

			if (parts === null) {
				return this.error('invalid range form syntax, format: [index ,] value range collection');
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
					return this.error(`bad init expression: ${typeof ex === 'object' ? ex.message : ex}`);
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
						return this.error(`bad post expression: ${typeof ex === 'object' ? ex.message : ex}`);
					}
				}
			}
		}
		catch (ex) {
			return this.error(`bad conditional expression: ${typeof ex === 'object' ? ex.message : ex}`);
		}
		finally {
			TempState.break = null;
		}
	},

	handleForRange(payload, indexVar, valueVar, rangeExp) {
		let first     = true;
		let rangeList;

		try {
			rangeList = this.self.toRangeList(rangeExp);
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
				if (indexVar.name) {
					State[indexVar.type][indexVar.name] = rangeList[i][0];
				}

				State[valueVar.type][valueVar.name] = rangeList[i][1];

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
			return this.error(typeof ex === 'object' ? ex.message : ex);
		}
		finally {
			TempState.break = null;
		}
	},

	toRangeList(rangeExp) {
		const evalJavaScript = Scripting.evalJavaScript;
		let value;

		try {
			/*
				NOTE: If the first character is the left curly brace, then we
				assume that it's part of an object literal and wrap it within
				parenthesis to ensure that it is not mistaken for a block
				during evaluation—which would cause an error.
			*/
			value = evalJavaScript(rangeExp[0] === '{' ? `(${rangeExp})` : rangeExp);
		}
		catch (ex) {
			if (typeof ex !== 'object') {
				throw new Error(`bad range expression: ${ex}`);
			}

			ex.message = `bad range expression: ${ex.message}`;
			throw ex;
		}

		let list;

		switch (typeof value) {
		case 'string':
			list = [];
			for (let i = 0; i < value.length; /* empty */) {
				const obj = characterAndPosAt(value, i);
				list.push([i, obj.char]);
				i = 1 + obj.end;
			}
			break;

		case 'object':
			if (Array.isArray(value)) {
				list = value.map((val, i) => [i, val]);
			}
			else if (value instanceof Set) {
				list = [...value].map((val, i) => [i, val]);
			}
			else if (value instanceof Map) {
				list = [...value.entries()];
			}
			else if (getToStringTag(value) === 'Object') {
				list = Object.keys(value).map(key => [key, value[key]]);
			}
			else {
				throw new Error(`unsupported range expression type: ${getToStringTag(value)}`);
			}
			break;

		default:
			throw new Error(`unsupported range expression type: ${typeof value}`);
		}

		return list;
	}
});
Macro.add(['break', 'continue'], {
	skipArgs : true,

	handler() {
		if (this.contextHas(ctx => ctx.name === 'for')) {
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
