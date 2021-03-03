<!-- ***********************************************************************************************
	Functions
************************************************************************************************ -->
# Functions {#functions}

<!-- *********************************************************************** -->

### `clone(original)` → *any* {#functions-function-clone}

Returns a deep copy of the given value.

<p role="note"><b>Note:</b>
Only the primitives, generic objects, some JavaScript natives (specifically: <code>Array</code>, <code>Date</code>, <code>Map</code>, <code>RegExp</code>, and <code>Set</code>), and DOM node objects are supported by default.  Unsupported object types, either native or custom, will need to implement <code>.clone()</code> method to be properly supported by the <code>clone()</code> function—when called on such an object, it will simply defer to the local method; see the <a href="#guide-tips-non-generic-object-types"><em>Non-generic object types (a.k.a. classes)</em> guide</a> for more information.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`original`:** (*any*) The object to value.

#### Examples:

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

### `either(list…)` → *any* {#functions-function-either}

Returns a random value from its given arguments.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`list`:** (*any*) The list of values to operate on.  May be any combination of singular values, actual arrays, or array-like objects.  All values will be concatenated into a single list for selection.  **NOTE:** Does not flatten nested arrays—if this is required, the [`<Array>.flat()`](#methods-array-prototype-method-flat) method may be used to flatten the nested arrays prior to passing them to `either()`.

#### Examples:

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

### `forget(key)` {#functions-function-forget}

Removes the specified key, and its associated value, from the story metadata store.

<p role="note" class="see"><b>See Also:</b>
<a href="#functions-function-memorize"><code>memorize()</code></a>, <a href="#functions-function-recall"><code>recall()</code></a>.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key to remove.

#### Examples:

```
<<run forget('achievements')>>
```

<!-- *********************************************************************** -->

### `hasVisited(passages…)` → *boolean* {#functions-function-hasvisited}

Returns whether the passage with the given title occurred within the story history.  If multiple passage titles are given, returns the logical-AND aggregate of the set—i.e., `true` if all were found, `false` if any were not found.

#### History:

* `v2.7.0`: Introduced.

#### Parameters:

* **`passages`:** (*string* | *string array*) The title(s) of the passage(s) to search for.  May be a list or an array of passages.

#### Examples:

```
<<if hasVisited("Bar")>>…has been to the Bar…<</if>>
<<if not hasVisited("Bar")>>…has never been to the Bar…<</if>>
<<if hasVisited("Bar", "Café")>>…has been to both the Bar and Café<</if>>
<<if not hasVisited("Bar", "Café")>>…has never been to either the Bar, Café, or both…<</if>>
```

<!-- *********************************************************************** -->

### `lastVisited(passages…)` → *integer* {#functions-function-lastvisited}

Returns the number of turns that have passed since the last instance of the passage with the given title occurred within the story history or `-1` if it does not exist.  If multiple passage titles are given, returns the lowest count (which can be `-1`).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`passages`:** (*string* | *string array*) The title(s) of the passage(s) to search for.  May be a list or an array of passages.

#### Examples:

```
<<if lastVisited("Bar") is -1>>…has never been to the Bar…<</if>>
<<if lastVisited("Bar") is 0>>…is currently in the Bar…<</if>>
<<if lastVisited("Bar") is 1>>…was in the Bar one turn ago…<</if>>
<<if lastVisited("Bar", "Café") is -1>>…has never been to the Bar, Café, or both…<</if>>
<<if lastVisited("Bar", "Café") is 2>>…has been to both the Bar and Café, most recently two turns ago…<</if>>
```

<!-- *********************************************************************** -->

### `importScripts(urls…)` → *`Promise` object* {#functions-function-importscripts}

Load and integrate external JavaScript scripts.

<p role="note"><b>Note:</b>
Loading is done asynchronously at run time, so if the script must be available within a tight time frame, then you should use the <code>Promise</code> returned by the function to ensure that the script is loaded before it is needed.
</p>

<p role="note"><b>Note:</b>
Your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage) is normally the best place to call <code>importScripts()</code>.
</p>

#### History:

* `v2.16.0`: Introduced.

#### Parameters:

* **`urls`:** (*string* | *string array*) The URLs of the external scripts to import.  Loose URLs are imported concurrently, arrays of URLs are imported sequentially.

#### Examples:

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

### `importStyles(urls…)` → *`Promise` object* {#functions-function-importstyles}

Load and integrate external CSS stylesheets.

<p role="note"><b>Note:</b>
Loading is done asynchronously at run time, so if the stylesheet must be available within a tight time frame, then you should use the <code>Promise</code> returned by the function to ensure that the stylesheet is loaded before it is needed.
</p>

