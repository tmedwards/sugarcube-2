/***********************************************************************************************************************

	extensions/jquery/wiki-plugin.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Story, Wikifier, errorPrologRegExp */

/*
	Wikifier methods plugin.

	`jQuery.wikiWithOptions(options, sources…)`
	    Wikifies the given content source(s), as directed by the given options.

	`jQuery.wiki(sources…)`
	    Wikifies the given content source(s).

	`<jQuery>.wikiWithOptions(options, sources…)`
	    Wikifies the given content source(s) and appends the result to the target
	    element(s), as directed by the given options.

	`<jQuery>.wiki(sources…)`
	    Wikifies the given content source(s) and appends the result to the target
	    element(s).
*/
(() => {
	jQuery.extend({
		/*
			Extend jQuery's static methods with a `wikiWithOptions()` method.
		*/
		wikiWithOptions(options, ...sources) {
			// Bail out, if there are no content sources.
			if (sources.length === 0) {
				return;
			}

			// Wikify the content sources into a fragment.
			const frag = document.createDocumentFragment();
			sources.forEach(content => new Wikifier(frag, content, options));

			// Gather the text of any error elements within the fragment…
			const errors = Array.from(frag.querySelectorAll('.error'))
				.map(errEl => errEl.textContent.replace(errorPrologRegExp, ''));

			// …and throw an exception, if there were any errors.
			if (errors.length > 0) {
				throw new Error(errors.join('; '));
			}
		},

		/*
			Extend jQuery's static methods with a `wiki()` method.
		*/
		wiki(...sources) {
			this.wikiWithOptions(undefined, ...sources);
		},

		/*
			Extend jQuery's static methods with a `wikiPassage()` method.
		*/
		wikiPassage(name) {
			this.wikiWithOptions(undefined, Story.get(name).processText());
		}
	});

	jQuery.fn.extend({
		/*
			Extend jQuery's chainable methods with a `wikiWithOptions()` method.
		*/
		wikiWithOptions(options, ...sources) {
			// Bail out if there are no target element(s) or content sources.
			if (this.length === 0 || sources.length === 0) {
				return this;
			}

			// Wikify the content sources into a fragment.
			const frag = document.createDocumentFragment();
			sources.forEach(content => new Wikifier(frag, content, options));

			// Append the fragment to the target element(s).
			this.append(frag);

			// Return `this` for further chaining.
			return this;
		},

		/*
			Extend jQuery's chainable methods with a `wiki()` method.
		*/
		wiki(...sources) {
			return this.wikiWithOptions(undefined, ...sources);
		},

		/*
			Extend jQuery's chainable methods with a `wikiPassage()` method.
		*/
		wikiPassage(name) {
			return this.wikiWithOptions(undefined, Story.get(name).processText());
		}
	});
})();
