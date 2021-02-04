/***********************************************************************************************************************

	lib/visibility.js

	Copyright © 2018–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

var Visibility = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*
		There are two versions of the Page Visibility API: First Edition and, the current,
		Second Edition (i.e. "Level 2").  First Edition is mentioned here only because some
		older browsers implement it, rather than the current specification.

		SEE:
			Second Edition : https://www.w3.org/TR/page-visibility/
			First Edition  : https://www.w3.org/TR/2013/REC-page-visibility-20130514/

		NOTE: Generally, all supported browsers change the visibility state when either switching tabs
		within the browser or minimizing the browser window.  Exceptions are noted below:
			* IE 9 doesn't support either version of the Page Visibility API.
			* Opera 12 (Presto) doesn't change the visibility state when the browser is minimized.
	*/

	// Vendor properties object.
	const vendor = (() => {
		try {
			return Object.freeze([
				// Specification.
				{
					hiddenProperty : 'hidden',          // boolean; historical in 2nd edition
					stateProperty  : 'visibilityState', // string, values: 'hidden', 'visible'; 1st edition had more values
					changeEvent    : 'visibilitychange'
				},

				// `webkit` prefixed: old Blink & WebKit.
				{
					hiddenProperty : 'webkitHidden',
					stateProperty  : 'webkitVisibilityState',
					changeEvent    : 'webkitvisibilitychange'
				},

				// `moz` prefixed: old Gecko, maybe Seamonkey.
				{
					hiddenProperty : 'mozHidden',
					stateProperty  : 'mozVisibilityState',
					changeEvent    : 'mozvisibilitychange'
				},

				// `ms` prefixed: IE 10.
				{
					hiddenProperty : 'msHidden',
					stateProperty  : 'msVisibilityState',
					changeEvent    : 'msvisibilitychange'
				}
			].find(vnd => vnd.hiddenProperty in document));
		}
		catch (ex) { /* no-op */ }

		return undefined;
	})();


	/*******************************************************************************
		API Functions.
	*******************************************************************************/

	function getVendor() {
		return vendor;
	}

	function getVisibility() {
		return vendor && document[vendor.stateProperty] || 'visible';
	}

	function isEnabled() {
		return Boolean(vendor);
	}

	function isHidden() {
		// return Boolean(vendor && document[vendor.stateProperty] === 'hidden');
		return Boolean(vendor && document[vendor.hiddenProperty]); // NOTE: Historical, but probably better for 1st edition.
	}


	/*******************************************************************************
		Module Exports.
	*******************************************************************************/

	return Object.freeze(Object.defineProperties({}, {
		// Functions.
		vendor    : { get : getVendor },
		state     : { get : getVisibility },
		isEnabled : { value : isEnabled },
		isHidden  : { value : isHidden },

		// Properties.
		hiddenProperty : { value : vendor && vendor.hiddenProperty },
		stateProperty  : { value : vendor && vendor.stateProperty },
		changeEvent    : { value : vendor && vendor.changeEvent }
	}));
})();
