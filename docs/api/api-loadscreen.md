<!-- ***********************************************************************************************
	LoadScreen API
************************************************************************************************ -->
# `LoadScreen` API {#loadscreen-api}

<p role="note"><b>Note:</b>
To simply add a delay to the dismissal of the loading screen to hide initial flashes of unstyled content (<a href="https://www.wikipedia.org/wiki/Flash_of_unstyled_content">FOUC</a>)—e.g., style changes and page reflows—you do not need to use this API.  See the <a href="#config-api-property-loaddelay"><code>Config.loadDelay</code></a> configuration setting.
</p>

<!-- *********************************************************************** -->

### `LoadScreen.lock()` → *number* {#loadscreen-api-method-lock}

Acquire a loading screen lock and, if necessary, display the loading screen.

#### History:

* `v2.15.0`: Introduced.

#### Parameters: *none*

#### Returns:

The (*integer*) lock ID.

#### Examples:

See the [`LoadScreen.unlock()` static method](#loadscreen-api-method-unlock) for additional examples.

```js
// Lock the loading screen and get the lock ID.
var lockId = LoadScreen.lock();
```

<!-- *********************************************************************** -->

### `LoadScreen.unlock(lockId)` {#loadscreen-api-method-unlock}

Release the loading screen lock with the given ID and, if no other locks exist, hide the loading screen.

#### History:

* `v2.15.0`: Introduced.

#### Parameters:

* **`lockId`:** (*integer*) The loading screen lock ID.

#### Returns: *none*

#### Examples:

```js
// Lock the loading screen and get the lock ID.
var lockId = LoadScreen.lock();

// Do something whose timing is unpredictable that should be hidden by the loading screen.

// Release the given lock ID.
LoadScreen.unlock(lockId);
```
