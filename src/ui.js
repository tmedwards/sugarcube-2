/***********************************************************************************************************************

	ui.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Config, Dialog, Engine, Has, L10n, Save, Setting, State, Story, Wikifier,
	       createSlug, errorPrologRegExp, triggerEvent
*/

var UI = (() => { // eslint-disable-line no-unused-vars, no-var
	/*******************************************************************************
		Utility Functions.
	*******************************************************************************/

	function assembleLinkList(passage, listEl) {
		let list = listEl;

		// Cache the value of `Config.debug`, then disable it during this method's run.
		const debugState = Config.debug;
		Config.debug = false;

		try {
			if (list == null) { // lazy equality for null
				list = document.createElement('ul');
			}

			// Wikify the content of the given source passage into a fragment.
			const frag = document.createDocumentFragment();
			new Wikifier(frag, Story.get(passage).processText().trim(), { cleanup : false });

			// Gather the text of any error elements within the fragment…
			const errors = Array.from(frag.querySelectorAll('.error'))
				.map(errEl => errEl.textContent.replace(errorPrologRegExp, ''));

			// …and throw an exception, if there were any errors.
			if (errors.length > 0) {
				throw new Error(errors.join('; '));
			}

			while (frag.hasChildNodes()) {
				const node = frag.firstChild;

				// Create list items for <a>-element nodes.
				if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toUpperCase() === 'A') {
					const li = document.createElement('li');
					list.appendChild(li);
					li.appendChild(node);
				}

				// Discard non-<a>-element nodes.
				else {
					frag.removeChild(node);
				}
			}
		}
		finally {
			// Restore `Config.debug` to its original value.
			Config.debug = debugState;
		}

		return list;
	}

	function buildRestart() {
		if (BUILD_DEBUG) { console.log('[UI/buildRestart()]'); }

		Dialog
			.create(L10n.get('restartTitle'), 'restart')
			.append(
				/* eslint-disable max-len */
				  `<p>${L10n.get('restartMesgPrompt')}</p><ul class="buttons">`
				+ `<li><button id="restart-ok">${L10n.get(['restartTextOk', 'textOk'])}</button></li>`
				+ `<li><button id="restart-cancel" class="ui-close">${L10n.get(['restartTextCancel', 'textCancel'])}</button></li>`
				+ '</ul>'
				/* eslint-enable max-len */
			);

		// NOTE: Instead of adding '.ui-close' to the '#restart-ok' button (to receive
		// the use of the default delegated dialog close handler), we set up a special
		// case close handler here.  We do this to ensure that the invocation of
		// `Engine.restart()` happens after the dialog has fully closed.  If we did not,
		// then a race condition could occur, causing display shenanigans.
		jQuery(Dialog.body())
			.find('#restart-ok')
			.ariaClick({ one : true }, () => {
				jQuery(document).one(':dialogclosed', () => Engine.restart());
				Dialog.close();
			});

		return true;
	}

	function buildSaves() {
		function createFileInput(id, callback) {
			const input = document.createElement('input');

			jQuery(input)
				.attr({
					id,
					type          : 'file',
					tabindex      : -1,
					'aria-hidden' : true
				})
				.css({
					display    : 'block',
					visibility : 'hidden',
					position   : 'fixed',
					left       : '-16128px', // 8K UHD horizontal ×2.1
					top        : '-16128px', // 8K UHD horizontal ×2.1
					width      : '1px',
					height     : '1px'
				})
				.on('change', callback);

			return input;
		}

		function createActionItem(id, classNames, text, label, callback) {
			const $btn = jQuery(document.createElement('button'))
				.attr('id', `saves-${id}`)
				.text(text);

			if (classNames) {
				$btn.addClass(classNames);
			}

			if (callback) {
				$btn.ariaClick({ label }, callback);
			}
			else {
				$btn.ariaDisabled(true);
			}

			return jQuery(document.createElement('li'))
				.append($btn);
		}

		function createSaveList() {
			function createButton(id, classNames, kind, index, callback) {
				let text;

				switch (id) {
					case 'delete': text = L10n.get('textDelete'); break;
					case 'load':   text = L10n.get('textLoad'); break;
					case 'save':   text = L10n.get('textSave'); break;
					default:       throw new Error(`buildSaves unknown ID "${id}"`);
				}

				const $btn = jQuery(document.createElement('button'))
					.attr('id', `saves-${id}-${index}`)
					.addClass(id);

				if (classNames) {
					$btn.addClass(classNames);
				}

				if (callback) {
					$btn.ariaClick({
						label : `${text} ${kind} ${index + 1}`
					}, () => {
						try {
							callback(index);
						}
						catch (ex) {
							openAlert(`${ex.message}.</p><p>${L10n.get('textAborting')}.`);
						}
					});
				}
				else {
					$btn.ariaDisabled(true);
				}

				return $btn;
			}

			const $tbody = jQuery(document.createElement('tbody'));

			// Create auto save UI entries.
			Save.browser.auto.entries().forEach(({ index, info }) => {
				/* legacy */
				const $tdSlot = jQuery(document.createElement('td'));
				/* /legacy */
				const $tdLoad = jQuery(document.createElement('td'));
				const $tdDesc = jQuery(document.createElement('td'));
				const $tdDele = jQuery(document.createElement('td'));

				// // Add the slot ID.
				// $tdSlot
				// 	.attr({
				// 		title        : `${L10n.get('savesTextBrowserAuto')} ${index + 1}`,
				// 		'aria-label' : `${L10n.get('savesTextBrowserAuto')} ${index + 1}`
				// 	})
				// 	.text(`A${index + 1}`);

				// Add the description and details.
				jQuery(document.createElement('div'))
					.text(info.desc)
					.appendTo($tdDesc);
				jQuery(document.createElement('div'))
					.addClass('details')
					/* legacy */
					.addClass('datestamp')
					/* /legacy */
					.text(`${L10n.get('savesTextBrowserAuto')}\u00a0${index + 1}\u00a0\u00a0\u2022\u00a0\u00a0`)
					.append(
						info.date
							? `${new Date(info.date).toLocaleString()}`
							: `<em>${L10n.get('savesTextNoDate')}</em>`
					)
					.appendTo($tdDesc);

				// Add the load button.
				$tdLoad.append(createButton(
					'load',
					'ui-close',
					L10n.get('savesTextBrowserAuto'),
					index,
					index => {
						jQuery(document).one(':dialogclosed', () => {
							Save.browser.auto.load(index)
								.then(
									Engine.show,
									ex => openAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('textAborting')}.`)
								);
						});
					}
				));

				// Add the delete button.
				$tdDele.append(createButton(
					'delete',
					null,
					L10n.get('savesTextBrowserAuto'),
					index,
					index => {
						Save.browser.auto.delete(index);
						buildSaves();
					}
				));

				jQuery(document.createElement('tr'))
					/* legacy */
					.append($tdSlot)
					/* /legacy */
					.append($tdLoad)
					.append($tdDesc)
					.append($tdDele)
					.appendTo($tbody);
			});

			const slotAllowed = typeof Config.saves.isAllowed !== 'function' || Config.saves.isAllowed(Save.Type.Slot);

			// Create slot save UI entries.
			//
			// NOTE: The array may be sparse.
			Save.browser.slot.entries().reduce(
				// Add slot entries.
				(slots, entry) => {
					slots[entry.index] = entry; // eslint-disable-line no-param-reassign
					return slots;
				},
				// Fill configured slots with empty entries.
				Array.from({ length : Config.saves.maxSlotSaves }, (_, i) => ({ index : i }))
			).forEach(({ index, info }) => {
				/* legacy */
				const $tdSlot = jQuery(document.createElement('td'));
				/* /legacy */
				const $tdLoad = jQuery(document.createElement('td'));
				const $tdDesc = jQuery(document.createElement('td'));
				const $tdDele = jQuery(document.createElement('td'));

				// // Add the slot ID.
				// $tdSlot
				// 	.attr({
				// 		title        : `${L10n.get('savesTextBrowserSlot')} ${index + 1}`,
				// 		'aria-label' : `${L10n.get('savesTextBrowserSlot')} ${index + 1}`
				// 	})
				// 	.text(index + 1);

				if (info) {
					// Add the description and details.
					jQuery(document.createElement('div'))
						.text(info.desc)
						.appendTo($tdDesc);
					jQuery(document.createElement('div'))
						.addClass('details')
						/* legacy */
						.addClass('datestamp')
						/* /legacy */
						.text(`${L10n.get('savesTextBrowserSlot')}\u00a0${index + 1}\u00a0\u00a0\u2022\u00a0\u00a0`)
						.append(
							info.date
								? `${new Date(info.date).toLocaleString()}`
								: `<em>${L10n.get('savesTextNoDate')}</em>`
						)
						.appendTo($tdDesc);

					// Add the load button.
					$tdLoad.append(createButton(
						'load',
						'ui-close',
						L10n.get('savesTextBrowserSlot'),
						index,
						index => {
							jQuery(document).one(':dialogclosed', () => {
								Save.browser.slot.load(index)
									.then(
										Engine.show,
										ex => openAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('textAborting')}.`)
									);
							});
						}
					));

					// Add the delete button.
					$tdDele.append(createButton(
						'delete',
						null,
						L10n.get('savesTextBrowserSlot'),
						index,
						index => {
							Save.browser.slot.delete(index);
							buildSaves();
						}
					));
				}
				else {
					// Add the, mostly empty, description and details.
					//
					// QUESTION: Should `$tdDesc` also get `aria-hidden="true"`?  The
					// `empty` class has `speak: none`, but that may be insufficient.
					$tdDesc.addClass('empty');
					jQuery(document.createElement('div'))
						.text('\u00a0')
						.appendTo($tdDesc);
					jQuery(document.createElement('div'))
						.addClass('details')
						/* legacy */
						.addClass('datestamp')
						/* /legacy */
						.text(`${L10n.get('savesTextBrowserSlot')}\u00a0${index + 1}`)
						.appendTo($tdDesc);

					// Add the save button, possibly disabled.
					$tdLoad.append(createButton(
						'save',
						null,
						L10n.get('savesTextBrowserSlot'),
						index,
						index < Config.saves.maxSlotSaves && slotAllowed
							? index => {
								Save.browser.slot.save(index);
								buildSaves();
							}
							: null
					));

					// Add the disabled delete button.
					$tdDele.append(createButton(
						'delete',
						null,
						L10n.get('savesTextBrowserSlot'),
						index
					));
				}

				jQuery(document.createElement('tr'))
					/* legacy */
					.append($tdSlot)
					/* /legacy */
					.append($tdLoad)
					.append($tdDesc)
					.append($tdDele)
					.appendTo($tbody);
			});

			return jQuery(document.createElement('table'))
				.attr('id', 'saves-list')
				.append($tbody);
		}

		if (BUILD_DEBUG) { console.log('[UI/buildSaves()]'); }

		const browserEnabled = Save.browser.isEnabled();

		// Bail out if both saves and the file API are disabled/missing.
		if (!browserEnabled && !Has.fileAPI) {
			openAlert(L10n.get('warningNoSaves'));
			return false;
		}

		Dialog.create(L10n.get('savesTitle'), 'saves');
		const $dialogBody = jQuery(Dialog.body());

		// Add slots header, list, and button list.
		if (browserEnabled) {
			jQuery(document.createElement('h2'))
				.text(L10n.get('savesHeaderBrowser'))
				.appendTo($dialogBody);

			$dialogBody.append(createSaveList());

			const $slotButtons = jQuery(document.createElement('ul'))
				.addClass('buttons slots')
				.appendTo($dialogBody);

			if (Has.fileAPI) {
				// Add the disk export/import buttons and the hidden `input[type=file]`
				// element that will be triggered by the `#saves-import` button.
				const slotImportInput = createFileInput('saves-import-handler', ev => {
					Save.disk.import(ev)
						.then(
							buildSaves,
							ex => openAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('textAborting')}.`)
						);
				});

				$slotButtons
					.append(createActionItem(
						'export',
						null,
						`${L10n.get('textExport')}\u2026`,
						L10n.get('savesLabelBrowserExport'),
						() => Save.disk.export(`saves-export-${Story.name}`)
					))
					.append(createActionItem(
						'import',
						null,
						`${L10n.get('textImport')}\u2026`,
						L10n.get('savesLabelBrowserImport'),
						() => slotImportInput.click()
					));

				jQuery(slotImportInput).appendTo($dialogBody);
			}

			// Add the slots clear button.
			$slotButtons.append(createActionItem(
				'clear',
				null,
				L10n.get('textClear'),
				L10n.get('savesLabelBrowserClear'),
				Save.browser.size > 0
					? () => {
						Save.browser.clear();
						buildSaves();
					}
					: null
			));
		}

		// Add the disk load and save buttons.
		if (Has.fileAPI) {
			jQuery(document.createElement('h2'))
				.text(L10n.get('savesHeaderDisk'))
				.appendTo($dialogBody);

			const $diskButtons = jQuery(document.createElement('ul'))
				.addClass('buttons')
				.appendTo($dialogBody);

			// Add the disk save/load buttons and the hidden `input[type=file]`
			// element that will be triggered by the `#saves-disk-load` button.
			const diskLoadInput = createFileInput('saves-disk-load-handler', ev => {
				jQuery(document).one(':dialogclosed', () => {
					Save.disk.load(ev)
						.then(
							Engine.show,
							ex => openAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('textAborting')}.`)
						);
				});
				Dialog.close();
			});

			$diskButtons
				.append(createActionItem(
					'disk-save',
					null,
					`${L10n.get('textSave')}\u2026`,
					L10n.get('savesLabelDiskSave'),
					typeof Config.saves.isAllowed !== 'function' || Config.saves.isAllowed(Save.Type.Disk)
						? () => Save.disk.save(Story.name)
						: null
				))
				.append(createActionItem(
					'disk-load',
					null,
					`${L10n.get('textLoad')}\u2026`,
					L10n.get('savesLabelDiskLoad'),
					() => diskLoadInput.click()
				));

			jQuery(diskLoadInput).appendTo($dialogBody);
		}

		return true;
	}

	function buildSettings() {
		if (BUILD_DEBUG) { console.log('[UI/buildSettings()]'); }

		Dialog.create(L10n.get('settingsTitle'), 'settings');
		const $dialogBody = jQuery(Dialog.body());

		Setting.forEach(control => {
			switch (control.type) {
				case Setting.Types.Header: {
					const name     = control.name;
					const id       = createSlug(name);
					const $header  = jQuery(document.createElement('div'));
					const $heading = jQuery(document.createElement('h2'));

					$header
						.attr('id', `header-body-${id}`)
						.append($heading)
						.appendTo($dialogBody);
					$heading
						.attr('id', `header-heading-${id}`)
						.wikiWithOptions({ cleanup : false }, name);

					// Set up the description, if any.
					if (control.desc) {
						jQuery(document.createElement('p'))
							.attr('id', `header-desc-${id}`)
							.wikiWithOptions({ cleanup : false }, control.desc)
							.appendTo($header);
					}

					return;
				}

				case Setting.Types.Value: {
					// no-op
					return;
				}
			}

			const name        = control.name;
			const id          = createSlug(name);
			const $setting    = jQuery(document.createElement('div'));
			const $label      = jQuery(document.createElement('label'));
			const $controlBox = jQuery(document.createElement('div'));
			let $control;

			// Set up the label+control wrapper.
			jQuery(document.createElement('div'))
				.append($label)
				.append($controlBox)
				.appendTo($setting);

			// Set up the description, if any.
			if (control.desc) {
				jQuery(document.createElement('p'))
					.attr('id', `setting-desc-${id}`)
					.wikiWithOptions({ cleanup : false }, control.desc)
					.appendTo($setting);
			}

			// Set up the label.
			$label
				.attr({
					id  : `setting-label-${id}`,
					for : `setting-control-${id}` // must be in sync with $control's ID (see below)
				})
				.wikiWithOptions({ cleanup : false }, control.label);

			// Set up the control.
			if (Setting.getValue(name) == null) { // lazy equality for null
				Setting.setValue(name, control.default);
			}

			switch (control.type) {
				case Setting.Types.List: {
					$control = jQuery(document.createElement('select'));

					for (let i = 0, iend = control.list.length; i < iend; ++i) {
						jQuery(document.createElement('option'))
							.val(i)
							.text(control.list[i])
							.appendTo($control);
					}

					$control
						.val(control.list.indexOf(Setting.getValue(name)))
						.attr('tabindex', 0)
						.on('change', function () {
							Setting.setValue(name, control.list[Number(this.value)]);
						});

					break;
				}

				case Setting.Types.Range: {
					$control = jQuery(document.createElement('input'));

					// NOTE: Setting the value with `<jQuery>.val()` can cause odd behavior
					// in Edge if it's called before the type is set, so we use the `value`
					// content attribute here to dodge the entire issue.
					$control
						.attr({
							type     : 'range',
							min      : control.min,
							max      : control.max,
							step     : control.step,
							value    : Setting.getValue(name),
							tabindex : 0
						})
						.on('change input', function () {
							Setting.setValue(name, Number(this.value));
						})
						.on('keypress', ev => {
							if (ev.which === 13) {
								ev.preventDefault();
								triggerEvent('change', $control);
							}
						});

					break;
				}

				case Setting.Types.Toggle: {
					$control = jQuery(document.createElement('button'));

					if (Setting.getValue(name)) {
						$control
							.addClass('enabled')
							.text(L10n.get('textOn'));
					}
					else {
						$control
							.text(L10n.get('textOff'));
					}

					$control.ariaClick(function () {
						const status = Setting.getValue(name);

						if (status) {
							jQuery(this)
								.removeClass('enabled')
								.text(L10n.get('textOff'));
						}
						else {
							jQuery(this)
								.addClass('enabled')
								.text(L10n.get('textOn'));
						}

						Setting.setValue(name, !status);
					});

					break;
				}
			}

			$control
				.attr('id', `setting-control-${id}`)
				.appendTo($controlBox);

			$setting
				.attr('id', `setting-body-${id}`)
				.appendTo($dialogBody);
		});

		// Add the button bar.
		$dialogBody
			.append(
				  '<ul class="buttons">'
				+     `<li><button id="settings-ok" class="ui-close">${L10n.get(['settingsTextOk', 'textOk'])}</button></li>`
				+     `<li><button id="settings-reset">${L10n.get('settingsTextReset')}</button></li>`
				+ '</ul>'
			)
			.find('#settings-reset')
			/*
				Instead of adding '.ui-close' to '#settings-reset' (to receive the use of the default
				delegated dialog close handler), we set up a special case close handler here.  We
				do this to ensure that the invocation of `window.location.reload()` happens after the
				dialog has fully closed.  If we did not, then a race condition could occur, causing
				display shenanigans.
			*/
			.ariaClick({ one : true }, () => {
				jQuery(document).one(':dialogclosed', () => {
					Setting.reset();
					window.location.reload();
				});
				Dialog.close();
			});

		return true;
	}

	function update() {
		triggerEvent(':uiupdate');
	}


	/*******************************************************************************
		Built-in Dialog Functions.
	*******************************************************************************/

	function openAlert(message, /* options, closeFn */ ...args) {
		Dialog
			.create(L10n.get('alertTitle'), 'alert')
			.append(
				  `<p>${message}</p><ul class="buttons">`
				+ `<li><button id="alert-ok" class="ui-close">${L10n.get(['alertTextOk', 'textOk'])}</button></li>`
				+ '</ul>'
			)
			.open(...args);
	}

	function openRestart(/* options, closeFn */ ...args) {
		buildRestart();
		Dialog.open(...args);
	}

	function openSaves(/* options, closeFn */ ...args) {
		buildSaves();
		Dialog.open(...args);
	}

	function openSettings(/* options, closeFn */ ...args) {
		buildSettings();
		Dialog.open(...args);
	}


	/*******************************************************************************
		Deprecated Functions.
	*******************************************************************************/

	// [DEPRECATED]
	function buildAutoload() {
		if (BUILD_DEBUG) { console.log('[UI/buildAutoload()]'); }

		console.warn('[DEPRECATED] UI.buildAutoload() is deprecated.');

		Dialog
			.create(L10n.get('autoloadTitle'), 'autoload')
			.append(
				/* eslint-disable max-len */
				  `<p>${L10n.get('autoloadMesgPrompt')}</p><ul class="buttons">`
				+ `<li><button id="autoload-ok" class="ui-close">${L10n.get(['autoloadTextOk', 'textOk'])}</button></li>`
				+ `<li><button id="autoload-cancel" class="ui-close">${L10n.get(['autoloadTextCancel', 'textCancel'])}</button></li>`
				+ '</ul>'
				/* eslint-enable max-len */
			);

		// Add an additional delegated click handler for the `.ui-close` elements to handle autoloading.
		jQuery(document).one('click.autoload', '.ui-close', ev => {
			const isAutoloadOk = ev.target.id === 'autoload-ok';
			jQuery(document).one(':dialogclosed', () => {
				new Promise((resolve, reject) => {
					if (isAutoloadOk) {
						resolve();
					}

					reject(); // eslint-disable-line prefer-promise-reject-errors
				})
					.then(() => {
						if (BUILD_DEBUG) { console.log('\tattempting autoload of browser continue'); }

						return Save.browser.continue();
					})
					.catch(() => {
						if (BUILD_DEBUG) { console.log(`\tstarting passage: "${Config.passages.start}"`); }

						Engine.play(Config.passages.start);
					});
			});
		});

		return true;
	}

	// [DEPRECATED]
	function buildJumpto() {
		if (BUILD_DEBUG) { console.log('[UI/buildJumpto()]'); }

		console.warn('[DEPRECATED] UI.buildJumpto() is deprecated.');

		const list = document.createElement('ul');

		Dialog
			.create(L10n.get('jumptoTitle'), 'jumpto list')
			.append(list);

		const expired = State.expired.length;

		for (let i = State.size - 1; i >= 0; --i) {
			if (i === State.activeIndex) {
				continue;
			}

			const passage = Story.get(State.history[i].title);

			if (passage && passage.tags.includes('bookmark')) {
				jQuery(document.createElement('li'))
					.append(
						jQuery(document.createElement('a'))
							.ariaClick({ one : true }, (function (index) {
								return () => jQuery(document).one(':dialogclosed', () => Engine.goTo(index));
							})(i))
							.addClass('ui-close')
							.text(`${L10n.get('textTurn')} ${expired + i + 1}`)
					)
					.appendTo(list);
			}
		}

		if (!list.hasChildNodes()) {
			jQuery(list).append(`<li><a><em>${L10n.get('jumptoMesgUnavailable')}</em></a></li>`);
		}
	}

	// [DEPRECATED]
	function buildShare() {
		if (BUILD_DEBUG) { console.log('[UI/buildShare()]'); }

		console.warn('[DEPRECATED] UI.buildShare() is deprecated.');

		try {
			Dialog
				.create(L10n.get('shareTitle'), 'share list')
				.append(assembleLinkList('StoryShare'));
		}
		catch (ex) {
			console.error(ex);
			Alert.error('StoryShare', ex.message);
			return false;
		}

		return true;
	}

	// [DEPRECATED]
	function openJumpto(/* options, closeFn */ ...args) {
		buildJumpto();
		Dialog.open(...args);
	}

	// [DEPRECATED]
	function openShare(/* options, closeFn */ ...args) {
		buildShare();
		Dialog.open(...args);
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		// Utility Functions.
		assembleLinkList : { value : assembleLinkList },
		buildRestart     : { value : buildRestart },
		buildSaves       : { value : buildSaves },
		buildSettings    : { value : buildSettings },
		update           : { value : update },

		// Built-in Dialog Functions.
		alert    : { value : openAlert },
		restart  : { value : openRestart },
		saves    : { value : openSaves },
		settings : { value : openSettings },

		// Deprecated Functions.
		buildAutoload : { value : buildAutoload },
		buildJumpto   : { value : buildJumpto },
		buildShare    : { value : buildShare },
		jumpto        : { value : openJumpto },
		share         : { value : openShare }
	}));
})();
