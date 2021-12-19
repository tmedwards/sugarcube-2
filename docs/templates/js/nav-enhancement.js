/*
	NAV ENHANCEMENT
*/
/* globals SCDocs */
(function () {
	'use strict';

	if (!('SCDocs' in window)) {
		return;
	}

	var storageKey = 'navExpanded';
	var expanded   = Object.freeze(Object.defineProperties(Object.create(null), {
		_array : {
			value : SCDocs.getConfig(storageKey) || []
		},
		add : {
			value : function (listId) {
				if (this._array.indexOf(listId) === -1) {
					this._array.push(listId);
					SCDocs.setConfig(storageKey, this._array);
				}
			}
		},
		delete : {
			value : function (listId) {
				var pos = this._array.indexOf(listId);

				if (pos !== -1) {
					this._array.splice(pos, 1);

					if (this._array.length > 0) {
						SCDocs.setConfig(storageKey, this._array);
					}
					else {
						SCDocs.removeConfig(storageKey);
					}
				}
			}
		},
		has : {
			value : function (listId) {
				return this._array.indexOf(listId) !== -1;
			}
		}
	}));

	var createListToggle = function (list, isExpanded) {
		var collapseTitle = 'Collapse section';
		var expandTitle   = 'Expand section';
		var toggleFn      = function (ev) {
			if (
				   ev.type === 'click'
				|| ev.type === 'keypress' && (ev.which === 13 /* Enter/Return */ || ev.which === 32 /* Space */)
			) {
				ev.preventDefault();
				var toggle = ev.target;

				if (list.classList.contains('collapsed')) {
					list.classList.remove('collapsed');
					toggle.classList.remove('collapsed');
					toggle.setAttribute('title', collapseTitle);
					toggle.setAttribute('aria-label', collapseTitle);
					expanded.add(list.id);
				}
				else {
					list.classList.add('collapsed');
					toggle.classList.add('collapsed');
					toggle.setAttribute('title', expandTitle);
					toggle.setAttribute('aria-label', expandTitle);
					expanded.delete(list.id);
				}
			}
		};
		var toggle = document.createElement('a');
		toggle.classList.add('list-toggle');

		if (isExpanded) {
			toggle.setAttribute('title', collapseTitle);
			toggle.setAttribute('aria-label', collapseTitle);
		}
		else {
			list.classList.add('collapsed');
			toggle.classList.add('collapsed');
			toggle.setAttribute('title', expandTitle);
			toggle.setAttribute('aria-label', expandTitle);
		}

		toggle.setAttribute('tabindex', 0);
		toggle.addEventListener('click', toggleFn);
		toggle.addEventListener('keypress', toggleFn);
		return toggle;
	};
	var nav     = document.querySelector('nav');
	var lists   = SCDocs.arrayFrom(nav.querySelectorAll('nav>ul'));
	var toggles = [];
	lists.forEach(function (list) {
		var heading = list.previousSibling;

		while (heading !== null && heading.nodeType !== Node.ELEMENT_NODE && heading.nodeName !== 'H2') {
			heading = heading.previousSibling;
		}

		if (heading) {
			var anchor = heading.firstChild;

			while (anchor) {
				if (anchor.nodeType === Node.ELEMENT_NODE && anchor.nodeName === 'A') {
					break;
				}

				anchor = anchor.nextSibling;
			}

			var listId = 'nav-' + anchor.href.replace(/^.*#([^#]+)$/, '$1');
			list.setAttribute('id', listId);
			var toggle = createListToggle(list, expanded.has(listId));
			toggles.push(toggle);
			heading.appendChild(toggle);
		}
	});

	var createColorToggle = function (isDisabled) {
		var disableTitle = 'Disable code color';
		var enableTitle  = 'Enable code color';
		var toggleFn     = function (ev) {
			if (
				   ev.type === 'click'
				|| ev.type === 'keypress' && (ev.which === 13 /* Enter/Return */ || ev.which === 32 /* Space */)
			) {
				ev.preventDefault();
				var button = ev.target;

				if (button.classList.contains('disabled')) {
					button.classList.remove('disabled');
					button.setAttribute('title', disableTitle);
					button.setAttribute('aria-label', disableTitle);
					SCDocs.removeConfig('codeColor');
					document.documentElement.classList.remove('disable-code-color');
				}
				else {
					button.classList.add('disabled');
					button.setAttribute('title', enableTitle);
					button.setAttribute('aria-label', enableTitle);
					SCDocs.setConfig('codeColor', 'inherit');
					document.documentElement.classList.add('disable-code-color');
				}
			}
		};
		var button = document.createElement('button');
		button.setAttribute('id', 'color-toggle');
		button.appendChild(document.createTextNode('Code Color'));

		if (SCDocs.getConfig('codeColor') === 'inherit') {
			button.classList.add('disabled');
			button.setAttribute('title', enableTitle);
			button.setAttribute('aria-label', enableTitle);
		}
		else {
			button.setAttribute('title', disableTitle);
			button.setAttribute('aria-label', disableTitle);
		}

		button.setAttribute('tabindex', 0);
		button.addEventListener('click', toggleFn);
		button.addEventListener('keypress', toggleFn);
		return button;
	};
	var createListToggleAll = function (toggles, name, predicate) {
		var createEvent = function (type) {
			var event;

			if (typeof Event === 'function') {
				event = new Event(type);
			}
			else {
				event = document.createEvent('Event');
				event.initEvent(type);
			}

			return event;
		};
		var toggleFn = function (ev) {
			if (
				   ev.type === 'click'
				|| ev.type === 'keypress' && (ev.which === 13 /* Enter/Return */ || ev.which === 32 /* Space */)
			) {
				ev.preventDefault();

				toggles.forEach(function (toggle) {
					if (predicate(toggle)) {
						toggle.dispatchEvent(createEvent('click'));
					}
				});
			}
		};
		var title  = name + ' all';
		var toggle = document.createElement('a');
		toggle.setAttribute('id', 'lists-' + name.toLowerCase());
		toggle.setAttribute('title', title);
		toggle.setAttribute('aria-label', title);
		toggle.setAttribute('tabindex', 0);
		toggle.addEventListener('click', toggleFn);
		toggle.addEventListener('keypress', toggleFn);
		return toggle;
	};
	var header = nav.querySelector('nav>header');
	var tray   = document.createElement('div');
	tray.setAttribute('id', 'controls');
	tray.appendChild(createColorToggle());
	tray.appendChild(createListToggleAll(toggles, 'Collapse', function (toggle) {
		return !toggle.classList.contains('collapsed');
	}));
	tray.appendChild(createListToggleAll(toggles, 'Expand', function (toggle) {
		return toggle.classList.contains('collapsed');
	}));
	header.appendChild(tray);
	nav.classList.add('enhanced');
})();
