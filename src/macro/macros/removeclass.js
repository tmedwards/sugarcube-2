/***********************************************************************************************************************

	macro/macros/removeclass.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro */

/*
	<<removeclass>>
*/
Macro.add('removeclass', {
	handler() {
		if (this.args.length === 0) {
			return this.error('no selector specified');
		}

		const $targets = jQuery(this.args[0]);

		if ($targets.length === 0) {
			return this.error(`no elements matched the selector "${this.args[0]}"`);
		}

		if (this.args.length > 1) {
			$targets.removeClass(this.args[1].trim());
		}
		else {
			$targets.removeClass();
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});
