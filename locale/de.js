/***********************************************************************************************************************

	de.js – Deutsch

	Localization by: Phil Strahl <phil@pixelprophecy.com>, Grausicht.

	Copyright © 2017–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'spiel';
	l10nStrings.aborting = 'Vorzeitig abgebrochen';
	l10nStrings.cancel   = 'Abbrechen';
	l10nStrings.close    = 'Schließen';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Fehler';
	l10nStrings.errorToggle             = 'Fehleransicht umschalten';
	l10nStrings.errorNonexistentPassage = 'die Passage "{passage}" existiert nicht';
	l10nStrings.errorSaveMissingData    = 'Im Speicherstand fehlen benötigte Daten. Entweder ist die geladene Datei kein Speicherstand oder er ist defekt';
	l10nStrings.errorSaveIdMismatch     = 'Speicherstand ist vom falschen {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Dein Browser kann folgendes nicht darstellen, oder es ist deaktiviert';
	l10nStrings._warningOutroDegraded = '; darum läuft dieses {identity} in einem heruntergesetzten Modus. Du kannst zwar fortfahren, aber manche Teile funktionieren vielleicht nicht richtig.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} Das Web Storage API{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} Manche Features die für dieses {identity} benötigt werden{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Fehlersuche-Leiste umschalten';
	l10nStrings.debugBarNoWatches   = '\u2014 kein Beobachtungswert aktiv \u2014';
	l10nStrings.debugBarAddWatch    = 'Beobachtungswert hinzufügen';
	l10nStrings.debugBarDeleteWatch = 'Beobachtungswert löschen';
	l10nStrings.debugBarWatchAll    = 'Alle beobachten';
	l10nStrings.debugBarWatchNone   = 'Alle löschen';
	l10nStrings.debugBarLabelAdd    = 'Hinzufügen';
	l10nStrings.debugBarLabelWatch  = 'Beobachten';
	l10nStrings.debugBarLabelTurn   = 'Zug';
	l10nStrings.debugBarLabelViews  = 'Ansichten';
	l10nStrings.debugBarViewsToggle = 'Fehlersuche-Ansichten umschalten';
	l10nStrings.debugBarWatchToggle = 'Beobachtungs-Feld umschalten';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Menüleiste umschalten';
	l10nStrings.uiBarBackward = 'Einen Schritt im {identity}-Ablauf zurück';
	l10nStrings.uiBarForward  = 'Einen Schritt im {identity}-Ablauf nach vor';
	l10nStrings.uiBarJumpto   = 'Zu einem bestimmten Punkt im {identity}-Ablauf springen';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Springe zu';
	l10nStrings.jumptoTurn        = 'Zug';
	l10nStrings.jumptoUnavailable = 'Keine Sprungmarken verfügbar\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Speicherstände';
	l10nStrings.savesDisallowed  = 'Speichern ist in dieser Passage nicht erlaubt.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} Zum Speichern benötigte Features, darum ist es in dieser Sitzung nicht möglich, den Spielstand zu speichern.';
	l10nStrings.savesLabelAuto   = 'Auto-Speicherstand';
	l10nStrings.savesLabelDelete = 'Löschen';
	l10nStrings.savesLabelExport = 'Auf Datenträger speichern\u2026';
	l10nStrings.savesLabelImport = 'Von Datenträger laden\u2026';
	l10nStrings.savesLabelLoad   = 'Laden';
	l10nStrings.savesLabelClear  = 'Alle löschen';
	l10nStrings.savesLabelSave   = 'Speichern';
	l10nStrings.savesLabelSlot   = 'Slot';
	l10nStrings.savesUnavailable = 'Keine Speicherslots gefunden\u2026';
	l10nStrings.savesUnknownDate = 'unbekannt';

	/* Settings. */
	l10nStrings.settingsTitle = 'Einstellungen';
	l10nStrings.settingsOff   = 'Aus';
	l10nStrings.settingsOn    = 'Ein';
	l10nStrings.settingsReset = 'Auf Standardwerte zurücksetzen';

	/* Restart. */
	l10nStrings.restartTitle  = 'Neustart';
	l10nStrings.restartPrompt = 'Bist du sicher, dass du neu starten möchtest? Nicht gespeicherter Fortschritt ginge damit verloren.';

	/* Share. */
	l10nStrings.shareTitle = 'Teilen';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Automatisches Laden';
	l10nStrings.autoloadCancel = 'Gehe zum Start';
	l10nStrings.autoloadOk     = 'Auto-Speicherstand laden';
	l10nStrings.autoloadPrompt = 'Ein Auto-Speicherstand existiert bereits. Laden oder zurück an den Start?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Zurück';
	l10nStrings.macroReturnText = 'Zurückkehren';
})();
