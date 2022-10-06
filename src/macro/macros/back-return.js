/***********************************************************************************************************************

	macros/lib/back-return.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, L10n, Macro, State, Story */

/*
	<<back>> & <<return>>
*/
Macro.add(['back', 'return'], {
	handler() {
		/* legacy */
		if (this.args.length > 1) {
			return this.error('too many arguments specified, check the documentation for details');
		}
		/* /legacy */

		let momentIndex = -1;
		let passage;
		let text;
		let $image;

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

					if (this.args[0].hasOwnProperty('link')) {
						passage = this.args[0].link;
					}
				}
				else {
					// Argument was in wiki link syntax.
					if (this.args[0].count === 1) {
						// Simple link syntax: `[[...]]`.
						passage = this.args[0].link;
					}
					else {
						// Pretty link syntax: `[[...|...]]`.
						text    = this.args[0].text;
						passage = this.args[0].link;
					}
				}
			}
			else if (this.args.length === 1) {
				// Argument was simply the link text.
				text = this.args[0];
			}
		}

		if (passage == null) { // lazy equality for null
			/*
				Find the index and title of the most recent moment whose title does not match
				that of the active (present) moment's.
			*/
			for (let i = State.length - 2; i >= 0; --i) {
				if (State.history[i].title !== State.passage) {
					momentIndex = i;
					passage = State.history[i].title;
					break;
				}
			}

			// If we failed to find a passage and we're `<<return>>`, fallback to `State.expired`.
			if (passage == null && this.name === 'return') { // lazy equality for null
				for (let i = State.expired.length - 1; i >= 0; --i) {
					if (State.expired[i] !== State.passage) {
						passage = State.expired[i];
						break;
					}
				}
			}
		}
		else {
			if (!Story.has(passage)) {
				return this.error(`passage "${passage}" does not exist`);
			}

			if (this.name === 'back') {
				/*
					Find the index of the most recent moment whose title matches that of the
					specified passage.
				*/
				for (let i = State.length - 2; i >= 0; --i) {
					if (State.history[i].title === passage) {
						momentIndex = i;
						break;
					}
				}

				if (momentIndex === -1) {
					return this.error(`cannot find passage "${passage}" in the current story history`);
				}
			}
		}

		if (passage == null) { // lazy equality for null
			return this.error('cannot find passage');
		}

		// if (this.name === "back" && momentIndex === -1) {
		// 	// no-op; we're already at the first passage in the current story history
		// 	return;
		// }

		let $link;

		if (this.name !== 'back' || momentIndex !== -1) {
			$link = jQuery(document.createElement('a'))
				.addClass('link-internal')
				.ariaClick(
					{ one : true },
					this.name === 'return'
						? () => Engine.play(passage)
						: () => Engine.goTo(momentIndex)
				);

			if ($image) {
				$link.addClass('link-image');
			}
		}
		else {
			$link = jQuery(document.createElement('span'))
				.addClass('link-disabled');
		}

		$link
			.addClass(`macro-${this.name}`)
			.append($image || document.createTextNode(text || L10n.get(`macro${this.name.toUpperFirst()}Text`)))
			.appendTo(this.output);
	}
});
