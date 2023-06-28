<!-- ***********************************************************************************************
	Dialog API
************************************************************************************************ -->
# `Dialog` API {#dialog-api}

<!-- *********************************************************************** -->

### `Dialog.append(content)` → *`Dialog` object* {#dialog-api-method-append}

Appends the given content to the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

<p role="note"><b>Note:</b>
If your content contains any SugarCube markup, you'll need to use the <a href="#dialog-api-method-wiki"><code>Dialog.wiki()</code> method</a> instead.
</p>

#### History:

* `v2.9.0`: Introduced.

#### Parameters:

* **`content`:** (*Node* | *string*) The content to append.  As this method is essentially a shortcut for `jQuery(Dialog.body()).append(…)`, see [jQuery's `append()`](https://api.jquery.com/append/) method for the range of valid content types.

#### Examples:

```js
Dialog.append("Cry 'Havoc!', and let slip the <em>ponies</em> of <strong>friendship</strong>.");

Dialog.append( /* DOM nodes */ );
```

<!-- *********************************************************************** -->

### `Dialog.body()` → *`HTMLElement` object* {#dialog-api-method-body}

Returns a reference to the dialog's content area.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
jQuery(Dialog.body())
	.append("Cry 'Havoc!', and let slip the <em>ponies</em> of <strong>friendship</strong>.");

jQuery(Dialog.body())
	.wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
```

<!-- *********************************************************************** -->

### `Dialog.close()` → *`Dialog` object* {#dialog-api-method-close}

Closes the dialog.  Returns a reference to the `Dialog` object for chaining.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
Dialog.close();
```

<!-- *********************************************************************** -->

### `Dialog.create([title [, classNames]])` → *`Dialog` object* {#dialog-api-method-create}

Prepares the dialog for use.  Returns a reference to the `Dialog` object for chaining.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`title`:** (optional, *string*) The title of the dialog.
* **`classNames`:** (optional, *string*) The space-separated-list of classes to add to the dialog.

#### Examples:

##### Basic usage

```js
Dialog.create();
```

##### With a title

```js
Dialog.create("Character Sheet");
```

##### With a title and class

```js
Dialog.create("Character Sheet", "charsheet");
```

##### Making use of chaining

```js
Dialog
	.create("Character Sheet", "charsheet")
	.wikiPassage("Player Character")
	.open();
```

<!-- *********************************************************************** -->

### `Dialog.empty()` → *`HTMLElement` object* {#dialog-api-method-empty}

Empties the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Examples:

##### Basic usage

```js
Dialog.empty();
```

##### Replacing the open dialog's content

```js
Dialog
	.empty()
	.wikiPassage("Quests");
```

<!-- *********************************************************************** -->

### `Dialog.isOpen([classNames])` → *boolean* {#dialog-api-method-isopen}

Returns whether the dialog is currently open.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`classNames`:** (optional, *string*) The space-separated-list of classes to check for when determining the state of the dialog.  Each of the built-in dialogs contains a name-themed class that can be tested for in this manner—e.g., the Saves dialog contains the class `saves`.

#### Examples:

##### Basic usage

```js
if (Dialog.isOpen()) {
	/* code to execute if the dialog is open… */
}
```

##### While also checking if the `saves` class exists

```js
if (Dialog.isOpen("saves")) {
	/* code to execute if the Saves dialog is open… */
}
```

<!-- *********************************************************************** -->

### `Dialog.open([options [, closeFn]])` → *`Dialog` object* {#dialog-api-method-open}

Opens the dialog.  Returns a reference to the `Dialog` object for chaining.

<p role="note"><b>Note:</b>
Call this only after populating the dialog with content.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options to be used when opening the dialog.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Options object:

An options object should have some of the following properties:

* **`top`:** Top y-coordinate of the dialog (default: `50`; in pixels, but without the unit).

#### Examples:

```js
Dialog.open();
```

<!-- *********************************************************************** -->

### `Dialog.wiki(wikiMarkup)` → *`Dialog` object* {#dialog-api-method-wiki}

Renders the given [markup](#markup) and appends it to the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

<p role="note"><b>Note:</b>
If you simply want to render a passage, see the <a href="#dialog-api-method-wikipassage"><code>Dialog.wikiPassage()</code> method</a> instead.
</p>

<p role="note" class="warning"><b>Warning:</b>
If your content consists of DOM nodes, you'll need to use the <a href="#dialog-api-method-append"><code>Dialog.append()</code> method</a> instead.
</p>

#### History:

* `v2.9.0`: Introduced.

#### Parameters:

* **`wikiMarkup`:** (*string*) The markup to render.

#### Examples:

```js
Dialog.wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
```

<!-- *********************************************************************** -->

### `Dialog.wikiPassage(name)` → *`Dialog` object* {#dialog-api-method-wikipassage}

Renders the passage by the given name and appends it to the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) The name of the passage to render.

#### Examples:

```js
Dialog.wikiPassage("Inventory");
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Dialog.setup([title [, classNames]])` → *`HTMLElement` object*</span> {#dialog-api-method-setup}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `Dialog.create()`.
