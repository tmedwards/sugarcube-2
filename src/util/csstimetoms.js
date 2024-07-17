/***********************************************************************************************************************

	util/csstimetoms.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns the number of miliseconds represented by the given CSS time string.
*/
const cssTimeToMS = (() => { // eslint-disable-line no-unused-vars, no-var
	const cssTimeRE = /^([+-]?(?:\d*\.)?\d+)([Mm]?[Ss])$/;

	function cssTimeToMS(cssTime) {
		const match = cssTimeRE.exec(String(cssTime));

		if (match === null) {
			throw new SyntaxError(`invalid time value syntax: "${cssTime}"`);
		}

		let msec = Number(match[1]);

		if (match[2].length === 1) {
			msec *= 1000;
		}

		if (Number.isNaN(msec) || !Number.isFinite(msec)) {
			throw new RangeError(`invalid time value: "${cssTime}"`);
		}

		return msec;
	}

	return cssTimeToMS;
})();
