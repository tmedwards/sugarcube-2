<!-- ***************************************************************************
	MacroContext API
**************************************************************************** -->
# `MacroContext` API {#macrocontext-api}

<p role="note" class="see"><b>See Also:</b>
<a href="#macro-api"><code>Macro</code> API</a>.
</p>

Macro handlers are called with no arguments, but with their `this` set to a macro (execution) context object.  Macro context objects contain the following data and method properties.

<!-- *********************************************************************** -->

### `<MacroContext>.args` → *array* {#macrocontext-api-prototype-property-args}

The argument string parsed into an array of discrete arguments.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Given: <<someMacro "a" "b" "c">>
this.args.length  → Returns 3
this.args[0]      → Returns 'a'
this.args[1]      → Returns 'b'
this.args[2]      → Returns 'c'
```

<!-- *********************************************************************** -->

### `<MacroContext>.args.full` → *string* {#macrocontext-api-prototype-property-args-full}

The argument string after converting all TwineScript syntax elements into their native JavaScript counterparts.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Given: <<if "a" is "b">>
this.args.full  → Returns '"a" === "b"'
```

<!-- *********************************************************************** -->

### `<MacroContext>.args.raw` → *string* {#macrocontext-api-prototype-property-args-raw}

The unprocessed argument string.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Given: <<if "a" is "b">>
this.args.raw  → Returns '"a" is "b"'
```

<!-- *********************************************************************** -->

### `<MacroContext>.name` → *string* {#macrocontext-api-prototype-property-name}

The name of the macro.

#### History:

* `v2.0.0`: Introduced.

#### Examples:

```
// Given: <<someMacro …>>
this.name  → Returns 'someMacro'
```

<!-- *********************************************************************** -->

### `<MacroContext>.output` → *`HTMLElement` object* {#macrocontext-api-prototype-property-output}

The current output element.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<MacroContext>.parent` → *null* | *object* {#macrocontext-api-prototype-property-parent}

The (execution) context object of the macro's parent, or `null` if the macro has no parent.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<MacroContext>.parser` → *object* {#macrocontext-api-prototype-property-parser}

The parser instance that generated the macro call.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<MacroContext>.payload` → *null* | *array* {#macrocontext-api-prototype-property-payload}

The text of a container macro parsed into discrete payload objects by tag.  Payload objects have the following properties:

* **`name`:** (*string*) Name of the current tag.
* **`args`:** (*array*) The current tag's argument string parsed into an array of discrete arguments.  Equivalent in function to [`<MacroContext>.args`](#macrocontext-api-prototype-property-args).
	* **`args.full`:** (*string*) The current tag's argument string after converting all TwineScript syntax elements into their native JavaScript counterparts.  Equivalent in function to [`<MacroContext>.args.full`](#macrocontext-api-prototype-property-args-full).
	* **`args.raw`:** (*string*) The current tag's unprocessed argument string.  Equivalent in function to [`<MacroContext>.args.raw`](#macrocontext-api-prototype-property-args-raw).
* **`contents`:** (*string*) The current tag's contents—i.e., the text between the current tag and the next.

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<MacroContext>.self` → *object* {#macrocontext-api-prototype-property-self}

The macro's definition—created via [`Macro.add()`](#macro-api-method-add).

#### History:

* `v2.0.0`: Introduced.

<!-- *********************************************************************** -->

### `<MacroContext>.contextHas(filter)` → *boolean* {#macrocontext-api-prototype-method-contexthas}

Returns whether any of the macro's ancestors passed the test implemented by the given filter function.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`filter`:** (*function*) The function used to test each ancestor execution context object, which is passed in as its sole parameter.

#### Examples:

```
var includeAncestor = function (ctx) { return ctx.name === "include"; };
this.contextHas(includeAncestor);  → Returns true if any ancestor was an <<include>> macro
```

<!-- *********************************************************************** -->

### `<MacroContext>.contextSelect(filter)` → *null* | *object* {#macrocontext-api-prototype-method-contextselect}

Returns the first of the macro's ancestors that passed the test implemented by the given filter function or `null`, if no members pass.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`filter`:** (*function*) The function used to test each ancestor execution context object, which is passed in as its sole parameter.

#### Examples:

```
var includeAncestor = function (ctx) { return ctx.name === "include"; };
this.contextSelect(includeAncestor);  → Returns the first <<include>> macro ancestor
```

<!-- *********************************************************************** -->

### `<MacroContext>.contextSelectAll(filter)` → *object array* {#macrocontext-api-prototype-method-contextselectall}

Returns a new array containing all of the macro's ancestors that passed the test implemented by the given filter function or an empty array, if no members pass.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`filter`:** (*function*) The function used to test each ancestor execution context object, which is passed in as its sole parameter.

#### Examples:

```
var includeAncestor = function (ctx) { return ctx.name === "include"; };
this.contextSelectAll(includeAncestor);  → Returns an array of all <<include>> macro ancestors
```

<!-- *********************************************************************** -->

### `<MacroContext>.createShadowWrapper(callback [, doneCallback [, startCallback]])` → *function* {#macrocontext-api-prototype-method-createshadowwrapper}

Returns a callback function that wraps the specified callback functions to provide access to the variable shadowing system used by the [`<<capture>>` macro](#macros-macro-capture).

<p role="note" class="note"><b>Note:</b>
All of the specified callbacks are invoked as the wrapper is invoked—meaning, with their <code>this</code> set to the <code>this</code> of the wrapper and with whatever parameters were passed to the wrapper.
</p>

<p role="note" class="warning"><b>Warning:</b>
Only useful when you have an asynchronous callback that invokes code/content that needs to access story and/or temporary variables shadowed by <code>&lt;&lt;capture&gt;&gt;</code>.  If you don't know what that means, then this API is likely not for you.
</p>

#### History:

* `v2.14.0`: Introduced.
* `v2.23.3`: Fixed an issue where shadows would fail for multiple layers of nested asynchronous code due to loss of context.

#### Parameters:

* **`callback`:** (*function*) The main callback function, executed when the wrapper is invoked.  Receives access to variable shadows.
* **`doneCallback`:** (optional, *function*) The finalization callback function, executed after the main `callback` returns.  Does not receive access to variable shadows.
* **`startCallback`:** (optional, *function*) The initialization callback function, executed before the main `callback` is invoked.  Does not receive access to variable shadows.

#### Examples:

##### Basic usage

```
$someElement.on('some_event', this.createShadowWrapper(function (ev) {
	/* main asynchronous code */
}));
```

##### With an optional `doneCallback`

```
$someElement.on('some_event', this.createShadowWrapper(
	function (ev) {
		/* main asynchronous code */
	},
	function (ev) {
		/* asynchronous code invoked after the main code */
	}
));
```

##### With an optional `doneCallback` and `startCallback`

```
$someElement.on('some_event', this.createShadowWrapper(
	function (ev) {
		/* main asynchronous code */
	},
	function (ev) {
		/* asynchronous code invoked after the main code */
	},
	function (ev) {
		/* asynchronous code invoked before the main code */
	}
));
```

<!-- *********************************************************************** -->

### `<MacroContext>.error(message)` → *boolean:false* {#macrocontext-api-prototype-method-error}

Renders the message prefixed with the name of the macro and returns `false`.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`message`:** (*string*) The error message to output.

#### Examples:

```
// Given: <<someMacro …>>
return this.error("oops");  → Outputs '<<someMacro>>: oops'
```
