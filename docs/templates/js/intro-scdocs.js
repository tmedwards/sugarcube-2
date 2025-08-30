/*
	`SCDocs` SETUP
*/
(() => {
	'use strict';

	const hasWebStorage = function (storeId) {
		try {
			const store = window[storeId];
			const tid   = `_scd_${String(Date.now())}`;
			store.setItem(tid, tid);
			const result = store.getItem(tid) === tid;
			store.removeItem(tid);
			return result;
		}
		catch (ex) { /* no-op */ }

		return false;
	};

	if (
		!Object.entries
		|| !Object.fromEntries
		|| !hasWebStorage('localStorage')
	) {
		return;
	}

	const STORAGE_KEY = 'sugarcube-v2-docs-cfg';
	const SCDocs      = Object.freeze(Object.create(null, {
		_config : {
			value() {
				let config;

				try {
					config = JSON.parse(localStorage.getItem(STORAGE_KEY));
				}
				catch (ex) { /* no-op */ }

				return config || {};
			}
		},
		getConfig : {
			value(key) {
				const config = this._config();

				if (Object.hasOwn(config, key)) {
					return config[key];
				}
			}
		},
		setConfig : {
			value(key, value) {
				const config = this._config();
				config[key] = value;

				try {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
					return true;
				}
				catch (ex) { /* no-op */ }

				return false;
			}
		},
		removeConfig : {
			value(key) {
				const config = this._config();

				if (Object.hasOwn(config, key)) {
					delete config[key];

					if (Object.keys(config).length > 0) {
						try {
							localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
						}
						catch (ex) { /* no-op */ }
					}
					else {
						localStorage.removeItem(STORAGE_KEY);
					}
				}

				return true;
			}
		},
		clearConfig : {
			value() {
				localStorage.removeItem(STORAGE_KEY);
				return true;
			}
		}
	}));
	Object.defineProperty(window, 'SCDocs', {
		value : SCDocs
	});
})();
