/***********************************************************************************************************************

	storage/adapters/cookie.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Serial, SimpleStore, exceptionFrom */

SimpleStore.adapters.push((() => {
	// Expiry constants.
	const _MAX_EXPIRY = 'Tue, 19 Jan 2038 03:14:07 GMT'; // (new Date((Math.pow(2, 31) - 1) * 1000)).toUTCString()
	const _MIN_EXPIRY = 'Thu, 01 Jan 1970 00:00:00 GMT'; // (new Date(0)).toUTCString()

	// Adapter readiness state.
	let _ok = false;


	/*******************************************************************************
		CookieAdapter Class.
	*******************************************************************************/

	class CookieAdapter {
		constructor(storageId, persistent) {
			const prefix = `${storageId}${persistent ? '!' : '*'}.`;

			Object.defineProperties(this, {
				_prefix : {
					value : prefix
				},

				_prefixRe : {
					value : new RegExp(`^${RegExp.escape(prefix)}`)
				},

				name : {
					value : 'cookie'
				},

				id : {
					value : storageId
				},

				persistent : {
					value : Boolean(persistent)
				}
			});
		}

		get size() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.size : Number]`); }

			return this.keys().length;
		}

		keys() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.keys() : String Array]`); }

			if (document.cookie === '') {
				return [];
			}

			const cookies = document.cookie.split(/;\s*/);
			const keys    = [];

			for (let i = 0; i < cookies.length; ++i) {
				const kvPair = cookies[i].split('=');
				const key    = decodeURIComponent(kvPair[0]);

				if (this._prefixRe.test(key)) {
					// NOTE: All stored values are serialized and an empty string will
					// always serialize to a non-empty string.  Therefore, receiving an
					// empty string here denotes a deleted value rather than a serialized
					// empty string, so we omit such pairs.
					const value = decodeURIComponent(kvPair[1]);

					if (value !== '') {
						keys.push(key.replace(this._prefixRe, ''));
					}
				}
			}

			return keys;
		}

		has(key) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.has(key: "${key}") : Boolean]`); }

			if (typeof key !== 'string' || !key) {
				return false;
			}

			return CookieAdapter._getCookie(this._prefix + key) !== null;
		}

		get(key) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.get(key: "${key}") : Any]`); }

			if (typeof key !== 'string' || !key) {
				return null;
			}

			const value = CookieAdapter._getCookie(this._prefix + key);

			return value === null ? null : CookieAdapter._deserialize(value);
		}

		set(key, value) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.set(key: "${key}", value: \u2026) : Boolean]`); }

			if (typeof key !== 'string' || !key) {
				return false;
			}

			try {
				CookieAdapter._setCookie(
					this._prefix + key,
					CookieAdapter._serialize(value),

					// An undefined expiry denotes a session cookie.
					this.persistent ? _MAX_EXPIRY : undefined
				);

				if (!this.has(key)) {
					throw new Error('unknown validation error during set');
				}
			}
			catch (ex) {
				// Massage the cookie exception into something a bit nicer for the player.
				throw exceptionFrom(ex, Error, {
					cause   : { origin : ex },
					message : `cookie error: ${ex.message}`
				});
			}

			return true;
		}

		delete(key) {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.delete(key: "${key}") : Boolean]`); }

			/*
				Attempting to delete a cookie implies setting it, so we test for its existence
				beforehand, to avoid creating it in the event that it does not already exist.
			*/
			if (typeof key !== 'string' || !key || !this.has(key)) {
				return false;
			}

			try {
				CookieAdapter._setCookie(
					this._prefix + key,

					// Use `undefined` as the value.
					undefined,

					// Use the epoch as the expiry.
					_MIN_EXPIRY
				);

				if (this.has(key)) {
					throw new Error('unknown validation error during delete');
				}
			}
			catch (ex) {
				// Massage the cookie exception into something a bit nicer for the player.
				throw exceptionFrom(ex, Error, {
					cause   : { origin : ex },
					message : `cookie error: ${ex.message}`
				});
			}

			return true;
		}

		clear() {
			if (BUILD_DEBUG) { console.log(`[<SimpleStore:${this.name}>.clear() : Boolean]`); }

			const keys = this.keys();

			for (let i = 0, length = keys.length; i < length; ++i) {
				if (BUILD_DEBUG) { console.log('\tdeleting key:', keys[i]); }

				this.delete(keys[i]);
			}

			return true;
		}

		static _getCookie(prefixedKey) {
			if (!prefixedKey || document.cookie === '') {
				return null;
			}

			const cookies = document.cookie.split(/;\s*/);

			for (let i = 0; i < cookies.length; ++i) {
				const kvPair = cookies[i].split('=');
				const key    = decodeURIComponent(kvPair[0]);

				if (prefixedKey === key) {
					const value = decodeURIComponent(kvPair[1]);

					// NOTE: All stored values are serialized and an empty string will
					// always serialize to a non-empty string.  Therefore, receiving an
					// empty string here denotes a deleted value rather than a serialized
					// empty string, so we return `null` for such pairs.
					return value || null;
				}
			}

			return null;
		}

		static _setCookie(prefixedKey, value, expiry) {
			if (!prefixedKey) {
				return;
			}

			let payload = `${encodeURIComponent(prefixedKey)}=`;

			if (value != null) { // lazy equality for null
				payload += encodeURIComponent(value);
			}

			if (expiry != null) { // lazy equality for null
				payload += `; expires=${expiry}`;
			}

			payload += '; path=/';
			document.cookie = payload;
		}

		static _serialize(obj) {
			return LZString.compressToBase64(Serial.stringify(obj));
		}

		static _deserialize(str) {
			return Serial.parse(LZString.decompressFromBase64(str));
		}
	}


	/*******************************************************************************
		Adapter Utility Functions.
	*******************************************************************************/

	function create(storageId, persistent) {
		if (!_ok) {
			throw new Error('adapter not initialized');
		}

		return new CookieAdapter(storageId, persistent);
	}

	function init(
		// Only used for stores updates.
		storageId
	) {
		// Cookie feature test.
		try {
			const tid = `_sc_${String(Date.now())}`;

			// We only test a session cookie as that should suffice.
			CookieAdapter._setCookie(tid, CookieAdapter._serialize(tid), undefined);
			_ok = CookieAdapter._deserialize(CookieAdapter._getCookie(tid)) === tid;
			CookieAdapter._setCookie(tid, undefined, _MIN_EXPIRY);
		}
		catch (ex) {
			_ok = false;
		}

		/* legacy */
		// Attempt to update the cookie stores, if necessary.  This should happen only during initialization.
		if (_ok) {
			_updateCookieStores(storageId);
		}
		/* /legacy */

		return _ok;
	}

	/* legacy */
	// Updates old non-segmented cookie stores into segmented stores.
	function _updateCookieStores(storageId) {
		if (document.cookie === '') {
			return;
		}

		const oldPrefix     = `${storageId}.`;
		const oldPrefixRe   = new RegExp(`^${RegExp.escape(oldPrefix)}`);
		const persistPrefix = `${storageId}!.`;
		const sessionPrefix = `${storageId}*.`;
		const sessionTestRe = /\.(?:state|rcWarn)$/;
		const cookies       = document.cookie.split(/;\s*/);

		for (let i = 0; i < cookies.length; ++i) {
			const kvPair = cookies[i].split('=');
			const key    = decodeURIComponent(kvPair[0]);

			if (oldPrefixRe.test(key)) {
				// NOTE: All stored values are serialized and an empty string will always
				// serialize to a non-empty string.  Therefore, receiving an empty string
				// here denotes a deleted value rather than a serialized empty string, so
				// we skip processing of such pairs.
				const value = decodeURIComponent(kvPair[1]);

				if (value !== '') {
					const persist = !sessionTestRe.test(key);

					// Delete the old k/v pair.
					CookieAdapter._setCookie(
						key,
						undefined,
						_MIN_EXPIRY
					);

					// Set the new k/v pair.
					CookieAdapter._setCookie(
						key.replace(oldPrefixRe, () => persist ? persistPrefix : sessionPrefix),
						value,
						persist ? _MAX_EXPIRY : undefined
					);
				}
			}
		}
	}
	/* /legacy */


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		init   : { value : init },
		create : { value : create }
	}));
})());
