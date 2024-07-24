/***********************************************************************************************************************

	macro/macros/audio-macros.js

	Copyright © 2013–2024 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Has, Macro, SimpleAudio, Story */

(() => {
	if (Has.audio) {
		const errorOnePlaybackAction = (cur, prev) => `only one playback action allowed per invocation, "${cur}" cannot be combined with "${prev}"`;

		/*
			<<audio>>
		*/
		Macro.add('audio', {
			handler() {
				if (this.args.length < 2) {
					const errors = [];
					if (this.args.length < 1) { errors.push('track and/or group IDs'); }
					if (this.args.length < 2) { errors.push('actions'); }
					return this.error(`no ${errors.join(' or ')} specified`);
				}

				let selected;

				// Process the track and/or group IDs.
				try {
					selected = SimpleAudio.select(this.args[0]);
				}
				catch (ex) {
					return this.error(ex.message);
				}

				const args = this.args.slice(1);
				let action;
				let fadeOver = 5;
				let fadeTo;
				let loop;
				let mute;
				let passage;
				let time;
				let volume;

				// Process arguments.
				while (args.length > 0) {
					const arg = args.shift();
					let raw;

					switch (arg) {
						case 'load':
						case 'pause':
						case 'play':
						case 'stop':
						case 'unload': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = arg;
							break;
						}

						case 'fadein': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = 'fade';
							fadeTo = 1;
							break;
						}

						case 'fadeout': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = 'fade';
							fadeTo = 0;
							break;
						}

						case 'fadeto': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							if (args.length === 0) {
								return this.error('fadeto missing required level value');
							}

							action = 'fade';
							raw = args.shift();
							fadeTo = Number.parseFloat(raw);

							if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
								return this.error(`cannot parse fadeto: ${raw}`);
							}

							break;
						}

						case 'fadeoverto': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							if (args.length < 2) {
								const errors = [];
								if (args.length < 1) { errors.push('seconds'); }
								if (args.length < 2) { errors.push('level'); }
								return this.error(`fadeoverto missing required ${errors.join(' and ')} value${errors.length > 1 ? 's' : ''}`);
							}

							action = 'fade';
							raw = args.shift();
							fadeOver = Number.parseFloat(raw);

							if (Number.isNaN(fadeOver) || !Number.isFinite(fadeOver)) {
								return this.error(`cannot parse fadeoverto: ${raw}`);
							}

							raw = args.shift();
							fadeTo = Number.parseFloat(raw);

							if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
								return this.error(`cannot parse fadeoverto: ${raw}`);
							}

							break;
						}

						case 'volume': {
							if (args.length === 0) {
								return this.error('volume missing required level value');
							}

							raw = args.shift();
							volume = Number.parseFloat(raw);

							if (Number.isNaN(volume) || !Number.isFinite(volume)) {
								return this.error(`cannot parse volume: ${raw}`);
							}

							break;
						}

						case 'mute':
						case 'unmute':
							mute = arg === 'mute';
							break;

						case 'time': {
							if (args.length === 0) {
								return this.error('time missing required seconds value');
							}

							raw = args.shift();
							time = Number.parseFloat(raw);

							if (Number.isNaN(time) || !Number.isFinite(time)) {
								return this.error(`cannot parse time: ${raw}`);
							}

							break;
						}

						case 'loop':
						case 'unloop':
							loop = arg === 'loop';
							break;

						case 'goto': {
							if (args.length === 0) {
								return this.error('goto missing required passage title');
							}

							raw = args.shift();

							if (typeof raw === 'object') {
								// Argument was in wiki link syntax.
								passage = raw.link;
							}
							else {
								// Argument was simply the passage name.
								passage = raw;
							}

							if (!Story.has(passage)) {
								return this.error(`passage "${passage}" does not exist`);
							}

							break;
						}

						default:
							return this.error(`unknown action: ${arg}`);
					}
				}

				try {
					if (volume != null) { // lazy equality for null
						selected.volume(volume);
					}

					if (time != null) { // lazy equality for null
						selected.time(time);
					}

					if (mute != null) { // lazy equality for null
						selected.mute(mute);
					}

					if (loop != null) { // lazy equality for null
						selected.loop(loop);
					}

					if (passage != null) { // lazy equality for null
						const nsEnded = `ended.macros.macro-${this.name}_goto`;
						selected
							.off(nsEnded)
							.one(nsEnded, () => {
								selected.off(nsEnded);
								Engine.play(passage);
							});
					}

					switch (action) {
						case 'fade':
							selected.fade(fadeOver, fadeTo);
							break;

						case 'load':
							selected.load();
							break;

						case 'pause':
							selected.pause();
							break;

						case 'play':
							selected.playWhenAllowed();
							break;

						case 'stop':
							selected.stop();
							break;

						case 'unload':
							selected.unload();
							break;
					}

					// Custom debug view setup.
					if (Config.debug) {
						this.debugView.modes({ hidden : true });
					}
				}
				catch (ex) {
					return this.error(`error executing action: ${ex.message}`);
				}
			}
		});

		/*
			<<cacheaudio track_id source_list>>
		*/
		Macro.add('cacheaudio', {
			handler() {
				if (this.args.length < 2) {
					const errors = [];
					if (this.args.length < 1) { errors.push('track ID'); }
					if (this.args.length < 2) { errors.push('sources'); }
					return this.error(`no ${errors.join(' or ')} specified`);
				}

				const id = String(this.args[0]).trim();

				try {
					SimpleAudio.tracks.add(id, this.args.slice(1));
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// If in Test Mode and no supported sources were specified, return an error.
				if (Config.debug && !SimpleAudio.tracks.get(id).hasSource()) {
					return this.error(`track ID "${id}": no supported audio sources found`);
				}

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			<<createaudiogroup group_id>>
				<<track track_id>>
				…
			<</createaudiogroup>>
		*/
		Macro.add('createaudiogroup', {
			tags : ['track'],

			handler() {
				if (this.args.length === 0) {
					return this.error('no group ID specified');
				}

				if (this.payload.length === 1) {
					return this.error('no tracks defined via <<track>>');
				}

				// Initial debug view setup for `<<createaudiogroup>>`.
				if (Config.debug) {
					this.debugView
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}

				const groupId  = String(this.args[0]).trim();
				const trackIds = [];

				for (let i = 1, len = this.payload.length; i < len; ++i) {
					if (this.payload[i].args.length < 1) {
						return this.error('no track ID specified');
					}

					trackIds.push(String(this.payload[i].args[0]).trim());

					// Custom debug view setup for the current `<<track>>`.
					if (Config.debug) {
						this
							.createDebugView(this.payload[i].name, this.payload[i].source)
							.modes({
								nonvoid : false,
								hidden  : true
							});
					}
				}

				try {
					SimpleAudio.groups.add(groupId, trackIds);
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// Custom fake debug view setup for `<</createaudiogroup>>`.
				if (Config.debug) {
					this
						.createDebugView(`/${this.name}`, `<</${this.name}>>`)
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}
			}
		});

		/*
			<<createplaylist list_id>>
				<<track track_id action_list>>
				…
			<</createplaylist>>
		*/
		Macro.add('createplaylist', {
			tags : ['track'],

			handler() {
				if (this.args.length === 0) {
					return this.error('no list ID specified');
				}

				if (this.payload.length === 1) {
					return this.error('no tracks defined via <<track>>');
				}

				// Initial debug view setup for `<<createplaylist>>`.
				if (Config.debug) {
					this.debugView
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}

				const listId    = String(this.args[0]).trim();
				const trackObjs = [];

				for (let i = 1, len = this.payload.length; i < len; ++i) {
					if (this.payload[i].args.length === 0) {
						return this.error('no track ID specified');
					}

					const trackObj = { id : String(this.payload[i].args[0]).trim() };
					const args     = this.payload[i].args.slice(1);

					// Process arguments.
					while (args.length > 0) {
						const arg = args.shift();
						let raw;
						let parsed;

						switch (arg) {
							case 'own':
								trackObj.own = true;
								break;

							case 'rate': {
								// if (args.length === 0) {
								// 	return this.error('rate missing required speed value');
								// }
								//
								// raw = args.shift();
								// parsed = Number.parseFloat(raw);
								//
								// if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
								// 	return this.error(`cannot parse rate: ${raw}`);
								// }
								//
								// trackObj.rate = parsed;

								if (args.length > 0) {
									args.shift();
								}

								break;
							}

							case 'volume': {
								if (args.length === 0) {
									return this.error('volume missing required level value');
								}

								raw = args.shift();
								parsed = Number.parseFloat(raw);

								if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
									return this.error(`cannot parse volume: ${raw}`);
								}

								trackObj.volume = parsed;
								break;
							}

							default:
								return this.error(`unknown action: ${arg}`);
						}
					}

					trackObjs.push(trackObj);

					// Custom debug view setup for the current `<<track>>`.
					if (Config.debug) {
						this
							.createDebugView(this.payload[i].name, this.payload[i].source)
							.modes({
								nonvoid : false,
								hidden  : true
							});
					}
				}

				try {
					SimpleAudio.lists.add(listId, trackObjs);
				}
				catch (ex) {
					return this.error(ex.message);
				}

				// Custom fake debug view setup for `<</createplaylist>>`.
				if (Config.debug) {
					this
						.createDebugView(`/${this.name}`, `<</${this.name}>>`)
						.modes({
							nonvoid : false,
							hidden  : true
						});
				}
			}
		});

		/*
			<<masteraudio action_list>>
		*/
		Macro.add('masteraudio', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no actions specified');
				}

				const args = this.args.slice(0);
				let action;
				let mute;
				let muteOnHide;
				let volume;

				// Process arguments.
				while (args.length > 0) {
					const arg = args.shift();
					let raw;

					switch (arg) {
						case 'load':
						case 'stop':
						case 'unload': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = arg;

							break;
						}

						case 'mute':
						case 'unmute':
							mute = arg === 'mute';
							break;

						case 'muteonhide':
						case 'nomuteonhide':
							muteOnHide = arg === 'muteonhide';
							break;

						case 'volume': {
							if (args.length === 0) {
								return this.error('volume missing required level value');
							}

							raw = args.shift();
							volume = Number.parseFloat(raw);

							if (Number.isNaN(volume) || !Number.isFinite(volume)) {
								return this.error(`cannot parse volume: ${raw}`);
							}

							break;
						}

						default:
							return this.error(`unknown action: ${arg}`);
					}
				}

				try {
					if (mute != null) { // lazy equality for null
						SimpleAudio.mute(mute);
					}

					if (muteOnHide != null) { // lazy equality for null
						SimpleAudio.muteOnHidden(muteOnHide);
					}

					if (volume != null) { // lazy equality for null
						SimpleAudio.volume(volume);
					}

					switch (action) {
						case 'load':
							SimpleAudio.load();
							break;

						case 'stop':
							SimpleAudio.stop();
							break;

						case 'unload':
							SimpleAudio.unload();
							break;
					}

					// Custom debug view setup.
					if (Config.debug) {
						this.debugView.modes({ hidden : true });
					}
				}
				catch (ex) {
					return this.error(`error executing action: ${ex.message}`);
				}
			}
		});

		/*
			<<playlist list_id action_list>>
		*/
		Macro.add('playlist', {
			handler() {
				if (this.args.length < 2) {
					const errors = [];
					if (this.args.length < 1) { errors.push('list ID'); }
					if (this.args.length < 2) { errors.push('actions'); }
					return this.error(`no ${errors.join(' or ')} specified`);
				}

				const id = String(this.args[0]).trim();

				if (!SimpleAudio.lists.has(id)) {
					return this.error(`playlist "${id}" does not exist`);
				}

				const list = SimpleAudio.lists.get(id);
				const args = this.args.slice(1);
				let action;
				let fadeOver = 5;
				let fadeTo;
				let loop;
				let mute;
				let shuffle;
				let volume;

				// Process arguments.
				while (args.length > 0) {
					const arg = args.shift();
					let raw;

					switch (arg) {
						case 'load':
						case 'pause':
						case 'play':
						case 'skip':
						case 'stop':
						case 'unload': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = arg;
							break;
						}

						case 'fadein': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = 'fade';
							fadeTo = 1;
							break;
						}

						case 'fadeout': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							action = 'fade';
							fadeTo = 0;
							break;
						}

						case 'fadeto': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							if (args.length === 0) {
								return this.error('fadeto missing required level value');
							}

							action = 'fade';
							raw = args.shift();
							fadeTo = Number.parseFloat(raw);

							if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
								return this.error(`cannot parse fadeto: ${raw}`);
							}

							break;
						}

						case 'fadeoverto': {
							if (action) {
								return this.error(errorOnePlaybackAction(arg, action));
							}

							if (args.length < 2) {
								const errors = [];
								if (args.length < 1) { errors.push('seconds'); }
								if (args.length < 2) { errors.push('level'); }
								return this.error(`fadeoverto missing required ${errors.join(' and ')} value${errors.length > 1 ? 's' : ''}`);
							}

							action = 'fade';
							raw = args.shift();
							fadeOver = Number.parseFloat(raw);

							if (Number.isNaN(fadeOver) || !Number.isFinite(fadeOver)) {
								return this.error(`cannot parse fadeoverto: ${raw}`);
							}

							raw = args.shift();
							fadeTo = Number.parseFloat(raw);

							if (Number.isNaN(fadeTo) || !Number.isFinite(fadeTo)) {
								return this.error(`cannot parse fadeoverto: ${raw}`);
							}

							break;
						}

						case 'volume': {
							if (args.length === 0) {
								return this.error('volume missing required level value');
							}

							raw = args.shift();
							volume = Number.parseFloat(raw);

							if (Number.isNaN(volume) || !Number.isFinite(volume)) {
								return this.error(`cannot parse volume: ${raw}`);
							}

							break;
						}

						case 'mute':
						case 'unmute':
							mute = arg === 'mute';
							break;

						case 'loop':
						case 'unloop':
							loop = arg === 'loop';
							break;

						case 'shuffle':
						case 'unshuffle':
							shuffle = arg === 'shuffle';
							break;

						default:
							return this.error(`unknown action: ${arg}`);
					}
				}

				try {
					if (volume != null) { // lazy equality for null
						list.volume(volume);
					}

					if (mute != null) { // lazy equality for null
						list.mute(mute);
					}

					if (loop != null) { // lazy equality for null
						list.loop(loop);
					}

					if (shuffle != null) { // lazy equality for null
						list.shuffle(shuffle);
					}

					switch (action) {
						case 'fade':
							list.fade(fadeOver, fadeTo);
							break;

						case 'load':
							list.load();
							break;

						case 'pause':
							list.pause();
							break;

						case 'play':
							list.playWhenAllowed();
							break;

						case 'skip':
							list.skip();
							break;

						case 'stop':
							list.stop();
							break;

						case 'unload':
							list.unload();
							break;
					}

					// Custom debug view setup.
					if (Config.debug) {
						this.debugView.modes({ hidden : true });
					}
				}
				catch (ex) {
					return this.error(`error executing action: ${ex.message}`);
				}
			}
		});

		/*
			<<removeaudiogroup group_id>>
		*/
		Macro.add('removeaudiogroup', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no group ID specified');
				}

				const id = String(this.args[0]).trim();

				if (!SimpleAudio.groups.has(id)) {
					return this.error(`group "${id}" does not exist`);
				}

				SimpleAudio.groups.delete(id);

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			<<removeplaylist list_id>>
		*/
		Macro.add('removeplaylist', {
			handler() {
				if (this.args.length === 0) {
					return this.error('no list ID specified');
				}

				const id = String(this.args[0]).trim();

				if (!SimpleAudio.lists.has(id)) {
					return this.error(`playlist "${id}" does not exist`);
				}

				SimpleAudio.lists.delete(id);

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});

		/*
			<<waitforaudio>>
		*/
		Macro.add('waitforaudio', {
			skipArgs : true,

			handler() {
				SimpleAudio.loadWithScreen();
			}
		});
	}
	else {
		// The HTML5 <audio> API is unavailable, so add no-op versions.
		Macro.add([
			'audio',
			'cacheaudio',
			'createaudiogroup',
			'createplaylist',
			'masteraudio',
			'playlist',
			'removeaudiogroup',
			'removeplaylist',
			'waitforaudio'
		], {
			skipArgs : true,

			handler() {
				/* no-op */

				// Custom debug view setup.
				if (Config.debug) {
					this.debugView.modes({ hidden : true });
				}
			}
		});
	}
})();
