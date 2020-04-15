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
	l10nStrings.aborting = 'Abandon';
	l10nStrings.cancel   = 'Annuler';
	l10nStrings.close    = 'Fermer';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Erreur';
	l10nStrings.errorNonexistentPassage = 'le passage "{passage}" n\'existe pas';
	l10nStrings.errorSaveMissingData    = 'des éléments manquent dans cette sauvegarde. Soit ce fichier n\'en est pas une, soit il est corrompu';
	l10nStrings.errorSaveIdMismatch     = 'la sauvegarde ne semble pas provenir de cette {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Soit il manque à votre navigateur, soit il n\'autorise pas';
	l10nStrings._warningOutroDegraded = ', de ce fait l\'{identity} sera en mode dégradé. Cela n\'empechera le fonctionnement, mais vous risquez de rencontrer des erreurs.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} l\'API de stockage de données{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} certaines des fonctionnalités requises par l\'{identity}{_warningOutroDegraded}';

	/* Debug View. */
	l10nStrings.debugViewTitle  = 'Mode débogage';
	l10nStrings.debugViewToggle = 'Basculer en mode débogage';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Afficher/cacher la barre d\'interface';
	l10nStrings.uiBarBackward = 'Revenir en arrière dans l\'histoire de l\'{identity}';
	l10nStrings.uiBarForward  = 'Avancer en arrière dans l\'histoire de l\'{identity}';
	l10nStrings.uiBarJumpto   = 'Aller à un point précis de l\'histoire de l\'{identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Aller à'; //'au' if {passage} is next
	l10nStrings.jumptoTurn        = 'Bifurquer';
	l10nStrings.jumptoUnavailable = 'Aucun point d\'arriver n\'est disponible\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Sauvegardes';
	l10nStrings.savesDisallowed  = 'Les sauvegardes sont désactivées pour ce passage.';
	l10nStrings.savesEmptySlot   = '\u2014 emplacement vide \u2014';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} soit il n\'a pas la capacité pour prendre en charge les sauvegardes : elles seront désactivées pour cette session.';
	l10nStrings.savesLabelAuto   = 'Sauvegarde Auto';
	l10nStrings.savesLabelDelete = 'Effacer';
	l10nStrings.savesLabelExport = 'Enregistrer sur le disque\u2026';
	l10nStrings.savesLabelImport = 'Charger depuis le disque\u2026';
	l10nStrings.savesLabelLoad   = 'Charger';
	l10nStrings.savesLabelClear  = 'Effacer tout';
	l10nStrings.savesLabelSave   = 'Enregistrer';
	l10nStrings.savesLabelSlot   = 'Emplacement';
	l10nStrings.savesSavedOn     = 'Enregistré sur';
	l10nStrings.savesUnavailable = 'Aucun emplacement de sauvegarde n\'a été trouvé\u2026';
	l10nStrings.savesUnknownDate = 'inconnu';

	/* Settings. */
	l10nStrings.settingsTitle = 'Préférences';
	l10nStrings.settingsOff   = 'Off';
	l10nStrings.settingsOn    = 'On';
	l10nStrings.settingsReset = 'Réinitialiser';

	/* Restart. */
	l10nStrings.restartTitle  = 'Recommencer';
	l10nStrings.restartPrompt = 'Êtes vous sûr(e) de vouloir recommencer ? Tous progrès non sauvegardés seront perdus.';

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
