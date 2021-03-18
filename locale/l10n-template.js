/***********************************************************************************************************************

	l10n-template.js – Localization Template

	Copyright © 2019–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

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
	/* General. */
	l10nStrings.identity = 'game';
	l10nStrings.aborting = 'Aborting';
	l10nStrings.cancel   = 'Cancel';
	l10nStrings.close    = 'Close';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Error';
	l10nStrings.errorToggle             = 'Toggle the error view';
	l10nStrings.errorNonexistentPassage = 'the passage "{passage}" does not exist'; // NOTE: `passage` is supplied locally
	l10nStrings.errorSaveMissingData    = 'save is missing required data. Either the loaded file is not a save or the save has become corrupted';
	l10nStrings.errorSaveIdMismatch     = 'save is from the wrong {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Your browser either lacks or has disabled';
	l10nStrings._warningOutroDegraded = ', so this {identity} is running in a degraded mode. You may be able to continue, however, some parts may not work properly.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} the Web Storage API{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} some of the capabilities required by this {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Toggle the debug bar';
	l10nStrings.debugBarNoWatches   = '\u2014 no watches set \u2014';
	l10nStrings.debugBarAddWatch    = 'Add watch';
	l10nStrings.debugBarDeleteWatch = 'Delete watch';
	l10nStrings.debugBarWatchAll    = 'Watch all';
	l10nStrings.debugBarWatchNone   = 'Delete all';
	l10nStrings.debugBarLabelAdd    = 'Add';
	l10nStrings.debugBarLabelWatch  = 'Watch';
	l10nStrings.debugBarLabelTurn   = 'Turn'; // (noun) chance to act (in a game), moment, period
	l10nStrings.debugBarLabelViews  = 'Views';
	l10nStrings.debugBarViewsToggle = 'Toggle the debug views';
	l10nStrings.debugBarWatchToggle = 'Toggle the watch panel';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Toggle the UI bar';
	l10nStrings.uiBarBackward = 'Go backward within the {identity} history';
	l10nStrings.uiBarForward  = 'Go forward within the {identity} history';
	l10nStrings.uiBarJumpto   = 'Jump to a specific point within the {identity} history';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Jump To';
	l10nStrings.jumptoTurn        = 'Turn'; // (noun) chance to act (in a game), moment, period
	l10nStrings.jumptoUnavailable = 'No jump points currently available\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Saves';
	l10nStrings.savesDisallowed  = 'Saving has been disallowed on this passage.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} the capabilities required to support saves, so saves have been disabled for this session.';
	l10nStrings.savesLabelAuto   = 'Autosave';
	l10nStrings.savesLabelDelete = 'Delete';
	l10nStrings.savesLabelExport = 'Save to Disk\u2026';
	l10nStrings.savesLabelImport = 'Load from Disk\u2026';
	l10nStrings.savesLabelLoad   = 'Load';
	l10nStrings.savesLabelClear  = 'Delete All';
	l10nStrings.savesLabelSave   = 'Save';
	l10nStrings.savesLabelSlot   = 'Slot';
	l10nStrings.savesUnavailable = 'No save slots found\u2026';
	l10nStrings.savesUnknownDate = 'unknown';

	/* Settings. */
	l10nStrings.settingsTitle = 'Settings';
	l10nStrings.settingsOff   = 'Off';
	l10nStrings.settingsOn    = 'On';
	l10nStrings.settingsReset = 'Reset to Defaults';

	/* Restart. */
	l10nStrings.restartTitle  = 'Restart';
	l10nStrings.restartPrompt = 'Are you sure that you want to restart? Unsaved progress will be lost.';

	/* Share. */
	l10nStrings.shareTitle = 'Share';

	/* Alert. */
	l10nStrings.alertTitle = 'Alert';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Autoload';
	l10nStrings.autoloadCancel = 'Go to start';
	l10nStrings.autoloadOk     = 'Load autosave';
	l10nStrings.autoloadPrompt = 'An autosave exists. Load it now or go to the start?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Back'; // (verb) rewind, revert
	l10nStrings.macroReturnText = 'Return'; // (verb) go/send back
})();
