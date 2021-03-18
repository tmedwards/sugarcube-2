/***********************************************************************************************************************

	lib/prngwrapper.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

var PRNGWrapper = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		PRNGWrapper Class.
	*******************************************************************************************************************/
	class PRNGWrapper {
		constructor(seed, useEntropy) {
			/* eslint-disable new-cap */
			Object.defineProperties(this, new Math.seedrandom(seed, useEntropy, (prng, seed) => ({
				_prng : {
					value : prng
				},

				seed : {
					/*
						TODO: Make this non-writable.
					*/
					writable : true,
					value    : seed
				},

				pull : {
					writable : true,
					value    : 0
				},

				random : {
					value() {
						++this.pull;
						return this._prng();
					}
				}
			})));
			/* eslint-enable new-cap */
		}

		static marshal(prng) {
			if (!prng || !prng.hasOwnProperty('seed') || !prng.hasOwnProperty('pull')) {
				throw new Error('PRNG is missing required data');
			}

			return {
				seed : prng.seed,
				pull : prng.pull
			};
		}

		static unmarshal(prngObj) {
			if (!prngObj || !prngObj.hasOwnProperty('seed') || !prngObj.hasOwnProperty('pull')) {
				throw new Error('PRNG object is missing required data');
			}

			/*
				Create a new PRNG using the original seed and pull values from it until it
				has reached the original pull count.
			*/
			const prng = new PRNGWrapper(prngObj.seed, false);

			for (let i = prngObj.pull; i > 0; --i) {
				prng.random();
			}

			return prng;
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return PRNGWrapper;
})();
