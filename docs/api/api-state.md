<!-- ***********************************************************************************************
	State API
************************************************************************************************ -->
<h1 id="state-api"><code>State</code> API</h1>

The story history contains moments (states) created during play.  Since it is possible to navigate the history—i.e. move backward and forward though the moments within the history—it may contain both past moments—i.e. moments that have been played—and future moments—i.e. moments that had been played, but have been rewound/undone, yet are still available to be restored.

In addition to the history, there is also the active moment—i.e. present—and expired moments—i.e. moments that had been played, but have expired from the history, thus cannot be navigated to.

API members dealing with the history work upon either the active moment—i.e. present—or one of the history subsets: the full in-play history—i.e. past + future—the past in-play subset—i.e. past only—or the extended past subset—i.e. expired + past.  These instances will be noted.

<!-- *********************************************************************** -->

<span id="state-api-getter-active"></span>
### `State.active` → *object*

Returns the active (present) moment.

**NOTE:** Using `State.active` directly is generally unnecessary as there exist a number of shortcut properties, [`State.passage`](#state-api-getter-passage) and [`State.variables`](#state-api-getter-variables), and story functions, [`passage()`](#functions-function-passage) and [`variables()`](#functions-function-variables), which grant access to its normal properties.

#### Since:

* `v2.0.0`

#### Example:

```
State.active.title      → The title of the present moment
State.active.variables  → The variables of the present moment
````

<!-- *********************************************************************** -->

<span id="state-api-getter-bottom"></span>
### `State.bottom` → *object*

Returns the bottommost (least recent) moment from the full in-play history (past + future).

#### Since:

* `v2.0.0`

#### Example:

```
State.bottom.title      → The title of the least recent moment within the full in-play history
State.bottom.variables  → The variables of the least recent moment within the full in-play history
```

<!-- *********************************************************************** -->

<span id="state-api-getter-current"></span>
### `State.current` → *object*

Returns the current moment from the full in-play history (past + future), which is the pre-play version of the active moment.

**WARNING:** `State.current` is *not* a synonym for [`State.active`](#state-api-getter-active).  You will, very likely, never need to use `State.current` directly within your code.

#### Since:

* `v2.8.0`

#### Example:

```
State.current.title      → The title of the current moment within the full in-play history
State.current.variables  → The variables of the current moment within the full in-play history
```

<!-- *********************************************************************** -->

<span id="state-api-getter-length"></span>
### `State.length` → *integer*

Returns the number of moments within the past in-play history (past only).

#### Since:

* `v2.0.0`

#### Example:

```
if (State.length === 0) {
	/* No moments within the past in-play history. Egad! */
}
```

<!-- *********************************************************************** -->

<span id="state-api-getter-passage"></span>
### `State.passage` → *string*

Returns the title of the passage associated with the active (present) moment.

#### Since:

* `v2.0.0`

#### Example:

```
State.passage  → The passage title of the present moment
```

<!-- *********************************************************************** -->

<span id="state-api-getter-temporary"></span>
### `State.temporary` → *object*

Returns the current temporary variables.

#### Since:

* `v2.13.0`

#### Example:

```
State.temporary  → The current temporary variables
```

<!-- *********************************************************************** -->

<span id="state-api-getter-size"></span>
### `State.size` → *integer*

Returns the number of moments within the full in-play history (past + future).

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
if (State.size === 0) {
	/* No moments within the full in-play history. Egad! */
}
```

<!-- *********************************************************************** -->

<span id="state-api-getter-top"></span>
### `State.top` → *object*

Returns the topmost (most recent) moment from the full in-play history (past + future).

**WARNING:** `State.top` is *not* a synonym for [`State.active`](#state-api-getter-active).  You will, very likely, never need to use `State.top` directly within your code.

#### Since:

* `v2.0.0`

#### Example:

```
State.top.title      → The title of the most recent moment within the full in-play history
State.top.variables  → The variables of the most recent moment within the full in-play history
```

<!-- *********************************************************************** -->

<span id="state-api-getter-turns"></span>
### `State.turns` → *integer*

Returns the total number (count) of played moments within the extended past history (expired + past).

#### Since:

* `v2.0.0`

#### Example:

```
if (State.turns === 1) {
	/* Initial turn.  The starting passage is displayed. */
}
```

<!-- *********************************************************************** -->

<span id="state-api-getter-variables"></span>
### `State.variables` → *object*

Returns the variables from the active (present) moment.

#### Since:

* `v2.0.0`

#### Example:

```
State.variables  → The variables of the present moment
```

<!-- *********************************************************************** -->

<span id="state-api-method-getvar"></span>
### `State.getVar(varName)` → *any*

Returns the value of the story or temporary variable by the given name.

#### Since:

* `v2.22.0`

#### Parameters:

* **`varName`:** (*string*) The name of the story or temporary variable, including its sigil—e.g., `$charName`.

#### Example:

```
State.getVar("$charName")  → Returns the value of $charName
```

<!-- *********************************************************************** -->

<span id="state-api-method-has"></span>
### `State.has(passageTitle)` → *boolean*

Returns whether any moments with the given title exist within the past in-play history (past only).

**NOTE:** `State.has()` *does not* check expired moments.  If you need to know if the player has ever been to a particular passage, then you must use the [`State.hasPlayed()`](#state-api-method-hasplayed) method or the [`hasVisited()`](#functions-function-hasvisited) story function.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passageTitle`:** (*string*) The title of the moment whose existence will be verified.

#### Example:

```
State.has("The Ducky")  → Returns whether a moment matching "The Ducky" exists
```

<!-- *********************************************************************** -->

<span id="state-api-method-hasplayed"></span>
### `State.hasPlayed(passageTitle)` → *boolean*

Returns whether any moments with the given title exist within the extended past history (expired + past).

**NOTE:** If you need to check for multiple passages, the [`hasVisited()`](#functions-function-hasvisited) story function will likely be more convenient to use.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passageTitle`:** (*string*) The title of the moment whose existence will be verified.

#### Example:

```
State.hasPlayed("The Ducky")  → Returns whether a moment matching "The Ducky" ever existed
```

<!-- *********************************************************************** -->

<span id="state-api-method-index"></span>
### `State.index(index)` → *object*

Returns the moment, relative to the bottom of the past in-play history (past only), at the given index.

#### Since:

* `v2.0.0`

#### Parameters:

* **`index`:** (*integer*) The index of the moment to return.

#### Example:

```
State.index(0)                 → Returns the least recent moment within the past in-play history
State.index(1)                 → Returns the second to least recent moment within the past in-play history
State.index(State.length - 1)  → Returns the most recent moment within the past in-play history
```

<!-- *********************************************************************** -->

<span id="state-api-method-isempty"></span>
### `State.isEmpty()` → *boolean*

Returns whether the full in-play history (past + future) is empty.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
if (State.isEmpty()) {
	/* No moments within the full in-play history. Egad! */
}
```

<!-- *********************************************************************** -->

<span id="state-api-method-peek"></span>
### `State.peek([offset])` → *object*

Returns the moment, relative to the top of the past in-play history (past only), at the, optional, offset.

#### Since:

* `v2.0.0`

#### Parameters:

* **`offset`:** (optional, *integer*) The offset, from the top of the past in-play history, of the moment to return.  If not given, an offset of `0` is used.

#### Example:

```
State.peek()                  → Returns the most recent moment within the past in-play history
State.peek(0)                 → Returns the most recent moment within the past in-play history
State.peek(1)                 → Returns the second most recent moment within the past in-play history
State.peek(State.length - 1)  → Returns the least recent moment within the past in-play history
```

<!-- *********************************************************************** -->

<span id="state-api-method-metadata-size"></span>
### `State.metadata.size` → *integer*

Returns the size of the story metadata store—i.e., the number of stored pairs.

#### Since:

* `v2.30.0`

#### Example:

```
// Determines whether the metadata store has any members.
if (State.metadata.size > 0) {
	/* store is not empty */
}
```

<!-- *********************************************************************** -->

<span id="state-api-method-metadata-clear"></span>
### `State.metadata.clear()`

Empties the story metadata store.

#### Since:

* `v2.29.0`

#### Parameters: *none*

#### Example:

```
// Removes all values from the metadata store.
State.metadata.clear();
```

<!-- *********************************************************************** -->

<span id="state-api-method-metadata-delete"></span>
### `State.metadata.delete(key)`

Removes the specified key, and its associated value, from the story metadata store.

#### Since:

* `v2.29.0`

#### Parameters:

* **`key`:** (*string*) The key to delete.

#### Example:

```
// Removes 'achievements' from the metadata store.
State.metadata.delete('achievements');
```

<!-- *********************************************************************** -->

<span id="state-api-method-metadata-get"></span>
### `State.metadata.get(key)` → *any*

Returns the value associated with the specified key from the story metadata store.

#### Since:

* `v2.29.0`

#### Parameters:

* **`key`:** (*string*) The key whose value should be returned.

#### Example:

```
// Returns the value of 'achievements' from the metadata store.
var playerAchievements = State.metadata.get('achievements');
```

<!-- *********************************************************************** -->

<span id="state-api-method-metadata-has"></span>
### `State.metadata.has(key)` → *boolean*

Returns whether the specified key exists within the story metadata store.

#### Since:

* `v2.29.0`

#### Parameters:

* **`key`:** (*string*) The key whose existence should be tested.

#### Example:

```
// Returns whether 'achievements' exists within the metadata store.
if (State.metadata.has('achievements')) {
	/* do something */
}
```

<!-- *********************************************************************** -->

<span id="state-api-method-metadata-set"></span>
### `State.metadata.set(key, value)`

Sets the specified key and value within the story metadata store, which causes them to persist over story and browser restarts—n.b. private browsing modes do interfere with this.  To update the value associated with a key, simply set it again.

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
State.metadata.set('achievements', { ateYellowSnow : true });

// Sets 'ngplus', with the given value, in the metadata store.
State.metadata.set('ngplus', true);
```

<!-- *********************************************************************** -->

<span id="state-api-method-prng-init"></span>
### `State.prng.init([seed [, useEntropy]])`

Initializes the seedable pseudo-random number generator (PRNG) and integrates it into the story state and saves.  Once initialized, the [`State.random()`](#state-api-method-random) method and story functions, [`random()`](#functions-function-random) and [`randomFloat()`](#functions-function-randomfloat), return deterministic results from the seeded PRNG—by default, they return non-deterministic results from [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random).

**NOTE:** `State.prng.init()` *must be* called during story initialization, within either a script section (Twine&nbsp;2: the Story JavaScript, Twine&nbsp;1/Twee: a `script`-tagged passage) or the `StoryInit` special passage.  Additionally, it is ***strongly*** recommended that you do not specify any arguments to `State.prng.init()` and allow it to automatically seed itself.  If you should chose to use an explicit seed, however, it is ***strongly*** recommended that you also enable additional entropy, otherwise all playthroughs for all players will be exactly the same.

#### Since:

* `v2.29.0`

#### Parameters:

* **`seed`:** (optional, *string*) The explicit seed used to initialize the pseudo-random number generator.
* **`useEntropy`:** (optional, *boolean*) Enables the use of additional entropy to pad the specified explicit seed.

#### Example:

```
State.prng.init()                       → Automatically seed the PRNG (recommended)
State.prng.init("aVeryLongSeed")        → Seed the PRNG with "aVeryLongSeed" (not recommended)
State.prng.init("aVeryLongSeed", true)  → Seed the PRNG with "aVeryLongSeed" and pad it with extra entropy
```

<!-- *********************************************************************** -->

<span id="state-api-method-prng-isenabled"></span>
### `State.prng.isEnabled()` → *boolean*

Returns whether the [seedable PRNG](#state-api-method-prng-init) has been enabled.

#### Since:

* `v2.29.0`

#### Example:

```
State.prng.isEnabled()  → Returns whether the seedable PRNG is enabled
```

<!-- *********************************************************************** -->

<span id="state-api-getter-prng-pull"></span>
### `State.prng.pull` → *integer* | *NaN*

Returns the current pull count—i.e. how many requests have been made—from the [seedable PRNG](#state-api-method-prng-init) or, if the PRNG is not enabled, `NaN`.

**NOTE:** The pull count is automatically included within saves and sessions, so this is not especially useful outside of debugging purposes.

#### Since:

* `v2.29.0`

#### Example:

```
State.prng.pull  → Returns the current PRNG pull count
```

<!-- *********************************************************************** -->

<span id="state-api-getter-prng-seed"></span>
### `State.prng.seed` → *string* | *null*

Returns the seed from the [seedable PRNG](#state-api-method-prng-init) or, if the PRNG is not enabled, `null`.

**NOTE:** The seed is automatically included within saves and sessions, so this is not especially useful outside of debugging purposes.

#### Since:

* `v2.29.0`

#### Example:

```
State.prng.seed  → Returns the PRNG seed
```

<!-- *********************************************************************** -->

<span id="state-api-method-random"></span>
### `State.random()` → *number*

Returns a pseudo-random decimal number (floating-point) in the range `0` (inclusive) up to, but not including, `1` (exclusive).

**NOTE:** By default, it simply returns non-deterministic results from [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random), however, when the seedable PRNG has been enabled, via [`State.prng.init()`](#state-api-method-prng-init), it returns deterministic results from the seeded PRNG instead.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
State.random()  → Returns a pseudo-random floating-point number in the range [0, 1)
```

<!-- *********************************************************************** -->

<span id="state-api-method-setvar"></span>
### `State.setVar(varName, value)` → *boolean*

Sets the value of the story or temporary variable by the given name.  Returns whether the operation was successful.

#### Since:

* `v2.22.0`

#### Parameters:

* **`varName`:** (*string*) The name of the story or temporary variable, including its sigil—e.g., `$charName`.
* **`value`:** (*any*) The value to assign.

#### Example:

```
State.setVar("$charName", "Jane Doe")  → Assigns the string "Jane Doe" to $charName
```

<!-- *********************************************************************** -->

<span id="state-api-method-initprng"></span>
### <span class="deprecated">`State.initPRNG([seed [, useEntropy]])`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#state-api-method-prng-init"><code>State.prng.init()</code></a> method for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.29.0`: Deprecated in favor of `State.prng.init()`.
