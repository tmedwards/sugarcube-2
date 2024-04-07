/***********************************************************************************************************************

	util/appenderror.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global L10n */

/*
	Appends an error view to the given DOM element or fragment and logs a message to the console.
*/
function appendError(output, message, source) { // eslint-disable-line no-unused-vars
	const $wrapper = jQuery(document.createElement('div'));
	const $toggle  = jQuery(document.createElement('button'));
	const $source  = jQuery(document.createElement('pre'));
	const mesg     = `${L10n.get('errorViewTitle')}: ${message || 'unknown error'}`;

	$toggle
		.addClass('error-toggle')
		.ariaClick({
			label : L10n.get('errorViewLabelToggle')
		}, () => {
			if ($toggle.hasClass('enabled')) {
				$toggle.removeClass('enabled');
				$source.attr({
					'aria-hidden' : true,
					hidden        : 'hidden'
				});
			}
			else {
				$toggle.addClass('enabled');
				$source.removeAttr('aria-hidden hidden');
			}
		})
		.appendTo($wrapper);
	jQuery(document.createElement('span'))
		.addClass('error')
		.text(mesg)
		.appendTo($wrapper);
	jQuery(document.createElement('code'))
		.text(source)
		.appendTo($source);
	$source
		.addClass('error-source')
		.attr({
			'aria-hidden' : true,
			hidden        : 'hidden'
		})
		.appendTo($wrapper);
	$wrapper
		.addClass('error-view')
		.appendTo(output);

	console.warn(`${mesg}\n\t${source.replace(/\n/g, '\n\t')}`);

	return false;
}

/* legacy */
var throwError = appendError; // eslint-disable-line no-unused-vars, no-var
/* /legacy */
