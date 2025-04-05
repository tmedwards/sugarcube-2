<!-- ***********************************************************************************************
	Config API
************************************************************************************************ -->
# `Config` API {#config-api}

The `Config` object controls various aspects of SugarCube's behavior.

<p role="note"><b>Note:</b>
<code>Config</code> object settings should be placed within your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage).
</p>


<!-- ***************************************************************************
	General
**************************************************************************** -->
## General Settings<!-- legacy --><span id="config-api-miscellaneous"></span><!-- /legacy --> {#config-api-general}

<!-- *********************************************************************** -->

### `Config.addVisitedLinkClass` ↔ `boolean` (default: `false`) {#config-api-property-addvisitedlinkclass}

Determines whether the `link-visited` class is added to internal passage links that go to previously visited passages—i.e., the passage already exists within the story history.

<p role="note"><b>Note:</b>
You <em>must</em> provide your own styling for the <code>link-visited</code> class as none is provided by default.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `boolean` value signifying whether links to visited passages have the class added.

#### Examples:

```javascript
Config.addVisitedLinkClass = true;
```

#### CSS styles:

You will also need to specify a `.link-visited` style that defines the properties visited links should have. For example:

```css
.link-visited {
	color: purple;
}
```

<!-- *********************************************************************** -->

### `Config.cleanupWikifierOutput` ↔ `boolean` (default: `false`) {#config-api-property-cleanupwikifieroutput}

Determines whether the output of the Wikifier is post-processed into more sane markup—i.e., where appropriate, it tries to transition the plethora of `<br>` elements into `<p>` elements.

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `boolean` value signifying whether post-processing occurs.

#### Examples:

```javascript
Config.cleanupWikifierOutput = true;
```

<!-- *********************************************************************** -->

### `Config.debug` ↔ `boolean` (default: `false`) {#config-api-property-debug}

