<!-- ***********************************************************************************************
	Passage API
************************************************************************************************ -->
<h1 id="passage-api"><code>Passage</code> API</h1>

Instances of the `Passage` object are returned by the [`Story.passages.get()`](#story-api-method-passages-get) static method.

All properties of `Passage` objects should be treated as if they were ***read-only***, as modifying them could result in unexpected behavior.

<!-- *********************************************************************** -->

<span id="passage-api-prototype-getter-domid"></span>
### `<Passage>.domId` → *string*

The DOM ID of the passage (created from the slugified passage title).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="passage-api-prototype-getter-tags"></span>
### `<Passage>.tags` → *string array*

The tags of the passage.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="passage-api-prototype-getter-text"></span>
### `<Passage>.text` → *string*

The raw text of the passage.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="passage-api-prototype-getter-title"></span>
### `<Passage>.title` → *string*

The title of the passage.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="passage-api-prototype-method-description"></span>
### `<Passage>.description()` → *string*

Returns the description of the passage, created from either an excerpt of the passage or the [`Config.passages.descriptions` setting](#config-api-property-passages-descriptions).

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
Story.get("The Ducky").description()  → Returns the description of "The Ducky" passage
```

<!-- *********************************************************************** -->

<span id="passage-api-prototype-method-processtext"></span>
### `<Passage>.processText()` → *string*

Returns the text of the `Passage` object (similar to `<Passage>.text`) after applying `nobr` tag and image passage processing to it.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
Story.get("The Ducky").processText()  → Returns the fully processed text of "The Ducky" passage
```
