/***********************************************************************************************************************

	macro/macros/timed.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, DebugView, Engine, Macro, State, Wikifier, cssTimeToMS */

/*
	<<timed>> & <<next>>
*/
Macro.add('timed', {
	isAsync : true,
	tags    : ['next'],
	timers  : new Set(),
	t8nRe   : /^(?:transition|t8n)$/,

	handler() {
		if (this.args.length === 0) {
			return this.error('no time value specified in <<timed>>');
		}

		const items = [];

		try {
			items.push({
				name    : this.name,
				source  : this.source,
				delay   : Math.max(Engine.DOM_DELAY, cssTimeToMS(this.args[0])),
				content : this.payload[0].contents
			});
		}
		catch (ex) {
			return this.error(`${ex.message} in <<timed>>`);
		}

		if (this.payload.length > 1) {
			let i;

			try {
				let len;

				for (i = 1, len = this.payload.length; i < len; ++i) {
					items.push({
						name   : this.payload[i].name,
						source : this.payload[i].source,
						delay  : this.payload[i].args.length === 0
							? items[items.length - 1].delay
							: Math.max(Engine.DOM_DELAY, cssTimeToMS(this.payload[i].args[0])),
						content : this.payload[i].contents
					});
				}
			}
			catch (ex) {
				return this.error(`${ex.message} in <<next>> (#${i})`);
			}
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ block : true });
		}

		const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);
		const $wrapper   = jQuery(document.createElement('span'))
			.addClass(`macro-${this.name}`)
			.appendTo(this.output);

		// Register the timer.
		this.self.registerTimeout(this.shadowHandler(item => {
			const frag = document.createDocumentFragment();
			new Wikifier(frag, item.content, { cleanup : false });

			// Output.
			let $output = $wrapper;

			// Custom debug view setup for `<<next>>`.
			if (Config.debug && item.name === 'next') {
				$output = jQuery(new DebugView( // eslint-disable-line no-param-reassign
					$output[0],
					'macro',
					item.name,
					item.source
				).output);
			}

			if (transition) {
				$output = jQuery(document.createElement('span'))
					.addClass('macro-timed-insert macro-timed-in')
					.appendTo($output);
			}

			$output.append(frag);

			if (transition) {
				setTimeout(() => $output.removeClass('macro-timed-in'), Engine.DOM_DELAY);
			}
		}), items);
	},

	registerTimeout(callback, items) {
		if (typeof callback !== 'function') {
			throw new TypeError('callback parameter must be a function');
		}

		// Cache info about the current turn.
		const passage = State.passage;
		const turn    = State.turns;

		// Timer info.
		const timers = this.timers;
		let timerId  = null;
		let nextItem = items.shift();

		const worker = function () {
			// Bookkeeping.
			timers.delete(timerId);

			// Terminate if we've navigated away.
			if (State.passage !== passage || State.turns !== turn) {
				return;
			}

			// Set the current item and set up the next worker, if any.
			const curItem = nextItem;

			if ((nextItem = items.shift()) != null) { // lazy equality for null
				timerId = setTimeout(worker, nextItem.delay);
				timers.add(timerId);
			}

			// Execute the callback.
			callback.call(this, curItem);
		};

		// Set up the timeout and record its ID.
		timerId = setTimeout(worker, nextItem.delay);
		timers.add(timerId);

		// Set up a single-use event handler to remove pending timers upon passage navigation.
		if (timers.size === 1) {
			jQuery(document).one(':passageinit', () => {
				timers.forEach(timerId => clearTimeout(timerId));
				timers.clear();
			});
		}
	}
});
