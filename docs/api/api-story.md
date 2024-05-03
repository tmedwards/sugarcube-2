<!-- ***********************************************************************************************
	Story API
************************************************************************************************ -->
# `Story` API {#story-api}

<!-- *********************************************************************** -->

### `Story.id` → *string* {#story-api-getter-id}

The DOM-compatible ID of the story.

#### History:

* `v2.37.0`: Introduced.

#### Value:

The `string` DOM-compatible ID of the story, created from the slugified story name.

<!-- *********************************************************************** -->

### `Story.ifId` → *string* {#story-api-getter-ifid}

The IFID (Interactive Fiction IDentifier) of the story.

#### History:

* `v2.5.0`: Introduced.

#### Value:

The `string` IFID of the story, or an empty string if no IFID exists.  The Twine 2 ecosystem's IFIDs are v4 random UUIDs.

<!-- *********************************************************************** -->

### `Story.name` → *string* {#story-api-getter-name}

The name of the story.

#### History:

* `v2.37.0`: Introduced.

#### Value:

The `string` name of the story.

<!-- *********************************************************************** -->

### `Story.add(descriptor)` → *boolean* {#story-api-method-add}

Adds the passage to the passage store.

<p role="note"><b>Note:</b>
This method cannot add <a href="#code-passages">code passages</a> or passages tagged with <a href="#code-tags">code tags</a>.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`descriptor`:** (*`Object`*) The passage descriptor object.

#### Passage Descriptor:

A passage descriptor object should have the following properties:

* **`name`:** (*`string`*) The passage's name.
* **`tags`:** (*`string`*) The passage's whitespace separated list of tags.
* **`text`:** (*`string`*) The passage's text.

#### Returns:

Boolean `true` if the passage was added, elsewise `false`.

#### Examples:

```js
// Add a passage
const descriptor = {
	name : "Forest 4",
	tags : "forest heavy",
	text : "You can barely see farther than arm's length for all the trees.",
};

if (Story.add(descriptor)) {
	/* The "Forest 4" passage was added. */
}
```

<!-- *********************************************************************** -->

### `Story.delete(name)` → *boolean* {#story-api-method-delete}

Deletes the `Passage` instance with the given name.

<p role="note"><b>Note:</b>
This method cannot add <a href="#code-passages">code passages</a> or passages tagged with <a href="#code-tags">code tags</a>.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) The name of the `Passage` instance.

#### Returns:

Boolean `true` if a `Passage` instance with the given name was deleted, elsewise `false`.

#### Examples:

```js
// Delete the Passage instance with the name "The Ducky"
if (Story.delete("The Ducky")) {
	/* The "The Ducky" passage was deleted. */
}
```

<!-- *********************************************************************** -->

### `Story.filter(predicate [, thisArg])` → *`Array<Passage>`* {#story-api-method-filter}

Searches all `Passage` instances for those that pass the test implemented by the given predicate function.

<p role="note"><b>Note:</b>
This method cannot retrieve passages tagged with <a href="#code-tags">code tags</a>.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`predicate`:** (*function*) The function used to test each `Passage` instance, which is passed into the function as its sole parameter.  If the function returns `true`, then the `Passage` instance is added to the results.
* **`thisArg`:** (optional, *any*) The value to use as `this` when executing the `predicate` function.

#### Returns:

A new `Array<Passage>` filled with all instances that pass the test implemented by the given predicate function, or an empty `Array` if no instances pass.

#### Examples:

```js
// Returns all 'forest'-tagged Passage instances
Story.filter(function (p) {
	return p.tags.includes("forest");
});

// Returns all Passage instances whose names include whitespace
var hasWhitespaceRegExp = /\s/;
Story.filter(function (p) {
	return hasWhitespaceRegExp.test(p.name);
});
```

<!-- *********************************************************************** -->

### `Story.find(predicate [, thisArg])` → *`Passage`* {#story-api-method-find}

Searches all `Passage` instances for the first that passes the test implemented by the given predicate function.

<p role="note"><b>Note:</b>
This method cannot retrieve passages tagged with <a href="#code-tags">code tags</a>.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`predicate`:** (*function*) The function used to test each `Passage` object, which is passed into the function as its sole parameter.  If the function returns `true`, then the `Passage` instance is added to the results.
* **`thisArg`:** (optional, *any*) The value to use as `this` when executing the `predicate` function.

#### Returns:

The first `Passage` instance that passed the test implemented by the given predicate function, or `undefined` if no instance passes.

#### Examples:

```js
// Returns the first 'forest'-tagged Passage instance
Story.find(function (p) {
	return p.tags.includes("forest");
});

// Returns the first Passage instance whose name includes whitespace
var hasWhitespaceRegExp = /\s/;
Story.find(function (p) {
	return hasWhitespaceRegExp.test(p.name);
});
```

<!-- *********************************************************************** -->

### `Story.get(name)` → *`Passage`* {#story-api-method-get}

Gets the `Passage` instance with the given name.

<p role="note"><b>Note:</b>
This method cannot retrieve passages tagged with <a href="#code-tags">code tags</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) The name of the `Passage` instance.

#### Returns:

The `Passage` instance with the given name, or a new empty `Passage` instance if no such passage exists.

#### Examples:

```js
// Get the Passage instance with the name "The Ducky"
const theDucky = Story.get("The Ducky");
```

<!-- *********************************************************************** -->

### `Story.has(name)` → *boolean* {#story-api-method-has}

Determines whether a `Passage` instance with the given name exists.

<p role="note"><b>Note:</b>
This method does not check passages tagged with <a href="#code-tags">code tags</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) The name of the `Passage` instance.

#### Returns:

Boolean `true` if a `Passage` instance with the given name exists, elsewise `false`.

#### Examples:

```js
// Returns whether a "The Ducky" Passage instance exists
if (Story.has("The Ducky")) {
	/* The "The Ducky" passage exists. */
}
```

<!-- *********************************************************************** -->

### <span class="deprecated">`Story.domId` → *string*</span> {#story-api-getter-domid}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#story-api-getter-id"><code>Story.id</code></a> setting for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `Story.id`.

<!-- *********************************************************************** -->

### <span class="deprecated">`Story.title` → *string*</span> {#story-api-getter-title}

<p role="note" class="warning"><b>Deprecated:</b>
This setting has been deprecated and should no longer be used.  See the <a href="#story-api-getter-name"><code>Story.name</code></a> setting for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `Story.name`.

<!-- *********************************************************************** -->

### <span class="deprecated">`Story.lookup(propertyName , searchValue [, sortProperty])` → *`Array<Passage>`*</span> {#story-api-method-lookup}

<p role="note" class="warning"><b>Deprecated:</b>
This static method has been deprecated and should no longer be used.  See the <a href="#story-api-method-filter"><code>Story.filter()</code> static method</a> for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `Story.filter()`.

<!-- *********************************************************************** -->

### <span class="deprecated">`Story.lookupWith(predicate [, sortProperty])` → *`Array<Passage>`*</span> {#story-api-method-lookupwith}

<p role="note" class="warning"><b>Deprecated:</b>
This static method has been deprecated and should no longer be used.  See the <a href="#story-api-method-filter"><code>Story.filter()</code> static method</a> for its replacement.
</p>

#### History:

* `v2.11.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `Story.filter()`.
