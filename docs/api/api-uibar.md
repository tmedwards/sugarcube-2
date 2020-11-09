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

```
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

```
UIBar.hide();
```

##### With stow

```
UIBar.hide().stow();
```

<!-- *********************************************************************** -->

### `UIBar.isHidden()` → *boolean* {#uibar-api-method-ishidden}

Returns whether the UI bar is currently hidden.

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
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

```
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

```
UIBar.show();
```

##### With unstow

```
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

```
UIBar.stow();
```

##### With no animation

```
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

```
UIBar.unstow();
```

##### With no animation

```
UIBar.unstow(true);
```

<!-- *********************************************************************** -->

### `UIBar.update()` {#uibar-api-method-update}

Updates all sections of the UI bar that are populated by special passages—e.g., `StoryBanner`, `StoryCaption`, `StoryMenu`, etc.

<p role="note" class="warning"><b>Warning:</b>
As <em>all</em> special passage populated sections are updated it is recommended that <code>UIBar.update()</code> be used sparingly.  Ideally, if you need to update UI bar content outside of the normal passage navigation update, then you should update only the specific areas you need to rather than the entire UI bar.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
UIBar.update();
```
