/***********************************************************************************************************************

	loadscreen.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine */

var LoadScreen = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Locks collection.
	const _locks = new Set();

	// Auto-incrementing lock ID.
	let _autoId = 0;


	/*******************************************************************************************************************
		LoadScreen Functions.
	*******************************************************************************************************************/
	/*
		Initialize management of the loading screen.
	*/
	function loadScreenInit() {
		if (DEBUG) { console.log('[LoadScreen/loadScreenInit()]'); }

		// Add a `readystatechange` listener for hiding/showing the loading screen.
		jQuery(document).on('readystatechange.SugarCube', () => {
			if (DEBUG) { console.log(`[LoadScreen/<readystatechange>] document.readyState: "${document.readyState}"; locks(${_locks.size}):`, _locks); }

			if (_locks.size > 0) {
				return;
			}

			// The value of `document.readyState` may be: 'loading' -> 'interactive' -> 'complete'.
			// Though, to reach this point, it must already be in, at least, the 'interactive' state.
			if (document.readyState === 'complete') {
				if (jQuery(document.documentElement).attr('data-init') === 'loading') {
					if (Config.loadDelay > 0) {
						setTimeout(() => {
							if (_locks.size === 0) {
								loadScreenHide();
							}
						}, Math.max(Engine.minDomActionDelay, Config.loadDelay));
					}
					else {
						loadScreenHide();
					}
				}
			}
			else {
				loadScreenShow();
			}
		});
	}

	/*
		Clear the loading screen.
	*/
	function loadScreenClear() {
		if (DEBUG) { console.log('[LoadScreen/loadScreenClear()]'); }

		// Remove the event listener.
		jQuery(document).off('readystatechange.SugarCube');

		// Clear all locks.
		_locks.clear();

		// Hide the loading screen.
		loadScreenHide();
	}

	/*
		Hide the loading screen.
	*/
	function loadScreenHide() {
		if (DEBUG) { console.log('[LoadScreen/loadScreenHide()]'); }

		jQuery(document.documentElement).removeAttr('data-init');
	}

	/*
		Show the loading screen.
	*/
	function loadScreenShow() {
		if (DEBUG) { console.log('[LoadScreen/loadScreenShow()]'); }

		jQuery(document.documentElement).attr('data-init', 'loading');
	}

	/*
		Returns a new lock ID after locking and showing the loading screen.
	*/
	function loadScreenLock() {
		if (DEBUG) { console.log('[LoadScreen/loadScreenLock()]'); }

		++_autoId;
		_locks.add(_autoId);

		if (DEBUG) { console.log(`\tacquired loading screen lock; id: ${_autoId}`); }

		loadScreenShow();
		return _autoId;
	}

	/*
		Remove the lock associated with the given lock ID and, if no locks remain,
		trigger a `readystatechange` event.
	*/
	function loadScreenUnlock(id) {
		if (DEBUG) { console.log(`[LoadScreen/loadScreenUnlock(id: ${id})]`); }

		if (id == null) { // lazy equality for null
			throw new Error('LoadScreen.unlock called with a null or undefined ID');
		}

		if (_locks.has(id)) {
			_locks.delete(id);

			if (DEBUG) { console.log(`\treleased loading screen lock; id: ${id}`); }
		}

		if (_locks.size === 0) {
			jQuery(document).trigger('readystatechange');
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		init   : { value : loadScreenInit },
		clear  : { value : loadScreenClear },
		hide   : { value : loadScreenHide },
		show   : { value : loadScreenShow },
		lock   : { value : loadScreenLock },
		unlock : { value : loadScreenUnlock }
	}));
})();
