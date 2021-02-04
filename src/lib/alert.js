/***********************************************************************************************************************

	lib/alert.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	TODO: This regular expression should be elsewhere.

	Error prologs by engine/browser: (ca. 2018)
		Chrome, Opera, & Vivaldi → `Uncaught \w*Error: …`
		Edge & IE                → `…`
		Firefox                  → `Error: …`
		Opera (Presto)           → `Uncaught exception: \w*(?:Error|Exception): …`
		Safari (ca. v5.1)        → `\w*(?:Error|_ERR): …`
*/
var errorPrologRegExp = /^(?:(?:uncaught\s+(?:exception:\s+)?)?\w*(?:error|exception|_err):\s+)+/i; // eslint-disable-line no-unused-vars, no-var

var Alert = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		Error Functions.
	*******************************************************************************************************************/
	function _alertMesg(type, where, what, error) {
		const isFatal = type === 'fatal';
		let mesg = `Apologies! ${isFatal ? 'A fatal' : 'An'} error has occurred.`;

		if (isFatal) {
			mesg += ' Aborting.';
		}
		else {
			mesg += ' You may be able to continue, but some parts may not work properly.';
		}

		if (where != null || what != null) { // lazy equality for null
			mesg += '\n\nError';

			if (where != null) { // lazy equality for null
				mesg += ` [${where}]`;
			}

			if (what != null) { // lazy equality for null
				mesg += `: ${what.replace(errorPrologRegExp, '')}.`;
			}
			else {
				mesg += ': unknown error.';
			}
		}

		if (typeof error === 'object' && error !== null && error.stack) {
			mesg += `\n\nStack Trace:\n${error.stack}`;
		}

		window.alert(mesg); // eslint-disable-line no-alert
	}

	function alertError(where, what, error) {
		_alertMesg(null, where, what, error);
	}

	function alertFatal(where, what, error) {
		_alertMesg('fatal', where, what, error);
	}


	/*******************************************************************************************************************
		Error Event.
	*******************************************************************************************************************/
	/*
		Set up a global error handler for uncaught exceptions.
	*/
	(origOnError => {
		window.onerror = function (what, source, lineNum, colNum, error) {
			// Uncaught exceptions during play may be recoverable/ignorable.
			if (document.readyState === 'complete') {
				alertError(null, what, error);
			}

			// Uncaught exceptions during startup should be fatal.
			else {
				alertFatal(null, what, error);
				window.onerror = origOnError;

				if (typeof window.onerror === 'function') {
					window.onerror.apply(this, arguments);
				}
			}
		};
	})(window.onerror);


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		error : { value : alertError },
		fatal : { value : alertFatal }
	}));
})();
