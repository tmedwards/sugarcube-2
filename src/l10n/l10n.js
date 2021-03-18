/***********************************************************************************************************************

	l10n/l10n.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global l10nStrings, strings */

var L10n = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Replacement pattern regular expressions.
	const _patternRe    = /\{\w+\}/g;
	const _hasPatternRe = new RegExp(_patternRe.source); // to drop the global flag


	/*******************************************************************************************************************
		Localization Functions.
	*******************************************************************************************************************/
	function l10nInit() {
		/* legacy */
		_mapStringsToL10nStrings();
		/* /legacy */
	}

	/*******************************************************************************************************************
		Localized String Functions.
	*******************************************************************************************************************/
	function l10nGet(ids, overrides) {
		if (!ids) {
			return '';
		}

		const id = (idList => {
			let selectedId;
			idList.some(id => {
				if (l10nStrings.hasOwnProperty(id)) {
					selectedId = id;
					return true;
				}

				return false;
			});
			return selectedId;
		})(Array.isArray(ids) ? ids : [ids]);

		if (!id) {
			return '';
		}

		const maxIterations = 50;
		let processed = l10nStrings[id];
		let iteration = 0;

		while (_hasPatternRe.test(processed)) {
			if (++iteration > maxIterations) {
				throw new Error('L10n.get exceeded maximum replacement iterations, probable infinite loop');
			}

			// Possibly required by some old buggy browsers.
			_patternRe.lastIndex = 0;

			processed = processed.replace(_patternRe, pat => {
				const subId = pat.slice(1, -1);

				if (overrides && overrides.hasOwnProperty(subId)) {
					return overrides[subId];
				}
				else if (l10nStrings.hasOwnProperty(subId)) {
					return l10nStrings[subId];
				}
			});
		}

		return processed;
	}


	/*******************************************************************************************************************
		Legacy Functions.
	*******************************************************************************************************************/
	/*
		Attempt to map legacy `strings` object properties to the `l10nStrings` object.
	*/
	function _mapStringsToL10nStrings() {
		if (strings && Object.keys(strings).length > 0) {
			Object.keys(l10nStrings).forEach(id => {
				try {
					let value;

					switch (id) {
					/*
						General.
					*/
					case 'identity': value = strings.identity; break;
					case 'aborting': value = strings.aborting; break;
					case 'cancel':   value = strings.cancel; break;
					case 'close':    value = strings.close; break;
					case 'ok':       value = strings.ok; break;

					/*
						Errors.
					*/
					case 'errorTitle':              value = strings.errors.title; break;
					case 'errorNonexistentPassage': value = strings.errors.nonexistentPassage; break;
					case 'errorSaveMissingData':    value = strings.errors.saveMissingData; break;
					case 'errorSaveIdMismatch':     value = strings.errors.saveIdMismatch; break;

					/*
						Warnings.
					*/
					case 'warningDegraded': value = strings.warnings.degraded; break;

					/*
						Debug View.
					*/
					case 'debugViewTitle':  value = strings.debugView.title; break;
					case 'debugViewToggle': value = strings.debugView.toggle; break;

					/*
						UI bar.
					*/
					case 'uiBarToggle':   value = strings.uiBar.toggle; break;
					case 'uiBarBackward': value = strings.uiBar.backward; break;
					case 'uiBarForward':  value = strings.uiBar.forward; break;
					case 'uiBarJumpto':   value = strings.uiBar.jumpto; break;

					/*
						Jump To.
					*/
					case 'jumptoTitle':       value = strings.jumpto.title; break;
					case 'jumptoTurn':        value = strings.jumpto.turn; break;
					case 'jumptoUnavailable': value = strings.jumpto.unavailable; break;

					/*
						Saves.
					*/
					case 'savesTitle':       value = strings.saves.title; break;
					case 'savesDisallowed':  value = strings.saves.disallowed; break;
					case 'savesIncapable':   value = strings.saves.incapable; break;
					case 'savesLabelAuto':   value = strings.saves.labelAuto; break;
					case 'savesLabelDelete': value = strings.saves.labelDelete; break;
					case 'savesLabelExport': value = strings.saves.labelExport; break;
					case 'savesLabelImport': value = strings.saves.labelImport; break;
					case 'savesLabelLoad':   value = strings.saves.labelLoad; break;
					case 'savesLabelClear':  value = strings.saves.labelClear; break;
					case 'savesLabelSave':   value = strings.saves.labelSave; break;
					case 'savesLabelSlot':   value = strings.saves.labelSlot; break;
					case 'savesUnavailable': value = strings.saves.unavailable; break;
					case 'savesUnknownDate': value = strings.saves.unknownDate; break;

					/*
						Settings.
					*/
					case 'settingsTitle': value = strings.settings.title; break;
					case 'settingsOff':   value = strings.settings.off; break;
					case 'settingsOn':    value = strings.settings.on; break;
					case 'settingsReset': value = strings.settings.reset; break;

					/*
						Restart.
					*/
					case 'restartTitle':  value = strings.restart.title; break;
					case 'restartPrompt': value = strings.restart.prompt; break;

					/*
						Share.
					*/
					case 'shareTitle': value = strings.share.title; break;

					/*
						Alert.
					*/
					case 'alertTitle': /* none */ break;

					/*
						Autoload.
					*/
					case 'autoloadTitle':  value = strings.autoload.title; break;
					case 'autoloadCancel': value = strings.autoload.cancel; break;
					case 'autoloadOk':     value = strings.autoload.ok; break;
					case 'autoloadPrompt': value = strings.autoload.prompt; break;

					/*
						Macros.
					*/
					case 'macroBackText':   value = strings.macros.back.text; break;
					case 'macroReturnText': value = strings.macros.return.text; break;
					}

					if (value) {
						l10nStrings[id] = value.replace(/%\w+%/g, pat => `{${pat.slice(1, -1)}}`);
					}
				}
				catch (ex) { /* no-op */ }
			});
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		/*
			Localization Functions.
		*/
		init : { value : l10nInit },

		/*
			Localized String Functions.
		*/
		get : { value : l10nGet }
	}));
})();
