<!-- ***************************************************************************
	AudioList API
**************************************************************************** -->
# `AudioList` API {#audiolist-api}

Audio lists (playlists) are useful for playing tracks in a sequence—i.e., one after another.

<p role="note" class="see"><b>See Also:</b>
<a href="#simpleaudio-api"><code>SimpleAudio</code> API</a>, <a href="#audiotrack-api"><code>AudioTrack</code> API</a>, and <a href="#audiorunner-api"><code>AudioRunner</code> API</a>.
</p>

<!-- *********************************************************************** -->

### `<AudioList>.duration()` → *number* {#audiolist-api-prototype-method-duration}

Returns the playlist's total playtime in seconds, `Infinity` if it contains any streams, or `NaN` if no metadata exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var listLength = aList.duration();
```

<!-- *********************************************************************** -->

### `<AudioList>.fade(duration , toVol [, fromVol])` → *`Promise` object* {#audiolist-api-prototype-method-fade}

Starts playback of the playlist and fades the currently playing track between the specified starting and destination volume levels over the specified number of seconds.

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) determines whether the audio subsystem automatically pauses tracks that have been faded to <code>0</code> volume (silent).
</p>

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the currently playing track should be faded.
* **`toVol`:** (*number*) The destination volume level.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the currently playing track's current volume level.

#### Examples:

```
// Fade the playlist from volume 0 to 1 over 6 seconds.
aList.fade(6, 1, 0);
```

<!-- *********************************************************************** -->

### `<AudioList>.fadeIn(duration [, fromVol])` → *`Promise` object* {#audiolist-api-prototype-method-fadein}

Starts playback of the playlist and fades the currently playing track from the specified volume level to `1` (loudest) over the specified number of seconds.

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the currently playing track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the currently playing track's current volume level.

#### Examples:

```
// Fade the playlist in from volume 0 over 5 seconds.
aList.fadeIn(5, 0);
```

<!-- *********************************************************************** -->

### `<AudioList>.fadeOut(duration [, fromVol])` → *`Promise` object* {#audiolist-api-prototype-method-fadeout}

Starts playback of the playlist and fades the currently playing track from the specified volume level to `0` (silent) over the specified number of seconds.

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) determines whether the audio subsystem automatically pauses tracks that have been faded to <code>0</code> volume (silent).
</p>

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the currently playing track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the currently playing track's current volume level.

#### Examples:

```
// Fade the playlist out from volume 1 over 8 seconds.
aList.fadeOut(8, 1);
```

<!-- *********************************************************************** -->

### `<AudioList>.fadeStop()` {#audiolist-api-prototype-method-fadestop}

Interrupts an in-progress fade of the currently playing track, or does nothing if no fade is progressing.

<p role="note"><b>Note:</b>
This does not alter the volume level.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aList.fadeStop();
```

<!-- *********************************************************************** -->

### `<AudioList>.isEnded()` → *boolean* {#audiolist-api-prototype-method-isended}

