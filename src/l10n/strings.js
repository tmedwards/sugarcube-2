/***********************************************************************************************************************

	l10n/strings.js

	Copyright © 2013–2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* eslint-disable max-len */

/*
	ATTENTION TRANSLATORS

	Please use the `locale/l10n-template.js` file, from the root of the repository,
	as the template for your translation rather than this file.

	SEE: https://github.com/tmedwards/sugarcube-2/tree/develop/locale
*/
var l10nStrings = { // eslint-disable-line no-unused-vars, no-var
	/*
		General.
	*/
	identity : 'game',
	aborting : 'Aborting',
	cancel   : 'Cancel',
	close    : 'Close',
	ok       : 'OK',
	turn     : 'Turn', // (noun) chance to act (in a game), moment, period

	/*
		Errors.
	*/
	errorTitle              : 'Error',
	errorToggle             : 'Toggle the error view',
	errorNonexistentPassage : 'the passage "{passage}" does not exist', // NOTE: `passage` is supplied locally

	/*
		Warnings.
	*/
	_warningIntroLacking  : 'Your browser either lacks or has disabled',
	_warningOutroDegraded : ', so this {identity} is running in a degraded mode. You may be able to continue, however, some parts may not work properly.',
	warningNoStorage   : '{_warningIntroLacking} all usable storage APIs. Possible causes are a disabled third-party cookie setting, which also affects Web Storage, or a private browsing mode.',
	warningNoWebStorage   : '{_warningIntroLacking} the Web Storage API{_warningOutroDegraded}',
	warningDegraded       : '{_warningIntroLacking} some of the capabilities required by this {identity}{_warningOutroDegraded}',
	warningNoSaves        : '{_warningIntroLacking} the capabilities required to support saves, so saves have been disabled for this session.', // was: savesIncapable

	/*
		Debug bar.
	*/
	debugBarToggle      : 'Toggle the debug bar',
	debugBarNoWatches   : '\u2014 no watches set \u2014',
	debugBarAddWatch    : 'Add watch',
	debugBarDeleteWatch : 'Delete watch',
	debugBarWatchAll    : 'Watch all',
	debugBarWatchNone   : 'Delete all',
	debugBarLabelAdd    : 'Add',
	debugBarLabelWatch  : 'Watch',
	debugBarLabelTurn   : 'Turn', // (noun) chance to act (in a game), moment, period
	debugBarLabelViews  : 'Views',
	debugBarViewsToggle : 'Toggle the debug views',
	debugBarWatchToggle : 'Toggle the watch panel',

	/*
		UI bar.
	*/
	uiBarToggle   : 'Toggle the UI bar',
	uiBarBackward : 'Go backward within the {identity} history',
	uiBarForward  : 'Go forward within the {identity} history',
	uiBarJumpto   : 'Jump to a specific point within the {identity} history',

	/*
		Jump To.
	*/
	jumptoTitle       : 'Jump To',
	jumptoTurn        : 'Turn', // (noun) chance to act (in a game), moment, period
	jumptoUnavailable : 'No jump points currently available\u2026',

	/*
		Saves.
	*/
	continueTitle         : 'Continue',
	savesTitle            : 'Saves',
	savesHeaderBrowser    : 'Browser Saves',
	savesHeaderDisk       : 'Disk Saves',
	savesDisallowed       : 'Saving has been disallowed on this passage.',
	savesLabelAuto        : 'Auto',
	savesLabelClear       : 'Clear',
	savesLabelDelete      : 'Delete',
	savesLabelExport      : 'Export\u2026',
	savesLabelImport      : 'Import\u2026',
	savesLabelDiskLoad    : 'Load from Disk\u2026', // was: savesLabelImport
	savesLabelDiskSave    : 'Save to Disk\u2026', // was: savesLabelExport
	savesLabelLoad        : 'Load',
	savesLabelSave        : 'Save',
	savesLabelSlot        : 'Slot',
	savesUnavailable      : 'No save slots found\u2026',
	savesUnknownDate      : 'unknown',
	saveErrorDecodeFail   : 'unable to decode save, likely due to corruption',
	saveErrorDiskLoadFail : 'failed to load save file from disk', // was: errorSaveDiskLoadFailed
	saveErrorIdMismatch   : 'save is from the wrong {identity}', // was: errorSaveIdMismatch
	saveErrorInvalidData  : 'save is missing required data, likely due to corruption', // was: errorSaveMissingData
	saveErrorNonexistent  : 'save does not exist',

	/*
		Settings.
	*/
	settingsTitle : 'Settings',
	settingsOff   : 'Off',
	settingsOn    : 'On',
	settingsReset : 'Reset to Defaults',

	/*
		Restart.
	*/
	restartTitle  : 'Restart',
	restartPrompt : 'Are you sure that you want to restart? Unsaved progress will be lost.',

	/*
		Share.
	*/
	shareTitle : 'Share',

	/*
		Alert.
	*/
	alertTitle : 'Alert',

	/*
		Autoload.
	*/
	autoloadTitle  : 'Autoload',
	autoloadCancel : 'Go to start',
	autoloadOk     : 'Load autosave',
	autoloadPrompt : 'An autosave exists. Load it now or go to the start?',

	/*
		Macros.
	*/
	macroBackText   : 'Back',  // (verb) rewind, revert
	macroReturnText : 'Return' // (verb) go/send back
};
