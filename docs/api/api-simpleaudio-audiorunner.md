<!-- ***************************************************************************
	AudioRunner API
**************************************************************************** -->
# `AudioRunner` API {#audiorunner-api}

Audio runners are useful for performing actions on multiple tracks at once.

<p role="note" class="see"><b>See Also:</b>
<a href="#simpleaudio-api"><code>SimpleAudio</code> API</a>, <a href="#audiotrack-api"><code>AudioTrack</code> API</a>, and <a href="#audiolist-api"><code>AudioList</code> API</a>.
</p>

<!-- *********************************************************************** -->

### `<AudioRunner>.fade(duration , toVol [, fromVol])` {#audiorunner-api-prototype-method-fade}

Starts playback of the selected tracks and fades them between the specified starting and destination volume levels over the specified number of seconds.

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) determines whether the audio subsystem automatically pauses tracks that have been faded to <code>0</code> volume (silent).
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the tracks should be faded.
* **`toVol`:** (*number*) The destination volume level.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the tracks' current volume level.

#### Examples:

```
// Fade the selected tracks from volume 0 to 1 over 6 seconds.
someTracks.fade(6, 1, 0);
```

<!-- *********************************************************************** -->

### `<AudioRunner>.fadeIn(duration [, fromVol])` {#audiorunner-api-prototype-method-fadein}

Starts playback of the selected tracks and fades them from the specified volume level to `1` (loudest) over the specified number of seconds.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the tracks should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the tracks' current volume level.

#### Examples:

```
// Fade the selected tracks in from volume 0 over 5 seconds.
someTracks.fadeIn(5, 0);
```

<!-- *********************************************************************** -->

### `<AudioRunner>.fadeOut(duration [, fromVol])` {#audiorunner-api-prototype-method-fadeout}

Starts playback of the selected tracks and fades them from the specified volume level to `0` (silent) over the specified number of seconds.

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) determines whether the audio subsystem automatically pauses tracks that have been faded to <code>0</code> volume (silent).
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the tracks should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the tracks' current volume level.

#### Examples:

```
// Fade the selected tracks out from volume 1 over 8 seconds.
someTracks.fadeOut(8, 1);
```

<!-- *********************************************************************** -->

### `<AudioRunner>.fadeStop()` {#audiorunner-api-prototype-method-fadestop}

Interrupts an in-progress fade of the selected tracks, or does nothing if no fade is progressing.

<p role="note"><b>Note:</b>
This does not alter the volume level.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.fadeStop();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.load()` {#audiorunner-api-prototype-method-load}

Pauses playback of the selected tracks and, if they're not already in the process of loading, forces them to drop any existing data and begin loading.

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.load();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.loop(state)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-loop}

Sets the selected tracks' repeating playback state (default: `false`).  Returns a reference to the current `AudioRunner` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (*boolean*) The loop state.

#### Examples:

```
// Loop the selected tracks.
someTracks.loop(true);

// Unloop the selected tracks.
someTracks.loop(false);
```

<!-- *********************************************************************** -->

### `<AudioRunner>.mute(state)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-mute}

Sets the selected tracks' volume mute state (default: `false`).  Returns a reference to the current `AudioRunner` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (*boolean*) The mute state.

#### Examples:

```
// Mute the selected tracks' volume.
someTracks.mute(true);

// Unmute the selected tracks' volume.
someTracks.mute(false);
```

<!-- *********************************************************************** -->

### `<AudioRunner>.off(...args)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-off}

Removes event handlers from the selected tracks.  Returns a reference to the current `AudioRunner` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/off/">jQuery's <code>.off()</code> method</a> applied to each of the audio elements.
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
someTracks.off('ended.myEvents');
```

<!-- *********************************************************************** -->

### `<AudioRunner>.on(...args)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-on}

Attaches event handlers to the selected tracks.  Returns a reference to the current `AudioRunner` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/on/">jQuery's <code>.on()</code> method</a> applied to each of the audio elements.
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
someTracks.on('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

### `<AudioRunner>.one(...args)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-one}

Attaches single-use event handlers to the selected tracks.  Returns a reference to the current `AudioRunner` instance for chaining.

<p role="note"><b>Note:</b>
Shorthand for <a href="http://api.jquery.com/one/">jQuery's <code>.one()</code> method</a> applied to each of the audio elements.
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
someTracks.one('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

### `<AudioRunner>.pause()` {#audiorunner-api-prototype-method-pause}

Pauses playback of the selected tracks.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.pause();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.play()` {#audiorunner-api-prototype-method-play}

Begins playback of the selected tracks.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.play();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.playWhenAllowed()` {#audiorunner-api-prototype-method-playwhenallowed}

Begins playback of the selected tracks or, failing that, sets the tracks to begin playback as soon as the player has interacted with the document.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.playWhenAllowed();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.stop()` {#audiorunner-api-prototype-method-stop}

Stops playback of the selected tracks.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.stop();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.time(seconds)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-time}

Sets the selected tracks' current time in seconds.  Returns a reference to the current `AudioRunner` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`seconds`:** (*number*) The time to set.  Valid values are floating-point numbers in the range `0` (start) to the maximum duration—e.g., `60` is `60` is sixty seconds in, `90.5` is ninety-point-five seconds in.

#### Examples:

```
// Set the selected tracks' current time to 30 seconds from their beginning.
someTracks.time(30);
```

<!-- *********************************************************************** -->

### `<AudioRunner>.unload()` {#audiorunner-api-prototype-method-unload}

Stops playback of the selected tracks and forces them to drop any existing data.

<p role="note"><b>Note:</b>
Once unloaded, playback cannot occur until the selected tracks' data is loaded again.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
someTracks.unload();
```

<!-- *********************************************************************** -->

### `<AudioRunner>.volume(level)` → *`AudioRunner` object* {#audiorunner-api-prototype-method-volume}

Sets the selected tracks' volume level (default: `1`).  Returns a reference to the current `AudioRunner` instance for chaining.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`level`:** (*number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Examples:

```
// Set the selected tracks' volume level to 75%.
someTracks.volume(0.75);
```
