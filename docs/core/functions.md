<!-- ***********************************************************************************************
	Functions
************************************************************************************************ -->
<h1 id="functions">Functions</h1>

<!-- *********************************************************************** -->

<span id="functions-function-clone"></span>
### `clone(original)` → *any*

Returns a deep copy of the given value.

**NOTE:** Only the primitives, generic objects, some JavaScript natives (specifically: `Array`, `Date`, `Map`, `RegExp`, and `Set`), and DOM node objects are supported by default.  Unsupported objects will need a `.clone()` method to be properly supported by the `cone()` function—when called on such an object, it will simply defer to the local method.

#### Since:

* `v2.0.0`

#### Parameters:

* **`original`:** (*any*) The object to value.

#### Example:

```
// Without clone(); given the generic object: $foo = { id : 1 }
<<set $bar to $foo>>
<<set $bar.id to 5>>
$foo.id  → Returns: 5
$bar.id  → Returns: 5

// With clone(); given the generic object: $foo = { id : 1 }
<<set $bar to clone($foo)>>
<<set $bar.id to 5>>
$foo.id  → Returns: 1
$bar.id  → Returns: 5
```

<!-- *********************************************************************** -->

<span id="functions-function-either"></span>
### `either(list…)` → *any*

Returns a random value from its given arguments.

#### Since:

* `v2.0.0`

#### Parameters:

* **`list`:** (*any*) The list of values to operate on.  May be any combination of singular values, actual arrays, or array-like objects.  All values will be concatenated into a single list for selection.  **NOTE:** Does not flatten nested arrays—if this is required, the [`<Array>.flatten()`](#methods-array-prototype-method-flatten) method may be used to flatten the nested arrays prior to passing them to `either()`.

#### Example:

```
// Using singular values
either("Blueberry", "Cherry", "Pecan")  → Returns a random pie from the whole list

// Using arrays; given: $pies = ["Blueberry", "Cherry", "Pecan"]
either($pies)  → Returns a random pie from the whole array

// Using singular values and arrays; given: $letters = ["A", "B"]
either($letters, "C", "D")  → Returns a random value from the whole list—i.e., "A", "B", "C", "D"

// Using multiple arrays; given: $letters = ["A", "B"] & $numerals = ["1", "2"]
either($letters, $numerals)  → Returns a random value from the whole list—i.e., "A", "B", "1", "2"
```

<!-- *********************************************************************** -->

<span id="functions-function-forget"></span>
### `forget(key)`

Removes the specified key, and its associated value, from the story metadata store.

#### Since:

* `v2.29.0`

#### Parameters:

* **`key`:** (*string*) The key to remove.

#### Example:

```
<<run forget('achievements')>>
```

<!-- *********************************************************************** -->

<span id="functions-function-hasvisited"></span>
### `hasVisited(passages…)` → *boolean*

Returns whether the passage with the given title occurred within the story history.  If multiple passage titles are given, returns the logical-AND aggregate of the set—i.e., `true` if all were found, `false` if any were not found.

#### Since:

* `v2.7.0`

#### Parameters:

* **`passages`:** (*string* | *string array*) The title(s) of the passage(s) to search for.  May be a list or an array of passages.

#### Example:

```
<<if hasVisited("Bar")>>…has been to the Bar…<</if>>
<<if not hasVisited("Bar")>>…has never been to the Bar…<</if>>
<<if hasVisited("Bar", "Café")>>…has been to both the Bar and Café<</if>>
<<if not hasVisited("Bar", "Café")>>…has never been to either the Bar, Café, or both…<</if>>
```

<!-- *********************************************************************** -->

<span id="functions-function-lastvisited"></span>
### `lastVisited(passages…)` → *integer*

Returns the number of turns that have passed since the last instance of the passage with the given title occurred within the story history or `-1` if it does not exist.  If multiple passage titles are given, returns the lowest count (which can be `-1`).

#### Since:

* `v2.0.0`

#### Parameters:

* **`passages`:** (*string* | *string array*) The title(s) of the passage(s) to search for.  May be a list or an array of passages.

#### Example:

```
<<if lastVisited("Bar") is -1>>…has never been to the Bar…<</if>>
<<if lastVisited("Bar") is 0>>…is currently in the Bar…<</if>>
<<if lastVisited("Bar") is 1>>…was in the Bar one turn ago…<</if>>
<<if lastVisited("Bar", "Café") is -1>>…has never been to the Bar, Café, or both…<</if>>
<<if lastVisited("Bar", "Café") is 2>>…has been to both the Bar and Café, most recently two turns ago…<</if>>
```

<!-- *********************************************************************** -->

<span id="functions-function-importscripts"></span>
### `importScripts(urls…)` → *`Promise` object*

Load and integrate external JavaScript scripts.

**NOTE:** Loading is done asynchronously at run time, so if the script must be available within a tight time frame, then you should use the `Promise` returned by the function to ensure the script is loaded before before it is needed.

**NOTE:** A script section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a `script`-tagged passage) is normally the best place to call `importScripts()`.

