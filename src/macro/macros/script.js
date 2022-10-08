/***********************************************************************************************************************

	macro/macros/script.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Scripting, getErrorMessage */

/*
	<<script>>
*/
Macro.add('script', {
	skipArgs : true,
	tags     : null,

	handler() {
		const output = document.createDocumentFragment();

		try {
			Scripting.evalJavaScript(this.payload[0].contents, output);
		}
		catch (ex) {
			return this.error(`bad evaluation: ${getErrorMessage(ex)}`);
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.createDebugView();
		}

		if (output.hasChildNodes()) {
			this.output.appendChild(output);
		}
	}
});
