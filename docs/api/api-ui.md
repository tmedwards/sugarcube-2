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

#### Examples:

```
UI.alert("You smell of elderberries!");
```

<!-- *********************************************************************** -->

### `UI.jumpto([options [, closeFn]])` {#ui-api-method-jumpto}

Opens the built-in jump to dialog, which is populated via the [`bookmark` tag](#special-tag-bookmark).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.jumpto();
```

<!-- *********************************************************************** -->

### `UI.restart([options])` {#ui-api-method-restart}

Opens the built-in restart dialog, prompting the player to restart the story.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.

#### Examples:

```
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

#### Examples:

```
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

#### Examples:

```
UI.settings();
```

<!-- *********************************************************************** -->

### `UI.share([options [, closeFn]])` {#ui-api-method-share}

Opens the built-in share dialog, which is populated from the [`StoryShare` passage](#special-passage-storyshare).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.share();
```
