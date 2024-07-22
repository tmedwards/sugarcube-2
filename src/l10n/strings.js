/***********************************************************************************************************************

	l10n/strings.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
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
	/*******************************************************************************
		General.
	*******************************************************************************/

	textAbort : 'Abort',

	textAborting : 'Aborting',

	textCancel : 'Cancel',

	textClear : 'Clear',

	textClose : 'Close',

	textDelete : 'Delete',

	textExport : 'Export',

	// In lowercase, if possible.
	textIdentity : 'game',

	textImport : 'Import',

	textLoad : 'Load',

	textOff : 'Off',

	textOk : 'OK',

	textOn : 'On',

	textSave : 'Save',

	// (noun) chance to act (in a game), moment, period
	textTurn : 'Turn',


	/*******************************************************************************
		Errors.
	*******************************************************************************/

	// NOTE: `passage` is supplied locally.
	errorNonexistentPassage : 'the passage "{passage}" does not exist',


	/*******************************************************************************
		Warnings.
	*******************************************************************************/

	warningNoStorage : 'All usable storage APIs are missing. Possible causes are a disabled third-party cookie setting, which also affects Web Storage, or a private browsing mode.',

	warningNoWebStorage : 'The Web Storage API is missing, so this {textIdentity} is running in a degraded mode. You may be able to continue, however, some parts may not work properly.',

	warningDegraded : 'Some capabilities required to support this {textIdentity} are missing, so it is running in a degraded mode. You may be able to continue, however, some parts may not work properly.',

	warningNoSaves : 'Some capabilities required to support saves are missing, so saves have been disabled for this session.',


	/*******************************************************************************
		API: Save.
	*******************************************************************************/

	saveErrorDisallowed : 'Saving is currently disallowed.',

	saveErrorDecodeFail : 'unable to decode save, likely due to corruption',

	saveErrorDiskLoadFail : 'failed to load save file from disk',

	saveErrorIdMismatch : 'save is from the wrong {textIdentity}',

	saveErrorInvalidData : 'save is missing required data, likely due to corruption',

	saveErrorLoadTooEarly : 'cannot load save this early',

	saveErrorNonexistent : 'save does not exist',


	/*******************************************************************************
		Base UI.
	*******************************************************************************/

	uiBarLabelToggle : 'Toggle the UI bar',

	uiBarLabelBackward : 'Go backward within the {textIdentity} history',

	uiBarLabelForward : 'Go forward within the {textIdentity} history',

	// [DEPRECATED]
	uiBarLabelJumpto : 'Jump to a specific point within the {textIdentity} history',


	/*******************************************************************************
		Dialog: Alert.
	*******************************************************************************/

	alertTitle : 'Alert',


	/*******************************************************************************
		Dialog: Restart.
	*******************************************************************************/

	restartTitle : 'Restart',

	restartMesgPrompt : 'All unsaved progress will be lost. Are you sure that you want to restart?',


	/*******************************************************************************
		Dialog: Saves.
	*******************************************************************************/

	continueTitle : 'Continue',

	savesTitle : 'Saves',

	savesHeaderBrowser : 'In Browser',

	savesHeaderDisk : 'On Disk',

	savesLabelBrowserClear : 'Clear all browser saves',

	savesLabelBrowserExport : 'Export browser saves to bundle',

	savesLabelBrowserImport : 'Import browser saves from bundle',

	savesLabelDiskLoad : 'Load from disk',

	savesLabelDiskSave : 'Save to disk',

	savesTextBrowserAuto : 'Auto',

	savesTextBrowserSlot : 'Slot',

	savesTextNoDate : 'unknown date',


	/*******************************************************************************
		Dialog: Settings.
	*******************************************************************************/

	settingsTitle : 'Settings',

	settingsTextReset : 'Reset to Defaults',


	/*******************************************************************************
		Debugging: Error Views.
	*******************************************************************************/

	errorViewTitle : 'Error',

	errorViewLabelToggle : 'Toggle the error view',


	/*******************************************************************************
		Debugging: Debug bar.
	*******************************************************************************/

	debugBarLabelToggle : 'Toggle the debug bar',

	debugBarLabelViewsToggle : 'Toggle the debug views',

	debugBarLabelWatchAdd : 'Add a new watch',

	debugBarLabelWatchAll : 'Watch all',

	debugBarLabelWatchClear : 'Clear all watches',

	debugBarLabelWatchDelete : 'Delete this watch',

	debugBarLabelWatchPlaceholder : 'variable name',

	debugBarLabelPassagePlaceholder : 'passage name',

	debugBarLabelPassagePlay : 'Play passage',

	debugBarLabelWatchToggle : 'Toggle the watch panel',

	debugBarMesgNoWatches : 'No watches set',

	debugBarTextAdd : 'Add',

	debugBarTextPassage : 'Passage',

	debugBarTextViews : 'Views',

	debugBarTextWatch : 'Watch',


	/*******************************************************************************
		Macros.
	*******************************************************************************/

	// (verb) rewind, revert
	macroBackText : 'Back',

	// (verb) go/send back
	macroReturnText : 'Return',


	/*******************************************************************************
		[DEPRECATED] Dialog: Autoload.
	*******************************************************************************/

	autoloadTitle : 'Autoload',

	autoloadMesgPrompt : 'An autosave exists. Load it now or go to the start?',

	autoloadTextCancel : 'Go to start',

	autoloadTextOk : 'Load autosave',


	/*******************************************************************************
		[DEPRECATED] Dialog: Jump To.
	*******************************************************************************/

	jumptoTitle : 'Jump To',

	jumptoMesgUnavailable : 'No jump points currently available\u2026',


	/*******************************************************************************
		[DEPRECATED] Dialog: Share.
	*******************************************************************************/

	shareTitle : 'Share'
};
