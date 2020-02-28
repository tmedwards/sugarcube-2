<!-- ***********************************************************************************************
	Story API
************************************************************************************************ -->
<h1 id="story-api"><code>Story</code> API</h1>

<!-- *********************************************************************** -->

<span id="story-api-getter-domid"></span>
### `Story.domId` → *string*

The DOM ID of the story—created from the slugified story title.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="story-api-getter-ifid"></span>
### `Story.ifId` → *string*

The IFID (Interactive Fiction IDentifier) of the story, if any.

#### Since:

* `v2.5.0`

<!-- *********************************************************************** -->

<span id="story-api-getter-title"></span>
### `Story.title` → *string*

The title of the story.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="story-api-method-get"></span>
### `Story.get(title)` → *`Passage` object*

Returns the `Passage` object referenced by the given title, or an empty `Passage` object on failure.

<p role="note"><b>Note:</b>
This method will not return &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`title`:** (*string*) The title of the `Passage` object to return.

#### Example:

```
Story.get("The Ducky")  → Returns the Passage object matching "The Ducky"
```

<!-- *********************************************************************** -->

<span id="story-api-method-has"></span>
### `Story.has(title)` → *boolean*

Returns whether a `Passage` object referenced by the given title exists.

<p role="note"><b>Note:</b>
This method will not detect &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`title`:** (*string*) The title of the `Passage` object whose existence will be verified.

#### Example:

```
Story.has("The Ducky")  → Returns whether a Passage object matching "The Ducky" exists
```

<!-- *********************************************************************** -->

<span id="story-api-method-lookup"></span>
### `Story.lookup(propertyName , searchValue [, sortProperty])` → *`Passage` object array*

Returns a new array filled with all `Passage` objects that contain the given property, whose value matches the given search value, or an empty array, if no matches are made.

<p role="note"><b>Note:</b>
This method will not return &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`propertyName`:** (*string*) The name of property whose value will be compared to the search value.
* **`searchValue`:** (*string* | *number*) The value to search for within the matched property.  The type of the property determines how the search occurs—non-arrays are directly compared, while arrays are searched.  If the property's value, for non-arrays, or any of its members, for arrays, match, then the `Passage` object is added to the results.
* **`sortProperty`:** (optional, *string*) The property whose value will be used to lexicographically sort the returned array.  If not given, the `Passage` object's `title` property is used.

#### Example:

```
→ Returns all 'forest'-tagged Passage objects, sorted by their titles
Story.lookup("tags", "forest");
```

<!-- *********************************************************************** -->

<span id="story-api-method-lookupwith"></span>
### `Story.lookupWith(predicate [, sortProperty])` → *`Passage` object array*

Returns a new array filled with all `Passage` objects that pass the test implemented by the given predicate function or an empty array, if no objects pass.

<p role="note"><b>Note:</b>
This method will not return &quot;code&quot; passages—i.e., script, stylesheet, and widget passages.
</p>

#### Since:

* `v2.11.0`

#### Parameters:

* **`predicate`:** (*function*) The function used to test each `Passage` object, which is passed into the function as its sole parameter.  If the function returns `true`, then the `Passage` object is added to the results.
* **`sortProperty`:** (optional, *string*) The property whose value will be used to lexicographically sort the returned array.  If not given, the `Passage` object's `title` property is used.

#### Example:

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
