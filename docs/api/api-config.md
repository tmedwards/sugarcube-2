<!-- ***********************************************************************************************
	Config API
************************************************************************************************ -->
# `Config` API {#config-api}

The `Config` object controls various aspects of SugarCube's behavior.

<p role="note"><b>Note:</b>
<code>Config</code> object settings should be placed within your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage).
</p>


<!-- ***************************************************************************
	Audio
**************************************************************************** -->
## Audio Settings {#config-api-audio}

<!-- *********************************************************************** -->

### `Config.audio.pauseOnFadeToZero` ↔ *boolean* (default: `true`) {#config-api-property-audio-pauseonfadetozero}

Determines whether the audio subsystem automatically pauses tracks that have been faded to `0` volume (silent).

#### History:

* `v2.28.0`: Introduced.

#### Examples:

```
Config.audio.pauseOnFadeToZero = false;
```

<!-- *********************************************************************** -->

### `Config.audio.preloadMetadata` ↔ *boolean* (default: `true`) {#config-api-property-audio-preloadmetadata}

Determines whether the audio subsystem attempts to preload track metadata—meaning information about the track (e.g., duration), not its audio frames.

<p role="note"><b>Note:</b>
It is unlikely that you will ever want to disable this setting.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Examples:

```
Config.audio.preloadMetadata = false;
```


<!-- ***************************************************************************
	History
**************************************************************************** -->
## History Settings {#config-api-history}

<!-- *********************************************************************** -->

### `Config.history.controls` ↔ *boolean* (default: `true`) {#config-api-property-history-controls}

Determines whether the story's history controls (Backward, Jump To, & Forward buttons) are enabled within the UI bar.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Config.history.controls = false;
```

<!-- *********************************************************************** -->

### `Config.history.maxStates` ↔ *integer* (default: `40`) {#config-api-property-history-maxstates}

Sets the maximum number of states (moments) to which the history is allowed to grow.  Should the history exceed the limit, states will be dropped from the past (oldest first).

<p role="note" class="tip"><b>Tip:</b>
For game-oriented projects, as opposed to more story-oriented interactive fiction, a setting of <code>1</code> is <strong><em>strongly recommended</em></strong>.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.36.0`: Reduced the default to `40`.

#### Examples:

```
// Limit the history to a single state (recommended for games)
Config.history.maxStates = 1;

// Limit the history to 80 states
Config.history.maxStates = 80;
```


<!-- ***************************************************************************
	Macros
**************************************************************************** -->
## Macros Settings {#config-api-macros}

<!-- *********************************************************************** -->

### `Config.macros.ifAssignmentError` ↔ *boolean* (default: `true`) {#config-api-property-macros-ifassignmenterror}

