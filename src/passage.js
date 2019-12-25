/***********************************************************************************************************************

	passage.js

	Copyright © 2013–2019 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, L10n, Story, Util, Wikifier, postrender, prerender */

var Passage = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	let _tagsToSkip;
	let _twine1Unescape;

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
	// For Twine 1
	if (TWINE1) {
		_tagsToSkip = /^(?:debug|nobr|passage|script|stylesheet|widget|twine\..*)$/i;
	}
	// For Twine 2
	else {
		_tagsToSkip = /^(?:debug|nobr|passage|widget|twine\..*)$/i;
	}

	// For Twine 1
	if (TWINE1) {
		/*
			Returns a decoded version of the passed Twine 1 passage store encoded string.
		*/
		const _twine1EscapesRe    = /(?:\\n|\\t|\\s|\\|\r)/g;
		const _hasTwine1EscapesRe = new RegExp(_twine1EscapesRe.source); // to drop the global flag
		const _twine1EscapesMap   = Object.freeze({
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


	/*******************************************************************************************************************
		Passage Class.
	*******************************************************************************************************************/
	class Passage {
		constructor(title, el) {
			Object.defineProperties(this, {
				// Passage title/ID.
				title : {
					value : Util.unescape(title)
				},

				// Passage data element (within the story data element; i.e. T1: '[tiddler]', T2: 'tw-passagedata').
				element : {
					value : el || null
				},

				// Passage tags array (sorted and unique).
				tags : {
					value : Object.freeze(el && el.hasAttribute('tags')
						? el.getAttribute('tags')
							.trim()
							.splitOrEmpty(/\s+/)
							.sort()
							.filter((tag, i, aref) => i === 0 || aref[i - 1] !== tag)
						: [])
				},

				// Passage excerpt.  Used by the `description()` method.
				_excerpt : {
					writable : true,
					value    : null
				}
			});

			// Properties dependant upon the above set.
			Object.defineProperties(this, {
				// Passage DOM-compatible ID.
				domId : {
					value : `passage-${Util.slugify(this.title)}`
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
							.map(tag => Util.slugify(tag))
					)())
				}
			});
		}

		// Getters.
		get className() {
			return this.classes.join(' ');
		}

		get text() {
			if (this.element == null) { // lazy equality for null
				const passage = Util.escape(this.title);
				const mesg    = `${L10n.get('errorTitle')}: ${L10n.get('errorNonexistentPassage', { passage })}`;
				return `<div class="error-view"><span class="error">${mesg}</span></div>`;
			}

			// For Twine 1
			if (TWINE1) {
				return _twine1Unescape(this.element.textContent);
			}
			// For Twine 2
			else { // eslint-disable-line no-else-return
				return this.element.textContent.replace(/\r/g, '');
			}
		}

		description() {
			const descriptions = Config.passages.descriptions;

			if (descriptions != null) { // lazy equality for null
				switch (typeof descriptions) {
				case 'boolean':
					if (descriptions) {
						return this.title;
					}
					break;

				case 'object':
					if (descriptions instanceof Map && descriptions.has(this.title)) {
						return descriptions.get(this.title);
					}
					else if (descriptions.hasOwnProperty(this.title)) {
						return descriptions[this.title];
					}
					break;

				case 'function':
					{
						const result = descriptions.call(this);

						if (result) {
							return result;
						}
					}
					break;

				default:
					throw new TypeError('Config.passages.descriptions must be a boolean, object, or function');
				}
			}

			// Initialize the excerpt cache from the raw passage text, if necessary.
			if (this._excerpt === null) {
				this._excerpt = Passage.getExcerptFromText(this.text);
			}

			return this._excerpt;
		}

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

		render() {
			if (DEBUG) { console.log(`[<Passage: "${this.title}">.render()]`); }

			const dataTags = this.tags.length > 0 ? this.tags.join(' ') : null;

			// Create and set up the new passage element.
			const passageEl = document.createElement('div');
			jQuery(passageEl)
				.attr({
					id             : this.domId,
					'data-passage' : this.title,
					'data-tags'    : dataTags
				})
				.addClass(`passage ${this.className}`);

			// Add the passage's classes and tags to <body>.
			jQuery(document.body)
				.attr('data-tags', dataTags)
				.addClass(this.className);

			// Add the passage's tags to <html>.
			jQuery(document.documentElement).attr('data-tags', dataTags);

			// Execute pre-render events and tasks.
			jQuery.event.trigger({
				type    : ':passagestart',
				content : passageEl,
				passage : this
			});
			Object.keys(prerender).forEach(task => {
				if (typeof prerender[task] === 'function') {
					prerender[task].call(this, passageEl, task);
				}
			});

			// Wikify the PassageHeader passage, if it exists, into the passage element.
			if (Story.has('PassageHeader')) {
				new Wikifier(passageEl, Story.get('PassageHeader').processText());
			}

			// Wikify the passage into its element.
			new Wikifier(passageEl, this.processText());

			// Wikify the PassageFooter passage, if it exists, into the passage element.
			if (Story.has('PassageFooter')) {
				new Wikifier(passageEl, Story.get('PassageFooter').processText());
			}

			// Execute post-render events and tasks.
			jQuery.event.trigger({
				type    : ':passagerender',
				content : passageEl,
				passage : this
			});
			Object.keys(postrender).forEach(task => {
				if (typeof postrender[task] === 'function') {
					postrender[task].call(this, passageEl, task);
				}
			});

			// Update the excerpt cache to reflect the rendered text.
			this._excerpt = Passage.getExcerptFromNode(passageEl);

			return passageEl;
		}

		static getExcerptFromNode(node, count) {
			if (!node.hasChildNodes()) {
				return '';
			}

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


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Passage;
})();
