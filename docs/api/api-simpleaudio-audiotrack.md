<!-- ***************************************************************************
	AudioTrack API
**************************************************************************** -->
<h1 id="audiotrack-api"><code>AudioTrack</code> API</h1>

Audio tracks encapsulate and provide a consistent interface to an audio resource.

<p role="note" class="see"><b>See Also:</b>
<a href="#simpleaudio-api"><code>SimpleAudio</code> API</a>, <a href="#audiorunner-api"><code>AudioRunner</code> API</a>, and <a href="#audiolist-api"><code>AudioList</code> API</a>.
</p>

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-clone"></span>
### `<AudioTrack>.clone()` → *`AudioTrack` object*

Returns a new independent copy of the track.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
var trackCopy = aTrack.clone();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-duration"></span>
### `<AudioTrack>.duration()` → *number*

Returns the track's total playtime in seconds, `Infinity` for a stream, or `NaN` if no metadata exists.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
var trackLength = aTrack.duration();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-fade"></span>
### `<AudioTrack>.fade(duration , toVol [, fromVol])` → *`Promise` object*

Starts playback of the track and fades it between the specified starting and destination volume levels over the specified number of seconds.

#### Since:

* `v2.28.0`

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the track should be faded.
* **`toVol`:** (*number*) The destination volume level.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the track's current volume level.

#### Example:

```
// Fade the track from volume 0 to 1 over 6 seconds.
aTrack.fade(6, 1, 0);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-fadein"></span>
### `<AudioTrack>.fadeIn(duration [, fromVol])` → *`Promise` object*

Starts playback of the track and fades it from the specified volume level to `1` (loudest) over the specified number of seconds.

#### Since:

* `v2.28.0`: Basic syntax.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the track's current volume level.

#### Example:

```
// Fade the track in from volume 0 over 5 seconds.
aTrack.fadeIn(5, 0);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-fadeout"></span>
### `<AudioTrack>.fadeOut(duration [, fromVol])` → *`Promise` object*

Starts playback of the track and fades it from the specified volume level to `0` (silent) over the specified number of seconds.

#### Since:

* `v2.28.0`: Basic syntax.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the track's current volume level.

#### Example:

```
// Fade the track out from volume 1 over 8 seconds.
aTrack.fadeOut(8, 1);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-fadestop"></span>
### `<AudioTrack>.fadeStop()`

Interrupts an in-progress fade of the track, or does nothing if no fade is progressing.

<p role="note"><b>Note:</b>
This does not alter the volume level.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aTrack.fadeStop();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-hasdata"></span>
### `<AudioTrack>.hasData()` → *boolean*

Returns whether enough data has been loaded to play the track through to the end without interruption.

<p role="note"><b>Note:</b>
This is an estimate calculated by the browser based upon the currently downloaded data and the download rate.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.hasData()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-hasmetadata"></span>
### `<AudioTrack>.hasMetadata()` → *boolean*

Returns whether, at least, the track's metadata has been loaded.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.hasMetadata()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-hasnodata"></span>
### `<AudioTrack>.hasNoData()` → *boolean*

Returns whether none of the track's data has been loaded.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.hasNoData()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-hassomedata"></span>
### `<AudioTrack>.hasSomeData()` → *boolean*

Returns whether, at least, some of the track's data has been loaded.

<p role="note" class="tip"><b>Tip:</b>
The <a href="#audiotrack-api-prototype-method-hasdata"><code>&lt;AudioTrack&gt;.hasData()</code> method</a> is generally more useful.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.hasSomeData()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-hassource"></span>
### `<AudioTrack>.hasSource()` → *boolean*

Returns whether any valid sources were registered.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.hasSource()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isended"></span>
### `<AudioTrack>.isEnded()` → *boolean*

Returns whether playback of the track has ended.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isEnded()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isfading"></span>
### `<AudioTrack>.isFading()` → *boolean*

Returns whether a fade is in-progress on the track.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isFading()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isfailed"></span>
### `<AudioTrack>.isFailed()` → *boolean*

Returns whether an error has occurred.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isFailed()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isloading"></span>
### `<AudioTrack>.isLoading()` → *boolean*

Returns whether the track is loading data.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isLoading()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-ispaused"></span>
### `<AudioTrack>.isPaused()` → *boolean*

Returns whether playback of the track has been paused.

<!-- **NOTE:** This does not have a 1-to-1 correspondence with the track's `paused` state, which is set whenever playback is not progressing—e.g., the `paused` state is also set when a track is in the `ended` state. -->

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isPaused()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isplaying"></span>
### `<AudioTrack>.isPlaying()` → *boolean*

Returns whether the track is playing.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isPlaying()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isseeking"></span>
### `<AudioTrack>.isSeeking()` → *boolean*

Returns whether the track is seeking.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isSeeking()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isstopped"></span>
### `<AudioTrack>.isStopped()` → *boolean*

Returns whether playback of the track has been stopped.

#### Since:

* `v2.29.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isStopped()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isunavailable"></span>
### `<AudioTrack>.isUnavailable()` → *boolean*

