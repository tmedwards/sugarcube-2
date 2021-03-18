/***********************************************************************************************************************

	pt-BR.js – Português (Brazil)

	Localization by: Janos Biro.

	Copyright © 2018 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'jogo';
	l10nStrings.aborting = 'Abortando';
	l10nStrings.cancel   = 'Cancelar';
	l10nStrings.close    = 'Fechar';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Erro';
	l10nStrings.errorToggle             = 'Alternar a visualização de erro';
	l10nStrings.errorNonexistentPassage = 'a passagem "{passage}" não existe';
	l10nStrings.errorSaveMissingData    = 'arquivo está incompleto. Ou não é um arquivo de jogo ou o arquivo está corrompido';
	l10nStrings.errorSaveIdMismatch     = 'arquivo do {identity} errado';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Seu navegador ou não tem ou desativou';
	l10nStrings._warningOutroDegraded = ', então esse {identity} está rodando no modo degradado. Você pode continuar, porém algumas partes podem não funcionar direito.';
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
	l10nStrings.uiBarBackward = 'Voltar na história do {identity}';
	l10nStrings.uiBarForward  = 'Avançar na história do {identity}';
	l10nStrings.uiBarJumpto   = 'Pular para um ponto específico da história do {identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Pular para';
	l10nStrings.jumptoTurn        = 'Vez';
	l10nStrings.jumptoUnavailable = 'Sem pontos de salto disponíveis\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Salvar';
	l10nStrings.savesDisallowed  = 'O salvamento foi desativado nessa passagem.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} o suporte necessário, então a opção de salvar está desativada nesta seção.';
	l10nStrings.savesLabelAuto   = 'Salvamento automático';
	l10nStrings.savesLabelDelete = 'Apagar';
	l10nStrings.savesLabelExport = 'Salvar para arquivo\u2026';
	l10nStrings.savesLabelImport = 'Carregar de arquivo\u2026';
	l10nStrings.savesLabelLoad   = 'Carregar';
	l10nStrings.savesLabelClear  = 'Apagar tudo';
	l10nStrings.savesLabelSave   = 'Salvar';
	l10nStrings.savesLabelSlot   = 'Espaço vazio';
	l10nStrings.savesUnavailable = 'Sem espaço vazio\u2026';
	l10nStrings.savesUnknownDate = 'data desconhecida';

	/* Settings. */
	l10nStrings.settingsTitle = 'Configurações';
	l10nStrings.settingsOff   = 'Desligado';
	l10nStrings.settingsOn    = 'Ligado';
	l10nStrings.settingsReset = 'Restaurar padrões';

	/* Restart. */
	l10nStrings.restartTitle  = 'Recomeçar';
	l10nStrings.restartPrompt = 'Tem certeza que quer recomeçar? O progresso não salvo será perdido.';

	/* Share. */
	l10nStrings.shareTitle = 'Compartilhar';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Salvamento automático';
	l10nStrings.autoloadCancel = 'Ir para o começo';
	l10nStrings.autoloadOk     = 'Carregar o salvamento automático';
	l10nStrings.autoloadPrompt = 'Um salvamento automático existe. Carregar agora ou ir para o começo?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Voltar';
	l10nStrings.macroReturnText = 'Retornar';
})();