<p role="note"><b>Note:</b>
Your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage) is normally the best place to call <code>importStyles()</code>.
</p>

#### History:

* `v2.16.0`: Introduced.

#### Parameters:

* **`urls`:** (*string* | *string array*) The URLs of the external stylesheets to import.  Loose URLs are imported concurrently, arrays of URLs are imported sequentially.

#### Examples:

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

### `memorize(key, value)` {#functions-function-memorize}

Sets the specified key and value within the story metadata store, which causes them to persist over story and browser restarts.  To update the value associated with a key, simply set it again.

<p role="note"><b>Note:</b>
The story metadata, like saves, is tied to the specific story it was generated with.  It is not a mechanism for moving data between stories.
</p>

<p role="note" class="warning"><b>Warning:</b>
The story metadata store <strong><em>is not</em></strong>, and should not be used as, a replacement for saves.  Examples of good uses: achievement tracking, new game+ data, playthrough statistics, etc.
</p>

<p role="note" class="warning"><b>Warning:</b>
This feature is largely incompatible with private browsing modes, which cause all in-browser storage mechanisms to either persist only for the lifetime of the browsing session or fail outright.
</p>

<p role="note" class="see"><b>See Also:</b>
<a href="#functions-function-forget"><code>forget()</code></a>, <a href="#functions-function-recall"><code>recall()</code></a>.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key that should be set.
* **`value`:** (*any*) The value to set.

#### Examples:

```
// Sets 'achievements', with the given value, in the metadata store.
<<run memorize('achievements', { ateYellowSnow : true })>>

// Sets 'ngplus', with the given value, in the metadata store.
<<run memorize('ngplus', true)>>
```

<!-- *********************************************************************** -->

### `passage()` → *string* {#functions-function-passage}

Returns the title of the active (present) passage.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
<<if passage() is "Café">>…the active passage is the Café passage…<</if>>
```

<!-- *********************************************************************** -->

### `previous()` → *string* {#functions-function-previous}

Returns the title of the most recent previous passage whose title does not match that of the active passage or an empty string, if there is no such passage.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
<<if previous() is "Café">>…the most recent non-active passage is the Café passage…<</if>>

→ Commonly used as part of a link to return to the most recent non-active passage
[[Return|previous()]]
```

<!-- *********************************************************************** -->

### `random([min ,] max)` → *integer* {#functions-function-random}

Returns a pseudo-random whole number (integer) within the range of the given bounds (inclusive)—i.e., [min,&nbsp;max].

<p role="note"><b>Note:</b>
By default, it uses <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random"><code>Math.random()</code></a> as its source of (non-deterministic) randomness, however, when the seedable PRNG has been enabled, via <a href="#state-api-method-prng-init"><code>State.prng.init()</code></a>, it uses that (deterministic) seeded PRNG instead.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`min`:** (optional, *integer*) The lower bound of the random number (inclusive).  If omitted, will default to `0`.
* **`max`:** (*integer*) The upper bound of the random number (inclusive).

#### Examples:

```
random(5)     → Returns a number in the range 0–5
random(1, 6)  → Returns a number in the range 1–6
```

<!-- *********************************************************************** -->

### `randomFloat([min ,] max)` → *float* {#functions-function-randomfloat}

Returns a pseudo-random decimal number (floating-point) within the range of the given bounds (inclusive for the minimum, exclusive for the maximum)—i.e., [min,&nbsp;max).

<p role="note"><b>Note:</b>
By default, it simply returns non-deterministic results from <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random"><code>Math.random()</code></a>, however, when the seedable PRNG has been enabled, via <a href="#state-api-method-prng-init"><code>State.prng.init()</code></a>, it returns deterministic results from the seeded PRNG instead.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`min`:** (optional, *float*) The lower bound of the random number (inclusive).  If omitted, will default to `0.0`.
* **`max`:** (*float*) The upper bound of the random number (exclusive).

#### Examples:

```
randomFloat(5.0)       → Returns a number in the range 0.0–4.9999999…
randomFloat(1.0, 6.0)  → Returns a number in the range 1.0–5.9999999…
```

<!-- *********************************************************************** -->

### `recall(key [, defaultValue])` → *any* {#functions-function-recall}

Returns the value associated with the specified key from the story metadata store or, if no such key exists, the specified default value, if any.

<p role="note" class="see"><b>See Also:</b>
<a href="#functions-function-forget"><code>forget()</code></a>, <a href="#functions-function-memorize"><code>memorize()</code></a>.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key whose value should be returned.
* **`defaultValue`:** (optional, *any*) The value to return if the key doesn't exist.

