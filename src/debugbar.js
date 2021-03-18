/***********************************************************************************************************************

	debugbar.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global DebugView, Engine, L10n, Patterns, State, Util, session
*/

var DebugBar = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	const _variableRe   = new RegExp(`^${Patterns.variable}$`);
	const _numericKeyRe = /^\d+$/;
	const _watchList    = [];
	let _$debugBar   = null;
	let _$watchBody  = null;
	let _$watchList  = null;
	let _$turnSelect = null;
	let _stowed      = true;


	/*******************************************************************************************************************
		Debug Bar Functions.
	*******************************************************************************************************************/
	function debugBarInit() {
		if (DEBUG) { console.log('[DebugBar/debugBarInit()]'); }

		/*
			Generate the debug bar elements and append them to the `<body>`.
		*/
		const barToggleLabel   = L10n.get('debugBarToggle');
		const watchAddLabel    = L10n.get('debugBarAddWatch');
		const watchAllLabel    = L10n.get('debugBarWatchAll');
		const watchNoneLabel   = L10n.get('debugBarWatchNone');
		const watchToggleLabel = L10n.get('debugBarWatchToggle');
		const viewsToggleLabel = L10n.get('debugBarViewsToggle');

		jQuery(document.createDocumentFragment())
			.append(
				/* eslint-disable max-len */
				  '<div id="debug-bar">'
				+     '<div id="debug-bar-watch">'
				+         `<div>${L10n.get('debugBarNoWatches')}</div>>`
				+     '</div>'
				+     '<div>'
				+         `<button id="debug-bar-watch-toggle" tabindex="0" title="${watchToggleLabel}" aria-label="${watchToggleLabel}">${L10n.get('debugBarLabelWatch')}</button>`
				+         `<label id="debug-bar-watch-label" for="debug-bar-watch-input">${L10n.get('debugBarLabelAdd')}</label>`
				+         '<input id="debug-bar-watch-input" name="debug-bar-watch-input" type="text" list="debug-bar-watch-list" tabindex="0">'
				+         '<datalist id="debug-bar-watch-list" aria-hidden="true" hidden="hidden"></datalist>'
				+         `<button id="debug-bar-watch-add" tabindex="0" title="${watchAddLabel}" aria-label="${watchAddLabel}"></button>`
				+         `<button id="debug-bar-watch-all" tabindex="0" title="${watchAllLabel}" aria-label="${watchAllLabel}"></button>`
				+         `<button id="debug-bar-watch-none" tabindex="0" title="${watchNoneLabel}" aria-label="${watchNoneLabel}"></button>`
				+     '</div>'
				+     '<div>'
				+         `<button id="debug-bar-views-toggle" tabindex="0" title="${viewsToggleLabel}" aria-label="${viewsToggleLabel}">${L10n.get('debugBarLabelViews')}</button>`
				+         `<label id="debug-bar-turn-label" for="debug-bar-turn-select">${L10n.get('debugBarLabelTurn')}</label>`
				+         '<select id="debug-bar-turn-select" tabindex="0"></select>'
				+     '</div>'
				+     `<button id="debug-bar-toggle" tabindex="0" title="${barToggleLabel}" aria-label="${barToggleLabel}"></button>`
				+ '</div>'
				+ '<div id="debug-bar-hint"></div>'
				/* eslint-enable max-len */
			)
			.appendTo('body');

		/*
			Cache various oft used elements.

			NOTE: We rewrap the elements themselves, rather than simply using
			the results of `find()`, so that we cache uncluttered jQuery-wrappers
			(i.e. `context` refers to the elements and there is no `prevObject`).
		*/
		_$debugBar   = jQuery('#debug-bar');
		_$watchBody  = jQuery(_$debugBar.find('#debug-bar-watch').get(0));
		_$watchList  = jQuery(_$debugBar.find('#debug-bar-watch-list').get(0));
		_$turnSelect = jQuery(_$debugBar.find('#debug-bar-turn-select').get(0));

		const $barToggle   = jQuery(_$debugBar.find('#debug-bar-toggle').get(0));
		const $watchToggle = jQuery(_$debugBar.find('#debug-bar-watch-toggle').get(0));
		const $watchInput  = jQuery(_$debugBar.find('#debug-bar-watch-input').get(0));
		const $watchAdd    = jQuery(_$debugBar.find('#debug-bar-watch-add').get(0));
		const $watchAll    = jQuery(_$debugBar.find('#debug-bar-watch-all').get(0));
		const $watchNone   = jQuery(_$debugBar.find('#debug-bar-watch-none').get(0));
		const $viewsToggle = jQuery(_$debugBar.find('#debug-bar-views-toggle').get(0));

		/*
			Set up the debug bar's local event handlers.
		*/
		$barToggle
			.ariaClick(debugBarToggle);
		$watchToggle
			.ariaClick(debugBarWatchToggle);
		$watchInput
			.on(':addwatch', function () {
				debugBarWatchAdd(this.value.trim());
				this.value = '';
			})
			.on('keypress', ev => {
				if (ev.which === 13) { // 13 is Return/Enter
					ev.preventDefault();
					$watchInput.trigger(':addwatch');
				}
			});
		$watchAdd
			.ariaClick(() => $watchInput.trigger(':addwatch'));
		$watchAll
			.ariaClick(debugBarWatchAddAll);
		$watchNone
			.ariaClick(debugBarWatchClear);
		_$turnSelect
			.on('change', function () {
				Engine.goTo(Number(this.value));
			});
		$viewsToggle
			.ariaClick(() => {
				DebugView.toggle();
				_updateSession();
			});

		/*
			Set up the debug bar's global event handlers.
		*/
		jQuery(document)
			// Set up a handler for the history select.
			.on(':historyupdate.debug-bar', _updateTurnSelect)
			// Set up a handler for the variables watch.
			.on(':passageend.debug-bar', () => {
				_updateWatchBody();
				_updateWatchList();
			})
			// Set up a handler for engine resets to clear the active debug session.
			.on(':enginerestart.debug-bar', _clearSession);

		/*
			Initially enable debug views if there's no active debug session.
		*/
		if (!_hasSession()) {
			DebugView.enable();
		}
	}

	function debugBarStart() {
		if (DEBUG) { console.log('[DebugBar/debugBarStart()]'); }

		// Attempt to restore an existing session.
		_restoreSession();

		// Update the UI.
		_updateBar();
		_updateTurnSelect();
		_updateWatchBody();
		_updateWatchList();
	}

	function debugBarIsStowed() {
		return _stowed;
	}

	function debugBarStow() {
		_debugBarStowNoUpdate();
		_stowed = true;
		_updateSession();
	}

	function debugBarUnstow() {
		_debugBarUnstowNoUpdate();
		_stowed = false;
		_updateSession();
	}

	function debugBarToggle() {
		if (_stowed) {
			debugBarUnstow();
		}
		else {
			debugBarStow();
		}
	}

	function debugBarWatchAdd(varName) {
		if (!_variableRe.test(varName)) {
			return;
		}

		_watchList.pushUnique(varName);
		_watchList.sort();
		_updateWatchBody();
		_updateWatchList();
		_updateSession();
	}

	function debugBarWatchAddAll() {
		Object.keys(State.variables).map(name => _watchList.pushUnique(`$${name}`));
		Object.keys(State.temporary).map(name => _watchList.pushUnique(`_${name}`));

		_watchList.sort();
		_updateWatchBody();
		_updateWatchList();
		_updateSession();
	}

	function debugBarWatchClear() {
		for (let i = _watchList.length - 1; i >= 0; --i) {
			_watchList.pop();
		}

		_updateWatchBody();
		_updateWatchList();
		_updateSession();
	}

	function debugBarWatchDelete(varName) {
		_watchList.delete(varName);
		_updateWatchBody();
		_updateWatchList();
		_updateSession();
	}

	function debugBarWatchDisable() {
		_debugBarWatchDisableNoUpdate();
		_updateSession();
	}

	function debugBarWatchEnable() {
		_debugBarWatchEnableNoUpdate();
		_updateSession();
	}

	function debugBarWatchIsEnabled() {
		return !_$watchBody.attr('hidden');
	}

	function debugBarWatchToggle() {
		if (_$watchBody.attr('hidden')) {
			debugBarWatchEnable();
		}
		else {
			debugBarWatchDisable();
		}
	}


	/*******************************************************************************************************************
		Utility Functions.
	*******************************************************************************************************************/
	function _debugBarStowNoUpdate() {
		_$debugBar.css('right', `-${_$debugBar.outerWidth()}px`);
	}

	function _debugBarUnstowNoUpdate() {
		_$debugBar.css('right', 0);
	}

	function _debugBarWatchDisableNoUpdate() {
		_$watchBody.attr({
			'aria-hidden' : true,
			hidden        : 'hidden'
		});
	}

	function _debugBarWatchEnableNoUpdate() {
		_$watchBody.removeAttr('aria-hidden hidden');
	}

	function _clearSession() {
		session.delete('debugState');
	}

	function _hasSession() {
		return session.has('debugState');
	}

	function _restoreSession() {
		if (!_hasSession()) {
			return false;
		}

		const debugState = session.get('debugState');

		_stowed = debugState.stowed;

		_watchList.push(...debugState.watchList);

		if (debugState.watchEnabled) {
			_debugBarWatchEnableNoUpdate();
		}
		else {
			_debugBarWatchDisableNoUpdate();
		}

		if (debugState.viewsEnabled) {
			DebugView.enable();
		}
		else {
			DebugView.disable();
		}

		return true;
	}

	function _updateSession() {
		session.set('debugState', {
			stowed       : _stowed,
			watchList    : _watchList,
			watchEnabled : debugBarWatchIsEnabled(),
			viewsEnabled : DebugView.isEnabled()
		});
	}

	function _updateBar() {
		if (_stowed) {
			debugBarStow();
		}
		else {
			debugBarUnstow();
		}
	}

	function _updateWatchBody() {
		if (_watchList.length === 0) {
			_$watchBody
				.empty()
				.append(`<div>${L10n.get('debugBarNoWatches')}</div>`);
			return;
		}

		const delLabel = L10n.get('debugBarDeleteWatch');
		const $table   = jQuery(document.createElement('table'));
		const $tbody   = jQuery(document.createElement('tbody'));

		for (let i = 0, len = _watchList.length; i < len; ++i) {
			const varName = _watchList[i];
			const varKey  = varName.slice(1);
			const store   = varName[0] === '$' ? State.variables : State.temporary;
			const $row    = jQuery(document.createElement('tr'));
			const $delBtn = jQuery(document.createElement('button'));
			const $code   = jQuery(document.createElement('code'));

			$delBtn
				.addClass('watch-delete')
				.attr('data-name', varName)
				.ariaClick({
					one   : true,
					label : delLabel
				}, () => debugBarWatchDelete(varName));
			$code
				.text(_toWatchString(store[varKey]));

			jQuery(document.createElement('td'))
				.append($delBtn)
				.appendTo($row);
			jQuery(document.createElement('td'))
				.text(varName)
				.appendTo($row);
			jQuery(document.createElement('td'))
				.append($code)
				.appendTo($row);
			$row
				.appendTo($tbody);
		}

		$table
			.append($tbody);
		_$watchBody
			.empty()
			.append($table);
	}

	function _updateWatchList() {
		const svn = Object.keys(State.variables);
		const tvn = Object.keys(State.temporary);

		if (svn.length === 0 && tvn.length === 0) {
			_$watchList.empty();
			return;
		}

		const names   = [...svn.map(name => `$${name}`), ...tvn.map(name => `_${name}`)].sort();
		const options = document.createDocumentFragment();

		names.delete(_watchList);

		for (let i = 0, len = names.length; i < len; ++i) {
			jQuery(document.createElement('option'))
				.val(names[i])
				.appendTo(options);
		}

		_$watchList
			.empty()
			.append(options);
	}

	function _updateTurnSelect() {
		const histLen = State.size;
		const expLen  = State.expired.length;
		const options = document.createDocumentFragment();

		for (let i = 0; i < histLen; ++i) {
			jQuery(document.createElement('option'))
				.val(i)
				.text(`${expLen + i + 1}. ${Util.escape(State.history[i].title)}`)
				.appendTo(options);
		}

		_$turnSelect
			.empty()
			.ariaDisabled(histLen < 2)
			.append(options)
			.val(State.activeIndex);
	}

	function _toWatchString(value) {
		/*
			Handle the `null` primitive.
		*/
		if (value === null) {
			return 'null';
		}

		/*
			Handle the rest of the primitives and functions.
		*/
		switch (typeof value) {
		case 'number':
			if (Number.isNaN(value)) {
				return 'NaN';
			}
			else if (!Number.isFinite(value)) {
				return 'Infinity';
			}
			/* falls through */
		case 'boolean':
		case 'symbol':
		case 'undefined':
			return String(value);

		case 'string':
			return JSON.stringify(value);

		case 'function':
			return 'Function';
		}

		const objType = Util.toStringTag(value);

		// /*
		// 	Handle instances of the primitive exemplar objects (`Boolean`, `Number`, `String`).
		// */
		// if (objType === 'Boolean') {
		// 	return `Boolean\u202F{${String(value)}}`;
		// }
		// if (objType === 'Number') {
		// 	return `Number\u202F{${String(value)}}`;
		// }
		// if (objType === 'String') {
		// 	return `String\u202F{"${String(value)}"}`;
		// }

		/*
			Handle `Date` objects.
		*/
		if (objType === 'Date') {
			// return `Date\u202F${value.toISOString()}`;
			return `Date\u202F{${value.toLocaleString()}}`;
		}

		/*
			Handle `RegExp` objects.
		*/
		if (objType === 'RegExp') {
			return `RegExp\u202F${value.toString()}`;
		}

		const result = [];

		/*
			Handle `Array` & `Set` objects.
		*/
		if (value instanceof Array || value instanceof Set) {
			const list = value instanceof Array ? value : Array.from(value);

			// own numeric properties
			// NOTE: Do not use `<Array>.forEach()` here as it skips undefined members.
			for (let i = 0, len = list.length; i < len; ++i) {
				result.push(list.hasOwnProperty(i) ? _toWatchString(list[i]) : '<empty>');
			}

			// own enumerable non-numeric expando properties
			Object.keys(list)
				.filter(key => !_numericKeyRe.test(key))
				.forEach(key => result.push(`${_toWatchString(key)}: ${_toWatchString(list[key])}`));

			return `${objType}(${list.length})\u202F[${result.join(', ')}]`;
		}

		/*
			Handle `Map` objects.
		*/
		if (value instanceof Map) {
			value.forEach((val, key) => result.push(`${_toWatchString(key)} \u2192 ${_toWatchString(val)}`));

			return `${objType}(${value.size})\u202F{${result.join(', ')}}`;
		}

		/*
			General object handling.
		*/
		// own enumerable properties
		Object.keys(value)
			.forEach(key => result.push(`${_toWatchString(key)}: ${_toWatchString(value[key])}`));

		return `${objType}\u202F{${result.join(', ')}}`;
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		/*
			Debug Bar Functions.
		*/
		init     : { value : debugBarInit },
		isStowed : { value : debugBarIsStowed },
		start    : { value : debugBarStart },
		stow     : { value : debugBarStow },
		toggle   : { value : debugBarToggle },
		unstow   : { value : debugBarUnstow },

		/*
			Watch Functions.
		*/
		watch : {
			value : Object.freeze(Object.defineProperties({}, {
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
