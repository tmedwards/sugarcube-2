/***********************************************************************************************************************

	util/parseurl.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

/*
	Returns an immutable object containing the component properties parsed from the given URL.
*/
function parseURL(url) { // eslint-disable-line no-unused-vars
	const parser       = document.createElement('a');
	const searchParams = Object.create(null);

	// Let the `<a>` element parse the URL.
	parser.href = url;

	// Populate the `searchParams` object with the query string attributes.
	if (parser.search) {
		parser.search
			.replace(/^\?/, '')
			.splitOrEmpty(/(?:&(?:amp;)?|;)/)
			.forEach(query => {
				const [key, value] = query.split('=');

				if (Object.hasOwn(searchParams, key)) {
					searchParams[key].push(value);
				}
				else {
					searchParams[key] = [value];
				}
			});
	}

	// WARNING: Caveats by browser.
	//
	// Edge (EdgeHTML) and Internet Explorer do not support authentication
	// information within a URL at all and will throw a security exception
	// on *any* property access if it's included.
	//
	// Internet Explorer does not include the leading forward slash on
	// `pathname` when required.
	//
	// Opera (Presto) strips the authentication information from `href`
	// and does not supply `username` or `password`.
	//
	// Safari (ca. v5.1.x) does not supply `username` or `password` and
	// peforms URI decoding on `pathname`.

	// Patch for IE not including the leading slash on `pathname` when required.
	const pathname = parser.host && parser.pathname[0] !== '/' ? `/${parser.pathname}` : parser.pathname;

	return Object.freeze(Object.assign(Object.create(null), {
		// The full URL that was originally parsed.
		href : parser.href,

		// The request protocol, lowercased.
		protocol : parser.protocol,

		// // The full authentication information.
		// auth : el.username || el.password // eslint-disable-line no-nested-ternary
		// 	? `${el.username}:${el.password}`
		// 	: typeof el.username === 'string' ? '' : undefined,
		//
		// // The username portion of the auth info.
		// username : el.username,
		//
		// // The password portion of the auth info.
		// password : el.password,

		// The full host information, including port number, lowercased.
		host : parser.host,

		// The hostname portion of the host info, lowercased.
		hostname : parser.hostname,

		// The port number portion of the host info.
		port : parser.port,

		// The full path information, including query info.
		path : `${pathname}${parser.search}`,

		// The pathname portion of the path info.
		pathname,

		// The query string portion of the path info, including the leading question mark.
		search : parser.search,

		// The attributes portion of the query string, parsed into an object.
		searchParams : Object.freeze(searchParams),

		// The fragment string, including the leading hash/pound sign.
		hash : parser.hash
	}));
}
