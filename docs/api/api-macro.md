<!-- ***********************************************************************************************
	Macro API
************************************************************************************************ -->
<h1 id="macro-api"><code>Macro</code> API</h1>

Sibling to the [`MacroContext` API](#macrocontext-api).

<!-- *********************************************************************** -->

<span id="macro-api-method-add"></span>
### `Macro.add(name , definition [, deep])`

Add new macro(s).

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (*string* | *string array*) Name, or array of names, of the macro(s) to add.  **NOTE:** Names must consist of characters from the basic Latin alphabet and start with a letter, which may be optionally followed by any number of letters, numbers, the underscore, or the hyphen.
* **`definition`:** (*object* | *string*) Definition of the macro(s) or the name of an existing macro whose definition to copy.
* **`deep`:** (optional, *boolean*) Enables deep cloning of the definition.  Used to give macros separate instances of the same definition.

#### Definition object:

A macro definition object should have some of the following properties (only `handler` is absolutely required):

* **`skipArgs`:** (optional, *boolean*) Disables parsing argument strings into discrete arguments.  Used by macros that only use the raw/full argument strings.
* **`tags`:** (optional, *null* | *string array*) Signifies that the macro is a container macro—i.e. not self-closing.  An array of the names of the child tags, or `null` if there are no child tags.
* **`handler`:** (*function*) The macro's main function.  It will be called without arguments, but with its `this` set to a [macro context object](#macrocontext-api).

Additional properties may be added for internal use.

#### Example:

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

<span id="macro-api-method-delete"></span>
### `Macro.delete(name)`

Remove existing macro(s).

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (*string* | *string array*) Name, or array of names, of the macro(s) to remove.

#### Example:

```
Macro.delete("amacro")
Macro.delete(["amacro", "bmacro"])
```

<!-- *********************************************************************** -->

<span id="macro-api-method-get"></span>
### `Macro.get(name)` → *object*

Return the named macro definition, or `null` on failure.

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (*string*) Name of the macro whose definition should be returned.

#### Example:

```
Macro.get("print")
```

<!-- *********************************************************************** -->

<span id="macro-api-method-has"></span>
### `Macro.has(name)` → *boolean*

Returns whether the named macro exists.

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (*string*) Name of the macro to search for.

#### Example:

```
Macro.has("print")
```

<!-- *********************************************************************** -->

<span id="macro-api-method-tags-get"></span>
### `Macro.tags.get(name)` → *string array*

Return the named macro tag's parents array (includes the names of all macros who have registered the tag as a child), or `null` on failure.

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (*string*) Name of the macro tag whose parents array should be returned.

#### Example:

```
Macro.tags.get("else")  → For the standard library, returns: ["if"]
```

<!-- *********************************************************************** -->

<span id="macro-api-method-tags-has"></span>
### `Macro.tags.has(name)` → *boolean*

Returns whether the named macro tag exists.

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (*string*) Name of the macro tag to search for.

#### Example:

```
Macro.tags.has("else")
```
