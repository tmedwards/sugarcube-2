/***********************************************************************************************************************

	story.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Passage, Wikifier, characterAndPosAt, createSlug, decodeEntities, hasOwn, sameValueZero */

var Story = (() => { // eslint-disable-line no-unused-vars, no-var
	// Story IFID.
	let _ifId = '';

	// DOM-compatible ID.
	let _id = '';

	// Story name.
	let _name = '';

	// Map of normal passages.
	const _passages = {};

	// List of init passages.
	const _inits = [];

	// List of script passages.
	const _scripts = [];

	// List of style passages.
	const _styles = [];

	// List of widget passages.
	const _widgets = [];


	/*******************************************************************************
		Story Utility Functions.
	*******************************************************************************/

	function _storySetTitle(rawTitle) {
		if (rawTitle == null) { // lazy equality for null
			throw new Error('story title must not be null or undefined');
		}

		const title = decodeEntities(String(rawTitle)).trim();

		if (title === '') { // lazy equality for null
			throw new Error('story title must not be empty or consist solely of whitespace');
		}

		document.title = _name = title;

		// TODO: In v3 the `_domId` should be created from a combination of the
		// `_title` slug and the IFID, if available, to avoid collisions between
		// stories whose titles generate identical slugs.
		_id = createSlug(_name);

		// [v2] Protect the `_domId` against being an empty string.
		//
		// If `_domId` is empty, attempt a failover.
		if (_id === '') {
			// If `_ifId` is not empty, then use it.
			if (_ifId !== '') {
				_id = _ifId;
			}

			// Elsewise generate a string from the `_title`'s code points (in hexadecimal).
			else {
				for (let i = 0, len = _name.length; i < len; ++i) {
					const { char, start, end } = characterAndPosAt(_name, i);
					_id += char.codePointAt(0).toString(16);
					i += end - start;
				}
			}
		}
	}


	/*******************************************************************************
		Story Functions.
	*******************************************************************************/

	function storyId() {
		return _id;
	}

	function storyIfId() {
		return _ifId;
	}

	function storyLoad() {
		if (DEBUG) { console.log('[Story/storyLoad()]'); }

		const validationCodeTags = [
			'init',
			'widget'
		];
		const validationNoCodeTagPassages = [
			'PassageDone',
			'PassageFooter',
			'PassageHeader',
			'PassageReady',
			'StoryAuthor',
			'StoryBanner',
			'StoryCaption',
			'StoryInit',
			'StoryMenu',
			'StoryShare',
			'StorySubtitle'
		];

		function validateStartingPassage(passage) {
			if (passage.tags.includesAny(validationCodeTags)) {
				throw new Error(`starting passage "${passage.name}" contains special tags; invalid: "${passage.tags.filter(tag => validationCodeTags.includes(tag)).sort().join('", "')}"`);
			}
		}

		function validateSpecialPassages(passage, ...tags) {
			if (validationNoCodeTagPassages.includes(passage.name)) {
				throw new Error(`special passage "${passage.name}" contains special tags; invalid: "${tags.sort().join('", "')}"`);
			}

			const codeTags  = [...validationCodeTags];
			const foundTags = [];

			passage.tags.forEach(tag => {
				if (codeTags.includes(tag)) {
					foundTags.push(...codeTags.delete(tag));
				}
			});

			if (foundTags.length > 1) {
				throw new Error(`passage "${passage.name}" contains multiple special tags; invalid: "${foundTags.sort().join('", "')}"`);
			}
		}

		// For Twine 1.
		if (TWINE1) {
			/*
				Additional Twine 1 validation setup.
			*/
			validationCodeTags.unshift('script', 'stylesheet');
			validationNoCodeTagPassages.push('StoryTitle');

			/*
				Set the default starting passage.
			*/
			Config.passages.start = (() => {
				/*
					Handle the Twine 1.4+ Test Play From Here feature.

					WARNING: Do not remove the `String()` wrapper from or change the quote
					style of the `"START_AT"` replacement target.  The former is there to
					keep UglifyJS from pruning the code into oblivion—i.e. minifying the
					code into something broken.  The latter is there because the Twine 1
					pattern that matches it depends upon the double quotes.

				*/
				const testPlay = String("START_AT"); // eslint-disable-line quotes

				if (testPlay !== '') {
					if (DEBUG) { console.log(`\tTest play; starting passage: "${testPlay}"`); }

					Config.debug = true;
					return testPlay;
				}

				// In the absence of a `testPlay` value, return 'Start'.
				return 'Start';
			})();

			/*
				Process the passages, excluding any tagged 'Twine.private' or 'annotation'.
			*/
			jQuery('#store-area')
				.children(':not([tags~="Twine.private"],[tags~="annotation"])')
				.each(function () {
					const $this   = jQuery(this);
					const passage = new Passage($this.attr('tiddler'), this);

					// Special cases.
					if (passage.name === Config.passages.start) {
						validateStartingPassage(passage);
						_passages[passage.name] = passage;
					}
					else if (passage.tags.includes('init')) {
						validateSpecialPassages(passage, 'init');
						_inits.push(passage);
					}
					else if (passage.tags.includes('stylesheet')) {
						validateSpecialPassages(passage, 'stylesheet');
						_styles.push(passage);
					}
					else if (passage.tags.includes('script')) {
						validateSpecialPassages(passage, 'script');
						_scripts.push(passage);
					}
					else if (passage.tags.includes('widget')) {
						validateSpecialPassages(passage, 'widget');
						_widgets.push(passage);
					}

					// All other passages.
					else {
						_passages[passage.name] = passage;
					}
				});

			/*
				Set the story title or throw an exception.
			*/
			if (_passages.hasOwnProperty('StoryTitle')) {
				const buf = document.createDocumentFragment();
				new Wikifier(buf, _passages.StoryTitle.processText().trim());
				_storySetTitle(buf.textContent);
			}
			else {
				throw new Error('cannot find the "StoryTitle" special passage');
			}
		}

		// For Twine 2.
		else {
			const $storydata = jQuery('tw-storydata');
			const startNode  = $storydata.attr('startnode') || '';

			/*
				Set the default starting passage.
			*/
			Config.passages.start = null; // no default in Twine 2

			/*
				Process story options.

				NOTE: Currently, the only option of interest is 'debug', so we
				simply use a regular expression to check for it.
			*/
			Config.debug = /\bdebug\b/.test($storydata.attr('options'));

			/*
				Process stylesheet passages.
			*/
			$storydata
				.children('style') // alternatively: '[type="text/twine-css"]' or '#twine-user-stylesheet'
				.each(function (i) {
					_styles.push(new Passage(`tw-user-style-${i}`, this));
				});

			/*
				Process script passages.
			*/
			$storydata
				.children('script') // alternatively: '[type="text/twine-javascript"]' or '#twine-user-script'
				.each(function (i) {
					_scripts.push(new Passage(`tw-user-script-${i}`, this));
				});

			/*
				Process normal passages, excluding any tagged 'Twine.private' or 'annotation'.
			*/
			$storydata
				.children('tw-passagedata:not([tags~="Twine.private"],[tags~="annotation"])')
				.each(function () {
					const $this   = jQuery(this);
					const pid     = $this.attr('pid') || '';
					const passage = new Passage($this.attr('name'), this);

					// Special cases.
					if (pid === startNode && startNode !== '') {
						Config.passages.start = passage.name;
						validateStartingPassage(passage);
						_passages[passage.name] = passage;
					}
					else if (passage.tags.includes('init')) {
						validateSpecialPassages(passage, 'init');
						_inits.push(passage);
					}
					else if (passage.tags.includes('widget')) {
						validateSpecialPassages(passage, 'widget');
						_widgets.push(passage);
					}

					// All other passages.
					else {
						_passages[passage.name] = passage;
					}
				});

			/*
				Get the story IFID.
			*/
			_ifId = $storydata.attr('ifid');

			/*
				Set the story title.

				FIXME: Maybe `$storydata.attr('name')` should be used instead of `'{{STORY_NAME}}'`?
			*/
			// _storySetTitle($storydata.attr('name'));
			_storySetTitle('{{STORY_NAME}}');
		}

		/*
			Set the default saves ID to the story's ID.

			NOTE: Must be done after the call to `_storySetTitle()`.
		*/
		Config.saves.id = _id;
	}

	function storyName() {
		return _name;
	}


	/*******************************************************************************
		Passage Functions.
	*******************************************************************************/

	function passagesAdd(passage) {
		if (!(passage instanceof Passage)) {
			throw new TypeError('Story.add passage parameter must be an instance of Passage');
		}

		const title = passage.name;

		if (!hasOwn(_passages, title)) {
			_passages[title] = passage;
			return true;
		}

		return false;
	}

	function passagesHas(title) {
		let type = typeof title;

		switch (type) {
		// Valid types.
			case 'number':
			case 'string':
				return _passages.hasOwnProperty(String(title));

			// Invalid types.  We do the extra processing just to make a nicer error.
			case 'undefined':
				/* no-op */
				break;

			case 'object':
				type = title === null ? 'null' : 'an object';
				break;

			default: // 'bigint', 'boolean', 'function', 'symbol'
				type = `a ${type}`;
				break;
		}

		throw new TypeError(`Story.has title parameter cannot be ${type}`);
	}

	function passagesGet(title) {
		let type = typeof title;

		switch (type) {
			// Valid types.
			case 'number':
			case 'string': {
				const id = String(title);
				return hasOwn(_passages, id) ? _passages[id] : new Passage(id || '(unknown)');
			}

			// Invalid types.  We do the extra processing just to make a nicer error.
			case 'undefined':
				/* no-op */
				break;

			case 'object':
				type = title === null ? 'null' : 'an object';
				break;

			default: // 'bigint', 'boolean', 'function', 'symbol'
				type = `a ${type}`;
				break;
		}

		throw new TypeError(`Story.get title parameter cannot be ${type}`);
	}

	function passagesGetAllInit() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_inits));
	}

	function passagesGetAllRegular() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Object.assign({}, _passages));
	}

	function passagesGetAllScript() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_scripts));
	}

	function passagesGetAllStylesheet() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_styles));
	}

	function passagesGetAllWidget() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_widgets));
	}

	function passagesLookup(key, value  /* legacy */, sortKey = 'title'/* /legacy */) {
		const results = [];

		Object.keys(_passages).forEach(name => {
			const passage = _passages[name];

			// Objects (sans `null`).
			if (typeof passage[key] === 'object' && passage[key] !== null) {
				// The only object type currently supported is `Array`, since the
				// non-method `Passage` object properties currently yield only either
				// primitives or arrays.
				if (passage[key] instanceof Array && passage[key].some(m => sameValueZero(m, value))) {
					results.push(passage);
				}
			}

			// All other types (incl. `null`).
			else if (sameValueZero(passage[key], value)) {
				results.push(passage);
			}
		});

		// For v3.
		// /* eslint-disable no-nested-ternary */
		// // QUESTION: Do we really need to sort the list?
		// results.sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : +1);
		// /* eslint-enable no-nested-ternary */

		/* legacy */
		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		results.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
		/* /legacy */

		return results;
	}

	function passagesLookupWith(predicate /* legacy */, sortKey = 'title'/* /legacy */) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.lookupWith predicate parameter must be a function');
		}

		const results = [];

		Object.keys(_passages).forEach(name => {
			const passage = _passages[name];

			if (predicate(passage)) {
				results.push(passage);
			}
		});

		// For v3.
		// /* eslint-disable no-nested-ternary */
		// // QUESTION: Do we really need to sort the list?
		// results.sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : +1);
		// /* eslint-enable no-nested-ternary */

		/* legacy */
		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		results.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
		/* /legacy */

		return results;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Story Functions.
		id   : { get : storyId },
		ifId : { get : storyIfId },
		load : { value : storyLoad },
		name : { get : storyName },

		// Passage Functions.
		add              : { value : passagesAdd },
		has              : { value : passagesHas },
		get              : { value : passagesGet },
		getAllInit       : { value : passagesGetAllInit },
		getAllRegular    : { value : passagesGetAllRegular },
		getAllScript     : { value : passagesGetAllScript },
		getAllStylesheet : { value : passagesGetAllStylesheet },
		getAllWidget     : { value : passagesGetAllWidget },
		lookup           : { value : passagesLookup },
		lookupWith       : { value : passagesLookupWith },

		/* legacy */
		domId : { get : storyId },
		title : { get : storyName }
		/* /legacy */
	}));
})();
