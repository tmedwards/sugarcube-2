/*
	`SCDocs` SETUP
*/
(function () {
	'use strict';

	var hasWebStorage = function (storeId) {
		try {
			var store = window[storeId];
			var tid   = '_scd_' + String(Date.now());
			store.setItem(tid, tid);
			var result = store.getItem(tid) === tid;
			store.removeItem(tid);
			return result;
		}
		catch (ex) { /* no-op */ }

		return false;
	};

	if (
		   !document.head
		|| !document.addEventListener
		|| !document.querySelector
		|| !Array.prototype.indexOf
		|| !Object.defineProperties
		|| !hasWebStorage('localStorage')
	) {
		return;
	}

	var storageKey = 'sugarcube-v2-docs-cfg';
	var SCDocs = Object.freeze(Object.defineProperties(Object.create(null), {
		getConfig : {
			value : function (key) {
				var json = localStorage.getItem(storageKey);

				if (json) {
					try {
						var config = JSON.parse(json);

						if (config !== null && typeof config === 'object' && config.hasOwnProperty(key)) {
							return config[key];
						}
					}
					catch (ex) { /* no-op */ }
				}

				return undefined;
			}
		},
		setConfig : {
			value : function (key, value) {
				var config;

				try {
					config = JSON.parse(localStorage.getItem(storageKey));
				}
				catch (ex) { /* no-op */ }

				if (config === null || typeof config !== 'object') {
					config = {};
				}

				config[key] = value;

				try {
					localStorage.setItem(storageKey, JSON.stringify(config));
					return true;
				}
				catch (ex) { /* no-op */ }

				return false;
			}
		},
		removeConfig : {
			value : function (key) {
				var json = localStorage.getItem(storageKey);

				if (json) {
					try {
						var config = JSON.parse(json);

						if (config !== null && typeof config === 'object' && config.hasOwnProperty(key)) {
							delete config[key];

							if (Object.keys(config).length > 0) {
								localStorage.setItem(storageKey, JSON.stringify(config));
							}
							else {
								localStorage.removeItem(storageKey);
							}
						}

						return true;
					}
					catch (ex) { /* no-op */ }
				}

				return false;
			}
		},
		clearConfig : {
			value : function () {
				localStorage.removeItem(storageKey);
				return true;
			}
		},
		arrayFrom : {
			value : function (arrayLike) {
				return Array.prototype.slice.call(arrayLike);
			}
		}
	}));
	Object.defineProperty(window, 'SCDocs', {
		value : SCDocs
	});
})();
