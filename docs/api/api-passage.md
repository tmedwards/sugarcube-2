<!-- ***********************************************************************************************
	Passage API
************************************************************************************************ -->
# `Passage` API {#passage-api}

Instances of the `Passage` object are returned by the [`Story.get()`](#story-api-method-get) static method.

All properties of `Passage` objects should be treated as if they were ***read-only***, as modifying them could result in unexpected behavior.

<!-- *********************************************************************** -->

### `<Passage>.id` → *string* {#passage-api-prototype-getter-id}

The DOM-compatible ID of the passage, created from the slugified passage title.

#### History:

* `v2.37.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.name` → *string* {#passage-api-prototype-getter-name}

The name of the passage.

#### History:

* `v2.37.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.tags` → *Array&lt;string&gt;* {#passage-api-prototype-getter-tags}

The tags of the passage.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.text` → *string* {#passage-api-prototype-getter-text}

The raw text of the passage.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.processText()` → *string* {#passage-api-prototype-method-processtext}

Returns the processed text of the passage, created from applying `nobr` tag and image passage processing to its raw text.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var passage = Story.get("The Ducky");

passage.processText()  → Returns the fully processed text of "The Ducky" passage
```

<!-- *********************************************************************** -->

### <span class="deprecated">`<Passage>.domId` → *string*</span> {#passage-api-prototype-getter-domid}

<p role="note" class="warning"><b>Deprecated:</b>
This property has been deprecated and should no longer be used.  See the <a href="#passage-api-prototype-getter-id"><code>&lt;Passage&gt;.id</code></a> property for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `<Passage>.id`.

<!-- *********************************************************************** -->

### <span class="deprecated">`<Passage>.title` → *string*</span> {#passage-api-prototype-getter-title}

<p role="note" class="warning"><b>Deprecated:</b>
This property has been deprecated and should no longer be used.  See the <a href="#passage-api-prototype-getter-name"><code>&lt;Passage&gt;.name</code></a> property for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `<Passage>.name`.

<!-- *********************************************************************** -->

### <span class="deprecated">`<Passage>.description()` → *string*</span> {#passage-api-prototype-method-description}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated.
