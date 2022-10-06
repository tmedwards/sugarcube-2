/***********************************************************************************************************************

	macros/lib/actions.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, State, Wikifier */

/*
	<<actions>>
*/
Macro.add('actions', {
	handler() {
		const $list = jQuery(document.createElement('ul'))
			.addClass(this.name)
			.appendTo(this.output);

		for (let i = 0; i < this.args.length; ++i) {
			let passage;
			let text;
			let $image;
			let setFn;

			if (typeof this.args[i] === 'object') {
				if (this.args[i].isImage) {
					// Argument was in wiki image syntax.
					$image = jQuery(document.createElement('img'))
						.attr('src', this.args[i].source);

					if (this.args[i].hasOwnProperty('passage')) {
						$image.attr('data-passage', this.args[i].passage);
					}

					if (this.args[i].hasOwnProperty('title')) {
						$image.attr('title', this.args[i].title);
					}

					if (this.args[i].hasOwnProperty('align')) {
						$image.attr('align', this.args[i].align);
					}

					passage = this.args[i].link;
					setFn   = this.args[i].setFn;
				}
				else {
					// Argument was in wiki link syntax.
					text    = this.args[i].text;
					passage = this.args[i].link;
					setFn   = this.args[i].setFn;
				}
			}
			else {
				// Argument was simply the passage name.
				text = passage = this.args[i];
			}

			if (
				State.variables.hasOwnProperty('#actions')
				&& State.variables['#actions'].hasOwnProperty(passage)
				&& State.variables['#actions'][passage]
			) {
				continue;
			}

			const $link = jQuery(Wikifier.createInternalLink(
				jQuery(document.createElement('li')).appendTo($list),
				passage,
				null,
				((passage, fn) => () => {
					if (!State.variables.hasOwnProperty('#actions')) {
						State.variables['#actions'] = {};
					}

					State.variables['#actions'][passage] = true;

					if (typeof fn === 'function') {
						fn();
					}
				})(passage, setFn)
			))
				.addClass(`macro-${this.name}`)
				.append($image || document.createTextNode(text));

			if ($image) {
				$link.addClass('link-image');
			}
		}
	}
});
