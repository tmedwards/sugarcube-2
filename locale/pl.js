/***********************************************************************************************************************

	pl.js – Polski

	Localization by: ciupac.

	Copyright © 2018 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

	For more information about the guidelines used to create this localization, see:
		http://www.motoslave.net/sugarcube/2/docs/#guide-localization

------------------------------------------------------------------------------------------------------------------------

	Notes from the original translator (ciupac)
	===========================================

	The following Polish localization represents an attempt to find a middle ground
	between a literal translation and idiomatic use of Polish IT language.

	I have included comments next to potentionally controversial choices, and also
	to mark where the current logical organization is incompatible with the language
	itself (`BUG:`) and where certain things had to be rephrased for lack of the
	equivalent term(s) (`NOTE:`) or due to grammatical/semantic ambiguity.

	I am not a professional translator, and therefore I relied mostly on my intuition,
	which may have been incorrect. Input from persons with more experience in this
	field is appreciated.

***********************************************************************************************************************/

(function () {
	/* General. */
	// BUG: Polish has cases, so one noun in the nominative won’t cut it.
	l10nStrings.identity = 'gra';
	// NOTE: No direct, single corresponding term that would be equivalent to "Aborting" in the use context (what I wrote here instead is "Operation interrupted").
	l10nStrings.aborting = 'Przerwano operację';
	l10nStrings.cancel   = 'Anuluj';
	l10nStrings.close    = 'Zamknij';
	l10nStrings.ok       = 'OK';

	/* Errors. */
	l10nStrings.errorTitle              = 'Błąd';
	// NOTE: No single-word term for verb "toggle" in Polish, must use the equivalent of "show/hide" everywhere.
	l10nStrings.errorToggle             = 'Pokaż/ukryj widok błędu';
	// NOTE: The quoting style of Polish opens with U+201E („) and closes with U+201D (”). Second level uses single-quote equivalents U+201A and U+2019.
	l10nStrings.errorNonexistentPassage = 'żądany ustęp „{passage}” nie istnieje';
	l10nStrings.errorSaveMissingData    = 'wczytany plik nie zawiera wymaganych danych. Plik może nie być plikiem zapisu gry lub może być uszkodzony';
	l10nStrings.errorSaveIdMismatch     = 'wczytany plik zapisu nie pochodzi z tej gry';

	/* Warnings. */
	l10nStrings._warningIntroLacking  = 'Twoja przeglądarka nie wspiera lub ma wyłączone';
	l10nStrings._warningOutroDegraded = ', dlatego {identity} pracuje w zubożonym trybie. Jest możliwe, że da się kontynuować grę, lecz niektóre elementy mogą nie działać.';
	// NOTE: Included English keyword for use in Google searches.
	l10nStrings.warningNoWebStorage   = '{_warningIntroLacking} funkcje przechowywania danych (Web Storage API){_warningOutroDegraded}';
	l10nStrings.warningDegraded       = '{_warningIntroLacking} niektóre funkcje wymagane przez tą grę{_warningOutroDegraded}';

	/* Debug bar. */
	l10nStrings.debugBarToggle      = 'Pokaż/ukryj okienko debuggera';
	l10nStrings.debugBarNoWatches   = '\u2014 brak ustawionych podglądów zmiennych \u2014';
	l10nStrings.debugBarAddWatch    = 'Dodaj podgląd';
	l10nStrings.debugBarDeleteWatch = 'Usuń podgląd';
	l10nStrings.debugBarWatchAll    = 'Włącz podgląd wszystkiego';
	l10nStrings.debugBarWatchNone   = 'Usuń wszystkie podglądy';
	l10nStrings.debugBarLabelAdd    = 'Dodaj';
	l10nStrings.debugBarLabelWatch  = 'Podglądy';
	l10nStrings.debugBarLabelTurn   = 'Tura';
	l10nStrings.debugBarLabelViews  = 'Widoki';
	// NOTE: I have found "views" to be too vague, so I mention that they refer to macros.
	l10nStrings.debugBarViewsToggle = 'Pokaż/ukryj widoki debugowania makr';
	// NOTE: Same, wrt. "watches" referring to variables.
	l10nStrings.debugBarWatchToggle = 'Pokaż/ukryj panel podglądów zmiennych';

	/* UI bar. */
	l10nStrings.uiBarToggle   = 'Pokaż/ukryj panel boczny';
	l10nStrings.uiBarBackward = 'Krok do tyłu w historii gry';
	l10nStrings.uiBarForward  = 'Krok do przodu w historii gry';
	l10nStrings.uiBarJumpto   = 'Skocz do konkretnego punktu gry';

	/* Jump To. */
	l10nStrings.jumptoTitle       = 'Skocz do';
	l10nStrings.jumptoTurn        = 'Tura';
	l10nStrings.jumptoUnavailable = 'Obecnie brak punktów, do których można by przeskoczyć\u2026';

	/* Saves. */
	// NOTE: Assuming "Save" is used as a verb here.
	l10nStrings.savesTitle       = 'Zapisz';
	l10nStrings.savesDisallowed  = 'Zapisywanie zostało wyłączone w tym ustępie.';
	l10nStrings.savesIncapable   = '{_warningIntroLacking} funkcje niezbędne do zapisu danych, zatem zapis i odczyt danych nie jest możliwy w tej sesji.';
	l10nStrings.savesLabelAuto   = 'Zapis automatyczny';
	l10nStrings.savesLabelDelete = 'Usuń';
	// NOTE: Using equivalent expression "Save to file" as it is more commonly encountered in Polish.
	l10nStrings.savesLabelExport = 'Zapisz do pliku\u2026';
	// NOTE: Using equivalent "Read from file", see reasons above.
	l10nStrings.savesLabelImport = 'Wczytaj z pliku\u2026';
	l10nStrings.savesLabelLoad   = 'Wczytaj';
	l10nStrings.savesLabelClear  = 'Usuń wszystkie';
	// BUG: "Save" not clear if used as a noun or a verb; cannot be overloaded like this by some languages. Assuming verb.
	l10nStrings.savesLabelSave   = 'Zapisz';
	// NOTE: No direct equivalent to "Slot" noun that would be commonly-accepted in computing terminology; using generic term meaning "place", "space", "location" instead.
	l10nStrings.savesLabelSlot   = 'Miejsce';
	l10nStrings.savesUnavailable = 'Nie znaleziono miejsc do zapisu danych\u2026';
	// NOTE: Assuming we're referring to a date, which is feminine.
	l10nStrings.savesUnknownDate = 'nieznana';

	/* Settings. */
	l10nStrings.settingsTitle = 'Ustawienia';
	l10nStrings.settingsOff   = 'Wyłączone';
	l10nStrings.settingsOn    = 'Włączone';
	l10nStrings.settingsReset = 'Przywróć wartości domyślne';

	/* Restart. */
	l10nStrings.restartTitle  = 'Uruchom ponownie';
	// NOTE: Mirroring the usual habit of putting an exclamation mark after a data loss warning.
	l10nStrings.restartPrompt = 'Czy jesteś pewien, że chcesz zacząć grę od początku? Niezapisany postęp zostanie utracony!';

	/* Share. */
	l10nStrings.shareTitle = 'Udostępnij';

	/* Autoload. */
	l10nStrings.autoloadTitle  = 'Załadowanie automatyczne';
	l10nStrings.autoloadCancel = 'Rozpocznij od początku';
	l10nStrings.autoloadOk     = 'Wczytaj plik automatycznego zapisu';
	l10nStrings.autoloadPrompt = 'Istnieje plik automatycznego zapisu. Załadować go teraz czy zacząć od początku?';

	/* Macros. */
	// NOTE: These two are contentious, since there is no clear-cut difference.
	l10nStrings.macroBackText   = 'Wstecz';
	l10nStrings.macroReturnText = 'Wróć';
})();
