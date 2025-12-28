/***********************************************************************************************************************

	config.js

	Copyright © 2013–2025 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Save, State, Story, getTypeOf, warnDeprecated */

var Config = (() => { // eslint-disable-line no-unused-vars, no-var
	// General settings.
	let cfgAddVisitedLinkClass     = false;
	let cfgCleanupWikifierOutput   = false;
	let cfgDebug                   = false;
	let cfgEnableOptionalDebugging = false;
	let cfgLoadDelay               = 0;

	// Audio settings.
	let cfgAudioPauseOnFadeToZero = true;
	let cfgAudioPreloadMetadata   = true;

	// State history settings.
	let cfgHistoryControls      = true;
	let cfgHistoryDisableDeltas = false;
	let cfgHistoryMaxStates     = 40;

	// Macros settings.
	let cfgMacrosMaxLoopIterations   = 1000;
	let cfgMacrosTypeSkipKey         = '\x20'; // Space
	let cfgMacrosTypeVisitedPassages = true;

	// Navigation settings.
	let cfgNavigationOverride;

	// Passages settings.
	let cfgPassagesDisplayTitles = false;
	let cfgPassagesNobr          = false;
	let cfgPassagesStart; // NOTE: Initially set by `Story.init()`
	let cfgPassagesOnProcess;
	let cfgPassagesTransitionOut;

	// Saves settings.
	let cfgSavesDescriptions;
	let cfgSavesId; // NOTE: Initially set by `Story.init()`
	let cfgSavesIsAllowed;
	let cfgSavesEvalEnabled  = true;
	let cfgSavesMaxAuto      = 0;
	let cfgSavesMaxSlot      = 8;
	let cfgSavesMetadata;
	let cfgSavesVersion;
	/* [DEPRECATED] */
	let cfgSavesAutoload;
	/* [/DEPRECATED] */

	// UI settings.
	let cfgUiStowBarInitially    = 800;
	let cfgUiUpdateStoryElements = true;


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze({
		/*
			General settings.
		*/
		get addVisitedLinkClass() { return cfgAddVisitedLinkClass; },
		set addVisitedLinkClass(value) { cfgAddVisitedLinkClass = Boolean(value); },

		get cleanupWikifierOutput() { return cfgCleanupWikifierOutput; },
		set cleanupWikifierOutput(value) { cfgCleanupWikifierOutput = Boolean(value); },

		get debug() { return cfgDebug; },
		set debug(value) { cfgDebug = Boolean(value); },

		get enableOptionalDebugging() { return cfgEnableOptionalDebugging; },
		set enableOptionalDebugging(value) { cfgEnableOptionalDebugging = Boolean(value); },

		get loadDelay() { return cfgLoadDelay; },
		set loadDelay(value) {
			if (!Number.isSafeInteger(value) || value < 0) {
				throw new RangeError('Config.loadDelay must be a non-negative integer number');
			}

			cfgLoadDelay = value;
		},

		/*
			Audio settings.
		*/
		audio : Object.freeze({
			get pauseOnFadeToZero() { return cfgAudioPauseOnFadeToZero; },
			set pauseOnFadeToZero(value) { cfgAudioPauseOnFadeToZero = Boolean(value); },

			get preloadMetadata() { return cfgAudioPreloadMetadata; },
			set preloadMetadata(value) { cfgAudioPreloadMetadata = Boolean(value); }
		}),

		/*
			State history settings.
		*/
		history : Object.freeze({
			// TODO: (v3) This should be under UI settings → `Config.ui.historyControls`.
			get controls() { return cfgHistoryControls; },
			set controls(value) {
				const controls = Boolean(value);

				if (cfgHistoryMaxStates === 1 && controls) {
					throw new Error('Config.history.controls must be false when Config.history.maxStates is 1');
				}

				cfgHistoryControls = controls;
			},

			get disableDeltas() { return cfgHistoryDisableDeltas; },
			set disableDeltas(value) { cfgHistoryDisableDeltas = Boolean(value); },

			get maxStates() { return cfgHistoryMaxStates; },
			set maxStates(value) {
				if (!Number.isSafeInteger(value) || value < 1) {
					throw new RangeError('Config.history.maxStates must be a positive integer number');
				}

				cfgHistoryMaxStates = value;

				// Force `Config.history.controls` to `false`, when limited to `1` moment.
				if (cfgHistoryControls && value === 1) {
					cfgHistoryControls = false;
				}
			}
		}),

		/*
			Macros settings.
		*/
		macros : Object.freeze({
			get maxLoopIterations() { return cfgMacrosMaxLoopIterations; },
			set maxLoopIterations(value) {
				if (!Number.isSafeInteger(value) || value < 1) {
					throw new RangeError('Config.macros.maxLoopIterations must be a positive integer number');
				}

				cfgMacrosMaxLoopIterations = value;
			},

			get typeSkipKey() { return cfgMacrosTypeSkipKey; },
			set typeSkipKey(value) { cfgMacrosTypeSkipKey = String(value); },

			get typeVisitedPassages() { return cfgMacrosTypeVisitedPassages; },
			set typeVisitedPassages(value) { cfgMacrosTypeVisitedPassages = Boolean(value); }

			/* [DEPRECATED] */
			/* eslint-disable comma-style */
			// Die if the deprecated macros if assignment error getter is accessed.
			, get ifAssignmentError() {
				warnDeprecated(
					'Config.macros.ifAssignmentError',
					'Config.enableOptionalDebugging',
					true
				);
			}
			// Warn if the deprecated macros if assignment error setter is assigned to,
			// while also setting `Config.enableOptionalDebugging` for compatibilities sake.
			, set ifAssignmentError(value) {
				warnDeprecated(
					'Config.macros.ifAssignmentError',
					'Config.enableOptionalDebugging'
				);
				Config.enableOptionalDebugging = value;
			}
			/* eslint-enable comma-style */
			/* [/DEPRECATED] */
		}),

		/*
			Navigation settings.
		*/
		navigation : Object.freeze({
			get override() { return cfgNavigationOverride; },
			set override(value) {
				if (!(value == null || value instanceof Function)) { // nullish test
					throw new TypeError(`Config.navigation.override must be a function, null, or undefined (received: ${getTypeOf(value)})`);
				}

				cfgNavigationOverride = value;
			}
		}),

		/*
			Passages settings.
		*/
		passages : Object.freeze({
			// TODO: (v3) This should be under Navigation settings → `Config.navigation.updateTitle`.
			get displayTitles() { return cfgPassagesDisplayTitles; },
			set displayTitles(value) { cfgPassagesDisplayTitles = Boolean(value); },

			get nobr() { return cfgPassagesNobr; },
			set nobr(value) { cfgPassagesNobr = Boolean(value); },

			get onProcess() { return cfgPassagesOnProcess; },
			set onProcess(value) {
				if (value != null) { // nullish test
					const valueType = getTypeOf(value);

					if (valueType !== 'function') {
						throw new TypeError(`Config.passages.onProcess must be a function, null, or undefined (received: ${valueType})`);
					}
				}

				cfgPassagesOnProcess = value;
			},

			// TODO: (v3) This should be under Navigation settings → `Config.navigation.startPassageName`.
			get start() { return cfgPassagesStart; },
			set start(value) {
				if (value != null) { // nullish test
					const valueType = getTypeOf(value);

					if (valueType !== 'string') {
						throw new TypeError(`Config.passages.start must be a string, null, or undefined (received: ${valueType})`);
					}
				}

				cfgPassagesStart = value;
			},

			// TODO: (v3) This should be under Navigation settings → `Config.navigation.transitionOut`.
			get transitionOut() { return cfgPassagesTransitionOut; },
			set transitionOut(value) {
				if (value != null) { // nullish test
					const valueType = getTypeOf(value);

					if (
						valueType !== 'string'
						&& (valueType !== 'number' || !Number.isSafeInteger(value) || value < 0)
					) {
						throw new TypeError(`Config.passages.transitionOut must be a string, non-negative integer number, null, or undefined (received: ${valueType})`);
					}
				}

				cfgPassagesTransitionOut = value;
			}

			/* [DEPRECATED] */
			/* eslint-disable comma-style */
			// Die if the deprecated passages descriptions getter is accessed.
			, get descriptions() {
				warnDeprecated(
					'Config.passages.descriptions',
					'Config.saves.descriptions',
					true
				);
			}
			// Warn if deprecated passages descriptions setter is assigned to,
			// then pass the value to the `Config.saves.descriptions` for
			// compatibilities sake.
			, set descriptions(value) {
				warnDeprecated(
					'Config.passages.descriptions',
					'Config.saves.descriptions'
				);

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
						throw new TypeError(`Config.passages.descriptions must be a boolean, object, function, null, or undefined (received: ${getTypeOf(value)})`);
				}
			}
			/* eslint-enable comma-style */
			/* [/DEPRECATED] */
		}),

		/*
			Saves settings.
		*/
		saves : Object.freeze({
			get descriptions() { return cfgSavesDescriptions; },
			set descriptions(value) {
				if (!(value == null || value instanceof Function)) { // nullish test
					throw new TypeError(`Config.saves.descriptions must be a function, null, or undefined (received: ${getTypeOf(value)})`);
				}

				cfgSavesDescriptions = value;
			},

			get id() { return cfgSavesId; },
			set id(value) {
				if (typeof value !== 'string' || value === '') {
					throw new TypeError(`Config.saves.id must be a non-empty string (received: ${getTypeOf(value)})`);
				}

				cfgSavesId = value;
			},

			get isAllowed() { return cfgSavesIsAllowed; },
			set isAllowed(value) {
				if (!(value == null || value instanceof Function)) { // nullish test
					throw new TypeError(`Config.saves.isAllowed must be a function, null, or undefined (received: ${getTypeOf(value)})`);
				}

				cfgSavesIsAllowed = value;
			},

			get isEvalEnabled() { return cfgSavesEvalEnabled; },
			set isEvalEnabled(value) { 
				if (typeof value !== 'boolean') {
					throw new TypeError('Config.saves.isEvalEnabled must be a boolean');
				}
				cfgSavesEvalEnabled = value;
			},

			get maxAutoSaves() { return cfgSavesMaxAuto; },
			set maxAutoSaves(value) {
				if (!Number.isSafeInteger(value)) {
					throw new TypeError('Config.saves.maxAutoSaves must be an integer number');
				}
				else if (value < 0 || value > Save.MAX_INDEX + 1) {
					throw new RangeError(`Config.saves.maxAutoSaves out-of-bounds (range: 0–${Save.MAX_INDEX + 1}; received: ${value})`);
				}

				cfgSavesMaxAuto = value;
			},

			get maxSlotSaves() { return cfgSavesMaxSlot; },
			set maxSlotSaves(value) {
				if (!Number.isSafeInteger(value)) {
					throw new TypeError('Config.saves.maxSlotSaves must be an integer number');
				}
				else if (value < 0 || value > Save.MAX_INDEX + 1) {
					throw new RangeError(`Config.saves.maxSlotSaves out-of-bounds (range: 0–${Save.MAX_INDEX + 1}; received: ${value})`);
				}

				cfgSavesMaxSlot = value;
			},

			get metadata() { return cfgSavesMetadata; },
			set metadata(value) {
				if (!(value == null || value instanceof Function)) { // nullish test
					throw new TypeError(`Config.saves.metadata must be a function, null, or undefined (received: ${getTypeOf(value)})`);
				}

				cfgSavesMetadata = value;
			},

			get version() { return cfgSavesVersion; },
			set version(value) { cfgSavesVersion = value; }

			/* [DEPRECATED] */
			/* eslint-disable comma-style */
			// Internal only getter.
			, get _internal_autoload_() { // eslint-disable-line camelcase
				return cfgSavesAutoload;
			}
			// Warn if the deprecated autoload getter is accessed.
			, get autoload() {
				warnDeprecated(
					'Config.saves.autoload',
					'the Save.browser.continue API'
				);
				return cfgSavesAutoload;
			}
			// Warn if the deprecated autoload setter is assigned to.
			, set autoload(value) {
				warnDeprecated(
					'Config.saves.autoload',
					'the Save.browser.continue API'
				);

				if (value != null) { // nullish test
					const valueType = getTypeOf(value);

					if (
						valueType !== 'boolean'
						&& (valueType !== 'string' || value !== 'prompt')
						&& valueType !== 'function'
					) {
						throw new TypeError(`Config.saves.autoload must be a boolean, string ('prompt'), function, null, or undefined (received: ${valueType})`);
					}
				}

				cfgSavesAutoload = value;
			}

			// Die if the deprecated saves autosave getter is accessed.
			, get autosave() {
				warnDeprecated(
					'Config.saves.autosave',
					'Config.saves.maxAutoSaves and Config.saves.isAllowed',
					true
				);
			}
			// Die or warn if the deprecated saves autosave setter is assigned to,
			// while also setting `Config.saves.maxAutoSaves` and, possibly,
			// `Config.saves.isAllowed` for compatibilities sake.
			, set autosave(value) {
				switch (typeof value) {
					case 'boolean':
						warnDeprecated(
							'Config.saves.autosave',
							'Config.saves.maxAutoSaves'
						);
						break;

					case 'function': {
						warnDeprecated(
							'Config.saves.autosave',
							'Config.saves.isAllowed'
						);

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
						warnDeprecated(
							'Config.saves.autosave',
							'Config.saves.isAllowed'
						);

						if (
							!(value instanceof Array)
							|| value.length === 0
							|| value.some(tag => typeof tag !== 'string')
						) {
							const valueType = getTypeOf(value);
							throw new TypeError(`Config.saves.autosave must be a boolean, Array<string>, function, null, or undefined (received: ${valueType}${valueType === 'Array' ? '<any>' : ''})`);
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
			}

			// Die if the deprecated saves onLoad handler getter is accessed.
			, get onLoad() {
				warnDeprecated(
					'Config.saves.onLoad',
					'the Save.onLoad API',
					true
				);
			}
			// Warn if the deprecated saves onLoad handler setter is assigned to, then
			// pass the handler to the `Save.onLoad` API for compatibilities sake.
			, set onLoad(value) {
				warnDeprecated(
					'Config.saves.onLoad',
					'the Save.onLoad API'
				);
				Save.onLoad.add(value);
			}

			// Die if the deprecated saves onSave handler getter is accessed.
			, get onSave() {
				warnDeprecated(
					'Config.saves.onSave',
					'the Save.onSave API',
					true
				);
			}
			// Warn if the deprecated saves onSave handler setter is assigned to, then
			// pass the handler to the `Save.onSave` API for compatibilities sake.
			, set onSave(value) {
				warnDeprecated(
					'Config.saves.onSave',
					'the Save.onSave API'
				);
				Save.onSave.add(value);
			}

			// Die if the deprecated saves slots getter is accessed.
			, get slots() {
				warnDeprecated(
					'Config.saves.slots',
					'Config.saves.maxSlotSaves',
					true
				);
			}
			// Warn if the deprecated saves slots setter is assigned to, then pass
			// the value to the `Config.saves.maxSlotSaves` for compatibilities
			// sake.
			, set slots(value) {
				warnDeprecated(
					'Config.saves.slots',
					'Config.saves.maxSlotSaves'
				);
				Config.saves.maxSlotSaves = value;
			}

			// Warn if the deprecated saves tryDiskOnMobile getter is accessed, then
			// return `true`.
			, get tryDiskOnMobile() {
				warnDeprecated(
					'Config.saves.tryDiskOnMobile'
				);
				return true;
			}
			// Warn if the deprecated saves tryDiskOnMobile setter is assigned to.
			, set tryDiskOnMobile(value) {
				warnDeprecated(
					'Config.saves.tryDiskOnMobile'
				);
			}
			/* eslint-enable comma-style */
			/* [/DEPRECATED] */
		}),

		/*
			UI settings.
		*/
		ui : Object.freeze({
			get stowBarInitially() { return cfgUiStowBarInitially; },
			set stowBarInitially(value) {
				const valueType = getTypeOf(value);

				if (
					valueType !== 'boolean'
					&& (valueType !== 'number' || !Number.isSafeInteger(value) || value < 0)
				) {
					throw new TypeError(`Config.ui.stowBarInitially must be a boolean or non-negative integer number (received: ${valueType})`);
				}

				cfgUiStowBarInitially = value;
			},

			get updateStoryElements() { return cfgUiUpdateStoryElements; },
			set updateStoryElements(value) { cfgUiUpdateStoryElements = Boolean(value); }
		})
	});
})();
