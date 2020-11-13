<!-- ***********************************************************************************************
	Macro API
************************************************************************************************ -->
# `Macro` API {#macro-api}

<p role="note" class="see"><b>See Also:</b>
<a href="#macrocontext-api"><code>MacroContext</code> API</a>.
</p>

<!-- *********************************************************************** -->

### `Macro.add(name , definition)` {#macro-api-method-add}

Add new macro(s).

#### History:

* `v2.0.0`: Introduced
* `v2.33.0`: Obsoleted the `deep` parameter.

#### Parameters:

* **`name`:** (*string* | *string array*) Name, or array of names, of the macro(s) to add.  **NOTE:** Names must consist of characters from the basic Latin alphabet and start with a letter, which may be optionally followed by any number of letters, numbers, the underscore, or the hyphen.
* **`definition`:** (*object* | *string*) Definition of the macro(s) or the name of an existing macro whose definition to copy.

#### Definition object:

A macro definition object should have some of the following properties (only `handler` is absolutely required):

* **`skipArgs`:** (optional, *boolean* | *string array*) Disables parsing argument strings into discrete arguments.  Used by macros that only use the raw/full argument strings.  Boolean `true` to affect all tags or an array of tag names to affect.
* **`tags`:** (optional, *null* | *string array*) Signifies that the macro is a container macro—i.e., not self-closing.  An array child tag names or `null`, if there are no child tags.
* **`handler`:** (*function*) The macro's main function.  It will be called without arguments, but with its `this` set to a [macro context object](#macrocontext-api).

Additional properties may be added for internal use.

#### Examples:

```
/*
	Example of a very simple/naive <<if>>/<<elseif>>/<<else>> macro implementation.
*/
Macro.add('if', {
	skipArgs : true,
	tags     : ['elseif', 'else'],
	handler  : function () {
		try {
			for (var i = 0, len = this.payload.length; i < len; ++i) {
				if (
					this.payload[i].name === 'else' ||
					!!Scripting.evalJavaScript(this.payload[i].args.full)
				) {
					jQuery(this.output).wiki(this.payload[i].contents);
					break;
				}
			}
		}
		catch (ex) {
			return this.error('bad conditional expression: ' + ex.message);
		}
	}
});
```

<!-- *********************************************************************** -->

### `Macro.delete(name)` {#macro-api-method-delete}

Remove existing macro(s).

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string* | *string array*) Name, or array of names, of the macro(s) to remove.

#### Examples:

```
Macro.delete("amacro")
Macro.delete(["amacro", "bmacro"])
```

<!-- *********************************************************************** -->

### `Macro.get(name)` → *object* {#macro-api-method-get}

Return the named macro definition, or `null` on failure.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the macro whose definition should be returned.

#### Examples:

```
Macro.get("print")
```

<!-- *********************************************************************** -->

### `Macro.has(name)` → *boolean* {#macro-api-method-has}

Returns whether the named macro exists.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the macro to search for.

#### Examples:

```
Macro.has("print")
```

<!-- *********************************************************************** -->

### `Macro.tags.get(name)` → *string array* {#macro-api-method-tags-get}

Return the named macro tag's parents array (includes the names of all macros who have registered the tag as a child), or `null` on failure.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the macro tag whose parents array should be returned.

#### Examples:

```
Macro.tags.get("else")  → For the standard library, returns: ["if"]
```

<!-- *********************************************************************** -->

### `Macro.tags.has(name)` → *boolean* {#macro-api-method-tags-has}

Returns whether the named macro tag exists.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the macro tag to search for.

#### Examples:

```
Macro.tags.has("else")
```
