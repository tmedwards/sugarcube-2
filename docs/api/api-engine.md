<!-- ***********************************************************************************************
	Engine API
************************************************************************************************ -->
# `Engine` API {#engine-api}

<!-- ***************************************************************************
	Engine Constants
**************************************************************************** -->
## Constants {#engine-api-constants}

<!-- *********************************************************************** -->

### `Engine.State` {#engine-api-constants-state}

Engine state pseudo-enumeration.  Used to denote the state of the engine.

As passage navigation occurs the engine cycles through the states thusly: idle (start) → playing → rendering → playing → idle (end).

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Changed into a public API.

#### Values:

<table>
<thead>
	<tr>
		<th>State</th>
		<th>Description</th>
	</tr>
</thead>
<tbody>
	<tr>
		<th><code>Engine.State.Idle</code></th>
		<td>The engine is currently idle, awaiting the triggering of passage navigation.  This is the default state.</td>
	</tr>
	<tr>
		<th><code>Engine.State.Playing</code></th>
		<td>Passage navigation has been triggered and the engine is playing/processing a passage.</td>
	</tr>
	<tr>
		<th><code>Engine.State.Rendering</code></th>
		<td>The incoming passage is being rendered.  This takes place during and implies <code>Engine.State.Playing</code>.
</td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Engine Methods
**************************************************************************** -->
## Methods {#engine-api-methods}

<!-- *********************************************************************** -->

### `Engine.lastPlay` → `number` {#engine-api-getter-lastplay}

Returns a timestamp representing the last time `Engine.play()` was called.

#### History:

* `v2.0.0`: Introduced.

#### Value:

A timestamp (integer *number*) representing the last time `Engine.play()` was called.

#### Examples:

Recording the timestamp for later use.

```javascript
let lastPlay = Engine.lastPlay;
```

Using the timestamp to determine elapsed time.

```javascript
if ((now() - Engine.lastPlay) > 5000) {
	// 5000ms (5s) have elapsed since Engine.play() was last called
}
```

<!-- *********************************************************************** -->

### `Engine.state` → `Engine.State` {#engine-api-getter-state}

Returns the current state of the engine.

#### History:

* `v2.7.0`: Introduced.

#### Value:

An [`Engine.State`](#engine-api-constants-state) value.

#### Examples:

```javascript
// Returns the current state of the engine
Engine.state;
```

<!-- *********************************************************************** -->

### `Engine.backward()` → `boolean` {#engine-api-method-backward}

Moves backward one moment within the full history (past + future), if possible, activating and showing the moment moved to.  Returns whether the history navigation was successful (should only fail if already at the beginning of the full history).

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `boolean` value denoting whether the history navigation was successful.

#### Examples:

```javascript
// Rewinds the full history by one moment—i.e., undoes the moment
Engine.backward();
```

<!-- *********************************************************************** -->

### `Engine.forward()` → `boolean` {#engine-api-method-forward}

Moves forward one moment within the full history (past + future), if possible, activating and showing the moment moved to.  Returns whether the history navigation was successful (should only fail if already at the end of the full history).

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `boolean` value denoting whether the history navigation was successful.

#### Examples:

```javascript
// Forwards the full history by one moment—i.e., redoes the moment
Engine.forward();
```

<!-- *********************************************************************** -->

### `Engine.go(offset)` → `boolean` {#engine-api-method-go}

Activates the moment at the given offset from the active (present) moment within the full state history and show it.  Returns whether the history navigation was successful (should only fail if the offset from the active (present) moment is not within the bounds of the full history).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`offset`:** (*integer* `number`) The offset from the active (present) moment of the moment to go to.

#### Returns:

A `boolean` value denoting whether the history navigation was successful.

#### Examples:

```javascript
// Forwards the full history by two moments—i.e., redoes the moments
Engine.go(2);

// Rewinds the full history by four moments—i.e., undoes the moments
Engine.go(-4);
```

<!-- *********************************************************************** -->

### `Engine.goTo(index)` → `boolean` {#engine-api-method-goto}

Activates the moment at the given index within the full state history and show it.  Returns whether the history navigation was successful (should only fail if the index is not within the bounds of the full history).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`index`:** (*integer* `number`) The index of the moment to go to.

#### Returns:

A `boolean` value denoting whether the history navigation was successful.

#### Examples:

```javascript
// Goes to the first moment
Engine.goTo(0);

// Goes to the tenth moment
Engine.goTo(9);
```

<!-- *********************************************************************** -->

### `Engine.isIdle()` → `boolean` {#engine-api-method-isidle}

Returns whether the engine is idle.

#### History:

* `v2.16.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `boolean` value denoting whether the engine is idle.

#### Examples:

```javascript
if (Engine.isIdle()) {
	// do something while idle…
}
```

```javascript
if (!Engine.isIdle()) {
	// do something while not idle…
}
```

<!-- *********************************************************************** -->

### `Engine.isPlaying()` → `boolean` {#engine-api-method-isplaying}

Returns whether the engine is processing a turn—i.e., passage navigation has been triggered.

#### History:

* `v2.16.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `boolean` value denoting whether the engine is playing.

#### Examples:

```javascript
if (Engine.isPlaying()) {
	// do something while playing…
}
```

```javascript
if (!Engine.isPlaying()) {
	// do something while not playing…
}
```

<!-- *********************************************************************** -->

### `Engine.isRendering()` → `boolean` {#engine-api-method-isrendering}

Returns whether the engine is rendering the incoming passage.

#### History:

* `v2.16.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `boolean` value denoting whether the engine is rendering.

#### Examples:

```javascript
if (Engine.isRendering()) {
	// do something while rendering…
}
```

```javascript
if (!Engine.isRendering()) {
	// do something while not rendering…
}
```

<!-- *********************************************************************** -->

### `Engine.play(passageName [, noHistory])` → `HTMLElement` {#engine-api-method-play}

Renders and displays the passage referenced by the given name, optionally without adding a new moment to the history.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`passageName`:** (`string`) The name of the passage to play.
* **`noHistory`:** (optional, `boolean`) Disables the update of the history—i.e., no moment is added to the history.

#### Returns:

An `HTMLElement` value.

#### Examples:

```javascript
// Renders, displays, and adds a new moment to the history for the passage named "Foo" 
Engine.play('Foo');
```

```javascript
// Renders and displays, but does not add a moment to the history for the passage named "Foo"
Engine.play('Foo', true);
```

<!-- *********************************************************************** -->

### `Engine.restart()` {#engine-api-method-restart}

Causes the browser to immediately attempt to reload the window, thus restarting the story.

<p role="note" class="warning"><b>Warning:</b>
The player will <em>not</em> be prompted and all unsaved state will be lost.
</p>

<p role="note"><b>Note:</b>
In general, you should not call this method directly.  Instead, call the <a href="#ui-api-method-restart"><code>UI.restart()</code></a> static method, which prompts the player with an OK/Cancel dialog before itself calling <code>Engine.restart()</code>, if they accept.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns: *none*

#### Examples:

```javascript
Engine.restart();
```

<!-- *********************************************************************** -->

### `Engine.show()` → `HTMLElement` {#engine-api-method-show}

Renders and displays the active (present) moment's associated passage without adding a new moment to the history.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns:

An `HTMLElement` value.

#### Examples:

```javascript
// Renders and displays the present passage without adding a new moment to the history
Engine.show();
```