#### Since:

* `v2.16.0`

#### Parameters:

* **`urls`:** (*string* | *string array*) The URLs of the external scripts to import.  Loose URLs are imported concurrently, arrays of URLs are imported sequentially.

#### Example:

##### Basic usage

```
// Import all scripts concurrently
importScripts(
	"https://somesite/a/path/a.js",
	"https://somesite/a/path/b.js",
	"https://somesite/a/path/c.js",
	"https://somesite/a/path/d.js"
);

// Import all scripts sequentially
importScripts([
	"https://somesite/a/path/a.js",
	"https://somesite/a/path/b.js",
	"https://somesite/a/path/c.js",
	"https://somesite/a/path/d.js"
]);

// Import scripts a.js, b.js, and the c.js/d.js group concurrently,
// while importing c.js and d.js sequentially relative to each other
importScripts(
	"https://somesite/a/path/a.js",
	"https://somesite/a/path/b.js",
	[
		"https://somesite/a/path/c.js",
		"https://somesite/a/path/d.js"
	]
);
```

##### Basic usage with the returned `Promise` object

```
// Import a script while using the returned Promise to ensure that
// the script has been fully loaded before executing dependent code
importScripts("https://somesite/a/path/a.js")
	.then(function () {
		// Code that depends on the script goes here.
	})
	.catch(function (err) {
		// There was an error loading the script, log it to the console.
		console.log(err);
	});
```

##### Saving the returned `Promise` object for later use

```
// Import a script while saving the returned Promise so it may be used later
setup.aScriptImport = importScripts("https://somesite/a/path/aScript.js");

// Use the returned Promise later on to ensure that the script has been fully
// loaded before executing dependent code
setup.aScriptImport
	.then(function () {
		// Code that depends on the script goes here.
	})
	.catch(function (err) {
		// There was an error loading the script, log it to the console.
		console.log(err);
	});
```

<!-- *********************************************************************** -->

<span id="functions-function-importstyles"></span>
### `importStyles(urls…)` → *`Promise` object*

Load and integrate external CSS stylesheets.

**NOTE:** Loading is done asynchronously at run time, so if the stylesheet must be available within a tight time frame, then you should use the `Promise` returned by the function to ensure the stylesheet is loaded before it is needed.

**NOTE:** A script section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a `script`-tagged passage) is normally the best place to call `importStyles()`.

#### Since:

* `v2.16.0`

#### Parameters:

* **`urls`:** (*string* | *string array*) The URLs of the external stylesheets to import.  Loose URLs are imported concurrently, arrays of URLs are imported sequentially.

#### Example:

##### Basic usage

```
// Import all stylesheets concurrently
importStyles(
	"https://somesite/a/path/a.css",
	"https://somesite/a/path/b.css",
	"https://somesite/a/path/c.css",
	"https://somesite/a/path/d.css"
);

// Import all stylesheets sequentially
importStyles([
	"https://somesite/a/path/a.css",
	"https://somesite/a/path/b.css",
	"https://somesite/a/path/c.css",
	"https://somesite/a/path/d.css"
]);

// Import stylesheets a.css, b.css, and the c.css/d.css group concurrently,
// while importing c.css and d.css sequentially relative to each other
importStyles(
	"https://somesite/a/path/a.css",
	"https://somesite/a/path/b.css",
	[
		"https://somesite/a/path/c.css",
		"https://somesite/a/path/d.css"
	]
);
```

##### Basic usage with the returned `Promise` object

```
// Grab a loading screen lock
var lsLockId = LoadScreen.lock();

// Import a stylesheet while using the returned Promise to ensure that the
// stylesheet has been fully loaded before unlocking the loading screen
importStyles("https://somesite/a/path/a.css")
	.then(function () {
		// The stylesheet has been loaded, release the loading screen lock.
		LoadScreen.unlock(lsLockId);
	})
	.catch(function (err) {
		// There was an error loading the stylesheet, log it to the console.
		console.log(err);
	});
```

<!-- *********************************************************************** -->

<span id="functions-function-memorize"></span>
### `memorize(key, value)`

Sets the specified key and value within the story metadata store, which causes them to persist over story and browser restarts.  To update the value associated with a key, simply set it again.

