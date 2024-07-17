/***********************************************************************************************************************

	l10n-template.js – Localization Template

	Copyright © 2019–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/
/* global l10nStrings */
/* eslint-disable strict */

/*
	ATTENTION TRANSLATORS

	The capitalization and punctuation used within the default replacement strings is
	deliberate, especially within the error and warning strings.  You would do well
	to keep your translations similar when possible.

	Replacement patterns have the format `{NAME}` (e.g. {identity}), where NAME is the
	name of a property within either the `l10nStrings` object or, in a few cases, an
	object supplied locally where the string is used—these instances will be commented.

	By convention, properties starting with an underscore (e.g. _warningIntroLacking)
	are used as templates, only being included within other localized strings.  Feel
	free to add your own if that makes localization easier—e.g. for gender, plurals,
	and whatnot.  As an example, the default replacement strings make use of this to
	handle various warning intros and outros.

	In use, replacement patterns are replaced recursively, so replacement strings may
	contain patterns whose replacements contain other patterns.  Because replacement is
	recursive, care must be taken to ensure infinite loops are not created—the system
	will detect an infinite loop and throw an error.

	FOR MORE INFORMATION: http://www.motoslave.net/sugarcube/2/docs/#guide-localization

	ALSO NOTE: There are two versions of this file within the repository.

		* The current release version, which is on the `master` branch.
			https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/locale/l10n-template.js

		* The development version, which is on the `develop` branch.
			https://raw.githubusercontent.com/tmedwards/sugarcube-2/develop/locale/l10n-template.js

	You will likely want to use the development version.
*/
(function () {
	/*******************************************************************************
		General.
	*******************************************************************************/

	l10nStrings.textAbort = 'Abort';

	l10nStrings.textAborting = 'Aborting';

	l10nStrings.textCancel = 'Cancel';

	l10nStrings.textClear = 'Clear';

	l10nStrings.textClose = 'Close';

	l10nStrings.textDelete = 'Delete';

	l10nStrings.textExport = 'Export';

	// In lowercase, if possible.
	l10nStrings.textIdentity = 'game';

	l10nStrings.textImport = 'Import';

	l10nStrings.textLoad = 'Load';

	l10nStrings.textOff = 'Off';

	l10nStrings.textOk = 'OK';

	l10nStrings.textOn = 'On';

	l10nStrings.textSave = 'Save';

	// (noun) chance to act (in a game), moment, period
	l10nStrings.textTurn = 'Turn';


	/*******************************************************************************
		Errors.
	*******************************************************************************/

	// NOTE: `passage` is supplied locally.
	l10nStrings.errorNonexistentPassage = 'the passage "{passage}" does not exist';


	/*******************************************************************************
		Warnings.
	*******************************************************************************/

	l10nStrings.warningNoStorage = 'All usable storage APIs are missing. Possible causes are a disabled third-party cookie setting, which also affects Web Storage, or a private browsing mode.';

	l10nStrings.warningNoWebStorage = 'The Web Storage API is missing, so this {textIdentity} is running in a degraded mode. You may be able to continue, however, some parts may not work properly.';

	l10nStrings.warningDegraded = 'Some capabilities required to support this {textIdentity} are missing, so it is running in a degraded mode. You may be able to continue, however, some parts may not work properly.';

	l10nStrings.warningNoSaves = 'Some capabilities required to support saves are missing, so saves have been disabled for this session.';


	/*******************************************************************************
		API: Save.
	*******************************************************************************/

	l10nStrings.saveErrorDisallowed = 'Saving is currently disallowed.';

	l10nStrings.saveErrorDecodeFail = 'unable to decode save, likely due to corruption';

	l10nStrings.saveErrorDiskLoadFail = 'failed to load save file from disk';

	l10nStrings.saveErrorIdMismatch = 'save is from the wrong {textIdentity}';

	l10nStrings.saveErrorInvalidData = 'save is missing required data, likely due to corruption';

	l10nStrings.saveErrorNonexistent = 'save does not exist';


	/*******************************************************************************
		Base UI.
	*******************************************************************************/

	l10nStrings.uiBarLabelToggle = 'Toggle the UI bar';

	l10nStrings.uiBarLabelBackward = 'Go backward within the {textIdentity} history';

	l10nStrings.uiBarLabelForward = 'Go forward within the {textIdentity} history';

	// [DEPRECATED]
	l10nStrings.uiBarLabelJumpto = 'Jump to a specific point within the {textIdentity} history';


	/*******************************************************************************
		Dialog: Alert.
	*******************************************************************************/

	l10nStrings.alertTitle = 'Alert';


	/*******************************************************************************
		Dialog: Restart.
	*******************************************************************************/

	l10nStrings.restartTitle = 'Restart';

	l10nStrings.restartMesgPrompt = 'All unsaved progress will be lost. Are you sure that you want to restart?';


	/*******************************************************************************
		Dialog: Saves.
	*******************************************************************************/

	l10nStrings.continueTitle = 'Continue';

	l10nStrings.savesTitle = 'Saves';

	l10nStrings.savesHeaderBrowser = 'In Browser';

	l10nStrings.savesHeaderDisk = 'On Disk';

	l10nStrings.savesLabelBrowserClear = 'Clear all browser saves';

	l10nStrings.savesLabelBrowserExport = 'Export browser saves to bundle';

	l10nStrings.savesLabelBrowserImport = 'Import browser saves from bundle';

	l10nStrings.savesLabelDiskLoad = 'Load from disk';

	l10nStrings.savesLabelDiskSave = 'Save to disk';

	l10nStrings.savesTextBrowserAuto = 'Auto';

	l10nStrings.savesTextBrowserSlot = 'Slot';

	l10nStrings.savesTextNoDate = 'unknown date';


	/*******************************************************************************
		Dialog: Settings.
	*******************************************************************************/

	l10nStrings.settingsTitle = 'Settings';

	l10nStrings.settingsTextReset = 'Reset to Defaults';


	/*******************************************************************************
		Debugging: Error Views.
	*******************************************************************************/

	l10nStrings.errorViewTitle = 'Error';

	l10nStrings.errorViewLabelToggle = 'Toggle the error view';


	/*******************************************************************************
		Debugging: Debug bar.
	*******************************************************************************/

	l10nStrings.debugBarLabelToggle = 'Toggle the debug bar';

	l10nStrings.debugBarLabelViewsToggle = 'Toggle the debug views';

	l10nStrings.debugBarLabelWatchAdd = 'Add a new watch';

	l10nStrings.debugBarLabelWatchAll = 'Watch all';

	l10nStrings.debugBarLabelWatchClear = 'Clear all watches';

	l10nStrings.debugBarLabelWatchDelete = 'Delete this watch';

	l10nStrings.debugBarLabelWatchPlaceholder = 'variable name';

	l10nStrings.debugBarLabelPassagePlaceholder = 'passage name';

	l10nStrings.debugBarLabelPassagePlay = 'Play passage';

	l10nStrings.debugBarLabelWatchToggle = 'Toggle the watch panel';

	l10nStrings.debugBarMesgNoWatches = 'No watches set';

	l10nStrings.debugBarTextAdd = 'Add';

	l10nStrings.debugBarTextPassage = 'Passage';

	l10nStrings.debugBarTextViews = 'Views';

	l10nStrings.debugBarTextWatch = 'Watch';


	/*******************************************************************************
		Macros.
	*******************************************************************************/

	// (verb) rewind, revert
	l10nStrings.macroBackText = 'Back';

	// (verb) go/send back
	l10nStrings.macroReturnText = 'Return';


	/*******************************************************************************
		[DEPRECATED] Dialog: Autoload.
	*******************************************************************************/

	l10nStrings.autoloadTitle = 'Autoload';

	l10nStrings.autoloadMesgPrompt = 'An autosave exists. Load it now or go to the start?';

	l10nStrings.autoloadTextCancel = 'Go to start';

	l10nStrings.autoloadTextOk = 'Load autosave';


	/*******************************************************************************
		[DEPRECATED] Dialog: Jump To.
	*******************************************************************************/

	l10nStrings.jumptoTitle = 'Jump To';

	l10nStrings.jumptoMesgUnavailable = 'No jump points currently available\u2026';


	/*******************************************************************************
		[DEPRECATED] Dialog: Share.
	*******************************************************************************/

	l10nStrings.shareTitle = 'Share';
})();