Determines whether the [`<<if>>` macro](#macros-macro-if) returns an error when the `=` assignment operator is used within its conditional—e.g., `<<if $suspect = "Bob">>`.  Does not flag other assignment operators.

<p role="note"><b>Note:</b>
This setting exists because it's unlikely that you'll ever want to actually perform an assignment within a conditional expression and typing <code>=</code> when you meant <code>===</code> (or <code>==</code>) is a fairly easy mistake to make—either from a finger slip or because you just don't know the difference between the operators.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// No error is returned when = is used within an <<if>> or <<elseif>> conditional
Config.macros.ifAssignmentError = false;
```

<!-- *********************************************************************** -->

### `Config.macros.maxLoopIterations` ↔ *integer* (default: `1000`) {#config-api-property-macros-maxloopiterations}

Sets the maximum number of iterations allowed before the [`<<for>>` macro](#macros-macro-for) conditional forms are terminated with an error.

<p role="note"><b>Note:</b>
This setting exists to prevent a misconfigured loop from making the browser unresponsive.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Allow only 5000 iterations
Config.macros.maxLoopIterations = 5000;
```

<!-- *********************************************************************** -->

### `Config.macros.typeSkipKey` ↔ *string* (default: `" "`, space) {#config-api-property-macros-typeskipkey}

Sets the default [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value that causes the currently running [`<<type>>` macro](#macros-macro-type) instance to finish typing its content immediately.

#### History:

* `v2.33.1`: Introduced.

#### Examples:

```
// Change the default skip key to Control (CTRL)
Config.macros.typeSkipKey = "Control";
```

<!-- *********************************************************************** -->

### `Config.macros.typeVisitedPassages` ↔ *boolean* (default: `true`) {#config-api-property-macros-typevisitedpassages}

Determines whether the [`<<type>>` macro](#macros-macro-type) types out content on previously visited passages or simply outputs it immediately.

#### History:

* `v2.32.0`: Introduced.

#### Examples:

```
// Do not type on previously visited passages
Config.macros.typeVisitedPassages = false;
```


<!-- ***************************************************************************
	Navigation
**************************************************************************** -->
## Navigation Settings {#config-api-navigation}

<!-- *********************************************************************** -->

### `Config.navigation.override` ↔ *function* (default: *none*) {#config-api-property-navigation-override}

Allows the destination of passage navigation to be overridden.  The callback is passed one parameter, the original destination passage title.  If its return value is falsy, the override is cancelled and navigation to the original destination continues unperturbed.  If its return value is truthy, the override succeeds and that value is used as the new destination of the navigation.

#### History:

* `v2.13.0`: Introduced.

#### Examples:

```
Config.navigation.override = function (destinationPassage) {
	/* code */
};
```

##### Based upon a story variable

```
// Force the player to the "You Died" passage if they let $health get too low.
Config.navigation.override = function (dest) {
	var sv = State.variables;

	// If $health is less-than-or-equal to 0, go to the "You Died" passage instead.
	if (sv.health <= 0) {
		return "You Died";
	}
};
```


<!-- ***************************************************************************
	Passages
**************************************************************************** -->
## Passages Settings {#config-api-passages}

<!-- *********************************************************************** -->

### `Config.passages.displayTitles` ↔ *boolean* (default: `false`) {#config-api-property-passages-displaytitles}

Determines whether passage titles are combined with the story title, within the browser's/tab's titlebar, when passages are displayed.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Config.passages.displayTitles = true;
```

<!-- *********************************************************************** -->

### `Config.passages.nobr` ↔ *boolean* (default: `false`) {#config-api-property-passages-nobr}

Determines whether rendering passages have their leading/trailing newlines removed and all remaining sequences of newlines replaced with single spaces before they're rendered.  Equivalent to including the [`nobr` special tag](#special-tag-nobr) on every passage.

<p role="note"><b>Note:</b>
Does not affect <code>script</code> or <code>stylesheet</code> tagged passages, for Twine&nbsp;1/Twee, or the Story JavaScript or Story Stylesheet sections, for Twine&nbsp;2.
</p>

#### History:

* `v2.19.0`: Introduced.

#### Examples:

```
Config.passages.nobr = true;
```

<!-- *********************************************************************** -->

### `Config.passages.onProcess` ↔ *function* (default: *none*) {#config-api-property-passages-onprocess}

Allows custom processing of passage text.  The function is invoked each time the [`<Passage>.processText()` method](#passage-api-prototype-method-processtext) is called.  It is passed an abbreviated version of the associated passage's [`Passage` instance](#passage-api)—containing only the `tags`, `text`, and `title` properties.  Its return value should be the post-processed text.

<p role="note"><b>Note:</b>
Does not affect <code>script</code> or <code>stylesheet</code> tagged passages, for Twine&nbsp;1/Twee, or the Story JavaScript or Story Stylesheet sections, for Twine&nbsp;2.
</p>

<p role="note"><b>Note:</b>
The function will be called just before the built-in no-break passage processing if you're also using that—see the <a href="#config-api-property-passages-nobr"><code>Config.passages.nobr</code> setting</a> and <a href="#special-tag-nobr"><code>nobr</code> special tag</a>.
</p>

#### History:

* `v2.30.0`: Introduced.

#### Examples:

```
/* Change instancess of "cat" to "dog". */
Config.passages.onProcess = function (p) {
	return p.text.replace(/\bcat(s?)\b/g, 'dog$1');
};
```

<!-- *********************************************************************** -->

### `Config.passages.start` ↔ *string* (Twine&nbsp;2 default: *user-selected*; Twine&nbsp;1/Twee default: `"Start"`) {#config-api-property-passages-start}

Sets the starting passage, the very first passage that will be displayed.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Config.passages.start = "That Other Starting Passage";
```

<!-- *********************************************************************** -->

### `Config.passages.transitionOut` ↔ *string* | *integer* (default: *none*) {#config-api-property-passages-transitionout}

Determines whether outgoing passage transitions are enabled.  Valid values are the name of the property being animated, which causes the outgoing passage element to be removed once that transition animation is complete, or an integer delay (in milliseconds), which causes the outgoing passage element to be removed once the delay has expired.  You will also need some CSS styles to make this work—examples given below.

<p role="note"><b>Note:</b>
If using an integer delay, ideally, it should probably be slightly longer than the outgoing transition delay that you intend to use—e.g., an additional 10ms or so should be sufficient.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Remove outgoing elements when their opacity animation ends
Config.passages.transitionOut = "opacity";

// Remove outgoing elements after 1010ms (1.01s)
Config.passages.transitionOut = 1010;
```

#### CSS styles:

At the very least you will need to specify a `.passage-out` style that defines the transition's end state.  For example:

```
.passage-out {
	opacity: 0;
}
```

That probably won't be very pleasing to the eye, however, so you will likely need several styles to make something that looks half-decent.  For example, the following will give you a basic crossfade:

```
#passages {
	position: relative;
}
.passage {
	left: 0;
	position: absolute;
	top: 0;
	transition: opacity 1s ease;
}
.passage-out {
	opacity: 0;
}
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.passages.descriptions` ↔ *boolean* | *object* | *function* (default: *none*)</span> {#config-api-property-passages-descriptions}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-descriptions"><code>Config.saves.descriptions</code></a> setting for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of the `Config.saves.descriptions` setting.



<!-- ***************************************************************************
	Saves
**************************************************************************** -->
## Saves Settings {#config-api-saves}

<!-- *********************************************************************** -->

### `Config.saves.autoload` ↔ *boolean* | *string* | *function* (default: *none*) {#config-api-property-saves-autoload}

Determines whether the autosave, if it exists, is automatically loaded upon story startup.  Valid values are boolean `true`, which simply causes the autosave to be loaded, the string `"prompt"`, which prompts the player via a dialog to load the autosave, or a function, which causes the autosave to be loaded if its return value is truthy.

<p role="note"><b>Note:</b>
If the autosave cannot be loaded, for any reason, then the start passage is loaded instead.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Automatically loads the autosave
Config.saves.autoload = true;

// Prompts the player about loading the autosave
Config.saves.autoload = "prompt";

// Loads the autosave if it returns a truthy value
Config.saves.autoload = function () {
	/* code */
};
```

<!-- *********************************************************************** -->

### `Config.saves.descriptions` ↔ *function* (default: *none*) {#config-api-property-saves-descriptions}

Sets browser saves descriptions—by default an excerpt from the current passage is used.  The callback is passed one parameter, the type of save being attempted.  If its return value is falsy, the default description is used.  If its return value is truthy, the returned description is used.

#### History:

* `v2.37.0`: Introduced.

#### Examples:

```
// Uses passages' titles
Config.saves.descriptions = function (saveType) {
	return passage();
};
```

```
// Uses the description mapped by passages' titles
var saveDescriptions = {
	"passage_title_a" : "description text a…",
	"passage_title_b" : "description text b…",
	"passage_title_c" : "description text c…"
};
Config.saves.descriptions = function (saveType) {
	return saveDescriptions[passage()];
};
```

<!-- *********************************************************************** -->

### `Config.saves.id` ↔ *string* (default: *slugified story title*) {#config-api-property-saves-id}

Sets the story ID associated with saves.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Config.saves.id = "a-big-huge-story-part-1";
```

<!-- *********************************************************************** -->

### `Config.saves.isAllowed` ↔ *function* (default: *none*) {#config-api-property-saves-isallowed}

Determines whether saving is allowed within the current context.  The callback is passed one parameter, the type of save being attempted.  If its return value is falsy, the save is disallowed.  If its return value is truthy, the save is allowed to continue unperturbed.

<p role="note" class="see"><b>See:</b>
<a href="#save-api-constant-type"><code>Save.Type</code> pseudo-enumeration</a> for more information on save types.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

##### Basic

```
// Allows saves on passages if it returns a truthy value
Config.saves.isAllowed = function (saveType) {
	/* code */
};
```

```
// Deny all saves on passages tagged wtih `menu`.
Config.saves.isAllowed = function (saveType) {
	return !tags().includes("menu");
};
```

##### Using the save type parameter

```
// Allow auto saves only on passages tagged wtih `bookmark` or `autosave`.
Config.saves.isAllowed = function (saveType) {
	if (saveType === Save.Type.Auto) {
		return tags().includesAny("bookmark", "autosave");
	}
};
```

<!-- *********************************************************************** -->

### `Config.saves.maxAutoSaves` *integer* (default: `1`) {#config-api-property-saves-maxautosaves}

Sets the maximum number of available auto saves.

#### History:

* `v2.37.0`: Introduced.

#### Examples:

```
Config.saves.maxAutoSaves = 3;
```

<!-- *********************************************************************** -->

### `Config.saves.maxSlotSaves` *integer* (default: `8`) {#config-api-property-saves-maxslotsaves}

Sets the maximum number of available slot saves.

#### History:

* `v2.37.0`: Introduced.

#### Examples:

```
Config.saves.maxSlotSaves = 4;
```

<!-- *********************************************************************** -->

### `Config.saves.version` ↔ *any* (default: *none*) {#config-api-property-saves-version}

Sets the `version` property of saves.

<p role="note"><b>Note:</b>
This setting is only used to set the <code>version</code> property of saves.  Thus, it is only truly useful if you plan to upgrade out-of-date saves via the <a href="#save-api-events"><code>Save</code> Events API</a>—specifically the <a href="#save-api-method-onload-add"><code>Save.onLoad.add()</code> static method</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// As an integer (recommended)
Config.saves.version = 3;

// As a string (not recommended)
Config.saves.version = "v3";
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.autosave` ↔ *boolean* | *Array&lt;string&gt;* | *function* (default: *none*)</span> {#config-api-property-saves-autosave}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-isallowed"><code>Config.saves.isAllowed</code></a> setting to replace its functionality.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.30.0`: Added function values and deprecated string values.
* `v2.37.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.onLoad` ↔ *function* (default: *none*)</span> {#config-api-property-saves-onload}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#save-api-method-onload-add"><code>Save.onLoad.add()</code></a> method for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.36.0`: Deprecated in favor of the [`Save` Events API](#save-api-events).

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.onSave` ↔ *function* (default: *none*)</span> {#config-api-property-saves-onsave}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#save-api-method-onsave-add"><code>Save.onSave.add()</code></a> method for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.33.0`: Added save operation details object parameter to the callback function.
* `v2.36.0`: Deprecated in favor of the [`Save` Events API](#save-api-events).

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.slots` *integer* (default: `8`)</span> {#config-api-property-saves-slots}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-maxslotsaves"><code>Config.saves.maxSlotSaves</code></a> setting for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of the `Config.saves.maxSlotSaves` setting.

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.tryDiskOnMobile` ↔ *boolean* (default: `true`)</span> {#config-api-property-saves-trydiskonmobile}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  Saving to disk on mobile devices is now unconditionally enabled.
</p>

#### History:

* `v2.34.0`: Introduced.
* `v2.37.0`: Deprecated.


<!-- ***************************************************************************
	UI
**************************************************************************** -->
## UI Settings {#config-api-ui}

<!-- *********************************************************************** -->

### `Config.ui.stowBarInitially` ↔ *boolean* | *integer* (default: `800`) {#config-api-property-ui-stowbarinitially}

Determines whether the UI bar (sidebar) starts in the stowed (shut) state initially.  Valid values are boolean `true`/`false`, which causes the UI bar to always/never start in the stowed state, or an integer, which causes the UI bar to start in the stowed state if the viewport width is less-than-or-equal-to the specified number of pixels.

#### History:

* `v2.11.0`: Introduced.

#### Examples:

```
// As a boolean; always start stowed
Config.ui.stowBarInitially = true;

// As a boolean; never start stowed
Config.ui.stowBarInitially = false;

// As an integer; start stowed if the viewport is 800px or less
Config.ui.stowBarInitially = 800;
```

<!-- *********************************************************************** -->

### `Config.ui.updateStoryElements` ↔ *boolean* (default: `true`) {#config-api-property-ui-updatestoryelements}

Determines whether certain elements within the UI bar are updated when passages are displayed.  The affected elements are the story: banner, subtitle, author, caption, and menu.

<p role="note"><b>Note:</b>
The story title is not included in updates because SugarCube uses it as the basis for the key used to store and load data used when playing the story and for saves.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// If you don't need those elements to update
Config.ui.updateStoryElements = false;
```


<!-- ***************************************************************************
	Miscellaneous
**************************************************************************** -->
## Miscellaneous Settings {#config-api-miscellaneous}

<!-- *********************************************************************** -->

### `Config.addVisitedLinkClass` ↔ *boolean* (default: `false`) {#config-api-property-addvisitedlinkclass}

Determines whether the `link-visited` class is added to internal passage links that go to previously visited passages—i.e., the passage already exists within the story history.

<p role="note"><b>Note:</b>
You <em>must</em> provide your own styling for the <code>link-visited</code> class as none is provided by default.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Config.addVisitedLinkClass = true;
```

#### CSS styles:

You will also need to specify a `.link-visited` style that defines the properties visited links should have. For example:

```
.link-visited {
	color: purple;
}
```

<!-- *********************************************************************** -->

### `Config.cleanupWikifierOutput` ↔ *boolean* (default: `false`) {#config-api-property-cleanupwikifieroutput}

Determines whether the output of the Wikifier is post-processed into more sane markup—i.e., where appropriate, it tries to transition the plethora of `<br>` elements into `<p>` elements.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Config.cleanupWikifierOutput = true;
```

<!-- *********************************************************************** -->

### `Config.debug` ↔ *boolean* (default: `false`) {#config-api-property-debug}

Indicates whether SugarCube is running in test mode, which enables debug views.  See the [*Test Mode* guide](#guide-test-mode) for more information.

<p role="note"><b>Note:</b>
This property is automatically set based on whether you're using a testing mode in a Twine compiler—i.e., <em>Test</em> mode in Twine&nbsp;2, <em>Test Play From Here</em> in Twine&nbsp;1, or the test mode option (<code>-t</code>, <code>--test</code>) in Tweego.  You may, however, forcibly enable it if you need to for some reason—e.g., if you're using another compiler, which doesn't offer a way to enable test mode.
</p>

#### History:

* `v2.2.0`: Introduced.

#### Examples:

```
// Forcibly enable test mode
Config.debug = true;

// Check if test mode is enabled in JavaScript
if (Config.debug) {
	/* do something debug related */
}

// Check if test mode is enabled via the <<if>> macro
<<if Config.debug>>
	/* do something debug related */
<</if>>
```

<!-- *********************************************************************** -->

### `Config.loadDelay` ↔ *integer* (default: `0`) {#config-api-property-loaddelay}

Sets the integer delay (in milliseconds) before the loading screen is dismissed, once the document has signaled its readiness.  Not generally necessary, however, some browsers render slower than others and may need a little extra time to get a media-heavy page done.  This allows you to fine tune for those cases.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Delay the dismissal of the loading screen by 2000ms (2s)
Config.loadDelay = 2000;
```
