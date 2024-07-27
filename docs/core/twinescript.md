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

```js
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
* Numbers—e.g., `42`, `3.14`, `-24`, `-17.76`, &amp; `Infinity`
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

Unsupported object types, either native or custom, can be made compatible by implementing `.clone()` and `.toJSON()` methods for them—see the [*Non-generic object types (classes)* guide](#guide-non-generic-object-types) for more information.

<div role="note" class="warning"><b>Warning:</b>
<p>Due to how SugarCube stores the state history a few constructs are <strong><em>not supported</em></strong> within story variables.</p>
<ul>
	<li>Circular references.  If you need them, then you'll need to keep them out of story variables.</li>
	<li>Property attributes, including getters/setters, and symbol properties.  If you need them, then you'll need to use a class or similar non-generic object.</li>
	<li>
		<p>Functions, including static—i.e., non-instance—methods, due to a few issues.</p>
		<ol>
			<li>A function's scope <strong><em>cannot</em></strong> be restored.  Thus, if your function depends upon its scope, then it will not work properly when revived from sessions or saves.</li>
			<li>Function behavior is immutable.  Thus, storing them within story variables is generally wasteful.</li>
		</ol>
		<p>Instance methods of classes are not affected by either issue, as they're never actually stored within story variables, being referenced from their classes' prototypes instead.</p>
	</li>
</ul>
</div>


<!-- ***************************************************************************
	Expressions
**************************************************************************** -->
## Expressions {#twinescript-expressions}

Expressions are simply units of code that yield values when evaluated.  For example:

```js
// Yields: true
true

// Yields: 1 (assuming that it is the first turn)
turns()

// Yields: 4
2 + 2

// Yields: "22"
"2" + "2"
```

Basic expressions simply consist of identifiers and literals—e.g., `$a`, `69`, and `"hello"`.  Complex expressions consist of basic expressions joined together by [operators](#twinescript-operators)—e.g., `=` and `+`.

While every valid expression—even those you might not expect—yields a value, there are essentially two types of expressions: those with side effects and those without.  A side effect simply means that the evaluation of the expression modifies some state.  For example:

```js
// Yields: 5; Side effect: assigns 5 to the story variable $a
$a = 5

// Yields: 25 (assuming $x is 15); No side effects
$x + 10
```

In general, you can group expressions into categories based on what kind of value they yield and/or what side effects they cause.  For example: *(not an exhaustive list)*

* Arithmetic: The expression yields a number value—e.g., `42` or `3.14`.
* String: The expression yields a string value—e.g., `"Lulamoon"` or `"5678"`.
* Logical: The expression yields a boolean value—e.g., `true` or `false`.
* Assignment: The expression causes an assignment to occur—e.g., `$a = 5`.

### Using Expressions

You will, in all likelihood, use expressions most often within macros—e.g., [`<<set>>`](#macros-macro-set), [`<<print>>`](#macros-macro-print), [`<<if>>`](#macros-macro-if), [`<<for>>`](#macros-macro-for).


<!-- ***************************************************************************
	Operators
**************************************************************************** -->
## Operators {#twinescript-operators}

Operators join together operands, which are formed from either basic or complex expressions.

In both TwineScript and JavaScript there are *binary* and *unary* operators—n.b., Javascript also includes a *ternary* operator, the conditional operator.  Binary operators require two operands, one before and one after the operator, while unary operators only require one operand, either before or after the operator.

Binary operator examples:

```js
// operand1 OPERATOR operand2
2 + 2
$a = 5
```

Unary operator examples:

```js
// operand OPERATOR
$i++

