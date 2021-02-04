/***********************************************************************************************************************

	lib/stylewrapper.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns, Story, Wikifier */

var StyleWrapper = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	const _imageMarkupRe    = new RegExp(Patterns.cssImage, 'g');
	const _hasImageMarkupRe = new RegExp(Patterns.cssImage);


	/*******************************************************************************************************************
		StyleWrapper Class.
	*******************************************************************************************************************/
	class StyleWrapper {
		constructor(style) {
			if (style == null) { // lazy equality for null
				throw new TypeError('StyleWrapper style parameter must be an HTMLStyleElement object');
			}

			Object.defineProperties(this, {
				style : {
					value : style
				}
			});
		}

		isEmpty() {
			// This should work in all supported browsers.
			return this.style.cssRules.length === 0;
		}

		set(rawCss) {
			this.clear();
			this.add(rawCss);
		}

		add(rawCss) {
			let css = rawCss;

			// Check for wiki image transclusion.
			if (_hasImageMarkupRe.test(css)) {
				/*
					The JavaScript specifications, since at least ES3, say that `<String>.replace()`
					should reset a global-flagged regular expression's `lastIndex` property to `0`
					upon invocation.  Buggy browser versions exist, however, which do not reset
					`lastIndex`, so we should do so manually to support those browsers.

					NOTE: I do not think this is actually necessary, since `_imageMarkupRe` is
					scoped to this module—meaning users should not be able to access it.  That
					being the case, and since we search to exhaustion which should also cause
					`lastIndex` to be reset, there should never be an instance where we invoke
					`css.replace()` and `_imageMarkupRe.lastIndex` is not already `0`.  Still,
					considering the other bug, better safe than sorry.
				*/
				_imageMarkupRe.lastIndex = 0;

				css = css.replace(_imageMarkupRe, wikiImage => {
					const markup = Wikifier.helpers.parseSquareBracketedMarkup({
						source     : wikiImage,
						matchStart : 0
					});

					if (markup.hasOwnProperty('error') || markup.pos < wikiImage.length) {
						return wikiImage;
					}

					let source = markup.source;

					// Handle image passage transclusion.
					if (source.slice(0, 5) !== 'data:' && Story.has(source)) {
						const passage = Story.get(source);

						if (passage.tags.includes('Twine.image')) {
							source = passage.text.trim();
						}
					}

					/*
						The source may be URI- or Base64-encoded, so we cannot use `encodeURIComponent()`
						here.  Instead, we simply encode any double quotes, since the URI will be
						delimited by them.
					*/
					return `url("${source.replace(/"/g, '%22')}")`;
				});
			}

			// For IE ≤ 10.
			if (this.style.styleSheet) {
				this.style.styleSheet.cssText += css;
			}

			// For all other browsers (incl. IE ≥ 11).
			else {
				this.style.appendChild(document.createTextNode(css));
			}
		}

		clear() {
			// For IE ≤10.
			if (this.style.styleSheet) {
				this.style.styleSheet.cssText = '';
			}

			// For all other browsers (incl. IE ≥11).
			else {
				jQuery(this.style).empty();
			}
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return StyleWrapper;
})();
