/***********************************************************************************************************************

	macro/macros/include.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Story */

/*
	<<include>>
*/
Macro.add('include', {
	handler() {
		if (this.name === 'display') { console.warn(`[DEPRECATED] <<${this.name}>> macro is deprecated.`); }

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

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ block : true });
		}

		passage = Story.get(passage);
		let $el;

		if (this.args[1]) {
			$el = jQuery(document.createElement(this.args[1]))
				.addClass(`${passage.id} macro-${this.name}`)
				.attr('data-passage', passage.name)
				.appendTo(this.output);
		}
		else {
			$el = jQuery(this.output);
		}

		$el.wiki(passage.processText());
	}
});
