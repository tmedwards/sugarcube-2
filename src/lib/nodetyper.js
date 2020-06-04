/***********************************************************************************************************************

	lib/nodetyper.js

	Copyright © 2020 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Util */

var NodeTyper = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*******************************************************************************************************************
		NodeTyper Class.
	*******************************************************************************************************************/
	class NodeTyper {
		constructor(node, append) {
			Object.defineProperties(this, {
				node : {
					value : node
				},

				childNodes : {
					value : []
				},

				nodeValue : {
					writable : true,
					value    : ''
				},

				append : {
					writable : true,
					value    : Boolean(append)
				},

				finished : {
					writable : true,
					value    : false
				}
			});

			if (node.nodeValue) {
				this.nodeValue = node.nodeValue;
				node.nodeValue = ''; // eslint-disable-line no-param-reassign
			}

			const childNodes = node.childNodes;

			while (childNodes.length > 0) {
				this.childNodes.push(new NodeTyper(childNodes[0], true));
				node.removeChild(childNodes[0]);
			}
		}

		finish() {
			while (this.type()) /* no-op */;
		}

		type(parentNode) {
			if (this.finished) {
				return false;
			}

			if (this.append) {
				if (parentNode) {
					parentNode.appendChild(this.node);
				}

				this.append = false;

				// Abruptly finish typing this node if the computed value of its parent node's
				// `display` property is `'none'`.
				if (jQuery(parentNode).css('display') === 'none') {
					return this.finish();
				}
			}

			if (this.nodeValue) {
				// NOTE: We use `Util.charAndPosAt()` here to properly handle Unicode
				// code points that are comprised of surrogate pairs.
				const { char, start, end } = Util.charAndPosAt(this.nodeValue, 0);
				this.node.nodeValue += char;
				this.nodeValue = this.nodeValue.slice(1 + end - start);
				return true;
			}

			const parent   = this.node;
			const children = this.childNodes;

			for (let i = 0; i < children.length; ++i) {
				if (children[i].type(parent)) {
					return true;
				}
			}

			this.finished = true;
			return false;
		}
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return NodeTyper;
})();
