<!-- ***********************************************************************************************
	LoadScreen API
************************************************************************************************ -->
# `LoadScreen` API {#loadscreen-api}

<p role="note"><b>Note:</b>
To simply add a delay to the dismissal of the loading screen to hide initial flashes of unstyled content (<a href="https://www.wikipedia.org/wiki/Flash_of_unstyled_content">FOUC</a>)—e.g., style changes and page reflows—you do not need to use this API.  See the <a href="#config-api-property-loaddelay"><code>Config.loadDelay</code></a> configuration setting.
</p>

<!-- *********************************************************************** -->

### `LoadScreen.lock()` → *number* {#loadscreen-api-method-lock}

Acquires a loading screen lock and returns its ID.  Displays the loading screen, if necessary.

#### History:

* `v2.15.0`: Introduced.

#### Parameters: *none*

#### Examples:

```
LoadScreen.lock()  → Locks the loading screen and returns the lock ID
```

<!-- *********************************************************************** -->

### `LoadScreen.unlock(lockId)` {#loadscreen-api-method-unlock}

Releases the loading screen lock with the given ID.  Hides the loading screen, if no other locks exist.

#### History:

* `v2.15.0`: Introduced.

#### Parameters:

* **`lockId`:** (*integer*) The loading screen lock ID.

#### Examples:

```
var lockId = LoadScreen.lock();

// Do something whose timing is unpredictable that should be hidden by the loading screen

LoadScreen.unlock(lockId);
```
