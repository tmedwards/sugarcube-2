<!-- ***********************************************************************************************
	Methods
************************************************************************************************ -->
<h1 id="methods">Methods</h1>

Most of the methods listed below are SugarCube extensions, with the rest being either JavaScript natives or bundled library methods that are listed here for their utility—though, this is not an exhaustive list.

For more information see:

* [MDN's JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) for native JavaScript object methods—and more.
* [jQuery API reference](https://api.jquery.com/) for native jQuery methods.

Additionally.  SugarCube includes polyfills for virtually all JavaScript (ECMAScript) 5 &amp; 6 native object methods, so they may be safely used even if your project will be used in older browsers that do not natively support them.


<!-- ***************************************************************************
	Array
**************************************************************************** -->
<span id="methods-array"></span>
## Array Methods

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-concat"></span>
### `<Array>.concat(members…)` → *array*

Concatenates one or more members to the end of the base array and returns the result as a new array.  Does not modify the original.

#### Since: *native JavaScript method*

#### Parameters:

* **`members`:** (*any*) The members to concatenate.  Members that are arrays will be merged—i.e. their members will be concatenated, rather than the array itself.

#### Example:

```
// Given: $fruits1 = ["Apples", "Oranges"], $fruits2 = ["Pears", "Plums"]
$fruits1.concat($fruits2)            → Returns ["Apples", "Oranges", "Pears", "Plums"]
$fruits1.concat($fruits2, $fruits2)  → Returns ["Apples", "Oranges", "Pears", "Plums", "Pears", "Plums"]
$fruits1.concat("Pears")             → Returns ["Apples", "Oranges", "Pears"]
$fruits1.concat("Pears", "Pears")    → Returns ["Apples", "Oranges", "Pears", "Pears"]
$fruits1.concat($fruits2, "Pears")   → Returns ["Apples", "Oranges", "Pears", "Plums", "Pears"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-concatunique"></span>
### `<Array>.concatUnique(members…)` → *array*

Concatenates one or more unique members to the end of the base array and returns the result as a new array.  Does not modify the original.

#### Since:

* `v2.21.0`

#### Parameters:

* **`members`:** (*any*) The members to concatenate.  Members that are arrays will be merged—i.e. their members will be concatenated, rather than the array itself.

#### Example:

```
// Given: $fruits1 = ["Apples", "Oranges"], $fruits2 = ["Pears", "Plums"]
$fruits1.concatUnique($fruits2)            → Returns ["Apples", "Oranges", "Pears", "Plums"]
$fruits1.concatUnique($fruits2, $fruits2)  → Returns ["Apples", "Oranges", "Pears", "Plums"]
$fruits1.concatUnique("Pears")             → Returns ["Apples", "Oranges", "Pears"]
$fruits1.concatUnique("Pears", "Pears")    → Returns ["Apples", "Oranges", "Pears"]
$fruits1.concatUnique($fruits2, "Pears")   → Returns ["Apples", "Oranges", "Pears", "Plums"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-count"></span>
### `<Array>.count(needle [, position])` → *integer*

Returns the number of times that the given member was found within the array, starting the search at `position`.

#### Since:

* `v2.0.0`

#### Parameters:

* **`needle`:** (*any*) The member to count.
* **`position`:** (optional, *integer*) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Example:

```
// Given: $fruits = ["Apples", "Oranges", "Plums", "Oranges"]
$fruits.count("Oranges")     → Returns 2
$fruits.count("Oranges", 2)  → Returns 1
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-delete"></span>
### `<Array>.delete(needles…)` → *array*

Removes all instances of the given members from the array and returns a new array containing the removed members.

#### Since:

* `v2.5.0`

#### Parameters:

* **`needles`:** (*any* | *array*) The members to remove.  May be a list of members or an array.

#### Example:

```
// Given: $fruits = ["Apples", "Oranges", "Plums", "Oranges"]
$fruits.delete("Oranges")          → Returns ["Oranges", "Oranges"]; $fruits ["Apples", "Plums"]
$fruits.delete("Apples", "Plums")  → Returns ["Apples", "Plums"]; $fruits ["Oranges", "Oranges"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-deleteat"></span>
### `<Array>.deleteAt(indices…)` → *array*

Removes all of the members at the given indices from the array and returns a new array containing the removed members.

#### Since:

* `v2.5.0`

#### Parameters:

* **`indices`:** (*integer* | *array*) The indices of the members to remove.  May be a list of indices or an array.

#### Example:

```
// Given: $fruits = ["Apples", "Oranges", "Plums", "Oranges"]
$fruits.deleteAt(2)     → Returns ["Plums"]; $fruits ["Apples", "Oranges", "Oranges"]
$fruits.deleteAt(1, 3)  → Returns ["Oranges", "Oranges"]; $fruits ["Apples", "Plums"]
$fruits.deleteAt(0, 2)  → Returns ["Apples", "Plums"]; $fruits ["Oranges", "Oranges"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-deletewith"></span>
### `<Array>.deleteWith(predicate [, thisArg])` → *array*

Removes all of the members that pass the test implemented by the given predicate function from the array and returns a new array containing the removed members.

#### Since:

* `v2.25.0`

#### Parameters:

* **`predicate`:** (*function*) The function used to test each member.  It is called with three arguments:
	* **`value`:** (*any*) The member being processed.
	* **`index`:** (optional, *integer*) The index of member being processed.
	* **`array`:** (optional, *array*) The array being processed.
* **`thisArg`:** (optional, *any*) The value to use as `this` when executing `predicate`.

#### Example:

```
// Given: $fruits = ["Apples", "Apricots", "Oranges"]

→ Returns ["Apricots"]; $fruits ["Apples", "Oranges"]
$fruits.deleteWith(function (val) {
	return val === "Apricots";
})

→ Returns ["Apples", "Apricots"]; $fruits ["Oranges"]
$fruits.deleteWith(function (val) {
	return val.startsWith("Ap");
})

// Given: $fruits = [{ name : "Apples" }, { name : "Apricots" }, { name : "Oranges" }]

→ Returns [{ name : "Apricots" }]; $fruits [{ name : "Apples" }, { name : "Oranges" }]
$fruits.deleteWith(function (val) {
	return val.name === "Apricots";
})

→ Returns [{ name : "Apples" }, { name : "Apricots" }]; $fruits [{ name : "Oranges" }]
$fruits.deleteWith(function (val) {
	return val.name.startsWith("Ap");
})
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-first"></span>
### `<Array>.first()` → *any*

Returns the first member from the array.  Does not modify the original.

#### Since:

* `v2.27.0`

#### Parameters: *none*

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.first()  → Returns "Blueberry"
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-flat"></span>
### `<Array>.flat(depth)` → *array*

Returns a new array consisting of the source array with all sub-array elements concatenated into it recursively up to the given depth.  Does not modify the original.

#### Since: *native JavaScript method*

#### Parameters:

* **`depth`:** (optional, *integer*) The number of nested array levels should be flattened.  If omitted, will default to `1`.

#### Example:

```
// Given: $npa = [["Alfa", "Bravo"], [["Charlie", "Delta"], ["Echo"]], "Foxtrot"]

$npa.flat()   → Returns ["Alfa", "Bravo", ["Charlie", "Delta"], ["Echo"], "Foxtrot"]
$npa.flat(1)  → Returns ["Alfa", "Bravo", ["Charlie", "Delta"], ["Echo"], "Foxtrot"]
$npa.flat(2)  → Returns ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-flatmap"></span>
### `<Array>.flatMap(callback [, thisArg])` → *array*

Returns a new array consisting of the result of calling the given mapping function on every element in the source array and then concatenating all sub-array elements into it recursively up to a depth of `1`.  Does not modify the original.

**NOTE:** Identical to calling `<Array>.map(…).flat()`.

#### Since: *native JavaScript method*

#### Parameters:

* **`callback`:** (*function*) The function used to produce members of the new array.  It is called with three arguments:
	* **`value`:** (*any*) The member being processed.
	* **`index`:** (optional, *integer*) The index of member being processed.
	* **`array`:** (optional, *array*) The array being processed.
* **`thisArg`:** (optional, *any*) The value to use as `this` when executing `callback`.

#### Example:

```
// Given: $npa = ["Alfa", "Bravo Charlie", "Delta Echo Foxtrot"]

→ Returns ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"]
$npa.flatMap(function (val) {
	return val.split(" ");
})
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-includes"></span>
### `<Array>.includes(needle [, position])` → *boolean*

Returns whether the given member was found within the array, starting the search at `position`.

#### Since: *native JavaScript method*

#### Parameters:

* **`needle`:** (*any*) The member to find.
* **`position`:** (optional, *integer*) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
<<if $pies.includes("Cherry")>>…found Cherry pie…<</if>>
<<if $pies.includes("Pecan", 3)>>…found Pecan pie within ["Pecan", "Pumpkin"]…<</if>>
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-includesall"></span>
### `<Array>.includesAll(needles…)` → *boolean*

Returns whether all of the given members were found within the array.

#### Since:

* `v2.10.0`

#### Parameters:

* **`needles`:** (*any* | *array*) The members to find.  May be a list of members or an array.

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
<<if $pies.includesAll("Cherry", "Pecan")>>…found Cherry and Pecan pies…<</if>>

// Given: $search = ["Blueberry", "Pumpkin"]
<<if $pies.includesAll($search)>>…found Blueberry and Pumpkin pies…<</if>>
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-includesany"></span>
### `<Array>.includesAny(needles…)` → *boolean*

Returns whether any of the given members were found within the array.

#### Since:

* `v2.10.0`

#### Parameters:

* **`needles`:** (*any* | *array*) The members to find.  May be a list of members or an array.

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
<<if $pies.includesAny("Cherry", "Pecan")>>…found Cherry or Pecan pie…<</if>>

// Given: $search = ["Blueberry", "Pumpkin"]
<<if $pies.includesAny($search)>>…found Blueberry or Pumpkin pie…<</if>>
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-last"></span>
### `<Array>.last()` → *any*

Returns the last member from the array.  Does not modify the original.

#### Since:

* `v2.27.0`

#### Parameters: *none*

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.last()  → Returns "Pumpkin"
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-pluck"></span>
### `<Array>.pluck()` → *any*

Removes and returns a random member from the array.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.pluck()  → Removes and returns a random pie from the array
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-pluckmany"></span>
### `<Array>.pluckMany(want)` → *array*

Randomly removes the given number of members from the base array and returns the removed members as a new array.

#### Since:

* `v2.20.0`

#### Parameters:

* **`want`:** (optional, *integer*) The number of members to pluck.

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.pluckMany(3)  → Removes three random pies from the array and returns them as a new array
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-push"></span>
### `<Array>.push(members…)` → *number*

Appends one or more members to the end of the base array and returns its new length.

#### Since: *native JavaScript method*

#### Parameters:

* **`members`:** (*any*) The members to append.

#### Example:

```
// Given: $fruits = ["Apples", "Oranges"]
$fruits.push("Apples")  → Returns 3; $fruits ["Apples", "Oranges", "Apples"]

// Given: $fruits = ["Apples", "Oranges"]
$fruits.push("Plums", "Plums")  → Returns 4; $fruits ["Apples", "Oranges", "Plums", "Plums"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-pushunique"></span>
### `<Array>.pushUnique(members…)` → *number*

Appends one or more unique members to the end of the base array and returns its new length.

#### Since:

* `v2.21.0`

#### Parameters:

* **`members`:** (*any*) The members to append.

#### Example:

```
// Given: $fruits = ["Apples", "Oranges"]
$fruits.pushUnique("Apples")  → Returns 2; $fruits ["Apples", "Oranges"]

// Given: $fruits = ["Apples", "Oranges"]
$fruits.pushUnique("Plums", "Plums")  → Returns 3; $fruits ["Apples", "Oranges", "Plums"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-random"></span>
### `<Array>.random()` → *any*

Returns a random member from the array.  Does not modify the original.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.random()  → Returns a random pie from the array
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-randommany"></span>
### `<Array>.randomMany(want)` → *array*

Randomly selects the given number of unique members from the array and returns the selected members as a new array.  Does not modify the original.

#### Since:

* `v2.20.0`

#### Parameters:

* **`want`:** (optional, *integer*) The number of members to select.

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.randomMany(3)  → Returns a new array containing three unique random pies from the array
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-shuffle"></span>
### `<Array>.shuffle()` → *array*

Randomly shuffles the array.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
$pies.shuffle()  → Randomizes the order of the pies in the array
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-unshift"></span>
### `<Array>.unshift(members…)` → *number*

Prepends one or more members to the beginning of the base array and returns its new length.

#### Since: *native JavaScript method*

#### Parameters:

* **`members`:** (*any*) The members to append.

#### Example:

```
// Given: $fruits = ["Oranges", "Plums"]
$fruits.unshift("Oranges")  → Returns 3; $fruits ["Oranges", "Oranges", "Plums"]

// Given: $fruits = ["Oranges", "Plums"]
$fruits.unshift("Apples", "Apples")  → Returns 4; $fruits ["Apples", "Apples", "Oranges", "Plums"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-unshiftunique"></span>
### `<Array>.unshiftUnique(members…)` → *number*

Prepends one or more unique members to the beginning of the base array and returns its new length.

#### Since:

* `v2.21.0`

#### Parameters:

* **`members`:** (*any*) The members to append.

#### Example:

```
// Given: $fruits = ["Oranges", "Plums"]
$fruits.unshiftUnique("Oranges")  → Returns 2; $fruits ["Oranges", "Plums"]

// Given: $fruits = ["Oranges", "Plums"]
$fruits.unshiftUnique("Apples", "Apples")  → Returns 3; $fruits ["Apples", "Oranges", "Plums"]
```

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-contains"></span>
### <span class="deprecated">`<Array>.contains(needle [, position])` → *boolean*</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#methods-array-prototype-method-includes"><code>&lt;Array&gt;.includes()</code></a> method for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.10.0`: Deprecated in favor of `<Array>.includes()`.

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-containsall"></span>
### <span class="deprecated">`<Array>.containsAll(needles…)` → *boolean*</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#methods-array-prototype-method-includesall"><code>&lt;Array&gt;.includesAll()</code></a> method for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.10.0`: Deprecated in favor of `<Array>.includesAll()`.

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-containsany"></span>
### <span class="deprecated">`<Array>.containsAny(needles…)` → *boolean*</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#methods-array-prototype-method-includesany"><code>&lt;Array&gt;.includesAny()</code></a> method for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.10.0`: Deprecated in favor of `<Array>.includesAny()`.

<!-- *********************************************************************** -->

<span id="methods-array-prototype-method-flatten"></span>
### <span class="deprecated">`<Array>.flatten()` → *array*</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  See the <a href="#methods-array-prototype-method-flat"><code>&lt;Array&gt;.flat()</code></a> method for its replacement.  The exactly equivalent call is: <code>&lt;Array&gt;.flat(Infinity)</code>.
</p>

Returns a new array consisting of the flattened source array.  Does not modify the original.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.29.0`: Deprecated in favor of `<Array>.flat()`.


<!-- *********************************************************************** -->

<span id="methods-array-method-random"></span>
### <span class="deprecated">`Array.random(array)` → *any*</span>

<p role="note" class="warning"><b>Deprecated:</b>
This method has been deprecated and should no longer be used.  In general, look to the <a href="#methods-array-prototype-method-random"><code>&lt;Array&gt;.random()</code></a> method instead.  If you need a random member from an array-like object, use the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from"><code>Array.from()</code></a> method to convert it to an array, then use <code>&lt;Array&gt;.random()</code>.
</p>

Returns a random member from the array or array-like object.  Does not modify the original.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.20.0`: Deprecated.

#### Parameters:

* **`array`:** (*array*) The array to operate on.  May be an actual array or an array-like object.

#### Example:

```
// Given: $pies = ["Blueberry", "Cherry", "Cream", "Pecan", "Pumpkin"]
Array.random($pies)  → Returns a random pie from the array
```


<!-- ***************************************************************************
	JSON
**************************************************************************** -->
<span id="methods-json"></span>
## JSON Methods

<!-- *********************************************************************** -->

<span id="methods-json-method-revivewrapper"></span>
### `JSON.reviveWrapper(codeString [, reviveData])` → *array*

Returns the given code string, and optional data chunk, wrapped within the JSON deserialization revive wrapper.  Intended to allow authors to easily wrap their custom object types (a.k.a. classes) revival code and associated data within the revive wrapper, which should be returned from an object instance's `.toJSON()` method, so that the instance may be properly revived upon deserialization.

**SEE:** [Non-generic object types (a.k.a. classes)](#guide-tips-non-generic-object-types) for more detailed information.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.9.0`: Added `reviveData` parameter.

#### Parameters:

* **`codeString`:** (*string*) The revival code string to wrap.
* **`reviveData`:** (optional, *any*) The data that should be made available to the evaluated revival code during deserialization via the special `$ReviveData$` variable.  **WARNING:** Attempting to pass the value of an object instance's `this` directly as the `reviveData` parameter will trigger out of control recursion in the serializer, so a clone of the instance's own data must be passed instead.

#### Example:

```
JSON.reviveWrapper( /* valid JavaScript code string */ );             → Without data chunk
JSON.reviveWrapper( /* valid JavaScript code string */ , myOwnData);  → With data chunk

// E.g., Assume that you're attempting to revive an instance of a custom class named
//       `Character`, which is assigned to a story variable named `$pc`.  The call
//       to `JSON.reviveWrapper()` might look something like the following.
var ownData = {};
Object.keys(this).forEach(function (pn) { ownData[pn] = clone(this[pn]); }, this);
return JSON.reviveWrapper('new Character($ReviveData$)', ownData);
```


<!-- ***************************************************************************
	jQuery
**************************************************************************** -->
<span id="methods-jquery"></span>
## jQuery Methods

<!-- *********************************************************************** -->

<span id="methods-jquery-prototype-method-ariaclick"></span>
### `<jQuery>.ariaClick([options ,] handler)` → *`jQuery` object*

Makes the target element(s) WAI-ARIA-compatible clickables—meaning that various accessibility attributes are set and, in addition to mouse clicks, enter/return and spacebar key presses also activate them.  Returns a reference to the current `jQuery` object for chaining.

#### Since:

* `v2.0.0`

#### Parameters:

* **`options`:** (optional, *object*) The options to be used when creating the clickables.
* **`handler`:** (*function*) The callback to invoke when the target element(s) are activated.

#### Options object:

An options object should have some of the following properties:

* **`namespace`:** (*string*) A period-separated list of event namespaces.
* **`one`:** (*boolean*) Whether the clickables are single-use—i.e. the handler callback runs only once and then removes itself.  If omitted, defaults to `false`.
* **`selector`:** (*string*) A selector applied to the target element(s) to filter the descendants that triggered the event. If omitted or `null`, the event is always handled when it reaches the target element(s).
* **`data`:** (*any*) Data to be passed to the handler in [`event.data`](http://api.jquery.com/event.data/) when an event is triggered.
* **`controls`:** (*string*) Value for the `aria-controls` attribute.
* **`pressed`:** (*string*) Value for the `aria-pressed` attribute (valid values: `"true"`, `"false"`).
* **`label`:** (*string*) Value for the `aria-label` and `title` attributes.

#### Example:

```
// Given an existing element: <a id="so-clicky">Click me</a>
$('#so-clicky').ariaClick(function (event) {
	/* do stuff */
});

// Creates a basic link and appends it to the `output` element
$('<a>Click me</a>')
	.ariaClick(function (event) {
		/* do stuff */
	})
	.appendTo(output);

// Creates a basic button and appends it to the `output` element
$('<button>Click me</button>')
	.ariaClick(function (event) {
		/* do stuff */
	})
	.appendTo(output);

// Creates a link with options and appends it to the `output` element
$('<a>Click me</a>')
	.ariaClick({
		one   : true,
		label : 'This single-use link does stuff.'
	}, function (event) {
		/* do stuff */
	})
	.appendTo(output);
```

<!-- *********************************************************************** -->

<span id="methods-jquery-prototype-method-ariadisabled"></span>
### `<jQuery>.ariaDisabled(state)` → *`jQuery` object*

Changes the disabled state of the target WAI-ARIA-compatible clickable element(s).  Returns a reference to the current `jQuery` object for chaining.

**NOTE:** This method is meant to work with clickables created via [`<jQuery>.ariaClick()`](#methods-jquery-prototype-method-ariaclick) and may not work with clickables from other sources.  SugarCube uses `<jQuery>.ariaClick()` internally to handle all its various link markup and macros.

#### Since:

* `v2.26.0`

#### Parameters:

* **`state`:** (*boolean*) The disabled state to apply.  Truthy to disable the element(s), falsy to enable them.

#### Example:

```
// Given an existing WAI-ARIA-compatible clickable element with the ID "so-clicky"
$('#so-clicky').ariaDisabled(true)   → Disables the target element
$('#so-clicky').ariaDisabled(false)  → Enables the target element
````

<!-- *********************************************************************** -->

<span id="methods-jquery-prototype-method-ariaisdisabled"></span>
### `<jQuery>.ariaIsDisabled()` → *`boolean`*
Returns whether any of the target WAI-ARIA-compatible clickable element(s) are disabled.

**NOTE:** This method is meant to work with clickables created via [`<jQuery>.ariaClick()`](#methods-jquery-prototype-method-ariaclick) and may not work with clickables from other sources.  SugarCube uses `<jQuery>.ariaClick()` internally to handle all its various link markup and macros.

#### Since:

* `v2.26.0`

#### Parameters: *none*

#### Example:

```
// Given an existing WAI-ARIA-compatible clickable element with the ID "so-clicky"

// If "#so-clicky" is disabled:
$('#so-clicky').ariaIsDisabled()  → Returns true

// If "#so-clicky" is enabled:
$('#so-clicky').ariaIsDisabled()  → Returns false
```

<!-- *********************************************************************** -->

<span id="methods-jquery-method-wiki"></span>
### `jQuery.wiki(sources…)`

Wikifies the given content source(s) and discards the result.  If there were errors, an exception is thrown.  This is only really useful when you want to invoke a macro for its side-effects and aren't interested in its output.

#### Since:

* `v2.17.0`

#### Parameters:

* **`sources`:** (*string*) The list of content sources.

#### Example:

```
$.wiki('<<somemacro>>');  → Invokes the <<somemacro>> macro, discarding any output
```

<!-- *********************************************************************** -->

<span id="methods-jquery-prototype-method-wiki"></span>
### `<jQuery>.wiki(sources…)` → *`jQuery` object*

Wikifies the given content source(s) and appends the result to the target element(s).  Returns a reference to the current `jQuery` object for chaining.

#### Since:

* `v2.0.0`

#### Parameters:

* **`sources`:** (*string*) The list of content sources.

#### Example:

```
// Given an element: <div id="the-box"></div>
$('#the-box').wiki('Who //are// you?');  → Appends "Who <em>are</em> you?" to the target element
```


<!-- ***************************************************************************
	Math
**************************************************************************** -->
<span id="methods-math"></span>
## Math Methods

<!-- *********************************************************************** -->

<span id="methods-math-method-clamp"></span>
### `Math.clamp(num , min , max)` → *number*

Returns the given number clamped to the specified bounds.  Does not modify the original.

#### Since:

* `v2.0.0`

#### Parameters:

* **`num`:** (*number* | *string*) The number to clamp.  May be an actual number or a numerical string.
* **`min`:** (*integer*) The lower bound of the number.
* **`max`:** (*integer*) The upper bound of the number.

#### Example:

```
Math.clamp($stat, 0, 200)  → Clamps $stat to the bounds 0–200 and returns the new value
Math.clamp($stat, 1, 6.6)  → Clamps $stat to the bounds 1–6.6 and returns the new value
```

<!-- *********************************************************************** -->

<span id="methods-math-method-trunc"></span>
### `Math.trunc(num)` → *integer*

Returns the whole (integer) part of the given number by removing its fractional part, if any.  Does not modify the original.

#### Since:

* `v2.0.0`

#### Parameters:

* **`num`:** (*number*) The number to truncate to an integer.

#### Example:

```
Math.trunc(12.7)   → Returns 12
Math.trunc(-12.7)  → Returns -12
```


<!-- ***************************************************************************
	Number
**************************************************************************** -->
<span id="methods-number"></span>
## Number Methods

<!-- *********************************************************************** -->

<span id="methods-number-prototype-method-clamp"></span>
### `<Number>.clamp(min , max)` → *number*

Returns the number clamped to the specified bounds.  Does not modify the original.

#### Since:

* `v2.0.0`

#### Parameters:

* **`min`:** (*integer*) The lower bound of the number.
* **`max`:** (*integer*) The upper bound of the number.

#### Example:

```
$stat.clamp(0, 200)  → Clamps $stat to the bounds 0–200 and returns the new value
$stat.clamp(1, 6.6)  → Clamps $stat to the bounds 1–6.6 and returns the new value
```


<!-- ***************************************************************************
	RegExp
**************************************************************************** -->
<span id="methods-regexp"></span>
## RegExp Methods

<!-- *********************************************************************** -->

<span id="methods-regexp-method-escape"></span>
### `RegExp.escape(text)` → *string*

Returns the given string with all regular expression metacharacters escaped.  Does not modify the original.

#### Since:

* `v2.0.0`

#### Parameters:

* **`text`:** (*string*) The string to escape.

#### Example:

```
RegExp.escape('That will be $5 (cash only)')   → Returns 'That will be \$5 \(cash only\)'
```


<!-- ***************************************************************************
	String
**************************************************************************** -->
<span id="methods-string"></span>
## String Methods

<p role="note"><b>Note:</b>
Strings in TwineScript/JavaScript are Unicode, however, due to historic reasons they are comprised of, and indexed by, individual UTF-16 code units rather than code points.  This means that some code points may span multiple code units—e.g., the character 💩 is one code point, but two code units.
</p>

<!-- *********************************************************************** -->

<span id="methods-string-prototype-method-count"></span>
### `<String>.count(needle [, position])` → *integer*

Returns the number of times that the given substring was found within the string, starting the search at `position`.

#### Since:

* `v2.0.0`

#### Parameters:

* **`needle`:** (*any*) The substring to count.
* **`position`:** (optional, *integer*) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Example:

```
// Given: $text = "How now, brown cow."
$text.count("ow")     → Returns 4
$text.count("ow", 8)  → Returns 2
```

<!-- *********************************************************************** -->

<span id="methods-string-prototype-method-first"></span>
### `<String>.first()` → *string*

Returns the first Unicode code point within the string.  Does not modify the original.

**SEE:** [String Methods note](#methods-string).

#### Since:

* `v2.27.0`

#### Parameters: *none*

#### Example:

```
// Given: $text = "abc"
$text.first()  → Returns "a"

// Given: $text = "🙈🙉🙊"
$text.first()  → Returns "🙈"
```

<!-- *********************************************************************** -->

<span id="methods-string-method-format"></span>
### `String.format(format , arguments…)` → *string*

Returns a formatted string, after replacing each format item in the given format string with the text equivalent of the corresponding argument's value.

#### Since:

* `v2.0.0`

#### Parameters:

* **`format`:** (*string*) The format string, which consists of normal text and format items.
	* Format items have the syntax `{index[,alignment]}`, square-brackets denoting optional elements.
		* **`index`:** (*integer*) The (zero-based) index of the argument whose string representation will replace the format item.
		* **`alignment`:** (optional, *integer*) The total length of the field into which the argument is inserted, and whether it's right- or left-aligned (positive aligns right, negative aligns left).
* **`arguments`:** (*any* | *array*) Either a list of arguments, which correspond by-index to the format items within the format string, or an array, whose members correspond by-index.

#### Example:

```
String.format("{0}, {1}!", "Hello", "World")      → List of arguments; Returns "Hello, World!"
String.format("{0}, {1}!", [ "Hello", "World" ])  → Array argument; Returns "Hello, World!"
String.format("{0,6}", "foo")                     → Returns "   foo"
String.format("{0,-6}", "foo")                    → Returns "foo   "
```

<!-- *********************************************************************** -->

<span id="methods-string-prototype-method-includes"></span>
### `<String>.includes(needle [, position])` → *boolean*

Returns whether the given substring was found within the string, starting the search at `position`.

#### Since: *native JavaScript method*

#### Parameters:

* **`needle`:** (*any*) The substring to find.
* **`position`:** (optional, *integer*) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Example:

```
// Given: $text = "How now, brown cow."
$text.includes("row")      → Returns true
$text.includes("row", 14)  → Returns false
$text.includes("cow", 14)  → Returns true
$text.includes("pow")      → Returns false
```

<!-- *********************************************************************** -->

<span id="methods-string-prototype-method-last"></span>
### `<String>.last()` → *string*

Returns the last Unicode code point within the string.  Does not modify the original.

**SEE:** [String Methods note](#methods-string).

#### Since:

* `v2.27.0`

#### Parameters: *none*

#### Example:

```
// Given: $text = "abc"
$text.last()  → Returns "c"

// Given: $text = "🙈🙉🙊"
$text.last()  → Returns "🙊"
```

<!-- *********************************************************************** -->

<span id="methods-string-prototype-method-tolocaleupperfirst"></span>
### `<String>.toLocaleUpperFirst()` → *string*

Returns the string with its first Unicode code point converted to upper case, according to any locale-specific rules.  Does not modify the original.

**SEE:** [String Methods note](#methods-string).

#### Since:

* `v2.9.0`

#### Parameters: *none*

#### Example:

```
// Using the Turkish (Türkçe) locale and given: $text = "ışık"
$text.toLocaleUpperFirst()  → Returns "Işık"

// Using the Turkish (Türkçe) locale and given: $text = "iki"
$text.toLocaleUpperFirst()  → Returns "İki"
```

<!-- *********************************************************************** -->

<span id="methods-string-prototype-method-toupperfirst"></span>
### `<String>.toUpperFirst()` → *string*

Returns the string with its first Unicode code point converted to upper case.  Does not modify the original.

**SEE:** [String Methods note](#methods-string).

#### Since:

* `v2.9.0`

#### Parameters: *none*

#### Example:

```
// Given: $text = "hello."
$text.toUpperFirst()  → Returns "Hello."

// Given: $text = "χαίρετε."
$text.toUpperFirst()  → Returns "Χαίρετε."
```
