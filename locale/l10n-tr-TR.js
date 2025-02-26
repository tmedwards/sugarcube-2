/***********************************************************************************************************************

	l10n-tr-TR.js – Türkçe

	Localization by: erencanakyuz,

	Copyright © 2019–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/
/* global l10nStrings */
/* eslint-disable strict */

(function () {
	/*******************************************************************************
		General.
	*******************************************************************************/

	l10nStrings.textAbort = 'Durdur';

	l10nStrings.textAborting = 'Durduruluyor';

	l10nStrings.textCancel = 'İptal';

	l10nStrings.textClear = 'Temizle';

	l10nStrings.textClose = 'Kapat';

	l10nStrings.textDelete = 'Sil';

	l10nStrings.textExport = 'Dışa aktar';

	// In lowercase, if possible.
	l10nStrings.textIdentity = 'oyun';

	l10nStrings.textImport = 'İçe Aktar';

	l10nStrings.textLoad = 'Yükle';

	l10nStrings.textOff = 'Kapalı';

	l10nStrings.textOk = 'Tamam';

	l10nStrings.textOn = 'Açık';

	l10nStrings.textSave = 'Kaydet';

	// (noun) chance to act (in a game), moment, period
	l10nStrings.textTurn = 'Sıra';


	/*******************************************************************************
		Errors.
	*******************************************************************************/

	// NOTE: `passage` is supplied locally.
	l10nStrings.errorNonexistentPassage = '"{passage}" adlı pasaj bulunamadı';


	/*******************************************************************************
		Warnings.
	*******************************************************************************/

	l10nStrings.warningNoStorage = 'Tüm kullanılabilir depolama API\'leri eksik. Olası nedenler şunlar olabilir: Devre dışı bırakılmış üçüncü taraf çerez ayarları (Web Depolama’yı da etkiler) veya özel tarama modu.';

	l10nStrings.warningNoWebStorage = 'Web Depolama API\'si eksik, bu nedenle {textIdentity} bozulmuş bir modda çalışıyor. Devam edebilirsiniz fakat bazı bölümler düzgün çalışmayabilir.';

		l10nStrings.warningDegraded = '{textIdentity}\'yi desteklemek için gereken bazı kapasiteler eksik, bu nedenle bozulmuş bir modda çalışıyor. Devam edebilirsiniz fakat bazı bölümler düzgün çalışmayabilir.';

	l10nStrings.warningNoSaves = 'Kaydetmeleri desteklemek için gereken bazı kapasiteler eksik, bu nedenle bu oturumda kaydetmeler devre dışı bırakıldı.';


	/*******************************************************************************
		API: Save.
	*******************************************************************************/

	l10nStrings.saveErrorDisallowed = 'kaydetmeye şu anda izin verilmiyor.';

	l10nStrings.saveErrorDecodeFail = 'kaydetme çözümlenemedi, muhtemelen bozulma bozulma sebep olmuştur';

	l10nStrings.saveErrorDiskLoadFail = 'kayıt dosyası diskten yüklenemedi';

	l10nStrings.saveErrorIdMismatch = 'kaydetme yanlış {textIdentity} tan';

	l10nStrings.saveErrorInvalidData = 'kaydetme gerekli verilere sahip değil, bozulma sebep olmuş olabilir' ;

	l10nStrings.saveErrorNonexistent = 'kaydetme mevcut değil';


	/*******************************************************************************
		Base UI.
	*******************************************************************************/

	l10nStrings.uiBarLabelToggle = 'UI çubuğunu aç/kapat';

	l10nStrings.uiBarLabelBackward = '{textIdentity} geçmişi içinde geriye git';

	l10nStrings.uiBarLabelForward = '{textIdentity} geçmişi içinde ileriye git';

	// [DEPRECATED]
	l10nStrings.uiBarLabelJumpto = '{textIdentity} geçmişi içinde belirli bir noktaya atla';


	/*******************************************************************************
		Dialog: Alert.
	*******************************************************************************/

	l10nStrings.alertTitle = 'Uyarı';


	/*******************************************************************************
		Dialog: Restart.
	*******************************************************************************/

	l10nStrings.restartTitle = 'Yeniden Başlat';

	l10nStrings.restartMesgPrompt = 'Tüm kaydedilmemiş ilerleme kaybolacak, yeniden başlatmak istediğinizen emin misiniz?';


	/*******************************************************************************
		Dialog: Saves.
	*******************************************************************************/

	l10nStrings.continueTitle = 'Devam et';

	l10nStrings.savesTitle = 'Kayıtlar';

	l10nStrings.savesHeaderBrowser = 'Tarayıcıda';

	l10nStrings.savesHeaderDisk = 'Diskte';

	l10nStrings.savesLabelBrowserClear = 'Tüm tarayıcı kayıtlarını temizle';

	l10nStrings.savesLabelBrowserExport = 'Tarayıcı kayıtlarını dış pakete aktar';

	l10nStrings.savesLabelBrowserImport = 'Tarayıcı kayıtlarını paketten içe aktar';

	l10nStrings.savesLabelDiskLoad = 'Diskten yükle';

	l10nStrings.savesLabelDiskSave = 'Diske kaydet';

	l10nStrings.savesTextBrowserAuto = 'Otomatik';

	l10nStrings.savesTextBrowserSlot = 'Slot';

	l10nStrings.savesTextNoDate = 'bilinmeyen tarih';


	/*******************************************************************************
		Dialog: Settings.
	*******************************************************************************/

	l10nStrings.settingsTitle = 'Ayarlar';

	l10nStrings.settingsTextReset = 'Varsayılana sıfırla';


	/*******************************************************************************
		Debugging: Error Views.
	*******************************************************************************/

	l10nStrings.errorViewTitle = 'Hata';

	l10nStrings.errorViewLabelToggle = 'Hata görünümünü aç/kapat';


	/*******************************************************************************
		Debugging: Debug bar.
	*******************************************************************************/

	l10nStrings.debugBarLabelToggle = 'Hata ayıklama çubuğunu aç/kapat';

	l10nStrings.debugBarLabelViewsToggle = 'Hata ayıklama görünümlerini aç/kapat';

	l10nStrings.debugBarLabelWatchAdd = 'Yeni bir izleme ekle';

	l10nStrings.debugBarLabelWatchAll = 'Tümünü izle';

	l10nStrings.debugBarLabelWatchClear = 'Tüm izlemeleri temizle';

	l10nStrings.debugBarLabelWatchDelete = 'Bu izlemeyi sil';

	l10nStrings.debugBarLabelWatchPlaceholder = 'değişken adı';

	l10nStrings.debugBarLabelPassagePlaceholder = 'pasaj adı';

	l10nStrings.debugBarLabelPassagePlay = 'Pasajı oynat';

	l10nStrings.debugBarLabelWatchToggle = 'İzleme panelini aç/kapat';

	l10nStrings.debugBarMesgNoWatches = 'Hiç izleme ayarlanmadı';

	l10nStrings.debugBarTextAdd = 'Ekle';

	l10nStrings.debugBarTextPassage = 'Pasaj';

	l10nStrings.debugBarTextViews = 'Görünümler';

	l10nStrings.debugBarTextWatch = 'İzle';


	/*******************************************************************************
		Macros.
	*******************************************************************************/

	// (verb) rewind, revert
	l10nStrings.macroBackText = 'Geri';

	// (verb) go/send back
	l10nStrings.macroReturnText = 'Geri Dön';


	/*******************************************************************************
		[DEPRECATED] Dialog: Autoload.
	*******************************************************************************/

	l10nStrings.autoloadTitle = 'Otomatik Yükleme';

	l10nStrings.autoloadMesgPrompt = 'Bir otomatik kaydetme mevcut. Şimdi yüklemek ister misiniz, yoksa başlangıca mı gitmek istiyorsunuz?';

	l10nStrings.autoloadTextCancel = 'Başlangıca Git';

	l10nStrings.autoloadTextOk = 'Otomatik Kaydetmeyi Yükle';


	/*******************************************************************************
		[DEPRECATED] Dialog: Jump To.
	*******************************************************************************/

	l10nStrings.jumptoTitle = 'Atla';

	l10nStrings.jumptoMesgUnavailable = 'Şu anda atlama noktaları mevcut değil\u2026';


	/*******************************************************************************
		[DEPRECATED] Dialog: Share.
	*******************************************************************************/

	l10nStrings.shareTitle = 'Paylaş';
})();
