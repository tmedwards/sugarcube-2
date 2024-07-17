/***********************************************************************************************************************

	macro/macros/nobr.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, Wikifier */

/*
	<<nobr>>
*/
Macro.add('nobr', {
	skipArgs : true,
	tags     : null,

	handler() {
		/*
			Wikify the contents, after removing all leading & trailing newlines and compacting
			all internal sequences of newlines into single spaces.
		*/
		new Wikifier(this.output, this.payload[0].contents.replace(/^\n+|\n+$/g, '').replace(/\n+/g, ' '));
	}
});
