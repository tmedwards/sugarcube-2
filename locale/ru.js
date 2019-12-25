/***********************************************************************************************************************

	ru.js – Ру́сский

	Localization by: Konstantin Kitmanov.

	Copyright © 2017 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/localization.html

***********************************************************************************************************************/
(function () {
	/* General. */
	l10nStrings.identity = 'игры';
	l10nStrings.aborting = 'Идет отмена';
	l10nStrings.cancel   = 'Отменить';
	l10nStrings.close    = 'Закрыть';
	l10nStrings.ok       = 'ОК';

	/* Errors. */
	l10nStrings.errorTitle              = 'Ошибка';
	l10nStrings.errorNonexistentPassage = 'Параграф "{passage}" не существует';
	l10nStrings.errorSaveMissingData    = 'в сохранении нет необходимых данных. Сохранение было повреждено или загружен неверный файл';
	l10nStrings.errorSaveIdMismatch     = 'сохранение от другой {identity}';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Приносим извинения! В вашем браузере отсутствуют либо выключены необходимые функции';
	l10nStrings._warningOutroDegraded = ', так что включен ограниченный режим. Вы можете продолжать, но кое-что может работать некорректно.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} (Web Storage API){_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} (необходимые для {identity}){_warningOutroDegraded}';

	/* Debug View. */
	l10nStrings.debugViewTitle  = 'Режим отладки';
	l10nStrings.debugViewToggle = 'Переключить режим отладки';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Открыть/закрыть панель навигации';
	l10nStrings.uiBarBackward = 'Назад по истории {identity}';
	l10nStrings.uiBarForward  = 'Вперед по истории {identity}';
	l10nStrings.uiBarJumpto   = 'Перейти в определенную точку истории {identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Перейти на';
	l10nStrings.jumptoTurn        = 'Ход';
	l10nStrings.jumptoUnavailable = 'В данный момент нет точек для перехода\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Сохранения';
	l10nStrings.savesDisallowed  = 'На этом параграфе сохранение запрещено.';
	l10nStrings.savesEmptySlot   = '\u2014 пустой слот \u2014';
	l10nStrings.savesIncapable   = '{_warningIntroLacking}, так что сохранения невозможны в текущей сессии';
	l10nStrings.savesLabelAuto   = 'Автосохранение';
	l10nStrings.savesLabelDelete = 'Удалить';
	l10nStrings.savesLabelExport = 'Сохранить на диск\u2026';
	l10nStrings.savesLabelImport = 'Загрузить с диска\u2026';
	l10nStrings.savesLabelLoad   = 'Загрузить';
	l10nStrings.savesLabelClear  = 'Удалить все';
	l10nStrings.savesLabelSave   = 'Сохранить';
	l10nStrings.savesLabelSlot   = 'Слот';
	l10nStrings.savesSavedOn     = 'Сохранено: ';
	l10nStrings.savesUnavailable = 'Слоты сохранения не обнаружены\u2026';
	l10nStrings.savesUnknownDate = 'неизвестно';

	/* Settings. */
	l10nStrings.settingsTitle = 'Настройки';
	l10nStrings.settingsOff   = 'Выкл.';
	l10nStrings.settingsOn    = 'Вкл.';
	l10nStrings.settingsReset = 'По умолчанию';

	/* Restart. */
	l10nStrings.restartTitle  = 'Начать с начала';
	l10nStrings.restartPrompt = 'Вы уверены, что хотите начать сначала? Несохраненный прогресс будет утерян.';

	/* Share. */
	l10nStrings.shareTitle = 'Поделиться';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Автосохранение';
	l10nStrings.autoloadCancel = 'Начать заново';
	l10nStrings.autoloadOk     = 'Загрузить сохранение';
	l10nStrings.autoloadPrompt = 'Найдено автосохранение. Загрузить его или начать с начала?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Назад';
	l10nStrings.macroReturnText = 'Вернуться';
})();
