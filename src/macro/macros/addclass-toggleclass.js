/***********************************************************************************************************************

	macro/macros/addclass-toggleclass.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro */

/*
	<<addclass>> & <<toggleclass>>
*/
Macro.add(['addclass', 'toggleclass'], {
	handler() {
		if (this.args.length < 2) {
			const errors = [];
			if (this.args.length < 1) { errors.push('selector'); }
			if (this.args.length < 2) { errors.push('class names'); }
			return this.error(`no ${errors.join(' or ')} specified`);
		}

		const $targets = jQuery(this.args[0]);

		if ($targets.length === 0) {
			return this.error(`no elements matched the selector "${this.args[0]}"`);
		}

		switch (this.name) {
			case 'addclass':
				$targets.addClass(this.args[1].trim());
				break;

			case 'toggleclass':
				$targets.toggleClass(this.args[1].trim());
				break;
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});
