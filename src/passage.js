/***********************************************************************************************************************

	passage.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, L10n, Wikifier, createSlug, decodeEntities, encodeMarkup, enumFrom */

var Passage = (() => { // eslint-disable-line no-unused-vars, no-var
	let _tagsToSkip;
	let _twine1Unescape;

	/*
		Tags which should not be transformed into classes:
			debug      → special tag
			nobr       → special tag
			passage    → the default class
			script     → special tag (only in Twine 1)
			storylet   → special tag
			stylesheet → special tag (only in Twine 1)
			twine.*    → special tag
			widget     → special tag
	*/
	// For Twine 1
	if (TWINE1) {
		_tagsToSkip = /^(?:debug|nobr|passage|script|storylet|stylesheet|twine\..*|widget)$/i;
	}
	// For Twine 2
	else {
		_tagsToSkip = /^(?:debug|nobr|passage|storylet|twine\..*|widget)$/i;
	}

	// For Twine 1
	if (TWINE1) {
		/*
			Returns a decoded version of the passed Twine 1 passage store encoded string.
		*/
		const _twine1EscapesRe    = /(?:\\n|\\t|\\s|\\|\r)/g;
		const _hasTwine1EscapesRe = new RegExp(_twine1EscapesRe.source); // to drop the global flag
		const _twine1EscapesMap   = enumFrom({
			'\\n' : '\n',
			'\\t' : '\t',
			'\\s' : '\\',
			'\\'  : '\\',
			'\r'  : ''
		});

		_twine1Unescape = function (str) {
			if (str == null) { // lazy equality for null
				return '';
			}

			const val = String(str);
			return val && _hasTwine1EscapesRe.test(val)
				? val.replace(_twine1EscapesRe, esc => _twine1EscapesMap[esc])
				: val;
		};
	}


	/*******************************************************************************
		Passage Class.
	*******************************************************************************/

	class Passage {
		constructor(title, el) {
			Object.defineProperties(this, {
				// Passage title/ID.
				title : {
					value : decodeEntities(title)
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
				},

				// Passage excerpt.  Used by the `description()` method.
				_excerpt : {
					writable : true,
					value    : null
				},

				// Starting position.  Used by the `start()` getter & setter.
				_start : {
					writable : true,
					value    : 0
				}
			});

			// Properties dependant upon the above set.
			Object.defineProperties(this, {
				// Passage DOM-compatible ID.
				domId : {
					value : `passage-${createSlug(this.title)}`
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
							.filter(tag => !_tagsToSkip.test(tag))
							.map(tag => createSlug(tag))
					)())
				}
			});
		}

		// Getters & setters.
		get className() {
			return this.classes.join(' ');
		}

		get start() {
			return this._start;
		}
		set start(value) {
			if (!Number.isSafeInteger(value)) {
				throw new TypeError('start value must be an integer');
			}

			if (value < 0 || value >= this.text.length) {
				throw new RangeError(`start value out of bounds (range: 0–${this.text.length - 1}; received: ${value})`);
			}

			// Update the starting position.
			this._start = value;
		}

		// TODO: (v3) This should be → `get source`.
		get text() {
			if (this.element == null) { // lazy equality for null
				const passage = encodeMarkup(this.title);
				const mesg    = `${L10n.get('errorTitle')}: ${L10n.get('errorNonexistentPassage', { passage })}`;
				return `<div class="error-view"><span class="error">${mesg}</span></div>`;
			}

			let content;

			// For Twine 1
			if (TWINE1) {
				content = _twine1Unescape(this.element.textContent);
			}
			// For Twine 2
			else {
				content = this.element.textContent.replace(/\r/g, '');
			}

			return this._start === 0 ? content : content.slice(this._start);
		}

		description() {
			const descriptions = Config.passages.descriptions;

			switch (typeof descriptions) {
				case 'boolean':
					if (descriptions) {
						return this.title;
					}
					break;

				case 'object':
					if (descriptions.hasOwnProperty(this.title)) {
						return descriptions[this.title];
					}
					break;

				case 'function': {
					const result = descriptions.call(this);

					if (result) {
						return result;
					}

					break;
				}
			}

			// Initialize the excerpt cache from the raw passage text, if necessary.
			if (this._excerpt === null) {
				this._excerpt = Passage.getExcerptFromText(this.text);
			}

			return this._excerpt;
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
					title : this.title,
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
			// Wikify the passage into a document fragment.
			const frag = document.createDocumentFragment();
			new Wikifier(frag, this.processText(), options);

			// Update the excerpt cache to reflect the rendered text.
			this._excerpt = Passage.getExcerptFromNode(frag);

			return frag;
		}

		static getExcerptFromNode(node, count) {
			if (DEBUG) { console.log(`[Passage.getExcerptFromNode(node=…, count=${count})]`, node); }

			if (!node.hasChildNodes()) {
				return '';
			}

			// WARNING: es5-shim's `<String>.trim()` can cause "too much recursion" errors
			// here on very large strings (e.g., ≥40 KiB), at least in Firefox, for unknown
			// reasons.
			//
			// To fix the issue, we're removed `\u180E` from es5-shim's whitespace pattern
			// to prevent it from erroneously shimming `<String>.trim()` in the first place.
			let excerpt = node.textContent.trim();

			if (excerpt !== '') {
				const excerptRe = new RegExp(`(\\S+(?:\\s+\\S+){0,${count > 0 ? count - 1 : 7}})`);
				excerpt = excerpt
					// Compact whitespace.
					.replace(/\s+/g, ' ')
					// Attempt to match the excerpt regexp.
					.match(excerptRe);
			}

			return excerpt ? `${excerpt[1]}\u2026` : '\u2026'; // horizontal ellipsis
		}

		static getExcerptFromText(text, count) {
			if (DEBUG) { console.log(`[Passage.getExcerptFromText(text=…, count=${count})]`, text); }

			if (text === '') {
				return '';
			}

			const excerptRe = new RegExp(`(\\S+(?:\\s+\\S+){0,${count > 0 ? count - 1 : 7}})`);
			const excerpt   = text
				// Strip macro tags (replace with a space).
				.replace(/<<.*?>>/g, ' ')
				// Strip html tags (replace with a space).
				.replace(/<.*?>/g, ' ')
				// The above might have left problematic whitespace, so trim.
				.trim()
				// Strip table markup.
				.replace(/^\s*\|.*\|.*?$/gm, '')
				// Strip image markup.
				.replace(/\[[<>]?img\[[^\]]*\]\]/g, '')
				// Clean link markup (remove all but the link text).
				.replace(/\[\[([^|\]]*?)(?:(?:\||->|<-)[^\]]*)?\]\]/g, '$1')
				// Clean heading markup.
				.replace(/^\s*!+(.*?)$/gm, '$1')
				// Clean bold/italic/underline/highlight styles.
				.replace(/'{2}|\/{2}|_{2}|@{2}/g, '')
				// A final trim.
				.trim()
				// Compact whitespace.
				.replace(/\s+/g, ' ')
				// Attempt to match the excerpt regexp.
				.match(excerptRe);
			return excerpt ? `${excerpt[1]}\u2026` : '\u2026'; // horizontal ellipsis
		}
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Passage;
})();
