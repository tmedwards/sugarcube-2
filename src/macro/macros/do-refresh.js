/***********************************************************************************************************************

	macro/macros/do-refresh.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Macro, Wikifier */

(() => {
	// Set up our event class name.
	const eventClass = 'dorefresh-target';

	// Set up a global `:dorefresh` event handler that sends non-bubbling
	// `:dorefresh-internal` events to `<<do>>` macros matching the given
	// selector.
	jQuery(document).on(':dorefresh', ev => {
		const evTags = ev.detail && ev.detail.tags || [];
		const selector = evTags.length === 0
			? `.${eventClass}`
			: evTags.map(tag => `.${eventClass}[data-do-tags~="${tag}"]`).join(', ');

		// NOTE: Due to how `.triggerHandler()` works we have to call it
		// for each element individually.
		jQuery(selector).each((_, el) => {
			jQuery(el).triggerHandler({
				type   : ':dorefresh-internal',
				detail : ev.detail
			});
		});
	});

	/*
		<<do [tag tags] [element tag]>>
	*/
	Macro.add('do', {
		tags : null,

		handler() {
			let elTag = 'span';
			let tags  = [];

			// Process optional arguments.
			const options = this.args.slice();

			while (options.length > 0) {
				const option = options.shift();

				switch (option) {
					case 'tag': {
						if (options.length === 0) {
							return this.error('tag option missing required tag name(s)');
						}

						const raw = String(options.shift()).trim();

						if (raw === '') {
							throw new Error('tag option tag name(s) must be non-empty');
						}

						tags = String(raw).trim().splitOrEmpty(/\s+/);

						break;
					}

					case 'element': {
						if (options.length === 0) {
							return this.error('element option missing required element tag name');
						}

						elTag = String(options.shift()).trim();

						if (elTag === '') {
							throw new Error('element option tag name must be non-empty');
						}

						break;
					}

					default:
						return this.error(`unknown option: ${option}`);
				}
			}

			const contents = this.payload[0].contents;

			// Do nothing if there's no content to render.
			if (contents.trim() === '') {
				return;
			}

			// Custom debug view setup.
			if (Config.debug) {
				// QUESTION: Should this `elTag` check be more robust?
				this.debugView.modes({ block : elTag !== 'span' });
			}

			// Create a target to hold our contents.
			const $target = jQuery(document.createElement(elTag))
				.addClass(`macro-${this.name} ${eventClass}`)
				.attr('data-do-tags', tags.join(' '))
				.wiki(contents)
				.on(':dorefresh-internal', jQuery.throttle(Engine.DOM_DELAY,
					this.shadowHandler(() => {
						const frag = document.createDocumentFragment();
						new Wikifier(frag, contents);
						$target.empty().append(frag);
					})
				))
				.appendTo(this.output);
		}
	});

	/*
		<<refresh [tags]>>
	*/
	Macro.add('refresh', {
		handler() {
			// Sanity check to prevent out-of-control refreshes.
			//
			// NOTE: This may be too restrictive.
			const failRE  = /^(?:do|for)$/;
			const passRE  = /^(?:button|link(?:append|prepend|replace)?)$/;
			const closest = this.contextFind(ctx => failRE.test(ctx.name) || passRE.test(ctx.name));

			if (closest && failRE.test(closest.name)) {
				return this.error(`must not be used directly within macro <<${closest.name}>>`);
			}

			// Gather any given tags.
			const tags = this.args.length > 0
				? String(this.args[0]).trim().splitOrEmpty(/\s+/)
				: [];

			// Trigger a refresh, sending any tags along.
			jQuery(document).trigger({
				type   : ':dorefresh',
				detail : { tags }
			});
		}
	});
})();
