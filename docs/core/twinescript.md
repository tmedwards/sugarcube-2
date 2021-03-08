<!-- ***********************************************************************************************
	TwineScript
************************************************************************************************ -->
# TwineScript {#twinescript}

TwineScript in SugarCube is, essentially, JavaScript with an extra spoonful of sugar on top to make it a bit nicer for the uninitiated.


<!-- ***************************************************************************
	Variables
**************************************************************************** -->
## Variables {#twinescript-variables}

<p role="note"><b>Note:</b>
Temporary variables were added in <code>v2.3.0</code>.
</p>

A variable is a bit of storage where you may stash a value for later use.  In SugarCube, they come in two types: story variables and temporary variables.  Story variables are a part of the story history and exist for the lifetime of a playthrough session.  Temporary variables do not become part of the story history and only exist for the lifetime of the moment/turn that they're created in.  You'll likely use story variables most often throughout your project—though, temporary variables are perfect candidates for things like loop variables, if you're using the [`<<for>>`](#macros-macro-for) macro.

For example, you might use the story variable `$name` to store the main player character's name or the story variable `$cash` to store how much money the player has on hand.

Values may be of most primitive types and some object types, see [Supported Types](#twinescript-supported-types) for more information.

### Variable Names

The names of both story and temporary variables have a certain format that they must follow—which signifies that they are variables and not some other kind of data.

The very first, and mandatory, character is their sigil, which denotes whether they are a story or temporary variable.  The sigil must be a dollar sign (`$`) for story variables or an underscore (`_`) for temporary variables.

The second, and also mandatory, character of the variable name may be one of the following: the letters A though Z (in upper or lower case), the dollar sign, and the underscore (i.e., `A-Za-z$_`)—after their initial use as the sigil, the dollar sign and underscore become regular variable characters.

Subsequent, optional, characters have the same set as the second with the addition of numerals (i.e., `0-9`, so the full set is `A-Za-z0-9$_`).  No other characters are allowed.

A few examples of valid names:

```
/* Story variables */
$cash
$hasKeyCard5
$met_alice
$TIMES_POKED_MR_BEAR

/* Temporary variables */
_i
_something2
_some_loop_value
_COUNT
```

### Using Variables

<p role="note"><b>Note:</b>
This is not an exhaustive list.  There are many ways to use and interact with variables.
</p>

To modify the values contained within variables, see the [`<<set>>`](#macros-macro-set) macro and [setter links](#markup-link).

To print the values contained within variables, see the [naked variable markup](#markup-naked-variable) and the [`<<print>>`](#macros-macro-print), [`<<=>>`](#macros-macro-equal), and [`<<->>`](#macros-macro-hyphen) macros.

To control aspects of your project based on the values contained within variables, see the [`<<if>>`](#macros-macro-if) and [`<<switch>>`](#macros-macro-switch) macros.


<!-- ***************************************************************************
	Supported Types
**************************************************************************** -->
## Supported Types {#twinescript-supported-types}

The following types of values are natively supported by SugarCube and may be safely used within story and temporary variables.

### Primitives

* Booleans—e.g., `true` &amp; `false`
* Numbers—e.g., `42`, `3.14`,  &amp; `-17.01`
* Strings—e.g., `"I like pie"` &amp; `'You like pie'`
* `null`
* `undefined`

### Objects

* `Array`
* `Date`
* `Map`
* `Set`
* Generic objects

Any supported object type may itself contain any supported primitive or object type.

<p role="note" class="warning"><b>Warning:</b>
Neither ES5 property attributes—which includes getters/setters—nor symbol properties are directly supported in generic objects stored within story variables.  If you need such features, then you'll need to use a non-generic object (a.k.a. a class).
</p>

<div role="note" class="warning"><b>Warning:</b>
<p>Functions, including non-instance methods, are not directly supported within story variables because of a few issues.</p>
<ol>
	<li>A function's scope <strong><em>cannot</em></strong> be restored.  Thus, if your function depends upon its scope, then it will not work properly when revived from sessions or saves.</li>
	<li>Function behavior is immutable.  Thus, storing them within story variables is generally wasteful.</li>
</ol>
<p>Methods of class instances are not affected by either issue, as they're never actually stored within story variables, being on their classes' prototypes.</p>
</div>

Unsupported object types, either native or custom, can be made compatible by implementing `.clone()` and `.toJSON()` methods for them—see the [*Non-generic object types (a.k.a. classes)* guide](#guide-tips-non-generic-object-types) for more information.


<!-- ***************************************************************************
	Expressions
**************************************************************************** -->
## Expressions {#twinescript-expressions}

<p role="note" class="see"><b>See Also:</b>
While not specifically about SugarCube, the <a href="https://twinery.org/wiki/expression">About Expressions</a> section of the <a href="https://twinery.org/wiki/twine1:reference">Twine&nbsp;1 reference documentation</a> may also be helpful.
</p>

Expressions are simply units of code that yield values when evaluated.  For example:

```
2 + 2       → Yields: 4
"a" + "bc"  → Yields: "abc"
turns()     → Yields: 1 (assuming that it is the first turn)
```

While every valid expression—even those you might not expect—yields a value, there are essentially two types of expressions: those with side effects and those without.  A side effect simply means that the evaluation of the expression modifies some state.  For example:

```
$a = 5   → Yields: 5; Side effect: assigns 5 to the story variable $a
$x + 10  → Yields: 25 (assuming $x is 15); No side effects
```

In general, you can group expressions into categories based on what kind of value they yield and/or what side effects they cause.  For example: *(not an exhaustive list)*

* Arithmetic: The expression yields a number value—e.g., `42` or `3.14`.
* String: The expression yields a string value—e.g., `"Lulamoon"` or `"5678"`.
* Logical: The expression yields a boolean value—e.g., `true` or `false`.
* Assignment: The expression causes an assignment to occur—e.g., `$a = 5`.

### Using Expressions

You will, in all likelihood, use expressions most often within macros—e.g., [`<<set>>`](#macros-macro-set), [`<<print>>`](#macros-macro-print), [`<<if>>`](#macros-macro-if), [`<<for>>`](#macros-macro-for).
