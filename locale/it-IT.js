/***********************************************************************************************************************

	locale/TEMPLATE.js – Localization Template

	Copyright © 2019–2025 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
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

		* The development version, which is on the `develop` branch.
			https://raw.githubusercontent.com/tmedwards/sugarcube-2/develop/locale/TEMPLATE.js

		* The current release version, which is on the `master` branch.
			https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/locale/TEMPLATE.js

	You will likely want to use the development version.
*/
(() => {
	/*******************************************************************************
		General.
	*******************************************************************************/

	l10nStrings.textAbort = 'Interrompi';

	l10nStrings.textAborting = 'Interruzione in corso';

	l10nStrings.textCancel = 'Annulla';

	l10nStrings.textClear = 'Pulizia';

	l10nStrings.textClose = 'Chiudi';

	l10nStrings.textDelete = 'Elimina';

	l10nStrings.textExport = 'Esporta';

	// In lowercase, if possible.
	l10nStrings.textIdentity = 'gioco';

	l10nStrings.textImport = 'Importa';

	l10nStrings.textLoad = 'Carica';

	l10nStrings.textOff = 'Spento';

	l10nStrings.textOk = 'OK';

	l10nStrings.textOn = 'Acceso';

	l10nStrings.textSave = 'Salva';

	// (noun) chance to act (in a game), moment, period
	l10nStrings.textTurn = 'Turno';


	/*******************************************************************************
		Errors.
	*******************************************************************************/

	// NOTE: `passage` is supplied locally.
	l10nStrings.errorNonexistentPassage = 'il passaggio "{passage}" non esiste';


	/*******************************************************************************
		Warnings.
	*******************************************************************************/

	l10nStrings.warningNoStorage = 'Mancano tutte le API di archiviazione utilizzabili. Le cause possibili sono una impostazione dei cookie di terze parti disabilitata, che influisce anche sull\'archiviazione web, o una modalità di navigazione in incognito.';

	l10nStrings.warningDegraded = 'Mancano alcune funzionalità necessarie per supportare {textIdentity}, che sta girando in modalità ridotta. È possibile continuare, ma alcuni componenti potrebbero non funzionare correttamente.';

	l10nStrings.warningNoSaves = 'Mancano alcune funzionalità necessarie per far funzionare i salvataggi, e per questo i salvataggi sono stati disattivati per questa sessione.';


	/*******************************************************************************
		API: Save.
	*******************************************************************************/

	l10nStrings.saveErrorDisallowed = 'I salvataggi sono al momento disabilitati.';

	l10nStrings.saveErrorDecodeFail = 'impossibile decodificare il salvataggio, probabilmente a causa di corruzione dei dati';

	l10nStrings.saveErrorDiskLoadFail = 'caricamento da disco del file di salvataggio fallito';

	l10nStrings.saveErrorIdMismatch = 'il salvataggio proviene dal contasto "{textIdentity}" che è sbagliato';

	l10nStrings.saveErrorInvalidData = 'mancano dati necessari dentro il salvataggio, probabilmente a causa di corruzione dei dati';

	l10nStrings.saveErrorNonexistent = 'il salvataggio non esiste';


	/*******************************************************************************
		Base UI.
	*******************************************************************************/

	l10nStrings.uiBarLabelToggle = 'attiva/disattiva barra UI';

	l10nStrings.uiBarLabelBackward = 'Torna indietro nella cronologia di {textIdentity}';

	l10nStrings.uiBarLabelForward = 'Vai avanti nella cronologia di {textIdentity}';

	// [DEPRECATED]
	l10nStrings.uiBarLabelJumpto = 'Salta ad un punto specifico nella cronologia di {textIdentity}';


	/*******************************************************************************
		Dialog: Alert.
	*******************************************************************************/

	l10nStrings.alertTitle = 'Attenzione';


	/*******************************************************************************
		Dialog: Restart.
	*******************************************************************************/

	l10nStrings.restartTitle = 'Riavvio';

	l10nStrings.restartMesgPrompt = 'Tutto il lavoro non salvato verrà perso. Confermi che vuoi riavviare?';


	/*******************************************************************************
		Dialog: Saves.
	*******************************************************************************/

	l10nStrings.continueTitle = 'Continua';

	l10nStrings.savesTitle = 'Salvataggi';

	l10nStrings.savesHeaderBrowser = 'Nel Browser';

	l10nStrings.savesHeaderDisk = 'Su Disco';

	l10nStrings.savesLabelBrowserClear = 'Pulisci tutti i salvataggi fatti nel browser';

	l10nStrings.savesLabelBrowserExport = 'Esporta in blocco i salvataggi fatti nel browser';

	l10nStrings.savesLabelBrowserImport = 'Importa un blocco di salvataggi nel browser';

	l10nStrings.savesLabelDiskLoad = 'Carica da disco';

	l10nStrings.savesLabelDiskSave = 'Salva su disco';

	l10nStrings.savesTextBrowserAuto = 'Auto';

	l10nStrings.savesTextBrowserSlot = 'Intervallo';

	l10nStrings.savesTextNoDate = 'data sconosciuta';


	/*******************************************************************************
		Dialog: Settings.
	*******************************************************************************/

	l10nStrings.settingsTitle = 'Preferenze';

	l10nStrings.settingsTextReset = 'Reimposta ai Valori di Default';


	/*******************************************************************************
		Debugging: Error Views.
	*******************************************************************************/

	l10nStrings.errorViewTitle = 'Errore';

	l10nStrings.errorViewLabelToggle = 'Attiva/Disattiva vista errori';


	/*******************************************************************************
		Debugging: Debug bar.
	*******************************************************************************/

	l10nStrings.debugBarLabelToggle = 'Toggle barra di debug';

	l10nStrings.debugBarLabelViewsToggle = 'Attiva/Disattiva viste di debug';

	l10nStrings.debugBarLabelWatchAdd = 'Aggiungi un nuovo watch';

	l10nStrings.debugBarLabelWatchAll = 'Tutti i watch';

	l10nStrings.debugBarLabelWatchClear = 'Pulisci tutti i watch';

	l10nStrings.debugBarLabelWatchDelete = 'Cancella questo watch';

	l10nStrings.debugBarLabelWatchPlaceholder = 'nome variabile';

	l10nStrings.debugBarLabelPassagePlaceholder = 'nome del passaggio';

	l10nStrings.debugBarLabelPassagePlay = 'Esegui passaggio';

	l10nStrings.debugBarLabelWatchToggle = 'Attiva/Disattiva pannello dei watch';

	l10nStrings.debugBarMesgNoWatches = 'Non ci sono watch';

	l10nStrings.debugBarTextAdd = 'Aggiungi';

	l10nStrings.debugBarTextPassage = 'Passaggio';

	l10nStrings.debugBarTextViews = 'Viste';

	l10nStrings.debugBarTextWatch = 'Watch';


	/*******************************************************************************
		Macros.
	*******************************************************************************/

	// (verb) rewind, revert
	l10nStrings.macroBackText = 'Indietro';

	// (verb) go/send back
	l10nStrings.macroReturnText = 'Ritorna';


	/*******************************************************************************
		[DEPRECATED] Dialog: Autoload.
	*******************************************************************************/

	l10nStrings.autoloadTitle = 'Auto-caricamento';

	l10nStrings.autoloadMesgPrompt = 'Esiste un salvataggio automatico. Caricarlo ora o andare all\'inizio?';

	l10nStrings.autoloadTextCancel = 'Vai all\'inizio';

	l10nStrings.autoloadTextOk = 'Carica salvataggio automatico';


	/*******************************************************************************
		[DEPRECATED] Dialog: Jump To.
	*******************************************************************************/

	l10nStrings.jumptoTitle = 'Vai a';

	l10nStrings.jumptoMesgUnavailable = 'Non ci sono punti disponibili verso cui saltare\u2026';


	/*******************************************************************************
		[DEPRECATED] Dialog: Share.
	*******************************************************************************/

	l10nStrings.shareTitle = 'Condividi';
})();
