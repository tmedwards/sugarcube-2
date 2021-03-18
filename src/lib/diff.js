/***********************************************************************************************************************

	lib/diff.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Util, clone */

var Diff = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		Diff Functions.
	*******************************************************************************************************************/
	/*
		Diff operations object (pseudo-enumeration).
	*/
	const Op = Util.toEnum({
		Delete      : 0,
		SpliceArray : 1,
		Copy        : 2,
		CopyDate    : 3
	});

	/*
		Returns a difference object generated from comparing the orig and dest objects.
	*/
	function diff(orig, dest) /* diff object */ {
		const objToString = Object.prototype.toString;
		const origIsArray = orig instanceof Array;
		const keys        = []
			.concat(Object.keys(orig), Object.keys(dest))
			.sort()
			.filter((val, i, arr) => i === 0 || arr[i - 1] !== val);
		const diffed      = {};
		let aOpRef;

		const keyIsAOpRef = key => key === aOpRef;

		/* eslint-disable max-depth */
		for (let i = 0, klen = keys.length; i < klen; ++i) {
			const key   = keys[i];
			const origP = orig[key];
			const destP = dest[key];

			if (orig.hasOwnProperty(key)) {
				// Key exists in both.
				if (dest.hasOwnProperty(key)) {
					// Values are exactly the same, so do nothing.
					if (origP === destP) {
						continue;
					}

					// Values are of the same basic type.
					if (typeof origP === typeof destP) { // eslint-disable-line valid-typeof
						// Values are functions.
						if (typeof origP === 'function') {
							/* diffed[key] = [Op.Copy, destP]; */
							if (origP.toString() !== destP.toString()) {
								diffed[key] = [Op.Copy, destP];
							}
						}
						// Values are primitives.
						else if (typeof origP !== 'object' || origP === null) {
							diffed[key] = [Op.Copy, destP];
						}
						// Values are objects.
						else {
							const origPType = objToString.call(origP);
							const destPType = objToString.call(destP);

							// Values are objects of the same reported type.
							if (origPType === destPType) {
								// Various special cases to handle supported non-generic objects.
								if (origP instanceof Date) {
									if (Number(origP) !== Number(destP)) {
										diffed[key] = [Op.Copy, clone(destP)];
									}
								}
								else if (origP instanceof Map) {
									diffed[key] = [Op.Copy, clone(destP)];
								}
								else if (origP instanceof RegExp) {
									if (origP.toString() !== destP.toString()) {
										diffed[key] = [Op.Copy, clone(destP)];
									}
								}
								else if (origP instanceof Set) {
									diffed[key] = [Op.Copy, clone(destP)];
								}

								// Unknown non-generic objects (custom or unsupported natives).
								else if (origPType !== '[object Object]') {
									// We cannot know how to process these objects,
									// so we simply accept them as-is.
									diffed[key] = [Op.Copy, clone(destP)];
								}

								// Generic objects.
								else {
									const recurse = diff(origP, destP);

									if (recurse !== null) {
										diffed[key] = recurse;
									}
								}
							}
							// Values are objects of different reported types.
							else {
								diffed[key] = [Op.Copy, clone(destP)];
							}
						}
					}
					// Values are of different types.
					else {
						diffed[key] = [
							Op.Copy,
							typeof destP !== 'object' || destP === null ? destP : clone(destP)
						];
					}
				}
				// Key only exists in orig.
				else {
					if (origIsArray && Util.isNumeric(key)) {
						const nKey = Number(key);

						if (!aOpRef) {
							aOpRef = '';

							do {
								aOpRef += '~';
							} while (keys.some(keyIsAOpRef));

							diffed[aOpRef] = [Op.SpliceArray, nKey, nKey];
						}

						if (nKey < diffed[aOpRef][1]) {
							diffed[aOpRef][1] = nKey;
						}

						if (nKey > diffed[aOpRef][2]) {
							diffed[aOpRef][2] = nKey;
						}
					}
					else {
						diffed[key] = Op.Delete;
					}
				}
			}
			// Key only exists in dest.
			else {
				diffed[key] = [
					Op.Copy,
					typeof destP !== 'object' || destP === null ? destP : clone(destP)
				];
			}
		}
		/* eslint-enable max-depth */

		return Object.keys(diffed).length > 0 ? diffed : null;
	}

	/*
		Returns the object resulting from updating the orig object with the diffed object.
	*/
	function patch(orig, diffed) /* patched object */ {
		const keys    = Object.keys(diffed || {});
		const patched = clone(orig);

		for (let i = 0, klen = keys.length; i < klen; ++i) {
			const key     = keys[i];
			const diffedP = diffed[key];

			if (diffedP === Op.Delete) {
				delete patched[key];
			}
			else if (diffedP instanceof Array) {
				switch (diffedP[0]) {
				case Op.SpliceArray:
					patched.splice(diffedP[1], 1 + (diffedP[2] - diffedP[1]));
					break;

				case Op.Copy:
					patched[key] = clone(diffedP[1]);
					break;

				case Op.CopyDate:
					patched[key] = new Date(diffedP[1]);
					break;
				}
			}
			else {
				patched[key] = patch(patched[key], diffedP);
			}
		}

		return patched;
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		Op    : { value : Op },
		diff  : { value : diff },
		patch : { value : patch }
	}));
})();