Returns whether playback of the playlist has ended.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aList.isEnded()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioList>.isFading()` → *boolean* {#audiolist-api-prototype-method-isfading}

Returns whether a fade is in-progress on the currently playing track.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aList.isFading()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioList>.isPaused()` → *boolean* {#audiolist-api-prototype-method-ispaused}

Returns whether playback of the playlist has been paused.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aList.isPaused()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioList>.isPlaying()` → *boolean* {#audiolist-api-prototype-method-isplaying}

Returns whether the playlist is playing.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aList.isPlaying()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioList>.isStopped()` → *boolean* {#audiolist-api-prototype-method-isstopped}

Returns whether playback of the playlist has been stopped.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (aList.isStopped()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `<AudioList>.load()` {#audiolist-api-prototype-method-load}

Pauses playback of the playlist and, if they're not already in the process of loading, forces its tracks to drop any existing data and begin loading.

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aList.load();
```

<!-- *********************************************************************** -->

### `<AudioList>.loop([state])` → **get:** *boolean* | **set:** *`AudioList` object* {#audiolist-api-prototype-method-loop}

Gets or sets the playlist's repeating playback state (default: `false`).  When used to set the loop state, returns a reference to the current `AudioList` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The loop state.

#### Examples:

```
// Get the playlist's current loop state.
var isLooped = aList.loop();

// Loop the playlist.
aList.loop(true);

// Unloop the playlist.
aList.loop(false);
```

<!-- *********************************************************************** -->

### `<AudioList>.mute([state])` → **get:** *boolean* | **set:** *`AudioList` object* {#audiolist-api-prototype-method-mute}

Gets or sets the playlist's volume mute state (default: `false`).  When used to set the mute state, returns a reference to the current `AudioList` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The mute state.

#### Examples:

```
// Get the playlist's current volume mute state.
var isMuted = aList.mute();

// Mute the playlist's volume.
aList.mute(true);

// Unmute the playlist's volume.
aList.mute(false);
```

<!-- *********************************************************************** -->

### `<AudioList>.pause()` {#audiolist-api-prototype-method-pause}

Pauses playback of the playlist.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aList.pause();
```

<!-- *********************************************************************** -->

### `<AudioList>.play()` → *`Promise` object* {#audiolist-api-prototype-method-play}

Begins playback of the playlist.

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters: *none*

#### Examples:

##### Basic usage

```
aList.play();
```

##### Using the returned `Promise`

```
aList.play()
	.then(function () {
		console.log('The playlist is playing.');
	})
	.catch(function (problem) {
		console.warn('There was a problem with playback: ' + problem);
	});
```

<!-- *********************************************************************** -->

### `<AudioList>.playWhenAllowed()` {#audiolist-api-prototype-method-playwhenallowed}

Begins playback of the playlist or, failing that, sets the playlist to begin playback as soon as the player has interacted with the document.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aList.playWhenAllowed();
```

<!-- *********************************************************************** -->

### `<AudioList>.remaining()` → *number* {#audiolist-api-prototype-method-remaining}

Returns how much remains of the playlist's total playtime in seconds, `Infinity` if it contains any streams, or `NaN` if no metadata exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var listRemains = aList.remaining();
```

<!-- *********************************************************************** -->

### `<AudioList>.shuffle([state])` → **get:** *boolean* | **set:** *`AudioList` object* {#audiolist-api-prototype-method-shuffle}

Gets or sets the playlist's randomly shuffled playback state (default: `false`).  When used to set the shuffle state, returns a reference to the current `AudioList` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The shuffle state.

#### Examples:

```
// Get the playlist's current shuffle state.
var isShuffled = aList.shuffle();

// Enable shuffling of the playlist.
aList.shuffle(true);

// Disable shuffling of the playlist.
aList.shuffle(false);
```

<!-- *********************************************************************** -->

### `<AudioList>.skip()` {#audiolist-api-prototype-method-skip}

Skips ahead to the next track in the playlist, if any.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTrack.skip();
```

<!-- *********************************************************************** -->

### `<AudioList>.stop()` {#audiolist-api-prototype-method-stop}

Stops playback of the playlist.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTrack.stop();
```

<!-- *********************************************************************** -->

### `<AudioList>.time()` → *number* {#audiolist-api-prototype-method-time}

Returns the playlist's current time in seconds, or `NaN` if no metadata exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var listTime = aList.time();
```

<!-- *********************************************************************** -->

### `<AudioList>.unload()` {#audiolist-api-prototype-method-unload}

Stops playback of the playlist and forces its tracks to drop any existing data.

<p role="note"><b>Note:</b>
Once unloaded, playback cannot occur until the track's data is loaded again.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
aList.unload();
```

<!-- *********************************************************************** -->

### `<AudioList>.volume([level])` → **get:** *number* | **set:** *`AudioList` object* {#audiolist-api-prototype-method-volume}

Gets or sets the playlist's volume level (default: `1`).  When used to set the volume, returns a reference to the current `AudioList` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`level`:** (optional, *number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Examples:

```
// Get the playlist's current volume level.
var trackVolume = aList.volume();

// Set the playlist's volume level to 75%.
aList.volume(0.75);
```