Returns whether the track is currently unavailable for playback.  Possible reasons include: no valid sources are registered, no sources are currently loaded, an error has occurred.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isUnavailable()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-isunloaded"></span>
### `<AudioTrack>.isUnloaded()` → *boolean*

Returns whether the track's sources are currently unloaded.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aTrack.isUnloaded()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-load"></span>
### `<AudioTrack>.load()`

Pauses playback of the track and, if it's not already in the process of loading, forces it to drop any existing data and begin loading.

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aTrack.load();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-loop"></span>
### `<AudioTrack>.loop([state])` → **get:** *boolean* | **set:** *`AudioTrack` object*

Gets or sets the track's repeating playback state (default: `false`).  When used to set the loop state, returns a reference to the current `AudioTrack` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (optional, *boolean*) The loop state.

#### Example:

```
// Get the track's current loop state.
var isLooped = aTrack.loop();

// Loop the track.
aTrack.loop(true);

// Unloop the track.
aTrack.loop(false);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-mute"></span>
### `<AudioTrack>.mute([state])` → **get:** *boolean* | **set:** *`AudioTrack` object*

Gets or sets the track's volume mute state (default: `false`).  When used to set the mute state, returns a reference to the current `AudioTrack` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (optional, *boolean*) The mute state.

#### Example:

```
// Get the track's current volume mute state.
var isMuted = aTrack.mute();

// Mute the track's volume.
aTrack.mute(true);

// Unmute the track's volume.
aTrack.mute(false);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-off"></span>
### `<AudioTrack>.off(...args)` → *`AudioTrack` object*

Removes event handlers from the track.  Returns a reference to the current `AudioTrack` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/off/">jQuery's <code>.off()</code> method</a> applied to the audio element.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### Since:

* `v2.28.0`

#### Parameters:

<p role="note" class="see"><b>See:</b>
<a href="http://api.jquery.com/off/"><code>&lt;jQuery&gt;.off()</code></a> in the jQuery API docs for more information.
</p>

#### Example:

