/***********************************************************************************************************************

	story.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Alert, Config, Passage, Scripting, StyleWrapper, Util, Wikifier */

var Story = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Map of normal passages.
	const _passages = {};

	// List of script passages.
	const _scripts = [];

	// List of style passages.
	const _styles = [];

	// List of widget passages.
	const _widgets = [];

	// Story title.
	let _title = '';

	// Story IFID.
	let _ifId = '';

	// DOM-compatible ID.
	let _domId = '';


	/*******************************************************************************************************************
		Story Functions.
	*******************************************************************************************************************/
	function storyLoad() {
		if (DEBUG) { console.log('[Story/storyLoad()]'); }

		const validationCodeTags = [
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
				throw new Error(`starting passage "${passage.title}" contains illegal tags; invalid: "${passage.tags.filter(tag => validationCodeTags.includes(tag)).sort().join('", "')}"`);
			}
		}

		function validateSpecialPassages(passage) {
			if (validationNoCodeTagPassages.includes(passage.title) && passage.tags.includesAny(validationCodeTags)) {
				throw new Error(`special passage "${passage.title}" contains illegal tags; invalid: "${passage.tags.filter(tag => validationCodeTags.includes(tag)).sort().join('", "')}"`);
			}
		}

		// For Twine 1.
		if (TWINE1) {
			/*
				Additional Twine 1 validation setup.
			*/
			validationCodeTags.unshift('script', 'stylesheet');
			validationNoCodeTagPassages.push('StoryTitle');

			function validateTwine1CodePassages(passage) {
				const codeTags  = [...validationCodeTags];
				const foundTags = [];

				passage.tags.forEach(tag => {
					if (codeTags.includes(tag)) {
						foundTags.push(...codeTags.delete(tag));
					}
				});

				if (foundTags.length > 1) {
					throw new Error(`code passage "${passage.title}" contains multiple code tags; invalid: "${foundTags.sort().join('", "')}"`);
				}
			}

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
					if (passage.title === Config.passages.start) {
						validateStartingPassage(passage);
						_passages[passage.title] = passage;
					}
					else if (passage.tags.includes('stylesheet')) {
						validateTwine1CodePassages(passage);
						_styles.push(passage);
					}
					else if (passage.tags.includes('script')) {
						validateTwine1CodePassages(passage);
						_scripts.push(passage);
					}
					else if (passage.tags.includes('widget')) {
						validateTwine1CodePassages(passage);
						_widgets.push(passage);
					}

					// All other passages.
					else {
						validateSpecialPassages(passage);
						_passages[passage.title] = passage;
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

			/*
				Set the default saves ID (must be done after the call to `_storySetTitle()`).
			*/
			Config.saves.id = Story.domId;
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
						Config.passages.start = passage.title;
						validateStartingPassage(passage);
						_passages[passage.title] = passage;
					}
					else if (passage.tags.includes('widget')) {
						_widgets.push(passage);
					}

					// All other passages.
					else {
						validateSpecialPassages(passage);
						_passages[passage.title] = passage;
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

			/*
				Set the default saves ID (must be done after the call to `_storySetTitle()`).
			*/
			Config.saves.id = Story.domId;
		}
	}

	function storyInit() {
		if (DEBUG) { console.log('[Story/storyInit()]'); }

		/*
			Add the story styles.
		*/
		(() => {
			const storyStyle = document.createElement('style');

			new StyleWrapper(storyStyle)
				.add(_styles.map(style => style.text.trim()).join('\n'));

			jQuery(storyStyle)
				.appendTo(document.head)
				.attr({
					id   : 'style-story',
					type : 'text/css'
				});
		})();

		/*
			Evaluate the story scripts.
		*/
		for (let i = 0; i < _scripts.length; ++i) {
			try {
				Scripting.evalJavaScript(_scripts[i].text);
			}
			catch (ex) {
				console.error(ex);
				Alert.error(_scripts[i].title, typeof ex === 'object' ? ex.message : ex);
			}
		}

		/*
			Process the story widgets.
		*/
		for (let i = 0; i < _widgets.length; ++i) {
			try {
				Wikifier.wikifyEval(_widgets[i].processText());
			}
			catch (ex) {
				console.error(ex);
				Alert.error(_widgets[i].title, typeof ex === 'object' ? ex.message : ex);
			}
		}
	}

	function _storySetTitle(rawTitle) {
		if (rawTitle == null) { // lazy equality for null
			throw new Error('story title must not be null or undefined');
		}

		const title = Util.unescape(String(rawTitle)).trim();

		if (title === '') { // lazy equality for null
			throw new Error('story title must not be empty or consist solely of whitespace');
		}

		document.title = _title = title;

		// TODO: In v3 the `_domId` should be created from a combination of the
		// `_title` slug and the IFID, if available, to avoid collisions between
		// stories whose titles generate identical slugs.
		_domId = Util.slugify(_title);

		// [v2] Protect the `_domId` against being an empty string.
		//
		// If `_domId` is empty, attempt a failover.
		if (_domId === '') {
			// If `_ifId` is not empty, then use it.
			if (_ifId !== '') {
				_domId = _ifId;
			}

			// Elsewise generate a string from the `_title`'s code points (in hexadecimal).
			else {
				for (let i = 0, len = _title.length; i < len; ++i) {
					const { char, start, end } = Util.charAndPosAt(_title, i);
					_domId += char.codePointAt(0).toString(16);
					i += end - start;
				}
			}
		}
	}

	function storyTitle() {
		return _title;
	}

	function storyDomId() {
		return _domId;
	}

	function storyIfId() {
		return _ifId;
	}


	/*******************************************************************************************************************
		Passage Functions.
	*******************************************************************************************************************/
	function passagesAdd(passage) {
		if (!(passage instanceof Passage)) {
			throw new TypeError('Story.add passage parameter must be an instance of Passage');
		}

		const title = passage.title;

		if (!_passages.hasOwnProperty(title)) {
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
		case 'string':
		/* eslint-disable indent */
			{
				const id = String(title);
				return _passages.hasOwnProperty(id) ? _passages[id] : new Passage(id || '(unknown)');
			}
		/* eslint-enable indent */

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
				if (passage[key] instanceof Array && passage[key].some(m => Util.sameValueZero(m, value))) {
					results.push(passage);
				}
			}

			// All other types (incl. `null`).
			else if (Util.sameValueZero(passage[key], value)) {
				results.push(passage);
			}
		});

		// For v3.
		// /* eslint-disable no-nested-ternary */
		// // QUESTION: Do we really need to sort the list?
		// results.sort((a, b) => a.title === b.title ? 0 : a.title < b.title ? -1 : +1);
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
		// results.sort((a, b) => a.title === b.title ? 0 : a.title < b.title ? -1 : +1);
		// /* eslint-enable no-nested-ternary */

		/* legacy */
		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		results.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
		/* /legacy */

		return results;
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		// Story Functions.
		load  : { value : storyLoad },
		init  : { value : storyInit },
		title : { get : storyTitle },
		domId : { get : storyDomId },
		ifId  : { get : storyIfId },

		// Passage Functions.
		add              : { value : passagesAdd },
		has              : { value : passagesHas },
		get              : { value : passagesGet },
		getAllRegular    : { value : passagesGetAllRegular },
		getAllScript     : { value : passagesGetAllScript },
		getAllStylesheet : { value : passagesGetAllStylesheet },
		getAllWidget     : { value : passagesGetAllWidget },
		lookup           : { value : passagesLookup },
		lookupWith       : { value : passagesLookupWith }
	}));
})();
