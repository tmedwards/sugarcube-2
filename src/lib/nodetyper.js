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
		constructor(config) {
			if (typeof config !== 'object' || config === null) {
				throw new Error(`config parameter must be an object (received: ${Util.getType(config)})`);
			}
			if (!config.hasOwnProperty('targetNode')) {
				throw new Error('config parameter object must include a "targetNode" property');
			}

			Object.defineProperties(this, {
				node : {
					value : config.targetNode
				},

				childNodes : {
					value : []
				},

				nodeValue : {
					writable : true,
					value    : ''
				},

				appendTo : {
					writable : true,
					value    : config.parentNode || null
				},

				classNames : {
					writable : true,
					value    : config.classNames || null
				},

				finished : {
					writable : true,
					value    : false
				}
			});

			const node = this.node;

			if (node.nodeValue) {
				this.nodeValue = node.nodeValue;
				node.nodeValue = '';
			}

			const childNodes = node.childNodes;

			while (childNodes.length > 0) {
				this.childNodes.push(new NodeTyper({
					targetNode : childNodes[0],
					parentNode : node,
					classNames : this.classNames
				}));
				node.removeChild(childNodes[0]);
			}
		}

		finish() {
			while (this.type(true)) /* no-op */;
			return false;
		}

		type(finishValue) {
			if (this.finished) {
				return false;
			}

			if (this.appendTo) {
				this.appendTo.appendChild(this.node);
				this.appendTo = null;

				// Abruptly finish typing this node if….
				if (
					// …it's neither a element or text node.
					this.node.nodeType > Node.TEXT_NODE

					// …or the computed value of its parent node's `display` property is `'none'`.
					|| jQuery(this.node.parentNode).css('display') === 'none'
				) {
					return this.finish();
				}

				if (this.node.parentNode && this.classNames) {
					jQuery(this.node.parentNode).addClass(this.classNames);
				}
			}

			if (this.nodeValue) {
				if (finishValue) {
					// NOTE: We concatenate here in case we've already done some processing.
					this.node.nodeValue += this.nodeValue;
					this.nodeValue = '';
				}
				else {
					// NOTE: We use `Util.charAndPosAt()` here to properly handle Unicode code
					// points that are comprised of surrogate pairs.
					const { char, start, end } = Util.charAndPosAt(this.nodeValue, 0);
					this.node.nodeValue += char;
					this.nodeValue = this.nodeValue.slice(1 + end - start);
				}

				return true;
			}

			if (this.classNames) {
				jQuery(this.node.parentNode).removeClass(this.classNames);
				this.classNames = null;
			}

			const children = this.childNodes;

			for (let i = 0; i < children.length; ++i) {
				if (children[i].type()) {
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
