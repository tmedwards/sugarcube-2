/***********************************************************************************************************************

	macro/macros/repeat-stop.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Macro, State, TempState, Wikifier, cssTimeToMS */

/*
	<<repeat>> & <<stop>>
*/
Macro.add('repeat', {
	isAsync : true,
	tags    : null,
	timers  : new Set(),
	t8nRe   : /^(?:transition|t8n)$/,

	handler() {
		if (this.args.length === 0) {
			return this.error('no time value specified');
		}

		let delay;

		try {
			delay = Math.max(Engine.DOM_DELAY, cssTimeToMS(this.args[0]));
		}
		catch (ex) {
			return this.error(ex.message);
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
		this.self.registerInterval(this.shadowHandler(() => {
			const frag = document.createDocumentFragment();
			new Wikifier(frag, this.payload[0].contents, { cleanup : false });

			let $output = $wrapper;

			if (transition) {
				$output = jQuery(document.createElement('span'))
					.addClass('macro-repeat-insert macro-repeat-in')
					.appendTo($output);
			}

			$output.append(frag);

			if (transition) {
				setTimeout(() => $output.removeClass('macro-repeat-in'), Engine.DOM_DELAY);
			}
		}), delay);
	},

	registerInterval(callback, delay) {
		if (typeof callback !== 'function') {
			throw new TypeError('callback parameter must be a function');
		}

		// Cache info about the current turn.
		const passage = State.passage;
		const turn    = State.turns;

		// Timer info.
		const timers = this.timers;
		let timerId = null;

		// Set up the interval and record its ID.
		timerId = setInterval(() => {
			// Terminate if we've navigated away.
			if (State.passage !== passage || State.turns !== turn) {
				clearInterval(timerId);
				timers.delete(timerId);
				return;
			}

			let timerIdCache;
			/*
				There's no catch clause because this try/finally is here simply to ensure that
				proper cleanup is done in the event that an exception is thrown during the
				`Wikifier` call.
			*/
			try {
				TempState.break = null;

				// Set up the `repeatTimerId` value, caching the existing value, if necessary.
				if (Object.hasOwn(TempState, 'repeatTimerId')) {
					timerIdCache = TempState.repeatTimerId;
				}

				TempState.repeatTimerId = timerId;

				// Execute the callback.
				callback.call(this);
			}
			finally {
				// Teardown the `repeatTimerId` property, restoring the cached value, if necessary.
				if (typeof timerIdCache !== 'undefined') {
					TempState.repeatTimerId = timerIdCache;
				}
				else {
					delete TempState.repeatTimerId;
				}

				TempState.break = null;
			}
		}, delay);
		timers.add(timerId);

		// Set up a single-use event handler to remove pending timers upon passage navigation.
		if (timers.size === 1) {
			jQuery(document).one(':passageinit', () => {
				timers.forEach(timerId => clearInterval(timerId));
				timers.clear();
			});
		}
	}
});
Macro.add('stop', {
	skipArgs : true,

	handler() {
		if (!Object.hasOwn(TempState, 'repeatTimerId')) {
			return this.error('must only be used in conjunction with its parent macro <<repeat>>');
		}

		const timers  = Macro.get('repeat').timers;
		const timerId = TempState.repeatTimerId;
		clearInterval(timerId);
		timers.delete(timerId);
		TempState.break = 2;

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});
