<!-- ***********************************************************************************************
	Save API
************************************************************************************************ -->
# `Save` API {#save-api}

<p role="note"><b>Note:</b>
There are several <a href="#config-api-saves">configuration settings for saves</a> that it would be wise for you to familiarize yourself with.
</p>

<p role="note" class="warning"><b>Warning:</b>
Browser saves—i.e., auto and slot saves—are largely incompatible with private browsing modes, which cause all in-browser storage mechanisms to either persist only for the lifetime of the browsing session or fail outright.
</p>


<!-- ***************************************************************************
	Save Objects
**************************************************************************** -->
## Save Objects {#save-api-objects}

<!-- *********************************************************************** -->

### Save Data <!-- legacy --><span id="save-api-save-objects"></span><!-- /legacy --> {#save-api-objects-data}

<p role="note"><b>Note:</b>
Adding additional properties directly to save data objects is not recommended.  Instead, use the <code>metadata</code> property.
</p>

#### Save Data Object

A save data object has the following properties:

* **`date`:** (`integer`) The save's creation date (in milliseconds elapsed since epoch).
* **`desc`:** (`string`) The save's description.
* **`id`:** (`string`) The save ID.  See the [`Config.saves.id`](#config-api-property-saves-id) for details.
* **`metadata`:** (optional, `any`) The save's metadata, which *must* be JSON-serializable.  Exists only if specified.  See the appropriate save API or [`Config.saves.metadata`](#config-api-property-saves-metadata) for details.
* **`state`:** (`object`) The marshaled story state.  See below for details.
* **`type`:** (`Save.Type`) The save's type.  See [`Save.Type`](#save-api-constants-type) for details.
* **`version`:** (optional, `any`) The save's version.  Exists only if specified.  See [`Config.saves.version`](#config-api-property-saves-version) for details.

#### Save State Object

The marshaled story state object, from the **`state`** property, has the following properties:

* **`expired`:** (optional, `Array<string>`) The array of expired moment passage titles.  Exists only if any moments have expired.
* **`history`:** (`Array<object>`) The array of moment objects.  See below for details.
* **`index`:** (`integer`) The index of the active moment.
* **`seed`:** (optional, `string`) The seed of the seedable PRNG.  Exists only if enabled.

#### Save History Moment Objects

Each moment object, from the **`history`** property's array, has the following properties:

* **`pull`:** (optional, `integer`) The current pull count of the seedable PRNG.  Exists only if enabled.
* **`title`:** (`string`) The name of the associated passage.
* **`variables`:** (`object`) The current variable store object, which contains sigil-less name &#x21D2; value pairs—e.g., `$foo` exists as the property `foo`.

<!-- *********************************************************************** -->

### Save Descriptor {#save-api-objects-descriptor}

Save descriptor objects are only provided for browser saves and are identical to [save data objects](#save-api-objects-data) save that they do not include a `state` property


<!-- ***************************************************************************
	Save Constants
**************************************************************************** -->
## Constants {#save-api-constants}

<!-- *********************************************************************** -->

### `Save.Type` {#save-api-constants-type}

Save types pseudo-enumeration.  Used to denote the type of save.

#### History:

* `v2.33.0`: Introduced.
* `v2.37.0`: Changed into a public API.

#### Values:

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Description</th>
	</tr>
</thead>
<tbody>
	<tr>
		<th><code>Save.Type.Auto</code></th>
		<td>Browser auto saves.</td>
	</tr>
	<tr>
		<th><code>Save.Type.Base64</code></th>
		<td>Base64 string saves.</td>
	</tr>
	<tr>
		<th><code>Save.Type.Disk</code></th>
		<td>Disk saves.</td>
	</tr>
	<tr>
		<th><code>Save.Type.Slot</code></th>
		<td>Browser slot saves.</td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Browser Saves
**************************************************************************** -->
## Browser Saves {#save-api-browser}

<!-- *********************************************************************** -->

### `Save.browser.size` → `integer` {#save-api-browser-getter-size}

The total number of existing browser saves, both auto and slot.

#### History:

* `v2.37.0`: Introduced.

#### Value:

The `integer` count of existing browser saves.

#### Examples:

```js
console.log(`There are currently ${Save.browser.size} browser saves`);
```

```js
if (Save.browser.size > 0) {
	/* Browser saves exist. */
}
```

```js
if (Save.browser.size === 0) {
	/* No browser saves exist. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.clear()` {#save-api-browser-method-clear}

Deletes all exisring browser saves, both auto and slot.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns: *none*

#### Throws: *none*

#### Examples:

```js
Save.browser.clear();
```

<!-- *********************************************************************** -->

### `Save.browser.continue()` → `Promise` {#save-api-browser-method-continue}

Loads the most recent browser save, either auto or slot.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `Promise` that simply resolves, or rejects with an error if the save could not be loaded.

#### Throws: *none*

#### Examples:

##### Bssic usage

Load the most recent browser save, only handling failure.  This should be sufficient in the majority of cases.

```js
if (Save.browser.size > 0) {
	Save.browser.continue()
		.catch(error => {
			/* Failure.  Handle the error. */
			console.error(error);
			UI.alert(error);
		});
}
else {
	/* No browser saves exist. */
}
```

Load the most recent browser save, handling both success and failure.

```js
if (Save.browser.size > 0) {
	Save.browser.continue()
		.then(metadata => {
			/* Success.  Do something special. */
		})
		.catch(error => {
			/* Failure.  Handle the error. */
			console.error(error);
			UI.alert(error);
		});
}
else {
	/* No browser saves exist. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.export(filename)` {#save-api-browser-method-export}

Exports all existing browser saves, both auto and slot, as a bundle, which may be restored via [`Save.browser.import()`](#save-api-browser-method-import).

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`filename`:** (`string`) The base filename of the browser save export, which gets slugified to remove most symbols.  Appended to this is a datestamp (format: `YYYMMDD-hhmmss`) and the file extension `.savesexport`—e.g., `"The Scooby Chronicles"` would result in the full filename: `the-scooby-chronicles-{datestamp}.savesexport`.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Examples:

Export all browser saves with a base filename, handling failure.

```js
try {
	Save.browser.export("The 6th Fantasy");
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

<!-- *********************************************************************** -->

### `Save.browser.import(event)` → `Promise` {#save-api-browser-method-import}

Restores browser saves, both auto and slot, from an exported save bundle, created via [`Save.browser.export()`](#save-api-browser-method-export).

<p role="note"><b>Note:</b>
This method <em>must</em> be used as, or be called by, the <code>change</code> event handler of an <code>&lt;input type="file"&gt;</code> element.
</p>

<p role="note" class="warning"><b>Warning:</b>
All existing browser saves will be deleted as part of restoring the exported save bundle.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`event`:** (`Event`) The event object that was passed to the `change` event handler of the associated `<input type="file">` element.

#### Returns:

A `Promise` that simply resolves, or rejects with an error if the browser saves bundle could not be imported.

#### Throws: *none*

#### Examples:

##### Bssic usage

Import the browser saves bundle, only handling failure.  This should be sufficient in the majority of cases.

```js
jQuery(document.createElement('input'))
	.prop({
		id   : 'saves-browser-import-file',
		name : 'saves-browser-import-file',
		type : 'file'
	})
	.on('change', ev => {
		// You must provide the event to Save.browser.import()
		Save.browser.import(ev)
			.catch(error => {
				/* Failure.  Handle the error. */
				console.error(error);
				UI.alert(error);
			});
	});
```

Import the browser saves bundle, handling both success and failure.

```js
jQuery(document.createElement('input'))
	.prop({
		id   : 'saves-browser-import-file',
		name : 'saves-browser-import-file',
		type : 'file'
	})
	.on('change', function (ev) {
		// You must provide the event to Save.browser.import()
		Save.browser.import(ev)
			.then(() => {
				/* Success.  Do something special. */
			})
			.catch(error => {
				/* Failure.  Handle the error. */
				console.error(error);
				UI.alert(error);
			});
	});
```

<!-- *********************************************************************** -->

### `Save.browser.isEnabled()` → `boolean` {#save-api-browser-method-isenabled}

Deermines whether any browser saves are enabled, either auto, slot, or both.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

Boolean `true` if any browser saves are enabled, elsewise `false`.

#### Throws: *none*

#### Examples:

```js
if (Save.browser.isEnabled()) {
	/* Some browser saves are enabled. */
}
```


<!-- ***************************************************************************
	Browser Auto Saves
**************************************************************************** -->
## Browser Auto Saves {#save-api-browser-auto}

<!-- *********************************************************************** -->

### `Save.browser.auto.size` → `integer` {#save-api-browser-auto-getter-size}

The total number of existing browser auto saves.

#### History:

* `v2.37.0`: Introduced.

#### Value:

The `integer` count of existing browser auto saves.

#### Examples:

```js
console.log(`There are currently ${Save.browser.auto.size} browser auto saves`);
```

```js
if (Save.browser.auto.size > 0) {
	/* Browser auto saves exist. */
}
```

```js
if (Save.browser.auto.size === 0) {
	/* No browser auto saves exist. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.auto.clear()` {#save-api-browser-auto-method-clear}

Deletes all existing auto saves.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns: *none*

#### Throws: *none*

#### Examples:

```js
Save.browser.auto.clear();
```

<!-- *********************************************************************** -->

### `Save.browser.auto.delete(index)` {#save-api-browser-auto-method-delete}

Deletes the auto save at the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Auto save index (`0`-based).  Must be in the range `0`–`Config.saves.maxAutoSaves`.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Examples:

Delete the auto save at the given index, handling failure.

```js
try {
	Save.browser.auto.delete(index);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

<!-- *********************************************************************** -->

### `Save.browser.auto.entries()` → `Array<object>` {#save-api-browser-auto-method-entries}

Provides an array of details about all auto saves.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

An `Array` of `{ index, info }` generic objects, or an empty `Array` if no auto saves exist.

* **`index`:** (`integer`) The auto save's index (`0`-based).
* **`info`:** (`object`) The [save's descriptor object](#save-api-objects-descriptor).

#### Throws:

An `Error` instance.

#### Examples:

```js
Save.browser.auto.entries().forEach(function (entry) {
	console.log(`Descriptor of the auto save at index ${entry.index}:`, entry.info);
});
```

<!-- *********************************************************************** -->

### `Save.browser.auto.get(index)` → `object` {#save-api-browser-auto-method-get}

Details the auto save at the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Auto save index (`0`-based).  Must be in the range `0`–`Config.saves.maxAutoSaves`.

#### Returns:

The [descriptor object](#save-api-objects-descriptor) for the auto save if it exists, elsewise `null`.

#### Throws:

An `Error` instance.

#### Examples:

```js
console.log(`Descriptor of the auto save at index ${index}:`, Save.browser.auto.get(index));
```

<!-- *********************************************************************** -->

### `Save.browser.auto.has(index)` → `boolean` {#save-api-browser-auto-method-has}

Determines whether the auto save at the given index exists.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Auto save index (`0`-based).  Must be in the range `0`–`Config.saves.maxAutoSaves`.

#### Returns:

Boolean `true` if the auto save exists, elsewise `false`.

#### Throws:

An `Error` instance.

#### Examples:

```js
if (Save.browser.auto.has(index)) {
	/* The auto save at the given index exists. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.auto.isEnabled()` → `boolean` {#save-api-browser-auto-method-isenabled}

Determines whether auto saves are enabled.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

Boolean `true` if auto saves are anabled, elsewise `false`.

#### Throws: *none*

#### Examples:

```js
if (Save.browser.auto.isEnabled()) {
	/* Auto saves are enabled. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.auto.load(index)` → `Promise` {#save-api-browser-auto-method-load}

Loads the auto save at the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Auto save index (`0`-based).  Must be in the range `0`–`Config.saves.maxAutoSaves`.

#### Returns: *none*

A `Promise` that simply resolves, or rejects with an error if the save could not be loaded.

#### Throws: *none*

#### Examples:

##### Basic usage

Load the auto save at the given index, only handling failure.  This should be sufficient in the majority of cases.

```js
Save.browser.auto.load(index)
	.catch(error => {
		/* Failure.  Handle the error. */
		console.error(error);
		UI.alert(error);
	});
```

Load the auto save at the given index, handling both success and failure.

```js
Save.browser.auto.load(index)
	.then(() => {
		/* Success.  Do something special. */
	})
	.catch(error => {
		/* Failure.  Handle the error. */
		console.error(error);
		UI.alert(error);
	});
```

<!-- *********************************************************************** -->

### `Save.browser.auto.save([desc [, metadata]])` {#save-api-browser-auto-method-save}

Saves an auto save.  If all auto save positions are full, replaces the oldest auto save.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`desc`:** (optional, `string`) The description of the auto save.  If omitted or `null`, defaults to the active passage's description.
* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  *Must* be JSON-serializable.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Examples:

##### Basic usage

Save an auto save with the default description and no metadata, handling failure.

```js
try {
	Save.browser.auto.save();
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save an auto save with a description and no metadata, handling failure.

```js
try {
	Save.browser.auto.save("In the wilds");
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save an auto save with the default description and metadata, handling failure.

```js
try {
	const saveMetadata = {
		chars : ['Celes', 'Locke', 'Edward'],
		gold  : 2345
	};
	Save.browser.auto.save(null, saveMetadata);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save an auto save with a description and metadata, handling failure.

```js
try {
	const saveMetadata = {
		chars : ['Celes', 'Locke', 'Edward'],
		gold  : 2345
	};
	Save.browser.auto.save("In the wilds", saveMetadata);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```


<!-- ***************************************************************************
	Browser Slot Saves
**************************************************************************** -->
## Browser Slot Saves {#save-api-browser-slot}

<!-- *********************************************************************** -->

### `Save.browser.slot.size` → `integer` {#save-api-browser-slot-getter-size}

The total number of existing browser slot saves.

#### History:

* `v2.37.0`: Introduced.

#### Value:

The `integer` count of existing browser slot saves.

#### Examples:

```js
console.log(`There are currently ${Save.browser.slot.size} browser slot saves`);
```

```js
if (Save.browser.slot.size > 0) {
	/* Browser slot saves exist. */
}
```

```js
if (Save.browser.slot.size === 0) {
	/* No browser slot saves exist. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.slot.clear()` {#save-api-browser-slot-method-clear}

Deletes all existing slot saves.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns: *none*

#### Throws: *none*

#### Examples:

```js
Save.browser.slot.clear();
```

<!-- *********************************************************************** -->

### `Save.browser.slot.delete(index)` {#save-api-browser-slot-method-delete}

Deletes the slot save at the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Slot save index (`0`-based).  Must be in the range `0`–`Config.saves.maxSlotSaves`.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Examples:

Delete the slot save at the given index, handling failure.

```js
try {
	Save.browser.slot.delete(index);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

<!-- *********************************************************************** -->

### `Save.browser.slot.entries()` → `Array<object>` {#save-api-browser-slot-method-entries}

Provides an array of details about all slot saves.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

An `Array` of `{ index, info }` generic objects, or an empty `Array` if no slot saves exist.

* **`index`:** (`integer`) The slot save's index (`0`-based).
* **`info`:** (`object`) The [save's descriptor object](#save-api-objects-descriptor).

#### Throws:

An `Error` instance.

#### Examples:

```js
Save.browser.slot.entries().forEach(function (entry) {
	console.log(`Descriptor of the slot save at index ${entry.index}:`, entry.info);
});
```

<!-- *********************************************************************** -->

### `Save.browser.slot.get(index)` → `object` {#save-api-browser-slot-method-get}

Details the slot save at the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Slot save index (`0`-based).  Must be in the range `0`–`Config.saves.maxSlotSaves`.

#### Returns:

The [descriptor object](#save-api-objects-descriptor) for the slot save if it exists, elsewise `null`.

#### Throws:

An `Error` instance.

#### Examples:

```js
console.log(`Descriptor of the slot save at index ${index}:`, Save.browser.slot.get(index));
```

<!-- *********************************************************************** -->

### `Save.browser.slot.has(index)` → `boolean` {#save-api-browser-slot-method-has}

Determines whether the slot save at the given index exists.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Slot save index (`0`-based).  Must be in the range `0`–`Config.saves.maxSlotSaves`.

#### Returns:

Boolean `true` if the slot save exists, elsewise `false`.

#### Throws:

An `Error` instance.

#### Examples:

```js
if (Save.browser.slot.has(index)) {
	/* The slot save at the given index exists. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.slot.isEnabled()` → `boolean` {#save-api-browser-slot-method-isenabled}

Determines whether slot saves are enabled.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

Boolean `true` if slot saves are anabled, elsewise `false`.

#### Throws: *none*

#### Examples:

```js
if (Save.browser.slot.isEnabled()) {
	/* Slot saves are enabled. */
}
```

<!-- *********************************************************************** -->

### `Save.browser.slot.load(index)` → `Promise` {#save-api-browser-slot-method-load}

Loads the slot save at the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Slot save index (`0`-based).  Must be in the range `0`–`Config.saves.maxSlotSaves`.

#### Returns: *none*

A `Promise` that simply resolves, or rejects with an error if the save could not be loaded.

#### Throws: *none*

#### Examples:

##### Basic usage

Load the slot save at the given index, only handling failure.  This should be sufficient in the majority of cases.

```js
Save.browser.slot.load(index)
	.catch(error => {
		/* Failure.  Handle the error. */
		console.error(error);
		UI.alert(error);
	});
```

Load the slot save at the given index, handling both success and failure.

```js
Save.browser.slot.load(index)
	.then(() => {
		/* Success.  Do something special. */
	})
	.catch(error => {
		/* Failure.  Handle the error. */
		console.error(error);
		UI.alert(error);
	});
```

<!-- *********************************************************************** -->

### `Save.browser.slot.save(index, [desc [, metadata]])` {#save-api-browser-slot-method-save}

Saves a slot save to the given index.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`index`:** (`integer`) Slot save index (`0`-based).  Must be in the range `0`–`Config.saves.maxSlotSaves`.
* **`desc`:** (optional, `string`) The description of the slot save.  If omitted or `null`, defaults to the active passage's description.
* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  *Must* be JSON-serializable.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Examples:

##### Basic usage

Save to slot save index `0` with the default description and no metadata, handling failure.

```js
try {
	Save.browser.slot.save(0);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save to slot save index `0` with a description and no metadata, handling failure.

```js
try {
	Save.browser.slot.save(0, "In the wilds");
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save to slot save index `0` with the default description and metadata, handling failure.

```js
try {
	const saveMetadata = {
		chars : ['Celes', 'Locke', 'Edward'],
		gold  : 2345
	};
	Save.browser.slot.save(0, null, saveMetadata);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save to slot save index `0` with a description and metadata, handling failure.

```js
try {
	const saveMetadata = {
		chars : ['Celes', 'Locke', 'Edward'],
		gold  : 2345
	};
	Save.browser.slot.save(0, "In the wilds", saveMetadata);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```


<!-- ***************************************************************************
	Disk Saves
**************************************************************************** -->
## Disk Saves {#save-api-disk}

<!-- *********************************************************************** -->

### `Save.disk.load(event)` → `Promise` {#save-api-disk-method-load}

Loads a save, created via [`Save.disk.save()`](#save-api-disk-method-save), from disk.

<p role="note"><b>Note:</b>
This method <em>must</em> be used as, or be called by, the <code>change</code> event handler of an <code>&lt;input type="file"&gt;</code> element.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`event`:** (`Event`) The event object that was passed to the `change` event handler of the associated `<input type="file">` element.

#### Returns:

A `Promise` that simply resolves, or rejects with an error if the save could not be loaded.

#### Throws: *none*

#### Examples:

##### Bssic usage

Load the disk save, only handling failure.  This should be sufficient in the majority of cases.

```js
jQuery(document.createElement('input'))
	.prop({
		id   : 'saves-disk-load-file',
		name : 'saves-disk-load-file',
		type : 'file'
	})
	.on('change', ev => {
		// You must provide the event to Save.disk.load()
		Save.disk.load(ev)
			.catch(error => {
				/* Failure.  Handle the error. */
				console.error(error);
				UI.alert(error);
			});
	});
```

Load the disk save, handling both success and failure.

```js
jQuery(document.createElement('input'))
	.prop({
		id   : 'saves-disk-load-file',
		name : 'saves-disk-load-file',
		type : 'file'
	})
	.on('change', function (ev) {
		// You must provide the event to Save.disk.load()
		Save.disk.load(ev)
			.then(() => {
				/* Success.  Do something special. */
			})
			.catch(error => {
				/* Failure.  Handle the error. */
				console.error(error);
				UI.alert(error);
			});
	});
```

##### As a self-contained button using macros

```
<<button "Load From Disk">>
	<<script>>
	jQuery(document.createElement('input'))
		.prop('type', 'file')
		.on('change', ev => {
			// You must provide the event to Save.disk.load()
			Save.disk.load(ev)
				.catch(error => {
					/* Failure.  Handle the error. */
					console.error(error);
					UI.alert(error);
				});
		})
		.trigger('click');
	<</script>>
<</button>>
```

<!-- *********************************************************************** -->

### `Save.disk.save(filename [, metadata])` {#save-api-disk-method-save}

Saves to disk, which may be restored via [`Save.disk.load()`](#save-api-disk-method-load).

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`filename`:** (`string`) The base filename of the disk save, which gets slugified to remove most symbols.  Appended to this is a datestamp (format: `YYYMMDD-hhmmss`) and the file extension `.save`—e.g., `"The Scooby Chronicles"` would result in the full filename: `the-scooby-chronicles-{datestamp}.save`.
* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  *Must* be JSON-serializable.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Examples:

Save with a base filename and no metadata, handling failure.

```js
try {
	Save.disk.save("The 6th Fantasy");
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save with a base filename and metadata, handling failure.

```js
try {
	const saveMetadata = {
		chars : ['Celes', 'Locke', 'Edward'],
		gold  : 2345
	};
	Save.disk.save("The 6th Fantasy", saveMetadata);
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```


<!-- ***************************************************************************
	Base64 Saves
**************************************************************************** -->
## Base64 Saves {#save-api-base64}

<!-- *********************************************************************** -->

### `Save.base64.load(save)` → `Promise` {#save-api-base64-method-load}

Loads the given Base64 save string, created via [`Save.base64.save()`](#save-api-base64-method-save).

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`save`:** (`string`) The Base64 save string.

#### Returns:

A `Promise` that resolves with the save's metadata (`any` | `undefined`), or rejects with an error if the save could not be loaded.

#### Throws: *none*

#### Examples:

##### Bssic usage

Load the save string, only handling failure.  This should be sufficient in the majority of cases.

```js
Save.base64.load(base64Save)
	.catch(error => {
		/* Failure.  Handle the error. */
		console.error(error);
		UI.alert(error);
	});
```

Load the save string, handling both success and failure.

```js
Save.base64.load(base64Save)
	.then(metadata => {
		/* Success.  Do something special. */
	})
	.catch(error => {
		/* Failure.  Handle the error. */
		console.error(error);
		UI.alert(error);
	});
```

<!-- *********************************************************************** -->

### `Save.base64.save([metadata])` → `string` {#save-api-base64-method-save}

Saves the current story state as a Base64 string.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  *Must* be JSON-serializable.

#### Returns:

A Base64 save `string`.

#### Throws:

An `Error` instance.

#### Examples:

##### Basic usage

Save without metadata, handling failure.

```js
try {
	const base64Save = Save.base64.save();
	/* Do something with the save. */
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
}
```

Save with metadata, handling failure.

```js
try {
	const saveMetadata = {
		chars : ['Celes', 'Locke', 'Edward'],
		gold  : 2345
	};
	const base64Save = Save.base64.save(saveMetadata);
	/* Do something with the save. */
}
catch (error) {
	/* Failure.  Handle the error. */
	console.error(error);
	UI.alert(error);
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

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Handler parameters:

* **`save`:** (`object`) The [save object](#save-api-save-objects) to be processed.

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

#### Returns: *none*

#### Throws: *none*

#### Examples:

```js
Save.onLoad.clear();
```

<!-- *********************************************************************** -->

### `Save.onLoad.delete(handler)` → `boolean` {#save-api-method-onload-delete}

Deletes the specified on-load handler.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`handler`:** (*function*) The handler function to be deleted.

#### Returns:

Boolean `true` if the handler existed, elsewise `false`.

#### Throws: *none*

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

### `Save.onLoad.size` → `integer` {#save-api-getter-onload-size}

The total number of currently registered on-load handlers.

#### History:

* `v2.36.0`: Introduced.

#### Value:

The `integer` count of currently registered on-load handlers.

#### Examples:

```js
console.log('There are %d onLoad handlers registered.', Save.onLoad.size);
```

<!-- *********************************************************************** -->

### `Save.onSave.add(handler)` {#save-api-method-onsave-add}

Performs any required processing before the save data is saved.  The handler is passed one parameter, the save object to be processed.

#### History:

* `v2.36.0`: Introduced.
* `v2.37.0`: Deprecated handlers' `details` parameter.

#### Parameters:

* **`handler`:** (*function*) The handler function to be executed upon the saving of a save.

#### Returns: *none*

#### Throws:

An `Error` instance.

#### Handler parameters:

* **`save`:** (`object`) The [save object](#save-api-save-objects) to be processed.

#### Examples:

##### Basic usage

```js
Save.onSave.add(function (save) {
	/* code to process the save object before it's saved */
});
```

##### Using save objects' `type` property

```js
Save.onSave.add(function (save) {
	switch (save.type) {
		case Type.Auto: {
			/* code to process an auto save object before it's saved */
			break;
		}

		case Type.Base64: {
			/* code to process a base64 save object before it's saved */
			break;
		}

		case Type.Disk: {
			/* code to process a disk save object before it's saved */
			break;
		}

		case Type.Slot: {
			/* code to process a slot save object before it's saved */
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

#### Returns: *none*

#### Throws: *none*

#### Examples:

```js
Save.onSave.clear();
```

<!-- *********************************************************************** -->

### `Save.onSave.delete(handler)` → `boolean` {#save-api-method-onsave-delete}

Deletes the specified on-save handler.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`handler`:** (*function*) The handler function to be deleted.

#### Returns:

Boolean `true` if the handler existed, elsewise `false`.

#### Throws: *none*

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

### `Save.onSave.size` → `integer` {#save-api-getter-onsave-size}

The total number of currently registered on-save handlers.

#### History:

* `v2.36.0`: Introduced.

#### Value:

The `integer` count of currently registered on-save handlers.

#### Examples:

```js
console.log('There are %d onSave handlers registered.', Save.onSave.size);
```


<!-- ***************************************************************************
	Deprecated APIs
**************************************************************************** -->
## Deprecated APIs {#save-api-deprecated}

<!-- *********************************************************************** -->

### <span class="deprecated">`Save.clear()`</span> {#save-api-method-clear}

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#save-api-browser-method-clear"><code>Save.browser.clear()</code></a> method for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated in favor of the `Save.browser.clear()` method.





















<!-- *********************************************************************** -->
<hr>
<hr>
<hr>
<hr>
<h1>
Unconverted deprecated APIs follow this point.
</h1>
<h2>
There be dragons here!
</h2>
<hr>
<hr>
<hr>
<hr>
<!-- *********************************************************************** -->




















<!-- *********************************************************************** -->

### `Save.get()` {#save-api-method-get}

Returns the saves object.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.get()
```

<!-- *********************************************************************** -->

### `Save.ok()` → `boolean` {#save-api-method-ok}

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

### `Save.autosave.get()` → `object` {#save-api-method-autosave-get}

Returns the save object from the autosave or `null`, if there was no autosave.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
Save.autosave.get()  → Returns the autosave
```

<!-- *********************************************************************** -->

### `Save.autosave.has()` → `boolean` {#save-api-method-autosave-has}

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

### `Save.autosave.ok()` → `boolean` {#save-api-method-autosave-ok}

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

* **`title`:** (optional, `string`) The title of the save.  If omitted or `null`, defaults to the passage's description.
* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  *Must* be JSON-serializable.

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
	Save Slots
**************************************************************************** -->
## Slots {#save-api-slots}

<!-- *********************************************************************** -->

### `Save.slots.length` → `integer` {#save-api-getter-slots-length}

Returns the total number of available slots.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
Save.slots.length
```

<!-- *********************************************************************** -->

### `Save.slots.count()` → `integer` {#save-api-method-slots-count}

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

* **`slot`:** (`integer`) Save slot index (0-based).

#### Examples:

```
Save.slots.delete(5)  → Deletes the sixth slot save
```

<!-- *********************************************************************** -->

### `Save.slots.get(slot)` → `object` {#save-api-method-slots-get}

Returns a save object from the given slot or `null`, if there was no save in the given slot.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (`integer`) Save slot index (0-based).

#### Examples:

```
Save.slots.get(5)  → Returns the sixth slot save
```

<!-- *********************************************************************** -->

### `Save.slots.has(slot)` → `boolean` {#save-api-method-slots-has}

Returns whether the given slot is filled.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`slot`:** (`integer`) Save slot index (0-based).

#### Examples:

```
if (Save.slots.has(5)) {
	/* Code to manipulate the sixth slot save. */
}
```

<!-- *********************************************************************** -->

### `Save.slots.isEmpty()` → `boolean` {#save-api-method-slots-isempty}

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

* **`slot`:** (`integer`) Save slot index (0-based).

#### Examples:

```
Save.slots.load(5)  → Load the sixth slot save
```

<!-- *********************************************************************** -->

### `Save.slots.ok()` → `boolean` {#save-api-method-slots-ok}

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

* **`slot`:** (`integer`) Save slot index (0-based).
* **`title`:** (optional, `string`) The title of the save.  If omitted or `null`, defaults to the passage's description.
* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  Must be JSON-serializable.

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

* **`filename`:** (optional, `string`) The base filename of the save, which gets slugified to remove most symbols.  Appended to this is a datestamp (format: `YYYMMDD-hhmmss`) and the file extension `.save`—e.g., `"The Scooby Chronicles"` would result in the full filename: `the-scooby-chronicles-{datestamp}.save`.  If omitted or `null`, defaults to the story's title.
* **`metadata`:** (optional, `any`) The data to be stored in the save object's `metadata` property.  Must be JSON-serializable.

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

* **`event`:** (`Event`) The event object that was passed to the `change` event handler of the associated `<input type="file">` element.

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

### `Save.base64.saveave([metadata])` → `string` | `null` {#save-api-method-serialize}

Returns a save as a serialized string, or `null` if saving is not allowed within the current context.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`metadata`:** (optional, `any`) The data to be stored as metadata.  Must be JSON-serializable.

#### Examples:

```
→ Serialize a save with no metadata
const myGameState = Save.base64.save();
if (myGameState === null) {
	/* Failure.  You've disallowed saving. */
}

→ Serialize a save with metadata someMetadata
const myGameState = Save.base64.save(someMetadata);
if (myGameState === null) {
	/* Failure.  You've disallowed saving. */
}
```

<!-- *********************************************************************** -->

### `Save.base64.load(saveStr)` → `any` | `null` {#save-api-method-deserialize}

Deserializes the given save string, created via [`Save.base64.save()`](#save-api-method-serialize), and loads the save.  Returns the bundled metadata, if any, or `null` if the given save could not be deserialized and loaded.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`saveStr`:** (`string`) The serialized save string.

#### Examples:

```
→ Deserialize a save with no metadata
const loadResult = Save.base64.load(myGameState);
if (loadResult === null) {
	/* Failure.  An error was displayed to the player. */
}

→ Deserialize a save with metadata
const loadResult = Save.base64.load(myGameState);
if (loadResult !== null) {
	/* Success.  Do something special.with loadResult, which contains the metadata. */
}
else {
	/* Failure.  An error was displayed to the player. */
}
```
