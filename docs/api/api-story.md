<!-- ***********************************************************************************************
	Story API
************************************************************************************************ -->
# `Story` API {#story-api}

<!-- *********************************************************************** -->

### `Story.domId` → *string* {#story-api-getter-domid}

The DOM ID of the story, created from the slugified story title.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `Story.ifId` → *string* {#story-api-getter-ifid}

The IFID (Interactive Fiction IDentifier) of the story, if any.

#### History:

* `v2.5.0`: Introduced.

<!-- *********************************************************************** -->

### `Story.title` → *string* {#story-api-getter-title}

The title of the story.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `Story.get(title)` → *`Passage` object* {#story-api-method-get}

Returns the `Passage` object referenced by the given title, or an empty `Passage` object on failure.

<p role="note"><b>Note:</b>
This method will not return &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`title`:** (*string*) The title of the `Passage` object to return.

#### Examples:

```
Story.get("The Ducky")  → Returns the Passage object matching "The Ducky"
```

<!-- *********************************************************************** -->

### `Story.has(title)` → *boolean* {#story-api-method-has}

Returns whether a `Passage` object referenced by the given title exists.

<p role="note"><b>Note:</b>
This method will not detect &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`title`:** (*string*) The title of the `Passage` object whose existence will be verified.

#### Examples:

```
Story.has("The Ducky")  → Returns whether a Passage object matching "The Ducky" exists
```

<!-- *********************************************************************** -->

### `Story.lookup(propertyName , searchValue [, sortProperty])` → *`Passage` object array* {#story-api-method-lookup}

Returns a new array filled with all `Passage` objects that contain the given property, whose value matches the given search value, or an empty array, if no matches are made.

<p role="note"><b>Note:</b>
This method will not return &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`propertyName`:** (*string*) The name of property whose value will be compared to the search value.
* **`searchValue`:** (*string* | *number*) The value to search for within the matched property.  The type of the property determines how the search occurs—non-arrays are directly compared, while arrays are searched.  If the property's value, for non-arrays, or any of its members, for arrays, match, then the `Passage` object is added to the results.
* **`sortProperty`:** (optional, *string*) The property whose value will be used to lexicographically sort the returned array.  If not given, the `Passage` object's `title` property is used.

#### Examples:

```
→ Returns all 'forest'-tagged Passage objects, sorted by their titles
Story.lookup("tags", "forest");
```

<!-- *********************************************************************** -->

### `Story.lookupWith(predicate [, sortProperty])` → *`Passage` object array* {#story-api-method-lookupwith}

Returns a new array filled with all `Passage` objects that pass the test implemented by the given predicate function or an empty array, if no objects pass.

<p role="note"><b>Note:</b>
This method will not return &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### History:

* `v2.11.0`: Introduced.

#### Parameters:

* **`predicate`:** (*function*) The function used to test each `Passage` object, which is passed into the function as its sole parameter.  If the function returns `true`, then the `Passage` object is added to the results.
* **`sortProperty`:** (optional, *string*) The property whose value will be used to lexicographically sort the returned array.  If not given, the `Passage` object's `title` property is used.

#### Examples:

```
→ Returns all 'forest'-tagged Passage objects, sorted by their titles
Story.lookupWith(function (p) {
	return p.tags.includes("forest");
});

→ Returns all Passage objects whose titles contain whitespace, sorted by their titles
var hasWhitespaceRegExp = /\s/;
Story.lookupWith(function (p) {
	return hasWhitespaceRegExp.test(p.title);
});
```
