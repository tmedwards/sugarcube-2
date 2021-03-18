/***********************************************************************************************************************

	es-ES.js – Español (Castellano)

	Localization by: Gerardo Galán.

	Copyright © 2020 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'juego';
	l10nStrings.aborting = 'Abortar';
	l10nStrings.cancel   = 'Cancelar';
	l10nStrings.close    = 'Cerrar';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Error';
	l10nStrings.errorToggle             = 'Cambiar la vista de error';
	l10nStrings.errorNonexistentPassage = 'el pasaje "{passage}" no existe'; // NOTE: `passage` is supplied locally
	l10nStrings.errorSaveMissingData    = 'La partida requiere datos no encontrados. O el archivo cargado no es una partida guardada o la partida guardada está corrupta';
	l10nStrings.errorSaveIdMismatch     = 'Partida errónea {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Tu navegador carece o ha desactivado';
	l10nStrings._warningOutroDegraded = ', este {identity} está funcionando en un modo degradado. Puedes continuar, sin embargo, algunas partes pueden no funcionar correctamente';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} el Almacenamiento Web API{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} algunas de las capacidades requeridas por este {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Alternar la barra de depuración';
	l10nStrings.debugBarNoWatches   = '\u2014 no hay observadores estabecidos \u2014';
	l10nStrings.debugBarAddWatch    = 'Añadir observador';
	l10nStrings.debugBarDeleteWatch = 'Borrar observador';
	l10nStrings.debugBarWatchAll    = 'Ver todo';
	l10nStrings.debugBarWatchNone   = 'Borrar todo';
	l10nStrings.debugBarLabelAdd    = 'Añadir';
	l10nStrings.debugBarLabelWatch  = 'Ver';
	l10nStrings.debugBarLabelTurn   = 'Girar'; // (noun) chance to act (in a game), moment, period
	l10nStrings.debugBarLabelViews  = 'Vistas';
	l10nStrings.debugBarViewsToggle = 'Alternar las vistas debug';
	l10nStrings.debugBarWatchToggle = 'Alternar el panel de observadores';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Alternar la barra de UI';
	l10nStrings.uiBarBackward = 'Volver atrás en la historia del {identity}';
	l10nStrings.uiBarForward  = 'Avanzar en la historia del {identity}';
	l10nStrings.uiBarJumpto   = 'Saltar a un punto específico de la {identity} historia';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Saltar A';
	l10nStrings.jumptoTurn        = 'Girar'; // (noun) chance to act (in a game), moment, period
	l10nStrings.jumptoUnavailable = 'No hay puntos de salto disponibles actualmente\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Guardar';
	l10nStrings.savesDisallowed  = 'Guardar se ha deshabilitado en este pasaje.';
	l10nStrings.savesEmptySlot   = '\u2014 Guardado vacío \u2014';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} las capacidades requeridas para proporcionar guardados, entonces los guardados han sido deshabilitados para esta sesión.';
	l10nStrings.savesLabelAuto   = 'Autoguardado';
	l10nStrings.savesLabelDelete = 'Borrar';
	l10nStrings.savesLabelExport = 'Guardar en Disco\u2026';
	l10nStrings.savesLabelImport = 'Cargar desde Disco\u2026';
	l10nStrings.savesLabelLoad   = 'Cargar';
	l10nStrings.savesLabelClear  = 'Borrar todo';
	l10nStrings.savesLabelSave   = 'Guardar';
	l10nStrings.savesLabelSlot   = 'Espacio';
	l10nStrings.savesSavedOn     = 'Guardado';
	l10nStrings.savesUnavailable = 'No se encontraron espacios de guardado\u2026';
	l10nStrings.savesUnknownDate = 'desconocido';

	/* Settings. */
	l10nStrings.settingsTitle = 'Ajustes';
	l10nStrings.settingsOff   = 'Off';
	l10nStrings.settingsOn    = 'On';
	l10nStrings.settingsReset = 'Usar predeterminados';

	/* Restart. */
	l10nStrings.restartTitle  = 'Reiniciar';
	l10nStrings.restartPrompt = '¿Estás seguro de que quieres reiniciar? Todo progreso no guardado caerá en el olvido.';

	/* Share. */
	l10nStrings.shareTitle = 'Compartir';

	/* Alert. */
	l10nStrings.alertTitle = 'Alerta';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Autocargar';
	l10nStrings.autoloadCancel = 'Ir al Comienzo';
	l10nStrings.autoloadOk     = 'Cargar autoguardado';
	l10nStrings.autoloadPrompt = 'Un autoguardado existe ¿Cargarlo ahora o ir al comienzo?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Atrás'; // (verb) rewind, revert
	l10nStrings.macroReturnText = 'Volver'; // (verb) go/send back
})();
