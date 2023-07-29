<!-- ***********************************************************************************************
	UIBar API
************************************************************************************************ -->
# `UIBar` API {#uibar-api}

<!-- *********************************************************************** -->

### `UIBar.destroy()` {#uibar-api-method-destroy}

Completely removes the UI bar and all of its associated styles and event handlers.

#### History:

* `v2.17.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
UIBar.destroy();
```

<!-- *********************************************************************** -->

### `UIBar.hide()` → *`UIBar` object* {#uibar-api-method-hide}

Hides the UI bar.  Returns a reference to the `UIBar` object for chaining.

<p role="note"><b>Note:</b>
This does not reclaim the space reserved for the UI bar.  Thus, a call to <a href="#uibar-api-method-stow"><code>UIBar.stow()</code></a> may also be necessary.  Alternatively, if you simply want the UI bar gone completely and permanently, either using <a href="#uibar-api-method-destroy"><code>UIBar.destroy()</code></a> or the <a href="#special-passage-storyinterface"><code>StoryInterface</code> special passage</a> may be a better choice.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

##### Basic usage

```js
UIBar.hide();
```

##### With stow

```js
UIBar.hide().stow();
```

<!-- *********************************************************************** -->

### `UIBar.isHidden()` → *boolean* {#uibar-api-method-ishidden}

Returns whether the UI bar is currently hidden.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
if (UIBar.isHidden()) {
	/* code to execute if the UI bar is hidden… */
}

if (!UIBar.isHidden()) {
	/* code to execute if the UI bar is not hidden… */
}
```

<!-- *********************************************************************** -->

### `UIBar.isStowed()` → *boolean* {#uibar-api-method-isstowed}

Returns whether the UI bar is currently stowed.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
if (UIBar.isStowed()) {
	/* code to execute if the UI bar is stowed… */
}

if (!UIBar.isStowed()) {
	/* code to execute if the UI bar is not stowed… */
}
```

<!-- *********************************************************************** -->

### `UIBar.show()` → *`UIBar` object* {#uibar-api-method-show}

Shows the UI bar.  Returns a reference to the `UIBar` object for chaining.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

##### Basic usage

```js
UIBar.show();
```

##### With unstow

```js
UIBar.unstow().show();
```

<!-- *********************************************************************** -->

### `UIBar.stow([noAnimation])` → *`UIBar` object* {#uibar-api-method-stow}

Stows the UI bar, so that it takes up less space.  Returns a reference to the `UIBar` object for chaining.

#### History:

* `v2.17.0`: Introduced.
* `v2.29.0`: Added returned `UIBar` chaining reference.

#### Parameters:

* **`noAnimation`:** (optional, *boolean*) Whether to skip the default animation.

#### Examples:

##### Basic usage

```js
UIBar.stow();
```

##### With no animation

```js
UIBar.stow(true);
```

<!-- *********************************************************************** -->

### `UIBar.unstow([noAnimation])` → *`UIBar` object* {#uibar-api-method-unstow}

Unstows the UI bar, so that it is fully accessible again.  Returns a reference to the `UIBar` object for chaining.

#### History:

* `v2.17.0`: Introduced.
* `v2.29.0`: Added returned `UIBar` chaining reference.

#### Parameters:

* **`noAnimation`:** (optional, *boolean*) Whether to skip the default animation.

#### Examples:

##### Basic usage

```js
UIBar.unstow();
```

##### With no animation

```js
UIBar.unstow(true);
```

<!-- *********************************************************************** -->

### <span class="deprecated">`UIBar.update()`</span> {#uibar-api-method-update}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#ui-api-method-update"><code>UI.update()</code> static method</a> for its replacement.
</p>

#### History:

* `v2.29.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `UI.update()`.
