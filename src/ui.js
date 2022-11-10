/***********************************************************************************************************************

	ui.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/*
	global Alert, Config, Dialog, Engine, Has, L10n, Save, Setting, State, Story, Wikifier,
	       createSlug, errorPrologRegExp, settings
*/

var UI = (() => { // eslint-disable-line no-unused-vars, no-var
	/*******************************************************************************
		UI Functions, Core.
	*******************************************************************************/

	function uiAssembleLinkList(passage, listEl) {
		let list = listEl;

		// Cache the values of `Config.debug` and `Config.cleanupWikifierOutput`,
		// then disable them during this method's run.
		const debugState = Config.debug;
		const cleanState = Config.cleanupWikifierOutput;
		Config.debug = false;
		Config.cleanupWikifierOutput = false;

		try {
			if (list == null) { // lazy equality for null
				list = document.createElement('ul');
			}

			// Wikify the content of the given source passage into a fragment.
			const frag = document.createDocumentFragment();
			new Wikifier(frag, Story.get(passage).processText().trim());

			// Gather the text of any error elements within the fragment…
			const errors = [...frag.querySelectorAll('.error')]
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
			// Restore the `Config` settings to their original values.
			Config.cleanupWikifierOutput = cleanState;
			Config.debug = debugState;
		}

		return list;
	}


	/*******************************************************************************
		UI Functions, Built-ins.
	*******************************************************************************/

	function uiOpenAlert(message, /* options, closeFn */ ...args) {
		jQuery(Dialog.setup(L10n.get('alertTitle'), 'alert'))
			.append(
				  `<p>${message}</p><ul class="buttons">`
				+ `<li><button id="alert-ok" class="ui-close">${L10n.get(['alertOk', 'ok'])}</button></li>`
				+ '</ul>'
			);
		Dialog.open(...args);
	}

	function uiOpenJumpto(/* options, closeFn */ ...args) {
		uiBuildJumpto();
		Dialog.open(...args);
	}

	function uiOpenRestart(/* options, closeFn */ ...args) {
		uiBuildRestart();
		Dialog.open(...args);
	}

	function uiOpenSaves(/* options, closeFn */ ...args) {
		uiBuildSaves();
		Dialog.open(...args);
	}

	function uiOpenSettings(/* options, closeFn */ ...args) {
		uiBuildSettings();
		Dialog.open(...args);
	}

	function uiOpenShare(/* options, closeFn */ ...args) {
		uiBuildShare();
		Dialog.open(...args);
	}

	function uiBuildAutoload() {
		if (DEBUG) { console.log('[UI/uiBuildAutoload()]'); }

		console.warn('[DEPRECATED] UI.buildAutoload() is deprecated.');

		jQuery(Dialog.setup(L10n.get('autoloadTitle'), 'autoload'))
			.append(
				/* eslint-disable max-len */
				  `<p>${L10n.get('autoloadPrompt')}</p><ul class="buttons">`
				+ `<li><button id="autoload-ok" class="ui-close">${L10n.get(['autoloadOk', 'ok'])}</button></li>`
				+ `<li><button id="autoload-cancel" class="ui-close">${L10n.get(['autoloadCancel', 'cancel'])}</button></li>`
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
						if (DEBUG) { console.log('\tattempting autoload of browser continue'); }

						return Save.browser.continue();
					})
					.catch(() => {
						if (DEBUG) { console.log(`\tstarting passage: "${Config.passages.start}"`); }

						Engine.play(Config.passages.start);
					});
			});
		});

		return true;
	}

	function uiBuildJumpto() {
		if (DEBUG) { console.log('[UI/uiBuildJumpto()]'); }

		console.warn('[DEPRECATED] UI.buildJumpto() is deprecated.');

		const list = document.createElement('ul');

		jQuery(Dialog.setup(L10n.get('jumptoTitle'), 'jumpto list'))
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
							.ariaClick({ one : true }, (function (idx) {
								return () => jQuery(document).one(':dialogclosed', () => Engine.goTo(idx));
							})(i))
							.addClass('ui-close')
							.text(`${L10n.get('jumptoTurn')} ${expired + i + 1}`)
					)
					.appendTo(list);
			}
		}

		if (!list.hasChildNodes()) {
			jQuery(list).append(`<li><a><em>${L10n.get('jumptoUnavailable')}</em></a></li>`);
		}
	}

	function uiBuildRestart() {
		if (DEBUG) { console.log('[UI/uiBuildRestart()]'); }

		jQuery(Dialog.setup(L10n.get('restartTitle'), 'restart'))
			.append(
				/* eslint-disable max-len */
				  `<p>${L10n.get('restartPrompt')}</p><ul class="buttons">`
				+ `<li><button id="restart-ok">${L10n.get(['restartOk', 'ok'])}</button></li>`
				+ `<li><button id="restart-cancel" class="ui-close">${L10n.get(['restartCancel', 'cancel'])}</button></li>`
				+ '</ul>'
				/* eslint-enable max-len */
			)
			.find('#restart-ok')
			/*
				Instead of adding '.ui-close' to '#restart-ok' (to receive the use of the default
				delegated dialog close handler), we set up a special case close handler here.  We
				do this to ensure that the invocation of `Engine.restart()` happens after the dialog
				has fully closed.  If we did not, then a race condition could occur, causing display
				shenanigans.
			*/
			.ariaClick({ one : true }, () => {
				jQuery(document).one(':dialogclosed', () => Engine.restart());
				Dialog.close();
			});

		return true;
	}

	function uiBuildSaves() {
		function showAlert(message) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => uiOpenAlert(message));
			}
			else {
				uiOpenAlert(message);
			}
		}

		function $createFileInput(id, callback) {
			return jQuery(document.createElement('input'))
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
		}

		function createActionItem(id, classNames, label, callback) {
			const $btn = jQuery(document.createElement('button'))
				.attr('id', `saves-${id}`)
				.text(label);

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
			function createButton(id, classNames, typeLabel, idx, callback) {
				let btnText;

				switch (id) {
					case 'delete': btnText = L10n.get('savesLabelDelete'); break;
					case 'load':   btnText = L10n.get('savesLabelLoad'); break;
					case 'save':   btnText = L10n.get('savesLabelSave'); break;
					default:       throw new Error(`buildSaves unknown ID "${id}"`);
				}

				const $btn = jQuery(document.createElement('button'))
					.attr('id', `saves-${id}-${idx}`)
					.addClass(id)
					.text(btnText);

				if (classNames) {
					$btn.addClass(classNames);
				}

				if (callback) {
					$btn.ariaClick({
						label : `${btnText} ${typeLabel} ${idx + 1}`
					}, () => {
						try {
							callback(idx);
						}
						catch (ex) {
							showAlert(ex.message);
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
			Save.browser.auto.entries().forEach(({ idx, info }) => {
				/* legacy */
				const $tdSlot = jQuery(document.createElement('td'));
				/* /legacy */
				const $tdLoad = jQuery(document.createElement('td'));
				const $tdDesc = jQuery(document.createElement('td'));
				const $tdDele = jQuery(document.createElement('td'));

				// // Add the slot ID.
				// $tdSlot
				// 	.attr({
				// 		title        : `${L10n.get('savesLabelAuto')} ${idx + 1}`,
				// 		'aria-label' : `${L10n.get('savesLabelAuto')} ${idx + 1}`
				// 	})
				// 	.text(`A${idx + 1}`);

				// Add the description and details.
				jQuery(document.createElement('div'))
					.text(info.desc)
					.appendTo($tdDesc);
				jQuery(document.createElement('div'))
					.addClass('details')
					/* legacy */
					.addClass('datestamp')
					/* /legacy */
					.text(`${L10n.get('savesLabelAuto')}\u00a0${idx + 1}\u00a0\u00a0\u2022\u00a0\u00a0`)
					.append(
						info.date
							? `${new Date(info.date).toLocaleString()}`
							: `<em>${L10n.get('savesUnknownDate')}</em>`
					)
					.appendTo($tdDesc);

				// Add the load button.
				$tdLoad.append(createButton(
					'load',
					'ui-close',
					L10n.get('savesLabelAuto'),
					idx,
					idx => {
						jQuery(document).one(':dialogclosed', () => {
							Save.browser.auto.load(idx)
								.then(
									Engine.show,
									ex => showAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('aborting')}.`)
								);
						});
					}
				));

				// Add the delete button.
				$tdDele.append(createButton(
					'delete',
					null,
					L10n.get('savesLabelAuto'),
					idx,
					idx => {
						Save.browser.auto.delete(idx);
						uiBuildSaves();
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
					slots[entry.idx] = entry; // eslint-disable-line no-param-reassign
					return slots;
				},
				// Fill configured slots with empty entries.
				Array.from({ length : Config.saves.maxSlotSaves }, (_, i) => ({ idx : i }))
			).forEach(({ idx, info }) => {
				/* legacy */
				const $tdSlot = jQuery(document.createElement('td'));
				/* /legacy */
				const $tdLoad = jQuery(document.createElement('td'));
				const $tdDesc = jQuery(document.createElement('td'));
				const $tdDele = jQuery(document.createElement('td'));

				// // Add the slot ID.
				// $tdSlot
				// 	.attr({
				// 		title        : `${L10n.get('savesLabelSlot')} ${idx + 1}`,
				// 		'aria-label' : `${L10n.get('savesLabelSlot')} ${idx + 1}`
				// 	})
				// 	.text(idx + 1);

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
						.text(`${L10n.get('savesLabelSlot')}\u00a0${idx + 1}\u00a0\u00a0\u2022\u00a0\u00a0`)
						.append(
							info.date
								? `${new Date(info.date).toLocaleString()}`
								: `<em>${L10n.get('savesUnknownDate')}</em>`
						)
						.appendTo($tdDesc);

					// Add the load button.
					$tdLoad.append(createButton(
						'load',
						'ui-close',
						L10n.get('savesLabelSlot'),
						idx,
						idx => {
							jQuery(document).one(':dialogclosed', () => {
								Save.browser.slot.load(idx)
									.then(
										Engine.show,
										ex => showAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('aborting')}.`)
									);
							});
						}
					));

					// Add the delete button.
					$tdDele.append(createButton(
						'delete',
						null,
						L10n.get('savesLabelSlot'),
						idx,
						idx => {
							Save.browser.slot.delete(idx);
							uiBuildSaves();
						}
					));
				}
				else {
					// Add the description.
					// $tdDesc.addClass('empty').text('\u2022\u00a0\u00a0\u2022\u00a0\u00a0\u2022');
					$tdDesc.addClass('empty');

					// Add the save button, possibly disabled.
					$tdLoad.append(createButton(
						'save',
						'ui-close',
						L10n.get('savesLabelSlot'),
						idx,
						idx < Config.saves.maxSlotSaves && slotAllowed
							? Save.browser.slot.save
							: null
					));

					// Add the disabled delete button.
					$tdDele.append(createButton(
						'delete',
						null,
						L10n.get('savesLabelSlot'),
						idx
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

		if (DEBUG) { console.log('[UI/uiBuildSaves()]'); }

		const browserEnabled = Save.browser.isEnabled();

		// Bail out if both saves and the file API are disabled/missing.
		if (!browserEnabled && !Has.fileAPI) {
			showAlert(L10n.get('warningNoSaves'));
			return false;
		}

		Dialog.setup(L10n.get('savesTitle'), 'saves');
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
				// Add the browser export/import buttons and the hidden `input[type=file]`
				// element that will be triggered by the `#saves-import` button.
				const $slotImportInput = $createFileInput('saves-import-handler', ev => {
					Save.browser.import(ev)
						.then(
							uiBuildSaves,
							ex => {
								Dialog.close();
								showAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('aborting')}.`);
							}
						);
				});

				$slotButtons
					.append(createActionItem(
						'export',
						null,
						L10n.get('savesLabelExport'),
						() => Save.browser.export(`saves-export-${Story.name}`)
					))
					.append(createActionItem(
						'import',
						null,
						L10n.get('savesLabelImport'),
						() => $slotImportInput.trigger('click')
					));

				$slotImportInput.appendTo($dialogBody);
			}

			// Add the slots clear button.
			$slotButtons.append(createActionItem(
				'clear',
				null,
				L10n.get('savesLabelClear'),
				Save.browser.size > 0
					? () => {
						Save.browser.clear();
						uiBuildSaves();
					}
					: null
			));
		}

		// Add button bar items (export, import, and clear).
		if (Has.fileAPI) {
			jQuery(document.createElement('h2'))
				.text(L10n.get('savesHeaderDisk'))
				.appendTo($dialogBody);

			const $diskButtons = jQuery(document.createElement('ul'))
				.addClass('buttons')
				.appendTo($dialogBody);

			// Add the disk save/load buttons and the hidden `input[type=file]`
			// element that will be triggered by the `#saves-disk-load` button.
			const $diskLoadInput = $createFileInput('saves-disk-load-handler', ev => {
				jQuery(document).one(':dialogclosed', () => {
					Save.disk.load(ev)
						.then(
							Engine.show,
							ex => {
								Dialog.close();
								showAlert(`${ex.message.toUpperFirst()}.</p><p>${L10n.get('aborting')}.`);
							}
						);
				});
				Dialog.close();
			});

			$diskButtons
				.append(createActionItem(
					'disk-save',
					null,
					L10n.get('savesLabelDiskSave'),
					typeof Config.saves.isAllowed !== 'function' || Config.saves.isAllowed(Save.Type.Disk)
						? () => Save.disk.save(Story.name)
						: null
				))
				.append(createActionItem(
					'disk-load',
					null,
					L10n.get('savesLabelDiskLoad'),
					() => $diskLoadInput.trigger('click')
				));

			$diskLoadInput.appendTo($dialogBody);
		}

		return true;
	}

	function uiBuildSettings() {
		if (DEBUG) { console.log('[UI/uiBuildSettings()]'); }

		const $dialogBody = jQuery(Dialog.setup(L10n.get('settingsTitle'), 'settings'));

		Setting.forEach(control => {
			if (control.type === Setting.Types.Header) {
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
					.wiki(name);

				// Set up the description, if any.
				if (control.desc) {
					jQuery(document.createElement('p'))
						.attr('id', `header-desc-${id}`)
						.wiki(control.desc)
						.appendTo($header);
				}

				return;
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
					.wiki(control.desc)
					.appendTo($setting);
			}

			// Set up the label.
			$label
				.attr({
					id  : `setting-label-${id}`,
					for : `setting-control-${id}` // must be in sync with $control's ID (see below)
				})
				.wiki(control.label);

			// Set up the control.
			if (settings[name] == null) { // lazy equality for null
				settings[name] = control.default;
			}

			switch (control.type) {
				case Setting.Types.Toggle: {
					$control = jQuery(document.createElement('button'));

					if (settings[name]) {
						$control
							.addClass('enabled')
							.text(L10n.get('settingsOn'));
					}
					else {
						$control
							.text(L10n.get('settingsOff'));
					}

					$control.ariaClick(function () {
						if (settings[name]) {
							jQuery(this)
								.removeClass('enabled')
								.text(L10n.get('settingsOff'));
							settings[name] = false;
						}
						else {
							jQuery(this)
								.addClass('enabled')
								.text(L10n.get('settingsOn'));
							settings[name] = true;
						}

						Setting.save();

						if (control.hasOwnProperty('onChange')) {
							control.onChange.call({
								name,
								value   : settings[name],
								default : control.default
							});
						}
					});

					break;
				}

				case Setting.Types.List: {
					$control = jQuery(document.createElement('select'));

					for (let i = 0, iend = control.list.length; i < iend; ++i) {
						jQuery(document.createElement('option'))
							.val(i)
							.text(control.list[i])
							.appendTo($control);
					}

					$control
						.val(control.list.indexOf(settings[name]))
						.attr('tabindex', 0)
						.on('change', function () {
							settings[name] = control.list[Number(this.value)];
							Setting.save();

							if (control.hasOwnProperty('onChange')) {
								control.onChange.call({
									name,
									value   : settings[name],
									default : control.default,
									list    : control.list
								});
							}
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
							value    : settings[name],
							tabindex : 0
						})
						.on('change input', function () {
							settings[name] = Number(this.value);
							Setting.save();

							if (control.hasOwnProperty('onChange')) {
								control.onChange.call({
									name,
									value   : settings[name],
									default : control.default,
									min     : control.min,
									max     : control.max,
									step    : control.step
								});
							}
						})
						.on('keypress', ev => {
							if (ev.which === 13) {
								ev.preventDefault();
								$control.trigger('change');
							}
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
				+     `<li><button id="settings-ok" class="ui-close">${L10n.get(['settingsOk', 'ok'])}</button></li>`
				+     `<li><button id="settings-reset">${L10n.get('settingsReset')}</button></li>`
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

	function uiBuildShare() {
		if (DEBUG) { console.log('[UI/uiBuildShare()]'); }

		console.warn('[DEPRECATED] UI.buildShare() is deprecated.');

		try {
			jQuery(Dialog.setup(L10n.get('shareTitle'), 'share list'))
				.append(uiAssembleLinkList('StoryShare'));
		}
		catch (ex) {
			console.error(ex);
			Alert.error('StoryShare', ex.message);
			return false;
		}

		return true;
	}


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.preventExtensions(Object.create(null, {
		/*
			UI Functions, Core.
		*/
		assembleLinkList : { value : uiAssembleLinkList },

		/*
			UI Functions, Built-ins.
		*/
		alert         : { value : uiOpenAlert },
		jumpto        : { value : uiOpenJumpto },
		restart       : { value : uiOpenRestart },
		saves         : { value : uiOpenSaves },
		settings      : { value : uiOpenSettings },
		share         : { value : uiOpenShare },
		buildAutoload : { value : uiBuildAutoload },
		buildJumpto   : { value : uiBuildJumpto },
		buildRestart  : { value : uiBuildRestart },
		buildSaves    : { value : uiBuildSaves },
		buildSettings : { value : uiBuildSettings },
		buildShare    : { value : uiBuildShare },

		/*
			Legacy Aliases.
		*/
		// `UIBar` methods.
		/* global UIBar */
		stow                     : { value : () => UIBar.stow() },
		unstow                   : { value : () => UIBar.unstow() },
		setStoryElements         : { value : () => UIBar.update() },
		// `Dialog` methods.
		isOpen                   : { value : (...args) => Dialog.isOpen(...args) },
		body                     : { value : () => Dialog.body() },
		setup                    : { value : (...args) => Dialog.setup(...args) },
		addClickHandler          : { value : (...args) => Dialog.addClickHandler(...args) },
		open                     : { value : (...args) => Dialog.open(...args) },
		close                    : { value : (...args) => Dialog.close(...args) },
		resize                   : { value : () => Dialog.resize() },
		// Deprecated method names.
		buildDialogAutoload      : { value : uiBuildAutoload },
		buildDialogJumpto        : { value : uiBuildJumpto },
		buildDialogRestart       : { value : uiBuildRestart },
		buildDialogSaves         : { value : uiBuildSaves },
		buildDialogSettings      : { value : uiBuildSettings },
		buildDialogShare         : { value : uiBuildShare },
		buildLinkListFromPassage : { value : uiAssembleLinkList }
	}));
})();
