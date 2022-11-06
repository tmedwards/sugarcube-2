/***********************************************************************************************************************

	config.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Save, getTypeOf */

var Config = (() => { // eslint-disable-line no-unused-vars, no-var
	// General settings.
	let _debug                 = false;
	let _addVisitedLinkClass   = false;
	let _cleanupWikifierOutput = false;
	let _loadDelay             = 0;

	// Audio settings.
	let _audioPauseOnFadeToZero = true;
	let _audioPreloadMetadata   = true;

	// State history settings.
	let _historyControls  = true;
	let _historyMaxStates = 40;

	// Macros settings.
	let _macrosIfAssignmentError   = true;
	let _macrosMaxLoopIterations   = 1000;
	let _macrosTypeSkipKey         = '\x20'; // Space
	let _macrosTypeVisitedPassages = true;

	// Navigation settings.
	let _navigationOverride;

	// Passages settings.
	let _passagesDisplayTitles = false;
	let _passagesNobr          = false;
	let _passagesStart; // set by `Story.load()`
	let _passagesOnProcess;
	let _passagesTransitionOut;

	// Saves settings.
	let _savesAutoload; // QUESTION: Deprecate this?
	let _savesDescriptions;
	let _savesId; // NOTE: Initially set by `Story.load()`.
	let _savesIsAllowed;
	let _savesMaxAuto      = 0;
	let _savesMaxSlot      = 8;
	let _savesVersion;

	// UI settings.
	let _uiStowBarInitially    = 800;
	let _uiUpdateStoryElements = true;


	/*******************************************************************************
		Error Constants.
	*******************************************************************************/

	const _errHistoryModeDeprecated          = 'Config.history.mode has been deprecated and is no longer used by SugarCube, please remove it from your code';
	const _errHistoryTrackingDeprecated      = 'Config.history.tracking has been deprecated, use Config.history.maxStates instead';
	const _errPassagesDescriptionsDeprecated = 'Config.passages.descriptions has been deprecated, use Config.saves.descriptions instead';
	const _errSavesAutosaveDeprecated        = 'Config.saves.autosave has been deprecated, use Config.saves.isAllowed instead';
	const _errSavesOnLoadDeprecated          = 'Config.saves.onLoad has been deprecated, use the Save.onLoad API instead';
	const _errSavesOnSaveDeprecated          = 'Config.saves.onSave has been deprecated, use the Save.onSave API instead';
	const _errSavesSlotsDeprecated           = 'Config.saves.slots has been deprecated, use Config.saves.maxSlotSaves instead';
	const _errSavesTryDiskOnMobileDeprecated = 'Config.saves.tryDiskOnMobile has been deprecated';


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze({
		/*
			General settings.
		*/
		get debug() { return _debug; },
		set debug(value) { _debug = Boolean(value); },

		get addVisitedLinkClass() { return _addVisitedLinkClass; },
		set addVisitedLinkClass(value) { _addVisitedLinkClass = Boolean(value); },

		get cleanupWikifierOutput() { return _cleanupWikifierOutput; },
		set cleanupWikifierOutput(value) { _cleanupWikifierOutput = Boolean(value); },

		get loadDelay() { return _loadDelay; },
		set loadDelay(value) {
			if (!Number.isSafeInteger(value) || value < 0) {
				throw new RangeError('Config.loadDelay must be a non-negative integer');
			}

			_loadDelay = value;
		},

		/*
			Audio settings.
		*/
		audio : Object.freeze({
			get pauseOnFadeToZero() { return _audioPauseOnFadeToZero; },
			set pauseOnFadeToZero(value) { _audioPauseOnFadeToZero = Boolean(value); },

			get preloadMetadata() { return _audioPreloadMetadata; },
			set preloadMetadata(value) { _audioPreloadMetadata = Boolean(value); }
		}),

		/*
			State history settings.
		*/
		history : Object.freeze({
			// TODO: (v3) This should be under UI settings → `Config.ui.historyControls`.
			get controls() { return _historyControls; },
			set controls(value) {
				const controls = Boolean(value);

				if (_historyMaxStates === 1 && controls) {
					throw new Error('Config.history.controls must be false when Config.history.maxStates is 1');
				}

				_historyControls = controls;
			},

			get maxStates() { return _historyMaxStates; },
			set maxStates(value) {
				if (!Number.isSafeInteger(value) || value < 1) {
					throw new RangeError('Config.history.maxStates must be a positive integer');
				}

				_historyMaxStates = value;

				// Force `Config.history.controls` to `false`, when limited to `1` moment.
				if (_historyControls && value === 1) {
					_historyControls = false;
				}
			},

			// legacy
			// Die if deprecated state history settings are accessed.
			get mode()  { throw new Error(_errHistoryModeDeprecated); },
			set mode(_) { throw new Error(_errHistoryModeDeprecated); },
			get tracking()  { throw new Error(_errHistoryTrackingDeprecated); },
			set tracking(_) { throw new Error(_errHistoryTrackingDeprecated); }
			// /legacy
		}),

		/*
			Macros settings.
		*/
		macros : Object.freeze({
			get ifAssignmentError() { return _macrosIfAssignmentError; },
			set ifAssignmentError(value) { _macrosIfAssignmentError = Boolean(value); },

			get maxLoopIterations() { return _macrosMaxLoopIterations; },
			set maxLoopIterations(value) {
				if (!Number.isSafeInteger(value) || value < 1) {
					throw new RangeError('Config.macros.maxLoopIterations must be a positive integer');
				}

				_macrosMaxLoopIterations = value;
			},

			get typeSkipKey() { return _macrosTypeSkipKey; },
			set typeSkipKey(value) { _macrosTypeSkipKey = String(value); },

			get typeVisitedPassages() { return _macrosTypeVisitedPassages; },
			set typeVisitedPassages(value) { _macrosTypeVisitedPassages = Boolean(value); }
		}),

		/*
			Navigation settings.
		*/
		navigation : Object.freeze({
			get override() { return _navigationOverride; },
			set override(value) {
				if (!(value == null || value instanceof Function)) { // lazy equality for null
					throw new TypeError(`Config.navigation.override must be a function or null/undefined (received: ${getTypeOf(value)})`);
				}

				_navigationOverride = value;
			}
		}),

		/*
			Passages settings.
		*/
		passages : Object.freeze({
			// TODO: (v3) This should be under Navigation settings → `Config.navigation.updateTitle`.
			get displayTitles() { return _passagesDisplayTitles; },
			set displayTitles(value) { _passagesDisplayTitles = Boolean(value); },

			get nobr() { return _passagesNobr; },
			set nobr(value) { _passagesNobr = Boolean(value); },

			get onProcess() { return _passagesOnProcess; },
			set onProcess(value) {
				if (value != null) { // lazy equality for null
					const valueType = getTypeOf(value);

					if (valueType !== 'function') {
						throw new TypeError(`Config.passages.onProcess must be a function or null/undefined (received: ${valueType})`);
					}
				}

				_passagesOnProcess = value;
			},

			// TODO: (v3) This should be under Navigation settings → `Config.navigation.(start|startingPassage)`.
			get start() { return _passagesStart; },
			set start(value) {
				if (value != null) { // lazy equality for null
					const valueType = getTypeOf(value);

					if (valueType !== 'string') {
						throw new TypeError(`Config.passages.start must be a string or null/undefined (received: ${valueType})`);
					}
				}

				_passagesStart = value;
			},

			// TODO: (v3) This should be under Navigation settings → `Config.navigation.transitionOut`.
			get transitionOut() { return _passagesTransitionOut; },
			set transitionOut(value) {
				if (value != null) { // lazy equality for null
					const valueType = getTypeOf(value);

					if (
						valueType !== 'string'
						&& (valueType !== 'number' || !Number.isSafeInteger(value) || value < 0)
					) {
						throw new TypeError(`Config.passages.transitionOut must be a string, non-negative integer, or null/undefined (received: ${valueType})`);
					}
				}

				_passagesTransitionOut = value;
			},

			/* legacy */
			// Die if deprecated passages descriptions getter is accessed.
			get descriptions() { throw new Error(_errPassagesDescriptionsDeprecated); },
			// Warn if deprecated passages descriptions setter is assigned to,
			// then pass the value to the `Config.saves.descriptions` for
			// compatibilities sake.
			set descriptions(value) {
				console.warn(_errPassagesDescriptionsDeprecated);
				Config.saves.descriptions = value;
			}
			/* /legacy */
		}),

		/*
			Saves settings.
		*/
		saves : Object.freeze({
			get autoload() { return _savesAutoload; },
			set autoload(value) {
				if (value != null) { // lazy equality for null
					const valueType = getTypeOf(value);

					if (
						valueType !== 'boolean'
						&& (valueType !== 'string' || value !== 'prompt')
						&& valueType !== 'function'
					) {
						throw new TypeError(`Config.saves.autoload must be a boolean, string ('prompt'), function, or null/undefined (received: ${valueType})`);
					}
				}

				_savesAutoload = value;
			},

			get descriptions() { return _savesDescriptions; },
			set descriptions(value) {
				if (value != null) { // lazy equality for null
					const valueType = getTypeOf(value);

					if (valueType !== 'boolean' && valueType !== 'Object' && valueType !== 'function') {
						throw new TypeError(`Config.saves.descriptions must be a boolean, object, function, or null/undefined (received: ${valueType})`);
					}
				}

				_savesDescriptions = value;
			},

			get id() { return _savesId; },
			set id(value) {
				if (typeof value !== 'string' || value === '') {
					throw new TypeError(`Config.saves.id must be a non-empty string (received: ${getTypeOf(value)})`);
				}

				_savesId = value;
			},

			get isAllowed() { return _savesIsAllowed; },
			set isAllowed(value) {
				if (!(value == null || value instanceof Function)) { // lazy equality for null
					throw new TypeError(`Config.saves.isAllowed must be a function or null/undefined (received: ${getTypeOf(value)})`);
				}

				_savesIsAllowed = value;
			},

			get maxAutoSaves() { return _savesMaxAuto; },
			set maxAutoSaves(value) {
				if (!Number.isInteger(value)) {
					throw new TypeError('Config.saves.maxAutoSaves must be an integer');
				}
				else if (value < 0 || value > Save.MAX_IDX + 1) {
					throw new RangeError(`Config.saves.maxAutoSaves out of bounds (range: 0–${Save.MAX_IDX + 1}; received: ${value})`);
				}

				_savesMaxAuto = value;
			},

			get maxSlotSaves() { return _savesMaxSlot; },
			set maxSlotSaves(value) {
				if (!Number.isInteger(value)) {
					throw new TypeError('Config.saves.maxSlotSaves must be an integer');
				}
				else if (value < 0 || value > Save.MAX_IDX + 1) {
					throw new RangeError(`Config.saves.maxSlotSaves out of bounds (range: 0–${Save.MAX_IDX + 1}; received: ${value})`);
				}

				_savesMaxSlot = value;
			},

			get version() { return _savesVersion; },
			set version(value) { _savesVersion = value; },

			/* legacy */
			// Die if deprecated saves autosave getter is accessed.
			get autosave() { throw new Error(_errSavesAutosaveDeprecated); },
			// Die if deprecated saves autosave setter is accessed.
			set autosave(value) { throw new Error(_errSavesAutosaveDeprecated); },

			// Die if deprecated saves onLoad handler getter is accessed.
			get onLoad() { throw new Error(_errSavesOnLoadDeprecated); },
			// Warn if deprecated saves onLoad handler setter is assigned to, then
			// pass the handler to the `Save.onLoad` API for compatibilities sake.
			set onLoad(value) {
				console.warn(_errSavesOnLoadDeprecated);
				Save.onLoad.add(value);
			},

			// Die if deprecated saves onSave handler getter is accessed.
			get onSave() { throw new Error(_errSavesOnSaveDeprecated); },
			// Warn if deprecated saves onSave handler setter is assigned to, then
			// pass the handler to the `Save.onSave` API for compatibilities sake.
			set onSave(value) {
				console.warn(_errSavesOnSaveDeprecated);
				Save.onSave.add(value);
			},

			// Die if deprecated saves slots getter is accessed.
			get slots() { throw new Error(_errSavesSlotsDeprecated); },
			// Warn if deprecated saves slots setter is assigned to, then pass
			// the value to the `Config.saves.maxSlotSaves` for compatibilities
			// sake.
			set slots(value) {
				console.warn(_errSavesSlotsDeprecated);
				Config.saves.maxSlotSaves = value;
			},

			// Warn if deprecated saves tryDiskOnMobile getter is accessed, then
			// return `true`.
			get tryDiskOnMobile() {
				console.warn(_errSavesTryDiskOnMobileDeprecated);
				return true;
			},
			// Warn if deprecated saves tryDiskOnMobile setter is assigned to.
			set tryDiskOnMobile(value) { console.warn(_errSavesTryDiskOnMobileDeprecated); }
			/* /legacy */
		}),

		/*
			UI settings.
		*/
		ui : Object.freeze({
			get stowBarInitially() { return _uiStowBarInitially; },
			set stowBarInitially(value) {
				const valueType = getTypeOf(value);

				if (
					valueType !== 'boolean'
					&& (valueType !== 'number' || !Number.isSafeInteger(value) || value < 0)
				) {
					throw new TypeError(`Config.ui.stowBarInitially must be a boolean or non-negative integer (received: ${valueType})`);
				}

				_uiStowBarInitially = value;
			},

			get updateStoryElements() { return _uiUpdateStoryElements; },
			set updateStoryElements(value) { _uiUpdateStoryElements = Boolean(value); }
		})
	});
})();
