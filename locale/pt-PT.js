/***********************************************************************************************************************

	pt-PT.js – Português (Portugal)

	Localization by: Magma.

	Copyright © 2017–2018 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'jogo';
	l10nStrings.aborting = 'Abortar';
	l10nStrings.cancel   = 'Cancelar';
	l10nStrings.close    = 'Fechar';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Erro';
	l10nStrings.errorToggle             = 'Alternar a visualização de erro';
	l10nStrings.errorNonexistentPassage = 'a passagem "{passage}" não existe';
	l10nStrings.errorSaveMissingData    = 'o ficheiro não contem a informação necessária. Ou o ficheiro carregado não é correcto ou foi corrumpido';
	l10nStrings.errorSaveIdMismatch     = 'o ficheiro não pertence ao {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'O seu browser não tem esta opção ou a opção foi desabilitada';
	l10nStrings._warningOutroDegraded = ', portanto este {identity} não está a correr a 100%. Pode continuar, mas algumas partes não irão funcionar.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} o Web Storage API{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} algum componente requerido por este {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Alternar a barra de depuração';
	l10nStrings.debugBarNoWatches   = '\u2014 sem vigias \u2014';
	l10nStrings.debugBarAddWatch    = 'Adicionar vigia';
	l10nStrings.debugBarDeleteWatch = 'Apagar vigia';
	l10nStrings.debugBarWatchAll    = 'Vigiar tudo';
	l10nStrings.debugBarWatchNone   = 'Apagar tudo';
	l10nStrings.debugBarLabelAdd    = 'Adicionar';
	l10nStrings.debugBarLabelWatch  = 'Vigiar';
	l10nStrings.debugBarLabelTurn   = 'Virar';
	l10nStrings.debugBarLabelViews  = 'Visualizações';
	l10nStrings.debugBarViewsToggle = 'Alternar visualizações de depuração';
	l10nStrings.debugBarWatchToggle = 'Alternar o painel de vigia';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Alternar a barra de interface';
	l10nStrings.uiBarBackward = 'Voltar um passo atrás na história do {identity}';
	l10nStrings.uiBarForward  = 'Ir um passo a frente na história do {identity}';
	l10nStrings.uiBarJumpto   = 'Saltar para um ponto especifico na história do {identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Saltar para';
	l10nStrings.jumptoTurn        = 'Vez';
	l10nStrings.jumptoUnavailable = 'Não existem pontos de salto disponíveis\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Jogos Guardados';
	l10nStrings.savesDisallowed  = 'Não se pode guardar o jogo nesta passagem. A opção foi desabilitada.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} assim sendo como não é possivel guardar, a opção está desabilitada nesta sessão.';
	l10nStrings.savesLabelAuto   = 'Guardado Automaticamente';
	l10nStrings.savesLabelDelete = 'Apagar';
	l10nStrings.savesLabelExport = 'Salvar para o Disco\u2026';
	l10nStrings.savesLabelImport = 'Carregar do Disco\u2026';
	l10nStrings.savesLabelLoad   = 'Carregar';
	l10nStrings.savesLabelClear  = 'Apagar Tudo';
	l10nStrings.savesLabelSave   = 'Salvar';
	l10nStrings.savesLabelSlot   = 'Espaço Vazio';
	l10nStrings.savesUnavailable = 'Não existem Jogos Guardados\u2026';
	l10nStrings.savesUnknownDate = 'data desconhecida';

	/* Settings. */
	l10nStrings.settingsTitle = 'Opções';
	l10nStrings.settingsOff   = 'Desabilitar';
	l10nStrings.settingsOn    = 'Habilitar';
	l10nStrings.settingsReset = 'Reset para configurações iniciais';

	/* Restart. */
	l10nStrings.restartTitle  = 'Recomeçar';
	l10nStrings.restartPrompt = 'Tem a certeza que quer recomeçar? Qualquer progresso que não tenha sido guardado será perdido.';

	/* Share. */
	l10nStrings.shareTitle = 'Partilhar';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Guardado Automaticamente';
	l10nStrings.autoloadCancel = 'Voltar ao ínicio';
	l10nStrings.autoloadOk     = 'Carregar jogo guardado automaticamente';
	l10nStrings.autoloadPrompt = 'Um jogo guardado automaticamente está disponivel. Carregar agora ou voltar ao ínicio?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Para trás';
	l10nStrings.macroReturnText = 'Voltar';
})();
