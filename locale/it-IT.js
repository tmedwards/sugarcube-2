/***********************************************************************************************************************

	it-IT.js – Italiano

	Localization by: Karime Chehbouni.

	Copyright © 2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'gioco';
	l10nStrings.aborting = 'Interrompendo';
	l10nStrings.cancel   = 'Annulla';
	l10nStrings.close    = 'Chiudi';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Errore';
	l10nStrings.errorToggle             = 'Attiva visualizzazione errori';
	l10nStrings.errorNonexistentPassage = 'il passaggio "{passage}" non esiste'; // NOTE: `passage` is supplied locally
	l10nStrings.errorSaveMissingData    = 'al salvataggio mancano i dati richiesti. Il file caricato non è un salvataggio o il salvataggio è danneggiato';
	l10nStrings.errorSaveIdMismatch     = 'il salvataggio non proviene da {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Il tuo browser necessita di \\ ha disabilitato';
	l10nStrings._warningOutroDegraded = ', quindi quest\'{identity} è in esecuzione in una modalità degradata. Puoi continuare, tuttavia alcune parti potrebbero non funzionare correttamente';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} l\'API di archiviazione web{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} alcune delle capacità richieste da {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Mostra la barra debug';
	l10nStrings.debugBarNoWatches   = '\u2014 nessuna sorveglianza attiva \u2014';
	l10nStrings.debugBarAddWatch    = 'Aggiungi sorveglianza';
	l10nStrings.debugBarDeleteWatch = 'Elimina sorveglianza';
	l10nStrings.debugBarWatchAll    = 'Sorveglia tutti';
	l10nStrings.debugBarWatchNone   = 'Elimina tutti';
	l10nStrings.debugBarLabelAdd    = 'Aggiungi';
	l10nStrings.debugBarLabelWatch  = 'Sorveglia';
	l10nStrings.debugBarLabelTurn   = 'Turno'; // (noun) chance to act (in a game), moment, period
	l10nStrings.debugBarLabelViews  = 'Visualizzazioni';
	l10nStrings.debugBarViewsToggle = 'Mostra visualizzazioni debug';
	l10nStrings.debugBarWatchToggle = 'Mostra pannello di sorveglianza';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Mostra barra UI';
	l10nStrings.uiBarBackward = 'Vai indietro nella cronologia di {identity}';
	l10nStrings.uiBarForward  = 'Vai avanti nella cronologia di {identity}';
	l10nStrings.uiBarJumpto   = 'Salta a un punto specifico nella cronologia di {identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Salta A';
	l10nStrings.jumptoTurn        = 'Turno'; // (noun) chance to act (in a game), moment, period
	l10nStrings.jumptoUnavailable = 'Nessun punto di salto attualmente disponibile\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Salvataggi';
	l10nStrings.savesDisallowed  = 'Salvare non è stato consentito in questo passaggio.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} le capacità necessarie per supportare salvataggi, quindi i salvataggi sono stati disabilitati per questa sessione.';
	l10nStrings.savesLabelAuto   = 'Salvataggio Automatico';
	l10nStrings.savesLabelDelete = 'Elimina';
	l10nStrings.savesLabelExport = 'Salva su Disco\u2026';
	l10nStrings.savesLabelImport = 'Carica dal Disco\u2026';
	l10nStrings.savesLabelLoad   = 'Carica';
	l10nStrings.savesLabelClear  = 'Elimina Tutto';
	l10nStrings.savesLabelSave   = 'Salva';
	l10nStrings.savesLabelSlot   = 'Slot';
	l10nStrings.savesUnavailable = 'Nessuno slot di salvataggio trovato\u2026';
	l10nStrings.savesUnknownDate = 'sconosciuto';

	/* Settings. */
	l10nStrings.settingsTitle = 'Impostazioni';
	l10nStrings.settingsOff   = 'Off';
	l10nStrings.settingsOn    = 'On';
	l10nStrings.settingsReset = 'Ripristina Predefiniti';

	/* Restart. */
	l10nStrings.restartTitle  = 'Ricomincia';
	l10nStrings.restartPrompt = 'Siete certi di voler ricominciare? Il progresso non salvato verrà perso.';

	/* Share. */
	l10nStrings.shareTitle = 'Condividi';

	/* Alert. */
	l10nStrings.alertTitle = 'Segnalazione';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Caricamento Automatico';
	l10nStrings.autoloadCancel = 'Vai all\'inizio';
	l10nStrings.autoloadOk     = 'Carica salvataggio automatico';
	l10nStrings.autoloadPrompt = 'È presente un salvataggio automatico. Caricarlo adesso o andare all\'inizio?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Indietro'; // (verb) rewind, revert
	l10nStrings.macroReturnText = 'Ritorna'; // (verb) go/send back
})();
