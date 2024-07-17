/***********************************************************************************************************************

	util/onuseractivation.js

	Copyright © 2022–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Attempts to execute the given callback upon user activation triggering events
	using the given namespace.

	NOTE: The callback must return a `Promise`.
*/
var onUserActivation = (() => { // eslint-disable-line no-unused-vars, no-var
	/*
		Activation triggering input events.

		SEE: HTML Living Standard § 6.4 Tracking user activation
			* https://html.spec.whatwg.org/#tracking-user-activation

		SEE ALSO:
			* https://github.com/whatwg/html/issues/7341
			* https://github.com/whatwg/html/issues/3849
			* https://github.com/whatwg/html/issues/1903
			* https://docs.google.com/spreadsheets/d/1DGXjhQ6D3yZXIePOMo0dsd2agz0t5W7rYH1NwJ-QGJo/edit#gid=0
	*/
	const uaEvents = Object.freeze([
		'keydown',
		'mousedown',
		'pointerdown',
		'pointerup',
		'touchend'
	]);

	function onUserActivation(namespace, callback) {
		// Due to the complexity of identifying valid activation triggering
		// `keydown` events, we simply invoke the callback each time any of
		// the events fires until it stops rejecting with `NotAllowedError`.
		jQuery(document)
			.off(namespace)
			.on(uaEvents.map(name => `${name}${namespace}`).join(' '), ev => {
				callback(ev).then(
					() => jQuery(document).off(namespace),
					ex => {
						// Bail out if the rejection is not `NotAllowedError`.
						if (ex.name !== 'NotAllowedError') {
							jQuery(document).off(namespace);
							throw ex;
						}
					}
				);
			});
	}

	return onUserActivation;
})();
