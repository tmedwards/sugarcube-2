<!-- ***********************************************************************************************
	Markup
************************************************************************************************ -->
# Markup {#markup}

<p role="note"><b>Note:</b>
Except where noted, all markup has been available since <code>v2.0.0</code>.
</p>


<!-- ***************************************************************************
	Naked Variable
**************************************************************************** -->
## Naked Variable {#markup-naked-variable}

In addition to using one of the print macros ([`<<print>>`](#macros-macro-print), [`<<=>>`](#macros-macro-equal), [`<<->>`](#macros-macro-hyphen)) to print the values of TwineScript variables, SugarCube's naked variable markup allows printing them simply by including them within your normal passage text—i.e., variables in passage text are interpolated into a string representation of their values.

The following forms are supported by the naked variable markup:

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax</th>
		<th>Example</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Simple variable</td>
		<td><pre><code>$variable</code></pre></td>
		<td><pre><code>$name</code></pre></td>
	</tr>
	<tr>
		<td>Property access,<br>dot notation</td>
		<td><pre><code>$variable.property</code></pre></td>
		<td><pre><code>$thing.name</code></pre></td>
	</tr>
	<tr>
		<td>Index/property access,<br>square bracket notation</td>
		<td>
			<pre><code>$variable[numericIndex]</code></pre>
			<pre><code>$variable["property"]</code></pre>
			<pre><code>$variable['property']</code></pre>
			<pre><code>$variable[$indexOrPropertyVariable]</code></pre>
		</td>
		<td>
			<pre><code>$thing[0]</code></pre>
			<pre><code>$thing["name"]</code></pre>
			<pre><code>$thing['name']</code></pre>
			<pre><code>$thing[$member]</code></pre>
		</td>
	</tr>
</tbody>
</table>

If you need to print anything more complex—e.g., using a calculation, `$variable[_i + 1]`, or a method call, `$variable.someMethod()`—then you will still need to use one of the print macros.

For example:

```
/* Explicitly printing the value of $name via the <<print>> macro */
Well hello there, <<print $name>>.

/* Implicitly printing the value of $name via the naked variable markup */
Well hello there, $name.

/* Assuming $name is set to "Mr. Freeman", both should yield the following */
Well hello there, Mr. Freeman.
```

Because variables within your passage text are transformed into their values automatically, if you actually want to output a variable as-is—i.e., without interpolation; e.g., for a tutorial, debug output, or whatever—then you'll need to escape it in some fashion.  For example:

```
/* Using the nowiki markup: """…""" (triple double-quotes) */
The variable """$name""" is set to: $name

/* Using the nowiki markup: <nowiki>…</nowiki> */
The variable <nowiki>$name</nowiki> is set to: $name

/* Using the double dollar-sign markup (which escapes the $-sigil): $$ */
The variable $$name is set to: $name

/* Assuming $name is set to "Mr. Freeman", all of the above should yield the following */
The variable $name is set to: Mr. Freeman
```

Additionally, you could use the inline code markup to escape the variable, though it will also wrap the escaped variable within a `<code>` element, so it's probably best used for examples and tutorials.  For example:

```
/* Using the inline code markup: {{{…}}} (triple curly braces) */
The variable {{{$name}}} is set to: $name

/* Assuming $name is set to "Mr. Freeman", it should yield the following */
The variable <code>$name</code> is set to: Mr. Freeman
```


<!-- ***************************************************************************
	Link
**************************************************************************** -->
## Link {#markup-link}

SugarCube's link markup consists of a required `Link` component and optional `Text` and `Setter` components.  The `Link` and `Text` components may be either plain text or any valid TwineScript expression, which will be evaluated early—i.e., when the link is initially processed.  The `Setter` component, which only works with passage links, must be a valid [TwineScript expression](#twinescript-expressions), of the [`<<set>>` macro](#macros-macro-set) variety, which will be evaluated late—i.e., when the link is clicked on.

The `Link` component value may be the title of a passage or any valid URL to a resource (local or remote).

In addition to the standard pipe separator (`|`) used to separate the `Link` and `Text` components (as seen below), SugarCube also supports the arrow separators (`->` &amp; `<-`).  Particular to the arrow separators, the arrows' direction determines the order of the components, with the arrow always pointing at the `Link` component—i.e., the right arrow works like the pipe separator, `Text->Link`, while the left arrow is reversed, `Link<-Text`.

<p role="note" class="warning"><b>Warning (Twine&nbsp;2):</b>
Due to how the Twine&nbsp;2 automatic passage creation feature currently works, using any TwineScript expression for the <code>Link</code> component will cause a passage named after the expression to be created that will need to be deleted.  To avoid this problem, it's suggested that you use the separate argument form of the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code> macro</a> in Twine&nbsp;2 when you need to use an expression.
</p>

<table>
<caption>For the following examples assume: <code>$go</code> is <code>&quot;Grocery&quot;</code> and <code>$show</code> is <code>&quot;Go buy milk&quot;</code></caption>
<thead>
	<tr>
		<th>Syntax</th>
		<th>Example</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td><pre><code>[[Link]]</code></pre></td>
		<td class="multiline">
			<pre><code>[[Grocery]]</code></pre>
			<pre><code>[[$go]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[[Text|Link]]</code></pre></td>
		<td class="multiline">
			<pre><code>[[Go buy milk|Grocery]]</code></pre>
			<pre><code>[[$show|$go]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[[Link][Setter]]</code></pre></td>
		<td class="multiline">
			<pre><code>[[Grocery][$bought to "milk"]]</code></pre>
			<pre><code>[[$go][$bought to "milk"]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[[Text|Link][Setter]]</code></pre></td>
		<td class="multiline">
			<pre><code>[[Go buy milk|Grocery][$bought to "milk"]]</code></pre>
			<pre><code>[[$show|$go][$bought to "milk"]]</code></pre>
		</td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Image
**************************************************************************** -->
## Image {#markup-image}

SugarCube's image markup consists of a required `Image` component and optional `Title`, `Link`, and `Setter` components.  The `Image`, `Title`, and `Link` components may be either plain text or any valid TwineScript expression, which will be evaluated early—i.e., when the link is initially processed.  The `Setter` component, which only works with passage links, must be a valid [TwineScript expression](#twinescript-expressions), of the [`<<set>>` macro](#macros-macro-set) variety, which will be evaluated late—i.e., when the link is clicked on.

The `Image` component value may be any valid URL to an image resource (local or remote) or the title of an [embedded image passage (Twine&nbsp;1 &amp; Tweego only)](http://twinery.org/wiki/image).  The `Link` component value may be the title of a passage or any valid URL to a resource (local or remote).

In addition to the standard pipe separator (`|`) used to separate the `Image` and `Title` components (as seen below), SugarCube also supports the arrow separators (`->` &amp; `<-`).  Particular to the arrow separators, the arrows' direction determines the order of the components, with the arrow always pointing at the `Image` component—i.e., the right arrow works like the pipe separator, `Title->Image`, while the left arrow is reversed, `Image<-Title`.

<p role="note" class="warning"><b>Warning (Twine&nbsp;2):</b>
Due to how the Twine&nbsp;2 automatic passage creation feature currently works, using any TwineScript expression for the <code>Link</code> component will cause a passage named after the expression to be created that will need to be deleted.  To avoid this problem, it's suggested that you use the separate argument form of the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code> macro</a> in Twine&nbsp;2 when you need to use an expression.
</p>

<table>
<caption>For the following examples assume: <code>$src</code> is <code>home.png</code>, <code>$go</code> is <code>&quot;Home&quot;</code>, and <code>$show</code> is <code>&quot;Go home&quot;</code></caption>
<thead>
	<tr>
		<th>Syntax</th>
		<th>Example</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td><pre><code>[img[Image]]</code></pre></td>
		<td class="multiline">
			<pre><code>[img[home.png]]</code></pre>
			<pre><code>[img[$src]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[img[Image][Link]]</code></pre></td>
		<td class="multiline">
			<pre><code>[img[home.png][Home]]</code></pre>
			<pre><code>[img[$src][$go]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[img[Image][Link][Setter]]</code></pre></td>
		<td class="multiline">
			<pre><code>[img[home.png][Home][$done to true]]</code></pre>
			<pre><code>[img[$src][$go][$done to true]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[img[Title|Image]]</code></pre></td>
		<td class="multiline">
			<pre><code>[img[Go home|home.png]]</code></pre>
			<pre><code>[img[$show|$src]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[img[Title|Image][Link]]</code></pre></td>
		<td class="multiline">
			<pre><code>[img[Go home|home.png][Home]]</code></pre>
			<pre><code>[img[$show|$src][$go]]</code></pre>
		</td>
	</tr>
	<tr>
		<td><pre><code>[img[Title|Image][Link][Setter]]</code></pre></td>
		<td class="multiline">
			<pre><code>[img[Go home|home.png][Home][$done to true]]</code></pre>
			<pre><code>[img[$show|$src][$go][$done to true]]</code></pre>
		</td>
	</tr>
</tbody>
</table>

#### Within stylesheets

A restricted subset of the image markup, allowing only the `Image` component, may be used within stylesheets—primarily to allow the easy use of [image passages](#guide-media-passages).  For example:

```
/* Using the external image "forest.png" as the <body> background. */
body {
	background-image: [img[forest.png]];
}

/* Using the image passage "lagoon" as the <body> background. */
body {
	background-image: [img[lagoon]];
}
```


<!-- ***************************************************************************
	HTML Attribute
**************************************************************************** -->
## HTML Attribute {#markup-html-attribute}

<p role="note" class="warning"><b>Warning:</b>
None of these features work within the <a href="#markup-verbatim-html">verbatim HTML markup</a>.
</p>

<!-- *********************************************************************** -->

### Special Attribute {#markup-html-attribute-special}

SugarCube provides a few special HTML attributes, which you may add to HTML tags to enable special behaviors.  There are attributes for passage links, media passages, and setters.

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Attribute</th>
		<th>Example</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Passage, Link</td>
		<td><pre><code>data-passage</code></pre></td>
		<td>
			<pre><code>&lt;a data-passage=&quot;PassageName&quot;&gt;Do the thing&lt;/a&gt;</code></pre>
			<pre><code>&lt;area shape="rect" coords="25,25,75,75" data-passage=&quot;PassageName&quot;&gt;</code></pre>
			<pre><code>&lt;button data-passage=&quot;PassageName&quot;&gt;Do the thing&lt;/button&gt;</code></pre>
		</td>
	</tr>
	<tr>
		<td>Passage, Audio</td>
		<td><pre><code>data-passage</code></pre></td>
		<td><pre><code>&lt;audio data-passage=&quot;AudioPassageName&quot;&gt;</code></pre></td>
	</tr>
	<tr>
		<td>Passage, Image</td>
		<td><pre><code>data-passage</code></pre></td>
		<td><pre><code>&lt;img data-passage=&quot;ImagePassageName&quot;&gt;</code></pre></td>
	</tr>
	<tr>
		<td>Passage, Source</td>
		<td><pre><code>data-passage</code></pre></td>
		<td><pre><code>&lt;source data-passage=&quot;AudioOrVideoPassageName&quot;&gt;</code></pre></td>
	</tr>
	<tr>
		<td>Passage, Video</td>
		<td><pre><code>data-passage</code></pre></td>
		<td><pre><code>&lt;video data-passage=&quot;VideoPassageName&quot;&gt;</code></pre></td>
	</tr>
	<tr>
		<td>Setter</td>
		<td><pre><code>data-setter</code></pre></td>
		<td>
			<pre><code>&lt;a data-passage=&quot;PassageName&quot; data-setter=&quot;$thing to 'done'&quot;&gt;Do the thing&lt;/a&gt;</code></pre>
			<pre><code>&lt;area shape="rect" coords="25,25,75,75" data-passage=&quot;PassageName&quot;
	data-setter=&quot;$thing to 'done'&quot;&gt;</code></pre>
			<pre><code>&lt;button data-passage=&quot;PassageName&quot; data-setter=&quot;$thing to 'done'&quot;&gt;Do the thing&lt;/button&gt;</code></pre>
		</td>
	</tr>
</tbody>
</table>

#### History:

* `v2.0.0`: Introduced.
* `v2.24.0`: Added `data-passage` attribute support to `<audio>`, `<source>`, and `<video>` tags.

<!-- *********************************************************************** -->

### Attribute Directive {#markup-html-attribute-directive}

HTML attributes may be prefixed with directives, special text, which trigger special processing of such attributes.

<dl>
<dt>Evaluation directive: <code>sc-eval:</code>, <code>@</code></dt>
<dd>
	<p>	The evaluation directive causes the attribute's value to be evaluated as TwineScript.  Post-evaluation, the directive will be removed from the attribute's name and the result of the evaluation will be used as the actual value of the attribute.</p>
	<p role="note" class="warning"><b>Warning:</b>
	The evaluation directive is not allowed on the <a href="#markup-html-attribute-special"><code>data-setter</code> attribute</a>—as its function is to evaluate its contents upon activation of its own element—and any such attempt will cause an error.
	</p>
	<table>
	<caption>For the following examples assume: <code>_id</code> is <code>&quot;foo&quot;</code></caption>
	<thead>
		<tr>
			<th>Syntax</th>
			<th>Example</th>
			<th>Rendered As</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><pre><code>sc-eval:<i>attribute-name</i></code></pre></td>
			<td><pre><code>&lt;span sc-eval:id=&quot;_id&quot;&gt;…&lt;/span&gt;</code></pre></td>
			<td><pre><code>&lt;span id=&quot;foo&quot;&gt;…&lt;/span&gt;</code></pre></td>
		</tr>
		<tr>
			<td><pre><code>@<i>attribute-name</i></code></pre></td>
			<td><pre><code>&lt;span @id=&quot;_id&quot;&gt;…&lt;/span&gt;</code></pre></td>
			<td><pre><code>&lt;span id=&quot;foo&quot;&gt;…&lt;/span&gt;</code></pre></td>
		</tr>
	</tbody>
	</table>
</dd>
</dl>

#### History:

* `v2.21.0`: Introduced.
* `v2.23.5`: Fixed an issue with the evaluation directive where using multiple directives on a single HTML tag would result in some being unprocessed.


<!-- ***************************************************************************
	Line Continuation
**************************************************************************** -->
## Line Continuation {#markup-line-continuation}

<p role="note" class="see"><b>See Also:</b>
The various no-break features—<a href="#macros-macro-nobr"><code>&lt;&lt;nobr&gt;&gt;</code> macro</a>, <a href="#special-tag-nobr"><code>nobr</code> special tag</a>, and <a href="#config-api-property-passages-nobr"><code>Config.passages.nobr</code> setting</a>—all perform a similar, though slightly different, function.
</p>

<p role="note" class="warning"><b>Warning:</b>
Line continuations, or any markup that relies on line positioning, are incompatible with the no-break features because of how the latter function.
</p>

A backslash (`\`) that begins or ends a line is the line continuation markup.  Upon processing the backslash, associated line break, and all whitespace between them are removed—thus, joining the nearby lines together.  This is mostly useful for controlling whitespace when you want to wrap lines for readability, but not generate extra whitespace upon display, and the [`<<silently>>` macro](#macros-macro-silently) isn't an option because you need to generate output.

For example, all of the following: (n.b., `·` represents whitespace that will be removed, `¬` represents line breaks)

```
The rain in Spain falls \¬
mainly on the plain.

The rain in Spain falls \····¬
mainly on the plain.

The rain in Spain falls¬
\ mainly on the plain.

The rain in Spain falls¬
····\ mainly on the plain.
```

Yield the single line in the final output:

```
The rain in Spain falls mainly on the plain.
```


<!-- ***************************************************************************
	Heading
**************************************************************************** -->
## Heading {#markup-heading}

An exclamation point (`!`) that begins a line defines the heading markup.  It consists of one to six exclamation points, each additional one beyond the first signifying a lesser heading.

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Level 1</td>
		<td><pre><code>!Level 1 Heading</code></pre></td>
		<td><pre><code>&lt;h1&gt;Level 1 Heading&lt;/h1&gt;</code></pre></td>
		<td class="displays"><h1>Level 1 Heading</h1></td>
	</tr>
	<tr>
		<td>Level 2</td>
		<td><pre><code>!!Level 2 Heading</code></pre></td>
		<td><pre><code>&lt;h2&gt;Level 2 Heading&lt;/h2&gt;</code></pre></td>
		<td class="displays"><h2>Level 2 Heading</h2></td>
	</tr>
	<tr>
		<td>Level 3</td>
		<td><pre><code>!!!Level 3 Heading</code></pre></td>
		<td><pre><code>&lt;h3&gt;Level 3 Heading&lt;/h3&gt;</code></pre></td>
		<td class="displays"><h3>Level 3 Heading</h3></td>
	</tr>
	<tr>
		<td>Level 4</td>
		<td><pre><code>!!!!Level 4 Heading</code></pre></td>
		<td><pre><code>&lt;h4&gt;Level 4 Heading&lt;/h4&gt;</code></pre></td>
		<td class="displays"><h4>Level 4 Heading</h4></td>
	</tr>
	<tr>
		<td>Level 5</td>
		<td><pre><code>!!!!!Level 5 Heading</code></pre></td>
		<td><pre><code>&lt;h5&gt;Level 5 Heading&lt;/h5&gt;</code></pre></td>
		<td class="displays"><h5>Level 5 Heading</h5></td>
	</tr>
	<tr>
		<td>Level 6</td>
		<td><pre><code>!!!!!!Level 6 Heading</code></pre></td>
		<td><pre><code>&lt;h6&gt;Level 6 Heading&lt;/h6&gt;</code></pre></td>
		<td class="displays"><h6>Level 6 Heading</h6></td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Style
**************************************************************************** -->
## Style {#markup-style}

<p role="note" class="warning"><b>Warning:</b>
Because the style markups use the same tokens to begin and end each markup, the same style cannot be nested within itself.
</p>

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Emphasis</td>
		<td><pre><code>//Emphasis//</code></pre></td>
		<td><pre><code>&lt;em&gt;Emphasis&lt;/em&gt;</code></pre></td>
		<td class="displays"><em>Emphasis</em></td>
	</tr>
	<tr>
		<td>Strong</td>
		<td><pre><code>''Strong''</code></pre></td>
		<td><pre><code>&lt;strong&gt;Strong&lt;/strong&gt;</code></pre></td>
		<td class="displays"><strong>Strong</strong></td>
	</tr>
	<tr>
		<td>Underline</td>
		<td><pre><code>__Underline__</code></pre></td>
		<td><pre><code>&lt;u&gt;Underline&lt;/u&gt;</code></pre></td>
		<td class="displays"><u>Underline</u></td>
	</tr>
	<tr>
		<td>Strikethrough</td>
		<td><pre><code>==Strikethrough==</code></pre></td>
		<td><pre><code>&lt;s&gt;Strikethrough&lt;/s&gt;</code></pre></td>
		<td class="displays"><s>Strikethrough</s></td>
	</tr>
	<tr>
		<td>Superscript</td>
		<td><pre><code>Super^^script^^</code></pre></td>
		<td><pre><code>Super&lt;sup&gt;script&lt;/sup&gt;</code></pre></td>
		<td class="displays">Super<sup>script</sup></td>
	</tr>
	<tr>
		<td>Subscript</td>
		<td><pre><code>Sub~~script~~</code></pre></td>
		<td><pre><code>Sub&lt;sub&gt;script&lt;/sub&gt;</code></pre></td>
		<td class="displays">Sub<sub>script</sub></td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	List
**************************************************************************** -->
## List {#markup-list}

An asterisk (`*`) or number sign (`#`) that begins a line defines a member of the unordered or ordered list markup, respectively.

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Unordered</td>
		<td><pre><code>* A&nbsp;list&nbsp;item<br>* Another&nbsp;list&nbsp;item</code></pre></td>
		<td><pre><code>&lt;ul&gt;<br>&lt;li&gt;A&nbsp;list&nbsp;item&lt;/li&gt;<br>&lt;li&gt;Another&nbsp;list&nbsp;item&lt;/li&gt;<br>&lt;/ul&gt;</code></pre></td>
		<td class="displays"><ul><li>A&nbsp;list&nbsp;item</li><li>Another&nbsp;list&nbsp;item</li></ul></td>
	</tr>
	<tr>
		<td>Ordered</td>
		<td><pre><code># A&nbsp;list&nbsp;item<br># Another&nbsp;list&nbsp;item</code></pre></td>
		<td><pre><code>&lt;ol&gt;<br>&lt;li&gt;A&nbsp;list&nbsp;item&lt;/li&gt;<br>&lt;li&gt;Another&nbsp;list&nbsp;item&lt;/li&gt;<br>&lt;/ol&gt;</code></pre></td>
		<td class="displays"><ol><li>A&nbsp;list&nbsp;item</li><li>Another&nbsp;list&nbsp;item</li></ol></td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Blockquote
**************************************************************************** -->
## Blockquote {#markup-blockquote}

A right angle bracket (`>`) that begins a line defines the blockquote markup.  It consists of one or more right angle brackets, each additional one beyond the first signifying a level of nested blockquote.

<table>
<thead>
	<tr>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td><pre><code>&gt;Line&nbsp;1<br>&gt;Line&nbsp;2<br>&gt;&gt;Nested&nbsp;1<br>&gt;&gt;Nested&nbsp;2</code></pre></td>
		<td><pre><code>&lt;blockquote&gt;Line&nbsp;1&lt;br&gt;<br>Line&nbsp;2&lt;br&gt;<br>&lt;blockquote&gt;Nested&nbsp;1&lt;br&gt;<br>Nested&nbsp;2&lt;br&gt;<br>&lt;/blockquote&gt;&lt;/blockquote&gt;</code></pre></td>
		<td class="displays"><blockquote>Line&nbsp;1<br>Line&nbsp;2<br><blockquote>Nested&nbsp;1<br>Nested&nbsp;2<br></blockquote></blockquote></td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Code
**************************************************************************** -->
## Code {#markup-code}

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Inline</td>
		<td><pre><code>{{{Code}}}</code></pre></td>
		<td><pre><code>&lt;code&gt;Code&lt;/code&gt;</code></pre></td>
		<td class="displays"><pre><code>Code</code></pre></td>
	</tr>
	<tr>
		<td>Block</td>
		<td><pre><code>{{{<br>Code<br>More&nbsp;code<br>}}}</code></pre></td>
		<td><pre><code>&lt;pre&gt;&lt;code&gt;Code<br>More&nbsp;code<br>&lt;/code&gt;&lt;/pre&gt;</code></pre></td>
		<td class="displays"><pre><code>Code<br>More&nbsp;code<br></code></pre></td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Horizontal Rule
**************************************************************************** -->
## Horizontal Rule {#markup-horizontal-rule}

A set of four hyphen/minus characters (`-`) that begins a line defines the horizontal rule markup.

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Horizontal rule</td>
		<td><pre><code>----</code></pre></td>
		<td><pre><code>&lt;hr&gt;</code></pre></td>
		<td class="displays"><hr></td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Verbatim Text
**************************************************************************** -->
## Verbatim Text<!-- legacy --><span id="markup-verbatim"></span><!-- /legacy --> {#markup-verbatim-text}

The verbatim text markup disables processing of *all* markup contained within—both SugarCube and HTML—passing its contents directly into the output as plain text.

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Rendered As</th>
		<th>Displays As (<em>roughly</em>)</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Triple&nbsp;double&nbsp;quotes</td>
		<td><pre><code>"""No //format//"""</code></pre></td>
		<td><pre><code>No //format//</code></pre></td>
		<td>No //format//</td>
	</tr>
	<tr>
		<td>&lt;nowiki&gt; tag</td>
		<td><pre><code>&lt;nowiki&gt;No //format//&lt;/nowiki&gt;</code></pre></td>
		<td><pre><code>No //format//</code></pre></td>
		<td>No //format//</td>
	</tr>
</tbody>
</table>


<!-- ***************************************************************************
	Verbatim HTML
**************************************************************************** -->
## Verbatim HTML {#markup-verbatim-html}

A set of opening and closing &lt;html&gt; tags—i.e., `<html></html>`—defines the verbatim HTML markup.  The verbatim HTML markup disables processing of *all* markup contained within—both SugarCube and HTML—passing its contents directly into the output as HTML markup for the browser.  Thus, you should only use plain HTML markup within the verbatim markup—meaning using none of SugarCube's special HTML [attributes](#markup-html-attribute-special) or [directives](#markup-html-attribute-directive).

<p role="note"><b>Note:</b>
You should virtually never need to use the verbatim HTML markup.
</p>


<!-- ***************************************************************************
	Custom Style
**************************************************************************** -->
## Custom Style {#markup-custom-style}

<p role="note" class="warning"><b>Warning:</b>
Because the custom style markup uses the same tokens to begin and end the markup, it cannot be nested within itself.
</p>

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax</th>
		<th>Example</th>
		<th>Rendered As</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td rowspan="2">Inline</td>
		<td rowspan="2"><pre><code>@@<i>style-list</i><a href="#markup-custom-style-fn1">1</a>;Text@@</code></pre></td>
		<td><pre><code>@@#alfa;.bravo;Text@@</code></pre></td>
		<td><pre><code>&lt;span id="alfa" class="bravo"&gt;Text&lt;/span&gt;</code></pre></td>
	</tr>
	<tr>
		<td><pre><code>@@color:red;Text@@</code></pre></td>
		<td><pre><code>&lt;span style="color:red"&gt;Text&lt;/span&gt;</code></pre></td>
	</tr>
	<tr>
		<td rowspan="2">Block</td>
		<td rowspan="2"><pre><code>@@<i>style-list</i><a href="#markup-custom-style-fn1">1</a>;<br>Text<br>@@</code></pre></td>
		<td><pre><code>@@#alfa;.bravo;<br>Text<br>@@</code></pre></td>
		<td><pre><code>&lt;div id="alfa" class="bravo"&gt;Text&lt;/div&gt;</code></pre></td>
	</tr>
	<tr>
		<td><pre><code>@@color:red;<br>Text<br>@@</code></pre></td>
		<td><pre><code>&lt;div style="color:red"&gt;Text&lt;/div&gt;</code></pre></td>
	</tr>
</tbody>
</table>

<ol class="note">
<li id="markup-custom-style-fn1">
	The style-list should be a semi-colon (<code>;</code>) separated list consisting of one or more of the following:
	<ul>
	<li>A single unique hash-prefixed ID—e.g., <code>#alfa</code>.</li>
	<li>Dot-prefixed class names—e.g., <code>.bravo</code>.</li>
	<li>Style properties—e.g., <code>color:red</code>.</li>
	</ul>
	As of <code>v2.31.0</code>, the ID and class names components may be conjoined without need of extra semi-colons—e.g., <code>#alfa;.bravo;.charlie;</code> may also be written as <code>#alfa.bravo.charlie;</code>.
</li>
</ol>


<!-- ***************************************************************************
	Template
**************************************************************************** -->
## Template {#markup-template}

A text replacement markup.  The template markup begins with a question mark (`?`) followed by the template name—e.g., `?yolo`—and are set up as functions-that-return-strings, strings, or arrays of either—from which a random member is selected whenever the template is processed.  They are defined via the [`Template` API](#template-api).

For example, consider the following markup:

```
?He was always willing to lend ?his ear to anyone.
```

Assuming that `?He` resolves to `She` and `?his` to `her`, then that will produce the following output:

```
She was always willing to lend her ear to anyone.
```

#### History:

* `v2.29.0`: Introduced.


<!-- ***************************************************************************
	Comment
**************************************************************************** -->
## Comment {#markup-comment}

<p role="note"><b>Note:</b>
Comments used within passage markup are not rendered into the page output.
</p>

<table>
<thead>
	<tr>
		<th>Type</th>
		<th>Syntax &amp; Example</th>
		<th>Supported Within…</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>C-style, Block</td>
		<td><pre><code>/* This is a comment. */</code></pre></td>
		<td>Passage markup, JavaScript, Stylesheets</td>
	</tr>
	<tr>
		<td>TiddlyWiki, Block</td>
		<td><pre><code>/% This is a comment. %/</code></pre></td>
		<td>Passage markup</td>
	</tr>
	<tr>
		<td>HTML, Block</td>
		<td><pre><code>&lt;!-- This is a comment. --&gt;</code></pre></td>
		<td>Passage markup</td>
	</tr>
</tbody>
</table>
