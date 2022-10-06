/***********************************************************************************************************************

	macro/deprecated-macros.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Has, Macro, Patterns, Scripting, SimpleAudio, State, Wikifier, storage */

/*******************************************************************************
	Variables Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<remember>>
*/
Macro.add('remember', {
	skipArgs : true,
	jsVarRe  : new RegExp(`State\\.variables\\.(${Patterns.identifier})`, 'g'),

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no expression specified');
		}

		try {
			Scripting.evalJavaScript(this.args.full);
		}
		catch (ex) {
			return this.error(`bad evaluation: ${typeof ex === 'object' ? ex.message : ex}`);
		}

		const remember = storage.get('remember') || {};
		const jsVarRe  = this.self.jsVarRe;
		let match;

		while ((match = jsVarRe.exec(this.args.full)) !== null) {
			const name = match[1];
			remember[name] = State.variables[name];
		}

		if (!storage.set('remember', remember)) {
			return this.error(`unknown error, cannot remember: ${this.args.raw}`);
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	},

	init() {
		const remember = storage.get('remember');

		if (remember) {
			Object.keys(remember).forEach(name => State.variables[name] = remember[name]);
		}
	}
});

/*
	[DEPRECATED] <<forget>>
*/
Macro.add('forget', {
	skipArgs : true,
	jsVarRe  : new RegExp(`State\\.variables\\.(${Patterns.identifier})`, 'g'),

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no story variable list specified');
		}

		const remember = storage.get('remember');
		const jsVarRe  = this.self.jsVarRe;
		let match;
		let needStore = false;

		while ((match = jsVarRe.exec(this.args.full)) !== null) {
			const name = match[1];

			if (State.variables.hasOwnProperty(name)) {
				delete State.variables[name];
			}

			if (remember && remember.hasOwnProperty(name)) {
				needStore = true;
				delete remember[name];
			}
		}

		if (needStore) {
			if (Object.keys(remember).length === 0) {
				if (!storage.delete('remember')) {
					return this.error('unknown error, cannot update remember store');
				}
			}
			else if (!storage.set('remember', remember)) {
				return this.error('unknown error, cannot update remember store');
			}
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});


/*******************************************************************************
	Display Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<silently>> — Alias of <<silent>>
*/
Macro.add('silently', 'silent');

/*
	[DEPRECATED] <<display>> — Alias of <<include>>
*/
Macro.add('display', 'include');


/*******************************************************************************
	Interactive Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<click>> — Alias of <<link>>
*/
Macro.add('click', 'link');


/*******************************************************************************
	Links Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<actions>>
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

/*
	[DEPRECATED] <<choice>>
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


/*******************************************************************************
	Audio Macros.
*******************************************************************************/

(() => {
	if (Has.audio) {
		/*
			[DEPRECATED] <<setplaylist track_id_list>>
		*/
		Macro.add('setplaylist', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no track ID(s) specified');
				}

				const playlist = Macro.get('playlist');

				if (playlist.from !== null && playlist.from !== 'setplaylist') {
					return this.error('playlists have already been defined with <<createplaylist>>');
				}

				// Create the new playlist.
				try {
					SimpleAudio.lists.add('setplaylist', this.args.slice(0));
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// Lock `<<playlist>>` into our syntax.
				if (playlist.from === null) {
					playlist.from = 'setplaylist';
				}

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			[DEPRECATED] <<stopallaudio>>
		*/
		Macro.add('stopallaudio', {
			skipArgs : true,

			handler() {
				SimpleAudio.select(':all').stop();

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});
	}
	else {
		// The HTML5 <audio> API is unavailable, so add no-op versions.
		Macro.add(['setplaylist', 'stopallaudio'], {
			skipArgs : true,

			handler() {
				/* no-op */

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});
	}
})();
