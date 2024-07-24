/***********************************************************************************************************************

	config.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Save, State, Story, getTypeOf */

var Config = (() => { // eslint-disable-line no-unused-vars, no-var
	// General settings.
	let _addVisitedLinkClass     = false;
	let _cleanupWikifierOutput   = false;
	let _debug                   = false;
	let _enableOptionalDebugging = false;
	let _loadDelay               = 0;

	// Audio settings.
	let _audioPauseOnFadeToZero = true;
	let _audioPreloadMetadata   = true;

	// State history settings.
	let _historyControls  = true;
	let _historyMaxStates = 40;

	// Macros settings.
	let _macrosMaxLoopIterations   = 1000;
	let _macrosTypeSkipKey         = '\x20'; // Space
	let _macrosTypeVisitedPassages = true;

	// Navigation settings.
	let _navigationOverride;

	// Passages settings.
	let _passagesDisplayTitles = false;
	let _passagesNobr          = false;
	let _passagesStart; // Set by `Story.init()`
	let _passagesOnProcess;
	let _passagesTransitionOut;

	// Saves settings.
	let _savesDescriptions;
	let _savesId; // NOTE: Initially set by `Story.init()`.
	let _savesIsAllowed;
	let _savesMaxAuto      = 0;
	let _savesMaxSlot      = 8;
	let _savesMetadata;
	let _savesVersion;
	/* legacy */
	let _savesAutoload; // [DEPRECATED]
	/* /legacy */

	// UI settings.
	let _uiStowBarInitially    = 800;
	let _uiUpdateStoryElements = true;


	/*******************************************************************************
		Error Constants.
	*******************************************************************************/

	const errMacrosIfAssignmentErrorDeprecated = '[DEPRECATED] Config.macros.ifAssignmentError has been deprecated, see Config.enableOptionalDebugging instead';
	const errPassagesDescriptionsDeprecated    = '[DEPRECATED] Config.passages.descriptions has been deprecated, see Config.saves.descriptions instead';
	const errSavesAutoloadDeprecated           = '[DEPRECATED] Config.saves.autoload has been deprecated, see the Save.browser.continue API instead';
	const _baseSavesAutosaveDeprecated         = '[DEPRECATED] Config.saves.autosave has been deprecated';
	const errSavesOnLoadDeprecated             = '[DEPRECATED] Config.saves.onLoad has been deprecated, see the Save.onLoad API instead';
	const errSavesOnSaveDeprecated             = '[DEPRECATED] Config.saves.onSave has been deprecated, see the Save.onSave API instead';
	const errSavesSlotsDeprecated              = '[DEPRECATED] Config.saves.slots has been deprecated, see Config.saves.maxSlotSaves instead';
	const errSavesTryDiskOnMobileDeprecated    = '[DEPRECATED] Config.saves.tryDiskOnMobile has been deprecated';


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze({
		/*
			General settings.
		*/
		get addVisitedLinkClass() { return _addVisitedLinkClass; },
		set addVisitedLinkClass(value) { _addVisitedLinkClass = Boolean(value); },

		get cleanupWikifierOutput() { return _cleanupWikifierOutput; },
		set cleanupWikifierOutput(value) { _cleanupWikifierOutput = Boolean(value); },

		get debug() { return _debug; },
		set debug(value) { _debug = Boolean(value); },

		get enableOptionalDebugging() { return _enableOptionalDebugging; },
		set enableOptionalDebugging(value) { _enableOptionalDebugging = Boolean(value); },

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
			}
		}),

		/*
			Macros settings.
		*/
		macros : Object.freeze({
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
			set typeVisitedPassages(value) { _macrosTypeVisitedPassages = Boolean(value); },

			/* legacy */
			// Die if the deprecated macros if assignment error getter is accessed.
			get ifAssignmentError() { throw new Error(errMacrosIfAssignmentErrorDeprecated); },
			// Warn if the deprecated macros if assignment error setter is assigned to,
			// while also setting `Config.enableOptionalDebugging` for compatibilities sake.
			set ifAssignmentError(value) {
				console.warn(errMacrosIfAssignmentErrorDeprecated);
				Config.enableOptionalDebugging = value;
			}
			/* /legacy */
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
			// Die if the deprecated passages descriptions getter is accessed.
			get descriptions() { throw new Error(errPassagesDescriptionsDeprecated); },
			// Warn if deprecated passages descriptions setter is assigned to,
			// then pass the value to the `Config.saves.descriptions` for
			// compatibilities sake.
			set descriptions(value) {
				console.warn(errPassagesDescriptionsDeprecated);

				switch (typeof value) {
					case 'boolean': {
						if (value && !Config.saves.descriptions) {
							Config.saves.descriptions = function () {
								return State.passage;
							};
						}

						break;
					}

					case 'function': {
						if (!Config.saves.descriptions) {
							Config.saves.descriptions = value;
						}

						break;
					}

					case 'undefined':
					case 'object': {
						if (value && !Config.saves.descriptions) {
							const dict = value;
							Config.saves.descriptions = function () {
								return Object.hasOwn(dict, State.passage) && dict[State.passage];
							};
						}

						break;
					}

					default:
						throw new TypeError(`Config.passages.descriptions must be a boolean, object, function, or null/undefined (received: ${getTypeOf(value)})`);
				}
			}
			/* /legacy */
		}),

		/*
			Saves settings.
		*/
		saves : Object.freeze({
			get descriptions() { return _savesDescriptions; },
			set descriptions(value) {
				if (!(value == null || value instanceof Function)) { // lazy equality for null
					throw new TypeError(`Config.saves.descriptions must be a function or null/undefined (received: ${getTypeOf(value)})`);
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
				else if (value < 0 || value > Save.MAX_INDEX + 1) {
					throw new RangeError(`Config.saves.maxAutoSaves out of bounds (range: 0–${Save.MAX_INDEX + 1}; received: ${value})`);
				}

				_savesMaxAuto = value;
			},

			get maxSlotSaves() { return _savesMaxSlot; },
			set maxSlotSaves(value) {
				if (!Number.isInteger(value)) {
					throw new TypeError('Config.saves.maxSlotSaves must be an integer');
				}
				else if (value < 0 || value > Save.MAX_INDEX + 1) {
					throw new RangeError(`Config.saves.maxSlotSaves out of bounds (range: 0–${Save.MAX_INDEX + 1}; received: ${value})`);
				}

				_savesMaxSlot = value;
			},

			get metadata() { return _savesMetadata; },
			set metadata(value) {
				if (!(value == null || value instanceof Function)) { // lazy equality for null
					throw new TypeError(`Config.saves.metadata must be a function or null/undefined (received: ${getTypeOf(value)})`);
				}

				_savesMetadata = value;
			},

			get version() { return _savesVersion; },
			set version(value) { _savesVersion = value; },

			/* legacy */
			get _internal_autoload_() { // eslint-disable-line camelcase
				return _savesAutoload;
			},
			// Warn if the deprecated autoload getter is accessed.
			get autoload() {
				console.warn(errSavesAutoloadDeprecated);
				return _savesAutoload;
			},
			// Warn if the deprecated autoload setter is assigned to.
			set autoload(value) {
				console.warn(errSavesAutoloadDeprecated);

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

			// Die if the deprecated saves autosave getter is accessed.
			get autosave() {
				throw new Error(`${_baseSavesAutosaveDeprecated}, see Config.saves.maxAutoSaves and Config.saves.isAllowed instead`);
			},
			// Die or warn if the deprecated saves autosave setter is assigned to,
			// while also setting `Config.saves.maxAutoSaves` and, possibly,
			// `Config.saves.isAllowed` for compatibilities sake.
			set autosave(value) {
				switch (typeof value) {
					case 'boolean':
						console.warn(`${_baseSavesAutosaveDeprecated}, for boolean usage see Config.saves.maxAutoSaves instead`);
						break;

					case 'function': {
						console.warn(`${_baseSavesAutosaveDeprecated}, for function usage see Config.saves.isAllowed instead`);

						if (!Config.saves.isAllowed) {
							const callback = value;
							Config.saves.isAllowed = function (saveType) {
								// Allow all other types while testing auto saves.
								return saveType !== Save.Type.Auto || callback(saveType);
							};
						}

						break;
					}

					default: {
						console.warn(`${_baseSavesAutosaveDeprecated}, for tag usage see Config.saves.isAllowed instead`);

						if (
							!(value instanceof Array)
							|| value.length === 0
							|| value.some(tag => typeof tag !== 'string')
						) {
							const valueType = getTypeOf(value);
							throw new TypeError(`Config.saves.autosave must be a boolean, Array<string>, function, or null/undefined (received: ${valueType}${valueType === 'Array' ? '<any>' : ''})`);
						}

						if (!Config.saves.isAllowed) {
							const userTags = value;
							Config.saves.isAllowed = function (saveType) {
								// Allow all other types while testing auto saves.
								return (
									saveType !== Save.Type.Auto
									|| userTags.includesAny(Story.get(State.passage).tags)
								);
							};
						}

						break;
					}
				}

				if (Config.saves.maxAutoSaves === 0) {
					Config.saves.maxAutoSaves = 1;
				}
			},

			// Die if the deprecated saves onLoad handler getter is accessed.
			get onLoad() { throw new Error(errSavesOnLoadDeprecated); },
			// Warn if the deprecated saves onLoad handler setter is assigned to, then
			// pass the handler to the `Save.onLoad` API for compatibilities sake.
			set onLoad(value) {
				console.warn(errSavesOnLoadDeprecated);
				Save.onLoad.add(value);
			},

			// Die if the deprecated saves onSave handler getter is accessed.
			get onSave() { throw new Error(errSavesOnSaveDeprecated); },
			// Warn if the deprecated saves onSave handler setter is assigned to, then
			// pass the handler to the `Save.onSave` API for compatibilities sake.
			set onSave(value) {
				console.warn(errSavesOnSaveDeprecated);
				Save.onSave.add(value);
			},

			// Die if the deprecated saves slots getter is accessed.
			get slots() { throw new Error(errSavesSlotsDeprecated); },
			// Warn if the deprecated saves slots setter is assigned to, then pass
			// the value to the `Config.saves.maxSlotSaves` for compatibilities
			// sake.
			set slots(value) {
				console.warn(errSavesSlotsDeprecated);
				Config.saves.maxSlotSaves = value;
			},

			// Warn if the deprecated saves tryDiskOnMobile getter is accessed, then
			// return `true`.
			get tryDiskOnMobile() {
				console.warn(errSavesTryDiskOnMobileDeprecated);
				return true;
			},
			// Warn if the deprecated saves tryDiskOnMobile setter is assigned to.
			set tryDiskOnMobile(value) { console.warn(errSavesTryDiskOnMobileDeprecated); }
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