Indicates whether SugarCube is running in test mode, which enables debug views and various optional debugging errors and warnings.  See the [*Test Mode* guide](#guide-test-mode) for more information.

<p role="note"><b>Note:</b>
This setting is automatically set based on whether you're using a testing mode in a Twine compiler—i.e., <em>Test</em> mode in Twine&nbsp;2, <em>Test Play From Here</em> in Twine&nbsp;1, or the test mode option (<code>-t</code>, <code>--test</code>) in Tweego.  You may, however, forcibly enable it if you need to for some reason—e.g., if you're using another compiler, which doesn't offer a way to enable test mode.
</p>

<p role="note" class="see"><b>See Also:</b>
<a href="#config-api-property-enableoptionaldebugging"><code>Config.enableOptionalDebugging</code> setting</a>.
</p>

#### History:

* `v2.2.0`: Introduced.

#### Value:

A `boolean` value signifying whether SugarCube is running in test mode.

#### Examples:

##### Forcibly enabling test mode

```javascript
// Forcibly enable test mode.
Config.debug = true;
```

##### Check if test mode is enabled (in JavaScript)

```javascript
if (Config.debug) {
	// Do something debug related.
}
```

##### Check if test mode is enabled (in macros)

```
<<if Config.debug>>
	/* do something debug related */
<</if>>
```

<!-- *********************************************************************** -->

### `Config.enableOptionalDebugging` ↔ `boolean` (default: `false`) {#config-api-property-enableoptionaldebugging}

Determines whether various optional debugging errors and warnings are enabled outside of test mode.

<p role="note" class="see"><b>See Also:</b>
<a href="#config-api-property-debug"><code>Config.debug</code> setting</a>.
</p>

List of optional errors and warnings: *(not exhaustive)*

* [`<<if>>` macro](#macros-macro-if) assignment error.  If enabled, returns an error when the `=` assignment operator is used within its conditional—e.g., `<<if $suspect = "Bob">>`.  Does not flag other assignment operators.

#### History:

* `v2.37.0`: Introduced.

#### Value:

A `boolean` value signifying whether optional debugging errors and warnings are enabled.

#### Examples:

```javascript
Config.enableOptionalDebugging = true;
```

<!-- *********************************************************************** -->

### `Config.loadDelay` ↔ *integer* `number` (default: `0`) {#config-api-property-loaddelay}

Sets the integer delay (in milliseconds) before the loading screen is dismissed, once the document has signaled its readiness.  Not generally necessary, however, some browsers render slower than others and may need a little extra time to get a media-heavy page done.  This allows you to fine tune for those cases.

#### History:

* `v2.0.0`: Introduced.

#### Value:

An *integer* `number` value denoting the delay (in milliseconds) before the loading screen is dismissed.

#### Examples:

```javascript
// Delay the dismissal of the loading screen by 2000ms (2s)
Config.loadDelay = 2000;
```


<!-- ***************************************************************************
	Audio
**************************************************************************** -->
## Audio Settings {#config-api-audio}

<!-- *********************************************************************** -->

### `Config.audio.pauseOnFadeToZero` ↔ `boolean` (default: `true`) {#config-api-property-audio-pauseonfadetozero}

Determines whether the audio subsystem automatically pauses tracks that have been faded to `0` volume (silent).

#### History:

* `v2.28.0`: Introduced.

#### Value:

A `boolean` value signifying whether tracks that have faded to `0` are automatically paused.

#### Examples:

```javascript
Config.audio.pauseOnFadeToZero = false;
```

<!-- *********************************************************************** -->

### `Config.audio.preloadMetadata` ↔ `boolean` (default: `true`) {#config-api-property-audio-preloadmetadata}

Determines whether the audio subsystem attempts to preload track metadata—meaning information about the track (e.g., duration), not its audio frames.

<p role="note"><b>Note:</b>
It is unlikely that you will ever want to disable this setting.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Value:

A `boolean` value signifying whether track metadata is preloaded.

#### Examples:

```javascript
Config.audio.preloadMetadata = false;
```


<!-- ***************************************************************************
	History
**************************************************************************** -->
## History Settings {#config-api-history}

<!-- *********************************************************************** -->

### `Config.history.controls` ↔ `boolean` (default: `true`) {#config-api-property-history-controls}

Determines whether the story's history controls (Backward, Jump To, & Forward buttons) are enabled within the UI bar.

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `boolean` value signifying whether the story history controls are enabled.

#### Examples:

```javascript
Config.history.controls = false;
```

<!-- *********************************************************************** -->

### `Config.history.maxStates` ↔ *integer* `number` (default: `40`) {#config-api-property-history-maxstates}

Sets the maximum number of states (moments) to which the history is allowed to grow.  Should the history exceed the limit, states will be dropped from the past (oldest first).

<p role="note" class="tip"><b>Tip:</b>
For game-oriented projects, as opposed to more story-oriented interactive fiction, a setting of <code>1</code> is <strong><em>strongly recommended</em></strong>.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.36.0`: Reduced the default to `40`.

#### Value:

An *integer* `number` value denoting how many moments are allowed within the history.

#### Examples:

```javascript
// Limit the history to a single moment (recommended for games)
Config.history.maxStates = 1;

// Limit the history to 25 moments
Config.history.maxStates = 25;
```


<!-- ***************************************************************************
	Macros
**************************************************************************** -->
## Macros Settings {#config-api-macros}

<!-- *********************************************************************** -->

### `Config.macros.maxLoopIterations` ↔ *integer* `number` (default: `1000`) {#config-api-property-macros-maxloopiterations}

Sets the maximum number of iterations allowed before the [`<<for>>` macro](#macros-macro-for) conditional forms are terminated with an error.

<p role="note"><b>Note:</b>
This setting exists to prevent a misconfigured loop from making the browser unresponsive.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Value:

An *integer* `number` value denoting the total allowed number of conditional form loop iteration (per instance).

#### Examples:

```javascript
// Allow only 5000 iterations
Config.macros.maxLoopIterations = 5000;
```

<!-- *********************************************************************** -->

### `Config.macros.typeSkipKey` ↔ `string` (default: `" "`, space) {#config-api-property-macros-typeskipkey}

Sets the default [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value that causes the currently running [`<<type>>` macro](#macros-macro-type) instance to finish typing its content immediately.

#### History:

* `v2.33.1`: Introduced.

#### Value:

A `string` value denoting the keyboard key that causes `<<type>>` to immediately finish typing.

#### Examples:

```javascript
// Change the default skip key to Control (CTRL)
Config.macros.typeSkipKey = 'Control';
```

<!-- *********************************************************************** -->

### `Config.macros.typeVisitedPassages` ↔ `boolean` (default: `true`) {#config-api-property-macros-typevisitedpassages}

Determines whether the [`<<type>>` macro](#macros-macro-type) types out content on previously visited passages or simply outputs it immediately.

#### History:

* `v2.32.0`: Introduced.

#### Value:

A `boolean` value signifying whether `<<type>>` types out previously visited passages.

#### Examples:

```javascript
// Do not type on previously visited passages
Config.macros.typeVisitedPassages = false;
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.macros.ifAssignmentError` ↔ `boolean` (default: `true`)</span> {#config-api-property-macros-ifassignmenterror}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-enableoptionaldebugging"><code>Config.enableOptionalDebugging</code></a> setting for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of the `Config.enableOptionalDebugging` setting.


<!-- ***************************************************************************
	Navigation
**************************************************************************** -->
## Navigation Settings {#config-api-navigation}

<!-- *********************************************************************** -->

### `Config.navigation.override` ↔ `Function` (default: *none*) {#config-api-property-navigation-override}

Allows the destination of passage navigation to be overridden.  The callback is passed one parameter, the original destination passage name.  If its return value is falsy, the override is cancelled and navigation to the original destination continues unperturbed.  If its return value is truthy, the override succeeds and that value is used as the new destination of the navigation.

#### History:

* `v2.13.0`: Introduced.

#### Value:

The callback value (`Function`).

#### Callback parameters:

* **`destinationPassage`:** (`string`) The original destination passage name.

#### Examples:

##### Basic usage

```javascript
Config.navigation.override = (destinationPassage) => {
	/* code that returns a passage name or a falsy value */
};
```

##### Based upon a story variable

```javascript
Config.navigation.override = (destinationPassage) => {
	var sv = State.variables;

	// If $health is less-than-or-equal-to 0, go to the "You Died" passage instead.
	if (sv.health <= 0) {
		return 'You Died';
	}
};
```


<!-- ***************************************************************************
	Passages
**************************************************************************** -->
## Passages Settings {#config-api-passages}

<!-- *********************************************************************** -->

### `Config.passages.displayTitles` ↔ `boolean` (default: `false`) {#config-api-property-passages-displaytitles}

Determines whether the current passage name is combined with the story's name within the browser tab's title bar.

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `boolean` value signifying whether passage names are combined with the story's name within the title bar.

#### Examples:

```javascript
Config.passages.displayTitles = true;
```

<!-- *********************************************************************** -->

### `Config.passages.nobr` ↔ `boolean` (default: `false`) {#config-api-property-passages-nobr}

Determines whether rendering passages have their leading/trailing newlines removed and all remaining sequences of newlines replaced with single spaces before they're rendered.  Equivalent to including the [`nobr` special tag](#special-tag-nobr) on every passage.

<p role="note"><b>Note:</b>
Does not affect <code>script</code> or <code>stylesheet</code> tagged passages, for Twine&nbsp;1/Twee, or the Story JavaScript or Story Stylesheet sections, for Twine&nbsp;2.
</p>

#### History:

* `v2.19.0`: Introduced.

#### Value:

A `boolean` value signifying whether rendering passages have a global no-break enabled.

#### Examples:

```javascript
Config.passages.nobr = true;
```

<!-- *********************************************************************** -->

### `Config.passages.onProcess` ↔ `Function` (default: *none*) {#config-api-property-passages-onprocess}

Allows custom processing of passage text.  The function is invoked each time the [`<Passage>.processText()` method](#passage-api-prototype-method-processtext) is called.  It is passed an abbreviated version of the associated passage's [`Passage` instance](#passage-api)—containing only the `name`, `tags`, and `text` properties.  Its return value should be the post-processed text.

<p role="note"><b>Note:</b>
Does not affect <code>script</code> or <code>stylesheet</code> tagged passages, for Twine&nbsp;1/Twee, or the Story JavaScript or Story Stylesheet sections, for Twine&nbsp;2.
</p>

<div role="note"><b>Note:</b>
	<p>The function will be called just before the built-in no-break passage processing if you're also using that.</p>
	<p>See the <a href="#config-api-property-passages-nobr"><code>Config.passages.nobr</code> setting</a> and <a href="#special-tag-nobr"><code>nobr</code> special tag</a>.</p>
</div>

#### History:

* `v2.30.0`: Introduced.

#### Value:

A callback value (`Function`).

#### Callback parameters:

* **`passage`:** (`Object`) An abbreviated version of the associated passage's [`Passage` instance](#passage-api)—containing only the `name`, `tags`, and `text` properties.

#### Examples:

```javascript
// Change instances of "cat" to "dog" in passages
Config.passages.onProcess = (p) => p.text.replace(/\bcat(s?)\b/g, 'dog$1');
```


<!-- *********************************************************************** -->

### `Config.passages.start` ↔ `string` (Twine&nbsp;2 default: *user-selected*; Twine&nbsp;1/Twee default: `"Start"`) {#config-api-property-passages-start}

Sets the starting passage name, the very first passage that will be displayed.

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `string` value denoting the starting passage name.

#### Examples:

```javascript
Config.passages.start = 'That Other Starting Passage';
```

<!-- *********************************************************************** -->

### `Config.passages.transitionOut` ↔ `string` | *integer* `number` (default: *none*) {#config-api-property-passages-transitionout}

Determines whether outgoing passage transitions are enabled.  Valid values are the name of the property being animated, which causes the outgoing passage element to be removed once that transition animation is complete, or an integer delay (in milliseconds), which causes the outgoing passage element to be removed once the delay has expired.  You will also need some CSS styles to make this work—examples given below.

<p role="note"><b>Note:</b>
If using an integer delay, ideally, it should probably be slightly longer than the outgoing transition delay that you intend to use—e.g., an additional 25ms or so should be sufficient.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `string` value denoting the CSS property being animated or an *integer* `number` value denoting the integer delay.

#### Examples:

```javascript
// Remove outgoing elements when their opacity animation ends
Config.passages.transitionOut = 'opacity';

// Remove outgoing elements after 1500ms (1.5s)
Config.passages.transitionOut = 1500;
```

#### CSS styles:

At the very least you will need to specify a `.passage-out` style that defines the transition's end state.  For example:

```css
.passage-out {
	opacity: 0;
}
```

That probably won't be very pleasing to the eye, however, so you will likely need several styles to make something that looks half-decent.  For example, the following will give you a basic crossfade:

```css
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

### <span class="deprecated">`Config.passages.descriptions` ↔ `boolean` | `Object` | `Function` (default: *none*)</span> {#config-api-property-passages-descriptions}

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

### `Config.saves.descriptions` ↔ `Function` (default: *none*) {#config-api-property-saves-descriptions}

Sets browser saves descriptions.  If unset, a brief description of the current turn is used.  If a callback function is assigned, it is passed one parameter, the type of save being attempted.  If its return value is truthy, the returned description is used, elsewise the default description is used.

<p role="note" class="see"><b>See:</b>
<a href="#save-api-constants-type"><code>Save.Type</code> pseudo-enumeration</a> for more information on save types.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Value:

A callback value (`Function`).

#### Callback parameters:

* **`saveType`:** (`Save.Type`) The [`Save.Type`](#save-api-constants-type) pseudo-enumeration.  Used to denote the type of save.

#### Examples:

##### Using passages' names

```javascript
Config.saves.descriptions = (saveType) => passage();
```

##### Using descriptions mapped by passages' names

```javascript
let saveDescriptions = {
	'passage_name_a' : 'description text a…',
	'passage_name_b' : 'description text b…',
	'passage_name_c' : 'description text c…'
};
Config.saves.descriptions = (saveType) => saveDescriptions[passage()];
```

##### Using the `saveType` parameter

```javascript
Config.saves.descriptions = (saveType) => {
	const base = `(${L10n.get('turn')} ${State.turns})`;

	switch (saveType) {
		case Save.Type.Auto:
			return `${base} A browser auto save…`;
		case Save.Type.Base64:
			return `${base} A base64 save…`;
		case Save.Type.Disk:
			return `${base} A local disk save…`;
		case Save.Type.Slot:
			return `${base} A browser slot save…`;
	}
};
```

<!-- *********************************************************************** -->

### `Config.saves.id` ↔ `string` (default: *slugified story name*) {#config-api-property-saves-id}

Sets the ID associated with saves.

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `string` value denoting the ID associated with saves.

#### Examples:

```javascript
Config.saves.id = 'a-big-huge-story-part-1';
```

<!-- *********************************************************************** -->

### `Config.saves.isAllowed` ↔ `Function` (default: *none*) {#config-api-property-saves-isallowed}

Determines whether saving is allowed within the current context.  If unset, saves are always allowed.  If a callback function is assigned, it is passed one parameter, the type of save being attempted.  If its return value is truthy, the save is allowed, elsewise it is disallowed.

<p role="note" class="see"><b>See:</b>
<a href="#save-api-constants-type"><code>Save.Type</code> pseudo-enumeration</a> for more information on save types.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Added save type parameter.

#### Value:

A callback value (`Function`).

#### Callback parameters:

* **`saveType`:** (`Save.Type`) The [`Save.Type`](#save-api-constants-type) pseudo-enumeration.  Used to denote the type of save.

#### Examples:

##### Basic usage

Allows saves on passages if it returns a truthy value.

```javascript
Config.saves.isAllowed = (saveType) => {
	/* code returning a boolean value */
};
```

Disallow saving on passages tagged with `menu`.

```javascript
Config.saves.isAllowed = (saveType) => !tags().includes('menu');
```

##### Using the `saveType` parameter

Attempt a new auto save only on passages tagged with `autosave`.  Other save types are not limited.

```javascript
Config.saves.isAllowed = (saveType) => {
	if (saveType === Save.Type.Auto) {
		return tags().includes('autosave');
	}

	return true;
};
```

Attempt a new auto save only on every eighth turn and limit all other save types to passages tagged with `cansave`.

```javascript
Config.saves.isAllowed = (saveType) => {
	if (saveType === Save.Type.Auto) {
		return turns() % 8 === 0;
	}

	return tags().includes('cansave');
};
```

Different logic for most save types.

<p role="note"><b>Note:</b>
For example purposes only, not really recommended.
</p>

```javascript
Config.saves.isAllowed = (saveType) => {
	switch (saveType) {
		case Save.Type.Auto:
			// Only every tenth turn
			return turns() % 10 === 0;

		case Save.Type.Disk:
		case Save.Type.Slot:
			// Only on passages tagged `cansave`
			return tags().includes('cansave');

		case Save.Type.Base64:
			// Always
			return true;
	}
};
```

<!-- *********************************************************************** -->

### `Config.saves.maxAutoSaves` ↔ *integer* `number` (default: `0`) {#config-api-property-saves-maxautosaves}

Sets the maximum number of available auto saves.  Using a value of `0` disables auto saves.

<p role="note"><b>Note:</b>
When enabled, an auto save is attempted each turn by default.  Thus, it is recommended that the <a href="#config-api-property-saves-isallowed"><code>Config.saves.isAllowed</code> setting</a> be used to limit the frequency.
</p>

<p role="note" class="warning"><b>Warning:</b>
As available browser-based storage is very limited, it is <strong><em>strongly recommended</em></strong> that the number of available saves not be set too high.  A range of <code>1</code>–<code>10</code> is suggested.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Value:

An *integer* `number` value denoting the maximum number of browser auto saves.

#### Examples:

```javascript
Config.saves.maxAutoSaves = 3;
```

<!-- *********************************************************************** -->

### `Config.saves.maxSlotSaves` ↔ *integer* `number` (default: `8`) {#config-api-property-saves-maxslotsaves}

Sets the maximum number of available slot saves.  Using a value of `0` disables slot saves.

<p role="note" class="warning"><b>Warning:</b>
As available browser-based storage is very limited, it is <strong><em>strongly recommended</em></strong> that the number of available saves not be set too high.  A range of <code>1</code>–<code>10</code> is suggested.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Value:

An *integer* `number` value denoting the maximum number of browser slot saves.

#### Examples:

```javascript
Config.saves.maxSlotSaves = 4;
```

<!-- *********************************************************************** -->

### `Config.saves.metadata` ↔ `Function` (default: *none*) {#config-api-property-saves-metadata}

Sets the `metadata` property of saves.  The callback is invoked each time a save is made.  It is passed the type of save being attempted.  Its return value should be an `Object` that will serve as the metadata of saves.

<p role="note" class="see"><b>See:</b>
<a href="#save-api-constants-type"><code>Save.Type</code> pseudo-enumeration</a> for more information on save types.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Value:

A callback value (`Function`).  The callback is passed one parameter, the type of save being attempted.  It should return an `Object` that will serve as the metadata of saves and that *must* be JSON-serializable.

#### Callback parameters:

* **`saveType`:** (`Save.Type`) The [`Save.Type`](#save-api-constants-type) pseudo-enumeration.  Used to denote the type of save.

#### Examples:

##### Basic usage

```javascript
Config.saves.metadata = (saveType) => {
	const sv = State.variables;

	return {
		party : sv.party, // e.g., ['Celes', 'Locke', 'Edward']
		gold  : sv.gold   // e.g., 2345
	};
};
```

```javascript
Config.saves.metadata = (saveType) => {
	const metadata = {
		gameVersion : 'Release 12: "Horny Toads Need Love Too" edition'
	};

	if (/* some logic */) {
		metadata.someProp = 'a value';
	}

	return metadata;
};
```

##### Using the `saveType` parameter

```javascript
Config.saves.isAllowed = (saveType) => {
	const metadata = {
		gameVersion : 'Release 2: Electric Boogaloo',
		inBrowser   : saveType === Save.Type.Auto || saveType === Save.Type.Slot
	};

	return metadata;
};
```

<!-- *********************************************************************** -->

### `Config.saves.version` ↔ `any` (default: *none*) {#config-api-property-saves-version}

Sets the `version` property of saves.

<p role="note"><b>Note:</b>
It is <strong><em>strongly recommended</em></strong> that you use an <em>integer</em> <code>number</code> for the version.
</p>

<p role="note"><b>Note:</b>
This setting is only used to set the <code>version</code> property of saves.  Thus, it is only truly useful if you plan to upgrade out-of-date saves via the <a href="#save-api-events"><code>Save</code> Events API</a>—specifically the <a href="#save-api-method-onload-add"><code>Save.onLoad.add()</code> static method</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Value:

An `any` value denoting the version of saves.

#### Examples:

```javascript
// As an integer (strongly recommended)
Config.saves.version = 3;

// As a string (strongly NOT recommended)
Config.saves.version = "v3";
Config.saves.version = "1.3.12";
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.autoload` ↔ `boolean` | `string` | `Function` (default: *none*)</span> {#config-api-property-saves-autoload}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  The default UI now includes a <i>Continue</i> button, which loads the latest save.  If disabling or replacing the default UI, see the <a href="#save-api-browser-method-continue"><code>Save.browser.continue()</code> method</a> to replicate the functionality.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.autosave` ↔ `boolean` | `Array<string>` | `Function` (default: *none*)</span> {#config-api-property-saves-autosave}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-maxautosaves"><code>Config.saves.maxAutoSaves</code></a> setting to set the number of available auto saves and the <a href="#config-api-property-saves-isallowed"><code>Config.saves.isAllowed</code></a> setting to control when new auto saves are created.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.30.0`: Added function values and deprecated string values.
* `v2.37.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.onLoad` ↔ `Function` (default: *none*)</span> {#config-api-property-saves-onload}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#save-api-onload-method-add"><code>Save.onLoad.add()</code></a> method for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.36.0`: Deprecated in favor of the [`Save` Events API](#save-api-events).

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.onSave` ↔ `Function` (default: *none*)</span> {#config-api-property-saves-onsave}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#save-api-onsave-method-add"><code>Save.onSave.add()</code></a> method for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.33.0`: Added save operation details object parameter to the callback function.
* `v2.36.0`: Deprecated in favor of the [`Save` Events API](#save-api-events).

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.slots` ↔ *integer* `number` (default: `8`)</span> {#config-api-property-saves-slots}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-maxslotsaves"><code>Config.saves.maxSlotSaves</code></a> setting for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of the `Config.saves.maxSlotSaves` setting.

<!-- *********************************************************************** -->

### <span class="deprecated">`Config.saves.tryDiskOnMobile` ↔ `boolean` (default: `true`)</span> {#config-api-property-saves-trydiskonmobile}

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

### `Config.ui.stowBarInitially` ↔ `boolean` | *integer* `number` (default: `800`) {#config-api-property-ui-stowbarinitially}

Determines whether the UI bar (sidebar) starts in the stowed (shut) state initially.  Valid values are boolean `true`/`false`, which causes the UI bar to always/never start in the stowed state, or an integer, which causes the UI bar to start in the stowed state if the viewport width is less-than-or-equal-to the specified number of pixels.

#### History:

* `v2.11.0`: Introduced.

#### Value:

A `boolean` value signifying whether the UI bar starts stowed initially or an *integer* `number` whose value denotes the width in pixels that the viewport has to be less-than-or-equal-to for the UI bar to start stowed initially.

#### Examples:

```javascript
// As a boolean; always start stowed
Config.ui.stowBarInitially = true;

// As a boolean; never start stowed
Config.ui.stowBarInitially = false;

// As an integer; start stowed if the viewport is 800px or less
Config.ui.stowBarInitially = 800;
```

<!-- *********************************************************************** -->

### `Config.ui.updateStoryElements` ↔ `boolean` (default: `true`) {#config-api-property-ui-updatestoryelements}

Determines whether certain elements within the UI bar are updated upon passage navigation.  The affected elements are (in order): `StoryDisplayTitle`, `StoryBanner`, `StorySubtitle`, `StoryAuthor`, `StoryCaption`, and `StoryMenu`.

<p role="note"><b>Note:</b>
The <code>StoryTitle</code> passage is not included in updates because SugarCube uses it as the basis for the key used to store and load data used when playing the story and for saves.  If you need a dynamic title, then that's the purpose of <code>StoryDisplayTitle</code>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Value:

A `boolean` value signifying whether certain UI bar elements are updated upon navigation.

#### Examples:

```javascript
// If you don't need those elements to update
Config.ui.updateStoryElements = false;
```
