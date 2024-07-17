/***********************************************************************************************************************

	macro/macros/done.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, Macro */

/*
	<<done>>
*/
Macro.add('done', {
	skipArgs : true,
	tags     : null,

	handler() {
		const contents = this.payload[0].contents.trim();

		// Do nothing if there's no content to process.
		if (contents === '') {
			return;
		}

		setTimeout(this.shadowHandler(() => $.wiki(contents)), Engine.DOM_DELAY);
	}
});
