/***********************************************************************************************************************

	setting.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global enumFrom, settings:true, storage */

var Setting = (() => { // eslint-disable-line no-unused-vars, no-var
	// Setting control types object.
	const Types = enumFrom({
		Header : 0,
		Toggle : 1,
		List   : 2,
		Range  : 3,
		Value  : 4
	});

	// Setting definition array.
	const _definitions = [];


	/*******************************************************************************
		Initialization Functions.
	*******************************************************************************/

	function init() {
		if (BUILD_DEBUG) { console.log('[Setting/init()]'); }

		// Load existing settings.
		load();

		// Execute `onInit` callbacks.
		_definitions.forEach(def => {
			if (Object.hasOwn(def, 'onInit')) {
				const data = createResultObject(def);
				def.onInit.call(data, data);
			}
		});
	}


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function updateSettingsObject(value) {
		window.SugarCube.settings = settings = value;
	}

	function createResultObject(def) {
		const result = {
			name    : def.name,
			value   : settings[def.name],
			default : def.default
		};

		if (Object.hasOwn(def, 'list')) {
			result.list = def.list;
		}
		if (Object.hasOwn(def, 'min')) {
			result.min = def.min;
		}
		if (Object.hasOwn(def, 'max')) {
			result.max = def.max;
		}
		if (Object.hasOwn(def, 'step')) {
			result.step = def.step;
		}

		return result;
	}


	/*******************************************************************************
		API Functions.
	*******************************************************************************/

	function clear() {
		updateSettingsObject(create());
		storage.delete('settings');
		return true;
	}

	function create() {
		return Object.create(null);
	}

	function load() {
		const defaultSettings = create();
		const loadedSettings  = storage.get('settings') || create();

		// Load the defaults.
		_definitions
			.filter(def => def.type !== Types.Header)
			.forEach(def => defaultSettings[def.name] = def.default);

		// Assign to the `settings` object while overwriting the defaults with the loaded settings.
		updateSettingsObject(Object.assign(defaultSettings, loadedSettings));
	}

	function reset(name) {
		if (arguments.length === 0) {
			clear();
			load();
		}
		else {
			if (name == null || !has(name)) { // lazy equality for null
				throw new Error(`nonexistent setting "${name}"`);
			}

			const def = get(name);

			if (def.type !== Types.Header) {
				settings[name] = def.default;
			}
		}

		return save();
	}

	function save() {
		const savedSettings = create();

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


	/*******************************************************************************
		Definitions Functions.
	*******************************************************************************/

	function add(type, name, def) {
		if (arguments.length < 2) {
			const errors = [];
			if (arguments.length < 1) { errors.push('type'); }
			if (arguments.length < 2) { errors.push('name'); }
			throw new Error(`missing parameters, no ${errors.join(' or ')} specified`);
		}

		if (def == null) { // lazy equality for null
			def = {}; // eslint-disable-line no-param-reassign
		}
		else if (typeof def !== 'object') {
			throw new TypeError('definition parameter must be an object');
		}

		if (has(name)) {
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
						  →  Value   → any
					(if undefined)
						  →  Toggle  → false
						  →  List    → list[0]
						  →  Range   → max
						  →  Value   → undefined
				list      →  List    → Array
				min       →  Range   → number
				max       →  Range   → number
				step      →  Range   → number
				onInit    →  (all)   → function
				onChange  →  (all)   → function
		*/
		const definition = {
			type,
			name
		};

		if (type !== Types.Value) {
			definition.label = typeof def.label === 'string' ? def.label.trim() : '';
		}

		if (typeof def.desc === 'string') {
			const desc = def.desc.trim();

			if (desc !== '') {
				definition.desc = desc;
			}
		}

		switch (type) {
			case Types.Header:
				break;

			case Types.List: {
				if (!Object.hasOwn(def, 'list')) {
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
			}

			case Types.Range: {
				if (!Object.hasOwn(def, 'min')) {
					throw new Error('no min specified');
				}
				else if (
					typeof def.min !== 'number'
					|| Number.isNaN(def.min)
					|| !Number.isFinite(def.min)
				) {
					throw new TypeError('min must be a finite number');
				}

				if (!Object.hasOwn(def, 'max')) {
					throw new Error('no max specified');
				}
				else if (
					typeof def.max !== 'number'
					|| Number.isNaN(def.max)
					|| !Number.isFinite(def.max)
				) {
					throw new TypeError('max must be a finite number');
				}

				if (!Object.hasOwn(def, 'step')) {
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
			}

			case Types.Toggle: {
				definition.default = Boolean(def.default);
				break;
			}

			case Types.Value: {
				definition.default = def.default;
				break;
			}

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

	function addHeader(name, desc) {
		add(Types.Header, name, { desc });
	}

	function addList(...args) {
		add(Types.List, ...args);
	}

	function addRange(...args) {
		add(Types.Range, ...args);
	}

	function addToggle(...args) {
		add(Types.Toggle, ...args);
	}

	function addValue(...args) {
		add(Types.Value, ...args);
	}

	function forEach(callback, thisArg) {
		_definitions.forEach(callback, thisArg);
	}

	function delete$(name) {
		for (let i = 0; i < _definitions.length; ++i) {
			if (_definitions[i].name === name) {
				_definitions.splice(i, 1);
				break;
			}
		}

		if (Object.hasOwn(settings, name)) {
			delete settings[name];
		}
	}

	function get(name) {
		return _definitions.find(definition => definition.name === name);
	}

	function has(name) {
		return _definitions.some(definition => definition.name === name);
	}

	function isEmpty() {
		return _definitions.length === 0;
	}


	/*******************************************************************************
		Values Functions.
	*******************************************************************************/

	function getValue(name) {
		return settings[name];
	}

	function setValue(name, value) {
		if (!has(name)) {
			throw new Error('no such setting');
		}

		settings[name] = value;

		// QUESTION: Should we do something here upon failure?
		save();

		const def = get(name);

		if (Object.hasOwn(def, 'onChange')) {
			const data = createResultObject(def);
			def.onChange.call(data, data);
		}

		return true;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Enumerations.
		Types : { value : Types },

		// Initialization Functions.
		init : { value : init },

		// Settings Functions.
		clear  : { value : clear },
		create : { value : create },
		load   : { value : load },
		reset  : { value : reset },
		save   : { value : save },

		// Definitions Functions.
		add       : { value : add },
		addHeader : { value : addHeader },
		addList   : { value : addList },
		addRange  : { value : addRange },
		addToggle : { value : addToggle },
		addValue  : { value : addValue },
		delete    : { value : delete$ },
		forEach   : { value : forEach },
		get       : { value : get },
		has       : { value : has },
		isEmpty   : { value : isEmpty },

		// Values Functions.
		getValue : { value : getValue },
		setValue : { value : setValue }
	}));
})();
