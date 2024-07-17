/***********************************************************************************************************************

	macro/macros/script.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Scripting, getErrorMessage */

/*
	<<script>>
*/
Macro.add('script', {
	tags : null,

	handler() {
		const lang = this.args.length > 0
			? String(this.args[0]).toLowerCase()
			: 'javascript';
		let evalScript;

		switch (lang) {
			case 'javascript':  evalScript = Scripting.evalJavaScript; break;
			case 'twinescript': evalScript = Scripting.evalTwineScript; break;
			default: return this.error(`unknown language "${this.args[0]}"`);
		}

		const output = document.createDocumentFragment();

		try {
			evalScript(this.payload[0].contents, output);
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
