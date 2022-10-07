/***********************************************************************************************************************

	util/now.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Has */

/*
	Returns the number of milliseconds elapsed since some reference epoch.
*/
var now = (() => { // eslint-disable-line no-unused-vars, no-var
	// Use the `Performance` API, if available, failing over to `Date`.  The
	// `Performance` API is preferred for its monotonic clock, which is not
	// subject to the vagaries of timezone changes and leap periods.
	const clock = Has.performance ? performance : Date;

	function now() {
		return clock.now();
	}

	return now;
})();
