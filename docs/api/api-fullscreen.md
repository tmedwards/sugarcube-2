<!-- ***********************************************************************************************
	Fullscreen API
************************************************************************************************ -->
<h1 id="fullscreen-api"><code>Fullscreen</code> API</h1>

Provides access to browsers' fullscreen functionality.

<span id="fullscreen-api-backgrounds"></span>
#### Backgrounds

If you wish to use custom backgrounds, either simply colors or with images, then you should place them on the `body` element.  For example:

```
body {
	background: #111 fixed url("images/background.png") center / contain no-repeat;
}
```

<p role="note" class="warning"><b>Warning:</b>
It is <strong><em>strongly recommended</em></strong> that you do not place background properties on the <code>html</code> element in addition to the <code>body</code> element as this can cause background jitter in Internet Explorer when scrolling outside of fullscreen mode.
</p>

<p role="note" class="warning"><b>Warning:</b>
If setting a background image via the <code>background</code> shorthand property, then you should also specify a <code>background-color</code> value with it or include a separate <code>background-color</code> property after the <code>background</code> property.  The reason being is that the <code>background</code> property resets the background color, so if you do not set one either as one of its values or via a following <code>background-color</code> property, then the browser's default background color could show through if the background image does not cover the entire viewport or includes transparency.
</p>

<span id="fullscreen-api-limitations"></span>
#### Limitations

The <code>Fullscreen</code> API comes with some built-in limitations:

1. Fullscreen requests must be initiated by the player, generally via click/touch—i.e., the request must be made as a result of player interaction; e.g., activating a button/link/etc whose code makes the request.

<!-- *********************************************************************** -->

<span id="fullscreen-api-getter-element"></span>
### `Fullscreen.element` → *`HTMLElement` object* | *null*

Returns the current fullscreen element or, if fullscreen mode is not active, `null`.

#### Since:

* `v2.31.0`

#### Example:

```
Fullscreen.element  → The current fullscreen element
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-isenabled"></span>
### `Fullscreen.isEnabled()` → *boolean*

Returns whether fullscreen is both supported and enabled.

#### Since:

* `v2.31.0`

#### Parameters: *none*

#### Example:

```
Fullscreen.isEnabled()  → Whether fullscreen mode is available
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-isfullscreen"></span>
### `Fullscreen.isFullscreen()` → *boolean*

Returns whether fullscreen mode is currently active.

#### Since:

* `v2.31.0`

#### Parameters: *none*

#### Example:

```
Fullscreen.isFullscreen()  → Whether fullscreen mode is active
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-request"></span>
### `Fullscreen.request([options [, requestedEl]])` → *`Promise` object*

Request that the browser enter fullscreen mode.

<p role="note" class="see"><b>See:</b>
<a href="#fullscreen-api-backgrounds">Backgrounds</a> and <a href="#fullscreen-api-limitations">limitations</a>.
</p>

#### Since:

* `v2.31.0`

#### Parameters:

* **`options`:** (optional, *object*) The fullscreen options object.
* **`requestedEl`:** (optional, *`HTMLElement` object*) The element to enter fullscreen mode with.  If omitted, defaults to the entire page.

#### Options object:

A fullscreen options object should have some of the following properties:

* **`navigationUI`:** (*string*) Determines the fullscreen navigation UI preference.  Valid values are (default: `"auto"`):
	* `"auto"`: Indicates no preference.
	* `"hide"`: Request that the browser's navigation UI be hidden.  The full dimensions of the screen will be used to display the element.
	* `"show"`: Request that the browser's navigation UI be shown.  The screen dimensions allocated to the element will be clamped to leave room for the UI.

<p role="note"><b>Note:</b>
Browsers are not currently required to honor the <code>navigationUI</code> setting.
</p>

#### Example:

##### Basic usage (recommended)

```
/* Request to enter fullscreen mode. */
Fullscreen.request();
```

##### With options and a specified element

```
/* Request to enter fullscreen mode while showing its navigation UI and with the given element. */
Fullscreen.request({ navigationUI : "show" }, myElement);
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-exit"></span>
### `Fullscreen.exit()` → *`Promise` object*

Request that the browser exit fullscreen mode.

#### Since:

* `v2.31.0`

#### Parameters: *none*

#### Example:

