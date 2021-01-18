<!-- ***********************************************************************************************
	State API
************************************************************************************************ -->
# `State` API {#state-api}

The story history contains moments (states) created during play.  Since it is possible to navigate the history—i.e., move backward and forward though the moments within the history—it may contain both past moments—i.e., moments that have been played—and future moments—i.e., moments that had been played, but have been rewound/undone, yet are still available to be restored.

In addition to the history, there is also the active moment—i.e., present—and expired moments—i.e., moments that had been played, but have expired from the history, thus cannot be navigated to.

API members dealing with the history work upon either the active moment—i.e., present—or one of the history subsets: the full in-play history—i.e., past + future—the past in-play subset—i.e., past only—or the extended past subset—i.e., expired + past.  These instances will be noted.

<!-- *********************************************************************** -->

### `State.active` → *object* {#state-api-getter-active}

Returns the active (present) moment.

<p role="note"><b>Note:</b>
Using <code>State.active</code> directly is generally unnecessary as there exist a number of shortcut properties, <a href="#state-api-getter-passage"><code>State.passage</code></a> and <a href="#state-api-getter-variables"><code>State.variables</code></a>, and story functions, <a href="#functions-function-passage"><code>passage()</code></a> and <a href="#functions-function-variables"><code>variables()</code></a>, which grant access to its normal properties.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
State.active.title      → The title of the present moment
State.active.variables  → The variables of the present moment
````

<!-- *********************************************************************** -->

### `State.bottom` → *object* {#state-api-getter-bottom}

Returns the bottommost (least recent) moment from the full in-play history (past + future).

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
State.bottom.title      → The title of the least recent moment within the full in-play history
State.bottom.variables  → The variables of the least recent moment within the full in-play history
```

<!-- *********************************************************************** -->

### `State.current` → *object* {#state-api-getter-current}

Returns the current moment from the full in-play history (past + future), which is the pre-play version of the active moment.

<p role="note" class="warning"><b>Warning:</b>
<code>State.current</code> <em>is not</em> a synonym for <a href="#state-api-getter-active"><code>State.active</code></a>.  You will, very likely, never need to use <code>State.current</code> directly within your code.
</p>

#### History:

* `v2.8.0`: Introduced.

#### Examples:

```
State.current.title      → The title of the current moment within the full in-play history
State.current.variables  → The variables of the current moment within the full in-play history
```

<!-- *********************************************************************** -->

### `State.length` → *integer* {#state-api-getter-length}

Returns the number of moments within the past in-play history (past only).

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
if (State.length === 0) {
	/* No moments within the past in-play history. Egad! */
}
```

<!-- *********************************************************************** -->

### `State.passage` → *string* {#state-api-getter-passage}

Returns the title of the passage associated with the active (present) moment.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
State.passage  → The passage title of the present moment
```

<!-- *********************************************************************** -->

### `State.size` → *integer* {#state-api-getter-size}

Returns the number of moments within the full in-play history (past + future).

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (State.size === 0) {
	/* No moments within the full in-play history. Egad! */
}
```

<!-- *********************************************************************** -->

### `State.temporary` → *object* {#state-api-getter-temporary}

Returns the current temporary variables.

#### History:

* `v2.13.0`: Introduced.

#### Examples:

```
State.temporary  → The current temporary variables
```

<!-- *********************************************************************** -->

### `State.top` → *object* {#state-api-getter-top}

Returns the topmost (most recent) moment from the full in-play history (past + future).

<p role="note" class="warning"><b>Warning:</b>
<code>State.top</code> <em>is not</em> a synonym for <a href="#state-api-getter-active"><code>State.active</code></a>.  You will, very likely, never need to use <code>State.top</code> directly within your code.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
State.top.title      → The title of the most recent moment within the full in-play history
State.top.variables  → The variables of the most recent moment within the full in-play history
```

<!-- *********************************************************************** -->

### `State.turns` → *integer* {#state-api-getter-turns}

Returns the total number (count) of played moments within the extended past history (expired + past).

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
if (State.turns === 1) {
	/* Initial turn.  The starting passage is displayed. */
}
```

<!-- *********************************************************************** -->

### `State.variables` → *object* {#state-api-getter-variables}

