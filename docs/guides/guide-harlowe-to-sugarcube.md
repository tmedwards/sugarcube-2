<!-- ***********************************************************************************************
	Guide: Harlowe to SugarCube
************************************************************************************************ -->
# Guide: Harlowe to SugarCube {#guide-harlowe-to-sugarcube}

There are many differences between Harlowe and SugarCube, this guide will document some of the most critical you will need to account for if you're coming to SugarCube from a background in Harlowe.


<!-- ***************************************************************************
	Macro Overview
**************************************************************************** -->
## Macro Overview {#guide-harlowe-to-sugarcube-macro-overview}

Aside from general syntax, SugarCube macros do not use hooks, separate arguments differently, and don't allow other macros to be passed as arguments.

### Macro Arguments

Like in Harlowe, some SugarCube macros accept expressions and others accept discreet arguments.  In SugarCube, discreet arguments passed to a macro are separated by spaces instead of commas.  To pass expressions or the results of functions to macros as an argument, you must wrap the expression in backquotes (`` ` ``).

Additionally, macros in SugarCube do not return values, so macros cannot be used as arguments to other macros.  SugarCube provides a variety of functions and methods that may be used instead, and standard JavaScript functions and methods may also be used.

Consider the following Harlowe code:

```
(link-goto: "Go somewhere else", (either: "this passage", "that passage", "the other passage"))
```

A version of the above code in SugarCube might look like this:

```
<<link "Go somewhere else" `either("this passage", "that passage", "the other passage")`>><</link>>
```

<p role="note" class="see"><b>See:</b>
<a href="#macros-arguments">Macro Arguments</a>.
</p>

### Container Macros

Where Harlowe uses its hook syntax (square brackets) to associate a macro with its contents, SugarCube instead uses "container" macros—macros that can have content associated with them have opening and closing tags.

Consider the following Harlowe code:

```
(if: $var is 1)[
	The variable is 1.
]
```

In SugarCube, you instead open and close the [`<<if>>`](#macros-macro-if) macro itself:

```
<<if $var is 1>>
	The variable is 1.
<</if>>
```


<!-- ***************************************************************************
	Specific Macros
**************************************************************************** -->
## Specific Macros {#guide-harlowe-to-sugarcube-specific-macros}

Some macros in Harlowe and SugarCube share a name but work a bit differently.  We'll cover some of these differences below.

### Link and Click Macros

SugarCube does not have any equivalents to Harlowe's `(click:)` family of macros.  Additionally, SugarCube's normal [`<<link>>`](#macros-macro-link) macro does not have an output element associated with it and is not, by default, a single-use link like its Harlowe equivalent.  Both of these features can be constructed in SugarCube, however, using macros like [`<<linkreplace>>`](#macros-macro-linkreplace) or by combining `<<link>>` macros with [DOM macros](#macros-dom).  Additionally, SugarCube's link macro accepts a passage argument, that, if included, turns any `<<link>>` into something similar to Harlowe's `(link-goto:)` macro.

Consider the following Harlowe link macros:

```
(link: "Hey there.")[Hay is for horses.]
(link-repeat: "Get some money")[(set: $cash to it + 1)]
(link-goto: "Move on", "next passage")
```

The equivalent SugarCube code for each link might look something like this:

```
<<linkreplace "Hey there.">>Hay is for horses.<</linkreplace>>
<<link "Get some money">><<set $cash += 1>><</link>>
<<link "Move on" "next passage">><</link>>
```

SugarCube's `<<link>>` and `<<button>>` macros can also accept the link markup as an argument:

```
<<link [[Move on|next passage]]>><</link>>
```

### DOM Macros

<p role="note"><b>Note:</b>
Harlowe refers to these as "revision macros".
</p>

SugarCube's DOM macros can target any HTML element on the page, not just hooks, and unlike their Harlowe equivalents, they cannot target arbitrary strings.  You can use custom style markup or HTML to create the elements, and then target them with a query selector.

Consider the following Harlowe code:

```
(set: _greetings to (a: "hi", "hello", "good day", "greetings"))\
The man says, "|target>[(either: ..._greetings)]."

{
(link-repeat: "Change")[
	(replace: ?target)[(either: ..._greetings)]
]
}
```

The equivalent SugarCube code to achieve a similar result would be:

```
<<set _greetings to ["hi", "hello", "good day", "greetings"]>>\
The man says, "@@#target;<<= _greetings.random()>>@@."

<<link "Change">>
	<<replace "#target">><<= _greetings.random()>><</replace>>
<</link>>
```

<p role="note"><b>Note:</b>
The <a href="#macros-dom">DOM macros</a> do have a limitation that you should familiarize yourself with.
</p>

### The Goto Macro

Harlowe's implementation of the `(goto:)` macro terminates the rendering passage.  In SugarCube, the passage is not terminated, and anything in the code below the [`<<goto>>`](#macros-macro-goto) macro will have side effects.

Consider this Harlowe code:

```
:: some passage
(set: $count to 0)
(goto: "next")
(set: $count to it + 1)

:: next
$count <!-- 0 -->
```

In the above, the second `(set:)` macro is never run, and the `$count` variable remains at 0.

The equivalent SugarCube code works a bit differently:

```
:: some passage
<<set $count to 0>>
<<goto "next">>
<<set $count += 1>>

:: next
$count /* 1 */
```

SugarCube does not terminate the parsing of the calling passage, so some care is required when calling `<<goto>>`.

As with `<<link>>` and `<<button>>`, `<<goto>>` can accept link markup as its argument:

```
<<goto [[next]]>>
```

<!-- ***************************************************************************
	User Input
**************************************************************************** -->
## User Input {#guide-harlowe-to-sugarcube-user-input}

SugarCube's user input macros, like [`<<textbox>>`](#macros-macro-textbox), cannot be nested inside a [`<<set>>`](#macros-macro-set) macro, as you might do with a `(prompt:)` and a `(set:)` in Harlowe.  Instead, the macro is passed a *receiver variable* which is set to the value input by the user.

For example, if you wanted to ask the user to enter a name, your code may look like this in Harlowe:

```
(set: $name to (prompt: "What is your name?", "Frank"))
```

In SugarCube, you would likely want to use the `<<textbox>>` macro instead, and pass `$name` in as the receiving variable:

```
<label>What is your name? <<textbox "$name" "Frank">></label>
```

Harlowe's newer input macros, like `(dropdown:)` and `(cycling-link:)` use "bound" variables, which are similar in concept to SugarCube's receiver variables.


<!-- ***************************************************************************
	Data Types
**************************************************************************** -->
## Data Types {#guide-harlowe-to-sugarcube-data-types}

Harlowe's implementation of data types differs significantly from SugarCube's.  A data type refers to the "type" of data a variable is holding, such as a number, a string, an array, or anything else.  Harlowe has stricter typing than SugarCube, requiring authors to call macros like `(str:)` or `(num:)` on variables to change their type.  SugarCube, like JavaScript, uses *dynamic* typing.

### Dynamic Typing

SugarCube, like JavaScript, will try to make sense of expressions passed to it by *coercing* their values if necessary:

```
<<set $number to 1>>
<<set $string to "2">>
<<= $string + $number>> /* "21" */
```

In the above case, since the string value `"2"` cannot be added to a number value, the number value is *coerced* into a string, and the two strings are then *concatenated*.  In Harlowe, the same operation will yield an error:

```
(set: $number to 1)
(set: $string to "2")
(print: $string + $number) <!-- error! -->
```

You *must* convert the values to the same type in Harlowe.  In SugarCube you *can* convert them if you need to.

In Harlowe:

```
(set: $number to 1)
(set: $string to "2")
(print: $string + $number) <!-- error! -->
(print: $string + (str: $number)) <!-- "21" -->
(print: (num: $string) + $number) <!-- 3 -->
```

In SugarCube:

```
<<set $number to 1>>
<<set $string to "2">>
<<= $string + $number>> /* "21" */
<<= $string + String($number)>> /* "21" */
<<= Number($string) + $number>> /* 3 */
```

### Arrays, Datamaps, and Datasets

Harlowe's arrays, datamaps, and datasets are functionally similar to JavaScript `Array`s, `Map`s, and `Set`s, but with a few key differences.  SugarCube requires authors to define and work with these data types using the standard JavaScript methods rather than providing macros for them.

Using an array in Harlowe:

```
(set: $array to (a:))
(set: $array to it + (a: "something"))
(if: $array contains "something")[…]
```

In SugarCube:

```
<<set $array to []>>
<<run $array.push("something")>>
<<if $array.includes("something")>>…<</if>>
```

Using a datamap in Harlowe:

```
(set: $map to (dm: "key", "value"))
(set: $map's key to "another value")
(if: $map contains key)[…]
```

In SugarCube:

```
<<set $map to new Map([["key", "value"]])>>
<<run $map.set("key", "another value")>>
<<if $map.has("key")>>…<</if>>
```

SugarCube also allows the use of JavaScript generic objects, which may be better in some situations than a map:

```
<<set $object to { key : "value" }>>
<<set $object.key to "another value">>
<<if $object.hasOwnProperty("key")>>…<</if>>
```

Another important difference in the way Harlowe handles its non-primitive data types like arrays, datamaps, and datasets is that they are *passed by value* rather than *passed by reference*.

Consider the following Harlowe code:

```
(set: $player to (dm: "hp", 100, "mp", 50))
(set: $partyMember to $player)
(set: $partyMember's hp to it - 50)
(print: $player's hp) <!-- 100 -->
(print: $partyMember's hp) <!-- 50 -->
```

As you can see, Harlowe creates a deep copy/clone of its non-primitive data types each time they're modified.

In SugarCube, both variables would still point to the same underlying object—at least initially (see below):

```
<<set $player to { hp : 100, mp : 50 }>>
<<set $partyMember to $player>>
<<set $partyMember.hp -= 50>>
$player.hp /* 50 */
$partyMember.hp /* 50 */
```

SugarCube does eventually clone its non-primitive data types as well, but does at the start of passage navigation, rather than each time they're modified.
