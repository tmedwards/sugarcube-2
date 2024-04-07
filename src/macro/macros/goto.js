/***********************************************************************************************************************

	macro/macros/goto.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, Macro, Story */

/*
	<<goto>>
*/
Macro.add('goto', {
	handler() {
		if (this.args.length === 0) {
			return this.error('no passage specified');
		}

		let passage;

		if (typeof this.args[0] === 'object') {
			// Argument was in wiki link syntax.
			passage = this.args[0].link;
		}
		else {
			// Argument was simply the passage name.
			passage = this.args[0];
		}

		if (!Story.has(passage)) {
			return this.error(`passage "${passage}" does not exist`);
		}

		/*
			Call `Engine.play()` asynchronously.

			NOTE: This does not terminate the current Wikifier call chain,
			though, ideally, it should.  Doing so would not be trivial, however,
			and there's also the question of whether that behavior would be
			unwanted by users, who are used to the current behavior from
			similar macros and constructs.
		*/
		setTimeout(() => Engine.play(passage), Engine.DOM_DELAY);
	}
});
