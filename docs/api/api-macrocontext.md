<!-- ***************************************************************************
	MacroContext API
**************************************************************************** -->
<h1 id="macrocontext-api"><code>MacroContext</code> API</h1>

<p role="note" class="see"><b>See Also:</b>
<a href="#macro-api"><code>Macro</code> API</a>.
</p>

Macro handlers are called with no arguments, but with their `this` set to a macro (execution) context object.  Macro context objects contain the following data and method properties.

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-args"></span>
### `<MacroContext>.args` → *array*

The argument string parsed into an array of discrete arguments.

#### Since:

* `v2.0.0`

#### Examples:

```
// Given: <<someMacro "a" "b" "c">>
this.args.length  → Returns 3
this.args[0]      → Returns 'a'
this.args[1]      → Returns 'b'
this.args[2]      → Returns 'c'
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-args-full"></span>
### `<MacroContext>.args.full` → *string*

The argument string after converting all TwineScript syntax elements into their native JavaScript counterparts.

#### Since:

* `v2.0.0`

#### Examples:

```
// Given: <<if "a" is "b">>
this.args.full  → Returns '"a" === "b"'
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-args-raw"></span>
### `<MacroContext>.args.raw` → *string*

The unprocessed argument string.

#### Since:

* `v2.0.0`

#### Examples:

```
// Given: <<if "a" is "b">>
this.args.raw  → Returns '"a" is "b"'
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-name"></span>
### `<MacroContext>.name` → *string*

The name of the macro.

#### Since:

* `v2.0.0`

#### Examples:

```
// Given: <<someMacro …>>
this.name  → Returns 'someMacro'
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-output"></span>
### `<MacroContext>.output` → *`HTMLElement` object*

The current output element.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-parent"></span>
### `<MacroContext>.parent` → *null* | *object*

The (execution) context object of the macro's parent, or `null` if the macro has no parent.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-parser"></span>
### `<MacroContext>.parser` → *object*

The parser instance that generated the macro call.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-payload"></span>
### `<MacroContext>.payload` → *null* | *array*

The text of a container macro parsed into discrete payload objects by tag.  Payload objects have the following properties:

* **`name`:** (*string*) Name of the current tag.
* **`args`:** (*array*) The current tag's argument string parsed into an array of discrete arguments.  Equivalent in function to [`<MacroContext>.args`](#macrocontext-api-prototype-property-args).
	* **`args.full`:** (*string*) The current tag's argument string after converting all TwineScript syntax elements into their native JavaScript counterparts.  Equivalent in function to [`<MacroContext>.args.full`](#macrocontext-api-prototype-property-args-full).
	* **`args.raw`:** (*string*) The current tag's unprocessed argument string.  Equivalent in function to [`<MacroContext>.args.raw`](#macrocontext-api-prototype-property-args-raw).
* **`contents`:** (*string*) The current tag's contents—i.e., the text between the current tag and the next.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-property-self"></span>
### `<MacroContext>.self` → *object*

The macro's definition—created via [`Macro.add()`](#macro-api-method-add).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-method-contexthas"></span>
### `<MacroContext>.contextHas(filter)` → *boolean*

Returns whether any of the macro's ancestors passed the test implemented by the given filter function.

#### Since:

* `v2.0.0`

#### Parameters:

* **`filter`:** (*function*) The function used to test each ancestor execution context object, which is passed in as its sole parameter.

#### Examples:

```
var includeAncestor = function (ctx) { return ctx.name === "include"; };
this.contextHas(includeAncestor);  → Returns true if any ancestor was an <<include>> macro
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-method-contextselect"></span>
### `<MacroContext>.contextSelect(filter)` → *null* | *object*

Returns the first of the macro's ancestors that passed the test implemented by the given filter function or `null`, if no members pass.

#### Since:

* `v2.0.0`

#### Parameters:

* **`filter`:** (*function*) The function used to test each ancestor execution context object, which is passed in as its sole parameter.

#### Examples:

```
var includeAncestor = function (ctx) { return ctx.name === "include"; };
this.contextSelect(includeAncestor);  → Returns the first <<include>> macro ancestor
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-method-contextselectall"></span>
### `<MacroContext>.contextSelectAll(filter)` → *object array*

Returns a new array containing all of the macro's ancestors that passed the test implemented by the given filter function or an empty array, if no members pass.

#### Since:

* `v2.0.0`

#### Parameters:

* **`filter`:** (*function*) The function used to test each ancestor execution context object, which is passed in as its sole parameter.

#### Examples:

```
var includeAncestor = function (ctx) { return ctx.name === "include"; };
this.contextSelectAll(includeAncestor);  → Returns an array of all <<include>> macro ancestors
```

<!-- *********************************************************************** -->

<span id="macrocontext-api-prototype-method-createshadowwrapper"></span>
### `<MacroContext>.createShadowWrapper(callback [, doneCallback [, startCallback]])` → *function*

Returns a callback function that wraps the specified callback functions to provide access to the variable shadowing system used by the [`<<capture>>` macro](#macros-macro-capture).

<p role="note" class="note"><b>Note:</b>
All of the specified callbacks are invoked as the wrapper is invoked—meaning, with their <code>this</code> set to the <code>this</code> of the wrapper and with whatever parameters were passed to the wrapper.
</p>

<p role="note" class="warning"><b>Warning:</b>
Only useful when you have an asynchronous callback that invokes code/content that needs to access story and/or temporary variables shadowed by <code>&lt;&lt;capture&gt;&gt;</code>.  If you don't know what that means, then this API is likely not for you.
</p>

#### Since:

* `v2.14.0`: Basic syntax.
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

<span id="macrocontext-api-prototype-method-error"></span>
### `<MacroContext>.error(message)` → *boolean:false*

Renders the message prefixed with the name of the macro and returns `false`.

#### Since:

* `v2.0.0`

#### Parameters:

* **`message`:** (*string*) The error message to output.

#### Examples:

```
// Given: <<someMacro …>>
return this.error("oops");  → Outputs '<<someMacro>>: oops'
```
