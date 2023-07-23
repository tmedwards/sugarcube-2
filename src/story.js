/***********************************************************************************************************************

	story.js

	Copyright © 2013–2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Passage, Wikifier, charAndPosAt, createSlug, decodeEntities, sameValueZero */

var Story = (() => { // eslint-disable-line no-unused-vars, no-var
	// Story IFID.
	let _ifId = '';

	// DOM-compatible ID.
	let _id = '';

	// Story name.
	let _name = '';

	// Mapping of navigable passages.
	const _passages = createPassagesObject();

	// Mapping of special passages.
	const _specials = createPassagesObject();

	// List of init passages.
	const _inits = [];

	// List of script passages.
	const _scripts = [];

	// List of style passages.
	const _styles = [];

	// List of widget passages.
	const _widgets = [];

	// List of code passages and tags.
	const codePassageNames = [
		'PassageDone',
		'PassageFooter',
		'PassageHeader',
		'PassageReady',
		'StoryAuthor',
		'StoryBanner',
		'StoryCaption',
		'StoryDisplayTitle',
		'StoryInit',
		'StoryInterface',
		'StoryMenu',
		'StorySettings',
		'StoryShare',
		'StorySubtitle'
	];
	const codeTagNames = [
		'init',
		'widget'
	];

	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function createPassagesObject(passages) {
		return passages
			? Object.assign(Object.create(null), passages)
			: Object.create(null);
	}

	function generateId(name) {
		// TODO: In v3 the ID should be created from a combination of the
		// name slug and the IFID, if available, to avoid collisions between
		// stories whose names generate identical slugs.
		let id = createSlug(name);

		// [v2] Protect the ID against being an empty string.
		//
		// If `id` is empty, attempt a failover.
		if (id === '') {
			// If `_ifId` is not empty, then use it.
			if (_ifId !== '') {
				id = _ifId;
			}

			// Elsewise generate a string from the `name`'s code points (in hexadecimal).
			else {
				for (let i = 0; i < name.length; ++i) {
					const { char, start, end } = charAndPosAt(name, i);
					id += char.codePointAt(0).toString(16);
					i += end - start;
				}
			}
		}

		return id;
	}

	function generateName(rawName) {
		if (rawName == null) { // lazy equality for null
			throw new Error('story name must not be null or undefined');
		}

		const name = decodeEntities(String(rawName)).trim();

		if (name === '') { // lazy equality for null
			throw new Error('story name must not be empty or consist solely of whitespace');
		}

		return name;
	}


	/*******************************************************************************
		Story Functions.
	*******************************************************************************/

	function getId() {
		return _id;
	}

	function getIfId() {
		return _ifId;
	}

	function load() {
		if (BUILD_DEBUG) { console.log('[Story/load()]'); }

		function validateStartingPassage(passage) {
			if (passage.tags.includesAny(codeTagNames)) {
				throw new Error(`starting passage "${passage.name}" contains special tags; invalid: "${passage.tags.filter(tag => codeTagNames.includes(tag)).sort().join('", "')}"`);
			}
		}

		function validateSpecialPassages(passage, ...tags) {
			// TODO: What the fuck is this?
			if (codePassageNames.includes(passage.name)) {
				throw new Error(`special passage "${passage.name}" contains special tags; invalid: "${tags.sort().join('", "')}"`);
			}

			const codeTags  = Array.from(codeTagNames);
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
		if (BUILD_TWINE1) {
			// Additional Twine 1 validation setup.
			codePassageNames.push('StoryTitle');
			codeTagNames.push('script', 'stylesheet');


			// Set the default starting passage.
			Config.passages.start = (() => {
				// Handle the Twine 1.4+ Test Play From Here feature.
				//
				// WARNING: Do not remove the `String()` wrapper from or change the quote
				// style of the `"START_AT"` replacement target.  The former is there to
				// keep Terser from pruning the code into oblivion—i.e. minifying the
				// code into something broken.  The latter is there because the Twine 1
				// pattern that matches it depends upon the double quotes.
				const testPlay = String("START_AT"); // eslint-disable-line quotes

				if (testPlay !== '') {
					if (BUILD_DEBUG) { console.log(`\tTest play; starting passage: "${testPlay}"`); }

					Config.debug = true;
					return testPlay;
				}

				// In the absence of a `testPlay` value, return 'Start'.
				return 'Start';
			})();

			// Process the passages, excluding any tagged 'Twine.private' or 'annotation'.
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
					else if (codePassageNames.includes(passage.name)) {
						// TODO: Do some kind of validation here.
						_specials[passage.name] = passage;
					}


					// All other passages.
					else {
						_passages[passage.name] = passage;
					}
				});

			// Get the story's name.
			if (Object.hasOwn(_specials, 'StoryTitle')) {
				const buf = document.createDocumentFragment();
				new Wikifier(buf, _specials.StoryTitle.processText().trim());
				_name = generateName(buf.textContent);
			}
			else {
				throw new Error('cannot find the "StoryTitle" special passage');
			}

			// Get the story's ID.
			_id = generateId(_name);
		}

		// For Twine 2.
		else {
			const $storydata = jQuery('tw-storydata');
			const startNode  = $storydata.attr('startnode') || '';

			// Set the default starting passage.
			Config.passages.start = null; // no default in Twine 2

			// Process story options.
			//
			// NOTE: Currently, the only option of interest is 'debug', so we
			// simply use a regular expression to check for it.
			Config.debug = /\bdebug\b/.test($storydata.attr('options'));

			// Process stylesheet passages.
			$storydata
				.children('style') // alternatively: '[type="text/twine-css"]' or '#twine-user-stylesheet'
				.each(function (i) {
					_styles.push(new Passage(`tw-user-style-${i}`, this));
				});

			// Process script passages.
			$storydata
				.children('script') // alternatively: '[type="text/twine-javascript"]' or '#twine-user-script'
				.each(function (i) {
					_scripts.push(new Passage(`tw-user-script-${i}`, this));
				});

			// Process normal passages, excluding any tagged 'Twine.private' or 'annotation'.
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
					else if (codePassageNames.includes(passage.name)) {
						// TODO: Do some kind of validation here.
						_specials[passage.name] = passage;
					}

					// All other passages.
					else {
						_passages[passage.name] = passage;
					}
				});

			// Get the story's IFID.
			_ifId = $storydata.attr('ifid');

			// Get the story's name.
			//
			// FIXME: Maybe `$storydata.attr('name')` should be used instead of `'{{STORY_NAME}}'`?
			// _name = generateName($storydata.attr('name'));
			_name = generateName('{{STORY_NAME}}');

			// Get the story's ID.
			_id = generateId(_name);
		}

		// Set the document's title to the story's name.
		document.title = _name;

		// Set the default saves ID to the story's ID.
		Config.saves.id = _id;
	}

	function getName() {
		return _name;
	}


	/*******************************************************************************
		Passage Functions.
	*******************************************************************************/

	function passagesAdd(passage) {
		if (!(passage instanceof Passage)) {
			throw new TypeError('Story.add passage parameter must be an instance of Passage');
		}

		if (codePassageNames.includes(passage)) {
			throw new Error('Story.add passage instance must not be a code passage');
		}

		if (passage.tags.includesAny(codeTags)) {
			throw new Error('Story.add passage instance must not be tagged with code tags');
		}

		const name = passage.name;

		if (Object.hasOwn(_passages, name)) {
			return false;
		}

		_passages[name] = passage;
		return true;
	}

	function passagesFilter(predicate, thisArg) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.filter predicate parameter must be a function');
		}

		const results = [];

		for (let i = 0, keys = Object.keys(_passages); i < keys.length; ++i) {
			const passage = _passages[keys[i]];

			if (predicate.call(Object(thisArg), passage)) {
				results.push(passage);
			}
		}

		return results;
	}

	function passagesFind(predicate, thisArg) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.find predicate parameter must be a function');
		}

		for (let i = 0, keys = Object.keys(_passages); i < keys.length; ++i) {
			const passage = _passages[keys[i]];

			if (predicate.call(Object(thisArg), passage)) {
				return passage;
			}
		}
	}

	function passagesGet(name) {
		let type = typeof name;

		switch (type) {
			// Valid types.
			case 'number':
			case 'string': {
				const id = String(name);
				return Object.hasOwn(_passages, id) ? _passages[id] : new Passage(id || '(unknown)');
			}

			// Invalid types.  We do the extra processing just to make a nicer error.
			case 'undefined':
				/* no-op */
				break;

			case 'object':
				type = name === null ? 'null' : 'an object';
				break;

			default: // 'bigint', 'boolean', 'function', 'symbol'
				type = `a ${type}`;
				break;
		}

		throw new TypeError(`Story.get name parameter cannot be ${type}`);
	}

	function passagesGetInits() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_inits));
	}

	function passagesGetNormals() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(createPassagesObject(_passages));
	}

	function passagesGetScripts() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_scripts));
	}

	function passagesGetSpecials() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(createPassagesObject(_specials));
	}

	function passagesGetStylesheets() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_styles));
	}

	function passagesGetWidgets() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_widgets));
	}

	function passagesHas(name) {
		let type = typeof name;

		switch (type) {
		// Valid types.
			case 'number':
			case 'string':
				return Object.hasOwn(_passages, String(name));

			// Invalid types.  We do the extra processing just to make a nicer error.
			case 'undefined':
				/* no-op */
				break;

			case 'object':
				type = name === null ? 'null' : 'an object';
				break;

			default: // 'bigint', 'boolean', 'function', 'symbol'
				type = `a ${type}`;
				break;
		}

		throw new TypeError(`Story.has name parameter cannot be ${type}`);
	}


	/*******************************************************************************
		Deprecated Functions.
	*******************************************************************************/

	function passagesLookup(key, value  /* legacy */, sortKey = 'name'/* /legacy */) {
		return passagesFilter(passage => {
			// Objects (sans `null`).
			if (typeof passage[key] === 'object' && passage[key] !== null) {
				// The only object type currently supported is `Array`, since the
				// non-method `Passage` object properties currently yield only either
				// primitives or arrays.
				return passage[key] instanceof Array && passage[key].some(m => sameValueZero(m, value));
			}

			// All other types (incl. `null`).
			return sameValueZero(passage[key], value);
		})
			/* eslint-disable eqeqeq, no-nested-ternary, max-len */
			.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
			/* eslint-enable eqeqeq, no-nested-ternary, max-len */
	}

	function passagesLookupWith(predicate /* legacy */, sortKey = 'name'/* /legacy */) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.lookupWith predicate parameter must be a function');
		}

		return passagesFilter(predicate)
			/* eslint-disable eqeqeq, no-nested-ternary, max-len */
			.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
			/* eslint-enable eqeqeq, no-nested-ternary, max-len */
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Story Functions.
		id   : { get : getId },
		ifId : { get : getIfId },
		load : { value : load },
		name : { get : getName },

		// Passage Functions.
		add              : { value : passagesAdd },
		filter           : { value : passagesFilter },
		find             : { value : passagesFind },
		get              : { value : passagesGet },
		getAllInit       : { value : passagesGetInits },
		getAllRegular    : { value : passagesGetNormals },
		getAllScript     : { value : passagesGetScripts },
		getSpecials      : { value : passagesGetSpecials },
		getAllStylesheet : { value : passagesGetStylesheets },
		getAllWidget     : { value : passagesGetWidgets },
		has              : { value : passagesHas },

		/* legacy */
		domId      : { get : getId },
		title      : { get : getName },
		lookup     : { value : passagesLookup },
		lookupWith : { value : passagesLookupWith }
		/* /legacy */
	}));
})();
