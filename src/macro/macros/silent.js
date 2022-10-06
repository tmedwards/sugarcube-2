/***********************************************************************************************************************

	macro/macros/silent.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Wikifier */

/*
	<<silent>>
*/
Macro.add('silent', {
	skipArgs : true,
	tags     : null,

	handler() {
		const frag = document.createDocumentFragment();
		new Wikifier(frag, this.payload[0].contents.trim());

		if (Config.debug) {
			// Custom debug view setup.
			this.debugView.modes({ block : true, hidden : true });
			this.output.appendChild(frag);
		}
		else {
			// Discard the output, unless there were errors.
			const errList = [...frag.querySelectorAll('.error')].map(errEl => errEl.textContent);

			if (errList.length > 0) {
				return this.error(`error${errList.length === 1 ? '' : 's'} within contents (${errList.join('; ')})`);
			}
		}
	}
});
