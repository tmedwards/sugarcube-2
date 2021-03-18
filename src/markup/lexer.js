/***********************************************************************************************************************

	markup/lexer.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

var { // eslint-disable-line no-var
	/* eslint-disable no-unused-vars */
	EOF,
	Lexer
	/* eslint-enable no-unused-vars */
} = (() => {
	'use strict';

	// End of file (string, actually).
	const EOF = -1;


	/*******************************************************************************************************************
		Lexer Class.
	*******************************************************************************************************************/
	class Lexer {
		constructor(source, initialState) {
			if (arguments.length < 2) {
				throw new Error('Lexer constructor called with too few parameters (source:string , initialState:function)');
			}

			/*
				this.source  → the string to be scanned
				this.initial → initial state
				this.state   → current state
				this.start   → start position of an item
				this.pos     → current position in the source string
				this.depth   → current brace/bracket/parenthesis nesting depth
				this.items   → scanned item queue
				this.data    → lexing data
			*/
			Object.defineProperties(this, {
				source : {
					value : source
				},

				initial : {
					value : initialState
				},

				state : {
					writable : true,
					value    : initialState
				},

				start : {
					writable : true,
					value    : 0
				},

				pos : {
					writable : true,
					value    : 0
				},

				depth : {
					writable : true,
					value    : 0
				},

				items : {
					writable : true,
					value    : []
				},

				data : {
					writable : true,
					value    : {}
				}
			});
		}

		reset() {
			this.state  = this.initial;
			this.start  = 0;
			this.pos    = 0;
			this.depth  = 0;
			this.items  = [];
			this.data   = {};
		}

		run() {
			// scan the source string until no states remain
			while (this.state !== null) {
				this.state = this.state(this);
			}

			// return the array of items
			return this.items;
		}

		nextItem() {
			// scan the source string until we have an item or no states remain
			while (this.items.length === 0 && this.state !== null) {
				this.state = this.state(this);
			}

			// return the current item
			return this.items.shift();
		}

		next() {
			if (this.pos >= this.source.length) {
				return EOF;
			}

			return this.source[this.pos++];
		}

		peek() {
			if (this.pos >= this.source.length) {
				return EOF;
			}

			return this.source[this.pos];
		}

		backup(num) {
			// if (num) {
			// 	this.pos -= num;
			// }
			// else {
			// 	--this.pos;
			// }
			this.pos -= num || 1;
		}

		forward(num) {
			// if (num) {
			// 	this.pos += num;
			// }
			// else {
			// 	++this.pos;
			// }
			this.pos += num || 1;
		}

		ignore() {
			this.start = this.pos;
		}

		accept(valid) {
			const ch = this.next();

			if (ch === EOF) {
				return false;
			}

			if (valid.includes(ch)) {
				return true;
			}

			this.backup();
			return false;
		}

		acceptRe(validRe) {
			const ch = this.next();

			if (ch === EOF) {
				return false;
			}

			if (validRe.test(ch)) {
				return true;
			}

			this.backup();
			return false;
		}

		acceptRun(valid) {
			for (;;) {
				const ch = this.next();

				if (ch === EOF) {
					return;
				}

				if (!valid.includes(ch)) {
					break;
				}
			}

			this.backup();
		}

		acceptRunRe(validRe) {
			for (;;) {
				const ch = this.next();

				if (ch === EOF) {
					return;
				}

				if (!validRe.test(ch)) {
					break;
				}
			}

			this.backup();
		}

		emit(type) {
			this.items.push({
				type,
				text  : this.source.slice(this.start, this.pos),
				start : this.start,
				pos   : this.pos
			});
			this.start = this.pos;
		}

		error(type, message) {
			if (arguments.length < 2) {
				throw new Error('Lexer.prototype.error called with too few parameters (type:number , message:string)');
			}

			this.items.push({
				type,
				message,
				text  : this.source.slice(this.start, this.pos),
				start : this.start,
				pos   : this.pos
			});
			return null;
		}

		static enumFromNames(names) {
			const obj = names.reduce((obj, name, i) => {
				obj[name] = i; // eslint-disable-line no-param-reassign
				return obj;
			}, {});
			return Object.freeze(Object.assign(Object.create(null), obj));
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return {
		EOF,
		Lexer
	};
})();
