/***********************************************************************************************************************

	save.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Dialog, Engine, L10n, State, Story, UI, Util, storage */

var Save = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Save operation type pseudo-enumeration.
	const Type = Util.toEnum({
		Autosave  : 'autosave',
		Disk      : 'disk',
		Serialize : 'serialize',
		Slot      : 'slot'
	});

	// The upper bound of the saves slots.
	let _slotsUBound = -1;


	/*******************************************************************************************************************
		Saves Functions.
	*******************************************************************************************************************/
	function savesInit() {
		if (DEBUG) { console.log('[Save/savesInit()]'); }

		// Disable save slots and the autosave when Web Storage is unavailable.
		if (storage.name === 'cookie') {
			savesObjClear();
			Config.saves.autoload = undefined;
			Config.saves.autosave = undefined;
			Config.saves.slots = 0;
			return false;
		}

		let saves   = savesObjGet();
		let updated = false;

		/* legacy */
		// Convert an ancient saves array into a new saves object.
		if (Array.isArray(saves)) {
			saves = {
				autosave : null,
				slots    : saves
			};
			updated = true;
		}
		/* /legacy */

		// Handle the author changing the number of save slots.
		if (Config.saves.slots !== saves.slots.length) {
			if (Config.saves.slots < saves.slots.length) {
				// Attempt to decrease the number of slots; this will only compact
				// the slots array, by removing empty slots, no saves will be deleted.
				saves.slots.reverse();

				saves.slots = saves.slots.filter(function (val) {
					if (val === null && this.count > 0) {
						--this.count;
						return false;
					}

					return true;
				}, { count : saves.slots.length - Config.saves.slots });

				saves.slots.reverse();
			}
			else if (Config.saves.slots > saves.slots.length) {
				// Attempt to increase the number of slots.
				_appendSlots(saves.slots, Config.saves.slots - saves.slots.length);
			}

			updated = true;
		}

		/* legacy */
		// Update saves with old/obsolete properties.
		if (_savesObjUpdate(saves.autosave)) {
			updated = true;
		}

		for (let i = 0; i < saves.slots.length; ++i) {
			if (_savesObjUpdate(saves.slots[i])) {
				updated = true;
			}
		}

		// Remove save stores which are empty.
		if (_savesObjIsEmpty(saves)) {
			storage.delete('saves');
			updated = false;
		}
		/* /legacy */

		// If the saves object was updated, then update the store.
		if (updated) {
			_savesObjSave(saves);
		}

		_slotsUBound = saves.slots.length - 1;

		return true;
	}

	function savesObjCreate() {
		return {
			autosave : null,
			slots    : _appendSlots([], Config.saves.slots)
		};
	}

	function savesObjGet() {
		const saves = storage.get('saves');
		return saves === null ? savesObjCreate() : saves;
	}

	function savesObjClear() {
		storage.delete('saves');
		return true;
	}

	function savesOk() {
		return autosaveOk() || slotsOk();
	}


	/*******************************************************************************************************************
		Autosave Functions.
	*******************************************************************************************************************/
	function autosaveOk() {
		return storage.name !== 'cookie' && typeof Config.saves.autosave !== 'undefined';
	}

	function autosaveHas() {
		const saves = savesObjGet();

		if (saves.autosave === null) {
			return false;
		}

		return true;
	}

	function autosaveGet() {
		const saves = savesObjGet();
		return saves.autosave;
	}

	function autosaveLoad() {
		const saves = savesObjGet();

		if (saves.autosave === null) {
			return false;
		}

		return _unmarshal(saves.autosave);
	}

	function autosaveSave(title, metadata) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			return false;
		}

		const saves        = savesObjGet();
		const supplemental = {
			title : title || Story.get(State.passage).description(),
			date  : Date.now()
		};

		if (metadata != null) { // lazy equality for null
			supplemental.metadata = metadata;
		}

		saves.autosave = _marshal(supplemental, { type : Type.Autosave });

		return _savesObjSave(saves);
	}

	function autosaveDelete() {
		const saves = savesObjGet();
		saves.autosave = null;
		return _savesObjSave(saves);
	}


	/*******************************************************************************************************************
		Slots Functions.
	*******************************************************************************************************************/
	function slotsOk() {
		return storage.name !== 'cookie' && _slotsUBound !== -1;
	}

	function slotsLength() {
		return _slotsUBound + 1;
	}

	function slotsCount() {
		if (!slotsOk()) {
			return 0;
		}

		const saves = savesObjGet();
		let count = 0;

		for (let i = 0, iend = saves.slots.length; i < iend; ++i) {
			if (saves.slots[i] !== null) {
				++count;
			}
		}
		return count;
	}

	function slotsIsEmpty() {
		return slotsCount() === 0;
	}

	function slotsHas(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length || saves.slots[slot] === null) {
			return false;
		}

		return true;
	}

	function slotsGet(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return null;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length) {
			return null;
		}

		return saves.slots[slot];
	}

	function slotsLoad(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length || saves.slots[slot] === null) {
			return false;
		}

		return _unmarshal(saves.slots[slot]);
	}

	function slotsSave(slot, title, metadata) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => UI.alert(L10n.get('savesDisallowed')));
			}
			else {
				UI.alert(L10n.get('savesDisallowed'));
			}

			return false;
		}

		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length) {
			return false;
		}

		const supplemental = {
			title : title || Story.get(State.passage).description(),
			date  : Date.now()
		};

		if (metadata != null) { // lazy equality for null
			supplemental.metadata = metadata;
		}

		saves.slots[slot] = _marshal(supplemental, { type : Type.Slot });

		return _savesObjSave(saves);
	}

	function slotsDelete(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length) {
			return false;
		}

		saves.slots[slot] = null;
		return _savesObjSave(saves);
	}


	/*******************************************************************************************************************
		Disk Import/Export Functions.
	*******************************************************************************************************************/
	function exportToDisk(filename, metadata) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => UI.alert(L10n.get('savesDisallowed')));
			}
			else {
				UI.alert(L10n.get('savesDisallowed'));
			}

			return;
		}

		function datestamp() {
			const now = new Date();
			let MM = now.getMonth() + 1;
			let DD = now.getDate();
			let hh = now.getHours();
			let mm = now.getMinutes();
			let ss = now.getSeconds();

			if (MM < 10) { MM = `0${MM}`; }
			if (DD < 10) { DD = `0${DD}`; }
			if (hh < 10) { hh = `0${hh}`; }
			if (mm < 10) { mm = `0${mm}`; }
			if (ss < 10) { ss = `0${ss}`; }

			return `${now.getFullYear()}${MM}${DD}-${hh}${mm}${ss}`;
		}

		function legalizeName(str) {
			/*
				NOTE: The range of illegal characters consists of: C0 controls, double quote,
				number, dollar, percent, ampersand, single quote, asterisk, plus, comma,
				forward slash, colon, semi-colon, less-than, equals, greater-than, question,
				backslash, caret, backquote/grave, pipe/vertical-bar, delete, C1 controls.
			*/
			return String(str).trim()
				.replace(/[\x00-\x1f"#$%&'*+,/:;<=>?\\^`|\x7f-\x9f]+/g, '') // eslint-disable-line no-control-regex
				.replace(/[_\s\u2013\u2014-]+/g, '-'); // legacy
		}

		const baseName     = filename == null ? Story.domId : legalizeName(filename); // lazy equality for null
		const saveName     = `${baseName}-${datestamp()}.save`;
		const supplemental = metadata == null ? {} : { metadata }; // lazy equality for null
		const saveObj      = LZString.compressToBase64(JSON.stringify(_marshal(supplemental, { type : Type.Disk })));
		saveAs(new Blob([saveObj], { type : 'text/plain;charset=UTF-8' }), saveName);
	}

	function importFromDisk(event) {
		const file   = event.target.files[0];
		const reader = new FileReader();

		// Add the handler that will capture the file information once the load is finished.
		jQuery(reader).on('load', ev => {
			const target = ev.currentTarget;

			if (!target.result) {
				return;
			}

			let saveObj;

			try {
				saveObj = JSON.parse(
					/* legacy */ /\.json$/i.test(file.name) || /^\{/.test(target.result)
						? target.result
						: /* /legacy */ LZString.decompressFromBase64(target.result)
				);
			}
			catch (ex) { /* no-op; `_unmarshal()` will handle the error */ }

			_unmarshal(saveObj);
		});

		// Initiate the file load.
		reader.readAsText(file);
	}


	/*******************************************************************************************************************
		Serialization Functions.
	*******************************************************************************************************************/
	function serialize(metadata) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => UI.alert(L10n.get('savesDisallowed')));
			}
			else {
				UI.alert(L10n.get('savesDisallowed'));
			}

			return null;
		}

		const supplemental = metadata == null ? {} : { metadata }; // lazy equality for null
		return LZString.compressToBase64(JSON.stringify(_marshal(supplemental, { type : Type.Serialize })));
	}

	function deserialize(base64Str) {
		/*
			NOTE: We purposefully do not attempt to catch parameter shenanigans
			here, instead relying on `_unmarshal()` to do the heavy lifting.
		*/

		let saveObj;

		try {
			saveObj = JSON.parse(LZString.decompressFromBase64(base64Str));
		}
		catch (ex) { /* no-op; `_unmarshal()` will handle the error */ }

		if (!_unmarshal(saveObj)) {
			return null;
		}

		return saveObj.metadata;
	}


	/*******************************************************************************************************************
		Utility Functions.
	*******************************************************************************************************************/
	function _appendSlots(array, num) {
		for (let i = 0; i < num; ++i) {
			array.push(null);
		}

		return array;
	}

	function _savesObjIsEmpty(saves) {
		const slots = saves.slots;
		let isSlotsEmpty = true;

		for (let i = 0, iend = slots.length; i < iend; ++i) {
			if (slots[i] !== null) {
				isSlotsEmpty = false;
				break;
			}
		}

		return saves.autosave === null && isSlotsEmpty;
	}

	function _savesObjSave(saves) {
		if (_savesObjIsEmpty(saves)) {
			storage.delete('saves');
			return true;
		}

		return storage.set('saves', saves);
	}

	function _savesObjUpdate(saveObj) {
		if (saveObj == null || typeof saveObj !== 'object') { // lazy equality for null
			return false;
		}

		let updated = false;

		/* eslint-disable no-param-reassign */
		if (
			   !saveObj.hasOwnProperty('state')
			|| !saveObj.state.hasOwnProperty('delta')
			|| !saveObj.state.hasOwnProperty('index')
		) {
			if (saveObj.hasOwnProperty('data')) {
				delete saveObj.mode;
				saveObj.state = {
					delta : State.deltaEncode(saveObj.data)
				};
				delete saveObj.data;
			}
			else if (!saveObj.state.hasOwnProperty('delta')) {
				delete saveObj.state.mode;
				saveObj.state.delta = State.deltaEncode(saveObj.state.history);
				delete saveObj.state.history;
			}
			else if (!saveObj.state.hasOwnProperty('index')) {
				delete saveObj.state.mode;
			}

			saveObj.state.index = saveObj.state.delta.length - 1;
			updated = true;
		}

		if (saveObj.state.hasOwnProperty('rseed')) {
			saveObj.state.seed = saveObj.state.rseed;
			delete saveObj.state.rseed;

			saveObj.state.delta.forEach((_, i, delta) => {
				if (delta[i].hasOwnProperty('rcount')) {
					delta[i].pull = delta[i].rcount;
					delete delta[i].rcount;
				}
			});

			updated = true;
		}

		if (
			   saveObj.state.hasOwnProperty('expired') && typeof saveObj.state.expired === 'number'
			||  saveObj.state.hasOwnProperty('unique')
			||  saveObj.state.hasOwnProperty('last')
		) {
			if (saveObj.state.hasOwnProperty('expired') && typeof saveObj.state.expired === 'number') {
				delete saveObj.state.expired;
			}

			if (saveObj.state.hasOwnProperty('unique') || saveObj.state.hasOwnProperty('last')) {
				saveObj.state.expired = [];

				if (saveObj.state.hasOwnProperty('unique')) {
					saveObj.state.expired.push(saveObj.state.unique);
					delete saveObj.state.unique;
				}

				if (saveObj.state.hasOwnProperty('last')) {
					saveObj.state.expired.push(saveObj.state.last);
					delete saveObj.state.last;
				}
			}

			updated = true;
		}
		/* eslint-enable no-param-reassign */

		return updated;
	}

	function _marshal(supplemental, details) {
		if (DEBUG) { console.log(`[Save/_marshal(…, { type : '${details.type}' })]`); }

		if (supplemental != null && typeof supplemental !== 'object') { // lazy equality for null
			throw new Error('supplemental parameter must be an object');
		}

		const saveObj = Object.assign({}, supplemental, {
			id    : Config.saves.id,
			state : State.marshalForSave()
		});

		if (Config.saves.version) {
			saveObj.version = Config.saves.version;
		}

		if (typeof Config.saves.onSave === 'function') {
			Config.saves.onSave(saveObj, details);
		}

		// Delta encode the state history and delete the non-encoded property.
		saveObj.state.delta = State.deltaEncode(saveObj.state.history);
		delete saveObj.state.history;

		return saveObj;
	}

	function _unmarshal(saveObj) {
		if (DEBUG) { console.log('[Save/_unmarshal()]'); }

		try {
			/* eslint-disable no-param-reassign */
			/* legacy */
			// Update saves with old/obsolete properties.
			_savesObjUpdate(saveObj);
			/* /legacy */

			if (!saveObj || !saveObj.hasOwnProperty('id') || !saveObj.hasOwnProperty('state')) {
				throw new Error(L10n.get('errorSaveMissingData'));
			}

			// Delta decode the state history and delete the encoded property.
			saveObj.state.history = State.deltaDecode(saveObj.state.delta);
			delete saveObj.state.delta;

			if (typeof Config.saves.onLoad === 'function') {
				Config.saves.onLoad(saveObj);
			}

			if (saveObj.id !== Config.saves.id) {
				throw new Error(L10n.get('errorSaveIdMismatch'));
			}

			// Restore the state.
			State.unmarshalForSave(saveObj.state); // may also throw exceptions

			// Show the active moment.
			Engine.show();
			/* eslint-enable no-param-reassign */
		}
		catch (ex) {
			UI.alert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('aborting')}.`);
			return false;
		}

		return true;
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		/*
			Save Functions.
		*/
		init  : { value : savesInit },
		get   : { value : savesObjGet },
		clear : { value : savesObjClear },
		ok    : { value : savesOk },

		/*
			Autosave Functions.
		*/
		autosave : {
			value : Object.freeze(Object.defineProperties({}, {
				ok     : { value : autosaveOk },
				has    : { value : autosaveHas },
				get    : { value : autosaveGet },
				load   : { value : autosaveLoad },
				save   : { value : autosaveSave },
				delete : { value : autosaveDelete }
			}))
		},

		/*
			Slots Functions.
		*/
		slots : {
			value : Object.freeze(Object.defineProperties({}, {
				ok      : { value : slotsOk },
				length  : { get : slotsLength },
				isEmpty : { value : slotsIsEmpty },
				count   : { value : slotsCount },
				has     : { value : slotsHas },
				get     : { value : slotsGet },
				load    : { value : slotsLoad },
				save    : { value : slotsSave },
				delete  : { value : slotsDelete }
			}))
		},

		/*
			Disk Import/Export Functions.
		*/
		export : { value : exportToDisk },
		import : { value : importFromDisk },

		/*
			Serialization Functions.
		*/
		serialize   : { value : serialize },
		deserialize : { value : deserialize }
	}));
})();
