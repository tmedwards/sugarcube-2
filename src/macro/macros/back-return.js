/***********************************************************************************************************************

	macro/macros/back-return.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, L10n, Macro, State, Story */

/*
	<<back>> & <<return>>
*/
Macro.add(['back', 'return'], {
	handler() {
		let momentIndex = -1;
		let passage;
		let content;

		if (this.args.length > 0) {
			if (typeof this.args[0] === 'object') {
				// Argument was in wiki image syntax.
				if (this.args[0].isImage) {
					content = document.createElement('img');

					const $image = jQuery(content)
						.attr('src', this.args[0].source);

					if (Object.hasOwn(this.args[0], 'passage')) {
						$image.attr('data-passage', this.args[0].passage);
					}

					if (Object.hasOwn(this.args[0], 'title')) {
						$image.attr('title', this.args[0].title);
					}

					if (Object.hasOwn(this.args[0], 'align')) {
						$image.attr('align', this.args[0].align);
					}

					if (Object.hasOwn(this.args[0], 'link')) {
						passage = this.args[0].link;
					}
				}
				// Argument was in wiki link syntax.
				else {
					content = document.createTextNode(this.args[0].text);
					passage = this.args[0].link;
				}
			}
			// Argument was simply the link text.
			else {
				content = document.createDocumentFragment();

				const $frag = jQuery(content)
					.wikiWithOptions({ cleanup : false, profile : 'core' }, this.args[0]);

				// Sanity check for interactive content shenanigans.
				const forbidden = $frag.getForbiddenInteractiveContentTagNames();

				if (forbidden.length > 0) {
					throw new Error(`text content contains restricted elements: <${forbidden.join('>, <')}>`);
				}

				passage = this.args.length > 1 ? this.args[1] : undefined;
			}
		}

		if (passage == null) { // lazy equality for null
			// Find the index and title of the most recent moment whose title does not match
			// that of the active (present) moment's.
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
				// Find the index of the most recent moment whose title matches that of the
				// specified passage.
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

			if (content instanceof HTMLImageElement) {
				$link.addClass('link-image');
			}
		}
		else {
			$link = jQuery(document.createElement('span'))
				.addClass('link-disabled');
		}

		$link
			.addClass(`macro-${this.name}`)
			.append(content || document.createTextNode(L10n.get(`macro${this.name.toUpperFirst()}Text`)))
			.appendTo(this.output);
	}
});
