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

* **`content`:** The content to append.  As this method is essentially a shortcut for `jQuery(Dialog.body()).append(…)`, see [jQuery's `append()`](https://api.jquery.com/append/) method for the range of valid content types.

#### Examples:

```
Dialog.append("Cry 'Havoc!', and let slip the <em>ponies</em> of <strong>friendship</strong>.");

Dialog.append( /* some DOM nodes */ );
```

<!-- *********************************************************************** -->

### `Dialog.body()` → *`HTMLElement` object* {#dialog-api-method-body}

Returns a reference to the dialog's content area.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
jQuery(Dialog.body()).append("Cry 'Havoc!', and let slip the <em>ponies</em> of <strong>friendship</strong>.");

jQuery(Dialog.body()).wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
```

<!-- *********************************************************************** -->

### `Dialog.close()` → *`Dialog` object* {#dialog-api-method-close}

Closes the dialog.  Returns a reference to the `Dialog` object for chaining.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Dialog.close();
```

<!-- *********************************************************************** -->

### `Dialog.isOpen([classNames])` → *boolean* {#dialog-api-method-isopen}

Returns whether the dialog is currently open.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`classNames`:** (optional, *string*) The space-separated-list of classes to check for when determining the state of the dialog.  Each of the built-in dialogs contains a name-themed class that can be tested for in this manner—e.g., the Saves dialog contains the class `saves`.

#### Examples:

```
if (Dialog.isOpen()) {
	/* code to execute if the dialog is open… */
}

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

```
Dialog.open();
```

<!-- *********************************************************************** -->

### `Dialog.setup([title [, classNames]])` → *`HTMLElement` object* {#dialog-api-method-setup}

Prepares the dialog for use and returns a reference to its content area.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`title`:** (optional, *string*) The title of the dialog.
* **`classNames`:** (optional, *string*) The space-separated-list of classes to add to the dialog.

#### Examples:

```
// Basic example.
Dialog.setup();
Dialog.wiki("Blah //blah// ''blah''.");
Dialog.open();

// Adding a title to the dialog.
Dialog.setup("Character Sheet");
Dialog.wiki(Story.get("PC Sheet").processText());
Dialog.open();

// Adding a title and class to the dialog.
Dialog.setup("Character Sheet", "charsheet");
Dialog.wiki(Story.get("PC Sheet").processText());
Dialog.open();
```

<!-- *********************************************************************** -->

### `Dialog.wiki(wikiMarkup)` → *`Dialog` object* {#dialog-api-method-wiki}

Renders the given [markup](#markup) and appends it to the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

<p role="note"><b>Note:</b>
If your content consists of DOM nodes, you'll need to use the <a href="#dialog-api-method-append"><code>Dialog.append()</code> method</a> instead.
</p>

#### History:

* `v2.9.0`: Introduced.

#### Parameters:

* **`wikiMarkup`:** The markup to render.

#### Examples:

```
Dialog.wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Dialog.addClickHandler(targets [, options [, startFn [, doneFn [, closeFn]]]])`</span> {#dialog-api-method-addclickhandler}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  The core of what it does is simply to wrap a call to <a href="#dialog-api-method-open"><code>Dialog.open()</code></a> within a call to <a href="#methods-jquery-prototype-method-ariaclick"><code>&lt;jQuery&gt;.ariaClick()</code></a>, which can be done directly and with greater flexibility.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.29.0`: Deprecated.
