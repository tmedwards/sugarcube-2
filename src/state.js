/***********************************************************************************************************************

	state.js

	Copyright © 2013–2025 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Diff, Scripting, clone, getTypeOf, session, storage, triggerEvent */

var State = (() => { // eslint-disable-line no-unused-vars, no-var
	// Moment history stack.
	let momentHistory = [];

	// Active moment.
	let activeMoment = momentCreate();

	// Index of the active moment.
	let activeIndex = -1;

	// Names of all moments that have expired (i.e., fallen off the bottom of the stack).
	let expired = [];

	// (optional) Seedable PRNG object.
	let prng = null;

	// Temporary variables object.
	let temporary = Object.create(null);


	/*******************************************************************************
		State Functions.
	*******************************************************************************/

	/*
		Resets the story state.
	*/
	function stateReset() {
		if (BUILD_DEBUG) { console.log('[State/stateReset()]'); }

		// Delete the active session.
		session.delete('state');

		// Reset the properties.
		momentHistory = [];
		activeMoment  = momentCreate();
		activeIndex   = -1;
		expired       = [];
		prng          = prng === null ? null : prngCreate(prng.seed);

		// Reset the temporary variables.
		tempVariablesClear();
	}

	/*
		Restores the story state from the active session.
	*/
	function stateRestore() {
		if (BUILD_DEBUG) { console.log('[State/stateRestore()]'); }

		// Retrieve the active session.
		const state = session.get('state');

		if (BUILD_DEBUG) { console.log('\tsession state:', state); }

		if (state == null) { // nullish test
			return false;
		}

		// Restore the active session.
		stateUnmarshal(state);
		return true;
	}

	/*
		Returns the current story state marshaled into a serializable object.
	*/
	function stateMarshal(noDelta) {
		// Gather the properties.
		const state = {
			index : activeIndex
		};

		if (noDelta) {
			state.history = clone(momentHistory);
		}
		else {
			state.delta = historyDeltaEncode(momentHistory);
		}

		if (expired.length > 0) {
			state.expired = Array.from(expired);
		}

		if (prng !== null) {
			state.seed = prng.seed;
		}

		return state;
	}

	/*
		Restores the story state from a marshaled story state serialization object.
	*/
	function stateUnmarshal(state, noDelta) {
		if (state == null) { // nullish test
			throw new TypeError('state parameter must be an object');
		}

		if (
			!Object.hasOwn(state, noDelta ? 'history' : 'delta')
			|| state[noDelta ? 'history' : 'delta'].length === 0
		) {
			throw new Error('state object has no history or history is empty');
		}

		if (!Object.hasOwn(state, 'index')) {
			throw new Error('state object has no index');
		}

		if (prng !== null && !Object.hasOwn(state, 'seed')) {
			throw new Error('state object has no seed, but PRNG is enabled');
		}

		if (prng === null && Object.hasOwn(state, 'seed')) {
			throw new Error('state object has seed, but PRNG is disabled');
		}

		// Restore the properties.
		momentHistory = noDelta ? clone(state.history) : historyDeltaDecode(state.delta);
		activeIndex   = state.index;
		expired       = Object.hasOwn(state, 'expired') ? Array.from(state.expired) : [];

		if (Object.hasOwn(state, 'seed')) {
			// Only the PRNG's seed should be restored here as `momentActivate()`
			// will handle fully restoring the PRNG to its proper state.
			prng.seed = state.seed;
		}

		// Activate the current moment.
		//
		// NOTE: Do this only after all properties have been restored.
		momentActivate(activeIndex);
	}

	/*
		Returns the current story state marshaled into a save-compatible serializable object.
	*/
	function stateMarshalForSave() {
		return stateMarshal(true);
	}

	/*
		Restores the story state from a marshaled save-compatible story state serialization object.
	*/
	function stateUnmarshalForSave(state) {
		return stateUnmarshal(state, true);
	}

	/*
		Returns the passage names of all expired moments.
	*/
	function stateExpired() {
		return expired;
	}

	/*
		Returns the total number of played moments (expired + in-play history moments).
	*/
	function stateTurns() {
		return expired.length + historyLength();
	}

	/*
		Returns the passage names of all played moments (expired + in-play history moments).
	*/
	function statePassages() {
		return expired.concat(momentHistory.slice(0, historyLength()).map(moment => moment.title));
	}

	/*
		Returns whether a passage with the given name has been played at least once (expired + in-play history moments).
	*/
	function stateHasPlayed(name) {
		if (name == null || name === '') { // nullish test
			return false;
		}

		if (expired.includes(name)) {
			return true;
		}
		else if (momentHistory.slice(0, historyLength()).some(moment => moment.title === name)) {
			return true;
		}

		return false;
	}


	/*******************************************************************************
		Moment Functions.
	*******************************************************************************/

	/*
		Returns a new moment object created from the given passage name and variables object.
	*/
	function momentCreate(name, variables) {
		return {
			title     : name == null ? '' : String(name),         // nullish test
			variables : variables == null ? {} : Config.history.maxStates > 1 ? clone(variables) : variables // nullish test
		};
	}

	/*
		Returns the active moment.
	*/
	function momentActive() {
		return activeMoment;
	}

	/*
		Returns the index within the history of the active moment.
	*/
	function momentActiveIndex() {
		return activeIndex;
	}

	/*
		Returns the passage name from the active moment.
	*/
	function momentActiveName() {
		return activeMoment.title;
	}

	/*
		Returns the variables object from the active moment.
	*/
	function momentActiveVariables() {
		return activeMoment.variables;
	}

	/*
		Returns the active moment after setting it to either the given moment object or
		moment history index.  Additionally, updates the active session and triggers a
		history update event.
	*/
	function momentActivate(moment) {
		if (moment == null) { // nullish test
			throw new TypeError('moment parameter must not be null or undefined');
		}

		// Set the active moment.
		switch (typeof moment) {
			case 'object':
				activeMoment = clone(moment);
				break;

			case 'number': {
				if (historyIsEmpty()) {
					throw new Error('moment activation attempted with empty history');
				}

				if (moment < 0 || moment >= historySize()) {
					throw new RangeError(`moment activation attempted with out-of-bounds index (range: 0–${historySize() - 1}; received: ${moment})`);
				}

				activeMoment = Config.history.maxStates > 1 ? clone(momentHistory[moment]) : momentHistory[moment];
				break;
			}

			default:
				throw new TypeError(`moment activation attempted with "${getTypeOf(moment)}"; must be a moment object or moment history index`);
		}

		// Restore the seedable PRNG.
		//
		// NOTE: We cannot simply set `prng.pull` to `activeMoment.pull` as that would
		// not properly mutate the PRNG's internal state.
		if (prng !== null) {
			prng = prngUnmarshal({
				seed : prng.seed,
				pull : activeMoment.pull
			});
		}

		// Update the active session.
		session.set('state', stateMarshal());

		// Trigger a global `:historyupdate` event.
		//
		// NOTE: We do this here because setting a new active moment is a core component
		// of, virtually, all history updates.
		triggerEvent(':historyupdate');

		return activeMoment;
	}


	/*******************************************************************************
		History Functions.
	*******************************************************************************/

	/*
		Returns the moment history.
	*/
	function historyGet() {
		return momentHistory;
	}

	/*
		Returns the number of history moments (past only).
	*/
	function historyLength() {
		return activeIndex + 1;
	}

	/*
		Returns the total number of history moments (past + future).
	*/
	function historySize() {
		return momentHistory.length;
	}

	/*
		Returns whether the moment history is empty.
	*/
	function historyIsEmpty() {
		return momentHistory.length === 0;
	}

	/*
		Returns the pre-play version of the active moment within the history or `null`,
		if the history is empty.
	*/
	function historyCurrent() {
		return momentHistory.length > 0 ? momentHistory[activeIndex] : null;
	}

	/*
		Returns the top-most (most recent) moment within the history or `null`, if the
		history is empty.
	*/
	function historyTop() {
		return momentHistory.length > 0 ? momentHistory[momentHistory.length - 1] : null;
	}

	/*
		Returns the bottom-most (least recent) moment within the history or `null`, if
		the history is empty.
	*/
	function historyBottom() {
		return momentHistory.length > 0 ? momentHistory[0] : null;
	}

	/*
		Returns the moment at the given index within the history or `null`, if the
		history is empty.
	*/
	function historyIndex(index) {
		if (!Number.isSafeInteger(index)) {
			throw new TypeError('index parameter must be an integer number');
		}
		else if (index < 0 || index > activeIndex) {
			throw new RangeError(`index parameter out-of-bounds (range: 0–${activeIndex}; received: ${index})`);
		}

		if (historyIsEmpty()) {
			return null;
		}

		return momentHistory[index];
	}

	/*
		Returns the moment at the given offset from the active moment within the history
		or `null`, if the history is empty.
	*/
	function historyPeek(offset) {
		const offsetValue = offset != null ? offset : 0; // nullish test

		if (!Number.isSafeInteger(offsetValue)) {
			throw new TypeError('offset parameter must be an integer number');
		}
		else if (offsetValue < 0 || offsetValue > activeIndex) {
			throw new RangeError(`offset parameter out-of-bounds (range: 0–${activeIndex}; received: ${offsetValue})`);
		}

		if (historyIsEmpty() || 1 + offsetValue > historyLength()) {
			return null;
		}

		return momentHistory[historyLength() - (1 + offsetValue)];
	}

	/*
		Returns whether a moment with the given name exists within the history.
	*/
	function historyHas(name) {
		if (historyIsEmpty() || name == null || name === '') { // nullish test
			return false;
		}

		for (let i = activeIndex; i >= 0; --i) {
			if (momentHistory[i].title === name) {
				return true;
			}
		}

		return false;
	}

	/*
		Creates a new moment and pushes it onto the history, discarding future moments if necessary.
	*/
	function historyCreate(name) {
		if (BUILD_DEBUG) { console.log(`[State/historyCreate(name: "${name}")]`); }

		// TODO: It might be good to have some assertions about the passage name here.

		// If we're not at the top of the stack, discard the future moments.
		if (historyLength() < historySize()) {
			if (BUILD_DEBUG) { console.log(`\tnon-top push; discarding ${historySize() - historyLength()} future moments`); }

			momentHistory.splice(historyLength(), historySize() - historyLength());
		}

		// Push the new moment onto the history stack.
		momentHistory.push(momentCreate(name, activeMoment.variables));

		if (prng) {
			historyTop().pull = prng.pull;
		}

		// Truncate the history, if necessary, by discarding moments from the bottom.
		while (historySize() > Config.history.maxStates) {
			expired.push(momentHistory.shift().title);
		}

		// Activate the new top moment.
		activeIndex = historySize() - 1;
		momentActivate(activeIndex);

		return historyLength();
	}

	/*
		Activate the moment at the given index within the history.
	*/
	function historyGoTo(index) {
		if (BUILD_DEBUG) { console.log(`[State/historyGoTo(index: ${index})]`); }

		if (
			index == null /* nullish test */
			|| index < 0
			|| index >= historySize()
			|| index === activeIndex
		) {
			return false;
		}

		activeIndex = index;
		momentActivate(activeIndex);

		return true;
	}

	/*
		Activate the moment at the given offset from the active moment within the history.
	*/
	function historyGo(offset) {
		if (BUILD_DEBUG) { console.log(`[State/historyGo(offset: ${offset})]`); }

		if (offset == null || offset === 0) { // nullish test
			return false;
		}

		return historyGoTo(activeIndex + offset);
	}

	/*
		Returns the delta encoded form of the given history array.
	*/
	function historyDeltaEncode(history) {
		if (!(history instanceof Array)) {
			return null;
		}

		if (history.length === 0) {
			return [];
		}

		// NOTE: The call to `clone()` here is likely unnecessary.
		// const delta = [clone(history[0])];
		const delta = [history[0]];

		for (let i = 1, length = history.length; i < length; ++i) {
			delta.push(Diff.diff(history[i - 1], history[i]));
		}

		return delta;
	}

	/*
		Returns a history array from the given delta encoded history array.
	*/
	function historyDeltaDecode(delta) {
		if (!(delta instanceof Array)) {
			return null;
		}

		if (delta.length === 0) {
			return [];
		}

		// NOTE: The call to `clone()` here is likely unnecessary.
		// const history = [clone(delta[0])];
		const history = [delta[0]];

		for (let i = 1, length = delta.length; i < length; ++i) {
			history.push(Diff.patch(history[i - 1], delta[i]));
		}

		return history;
	}


	/*******************************************************************************
		PRNG Functions.
	*******************************************************************************/

	/*
		Returns a new PRNG wrapper object.
	*/
	function prngCreate(seedBase, mixEntropy) {
		return new Math.seedrandom(seedBase, { // eslint-disable-line new-cap
			entropy : Boolean(mixEntropy),
			pass    : (prng, seed) => Object.create(null, {
				prng : {
					value : prng
				},
				seed : {
					writable : true,
					value    : seed
				},
				pull : {
					writable : true,
					value    : 0
				},
				random : {
					value() {
						++this.pull;
						return this.prng();
					}
				}
			})
		});
	}

	/*
		Initializes the PRNG for use.
	*/
	function prngInit(seedBase, mixEntropy) {
		if (BUILD_DEBUG) { console.log(`[State/prngInit(seedBase: ${seedBase}, mixEntropy: ${Boolean(mixEntropy)})]`); }

		if (!historyIsEmpty()) {
			let what;

			// for Twine 1
			if (BUILD_TWINE1) {
				what = 'a script-tagged passage';
			}
			// for Twine 2
			else {
				what = 'the story JavaScript section';
			}

			throw new Error(`State.prng.init must be called during initialization, within either ${what} or the StoryInit special passage`);
		}

		prng = prngCreate(seedBase, Boolean(mixEntropy));
		activeMoment.pull = prng.pull;
	}

	/*
		Restores the PRNG state from a marshaled PRNG state serialization object.
	*/
	function prngUnmarshal(state) {
		// Create a new PRNG using the original seed.
		const prng = prngCreate(state.seed);

		// Pull from the PRNG until it reaches the pull count of the original.
		for (let i = state.pull; i > 0; --i) {
			prng.random();
		}

		// Return the PRNG now that the original state has been fully duplicated.
		return prng;
	}

	/*
		Returns whether the PRNG is enabled.
	*/
	function prngIsEnabled() {
		return prng !== null;
	}

	/*
		Returns the current pull count of the PRNG or `NaN`, if the PRNG is not enabled.
	*/
	function prngPull() {
		return prng !== null ? prng.pull : NaN;
	}

	/*
		Returns the seed of the PRNG or `null`, if the PRNG is not enabled.
	*/
	function prngSeed() {
		return prng !== null ? prng.seed : null;
	}

	/*
		Returns a pseudo-random floating-point number from the PRNG or `Math.random()`,
		if the PRNG is not enabled.
	*/
	function prngRandom() {
		if (BUILD_DEBUG) { console.log('[State/prngRandom()]'); }

		return prng !== null ? prng.random() : Math.random();
	}


	/*******************************************************************************
		Temporary Variables Functions.
	*******************************************************************************/

	/*
		Clear the temporary variables.
	*/
	function tempVariablesClear() {
		if (BUILD_DEBUG) { console.log('[State/tempVariablesClear()]'); }

		temporary = Object.create(null);
	}

	/*
		Returns the current temporary variables.
	*/
	function tempVariables() {
		return temporary;
	}


	/*******************************************************************************
		Variable Chain Parsing Functions.
	*******************************************************************************/

	/*
		Returns the value of the given story/temporary variable.
	*/
	function variableGet(varExpression) {
		try {
			return Scripting.evalTwineScript(varExpression);
		}
		catch (ex) { /* no-op */ }
	}

	/*
		Sets the value of the given story/temporary variable.
	*/
	function variableSet(varExpression, value) {
		try {
			Scripting.evalTwineScript(`${varExpression} = SCRIPT$DATA$`, null, value);
			return true;
		}
		catch (ex) { /* no-op */ }

		return false;
	}


	/*******************************************************************************
		Story Metadata Functions.
	*******************************************************************************/

	const METADATA_STORE = 'metadata';

	function metadataClear() {
		storage.delete(METADATA_STORE);
	}

	function metadataDelete(key) {
		if (typeof key !== 'string') {
			throw new TypeError(`key parameter must be a string (received: ${getTypeOf(key)})`);
		}

		const store = storage.get(METADATA_STORE);

		if (store && Object.hasOwn(store, key)) {
			if (Object.keys(store).length === 1) {
				storage.delete(METADATA_STORE);
			}
			else {
				delete store[key];
				storage.set(METADATA_STORE, store);
			}
		}
	}

	function metadataEntries() {
		const store = storage.get(METADATA_STORE);
		return store && Object.entries(store);
	}

	function metadataGet(key) {
		if (typeof key !== 'string') {
			throw new TypeError(`State.metadata.get key parameter must be a string (received: ${typeof key})`);
		}

		const store = storage.get(METADATA_STORE);
		return store && Object.hasOwn(store, key) ? store[key] : undefined;
	}

	function metadataHas(key) {
		if (typeof key !== 'string') {
			throw new TypeError(`State.metadata.has key parameter must be a string (received: ${typeof key})`);
		}

		const store = storage.get(METADATA_STORE);
		return store && Object.hasOwn(store, key);
	}

	function metadataKeys() {
		const store = storage.get(METADATA_STORE);
		return store && Object.keys(store);
	}

	function metadataSet(key, value) {
		if (typeof key !== 'string') {
			throw new TypeError(`State.metadata.set key parameter must be a string (received: ${typeof key})`);
		}

		if (typeof value === 'undefined') {
			metadataDelete(key);
		}
		else {
			const store = storage.get(METADATA_STORE) || {};
			store[key] = value;
			storage.set(METADATA_STORE, store);
		}
	}

	function metadataSize() {
		const store = storage.get(METADATA_STORE);
		return store ? Object.keys(store).length : 0;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// State Functions.
		reset            : { value : stateReset },
		restore          : { value : stateRestore },
		marshalForSave   : { value : stateMarshalForSave },
		unmarshalForSave : { value : stateUnmarshalForSave },
		expired          : { get : stateExpired },
		turns            : { get : stateTurns },
		passages         : { get : statePassages },
		hasPlayed        : { value : stateHasPlayed },

		// Moment Functions.
		active      : { get : momentActive },
		activeIndex : { get : momentActiveIndex },
		passage     : { get : momentActiveName },
		variables   : { get : momentActiveVariables },

		// History Functions.
		history     : { get : historyGet },
		length      : { get : historyLength },
		size        : { get : historySize },
		isEmpty     : { value : historyIsEmpty },
		current     : { get : historyCurrent },
		top         : { get : historyTop },
		bottom      : { get : historyBottom },
		index       : { value : historyIndex },
		peek        : { value : historyPeek },
		has         : { value : historyHas },
		create      : { value : historyCreate },
		goTo        : { value : historyGoTo },
		go          : { value : historyGo },
		deltaEncode : { value : historyDeltaEncode },
		deltaDecode : { value : historyDeltaDecode },

		// PRNG Functions.
		prng : {
			value : Object.preventExtensions(Object.create(null, {
				init      : { value : prngInit },
				isEnabled : { value : prngIsEnabled },
				pull      : { get : prngPull },
				seed      : { get : prngSeed }
			}))
		},
		random : { value : prngRandom },

		// Temporary Variables Functions.
		clearTemporary : { value : tempVariablesClear },
		temporary      : { get : tempVariables },

		// Variable Chain Parsing Functions.
		getVar : { value : variableGet },
		setVar : { value : variableSet },

		// Story Metadata Functions.
		metadata : {
			value : Object.preventExtensions(Object.create(null, {
				clear   : { value : metadataClear },
				delete  : { value : metadataDelete },
				entries : { value : metadataEntries },
				get     : { value : metadataGet },
				has     : { value : metadataHas },
				keys    : { value : metadataKeys },
				set     : { value : metadataSet },
				size    : { get : metadataSize }
			}))
		}
	}));
})();
