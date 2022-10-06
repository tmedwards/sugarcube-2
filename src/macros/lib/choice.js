/***********************************************************************************************************************

	macros/lib/choice.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, State, Wikifier */

/*
	<<choice>>
*/
Macro.add('choice', {
	handler() {
		if (this.args.length === 0) {
			return this.error('no passage specified');
		}

		const choiceId = State.passage;
		let passage;
		let text;
		let $image;
		let setFn;

		if (this.args.length === 1) {
			if (typeof this.args[0] === 'object') {
				if (this.args[0].isImage) {
					// Argument was in wiki image syntax.
					$image = jQuery(document.createElement('img'))
						.attr('src', this.args[0].source);

					if (this.args[0].hasOwnProperty('passage')) {
						$image.attr('data-passage', this.args[0].passage);
					}

					if (this.args[0].hasOwnProperty('title')) {
						$image.attr('title', this.args[0].title);
					}

					if (this.args[0].hasOwnProperty('align')) {
						$image.attr('align', this.args[0].align);
					}

					passage = this.args[0].link;
					setFn   = this.args[0].setFn;
				}
				else {
					// Argument was in wiki link syntax.
					text    = this.args[0].text;
					passage = this.args[0].link;
					setFn   = this.args[0].setFn;
				}
			}
			else {
				// Argument was simply the passage name.
				text = passage = this.args[0];
			}
		}
		else {
			// NOTE: The arguments here are backwards.
			passage = this.args[0];
			text    = this.args[1];
		}

		let $link;

		if (
			State.variables.hasOwnProperty('#choice')
			&& State.variables['#choice'].hasOwnProperty(choiceId)
			&& State.variables['#choice'][choiceId]
		) {
			$link = jQuery(document.createElement('span'))
				.addClass(`link-disabled macro-${this.name}`)
				.attr('tabindex', -1)
				.append($image || document.createTextNode(text))
				.appendTo(this.output);

			if ($image) {
				$link.addClass('link-image');
			}

			return;
		}

		$link = jQuery(Wikifier.createInternalLink(this.output, passage, null, () => {
			if (!State.variables.hasOwnProperty('#choice')) {
				State.variables['#choice'] = {};
			}

			State.variables['#choice'][choiceId] = true;

			if (typeof setFn === 'function') {
				setFn();
			}
		}))
			.addClass(`macro-${this.name}`)
			.append($image || document.createTextNode(text));

		if ($image) {
			$link.addClass('link-image');
		}
	}
});
