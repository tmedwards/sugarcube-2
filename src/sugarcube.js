/***********************************************************************************************************************

	sugarcube.js

	Copyright © 2013–2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Browser, Config, Dialog, Engine, Fullscreen, Has, LoadScreen, SimpleStore, L10n, Macro,
	       Outliner, Passage, Save, Scripting, Setting, SimpleAudio, State, Story, UI, UIBar, DebugBar,
	       Util, Visibility, Wikifier
*/
/* eslint-disable no-var */

/*
	Version object.
*/
var version = (() => { // eslint-disable-line no-unused-vars, no-var
	const name     = 'SugarCube';
	const semVerRE = /^[Vv]?(\d+)(?:\.(\d+)(?:\.(\d+)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)?)?$/;

	return Object.preventExtensions(Object.create(null, {
		name       : { value : name },
		major      : { value : {{BUILD_VERSION_MAJOR}} },
		minor      : { value : {{BUILD_VERSION_MINOR}} },
		patch      : { value : {{BUILD_VERSION_PATCH}} },
		prerelease : { value : '{{BUILD_VERSION_PRERELEASE}}' },
		build      : { value : '{{BUILD_VERSION_BUILD}}' },
		date       : { value : new Date('{{BUILD_VERSION_DATE}}') },

		isOk : {
			value(semver) {
				if (typeof semver !== 'string') {
					throw new Error(`version.isOk semver parameter must be a string (received: ${typeof semver})`);
				}

				const trimmed = semver.trim();

				if (trimmed === '') {
					throw new Error('version.isOk semver parameter must not be empty');
				}

				const match = semVerRE.exec(trimmed);

				if (!match) {
					throw new Error(`version.isOk semver parameter is invalid (format: [v]MAJOR[.MINOR[.PATCH[-PRERELEASE][+BUILD]]]; received: ${trimmed}`);
				}

				const major = Number(match[1]);
				const minor = Number(match[2]) || 0;
				const patch = Number(match[3]) || 0;

				return (
					major === this.major &&
					(
						minor < this.minor ||
						minor === this.minor && patch <= this.patch
					)
				);
			}
		},

		long : {
			value() {
				return `${this.name} v${this.toString()} (${this.date.toUTCString()})`;
			}
		},

		short : {
			value() {
				const prerelease = this.prerelease ? `-${this.prerelease}` : '';
				return `${this.name} (v${this.major}.${this.minor}.${this.patch}${prerelease})`;
			}
		},

		toString : {
			value() {
				const prerelease = this.prerelease ? `-${this.prerelease}` : '';
				return `${this.major}.${this.minor}.${this.patch}${prerelease}+${this.build}`;
			}
		},

		// Legacy.
		title : { value : name }
	}));
})();

/* eslint-disable no-unused-vars */
/*
	Internal variables.
*/
// Temporary state object.
var TempState = {};

// Session storage manager object.
var session = null;

// Settings object.
var settings = Setting.create();

// Setup object.
var setup = {};

// Persistant storage manager object.
var storage = null;

/*
	Legacy variables.
*/
var macros = {};      // Legacy macros object.
var postdisplay = {}; // Post-display task callbacks object.
var postrender = {};  // Post-render task callbacks object.
var predisplay = {};  // Pre-display task callbacks object.
var prehistory = {};  // Pre-history task callbacks object.
var prerender = {};   // Pre-render task callbacks object.
/* eslint-enable no-unused-vars */

/*
	Global `SugarCube` object.  Allows scripts to detect if they're running in SugarCube by
	testing for the object—e.g., `"SugarCube" in window`—and contains exported identifiers
	for debugging purposes.
*/
Object.defineProperty(window, 'SugarCube', {
	// WARNING: We need to assign new values at points, so seal it, do not freeze it.
	value : Object.seal(Object.assign(Object.create(null), {
		Browser,
		Config,
		Dialog,
		Engine,
		Fullscreen,
		Has,
		L10n,
		Macro,
		Passage,
		Save,
		Scripting,
		Setting,
		SimpleAudio,
		State,
		Story,
		UI,
		UIBar,
		DebugBar,
		Util,
		Visibility,
		Wikifier,
		session,
		settings,
		setup,
		storage,
		version
	}))
});

/*
	Main function, entry point for the story.
*/
jQuery(() => {
	if (BUILD_DEBUG) { console.log('[SugarCube/main()] Document loaded; beginning startup.'); }

	/*
		WARNING!

		The ordering of the code within this function is critically important,
		so be careful when mucking around with it.
	*/

	// Acquire an initial lock for and initialize the loading screen.
	const lockId = LoadScreen.lock();
	LoadScreen.init();

	// Normalize the document.
	if (document.normalize) {
		document.normalize();
	}

	// From this point on it's promises all the way down.
	new Promise(resolve => {
		// Initialize the story.
		Story.init();

		// Initialize the databases.
		try {
			SugarCube.storage = storage = SimpleStore.create(Story.id, true); // eslint-disable-line no-undef
			SugarCube.session = session = SimpleStore.create(Story.id, false); // eslint-disable-line no-undef
		}
		catch (ex) {
			throw new Error(L10n.get('warningNoStorage'));
		}

		// Initialize the user interfaces.
		//
		// NOTE: Must be done before user scripts are loaded.
		Dialog.init();
		UIBar.init();
		Engine.init();
		Outliner.init();

		// Run user scripts (user stylesheet, JavaScript, and widgets).
		Engine.runUserScripts();

		// Initialize the localization (must be done after user scripts).
		L10n.init();

		// Alert when the browser is degrading required capabilities.
		if (!session.has('rcWarn') && storage.name === 'cookie') {
			/* eslint-disable no-alert */
			session.set('rcWarn', 1);
			window.alert(L10n.get('warningNoWebStorage'));
			/* eslint-enable no-alert */
		}

		// Initialize the saves.
		Save.init();

		// Initialize the settings.
		Setting.init();

		// Initialize the macros.
		Macro.init();

		// Initialize the debug bar interface.
		if (Config.debug) {
			DebugBar.init();
		}

		// Schedule the start of the engine and interfaces once both the DOM is
		// reporting non-empty dimensions for the viewport and our loading screen
		// lock is the only remaining one.
		const $window   = jQuery(window);
		const vpReadyId = setInterval(() => {
			if ($window.width() && LoadScreen.size <= 1) {
				clearInterval(vpReadyId);
				resolve();
			}
		}, Engine.DOM_DELAY);
	})
		.then(() => {
			// Run the user init passages.
			Engine.runUserInit();

			// Start the UI bar interface.
			UIBar.start();

			// Start the engine.
			Engine.start();

			// Start the debug bar interface.
			if (Config.debug) {
				DebugBar.start();
			}

			// Trigger the `:storyready` global synthetic event.
			jQuery.event.trigger(':storyready');

			// Release our loading screen lock after a short delay.
			setTimeout(() => LoadScreen.unlock(lockId), Engine.DOM_DELAY * 2);

			if (BUILD_DEBUG) { console.log('[SugarCube/main()] Startup complete; story ready.'); }
		})
		.catch(ex => {
			console.error(ex);
			LoadScreen.clear();
			return Alert.fatal(null, ex.message, ex);
		});
});
