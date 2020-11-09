<!-- ***************************************************************************
	AudioTrack API
**************************************************************************** -->
# `AudioTrack` API {#audiotrack-api}

Audio tracks encapsulate and provide a consistent interface to an audio resource.

<p role="note" class="see"><b>See Also:</b>
<a href="#simpleaudio-api"><code>SimpleAudio</code> API</a>, <a href="#audiorunner-api"><code>AudioRunner</code> API</a>, and <a href="#audiolist-api"><code>AudioList</code> API</a>.
</p>

<!-- *********************************************************************** -->

### `<AudioTrack>.clone()` → *`AudioTrack` object* {#audiotrack-api-prototype-method-clone}

Returns a new independent copy of the track.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var trackCopy = aTrack.clone();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.duration()` → *number* {#audiotrack-api-prototype-method-duration}

Returns the track's total playtime in seconds, `Infinity` for a stream, or `NaN` if no metadata exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var trackLength = aTrack.duration();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.fade(duration , toVol [, fromVol])` → *`Promise` object* {#audiotrack-api-prototype-method-fade}

Starts playback of the track and fades it between the specified starting and destination volume levels over the specified number of seconds.

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) determines whether the audio subsystem automatically pauses tracks that have been faded to <code>0</code> volume (silent).
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the track should be faded.
* **`toVol`:** (*number*) The destination volume level.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the track's current volume level.

#### Examples:

```
// Fade the track from volume 0 to 1 over 6 seconds.
aTrack.fade(6, 1, 0);
```

<!-- *********************************************************************** -->

### `<AudioTrack>.fadeIn(duration [, fromVol])` → *`Promise` object* {#audiotrack-api-prototype-method-fadein}

Starts playback of the track and fades it from the specified volume level to `1` (loudest) over the specified number of seconds.

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the track's current volume level.

#### Examples:

```
// Fade the track in from volume 0 over 5 seconds.
aTrack.fadeIn(5, 0);
```

<!-- *********************************************************************** -->

### `<AudioTrack>.fadeOut(duration [, fromVol])` → *`Promise` object* {#audiotrack-api-prototype-method-fadeout}

Starts playback of the track and fades it from the specified volume level to `0` (silent) over the specified number of seconds.

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) determines whether the audio subsystem automatically pauses tracks that have been faded to <code>0</code> volume (silent).
</p>

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the track's current volume level.

#### Examples:

```
// Fade the track out from volume 1 over 8 seconds.
aTrack.fadeOut(8, 1);
```

<!-- *********************************************************************** -->

### `<AudioTrack>.fadeStop()` {#audiotrack-api-prototype-method-fadestop}

Interrupts an in-progress fade of the track, or does nothing if no fade is progressing.

