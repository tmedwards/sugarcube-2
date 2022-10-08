/***********************************************************************************************************************

	save.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, L10n, State, createFilename, enumFrom, getTypeOf, hasOwn, storage */

/*
	Save API static object.
*/
var Save = (() => { // eslint-disable-line no-unused-vars, no-var
	// Save type pseudo-enumeration.
	const Type = enumFrom({
		Auto      : 'auto',
		Disk      : 'disk',
		Serialize : 'serialize',
		Slot      : 'slot'
	});

	// Save ID maximum (`0`-based).
	const MAX_SAVE_ID = 49;

	// Save key constants.
	const ID_DELIMITER     = ':';
	const SAVE_SUBKEY      = 'save.';
	const AUTO_SUBKEY      = `${SAVE_SUBKEY}auto.`;
	const AUTO_DATA_SUBKEY = `${AUTO_SUBKEY}data${ID_DELIMITER}`;
	const AUTO_INFO_SUBKEY = `${AUTO_SUBKEY}info${ID_DELIMITER}`;
	const SLOT_SUBKEY      = `${SAVE_SUBKEY}slot.`;
	const SLOT_DATA_SUBKEY = `${SLOT_SUBKEY}data${ID_DELIMITER}`;
	const SLOT_INFO_SUBKEY = `${SLOT_SUBKEY}info${ID_DELIMITER}`;

	// Save key regular expressions.
	// const isAuto = /^save\.auto/;
	// const isSlot = /^save\.slot/;
	// const isData = /^save\.(?:auto|slot)\.data/;
	// const isInfo = /^save\.(?:auto|slot)\.info/;

	// Set of onLoad handlers.
	const _onLoadHandlers = new Set();

	// Set of onSave handlers.
	const _onSaveHandlers = new Set();


	/*******************************************************************************
		General Saves Functions.
	*******************************************************************************/

	/*
		Initialize the saves subsystem.
	*/
	function init() {
		if (DEBUG) { console.log('[Save/init()]'); }

		// TODO: Update saves from the old monolithic save object to the new style here.
		// updateSaves();

		return true;
	}


	/*******************************************************************************
		Browser Saves Predicate Functions.
	*******************************************************************************/

	// function isSaveKey(key) {
	// 	return key.startsWith(SAVE_SUBKEY);
	// }

	// function isDataKey(key) {
	// 	return key.startsWith(AUTO_DATA_SUBKEY) || key.startsWith(SLOT_DATA_SUBKEY);
	// }

	function isInfoKey(key) {
		return key.startsWith(AUTO_INFO_SUBKEY) || key.startsWith(SLOT_INFO_SUBKEY);
	}

	function isAutoKey(key) {
		return key.startsWith(AUTO_SUBKEY);
	}

	function isAutoDataKey(key) {
		return key.startsWith(AUTO_DATA_SUBKEY);
	}

	function isAutoInfoKey(key) {
		return key.startsWith(AUTO_INFO_SUBKEY);
	}

	function isSlotKey(key) {
		return key.startsWith(SLOT_SUBKEY);
	}

	function isSlotDataKey(key) {
		return key.startsWith(SLOT_DATA_SUBKEY);
	}

	function isSlotInfoKey(key) {
		return key.startsWith(SLOT_INFO_SUBKEY);
	}


	/*******************************************************************************
		Browser Saves Utility Functions.
	*******************************************************************************/

	function getKeys(predicate) {
		return storage.keys().filter(predicate);
	}

	function getIdFromKey(key) {
		const pos = key.lastIndexOf(ID_DELIMITER);

		if (pos === -1) {
			throw new Error(`unable to get ID from save key (received: ${key})`);
		}

		return Number(key.slice(pos + 1));
	}

	function getDescription(userDesc, saveType) {
		let desc = String(userDesc).trim();

		if (desc) {
			return desc;
		}

		if (typeof Config.saves.descriptions === 'function') {
			desc = Config.saves.descriptions(saveType);

			if (desc) {
				return desc;
			}
		}

		return `Turn ${State.turns}`;
	}

	// Find the most recent ID, ordered by date (descending).
	function getNewestId(saveType) {
		let keys;

		switch (saveType) {
			case Type.Auto: keys = getKeys(isAutoInfoKey); break;
			case Type.Slot: keys = getKeys(isSlotInfoKey); break;
			default:        keys = getKeys(isInfoKey); break;
		}

		switch (keys.length) {
			case 0: return -1;
			case 1: return getIdFromKey(keys[0]);
		}

		return keys
			.map(key => ({
				id   : getIdFromKey(key),
				date : storage.get(key).date
			}))
			.sort((a, b) => b.date - a.date)
			.first()
			.id;
	}


	/*******************************************************************************
		Browser Auto Saves Functions.
	*******************************************************************************/

	function autoDataKeyFromId(id) {
		return `${AUTO_DATA_SUBKEY}${id}`;
	}

	function autoInfoKeyFromId(id) {
		return `${AUTO_INFO_SUBKEY}${id}`;
	}

	function autoClear() {
		getKeys(isAutoKey).forEach(key => storage.delete(key));
		return true;
	}

	function autoDelete(id) {
		if (!Number.isInteger(id)) {
			throw new TypeError('auto save id must be an integer');
		}

		if (id < 0 || id > MAX_SAVE_ID) {
			throw new RangeError(`auto save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
		}

		storage.delete(autoDataKeyFromId(id));
		storage.delete(autoInfoKeyFromId(id));
		return true;
	}

	function autoGetInfo(id) {
		if (!Number.isInteger(id)) {
			throw new TypeError('auto save id must be an integer');
		}

		if (id < 0 || id > MAX_SAVE_ID) {
			throw new RangeError(`auto save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
		}

		return storage.get(autoInfoKeyFromId(id));
	}

	function autoGetInfoList() {
		// NOTE: Order by date (descending).
		return getKeys(isAutoInfoKey)
			.map(key => ({
				id   : getIdFromKey(key),
				info : storage.get(key)
			}))
			.sort((a, b) => b.info.date - a.info.date);
	}

	function autoHas(id) {
		if (!Number.isInteger(id)) {
			throw new TypeError('auto save id must be an integer');
		}

		if (id < 0 || id > MAX_SAVE_ID) {
			throw new RangeError(`auto save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
		}

		return storage.has(autoInfoKeyFromId(id));
	}

	function autoIsEnabled() {
		return storage.name !== 'cookie'
			&& Boolean(Config.saves.autosave)
			&& Config.saves.maxAutoSaves > 0;
	}

	function autoLoad(id) {
		return new Promise(resolve => {
			if (!Number.isInteger(id)) {
				throw new TypeError('auto save id must be an integer');
			}

			if (id < 0 || id > MAX_SAVE_ID) {
				throw new RangeError(`auto save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
			}

			const data = storage.get(autoDataKeyFromId(id));

			if (!data) {
				throw new Error(L10n.get('saveErrorNonexistent'));
			}

			// NOTE: May throw exceptions.
			unmarshal(data);

			resolve(true);
		});
	}

	function autoSave(desc, metadata) {
		if (
			!autoIsEnabled()
			|| typeof Config.saves.isAllowed === 'function'
			&& !Config.saves.isAllowed(Type.Auto)
		) {
			return false;
		}

		const info = {
			date : Date.now(),
			desc : getDescription(desc, Type.Auto)
		};

		if (metadata != null) { // lazy equality for null
			info.metadata = metadata;
		}

		const id      = (getNewestId(Type.Auto) + 1) % Config.saves.maxAutoSaves;
		const dataKey = autoDataKeyFromId(id);
		const infoKey = autoInfoKeyFromId(id);
		const data    = marshal(Type.Auto);

		if (!storage.set(dataKey, data)) {
			return false;
		}

		if (!storage.set(infoKey, info)) {
			storage.delete(dataKey);
			return false;
		}

		return true;
	}

	function autoSize() {
		return getKeys(isAutoDataKey).length;
	}


	/*******************************************************************************
		Browser Slot Saves Functions.
	*******************************************************************************/

	function slotDataKeyFromId(id) {
		return `${SLOT_DATA_SUBKEY}${id}`;
	}

	function slotInfoKeyFromId(id) {
		return `${SLOT_INFO_SUBKEY}${id}`;
	}

	function slotClear() {
		getKeys(isSlotKey).forEach(key => storage.delete(key));
		return true;
	}

	function slotDelete(id) {
		if (!Number.isInteger(id)) {
			throw new TypeError('slot save id must be an integer');
		}

		if (id < 0 || id > MAX_SAVE_ID) {
			throw new RangeError(`slot save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
		}

		storage.delete(slotDataKeyFromId(id));
		storage.delete(slotInfoKeyFromId(id));
		return true;
	}

	function slotGetInfo(id) {
		if (!Number.isInteger(id)) {
			throw new TypeError('slot save id must be an integer');
		}

		if (id < 0 || id > MAX_SAVE_ID) {
			throw new RangeError(`slot save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
		}

		return storage.get(slotInfoKeyFromId(id));
	}

	function slotGetInfoList() {
		// NOTE: Order by ID (ascending).
		return getKeys(isSlotInfoKey)
			.map(key => ({
				id   : getIdFromKey(key),
				info : storage.get(key)
			}))
			.sort((a, b) => a.id - b.id);
	}

	function slotHas(id) {
		if (!Number.isInteger(id)) {
			throw new TypeError('slot save id must be an integer');
		}

		if (id < 0 || id > MAX_SAVE_ID) {
			throw new RangeError(`slot save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
		}

		return storage.has(slotInfoKeyFromId(id));
	}

	function slotIsEnabled() {
		return storage.name !== 'cookie' && Config.saves.maxSlotSaves > 0;
	}

	function slotLoad(id) {
		return new Promise(resolve => {
			if (!Number.isInteger(id)) {
				throw new TypeError('slot save id must be an integer');
			}

			if (id < 0 || id > MAX_SAVE_ID) {
				throw new RangeError(`slot save id out of bounds (range: 0–${MAX_SAVE_ID}; received: ${id})`);
			}

			const data = storage.get(slotDataKeyFromId(id));

			if (!data) {
				throw new Error(L10n.get('saveErrorNonexistent'));
			}

			// NOTE: May throw exceptions.
			unmarshal(data);

			resolve(true);
		});
	}

	function slotSave(id, desc, metadata) {
		if (!Number.isInteger(id)) {
			throw new TypeError('slot save id must be an integer');
		}

		if (id < 0 || id >= Config.saves.maxSlotSaves) {
			throw new RangeError(`slot save id out of bounds (range: 0–${Config.saves.maxSlotSaves - 1}; received: ${id})`);
		}

		if (
			!slotIsEnabled()
			|| typeof Config.saves.isAllowed === 'function'
			&& !Config.saves.isAllowed(Type.Slot)
		) {
			throw new Error(L10n.get('savesDisallowed'));
		}

		const info = {
			date : Date.now(),
			desc : getDescription(desc, Type.Slot)
		};

		if (metadata != null) { // lazy equality for null
			info.metadata = metadata;
		}

		const dataKey = slotDataKeyFromId(id);
		const infoKey = slotInfoKeyFromId(id);
		const data    = marshal(Type.Slot);

		if (!storage.set(dataKey, data)) {
			return false;
		}

		if (!storage.set(infoKey, info)) {
			storage.delete(dataKey);
			return false;
		}

		return true;
	}

	function slotSize() {
		return  getKeys(isSlotDataKey).length;
	}


	/*******************************************************************************
		Browser General Saves Functions.
	*******************************************************************************/

	function browserIsEnabled() {
		return autoIsEnabled() || slotIsEnabled();
	}

	function browserClear() {
		autoClear();
		slotClear();
		return true;
	}

	function browserContinue() {
		const id = getNewestId();

		if (id === -1) {
			return Promise.reject(new Error(L10n.get('saveErrorNonexistent')));
		}

		// TODO: Load either auto or slot.
		// return autoLoad(id);
	}

	function browserExport(filename) {
		const auto = getKeys(isAutoDataKey).map(dataKey => {
			const id          = getIdFromKey(dataKey);
			const manifestKey = autoInfoKeyFromId(id);
			const data        = storage.get(dataKey);
			const manifest    = storage.get(manifestKey);

			if (!data || !manifest) {
				throw new Error('during saves export auto save data or manifest nonexistent');
			}

			return { id, data, manifest };
		});
		const slot = getKeys(isSlotDataKey).map(dataKey => {
			const id          = getIdFromKey(dataKey);
			const manifestKey = slotInfoKeyFromId(id);
			const data        = storage.get(dataKey);
			const manifest    = storage.get(manifestKey);

			if (!data || !manifest) {
				throw new Error('during saves export slot slave data or manifest nonexistent');
			}

			return { id, data, manifest };
		});
		const bundle = LZString.compressToBase64(JSON.stringify({
			id : Config.saves.id,
			auto,
			slot
		}));

		saveToDiskAs(filename, bundle);
	}

	function browserImport(event) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			// Add the handler that will capture the file information once the load is finished.
			jQuery(reader).on('loadend', () => {
				try {
					if (reader.error) {
						throw new Error(`${L10n.get('errorSaveDiskLoadFailed')}: ${reader.error}`);
						// throw reader.error;
					}

					const badSave = O => !hasOwn(O, 'id') || !hasOwn(O, 'data') || !hasOwn(O, 'manifest');
					let bundle;

					try {
						bundle = JSON.parse(LZString.decompressFromBase64(reader.result));
					}
					catch (ex) {
						throw new Error(L10n.get('saveErrorDecodeFail'));
					}

					if (
						bundle == null // lazy equality for null
						|| typeof bundle !== 'object'
						|| !hasOwn(bundle, 'id')
						|| !hasOwn(bundle, 'auto')
						|| !(bundle.auto instanceof Array)
						|| bundle.auto.some(badSave)
						|| !hasOwn(bundle, 'slot')
						|| !(bundle.slot instanceof Array)
						|| bundle.slot.some(badSave)
					) {
						throw new Error(L10n.get('saveErrorInvalidData'));
					}

					if (bundle.id !== Config.saves.id) {
						throw new Error(L10n.get('saveErrorIdMismatch'));
					}

					autoClear();
					slotClear();

					// QUESTION: Should failures below throw exceptions?

					bundle.auto.forEach(save => {
						const { id, data, manifest } = save;
						const dataKey                = autoDataKeyFromId(id);
						const manifestKey            = autoInfoKeyFromId(id);

						if (!storage.set(dataKey, data)) {
							return;
						}

						if (!storage.set(manifestKey, manifest)) {
							storage.delete(dataKey);
						}
					});

					bundle.slot.forEach(save => {
						const { id, data, manifest } = save;
						const dataKey                = slotDataKeyFromId(id);
						const manifestKey            = slotInfoKeyFromId(id);

						if (!storage.set(dataKey, data)) {
							return;
						}

						if (!storage.set(manifestKey, manifest)) {
							storage.delete(dataKey);
						}
					});

					resolve(true);
				}
				catch (ex) {
					reject(ex);
				}
			});

			// Initiate the file load.
			reader.readAsText(event.target.files[0]);
		});
	}


	/*******************************************************************************
		Disk Saves Functions.
	*******************************************************************************/

	function diskSave(filename) {
		if (
			typeof Config.saves.isAllowed === 'function'
			&& !Config.saves.isAllowed(Type.Disk)
		) {
			throw new Error(L10n.get('savesDisallowed'));
		}

		const bundle = LZString.compressToBase64(JSON.stringify({
			id   : Config.saves.id,
			data : marshal(Type.Disk)
		}));

		saveToDiskAs(filename, bundle);
	}

	function diskLoad(event) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			// Add the handler that will capture the file information once the load is finished.
			jQuery(reader).on('loadend', () => {
				try {
					if (reader.error) {
						throw new Error(`${L10n.get('errorSaveDiskLoadFailed')}: ${reader.error}`);
						// throw reader.error;
					}

					let bundle;

					try {
						bundle = JSON.parse(LZString.decompressFromBase64(reader.result));
					}
					catch (ex) {
						throw new Error(L10n.get('saveErrorDecodeFail'));
					}

					if (
						bundle == null // lazy equality for null
						|| typeof bundle !== 'object'
						|| !hasOwn(bundle, 'id')
						|| !hasOwn(bundle, 'data')
					) {
						throw new Error(L10n.get('saveErrorInvalidData'));
					}

					if (bundle.id !== Config.saves.id) {
						throw new Error(L10n.get('saveErrorIdMismatch'));
					}

					// NOTE: May also throw exceptions.
					unmarshal(bundle.data);

					resolve(true);
				}
				catch (ex) {
					reject(ex);
				}
			});

			// Initiate the file load.
			reader.readAsText(event.target.files[0]);
		});
	}


	/*******************************************************************************
		Serialization Saves Functions.
	*******************************************************************************/

	function serialize() {
		if (
			typeof Config.saves.isAllowed === 'function'
			&& !Config.saves.isAllowed(Type.Serialize)
		) {
			throw new Error(L10n.get('savesDisallowed'));
		}

		return LZString.compressToBase64(JSON.stringify({
			id   : Config.saves.id,
			data : marshal(Type.Serialize)
		}));
	}

	function deserialize(base64Str) {
		return new Promise(resolve => {
			let bundle;

			try {
				bundle = JSON.parse(LZString.decompressFromBase64(base64Str));
			}
			catch (ex) {
				throw new Error(L10n.get('saveErrorDecodeFail'));
			}

			if (
				bundle == null // lazy equality for null
				|| typeof bundle !== 'object'
				|| !hasOwn(bundle, 'id')
				|| !hasOwn(bundle, 'data')
			) {
				throw new Error(L10n.get('saveErrorInvalidData'));
			}

			if (bundle.id !== Config.saves.id) {
				throw new Error(L10n.get('saveErrorIdMismatch'));
			}

			// NOTE: May also throw exceptions.
			unmarshal(bundle.data);

			resolve(true);
		});
	}


	/*******************************************************************************
		Event Functions.
	*******************************************************************************/

	function onLoadAdd(handler) {
		const valueType = getTypeOf(handler);

		if (valueType !== 'function') {
			throw new TypeError(`Save.onLoad.add handler parameter must be a function (received: ${valueType})`);
		}

		_onLoadHandlers.add(handler);
	}

	function onLoadClear() {
		_onLoadHandlers.clear();
	}

	function onLoadDelete(handler) {
		return _onLoadHandlers.delete(handler);
	}

	function onLoadSize() {
		return _onLoadHandlers.size;
	}

	function onSaveAdd(handler) {
		const valueType = getTypeOf(handler);

		if (valueType !== 'function') {
			throw new TypeError(`Save.onSave.add handler parameter must be a function (received: ${valueType})`);
		}

		_onSaveHandlers.add(handler);
	}

	function onSaveClear() {
		_onSaveHandlers.clear();
	}

	function onSaveDelete(handler) {
		return _onSaveHandlers.delete(handler);
	}

	function onSaveSize() {
		return _onSaveHandlers.size;
	}


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function marshal(saveType) {
		if (DEBUG) { console.log(`[Save/marshal(saveType: "${saveType}")]`); }

		const save = { state : State.marshal() };

		if (Config.saves.version != null) { // lazy equality for null
			save.version = Config.saves.version;
		}

		if (typeof Config.saves.onSave === 'function') {
			Config.saves.onSave(save, { type : saveType });
		}

		return save;
	}

	function unmarshal(save) {
		if (DEBUG) { console.log('[Save/unmarshal()]'); }

		if (
			save == null // lazy equality for null
			|| typeof save !== 'object'
			|| !hasOwn(save, 'state')
		) {
			throw new Error(L10n.get('saveErrorInvalid'));
		}

		if (typeof Config.saves.onLoad === 'function') {
			Config.saves.onLoad(save);
		}

		// Restore the state.
		//
		// NOTE: May throw exceptions.
		State.unmarshal(save.state);
	}

	function saveToDiskAs(filename, blobData) {
		if (typeof filename !== 'string') {
			throw new Error('filename parameter must be a string');
		}

		const baseName = createFilename(filename);

		if (baseName === '') {
			throw new Error('filename parameter must not consist solely of illegal characters');
		}

		const datestamp = createDatestamp(new Date());
		const blobName  = `${baseName}-${datestamp}.save`;
		saveAs(new Blob([blobData], { type : 'text/plain;charset=UTF-8' }), blobName);
	}

	function createDatestamp(date) {
		if (!(date instanceof Date)) {
			throw new TypeError('createDatestamp date parameter must be a Date object');
		}

		let MM = date.getMonth() + 1;
		let DD = date.getDate();
		let hh = date.getHours();
		let mm = date.getMinutes();
		let ss = date.getSeconds();

		if (MM < 10) { MM = `0${MM}`; }
		if (DD < 10) { DD = `0${DD}`; }
		if (hh < 10) { hh = `0${hh}`; }
		if (mm < 10) { mm = `0${mm}`; }
		if (ss < 10) { ss = `0${ss}`; }

		return `${date.getFullYear()}${MM}${DD}-${hh}${mm}${ss}`;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// General Save Constants.
		MAX_SAVE_ID : { value : MAX_SAVE_ID },

		// General Save Functions.
		init : { value : init },

		// Browser Saves Functions.
		browser : {
			value : Object.preventExtensions(Object.create(null, {
				// Browser Auto Saves Functions.
				auto : {
					value : Object.preventExtensions(Object.create(null, {
						clear       : { value : autoClear },
						delete      : { value : autoDelete },
						getInfo     : { value : autoGetInfo },
						getInfoList : { value : autoGetInfoList },
						has         : { value : autoHas },
						isEnabled   : { value : autoIsEnabled },
						load        : { value : autoLoad },
						save        : { value : autoSave },
						size        : { value : autoSize }
					}))
				},

				// Browser Slot Saves Functions.
				slot : {
					value : Object.preventExtensions(Object.create(null, {
						clear       : { value : slotClear },
						delete      : { value : slotDelete },
						getInfo     : { value : slotGetInfo },
						getInfoList : { value : slotGetInfoList },
						has         : { value : slotHas },
						isEnabled   : { value : slotIsEnabled },
						load        : { value : slotLoad },
						save        : { value : slotSave },
						size        : { value : slotSize }
					}))
				},

				// Browser General Saves Functions.
				isEnabled : { value : browserIsEnabled },
				clear     : { value : browserClear },
				continue  : { value : browserContinue },
				export    : { value : browserExport },
				import    : { value : browserImport }
			}))
		},

		// Disk Saves Functions.
		disk : {
			value : Object.preventExtensions(Object.create(null, {
				load : { value : diskLoad },
				save : { value : diskSave }
			}))
		},

		// Serialization Saves Functions.
		serialize   : { value : serialize },
		deserialize : { value : deserialize },

		// Event Functions.
		onLoad : {
			value : Object.preventExtensions(Object.create(null, {
				add    : { value : onLoadAdd },
				clear  : { value : onLoadClear },
				delete : { value : onLoadDelete },
				size   : { get : onLoadSize }
			}))
		},
		onSave : {
			value : Object.preventExtensions(Object.create(null, {
				add    : { value : onSaveAdd },
				clear  : { value : onSaveClear },
				delete : { value : onSaveDelete },
				size   : { get : onSaveSize }
			}))
		},

		/*
			Legacy API.
		*/
		// get   : { value : savesObjGet },
		clear : { value : browserClear },
		ok    : { value : browserIsEnabled },

		// Autosave Functions.
		autosave : {
			value : Object.preventExtensions(Object.create(null, {
				ok     : { value : autoIsEnabled },
				has    : { value() { autoHas(0); } },
				// get    : { value() { autoGet(0); } },
				load   : { value() { autoLoad(0); } },
				save   : { value() { autoSave(0); } },
				delete : { value() { autoDelete(0); } }
			}))
		},

		// Slots Functions.
		slots : {
			value : Object.preventExtensions(Object.create(null, {
				ok      : { value : slotIsEnabled },
				length  : { get : slotSize },
				isEmpty : { value() { return slotSize() === 0; } },
				count   : { value : slotSize },
				has     : { value : slotHas },
				// get     : { value : slotGet },
				load    : { value : slotLoad },
				save    : { value : slotSave },
				delete  : { value : slotDelete }
			}))
		},

		// Disk Import/Export Functions.
		export : { value : diskSave },
		import : { value : diskLoad }
	}));
})();
