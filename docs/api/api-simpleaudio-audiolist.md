<!-- ***************************************************************************
	AudioList API
**************************************************************************** -->
<h1 id="audiolist-api"><code>AudioList</code> API</h1>

Audio lists (playlists) are useful for playing tracks in a sequence—i.e., one after another.

<p role="note" class="see"><b>See Also:</b>
<a href="#simpleaudio-api"><code>SimpleAudio</code> API</a>, <a href="#audiotrack-api"><code>AudioTrack</code> API</a>, and <a href="#audiorunner-api"><code>AudioRunner</code> API</a>.
</p>

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-duration"></span>
### `<AudioList>.duration()` → *number*

Returns the playlist's total playtime in seconds, `Infinity` if it contains any streams, or `NaN` if no metadata exists.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
var listLength = aList.duration();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-fade"></span>
### `<AudioList>.fade(duration , toVol [, fromVol])` → *`Promise` object*

Starts playback of the playlist and fades the currently playing track between the specified starting and destination volume levels over the specified number of seconds.

#### Since:

* `v2.28.0`: Basic syntax.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the currently playing track should be faded.
* **`toVol`:** (*number*) The destination volume level.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the currently playing track's current volume level.

#### Example:

```
// Fade the playlist from volume 0 to 1 over 6 seconds.
aList.fade(6, 1, 0);
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-fadein"></span>
### `<AudioList>.fadeIn(duration [, fromVol])` → *`Promise` object*

Starts playback of the playlist and fades the currently playing track from the specified volume level to `1` (loudest) over the specified number of seconds.

#### Since:

* `v2.28.0`: Basic syntax.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the currently playing track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the currently playing track's current volume level.

#### Example:

```
// Fade the playlist in from volume 0 over 5 seconds.
aList.fadeIn(5, 0);
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-fadeout"></span>
### `<AudioList>.fadeOut(duration [, fromVol])` → *`Promise` object*

Starts playback of the playlist and fades the currently playing track from the specified volume level to `0` (silent) over the specified number of seconds.

#### Since:

* `v2.28.0`: Basic syntax.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the currently playing track should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the currently playing track's current volume level.

#### Example:

```
// Fade the playlist out from volume 1 over 8 seconds.
aList.fadeOut(8, 1);
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-fadestop"></span>
### `<AudioList>.fadeStop()`

Interrupts an in-progress fade of the currently playing track, or does nothing if no fade is progressing.

<p role="note"><b>Note:</b>
This does not alter the volume level.
</p>

#### Since:

* `v2.29.0`

#### Parameters: *none*

#### Example:

```
aList.fadeStop();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-isended"></span>
### `<AudioList>.isEnded()` → *boolean*

Returns whether playback of the playlist has ended.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aList.isEnded()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-isfading"></span>
### `<AudioList>.isFading()` → *boolean*

Returns whether a fade is in-progress on the currently playing track.

#### Since:

* `v2.29.0`

#### Parameters: *none*

#### Example:

```
if (aList.isFading()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-ispaused"></span>
### `<AudioList>.isPaused()` → *boolean*

Returns whether playback of the playlist has been paused.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aList.isPaused()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-isplaying"></span>
### `<AudioList>.isPlaying()` → *boolean*

Returns whether the playlist is playing.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
if (aList.isPlaying()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-isstopped"></span>
### `<AudioList>.isStopped()` → *boolean*

Returns whether playback of the playlist has been stopped.

#### Since:

* `v2.29.0`

#### Parameters: *none*

#### Example:

```
if (aList.isStopped()) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-load"></span>
### `<AudioList>.load()`

Pauses playback of the playlist and, if they're not already in the process of loading, forces its tracks to drop any existing data and begin loading.

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aList.load();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-loop"></span>
### `<AudioList>.loop([state])` → **get:** *boolean* | **set:** *`AudioList` object*

Gets or sets the playlist's repeating playback state (default: `false`).  When used to set the loop state, returns a reference to the current `AudioList` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (optional, *boolean*) The loop state.

#### Example:

```
// Get the playlist's current loop state.
var isLooped = aList.loop();

// Loop the playlist.
aList.loop(true);

// Unloop the playlist.
aList.loop(false);
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-mute"></span>
### `<AudioList>.mute([state])` → **get:** *boolean* | **set:** *`AudioList` object*

Gets or sets the playlist's volume mute state (default: `false`).  When used to set the mute state, returns a reference to the current `AudioList` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (optional, *boolean*) The mute state.

#### Example:

```
// Get the playlist's current volume mute state.
var isMuted = aList.mute();

// Mute the playlist's volume.
aList.mute(true);

// Unmute the playlist's volume.
aList.mute(false);
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-pause"></span>
### `<AudioList>.pause()`

Pauses playback of the playlist.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aList.pause();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-play"></span>
### `<AudioList>.play()` → *`Promise` object*

Begins playback of the playlist.

#### Since:

* `v2.28.0`: Basic syntax.
* `v2.29.0`: Updated to return a `Promise`.

#### Parameters: *none*

#### Example:

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

<span id="audiolist-api-prototype-method-playwhenallowed"></span>
### `<AudioList>.playWhenAllowed()`

Begins playback of the playlist or, failing that, sets the playlist to begin playback as soon as the player has interacted with the document.

#### Since:

* `v2.29.0`

#### Parameters: *none*

#### Example:

```
aList.playWhenAllowed();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-remaining"></span>
### `<AudioList>.remaining()` → *number*

Returns how much remains of the playlist's total playtime in seconds, `Infinity` if it contains any streams, or `NaN` if no metadata exists.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
var listRemains = aList.remaining();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-shuffle"></span>
### `<AudioList>.shuffle([state])` → **get:** *boolean* | **set:** *`AudioList` object*

Gets or sets the playlist's randomly shuffled playback state (default: `false`).  When used to set the shuffle state, returns a reference to the current `AudioList` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (optional, *boolean*) The shuffle state.

#### Example:

```
// Get the playlist's current shuffle state.
var isShuffled = aList.shuffle();

// Enable shuffling of the playlist.
aList.shuffle(true);

// Disable shuffling of the playlist.
aList.shuffle(false);
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-skip"></span>
### `<AudioList>.skip()`

Skips ahead to the next track in the playlist, if any.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTrack.skip();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-stop"></span>
### `<AudioList>.stop()`

Stops playback of the playlist.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTrack.stop();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-time"></span>
### `<AudioList>.time()` → *number*

Returns the playlist's current time in seconds, or `NaN` if no metadata exists.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
var listTime = aList.time();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-unload"></span>
### `<AudioList>.unload()`

Stops playback of the playlist and forces its tracks to drop any existing data.

<p role="note"><b>Note:</b>
Once unloaded, playback cannot occur until the track's data is loaded again.
</p>

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
aList.unload();
```

<!-- *********************************************************************** -->

<span id="audiolist-api-prototype-method-volume"></span>
### `<AudioList>.volume([level])` → **get:** *number* | **set:** *`AudioList` object*

Gets or sets the playlist's volume level (default: `1`).  When used to set the volume, returns a reference to the current `AudioList` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`level`:** (optional, *number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Example:

```
// Get the playlist's current volume level.
var trackVolume = aList.volume();

// Set the playlist's volume level to 75%.
aList.volume(0.75);
```
