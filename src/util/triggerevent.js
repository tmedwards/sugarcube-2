/***********************************************************************************************************************

	util/triggerevent.js

	Copyright © 2022–2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Triggers an event with the given name and options on the given element.

	NOTE: Intended to replace SugarCube's use of jQuery's event triggering methods
	as they treat synthetic events suboptimally when compared to standard events.

	Options object properties:
		// Whether the event bubbles (default: true).
		bubbles?: boolean
		// Whether the event is cancelable (default: true).
		cancelable?: boolean
		// Custom data sent with the event (default: none).
		detail?: any
*/
var triggerEvent = (() => { // eslint-disable-line no-unused-vars, no-var
	const createEvent = (() => {
		try {
			// Test if `CustomEvent` is supported.
			new CustomEvent('click', { bubbles : true });

			// If the `CustomEvent` API is supported, then return a version of
			// the `createEvent()` function that uses it.
			return function createEvent(name, options) {
				return new CustomEvent(name, options);
			};
		}
		catch (ex) {
			// function getEventInterface(iname) {
			// 	// SEE: https://dom.spec.whatwg.org/#dom-document-createevent
			// 	switch (iname) {
			// 		case "beforeunloadevent":
			// 			return 'BeforeUnloadEvent';
			// 		case "compositionevent":
			// 			return 'CompositionEvent';
			// 		case "customevent":
			// 			return 'CustomEvent';
			// 		case "devicemotionevent":
			// 			return 'DeviceMotionEvent';
			// 		case "deviceorientationevent":
			// 			return 'DeviceOrientationEvent';
			// 		case "dragevent":
			// 			return 'DragEvent';
			// 		case "focusevent":
			// 			return 'FocusEvent';
			// 		case "hashchangeevent":
			// 			return 'HashChangeEvent';
			// 		case "keyboardevent":
			// 			return 'KeyboardEvent';
			// 		case "messageevent":
			// 			return 'MessageEvent';
			// 		case "mouseevent":
			// 			return 'MouseEvent';
			// 		case "storageevent":
			// 			return 'StorageEvent';
			// 		case "textevent":
			// 			return 'CompositionEvent';
			// 		case "touchevent":
			// 			return 'TouchEvent';
			// 		case "uievent":
			// 			return 'UIEvent';
			//
			// 		default:
			// 			return 'Event';
			// 	}
			// }

			// Elsewise, return a version of the `createEvent()` function that
			// uses the older, deprecated `document.createEvent()` API.
			return function createEvent(name, options) {
				const {
					bubbles,
					cancelable,
					detail
				} = options;
				const event = document.createEvent('Event');

				if (typeof detail !== 'undefined') {
					event.detail = detail;
				}

				event.initEvent(name, bubbles, cancelable);

				return event;
			};
		}
	})();

	function hasHandlerAttr(elem, name) {
		const attrName = `on${name}`;
		return typeof document[attrName] !== 'undefined' && typeof elem[attrName] === 'function';
	}

	function triggerEvent(elem, name, options) {
		const event = createEvent(name, Object.assign({ bubbles : true, cancelable : true }, options));

		if (hasHandlerAttr(elem, name)) {
			return elem[`on${name}`](event);
		}

		return elem.dispatchEvent(event);
	}

	return triggerEvent;
})();
