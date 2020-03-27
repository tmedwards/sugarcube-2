<!-- ***********************************************************************************************
	UI API
************************************************************************************************ -->
<h1 id="ui-api"><code>UI</code> API</h1>

<!-- *********************************************************************** -->

<span id="ui-api-method-alert"></span>
### `UI.alert(message [, options [, closeFn]])`

Opens the built-in alert dialog, displaying the given message to the player.

#### Since:

* `v2.0.0`

#### Parameters:

* **`message`:** (*string*) The message to display to the player.
* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.alert("You smell of elderberries!");
```

<!-- *********************************************************************** -->

<span id="ui-api-method-jumpto"></span>
### `UI.jumpto([options [, closeFn]])`

Opens the built-in jump to dialog, which is populated via the [`bookmark` tag](#special-tag-bookmark).

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.jumpto();
```

<!-- *********************************************************************** -->

<span id="ui-api-method-restart"></span>
### `UI.restart([options])`

Opens the built-in restart dialog, prompting the player to restart the story.

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.

#### Examples:

```
UI.restart();
```

<!-- *********************************************************************** -->

<span id="ui-api-method-saves"></span>
### `UI.saves([options [, closeFn]])`

Opens the built-in saves dialog.

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.saves();
```

<!-- *********************************************************************** -->

<span id="ui-api-method-settings"></span>
### `UI.settings([options [, closeFn]])`

Opens the built-in settings dialog, which is populated from the [`Setting` API](#setting-api).

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.settings();
```

<!-- *********************************************************************** -->

<span id="ui-api-method-share"></span>
### `UI.share([options [, closeFn]])`

Opens the built-in share dialog, which is populated from the [`StoryShare` passage](#special-passage-storyshare).

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.open()`](#dialog-api-method-open) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Examples:

```
UI.share();
```
