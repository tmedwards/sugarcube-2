<!-- ***********************************************************************************************
	Macros
************************************************************************************************ -->
# Macros {#macros}


<!-- ***************************************************************************
	Macro Arguments
**************************************************************************** -->
## Macro Arguments {#macros-arguments}

Macros fall into two broad categories based on the kind of arguments they accept: those that want an expression—e.g., `<<set>>` and `<<print>>`—and those that want discrete arguments separated by whitespace—e.g., `<<link>>` and `<<audio>>`.  The documentation for each macro will tell you what it expects.

Those that want an expression are fairly straightforward, as you simply supply an [expression](#twinescript-expressions).

The discrete argument type of macros are also fairly straightforward, most of the time, as you simply supply the requisite arguments separated by whitespace, which may include variables—as SugarCube automatically yields their values to the macro.  There are cases, however, where things get a bit more complicated, namely: instances where you need to pass the name of a variable as an argument, rather than its value, and those where you want to pass the result of an expression as argument.

#### Argument type macros: passing a variable's name as an argument

Passing the name of a variable as an argument is problematic because variable substitution occurs automatically in SugarCube macros.  Meaning that when you pass a variable as an argument, its value is passed to the macro rather than its name.

Normally, this is exactly what you want to happen.  Occasionally, however, macros will need the name of a variable rather than its value—e.g., data input macros like `<<textbox>>`—so that they may modify the variable.  To resolve these instances, you will need to quote the name of the variable—i.e., instead of passing `$pie` as normal, you'd pass `"$pie"`.  These, rare, instances are noted in the macros' documentation and shown in their examples.

#### Argument type macros: passing an expression as an argument

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
## Variables Macros {#macros-variables}

<!-- *********************************************************************** -->

### `<<capture variableList>> … <</capture>>` {#macros-macro-capture}

Captures story $variables and temporary \_variables, creating localized versions of their values within the macro body.

<p role="note"><b>Note:</b>
Use of this macro is <em>only</em> necessary when you need to localize a variable's value for use with an asynchronous macro—i.e., a macro whose contents are executed at some later time, rather than when it's invoked; e.g., <a href="#macros-interactive">interactive macros</a>, <a href="#macros-macro-repeat"><code>&lt;&lt;repeat&gt;&gt;</code></a>, <a href="#macros-macro-timed"><code>&lt;&lt;timed&gt;&gt;</code></a>.  Generally, this means only when the variable's value will change between the time the asynchronous macro is invoked and when it's activated—e.g., a loop variable.
</p>

#### History:

* `v2.14.0`: Introduced.

#### Arguments:

* **`variableList`:** A list of story $variables and/or temporary \_variables.

#### Examples:

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

### `<<set expression>>` {#macros-macro-set}

Sets story $variables and temporary \_variables based on the given expression.

#### History:

* `v2.0.0`: Introduced.

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
<td><pre><code>&lt;&lt;set $apples to 6&gt;&gt;</code></pre></td>
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
<td><pre><code>&lt;&lt;set $apples = 6&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>+=</code></th>
<td>Adds the value on the right-hand side of the operator to the current value on the left-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>&lt;&lt;set $apples += 1&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>-=</code></th>
<td>Subtracts the value on the right-hand side of the operator from the current value on the left-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>&lt;&lt;set $apples -= 1&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>&#x2a;=</code></th>
<td>Multiplies the current value on the left-hand side of the operator by the value on the right-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>&lt;&lt;set $apples &#x2a;= 2&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>/=</code></th>
<td>Divides the current value on the left-hand side of the operator by the value on the right-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>&lt;&lt;set $apples /= 2&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>%=</code></th>
<td>Divides the current value on the left-hand side of the operator by the value on the right-hand side and assigns the remainder to the left-hand side.</td>
<td><pre><code>&lt;&lt;set $apples %= 10&gt;&gt;</code></pre></td>
</tr>
</tbody>
</table>

#### Examples:

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

### `<<unset variableList>>` {#macros-macro-unset}

Unsets story $variables and temporary \_variables.

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`variableList`:** A list of story $variables and/or temporary \_variables.

#### Examples:

```
<<unset $cheese, $chestEmpty, $gold>>
<<unset _someTempVar>>
```

<!-- *********************************************************************** -->

### <span class="deprecated">`<<remember expression>>`</span> {#macros-macro-remember}

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#functions-function-memorize"><code>memorize()</code></a> and <a href="#functions-function-recall"><code>recall()</code></a> functions for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.29.0`: Deprecated in favor of `memorize()` and `recall()`.

<!-- *********************************************************************** -->

### <span class="deprecated">`<<forget variableList>>`</span> {#macros-macro-forget}

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#functions-function-forget"><code>forget()</code></a> function for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.29.0`: Deprecated in favor of `forget()`.


<!-- ***************************************************************************
	Scripting Macros
**************************************************************************** -->
## Scripting Macros {#macros-scripting}

<!-- *********************************************************************** -->

### `<<run expression>>` {#macros-macro-run}

*Functionally identical to [`<<set>>`](#macros-macro-set).  Intended to be mnemonically better for uses where the expression is arbitrary code, rather than variables to set—i.e., `<<run>>` to run code, `<<set>>` to set variables.*

<!-- *********************************************************************** -->

### `<<script>> … <</script>>` {#macros-macro-script}

Silently executes its contents as *pure* JavaScript code—i.e., it performs no story or temporary variable substitution or TwineScript operator processing.  For instances where you need to run some pure JavaScript and don't want to waste time performing extra processing on code that has no story or temporary variables or TwineScript operators in it and/or worry about the parser possibly clobbering the code.

<p role="note"><b>Note:</b>
The predefined variable <code>output</code>, which is a reference to a local content buffer, is available for use within the macro's code contents.  Once the code has been fully executed, the contents of the buffer, if any, will be output.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments: *none*

#### Examples:

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
## Display Macros {#macros-display}

<!-- *********************************************************************** -->

### `<<= expression>>` {#macros-macro-equal}

Outputs a string representation of the result of the given expression.  This macro is an alias for [`<<print>>`](#macros-macro-print).

<p role="note" class="tip"><b>Tip:</b>
If you only need to print the value of a TwineScript variable, then you may simply include it in your normal passage text and it will be printed automatically via the <a href="#markup-naked-variable">naked variable markup</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

#### Examples:

```
→ Assuming $gold is 5
You found <<= $gold>> gold.             → Outputs: You found 5 gold.

→ Assuming $weight is 74.6466266
You weigh <<= $weight.toFixed(2)>> kg.  → Outputs: You weigh 74.65 kg.
```

<!-- *********************************************************************** -->

### `<<- expression>>` {#macros-macro-hyphen}

Outputs a string representation of the result of the given expression.  This macro is functionally identical to [`<<print>>`](#macros-macro-print), save that it also encodes HTML special characters in the output.

<p role="note" class="tip"><b>Tip:</b>
If you only need to print the value of a TwineScript variable, then you may simply include it in your normal passage text and it will be printed automatically via the <a href="#markup-naked-variable">naked variable markup</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

#### Examples:

```
→ Assuming $gold is 5
You found <<- $gold>> gold.             → Outputs: You found 5 gold.

→ Assuming $weight is 74.6466266
You weigh <<- $weight.toFixed(2)>> kg.  → Outputs: You weigh 74.65 kg.
```

<!-- *********************************************************************** -->

### `<<include passageName [elementName]>>`<br>`<<include linkMarkup [elementName]>>` {#macros-macro-include}

Outputs the contents of the passage with the given name, optionally wrapping it within an HTML element.  May be called either with the passage name or with a link markup.

#### History:

* `v2.15.0`: Introduced.

#### Arguments:

##### Passage name form

* **`passageName`:** The name of the passage to include.
* **`elementName`:** (optional) The HTML element to wrap the included passage in.  If used, the element will include the passage's name normalized into a class name.  See [CSS passage conversions](#css-passage-conversions) for more information.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).
* **`elementName`:** *Identical to the passage name form.*

#### Examples:

```
<<include "Go West">>          → Include the passage "Go West"
<<include [[Go West]]>>        → Include the passage "Go West"
<<include "Go West" "div">>    → Include the passage "Go West", wrapping it within a <div>
<<include [[Go West]] "div">>  → Include the passage "Go West", wrapping it within a <div>
```

<!-- *********************************************************************** -->

### `<<nobr>> … <</nobr>>` {#macros-macro-nobr}

Executes its contents and outputs the result, after removing leading/trailing newlines and replacing all remaining sequences of newlines with single spaces.

<p role="note"><b>Note:</b>
The <a href="#special-tag-nobr"><code>nobr</code> special tag</a> and <a href="#config-api-property-passages-nobr"><code>Config.passages.nobr</code> setting</a> applies the same processing to an entire passage or all passages, respectively.  The <a href="#markup-line-continuation">line continuation markup</a> performs a similar function, though in a slightly different way.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments: *none*

#### Examples:

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

### `<<print expression>>` {#macros-macro-print}

Outputs a string representation of the result of the given expression.

<p role="note" class="tip"><b>Tip:</b>
If you only need to print the value of a TwineScript variable, then you may simply include it in your normal passage text and it will be printed automatically via the <a href="#markup-naked-variable">naked variable markup</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

#### Examples:

```
→ Assuming $gold is 5
You found <<print $gold>> gold.             → Outputs: You found 5 gold.

→ Assuming $weight is 74.6466266
You weigh <<print $weight.toFixed(2)>> kg.  → Outputs: You weigh 74.65 kg.
```

<!-- *********************************************************************** -->

### `<<silently>> … <</silently>>` {#macros-macro-silently}

Causes any output generated within its body to be discarded, except for errors (which will be displayed).  Generally, only really useful for formatting blocks of macros for ease of use/readability, while ensuring that no output is generated, from spacing or whatnot.

#### History:

* `v2.0.0`: Introduced.

#### Arguments: *none*

#### Examples:

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

### `<<type speed [start delay] [class classes] [element tag] [id ID] [keep|none] [skipkey key]>>`<br><span class="child">`…`</span><br>`<</type>>` {#macros-macro-type}

Outputs its contents a character—technically, a code point—at a time, mimicking a teletype/typewriter.  Can type most content: links, markup, macros, etc.

<p role="note" class="warning"><b>Warning:</b>
Interactions with macros or other code that inject content only after some external action or period—e.g., <code>&lt;&lt;linkreplace&gt;&gt;</code>, <code>&lt;&lt;timed&gt;&gt;</code>, etc.—may or may not behave as you'd expect.  Testing is <strong><em>strongly</em></strong> advised.
</p>

<p role="note" class="see"><b>See Also:</b>
<a href="#config-api-property-macros-typeskipkey"><code>Config.macros.typeSkipKey</code></a>, <a href="#config-api-property-macros-typevisitedpassages"><code>Config.macros.typeVisitedPassages</code></a>, <a href="#events-type-macro"><code>&lt;&lt;type&gt;&gt;</code> Events</a>.
</p>

#### History:

* `v2.32.0`: Introduced.
* `v2.33.0`: Added `class`, `element`, and `id` options and `macro-type-done` class.
* `v2.33.1`: Added `skipkey` option.

#### Arguments:

* **`speed`:** The rate at which characters are typed, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `1s` and `40ms`.  Values in the range `20–60ms` are a good starting point.
* **`start` *`delay`*:** (optional) The amount of time to delay the start of typing, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  If omitted, defaults to `400ms`.
* **`class` *`classes`*:** (optional) The space separated list of classes to be added to the typing container.
* **`element` *`tag`*:** (optional) The element to use as the typing container—e.g., `div` and `span`.  If omitted, defaults to `div`.
* **`id` *`ID`*:** (optional) The unique ID to be assigned to the typing container.
* **`keep`:** (optional) Keyword, used to signify that the cursor should be kept after typing is complete.
* **`none`:** (optional) Keyword, used to signify that the cursor should not be used at all.
* **`skipkey`:** (optional) The key used to cause typing to finish immediately.  If omitted, defaults to the value of [`Config.macros.typeSkipKey`](#config-api-property-macros-typeskipkey).

#### Examples:

```
<<type 40ms>>
	Type characters from this content every 40 milliseconds.  Including [[links]] and ''other markup''!
<</type>>

<<type 40ms start 2s>>
	Type characters from this content every 40 milliseconds, starting after a 2 second delay.
<</type>>

<<type 40ms class "foo bar">>
	Type characters from this content every 40 milliseconds, adding classes to the typing container.
<</type>>

<<type 40ms element "span">>
	Type characters from this content every 40 milliseconds, using a <span> as the typing container.
<</type>>

<<type 40ms id "type01">>
	Type characters from this content every 40 milliseconds, assigning an ID to the typing container.
<</type>>

<<type 40ms keep>>
	Type characters from this content every 40 milliseconds, keeping the cursor after typing is complete.
<</type>>

<<type 40ms skipkey "Control">>
	Type characters from this content every 40 milliseconds, using the Control (CTRL) key as the skip key.
<</type>>
```

#### CSS styles:

The typed text has no default styling.  If you want to change the font or color, then you'll need to change the styling of the `macro-type` class.  For example:

```css
.macro-type {
	color: limegreen;
	font-family: monospace, monospace;
}
```

There's also a `macro-type-done` class that is added to text that has finished typing, which may be used to style it differently from actively typing text.

The default cursor is the block element character **Right Half Block (U+2590)** and it has no default font or color styling.  If you want to change the font, color, or character, then you'll need to change the styling of the `:after` pseudo-element of the `macro-type-cursor` class.  For example:

```css
.macro-type-cursor:after {
	color: limegreen;
	content: "\269C\FE0F"; /* Fleur-de-lis emoji */
	font-family: monospace, monospace;
}
```

<!-- *********************************************************************** -->

### <span class="deprecated">`<<display passageName [elementName]>>`<br>`<<display linkMarkup [elementName]>>`</span> {#macros-macro-display}

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-include"><code>&lt;&lt;include&gt;&gt;</code></a> macro for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.15.0`: Deprecated in favor of `<<include>>`.


<!-- ***************************************************************************
	Control Macros
**************************************************************************** -->
## Control Macros {#macros-control}

<!-- *********************************************************************** -->

### `<<if conditional>> … [<<elseif conditional>> …] [<<else>> …] <</if>>` {#macros-macro-if}

Executes its contents if the given conditional expression evaluates to `true`.  If the condition evaluates to `false` and an `<<elseif>>` or `<<else>>` exists, then other contents can be executed.

<p role="note"><b>Note:</b>
SugarCube does not trim whitespace from the contents of <code>&lt;&lt;if&gt;&gt;</code> macros, so that authors don't have to resort to various kludges to get whitespace where they want it.  This means, however, that extra care must be taken when writing them to ensure that unwanted whitespace is not created within the final output.
</p>

#### History:

* `v2.0.0`: Introduced.

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
<td><pre><code>&lt;&lt;if $bullets is 6&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>isnot</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same type and/or value." class="info"><em>strictly</em> not equal</span>.</td>
<td><pre><code>&lt;&lt;if $pie isnot "cherry"&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>eq</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same value or coerce into the same value." class="info">equivalent</span>.</td>
<td><pre><code>&lt;&lt;if $bullets eq 6&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>neq</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same value nor do they coerce into the same value." class="info">not equivalent</span>.</td>
<td><pre><code>&lt;&lt;if $pie neq "cherry"&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>gt</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than the right side.</td>
<td><pre><code>&lt;&lt;if $cash gt 5&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>gte</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than or equal to the right side.</td>
<td><pre><code>&lt;&lt;if $foundStars gte $neededStars&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>lt</code></th>
<td>Evaluates to <code>true</code> if the left side is less than the right side.</td>
<td><pre><code>&lt;&lt;if $shoeCount lt ($peopleCount * 2)&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>lte</code></th>
<td>Evaluates to <code>true</code> if the left side is less than or equal to the right side.</td>
<td><pre><code>&lt;&lt;if $level lte 30&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>not</code></th>
<td>Flips a <code>true</code> evaluation to <code>false</code>, and vice versa.</td>
<td><pre><code>&lt;&lt;if not $hungry&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>and</code></th>
<td>Evaluates to <code>true</code> if all subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>&lt;&lt;if $age gte 20 and $age lte 30&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>or</code></th>
<td>Evaluates to <code>true</code> if any subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>&lt;&lt;if $friend is "Sue" or $friend is "Dan"&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>def</code></th>
<td>Evaluates to <code>true</code> if the right side is defined.</td>
<td><pre><code>&lt;&lt;if def $mushrooms&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>ndef</code></th>
<td>Evaluates to <code>true</code> if the right side is not defined.</td>
<td><pre><code>&lt;&lt;if ndef $bottlecaps&gt;&gt;</code></pre></td>
</tr>
</tbody>
</table>

<p role="note" class="warning"><b>Warning:</b>
The <code>def</code> and <code>ndef</code> operators have very low precedence, so it is <strong><em>strongly</em></strong> recommended that if you mix them with other operators, that you wrap them in parentheses—e.g., <code>(def $style) and ($style is "girly")</code>.
</p>

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
<td><pre><code>&lt;&lt;if $bullets === 6&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>!==</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same type and/or value." class="info"><em>strictly</em> not equal</span>.</td>
<td><pre><code>&lt;&lt;if $pie !== "cherry"&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>==</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same value or coerce into the same value." class="info">equivalent</span>.</td>
<td><pre><code>&lt;&lt;if $bullets == 6&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>!=</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same value nor do they coerce into the same value." class="info">not equivalent</span>.</td>
<td><pre><code>&lt;&lt;if $pie != "cherry"&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>&gt;</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than the right side.</td>
<td><pre><code>&lt;&lt;if $cash &gt; 5&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>&gt;=</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than or equal to the right side.</td>
<td><pre><code>&lt;&lt;if $foundStars &gt;= $neededStars&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>&lt;</code></th>
<td>Evaluates to <code>true</code> if the left side is less than the right side.</td>
<td><pre><code>&lt;&lt;if $shoeCount &lt; ($peopleCount * 2)&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>&lt;=</code></th>
<td>Evaluates to <code>true</code> if the left side is less than or equal to the right side.</td>
<td><pre><code>&lt;&lt;if $level &lt;= 30&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>!</code></th>
<td>Flips a <code>true</code> evaluation to <code>false</code>, and vice versa.</td>
<td><pre><code>&lt;&lt;if !$hungry&gt;&gt;</code></pre></td>
<tr>
<th><code>&amp;&amp;</code></th>
<td>Evaluates to <code>true</code> if all subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>&lt;&lt;if $age &gt;= 20 &amp;&amp; $age &lt;= 30&gt;&gt;</code></pre></td>
</tr>
<tr>
<th><code>||</code></th>
<td>Evaluates to <code>true</code> if any subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>&lt;&lt;if $friend === "Sue" || $friend === "Dan"&gt;&gt;</code></pre></td>
</tr>
</tr>
</tbody>
</table>

#### Examples:

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

### `<<for [conditional]>> … <</for>>`<br>`<<for [init] ; [conditional] ; [post]>> … <</for>>`<br>`<<for [keyVariable ,] valueVariable range collection>> … <</for>>` {#macros-macro-for}

Repeatedly executes its contents. There are three forms: a conditional-only form, a 3-part conditional form, and a range form.

<p role="note" class="see"><b>See Also:</b>
<a href="#macros-macro-break"><code>&lt;&lt;break&gt;&gt;</code></a> and <a href="#macros-macro-continue"><code>&lt;&lt;continue&gt;&gt;</code></a>.
</p>

##### History:

* `v2.0.0`: Introduced.
* `v2.20.0`: Added range form.

#### Notes

* Loop variables are perfect candidates for the use of temporary variables—e.g., `_i`.
* To ensure that line-breaks end up where you want them, or not, extra care may be required.

#### Conditional forms *(both conditional-only and 3-part)*

Executes its contents while the given conditional expression evaluates to `true`.  If no conditional expression is given, it is equivalent to specifying `true`.

<p role="note"><b>Note:</b>
The maximum number of loop iterations in the conditional forms is not unlimited by default, however, it is configurable.  See <a href="#config-api-property-macros-maxloopiterations"><code>Config.macros.maxLoopIterations</code></a> for more information.
</p>

##### Arguments:

* **`init`:** (optional) A valid expression, evaluated once at loop initialization.  Typically used to initialize counter variable(s).  See [`<<set>>`](#macros-macro-set) for more information.
* **`conditional`:** (optional) A valid conditional expression, evaluated prior to each loop iteration.  As long as the expression evaluates to `true`, the loop is executed.  See [`<<if>>`](#macros-macro-if) for more information.
* **`post`:** (optional) A valid expression, evaluated after each loop iteration.  Typically used to update counter variable(s).  See [`<<set>>`](#macros-macro-set) for more information.

##### Examples: *(only 3-part conditional form shown)*

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

<p role="note"><b>Note:</b>
Strings are iterated by Unicode code point, however, due to historic reasons they are comprised of, and indexed by, individual UTF-16 code units.  This means that some code points may span multiple code units—e.g., the character 💩 is one code point, but two code units.
</p>

##### Examples:

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

### `<<break>>` {#macros-macro-break}

Used within [`<<for>>`](#macros-macro-for) macros.  Terminates the execution of the current `<<for>>`.

#### History:

* `v2.0.0`: Introduced.

#### Arguments: *none*

<!-- *********************************************************************** -->

### `<<continue>>` {#macros-macro-continue}

Used within [`<<for>>`](#macros-macro-for) macros.  Terminates the execution of the current iteration of the current `<<for>>` and begins execution of the next iteration.

<p role="note"><b>Note:</b>
May eat line-breaks in certain situations.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments: *none*

<!-- *********************************************************************** -->

### `<<switch expression>>`<br><span class="child">`[<<case valueList>> …]`<br>`[<<default>> …]`</span><br>`<</switch>>` {#macros-macro-switch}

Evaluates the given expression and compares it to the value(s) within its `<<case>>` children.  The value(s) within each case are compared to the result of the expression given to the parent `<<switch>>`.  Upon a successful match, the matching case will have its contents executed.  If no cases match and an optional `<<default>>` case exists, which must be the final case, then its contents will be executed.  At most one case will execute.

<p role="note"><b>Note:</b>
SugarCube does not trim whitespace from the contents of <code>&lt;&lt;case&gt;&gt;</code>/<code>&lt;&lt;default&gt;&gt;</code> macros, so that authors don't have to resort to various kludges to get whitespace where they want it.  However, this means that extra care must be taken when writing them to ensure that unwanted whitespace is not created within the final output.
</p>

#### History:

* `v2.7.2`: Introduced.

#### Arguments:

##### `<<switch>>`

* **`expression`:** A valid expression.  See [Expressions](#twinescript-expressions) for more information.

##### `<<case>>`

* **`valueList`:** A space separated list of values to compare against the result of the switch expression.

#### Examples:

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
## Interactive Macros {#macros-interactive}

#### Warning {#macros-interactive-warning}

Interactive macros are both asynchronous and require interaction from the player.  Thus, there are some potential pitfalls to consider:

1. If you plan on using interactive macros within a loop you will likely need to use the [`<<capture>>` macro](#macros-macro-capture) due to their asynchronous nature.
2. Reloading the page or revisiting a passage may not restore the state of some interactive macros, so it is recommended that you only use them in instances where this will not be an issue or where you can work around it.

<!-- *********************************************************************** -->

### `<<button linkText [passageName]>> … <</button>>`<br>`<<button linkMarkup>> … <</button>>`<br>`<<button imageMarkup>> … <</button>>` {#macros-macro-button}

Creates a button that silently executes its contents when clicked, optionally forwarding the player to another passage.  May be called either with the link text and passage name as separate arguments, with a link markup, or with an image markup.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

<p role="note"><b>Note:</b>
This macro is functionally identical to <a href="#macros-macro-link">&lt;&lt;link&gt;&gt;</a>, save that it uses a button element (<code>&lt;button&gt;</code>) rather than an anchor element (<code>&lt;a&gt;</code>).
</p>

#### History:

* `v2.8.0`: Introduced.

#### Arguments:

##### Separate argument form

* **`linkText`:** The text of the link.  May contain markup.
* **`passageName`:** (optional) The name of the passage to go to.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Examples:

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

### `<<checkbox receiverName uncheckedValue checkedValue [autocheck|checked]>>` {#macros-macro-checkbox}

Creates a checkbox, used to modify the value of the variable with the given name.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.32.0`: Added `autocheck` keyword.

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`uncheckedValue`:** The value set by the checkbox when unchecked.
* **`checkedValue`:** The value set by the checkbox when checked.
* **`autocheck`:** (optional) Keyword, used to signify that the checkbox should be automatically set to the checked state based on the current value of the receiver variable.  **NOTE:** Automatic checking may fail on non-primitive values—i.e., on arrays and objects.
* **`checked`:** (optional) Keyword, used to signify that the checkbox should be in the checked state.

#### Examples:

##### Basic usage

```
What pies do you enjoy?
* <<checkbox "$pieBlueberry" false true autocheck>> Blueberry?
* <<checkbox "$pieCherry" false true autocheck>> Cherry?
* <<checkbox "$pieCoconutCream" false true autocheck>> Coconut cream?
```

```
What pies do you enjoy?
* <<checkbox "$pieBlueberry" false true checked>> Blueberry?
* <<checkbox "$pieCherry" false true>> Cherry?
* <<checkbox "$pieCoconutCream" false true checked>> Coconut cream?
```

##### With a `<label>` element

<p role="note" class="tip"><b>Tip:</b>
For accessibility reasons, it's recommended that you wrap each <code>&lt;&lt;checkbox&gt;&gt;</code> and its accompanying text within a <code>&lt;label&gt;</code> element.  Doing so allows interactions with the text to also trigger its <code>&lt;&lt;checkbox&gt;&gt;</code>.
</p>

```
What pies do you enjoy?
* <label><<checkbox "$pieBlueberry" false true autocheck>> Blueberry?</label>
* <label><<checkbox "$pieCherry" false true autocheck>> Cherry?</label>
* <label><<checkbox "$pieCoconutCream" false true autocheck>> Coconut cream?</label>
```

```
What pies do you enjoy?
* <label><<checkbox "$pieBlueberry" false true checked>> Blueberry?</label>
* <label><<checkbox "$pieCherry" false true>> Cherry?</label>
* <label><<checkbox "$pieCoconutCream" false true checked>> Coconut cream?</label>
```

<!-- *********************************************************************** -->

### `<<cycle receiverName [autoselect]>>`<br><span class="child">`[<<option label [value [selected]]>> …]`<br>`[<<optionsfrom collection>> …]`</span><br>`<</cycle>>` {#macros-macro-cycle}

Creates a cycling link, used to modify the value of the variable with the given name.  The cycling options are populated via `<<option>>` and/or `<<optionsfrom>>`.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Arguments:

##### `<<cycle>>`

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, & `"$foo[0]"`.
* **`autoselect`:** (optional) Keyword, used to signify that an option should be automatically selected as the cycle default based on the current value of the receiver variable.  **NOTE:** Automatic option selection will fail on non-primitive values—i.e., on arrays and objects.

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

#### Examples:

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

### `<<link linkText [passageName]>> … <</link>>`<br>`<<link linkMarkup>> … <</link>>`<br>`<<link imageMarkup>> … <</link>>` {#macros-macro-link}

Creates a link that silently executes its contents when clicked, optionally forwarding the player to another passage.  May be called either with the link text and passage name as separate arguments, with a link markup, or with an image markup.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

<p role="note"><b>Note:</b>
If you simply need a passage link that modifies variables, both the <a href="#markup-link">link markup</a> and <a href="#markup-image">image markup</a> offer setter variants.
</p>

#### History:

* `v2.8.0`: Introduced.

#### Arguments:

##### Separate argument form

* **`linkText`:** The text of the link.  May contain markup.
* **`passageName`:** (optional) The name of the passage to go to.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Examples:

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

### `<<linkappend linkText [transition|t8n]>> … <</linkappend>>` {#macros-macro-linkappend}

Creates a single-use link that deactivates itself and appends its contents to its link text when clicked.  Essentially, a combination of [`<<link>>`](#macros-macro-link) and [`<<append>>`](#macros-macro-append).

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`linkText`:** The text of the link.  May contain markup.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Examples:

```
→ Without a transition
We—We should <<linkappend "take">> away their METAL BAWKSES<</linkappend>>!

→ With a transition
I spy with my little <<linkappend "eye" t8n>>, a crab rangoon<</linkappend>>.
```

<!-- *********************************************************************** -->

### `<<linkprepend linkText [transition|t8n]>> … <</linkprepend>>` {#macros-macro-linkprepend}

Creates a single-use link that deactivates itself and prepends its contents to its link text when clicked.  Essentially, a combination of [`<<link>>`](#macros-macro-link) and [`<<prepend>>`](#macros-macro-prepend).

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`linkText`:** The text of the link.  May contain markup.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Examples:

```
→ Without a transition
You see a <<linkprepend "robot">>GIANT <</linkprepend>>.

→ With a transition
I <<linkprepend "like" t8n>>do not <</linkprepend>> lemons.
```

<!-- *********************************************************************** -->

### `<<linkreplace linkText [transition|t8n]>> … <</linkreplace>>` {#macros-macro-linkreplace}

Creates a single-use link that deactivates itself and replaces its link text with its contents when clicked.  Essentially, a combination of [`<<link>>`](#macros-macro-link) and [`<<replace>>`](#macros-macro-replace).

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`linkText`:** The text of the link.  May contain markup.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Examples:

```
→ Without a transition
I'll have a <<linkreplace "cupcake">>slice of key lime pie<</linkreplace>>, please.

→ With a transition
<<linkreplace "You'll //never// take me alive!" t8n>>On second thought, don't hurt me.<</linkreplace>>
```

<!-- *********************************************************************** -->

### `<<listbox receiverName [autoselect]>>`<br><span class="child">`[<<option label [value [selected]]>> …]`<br>`[<<optionsfrom collection>> …]`</span><br>`<</listbox>>` {#macros-macro-listbox}

Creates a listbox, used to modify the value of the variable with the given name.  The list options are populated via `<<option>>` and/or `<<optionsfrom>>`.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.26.0`: Introduced.
* `v2.27.0`: Added `autoselect` keyword.
* `v2.28.0`: <s>Added `<<optionsFrom>>` child tag.</s>
* `v2.28.1`: Fixed name of `<<optionsfrom>>` child tag, which was erroneously added as `<<optionsFrom>>` in `v2.28.0`.
* `v2.29.0`: Made the `<<option>>` child tag's `value` argument optional.

#### Arguments:

##### `<<listbox>>`

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, & `"$foo[0]"`.
* **`autoselect`:** (optional) Keyword, used to signify that an option should be automatically selected as the listbox default based on the current value of the receiver variable.  **NOTE:** Automatic option selection will fail on non-primitive values—i.e., on arrays and objects.

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

#### Examples:

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

### `<<numberbox receiverName defaultValue [passage] [autofocus]>>` {#macros-macro-numberbox}

Creates a number input box, used to modify the value of the variable with the given name, optionally forwarding the player to another passage.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.32.0`: Introduced.

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`defaultValue`:** The default value of the number box.
* **`passage`:** (optional) The name of the passage to go to if the return/enter key is pressed.  May be called either with the passage name or with a link markup.
* **`autofocus`:** (optional) Keyword, used to signify that the number box should automatically receive focus.  Only use the keyword *once* per page; attempting to focus more than one element is undefined behavior.

#### Examples:

```
→ Creates a number box that modifies $wager
Wager how much on Buttstallion in the race? <<numberbox "$wager" 100>>

→ Creates an automatically focused number box that modifies $wager
Wager how much on Buttstallion in the race? <<numberbox "$wager" 100 autofocus>>

→ Creates a number box that modifies $wager and forwards to the "Result" passage
Wager how much on Buttstallion in the race? <<numberbox "$wager" 100 "Result">>

→ Creates an automatically focused number box that modifies $wager and forwards to the "Result" passage
Wager how much on Buttstallion in the race? <<numberbox "$wager" 100 "Result" autofocus>>
```

<!-- *********************************************************************** -->

### `<<radiobutton receiverName checkedValue [autocheck|checked]>>` {#macros-macro-radiobutton}

Creates a radio button, used to modify the value of the variable with the given name.  Multiple `<<radiobutton>>` macros may be set up to modify the same variable, which makes them part of a radio button group.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.32.0`: Added `autocheck` keyword.

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`checkedValue`:** The value set by the radio button when checked.
* **`autocheck`:** (optional) Keyword, used to signify that the radio button should be automatically set to the checked state based on the current value of the receiver variable.  **NOTE:** Automatic checking may fail on non-primitive values—i.e., on arrays and objects.
* **`checked`:** (optional) Keyword, used to signify that the radio button should be in the checked state.  **NOTE:** Only one radio button in a group—i.e., those using the same receiver variable—should be so checked.

#### Examples:

##### Basic usage

```
What's your favorite pie?
* <<radiobutton "$pie" "blueberry" autocheck>> Blueberry?
* <<radiobutton "$pie" "cherry" autocheck>> Cherry?
* <<radiobutton "$pie" "coconut cream" autocheck>> Coconut cream?
```

```
What's your favorite pie?
* <<radiobutton "$pie" "blueberry" checked>> Blueberry?
* <<radiobutton "$pie" "cherry">> Cherry?
* <<radiobutton "$pie" "coconut cream">> Coconut cream?
```

##### With a `<label>` element

<p role="note" class="tip"><b>Tip:</b>
For accessibility reasons, it's recommended that you wrap each <code>&lt;&lt;radiobutton&gt;&gt;</code> and its accompanying text within a <code>&lt;label&gt;</code> element.  Doing so allows interactions with the text to also trigger its <code>&lt;&lt;radiobutton&gt;&gt;</code>.
</p>

```
What's your favorite pie?
* <label><<radiobutton "$pie" "blueberry" autocheck>> Blueberry?</label>
* <label><<radiobutton "$pie" "cherry" autocheck>> Cherry?</label>
* <label><<radiobutton "$pie" "coconut cream" autocheck>> Coconut cream?</label>
```

```
What's your favorite pie?
* <label><<radiobutton "$pie" "blueberry" checked>> Blueberry?</label>
* <label><<radiobutton "$pie" "cherry">> Cherry?</label>
* <label><<radiobutton "$pie" "coconut cream">> Coconut cream?</label>
```

<!-- *********************************************************************** -->

### `<<textarea receiverName defaultValue [autofocus]>>` {#macros-macro-textarea}

Creates a multiline text input block, used to modify the value of the variable with the given name.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`defaultValue`:** The default value of the text block.
* **`autofocus`:** (optional) Keyword, used to signify that the text block should automatically receive focus.  Only use the keyword *once* per page; attempting to focus more than one element is undefined behavior.

#### Examples:

```
→ Creates a text block that modifies $pieEssay
Write a short essay about pies:
<<textarea "$pieEssay" "">>

→ Creates an automatically focused text block that modifies $pieEssay
Write a short essay about pies:
<<textarea "$pieEssay" "" autofocus>>
```

<!-- *********************************************************************** -->

### `<<textbox receiverName defaultValue [passage] [autofocus]>>` {#macros-macro-textbox}

Creates a text input box, used to modify the value of the variable with the given name, optionally forwarding the player to another passage.

<p role="note" class="see"><b>See:</b>
<a href="#macros-interactive-warning">Interactive macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`receiverName`:** The name of the variable to modify, which *must* be quoted—e.g., `"$foo"`.  Object and array property references are also supported—e.g., `"$foo.bar"`, `"$foo['bar']"`, &amp; `"$foo[0]"`.
* **`defaultValue`:** The default value of the text box.
* **`passage`:** (optional) The name of the passage to go to if the return/enter key is pressed.  May be called either with the passage name or with a link markup.
* **`autofocus`:** (optional) Keyword, used to signify that the text box should automatically receive focus.  Only use the keyword *once* per page; attempting to focus more than one element is undefined behavior.

#### Examples:

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

### <span class="deprecated">`<<click linkText [passageName]>> … <</click>>`<br>`<<click linkMarkup>>`<br>`<<click imageMarkup>>`</span> {#macros-macro-click}

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code></a> macro for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.8.0`: Deprecated in favor of `<<link>>`.


<!-- ***************************************************************************
	Links Macros
**************************************************************************** -->
## Links Macros {#macros-links}

<!-- *********************************************************************** -->

### `<<actions passageList>>`<br>`<<actions linkMarkupList>>`<br>`<<actions imageMarkupList>>` {#macros-macro-actions}

Creates a list of single-use passage links.  Each link removes itself and all other `<<actions>>` links to the same passage after being activated.  May be called either with a list of passages, with a list of link markup, or with a list of image markup.  Probably most useful when paired with [`<<include>>`](#macros-macro-include).  See the [`<<actions>>`](https://twinery.org/wiki/actions) section of the [Twine&nbsp;1 reference documentation](https://twinery.org/wiki/twine1:reference) for more information.

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

##### Passage list form

* **`passageList`:** A space separated list of passage names.

##### Link markup list form

* **`linkMarkupList`:** A space separated list of link markup to use (full syntax supported, including setters).

##### Image markup list form

* **`imageMarkupList`:** A space separated list of image markup to use (full syntax supported, including setters).

#### Examples:

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

### `<<back [linkText]>>`<br>`<<back linkMarkup>>`<br>`<<back imageMarkup>>` {#macros-macro-back}

Creates a link that undoes past moments within the story history.  May be called with, optional, link text or with a link or image markup.

<p role="note"><b>Note:</b>
If you want to return to a previously visited passage, rather than undo a moment within the history, see the <a href="#macros-macro-return"><code>&lt;&lt;return&gt;&gt;</code> macro</a> or the <a href="#functions-function-previous"><code>previous()</code> function</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

##### Link text form

* **`linkText`:** (optional) The text of the link.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Examples:

##### Basic usage

```
→ Creates a link that undoes the most recent moment, with default text
<<back>>
```

##### Link text form

```
→ Creates a link that undoes the most recent moment, with text "Home."
<<back "Home.">>
```

##### Link markup form

```
→ Creates a link that undoes past moments until the most recent "HQ" moment is reached, with default text
<<back [[HQ]]>>

→ Creates a link that undoes past moments until the most recent "HQ" moment is reached, with text "Home."
<<back [[Home.|HQ]]>>
```

##### Image markup form

```
→ Creates a link that undoes the most recent moment, with image "home.png"
<<back [img[home.png]]>>

→ Creates a link that undoes past moments until the most recent "HQ" moment is reached, with image "home.png"
<<back [img[home.png][HQ]]>>
```

<!-- *********************************************************************** -->

### `<<choice passageName [linkText]>>`<br>`<<choice linkMarkup>>`<br>`<<choice imageMarkup>>` {#macros-macro-choice}

Creates a single-use passage link that deactivates itself and all other `<<choice>>` links within the originating passage when activated.  May be called either with the passage name and link text as separate arguments, with a link markup, or with a image markup.

<p role="note" class="warning"><b>Warning:</b>
Normally, when both link and text arguments are accepted, the order is text then link.  However, due to a historical artifact, the arguments for the separate argument form of <code>&lt;&lt;choice&gt;&gt;</code> are in the reverse order (link then text).
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

##### Separate argument form

* **`passageName`:** The name of the passage to go to.
* **`linkText`:** (optional) The text of the link.  If omitted, the `passageName` will be used instead.

##### Link markup form

* **`linkMarkup`:** The link markup to use (full syntax supported, including setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (full syntax supported, including setters).

#### Examples:

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

### `<<return [linkText]>>`<br>`<<return linkMarkup>>`<br>`<<return imageMarkup>>` {#macros-macro-return}

Creates a link that navigates forward to a previously visited passage.  May be called with, optional, link text or with a link or image markup.

<p role="note"><b>Note:</b>
If you want to undo previous moments within the history, rather than return to a passage, see the <a href="#macros-macro-back"><code>&lt;&lt;back&gt;&gt;</code> macro</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

##### Link text form

* **`linkText`:** (optional) The text of the link.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

##### Image markup form

* **`imageMarkup`:** The image markup to use (regular syntax only, no setters).

#### Examples:

<p role="note"><b>Note:</b>
The versions that forward to a specific passage are largely unnecessary, as you could simply use a normal link, and exist solely for compatibility with the <a href="#macros-macro-back"><code>&lt;&lt;back&gt;&gt;</code> macro</a>.
</p>

##### Basic usage

```
→ Creates a link that forwards to the previous passage, with default text
<<return>>
```

##### Link text form

```
→ Creates a link that forwards to the previous passage, with text "Home."
<<return "Home.">>
```

##### Link markup form

```
→ Creates a link that forwards to the "HQ" passage, with default text
<<return [[HQ]]>>

→ Creates a link that forwards to the "HQ" passage, with text "Home."
<<return [[Home.|HQ]]>>
```

##### Image markup form

```
→ Creates a link that forwards to the previous passage, with image "home.png"
<<return [img[home.png]]>>

→ Creates a link that forwards to the "HQ" passage, with image "home.png"
<<return [img[home.png][HQ]]>>
```


<!-- ***************************************************************************
	DOM Macros
**************************************************************************** -->
## DOM Macros {#macros-dom}

<span id="macros-dom-warning"></span>
<p role="note" class="warning"><b>Warning:</b>
All DOM macros require the elements to be manipulated to be on the page.  As a consequence, you cannot use them directly within a passage to modify elements within said passage, since the elements they are targeting are still rendering, thus not yet on the page.  You must, generally, use them with an interactive macro—e.g., <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code> macro</a>—the <a href="#macros-macro-done"><code>&lt;&lt;done&gt;&gt;</code> macro</a>, or within the <a href="#special-passage-passagedone"><code>PassageDone</code> special passage</a>.  Elements that are already part of the page, on the other hand, present no issues.
</p>

<!-- *********************************************************************** -->

### `<<addclass selector classNames>>` {#macros-macro-addclass}

Adds classes to the selected element(s).

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`classNames`:** The names of the classes, separated by spaces.

#### Examples:

```
<<addclass "body" "day rain">>  → Add the classes "day" and "rain" to the <body> element
<<addclass "#pie" "cherry">>    → Add the class "cherry" to the element with the ID "pie"
<<addclass ".joe" "angry">>     → Add the class "angry" to all elements containing the class "joe"
```

<!-- *********************************************************************** -->

### `<<append selector [transition|t8n]>> … <</append>>` {#macros-macro-append}

Executes its contents and appends the output to the contents of the selected element(s).

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.25.0`: Added `transition` and `t8n` keywords.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Examples:

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

### `<<copy selector>>` {#macros-macro-copy}

Outputs a copy of the contents of the selected element(s).

<p role="note" class="warning"><b>Warning:</b>
Most interactive elements—e.g., passage links, <a href="#macros-interactive">interactive macros</a>, etc.—cannot be properly copied via <code>&lt;&lt;copy&gt;&gt;</code>.  Attempting to do so will, usually, result in something that's non-functional.
</p>

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).

#### Examples:

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

### `<<prepend selector [transition|t8n]>> … <</prepend>>` {#macros-macro-prepend}

Executes its contents and prepends the output to the contents of the selected element(s).

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.25.0`: Added `transition` and `t8n` keywords.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Examples:

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

### `<<remove selector>>` {#macros-macro-remove}

Removes the selected element(s).

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

<p role="note"><b>Note:</b>
If you simply want to empty the selected element(s), not remove them outright, you should use an empty <a href="#macros-macro-replace"><code>&lt;&lt;replace&gt;&gt;</code> macro</a> instead.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).

#### Examples:

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

### `<<removeclass selector [classNames]>>` {#macros-macro-removeclass}

Removes classes from the selected element(s).

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`classNames`:** (optional) The names of the classes, separated by spaces.  If no class names are given, removes all classes.

#### Examples:

```
<<removeclass "body" "day rain">>  → Remove the classes "day" and "rain" from the <body> element
<<removeclass "#pie" "cherry">>    → Remove the class "cherry" from the element with the ID "pie"
<<removeclass ".joe" "angry">>     → Remove the class "angry" from all elements containing the class "joe"
<<removeclass "#begone">>          → Remove all classes from the element with the ID "begone"
```

<!-- *********************************************************************** -->

### `<<replace selector [transition|t8n]>> … <</replace>>` {#macros-macro-replace}

Executes its contents and replaces the contents of the selected element(s) with the output.

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.
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

### `<<toggleclass selector classNames>>` {#macros-macro-toggleclass}

Toggles classes on the selected element(s)—i.e., adding them if they don't exist, removing them if they do.

<p role="note" class="see"><b>See:</b>
<a href="#macros-dom-warning">DOM macro warning</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`selector`:** The CSS/jQuery-style selector used to target element(s).
* **`classNames`:** The names of the classes, separated by spaces.

#### Examples:

```
<<toggleclass "body" "day rain">>  → Toggle the classes "day" and "rain" on the <body> element
<<toggleclass "#pie" "cherry">>    → Toggle the class "cherry" on the element with the ID "pie"
<<toggleclass ".joe" "angry">>     → Toggle the class "angry" on all elements containing the class "joe"
```


<!-- ***************************************************************************
	Audio Macros
**************************************************************************** -->
## Audio Macros {#macros-audio}

<span id="macros-audio-limitations"></span>
<p role="note" class="warning"><b>Warning:</b>
The audio subsystem that supports the audio macros comes with some built-in <a href="#simpleaudio-api-limitations">limitations</a> and it is <strong><em>strongly</em></strong> recommended that you familiarize yourself with them.
</p>

<!-- *********************************************************************** -->

### `<<audio trackIdList actionList>>` {#macros-macro-audio}

Controls the playback of audio tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio).

<p role="note" class="see"><b>See:</b>
<a href="#macros-audio-limitations">Audio macro limitations</a>.
</p>

<p role="note"><b>Note:</b>
The <code>&lt;&lt;audio&gt;&gt;</code> macro cannot affect playlist tracks that have been copied into their respective playlist—meaning those set up via <a href="#macros-macro-createplaylist"><code>&lt;&lt;createplaylist&gt;&gt;</code></a> with its <code>copy</code> action or all tracks set up via, the deprecated, <a href="#macros-macro-setplaylist"><code>&lt;&lt;setplaylist&gt;&gt;</code></a>—as playlist copies are solely under the control of their playlist.
</p>

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) controls whether tracks that have been faded to <code>0</code> volume (silent) are automatically paused.
</p>

#### History:

* `v2.0.0`: Introduced.
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

#### Examples:

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

<p role="note" class="warning"><b>Warning:</b>
Be <em>very careful</em> with these if your audio sources are on the network, as you are forcing players to begin downloading them.  Not everyone has
blazing fast internet with unlimited data—especially true for mobile users.  Pease, <strong><em>do not</em></strong> take your players' bandwidth and data usage lightly.
</p>

```
→ If it's not currently loading, drop existing data buffers and load the track
<<audio "bgm_space" load>>

→ Unload the track, dropping existing data buffers
<<audio "bgm_space" unload>>
```

<!-- *********************************************************************** -->

### `<<cacheaudio trackId sourceList>>` {#macros-macro-cacheaudio}

Caches an audio track for use by the other audio macros.

<p role="note"><b>Note:</b>
The <a href="#special-passage-storyinit"><code>StoryInit</code> special passage</a> is normally the best place to set up tracks.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.28.0`: Deprecated the old optional format specifier syntax in favor of a new syntax (`formatId|`).

#### Arguments:

* **`trackId`:** The ID of the track, which will be used to reference it.
* **`sourceList`:** A space separated list of sources for the track.  Only one is required, though supplying additional sources in differing formats is recommended, as no single format is supported by all browsers.  A source must be either a URL (absolute or relative) to an audio resource, the name of an audio passage, or a data URI.  In rare cases where the audio format cannot be automatically detected from the source (URLs are parsed for a file extension, data URIs are parsed for the media type), a format specifier may be prepended to the front of each source to manually specify the format (syntax: `formatId|`, where `formatId` is the audio format—generally, whatever the file extension would normally be; e.g., `mp3`, `mp4`, `ogg`, `weba`, `wav`).

#### Examples:

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

### `<<createaudiogroup groupId>>`<br><span class="child">`[<<track trackId>> …]`</span><br>`<</createaudiogroup>>` {#macros-macro-createaudiogroup}

Collects tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio), into a group via its `<<track>>` children.  Groups are useful for applying actions to multiple tracks simultaneously and/or excluding the included tracks from a larger set when applying actions.

<p role="note"><b>Note:</b>
The <a href="#special-passage-storyinit"><code>StoryInit</code> special passage</a> is normally the best place to set up groups.
</p>

#### History:

* `v2.19.0`: Introduced.

#### Arguments:

##### `<<createaudiogroup>>`

* **`groupId`:** The ID of the group that will be used to reference it and *must* begin with a colon.  **NOTE:** There are several predefined group IDs (`:all`, `:looped`, `:muted`, `:paused`, `:playing`) and the `:not` group modifier that cannot be reused/overwritten.

##### `<<track>>`

* **`trackId`:** The ID of the track.

#### Examples:

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

### `<<createplaylist listId>>`<br><span class="child">`[<<track trackId actionList>> …]`</span><br>`<</createplaylist>>` {#macros-macro-createplaylist}

Collects tracks, which must be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio), into a playlist via its `<<track>>` children.

<p role="note"><b>Note:</b>
The <a href="#special-passage-storyinit"><code>StoryInit</code> special passage</a> is normally the best place to set up playlists.
</p>

#### History:

* `v2.8.0`: Introduced.
* `v2.29.0`: Deprecated `<<track>>` `copy` keyword in favor of `own`.

#### Arguments:

##### `<<createplaylist>>`

* **`listId`:** The ID of the playlist, which will be used to reference it.

##### `<<track>>`

* **`trackId`:** The ID of the track.
* **`actionList`:** The list of actions to perform.  Available actions are:
	* **`volume` *`level`*:** (optional) Set the base volume of the track within the playlist to the specified level.  If omitted, defaults to the track's current volume.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.
	* **`own`:** (optional) Keyword, used to signify that the playlist should create its own independent copy of the track, rather than simply referencing the existing version.  Owned copies are solely under the control of their playlist—meaning [`<<audio>>`](#macros-macro-audio) actions cannot affect them, even when using group IDs.

#### Examples:

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

### `<<masteraudio actionList>>` {#macros-macro-masteraudio}

Controls the master audio settings.

<p role="note" class="see"><b>See:</b>
<a href="#macros-audio-limitations">Audio macro limitations</a>.
</p>

#### History:

* `v2.8.0`: Introduced.
* `v2.28.0`: Added `load`, `muteonhide`, `nomuteonhide`, and `unload` actions.

#### Arguments:

* **`actionList`:** The list of actions to perform.  Available actions are:
	* **`load`:** Pause playback of *all* tracks and, if they're not already in the process of loading, force them to drop any existing data and begin loading.  **NOTE:** This *should not* be done lightly if your audio sources are on the network, as it forces the player to begin downloading them.
	* **`mute`:** Mute the master volume (effectively volume `0`, except without changing the volume level).
	* **`muteonhide`:** Enable automatic muting of the master volume when losing visibility—i.e., when switched to another tab or the browser window is minimized.
	* **`nomuteonhide`:** Disable automatic muting of the master volume when losing visibility (this is the default).
	* **`stop`:** Stop playback of *all* tracks.
	* **`unload`:** Stop playback of *all* tracks and force them to drop any existing data.  **NOTE:** Once unloaded, playback cannot occur until a `load` action is issued for each track—either a master `load` action, to affect all tracks, or an `<<audio>>`/`<<playlist>>` `load` action, to affect only certain tracks.
	* **`unmute`:** Unmute the master volume (this is the default).
	* **`volume` *`level`*:** Set the master volume to the specified level.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Examples:

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

<p role="note" class="warning"><b>Warning:</b>
Be <em>very careful</em> with these if your audio sources are on the network, as you are forcing players to begin downloading them.  Not everyone has
blazing fast internet with unlimited data—especially true for mobile users.  Pease, <strong><em>do not</em></strong> take your players' bandwidth and data usage lightly.
</p>

```
→ If they're not currently loading, drop existing data buffers and load all tracks
<<masteraudio load>>

→ Unload all tracks, dropping existing data buffers
<<masteraudio unload>>
```

<!-- *********************************************************************** -->

### `<<playlist listId actionList>>`<br><span class="deprecated">`<<playlist actionList>>`</span> {#macros-macro-playlist}

Controls the playback of the playlist, which must be set up via [`<<createplaylist>>`](#macros-macro-createplaylist)—the deprecated [`<<setplaylist>>`](#macros-macro-setplaylist) may be used instead, though it is not recommended.

<p role="note" class="see"><b>See:</b>
<a href="#macros-audio-limitations">Audio macro limitations</a>.
</p>

<p role="note"><b>Note:</b>
The <a href="#config-api-property-audio-pauseonfadetozero"><code>Config.audio.pauseOnFadeToZero</code> setting</a> (default: <code>true</code>) controls whether tracks that have been faded to <code>0</code> volume (silent) are automatically paused.
</p>

#### History:

* `v2.0.0`: Introduced, compatible with `<<setplaylist>>`.
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

#### Examples: *(only `<<createplaylist>>`-compatible form shown)*

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

<p role="note" class="warning"><b>Warning:</b>
Be <em>very careful</em> with these if your audio sources are on the network, as you are forcing players to begin downloading them.  Not everyone has
blazing fast internet with unlimited data—especially true for mobile users.  Pease, <strong><em>do not</em></strong> take your players' bandwidth and data usage lightly.
</p>

```
→ If they're not currently loading, drop existing data buffers and load all of the playlist's tracks
<<playlist "bgm_lacuna" load>>

→ Unload all of the playlist's tracks, dropping existing data buffers
<<playlist "bgm_lacuna" unload>>
```

<!-- *********************************************************************** -->

### `<<removeaudiogroup groupId>>` {#macros-macro-removeaudiogroup}

Removes the audio group with the given ID.

<p role="note"><b>Note:</b>
You may not remove the predefined group IDs (<code>:all</code>, <code>:looped</code>, <code>:muted</code>, <code>:paused</code>, <code>:playing</code>) or the <code>:not</code> group modifier.
</p>

#### History:

* `v2.28.0`: Introduced.

#### Arguments:

* **`groupId`:** The ID of the group.

#### Examples:

```
→ Given a group set up via <<createaudiogroup ":ui">>…<</createplaylist>>
<<removeaudiogroup ":ui">>
```

<!-- *********************************************************************** -->

### `<<removeplaylist listId>>` {#macros-macro-removeplaylist}

Removes the playlist with the given ID.

#### History:

* `v2.8.0`: Introduced.

#### Arguments:

* **`listId`:** The ID of the playlist.

#### Examples:

```
→ Given a playlist set up via <<createplaylist "bgm_lacuna">>…<</createplaylist>>
<<removeplaylist "bgm_lacuna">>
```

<!-- *********************************************************************** -->

### `<<waitforaudio>>` {#macros-macro-waitforaudio}

Displays the loading screen until *all* currently registered audio has either loaded to a playable state or aborted loading due to errors.  Requires tracks to be set up via [`<<cacheaudio>>`](#macros-macro-cacheaudio).

<p role="note"><b>Note:</b>
This macro should be invoked <strong><em>once</em></strong> following any invocations of <code>&lt;&lt;cacheaudio&gt;&gt;</code> and <code>&lt;&lt;createplaylist&gt;&gt;</code>, if any <code>&lt;&lt;track&gt;&gt;</code> definitions used the <code>copy</code> keyword, for which you want the loading screen displayed.
</p>

#### History:

* `v2.8.0`: Introduced.

#### Arguments: *none*

#### Examples:

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

### <span class="deprecated">`<<setplaylist trackIdList>>`</span> {#macros-macro-setplaylist}

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-createplaylist"><code>&lt;&lt;createplaylist&gt;&gt;</code></a> macro for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.8.0`: Deprecated in favor of `<<createplaylist>>`.

<!-- *********************************************************************** -->

### <span class="deprecated">`<<stopallaudio>>`</span> {#macros-macro-stopallaudio}

<p role="note" class="warning"><b>Deprecated:</b>
This macro has been deprecated and should no longer be used.  See the <a href="#macros-macro-audio"><code>&lt;&lt;audio&gt;&gt;</code></a> macro for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.8.0`: Deprecated in favor of `<<audio ":all" stop>>`.


<!-- ***************************************************************************
	Miscellaneous Macros
**************************************************************************** -->
## Miscellaneous Macros {#macros-miscellaneous}

<!-- *********************************************************************** -->

### `<<done>> … <</done>>` {#macros-macro-done}

Silently executes its contents when the incoming passage is done rendering and has been added to the page.  Generally, only really useful for running code that needs to manipulate elements from the incoming passage, since you must wait until they've been added to the page.

<p role="note" class="tip"><b>Tip:</b>
If you need to run the same code on multiple passages, consider using the <a href="#special-passage-passagedone"><code>PassageDone</code> special passage</a> or, for a JavaScript/TwineScript solution, a <a href="#events-navigation-event-passagedisplay"><code>:passagedisplay</code> event</a> instead.  They serve the same basic purpose as the <code>&lt;&lt;done&gt;&gt;</code> macro, but are run each time passage navigation occurs.
</p>

#### History:

* `v2.35.0`: Introduced.

#### Arguments: *none*

#### Examples:

```
@@#spy;@@

<<done>>
	<<replace "#spy">>I spy with my little eye, a crab rangoon.<</replace>>
<</done>>
```

<!-- *********************************************************************** -->

### `<<goto passageName>>`<br>`<<goto linkMarkup>>` {#macros-macro-goto}

Immediately forwards the player to the passage with the given name.  May be called either with the passage name or with a link markup.

<p role="note"><b>Note:</b>
In most cases, you will not need to use <code>&lt;&lt;goto&gt;&gt;</code> as there are often better and easier ways to forward the player.  For example, a common use of <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code></a> is to perform various actions before forwarding the player to another passage.  In that case, unless you need to dynamically determine the destination passage within the <code>&lt;&lt;link&gt;&gt;</code> body, <code>&lt;&lt;goto&gt;&gt;</code> is unnecessary as <code>&lt;&lt;link&gt;&gt;</code> already includes the ability to forward the player.
</p>

<p role="note" class="warning"><b>Warning:</b>
Using <code>&lt;&lt;goto&gt;&gt;</code> to automatically forward players from one passage to another with no input from them will both create junk moments within the story history and make it extremely difficult for players to navigate the history.  It is <strong><em>strongly</em></strong> recommended that you look into other methods to achieve your goals instead—e.g., <a href="#config-api-property-navigation-override"><code>Config.navigation.override</code></a>.
</p>

<p role="note" class="warning"><b>Warning:</b>
<code>&lt;&lt;goto&gt;&gt;</code> <strong><em>does not</em></strong> terminate passage rendering in the passage where it was encountered, so care must be taken to ensure that no unwanted state modifications occur after its call.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

##### Passage name form

* **`passageName`:** The name of the passage to go to.

##### Link markup form

* **`linkMarkup`:** The link markup to use (regular syntax only, no setters).

#### Examples:

```
→ Passage name form
<<goto "Somewhere over yonder">>
<<goto $selectedPassage>>

→ Link markup form
<<goto [[Somewhere over yonder]]>>
<<goto [[$selectedPassage]]>>
```

<!-- *********************************************************************** -->

### `<<repeat delay [transition|t8n]>> … <</repeat>>` {#macros-macro-repeat}

Repeatedly executes its contents after the given delay, inserting any output into the passage in its place.  May be terminated by a [`<<stop>>`](#macros-macro-stop) macro.

<p role="note"><b>Note:</b>
Passage navigation terminates all pending timed executions.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`delay`:** The amount of time to delay, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  The minimum delay is `40ms`.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

#### Examples:

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

### `<<stop>>` {#macros-macro-stop}

Used within [`<<repeat>>`](#macros-macro-repeat) macros.  Terminates the execution of the current `<<repeat>>`.

#### History:

* `v2.0.0`: Introduced.

#### Arguments: *none*

<!-- *********************************************************************** -->

### `<<timed delay [transition|t8n]>> …`<br><span class="child">`[<<next [delay]>> …]`</span><br>`<</timed>>` {#macros-macro-timed}

Executes its contents after the given delay, inserting any output into the passage in its place.  Additional timed executions may be chained via `<<next>>`.

<p role="note"><b>Note:</b>
Passage navigation terminates all pending timed executions.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

##### `<<timed>>`

* **`delay`:** The amount of time to delay, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  The minimum delay is `40ms`.
* **`transition`:** (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
* **`t8n`:** (optional) Keyword, alias for **`transition`**.

##### `<<next>>`

* **`delay`:** (optional) The amount of time to delay, as a valid [CSS time value](https://developer.mozilla.org/en-US/docs/Web/CSS/time)—e.g., `5s` and `500ms`.  The minimum delay is `40ms`.  If omitted, the last delay specified, from a `<<next>>` or the parent `<<timed>>`, will be used.

#### Examples:

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

→ Replace some text with a variable interval
→ Given: _delay is "2s" the interval will be 2 seconds
I'll have <span id="drink">some water</span>, please.\
<<timed _delay>><<replace "#drink">>a glass of milk<</replace>>\
<<next>><<replace "#drink">>a can of soda<</replace>>\
<<next>><<replace "#drink">>a cup of coffee<</replace>>\
<<next>><<replace "#drink">>tea, southern style, sweet<</replace>>\
<<next>><<replace "#drink">>a scotch, neat<</replace>>\
<<next>><<replace "#drink">>a bottle of your finest absinthe<</replace>>\
<</timed>>
```

<!-- *********************************************************************** -->

### `<<widget widgetName>> … <</widget>>` {#macros-macro-widget}

Creates a new widget macro (henceforth, widget) with the given name.  Widgets allow you to create macros by using the standard macros and markup that you use normally within your story.  Widgets may access arguments passed to them via the `$args` array-like object—see below for details.

<p role="note" class="warning"><b>Warning:</b>
Widgets should <em>always</em> be defined within a <code>widget</code>-tagged passage—any widgets that are not may be lost on page reload—and you may use as few or as many such passages as you desire.  <em>Do not</em> add a <code>widget</code> tag to any of the <a href="#special-passages">specially named passages</a> and attempt to define your widgets there.
</p>

<p role="note" class="warning"><b>Warning:</b>
The <code>$args</code> array-like object should be treated as though it were immutable—i.e., unable to be modified—because in the future it will be made thus, so any attempt to modify it will cause an error.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Arguments:

* **`widgetName`:** The name of the created widget, which should not contain whitespace or angle brackets (`<`, `>`).  If the name of an existing widget is chosen, the new widget will overwrite the older version.  **NOTE:** The names of existing macros are invalid widget names and any attempts to use such a name will cause an error.

#### `$args` array-like object:

The `$args` variable is used internally to store arguments passed to the widget—as zero-based indices; i.e., `$args[0]` is the first parsed argument, `$args[1]` is the second, etc—and the full argument string in raw and parsed forms—accessed via the `$args.raw` and `$args.full` properties.

When a widget is called, any existing `$args` variable is stored for the duration of the call and restored after.  This means that non-widget use of an `$args` variable is completely safe, though this does have the effect that an `$args` variable external to a widget is inaccessible to it unless passed in as an argument.

Unless localized by use of the [`<<capture>>` macro](#macros-macro-capture), any story or temporary variables used within widgets are part of a story's normal variable store, so care *must be* taken not to accidentally either overwrite or pick up an existing value.

#### Examples:

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
