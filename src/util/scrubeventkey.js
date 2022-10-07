/***********************************************************************************************************************

	util/scrubeventkey.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns a sanitized version of the given `KeyboardEvent.key` value from
	previous incarnations of the specification that should better reflect the
	current incarnation.
*/
var scrubEventKey = (() => { // eslint-disable-line no-unused-vars, no-var
	let separatorKey;
	let decimalKey;

	// Attempt to determine the player's 'Separator' and 'Decimal' key values
	// based on their current locale.
	if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function') {
		const match = new Intl.NumberFormat().format(111111.5).match(/(\D*)\d+(\D*)/);

		if (match) {
			separatorKey = match[1];
			decimalKey   = match[2];
		}
	}

	// Failover to US-centric values, if using `Intl.NumberFormat` failed.
	if (!separatorKey && !decimalKey) {
		separatorKey = ',';
		decimalKey   = '.';
	}

	// Maps older `KeyboardEvent.key` values to more current/correct ones.
	function scrubEventKey(key) {
		switch (key) {
			// case 'OS':                 return 'Meta'; // Unreliable.
			case 'Scroll':             return 'ScrollLock';
			case 'Spacebar':           return '\x20';
			case 'Left':               return 'ArrowLeft';
			case 'Right':              return 'ArrowRight';
			case 'Up':                 return 'ArrowUp';
			case 'Down':               return 'ArrowDown';
			case 'Del':                return 'Delete';
			case 'Crsel':              return 'CrSel';
			case 'Exsel':              return 'ExSel';
			case 'Esc':                return 'Escape';
			case 'Apps':               return 'ContextMenu';
			case 'Nonconvert':         return 'NonConvert';
			case 'MediaNextTrack':     return 'MediaTrackNext';
			case 'MediaPreviousTrack': return 'MediaTrackPrevious';
			case 'VolumeUp':           return 'AudioVolumeUp';
			case 'VolumeDown':         return 'AudioVolumeDown';
			case 'VolumeMute':         return 'AudioVolumeMute';
			case 'Zoom':               return 'ZoomToggle';
			case 'SelectMedia':        /* see below */
			case 'MediaSelect':        return 'LaunchMediaPlayer';
			case 'Add':                return '+';
			case 'Divide':             return '/';
			case 'Multiply':           return '*';
			case 'Subtract':           return '-';
			case 'Decimal':            return decimalKey;
			case 'Separator':          return separatorKey;
		}

		return key;
	}

	return scrubEventKey;
})();
