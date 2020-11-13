<!-- ***********************************************************************************************
	SimpleAudio API
************************************************************************************************ -->
# `SimpleAudio` API {#simpleaudio-api}

The core audio subsystem and backend for the [audio macros](#macros-audio).

<p role="note" class="see"><b>See Also:</b>
<a href="#audiotrack-api"><code>AudioTrack</code> API</a>, <a href="#audiorunner-api"><code>AudioRunner</code> API</a>, and <a href="#audiolist-api"><code>AudioList</code> API</a>.
</p>

#### Audio limitations {#simpleaudio-api-limitations}

The audio subsystem is based upon the HTML Media Elements APIs and comes with some built-in limitations:

1. True gapless transitions between tracks is not supported.
2. In mobile browsers, playback volume is controlled by the device hardware.  Thus, all volume adjustments are ignored by the device, though muting should work normally.
3. In mobile browsers and, more recently, most desktop browsers, playback must be initiated by the player—generally via click/touch.  In these cases, audio will not automatically play on the starting passage, nor is it likely to play if initiated from within asynchronous code—e.g., via `<<timed>>`—though this ultimately depends on various factors.  A simple solution for the former is to use some kind of click/touch-through screen—e.g., a splash screen, which the player goes through to the real starting passage.  The latter is harder to resolve, so is best avoided.
4. The load and playback states of tracks are not currently recorded within the active play session or saves.  Thus, if you need either to be recoverable, then you'll have to handle that yourself.


<!-- ***************************************************************************
	SimpleAudio General
**************************************************************************** -->
## General {#simpleaudio-api-general}

<!-- *********************************************************************** -->

### `SimpleAudio.load()` {#simpleaudio-api-method-load}

Pauses playback of *all* currently registered tracks and, if they're not already in the process of loading, force them to drop any existing data and begin loading.

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.load();
```

<!-- *********************************************************************** -->

### `SimpleAudio.loadWithScreen()` {#simpleaudio-api-method-loadwithscreen}

Displays the loading screen until *all* currently registered audio tracks have either loaded to a playable state or aborted loading due to errors.  The loading process is as described in [`SimpleAudio.load()`](#simpleaudio-api-method-load).

<p role="note" class="warning"><b>Warning:</b>
This <em>should not</em> be done lightly if your audio sources are on the network, as it forces players to begin downloading them.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.loadWithScreen();
```

<!-- *********************************************************************** -->

### `SimpleAudio.mute([state])` → **get:** *boolean* | **set:** *undefined* {#simpleaudio-api-method-mute}

Gets or sets the mute state for the master volume (default: `false`).

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The mute state.

#### Examples:

```
// Get the current master volume mute state.
var isMuted = SimpleAudio.mute();

// Mute the master volume.
SimpleAudio.mute(true);

// Unmute the master volume.
SimpleAudio.mute(false);
```

<!-- *********************************************************************** -->

### `SimpleAudio.muteOnHidden([state])` → **get:** *boolean* | **set:** *undefined* {#simpleaudio-api-method-muteonhidden}

Gets or sets the mute-on-hidden state for the master volume (default: `false`).  The mute-on-hidden state controls whether the master volume is automatically muted/unmuted when the story's browser tab loses/gains visibility.  Loss of visibility is defined as when the browser window is either switched to another tab or minimized.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`state`:** (optional, *boolean*) The mute-on-hidden state.

#### Examples:

```
// Get the current master volume mute-on-hidden state.
var isMuteOnHidden = SimpleAudio.muteOnHidden();

// Enable automatic muting of the master volume when visibility is lost.
SimpleAudio.muteOnHidden(true);

// Disable automatic muting of the master volume when visibility is lost.
SimpleAudio.muteOnHidden(false);
```

<!-- *********************************************************************** -->

### `SimpleAudio.select(selector)` → *`AudioRunner` object* {#simpleaudio-api-method-select}

Returns an [`AudioRunner` instance](#audiorunner-api) for the tracks matching the given selector.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`selector`:** (*string*) The list of audio track(s) and/or group ID(s), separated by spaces.  There are several predefined group IDs (`:all`, `:looped`, `:muted`, `:paused`, `:playing`).  The `:not()` group modifier syntax (`groupId:not(selector)`) allows a group to have some of its tracks excluded from selection.

#### Examples:

##### Basic usage

```
SimpleAudio.select(":ui")  → Returns the AudioRunner instance for the tracks matching ":ui"
```

##### Typical usage

```
// Return the AudioTrack instance matching "swamped" and do something with it
SimpleAudio.select("swamped").volume(1).play();

// Start playback of paused audio tracks
SimpleAudio.select(":paused").play();

// Pause playback of playing audio tracks
SimpleAudio.select(":playing").pause();

// Stop playback of playing audio tracks
SimpleAudio.select(":playing").stop();

// Stop playback of all audio tracks (not uniquely part of a playlist)
SimpleAudio.select(":all").stop();

// Stop playback of playing audio tracks except those in the ":ui" group
SimpleAudio.select(":playing:not(:ui)").stop();

// Change the volume of all audio tracks except those in the ":ui" group
// to 40%, without changing the current playback state
SimpleAudio.select(":all:not(:ui)").volume(0.40);
```

<!-- *********************************************************************** -->

### `SimpleAudio.stop()` {#simpleaudio-api-method-stop}

Stops playback of *all* currently registered tracks.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.stop();
```

<!-- *********************************************************************** -->

### `SimpleAudio.unload()` {#simpleaudio-api-method-unload}

Stops playback of *all* currently registered tracks and force them to drop any existing data.

<p role="note"><b>Note:</b>
Once a track has been unloaded, playback cannot occur until it is reloaded.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.unload();
```

<!-- *********************************************************************** -->

### `SimpleAudio.volume([level])` → **get:** *number* | **set:** *undefined* {#simpleaudio-api-method-volume}

Gets or sets the master volume level (default: `1`).

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`level`:** (optional, *number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Examples:

```
// Get the current master volume level.
var currentMasterVolume = SimpleAudio.volume();

// Set the master volume level to 75%.
SimpleAudio.volume(0.75);
```


<!-- ***************************************************************************
	SimpleAudio Tracks
**************************************************************************** -->
## Tracks {#simpleaudio-api-tracks}

<!-- *********************************************************************** -->

### `SimpleAudio.tracks.add(trackId, sources…)` {#simpleaudio-api-method-tracks-add}

Adds an audio track with the given track ID.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`trackId`:** (*string*) The ID of the track, which will be used to reference it.
* **`sources`:** (*any* | *array*) The audio sources for the track, which may be a list of sources or an array.  Only one is required, though supplying additional sources in differing formats is recommended, as no single format is supported by all browsers.  A source must be either a URL (absolute or relative) to an audio resource, the name of an audio passage, or a data URI.  In rare cases where the audio format cannot be automatically detected from the source (URLs are parsed for a file extension, data URIs are parsed for the media type), a format specifier may be prepended to the front of each source to manually specify the format (syntax: `formatId|`, where `formatId` is the audio format—generally, whatever the file extension would normally be; e.g., `mp3`, `mp4`, `ogg`, `weba`, `wav`).

#### Examples:

```
// Cache a track with the ID "boom" and one source via relative URL
SimpleAudio.tracks.add("boom", "media/audio/explosion.mp3");

// Cache a track with the ID "boom" and one source via audio passage
SimpleAudio.tracks.add("boom", "explosion");

// Cache a track with the ID "bgm_space" and two sources via relative URLs
SimpleAudio.tracks.add("bgm_space", "media/audio/space_quest.mp3", "media/audio/space_quest.ogg");

// Cache a track with the ID "what" and one source via URL with a format specifier
SimpleAudio.tracks.add("what", "mp3|http://an-audio-service.com/a-user/a-track-id");
```

<!-- *********************************************************************** -->

### `SimpleAudio.tracks.clear()` {#simpleaudio-api-method-tracks-clear}

Deletes all audio tracks.

<p role="note"><b>Note:</b>
Cannot delete tracks solely under the control of a playlist.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.tracks.clear();
```

<!-- *********************************************************************** -->

### `SimpleAudio.tracks.delete(trackId)` {#simpleaudio-api-method-tracks-delete}

Deletes the audio track with the given track ID.

<p role="note"><b>Note:</b>
Cannot delete tracks solely under the control of a playlist.
</p>

<p role="note" class="warning"><b>Warning:</b>
Does not currently remove the track from either groups or playlists.  Thus, any groups or playlists containing the deleted track should be rebuilt.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`trackId`:** (*string*) The ID of the track.

#### Examples:

```
SimpleAudio.tracks.delete("bgm_space");
```

<!-- *********************************************************************** -->

### `SimpleAudio.tracks.get(trackId)` → *`AudioTrack` object* | *null* {#simpleaudio-api-method-tracks-get}

Returns the [`AudioTrack` instance](#audiotrack-api) with the given track ID, or `null` on failure.

<p role="note"><b>Note:</b>
To affect multiple tracks and/or groups at once, see the <a href="#simpleaudio-api-method-select"><code>SimpleAudio.select()</code> method</a>.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`trackId`:** (*string*) The ID of the track.

#### Examples:

##### Basic usage

```
SimpleAudio.tracks.get("swamped")  → Returns the AudioTrack instance matching "swamped"
```

##### Typical usage

```
// Return the AudioTrack instance matching "swamped" and do something with it
SimpleAudio.tracks.get("swamped").volume(1).play();
```

<!-- *********************************************************************** -->

### `SimpleAudio.tracks.has(trackId)` → *boolean* {#simpleaudio-api-method-tracks-has}

Returns whether an audio track with the given track ID exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`trackId`:** (*string*) The ID of the track.

#### Examples:

```
if (SimpleAudio.tracks.has("bgm_space")) {
	// Track "bgm_space" exists.
}
```


<!-- ***************************************************************************
	SimpleAudio Groups
**************************************************************************** -->
## Groups {#simpleaudio-api-groups}

<!-- *********************************************************************** -->

### `SimpleAudio.groups.add(groupId, trackIds…)` {#simpleaudio-api-method-groups-add}

Adds an audio group with the given group ID.  Groups are useful for applying actions to multiple tracks simultaneously and/or excluding the included tracks from a larger set when applying actions.

<p role="note"><b>Note:</b>
If you want to play tracks in a sequence, then you want a <a href="#simpleaudio-api-method-lists-add">playlist</a> instead.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`groupId`:** (*string*) The ID of the group, which will be used to reference it and *must* begin with a colon.  **NOTE:** There are several predefined group IDs (`:all`, `:looped`, `:muted`, `:paused`, `:playing`) and the `:not` group modifier that cannot be reused/overwritten.
* **`trackIds`:** (*any* | *array*) The IDs of the tracks to make part of the group, which may be a list of track IDs or an array.

#### Examples:

```
// Set up a group ":ui" with the tracks: "ui_beep", "ui_boop", and "ui_swish"
SimpleAudio.groups.add(":ui", "ui_beep", "ui_boop", "ui_swish");
```

<!-- *********************************************************************** -->

### `SimpleAudio.groups.clear()` {#simpleaudio-api-method-groups-clear}

Deletes all audio groups.

<p role="note"><b>Note:</b>
Only deletes the groups themselves, does not affect their component tracks.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.groups.clear();
```

<!-- *********************************************************************** -->

### `SimpleAudio.groups.delete(groupId)` {#simpleaudio-api-method-groups-delete}

Deletes the audio group with the given group ID.

<p role="note"><b>Note:</b>
Only deletes the group itself, does not affect its component tracks.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`groupId`:** (*string*) The ID of the group.

#### Examples:

```
SimpleAudio.groups.delete(":ui");
```

<!-- *********************************************************************** -->

### `SimpleAudio.groups.get(groupId)` → *array* | *null* {#simpleaudio-api-method-groups-get}

Returns the array of track IDs with the given group ID, or `null` on failure.

<p role="note"><b>Note:</b>
To actually affect multiple tracks and/or groups, see the <a href="#simpleaudio-api-method-select"><code>SimpleAudio.select()</code> method</a>.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`groupId`:** (*string*) The ID of the group.

#### Examples:

```
SimpleAudio.groups.get(":ui")  → Returns the array of track IDs matching ":ui"
```

<!-- *********************************************************************** -->

### `SimpleAudio.groups.has(groupId)` → *boolean* {#simpleaudio-api-method-groups-has}

Returns whether an audio group with the given group ID exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`groupId`:** (*string*) The ID of the group.

#### Examples:

```
if (SimpleAudio.groups.has(":ui")) {
	// Group ":ui" exists.
}
```


<!-- ***************************************************************************
	SimpleAudio Lists
**************************************************************************** -->
## Lists {#simpleaudio-api-lists}

<!-- *********************************************************************** -->

### `SimpleAudio.lists.add(listId, sources…)` {#simpleaudio-api-method-lists-add}

Adds a playlist with the given list ID.  Playlists are useful for playing tracks in a sequence—i.e., one after another.

<p role="note"><b>Note:</b>
If you simply want to apply actions to multiple tracks simultaneously, then you want a <a href="#simpleaudio-api-method-groups-add">group</a> instead.
</p>

#### History:

* `v2.28.0`: Introduced.
* `v2.29.0`: Changed descriptor object `copy` property to `own`.

#### Parameters:

* **`listId`:** (*string*) The ID of the list, which will be used to reference it.
* **`sources`:** (*string* | *object* | *array*) The track IDs or descriptors of the tracks to make part of the list, which may be specified as a list or an array.

#### Descriptor objects:

Track descriptor objects come in two forms and should have some of the noted properties:

* **Existing track form: `{ id, [own], [volume] }`**
  * **`id`:** (*string*) The ID of an existing track.
  * **`own`:** (optional, *boolean*) When `true`, signifies that the playlist should create its own independent copy of the track, rather than simply referencing the existing instance.  Owned copies are solely under the control of their playlist and cannot be selected with either the [`SimpleAudio.tracks.get()` method](#simpleaudio-api-method-tracks-get) or the [`SimpleAudio.select()` method](#simpleaudio-api-method-select).
  * **`volume`:** (optional, *number*) The base volume level of the track within the playlist.  If omitted, defaults to the track's current volume.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.
* **New track form: `{ sources, [volume] }`**
  * **`sources`:** (*string array*) The audio sources for the track.  Only one is required, though supplying additional sources in differing formats is recommended, as no single format is supported by all browsers.  A source must be either a URL (absolute or relative) to an audio resource, the name of an audio passage, or a data URI.  In rare cases where the audio format cannot be automatically detected from the source (URLs are parsed for a file extension, data URIs are parsed for the media type), a format specifier may be prepended to the front of each source to manually specify the format (syntax: `formatId|`, where `formatId` is the audio format—generally, whatever the file extension would normally be; e.g., `mp3`, `mp4`, `ogg`, `weba`, `wav`).
  * **`volume`:** (optional, *number*) The base volume level of the track within the playlist.  If omitted, defaults to `1` (loudest).  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Examples:

##### Basic usage with track IDs

```
// Add existing tracks at their current volumes
SimpleAudio.lists.add("bgm_lacuna", "swamped", "heavens_a_lie", "closer", "to_the_edge");
```

##### Using a mix of track IDs and descriptors

```
SimpleAudio.lists.add("bgm_lacuna",
	// Add existing track "swamped" at its current volume
	"swamped",

	// Add existing track "heavens_a_lie" at 50% volume
	{
		id     : "heavens_a_lie",
		volume : 0.5
	},

	// Add an owned copy of existing track "closer" at its current volume
	{
		id  : "closer",
		own : true
	},

	// Add an owned copy of existing track "to_the_edge" at 100% volume
	{
		id     : "to_the_edge",
		own    : true,
		volume : 1
	}
);
```

##### Using descriptors with sources

```
SimpleAudio.lists.add("bgm_lacuna",
	// Add a track from the given sources at the default volume (100%)
	{
		sources : ["media/audio/Swamped.mp3"]
	}

	// Add a track from the given sources at 50% volume
	{
		sources : ["media/audio/Heaven's_A_Lie.mp3"],
		volume  : 0.5
	},

	// Add a track from the given sources at the default volume (100%)
	{
		sources : ["media/audio/Closer.mp3"]
	},

	// Add a track from the given sources at 100% volume
	{
		sources : ["media/audio/To_The_Edge.mp3"],
		volume  : 1
	}
);
```

<!-- *********************************************************************** -->

### `SimpleAudio.lists.clear()` {#simpleaudio-api-method-lists-clear}

Deletes all playlists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
SimpleAudio.lists.clear();
```

<!-- *********************************************************************** -->

### `SimpleAudio.lists.delete(listId)` {#simpleaudio-api-method-lists-delete}

Deletes the playlist with the given list ID.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`listId`:** (*string*) The ID of the playlist.

#### Examples:

```
SimpleAudio.lists.delete("bgm_lacuna");
```

<!-- *********************************************************************** -->

### `SimpleAudio.lists.get(listId)` → *`AudioList` object* | *null* {#simpleaudio-api-method-lists-get}

Returns the [`AudioList` instance](#audiolist-api) with the given list ID, or `null` on failure.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`listId`:** (*string*) The ID of the playlist.

#### Examples:

##### Basic usage

```
SimpleAudio.lists.get("bgm_lacuna")  → Returns the AudioList instance matching "bgm_lacuna"
```

##### Typical usage

```
// Return the AudioList instance matching "bgm_lacuna" and do something with it
SimpleAudio.lists.get("bgm_lacuna").volume(1).loop(true).play();
```

<!-- *********************************************************************** -->

### `SimpleAudio.lists.has(listId)` → *boolean* {#simpleaudio-api-method-lists-has}

Returns whether a playlist with the given list ID exists.

#### History:

* `v2.28.0`: Introduced.

#### Parameters:

* **`listId`:** (*string*) The ID of the playlist.

#### Examples:

```
if (SimpleAudio.lists.has("bgm_lacuna")) {
	// Playlist "bgm_lacuna" exists.
}
```
