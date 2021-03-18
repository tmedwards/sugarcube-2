/***********************************************************************************************************************

	es-UNKNOWN.js – Español

	Localization by: Raúl Castellano.

	Copyright © 2018 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
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
	l10nStrings.errorNonexistentPassage = 'el pasaje "{passage}" no existe';
	l10nStrings.errorSaveMissingData    = 'el guardado requiere datos no encontrados. O el archivo cargado no es un guardado o el guardado está corrupto';
	l10nStrings.errorSaveIdMismatch     = 'guardado erróneo {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Tu navegador carece o ha desactivado';
	l10nStrings._warningOutroDegraded = ', esta {identity} está funcionando en un modo degradado. Puedes continuar, sin embargo, algunas partes pueden no funcionar correctamente';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} el Almacenamiento Web API{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} algunas de las capacidades requeridas por esta {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Alternar la barra de depuración';
	l10nStrings.debugBarNoWatches   = '\u2014 no hay relojes estabecidos \u2014';
	l10nStrings.debugBarAddWatch    = 'Añadir reloj';
	l10nStrings.debugBarDeleteWatch = 'Borrar reloj';
	l10nStrings.debugBarWatchAll    = 'Ver todo';
	l10nStrings.debugBarWatchNone   = 'Borrar todo';
	l10nStrings.debugBarLabelAdd    = 'Añadir';
	l10nStrings.debugBarLabelWatch  = 'Ver';
	l10nStrings.debugBarLabelTurn   = 'Girar';
	l10nStrings.debugBarLabelViews  = 'Vistas';
	l10nStrings.debugBarViewsToggle = 'Alternar las vistas debug';
	l10nStrings.debugBarWatchToggle = 'Alternar el panel de reloj';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Alternar la barra de UI';
	l10nStrings.uiBarBackward = 'Volver atrás en la {identity} historia';
	l10nStrings.uiBarForward  = 'Avanzar en la {identity} historia';
	l10nStrings.uiBarJumpto   = 'Saltar a un punto específico de la {identity} historia';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Saltar A';
	l10nStrings.jumptoTurn        = 'Girar';
	l10nStrings.jumptoUnavailable = 'No hay puntos de salto actualmente disponibles\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Guardados';
	l10nStrings.savesDisallowed  = 'Guardar ha sido deshabilitado en este pasaje.';
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
	l10nStrings.savesUnavailable = 'No es encontraron espacios de guardado\u2026';
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

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Autocarga';
	l10nStrings.autoloadCancel = 'Ir al Comienzo';
	l10nStrings.autoloadOk     = 'Cargar autoguardado';
	l10nStrings.autoloadPrompt = 'Un autoguardado existe ¿Cargarlo ahora o ir al comienzo?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Atrás';
	l10nStrings.macroReturnText = 'Volver';
})();
