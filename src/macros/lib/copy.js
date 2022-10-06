/***********************************************************************************************************************

	macros/lib/copy.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro */

/*
	<<copy>>
*/
Macro.add('copy', {
	handler() {
		if (this.args.length === 0) {
			return this.error('no selector specified');
		}

		const $targets = jQuery(this.args[0]);

		if ($targets.length === 0) {
			return this.error(`no elements matched the selector "${this.args[0]}"`);
		}

		jQuery(this.output).append($targets.html());

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});
