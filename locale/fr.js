/***********************************************************************************************************************

	fr.js – Français

	Localization by: Pierre Kessler.

	Copyright © 2017 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/
(function () {
	/* General. */
	l10nStrings.identity = 'aventure';
	l10nStrings.aborting = 'Echec';
	l10nStrings.cancel   = 'Annuler';
	l10nStrings.close    = 'Fermer';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Erreur';
	l10nStrings.errorNonexistentPassage = 'le passage "{passage}" n\'existe pas.';
	l10nStrings.errorSaveMissingData    = 'des éléments manquent dans la sauvegarde. Soit ce fichier n\'est pas une sauvegarde; soit il est corrumpu';
	l10nStrings.errorSaveIdMismatch     = 'la sauvegarde provient d\'une fausse {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Votre navigateur est incapable ou n\'autorise pas de ';
	l10nStrings._warningOutroDegraded = '; ainsi {identity} fonctionne en mode dégradé. Vous pourrez peut-être continuer; mais certaines séquences risquent de ne pas fonctionner.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} l\'API de stockage de données{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} certaines des fonctionnalités requises par {identity}{_warningOutroDegraded}';

	/* Debug View. */
	l10nStrings.debugViewTitle  = 'Mode débogage';
	l10nStrings.debugViewToggle = 'Basculer le mode débogage';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Affiche/cache la barre d\'interface';
	l10nStrings.uiBarBackward = 'Aller en arrière dans l\'aventure {identity}';
	l10nStrings.uiBarForward  = 'Aller en arrière dans l\'aventure {identity}';
	l10nStrings.uiBarJumpto   = 'Aller à un point précis de l\'aventure {identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Sauter à';
	l10nStrings.jumptoTurn        = 'Tourner';
	l10nStrings.jumptoUnavailable = 'Aucun point de saut disponible maintenant\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Sauvegardes';
	l10nStrings.savesDisallowed  = 'Les sauvegardes sont désactivées pour ce passage.';
	l10nStrings.savesEmptySlot   = '\u2014 emplacement vide \u2014';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} n\'a pas la capacité requise : les sauvegardes sont désactivées pour cette session.';
	l10nStrings.savesLabelAuto   = 'Sauvegarde Auto';
	l10nStrings.savesLabelDelete = 'Effacer';
	l10nStrings.savesLabelExport = 'Enregistrer sur le disque\u2026';
	l10nStrings.savesLabelImport = 'Charger depuis le disque\u2026';
	l10nStrings.savesLabelLoad   = 'Charger';
	l10nStrings.savesLabelClear  = 'Effacer tout';
	l10nStrings.savesLabelSave   = 'Enregistrer';
	l10nStrings.savesLabelSlot   = 'Emplacement';
	l10nStrings.savesSavedOn     = 'Enregistré sur';
	l10nStrings.savesUnavailable = 'Aucun emplacement de sauvegarde trouvé\u2026';
	l10nStrings.savesUnknownDate = 'inconnu';

	/* Settings. */
	l10nStrings.settingsTitle = 'Préférences';
	l10nStrings.settingsOff   = 'Off';
	l10nStrings.settingsOn    = 'On';
	l10nStrings.settingsReset = 'Réinitialiser';

	/* Restart. */
	l10nStrings.restartTitle  = 'Recommencer';
	l10nStrings.restartPrompt = 'Êtes vous sûr(e) de vouloir recommencer ? Cette partie sera perdue.';

	/* Share. */
	l10nStrings.shareTitle = 'Partager';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Chargement Auto';
	l10nStrings.autoloadCancel = 'Aller au début';
	l10nStrings.autoloadOk     = 'Chargement d\'une sauvegarde automatique';
	l10nStrings.autoloadPrompt = 'Une sauvegarde automatique est disponible. La charger ou recommencer ?';

	/* Macros. */
	l10nStrings.macroBackText   = 'En arrière';
	l10nStrings.macroReturnText = 'Retour';
})();
