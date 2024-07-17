/***********************************************************************************************************************

	passage.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, L10n, State, Wikifier, createSlug, decodeEntities, encodeMarkup, enumFrom */

var Passage = (() => { // eslint-disable-line no-unused-vars, no-var
	/*
		Tags which should not be transformed into classes:
			debug      → special tag
			nobr       → special tag
			passage    → the default class
			script     → special tag (only in Twine 1)
			stylesheet → special tag (only in Twine 1)
			twine.*    → special tag
			widget     → special tag
	*/
	let tagsToSkip;

	// Passage store text content decoding function.
	let decodePassageText;

	// For Twine 1.
	if (BUILD_TWINE1) {
		tagsToSkip = /^(?:debug|nobr|passage|script|stylesheet|widget|twine\..*)$/i;

		decodePassageText = (() => {
			const encodedMap   = enumFrom({
				'\\n' : '\n',
				'\\t' : '\t',
				'\\s' : '\\',
				'\\'  : '\\',
				'\r'  : ''
			});
			const encodedRE    = new RegExp(`(?:${
				Object.keys(encodedMap)
					.map(ch => RegExp.escape(ch))
					.join('|')
			})`, 'g');
			const hasEncodedRE = new RegExp(encodedRE.source); // to drop the global flag

			/*
				Returns a decoded version of the passed Twine 1 passage store encoded string.
			*/
			function decodePassageText(str) {
				if (str == null) { // lazy equality for null
					return '';
				}

				const val = String(str);
				return val && hasEncodedRE.test(val)
					? val.replace(encodedRE, esc => encodedMap[esc])
					: val;
			}

			return decodePassageText;
		})();
	}
	// For Twine 2.
	else {
		tagsToSkip = /^(?:debug|nobr|passage|widget|twine\..*)$/i;

		decodePassageText = (() => {
			const encodedRE    = /\r/g;
			const hasEncodedRE = new RegExp(encodedRE.source); // to drop the global flag

			/*
				Returns a decoded version of the passed Twine 2 passage store encoded string.
			*/
			function decodePassageText(str) {
				if (str == null) { // lazy equality for null
					return '';
				}

				const val = String(str);
				return val && hasEncodedRE.test(val)
					? val.replace(encodedRE, '')
					: val;
			}

			return decodePassageText;
		})();
	}


	/*******************************************************************************
		Passage Class.
	*******************************************************************************/

	class Passage {
		constructor(name, el) {
			Object.defineProperties(this, {
				// Passage title.
				name : {
					value : decodeEntities(name)
				},

				// Passage data element (within the story data element; i.e. T1: '[tiddler]', T2: 'tw-passagedata').
				element : {
					value : el || null
				},

				// Passage tags array (unique).
				tags : {
					value : Object.freeze(
						el && el.hasAttribute('tags')
							? Array.from(new Set(el.getAttribute('tags').trim().splitOrEmpty(/\s+/)))
							: []
					)
				}
			});

			// Properties dependant upon the above set.
			Object.defineProperties(this, {
				// Passage DOM-compatible ID.
				id : {
					value : `passage-${createSlug(this.name)}`
				},

				// Passage classes array (sorted and unique).
				classes : {
					value : Object.freeze(this.tags.length === 0 ? [] : (() =>
						/*
							Return the sorted list of unique classes.

							NOTE: The `this.tags` array is already sorted and unique,
							so we only need to filter and map here.
						*/
						this.tags
							.filter(tag => !tagsToSkip.test(tag))
							.map(tag => createSlug(tag))
					)())
				},

				/* legacy */
				domId : {
					get() { return this.id; }
				},
				title : {
					get() { return this.name; }
				}
				/* /legacy */
			});
		}

		// Getters.
		get className() {
			return this.classes.join(' ');
		}

		// TODO: (v3) This should be → `get source`.
		get text() {
			if (this.element == null) { // lazy equality for null
				const passage = encodeMarkup(this.name);
				const mesg    = `${L10n.get('errorViewTitle')}: ${L10n.get('errorNonexistentPassage', { passage })}`;
				return `<div class="error-view"><span class="error">${mesg}</span></div>`;
			}

			return decodePassageText(this.element.textContent);
		}

		// TODO: (v3) This should be → `get text`.
		processText() {
			if (this.element == null) { // lazy equality for null
				return this.text;
			}

			// Handle image passage transclusion.
			if (this.tags.includes('Twine.image')) {
				return `[img[${this.text}]]`;
			}

			let processed = this.text;

			// Handle `Config.passages.onProcess`.
			if (Config.passages.onProcess) {
				processed = Config.passages.onProcess.call(null, {
					title : this.name,
					tags  : this.tags,
					text  : processed
				});
			}

			// Handle `Config.passages.nobr` and the `nobr` tag.
			if (Config.passages.nobr || this.tags.includes('nobr')) {
				// Remove all leading & trailing newlines and compact all internal sequences
				// of newlines into single spaces.
				processed = processed.replace(/^\n+|\n+$/g, '').replace(/\n+/g, ' ');
			}

			return processed;
		}

		render(options) {
			const frag = document.createDocumentFragment();
			new Wikifier(frag, this.processText(), options);
			return frag;
		}

		/* legacy */
		description() { // eslint-disable-line class-methods-use-this
			return `${L10n.get('textTurn')} ${State.turns}`;
		}
		/* /legacy */
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Passage;
})();