Returns the variables from the active (present) moment.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
State.variables  → The variables of the present moment
```

<!-- *********************************************************************** -->

### `State.getVar(varName)` → *any* {#state-api-method-getvar}

Returns the value of the story or temporary variable by the given name.

#### History:

* `v2.22.0`: Introduced.

#### Parameters:

* **`varName`:** (*string*) The name of the story or temporary variable, including its sigil—e.g., `$charName`.

#### Examples:

```
State.getVar("$charName")  → Returns the value of $charName
```

<!-- *********************************************************************** -->

### `State.has(passageTitle)` → *boolean* {#state-api-method-has}

Returns whether any moments with the given title exist within the past in-play history (past only).

<p role="note"><b>Note:</b>
<code>State.has()</code> <em>does not</em> check expired moments.  If you need to know if the player has ever been to a particular passage, then you <em>must</em> use the <a href="#state-api-method-hasplayed"><code>State.hasPlayed()</code></a> method or the <a href="#functions-function-hasvisited"><code>hasVisited()</code></a> story function.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`passageTitle`:** (*string*) The title of the moment whose existence will be verified.

#### Examples:

```
State.has("The Ducky")  → Returns whether a moment matching "The Ducky" exists
```

<!-- *********************************************************************** -->

### `State.hasPlayed(passageTitle)` → *boolean* {#state-api-method-hasplayed}

Returns whether any moments with the given title exist within the extended past history (expired + past).

<p role="note"><b>Note:</b>
If you need to check for multiple passages, the <a href="#functions-function-hasvisited"><code>hasVisited()</code></a> story function will likely be more convenient to use.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`passageTitle`:** (*string*) The title of the moment whose existence will be verified.

#### Examples:

```
State.hasPlayed("The Ducky")  → Returns whether a moment matching "The Ducky" ever existed
```

<!-- *********************************************************************** -->

### `State.index(index)` → *object* {#state-api-method-index}

Returns the moment, relative to the bottom of the past in-play history (past only), at the given index.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`index`:** (*integer*) The index of the moment to return.

#### Examples:

```
State.index(0)                 → Returns the least recent moment within the past in-play history
State.index(1)                 → Returns the second to least recent moment within the past in-play history
State.index(State.length - 1)  → Returns the most recent moment within the past in-play history
```

<!-- *********************************************************************** -->

### `State.isEmpty()` → *boolean* {#state-api-method-isempty}

Returns whether the full in-play history (past + future) is empty.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (State.isEmpty()) {
	/* No moments within the full in-play history. Egad! */
}
```

<!-- *********************************************************************** -->

### `State.peek([offset])` → *object* {#state-api-method-peek}

Returns the moment, relative to the top of the past in-play history (past only), at the, optional, offset.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`offset`:** (optional, *integer*) The offset, from the top of the past in-play history, of the moment to return.  If not given, an offset of `0` is used.

#### Examples:

```
State.peek()                  → Returns the most recent moment within the past in-play history
State.peek(0)                 → Returns the most recent moment within the past in-play history
State.peek(1)                 → Returns the second most recent moment within the past in-play history
State.peek(State.length - 1)  → Returns the least recent moment within the past in-play history
```

<!-- *********************************************************************** -->

### `State.metadata.size` → *integer* {#state-api-method-metadata-size}

Returns the size of the story metadata store—i.e., the number of stored pairs.

#### History:

* `v2.30.0`: Introduced.

#### Examples:

```
// Determines whether the metadata store has any members.
if (State.metadata.size > 0) {
	/* store is not empty */
}
```

<!-- *********************************************************************** -->

### `State.metadata.clear()` {#state-api-method-metadata-clear}

Empties the story metadata store.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
// Removes all values from the metadata store.
State.metadata.clear();
```

<!-- *********************************************************************** -->

### `State.metadata.delete(key)` {#state-api-method-metadata-delete}

Removes the specified key, and its associated value, from the story metadata store.

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key to delete.

#### Examples:

```
// Removes 'achievements' from the metadata store.
State.metadata.delete('achievements');
```

<!-- *********************************************************************** -->

### `State.metadata.get(key)` → *any* {#state-api-method-metadata-get}

Returns the value associated with the specified key from the story metadata store.

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key whose value should be returned.

#### Examples:

```
// Returns the value of 'achievements' from the metadata store.
var playerAchievements = State.metadata.get('achievements');
```

<!-- *********************************************************************** -->

### `State.metadata.has(key)` → *boolean* {#state-api-method-metadata-has}

Returns whether the specified key exists within the story metadata store.

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key whose existence should be tested.

#### Examples:

```
// Returns whether 'achievements' exists within the metadata store.
if (State.metadata.has('achievements')) {
	/* do something */
}
```

<!-- *********************************************************************** -->

### `State.metadata.set(key, value)` {#state-api-method-metadata-set}

Sets the specified key and value within the story metadata store, which causes them to persist over story and browser restarts—n.b. private browsing modes do interfere with this.  To update the value associated with a key, simply set it again.

<p role="note"><b>Note:</b>
The story metadata, like saves, is tied to the specific story it was generated with.  It is not a mechanism for moving data between stories.
</p>

<p role="note" class="warning"><b>Warning:</b>
The story metadata store <strong><em>is not</em></strong>, and should not be used as, a replacement for saves.  Examples of good uses: achievement tracking, new game+ data, playthrough statistics, etc.
</p>

<p role="note" class="warning"><b>Warning:</b>
This feature is largely incompatible with private browsing modes, which cause all in-browser storage mechanisms to either persist only for the lifetime of the browsing session or fail outright.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`key`:** (*string*) The key that should be set.
* **`value`:** (*any*) The value to set.

#### Examples:

```
// Sets 'achievements', with the given value, in the metadata store.
State.metadata.set('achievements', { ateYellowSnow : true });

