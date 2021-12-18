/***********************************************************************************************************************

	nl.js – Dutch

	Localization by: Sjoerd Hekking.

	Copyright © 2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/
/* global l10nStrings */
/* eslint-disable strict */

(function () {
	/* General. */
	l10nStrings.identity = 'Spel';
	l10nStrings.aborting = 'Afbreken';
	l10nStrings.cancel   = 'Annuleren';
	l10nStrings.close    = 'Sluiten';
	l10nStrings.ok       = 'Oke';

	/* Errors. */
	l10nStrings.errorTitle              = 'Fout';
	l10nStrings.errorToggle             = 'Schakel de foutweergave in';
	l10nStrings.errorNonexistentPassage = 'De passage "{passage}" bestaat niet'; // NOTE: `passage` is supplied locally
	l10nStrings.errorSaveDiskLoadFailed = 'gefaald om de opslag te laden vanuit de schijf';
	l10nStrings.errorSaveMissingData    = 'De opslag ontbreekt de vereiste gegevens. Ofwel het geladen bestand is geen save of de save is beschadigd geraakt';
	l10nStrings.errorSaveIdMismatch     = 'De opslag is van de foute {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Uw browser ontbreekt of heeft uitgeschakeld';
	l10nStrings._warningOutroDegraded = ', dus deze {identity} draait in een gedegradeerde modus. Mogelijk kunt u doorgaan, maar sommige onderdelen werken mogelijk niet goed.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} de webopslag-API{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} enkele van de mogelijkheden die vereist zijn voor deze {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Schakel de foutopsporingsbalk in';
	l10nStrings.debugBarNoWatches   = '\u2014 geen kijkers ingesteld \u2014';
	l10nStrings.debugBarAddWatch    = 'Voeg kijker toe';
	l10nStrings.debugBarDeleteWatch = 'Verwijder kijker';
	l10nStrings.debugBarWatchAll    = 'Bekijk alles';
	l10nStrings.debugBarWatchNone   = 'Verwijder alles';
	l10nStrings.debugBarLabelAdd    = 'Toevoegen';
	l10nStrings.debugBarLabelWatch  = 'Kijker';
	l10nStrings.debugBarLabelTurn   = 'Ronde'; // (noun) chance to act (in a game), moment, period
	l10nStrings.debugBarLabelViews  = 'Weergave';
	l10nStrings.debugBarViewsToggle = 'Schakel de foutopsporingsweergaven in';
	l10nStrings.debugBarWatchToggle = 'Schakel het kijkpaneel in';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Schakel de UI-balk in';
	l10nStrings.uiBarBackward = 'Ga terug in de {identity} geschiedenis';
	l10nStrings.uiBarForward  = 'Ga vooruit binnen de {identity} geschiedenis';
	l10nStrings.uiBarJumpto   = 'Spring naar een specifiek punt in de {identity} geschiedenis';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Spring naar';
	l10nStrings.jumptoTurn        = 'Ronde'; // (noun) chance to act (in a game), moment, period
	l10nStrings.jumptoUnavailable = 'Momenteel geen historiepunten beschikbaar\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Opslaan';
	l10nStrings.savesDisallowed  = 'Op deze passage is opslaan niet toegestaan.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} de mogelijkheden die nodig zijn om saves te ondersteunen, dus saves zijn uitgeschakeld voor deze sessie.';
	l10nStrings.savesLabelAuto   = 'Auto-opslag';
	l10nStrings.savesLabelDelete = 'Verwijder';
	l10nStrings.savesLabelExport = 'Sla op naar opslag\u2026';
	l10nStrings.savesLabelImport = 'Laad vanuit opslag\u2026';
	l10nStrings.savesLabelLoad   = 'Laad';
	l10nStrings.savesLabelClear  = 'Verwijder alles';
	l10nStrings.savesLabelSave   = 'Opslaan';
	l10nStrings.savesLabelSlot   = 'Slot';
	l10nStrings.savesUnavailable = 'Geen opslag sloten gevonden\u2026';
	l10nStrings.savesUnknownDate = 'onbekend';

	/* Settings. */
	l10nStrings.settingsTitle = 'Instellingen';
	l10nStrings.settingsOff   = 'Uit';
	l10nStrings.settingsOn    = 'Aan';
	l10nStrings.settingsReset = 'Herstel naar begin waarde';

	/* Restart. */
	l10nStrings.restartTitle  = 'Herstart';
	l10nStrings.restartPrompt = 'Weet u zeker dat u opnieuw wilt opstarten? Niet-opgeslagen voortgang gaat verloren.';

	/* Share. */
	l10nStrings.shareTitle = 'Delen';

	/* Alert. */
	l10nStrings.alertTitle = 'Waarschuwing';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Automatisch laden';
	l10nStrings.autoloadCancel = 'Ga naar start';
	l10nStrings.autoloadOk     = 'Laad automatische opslag';
	l10nStrings.autoloadPrompt = 'Er bestaat een autosave. Nu laden of naar start gaan?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Terugspoelen'; // (verb) rewind, revert
	l10nStrings.macroReturnText = 'Teruggaan'; // (verb) go/send back
})();
