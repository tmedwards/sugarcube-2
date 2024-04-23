/***********************************************************************************************************************

	storage/adapters/webstorage.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Serial, SimpleStore, exceptionFrom */

SimpleStore.adapters.push((() => {
	// Adapter readiness state.
	let _ok = false;


	/*******************************************************************************
		_WebStorageAdapter Class.
	*******************************************************************************/

	class _WebStorageAdapter {
		constructor(storageId, persistent) {
			const prefix = `${storageId}.`;
			let engine = null;
			let name   = null;

			if (persistent) {
				engine = window.localStorage;
				name   = 'localStorage';
			}
			else {
				engine = window.sessionStorage;
				name   = 'sessionStorage';
			}

			Object.defineProperties(this, {
				_engine : {
					value : engine
				},

				_prefix : {
					value : prefix
				},

				_prefixRe : {
					value : new RegExp(`^${RegExp.escape(prefix)}`)
				},

				name : {
					value : name
				},

				id : {
					value : storageId
				},

				persistent : {
					value : !!persistent
				}
			});
		}

		/* legacy */
		get length() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.length : Number]`); }

			/*
				NOTE: DO NOT do something like `return this._engine.length;` here,
				as that will return the length of the entire store, rather than
				just our prefixed keys.
			*/
			return this.keys().length;
		}
		/* /legacy */

		size() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.size() : Number]`); }

			/*
				NOTE: DO NOT do something like `return this._engine.length;` here,
				as that will return the length of the entire store, rather than
				just our prefixed keys.
			*/
			return this.keys().length;
		}

		keys() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.keys() : String Array]`); }

			const keys = [];

			for (let i = 0; i < this._engine.length; ++i) {
				const key = this._engine.key(i);

				if (this._prefixRe.test(key)) {
					keys.push(key.replace(this._prefixRe, ''));
				}
			}

			return keys;
		}

		has(key) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.has(key: "${key}") : Boolean]`); }

			if (typeof key !== 'string' || !key) {
				return false;
			}

			// // FIXME: This method should probably check for the key, rather than comparing its value.
			// return this._engine.getItem(this._prefix + key) != null; // lazy equality for null

			return Object.hasOwn(this._engine, this._prefix + key);
		}

		get(key) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.get(key: "${key}") : Any]`); }

			if (typeof key !== 'string' || !key) {
				return null;
			}

			const value = this._engine.getItem(this._prefix + key);

			return value == null ? null : _WebStorageAdapter._deserialize(value); // lazy equality for null
		}

		set(key, value) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.set(key: "${key}", value: \u2026) : Boolean]`); }

			if (typeof key !== 'string' || !key) {
				return false;
			}

			try {
				this._engine.setItem(this._prefix + key, _WebStorageAdapter._serialize(value));
			}
			catch (ex) {
				// If the exception is a quota exceeded error, massage it into something
				// a bit nicer for the player.
				if (isQuotaDOMException(ex)) {
					throw exceptionFrom(ex, Error, {
						cause   : { origin : ex },
						message : `${this.name} quota exceeded`
					});
				}

				// Elsewise, simply rethrow the exception.
				throw ex;
			}

			return true;
		}

		delete(key) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.delete(key: "${key}") : Boolean]`); }

			if (typeof key !== 'string' || !key) {
				return false;
			}

			this._engine.removeItem(this._prefix + key);

			return true;
		}

		clear() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.clear() : Boolean]`); }

			const keys = this.keys();

			for (let i = 0, iend = keys.length; i < iend; ++i) {
				if (BUILD_DEBUG) { console.log('\tdeleting key:', keys[i]); }

				this.delete(keys[i]);
			}

			// return this.keys().forEach(key => {
			// 	if (BUILD_DEBUG) { console.log('\tdeleting key:', key); }
			//
			// 	this.delete(key);
			// });

			return true;
		}

		static _serialize(obj) {
			return LZString.compressToUTF16(Serial.stringify(obj));
		}

		static _deserialize(str) {
			return Serial.parse(LZString.decompressFromUTF16(str));
		}
	}


	/*******************************************************************************
		Adapter Utility Functions.
	*******************************************************************************/

	function adapterInit() {
		// Web Storage feature test.
		function hasWebStorage(storeId) {
			try {
				const store = window[storeId];
				const val   = `_sc_${String(Date.now())}`;
				store.setItem(val, val);
				const result = store.getItem(val) === val;
				store.removeItem(val);
				return result;
			}
			catch (ex) {
				// Attempt to ensure that the exception was due to feature failure rather
				// than simply a quota error, which is possible due to browser stupidity.
				return isQuotaDOMException(ex) && store && store.length !== 0;
			}
		}

		/*
			Just to be safe, we feature test for both `localStorage` and `sessionStorage`,
			as you never know what browser implementation bugs you're going to run into.
		*/
		_ok = hasWebStorage('localStorage') && hasWebStorage('sessionStorage');

		return _ok;
	}

	function adapterCreate(storageId, persistent) {
		if (!_ok) {
			throw new Error('adapter not initialized');
		}

		return new _WebStorageAdapter(storageId, persistent);
	}
	const isQuotaErrorRE = /quota.?(?:exceeded|reached)/i;

	function isQuotaDOMException(ex) {
		return ex instanceof DOMException
			&& (
				// The `.code` property is non-standard and not supported by all browsers,
				// but for legacy support test it first anyway.
				//
				// Legacy codes: `22` (non-Firefox) and `1014` (Firefox).
				ex.code === 22 || ex.code === 1014

				// If the `.code` test failed, resort to pattern matching the `.name` and
				// `.message` properties—the latter being required only by Opera (Presto).
				//
				// NOTE: The current standards compliant name is `"QuotaExceededError"`.
				// Legacy names: `"QUOTA_EXCEEDED_ERR"` (non-Firefox) and `"NS_ERROR_DOM_QUOTA_REACHED"` (Firefox).
				|| isQuotaErrorRE.test(ex.name) || isQuotaErrorRE.test(ex.message)
			);
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		init   : { value : adapterInit },
		create : { value : adapterCreate }
	}));
})());
