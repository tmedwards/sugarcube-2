/***********************************************************************************************************************

	lib/browser.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

var Browser = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/* eslint-disable max-len */
	const userAgent = navigator.userAgent.toLowerCase();

	const winPhone = userAgent.includes('windows phone');
	const isMobile = Object.freeze({
		Android    : !winPhone && userAgent.includes('android'),
		BlackBerry : /blackberry|bb10/.test(userAgent),
		iOS        : !winPhone && /ip(?:hone|ad|od)/.test(userAgent),
		Opera      : !winPhone && (typeof window.operamini === 'object' || userAgent.includes('opera mini')),
		Windows    : winPhone || /iemobile|wpdesktop/.test(userAgent),

		any() {
			return isMobile.Android || isMobile.BlackBerry || isMobile.iOS || isMobile.Opera || isMobile.Windows;
		}
	});

	const isGecko = !isMobile.Windows && !/khtml|trident|edge/.test(userAgent) && userAgent.includes('gecko');

	const isIE      = !userAgent.includes('opera') && /msie|trident/.test(userAgent);
	const ieVersion = isIE
		? (() => {
			const ver = /(?:msie\s+|rv:)(\d+\.\d)/.exec(userAgent);
			return ver ? Number(ver[1]) : 0;
		})()
		: null;

	// opera <= 12: "opera/9.80 (windows nt 6.1; wow64) presto/2.12.388 version/12.16"
	// opera >= 15: "mozilla/5.0 (windows nt 6.1; wow64) applewebkit/537.36 (khtml, like gecko) chrome/28.0.1500.52 safari/537.36 opr/15.0.1147.130"
	const isOpera      = userAgent.includes('opera') || userAgent.includes(' opr/');
	const operaVersion = isOpera
		? (() => {
			const re  = new RegExp(`${/khtml|chrome/.test(userAgent) ? 'opr' : 'version'}\\/(\\d+\\.\\d+)`);
			const ver = re.exec(userAgent);
			return ver ? Number(ver[1]) : 0;
		})()
		: null;

	const isVivaldi = userAgent.includes('vivaldi');
	/* eslint-enable max-len */

	// Module Exports.
	return Object.freeze({
		userAgent,
		isMobile,
		isGecko,
		isIE,
		ieVersion,
		isOpera,
		operaVersion,
		isVivaldi
	});
})();
