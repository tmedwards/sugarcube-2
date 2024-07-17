/***********************************************************************************************************************

	story.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Passage, Wikifier, charAndPosAt, createSlug, decodeEntities, getTypeOf, sameValueZero */

var Story = (() => { // eslint-disable-line no-unused-vars, no-var
	// Story IFID.
	let _ifId = '';

	// DOM-compatible ID.
	let _id = '';

	// Story name.
	let _name = '';

	// Mapping of normal passages.
	const _passages = createPassageStore();

	// List of init passages.
	const _inits = [];

	// List of script passages.
	const _scripts = [];

	// List of style passages.
	const _styles = [];

	// List of widget passages.
	const _widgets = [];

	// List of code passages for sanity checks.
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
		'StoryShare',
		'StorySubtitle'
	];

	// List of code tags for sanity checks.
	const codeTagNames = [
		'init',
		'widget'
	];


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function createPassageStore(passages) {
		const store = Object.create(null);
		return passages
			? Object.assign(store, passages)
			: store;
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
		Initialization Functions.
	*******************************************************************************/

	function init() {
		function assertNoCodeTags(passage, desc) {
			// Code tags are completely disallowed.
			if (passage.tags.includesAny(codeTagNames)) {
				throw new Error(`${desc} passage "${passage.name}" includes code tags; invalid: "${passage.tags.filter(tag => codeTagNames.includes(tag)).sort().join('", "')}"`);
			}
		}

		function assertValidCodeTagUsage(passage) {
			const found = passage.tags.filter(tag => codeTagNames.includes(tag)).sort();

			// Multiple code tags are disallowed.
			if (found.length > 1) {
				throw new Error(`passage "${passage.name}" includes multiple code tags; invalid: "${found.join('", "')}"`);
			}
		}

		if (BUILD_DEBUG) { console.log('[Story/init()]'); }

		// For Twine 1.
		if (BUILD_TWINE1) {
			// Additional Twine 1 assertion setup.
			codePassageNames.push('StorySettings', 'StoryTitle');
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

			// Process passages, excluding any tagged 'Twine.private' or 'annotation'.
			jQuery('#store-area')
				.children(':not([tags~="Twine.private"],[tags~="annotation"])')
				.each(function () {
					const $this   = jQuery(this);
					const passage = new Passage($this.attr('tiddler'), this);

					// WARNING: The ordering of the following `if` statements is important!

					// Special case: starting passage.
					if (passage.name === Config.passages.start) {
						assertNoCodeTags(passage, 'starting');
						_passages[passage.name] = passage;
					}

					// Special case: code passages.
					else if (codePassageNames.includes(passage.name)) {
						assertNoCodeTags(passage, 'code');
						// NOTE: Ideally, these should be going into their own store, rather than `_passages`.
						_passages[passage.name] = passage;
					}

					// Special case: init passages.
					else if (passage.tags.includes('init')) {
						assertValidCodeTagUsage(passage);
						_inits.push(passage);
					}

					// Special case: script passages.
					else if (passage.tags.includes('script')) {
						assertValidCodeTagUsage(passage);
						_scripts.push(passage);
					}

					// Special case: stylesheet passages.
					else if (passage.tags.includes('stylesheet')) {
						assertValidCodeTagUsage(passage);
						_styles.push(passage);
					}

					// Special case: widget passages.
					else if (passage.tags.includes('widget')) {
						assertValidCodeTagUsage(passage);
						_widgets.push(passage);
					}

					// All other passages.
					else {
						_passages[passage.name] = passage;
					}
				});

			// Get the story's name.
			if (Object.hasOwn(_passages, 'StoryTitle')) {
				const buf = document.createDocumentFragment();
				new Wikifier(buf, _passages.StoryTitle.processText().trim());
				_name = generateName(buf.textContent);
			}
			else {
				throw new Error('cannot find the "StoryTitle" special passage');
			}
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

			// Process stylesheets.
			$storydata
				.children('style') // alternatively: '[type="text/twine-css"]'
				.each(function (i) {
					_styles.push(new Passage(`tw-user-style-${i}`, this));
				});

			// Process scripts.
			$storydata
				.children('script') // alternatively: '[type="text/twine-javascript"]'
				.each(function (i) {
					_scripts.push(new Passage(`tw-user-script-${i}`, this));
				});

			// Process passages, excluding any tagged 'Twine.private' or 'annotation'.
			$storydata
				.children('tw-passagedata:not([tags~="Twine.private"],[tags~="annotation"])')
				.each(function () {
					const $this   = jQuery(this);
					const pid     = $this.attr('pid') || '';
					const passage = new Passage($this.attr('name'), this);

					// WARNING: The ordering of the following `if` statements is important!

					// Special case: starting passage.
					if (pid === startNode && startNode !== '') {
						Config.passages.start = passage.name;
						assertNoCodeTags(passage, 'starting');
						_passages[passage.name] = passage;
					}

					// Special case: code passages.
					else if (codePassageNames.includes(passage.name)) {
						assertNoCodeTags(passage, 'code');
						// NOTE: Ideally, these should be going into their own store, rather than `_passages`.
						_passages[passage.name] = passage;
					}

					// Special case: init passages.
					else if (passage.tags.includes('init')) {
						assertValidCodeTagUsage(passage);
						_inits.push(passage);
					}

					// Special case: widget passages.
					else if (passage.tags.includes('widget')) {
						assertValidCodeTagUsage(passage);
						_widgets.push(passage);
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
			// QUESTION: Maybe `$storydata.attr('name')` should be used instead of `'{{STORY_NAME}}'`?
			// _name = generateName($storydata.attr('name'));
			_name = generateName('{{STORY_NAME}}');
		}

		// Get the story's ID.
		_id = generateId(_name);

		// Set the default saves ID to the story's ID.
		Config.saves.id = _id;

		// Set the document's title to the story's name.
		document.title = _name;
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

	function getName() {
		return _name;
	}


	/*******************************************************************************
		Passage Functions.
	*******************************************************************************/

	function add(descriptor) {
		if (getTypeOf(descriptor) !== 'Object') {
			throw new TypeError('Story.add() descriptor parameter must be a generic object');
		}

		if (Object.hasOwn(_passages, descriptor.name)) {
			return false;
		}

		const elem = document.createElement('div');
		elem.setAttribute('name', descriptor.name);
		elem.setAttribute('tags', descriptor.tags);
		elem.textContent = descriptor.text;

		const passage = new Passage(descriptor.name, elem);

		if (codePassageNames.includes(passage.name)) {
			throw new Error(`Story.add() passage descriptor object "${passage.name}" must not be a code passage`);
		}

		if (passage.tags.includesAny(codeTagNames)) {
			throw new Error(`Story.add() passage descriptor object "${passage.name}" must not include code tags`);
		}

		_passages[passage.name] = passage;
		return true;
	}

	function delete$(name) {
		let type = typeof name;

		switch (type) {
			// Valid types.
			case 'number':
			case 'string': {
				const key = String(name);

				if (!Object.hasOwn(_passages, key)) {
					return false;
				}

				if (key === Config.passages.start || codePassageNames.includes(key)) {
					throw new Error(`Story.delete() passage "${key}" must not be a code passage`);
				}

				if (_passages[key].tags.includesAny(codeTagNames)) {
					throw new Error(`Story.delete() passage "${key}" must not include code tags`);
				}

				delete _passages[key];
				return true;
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

		throw new TypeError(`Story.delete() name parameter cannot be ${type}`);
	}

	function filter(predicate, thisArg) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.filter() predicate parameter must be a function');
		}

		const results = [];

		for (let i = 0, keys = Object.keys(_passages); i < keys.length; ++i) {
			const passage = _passages[keys[i]];

			if (predicate.call(typeof thisArg === 'undefined' ? this : thisArg, passage)) {
				results.push(passage);
			}
		}

		return results;
	}

	function find(predicate, thisArg) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.find() predicate parameter must be a function');
		}

		for (let i = 0, keys = Object.keys(_passages); i < keys.length; ++i) {
			const passage = _passages[keys[i]];

			if (predicate.call(typeof thisArg === 'undefined' ? this : thisArg, passage)) {
				return passage;
			}
		}
	}

	function get(name) {
		let type = typeof name;

		switch (type) {
			// Valid types.
			case 'number':
			case 'string': {
				const key = String(name);
				return Object.hasOwn(_passages, key) ? _passages[key] : new Passage(key || '(unknown)');
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

		throw new TypeError(`Story.get() name parameter cannot be ${type}`);
	}

	function getInits() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_inits));
	}

	function getNormals() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(createPassageStore(_passages));
	}

	function getScripts() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_scripts));
	}

	function getStyles() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_styles));
	}

	function getWidgets() {
		// NOTE: Return an immutable copy, rather than the internal mutable original.
		return Object.freeze(Array.from(_widgets));
	}

	function has(name) {
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

	function lookup(key, value  /* legacy */, sortKey = 'name'/* /legacy */) {
		console.warn('[DEPRECATED] Story.lookup() is deprecated.');

		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		return filter(passage => {
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
			.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
	}

	function lookupWith(predicate /* legacy */, sortKey = 'name'/* /legacy */) {
		console.warn('[DEPRECATED] Story.lookupWith() is deprecated.');

		if (typeof predicate !== 'function') {
			throw new TypeError('Story.lookupWith() predicate parameter must be a function');
		}

		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		return filter(predicate)
			.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Initialization Functions.
		init : { value : init },

		// Story Functions.
		id   : { get : getId },
		ifId : { get : getIfId },
		name : { get : getName },

		// Passage Functions.
		add        : { value : add },
		delete     : { value : delete$ },
		filter     : { value : filter },
		find       : { value : find },
		get        : { value : get },
		getInits   : { value : getInits },
		getNormals : { value : getNormals },
		getScripts : { value : getScripts },
		getStyles  : { value : getStyles },
		getWidgets : { value : getWidgets },
		has        : { value : has },

		/* legacy */
		domId : {
			get() {
				console.warn('[DEPRECATED] Story.domId is deprecated.');
				return getId();
			}
		},
		title : {
			get() {
				console.warn('[DEPRECATED] Story.title is deprecated.');
				return getName();
			}
		},
		lookup     : { value : lookup },
		lookupWith : { value : lookupWith }
		/* /legacy */
	}));
})();
