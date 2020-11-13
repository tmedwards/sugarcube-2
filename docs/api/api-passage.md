<!-- ***********************************************************************************************
	Passage API
************************************************************************************************ -->
# `Passage` API {#passage-api}

Instances of the `Passage` object are returned by the [`Story.get()`](#story-api-method-get) static method.

All properties of `Passage` objects should be treated as if they were ***read-only***, as modifying them could result in unexpected behavior.

<!-- *********************************************************************** -->

### `<Passage>.domId` → *string* {#passage-api-prototype-getter-domid}

The DOM ID of the passage, created from the slugified passage title.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.tags` → *string array* {#passage-api-prototype-getter-tags}

The tags of the passage.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.text` → *string* {#passage-api-prototype-getter-text}

The raw text of the passage.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.title` → *string* {#passage-api-prototype-getter-title}

The title of the passage.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<Passage>.description()` → *string* {#passage-api-prototype-method-description}

Returns the description of the passage, created from either an excerpt of the passage or the [`Config.passages.descriptions` setting](#config-api-property-passages-descriptions).

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
var passage = Story.get("The Ducky");

passage.description()  → Returns the description of "The Ducky" passage
```

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