**NOTE:** The story metadata, like saves, is tied to the specific story it was generated with.  It is not a mechanism for moving data between stories.

<p role="note" class="warning"><b>Warning:</b>
The story metadata store <strong><em>is not</em></strong>, and should not be used as, a replacement for saves.  Examples of good uses: achievement tracking, new game+ data, playthrough statistics, etc.
</p>

<p role="note" class="warning"><b>Warning:</b>
This feature is largely incompatible with private browsing modes, which cause all in-browser storage mechanisms to either persist only for the lifetime of the browsing session or fail outright.
</p>

#### Since:

* `v2.29.0`

#### Parameters:

* **`key`:** (*string*) The key that should be set.
* **`value`:** (*any*) The value to set.

#### Example:

```
// Sets 'achievements', with the given value, in the metadata store.
<<run memorize('achievements', { ateYellowSnow : true })>>

// Sets 'ngplus', with the given value, in the metadata store.
<<run memorize('ngplus', true)>>
```

<!-- *********************************************************************** -->

<span id="functions-function-passage"></span>
### `passage()` → *string*

Returns the title of the active (present) passage.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
<<if passage() is "Café">>…the current passage is the Café passage…<</if>>
```

<!-- *********************************************************************** -->

<span id="functions-function-previous"></span>
### `previous()` → *string*

Returns the title of the most recent previous passage whose title does not match that of the active passage or an empty string, if there is no such passage.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
<<if previous() is "Café">>…the most recent non-active passage is the Café passage…<</if>>

→ Commonly used as part of a link to return to the most recent non-active passage
[[Return|previous()]]
```

<!-- *********************************************************************** -->

<span id="functions-function-random"></span>
### `random([min ,] max)` → *integer*

Returns a pseudo-random whole number (integer) within the range of the given bounds (inclusive)—i.e., [min,&nbsp;max].

