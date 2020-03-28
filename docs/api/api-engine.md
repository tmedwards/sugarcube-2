<!-- ***********************************************************************************************
	Engine API
************************************************************************************************ -->
<h1 id="engine-api"><code>Engine</code> API</h1>

<!-- *********************************************************************** -->

<span id="engine-api-getter-lastplay"></span>
### `Engine.lastPlay` → *number*

Returns a timestamp representing the last time `Engine.play()` was called.

#### Since:

* `v2.0.0`

#### Examples:

```
Engine.lastPlay  → The timestamp at which Engine.play() was last called
```

<!-- *********************************************************************** -->

<span id="engine-api-getter-state"></span>
### `Engine.state` → *string*

Returns the current state of the engine (`"idle"`, `"playing"`, `"rendering"`).

#### Since:

* `v2.7.0`

#### States:

* **`"idle"`:** The engine is idle, awaiting the triggering of passage navigation—the default state.
* **`"playing"`:** Passage navigation has been triggered and a turn is being processed.
* **`"rendering"`:** The incoming passage is being rendered and added to the page—takes place during turn processing, so implies `"playing"`.

#### Examples:

```
Engine.state  → Returns the current state of the engine
```

<!-- *********************************************************************** -->

<span id="engine-api-method-backward"></span>
### `Engine.backward()` → *boolean*

Moves backward one moment within the full history (past + future), if possible, activating and showing the moment moved to.  Returns whether the history navigation was successful (should only fail if already at the beginning of the full history).

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Examples:

```
Engine.backward()  → Rewinds the full history by one moment—i.e., undoes the moment
```

<!-- *********************************************************************** -->

<span id="engine-api-method-forward"></span>
### `Engine.forward()` → *boolean*

Moves forward one moment within the full history (past + future), if possible, activating and showing the moment moved to.  Returns whether the history navigation was successful (should only fail if already at the end of the full history).

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Examples:

```
Engine.forward()  → Fast forwards the full history by one moment—i.e., redoes the moment
```

<!-- *********************************************************************** -->

<span id="engine-api-method-go"></span>
### `Engine.go(offset)` → *boolean*

Activates the moment at the given offset from the active (present) moment within the full state history and show it.  Returns whether the history navigation was successful (should only fail if the offset from the active (present) moment is not within the bounds of the full history).

#### Since:

* `v2.0.0`

#### Parameters:

* **`offset`:** (*integer*) The offset from the active (present) moment of the moment to go to.

#### Examples:

```
Engine.go(2)   → Fast forwards the full history by two moments—i.e., redoes the moments
Engine.go(-4)  → Rewinds the full history by four moments—i.e., undoes the moments
```

<!-- *********************************************************************** -->

<span id="engine-api-method-goto"></span>
### `Engine.goTo(index)` → *boolean*

Activates the moment at the given index within the full state history and show it.  Returns whether the history navigation was successful (should only fail if the index is not within the bounds of the full history).

#### Since:

* `v2.0.0`

#### Parameters:

* **`index`:** (*integer*) The index of the moment to go to.

#### Examples:

```
Engine.goTo(0)  → Goes to the first moment
Engine.goTo(9)  → Goes to the tenth moment
```

<!-- *********************************************************************** -->

<span id="engine-api-method-isidle"></span>
### `Engine.isIdle()` → *boolean*

Returns whether the engine is idle.

#### Since:

* `v2.16.0`

#### Parameters: *none*

#### Examples:

```
Engine.isIdle()  → Returns whether the engine is idle
```

<!-- *********************************************************************** -->

<span id="engine-api-method-isplaying"></span>
### `Engine.isPlaying()` → *boolean*

Returns whether the engine is processing a turn—i.e., passage navigation has been triggered.

#### Since:

* `v2.16.0`

#### Parameters: *none*

#### Examples:

```
Engine.isPlaying()  → Returns whether the engine is playing
```

<!-- *********************************************************************** -->

<span id="engine-api-method-isrendering"></span>
### `Engine.isRendering()` → *boolean*

Returns whether the engine is rendering the incoming passage.

#### Since:

* `v2.16.0`

#### Parameters: *none*

#### Examples:

```
Engine.isRendering()  → Returns whether the engine is rendering
```

<!-- *********************************************************************** -->

<span id="engine-api-method-play"></span>
### `Engine.play(passageTitle [, noHistory])` → *`HTMLElement` object*

Renders and displays the passage referenced by the given title, optionally without adding a new moment to the history.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passageTitle`:** (*string*) The title of the passage to play.
* **`noHistory`:** (optional, *boolean*) Disables the update of the history—i.e., no moment is added to the history.

#### Examples:

```
Engine.play("Foo")        → Renders, displays, and adds a moment for the passage "Foo" to the history
Engine.play("Foo", true)  → Renders and displays the passage "Foo", but does not add new history
```

<!-- *********************************************************************** -->

<span id="engine-api-method-restart"></span>
### `Engine.restart()`

Restarts the story.

<p role="note" class="warning"><b>Warning:</b>
The player will <em>not</em> be prompted and all unsaved state will be lost.
</p>

<p role="note"><b>Note:</b>
In general, you should not call this method directly.  Instead, call the <a href="#ui-api-method-restart"><code>UI.restart()</code></a> static method, which prompts the player with an OK/Cancel dialog before itself calling <code>Engine.restart()</code>, if they accept.
</p>

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Examples:

```
Engine.restart()  → Restarts the story
```

<!-- *********************************************************************** -->

<span id="engine-api-method-show"></span>
### `Engine.show()` → *`HTMLElement` object*

Renders and displays the active (present) moment's associated passage without adding a new moment to the history.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Examples:

```
Engine.show()  → Renders and displays the present passage without adding new history
```
