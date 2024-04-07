/***********************************************************************************************************************

	util/samevaluezero.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns whether the given values pass a SameValueZero comparison.

	SEE: https://tc39.es/ecma262/#sec-samevaluezero
*/
function sameValueZero(a, b) { // eslint-disable-line no-unused-vars
	return a === b || a !== a && b !== b;
}
