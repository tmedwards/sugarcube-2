<!-- ***********************************************************************************************
	CSS
************************************************************************************************ -->
# <abbr title="Cascading Style Sheets">CSS</abbr> {#css}


<!-- ***************************************************************************
	Passage Conversions
**************************************************************************** -->
## Passage Conversions {#css-passage-conversions}

IDs and classes automatically generated from passage names and tags are normalized to kebab case with all lowercase letters—which entails: removing characters that are not alphanumerics, underscores, hyphens, en-/em-dashes, or whitespace, then replacing any remaining non-alphanumeric characters with hyphens, one per group, and finally converting the result to lowercase.

### Passage Names

Passage names have `passage-` prepended to their converted forms and are converted both into IDs and classes depending on how the passage is used—an ID for the active passage, classes for included (via [`<<include>>`](#macros-macro-include)) passages.

For example, if the passage name was `Gone fishin'`, then:

* When the active passage, it would become the ID `passage-gone-fishin` (selector: `#passage-gone-fishin`).
* When included, it would become the class `passage-gone-fishin` (selector: `.passage-gone-fishin`).

### Passage Tags

When displaying a passage, its tags are:

1. Added to the active passage's container element, `<html>` element, and `<body>` element as a space separated list within the `data-tags` attribute.
2. Added to the active passage's container element and `<body>` element as classes.  The following special tags are excluded from this mapping:  
	<table class="list-table">
	<tbody>
		<tr>
			<th>Twine&nbsp;2:</th>
			<td><code>debug</code>, <code>nobr</code>, <code>passage</code>, <code>widget</code>, and any tag starting with <code>twine.</code></td>
		</tr>
		<tr>
			<th>Twine&nbsp;1/Twee:</th>
			<td><code>debug</code>, <code>nobr</code>, <code>passage</code>, <code>script</code>, <code>stylesheet</code>, <code>widget</code>, and any tag starting with <code>twine.</code></td>
		</tr>
	</tbody>
	</table>

For example, if the tag name was `Sector_42`, then it would become both the `data-tags` attribute member `Sector_42` (selector: `[data-tags~="Sector_42"]`) and the class `sector-42` (selector: `.sector-42`).


<!-- ***************************************************************************
	Example Selectors
**************************************************************************** -->
## Example Selectors {#css-example-selectors}

<table>
<thead>
	<tr>
		<th>Selector</th>
		<th>Description</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td><code>html</code></td>
		<td>
			<p>The document element.  The default font stack is set here.</p>
			<p>The active passage's tags will be added to its <code>data-tags</code> attribute (see: <a href="#css-passage-conversions">Passage Conversions</a>).</p>
		</td>
	</tr>
	<tr>
		<td><code>body</code></td>
		<td>
			<p>The body of the page.  The default foreground and background colors are set here.</p>
			<p>The active passage's tags will be added to its <code>data-tags</code> attribute and classes (see: <a href="#css-passage-conversions">Passage Conversions</a>).</p>
		</td>
	</tr>
	<tr>
		<td><code>#story</code></td>
		<td>Selects the story element.</td>
	</tr>
	<tr>
		<td><code>#passages</code></td>
		<td>Selects the element that contains passage elements.  All created passage elements will be children of this element.</td>
	</tr>
	<tr>
		<td><code>.passage</code></td>
		<td>
			<p>Selects the passage element.  Normally, there will be only one such passage per turn, however, during passage navigation there may briefly be two—the incoming (a.k.a. active) and outgoing passages.</p>
			<p>The active passage's name will be added as its ID (see: <a href="#css-passage-conversions">Passage Conversions</a>).</p>
			<p>The active passage's tags will be added to its <code>data-tags</code> attribute and classes (see: <a href="#css-passage-conversions">Passage Conversions</a>).</p>
		</td>
	</tr>
	<tr>
		<td><code>.passage a</code></td>
		<td>Selects all <code>&lt;a&gt;</code> elements within the passage element.</td>
	</tr>
	<tr>
		<td><code>.passage a:hover</code></td>
		<td>Selects <code>&lt;a&gt;</code> elements within the passage element that are being hovered over.</td>
	</tr>
	<tr>
		<td><code>.passage a:active</code></td>
		<td>Selects <code>&lt;a&gt;</code> elements within the passage element that are being clicked on.</td>
	</tr>
	<tr>
		<td><code>.passage .link-broken</td>
		<td>Selects all internal link elements within the passage element whose passages do not exist within the story.</td>
	</tr>
	<tr>
		<td><code>.passage .link-disabled</td>
		<td>Selects all internal link elements within the passage element who have been disabled—e.g., already chosen <code>&lt;&lt;choice&gt;&gt;</code> macro links.</td>
	</tr>
	<tr>
		<td><code>.passage .link-external</code></td>
		<td>Selects all external link elements within the passage element—e.g., links to other pages and websites.</td>
	</tr>
	<tr>
		<td><code>.passage .link-internal</code></td>
		<td>Selects all internal link elements within the passage element—e.g., passage and macro links.</td>
	</tr>
	<tr>
		<td><code>.passage .link-visited<a href="#css-example-selectors-fn1">1</a></code></td>
		<td>Selects all internal link elements within the passage element whose passages are within the in-play story history—i.e., passages the player has been to before.</td>
	</tr>
	<tr>
		<td><code>.passage .link-internal:not(.link-visited)<a href="#css-example-selectors-fn1">1</a></code></td>
		<td>Selects all internal link elements within the passage element whose passages are not within the in-play story history—i.e., passages the player has never been to before.</td>
	</tr>
</tbody>
</table>

<ol class="note">
<li id="css-example-selectors-fn1">The <code>.link-visited</code> class is not enabled by default, see the <code>Config</code> API's <a href="#config-api-property-addvisitedlinkclass"><code>Config.addVisitedLinkClass</code></a> property for more information.</li>
</ol>


<!-- ***************************************************************************
	Warnings
**************************************************************************** -->
## Warnings {#css-warnings}

### Multiple Stylesheets *(for Twine&nbsp;1/Twee only)*

When using Twine&nbsp;1/Twee, it is ***strongly*** recommended that you use only a single `stylesheet` tagged passage.  CSS styles cascade in order of load, so if you use multiple `stylesheet` tagged passages, then it is all too easy for your styles to be loaded in the wrong order, since Twine&nbsp;1/Twee gives you no control over the order that multiple `stylesheet` tagged passages load.

### Tagged Stylesheets

SugarCube does not support the Twine&nbsp;1.4+ vanilla story formats' tagged stylesheets.  In SugarCube, you would instead simply prefix the selectors of your styles with the appropriate tag-based selectors—e.g., either `[data-tags~="…"]` attribute selectors or class selectors.

For example, if some story passages were tagged with `forest`, then styles for those forest passages might look like this:

```
/* Using [data-tags~="…"] attribute selectors on <html> */
html[data-tags~="forest"] { background-image: url(forest-bg.jpg); }
html[data-tags~="forest"] .passage { color: darkgreen; }
html[data-tags~="forest"] a { color: green; }
html[data-tags~="forest"] a:hover { color: lime; }

/* Using [data-tags~="…"] attribute selectors on <body> */
body[data-tags~="forest"] { background-image: url(forest-bg.jpg); }
body[data-tags~="forest"] .passage { color: darkgreen; }
body[data-tags~="forest"] a { color: green; }
body[data-tags~="forest"] a:hover { color: lime; }

/* Using class selectors on <body> */
body.forest { background-image: url(forest-bg.jpg); }
body.forest .passage { color: darkgreen; }
body.forest a { color: green; }
body.forest a:hover { color: lime; }
```


<!-- ***************************************************************************
	Built-in Stylesheets
**************************************************************************** -->
## Built-in Stylesheets {#css-built-ins}

These are SugarCube's built-in stylesheets, in order of load/cascade.  The most interesting of which, from an end-user's standpoint, are 4–10.  The links go to the most recent release versions of each in SugarCube's [source code repository](https://github.com/tmedwards/sugarcube-2).

1. [normalize.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/vendor/normalize.css)
2. [init-screen.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/init-screen.css)
3. [font.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/font.css)
4. [core.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/core.css)
5. [core-display.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/core-display.css)
6. [core-passage.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/core-passage.css)
7. [core-macro.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/core-macro.css)
8. [ui-dialog.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/ui-dialog.css)
9. [ui.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/ui.css)
10. [ui-bar.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/ui-bar.css)
11. [ui-debug.css](https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/ui-debug.css)
