/***********************************************************************************************************************

	markup/template.js

	Copyright © 2019–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns */

var Template = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Template definitions.
	const _templates = new Map();

	// Valid template name regular expression.
	const _validNameRe = new RegExp(`^(?:${Patterns.templateName})$`);

	// Valid template type predicate.
	const _validType = template => {
		const templateType = typeof template;
		return templateType === 'function' || templateType === 'string';
	};


	/*******************************************************************************
		Template Functions.
	*******************************************************************************/

	function templateAdd(name, template) {
		if (
			   !_validType(template)
			&& !(template instanceof Array && template.length > 0 && template.every(_validType))
		) {
			throw new TypeError(`invalid template type (${name}); templates must be: functions, strings, or an array of either`);
		}

		(name instanceof Array ? name : [name]).forEach(name => {
			if (!_validNameRe.test(name)) {
				throw new Error(`invalid template name "${name}"`);
			}
			if (_templates.has(name)) {
				throw new Error(`cannot clobber existing template ?${name}`);
			}

			_templates.set(name, template);
		});
	}

	function templateDelete(name) {
		(name instanceof Array ? name : [name]).forEach(name => _templates.delete(name));
	}

	function templateGet(name) {
		return _templates.has(name) ? _templates.get(name) : null;
	}

	function templateHas(name) {
		return _templates.has(name);
	}

	function templateSize() {
		return _templates.size;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze(Object.defineProperties({}, {
		add    : { value : templateAdd },
		delete : { value : templateDelete },
		get    : { value : templateGet },
		has    : { value : templateHas },
		size   : { get : templateSize }
	}));
})();
