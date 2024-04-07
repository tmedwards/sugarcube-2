/***********************************************************************************************************************

	macro/deprecated-macros.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, State, Wikifier */

/*******************************************************************************
	Display Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<silently>> — Alias of <<silent>>
*/
Macro.add('silently', 'silent');


/*******************************************************************************
	Links Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<actions>>
*/
Macro.add('actions', {
	handler() {
		console.warn(`[DEPRECATED] <<${this.name}>> macro is deprecated.`);

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

					if (Object.hasOwn(this.args[i], 'passage')) {
						$image.attr('data-passage', this.args[i].passage);
					}

					if (Object.hasOwn(this.args[i], 'title')) {
						$image.attr('title', this.args[i].title);
					}

					if (Object.hasOwn(this.args[i], 'align')) {
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
				Object.hasOwn(State.variables, '#actions')
				&& Object.hasOwn(State.variables['#actions'], passage)
				&& State.variables['#actions'][passage]
			) {
				continue;
			}

			const $link = jQuery(Wikifier.createInternalLink(
				jQuery(document.createElement('li')).appendTo($list),
				passage,
				null,
				((passage, fn) => () => {
					if (!Object.hasOwn(State.variables, '#actions')) {
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

/*
	[DEPRECATED] <<choice>>
*/
Macro.add('choice', {
	handler() {
		console.warn(`[DEPRECATED] <<${this.name}>> macro is deprecated.`);

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

					if (Object.hasOwn(this.args[0], 'passage')) {
						$image.attr('data-passage', this.args[0].passage);
					}

					if (Object.hasOwn(this.args[0], 'title')) {
						$image.attr('title', this.args[0].title);
					}

					if (Object.hasOwn(this.args[0], 'align')) {
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
			Object.hasOwn(State.variables, '#choice')
			&& Object.hasOwn(State.variables['#choice'], choiceId)
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
			if (!Object.hasOwn(State.variables, '#choice')) {
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
