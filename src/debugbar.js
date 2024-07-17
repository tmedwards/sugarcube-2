/***********************************************************************************************************************

	debugbar.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Config, DebugView, Engine, L10n, Patterns, State, Story, getToStringTag, session, triggerEvent
*/

var DebugBar = (() => { // eslint-disable-line no-unused-vars, no-var
	// The debug state storage key.
	const STORAGE_KEY = 'debug.state';

	// Update intervals.
	const WATCH_LIST_DELAY = 200; // in milliseconds
	const VAR_LIST_DELAY   = 500; // in milliseconds

	const variableRE   = new RegExp(`^${Patterns.variable}$`);
	const numericKeyRE = /^\d+$/;
	const watchList    = [];
	let varList          = [];
	let watchTimerId     = null;
	let listTimerId      = null;
	let stowed           = true;
	let $debugBar        = null;
	let $watchBody       = null;
	let $varDataList     = null;
	let $turnSelect      = null;
	let $passageDataList = null;


	/*******************************************************************************
		Debug Bar Functions.
	*******************************************************************************/

	function debugBarInit() {
		if (BUILD_DEBUG) { console.log('[DebugBar/debugBarInit()]'); }

		if (!Config.debug) {
			// Remove its styles.
			jQuery(document.head).find('[id|="style-ui-debug"]').remove();

			return;
		}

		// Generate the debug bar elements and append them to <body>.
		const barToggleLabel   = L10n.get('debugBarLabelToggle');
		const watchAddLabel    = L10n.get('debugBarLabelWatchAdd');
		const watchAllLabel    = L10n.get('debugBarLabelWatchAll');
		const watchClearLabel  = L10n.get('debugBarLabelWatchClear');
		const watchToggleLabel = L10n.get('debugBarLabelWatchToggle');
		const viewsToggleLabel = L10n.get('debugBarLabelViewsToggle');
		const passagePlayLabel = L10n.get('debugBarLabelPassagePlay');

		jQuery(document.createDocumentFragment())
			.append(
				/* eslint-disable max-len */
				  '<div id="debug-bar">'
				+     '<div id="debug-bar-watch">'
				+         `<div>\u2014\u00A0${L10n.get('debugBarMesgNoWatches')}\u00A0\u2014</div>`
				+     '</div>'
				+     '<div>'
				+         `<label id="debug-bar-watch-label" for="debug-bar-watch-input">${L10n.get('debugBarTextWatch')}</label>`
				+         `<input id="debug-bar-watch-input" name="debug-bar-watch-input" type="text" placeholder="${L10n.get('debugBarLabelWatchPlaceholder')}" list="debug-bar-var-list" tabindex="0">`
				+         '<datalist id="debug-bar-var-list" aria-hidden="true" hidden="hidden"></datalist>'
				+         `<button id="debug-bar-watch-add" tabindex="0" title="${watchAddLabel}" aria-label="${watchAddLabel}"></button>`
				+         `<button id="debug-bar-watch-all" tabindex="0" title="${watchAllLabel}" aria-label="${watchAllLabel}"></button>`
				+         `<button id="debug-bar-watch-clear" tabindex="0" title="${watchClearLabel}" aria-label="${watchClearLabel}"></button>`
				+     '</div>'
				+     '<div>'
				+         `<label id="debug-bar-turn-label" for="debug-bar-turn-select">${L10n.get('textTurn')}</label>`
				+         '<select id="debug-bar-turn-select" tabindex="0"></select>'
				+     '</div>'
				+     '<div>'
				+         `<label id="debug-bar-passage-label" for="debug-bar-passage-input">${L10n.get('debugBarTextPassage')}</label>`
				+         `<input id="debug-bar-passage-input" name="debug-bar-passage-input" type="text" placeholder="${L10n.get('debugBarLabelPassagePlaceholder')}" list="debug-bar-passage-list" tabindex="0">`
				+         '<datalist id="debug-bar-passage-list" aria-hidden="true" hidden="hidden"></datalist>'
				+         `<button id="debug-bar-passage-play" tabindex="0" title="${passagePlayLabel}" aria-label="${passagePlayLabel}"></button>`
				+     '</div>'
				+     '<div>'
				+         `<button id="debug-bar-views-toggle" tabindex="0" title="${viewsToggleLabel}" aria-label="${viewsToggleLabel}">${L10n.get('debugBarTextViews')}</button>`
				+         `<button id="debug-bar-watch-toggle" tabindex="0" title="${watchToggleLabel}" aria-label="${watchToggleLabel}">${L10n.get('debugBarTextWatch')}</button>`
				+     '</div>'
				+     `<button id="debug-bar-toggle" tabindex="0" title="${barToggleLabel}" aria-label="${barToggleLabel}"></button>`
				+ '</div>'
				+ '<div id="debug-bar-hint"></div>'
				/* eslint-enable max-len */
			)
			.appendTo('body');

		// Cache the debug bar elements, since they're going to be used often.
		//
		// NOTE: We rewrap the elements themselves, rather than simply using
		// the results of `find()`, so that we cache uncluttered jQuery-wrappers
		// (i.e. `context` refers to the elements and there is no `prevObject`).
		$debugBar        = jQuery('#debug-bar');
		$watchBody       = jQuery($debugBar.find('#debug-bar-watch').get(0));
		$varDataList     = jQuery($debugBar.find('#debug-bar-var-list').get(0));
		$turnSelect      = jQuery($debugBar.find('#debug-bar-turn-select').get(0));
		$passageDataList = jQuery($debugBar.find('#debug-bar-passage-list').get(0));

		const $watchInput      = jQuery($debugBar.find('#debug-bar-watch-input').get(0));
		const $watchAdd        = jQuery($debugBar.find('#debug-bar-watch-add').get(0));
		const $watchAll        = jQuery($debugBar.find('#debug-bar-watch-all').get(0));
		const $watchClear      = jQuery($debugBar.find('#debug-bar-watch-clear').get(0));
		const $passageInput    = jQuery($debugBar.find('#debug-bar-passage-input').get(0));
		const $passagePlay     = jQuery($debugBar.find('#debug-bar-passage-play').get(0));
		const $viewsToggle     = jQuery($debugBar.find('#debug-bar-views-toggle').get(0));
		const $watchToggle     = jQuery($debugBar.find('#debug-bar-watch-toggle').get(0));
		const $barToggle       = jQuery($debugBar.find('#debug-bar-toggle').get(0));

		// Set up the debug bar's local event handlers.
		$watchInput
			.on('sc:debug-watch-add', function () {
				debugBarWatchAdd(this.value.trim());
				this.value = '';
			})
			.on('keypress', ev => {
				if (ev.which === 13) { // 13 is Enter/Return
					ev.preventDefault();
					triggerEvent('sc:debug-watch-add', $watchInput);
				}
			});
		$watchAdd
			.ariaClick(() => triggerEvent('sc:debug-watch-add', $watchInput));
		$watchAll
			.ariaClick(debugBarWatchAddAll);
		$watchClear
			.ariaClick(debugBarWatchClear);
		$turnSelect
			.on('change', function () {
				Engine.goTo(Number(this.value));
			});
		$passageInput
			.on('sc:debug-passage-play', function () {
				Engine.play(this.value.trim());
				this.value = '';
			})
			.on('keypress', ev => {
				if (ev.which === 13) { // 13 is Enter/Return
					ev.preventDefault();
					triggerEvent('sc:debug-passage-play', $passageInput);
				}
			})
			.on('focus', updatePassageList);
		$passagePlay
			.ariaClick(() => triggerEvent('sc:debug-passage-play', $passageInput));
		$viewsToggle
			.ariaClick(() => {
				DebugView.toggle();
				updateSession();
			});
		$watchToggle
			.ariaClick(debugBarWatchToggle);
		$barToggle
			.ariaClick(debugBarToggle);

		// Set up the debug bar's global event handlers.
		jQuery(document)
			// Set up a handler for the variables watch.
			.on(':passageend.debug-bar', () => {
				updateWatchBody();
				updateVarList();
			})
			// Set up a handler for the history select.
			.on(':historyupdate.debug-bar', updateTurnSelect)
			// Set up a handler for engine resets to clear the active debug session.
			.on(':enginerestart.debug-bar', clearSession);
	}

	function debugBarStart() {
		if (BUILD_DEBUG) { console.log('[DebugBar/debugBarStart()]'); }

		if (!Config.debug) {
			return;
		}

		// Attempt to restore an existing session.
		if (!restoreSession()) {
			// If there's no active debug session, then initially stow the debug bar,
			// enable debug views, and enable variable watching.
			debugBarStow();
			DebugView.enable();
			enableWatchUpdates();
			enableWatch();
		}

		// Update the UI.
		updateVarList();
		updateTurnSelect();
		// updatePassageList();
	}

	function debugBarIsStowed() {
		return stowed;
	}

	function debugBarStow() {
		disableWatchUpdates();
		disableVarListUpdates();
		stowDebugBar();
		stowed = true;
		updateSession();
	}

	function debugBarUnstow() {
		if (debugBarWatchIsEnabled()) {
			enableWatchUpdates();
		}

		enableVarListUpdates();
		unstowDebugBar();
		stowed = false;
		updateSession();
	}

	function debugBarToggle() {
		if (stowed) {
			debugBarUnstow();
		}
		else {
			debugBarStow();
		}
	}

	function debugBarWatchAdd(varName) {
		if (!variableRE.test(varName)) {
			return;
		}

		watchList.pushUnique(varName);
		watchList.sort();

		updateWatchBody();
		updateVarList();
		updateSession();
	}

	function debugBarWatchAddAll() {
		Object.keys(State.variables).map(name => watchList.pushUnique(`$${name}`));
		Object.keys(State.temporary).map(name => watchList.pushUnique(`_${name}`));
		watchList.sort();

		updateWatchBody();
		updateVarList();
		updateSession();
	}

	function debugBarWatchClear() {
		watchList.length = 0;
		$watchBody
			.empty()
			.append(`<div>\u2014\u00A0${L10n.get('debugBarMesgNoWatches')}\u00A0\u2014</div>`);

		updateWatchBody();
		updateVarList();
		updateSession();
	}

	function debugBarWatchDelete(varName) {
		watchList.deleteFirst(varName);
		$watchBody.find(`tr[data-name="${varName}"]`).remove();

		updateWatchBody();
		updateVarList();
		updateSession();
	}

	function debugBarWatchDisable() {
		disableWatchUpdates();
		disableWatch();
		updateSession();
	}

	function debugBarWatchEnable() {
		enableWatchUpdates();
		enableWatch();
		updateSession();
	}

	function debugBarWatchIsEnabled() {
		return !$watchBody.attr('hidden');
	}

	function debugBarWatchToggle() {
		if ($watchBody.attr('hidden')) {
			debugBarWatchEnable();
		}
		else {
			debugBarWatchDisable();
		}
	}


	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function stowDebugBar() {
		$debugBar.css('right', `-${$debugBar.outerWidth()}px`);
	}

	function unstowDebugBar() {
		$debugBar.css('right', 0);
	}

	function disableWatch() {
		$watchBody.attr({
			'aria-hidden' : true,
			hidden        : 'hidden'
		});
		// DebugFlags.remove('watch');
	}

	function disableWatchUpdates() {
		if (watchTimerId !== null) {
			clearInterval(watchTimerId);
			watchTimerId = null;
		}
	}

	function enableWatch() {
		// DebugFlags.add('watch');
		$watchBody.removeAttr('aria-hidden hidden');
	}

	function enableWatchUpdates() {
		if (watchTimerId === null) {
			watchTimerId = setInterval(() => updateWatchBody(), WATCH_LIST_DELAY);
		}
	}

	function disableVarListUpdates() {
		if (listTimerId !== null) {
			clearInterval(listTimerId);
			listTimerId = null;
		}
	}

	function enableVarListUpdates() {
		if (listTimerId === null) {
			listTimerId = setInterval(() => updateVarList(), VAR_LIST_DELAY);
		}
	}

	function clearSession() {
		session.delete(STORAGE_KEY);
	}

	function hasSession() {
		return session.has(STORAGE_KEY);
	}

	function restoreSession() {
		if (!hasSession()) {
			return false;
		}

		const debugState = session.get(STORAGE_KEY);

		watchList.push(...debugState.watchList);

		if (debugState.watchEnabled) {
			if (stowed) {
				disableWatchUpdates();
			}
			else {
				enableWatchUpdates();
			}

			enableWatch();
		}
		else {
			disableWatchUpdates();
			disableWatch();
		}

		if (debugState.viewsEnabled) {
			DebugView.enable();
		}
		else {
			DebugView.disable();
		}

		stowed = debugState.stowed;

		if (stowed) {
			disableVarListUpdates();
			debugBarStow();
		}
		else {
			enableVarListUpdates();
			debugBarUnstow();
		}

		return true;
	}

	function updateSession() {
		session.set(STORAGE_KEY, {
			stowed,
			watchList,
			watchEnabled : debugBarWatchIsEnabled(),
			viewsEnabled : DebugView.isEnabled()
		});
	}

	function updateWatchBody() {
		if (watchList.length === 0) {
			return;
		}

		const $rowMap = new Map();
		let $table = jQuery($watchBody.children('table'));
		let $tbody;

		// If there's an existing watches table, cache its elements.
		if ($table.length > 0) {
			$tbody = jQuery($table.children('tbody'));
			$tbody.children('tr').each((_, el) => $rowMap.set(el.getAttribute('data-name'), jQuery(el)));
		}
		// Elsewise, create a new watches table.
		else {
			$table = jQuery(document.createElement('table'));
			$tbody = jQuery(document.createElement('tbody'));
			$table
				.append($tbody);
			$watchBody
				.empty()
				.append($table);
		}

		// Set up a function to add new watch rows.
		const delLabel  = L10n.get('debugBarLabelWatchDelete');
		const createRow = function (varName, value) {
			const $row    = jQuery(document.createElement('tr'));
			const $delBtn = jQuery(document.createElement('button'));
			const $code   = jQuery(document.createElement('code'));

			$row
				.attr('data-name', varName);
			$delBtn
				.addClass('watch-delete')
				.ariaClick({
					one   : true,
					label : delLabel
				}, () => debugBarWatchDelete(varName));
			$code
				.text(value);
			jQuery(document.createElement('td'))
				.append($delBtn)
				.appendTo($row);
			jQuery(document.createElement('td'))
				.text(varName)
				.appendTo($row);
			jQuery(document.createElement('td'))
				.append($code)
				.appendTo($row);

			return $row;
		};

		let cursor = $rowMap.size > 0 ? $tbody.children('tr').get(0) : null;
		watchList.forEach(varName => {
			const varKey = varName.slice(1);
			const store  = varName[0] === '$' ? State.variables : State.temporary;
			const value  = toWatchString(store[varKey]);
			let $row = $rowMap.get(varName);

			// If a watch row exists, update its code element value.
			if ($row) {
				const $code = $row.children().children('code');

				if (value !== $code.text()) {
					$code.text(value);
				}
			}
			// Elsewise, insert a new watch row.
			else {
				$row = createRow(varName, value);

				if (cursor) {
					$row.insertAfter(cursor);
				}
				else {
					$row.appendTo($tbody);
				}
			}

			cursor = $row.get(0);
		});
	}

	function updateVarList() {
		const names = [].concat(
			Object.keys(State.variables).map(name => `$${name}`),
			Object.keys(State.temporary).map(name => `_${name}`)
		);

		// If there are no variable names, then bail out.
		if (names.length === 0) {
			varList.length = 0;
			$varDataList.empty();
			return;
		}

		// Sort the variable names and remove those already being watched.
		names.sort().deleteAll(watchList);

		// If the new and existing lists of variable names match, then bail out.
		if (
			names.length === varList.length
			&& names.every((m, i) => m === varList[i])
		) {
			return;
		}

		// Update the variable names list.
		varList = names;

		const options = document.createDocumentFragment();

		// Generate the <option>s.
		varList.forEach(name => {
			jQuery(document.createElement('option'))
				.val(name)
				.appendTo(options);
		});

		// Update the <datalist>.
		$varDataList
			.empty()
			.append(options);
	}

	function updateTurnSelect() {
		const histLen = State.size;
		const expLen  = State.expired.length;
		const options = document.createDocumentFragment();

		// Generate the <option>s.
		for (let i = 0; i < histLen; ++i) {
			jQuery(document.createElement('option'))
				.val(i)
				.text(`${expLen + i + 1}. ${State.history[i].title}`)
				.appendTo(options);
		}

		// Update the <select>.
		$turnSelect
			.empty()
			.ariaDisabled(histLen < 2)
			.append(options)
			.val(State.activeIndex);
	}

	function updatePassageList() {
		const passages = Object.keys(Story.getNormals()).sort();
		const options  = document.createDocumentFragment();

		// Generate the <option>s.
		passages.forEach(name => {
			jQuery(document.createElement('option'))
				.val(name)
				.appendTo(options);
		});

		// Update the <datalist>.
		$passageDataList
			.empty()
			.append(options);
	}

	function toWatchString(O) {
		// Handle the `null` primitive.
		if (O === null) {
			return 'null';
		}

		// Handle the rest of the primitives and functions.
		switch (typeof O) {
			case 'bigint':
			case 'boolean':
			case 'number':
			case 'symbol':
			case 'undefined':
				return String(O);

			case 'string':
				return JSON.stringify(O);

			case 'function':
				return 'Function';
		}

		const objType = getToStringTag(O);

		// /*
		// 	Handle instances of the primitive exemplar objects (`Boolean`, `Number`, `String`).
		// */
		// if (objType === 'Boolean') {
		// 	return `Boolean\u202F{${String(O)}}`;
		// }
		// if (objType === 'Number') {
		// 	return `Number\u202F{${String(O)}}`;
		// }
		// if (objType === 'String') {
		// 	return `String\u202F{"${String(O)}"}`;
		// }

		// Handle `Date` objects.
		if (objType === 'Date') {
			// return `Date\u202F${O.toISOString()}`;
			return `Date\u202F{${O.toLocaleString()}}`;
		}

		// Handle `RegExp` objects.
		if (objType === 'RegExp') {
			return `RegExp\u202F${O.toString()}`;
		}

		const result = [];

		// Handle `Array` & `Set` objects.
		if (O instanceof Array || O instanceof Set) {
			const list = O instanceof Array ? O : Array.from(O);

			// own numeric properties
			// NOTE: Do not use `<Array>.forEach()` here as it skips undefined members.
			for (let i = 0, len = list.length; i < len; ++i) {
				result.push(Object.hasOwn(list, i) ? toWatchString(list[i]) : '<empty>');
			}

			// own enumerable non-numeric expando properties
			Object.keys(list)
				.filter(key => !numericKeyRE.test(key))
				.forEach(key => result.push(`${toWatchString(key)}: ${toWatchString(list[key])}`));

			return `${objType}(${list.length})\u202F[${result.join(', ')}]`;
		}

		// Handle `Map` objects.
		if (O instanceof Map) {
			O.forEach((val, key) => result.push(`${toWatchString(key)} \u2192 ${toWatchString(val)}`));

			return `${objType}(${O.size})\u202F{${result.join(', ')}}`;
		}

		// General object handling.
		// own enumerable properties
		Object.keys(O)
			.forEach(key => result.push(`${toWatchString(key)}: ${toWatchString(O[key])}`));

		return `${objType}\u202F{${result.join(', ')}}`;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Debug Bar Functions.
		init     : { value : debugBarInit },
		isStowed : { value : debugBarIsStowed },
		start    : { value : debugBarStart },
		stow     : { value : debugBarStow },
		toggle   : { value : debugBarToggle },
		unstow   : { value : debugBarUnstow },

		// Watch Functions.
		watch : {
			value : Object.preventExtensions(Object.create(null, {
				add       : { value : debugBarWatchAdd },
				all       : { value : debugBarWatchAddAll },
				clear     : { value : debugBarWatchClear },
				delete    : { value : debugBarWatchDelete },
				disable   : { value : debugBarWatchDisable },
				enable    : { value : debugBarWatchEnable },
				isEnabled : { value : debugBarWatchIsEnabled },
				toggle    : { value : debugBarWatchToggle }
			}))
		}
	}));
})();
