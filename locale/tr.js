/***********************************************************************************************************************

	tr.js – Türkçe

	Localization by: Guena Varia.

	Copyright © 2017–2019 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'oyun';
	l10nStrings.aborting = 'Durduruluyor';
	l10nStrings.cancel   = 'İptal';
	l10nStrings.close    = 'Kapat';
	l10nStrings.ok       = 'Tamam';

	/* Errors. */
	l10nStrings.errorTitle              = 'Hata';
	l10nStrings.errorToggle             = 'Hata görünümüne geç';
	l10nStrings.errorNonexistentPassage = 'bölüm "{passage}" mevcut değil';
	l10nStrings.errorSaveMissingData    = 'gerekli kayıt verisi eksik. Yüklenen dosya bir kayıt dosyası değil veya bozuldu';
	l10nStrings.errorSaveIdMismatch     = 'kayıt yanlış {identity}den';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Tarayıcınız eksik veya devre dışı';
	l10nStrings._warningOutroDegraded = ', yani bu {identity} bozulmuş bir modda çalışıyor. Devam etmek mümkün olabilir, ancak, bazı kısımlar düzgün çalışmayabilir.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} Web Depolama API\'si{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} bunun için lazım olan gereklilklerin bazıları {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Hata ayıklama çubuğunu aç/kapat';
	l10nStrings.debugBarNoWatches   = '\u2014 gözlem ayarlanmamış \u2014';
	l10nStrings.debugBarAddWatch    = 'Gözlem ekle';
	l10nStrings.debugBarDeleteWatch = 'Gözlemi sil';
	l10nStrings.debugBarWatchAll    = 'Tüm Gözlemler';
	l10nStrings.debugBarWatchNone   = 'Hepsini Sil';
	l10nStrings.debugBarLabelAdd    = 'Ekle';
	l10nStrings.debugBarLabelWatch  = 'Gözlem';
	l10nStrings.debugBarLabelTurn   = 'Dönüm';
	l10nStrings.debugBarLabelViews  = 'Görünümler';
	l10nStrings.debugBarViewsToggle = 'Hata ayıklama görünümünü değiştir';
	l10nStrings.debugBarWatchToggle = 'Gözlem panelini değiştir';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'UI barı değiştir';
	l10nStrings.uiBarBackward = '{identity} Geçmişinde geriye git';
	l10nStrings.uiBarForward  = '{identity} Geçmişinde ileriye git';
	l10nStrings.uiBarJumpto   = '{identity} Geçmişinde belirli bir noktaya git';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Atla';
	l10nStrings.jumptoTurn        = 'Dönüm';
	l10nStrings.jumptoUnavailable = 'Şu anda mevcut atlama noktası yok\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'Kayıtlar';
	l10nStrings.savesDisallowed  = 'Bu bölümde kayıt yapılmasına izin verilmedi.';
	l10nStrings.savesIncapable   = 'kayıtları desteklemek için lazım olan gereklilikler {_warningIntroLacking}, bu nedenle bu oturum için kayıtlat devre dışı bırakıldı.';
	l10nStrings.savesLabelAuto   = 'Oto Kayıt';
	l10nStrings.savesLabelDelete = 'Sil';
	l10nStrings.savesLabelExport = 'Diske kaydet\u2026';
	l10nStrings.savesLabelImport = 'Diskten yükle\u2026';
	l10nStrings.savesLabelLoad   = 'Yükle';
	l10nStrings.savesLabelClear  = 'Hepsini Sil';
	l10nStrings.savesLabelSave   = 'Kaydet';
	l10nStrings.savesLabelSlot   = 'Yuva';
	l10nStrings.savesUnavailable = 'Kayıt yuvası bulunamadı\u2026';
	l10nStrings.savesUnknownDate = 'bilinmeyen';

	/* Settings. */
	l10nStrings.settingsTitle = 'Ayarlar';
	l10nStrings.settingsOff   = 'Kapat';
	l10nStrings.settingsOn    = 'Aç';
	l10nStrings.settingsReset = 'Varsayılana Sıfırla';

	/* Restart. */
	l10nStrings.restartTitle  = 'Yeniden Başlat';
	l10nStrings.restartPrompt = 'Yeniden başlatmak istediğine emin misin ? Kaydedilmemiş ilerleme kaybedilecek.';

	/* Share. */
	l10nStrings.shareTitle = 'Paylaş';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Oto Yükleme';
	l10nStrings.autoloadCancel = 'Başla';
	l10nStrings.autoloadOk     = 'Oto kayıdı yükle';
	l10nStrings.autoloadPrompt = 'Bir oto kayıt var. Şimdi yükle yada başlangıca git ?';

	/* Macros. */
	l10nStrings.macroBackText   = 'Geri';
	l10nStrings.macroReturnText = 'Geri Dön';
})();