// OPERATOR operand
++$x
not $hasKey
```

### Assignment operators

Assignment operators assign a value to their left-hand operand based on the value of their right-hand operand.

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
<td><pre><code>$apples to 6</code></pre></td>
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
<td><pre><code>$apples = 6</code></pre></td>
</tr>
<tr>
<th><code>+=</code></th>
<td>Adds the value on the right-hand side of the operator to the current value on the left-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>$apples += 1</code></pre></td>
</tr>
<tr>
<th><code>-=</code></th>
<td>Subtracts the value on the right-hand side of the operator from the current value on the left-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>$apples -= 1</code></pre></td>
</tr>
<tr>
<th><code>&#x2a;=</code></th>
<td>Multiplies the current value on the left-hand side of the operator by the value on the right-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>$apples &#x2a;= 2</code></pre></td>
</tr>
<tr>
<th><code>/=</code></th>
<td>Divides the current value on the left-hand side of the operator by the value on the right-hand side and assigns the result to the left-hand side.</td>
<td><pre><code>$apples /= 2</code></pre></td>
</tr>
<tr>
<th><code>%=</code></th>
<td>Divides the current value on the left-hand side of the operator by the value on the right-hand side and assigns the remainder to the left-hand side.</td>
<td><pre><code>$apples %= 10</code></pre></td>
</tr>
</tbody>
</table>

### Conditional operators

Comparison operators compare their operands and return a boolean value based on whether the comparison is true.

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
<td><pre><code>$bullets is 6</code></pre></td>
</tr>
<tr>
<th><code>isnot</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same type and/or value." class="info"><em>strictly</em> not equal</span>.</td>
<td><pre><code>$pie isnot "cherry"</code></pre></td>
</tr>
<tr>
<th><code>eq</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same value or coerce into the same value." class="info">equivalent</span>.  Not recommended, use the <code>is</code> operator.</td>
<td><pre><code>$bullets eq 6</code></pre></td>
</tr>
<tr>
<th><code>neq</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same value nor do they coerce into the same value." class="info">not equivalent</span>.  Not recommended, use the <code>isnot</code> operator.</td>
<td><pre><code>$pie neq "cherry"</code></pre></td>
</tr>
<tr>
<th><code>gt</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than the right side.</td>
<td><pre><code>$cash gt 5</code></pre></td>
</tr>
<tr>
<th><code>gte</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than or equal to the right side.</td>
<td><pre><code>$foundStars gte $neededStars</code></pre></td>
</tr>
<tr>
<th><code>lt</code></th>
<td>Evaluates to <code>true</code> if the left side is less than the right side.</td>
<td><pre><code>$shoeCount lt ($peopleCount * 2)</code></pre></td>
</tr>
<tr>
<th><code>lte</code></th>
<td>Evaluates to <code>true</code> if the left side is less than or equal to the right side.</td>
<td><pre><code>$level lte 30</code></pre></td>
</tr>
<tr>
<th><code>not</code></th>
<td>Flips a <code>true</code> evaluation to <code>false</code>, and vice versa.</td>
<td><pre><code>not $hungry</code></pre></td>
</tr>
<tr>
<th><code>and</code></th>
<td>Evaluates to <code>true</code> if all subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>$age gte 20 and $age lte 30</code></pre></td>
</tr>
<tr>
<th><code>or</code></th>
<td>Evaluates to <code>true</code> if any subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>$friend is "Sue" or $friend is "Dan"</code></pre></td>
</tr>
<tr>
<th><code>def</code></th>
<td>Evaluates to <code>true</code> if the right side is defined.  See the precedence warning below.</td>
<td><pre><code>def $mushrooms</code></pre></td>
</tr>
<tr>
<th><code>ndef</code></th>
<td>Evaluates to <code>true</code> if the right side is not defined.  See the precedence warning below.</td>
<td><pre><code>ndef $bottlecaps</code></pre></td>
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
<td><pre><code>$bullets === 6</code></pre></td>
</tr>
<tr>
<th><code>!==</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same type and/or value." class="info"><em>strictly</em> not equal</span>.</td>
<td><pre><code>$pie !== "cherry"</code></pre></td>
</tr>
<tr>
<th><code>==</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides have the same value or coerce into the same value." class="info">equivalent</span>.  Not recommended, use the <code>===</code> operator.</td>
<td><pre><code>$bullets == 6</code></pre></td>
</tr>
<tr>
<th><code>!=</code></th>
<td>Evaluates to <code>true</code> if both sides are <span title="Both sides do not have the same value nor do they coerce into the same value." class="info">not equivalent</span>.  Not recommended, use the <code>!==</code> operator.</td>
<td><pre><code>$pie != "cherry"</code></pre></td>
</tr>
<tr>
<th><code>&gt;</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than the right side.</td>
<td><pre><code>$cash &gt; 5</code></pre></td>
</tr>
<tr>
<th><code>&gt;=</code></th>
<td>Evaluates to <code>true</code> if the left side is greater than or equal to the right side.</td>
<td><pre><code>$foundStars &gt;= $neededStars</code></pre></td>
</tr>
<tr>
<th><code>&lt;</code></th>
<td>Evaluates to <code>true</code> if the left side is less than the right side.</td>
<td><pre><code>$shoeCount &lt; ($peopleCount * 2)</code></pre></td>
</tr>
<tr>
<th><code>&lt;=</code></th>
<td>Evaluates to <code>true</code> if the left side is less than or equal to the right side.</td>
<td><pre><code>$level &lt;= 30</code></pre></td>
</tr>
<tr>
<th><code>!</code></th>
<td>Flips a <code>true</code> evaluation to <code>false</code>, and vice versa.</td>
<td><pre><code>!$hungry</code></pre></td>
<tr>
<th><code>&amp;&amp;</code></th>
<td>Evaluates to <code>true</code> if all subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>$age &gt;= 20 &amp;&amp; $age &lt;= 30</code></pre></td>
</tr>
<tr>
<th><code>||</code></th>
<td>Evaluates to <code>true</code> if any subexpressions evaluate to <code>true</code>.</td>
<td><pre><code>$friend === "Sue" || $friend === "Dan"</code></pre></td>
</tr>
</tr>
</tbody>
</table>
