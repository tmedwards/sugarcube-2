/***********************************************************************************************************************

	macros/lib/print.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, Scripting, Wikifier, encodeEntities, stringFrom */

/*
	<<print>>, <<=>>, & <<->>
*/
Macro.add(['print', '=', '-'], {
	skipArgs : true,

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no expression specified');
		}

		try {
			const result = stringFrom(Scripting.evalJavaScript(this.args.full));

			if (result !== null) {
				new Wikifier(this.output, this.name === '-' ? encodeEntities(result) : result);
			}
		}
		catch (ex) {
			return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
		}
	}
});
