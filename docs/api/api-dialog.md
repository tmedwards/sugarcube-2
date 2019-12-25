<!-- ***********************************************************************************************
	Dialog API
************************************************************************************************ -->
<h1 id="dialog-api"><code>Dialog</code> API</h1>

<!-- *********************************************************************** -->

<span id="dialog-api-method-append"></span>
### `Dialog.append(content)` → *`Dialog` object*

Appends the given content to the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

**NOTE:** If your content contains any SugarCube markup, you'll need to use the [`Dialog.wiki()`](#dialog-api-method-wiki) method instead.

#### Since:

* `v2.9.0`

#### Parameters:

* **`content`:** The content to append.  As this method is essentially a shortcut for `jQuery(Dialog.body()).append(…)`, see [jQuery's `append()`](https://api.jquery.com/append/) method for the range of valid content types.

#### Example:

```
Dialog.append("Cry 'Havoc!', and let slip the <em>ponies</em> of <strong>friendship</strong>.");

Dialog.append( /* some DOM nodes */ );
```

<!-- *********************************************************************** -->

<span id="dialog-api-method-body"></span>
### `Dialog.body()` → *`HTMLElement` object*

Returns a reference to the dialog's content area.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
jQuery(Dialog.body()).append("Cry 'Havoc!', and let slip the <em>ponies</em> of <strong>friendship</strong>.");

jQuery(Dialog.body()).wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
```

<!-- *********************************************************************** -->

<span id="dialog-api-method-close"></span>
### `Dialog.close()` → *`Dialog` object*

Closes the dialog.  Returns a reference to the `Dialog` object for chaining.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
Dialog.close();
```

<!-- *********************************************************************** -->

<span id="dialog-api-method-isopen"></span>
### `Dialog.isOpen([classNames])` → *boolean*

Returns whether the dialog is currently open.

#### Since:

* `v2.0.0`

#### Parameters:

* **`classNames`:** (optional, *string*) The space-separated-list of classes to check for when determining the state of the dialog.  Each of the built-in dialogs contains a name-themed class that can be tested for in this manner—e.g., the Saves dialog contains the class `saves`.

#### Example:

```
if (Dialog.isOpen()) {
	/* code to execute if the dialog is open… */
}

if (Dialog.isOpen("saves")) {
	/* code to execute if the Saves dialog is open… */
}
```

<!-- *********************************************************************** -->

<span id="dialog-api-method-open"></span>
### `Dialog.open([options [, closeFn]])` → *`Dialog` object*

Opens the dialog.  Returns a reference to the `Dialog` object for chaining.

**NOTE:** Call this only after populating the dialog with content.

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *null* | *object*) The options object.  See [`Dialog.addClickHandler()`](#dialog-api-method-addclickhandler) for more information.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the dialog is closed.

#### Example:

```
Dialog.open();
```

<!-- *********************************************************************** -->

<span id="dialog-api-method-setup"></span>
### `Dialog.setup([title [, classNames]])` → *`HTMLElement` object*

Prepares the dialog for use and returns a reference to its content area.

#### Since:

* `v2.0.0`

#### Parameters:

* **`title`:** (optional, *string*) The title of the dialog.
* **`classNames`:** (optional, *string*) The space-separated-list of classes to add to the dialog.

#### Example:

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

<span id="dialog-api-method-wiki"></span>
### `Dialog.wiki(wikiMarkup)` → *`Dialog` object*

Renders the given [markup](#markup) and appends it to the dialog's content area.  Returns a reference to the `Dialog` object for chaining.

**NOTE:** If your content consists of DOM nodes, you'll need to use the [`Dialog.append()`](#dialog-api-method-append) method instead.

#### Since:

* `v2.9.0`

#### Parameters:

* **`wikiMarkup`:** The markup to render.

#### Example:

```
Dialog.wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
```

<!-- *********************************************************************** -->

<span id="dialog-api-event-dialogclosed"></span>
### `:dialogclosed` event

Global synthetic event triggered as the last step in closing the dialog when [`Dialog.close()`](#dialog-api-method-close) is called.

<p role="note" class="warning"><b>Warning:</b>
You cannot obtain data about the closing dialog from the dialog itself—e.g., title or classes—when using the <code>:dialogclosed</code> event, as the dialog has already closed and been reset by the time the event is fired.  If you need that kind of information from the dialog itself, then you may use the <a href="#dialog-api-event-dialogclosing"><code>:dialogclosing</code> event</a> instead.
</p>

#### Since:

* `v2.29.0`

#### Event object properties: *none*

**NOTE:** While there are no custom properties, the event is fired from the dialog's body, thus the `target` property will refer to its body element—i.e. `#ui-dialog-body`.

#### Example:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogclosed', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogclosed', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="dialog-api-event-dialogclosing"></span>
### `:dialogclosing` event

Global synthetic event triggered as the first step in closing the dialog when [`Dialog.close()`](#dialog-api-method-close) is called.

#### Since:

* `v2.29.0`

#### Event object properties: *none*

**NOTE:** While there are no custom properties, the event is fired from the dialog's body, thus the `target` property will refer to its body element—i.e. `#ui-dialog-body`.

#### Example:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogclosing', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogclosing', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="dialog-api-event-dialogopened"></span>
### `:dialogopened` event

Global synthetic event triggered as the last step in opening the dialog when [`Dialog.open()`](#dialog-api-method-open) is called.

#### Since:

* `v2.29.0`

#### Event object properties: *none*

**NOTE:** While there are no custom properties, the event is fired from the dialog's body, thus the `target` property will refer to its body element—i.e. `#ui-dialog-body`.

#### Example:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogopened', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogopened', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="dialog-api-event-dialogopening"></span>
### `:dialogopening` event

Global synthetic event triggered as the first step in opening the dialog when [`Dialog.open()`](#dialog-api-method-open) is called.

#### Since:

* `v2.29.0`

#### Event object properties: *none*

**NOTE:** While there are no custom properties, the event is fired from the dialog's body, thus the `target` property will refer to its body element—i.e. `#ui-dialog-body`.

#### Example:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogopening', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogopening', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="dialog-api-method-addclickhandler"></span>
### <span class="deprecated">`Dialog.addClickHandler(targets [, options [, startFn [, doneFn [, closeFn]]]])`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  The core of what it does is simply to wrap a call to <a href="#dialog-api-method-open"><code>Dialog.open()</code></a> within a call to <a href="#methods-jquery-prototype-method-ariaclick"><code>&lt;jQuery&gt;.ariaClick()</code></a>, which can be done directly and with greater flexibility.
</p>

Adds WAI-ARIA-compatible mouse/keyboard event handlers to the target element(s) that open the dialog when activated.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.29.0`: Deprecated.

#### Parameters:

* **`target`:** (*`HTMLElement` object* | *`jQuery` object* | *string*) The DOM element(s) to attach the handler to—may be either an `HTMLElement` object, a `jQuery` object, or a jQuery-style selector set.
* **`options`:** (optional, *null* | *object*) The options object; the currently understood properties are:
	* **`top`:** Top y-coordinate of the dialog (default: `50`; in pixels, but without the unit).
	* **`opacity`:** Opacity of the overlay (default: `0.8`).
* **`startFn`:** (optional, *null* | *function*) The function to execute at the start of `Dialog.addClickHandler()`.  This is commonly used to setup the dialog.
* **`doneFn`:** (optional, *null* | *function*) The function to execute at the end of `Dialog.addClickHandler()`.
* **`closeFn`:** (optional, *null* | *function*) The function to execute whenever the associated dialog is closed.

#### Example:

```
// Commonly used something like the following.
Dialog.addClickHandler("#some-element", null, function () {
	Dialog.setup("My Dialog Title", "my-dialog-class");
	Dialog.wiki(Story.get("MyDialogContents").processText());
});
```