```
/* Request to exit fullscreen mode. */
Fullscreen.exit();
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-toggle"></span>
### `Fullscreen.toggle([options [, requestedEl]])` → *`Promise` object*

Request that the browser toggle fullscreen mode—i.e., enter or exit as appropriate.

#### Since:

* `v2.31.0`

#### Parameters:

* **`options`:** (optional, *object*) The fullscreen options object.  See [`Fullscreen.request()`](#fullscreen-api-method-request) for more information.
* **`requestedEl`:** (optional, *`HTMLElement` object*) The element to toggle fullscreen mode with.  If omitted, defaults to the entire page.

#### Example:

##### Basic usage (recommended)

```
/* Request to toggle fullscreen mode. */
Fullscreen.toggle();
```

##### With options and a specified element

```
/* Request to toggle fullscreen mode while showing its navigation UI and with the given element. */
Fullscreen.toggle({ navigationUI : "show" }, myElement);
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-onchange"></span>
### `Fullscreen.onChange(handlerFn [, requestedEl])`

Attaches fullscreen change event handlers.

#### Since:

* `v2.31.0`

#### Parameters:

* **`handlerFn`:** (*function*) The function to invoke when fullscreen mode is changed.
* **`requestedEl`:** (optional, *`HTMLElement` object*) The element to attach the handler to.

#### Example:

##### Basic usage (recommended)

```
/* Attach a hander to listen for fullscreen change events. */
Fullscreen.onChange(function (ev) {
	/* Fullscreen mode changed, so do something. */
});
```

##### With a specified element

```
/* Attach a hander to the given element to listen for fullscreen change events. */
Fullscreen.onChange(function (ev) {
	/* Fullscreen mode changed on myElement, so do something. */
}, myElement);
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-offchange"></span>
### `Fullscreen.offChange([handlerFn [, requestedEl]])`

Removes fullscreen change event handlers.

#### Since:

* `v2.31.0`

#### Parameters:

* **`handlerFn`:** (optional, *function*) The function to remove.  If omitted, will remove all handler functions.
* **`requestedEl`:** (optional, *`HTMLElement` object*) The element to remove the handler(s) from.

#### Example:

##### Basic usage (recommended)

```
/* Remove all fullscreen change event handers. */
Fullscreen.offChange();
```

```
/* Remove the given fullscreen change event hander. */
/* NOTE: Requires that the original handler function was saved. */
Fullscreen.offChange(originalHandlerFn);
```

##### With a specified element

```
/* Remove all fullscreen change event handers from myElement. */
Fullscreen.offChange(null, myElement);
```

```
/* Remove the given fullscreen change event hander from myElement. */
/* NOTE: Requires that the original handler function was saved. */
Fullscreen.offChange(originalHandlerFn, myElement);
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-onerror"></span>
### `Fullscreen.onError(handlerFn [, requestedEl])`

Attaches fullscreen error event handlers.

#### Since:

* `v2.31.0`

#### Parameters:

* **`handlerFn`:** (*function*) The function to invoke when fullscreen mode encounters an error.
* **`requestedEl`:** (optional, *`HTMLElement` object*) The element to attach the handler to.

#### Example:

##### Basic usage (recommended)

```
/* Attach a hander to listen for fullscreen error events. */
Fullscreen.onError(function (ev) {
	/* Fullscreen mode changed, so do something. */
});
```

##### With a specified element

```
/* Attach a hander to the given element to listen for fullscreen error events. */
Fullscreen.onError(function (ev) {
	/* Fullscreen mode changed on myElement, so do something. */
}, myElement);
```

<!-- *********************************************************************** -->

<span id="fullscreen-api-method-offerror"></span>
### `Fullscreen.offError([handlerFn [, requestedEl]])`

Removes fullscreen error event handlers.

#### Since:

* `v2.31.0`

#### Parameters:

* **`handlerFn`:** (optional, *function*) The function to remove.  If omitted, will remove all handler functions.
* **`requestedEl`:** (optional, *`HTMLElement` object*) The element to remove the handler(s) from.

#### Example:

##### Basic usage (recommended)

```
/* Remove all fullscreen error event handers. */
Fullscreen.offError();
```

```
/* Remove the given fullscreen error event hander. */
/* NOTE: Requires that the original handler function was saved. */
Fullscreen.offError(originalHandlerFn);
```

##### With a specified element

```
/* Remove all fullscreen error event handers from myElement. */
Fullscreen.offError(null, myElement);
```

```
/* Remove the given fullscreen error event hander from myElement. */
/* NOTE: Requires that the original handler function was saved. */
Fullscreen.offError(originalHandlerFn, myElement);
```