#### Examples:

```
// Set setup.achievements to the 'achievements' metadata or an empty generic object.
<<set setup.achievements to recall('achievements', {})>>

// Set setup.ngplus to the 'ngplus' metadata, with no default.
<<set setup.ngplus to recall('ngplus')>>
```

<!-- *********************************************************************** -->

### `setPageElement(idOrElement , passages [, defaultText])` → *`HTMLElement` object* | *null* {#functions-function-setpageelement}

Renders the selected passage into the target element, replacing any existing content, and returns the element.  If no passages are found and default text is specified, it will be used instead.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`idOrElement`:** (*string* | *`HTMLElement` object*) The ID of the element or the element itself.
* **`passages`:** (*string* | *string array*) The name(s) of the passage(s) to search for.  May be a single passage or an array of passages.  If an array of passage names is specified, the first passage to be found is used.
* **`defaultText`:** (optional, *string*) The default text to use if no passages are found.

#### Examples:

<p role="note"><b>Note:</b>
As it is highly unlikely that either an array of passage names or default text will be needed in the vast majority of cases, only a few basic examples will be given.
</p>

```
// Using an ID; given an existing element on the page: <div id="my-display"></div>
setPageElement("my-display", "MyPassage");

// Using an element; given a reference to an existing element: myElement
setPageElement(myElement, "MyPassage");
```

<!-- *********************************************************************** -->

### `tags([passages…])` → *string array* {#functions-function-tags}

Returns a new array consisting of all of the tags of the given passages.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`passages`:** (optional, *string* | *string array*) The passages from which to collect tags.  May be a list or an array of passages.  If omitted, will default to the active (present) passage—included passages do not count for this purpose; e.g., passages pulled in via `<<include>>`, `PassageHeader`, etc.

#### Examples:

```
<<if tags().includes("forest")>>…the active passage is part of the forest…<</if>>
<<if tags("Lonely Glade").includes("forest")>>…the Lonely Glade passage is part of the forest…<</if>>
```

<!-- *********************************************************************** -->

### `temporary()` → *object* {#functions-function-temporary}

Returns a reference to the current temporary variables store (equivalent to: [`State.temporary`](#state-api-getter-temporary)).  This is only really useful within pure JavaScript code, as within TwineScript you may simply access temporary variables natively.

#### History:

* `v2.19.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
// Given: _selection is 'Zagnut Bar'
if (temporary().selection === 'Zagnut Bar') {
	/* Do something… */
}
```

<!-- *********************************************************************** -->

### `time()` → *integer* {#functions-function-time}

Returns the number of milliseconds that have passed since the current passage was rendered to the page.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

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

### `turns()` → *integer* {#functions-function-turns}

Returns the total number (count) of played turns currently in effect—i.e., the number of played moments up to the present moment; future (rewound/undone) moments are not included within the total.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
<<print "This is turn #" + turns()>>
```

<!-- *********************************************************************** -->

### `variables()` → *object* {#functions-function-variables}

Returns a reference to the active (present) story variables store (equivalent to: [`State.variables`](#state-api-getter-variables)).  This is only really useful within pure JavaScript code, as within TwineScript you may simply access story variables natively.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
// Given: $hasGoldenKey is true
if (variables().hasGoldenKey) {
	/* Do something… */
}
```

<!-- *********************************************************************** -->

### `visited([passages…])` → *integer* {#functions-function-visited}

Returns the number of times that the passage with the given title occurred within the story history.  If multiple passage titles are given, returns the lowest count.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`passages`:** (optional, *string* | *string array*) The title(s) of the passage(s) to search for.  May be a list or an array of passages.  If omitted, will default to the current passage.

#### Examples:

```
<<if visited() is 3>>…this is the third visit to the current passage…<</if>>
<<if visited("Bar")>>…has been to the Bar at least once…<</if>>
<<if visited("Café") is 1>>…has been to the Café exactly once…<</if>>
<<if visited("Bar", "Café") is 4>>…has been to both the Bar and Café at least four times…<</if>>
```

<!-- *********************************************************************** -->

### `visitedTags(tags…)` → *integer* {#functions-function-visitedtags}

Returns the number of passages within the story history that are tagged with all of the given tags.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`tags`:** (*string* | *string array*) The tags to search for.  May be a list or an array of tags.

#### Examples:

```
<<if visitedTags("forest")>>…has been to some part of the forest at least once…<</if>>
<<if visitedTags("forest", "haunted") is 1>>…has been to the haunted part of the forest exactly once…<</if>>
<<if visitedTags("forest", "burned") is 3>>…has been to the burned part of the forest three times…<</if>>
```