**NOTE:** By default, it uses [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) as its source of (non-deterministic) randomness, however, when the seedable PRNG has been enabled, via [`State.prng.init()`](#state-api-method-prng-init), it uses the (deterministic) seeded PRNG instead.

#### Since:

* `v2.0.0`

#### Parameters:

* **`min`:** (optional, *integer*) The lower bound of the random number (inclusive).  If omitted, will default to `0`.
* **`max`:** (*integer*) The upper bound of the random number (inclusive).

#### Example:

```
random(5)     → Returns a number in the range 0–5
random(1, 6)  → Returns a number in the range 1–6
```

<!-- *********************************************************************** -->

<span id="functions-function-randomfloat"></span>
### `randomFloat([min ,] max)` → *float*

Returns a pseudo-random decimal number (floating-point) within the range of the given bounds (inclusive for the minimum, exclusive for the maximum)—i.e., [min,&nbsp;max).

**NOTE:** By default, it uses [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) as its source of (non-deterministic) randomness, however, when the seedable PRNG has been enabled, via [`State.prng.init()`](#state-api-method-prng-init), it uses the (deterministic) seeded PRNG instead.

#### Since:

* `v2.0.0`

#### Parameters:

* **`min`:** (optional, *float*) The lower bound of the random number (inclusive).  If omitted, will default to `0.0`.
* **`max`:** (*float*) The upper bound of the random number (exclusive).

#### Example:

```
randomFloat(5.0)       → Returns a number in the range 0.0–4.9999999…
randomFloat(1.0, 6.0)  → Returns a number in the range 1.0–5.9999999…
```

<!-- *********************************************************************** -->

<span id="functions-function-recall"></span>
### `recall(key [, defaultValue])` → *any*

Returns the value associated with the specified key from the story metadata store or, if no such key exists, the specified default value, if any.

#### Since:

* `v2.29.0`

#### Parameters:

* **`key`:** (*string*) The key whose value should be returned.
* **`defaultValue`:** (optional, *any*) The value to return if the key doesn't exist.

#### Example:

```
// Set setup.achievements to the 'achievements' metadata or an empty generic object.
<<set setup.achievements to recall('achievements', {})>>

// Set setup.ngplus to the 'ngplus' metadata, with no default.
<<set setup.ngplus to recall('ngplus')>>
```

<!-- *********************************************************************** -->

<span id="functions-function-setpageelement"></span>
### `setPageElement(idOrElement , passages [, defaultText])` → *`HTMLElement` object* | *null*

Renders the selected passage into the target element, replacing any existing content, and returns the element.  If no passages are found and default text is specified, it will be used instead.

#### Since:

* `v2.0.0`

#### Parameters:

* **`idOrElement`:** (*string* | *`HTMLElement` object*) The ID of the element or the element itself.
* **`passages`:** (*string* | *string array*) The name(s) of the passage(s) to search for.  May be a single passage or an array of passages.  If an array of passage names is specified, the first passage to be found is used.
* **`defaultText`:** (optional, *string*) The default text to use if no passages are found.

#### Example:

**NOTE:** As it is highly unlikely that either an array of passage names or default text will be needed in the vast majority of cases, only a few basic examples will be given.

```
// Using an ID; given an existing element on the page: <div id="my-display"></div>
setPageElement("my-display", "MyPassage");

// Using an element; given a reference to an existing element: myElement
setPageElement(myElement, "MyPassage");
```

<!-- *********************************************************************** -->

<span id="functions-function-tags"></span>
### `tags([passages…])` → *string array*

Returns a new array consisting of all of the tags of the given passages.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passages`:** (optional, *string* | *string array*) The passages from which to collect tags.  May be a list or an array of passages.  If omitted, will default to the current passage.

#### Example:

```
<<if tags().includes("forest")>>…the current passage is part of the forest…<</if>>
<<if tags("Lonely Glade").includes("forest")>>…the Lonely Glade passage is part of the forest…<</if>>
```

<!-- *********************************************************************** -->

<span id="functions-function-temporary"></span>
### `temporary()` → *object*

Returns a reference to the current temporary variables store (equivalent to: [`State.temporary`](#state-api-getter-temporary)).  This is only really useful within pure JavaScript code, as within TwineScript you may simply access temporary variables natively.

#### Since:

* `v2.19.0`

#### Parameters: *none*

#### Example:

```
// Given: _selection is 'Zagnut Bar'
if (temporary().selection === 'Zagnut Bar') {
	/* Do something… */
}
```

<!-- *********************************************************************** -->

<span id="functions-function-time"></span>
### `time()` → *integer*

Returns the number of milliseconds that have passed since the current passage was rendered to the page.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
→ Links that vary based on the time
In the darkness, something wicked this way comes.  Quickly!  Do you \
<<link "try to run back into the light">>
	<<if time() lt 5000>>
		/% The player clicked the link in under 5s, so they escape %/
		<<goto "Well lit passageway">>
	<<else>>
		/% Else, they're eaten by a grue %/
		<<goto "Eaten by a grue">>
	<</if>>
<</link>> \
or [[stand your ground|Eaten by a grue]]?
```

<!-- *********************************************************************** -->

<span id="functions-function-turns"></span>
### `turns()` → *integer*

Returns the total number (count) of played turns currently in effect—i.e., the number of played moments up to the present moment; future (rewound/undone) moments are not included within the total.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
<<print "This is turn #" + turns()>>
```

<!-- *********************************************************************** -->

<span id="functions-function-variables"></span>
### `variables()` → *object*

Returns a reference to the active (present) story variables store (equivalent to: [`State.variables`](#state-api-getter-variables)).  This is only really useful within pure JavaScript code, as within TwineScript you may simply access story variables natively.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
// Given: $hasGoldenKey is true
if (variables().hasGoldenKey) {
	/* Do something… */
}
```

<!-- *********************************************************************** -->

<span id="functions-function-visited"></span>
### `visited([passages…])` → *integer*

Returns the number of times that the passage with the given title occurred within the story history.  If multiple passage titles are given, returns the lowest count.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passages`:** (optional, *string* | *string array*) The title(s) of the passage(s) to search for.  May be a list or an array of passages.  If omitted, will default to the current passage.

#### Example:

```
<<if visited() is 3>>…this is the third visit to the current passage…<</if>>
<<if visited("Bar")>>…has been to the Bar at least once…<</if>>
<<if visited("Café") is 1>>…has been to the Café exactly once…<</if>>
<<if visited("Bar", "Café") is 4>>…has been to both the Bar and Café at least four times…<</if>>
```

<!-- *********************************************************************** -->

<span id="functions-function-visitedtags"></span>
### `visitedTags(tags…)` → *integer*

Returns the number of passages within the story history that are tagged with all of the given tags.

#### Since:

* `v2.0.0`

#### Parameters:

* **`tags`:** (*string* | *string array*) The tags to search for.  May be a list or an array of tags.

#### Example:

```
<<if visitedTags("forest")>>…has been to some part of the forest at least once…<</if>>
<<if visitedTags("forest", "haunted") is 1>>…has been to the haunted part of the forest exactly once…<</if>>
<<if visitedTags("forest", "burned") is 3>>…has been to the burned part of the forest three times…<</if>>
```
