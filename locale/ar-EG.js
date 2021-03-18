/***********************************************************************************************************************

	ar-EG.js – العربية (مصر)
	Localization by: Mustafa Rawi

	Copyright © 2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

***********************************************************************************************************************/

(function () {
	/* General. */
	l10nStrings.identity = 'لعبة';
	l10nStrings.aborting = 'جاري الإلغاء';
	l10nStrings.cancel   = 'إلغاء';
	l10nStrings.close    = 'إغلاق';
	l10nStrings.ok       = 'موافق';

	/* Errors. */
	l10nStrings.errorTitle              = 'خطأ';
	l10nStrings.errorToggle             = 'تبديل عرض واجهة الأخطاء';
	l10nStrings.errorNonexistentPassage = 'القطعة "{passage}" غير موجودة'; // NOTE: `passage` is supplied locally
	l10nStrings.errorSaveMissingData    = 'خاصية الحفظ لم تجد بعض البيانات. إما أن الملف المحمل ليس ملفاً خاصة بالحفظ أو أن الملف متضرر';
	l10nStrings.errorSaveIdMismatch     = 'ملف الحفظ من {identity} خاطئة';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'متصفحك إما يفتقر إلى أو تم تعطيل ';
	l10nStrings._warningOutroDegraded = ', لذا فهذه {identity} تعمل في وضع محدود. يمكنك المتابعة إلا أن بعض أجزاءها قد لا تعمل بشكل صحيح.';
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} واجهة برمجة تطبيقات ويب للحفظ{_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} بعض الخصائص المطلوبة في {identity}{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'تبديل عرض شريط استكشاف الأخطاء';
	l10nStrings.debugBarNoWatches   = '\u2014 لم يتم تحديد مراقبين \u2014';
	l10nStrings.debugBarAddWatch    = 'إضافة مراقب';
	l10nStrings.debugBarDeleteWatch = 'حذف مراقب';
	l10nStrings.debugBarWatchAll    = 'مراقبة الكل';
	l10nStrings.debugBarWatchNone   = 'حذف الكل';
	l10nStrings.debugBarLabelAdd    = 'إضافة';
	l10nStrings.debugBarLabelWatch  = 'مراقبة';
	l10nStrings.debugBarLabelTurn   = 'الدور'; // (noun) chance to act (in a game), moment, period
	l10nStrings.debugBarLabelViews  = 'الواجهات';
	l10nStrings.debugBarViewsToggle = 'تبديل عرض واجهات استكشاف الأخطاء';
	l10nStrings.debugBarWatchToggle = 'تبديل عرض لوحة المراقبة';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'تبديل عرض شريط الواجهة';
	l10nStrings.uiBarBackward = 'تراجع عبر تاريخ {identity}';
	l10nStrings.uiBarForward  = 'تقدم عبر تاريخ  {identity}';
	l10nStrings.uiBarJumpto   = 'قفز إلى نقطة معينة في تاريخ {identity}';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'قفز إلى';
	l10nStrings.jumptoTurn        = 'دور'; // (noun) chance to act (in a game), moment, period
	l10nStrings.jumptoUnavailable = 'لا توجد نقاط قفز متاحة حالياً\u2026';

	/* Saves. */
	l10nStrings.savesTitle       = 'الحفظ';
	l10nStrings.savesDisallowed  = 'تم تعطيل خاصية الحفظ في هذه القطعة.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} يفتقر إلى إمكانيات مطلوبة لدعم عملية الحفظ، لذا تم تعطيلها في هذه الجلسة.';
	l10nStrings.savesLabelAuto   = 'الحفظ التلقائي';
	l10nStrings.savesLabelDelete = 'حذف';
	l10nStrings.savesLabelExport = 'حفظ إلى جهازك\u2026';
	l10nStrings.savesLabelImport = 'تحميل من جهازك\u2026';
	l10nStrings.savesLabelLoad   = 'تحميل';
	l10nStrings.savesLabelClear  = 'حذف الكل';
	l10nStrings.savesLabelSave   = 'حفظ';
	l10nStrings.savesLabelSlot   = 'حاوية';
	l10nStrings.savesUnavailable = 'لم يمكن العثور على حاويات حفظ\u2026';
	l10nStrings.savesUnknownDate = 'غير معروف';

	/* Settings. */
	l10nStrings.settingsTitle = 'الإعدادات';
	l10nStrings.settingsOff   = 'معطل';
	l10nStrings.settingsOn    = 'مفعل';
	l10nStrings.settingsReset = 'استرداد الافتراضيات';

	/* Restart. */
	l10nStrings.restartTitle  = 'إعادة تشغيل';
	l10nStrings.restartPrompt = 'هل ترغب حقاً في إعادة التشغيل من البداية؟ ستفقد أي تقدم حققته ولم تحفظه.';

	/* Share. */
	l10nStrings.shareTitle = 'مشاركة';

	/* Alert. */
	l10nStrings.alertTitle = 'تنبيه';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'تحميل تلقائي';
	l10nStrings.autoloadCancel = 'الذهاب للبداية';
	l10nStrings.autoloadOk     = 'تحميل من الحفظ التلقائي';
	l10nStrings.autoloadPrompt = 'تم العثور على حفظ تلقائي. هل ترغب في تحميله أم تريد الذهاب للبداية؟';

	/* Macros. */
	l10nStrings.macroBackText   = 'تراجع'; // (verb) rewind, revert
	l10nStrings.macroReturnText = 'عودة'; // (verb) go/send back
})();
