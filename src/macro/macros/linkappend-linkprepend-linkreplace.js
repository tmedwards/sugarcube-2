/***********************************************************************************************************************

	macro/macros/linkappend-linkprepend-linkreplace.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, Macro, Wikifier */

/*
	<<linkappend>>, <<linkprepend>>, & <<linkreplace>>
*/
Macro.add(['linkappend', 'linkprepend', 'linkreplace'], {
	isAsync : true,
	tags    : null,
	t8nRe   : /^(?:transition|t8n)$/,

	handler() {
		if (this.args.length === 0) {
			return this.error('no link text specified');
		}

		const $link      = jQuery(document.createElement('a'));
		const $insert    = jQuery(document.createElement('span'));
		const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);

		$link
			.wikiWithOptions({ cleanup : false, profile : 'core' }, this.args[0])
			.addClass(`link-internal macro-${this.name}`)
			.ariaClick({
				namespace : '.macros',
				one       : true
			}, this.shadowHandler(
				() => {
					if (this.name === 'linkreplace') {
						$link.remove();
					}
					else {
						$link
							.wrap(`<span class="macro-${this.name}"></span>`)
							.replaceWith(() => $link.html());
					}

					if (this.payload[0].contents !== '') {
						const frag = document.createDocumentFragment();
						new Wikifier(frag, this.payload[0].contents, { cleanup : false });
						$insert.append(frag);
					}

					if (transition) {
						setTimeout(() => $insert.removeClass(`macro-${this.name}-in`), Engine.DOM_DELAY);
					}
				}
			))
			.appendTo(this.output);

		$insert.addClass(`macro-${this.name}-insert`);

		if (transition) {
			$insert.addClass(`macro-${this.name}-in`);
		}

		if (this.name === 'linkprepend') {
			$insert.insertBefore($link);
		}
		else {
			$insert.insertAfter($link);
		}
	}
});