// Sets 'ngplus', with the given value, in the metadata store.
State.metadata.set('ngplus', true);
```

<!-- *********************************************************************** -->

### `State.prng.init([seed [, useEntropy]])` {#state-api-method-prng-init}

Initializes the seedable pseudo-random number generator (PRNG) and integrates it into the story state and saves.  Once initialized, the [`State.random()`](#state-api-method-random) method and story functions, [`random()`](#functions-function-random) and [`randomFloat()`](#functions-function-randomfloat), return deterministic results from the seeded PRNG—by default, they return non-deterministic results from [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random).

<p role="note"><b>Note:</b>
<code>State.prng.init()</code> <em>must be</em> called during story initialization, within either your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage) or the <code>StoryInit</code> special passage.  Additionally, it is <strong><em>strongly</em></strong> recommended that you do not specify any arguments to <code>State.prng.init()</code> and allow it to automatically seed itself.  If you should chose to use an explicit seed, however, it is <strong><em>strongly</em></strong> recommended that you also enable additional entropy, otherwise all playthroughs for all players will be exactly the same.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters:

* **`seed`:** (optional, *string*) The explicit seed used to initialize the pseudo-random number generator.
* **`useEntropy`:** (optional, *boolean*) Enables the use of additional entropy to pad the specified explicit seed.

#### Examples:

```
State.prng.init()                       → Automatically seed the PRNG (recommended)
State.prng.init("aVeryLongSeed")        → Seed the PRNG with "aVeryLongSeed" (not recommended)
State.prng.init("aVeryLongSeed", true)  → Seed the PRNG with "aVeryLongSeed" and pad it with extra entropy
```

<!-- *********************************************************************** -->

### `State.prng.isEnabled()` → *boolean* {#state-api-method-prng-isenabled}

Returns whether the [seedable PRNG](#state-api-method-prng-init) has been enabled.

#### History:

* `v2.29.0`: Introduced.

#### Examples:

```
State.prng.isEnabled()  → Returns whether the seedable PRNG is enabled
```

<!-- *********************************************************************** -->

### `State.prng.pull` → *integer* | *NaN* {#state-api-getter-prng-pull}

Returns the current pull count—i.e., how many requests have been made—from the [seedable PRNG](#state-api-method-prng-init) or, if the PRNG is not enabled, `NaN`.

<p role="note"><b>Note:</b>
The pull count is automatically included within saves and sessions, so this is not especially useful outside of debugging purposes.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Examples:

```
State.prng.pull  → Returns the current PRNG pull count
```

<!-- *********************************************************************** -->

### `State.prng.seed` → *string* | *null* {#state-api-getter-prng-seed}

Returns the seed from the [seedable PRNG](#state-api-method-prng-init) or, if the PRNG is not enabled, `null`.

<p role="note"><b>Note:</b>
The seed is automatically included within saves and sessions, so this is not especially useful outside of debugging purposes.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Examples:

```
State.prng.seed  → Returns the PRNG seed
```

<!-- *********************************************************************** -->

### `State.random()` → *number* {#state-api-method-random}

Returns a pseudo-random decimal number (floating-point) in the range `0` (inclusive) up to, but not including, `1` (exclusive).

<p role="note"><b>Note:</b>
By default, it simply returns non-deterministic results from <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random"><code>Math.random()</code></a>, however, when the seedable PRNG has been enabled, via <a href="#state-api-method-prng-init"><code>State.prng.init()</code></a>, it returns deterministic results from the seeded PRNG instead.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
State.random()  → Returns a pseudo-random floating-point number in the range [0, 1)
```

<!-- *********************************************************************** -->

### `State.setVar(varName, value)` → *boolean* {#state-api-method-setvar}

Sets the value of the story or temporary variable by the given name.  Returns whether the operation was successful.

#### History:

* `v2.22.0`: Introduced.

#### Parameters:

* **`varName`:** (*string*) The name of the story or temporary variable, including its sigil—e.g., `$charName`.
* **`value`:** (*any*) The value to assign.

#### Examples:

```
State.setVar("$charName", "Jane Doe")  → Assigns the string "Jane Doe" to $charName
```

<!-- *********************************************************************** -->

### <span class="deprecated">`State.initPRNG([seed [, useEntropy]])`</span> {#state-api-method-initprng}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#state-api-method-prng-init"><code>State.prng.init()</code></a> method for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.29.0`: Deprecated in favor of `State.prng.init()`.
