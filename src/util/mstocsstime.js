/***********************************************************************************************************************

	util/mstocsstime.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global getTypeOf */

/*
	Returns the CSS time string represented by the given number of milliseconds.
*/
function msToCSSTime(msec) { // eslint-disable-line no-unused-vars
	if (typeof msec !== 'number' || Number.isNaN(msec) || !Number.isFinite(msec)) {
		let what;

		switch (typeof msec) {
			case 'string':
				what = `"${msec}"`;
				break;

			case 'number':
				what = String(msec);
				break;

			default:
				what = getTypeOf(msec);
				break;
		}

		throw new TypeError(`invalid milliseconds value: ${what}`);
	}

	return `${msec}ms`;
}
