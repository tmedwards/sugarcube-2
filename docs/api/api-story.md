<!-- ***********************************************************************************************
	Story API
************************************************************************************************ -->
<h1 id="story-api"><code>Story</code> API</h1>

<!-- *********************************************************************** -->

<span id="story-api-getter-domid"></span>
### `Story.domId` → *string*

The DOM ID of the story (created from the slugified story title).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="story-api-getter-title"></span>
### `Story.title` → *string*

The title of the story.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="story-api-method-get"></span>
### `Story.get(passageTitle)` → *`Passage` object*

Returns the `Passage` object referenced by the given title, or an empty `Passage` object on failure.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passageTitle`:** (*string*) The title of the `Passage` object to return.

#### Example:

```
Story.get("The Ducky")  → Returns the Passage object matching "The Ducky"
```

<!-- *********************************************************************** -->

<span id="story-api-method-has"></span>
### `Story.has(passageTitle)` → *boolean*

Returns whether a `Passage` object referenced by the given title exists.

#### Since:

* `v2.0.0`

#### Parameters:

* **`passageTitle`:** (*string*) The title of the `Passage` object whose existence will be verified.

#### Example:

```
Story.has("The Ducky")  → Returns whether a Passage object matching "The Ducky" exists
```

<!-- *********************************************************************** -->

<span id="story-api-method-lookup"></span>
### `Story.lookup(propertyName , searchValue [, sortProperty])` → *`Passage` object array*

Returns an array of `Passage` objects each of that must contain a property matching the given name, whose value matches the given needle, or an empty array, if no matches are made.

#### Since:

* `v2.0.0`

#### Parameters:

* **`propertyName`:** (*string*) The name of property whose value will be compared to the search value.
* **`searchValue`:** (*string* | *number*) The value to search for within the matched property.  The type of the property determines how the search occurs; direct comparison for non-arrays, while arrays are iterated over.  If the property value, for non-arrays, or any of the property members' values, for arrays, match, then the `Passage` object is added to the results array.
* **`sortProperty`:** (optional, *string*) The property whose value will be used to lexicographically sort the returned array.  If not given, the `Passage` object's `title` property is used.

#### Example:

```
→ Returns all 'forest'-tagged Passage objects, sorted by their titles
Story.lookup("tags", "forest");
```

<!-- *********************************************************************** -->

<span id="story-api-method-lookupwith"></span>
### `Story.lookupWith(filter [, sortProperty])` → *`Passage` object array*

Returns an array of `Passage` objects that passed the test implemented by the given filter function or an empty array, if no objects pass.

#### Since:

* `v2.11.0`

#### Parameters:

* **`filter`:** (*function*) The function used to test each `Passage` object, which is passed in as its sole parameter.  If the function returns `true`, then the `Passage` object is added to the results array.
* **`sortProperty`:** (optional, *string*) The property whose value will be used to lexicographically sort the returned array.  If not given, the `Passage` object's `title` property is used.

#### Example:

```
→ Returns all Passage objects whose titles contain whitespace, sorted by their titles
var hasWhitespaceRegExp = /\s/;
Story.lookupWith(function (p) {
	return hasWhitespaceRegExp.test(p.title);
});
```
