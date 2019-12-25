<!-- ***********************************************************************************************
	Macros
************************************************************************************************ -->
<h1 id="macros">Macros</h1>


<!-- ***************************************************************************
	Macro Arguments
**************************************************************************** -->
<span id="macros-arguments"></span>
## Macro Arguments

Macros fall into two broad categories based on the kind of arguments they accept: those that want an expression—e.g., `<<set>>` and `<<print>>`—and those that want discrete arguments separated by whitespace—e.g., `<<link>>` and `<<audio>>`.  The documentation for each macro will tell you what it expects.

Those that want an expression are fairly straightforward, as you simply supply an [expression](#twinescript-expressions).

The discrete argument type of macros are also fairly straightforward, most of the time, as you simply supply the requisite arguments separated by whitespace.  There are cases, however, where things get a bit more complicated, namely: instances where you need to pass the name of a variable as an argument and those where you want to pass the result of an expression as argument.

#### Passing a variable's name as an argument

Passing the name of a variable as an argument is problematic because variable substitution occurs automatically in SugarCube macros.  Meaning that when you pass a variable as an argument, its value is passed to the macro rather than its name.

Normally, this is exactly what you want to happen.  Occasionally, however, macros will need the name of a variable rather than its value—e.g., data input macros like `<<textbox>>`—so that they may modify the variable.  To resolve these instances, you will need to quote the name of the variable—i.e. instead of passing `$pie` as normal, you'd pass `"$pie"`.  These, rare, instances are noted in the macros' documentation and shown in their examples.

#### Passing an expression as an argument

Passing the result of an expression as an argument is problematic for a couple of reasons: because the macro argument parser doesn't treat arguments as expressions by default and because it separates arguments with whitespace.

Normally, those aren't issues as you should not need to use the result of an expression as an argument terribly often.  To resolve instances where you do, however, you'll want to use either a temporary variable or a backquote expression.

For example, the following will not work because the macro parser will think that you're passing five discrete arguments, rather than a single expression:

```
<<link "Wake " + $friend + ".">> … <</link>>
```

You could solve the problem by using a temporary variable to hold the result of the expression, then pass that to the macro.  For example:

```
<<set _text to "Wake " + $friend + ".">>\
<<link _text>> … <</link>>
```

A better solution, however, would be to use a backquote<a href="#macros-arguments-backquote-fn1">1</a> (`` ` ``) expression, which is really just a special form of quoting available in macro arguments that causes the contents of the backquotes to be evaluated and then yields the result as a singular argument.  For example:

```
<<link `"Wake " + $friend + "."`>> … <</link>>
```

<ol class="note">
<li id="macros-arguments-backquote-fn1">A backquote is also known as a grave and is often paired with the tilde (<code>~</code>) on keyboards.</li>
</ol>


<!-- ***************************************************************************
	Variables Macros
**************************************************************************** -->
<span id="macros-variables"></span>
## Variables Macros

<!-- *********************************************************************** -->

<span id="macros-macro-capture"></span>
### `<<capture variableList>> … <</capture>>`

Captures story $variables and temporary \_variables, creating localized versions of their values within the macro body.

**NOTE:** Use of this macro is *only* necessary when you need to localize a variable's value for use with an asynchronous macro—i.e. a macro whose contents are executed at some later time, rather than when it's invoked; e.g., [interactive macros](#macros-interactive), [`<<repeat>>`](#macros-macro-repeat), [`<<timed>>`](#macros-macro-timed).  Generally, this means only when the variable's value will change between the time the asynchronous macro is invoked and when it's activated—e.g., a loop variable.

#### Since:

* `v2.14.0`

#### Arguments:

* **`variableList`:** A list of story $variables and/or temporary \_variables.

#### Example:

```
→ Using <<capture>> to localize a temporary loop variable for use within a <<linkappend>>
<<set _what to [
	"a crab rangoon",
	"a gaggle of geese",
	"an aardvark",
	"the world's smallest violin"
]>>
<<for _i to 0; _i lt _what.length; _i++>>
	<<capture _i>>
		I spy with my little <<linkappend "eye" t8n>>, _what[_i]<</linkappend>>.
	<</capture>>
<</for>>

→ Capturing several variables at once
<<capture $aStoryVar, $anotherStoryVar, _aTempVar>> … <</capture>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-set"></span>
### `<<set expression>>`

Sets story $variables and temporary \_variables based on the given expression.

#### Since:

* `v2.0.0`

#### Arguments:

* **`expression`:** A valid expression.  See [Variables](#twinescript-variables) and [Expressions](#twinescript-expressions) for more information.

#### TwineScript assignment operators:

<table>
<thead>
<tr>
<th>Operator</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>to</code></th>
<td>Assigns the value on the right-hand side of the operator to the left-hand side.</td>
<td><code>&lt;&lt;set $apples to 6&gt;&gt;</code></td>
</tr>
</tbody>
</table>

#### JavaScript assignment operators: *(not an exhaustive list)*

<table>
<thead>
<tr>
<th>Operator</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>=</code></th>
<td>Assigns the value on the right-hand side of the operator to the left-hand side.</td>
<td><code>&lt;&lt;set $apples = 6&gt;&gt;</code></td>
</tr>
<tr>
<th><code>+=</code></th>
<td>Adds the value on the right-hand side of the operator to the current value on the left-hand side and assigns the result to the left-hand side.</td>
<td><code>&lt;&lt;set $apples += 1&gt;&gt;</code></td>
</tr>
<tr>
<th><code>-=</code></th>
<td>Subtracts the value on the right-hand side of the operator from the current value on the left-hand side and assigns the result to the left-hand side.</td>
<td><code>&lt;&lt;set $apples -= 1&gt;&gt;</code></td>
</tr>
<tr>
<th><code>&#x2a;=</code></th>
<td>Multiplies the current value on the left-hand side of the operator by the value on the right-hand side and assigns the result to the left-hand side.</td>
<td><code>&lt;&lt;set $apples &#x2a;= 2&gt;&gt;</code></td>
</tr>
<tr>
<th><code>/=</code></th>
<td>Divides the current value on the left-hand side of the operator by the value on the right-hand side and assigns the result to the left-hand side.</td>
<td><code>&lt;&lt;set $apples /= 2&gt;&gt;</code></td>
</tr>
<tr>
<th><code>%=</code></th>
<td>Divides the current value on the left-hand side of the operator by the value on the right-hand side and assigns the remainder to the left-hand side.</td>
<td><code>&lt;&lt;set $apples %= 10&gt;&gt;</code></td>
</tr>
</tbody>
</table>

#### Example:

```
→ Using the TwineScript "to" operator
<<set $cheese to "a nice, sharp cheddar">>  → Assigns "a nice, sharp cheddar" to story variable $cheese
<<set $chestEmpty to true>>                 → Assigns boolean true to story variable $chestEmpty
<<set $gold to $gold + 5>>                  → Adds 5 to the value of story variable $gold
<<set _counter to _counter + 1>>            → Adds 1 to the value of temporary variable _counter

→ Using standard JavaScript operators
<<set $cheese = "a nice, sharp cheddar">>   → Assigns "a nice, sharp cheddar" to story variable $cheese
<<set $chestEmpty = true>>                  → Assigns boolean true to story variable $chestEmpty
<<set $gold += 5>>                          → Adds 5 to the value of story variable $gold
<<set _counter += 1>>                       → Adds 1 to the value of temporary variable _counter
```

<!-- *********************************************************************** -->

<span id="macros-macro-unset"></span>
### `<<unset variableList>>`

Unsets story $variables and temporary \_variables.

#### Since:

* `v2.0.0`

#### Arguments:

* **`variableList`:** A list of story $variables and/or temporary \_variables.

#### Example:

```
<<unset $cheese, $chestEmpty, $gold>>
<<unset _someTempVar>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-remember"></span>
### <span class="deprecated">`<<remember expression>>`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#functions-function-memorize"><code>memorize()</code></a> and <a href="#functions-function-recall"><code>recall()</code></a> functions for its replacement.
</p>

*Functionally identical to [`<<set>>`](#macros-macro-set), save that it also causes the values of story $variables to persist over page reloads, game restarts, and even browser restarts.  Does not cause temporary \_variables to persist.*

**NOTE:** Generally, you do not need, or want, to use `<<remember>>`, as it is only useful in very specific circumstances and problematic in most others.  Unless you *know* that you need to use it, you very likely do not.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.29.0`: Deprecated in favor of `memorize()` and `recall()`.

<!-- *********************************************************************** -->

<span id="macros-macro-forget"></span>
### <span class="deprecated">`<<forget variableList>>`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#functions-function-forget"><code>forget()</code></a> function for its replacement.
</p>

*Functionally identical to [`<<unset>>`](#macros-macro-unset), save that it also removes the story $variables from the  [`<<remember>>`](#macros-macro-remember) store.  Does not affect temporary \_variables.*

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.29.0`: Deprecated in favor of `forget()`.


<!-- ***************************************************************************
	Scripting Macros
**************************************************************************** -->
<span id="macros-scripting"></span>
## Scripting Macros

<!-- *********************************************************************** -->

<span id="macros-macro-run"></span>
### `<<run expression>>`

*Functionally identical to [`<<set>>`](#macros-macro-set).  Intended to be mnemonically better for uses where the expression is arbitrary code, rather than variables to set—i.e. `<<run>>` to run code, `<<set>>` to set variables.*

<!-- *********************************************************************** -->

<span id="macros-macro-script"></span>
### `<<script>> … <</script>>`

Silently executes its contents as *pure* JavaScript code—i.e. it performs no story or temporary variable substitution or TwineScript operator processing.  For instances where you need to run some pure JavaScript and don't want to waste time performing extra processing on code that has no story or temporary variables or TwineScript operators in it and/or worry about the parser possibly clobbering the code.

**NOTE:** The predefined variable `output`, which is a reference to a local content buffer, is available for use within the macro's code contents.  Once the code has been fully executed, the contents of the buffer, if any, will be output.

#### Since:

* `v2.0.0`

#### Arguments: *none*

#### Example:

```
→ Basic
<<script>>
	/* pure JavaScript code */
<</script>>

→ Modifying the content buffer
<<script>>
	/* Parse some markup and append the result to the output buffer. */
	$(output).wiki("Cry 'Havoc!', and let slip the //ponies// of ''friendship''.");
<</script>>
```


<!-- ***************************************************************************
	Display Macros
**************************************************************************** -->
<span id="macros-display"></span>
## Display Macros

<!-- *********************************************************************** -->

<span id="macros-macro-equal"></span>
### `<<= expression>>`

Outputs the result of the given expression.  This macro is an alias for [`<<print>>`](#macros-macro-print).

**NOTE:** If you only need to print the value of a TwineScript variable, then you may simply include it in your normal passage text and it will be printed automatically via the [naked variable markup](#markup-naked-variable).

#### Since:

* `v2.0.0`

#### Arguments:

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

#### Example:

```
→ Assuming $gold is 5
You found <<= $gold>> gold.             → Outputs: You found 5 gold.

→ Assuming $weight is 74.6466266
You weigh <<= $weight.toFixed(2)>> kg.  → Outputs: You weigh 74.65 kg.
```

<!-- *********************************************************************** -->

<span id="macros-macro-hyphen"></span>
### `<<- expression>>`

Outputs the result of the given expression.  This macro is functionally identical to [`<<print>>`](#macros-macro-print), save that it also encodes HTML special characters in the output.

**NOTE:** If you only need to print the value of a TwineScript variable, then you may simply include it in your normal passage text and it will be printed automatically via the [naked variable markup](#markup-naked-variable).

#### Since:

* `v2.0.0`

#### Arguments:

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

#### Example:

```
→ Assuming $gold is 5
You found <<- $gold>> gold.             → Outputs: You found 5 gold.

→ Assuming $weight is 74.6466266
You weigh <<- $weight.toFixed(2)>> kg.  → Outputs: You weigh 74.65 kg.
```

<!-- *********************************************************************** -->

<span id="macros-macro-include"></span>
### `<<include passageName [elementName]>>`<br>`<<include linkMarkup [elementName]>>`

Outputs the contents of the passage with the given name, optionally wrapping it within an HTML element.  May be called either with the passage name or with a link markup.

#### Since:

* `v2.15.0`

#### Arguments:

##### Passage name form

* **`passageName`:** The name of the passage to include.
* **`elementName`:** (optional) The HTML element to wrap the included passage in.  If used, the element will include the passage's name normalized into a class name.  See [CSS passage conversions](#css-passage-conversions) for more information.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).
* **`elementName`:** *Identical to the passage name form.*

#### Example:

```
<<include "Go West">>          → Include the passage "Go West"
<<include [[Go West]]>>        → Include the passage "Go West"
<<include "Go West" "div">>    → Include the passage "Go West", wrapping it within a <div>
<<include [[Go West]] "div">>  → Include the passage "Go West", wrapping it within a <div>
```

<!-- *********************************************************************** -->

<span id="macros-macro-nobr"></span>
### `<<nobr>> … <</nobr>>`

Executes its contents and outputs the result, after removing leading/trailing newlines and replacing all remaining sequences of newlines with single spaces.

**NOTE:** The [`nobr` special tag](#special-tag-nobr) and [`Config.passages.nobr` setting](#config-api-property-passages-nobr) applies the same processing to an entire passage or all passages, respectively.  The [line continuation markup](#markup-line-continuation) performs a similar function, though in a slightly different way.

#### Since:

* `v2.0.0`

#### Arguments: *none*

#### Example:

```
→ Given: $feeling eq "blue", outputs: I'd like a blueberry pie.
I'd like a <<nobr>>
<<if $feeling eq "blue">>
blueberry
<<else>>
cherry
<</if>>
<</nobr>> pie.
```

<!-- *********************************************************************** -->

<span id="macros-macro-print"></span>
### `<<print expression>>`

Outputs the result of the given expression.

**NOTE:** If you only need to print the value of a TwineScript variable, then you may simply include it in your normal passage text and it will be printed automatically via the [naked variable markup](#markup-naked-variable).

#### Since:

* `v2.0.0`

#### Arguments:

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

#### Example:

```
→ Assuming $gold is 5
You found <<print $gold>> gold.             → Outputs: You found 5 gold.

→ Assuming $weight is 74.6466266
You weigh <<print $weight.toFixed(2)>> kg.  → Outputs: You weigh 74.65 kg.
```

<!-- *********************************************************************** -->

<span id="macros-macro-silently"></span>
### `<<silently>> … <</silently>>`

Causes any output generated within its body to be discarded, except for errors (which will be displayed).  Generally, only really useful for formatting blocks of macros for ease of use/readability, while ensuring that no output is generated, from spacing or whatnot.

#### Since:

* `v2.0.0`

#### Arguments: *none*

#### Example:

```
→ Basic
<<silently>>

	You'll never see any of this!

<</silently>>

→ Hiding the guts of a countdown timer
<<set $seconds to 10>>\
Countdown: <span id="countdown">$seconds seconds remaining</span>!\
<<silently>>
	<<repeat 1s>>
		<<set $seconds to $seconds - 1>>
		<<if $seconds gt 0>>
			<<replace "#countdown">>$seconds seconds remaining<</replace>>
		<<else>>
			<<replace "#countdown">>Too Late<</replace>>
			/* do something useful here */
			<<stop>>
		<</if>>
	<</repeat>>
<</silently>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-display"></span>
### <span class="deprecated">`<<display passageName [elementName]>>`<br>`<<display linkMarkup [elementName]>>`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-include"><code>&lt;&lt;include&gt;&gt;</code></a> macro for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.15.0`: Deprecated in favor of `<<include>>`.


<!-- ***************************************************************************
	Control Macros
**************************************************************************** -->
<span id="macros-control"></span>
## Control Macros

<!-- *********************************************************************** -->

<span id="macros-macro-if"></span>
### `<<if conditional>> … [<<elseif conditional>> …] [<<else>> …] <</if>>`

Executes its contents if the given conditional expression evaluates to `true`.  If the condition evaluates to `false` and an `<<elseif>>` or `<<else>>` exists, then other contents can be executed.

**NOTE:** SugarCube does not trim whitespace from the contents of `<<if>>` macros, so that authors don't have to resort to various kludges to get whitespace where they want it.  This means, however, that extra care must be taken when writing them to ensure that unwanted whitespace is not created within the final output.

#### Since:

* `v2.0.0`

#### Arguments:

* **`conditional`:** A valid conditional expression, evaluating to either `true` or `false`.  See [Expressions](#twinescript-expressions) for more information.

#### TwineScript conditional operators:

<table>
<thead>
<tr>
<th>Operator</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>is</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same type and value." class="info"><em>strictly</em> equal</span>.</td>
<td><code>&lt;&lt;if $bullets is 6&gt;&gt;</code></td>
</tr>
<tr>
<th><code>isnot</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same type and/or value." class="info"><em>strictly</em> not equal</span>.</td>
<td><code>&lt;&lt;if $pie isnot "cherry"&gt;&gt;</code></td>
</tr>
<tr>
<th><code>eq</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same value or coerce into the same value." class="info">equivalent</span>.</td>
<td><code>&lt;&lt;if $bullets eq 6&gt;&gt;</code></td>
</tr>
<tr>
<th><code>neq</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same value nor do they coerce into the same value." class="info">not equivalent</span>.</td>
<td><code>&lt;&lt;if $pie neq "cherry"&gt;&gt;</code></td>
</tr>
<tr>
<th><code>gt</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than the right side.</td>
<td><code>&lt;&lt;if $cash gt 5&gt;&gt;</code></td>
</tr>
<tr>
<th><code>gte</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than or equal to the right side.</td>
<td><code>&lt;&lt;if $foundStars gte $neededStars&gt;&gt;</code></td>
</tr>
<tr>
<th><code>lt</code></th>
<td>Evaluates to <code>true</code> if the left side is less than the right side.</td>
<td><code>&lt;&lt;if $shoeCount lt ($peopleCount * 2)&gt;&gt;</code></td>
</tr>
<tr>
<th><code>lte</code></th>
<td>Evaluates to <code>true</code> if the left side is less than or equal to the right side.</td>
<td><code>&lt;&lt;if $level lte 30&gt;&gt;</code></td>
</tr>
<tr>
<th><code>not</code></th>
<td>Flips a <code>true</code> evaluation to <code>false</code>, and vice versa.</td>
<td><code>&lt;&lt;if not $hungry&gt;&gt;</code></td>
</tr>
<tr>
<th><code>and</code></th>
<td>Evaluates to <code>true</code> if all subexpressions evaluate to <code>true</code>.</td>
<td><code>&lt;&lt;if $age gte 20 and $age lte 30&gt;&gt;</code></td>
</tr>
<tr>
<th><code>or</code></th>
<td>Evaluates to <code>true</code> if any subexpressions evaluate to <code>true</code>.</td>
<td><code>&lt;&lt;if $friend is "Sue" or $friend is "Dan"&gt;&gt;</code></td>
</tr>
<tr>
<th><code>def</code></th>
<td>Evaluates to <code>true</code> if the right side is defined.</td>
<td><code>&lt;&lt;if def $mushrooms&gt;&gt;</code></td>
</tr>
<tr>
<th><code>ndef</code></th>
<td>Evaluates to <code>true</code> if the right side is not defined.</td>
<td><code>&lt;&lt;if ndef $bottlecaps&gt;&gt;</code></td>
</tr>
</tbody>
</table>

**NOTE:** The `def` and `ndef` operators have very low precedence, so it is ***strongly*** recommended that if you mix them with other operators, that you wrap them in parentheses—e.g., `(def $style) and ($style is "girly")`.

#### JavaScript conditional operators: *(not an exhaustive list)*

<table>
<thead>
<tr>
<th>Operator</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>===</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same type and value." class="info"><em>strictly</em> equal</span>.</td>
<td><code>&lt;&lt;if $bullets === 6&gt;&gt;</code></td>
</tr>
<tr>
<th><code>!==</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same type and/or value." class="info"><em>strictly</em> not equal</span>.</td>
<td><code>&lt;&lt;if $pie !== "cherry"&gt;&gt;</code></td>
</tr>
<tr>
<th><code>==</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same value or coerce into the same value." class="info">equivalent</span>.</td>
<td><code>&lt;&lt;if $bullets == 6&gt;&gt;</code></td>
</tr>
<tr>
<th><code>!=</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same value nor do they coerce into the same value." class="info">not equivalent</span>.</td>
<td><code>&lt;&lt;if $pie != "cherry"&gt;&gt;</code></td>
</tr>
<tr>
<th><code>&gt;</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than the right side.</td>
<td><code>&lt;&lt;if $cash &gt; 5&gt;&gt;</code></td>
</tr>
<tr>
<th><code>&gt;=</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than or equal to the right side.</td>
<td><code>&lt;&lt;if $foundStars &gt;= $neededStars&gt;&gt;</code></td>
</tr>
<tr>
<th><code>&lt;</code></th>
<td>Evaluates to <code>true</code> if the left side is less than the right side.</td>
<td><code>&lt;&lt;if $shoeCount &lt; ($peopleCount * 2)&gt;&gt;</code></td>
</tr>
<tr>
<th><code>&lt;=</code></th>
<td>Evaluates to <code>true</code> if the left side is less than or equal to the right side.</td>
<td><code>&lt;&lt;if $level &lt;= 30&gt;&gt;</code></td>
</tr>
<tr>
<th><code>!</code></th>
<td>Flips a <code>true</code> evaluation to <code>false</code>, and vice versa.</td>
<td><code>&lt;&lt;if !$hungry&gt;&gt;</code></td>
<tr>
<th><code>&amp;&amp;</code></th>
<td>Evaluates to <code>true</code> if all subexpressions evaluate to <code>true</code>.</td>
<td><code>&lt;&lt;if $age &gt;= 20 &amp;&amp; $age &lt;= 30&gt;&gt;</code></td>
</tr>
<tr>
<th><code>||</code></th>
<td>Evaluates to <code>true</code> if any subexpressions evaluate to <code>true</code>.</td>
<td><code>&lt;&lt;if $friend === "Sue" || $friend === "Dan"&gt;&gt;</code></td>
</tr>
</tr>
</tbody>
</table>

#### Example:

```
<<if $daysUntilLoanDue is 0>><<include "Panic">><</if>>

<<if $cash lt 5>>
	I'm sorry, ma'am, but you don't have enough for the pie.
<<else>>
	<<set $cash -= 5, $hasMeatPie = true>>
	One meat pie, fresh out of the oven, coming up!
<</if>>

<<if $affection gte 75>>
	I love you!
<<elseif $affection gte 50>>
	I like you.
<<elseif $affection gte 25>>
	I'm okay with you.
<<else>>
	Get out of my face.
<</if>>

<<if $hullBreached>>
	<<if $wearingHardSuit>>
		<<include "That was close">>
	<<elseif $wearingSoftSuit>>
		<<include "Hole in suit">>
	<<else>>
		<<include "You die">>
	<</if>>
<</if>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-for"></span>
### `<<for [conditional]>> … <</for>>`<br>`<<for [init] ; [conditional] ; [post]>> … <</for>>`<br>`<<for [keyVariable ,] valueVariable range collection>> … <</for>>`

Repeatedly executes its contents. There are three forms: a conditional-only form, a 3-part conditional form, and a range form.

**SEE ALSO:** [`<<break>>`](#macros-macro-break) and [`<<continue>>`](#macros-macro-continue).

##### Since:

* `v2.0.0`: Basic syntax.
* `v2.20.0`: Added range form.

#### Notes

* Loop variables are perfect candidates for the use of temporary variables—e.g., `_i`.
* To ensure that line-breaks end up where you want them, or not, extra care may be required.

#### Conditional forms *(both conditional-only and 3-part)*

Executes its contents while the given conditional expression evaluates to `true`.  If no conditional expression is given, it is equivalent to specifying `true`.

**NOTE:** The maximum number of loop iterations in the conditional forms is not unlimited by default, however, it is configurable.  See [`Config.macros.maxLoopIterations`](#config-api-property-macros-maxloopiterations) for more information.

##### Arguments:

* **`init`:** (optional) A valid expression, evaluated once at loop initialization.  Typically used to initialize counter variable(s).  See [`<<set>>`](#macros-macro-set) for more information.
* **`conditional`:** (optional) A valid conditional expression, evaluated prior to each loop iteration.  As long as the expression evaluates to `true`, the loop is executed.  See [`<<if>>`](#macros-macro-if) for more information.
* **`post`:** (optional) A valid expression, evaluated after each loop iteration.  Typically used to update counter variable(s).  See [`<<set>>`](#macros-macro-set) for more information.

##### Example: *(only 3-part conditional form shown)*

```
→ Example setup
<<set $dwarves to ["Doc", "Dopey", "Bashful", "Grumpy", "Sneezy", "Sleepy", "Happy"]>>

→ Loop
<<for _i to 0; _i lt $dwarves.length; _i++>>
<<print _i + 1>>. $dwarves[_i]
<</for>>

→ Result
1. Doc
2. Dopey
3. Bashful
4. Grumpy
5. Sneezy
6. Sleepy
7. Happy
```

#### Range form

Iterates through all enumerable entries of the given collection.  For each iteration, it assigns the key/value pair of the associated entry in the collection to the iteration variables and then executes its contents.  Valid collection types are: arrays, generic objects, maps, sets, and strings.

##### Arguments:

* **`keyVariable`:** (optional) A story or temporary variable that will be set to the iteration key.
* **`valueVariable`:** A story or temporary variable that will be set to the iteration value.
* **`range`:** Keyword, used to signify that the loop is using the range form syntax.
* **`collection`:** An expression that yields a valid collection type, evaluated once at loop initialization.

##### Iteration Values:

<table>
<tbody>
	<tr>
		<th>Collection type</th>
		<th>Iteration: key, value</th>
	</tr>
	<tr>
		<td>Arrays &amp; Sets</td>
		<td style="text-align: center;">Member: index, value</td>
	</tr>
	<tr>
		<td>Generic&nbsp;objects</td>
		<td style="text-align: center;">Property: name, value</td>
	</tr>
	<tr>
		<td>Maps</td>
		<td style="text-align: center;">Entry: key, value</td>
	</tr>
	<tr>
		<td>Strings</td>
		<td style="text-align: center;">Code point: start&nbsp;index, value</td>
	</tr>
</tbody>
</table>

**NOTE:** Strings are iterated by Unicode code point, however, due to historic reasons they are comprised of, and indexed by, individual UTF-16 code units.  This means that some code points may span multiple code units—e.g., the character 💩 is one code point, but two code units.

##### Example:

```
→ Example setup
<<set $dwarves to ["Doc", "Dopey", "Bashful", "Grumpy", "Sneezy", "Sleepy", "Happy"]>>

→ Loop
<<for _i, _name range $dwarves>>
<<print _i + 1>>. _name
<</for>>

→ Result
1. Doc
2. Dopey
3. Bashful
4. Grumpy
5. Sneezy
6. Sleepy
7. Happy
```

<!-- *********************************************************************** -->

<span id="macros-macro-break"></span>
### `<<break>>`

Used within [`<<for>>`](#macros-macro-for) macros.  Terminates the execution of the current `<<for>>`.

#### Since:

* `v2.0.0`

#### Arguments: *none*

<!-- *********************************************************************** -->

<span id="macros-macro-continue"></span>
### `<<continue>>`

Used within [`<<for>>`](#macros-macro-for) macros.  Terminates the execution of the current iteration of the current `<<for>>` and begins execution of the next iteration.

**NOTE:** May eat line-breaks in certain situations.

#### Since:

* `v2.0.0`

#### Arguments: *none*

<!-- *********************************************************************** -->

<span id="macros-macro-switch"></span>
### `<<switch expression>> [<<case valueList>> …] [<<default>> …] <</switch>>`

Evaluates the given expression and compares it to the value(s) within its `<<case>>` children.  The value(s) within each case are compared to the result of the expression given to the parent `<<switch>>`.  Upon a successful match, the matching case will have its contents executed.  If no cases match and an optional default case exists, which must be the final case, then its contents will be executed.  At most one case will execute.

**NOTE:** SugarCube does not trim whitespace from the contents of `<<case>>`/`<<default>>` macros, so that authors don't have to resort to various kludges to get whitespace where they want it.  However, this means that extra care must be taken when writing them to ensure that unwanted whitespace is not created within the final output.

#### Since:

* `v2.7.2`

#### Arguments:

##### `<<switch>>`

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

##### `<<case>>`

* **`valueList`:** A space separated list of values to compare against the result of the switch expression.

#### Example:

```
→ Without a default case
<<switch $hairColor>>
<<case "red" "auburn">>
	You ginger.
<<case "black" "brown">>
	Dark haired, eh?
<<case "blonde">>
	You may have more fun.
<</switch>>

→ With a default case (assume the passage is about a waterfall)
<<switch visited()>>
<<case 1>>
	You gaze in wonder at the magnificent waterfall for the first time, awestruck by its natural beauty.
<<case 2 3>>
	You once again gaze upon the magnificent waterfall.
<<case 4 5>>
	Yet again, you find yourself looking upon the waterfall.
<<default>>
	Oh, look.  It's that waterfall again.  Meh.
<</switch>>
```


<!-- ***************************************************************************
	Interactive Macros
**************************************************************************** -->
<span id="macros-interactive"></span>
## Interactive Macros

<span id="macros-interactive-warning"></span>
#### Warning

Interactive macros are both asynchronous and require interaction from the player.  Thus, there are some potential pitfalls to consider:

1. If you plan on using interactive macros within a loop you will likely need to use the [`<<capture>>` macro](#macros-macro-capture) due to their asynchronous nature.
2. Reloading the page or revisiting a passage may not restore the state of some interactive macros, so it is recommended that you only use them in instances where this will not be an issue or where you can work around it.

<!-- *********************************************************************** -->

<span id="macros-macro-button"></span>
### `<<button linkText [passageName]>> … <</button>>`<br>`<<button linkMarkup>> … <</button>>`<br>`<<button imageMarkup>> … <</button>>`

Creates a button that silently executes its contents when clicked, optionally forwarding the player to another passage.  May be called either with the link text and passage name as separate arguments, with a link markup, or with an image markup.  This macro is functionally identical to [`<<link>>`](#macros-macro-link), save that it uses a button element (`<button>`) rather than an anchor element (`<a>`).

**SEE:** [Interactive macro warning](#macros-interactive-warning).

**NOTE:** If you simply need a passage link that modifies variables, both the [link markup](#markup-link) and [image markup](#markup-image) offer setter variants.

#### Since:

* `v2.8.0`

#### Arguments:

##### Separate argument form

* **`linkText`:** The text of the link.  May contain markup.
* **`passageName`:** (optional) The name of the passage to go to.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Example:

```
→ Without forwarding: a very basic statistic setting example
Strength: <<set $pcStr to 10>><span id="stats-str"><<print $pcStr>></span> \
( <<button "[+]">><<set $pcStr++>><<replace "#stats-str">><<print $pcStr>><</replace>><</button>> \
| <<button "[-]">><<set $pcStr-->><<replace "#stats-str">><<print $pcStr>><</replace>><</button>> )

→ With forwarding: execute a script, then go to the specified passage
<<button "Onward, Reginald!" "On with the story">><<script>>/* (code) */<</script>><</button>>
<<button [[Onward, Reginald!|On with the story]]>><<script>>/* (code) */<</script>><</button>>
<<button [img[onward.jpg][On with the story]]>><<script>>/* (code) */<</script>><</button>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-checkbox"></span>
### `<<checkbox receiverName uncheckedValue checkedValue [checked]>>`

Creates a checkbox, used to modify the value of the variable with the given name.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`uncheckedValue`:** The value set by the checkbox when unchecked.
* **`checkedValue`:** The value set by the checkbox when checked.
* **`checked`:** (optional) Keyword, used to signify that the checkbox should be in the checked state.

#### Example:

```
What pies do you enjoy?
* <<checkbox "$pieBlueberry" false true checked>> Blueberry?
* <<checkbox "$pieCherry" false true>> Cherry?
* <<checkbox "$pieCoconutCream" false true checked>> Coconut cream?
```

**NOTE:** For accessibility reasons, it's recommended that you wrap each `<<checkbox>>` and its accompanying text within a `<label>` element.  Doing so allows interactions with the text to also trigger its `<<checkbox>>`.  For example:

```
What pies do you enjoy?
* <label><<checkbox "$pieBlueberry" false true checked>> Blueberry?</label>
* <label><<checkbox "$pieCherry" false true>> Cherry?</label>
* <label><<checkbox "$pieCoconutCream" false true checked>> Coconut cream?</label>
```

<!-- *********************************************************************** -->

<span id="macros-macro-cycle"></span>
### `<<cycle receiverName [autoselect]>>`<div>`[<<option label [value [selected]]>> …] [<<optionsfrom collection>> …]`</div>`<</cycle>>`

Creates a cycling link, used to modify the value of the variable with the given name.  The cycling options are populated via `<<option>>` and/or `<<optionsfrom>>`.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.29.0`

#### Arguments:

##### `<<cycle>>`

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, & `"$foo[0]"`.
* **`autoselect`:** (optional) Keyword, used to signify that an option should be automatically selected as the cycle default based on the current value of the target variable.  **NOTE:** Automatic option selection will fail on non-primitive values—i.e. on arrays and objects.

##### `<<option>>`

* **`label`:** The label shown by the cycling link for the option.
* **`value`:** (optional) The value set by the cycling link when the option is selected.  If omitted, the label will be used as the value.
* **`selected`:** (optional) Keyword, used to signify that the option should be the cycle default.  Only one option may be so selected.  If no options are selected as the default, the cycling link will default to the first option, unless the cycle `autoselect` keyword is specified.  **NOTE:** If specified, the `value` argument is not optional.

##### `<<optionsfrom>>`

* **`collection`:** An expression that yields a valid collection type.  
	<table class="list-table">
	<tbody>
		<tr>
			<th>Collection type</th>
			<th>Option: label, value</th>
		</tr>
		<tr>
			<td>Arrays &amp; Sets</td>
			<td style="text-align: center;">Member: value, value</td>
		</tr>
		<tr>
			<td>Generic&nbsp;objects</td>
			<td style="text-align: center;">Property: name, value</td>
		</tr>
		<tr>
			<td>Maps</td>
			<td style="text-align: center;">Entry: key, value</td>
		</tr>
	</tbody>
	</table>

#### Example:

##### Using `<<option>>`

```
The answer to the //Ultimate Question of Life, the Universe, and Everything// is?
<<cycle "$answer" autoselect>>
	<<option "Towel">>
	<<option "π" 3.14159>>
	<<option 42>>
	<<option 69>>
	<<option "∞" Infinity>>
<</cycle>>
```

##### Using `<<optionsfrom>>` with an array

```
→ Given: _pieOptions = ["blueberry", "cherry", "coconut cream"]
What's your favorite pie?
<<cycle "$pie" autoselect>>
	<<optionsfrom _pieOptions>>
<</cycle>>
```

##### Using `<<optionsfrom>>` with an generic object

```
→ Given: _pieOptions = { "Blueberry" : "blueberry", "Cherry" : "cherry", "Coconut cream" : "coconut cream" }
What's your favorite pie?
<<cycle "$pie" autoselect>>
	<<optionsfrom _pieOptions>>
<</cycle>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-link"></span>
### `<<link linkText [passageName]>> … <</link>>`<br>`<<link linkMarkup>> … <</link>>`<br>`<<link imageMarkup>> … <</link>>`

Creates a link that silently executes its contents when clicked, optionally forwarding the player to another passage.  May be called either with the link text and passage name as separate arguments, with a link markup, or with an image markup.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

**NOTE:** If you simply need a passage link that modifies variables, both the [link markup](#markup-link) and [image markup](#markup-image) offer setter variants.

#### Since:

* `v2.8.0`

#### Arguments:

##### Separate argument form

* **`linkText`:** The text of the link.  May contain markup.
* **`passageName`:** (optional) The name of the passage to go to.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Example:

```
→ Without forwarding: a very basic statistic setting example
Strength: <<set $pcStr to 10>><span id="stats-str"><<print $pcStr>></span> \
( <<link "[+]">><<set $pcStr++>><<replace "#stats-str">><<print $pcStr>><</replace>><</link>> \
| <<link "[-]">><<set $pcStr-->><<replace "#stats-str">><<print $pcStr>><</replace>><</link>> )

→ With forwarding: execute a script, then go to the specified passage
<<link "Onward, Reginald!" "On with the story">><<script>>/* (code) */<</script>><</link>>
<<link [[Onward, Reginald!|On with the story]]>><<script>>/* (code) */<</script>><</link>>
<<link [img[onward.jpg][On with the story]]>><<script>>/* (code) */<</script>><</link>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-linkappend"></span>
### `<<linkappend linkText [transition|t8n]>> … <</linkappend>>`

Creates a single-use link that deactivates itself and appends its contents to its link text when clicked.  Essentially, a combination of [`<<link>>`](#macros-macro-link) and [`<<append>>`](#macros-macro-append).

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`linkText`:** The text of the link.  May contain markup.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Example:

```
→ Without a transition
We—We should <<linkappend "take">> away their METAL BAWKSES<</linkappend>>!

→ With a transition
I spy with my little <<linkappend "eye" t8n>>, a crab rangoon<</linkappend>>.
```

<!-- *********************************************************************** -->

<span id="macros-macro-linkprepend"></span>
### `<<linkprepend linkText [transition|t8n]>> … <</linkprepend>>`

Creates a single-use link that deactivates itself and prepends its contents to its link text when clicked.  Essentially, a combination of [`<<link>>`](#macros-macro-link) and [`<<prepend>>`](#macros-macro-prepend).

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`linkText`:** The text of the link.  May contain markup.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Example:

```
→ Without a transition
You see a <<linkprepend "robot">>GIANT <</linkprepend>>.

→ With a transition
I <<linkprepend "like" t8n>>do not <</linkprepend>> lemons.
```

<!-- *********************************************************************** -->

<span id="macros-macro-linkreplace"></span>
### `<<linkreplace linkText [transition|t8n]>> … <</linkreplace>>`

Creates a single-use link that deactivates itself and replaces its link text with its contents when clicked.  Essentially, a combination of [`<<link>>`](#macros-macro-link) and [`<<replace>>`](#macros-macro-replace).

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`linkText`:** The text of the link.  May contain markup.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Example:

```
→ Without a transition
I'll have a <<linkreplace "cupcake">>slice of key lime pie<</linkreplace>>, please.

→ With a transition
<<linkreplace "You'll //never// take me alive!" t8n>>On second thought, don't hurt me.<</linkreplace>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-listbox"></span>
### `<<listbox receiverName [autoselect]>>`<div>`[<<option label [value [selected]]>> …] [<<optionsfrom collection>> …]`</div>`<</listbox>>`

Creates a listbox, used to modify the value of the variable with the given name.  The list options are populated via `<<option>>` and/or `<<optionsfrom>>`.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.26.0`: Basic syntax.
* `v2.27.0`: Added `autoselect` keyword.
* `v2.28.0`: <s>Added `<<optionsFrom>>` child tag.</s>
* `v2.28.1`: Fixed name of `<<optionsfrom>>` child tag, which was erroneously added as `<<optionsFrom>>` in `v2.28.0`.
* `v2.29.0`: Made the `<<option>>` child tag's `value` argument optional.

#### Arguments:

##### `<<listbox>>`

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, & `"$foo[0]"`.
* **`autoselect`:** (optional) Keyword, used to signify that an option should be automatically selected as the listbox default based on the current value of the target variable.  **NOTE:** Automatic option selection will fail on non-primitive values—i.e. on arrays and objects.

##### `<<option>>`

* **`label`:** The label shown by the listbox for the option.
* **`value`:** (optional) The value set by the listbox when the option is selected.  If omitted, the label will be used as the value.
* **`selected`:** (optional) Keyword, used to signify that the option should be the listbox default.  Only one option may be so selected.  If no options are selected as the default, the listbox will default to the first option, unless the listbox `autoselect` keyword is specified.  **NOTE:** If specified, the `value` argument is not optional.

##### `<<optionsfrom>>`

* **`collection`:** An expression that yields a valid collection type.  
	<table class="list-table">
	<tbody>
		<tr>
			<th>Collection type</th>
			<th>Option: label, value</th>
		</tr>
		<tr>
			<td>Arrays &amp; Sets</td>
			<td style="text-align: center;">Member: value, value</td>
		</tr>
		<tr>
			<td>Generic&nbsp;objects</td>
			<td style="text-align: center;">Property: name, value</td>
		</tr>
		<tr>
			<td>Maps</td>
			<td style="text-align: center;">Entry: key, value</td>
		</tr>
	</tbody>
	</table>

#### Example:

##### Using `<<option>>`

```
The answer to the //Ultimate Question of Life, the Universe, and Everything// is?
<<listbox "$lbanswer" autoselect>>
	<<option "Towel">>
	<<option "π" 3.14159>>
	<<option 42>>
	<<option 69>>
	<<option "∞" Infinity>>
<</listbox>>
```

##### Using `<<optionsfrom>>` with an array

```
→ Given: _pieOptions = ["blueberry", "cherry", "coconut cream"]
What's your favorite pie?
<<listbox "$pie" autoselect>>
	<<optionsfrom _pieOptions>>
<</listbox>>
```

##### Using `<<optionsfrom>>` with an generic object

```
→ Given: _pieOptions = { "Blueberry" : "blueberry", "Cherry" : "cherry", "Coconut cream" : "coconut cream" }
What's your favorite pie?
<<listbox "$pie" autoselect>>
	<<optionsfrom _pieOptions>>
<</listbox>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-radiobutton"></span>
### `<<radiobutton receiverName checkedValue [checked]>>`

Creates a radio button, used to modify the value of the variable with the given name.  Multiple `<<radiobutton>>` macros may be set up to modify the same variable, which makes them part of a radio button group.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`checkedValue`:** The value set by the radio button when checked.
* **`checked`:** (optional) Keyword, used to signify that the radio button should be in the checked state.

#### Example:

```
What's your favorite pie?
* <<radiobutton "$pie" "blueberry" checked>> Blueberry?
* <<radiobutton "$pie" "cherry">> Cherry?
* <<radiobutton "$pie" "coconut cream">> Coconut cream?
```

**NOTE:** For accessibility reasons, it's recommended that you wrap each `<<radiobutton>>` and its accompanying text within a `<label>` element.  Doing so allows interactions with the text to also trigger its `<<radiobutton>>`.  For example:

```
What's your favorite pie?
* <label><<radiobutton "$pie" "blueberry" checked>> Blueberry?</label>
* <label><<radiobutton "$pie" "cherry">> Cherry?</label>
* <label><<radiobutton "$pie" "coconut cream">> Coconut cream?</label>
```

<!-- *********************************************************************** -->

<span id="macros-macro-textarea"></span>
### `<<textarea receiverName defaultValue [autofocus]>>`

Creates a multiline text input block, used to modify the value of the variable with the given name.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`defaultValue`:** The default value of the text block.
* **`autofocus`:** (optional) Keyword, used to signify that the text block should automatically receive focus.  Only use the keyword *once* per page; attempting to focus more than one element is undefined behavior.

#### Example:

```
→ Creates a text block that modifies $pieEssay
Write a short essay about pies:
<<textarea "$pieEssay" "">>

→ Creates an automatically focused text block that modifies $pieEssay
Write a short essay about pies:
<<textarea "$pieEssay" "" autofocus>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-textbox"></span>
### `<<textbox receiverName defaultValue [passage] [autofocus]>>`

Creates a text input box, used to modify the value of the variable with the given name, optionally forwarding the player to another passage.

**SEE:** [Interactive macro warning](#macros-interactive-warning).

#### Since:

* `v2.0.0`

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`defaultValue`:** The default value of the text box.
* **`passage`:** (optional) The name of the passage to go to if the return/enter key is pressed.  May be called either with the passage name or with a link markup.
* **`autofocus`:** (optional) Keyword, used to signify that the text box should automatically receive focus.  Only use the keyword *once* per page; attempting to focus more than one element is undefined behavior.

#### Example:

```
→ Creates a text box that modifies $pie
What's your favorite pie? <<textbox "$pie" "Blueberry">>

→ Creates an automatically focused text box that modifies $pie
What's your favorite pie? <<textbox "$pie" "Blueberry" autofocus>>

→ Creates a text box that modifies $pie and forwards to the "Cakes" passage
What's your favorite pie? <<textbox "$pie" "Blueberry" "Cakes">>

→ Creates an automatically focused text box that modifies $pie and forwards to the "Cakes" passage
What's your favorite pie? <<textbox "$pie" "Blueberry" "Cakes" autofocus>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-click"></span>
### <span class="deprecated">`<<click linkText [passageName]>> … <</click>>`<br>`<<click linkMarkup>>`<br>`<<click imageMarkup>>`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code></a> macro for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.8.0`: Deprecated in favor of `<<link>>`.


<!-- ***************************************************************************
	Links Macros
**************************************************************************** -->
<span id="macros-links"></span>
## Links Macros

<!-- *********************************************************************** -->

<span id="macros-macro-actions"></span>
### `<<actions passageList>>`<br>`<<actions linkMarkupList>>`<br>`<<actions imageMarkupList>>`

Creates a list of single-use passage links.  Each link removes itself and all other `<<actions>>` links to the same passage after being activated.  May be called either with a list of passages, with a list of link markup, or with a list of image markup.  Probably most useful when paired with [`<<include>>`](#macros-macro-include).  See the [`<<actions>>`](https://twinery.org/wiki/actions) section of the [Twine&nbsp;1/Twee reference documentation](https://twinery.org/wiki/twine1:reference) for more information.

#### Since:

* `v2.0.0`

#### Arguments:

##### Passage list form

* **`passageList`:** A space separated list of passage names.

##### Link markup list form

* **`linkMarkupList`:** A space separated list of link markup to use (full syntax supported, including setters).

##### Image markup list form

* **`imageMarkupList`:** A space separated list of image markup to use (full syntax supported, including setters).

#### Example:

```
→ Passage list form
<<actions "Look at the pie" "Smell the pie" "Taste the pie">>

→ Link markup list form
<<actions [[Look at the pie]] [[Smell the pie]] [[Taste the pie]]>>
<<actions [[Look|Look at the pie]] [[Smell|Smell the pie]] [[Taste|Taste the pie]]>>

→ Image markup list form
<<actions [img[look.png][Look at the pie]] [img[smell.png][Smell the pie]] [img[taste.png][Taste the pie]]>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-back"></span>
### `<<back [linkText]>>`<br>`<<back linkMarkup>>`<br>`<<back imageMarkup>>`

Creates a link that undoes past moments within the story history.  May be called with, optional, link text or with a link or image markup.

**NOTE:** If you want to return to a previously visited passage, rather than undo a moment within the history, see the [`<<return>>` macro](#macros-macro-return) or the [`previous()` function](#functions-function-previous).

#### Since:

* `v2.0.0`

#### Arguments:

##### Link text form

* **`linkText`:** (optional) The text of the link.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Example:

```
<<back>>                      → Undo the previous moment

→ Link text form
<<back "Home.">>              → Undo the previous moment, with link text "Home."

→ Link markup form
<<back [[HQ]]>>               → Undo moments until the most recent "HQ" moment is reached
<<back [[Home.|HQ]]>>         → Undo moments until the most recent "HQ" moment is reached, with link text "Home."

→ Image markup form
<<back [img[home.png]]>>      → Undo the previous moment, with link image "home.png"
<<back [img[home.png][HQ]]>>  → Undo moments until the most recent "HQ" moment is reached, with link image "home.png"
```

<!-- *********************************************************************** -->

<span id="macros-macro-choice"></span>
### `<<choice passageName [linkText]>>`<br>`<<choice linkMarkup>>`<br>`<<choice imageMarkup>>`

Creates a single-use passage link that deactivates itself and all other `<<choice>>` links within the originating passage when activated.  May be called either with the passage name and link text as separate arguments, with a link markup, or with a image markup.

**NOTE:** Normally, when both link and text arguments are accepted, the order is text then link.  However, due to a historical artifact, the arguments for the separate argument form of `<<choice>>` are in the reverse order (link then text).

#### Since:

* `v2.0.0`

#### Arguments:

##### Separate argument form

* **`passageName`:** The name of the passage to go to.
* **`linkText`:** (optional) The text of the link.  If omitted, the `passageName` will be used instead.

##### Link markup form

* **`linkMarkup`:** The link markup to use (full syntax supported, including setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (full syntax supported, including setters).

#### Example:

```
→ Separate argument form
<<choice "Take the red pill">>
<<choice $someAction>>
<<choice "Entered magic mirror" "Touch the strange mirror.">>
<<choice $go $show>>

→ Link markup form
<<choice [[Take the red pill]]>>
<<choice [[$someAction]]>>
<<choice [[Touch the strange mirror.|Entered magic mirror]]>>
<<choice [[$show|$go]]>>

→ Image markup form
<<choice [img[redpill.png][Take the red pill]]>>
<<choice [img[some-image.jpg][$someAction]]>>
<<choice [img[mirror.jpg][Entered magic mirror]]>>
<<choice [img[$show][$go]]>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-return"></span>
### `<<return [linkText]>>`<br>`<<return linkMarkup>>`<br>`<<return imageMarkup>>`

Creates a link that returns to a previously visited passage.  May be called with, optional, link text or with a link or image markup.

**NOTE:** If you want to undo previous moments within the history, rather than return to a passage, see the [`<<back>>` macro](#macros-macro-back).

#### Since:

* `v2.0.0`

#### Arguments:

##### Link text form

* **`linkText`:** (optional) The text of the link.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Example:

```
<<return>>                      → Go to the previous passage

→ Link text form
<<return "Home.">>              → Go to the previous passage, with link text "Home."

→ Link markup form
<<return [[HQ]]>>               → Go to the "HQ" passage
<<return [[Home.|HQ]]>>         → Go to the "HQ" passage, with link text "Home."

→ Image markup form
<<return [img[home.png]]>>      → Go to the previous passage, with link image "home.png"
<<return [img[home.png][HQ]]>>  → Go to the "HQ" passage, with link image "home.png"
```


<!-- ***************************************************************************
	DOM Macros
**************************************************************************** -->
<span id="macros-dom"></span>
## DOM Macros

**WARNING:** All DOM macros require the elements to be manipulated to be on the page.  As a consequence, you cannot use them directly within a passage to modify elements within said passage, since the elements they are targeting are still rendering, thus not yet on the page.  You must, generally, use them with a interactive macro—e.g., [`<<link>>`](#macros-macro-link)—or within the [`PassageDone`](#special-passage-passagedone) special passage.  Elements that are already part of the page, on the other hand, present no issues.

<!-- *********************************************************************** -->

<span id="macros-macro-addclass"></span>
### `<<addclass selector classNames>>`

Adds classes to the selected element(s).

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`classNames`:** The names of the classes, separated by spaces.

#### Example:

```
<<addclass "body" "day rain">>  → Add the classes "day" and "rain" to the <body> element
<<addclass "#pie" "cherry">>    → Add the class "cherry" to the element with the ID "pie"
<<addclass ".joe" "angry">>     → Add the class "angry" to all elements containing the class "joe"
```

<!-- *********************************************************************** -->

<span id="macros-macro-append"></span>
### `<<append selector [transition|t8n]>> … <</append>>`

Executes its contents and appends the output to the contents of the selected element(s).

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.25.0`: Added `transition` and `t8n` keywords.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Example:

##### Without a transition

```
→ Example setup
I saw a <span id="dog">dog</span>.

→ Append to the contents of the target element
<<link "Doing">>
	<<append "#dog">> chasing a cat<</append>>
<</link>>

→ Result, after clicking
I saw a <span id="dog">dog chasing a cat</span>.
```

##### With a transition

```
→ Example setup
I saw a <span id="dog">dog</span>.

→ Append to the contents of the target element
<<link "Doing">>
	<<append "#dog" t8n>> chasing a cat<</append>>
<</link>>

→ Result, after clicking
I saw a <span id="dog">dog<span class="macro-append-insert"> chasing a cat</span></span>.
```

<!-- *********************************************************************** -->

<span id="macros-macro-copy"></span>
### `<<copy selector>>`

Outputs a copy of the contents of the selected element(s).

<p role="note" class="warning"><b>Warning:</b>
Most interactive elements—e.g., passage links, <a href="#macros-interactive">interactive macros</a>, etc.—cannot be properly copied via <code>&lt;&lt;copy&gt;&gt;</code>.  Attempting to do so will, usually, result in something that's non-functional.
</p>

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).

#### Example:

```
→ Example setup
I'd like a <span id="snack-source">slice of Key lime pie</span>, please.

I'll have a <span id="snack-dest">breadstick</span>, thanks.

→ Replace the contents of the source target element with a copy of the destination target element
<<link "Have the same">>
	<<replace "#snack-dest">><<copy "#snack-source">> too<</replace>>
<</link>>

→ Result, after the click
I'd like a <span id="snack-source">slice of Key lime pie</span>, please.

I'll have a <span id="snack-dest">slice of Key lime pie too</span>, thanks.
```

<!-- *********************************************************************** -->

<span id="macros-macro-prepend"></span>
### `<<prepend selector [transition|t8n]>> … <</prepend>>`

Executes its contents and prepends the output to the contents of the selected element(s).

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.25.0`: Added `transition` and `t8n` keywords.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Example:

##### Without a transition

```
→ Example setup
I saw a <span id="dog">dog</span>.

→ Prepend to the contents of the target element
<<link "Size">>
	<<prepend "#dog">>big <</prepend>>
<</link>>

→ Result, after clicking
I saw a <span id="dog">big dog</span>.
```

##### With a transition

```
→ Example setup
I saw a <span id="dog">dog</span>.

→ Prepend to the contents of the target element
<<link "Size">>
	<<prepend "#dog" t8n>>big <</prepend>>
<</link>>

→ Result, after clicking
I saw a <span id="dog"><span class="macro-prepend-insert">big </span>dog</span>.
```

<!-- *********************************************************************** -->

<span id="macros-macro-remove"></span>
### `<<remove selector>>`

Removes the selected element(s).

**SEE:** [DOM macro warning](#macros-dom).

**NOTE:** If you simply want to empty the selected element(s), not remove them outright, you should use an empty [`<<replace>>`](#macros-macro-replace) instead.

#### Since:

* `v2.0.0`

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).

#### Example:

```
→ Given the following
I'd like a <span id="huge-cupcake">humongous </span>cupcake, please.

→ Remove the target element
<<link "Go small">>
	<<remove "#huge-cupcake">>
<</link>>

→ Result, after the click
I'd like a cupcake, please.
```

<!-- *********************************************************************** -->

<span id="macros-macro-removeclass"></span>
### `<<removeclass selector [classNames]>>`

Removes classes from the selected element(s).

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`classNames`:** (optional) The names of the classes, separated by spaces.  If no class names are given, removes all classes.

#### Example:

```
<<removeclass "body" "day rain">>  → Remove the classes "day" and "rain" from the <body> element
<<removeclass "#pie" "cherry">>    → Remove the class "cherry" from the element with the ID "pie"
<<removeclass ".joe" "angry">>     → Remove the class "angry" from all elements containing the class "joe"
<<removeclass "#begone">>          → Remove all classes from the element with the ID "begone"
```

<!-- *********************************************************************** -->

<span id="macros-macro-replace"></span>
### `<<replace selector [transition|t8n]>> … <</replace>>`

Executes its contents and replaces the contents of the selected element(s) with the output.

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.25.0`: Added `transition` and `t8n` keywords.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Usage

##### Without a transition

```
→ Example setup
I saw a <span id="dog">dog</span>.

→ Replace the contents of the target element
<<link "Breed">>
	<<replace "#dog">>Catahoula Cur<</replace>>
<</link>>

→ Result, after clicking
I saw a <span id="dog">Catahoula Cur</span>.
```

##### With a transition

```
→ Example setup
I saw a <span id="dog">dog</span>.

→ Replace the contents of the target element
<<link "Breed">>
	<<replace "#dog" t8n>>Catahoula Cur<</replace>>
<</link>>

→ Result, after clicking
I saw a <span id="dog"><span class="macro-replace-insert">Catahoula Cur</span></span>.
```

<!-- *********************************************************************** -->

<span id="macros-macro-toggleclass"></span>
### `<<toggleclass selector classNames>>`

Toggles classes on the selected element(s)—i.e. adding them if they don't exist, removing them if they do.

**SEE:** [DOM macro warning](#macros-dom).

#### Since:

* `v2.0.0`

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`classNames`:** The names of the classes, separated by spaces.

#### Example:

```
<<toggleclass "body" "day rain">>  → Toggle the classes "day" and "rain" on the <body> element
<<toggleclass "#pie" "cherry">>    → Toggle the class "cherry" on the element with the ID "pie"
<<toggleclass ".joe" "angry">>     → Toggle the class "angry" on all elements containing the class "joe"
```


<!-- ***************************************************************************
	Audio Macros
**************************************************************************** -->
<span id="macros-audio"></span>
## Audio Macros

<span id="macros-audio-limitations"></span>
<p role="note" class="warning"><b>Warning:</b>
The audio subsystem that supports the audio macros comes with some built-in <a href="#simpleaudio-api-limitations">limitations</a> and it is <strong><em>strongly</em></strong> recommended that you familiarize yourself with them.
</p>

<!-- *********************************************************************** -->

<span id="macros-macro-audio"></span>
### `<<audio trackIdList actionList>>`

Controls the playback of audio tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio).

**SEE:** [Audio macro limitations](#macros-audio-limitations).

**NOTE:** The `<<audio>>` macro cannot affect playlist tracks that have been copied into their respective playlist—meaning those set up via [`<<createplaylist>>`](#macros-macro-createplaylist) with its `copy` action or all tracks set up via, the deprecated, [`<<setplaylist>>`](#macros-macro-setplaylist)—as playlist copies are solely under the control of their playlist.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.1.0`: Added `fadeoverto` action.
* `v2.8.0`: Added group ID(s).
* `v2.28.0`: Added `load` and `unload` actions.

#### Arguments:

* **`trackIdList`:** The list of track and/or group IDs, separated by spaces.  See below for details on group IDs.
* **`actionList`:** The list of actions to perform.  Available actions are:
	* **`fadein`:** Start playback of the selected tracks and fade them from their current volume level to `1` (loudest) over `5` seconds.
	* **`fadeout`:** Start playback of the selected tracks and fade them from their current volume level to `0` (silent) over `5` seconds.
	* **`fadeoverto` *`seconds`* *`level`*:** Start playback of the selected tracks and fade them from their current volume level to the specified level over the specified number of seconds.
	* **`fadeto` *`level`*:** Start playback of the selected tracks and fade them from their current volume level to the specified level over `5` seconds.
	* **`goto` *`passage`*:** Forwards the player to the passage with the given name when playback of the first of the selected tracks ends normally.  May be called either with the passage name or with a link markup.
	* **`load`:** Pause playback of the selected tracks and, if they're not already in the process of loading, force them to drop any existing data and begin loading.  **NOTE:** This *should not* be done lightly if your audio sources are on the network, as it forces the player to begin downloading them.
	* **`loop`:** Set the selected tracks to repeat playback upon ending normally.
	* **`mute`:** Mute the volume of the selected tracks—effectively volume `0`, except without changing the volume level.
	* **`pause`:** Pause playback of the selected tracks.
	* **`play`:** Start playback of the selected tracks.
	* **`stop`:** Stop playback of the selected tracks.
	* **`time` *`seconds`*:** Set the current playback time of the selected tracks to the specified number of seconds.  Valid values are floating-point numbers in the range `0` (start) to the maximum duration—e.g., `60` is `60` is sixty seconds in, `90.5` is ninety-point-five seconds in.
	* **`unload`:** Stop playback of the selected tracks and force them to drop any existing data.  **NOTE:** Once unloaded, playback cannot occur until a `load` action is issued.
	* **`unloop`:** Set the selected tracks to not repeat playback (this is the default).
	* **`unmute`:** Unmute the volume of the selected tracks (this is the default).
	* **`volume` *`level`*:** Set the volume of the selected tracks to the specified level.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Group IDs:

Group IDs allow several tracks to be selected simultaneously without needing to specify each one individually.  There are several predefined group IDs (`:all`, `:looped`, `:muted`, `:paused`, `:playing`) and custom IDs may be defined via [`<<createaudiogroup>>`](#macros-macro-createaudiogroup).  The `:not()` group modifier syntax (`groupId:not(trackIdList)`) allows a group to have some of its tracks excluded from selection.

#### Example:

##### Basic usage with group IDs

```
→ Start playback of paused tracks
<<audio ":paused" play>>

→ Pause playback of playing tracks
<<audio ":playing" pause>>

→ Stop playback of playing tracks
<<audio ":playing" stop>>

→ Stop playback of all tracks
<<audio ":all" stop>>

→ Stop playback of playing tracks except those in the ":ui" group
<<audio ":playing:not(:ui)" stop>>

→ Change the volume of all tracks except those in the ":ui" group
→ to 40%, without changing the current playback state
<<audio ":all:not(:ui)" volume 0.40>>
```

##### Basic usage with track IDs

```
→ Given the following (best done in the StoryInit special passage)
<<cacheaudio "bgm_space" "media/audio/space_quest.mp3" "media/audio/space_quest.ogg">>

→ Start playback
<<audio "bgm_space" play>>

→ Start playback at 50% volume
<<audio "bgm_space" volume 0.5 play>>

→ Start playback at 120 seconds in
<<audio "bgm_space" time 120 play>>

→ Start repeating playback
<<audio "bgm_space" loop play>>

→ Start playback and fade from 0% to 100% volume
<<audio "bgm_space" volume 0 fadein>>

→ Start playback and fade from 75% to 0% volume
<<audio "bgm_space" volume 0.75 fadeout>>

→ Start playback and fade from 25% to 75% volume
<<audio "bgm_space" volume 0.25 fadeto 0.75>>

→ Start playback and fade from 25% to 75% volume over 30 seconds
<<audio "bgm_space" volume 0.25 fadeoverto 30 0.75>>

→ Start playback and goto the "Peace Moon" passage upon ending normally
<<audio "bgm_space" play goto "Peace Moon">>

→ Pause playback
<<audio "bgm_space" pause>>

→ Stop playback
<<audio "bgm_space" stop>>

→ Mute playback, without changing the current playback state
<<audio "bgm_space" mute>>

→ Unmute playback, without changing the current playback state
<<audio "bgm_space" unmute>>

→ Change the volume to 40%, without changing the current playback state
<<audio "bgm_space" volume 0.40>>

→ Seek to 90 seconds in, without changing the current playback state
<<audio "bgm_space" time 90>>
```

##### Using the `load` and `unload` actions

**NOTE:** Be *very careful* with these if your audio sources are on the network, as you are forcing players to begin downloading them.  Not everyone has
blazing fast internet with unlimited data—especially true for mobile users.  Pease, *do not* take your players' bandwidth and data usage lightly.

```
→ If it's not currently loading, drop existing data buffers and load the track
<<audio "bgm_space" load>>

→ Unload the track, dropping existing data buffers
<<audio "bgm_space" unload>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-cacheaudio"></span>
### `<<cacheaudio trackId sourceList>>`

Caches an audio track for use by the other audio macros.

**NOTE:** The [`StoryInit`](#special-passage-storyinit) special passage is normally the best place to set up tracks.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.28.0`: Deprecated the old optional format specifier syntax in favor of a new syntax (`formatId|`).

#### Arguments:

* **`trackId`:** The ID of the track, which will be used to reference it.
* **`sourceList`:** A space separated list of sources for the track.  Only one is required, though supplying additional sources in differing formats is recommended, as no single format is supported by all browsers.  A source must be either a URL (absolute or relative) to an audio resource, the name of an audio passage, or a data URI.  In rare cases where the audio format cannot be automatically detected from the source (URLs are parsed for a file extension, data URIs are parsed for the media type), a format specifier may be prepended to the front of each source to manually specify the format (syntax: `formatId|`, where `formatId` is the audio format—generally, whatever the file extension would normally be; e.g., `mp3`, `mp4`, `ogg`, `weba`, `wav`).

#### Example:

```
→ Cache a track with the ID "boom" and one source via relative URL
<<cacheaudio "boom" "media/audio/explosion.mp3">>

→ Cache a track with the ID "boom" and one source via audio passage
<<cacheaudio "boom" "explosion">>

→ Cache a track with the ID "bgm_space" and two sources via relative URLs
<<cacheaudio "bgm_space" "media/audio/space_quest.mp3" "media/audio/space_quest.ogg">>

→ Cache a track with the ID "what" and one source via URL with a format specifier
<<cacheaudio "what" "mp3|http://an-audio-service.com/a-user/a-track-id">>
```

<!-- *********************************************************************** -->

<span id="macros-macro-createaudiogroup"></span>
### `<<createaudiogroup groupId>> [<<track trackId>> …] <</createaudiogroup>>`

Collects tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio), into a group via its `<<track>>` children.  Groups are useful for applying actions to multiple tracks simultaneously and/or excluding the included tracks from a larger set when applying actions.

**NOTE:** The [`StoryInit`](#special-passage-storyinit) special passage is normally the best place to set up groups.

#### Since:

* `v2.19.0`

#### Arguments:

##### `<<createaudiogroup>>`

* **`groupId`:** The ID of the group that will be used to reference it and *must* begin with a colon.  **NOTE:** There are several predefined group IDs (`:all`, `:looped`, `:muted`, `:paused`, `:playing`) and the `:not` group modifier that cannot be reused/overwritten.

##### `<<track>>`

* **`trackId`:** The ID of the track.

#### Example:

```
→ Given the following (best done in the StoryInit special passage)
<<cacheaudio "ui_beep"  "media/audio/ui/beep.mp3">>
<<cacheaudio "ui_boop"  "media/audio/ui/boop.mp3">>
<<cacheaudio "ui_swish" "media/audio/ui/swish.mp3">>

→ Set up a group ":ui" with the tracks: "ui_beep", "ui_boop", and "ui_swish"
<<createaudiogroup ":ui">>
	<<track "ui_beep">>
	<<track "ui_boop">>
	<<track "ui_swish">>
<</createaudiogroup>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-createplaylist"></span>
### `<<createplaylist listId>> [<<track trackId actionList>> …] <</createplaylist>>`

Collects tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio), into a playlist via its `<<track>>` children.

**NOTE:** The [`StoryInit`](#special-passage-storyinit) special passage is normally the best place to set up playlists.

#### Since:

* `v2.8.0`: Basic syntax.
* `v2.29.0`: Deprecated `<<track>>` `copy` keyword in favor of `own`.

#### Arguments:

##### `<<createplaylist>>`

* **`listId`:** The ID of the playlist, which will be used to reference it.

##### `<<track>>`

* **`trackId`:** The ID of the track.
* **`actionList`:** The list of actions to perform.  Available actions are:
	* **`volume` *`level`*:** (optional) Set the base volume of the track within the playlist to the specified level.  If omitted, defaults to the track's current volume.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.
	* **`own`:** (optional) Keyword, used to signify that the playlist should create its own independent copy of the track, rather than simply referencing the existing version.  Owned copies are solely under the control of their playlist—meaning [`<<audio>>`](#macros-macro-audio) actions cannot affect them, even when using group IDs.

#### Example:

```
→ Given the following setup (best done in the StoryInit special passage)
<<cacheaudio "swamped"       "media/audio/Swamped.mp3">>
<<cacheaudio "heavens_a_lie" "media/audio/Heaven's_A_Lie.mp3">>
<<cacheaudio "closer"        "media/audio/Closer.mp3">>
<<cacheaudio "to_the_edge"   "media/audio/To_The_Edge.mp3">>

→ Create a playlist "bgm_lacuna" with the tracks: "swamped", "heavens_a_lie", "closer", and "to_the_edge"
<<createplaylist "bgm_lacuna">>
	<<track "swamped"       volume 1>>      → Add "swamped" at 100% volume
	<<track "heavens_a_lie" volume 0.5>>    → Add "heavens_a_lie" at 50% volume
	<<track "closer"        own>>           → Add an owned copy of "closer" at its current volume
	<<track "to_the_edge"   volume 1 own>>  → Add an owned copy of "to_the_edge" at 100% volume
<</createplaylist>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-masteraudio"></span>
### `<<masteraudio actionList>>`

Controls the master audio settings.

**SEE:** [Audio macro limitations](#macros-audio-limitations).

#### Since:

* `v2.8.0`: Basic syntax.
* `v2.28.0`: Added `load`, `muteonhide`, `nomuteonhide`, and `unload` actions.

#### Arguments:

* **`actionList`:** The list of actions to perform.  Available actions are:
	* **`load`:** Pause playback of *all* tracks and, if they're not already in the process of loading, force them to drop any existing data and begin loading.  **NOTE:** This *should not* be done lightly if your audio sources are on the network, as it forces the player to begin downloading them.
	* **`mute`:** Mute the master volume (effectively volume `0`, except without changing the volume level).
	* **`muteonhide`:** Enable automatic muting of the master volume when losing visibility—i.e. when switched to another tab or the browser window is minimized.
	* **`nomuteonhide`:** Disable automatic muting of the master volume when losing visibility (this is the default).
	* **`stop`:** Stop playback of *all* tracks.
	* **`unload`:** Stop playback of *all* tracks and force them to drop any existing data.  **NOTE:** Once unloaded, playback cannot occur until a `load` action is issued for each track—either a master `load` action, to affect all tracks, or an `<<audio>>`/`<<playlist>>` `load` action, to affect only certain tracks.
	* **`unmute`:** Unmute the master volume (this is the default).
	* **`volume` *`level`*:** Set the master volume to the specified level.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Example:

##### Basic usage

```
→ Stop playback of all registered tracks, no exceptions
<<masteraudio stop>>

→ Change the master volume to 40%
<<masteraudio volume 0.40>>

→ Mute the master volume
<<masteraudio mute>>

→ Unmute the master volume
<<masteraudio unmute>>

→ Enable automatic muting of the master volume when losing visibility
<<masteraudio muteonhide>>

→ Disable automatic muting of the master volume when losing visibility
<<masteraudio nomuteonhide>>
```

##### Using the `load` and `unload` actions

**NOTE:** Be *very careful* with these if your audio sources are on the network, as you are forcing players to begin downloading them.  Not everyone has
blazing fast internet with unlimited data—especially true for mobile users.  Pease, *do not* take your players' bandwidth and data usage lightly.

```
→ If they're not currently loading, drop existing data buffers and load all tracks
<<masteraudio load>>

→ Unload all tracks, dropping existing data buffers
<<masteraudio unload>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-playlist"></span>
### `<<playlist listId actionList>>`<br><span class="deprecated">`<<playlist actionList>>`</span>

Controls the playback of the playlist, which must be set up via [`<<createplaylist>>`](#macros-macro-createplaylist)—the deprecated [`<<setplaylist>>`](#macros-macro-setplaylist) may be used instead, though it is not recommended.

**SEE:** [Audio macro limitations](#macros-audio-limitations).

#### Since:

* `v2.0.0`: Basic syntax, compatible with `<<setplaylist>>`.
* `v2.1.0`: Added `fadeoverto` action.
* `v2.8.0`: Added `listId` argument, compatible with `<<createplaylist>>`.  Deprecated `<<setplaylist>>` compatible form.
* `v2.28.0`: Added `load` and `unload` actions.

#### Arguments:

##### `<<createplaylist>>`-compatible form

* **`listId`:** The ID of the playlist.
* **`actionList`:** The list of actions to perform.  Available actions are:
	* **`fadein`:** Start playback of the playlist and fade the current track from its current volume level to `1` (loudest) over `5` seconds.
	* **`fadeout`:** Start playback of the playlist and fade the current track from its current volume level to `0` (silent) over `5` seconds.
	* **`fadeoverto` *`seconds`* *`level`*:** Start playback of the playlist and fade the current track from its current volume level to the specified level over the specified number of seconds.
	* **`fadeto` *`level`*:** Start playback of the playlist and fade the current track from its current volume level to the specified level over `5` seconds.
	* **`load`:** Pause playback of the playlist and, if its tracks are not already in the process of loading, force them to drop any existing data and begin loading.  **NOTE:** This *should not* be done lightly if your audio sources are on the network, as it forces the player to begin downloading them.
	* **`loop`:** Set the playlist to repeat playback upon ending.
	* **`mute`:** Mute the volume of the playlist (effectively volume `0`, except without changing the volume level).
	* **`pause`:** Pause playback of the playlist.
	* **`play`:** Start playback of the playlist.
	* **`shuffle`:** Set the playlist to randomly shuffle.
	* **`skip`:** Skip ahead to the next track in the queue.  An empty queue will not be refilled unless repeat playback has been set.
	* **`stop`:** Stop playback of the playlist.
	* **`unload`:** Stop playback of the playlist and force its tracks to drop any existing data.  **NOTE:** Once unloaded, playback cannot occur until a `load` action is issued.
	* **`unloop`:** Set the playlist to not repeat playback (this is the default).
	* **`unmute`:** Unmute the volume of the playlist (this is the default).
	* **`unshuffle`:** Set the playlist to not randomly shuffle (this is the default).
	* **`volume` *`level`*:** Set the volume of the playlist to the specified level.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

##### `<<setplaylist>>`-compatible form

* **`actionList`:** *Identical to the `<<createplaylist>>`-compatible form.*

#### Example: *(only `<<createplaylist>>`-compatible form shown)*

##### Basic usage

```
→ Given the following (best done in the StoryInit special passage)
<<cacheaudio "swamped"       "media/audio/Swamped.mp3">>
<<cacheaudio "heavens_a_lie" "media/audio/Heaven's_A_Lie.mp3">>
<<cacheaudio "closer"        "media/audio/Closer.mp3">>
<<cacheaudio "to_the_edge"   "media/audio/To_The_Edge.mp3">>
<<createplaylist "bgm_lacuna">>
	<<track "swamped"       volume 1>>
	<<track "heavens_a_lie" volume 1>>
	<<track "closer"        volume 1>>
	<<track "to_the_edge"   volume 1>>
<</createplaylist>>

→ Start playback
<<playlist "bgm_lacuna" play>>

→ Start playback at 50% volume
<<playlist "bgm_lacuna" volume 0.5 play>>

→ Start non-repeating playback
<<playlist "bgm_lacuna" unloop play>>

→ Start playback with a randomly shuffled playlist
<<playlist "bgm_lacuna" shuffle play>>

→ Start playback and fade from 0% to 100% volume
<<playlist "bgm_lacuna" volume 0 fadein>>

→ Start playback and fade from 75% to 0% volume
<<playlist "bgm_lacuna" volume 0.75 fadeout>>

→ Start playback and fade from 25% to 75% volume
<<playlist "bgm_lacuna" volume 0.25 fadeto 0.75>>

→ Start playback and fade from 25% to 75% volume over 30 seconds
<<playlist "bgm_lacuna" volume 0.25 fadeoverto 30 0.75>>

→ Pause playback
<<playlist "bgm_lacuna" pause>>

→ Stop playback
<<playlist "bgm_lacuna" stop>>

→ Mute playback, without changing the current playback state
<<playlist "bgm_lacuna" mute>>

→ Unmute playback, without changing the current playback state
<<playlist "bgm_lacuna" unmute>>

→ Change the volume to 40%, without changing the current playback state
<<playlist "bgm_lacuna" volume 0.40>>

→ Set the playlist to randomly shuffle, without changing the current playback state
<<playlist "bgm_lacuna" shuffle>>
```

##### Using the `load` and `unload` actions

**NOTE:** Be *very careful* with these if your audio sources are on the network, as you are forcing players to begin downloading them.  Not everyone has
blazing fast internet with unlimited data—especially true for mobile users.  Pease, *do not* take your players' bandwidth and data usage lightly.

```
→ If they're not currently loading, drop existing data buffers and load all of the playlist's tracks
<<playlist "bgm_lacuna" load>>

→ Unload all of the playlist's tracks, dropping existing data buffers
<<playlist "bgm_lacuna" unload>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-removeaudiogroup"></span>
### `<<removeaudiogroup groupId>>`

Removes the audio group with the given ID.

**NOTE:** You may not remove the predefined group IDs (`:all`, `:looped`, `:muted`, `:paused`, `:playing`) or the `:not` group modifier.

#### Since:

* `v2.28.0`

#### Arguments:

* **`groupId`:** The ID of the group.

#### Example:

```
→ Given a group set up via <<createaudiogroup ":ui">>…<</createplaylist>>
<<removeaudiogroup ":ui">>
```

<!-- *********************************************************************** -->

<span id="macros-macro-removeplaylist"></span>
### `<<removeplaylist listId>>`

Removes the playlist with the given ID.

#### Since:

* `v2.8.0`

#### Arguments:

* **`listId`:** The ID of the playlist.

#### Example:

```
→ Given a playlist set up via <<createplaylist "bgm_lacuna">>…<</createplaylist>>
<<removeplaylist "bgm_lacuna">>
```

<!-- *********************************************************************** -->

<span id="macros-macro-waitforaudio"></span>
### `<<waitforaudio>>`

Displays the loading screen until *all* currently registered audio has either loaded to a playable state or aborted loading due to errors.  Requires tracks to be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio).

**NOTE:** This macro should be invoked ***once*** following any invocations of `<<cacheaudio>>` and `<<createplaylist>>`, if any `<<track>>` definitions used the `copy` keyword, for which you want the loading screen displayed.

#### Since:

* `v2.8.0`

#### Arguments: *none*

#### Example:

##### Basic usage

```
<<cacheaudio "a" "a_track.…">>
<<cacheaudio "b" "b_track.…">>
<<cacheaudio "c" "c_track.…">>
<<cacheaudio "d" "d_track.…">>
<<waitforaudio>>
```

##### Load only selected audio at startup

```
→ First, register the tracks that will be needed soon
<<cacheaudio "a" "a_track.…">>
<<cacheaudio "b" "b_track.…">>

→ Next, load all currently registered tracks (meaning: "a" and "b")
<<waitforaudio>>

→ Finally, register any tracks that won't be needed until later
<<cacheaudio "c" "c_track.…">>
<<cacheaudio "d" "d_track.…">>
```

<!-- *********************************************************************** -->

<span id="macros-macro-setplaylist"></span>
### <span class="deprecated">`<<setplaylist trackIdList>>`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-createplaylist"><code>&lt;&lt;createplaylist&gt;&gt;</code></a> macro for its replacement.
</p>

Collects audio tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio), into a playlist by making its own independent copies of the tracks, rather than simply referencing the existing versions.  Copies are solely under the control of the playlist—meaning [`<<audio>>`](#macros-macro-audio) actions cannot affect them, even when using group IDs.

**NOTE:** The [`StoryInit`](#special-passage-storyinit) special passage is normally the best place to set up playlists.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.8.0`: Deprecated in favor of `<<createplaylist>>`.

#### Arguments:

* **`trackIdList`:** A space separated list of track ID(s) for the playlist (only one is required).

#### Example:

```
→ Given the following (best done in the StoryInit special passage)
<<cacheaudio "swamped"       "media/audio/Swamped.mp3">>
<<cacheaudio "heavens_a_lie" "media/audio/Heaven's_A_Lie.mp3">>
<<cacheaudio "closer"        "media/audio/Closer.mp3">>
<<cacheaudio "to_the_edge"   "media/audio/To_The_Edge.mp3">>

→ Set up the playlist with the tracks: "swamped", "heavens_a_lie", "closer", and "to_the_edge"
<<setplaylist "swamped" "heavens_a_lie" "closer" "to_the_edge">>
```

<!-- *********************************************************************** -->

<span id="macros-macro-stopallaudio"></span>
### <span class="deprecated">`<<stopallaudio>>`</span>

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-audio"><code>&lt;&lt;audio&gt;&gt;</code></a> macro for its replacement.
</p>

Immediately stops the playback of all tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio).

**NOTE:** Does not affect playlist tracks that have been copied into their respective playlist—meaning those set up via [`<<createplaylist>>`](#macros-macro-createplaylist) with its `copy` action or all tracks set up via, the deprecated, [`<<setplaylist>>`](#macros-macro-setplaylist).

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.8.0`: Deprecated in favor of `<<audio ":all" stop>>`.

#### Arguments: *none*

#### Example:

```
<<stopallaudio>>
```


<!-- ***************************************************************************
	Miscellaneous Macros
**************************************************************************** -->
<span id="macros-miscellaneous"></span>
## Miscellaneous Macros

<!-- *********************************************************************** -->

<span id="macros-macro-goto"></span>
### `<<goto passageName>>`<br>`<<goto linkMarkup>>`

Immediately forwards the player to the passage with the given name.  May be called either with the passage name or with a link markup.

**NOTE:** In most cases, you will not need to use `<<goto>>` as there are often better and easier ways to forward the player.  For example, a common use of [`<<link>>`](#macros-macro-link) is to perform various actions before forwarding the player to another passage.  In that case, unless you need to dynamically determine the destination passage within the `<<link>>` body, `<<goto>>` is unnecessary as `<<link>>` already includes the ability to forward the player.

<p role="note" class="warning"><b>Warning:</b>
<code>&lt;&lt;goto&gt;&gt;</code> <strong><em>does not</em></strong> terminate passage rendering in the passage where it was encountered, so care must be taken to ensure that no unwanted state modifications occur after its call.
</p>

#### Since:

* `v2.0.0`

#### Arguments:

##### Passage name form

* **`passageName`:** The name of the passage to go to.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

#### Example:

```
→ Passage name form
<<goto "Somewhere over yonder">>
<<goto $selectedPassage>>

→ Link markup form
<<goto [[Somewhere over yonder]]>>
<<goto [[$selectedPassage]]>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-repeat"></span>
### `<<repeat delay [transition|t8n]>> … <</repeat>>`

Repeatedly executes its contents after the given delay, inserting any output into the passage in its place.  May be terminated by a [`<<stop>>`](#macros-macro-stop) macro.

**NOTE:** Passage navigation terminates all pending timed executions.

#### Since:

* `v2.0.0`

#### Arguments:

* **`delay`:** The amount of time to delay, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  The minimum delay is `40ms`.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Example:

```
→ A countdown timer
<<set $seconds to 10>>\
Countdown: <span id="countdown">$seconds seconds remaining</span>!\
<<silently>>
	<<repeat 1s>>
		<<set $seconds to $seconds - 1>>
		<<if $seconds gt 0>>
			<<replace "#countdown">>$seconds seconds remaining<</replace>>
		<<else>>
			<<replace "#countdown">>Too Late<</replace>>
			/* do something useful here */
			<<stop>>
		<</if>>
	<</repeat>>
<</silently>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-stop"></span>
### `<<stop>>`

Used within [`<<repeat>>`](#macros-macro-repeat) macros.  Terminates the execution of the current `<<repeat>>`.

#### Since:

* `v2.0.0`

#### Arguments: *none*

<!-- *********************************************************************** -->

<span id="macros-macro-timed"></span>
### `<<timed delay [transition|t8n]>> … [<<next [delay]>> …] <</timed>>`

Executes its contents after the given delay, inserting any output into the passage in its place.  Additional timed executions may be chained via `<<next>>`.

**NOTE:** Passage navigation terminates all pending timed executions.

#### Since:

* `v2.0.0`

#### Arguments:

##### `<<timed>>`

* **`delay`:** The amount of time to delay, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  The minimum delay is `40ms`.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

##### `<<next>>`

* **`delay`:** (optional) The amount of time to delay, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  The minimum delay is `40ms`.  If omitted, the last delay specified, from a `<<next>>` or the parent `<<timed>>`, will be used.

#### Example:

```
→ Insert some text after 5 seconds with a transition
I want to go to…<<timed 5s t8n>> WONDERLAND!<</timed>>

→ Replace some text after 10 seconds
I like green <span id="eggs">eggs</span> and ham!\
<<timed 10s>><<replace "#eggs">>pancakes<</replace>><</timed>>

→ A execute <<goto>> after 10 seconds
<<timed 10s>><<goto "To the Moon, Alice">><</timed>>

→ Insert some text in 2 second intervals three times (at: 2s, 4s, 6s)
<<timed 2s>>Hi! Ho!
<<next>>Hi! Ho!
<<next>>It's off to work we go!
<</timed>>

→ Replace some text in 1 second intervals
I'll have <span id="drink">some water</span>, please.\
<<timed 1s>><<replace "#drink">>a glass of milk<</replace>>\
<<next>><<replace "#drink">>a can of soda<</replace>>\
<<next>><<replace "#drink">>a cup of coffee<</replace>>\
<<next>><<replace "#drink">>tea, southern style, sweet<</replace>>\
<<next>><<replace "#drink">>a scotch, neat<</replace>>\
<<next>><<replace "#drink">>a bottle of your finest absinthe<</replace>>\
<</timed>>

→ Set a $variable after 4 seconds, 3 seconds, 2 seconds, and 1 second
<<silently>>
<<set $choice to 0>>
<<timed 4s>>
	<<set $choice to 1>>
<<next 3s>>
	<<set $choice to 2>>
<<next 2s>>
	<<set $choice to 3>>
<<next 1s>>
	<<set $choice to 4>>
<</timed>>
<<silently>>
```

<!-- *********************************************************************** -->

<span id="macros-macro-widget"></span>
### `<<widget widgetName>> … <</widget>>`

Creates a new widget macro (henceforth, widget) with the given name.  Widgets allow you to create macros by using the standard macros and markup that you use normally within your story.  Widgets may access arguments passed to them via the `$args` array-like object, whose indices are zero-based—i.e. `$args[0]` is the first parsed argument, `$args[1]` is the second, etc.  Additionally, the full argument string—in raw and parsed forms—may be accessed via the `$args.raw` and `$args.full` properties.

<p role="note" class="warning"><b>Warning:</b>
Widgets should <em>always</em> be defined within a <code>widget</code>-tagged passage—any widgets that are not may be lost on page reload—and you may use as few or as many such passages as you desire.  <em>Do not</em> add a <code>widget</code> tag to any of the <a href="#special-passages">specially named passages</a> and attempt to define your widgets there.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>$args</code> array-like object should be treated as though it were immutable—i.e., unable to be modified—because in the future it will be made thus, so any attempt to modify it will cause an error.
</p>

#### Since:

* `v2.0.0`

#### Notes:

* The `$args` variable is used internally to store passed arguments and the full argument string.  When a widget is called, any existing `$args` variable is stored for the duration of the call and restored after.  This means that non-widget use of an `$args` variable is safe.  **NOTE:** This does have the effect that an `$args` variable external to a widget is inaccessible to it unless passed in as an argument.
* The variables used in widgets are part of a story's variable store, so if temp/scratch variables are needed, care *must be* taken not to overwrite important story variables.  Also, temp/scratch variables should normally be initialized or you could pick up a value from a previous execution.

#### Arguments:

* **`widgetName`:** The name of the created widget, which should not contain whitespace or angle brackets (`<`, `>`).  If the name of an existing widget is chosen, the new widget will overwrite the older version.  The names of existing standard macros are invalid widget names, so you cannot overwrite standard macros, and any attempts to do so will cause an error.

#### Example:

```
→ Creating a gender pronoun widget
<<widget "he">><<if $pcSex eq "male">>he<<elseif $pcSex eq "female">>she<<else>>it<</if>><</widget>>
→ Using it
"Are you sure that <<he>> can be trusted?"

→ Creating a silly print widget
<<widget "pm">><<if $args[0]>><<print $args[0]>><<else>>Mum's the word!<</if>><</widget>>
→ Using it
<<pm>>        → Outputs: Mum's the word!
<<pm "Hi!">>  → Outputs: Hi!
```
