/***********************************************************************************************************************

	l10n/legacy.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	[DEPRECATED] The `strings` object is deprecated and should no longer be used.
	All new or updated translations should be based upon the `l10nStrings` object
	(see: `l10n/strings.js`).

	Legacy/existing uses of the `strings` object will be mapped to the `l10nStrings`
	object after user script evaluation.
*/
var strings = { // eslint-disable-line no-unused-vars, no-var
	errors    : {},
	warnings  : {},
	debugView : {},
	uiBar     : {},
	jumpto    : {},
	saves     : {},
	settings  : {},
	restart   : {},
	share     : {},
	autoload  : {},
	macros    : {
		back   : {},
		return : {}
	}
};
