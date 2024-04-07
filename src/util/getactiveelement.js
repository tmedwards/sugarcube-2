/***********************************************************************************************************************

	util/getactiveelement.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns `document.activeElement` or `null`.
*/
function getActiveElement() { // eslint-disable-line no-unused-vars
	// IE9 contains a bug where trying to access the active element of an iframe's
	// parent document—i.e., `window.parent.document.activeElement`—will throw an
	// exception, so we must allow for an exception to be thrown.
	//
	// We could simply return `undefined` here, but since the API's default behavior
	// should be to return `document.body` or, when there is no selection, `null`,
	// we choose to return `null` in all non-element cases—i.e., whether it returns
	// `null` or throws an exception.  Just a bit of normalization.
	try {
		return document.activeElement || null;
	}
	catch (ex) {
		return null;
	}
}