<p role="note"><b>Note:</b>
This does not alter the volume level.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aTrack.fadeStop();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.hasData()` → *boolean* {#audiotrack-api-prototype-method-hasdata}

Returns whether enough data has been loaded to play the track through to the end without interruption.

<p role="note"><b>Note:</b>
This is an estimate calculated by the browser based upon the currently downloaded data and the download rate.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.hasData()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.hasMetadata()` → *boolean* {#audiotrack-api-prototype-method-hasmetadata}

Returns whether, at least, the track's metadata has been loaded.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.hasMetadata()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.hasNoData()` → *boolean* {#audiotrack-api-prototype-method-hasnodata}

Returns whether none of the track's data has been loaded.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.hasNoData()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.hasSomeData()` → *boolean* {#audiotrack-api-prototype-method-hassomedata}

Returns whether, at least, some of the track's data has been loaded.

<p role="note" class="tip"><b>Tip:</b>
The <a href="#audiotrack-api-prototype-method-hasdata"><code>&lt;AudioTrack&gt;.hasData()</code> method</a> is generally more useful.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.hasSomeData()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.hasSource()` → *boolean* {#audiotrack-api-prototype-method-hassource}

Returns whether any valid sources were registered.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.hasSource()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isEnded()` → *boolean* {#audiotrack-api-prototype-method-isended}

Returns whether playback of the track has ended.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isEnded()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isFading()` → *boolean* {#audiotrack-api-prototype-method-isfading}

Returns whether a fade is in-progress on the track.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isFading()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isFailed()` → *boolean* {#audiotrack-api-prototype-method-isfailed}

Returns whether an error has occurred.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isFailed()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isLoading()` → *boolean* {#audiotrack-api-prototype-method-isloading}

Returns whether the track is loading data.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isLoading()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isPaused()` → *boolean* {#audiotrack-api-prototype-method-ispaused}

Returns whether playback of the track has been paused.

<!-- **NOTE:** This does not have a 1-to-1 correspondence with the track's `paused` state, which is set whenever playback is not progressing—e.g., the `paused` state is also set when a track is in the `ended` state. -->

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isPaused()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isPlaying()` → *boolean* {#audiotrack-api-prototype-method-isplaying}

Returns whether the track is playing.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isPlaying()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isSeeking()` → *boolean* {#audiotrack-api-prototype-method-isseeking}

Returns whether the track is seeking.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isSeeking()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isStopped()` → *boolean* {#audiotrack-api-prototype-method-isstopped}

Returns whether playback of the track has been stopped.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isStopped()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isUnavailable()` → *boolean* {#audiotrack-api-prototype-method-isunavailable}

Returns whether the track is currently unavailable for playback.  Possible reasons include: no valid sources are registered, no sources are currently loaded, an error has occurred.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isUnavailable()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.isUnloaded()` → *boolean* {#audiotrack-api-prototype-method-isunloaded}

Returns whether the track's sources are currently unloaded.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aTrack.isUnloaded()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioTrack>.load()` {#audiotrack-api-prototype-method-load}

Pauses playback of the track and, if it's not already in the process of loading, forces it to drop any existing data and begin loading.

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aTrack.load();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.loop([state])` → **get:** *boolean* | **set:** *`AudioTrack` object* {#audiotrack-api-prototype-method-loop}

Gets or sets the track's repeating playback state (default: `false`).  When used to set the loop state, returns a reference to the current `AudioTrack` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The loop state.

#### Examples:

```
// Get the track's current loop state.
var isLooped = aTrack.loop();

// Loop the track.
aTrack.loop(true);

// Unloop the track.
aTrack.loop(false);
```

<!-- *********************************************************************** -->

### `<AudioTrack>.mute([state])` → **get:** *boolean* | **set:** *`AudioTrack` object* {#audiotrack-api-prototype-method-mute}

Gets or sets the track's volume mute state (default: `false`).  When used to set the mute state, returns a reference to the current `AudioTrack` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The mute state.

#### Examples:

```
// Get the track's current volume mute state.
var isMuted = aTrack.mute();

// Mute the track's volume.
aTrack.mute(true);

// Unmute the track's volume.
aTrack.mute(false);
```

<!-- *********************************************************************** -->

### `<AudioTrack>.off(...args)` → *`AudioTrack` object* {#audiotrack-api-prototype-method-off}

Removes event handlers from the track.  Returns a reference to the current `AudioTrack` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/off/">jQuery's <code>.off()</code> method</a> applied to the audio element.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

<p role="note" class="see"><b>See:</b>
<a href="http://api.jquery.com/off/"><code>&lt;jQuery&gt;.off()</code></a> in the jQuery API docs for more information.
</p>

#### Examples:

```
// Remove any handlers for the ended event.
aTrack.off('ended.myEvents');
```

<!-- *********************************************************************** -->

### `<AudioTrack>.on(...args)` → *`AudioTrack` object* {#audiotrack-api-prototype-method-on}

Attaches event handlers to the track.  Returns a reference to the current `AudioTrack` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/on/">jQuery's <code>.on()</code> method</a> applied to the audio element.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

<p role="note" class="see"><b>See:</b>
<a href="http://api.jquery.com/on/"><code>&lt;jQuery&gt;.on()</code></a> in the jQuery API docs for more information.
</p>

#### Examples:

```
// Add a handler for the ended event.
aTrack.on('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

### `<AudioTrack>.one(...args)` → *`AudioTrack` object* {#audiotrack-api-prototype-method-one}

Attaches single-use event handlers to the track.  Returns a reference to the current `AudioTrack` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/one/">jQuery's <code>.one()</code> method</a> applied to the audio element.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

<p role="note" class="see"><b>See:</b>
<a href="http://api.jquery.com/one/"><code>&lt;jQuery&gt;.one()</code></a> in the jQuery API docs for more information.
</p>

#### Examples:

```
// Add a single-use handler for the ended event.
aTrack.one('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

### `<AudioTrack>.pause()` {#audiotrack-api-prototype-method-pause}

Pauses playback of the track.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aTrack.pause();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.play()` → *`Promise` object* {#audiotrack-api-prototype-method-play}

Begins playback of the track.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

##### Basic usage

```
aTrack.play();
```

##### Using the returned `Promise`

```
aTrack.play()
	.then(function () {
		console.log('The track is playing.');
	})
	.catch(function (problem) {
		console.warn('There was a problem with playback: ' + problem);
	});
```

<!-- *********************************************************************** -->

### `<AudioTrack>.playWhenAllowed()` {#audiotrack-api-prototype-method-playwhenallowed}

Begins playback of the track or, failing that, sets the track to begin playback as soon as the player has interacted with the document.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aTrack.playWhenAllowed();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.remaining()` → *number* {#audiotrack-api-prototype-method-remaining}

Returns how much remains of the track's total playtime in seconds, `Infinity` for a stream, or `NaN` if no metadata exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var trackRemains = aTrack.remaining();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.stop()` {#audiotrack-api-prototype-method-stop}

Stops playback of the track.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTrack.stop();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.time([seconds])` → **get:** *number* | **set:** *`AudioTrack` object* {#audiotrack-api-prototype-method-time}

Gets or sets the track's current time in seconds.  When used to set a value, returns a reference to the current `AudioTrack` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`seconds`:** (optional, *number*) The time to set.  Valid values are floating-point numbers in the range `0` (start) to the maximum duration—e.g., `60` is `60` is sixty seconds in, `90.5` is ninety-point-five seconds in.

#### Examples:

```
// Get the track's current time.
var trackTime = aTrack.time();

// Set the track's current time to 30 seconds from its beginning.
aTrack.time(30);

// Set the track's current time to 30 seconds from its end.
aTrack.time(aTrack.duration() - 30);
```

<!-- *********************************************************************** -->

### `<AudioTrack>.unload()` {#audiotrack-api-prototype-method-unload}

Stops playback of the track and forces it to drop any existing data.

<p role="note"><b>Note:</b>
Once unloaded, playback cannot occur until the track's data is loaded again.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aTrack.unload();
```

<!-- *********************************************************************** -->

### `<AudioTrack>.volume([level])` → **get:** *number* | **set:** *`AudioTrack` object* {#audiotrack-api-prototype-method-volume}

Gets or sets the track's volume level (default: `1`).  When used to set the volume, returns a reference to the current `AudioTrack` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`level`:** (optional, *number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Examples:

```
// Get the track's current volume level.
var trackVolume = aTrack.volume();

// Set the track's volume level to 75%.
aTrack.volume(0.75);
```
