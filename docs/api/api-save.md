<!-- ***********************************************************************************************
	Save API
************************************************************************************************ -->
# `Save` API {#save-api}

<p role="note"><b>Note:</b>
There are several <a href="#config-api-saves">configuration settings for saves</a> that it would be wise for you to familiarize yourself with.
</p>

<p role="note" class="warning"><b>Warning:</b>
In-browser saves—i.e., autosave and slot saves—are largely incompatible with private browsing modes, which cause all in-browser storage mechanisms to either persist only for the lifetime of the browsing session or fail outright.
</p>


<!-- ***************************************************************************
	Save Objects
**************************************************************************** -->
## Save Objects {#save-api-save-objects}

<p role="note"><b>Note:</b>
Adding additional properties directly to save objects is not recommended.  Instead, use the <code>metadata</code> property.
</p>

Save objects have some of the following properties:

* **`id`:** (*string*) The story's save ID.
* **`state`:** (*object*) The marshaled story history (see below for details).
* **`title`:** (*string*) The title of the save.
* **`date`:** (*integer*) The date when the save was created (in milliseconds elapsed since epoch).
* **`metadata`:** (optional, *any*) Save metadata (end-user specified; must be JSON-serializable).
* **`version`:** (optional, *any*) Save version (end-user specified via [`Config.saves.version`](#config-api-property-saves-version)).

The **`state`** object has the following properties:

* **`history`:** (*Array&lt;object&gt;*) The array of moment objects (see below for details).
* **`index`:** (*integer*) The index of the active moment.
* **`expired`:** (optional, *Array&lt;string&gt;*) The array of expired moment passage titles, exists only if any moments have expired.
* **`seed`:** (optional, *string*) The seed of SugarCube's seedable PRNG, exists only if enabled.

Each **`moment`** object has the following properties:

* **`title`:** (*string*) The title of the associated passage.
* **`variables`:** (*object*) The current variable store object, which contains sigil-less name &#x21D2; value pairs—e.g., `$foo` exists as `foo`.
* **`pull`:** (optional, *integer*) The current pull count of SugarCube's seedable PRNG, exists only if enabled.


<!-- ***************************************************************************
	Save General
**************************************************************************** -->
## General {#save-api-general}

<!-- *********************************************************************** -->

### `Save.clear()` {#save-api-method-clear}

Deletes all slot saves and the autosave, if it's enabled.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.clear()
```

<!-- *********************************************************************** -->

### `Save.get()` {#save-api-method-get}

Returns the saves object.
<!--

**NOTE:** Using `storage.get("saves")` to retrieve the saves object could return `null`, since an empty saves object does not get stored.  This method, which guarantees the return of a saves object, should be used instead.
-->

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.get()
```

<!-- *********************************************************************** -->

### `Save.ok()` → *boolean* {#save-api-method-ok}

Returns whether both the slot saves and autosave are available and ready.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (Save.ok()) {
	/* Code to manipulate saves. */
}
```


<!-- ***************************************************************************
	Save Slots
**************************************************************************** -->
## Slots {#save-api-slots}

<!-- *********************************************************************** -->

### `Save.slots.length` → *integer* {#save-api-getter-slots-length}

Returns the total number of available slots.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Save.slots.length
```

<!-- *********************************************************************** -->

### `Save.slots.count()` → *integer* {#save-api-method-slots-count}

Returns the total number of filled slots.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.slots.count()
```

<!-- *********************************************************************** -->

### `Save.slots.delete(slot)` {#save-api-method-slots-delete}

Deletes a save from the given slot.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (*integer*) Save slot index (0-based).

#### Examples:

```
Save.slots.delete(5)  → Deletes the sixth slot save
```

<!-- *********************************************************************** -->

### `Save.slots.get(slot)` → *object* {#save-api-method-slots-get}

Returns a save object from the given slot or `null`, if there was no save in the given slot.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (*integer*) Save slot index (0-based).

#### Examples:

```
Save.slots.get(5)  → Returns the sixth slot save
```

<!-- *********************************************************************** -->

### `Save.slots.has(slot)` → *boolean* {#save-api-method-slots-has}

Returns whether the given slot is filled.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (*integer*) Save slot index (0-based).

#### Examples:

```
if (Save.slots.has(5)) {
	/* Code to manipulate the sixth slot save. */
}
```

<!-- *********************************************************************** -->

### `Save.slots.isEmpty()` → *boolean* {#save-api-method-slots-isempty}

Returns whether there are any filled slots.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.slots.isEmpty()  → Effectively returns: Save.slots.count() === 0
```

<!-- *********************************************************************** -->

### `Save.slots.load(slot)` {#save-api-method-slots-load}

Loads a save from the given slot.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (*integer*) Save slot index (0-based).

#### Examples:

```
Save.slots.load(5)  → Load the sixth slot save
```

<!-- *********************************************************************** -->

### `Save.slots.ok()` → *boolean* {#save-api-method-slots-ok}

Returns whether the slot saves are available and ready.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (Save.slots.ok()) {
	/* Code to manipulate slot saves. */
}
```

<!-- *********************************************************************** -->

### `Save.slots.save(slot [, title [, metadata]])` {#save-api-method-slots-save}

Saves to the given slot.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (*integer*) Save slot index (0-based).
* **`title`:** (optional, *string*) The title of the save.  If omitted or `null`, defaults to the passage's description.
* **`metadata`:** (optional, *any*) The data to be stored in the save object's `metadata` property.  Must be JSON-serializable.

#### Examples:

```
→ Save to the sixth slot save with the default title and no metadata
Save.slots.save(5)

→ Save to the sixth slot save with the title "Midgar" and no metadata
Save.slots.save(5, "Midgar")

→ Save to the sixth slot save with the default title and metadata someMetadata
Save.slots.save(5, null, someMetadata)

→ Save to the sixth slot save with the title "Midgar" and metadata someMetadata
Save.slots.save(5, "Midgar", someMetadata)
```


<!-- ***************************************************************************
	Save Autosave
**************************************************************************** -->
## Autosave {#save-api-autosave}

<!-- *********************************************************************** -->

### `Save.autosave.delete()` {#save-api-method-autosave-delete}

Deletes the autosave.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.autosave.delete()  → Deletes the autosave
```

<!-- *********************************************************************** -->

### `Save.autosave.get()` → *object* {#save-api-method-autosave-get}

Returns the save object from the autosave or `null`, if there was no autosave.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.autosave.get()  → Returns the autosave
```

<!-- *********************************************************************** -->

### `Save.autosave.has()` → *boolean* {#save-api-method-autosave-has}

Returns whether the autosave is filled.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (Save.autosave.has()) {
	/* Code to manipulate the autosave. */
}
```

<!-- *********************************************************************** -->

### `Save.autosave.load()` {#save-api-method-autosave-load}

Loads the autosave.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.autosave.load()  → Load the autosave
```

<!-- *********************************************************************** -->

### `Save.autosave.ok()` → *boolean* {#save-api-method-autosave-ok}

Returns whether the autosave is available and ready.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
if (Save.autosave.ok()) {
	/* Code to manipulate the autosave. */
}
```

<!-- *********************************************************************** -->

### `Save.autosave.save([title [, metadata]])` {#save-api-method-autosave-save}

Saves to the autosave.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`title`:** (optional, *string*) The title of the save.  If omitted or `null`, defaults to the passage's description.
* **`metadata`:** (optional, *any*) The data to be stored in the save object's `metadata` property.  Must be JSON-serializable.

#### Examples:

```
→ Save to the autosave with the default title and no metadata
Save.autosave.save()

→ Save to the autosave with the title "Midgar" and no metadata
Save.autosave.save("Midgar")

→ Save to the autosave with the default title and metadata someMetadata
Save.autosave.save(null, someMetadata)

→ Save to the autosave with the title "Midgar" and metadata someMetadata
Save.autosave.save("Midgar", someMetadata)
```


<!-- ***************************************************************************
	Save Disk
**************************************************************************** -->
## Disk {#save-api-disk}

<!-- *********************************************************************** -->

### `Save.export([filename [, metadata]])` {#save-api-method-export}

Saves to disk.

#### History:

* `v2.0.0`: Introduced.
* `v2.8.0`: Added `metadata` parameter.

#### Parameters:

* **`filename`:** (optional, *string*) The base filename of the save, which gets slugified to remove most symbols.  Appended to this is a datestamp (format: `YYYMMDD-hhmmss`) and the file extension `.save`—e.g., `"The Scooby Chronicles"` would result in the full filename: `the-scooby-chronicles-{datestamp}.save`.  If omitted or `null`, defaults to the story's title.
* **`metadata`:** (optional, *any*) The data to be stored in the save object's `metadata` property.  Must be JSON-serializable.

#### Examples:

```
→ Export a save with the default filename and no metadata
Save.export()

→ Export a save with the filename "the-7th-fantasy-{datestamp}.save" and no metadata
Save.export("The 7th Fantasy")

→ Export a save with the default filename and metadata someMetadata
Save.export(null, someMetadata)

→ Export a save with the filename "the-7th-fantasy-{datestamp}.save" and metadata someMetadata
Save.export("The 7th Fantasy", someMetadata)
```

<!-- *********************************************************************** -->

### `Save.import(event)` {#save-api-method-import}

Loads a save from disk.

**NOTE:** You do not call this manually, it *must* be called by the `change` event handler of an `<input type="file">` element.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`event`:** (*event object*) The event object that was passed to the `change` event handler of the associated `<input type="file">` element.

#### Examples:

##### Basic usage

```
// Assuming you're creating a file input something like the following
var input  = document.createElement('input');
input.type = 'file';
input.id   = 'saves-import-file';
input.name = 'saves-import-file';

// Set up Save.import() as the event handler for when a file has been chosen
jQuery(input).on('change', Save.import);
```

In case you needed to do more than simply load the save, you may do something like the following:

```
// Assuming you're creating a file input something like the following
var input  = document.createElement('input');
input.type = 'file';
input.id   = 'saves-import-file';
input.name = 'saves-import-file';

// Set up a custom event handler for when a file has been chosen, which will call Save.import()
jQuery(input).on('change', function (ev) {
	// You must pass in the event when calling Save.import() manually
	Save.import(ev);

	// Put anything else you needed to do here
});
```

##### As a self-contained link/button using macros

```
<<link "Load From Disk">>
	<<script>>
	jQuery(document.createElement('input'))
		.prop('type', 'file')
		.on('change', Save.import)
		.trigger('click');
	<</script>>
<</link>>
```


<!-- ***************************************************************************
	Save Serialization
**************************************************************************** -->
## Serialization {#save-api-serialization}

<!-- *********************************************************************** -->

### `Save.serialize([metadata])` → *string* | *null* {#save-api-method-serialize}

Returns a save as a serialized string, or `null` if saving is not allowed within the current context.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`metadata`:** (optional, *any*) The data to be stored as metadata.  Must be JSON-serializable.

#### Examples:

```
→ Serialize a save with no metadata
const myGameState = Save.serialize();
if (myGameState === null) {
	/* Failure.  You've disallowed saving. */
}

→ Serialize a save with metadata someMetadata
const myGameState = Save.serialize(someMetadata);
if (myGameState === null) {
	/* Failure.  You've disallowed saving. */
}
```

<!-- *********************************************************************** -->

### `Save.deserialize(saveStr)` → *any* | *null* {#save-api-method-deserialize}

Deserializes the given save string, created via [`Save.serialize()`](#save-api-method-serialize), and loads the save.  Returns the bundled metadata, if any, or `null` if the given save could not be deserialized and loaded.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`saveStr`:** (*string*) The serialized save string.

#### Examples:

```
→ Deserialize a save with no metadata
const loadResult = Save.deserialize(myGameState);
if (loadResult === null) {
	/* Failure.  An error was displayed to the player. */
}

→ Deserialize a save with metadata
const loadResult = Save.deserialize(myGameState);
if (loadResult !== null) {
	/* Success.  Do something with loadResult, which contains the metadata. */
}
else {
	/* Failure.  An error was displayed to the player. */
}
```


<!-- ***************************************************************************
	Save Events
**************************************************************************** -->
## Events {#save-api-events}

<!-- *********************************************************************** -->

### `Save.onLoad.add(handler)` {#save-api-method-onload-add}

Performs any required processing before the save data is loaded—e.g., upgrading out-of-date save data.  The handler is passed one parameter, the save object to be processed.  If it encounters an unrecoverable problem during its processing, it may throw an exception containing an error message; the message will be displayed to the player and loading of the save will be terminated.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`handler`:** (*function*) The handler function to be executed upon the loading of a save.

#### Handler parameters:

* **`save`:** (*object*) The [save object](#save-api-save-objects) to be processed.

#### Examples:

```js
Save.onLoad.add(function (save) {
	/* code to process the save object before it's loaded */
});
```

<!-- *********************************************************************** -->

### `Save.onLoad.clear()` {#save-api-method-onload-clear}

Deletes all currently registered on-load handlers.

#### History:

* `v2.36.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
Save.onLoad.clear();
```

<!-- *********************************************************************** -->

### `Save.onLoad.delete(handler)` → *boolean* {#save-api-method-onload-delete}

Deletes the specified on-load handler, returning `true` if the handler existed or `false` if not.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`handler`:** (*function*) The handler function to be deleted.

#### Examples:

```js
// Given:
// 	let myOnLoadHandler = function (save) {
// 		/* code to process the save object before it's loaded */
// 	};
// 	Save.onLoad.add(myOnLoadHandler);

Save.onLoad.delete(myOnLoadHandler);
```

<!-- *********************************************************************** -->

### `Save.onLoad.size` → *integer* {#save-api-getter-onload-size}

Returns the number of currently registered on-load handlers.

#### History:

* `v2.36.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
console.log('There are %d onLoad handlers registered.', Save.onLoad.size);
```

<!-- *********************************************************************** -->

### `Save.onSave.add(handler)` {#save-api-method-onsave-add}

Performs any required processing before the save data is saved.  The handlers is passed two parameters, the save object to be processed and save operation details object.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`handler`:** (*function*) The handler function to be executed upon the saving of a save.

#### Handler parameters:

* **`save`:** (*object*) The [save object](#save-api-save-objects) to be processed.
* **`details`:** (*object*) The save operation details object.

#### Save operation details object:

A save operation details object will have the following properties:

* **`type`:** (*string*) A string representing what caused the save operation.  Possible values are: `'autosave'`, `'disk'`, `'serialize'`, `'slot'`.

#### Examples:

##### Using only the save object parameter

```js
Save.onSave.add(function (save) {
	/* code to process the save object before it's saved */
});
```

##### Using both the save object and operation details parameters

```js
Save.onSave.add(function (save, details) {
	switch (details.type) {
		case 'autosave': {
			/* code to process the save object from autosaves before it's saved */
			break;
		}

		case 'disk': {
			/* code to process the save object from disk saves before it's saved */
			break;
		}

		case 'serialize': {
			/* code to process the save object from serialize saves before it's saved */
			break;
		}

		default: { /* slot */
			/* code to process the save object from slot saves before it's saved */
			break;
		}
	}
});
```

<!-- *********************************************************************** -->

### `Save.onSave.clear()` {#save-api-method-onsave-clear}

Deletes all currently registered on-save handlers.

#### History:

* `v2.36.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
Save.onSave.clear();
```

<!-- *********************************************************************** -->

### `Save.onSave.delete(handler)` → *boolean* {#save-api-method-onsave-delete}

Deletes the specified on-save handler, returning `true` if the handler existed or `false` if not.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`handler`:** (*function*) The handler function to be deleted.

#### Examples:

```js
// Given:
// 	let myOnSaveHandler = function (save, details) {
// 		/* code to process the save object before it's saved */
// 	};
// 	Save.onSave.add(myOnSaveHandler);

Save.onSave.delete(myOnSaveHandler);
```

<!-- *********************************************************************** -->

### `Save.onSave.size` → *integer* {#save-api-getter-onsave-size}

Returns the number of currently registered on-save handlers.

#### History:

* `v2.36.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
console.log('There are %d onSave handlers registered.', Save.onSave.size);
```