```
// Remove any handlers for the ended event.
aTrack.off('ended.myEvents');
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-on"></span>
### `<AudioTrack>.on(...args)` → *`AudioTrack` object*

Attaches event handlers to the track.  Returns a reference to the current `AudioTrack` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/on/">jQuery's <code>.on()</code> method</a> applied to the audio element.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### Since:

* `v2.28.0`

#### Parameters:

<p role="note" class="see"><b>See:</b>
<a href="http://api.jquery.com/on/"><code>&lt;jQuery&gt;.on()</code></a> in the jQuery API docs for more information.
</p>

#### Example:

```
// Add a handler for the ended event.
aTrack.on('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-one"></span>
### `<AudioTrack>.one(...args)` → *`AudioTrack` object*

Attaches single-use event handlers to the track.  Returns a reference to the current `AudioTrack` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/one/">jQuery's <code>.one()</code> method</a> applied to the audio element.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### Since:

* `v2.28.0`

#### Parameters:

<p role="note" class="see"><b>See:</b>
<a href="http://api.jquery.com/one/"><code>&lt;jQuery&gt;.one()</code></a> in the jQuery API docs for more information.
</p>

#### Example:

```
// Add a single-use handler for the ended event.
aTrack.one('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-pause"></span>
### `<AudioTrack>.pause()`

Pauses playback of the track.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aTrack.pause();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-play"></span>
### `<AudioTrack>.play()` → *`Promise` object*

Begins playback of the track.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

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

<span id="audiotrack-api-prototype-method-playwhenallowed"></span>
### `<AudioTrack>.playWhenAllowed()`

Begins playback of the track or, failing that, sets the track to begin playback as soon as the player has interacted with the document.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aTrack.playWhenAllowed();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-remaining"></span>
### `<AudioTrack>.remaining()` → *number*

Returns how much remains of the track's total playtime in seconds, `Infinity` for a stream, or `NaN` if no metadata exists.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
var trackRemains = aTrack.remaining();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-stop"></span>
### `<AudioTrack>.stop()`

Stops playback of the track.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTrack.stop();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-time"></span>
### `<AudioTrack>.time([seconds])` → **get:** *number* | **set:** *`AudioTrack` object*

Gets or sets the track's current time in seconds.  When used to set a value, returns a reference to the current `AudioTrack` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`seconds`:** (optional, *number*) The time to set.  Valid values are floating-point numbers in the range `0` (start) to the maximum duration—e.g., `60` is `60` is sixty seconds in, `90.5` is ninety-point-five seconds in.

#### Example:

```
// Get the track's current time.
var trackTime = aTrack.time();

// Set the track's current time to 30 seconds from its beginning.
aTrack.time(30);

// Set the track's current time to 30 seconds from its end.
aTrack.time(aTrack.duration() - 30);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-unload"></span>
### `<AudioTrack>.unload()`

Stops playback of the track and forces it to drop any existing data.

<p role="note"><b>Note:</b>
Once unloaded, playback cannot occur until the track's data is loaded again.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aTrack.unload();
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-prototype-method-volume"></span>
### `<AudioTrack>.volume([level])` → **get:** *number* | **set:** *`AudioTrack` object*

Gets or sets the track's volume level (default: `1`).  When used to set the volume, returns a reference to the current `AudioTrack` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`level`:** (optional, *number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Example:

```
// Get the track's current volume level.
var trackVolume = aTrack.volume();

// Set the track's volume level to 75%.
aTrack.volume(0.75);
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-event-faded"></span>
### `:faded` event

Synthetic event triggered on the track when a fade completes normally.

#### Since:

* `v2.29.0`

#### Event object properties: *none*

#### Example:

```
/* Execute the handler function when the event triggers. */
aTrack.on(':faded', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-event-fading"></span>
### `:fading` event

Synthetic event triggered on the track when a fade starts.

#### Since:

* `v2.29.0`

#### Event object properties: *none*

#### Example:

```
/* Execute the handler function when the event triggers. */
aTrack.on(':fading', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="audiotrack-api-event-stopped"></span>
### `:stopped` event

Synthetic event triggered on the track when playback is stopped after [`<AudioTrack>.stop()`](#audiotrack-api-prototype-method-stop) is called—either manually or as part of another process.

<p role="note" class="see"><b>See:</b>
<a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event"><code>ended</code></a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event"><code>pause</code></a> for information on somewhat similar native events.
</p>

#### Since:

* `v2.29.0`

#### Event object properties: *none*

#### Example:

```
/* Execute the handler function when the event triggers. */
aTrack.on(':stopped', function (ev) {
	/* JavaScript code */
});
```
