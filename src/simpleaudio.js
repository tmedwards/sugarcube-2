/***********************************************************************************************************************

	simpleaudio.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Has, LoadScreen, Story, Util, Visibility, clone */

var SimpleAudio = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	/*
		Events that count as user activation—i.e. "user gestures", "activation behavior".

		NOTE (ca. Dec, 2018): This not an exhaustive list and varies significantly by browser.
		Proposals for a specification/standard are still very much in flux at this point.

		TODO (ca. Dec, 2018): Revisit this topic.

		SEE: (too many to list)
			https://github.com/whatwg/html/issues/3849
			https://github.com/whatwg/html/issues/1903
			https://html.spec.whatwg.org/#activation
			https://docs.google.com/spreadsheets/d/1DGXjhQ6D3yZXIePOMo0dsd2agz0t5W7rYH1NwJ-QGJo/edit#gid=0
	*/
	const _gestureEventNames = Object.freeze(['click', 'contextmenu', 'dblclick', 'keyup', 'mouseup', 'pointerup', 'touchend']);

	// Special group IDs.
	const _specialIds = Object.freeze([':not', ':all', ':looped', ':muted', ':paused', ':playing']);

	// Format specifier regular expression.
	const _formatSpecRe = /^([\w-]+)\s*\|\s*(\S.*)$/; // e.g. 'mp3|https://audiohost.tld/id'

	// ID verification regular expressions.
	const _badIdRe = /[:\s]/;

	// Tracks collection.
	const _tracks = new Map();

	// Groups collection.
	const _groups = new Map();

	// Playlists collection.
	const _lists = new Map();

	// Subscriber collection.
	const _subscribers = new Map();

	// Master playback rate.
	let _masterRate = 1;

	// Master playback volume.
	let _masterVolume = 1;

	// Master mute state.
	let _masterMute = false;

	// Master mute on tab/window visibility state.
	let _masterMuteOnHidden = false;


	/*******************************************************************************************************************
		Feature Detection Functions.
	*******************************************************************************************************************/
	// Return whether the `<HTMLAudioElement>.play()` method returns a `Promise`.
	//
	// NOTE: The initial result is cached for future calls.
	const _playReturnsPromise = (function () {
		// Cache of whether `<HTMLAudioElement>.play()` returns a `Promise`.
		let _hasPromise = null;

		function _playReturnsPromise() {
			if (_hasPromise !== null) {
				return _hasPromise;
			}

			_hasPromise = false;

			if (Has.audio) {
				try {
					const audio = document.createElement('audio');

					// NOTE (ca. Jan 01, 2020): Firefox will still log an "Autoplay is only allowed
					// when […] media is muted." message to the console when attempting the test
					// below, even though the audio has been muted.  Stay classy, Firefox.
					//
					// QUESTION (ca. Jan 01, 2020): Keep this?  It's only here to appease Firefox,
					// but doesn't seem to work as Firefox seems to ignore mute in violation of the
					// `HTMLAudioElement` specification—willfully or simply a bug, I can't say.
					audio.muted = true;

					const value = audio.play();

					// Silence "Uncaught (in promise)" console errors from Blink.
					//
					// NOTE: Swallowing errors is generally bad, but in this case we know there's
					// going to be an error regardless, since there's no source, and we don't actually
					// care about the error, since we just want the return value, so we consign it
					// to the bit bucket.
					//
					// NOTE: We don't ensure that the return value is not `undefined` here because
					// having the attempted call to `<Promise>.catch()` on an `undefined` value throw
					// is acceptable, since it will be caught and `false` eventually returned.
					value.catch(() => { /* no-op */ });

					_hasPromise = value instanceof Promise;
				}
				catch (ex) { /* no-op */ }
			}

			return _hasPromise;
		}

		return _playReturnsPromise;
	})();


	/*******************************************************************************************************************
		AudioTrack Class.
	*******************************************************************************************************************/
	class AudioTrack {
		constructor(obj) {
			// Process the given array of sources or AudioTrack object.
			if (obj instanceof Array) {
				this._create(obj);
			}
			else if (obj instanceof AudioTrack) {
				this._copy(obj);
			}
			else {
				throw new Error('sources parameter must be either an array, of URIs or source objects, or an AudioTrack instance');
			}
		}

		_create(sourceList) {
			const dataUriRe   = /^data:\s*audio\/(?:x-)?([^;,]+)\s*[;,]/i;
			const extRe       = /\.([^./\\]+)$/;
			const formats     = AudioTrack.formats;
			const usedSources = [];
			/*
				HTMLAudioElement: DOM factory method vs. constructor

				Use of the DOM factory method, `document.createElement('audio')`, should be
				preferred over use of the constructor, `new Audio()`.  The reason being that
				objects created by the latter are, erroneously, treated differently, often
				unfavorably, by certain browser engines—e.g. within some versions of the iOS
				browser core.

				Notably, the only difference between the two, per the specification, is that
				objects created via the constructor should have their `preload` property
				automatically set to 'auto'.  Thus, there's no technical reason to prefer
				usage of the constructor, even discounting buggy browser implementations.
			*/
			const audio = document.createElement('audio');

			// Initially set the `preload` attribute to `'none'`.
			audio.preload = 'none';

			// Process the array of sources, adding any valid sources to the `usedSources`
			// array and to the audio element as source elements.
			sourceList.forEach(src => {
				let srcUri = null;

				switch (typeof src) {
				case 'string':
					{
						let match;

						if (src.slice(0, 5) === 'data:') {
							match = dataUriRe.exec(src);

							if (match === null) {
								throw new Error('source data URI missing media type');
							}
						}
						else {
							match = extRe.exec(Util.parseUrl(src).pathname);

							if (match === null) {
								throw new Error('source URL missing file extension');
							}
						}

						if (formats[match[1]]) {
							srcUri = src;
						}
					}
					break;

				case 'object':
					{
						if (src === null) {
							throw new Error('source object cannot be null');
						}
						else if (!src.hasOwnProperty('src')) {
							throw new Error('source object missing required "src" property');
						}
						else if (!src.hasOwnProperty('format')) {
							throw new Error('source object missing required "format" property');
						}

						if (formats[src.format]) {
							srcUri = src.src;
						}
					}
					break;

				default:
					throw new Error(`invalid source value (type: ${typeof src})`);
				}

				if (srcUri !== null) {
					const source = document.createElement('source');
					source.src = srcUri;
					audio.appendChild(source);
					usedSources.push(srcUri);
				}
			});

			if (audio.hasChildNodes()) {
				// Set the `preload` attribute to `'metadata'`, unless preloading has been disabled.
				if (Config.audio.preloadMetadata) {
					audio.preload = 'metadata';
				}
			}

			this._finalize(audio, usedSources, clone(sourceList));
		}

		_copy(obj) {
			this._finalize(
				obj.audio.cloneNode(true), // deep clone of the audio element & its children
				clone(obj.sources),
				clone(obj.originals)
			);
		}

		_finalize(audio, sources, originals) {
			// Set up our own properties.
			Object.defineProperties(this, {
				audio : {
					configurable : true,
					value        : audio
				},

				sources : {
					value : Object.freeze(sources)
				},

				originals : {
					value : Object.freeze(originals)
				},

				_error : {
					writable : true,
					value    : false
				},

				_faderId : {
					writable : true,
					value    : null
				},

				_mute : {
					writable : true,
					value    : false
				},

				_rate : {
					writable : true,
					value    : 1
				},

				_volume : {
					writable : true,
					value    : 1
				}
			});

			// Set up event handlers on the audio and source elements.
			jQuery(this.audio)
				/*
					Upon receiving a `loadstart` event on the audio element, set `_error` to
					`false`.
				*/
				.on('loadstart.AudioTrack', () => this._error = false)
				/*
					Upon receiving an `error` event on the audio element, set `_error` to
					`true`.

					Caveats by browser:
						Edge violates the specification by triggering `error` events from source
						elements on their parent media element, rather than the source element.
						To enable error handling in all browsers, we set the error handler on the
						audio element and have the final source element forward its `error` event.

						IE does not trigger, at least some, `error` events from source elements at
						all, not on the source element or its parent media element.  AFAIK, nothing
						can be done about this lossage.
				*/
				.on('error.AudioTrack', () => this._error = true)
				/*
					Upon receiving an `error` event on the final source element (if any), trigger
					an `error` event on the audio element—that being necessary because the source
					`error` event does not bubble.
				*/
				.find('source:last-of-type')
				.on('error.AudioTrack', () => this._trigger('error'));

			// Subscribe to command messages.
			subscribe(this, mesg => {
				if (!this.audio) {
					unsubscribe(this);
					return;
				}

				switch (mesg) {
				case 'loadwithscreen':
					if (this.hasSource()) {
						const lockId = LoadScreen.lock();
						this
							// NOTE: Do not use an arrow function here.
							.one(
								'canplaythrough.AudioTrack_loadwithscreen error.AudioTrack_loadwithscreen',
								function () {
									jQuery(this).off('.AudioTrack_loadwithscreen');
									LoadScreen.unlock(lockId);
								}
							)
							.load();
					}
					break;
				case 'load':   this.load();               break;
				case 'mute':   this._updateAudioMute();   break;
				case 'rate':   this._updateAudioRate();   break;
				case 'stop':   this.stop();               break;
				case 'volume': this._updateAudioVolume(); break;
				case 'unload': this.unload();             break;
				}
			});

			// Synchronize with the current master audio settings.
			this._updateAudioMute();
			this._updateAudioRate();
			this._updateAudioVolume();
		}

		_trigger(eventName) {
			// Do not use `trigger()` here as we do not want these events to bubble.
			jQuery(this.audio).triggerHandler(eventName);
		}

		_destroy() {
			/*
				Strictly speaking, self-destruction is not necessary as this object will,
				eventually, be garbage collected.  That said, since the audio element contains
				data buffers for the selected audio source, which may be quite large, manually
				purging them as soon as we know that they're no longer needed is not a bad idea.
			*/
			unsubscribe(this);

			if (!this.audio) {
				return;
			}

			jQuery(this.audio).off();
			this.unload();
			this._error = true;

			// Delete the audio element property.
			delete this.audio;
		}

		clone() {
			return new AudioTrack(this);
		}

		load() {
			this.fadeStop();
			this.audio.pause();

			if (!this.audio.hasChildNodes()) {
				if (this.sources.length === 0) {
					return;
				}

				this.sources.forEach(srcUri => {
					const source = document.createElement('source');
					source.src = srcUri;
					this.audio.appendChild(source);
				});
			}

			if (this.audio.preload !== 'auto') {
				this.audio.preload = 'auto';
			}

			if (!this.isLoading()) {
				this.audio.load();
			}
		}

		unload() {
			this.fadeStop();
			this.stop();

			const audio = this.audio;
			audio.preload = 'none';

			// Remove all source elements.
			while (audio.hasChildNodes()) {
				audio.removeChild(audio.firstChild);
			}

			// Force the audio element to drop any existing data buffers.
			audio.load();
		}

		play() {
			if (!this.hasSource()) {
				return Promise.reject(new Error('none of the candidate sources were acceptable'));
			}

			if (this.isUnloaded()) {
				return Promise.reject(new Error('no sources are loaded'));
			}

			if (this.isFailed()) {
				return Promise.reject(new Error('failed to load any of the sources'));
			}

			if (this.audio.preload !== 'auto') {
				this.audio.preload = 'auto';
			}

			const namespace = '.AudioTrack_play';

			return _playReturnsPromise()
				? this.audio.play()
				: new Promise((resolve, reject) => {
					if (this.isPlaying()) {
						resolve();
					}
					else {
						jQuery(this.audio)
							.off(namespace)
							.one(`error${namespace} playing${namespace} timeupdate${namespace}`, ev => {
								jQuery(this).off(namespace);

								if (ev.type === 'error') {
									reject(new Error('unknown audio play error'));
								}
								else {
									resolve();
								}
							});
						this.audio.play();
					}
				});
		}

		playWhenAllowed() {
			this.play().catch(() => {
				const gestures = _gestureEventNames.map(name => `${name}.AudioTrack_playWhenAllowed`).join(' ');
				jQuery(document).one(gestures, () => {
					jQuery(document).off('.AudioTrack_playWhenAllowed');
					this.audio.play();
				});
			});
		}

		pause() {
			this.audio.pause();
		}

		stop() {
			this.audio.pause();
			this.time(0);
			this._trigger(':stopped');
		}

		fade(duration, toVol, fromVol) {
			if (typeof duration !== 'number') {
				throw new TypeError('duration parameter must be a number');
			}
			if (typeof toVol !== 'number') {
				throw new TypeError('toVolume parameter must be a number');
			}
			if (fromVol != null && typeof fromVol !== 'number') { // lazy equality for null
				throw new TypeError('fromVolume parameter must be a number');
			}

			if (!this.hasSource()) {
				return Promise.reject(new Error('none of the candidate sources were acceptable'));
			}

			if (this.isUnloaded()) {
				return Promise.reject(new Error('no sources are loaded'));
			}

			if (this.isFailed()) {
				return Promise.reject(new Error('failed to load any of the sources'));
			}

			this.fadeStop();

			const from = Math.clamp(fromVol == null ? this.volume() : fromVol, 0, 1); // lazy equality for null
			const to   = Math.clamp(toVol, 0, 1);

			if (from === to) {
				return;
			}

			this.volume(from);

			/*
				We listen for the `timeupdate` event here, rather than `playing`, because
				various browsers (notably, mobile browsers) are poor at firing media events
				in a timely fashion, so we use `timeupdate` to ensure that we don't start
				the fade until the track is actually progressing.
			*/
			jQuery(this.audio)
				.off('timeupdate.AudioTrack_fade')
				.one('timeupdate.AudioTrack_fade', () => {
					let min;
					let max;

					// Fade in.
					if (from < to) {
						min = from;
						max = to;
					}
					// Fade out.
					else {
						min = to;
						max = from;
					}

					const time     = Math.max(duration, 1);
					const interval = 25; // in milliseconds
					const delta    = (to - from) / (time / (interval / 1000));

					this._trigger(':fading');
					this._faderId = setInterval(() => {
						if (!this.isPlaying()) {
							/*
								While it may seem like a good idea to also set the track volume
								to the `to` value here, we should not do so.  We cannot know why
								the track is no longer playing, nor if the volume has been modified
								in the interim, so doing so now may clobber an end-user set volume.
							*/
							this.fadeStop();
							return;
						}

						this.volume(Math.clamp(this.volume() + delta, min, max));

						if (Config.audio.pauseOnFadeToZero && this.volume() === 0) {
							this.pause();
						}

						if (this.volume() === to) {
							this.fadeStop();
							this._trigger(':faded');
						}
					}, interval);
				});

			return this.play();
		}

		fadeIn(duration, fromVol) {
			return this.fade(duration, 1, fromVol);
		}

		fadeOut(duration, fromVol) {
			return this.fade(duration, 0, fromVol);
		}

		fadeStop() {
			if (this._faderId !== null) {
				clearInterval(this._faderId);
				this._faderId = null;
			}
		}

		loop(loop) {
			if (loop == null) { // lazy equality for null
				return this.audio.loop;
			}

			this.audio.loop = !!loop;

			return this;
		}

		mute(mute) {
			if (mute == null) { // lazy equality for null
				return this._mute;
			}

			this._mute = !!mute;
			this._updateAudioMute();

			return this;
		}
		_updateAudioMute() {
			this.audio.muted = this._mute || _masterMute;
		}

		rate(rate) {
			if (rate == null) { // lazy equality for null
				return this._rate;
			}

			if (typeof rate !== 'number') {
				throw new TypeError('rate parameter must be a number');
			}

			/*
				Clamp the playback rate to sane values—some browsers also do this to varying degrees.

				NOTE (ca. Aug 2016): The specification allows negative values for reverse playback,
				however, most browsers either completely ignore negative values or clamp them to
				some positive value.  In some (notably, IE & Edge), setting a negative playback
				rate breaks the associated controls, if displayed.
			*/
			/*
			this._rate = rate < 0
				? Math.clamp(rate, -0.2, -5) // clamp to 5× slower & faster, backward
				: Math.clamp(rate, 0.2, 5);  // clamp to 5× slower & faster, forward
			*/
			this._rate = Math.clamp(rate, 0.2, 5); // clamp to 5× slower & faster
			this._updateAudioRate();

			return this;
		}
		_updateAudioRate() {
			/*
			const rate = this._rate * _masterRate;
			this.audio.playbackRate = rate < 0
				? Math.clamp(rate, -0.2, -5) // clamp to 5× slower & faster, backward
				: Math.clamp(rate, 0.2, 5);  // clamp to 5× slower & faster, forward
			*/
			this.audio.playbackRate = Math.clamp(this._rate * _masterRate, 0.2, 5); // clamp to 5× slower & faster
		}

		time(time) {
			if (time == null) { // lazy equality for null
				return this.audio.currentTime;
			}

			if (typeof time !== 'number') {
				throw new TypeError('time parameter must be a number');
			}

			/*
				NOTE (historic): If we try to modify the audio clip's `.currentTime` property
				before its metadata has been loaded, it will throw an `InvalidStateError`
				(since it doesn't know its duration, allowing `.currentTime` to be set would
				be undefined behavior), so in case an exception is thrown we provide a fallback
				using the `loadedmetadata` event.

				NOTE (ca. 2016): This workaround should no longer be necessary in most browsers.
				That said, it will still be required for some time to service legacy browsers.

				NOTE (ca. Dec 09, 2018): Firefox will still log an `InvalidStateError` to the
				console when attempting to modify the clip's `.currentTime` property before its
				metadata has been loaded, even though it handles the situation properly—by waiting
				for the metadata, as all browsers do now.  To prevent this spurious logging, we
				must now manually check for the existence of the metadata and always failover to
				an event regardless of if the browser needs it or not—because I don't want to
				introduce a browser check here.  Stay classy, Firefox.
			*/
			if (this.hasMetadata()) {
				this.audio.currentTime = time;
			}
			else {
				jQuery(this.audio)
					.off('loadedmetadata.AudioTrack_time')
					.one('loadedmetadata.AudioTrack_time', () => this.audio.currentTime = time);
			}

			return this;
		}

		volume(volume) {
			if (volume == null) { // lazy equality for null
				return this._volume;
			}

			if (typeof volume !== 'number') {
				throw new TypeError('volume parameter must be a number');
			}

			this._volume = Math.clamp(volume, 0, 1); // clamp to 0 (silent) & 1 (full loudness)
			this._updateAudioVolume();

			return this;
		}
		_updateAudioVolume() {
			this.audio.volume = Math.clamp(this._volume * _masterVolume, 0, 1);
		}

		duration() {
			// NOTE: May return a double (normally), Infinity (for streams), or NaN (without metadata).
			return this.audio.duration;
		}

		remaining() {
			// NOTE: May return a double (normally), Infinity (for streams), or NaN (without metadata).
			return this.audio.duration - this.audio.currentTime;
		}

		isFailed() {
			return this._error;
		}

		isLoading() {
			return this.audio.networkState === HTMLMediaElement.NETWORK_LOADING;
		}

		isUnloaded() {
			return !this.audio.hasChildNodes();
		}

		isUnavailable() {
			return !this.hasSource() || this.isUnloaded() || this.isFailed();
		}

		isPlaying() {
			// NOTE: The `this.hasSomeData()` check is probably no longer necessary.
			return !this.audio.paused && this.hasSomeData();
		}

		isPaused() {
			/*
				If the selected audio resource is a stream, `currentTime` may return a non-zero
				value even at the earliest available position within the stream as the browser
				may have dropped the earliest chunks of buffered data or the stream may have a
				timeline which does not start at zero.

				In an attempt to guard against these possiblities, as best as we can, we test
				`duration` against `Infinity` first, which should yield true for actual streams.
			*/
			return this.audio.paused
				&& (this.audio.duration === Infinity || this.audio.currentTime > 0)
				&& !this.audio.ended;
		}

		isStopped() {
			return this.audio.paused && this.audio.currentTime === 0;
		}

		isEnded() {
			return this.audio.ended;
		}

		isFading() {
			return this._faderId !== null;
		}

		isSeeking() {
			return this.audio.seeking;
		}

		hasSource() {
			return this.sources.length > 0;
		}

		hasNoData() {
			return this.audio.readyState === HTMLMediaElement.HAVE_NOTHING;
		}

		hasMetadata() {
			return this.audio.readyState >= HTMLMediaElement.HAVE_METADATA;
		}

		hasSomeData() {
			return this.audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
		}

		hasData() {
			return this.audio.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA;
		}

		on(...args) {
			jQuery.fn.on.apply(jQuery(this.audio), args);
			return this;
		}

		one(...args) {
			jQuery.fn.one.apply(jQuery(this.audio), args);
			return this;
		}

		off(...args) {
			jQuery.fn.off.apply(jQuery(this.audio), args);
			return this;
		}
	}

	// Attach the static data members.
	Object.defineProperties(AudioTrack, {
		/*
			Cache of supported (common) audio formats.

			NOTE: Caveats by browser/engine:
				Opera ≤12 (Presto) will return a false-negative if the codecs value is quoted
				with single quotes, requiring the use of either double quotes or no quotes.

				Some versions of Blink-based browsers (e.g. Chrome, Opera ≥15) will return a
				false-negative for WAVE audio if the preferred MIME-type of 'audio/wave' is
				specified, requiring the addition of 'audio/wav' for them.
		*/
		formats : {
			value : (() => {
				const audio = document.createElement('audio');
				const types = new Map();

				function canPlay(mimeType) {
					if (!types.has(mimeType)) {
						// Some early implementations return 'no' instead of the empty string.
						types.set(mimeType, audio.canPlayType(mimeType).replace(/^no$/i, '') !== '');
					}

					return types.get(mimeType);
				}

				return Object.assign(Object.create(null), {
					// AAC — MPEG-2 AAC audio; specific profiles vary, but commonly "AAC-LC".
					aac : canPlay('audio/aac'),

					// CAF — Codecs vary.
					caf : canPlay('audio/x-caf') || canPlay('audio/caf'),

					// FLAC.
					flac : canPlay('audio/x-flac') || canPlay('audio/flac'),

					// MP3 — MPEG-1/-2 Layer-III audio.
					mp3  : canPlay('audio/mpeg; codecs="mp3"') || canPlay('audio/mpeg') || canPlay('audio/mp3') || canPlay('audio/mpa'),
					mpeg : canPlay('audio/mpeg'),

					// MP4 — Codecs vary, but commonly "mp4a.40.2" (a.k.a. "AAC-LC").
					m4a : canPlay('audio/x-m4a') || canPlay('audio/m4a') || canPlay('audio/aac'),
					mp4 : canPlay('audio/x-mp4') || canPlay('audio/mp4') || canPlay('audio/aac'),

					// OGG — Codecs vary, but commonly "vorbis" and, more recently, "opus".
					ogg : canPlay('audio/ogg'),
					oga : canPlay('audio/ogg'),

					// OPUS — Opus audio in an Ogg container.
					opus : canPlay('audio/ogg; codecs="opus"') || canPlay('audio/opus'),

					// WAVE — Codecs vary, but commonly "1" (1 is the FourCC for PCM/LPCM).
					wav  : canPlay('audio/wave; codecs="1"') || canPlay('audio/wav; codecs="1"') || canPlay('audio/wave') || canPlay('audio/wav'),
					wave : canPlay('audio/wave; codecs="1"') || canPlay('audio/wav; codecs="1"') || canPlay('audio/wave') || canPlay('audio/wav'),

					// WEBM — Codecs vary, but commonly "vorbis" and, more recently, "opus".
					weba : canPlay('audio/webm'),
					webm : canPlay('audio/webm')
				});
			})()
		}
	});


	/*******************************************************************************************************************
		AudioList Class.
	*******************************************************************************************************************/
	class AudioList {
		constructor(obj) {
			// Process the given array of track objects or AudioList object.
			if (obj instanceof Array) {
				this._create(obj);
			}
			else if (obj instanceof AudioList) {
				this._copy(obj);
				// this._create(obj.tracks);
			}
			else {
				throw new Error('tracks parameter must be either an array, of track objects, or an AudioTrack instance');
			}
		}

		_create(trackList) {
			// Map the array of tracks to playlist track objects.
			this._finalize(trackList.map(trackObj => {
				if (typeof trackObj !== 'object') { // lazy equality for null
					throw new Error('tracks parameter array members must be objects');
				}

				let own;
				let rate;
				let track;
				let volume;

				if (trackObj instanceof AudioTrack) {
					own    = true;
					rate   = trackObj.rate();
					track  = trackObj.clone();
					volume = trackObj.volume();
				}
				else {
					if (!trackObj.hasOwnProperty('track')) {
						throw new Error('track object missing required "track" property');
					}
					else if (!(trackObj.track instanceof AudioTrack)) {
						throw new Error('track object\'s "track" property must be an AudioTrack object');
					}
					// else if (!trackObj.hasOwnProperty('volume')) {
					// 	throw new Error('track object missing required "volume" property');
					// }

					own    = trackObj.hasOwnProperty('own') && trackObj.own;
					rate   = trackObj.hasOwnProperty('rate') ? trackObj.rate : trackObj.track.rate();
					track  = trackObj.track;
					volume = trackObj.hasOwnProperty('volume') ? trackObj.volume : trackObj.track.volume();
				}

				track.stop();
				track.loop(false);
				track.mute(false);
				track.rate(rate);
				track.volume(volume);
				track.on('ended.AudioList', () => this._onEnd());

				return { own, track, volume, rate };
			}));
		}

		_copy(obj) {
			this._finalize(clone(obj.tracks));
		}

		_finalize(tracks) {
			// Set up our own properties.
			Object.defineProperties(this, {
				tracks : {
					configurable : true,
					value        : Object.freeze(tracks)
				},

				queue : {
					configurable : true,
					value        : []
				},

				current : {
					writable : true,
					value    : null
				},

				_rate : {
					writable : true,
					value    : 1
				},

				_volume : {
					writable : true,
					value    : 1
				},

				_mute : {
					writable : true,
					value    : false
				},

				_loop : {
					writable : true,
					value    : false
				},

				_shuffle : {
					writable : true,
					value    : false
				}
			});
		}

		_destroy() {
			/*
				Strictly speaking, self-destruction is not necessary as this object will,
				eventually, be garbage collected.
			*/
			// Stop playback.
			this.stop();

			// Destroy all owned tracks.
			this.tracks
				.filter(trackObj => trackObj.own)
				.forEach(trackObj => trackObj.track._destroy());

			// Delete the reference-type properties.
			delete this.tracks;
			delete this.queue;
		}

		load() {
			this.tracks.forEach(trackObj => trackObj.track.load());
		}

		unload() {
			this.stop();
			this.tracks.forEach(trackObj => trackObj.track.unload());
		}

		play() {
			if (this.current === null || this.current.track.isUnavailable() || this.current.track.isEnded()) {
				if (this.queue.length === 0) {
					this._fillQueue();
				}

				if (!this._next()) {
					return Promise.reject(new Error('no tracks were available'));
				}
			}

			return this.current.track.play();
		}

		playWhenAllowed() {
			this.play().catch(() => {
				const gestures = _gestureEventNames.map(name => `${name}.AudioList_playWhenAllowed`).join(' ');
				jQuery(document).one(gestures, () => {
					jQuery(document).off('.AudioList_playWhenAllowed');
					this.play();
				});
			});
		}

		pause() {
			if (this.current !== null) {
				this.current.track.pause();
			}
		}

		stop() {
			if (this.current !== null) {
				this.current.track.stop();
				this.current = null;
			}

			this._drainQueue();
		}

		skip() {
			if (this._next()) {
				this.current.track.play();
			}
			else if (this._loop) {
				this.play();
			}
		}

		fade(duration, toVol, fromVol) {
			if (typeof duration !== 'number') {
				throw new TypeError('duration parameter must be a number');
			}
			if (typeof toVol !== 'number') {
				throw new TypeError('toVolume parameter must be a number');
			}
			if (fromVol != null && typeof fromVol !== 'number') { // lazy equality for null
				throw new TypeError('fromVolume parameter must be a number');
			}

			if (this.queue.length === 0) {
				this._fillQueue();
			}

			if (this.current === null || this.current.track.isUnavailable() || this.current.track.isEnded()) {
				if (!this._next()) {
					return;
				}
			}

			const adjToVol = Math.clamp(toVol, 0, 1) * this.current.volume;
			let adjFromVol;

			if (fromVol != null) { // lazy equality for null
				adjFromVol = Math.clamp(fromVol, 0, 1) * this.current.volume;
			}

			this._volume = toVol; // NOTE: Kludgey, but necessary.

			return this.current.track.fade(duration, adjToVol, adjFromVol);
		}

		fadeIn(duration, fromVol) {
			return this.fade(duration, 1, fromVol);
		}

		fadeOut(duration, fromVol) {
			return this.fade(duration, 0, fromVol);
		}

		fadeStop() {
			if (this.current !== null) {
				this.current.track.fadeStop();
			}
		}

		loop(loop) {
			if (loop == null) { // lazy equality for null
				return this._loop;
			}

			this._loop = !!loop;

			return this;
		}

		mute(mute) {
			if (mute == null) { // lazy equality for null
				return this._mute;
			}

			this._mute = !!mute;

			if (this.current !== null) {
				this.current.track.mute(this._mute);
			}

			return this;
		}

		rate(rate) {
			if (rate == null) { // lazy equality for null
				return this._rate;
			}

			if (typeof rate !== 'number') {
				throw new TypeError('rate parameter must be a number');
			}

			this._rate = Math.clamp(rate, 0.2, 5); // clamp to 5× slower & faster

			if (this.current !== null) {
				this.current.track.rate(this._rate * this.current.rate);
			}

			return this;
		}

		shuffle(shuffle) {
			if (shuffle == null) { // lazy equality for null
				return this._shuffle;
			}

			this._shuffle = !!shuffle;

			if (this.queue.length > 0) {
				this._fillQueue();

				// Try not to immediately replay the last track when not shuffling.
				if (!this._shuffle && this.current !== null && this.queue.length > 1) {
					const firstIdx = this.queue.findIndex(trackObj => trackObj === this.current);

					if (firstIdx !== -1) {
						this.queue.push(...this.queue.splice(0, firstIdx + 1));
					}
				}
			}

			return this;
		}

		volume(volume) {
			if (volume == null) { // lazy equality for null
				return this._volume;
			}

			if (typeof volume !== 'number') {
				throw new TypeError('volume parameter must be a number');
			}

			this._volume = Math.clamp(volume, 0, 1); // clamp to 0 (silent) & 1 (full loudness)

			if (this.current !== null) {
				this.current.track.volume(this._volume * this.current.volume);
			}

			return this;
		}

		duration() {
			if (arguments.length > 0) {
				throw new Error('duration takes no parameters');
			}

			// NOTE: May return a double (normally), Infinity (for streams), or NaN (without metadata).
			return this.tracks
				.map(trackObj => trackObj.track.duration())
				.reduce((prev, cur) => prev + cur, 0);
		}

		remaining() {
			if (arguments.length > 0) {
				throw new Error('remaining takes no parameters');
			}

			// NOTE: May return a double (normally), Infinity (for streams), or NaN (without metadata).
			let remainingTime = this.queue
				.map(trackObj => trackObj.track.duration())
				.reduce((prev, cur) => prev + cur, 0);

			if (this.current !== null) {
				remainingTime += this.current.track.remaining();
			}

			return remainingTime;
		}

		time() {
			if (arguments.length > 0) {
				throw new Error('time takes no parameters');
			}

			return this.duration() - this.remaining();
		}

		isPlaying() {
			return this.current !== null && this.current.track.isPlaying();
		}

		isPaused() {
			return this.current === null || this.current.track.isPaused();
		}

		isStopped() {
			return this.queue.length === 0 && this.current === null;
		}

		isEnded() {
			return this.queue.length === 0 && (this.current === null || this.current.track.isEnded());
		}

		isFading() {
			return this.current !== null && this.current.track.isFading();
		}

		_next() {
			if (this.current !== null) {
				this.current.track.stop();
				this.current = null;
			}

			let nextTrack;

			while ((nextTrack = this.queue.shift())) {
				if (!nextTrack.track.isUnavailable()) {
					this.current = nextTrack;
					break;
				}
			}

			if (this.current === null) {
				return false;
			}

			this.current.track.mute(this._mute);
			this.current.track.rate(this._rate * this.current.rate);
			this.current.track.volume(this._volume * this.current.volume);

			// Attempt to protect against the `loop` state being reenabled
			// outside of the playlist.  Mostly for unowned tracks.
			//
			// TODO: Should we reapply the `ended` event handler too?
			this.current.track.loop(false);

			return true;
		}

		_onEnd() {
			if (this.queue.length === 0) {
				if (!this._loop) {
					return;
				}

				this._fillQueue();
			}

			if (!this._next()) {
				return;
			}

			this.current.track.play();
		}

		_drainQueue() {
			this.queue.splice(0);
		}

		_fillQueue() {
			this._drainQueue();
			this.queue.push(...this.tracks.filter(trackObj => !trackObj.track.isUnavailable()));

			if (this.queue.length === 0) {
				return;
			}

			if (this._shuffle) {
				this.queue.shuffle();

				// Try not to immediately replay the last track when shuffling.
				if (this.queue.length > 1 && this.queue[0] === this.current) {
					this.queue.push(this.queue.shift());
				}
			}
		}
	}


	/*******************************************************************************************************************
		AudioRunner Class.
	*******************************************************************************************************************/
	class AudioRunner {
		constructor(list) {
			if (!(list instanceof Set || list instanceof AudioRunner)) {
				throw new TypeError('list parameter must be a Set or a AudioRunner instance');
			}

			// Set up our own properties.
			Object.defineProperties(this, {
				trackIds : {
					value : new Set(list instanceof AudioRunner ? list.trackIds : list)
				}
			});
		}

		load() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.load);
		}

		unload() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.unload);
		}

		play() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.play);
		}

		playWhenAllowed() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.playWhenAllowed);
		}

		pause() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.pause);
		}

		stop() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.stop);
		}

		fade(duration, toVol, fromVol) {
			if (duration == null || toVol == null) { // lazy equality for null
				throw new Error('fade requires parameters');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.fade, duration, toVol, fromVol);
		}

		fadeIn(duration, fromVol) {
			if (duration == null) { // lazy equality for null
				throw new Error('fadeIn requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.fadeIn, duration, fromVol);
		}

		fadeOut(duration, fromVol) {
			if (duration == null) { // lazy equality for null
				throw new Error('fadeOut requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.fadeOut, duration, fromVol);
		}

		fadeStop() {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.fadeStop);
		}

		loop(loop) {
			if (loop == null) { // lazy equality for null
				throw new Error('loop requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.loop, loop);
			return this;
		}

		mute(mute) {
			if (mute == null) { // lazy equality for null
				throw new Error('mute requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.mute, mute);
			return this;
		}

		rate(rate) {
			if (rate == null) { // lazy equality for null
				throw new Error('rate requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.rate, rate);
			return this;
		}

		time(time) {
			if (time == null) { // lazy equality for null
				throw new Error('time requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.time, time);
			return this;
		}

		volume(volume) {
			if (volume == null) { // lazy equality for null
				throw new Error('volume requires a parameter');
			}

			AudioRunner._run(this.trackIds, AudioTrack.prototype.volume, volume);
			return this;
		}

		on(...args) {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.on, ...args);
			return this;
		}

		one(...args) {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.one, ...args);
			return this;
		}

		off(...args) {
			AudioRunner._run(this.trackIds, AudioTrack.prototype.off, ...args);
			return this;
		}

		static _run(ids, fn, ...args) {
			ids.forEach(id => {
				const track = _tracks.get(id);

				if (track) {
					fn.apply(track, args);
				}
			});
		}
	}


	/*******************************************************************************************************************
		Track Functions.
	*******************************************************************************************************************/
	/*
		SimpleAudio.tracks.add(trackId, sources…);

		E.g.
			SimpleAudio.tracks.add(
				'over_the_top',
				'https://audiohost.tld/id/over_the_top.mp3',
				'https://audiohost.tld/id/over_the_top.ogg'
			);
	*/
	function trackAdd(/* trackId , sources… */) {
		if (arguments.length < 2) {
			const errors = [];
			if (arguments.length < 1) { errors.push('track ID'); }
			if (arguments.length < 2) { errors.push('sources'); }
			throw new Error(`no ${errors.join(' or ')} specified`);
		}

		const id   = String(arguments[0]).trim();
		const what = `track ID "${id}"`;

		if (_badIdRe.test(id)) {
			throw new Error(`invalid ${what}: track IDs must not contain colons or whitespace`);
		}

		const sources = Array.isArray(arguments[1])
			? Array.from(arguments[1])
			: Array.from(arguments).slice(1);
		let track;

		try {
			track = _newTrack(sources);
		}
		catch (ex) {
			throw new Error(`${what}: error during track initialization: ${ex.message}`);
		}

		// If in Test Mode and no supported sources were specified, throw an error.
		if (Config.debug && !track.hasSource()) {
			throw new Error(`${what}: no supported audio sources found`);
		}

		// If a track by the given ID already exists, destroy it.
		if (_tracks.has(id)) {
			_tracks.get(id)._destroy();
		}

		// Add the track to the cache.
		_tracks.set(id, track);
	}

	function trackDelete(id) {
		if (_tracks.has(id)) {
			_tracks.get(id)._destroy();
		}

		// TODO: Should this also remove references to the track from groups and playlists?

		return _tracks.delete(id);
	}

	function trackClear() {
		_tracks.forEach(track => track._destroy());
		_tracks.clear();
	}

	function trackHas(id) {
		return _tracks.has(id);
	}

	function trackGet(id) {
		return _tracks.get(id) || null;
	}


	/*******************************************************************************************************************
		Group Functions.
	*******************************************************************************************************************/
	/*
		SimpleAudio.groups.add(groupId, trackIds…);

		E.g.
			SimpleAudio.groups.add(':ui', 'beep', 'boop', 'boing');
	*/
	function groupAdd(/* groupId , trackIds… */) {
		if (arguments.length < 2) {
			const errors = [];
			if (arguments.length < 1) { errors.push('group ID'); }
			if (arguments.length < 2) { errors.push('track IDs'); }
			throw new Error(`no ${errors.join(' or ')} specified`);
		}

		const id   = String(arguments[0]).trim();
		const what = `group ID "${id}"`;

		if (id[0] !== ':' || _badIdRe.test(id.slice(1))) {
			throw new Error(`invalid ${what}: group IDs must start with a colon and must not contain colons or whitespace`);
		}

		if (_specialIds.includes(id)) {
			throw new Error(`cannot clobber special ${what}`);
		}

		const trackIds = Array.isArray(arguments[1])
			? Array.from(arguments[1])
			: Array.from(arguments).slice(1);
		let group;

		try {
			group = new Set(trackIds.map(trackId => {
				if (!_tracks.has(trackId)) {
					throw new Error(`track "${trackId}" does not exist`);
				}

				return trackId;
			}));
		}
		catch (ex) {
			throw new Error(`${what}: error during group initialization: ${ex.message}`);
		}

		// Add the group to the cache.
		_groups.set(id, Object.freeze(Array.from(group)));
	}

	function groupDelete(id) {
		return _groups.delete(id);
	}

	function groupClear() {
		_groups.clear();
	}

	function groupHas(id) {
		return _groups.has(id);
	}

	function groupGet(id) {
		return _groups.get(id) || null;
	}


	/*******************************************************************************************************************
		Playlist Functions.
	*******************************************************************************************************************/
	/*
		SimpleAudio.lists.add(listId, sources…);
			Where `sources` may be either a track ID or descriptor (object).
			Track descriptors are either { id, [own], [rate], [volume] } or { sources, [rate], [volume] }.

		NOTE: Rate properties are currently unsupported due to poor browser support.

		E.g.
			SimpleAudio.lists.add(
				'bgm',
				'over_the_top',
				{
					id     : 'heavens_a_lie',
					volume : 0.5,
					own    : true
				},
				{
					sources : [
						'https://audiohost.tld/id/swamped.mp3',
						'https://audiohost.tld/id/swamped.ogg'
					],
					volume  : 0.75
				}
			);
	*/
	function listAdd(/* listId , sources… */) {
		if (arguments.length < 2) {
			const errors = [];
			if (arguments.length < 1) { errors.push('list ID'); }
			if (arguments.length < 2) { errors.push('track IDs'); }
			throw new Error(`no ${errors.join(' or ')} specified`);
		}

		const id   = String(arguments[0]).trim();
		const what = `list ID "${id}"`;

		if (_badIdRe.test(id)) {
			return this.error(`invalid ${what}: list IDs must not contain colons or whitespace`);
		}

		const descriptors = Array.isArray(arguments[1])
			? Array.from(arguments[1])
			: Array.from(arguments).slice(1);
		let list;

		try {
			list = new AudioList(descriptors.map(desc => {
				if (desc === null) {
					throw new Error('track descriptor must be a string or object (type: null)');
				}

				switch (typeof desc) {
				case 'string':
					// Simply a track ID, so convert it into an object.
					desc = { id : desc }; // eslint-disable-line no-param-reassign
					break;

				case 'object':
					if (!desc.hasOwnProperty('id') && !desc.hasOwnProperty('sources')) {
						throw new Error('track descriptor must contain one of either an "id" or a "sources" property');
					}
					else if (desc.hasOwnProperty('id') && desc.hasOwnProperty('sources')) {
						throw new Error('track descriptor must contain either an "id" or a "sources" property, not both');
					}
					break;

				default:
					throw new Error(`track descriptor must be a string or object (type: ${typeof desc})`);
				}

				let own;
				// let rate;
				let track;
				let volume;

				if (desc.hasOwnProperty('id')) {
					if (typeof desc.id !== 'string') {
						throw new Error('"id" property must be a string');
					}
					if (!_tracks.has(desc.id)) {
						throw new Error(`track "${desc.id}" does not exist`);
					}

					track = _tracks.get(desc.id);
				}
				else if (desc.hasOwnProperty('sources')) {
					if (!Array.isArray(desc.sources) || desc.sources.length === 0) {
						throw new Error('"sources" property must be a non-empty array');
					}
					if (desc.hasOwnProperty('own')) {
						throw new Error('"own" property is not allowed with the "sources" property');
					}

					try {
						track = _newTrack(desc.sources);
						own = true;
					}
					catch (ex) {
						throw new Error(`error during track initialization: ${ex.message}`);
					}

					// If in Test Mode and no supported sources were specified, return an error.
					if (Config.debug && !track.hasSource()) {
						throw new Error('no supported audio sources found');
					}
				}

				if (desc.hasOwnProperty('own')) {
					if (typeof desc.own !== 'boolean') {
						throw new Error('"own" property must be a boolean');
					}

					own = desc.own;

					if (own) {
						track = track.clone();
					}
				}

				// if (desc.hasOwnProperty('rate')) {
				// 	if (
				// 		   typeof desc.rate !== 'number'
				// 		|| Number.isNaN(desc.rate)
				// 		|| !Number.isFinite(desc.rate)
				// 	) {
				// 		throw new Error('"rate" property must be a finite number');
				// 	}
				//
				// 	rate = desc.rate;
				// }

				if (desc.hasOwnProperty('volume')) {
					if (
						   typeof desc.volume !== 'number'
						|| Number.isNaN(desc.volume)
						|| !Number.isFinite(desc.volume)
						|| desc.volume < 0
					) {
						throw new Error('"volume" property must be a non-negative finite number');
					}

					volume = desc.volume;
				}

				return {
					own    : own != null ? own : false, // lazy equality for null,
					// rate   : rate != null ? rate : track.rate(), // lazy equality for null,
					track,
					volume : volume != null ? volume : track.volume() // lazy equality for null
				};
			}));
		}
		catch (ex) {
			throw new Error(`${what}: error during playlist initialization: ${ex.message}`);
		}

		// If a playlist by the given ID already exists, destroy it.
		if (_lists.has(id)) {
			_lists.get(id)._destroy();
		}

		// Add the playlist to the cache.
		_lists.set(id, list);
	}

	function listDelete(id) {
		if (_lists.has(id)) {
			_lists.get(id)._destroy();
		}

		return _lists.delete(id);
	}

	function listClear() {
		_lists.forEach(list => list._destroy());
		_lists.clear();
	}

	function listHas(id) {
		return _lists.has(id);
	}

	function listGet(id) {
		return _lists.get(id) || null;
	}


	/*******************************************************************************************************************
		Runner Functions.
	*******************************************************************************************************************/
	const _runnerParseSelector = (() => {
		const notWsRe = /\S/g;
		const parenRe = /[()]/g;

		function processNegation(str, startPos) {
			let match;

			notWsRe.lastIndex = startPos;
			match = notWsRe.exec(str);

			if (match === null || match[0] !== '(') {
				throw new Error('invalid ":not()" syntax: missing parentheticals');
			}

			parenRe.lastIndex = notWsRe.lastIndex;
			const start  = notWsRe.lastIndex;
			const result = { str : '', nextMatch : -1 };
			let depth = 1;

			while ((match = parenRe.exec(str)) !== null) {
				if (match[0] === '(') {
					++depth;
				}
				else {
					--depth;
				}

				if (depth < 1) {
					result.nextMatch = parenRe.lastIndex;
					result.str = str.slice(start, result.nextMatch - 1);
					break;
				}
			}

			return result;
		}

		function parseSelector(idArg) {
			const ids  = [];
			const idRe = /:?[^\s:()]+/g;
			let match;

			while ((match = idRe.exec(idArg)) !== null) {
				const id = match[0];

				// Group negation.
				if (id === ':not') {
					if (ids.length === 0) {
						throw new Error('invalid negation: no group ID preceded ":not()"');
					}

					const parent = ids[ids.length - 1];

					if (parent.id[0] !== ':') {
						throw new Error(`invalid negation of track "${parent.id}": only groups may be negated with ":not()"`);
					}

					const negation = processNegation(idArg, idRe.lastIndex);

					if (negation.nextMatch === -1) {
						throw new Error('unknown error parsing ":not()"');
					}

					idRe.lastIndex = negation.nextMatch;
					parent.not = parseSelector(negation.str);
				}

				// Group or track ID.
				else {
					ids.push({ id });
				}
			}

			return ids;
		}

		return parseSelector;
	})();

	/*
		SimpleAudio.select(selector).…;

		E.g.
			SimpleAudio.select(':ui').…
			SimpleAudio.select(':ui:not(boop)').…
			SimpleAudio.select('boop beep').…
			SimpleAudio.select(':ui :sfx').…
			SimpleAudio.select(':ui:not(boop) :sfx overthetop').…
	*/
	function runnerGet(/* selector */) {
		if (arguments.length === 0) {
			throw new Error('no track selector specified');
		}

		const selector = String(arguments[0]).trim();
		const trackIds = new Set();

		try {
			const allIds = Array.from(_tracks.keys());

			function renderIds(idObj) {
				const id = idObj.id;
				let ids;

				switch (id) {
				case ':all':     ids = allIds; break;
				case ':looped':  ids = allIds.filter(id => _tracks.get(id).loop()); break;
				case ':muted':   ids = allIds.filter(id => _tracks.get(id).mute()); break;
				case ':paused':  ids = allIds.filter(id => _tracks.get(id).isPaused()); break;
				case ':playing': ids = allIds.filter(id => _tracks.get(id).isPlaying()); break;
				default:         ids = id[0] === ':' ? _groups.get(id) : [id]; break;
				}

				if (idObj.hasOwnProperty('not')) {
					const negated = idObj.not.map(idObj => renderIds(idObj)).flat(Infinity);
					ids = ids.filter(id => !negated.includes(id));
				}

				return ids;
			}

			_runnerParseSelector(selector).forEach(idObj => renderIds(idObj).forEach(id => {
				if (!_tracks.has(id)) {
					throw new Error(`track "${id}" does not exist`);
				}

				trackIds.add(id);
			}));
		}
		catch (ex) {
			throw new Error(`error during runner initialization: ${ex.message}`);
		}

		return new AudioRunner(trackIds);
	}


	/*******************************************************************************************************************
		Master Audio Functions.
	*******************************************************************************************************************/
	function masterLoad() {
		publish('load');
	}

	function masterLoadWithScreen() {
		publish('loadwithscreen');
	}

	function masterMute(mute) {
		if (mute == null) { // lazy equality for null
			return _masterMute;
		}

		_masterMute = !!mute;
		publish('mute', _masterMute);
	}

	function masterMuteOnHidden(mute) {
		// NOTE: Some older browsers—notably: IE 9—do not support the Page Visibility API.
		if (!Visibility.isEnabled()) {
			return false;
		}

		if (mute == null) { // lazy equality for null
			return _masterMuteOnHidden;
		}

		_masterMuteOnHidden = !!mute;

		const namespace = '.SimpleAudio_masterMuteOnHidden';

		if (_masterMuteOnHidden) {
			const visibilityChange = `${Visibility.changeEvent}${namespace}`;
			jQuery(document)
				.off(namespace)
				.on(visibilityChange, () => masterMute(Visibility.isHidden()));

			// Only change the mute state initially if hidden.
			if (Visibility.isHidden()) {
				masterMute(true);
			}
		}
		else {
			jQuery(document).off(namespace);
		}
	}

	function masterRate(rate) {
		if (rate == null) { // lazy equality for null
			return _masterRate;
		}

		if (typeof rate !== 'number' || Number.isNaN(rate) || !Number.isFinite(rate)) {
			throw new Error('rate must be a finite number');
		}

		_masterRate = Math.clamp(rate, 0.2, 5); // clamp to 5× slower & faster
		publish('rate', _masterRate);
	}

	function masterStop() {
		publish('stop');
	}

	function masterUnload() {
		publish('unload');
	}

	function masterVolume(volume) {
		if (volume == null) { // lazy equality for null
			return _masterVolume;
		}

		if (typeof volume !== 'number' || Number.isNaN(volume) || !Number.isFinite(volume)) {
			throw new Error('volume must be a finite number');
		}

		_masterVolume = Math.clamp(volume, 0, 1); // clamp to 0 (silent) & 1 (full loudness)
		publish('volume', _masterVolume);
	}


	/*******************************************************************************************************************
		Subscription Functions.
	*******************************************************************************************************************/
	function subscribe(id, callback) {
		if (typeof callback !== 'function') {
			throw new Error('callback parameter must be a function');
		}

		_subscribers.set(id, callback);
	}

	function unsubscribe(id) {
		_subscribers.delete(id);
	}

	function publish(mesg, data) {
		_subscribers.forEach(fn => fn(mesg, data));
	}


	/*******************************************************************************************************************
		Utility Functions.
	*******************************************************************************************************************/
	function _newTrack(sources) {
		return new AudioTrack(sources.map(source => {
			// Handle audio passages.
			if (source.slice(0, 5) !== 'data:' && Story.has(source)) {
				const passage = Story.get(source);

				if (passage.tags.includes('Twine.audio')) {
					return passage.text.trim();
				}
			}

			// Handle URIs—possibly prefixed with a format specifier.
			const match = _formatSpecRe.exec(source);
			return match === null ? source : {
				format : match[1],
				src    : match[2]
			};
		}));
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(Object.defineProperties({}, {
		// Track Functions.
		tracks : {
			value : Object.freeze(Object.defineProperties({}, {
				add    : { value : trackAdd },
				delete : { value : trackDelete },
				clear  : { value : trackClear },
				has    : { value : trackHas },
				get    : { value : trackGet }
			}))
		},

		// Group Functions.
		groups : {
			value : Object.freeze(Object.defineProperties({}, {
				add    : { value : groupAdd },
				delete : { value : groupDelete },
				clear  : { value : groupClear },
				has    : { value : groupHas },
				get    : { value : groupGet }
			}))
		},

		// Playlist Functions.
		lists : {
			value : Object.freeze(Object.defineProperties({}, {
				add    : { value : listAdd },
				delete : { value : listDelete },
				clear  : { value : listClear },
				has    : { value : listHas },
				get    : { value : listGet }
			}))
		},

		// Runner Functions.
		select : { value : runnerGet },

		// Master Audio Functions.
		load           : { value : masterLoad },
		loadWithScreen : { value : masterLoadWithScreen },
		mute           : { value : masterMute },
		muteOnHidden   : { value : masterMuteOnHidden },
		rate           : { value : masterRate },
		stop           : { value : masterStop },
		unload         : { value : masterUnload },
		volume         : { value : masterVolume }
	}));
})();
