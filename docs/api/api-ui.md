<!-- ***********************************************************************************************
	UI API
************************************************************************************************ -->
# `UI` API {#ui-api}

<!-- *********************************************************************** -->

### `UI.alert(message [, options [, closeFn]])` {#ui-api-method-alert}

Opens the built-in alert dialog, displaying the given message to the player.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`message`:** (*string*) The message to display to the player.
* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Returns: *none*

#### Examples:

```js
UI.alert("You smell of elderberries!");
```

<!-- *********************************************************************** -->

### `UI.restart([options])` {#ui-api-method-restart}

Opens the built-in restart dialog, prompting the player to restart the story.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.

#### Returns: *none*

#### Examples:

```js
UI.restart();
```

<!-- *********************************************************************** -->

### `UI.saves([options [, closeFn]])` {#ui-api-method-saves}

Opens the built-in saves dialog.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Returns: *none*

#### Examples:

```js
UI.saves();
```

<!-- *********************************************************************** -->

### `UI.settings([options [, closeFn]])` {#ui-api-method-settings}

Opens the built-in settings dialog, which is populated from the [`Setting` API](#setting-api).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Returns: *none*

#### Examples:

```js
UI.settings();
```

<!-- *********************************************************************** -->

### `UI.update()` {#ui-api-method-update}

Triggers a [`:uiupdate` event](#events-system-event-uiupdate) that causes the update of the dynamically updated sections built-in user interface—e.g., those populated by code passages, like `StoryCaption` and `StoryMenu`.  Automatically invoked during passage navigation.

<div role="note" class="warning"><b>Warning:</b>
<p>As <em>all</em> dynamically updated sections of the built-in UI are updated, save for the main passage display, it is recommended that this method be used sparingly.</p>
<p>Ideally, if you need to update these sections of the built-in UI outside of the normal passage navigation update, then you should update only the specific areas you need to rather than the entire UI.</p>
</div>

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns: *none*

#### Examples:

```js
UI.update();
```

<!-- *********************************************************************** -->

### <span class="deprecated">`UI.jumpto([options [, closeFn]])`</span> {#ui-api-method-jumpto}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`UI.share([options [, closeFn]])`</span> {#ui-api-method-share}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated.
