/***********************************************************************************************************************

	setting.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Util, settings:true, storage */

var Setting = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Setting control types object (pseudo-enumeration).
	const Types = Util.toEnum({
		Header : 0,
		Toggle : 1,
		List   : 2,
		Range  : 3
	});

	// Setting definition array.
	const _definitions = [];


	/*******************************************************************************************************************
		Settings Functions.
	*******************************************************************************************************************/
	function settingsInit() {
		if (DEBUG) { console.log('[Setting/settingsInit()]'); }

		/* legacy */
		// Attempt to migrate an existing `options` store to `settings`.
		if (storage.has('options')) {
			const old = storage.get('options');

			if (old !== null) {
				window.SugarCube.settings = settings = Object.assign(settingsCreate(), old);
			}

			settingsSave();
			storage.delete('options');
		}
		/* /legacy */

		// Load existing settings.
		settingsLoad();

		// Execute `onInit` callbacks.
		_definitions.forEach(def => {
			if (def.hasOwnProperty('onInit')) {
				const thisArg = {
					name    : def.name,
					value   : settings[def.name],
					default : def.default
				};

				if (def.hasOwnProperty('list')) {
					thisArg.list = def.list;
				}

				def.onInit.call(thisArg);
			}
		});
	}

	function settingsCreate() {
		return Object.create(null);
	}

	function settingsSave() {
		const savedSettings = settingsCreate();

		if (Object.keys(settings).length > 0) {
			_definitions
				.filter(def => def.type !== Types.Header && settings[def.name] !== def.default)
				.forEach(def => savedSettings[def.name] = settings[def.name]);
		}

		if (Object.keys(savedSettings).length === 0) {
			storage.delete('settings');
			return true;
		}

		return storage.set('settings', savedSettings);
	}

	function settingsLoad() {
		const defaultSettings = settingsCreate();
		const loadedSettings  = storage.get('settings') || settingsCreate();

		// Load the defaults.
		_definitions
			.filter(def => def.type !== Types.Header)
			.forEach(def => defaultSettings[def.name] = def.default);

		// Assign to the `settings` object while overwriting the defaults with the loaded settings.
		window.SugarCube.settings = settings = Object.assign(defaultSettings, loadedSettings);
	}

	function settingsClear() {
		window.SugarCube.settings = settings = settingsCreate();
		storage.delete('settings');
		return true;
	}

	function settingsReset(name) {
		if (arguments.length === 0) {
			settingsClear();
			settingsLoad();
		}
		else {
			if (name == null || !definitionsHas(name)) { // lazy equality for null
				throw new Error(`nonexistent setting "${name}"`);
			}

			const def = definitionsGet(name);

			if (def.type !== Types.Header) {
				settings[name] = def.default;
			}
		}

		return settingsSave();
	}


	/*******************************************************************************************************************
		Definitions Functions.
	*******************************************************************************************************************/
	function definitionsForEach(callback, thisArg) {
		_definitions.forEach(callback, thisArg);
	}

	function definitionsAdd(type, name, def) {
		if (arguments.length < 3) {
			const errors = [];
			if (arguments.length < 1) { errors.push('type'); }
			if (arguments.length < 2) { errors.push('name'); }
			if (arguments.length < 3) { errors.push('definition'); }
			throw new Error(`missing parameters, no ${errors.join(' or ')} specified`);
		}

		if (typeof def !== 'object') {
			throw new TypeError('definition parameter must be an object');
		}

		if (definitionsHas(name)) {
			throw new Error(`cannot clobber existing setting "${name}"`);
		}

		/*
			Definition object properties and types:
				type      →  (all)   → Setting.Types
				name      →  (all)   → string
				label     →  (all)   → string
				desc      →  (all)   → string
				default
					(if defined)
 						  →  Toggle  → boolean
						  →  List    → Array
						  →  Range   → number
					(if undefined)
						  →  Toggle  → false
						  →  List    → list[0]
						  →  Range   → max
				list      →  List    → Array
				min       →  Range   → number
				max       →  Range   → number
				step      →  Range   → number
				onInit    →  (all)   → function
				onChange  →  (all)   → function
		*/
		const definition = {
			type,
			name,
			label : typeof def.label === 'string' ? def.label.trim() : ''
		};

		if (typeof def.desc === 'string') {
			const desc = def.desc.trim();

			if (desc !== '') {
				definition.desc = desc;
			}
		}

		switch (type) {
		case Types.Header:
			break;

		case Types.Toggle:
			definition.default = !!def.default;
			break;

		case Types.List:
			if (!def.hasOwnProperty('list')) {
				throw new Error('no list specified');
			}
			else if (!Array.isArray(def.list)) {
				throw new TypeError('list must be an array');
			}
			else if (def.list.length === 0) {
				throw new Error('list must not be empty');
			}

			definition.list = Object.freeze(def.list);

			if (def.default == null) { // lazy equality for null
				definition.default = def.list[0];
			}
			else {
				const defaultIndex = def.list.indexOf(def.default);

				if (defaultIndex === -1) {
					throw new Error('list does not contain default');
				}

				definition.default = def.list[defaultIndex];
			}
			break;

		case Types.Range:
			if (!def.hasOwnProperty('min')) {
				throw new Error('no min specified');
			}
			else if (
				   typeof def.min !== 'number'
				|| Number.isNaN(def.min)
				|| !Number.isFinite(def.min)
			) {
				throw new TypeError('min must be a finite number');
			}

			if (!def.hasOwnProperty('max')) {
				throw new Error('no max specified');
			}
			else if (
				   typeof def.max !== 'number'
				|| Number.isNaN(def.max)
				|| !Number.isFinite(def.max)
			) {
				throw new TypeError('max must be a finite number');
			}

			if (!def.hasOwnProperty('step')) {
				throw new Error('no step specified');
			}
			else if (
				   typeof def.step !== 'number'
				|| Number.isNaN(def.step)
				|| !Number.isFinite(def.step)
				|| def.step <= 0
			) {
				throw new TypeError('step must be a finite number greater than zero');
			}
			else {
				// Determine how many fractional digits we need to be concerned with based on the step value.
				const fracDigits = (() => {
					const str = String(def.step);
					const pos = str.lastIndexOf('.');
					return pos === -1 ? 0 : str.length - pos - 1;
				})();

				// Set up a function to validate a given value against the step value.
				function stepValidate(value) {
					if (fracDigits > 0) {
						const ma = Number(`${def.min}e${fracDigits}`);
						const sa = Number(`${def.step}e${fracDigits}`);
						const va = Number(`${value}e${fracDigits}`) - ma;
						return Number(`${va - va % sa + ma}e-${fracDigits}`);
					}

					const va = value - def.min;
					return va - va % def.step + def.min;
				}

				// Sanity check the max value against the step value.
				if (stepValidate(def.max) !== def.max) {
					throw new RangeError(`max (${def.max}) is not a multiple of the step (${def.step}) plus the min (${def.min})`);
				}
			}

			definition.max = def.max;
			definition.min = def.min;
			definition.step = def.step;

			if (def.default == null) { // lazy equality for null
				definition.default = def.max;
			}
			else {
				if (
					   typeof def.default !== 'number'
					|| Number.isNaN(def.default)
					|| !Number.isFinite(def.default)
				) {
					throw new TypeError('default must be a finite number');
				}
				else if (def.default < def.min) {
					throw new RangeError(`default (${def.default}) is less than min (${def.min})`);
				}
				else if (def.default > def.max) {
					throw new RangeError(`default (${def.default}) is greater than max (${def.max})`);
				}

				definition.default = def.default;
			}
			break;

		default:
			throw new Error(`unknown Setting type: ${type}`);
		}

		if (typeof def.onInit === 'function') {
			definition.onInit = Object.freeze(def.onInit);
		}

		if (typeof def.onChange === 'function') {
			definition.onChange = Object.freeze(def.onChange);
		}

		_definitions.push(Object.freeze(definition));
	}

	function definitionsAddHeader(name, desc) {
		definitionsAdd(Types.Header, name, { desc });
	}

	function definitionsAddToggle(...args) {
		definitionsAdd(Types.Toggle, ...args);
	}

	function definitionsAddList(...args) {
		definitionsAdd(Types.List, ...args);
	}

	function definitionsAddRange(...args) {
		definitionsAdd(Types.Range, ...args);
	}

	function definitionsIsEmpty() {
		return _definitions.length === 0;
	}

	function definitionsHas(name) {
		return _definitions.some(definition => definition.name === name);
	}

	function definitionsGet(name) {
		return _definitions.find(definition => definition.name === name);
	}

	function definitionsDelete(name) {
		if (definitionsHas(name)) {
			delete settings[name];
		}

		for (let i = 0; i < _definitions.length; ++i) {
			if (_definitions[i].name === name) {
				_definitions.splice(i, 1);
				definitionsDelete(name);
				break;
			}
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		/*
			Enumerations.
		*/
		Types : { value : Types },

		/*
			Settings Functions.
		*/
		init   : { value : settingsInit },
		create : { value : settingsCreate },
		save   : { value : settingsSave },
		load   : { value : settingsLoad },
		clear  : { value : settingsClear },
		reset  : { value : settingsReset },

		/*
			Definitions Functions.
		*/
		forEach   : { value : definitionsForEach },
		add       : { value : definitionsAdd },
		addHeader : { value : definitionsAddHeader },
		addToggle : { value : definitionsAddToggle },
		addList   : { value : definitionsAddList },
		addRange  : { value : definitionsAddRange },
		isEmpty   : { value : definitionsIsEmpty },
		has       : { value : definitionsHas },
		get       : { value : definitionsGet },
		delete    : { value : definitionsDelete }
	}));
})();
