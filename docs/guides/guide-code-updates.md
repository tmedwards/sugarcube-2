<!-- ***********************************************************************************************
	Guide: Code Updates
************************************************************************************************ -->
# Guide: Code Updates<!-- legacy --><span id="guide-upgrading"></span><!-- /legacy --> {#guide-code-updates}

This is a reference on how to update existing SugarCube code to work with newer versions of SugarCube.

<p role="note"><b>Note:</b>
The majority of newer SugarCube versions do not have any changes that would require an update.  For those versions that do, the updates are normally completely elective and may be addressed at your leisure, or not at all.  Sometimes there are breaking changes, however, and these must be addressed immediately.
</p>


<!-- ***************************************************************************
	Updating to any version ≥2.37.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.37.0 from a lesser version {#guide-code-updates-2.37.0}

<p role="note" class="warning"><b>Warning:</b>
Some changes within this version are <strong>breaking changes</strong> that you <strong><em>must</em></strong> address immediately, while others are elective changes that you may address at your leisure.  All breaking changes will be so noted.
</p>

<p role="note"><b>Note:</b>
The removals herein are of features that have been deprecated for years.  Most are <code>v1</code> compatibility APIs that have always been deprecated in <code>v2</code>.  Nothing of value has been lost.
</p>

### Deprecated legacy APIs

<table>
	<thead>
		<tr>
			<th>API</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>browser</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>Browser</code>.</td>
		</tr>
		<tr>
			<td><code>config</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>Config</code>.</td>
		</tr>
		<tr>
			<td><code>has</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>Has</code>.</td>
		</tr>
		<tr>
			<td><code>History</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>State</code>.</td>
		</tr>
		<tr>
			<td><code>state</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>State</code>.</td>
		</tr>
		<tr>
			<td><code>tale</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>Story</code>.</td>
		</tr>
		<tr>
			<td><code>TempVariables</code></td>
			<td><b>BREAKING:</b> This deprecated legacy API has been removed.  Its replacement is <code>State.temporary</code>.</td>
		</tr>
	</tbody>
</table>

### `Array` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Array.random()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.  See the <a href="#methods-array-prototype-method-random"><code>&lt;Array&gt;.random()</code></a> instance method.</td>
		</tr>
		<tr>
			<td><code>&lt;Array&gt;.contains()</code></td>
			<td><b>BREAKING:</b> The polyfill for this instance method has been removed.  See the <a href="#methods-array-prototype-method-includes"><code>&lt;Array&gt;.includes()</code></a> instance method.</td>
		</tr>
		<tr>
			<td><code>&lt;Array&gt;.containsAll()</code></td>
			<td><b>BREAKING:</b> This instance method has been removed.  See the <a href="#methods-array-prototype-method-includesall"><code>&lt;Array&gt;.includesAll()</code></a> instance method.</td>
		</tr>
		<tr>
			<td><code>&lt;Array&gt;.containsAny()</code></td>
			<td><b>BREAKING:</b> This instance method has been removed.  See the <a href="#methods-array-prototype-method-includesany"><code>&lt;Array&gt;.includesAny()</code></a> instance method.</td>
		</tr>
		<tr>
			<td><code>&lt;Array&gt;.flatten()</code></td>
			<td><b>BREAKING:</b> This instance method has been removed.  See the <a href="#methods-array-prototype-method-flat"><code>&lt;Array&gt;.flat()</code></a> instance method while providing a <code>depth</code> parameter of <code>Infinity</code>.</td>
		</tr>
	</tbody>
</table>

### `Config` API

<table>
	<thead>
		<tr>
			<th>Setting</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Config.macros.ifAssignError</code></td>
			<td>This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-enableoptionaldebugging"><code>Config.enableOptionalDebugging</code></a> setting for its replacement.</td>
		</tr>
		<tr>
			<td><code>Config.passages.descriptions</code></td>
			<td>This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-descriptions"><code>Config.saves.descriptions</code></a> setting for its replacement.</td>
		</tr>
		<tr>
			<td><code>Config.saves.autoload</code></td>
			<td>This setting has been deprecated and should no longer be used.  The default UI now includes a <i>Continue</i> button, which loads the latest save.  If disabling or replacing the default UI, see the <a href="#save-api-browser-method-continue"><code>Save.browser.continue()</code> method</a> to replicate the functionality.</td>
		</tr>
		<tr>
			<td><code>Config.saves.autosave</code></td>
			<td>This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-maxautosaves"><code>Config.saves.maxAutoSaves</code></a> setting to set the number of available auto saves and the <a href="#config-api-property-saves-isallowed"><code>Config.saves.isAllowed</code></a> setting to control when new auto saves are created.</td>
		</tr>
		<tr>
			<td><code>Config.saves.isAllowed</code></td>
			<td>This setting, to which you assign a function, has had the parameters provided to the assigned function changed.  See <a href="#config-api-property-saves-isallowed">its documentation entry</a> for details.</td>
		</tr>
		<tr>
			<td><code>Config.saves.slots</code></td>
			<td>This setting has been deprecated and should no longer be used.  See the <a href="#config-api-property-saves-maxslotsaves"><code>Config.saves.maxSlotSaves</code></a> setting for its replacement.</td>
		</tr>
		<tr>
			<td><code>Config.saves.tryDiskOnMobile</code></td>
			<td>This setting has been deprecated and should no longer be used.  Saving to disk on mobile devices is now unconditionally enabled.</td>
		</tr>
	</tbody>
</table>

### `Dialog` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Dialog.addClickHandler()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>Dialog.setup()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#dialog-api-method-create"><code>Dialog.create()</code></a> static method.</td>
		</tr>
	</tbody>
</table>

### `JSON` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>JSON.reviveWrapper()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#methods-serial-method-createreviver"><code>Serial.createReviver()</code></a> static method.</td>
		</tr>
	</tbody>
</table>

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;actions&gt;&gt;</code></td>
			<td>This macro has been deprecated.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;choice&gt;&gt;</code></td>
			<td>This macro has been deprecated.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;click&gt;&gt;</code></td>
			<td><b>BREAKING:</b> This deprecated macro has been removed.  See the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code></a> macro.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;display&gt;&gt;</code></td>
			<td><b>BREAKING:</b> This deprecated macro has been removed.  See the <a href="#macros-macro-include"><code>&lt;&lt;include&gt;&gt;</code></a> macro.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;forget&gt;&gt;</code></td>
			<td><b>BREAKING:</b> This deprecated macro has been removed.  See the <a href="#functions-function-forget"><code>forget()</code></a> function.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;remember&gt;&gt;</code></td>
			<td><b>BREAKING:</b> This deprecated macro has been removed.  See the <a href="#functions-function-memorize"><code>memorize()</code></a> and <a href="#functions-function-recall"><code>recall()</code></a> functions.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;setplaylist&gt;&gt;</code></td>
			<td><b>BREAKING:</b> This deprecated macro has been removed.  See the <a href="#macros-macro-createplaylist"><code>&lt;&lt;createplaylist&gt;&gt;</code></a> macro.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;stopallaudio&gt;&gt;</code></td>
			<td><b>BREAKING:</b> This deprecated macro has been removed.  See the <a href="#macros-macro-masteraudio"><code>&lt;&lt;masteraudio&gt;&gt;</code></a> macro.</td>
		</tr>
	</tbody>
</table>

### `MacroContext` API

<table>
	<thead>
		<tr>
			<th>Member</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;MacroContext&gt;.contextHas()</code></td>
			<td>This instance method has been deprecated in favor of the <a href="#macrocontext-api-prototype-method-contextsome"><code>&lt;MacroContext&gt;.contextSome()</code></a> instance method.</td>
		</tr>
		<tr>
			<td><code>&lt;MacroContext&gt;.contextSelect()</code></td>
			<td>This instance method has been deprecated in favor of the <a href="#macrocontext-api-prototype-method-contextfind"><code>&lt;MacroContext&gt;.contextFind()</code></a> instance method.</td>
		</tr>
		<tr>
			<td><code>&lt;MacroContext&gt;.contextSelectAll()</code></td>
			<td>This instance method has been deprecated in favor of the <a href="#macrocontext-api-prototype-method-contextfilter"><code>&lt;MacroContext&gt;.contextFilter()</code></a> instance method.</td>
		</tr>
	</tbody>
</table>

### `Number` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;Number&gt;.clamp()</code></td>
			<td>This instance method has been deprecated.  See the <a href="#methods-math-method-clamp"><code>Math.clamp()</code></a> static method.</td>
		</tr>
	</tbody>
</table>

### `Passage` API

<table>
	<thead>
		<tr>
			<th>Member</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;Passage&gt;.domId</code></td>
			<td>This instance property has been deprecated in favor of the <a href="#passage-api-prototype-getter-id"><code>&lt;Passage&gt;.id</code></a> instance property.</td>
		</tr>
		<tr>
			<td><code>&lt;Passage&gt;.title</code></td>
			<td>This instance property has been deprecated in favor of the <a href="#passage-api-prototype-getter-name"><code>&lt;Passage&gt;.name</code></a> instance property.</td>
		</tr>
		<tr>
			<td><code>&lt;Passage&gt;.description()</code></td>
			<td>This instance method has been deprecated.</td>
		</tr>
	</tbody>
</table>

### `Save` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Save.get()</code></td>
			<td><b>BREAKING:</b> This static method has been removed.  See the <a href="#save-api-browser-auto-method-entries"><code>Save.browser.auto.entries()</code></a> and <a href="#save-api-browser-slot-method-entries"><code>Save.browser.slot.entries()</code></a> static methods for its closest replacements.</td>
		</tr>
		<tr>
			<td><code>Save.clear()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-method-clear"><code>Save.browser.clear()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.ok()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-method-isenabled"><code>Save.browser.isEnabled()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.autosave.delete()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-auto-method-delete"><code>Save.browser.auto.delete()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.autosave.get()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-auto-method-get"><code>Save.browser.auto.get()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.autosave.has()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-auto-method-has"><code>Save.browser.auto.has()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.autosave.load()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-auto-method-load"><code>Save.browser.auto.load()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.autosave.ok()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-auto-method-isenabled"><code>Save.browser.auto.isEnabled()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.autosave.save()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-auto-method-save"><code>Save.browser.auto.save()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.slots.length</code></td>
			<td>This static property has been deprecated in favor of the <a href="#config-api-property-saves-maxslotsaves"><code>Config.saves.maxSlotSaves</code></a> setting.</td>
		</tr>
		<tr>
			<td><code>Save.slots.count()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-getter-size"><code>Save.browser.slot.size</code></a> static getter.</td>
		</tr>
		<tr>
			<td><code>Save.slots.delete()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-method-delete"><code>Save.browser.slot.delete()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.slots.get()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-method-get"><code>Save.browser.slot.get()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.slots.has()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-method-has"><code>Save.browser.slot.has()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.slots.isEmpty()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-getter-size"><code>Save.browser.slot.size</code></a> static getter.</td>
		</tr>
		<tr>
			<td><code>Save.slots.load()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-method-load"><code>Save.browser.slot.load()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.slots.ok()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-method-isenabled"><code>Save.browser.slot.isEnabled()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.slots.save()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-browser-slot-method-save"><code>Save.browser.slot.save()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.export()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-disk-method-save"><code>Save.disk.save()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.import()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-disk-method-load"><code>Save.disk.load()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.deserialize()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-base64-method-load"><code>Save.base64.load()</code></a> static method.</td>
		</tr>
		<tr>
			<td><code>Save.serialize()</code></td>
			<td>This static method has been deprecated in favor of the <a href="#save-api-base64-method-save"><code>Save.base64.save()</code></a> static method.</td>
		</tr>
	</tbody>
</table>

### `Scripting` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Scripting.desugar()</code></td>
			<td><b>BREAKING:</b> The undocumented <code>is not</code> to <code>isnot</code> operator mapping has been removed.</td>
		</tr>
		<tr>
			<td><code>Scripting.parse()</code></td>
			<td>This static method has been deprecated in favor of the <code>Scripting.desugar()</code> static method.</td>
		</tr>
	</tbody>
</table>

### `State` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>State.backward()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>State.display()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>State.forward()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>State.initPRNG()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>State.play()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>State.restart()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>State.show()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
	</tbody>
</table>

### `Story` API

<table>
	<thead>
		<tr>
			<th>Member</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Story.domId</code></td>
			<td>This static property has been deprecated in favor of the <a href="#story-api-getter-id"><code>Story.id</code></a> static property.</td>
		</tr>
		<tr>
			<td><code>Story.title</code></td>
			<td>This static property has been deprecated in favor of the <a href="#story-api-getter-name"><code>Story.name</code></a> static property.</td>
		</tr>
	</tbody>
</table>

### `StoryInterface` special passage

<p>
<b>POSSIBLY BREAKING:</b> The default UI's <code>&lt;div id="story" role="main"&gt;</code> container has been made a core part of the base UI, for both native and custom end user markup.  As a consequence, this means that the custom markup generated by using the <code>StoryInterface</code> special passage may no longer itself contain a <code>#story</code> element and will be added to the core <code>#story</code> container, rather than <code>&lt;body&gt;</code>.
</p>
<p>
An example of the new hierarchy:
</p>
<pre><code>&lt;body&gt;
	&lt;div id="story" role="main"&gt;
		&lt;!-- StoryInterface elements added here --&gt;
	&lt;/div&gt;
&lt;/body&gt;</code></pre>
<p>
It is <strong><em>strongly recommended</em></strong> that you review your selectors related to the generated markup, both for DOM manipulation and CSS styling, to ensure that they're still functional.  Primarily this will affect selectors that use the child combinator (<code>&gt;</code>) with a <code>body</code> parent—e.g., <code>body &gt; …</code> where <code>…</code> is one the elements within your custom markup.
</p>
<p>
This change was required to fix a bug related to the interaction between open dialogs and <code>&lt;body&gt;</code>.
</p>

### `String` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;String&gt;.readBracketedList()</code></td>
			<td><b>BREAKING:</b> This deprecated instance method has been removed.</td>
		</tr>
	</tbody>
</table>

### `UI` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>UI.buildAutoload()</code></td>
			<td>This static method has been deprecated.</td>
		</tr>
		<tr>
			<td><code>UI.addClickHandler()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.body()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.close()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.isOpen()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.open()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.resize()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.setStoryElements()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.setup()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.stow()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
		<tr>
			<td><code>UI.unstow()</code></td>
			<td><b>BREAKING:</b> This deprecated static method has been removed.</td>
		</tr>
	</tbody>
</table>

### `UIBar` toggle and history button markup &amp; styles

<p>
The icons of the UI bar history control buttons have been changed from being text content in their markup to a part of their styles, as with most native SugarCube icon bearing buttons.
</p>
<p>
The styles of the UI bar toggle and history control buttons have been simplified.  If you've customized the styling of any of these buttons, then it is <strong><em>strongly recommended</em></strong> that you review the <a href="https://raw.githubusercontent.com/tmedwards/sugarcube-2/master/src/css/ui-bar.css"><code>ui-bar.css</code> file</a> for exact details.
</p>


<!-- ***************************************************************************
	Updating to any version ≥2.36.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.36.0 from a lesser version {#guide-code-updates-2.36.0}

All changes within this version are elective changes that you may address at your leisure.

### `Config` API

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Config.history.maxStates</code></td>
			<td>This setting property has been updated to disallow unlimited states.</td>
		</tr>
		<tr>
			<td><code>Config.saves.onLoad</code></td>
			<td>This setting property has been deprecated in favor of the <a href="#save-api-events"><code>Save</code> Events API</a>, specifically the <a href="#save-api-method-onload-add"><code>Save.onLoad.add</code> static method</a>.</td>
		</tr>
		<tr>
			<td><code>Config.saves.onSave</code></td>
			<td>This setting property has been deprecated in favor of the <a href="#save-api-events"><code>Save</code> Events API</a>, specifically the <a href="#save-api-method-onsave-add"><code>Save.onSave.add</code> static method</a>.</td>
		</tr>
	</tbody>
</table>

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;widget&gt;&gt;</code></td>
			<td>The special <code>$args</code> story variable has been deprecated in favor of the <code>_args_</code> temporary variable.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.31.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.31.0 from a lesser version {#guide-code-updates-2.31.0}

<p role="note" class="warning"><b>Warning:</b>
All changes within this version are <strong>breaking changes</strong> that you <strong><em>must</em></strong> address immediately.
</p>

### Parser library

<table>
	<thead>
		<tr>
			<th>Parser</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>HTML&nbsp;tag</td>
			<td>The parser has been updated to disallow use of the evaluation attribute directive on the <code>data-setter</code> content attribute.  They were never supposed to be combined.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.30.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.30.0 from a lesser version {#guide-code-updates-2.30.0}

All changes within this version are elective changes that you may address at your leisure.

### `Config` API

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Config.saves.autosave</code></td>
			<td>This setting property has been updated to accept function values and its acceptance of string values has been deprecated.  String values will still be accepted for further releases of v2, however, switching to an array is recommended—e.g., the string value <code>"autosave"</code> would become the array <code>["autosave"]</code>.  See the <a href="#config-api-property-saves-autosave"><code>Config.saves.autosave</code> property</a> for more information.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.29.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.29.0 from a lesser version {#guide-code-updates-2.29.0}

All changes within this version are elective changes that you may address at your leisure.

### `Dialog` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Dialog.addClickHandler()</code></td>
			<td>This method has been deprecated and should no longer be used.  The core of what it does is simply to wrap a call to <a href="#dialog-api-method-open"><code>Dialog.open()</code></a> within a call to <a href="#methods-jquery-prototype-method-ariaclick"><code>&lt;jQuery&gt;.ariaClick()</code></a>, which can be done directly and with greater flexibility.</td>
		</tr>
	</tbody>
</table>

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;track&gt;&gt;</code> <small>(of:&nbsp;<code>&lt;&lt;createplaylist&gt;&gt;</code>)</small></td>
			<td>The <code>&lt;&lt;createplaylist&gt;&gt;</code> macro's &lt;&lt;track&gt;&gt; child macro has had its <code>copy</code> keyword deprecated in favor of <code>own</code>.  See the <a href="#macros-macro-createplaylist"><code>&lt;&lt;createplaylist&gt;&gt;</code> macro</a> for more information.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;forget&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;forget&gt;&gt;</code> macro has been deprecated in favor of the <a href="#functions-function-forget"><code>forget()</code></a> function.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;remember&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;remember&gt;&gt;</code> macro has been deprecated in favor of the <a href="#functions-function-memorize"><code>memorize()</code></a> and <a href="#functions-function-recall"><code>recall()</code></a> functions.</td>
		</tr>
	</tbody>
</table>

### Method library

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;Array&gt;.flatten()</code></td>
			<td>This method has been deprecated in favor of the <a href="#methods-array-prototype-method-flat"><code>&lt;Array&gt;.flat()</code></a> method.</td>
		</tr>
	</tbody>
</table>

### `State` API

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>State.initPRNG()</code></td>
			<td>This method has been deprecated in favor of the <a href="#state-api-method-prng-init"><code>State.prng.init()</code></a> method.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.28.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.28.0 from a lesser version {#guide-code-updates-2.28.0}

All changes within this version are elective changes that you may address at your leisure.

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;cacheaudio&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;cacheaudio&gt;&gt;</code> macro's original optional format specifier syntax, <code>format:formatId;…</code>, has been deprecated in favor of the new syntax, <code>formatId|…</code>.</a>.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.20.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.20.0 from a lesser version {#guide-code-updates-2.20.0}

All changes within this version are elective changes that you may address at your leisure.

### Method library

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>Array.random()</code></td>
			<td>This method has been deprecated and should no longer be used.  In general, look to the <a href="#methods-array-prototype-method-random"><code>&lt;Array&gt;.random()</code></a> method instead.  If you need a random member from an array-like object or iterable, use the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from"><code>Array.from()</code></a> method to convert it to an array, then use <code>&lt;Array&gt;.random()</code>—e.g., <code>Array.from(something).random()</code>.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.15.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.15.0 from a lesser version<!-- legacy --><span id="guide-upgrading-2.15.0"></span><!-- /legacy --> {#guide-code-updates-2.15.0}

All changes within this version are elective changes that you may address at your leisure.

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;display&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;display&gt;&gt;</code> macro has been deprecated in favor of the <a href="#macros-macro-include"><code>&lt;&lt;include&gt;&gt;</code> macro</a>.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.10.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.10.0 from a lesser version<!-- legacy --><span id="guide-upgrading-2.10.0"></span><!-- /legacy --> {#guide-code-updates-2.10.0}

All changes within this version are elective changes that you may address at your leisure.

### Method library

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;Array&gt;.contains()</code></td>
			<td>The <code>&lt;Array&gt;.contains()</code> method has been deprecated in favor of the <a href="#methods-array-prototype-method-includes"><code>&lt;Array&gt;.includes()</code></a> method.
			</td>
		</tr>
		<tr>
			<td><code>&lt;Array&gt;.containsAll()</code></td>
			<td>The <code>&lt;Array&gt;.containsAll()</code> method has been deprecated in favor of the <a href="#methods-array-prototype-method-includesall"><code>&lt;Array&gt;.includesAll()</code></a> method.
			</td>
		</tr>
		<tr>
			<td><code>&lt;Array&gt;.containsAny()</code></td>
			<td>The <code>&lt;Array&gt;.containsAny()</code> method has been deprecated in favor of the <a href="#methods-array-prototype-method-includesany"><code>&lt;Array&gt;.includesAny()</code></a> method.
			</td>
		</tr>
	</tbody>
</table>

### `strings` object

The `strings` API object has been replaced by the `l10nStrings` object.  See the [Localization guide](#guide-localization) for more information.


<!-- ***************************************************************************
	Updating to any version ≥2.8.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.8.0 from a lesser version<!-- legacy --><span id="guide-upgrading-2.8.0"></span><!-- /legacy --> {#guide-code-updates-2.8.0}

All changes within this version are elective changes that you may address at your leisure.

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;click&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;click&gt;&gt;</code> macro has been deprecated in favor of the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code> macro</a>.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;playlist&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;playlist&gt;&gt;</code> macro has had its argument list changed, for compatibility with <code>&lt;&lt;createplaylist&gt;&gt;</code>.  See the <a href="#macros-macro-playlist"><code>&lt;&lt;playlist&gt;&gt;</code> macro</a> for more information.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;setplaylist&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;setplaylist&gt;&gt;</code> macro has been deprecated in favor of the <a href="#macros-macro-createplaylist"><code>&lt;&lt;createplaylist&gt;&gt;</code> macro</a>.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;stopallaudio&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;stopallaudio&gt;&gt;</code> macro has been deprecated in favor of <code>&lt;&lt;audio ":all" stop&gt;&gt;</code>.  See the <a href="#macros-macro-audio"><code>&lt;&lt;audio&gt;&gt;</code> macro</a> for more information.</td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.5.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.5.0 from a lesser version<!-- legacy --><span id="guide-upgrading-2.5.0"></span><!-- /legacy --> {#guide-code-updates-2.5.0}

All changes within this version are elective changes that you may address at your leisure.

### `config` API

The `config` API has been renamed `Config` for better consistency with the other APIs.

### `State` API

Several `State` API methods have moved to the new `Engine` API.  See the [`Engine` API](#engine-api) docs for more information.

<table>
	<thead>
		<tr>
			<th>Old <code>State</code> method</th>
			<th>New <code>Engine</code> method</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>State.backward()</code></td>
			<td><code>Engine.backward()</code></td>
		</tr>
		<tr>
			<td><code>State.display()</code></td>
			<td><code>Engine.display()</code><a href="#guide-code-updates-2.5.0-fn1">1</a></td>
		</tr>
		<tr>
			<td><code>State.forward()</code></td>
			<td><code>Engine.forward()</code></td>
		</tr>
		<tr>
			<td><code>State.play()</code></td>
			<td><code>Engine.play()</code></td>
		</tr>
		<tr>
			<td><code>State.restart()</code></td>
			<td><code>Engine.restart()</code></td>
		</tr>
		<tr>
			<td><code>State.show()</code></td>
			<td><code>Engine.show()</code></td>
		</tr>
	</tbody>
</table>

<ol class="note">
<li id="guide-code-updates-2.5.0-fn1">While the <code>Engine.display()</code> static methods exists, it, like <code>State.display()</code> before it, is deprecated.  See the <a href="#engine-api-method-play"><code>Engine.play()</code> static method</a> for the replacement.  <b>NOTE:</b> Their parameters differ, so read the description of <code>Engine.play()</code> carefully.</li>
</ol>

### `UI` API

Several `UI` API methods have moved to the new `Dialog` API.  See the [`Dialog` API](#dialog-api) docs for more information.

<table>
	<thead>
		<tr>
			<th>Old <code>UI</code> method</th>
			<th>New <code>Dialog</code> method</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>UI.addClickHandler()</code></td>
			<td><code>Dialog.addClickHandler()</code></td>
		</tr>
		<tr>
			<td><code>UI.body()</code></td>
			<td><code>Dialog.body()</code></td>
		</tr>
		<tr>
			<td><code>UI.close()</code></td>
			<td><code>Dialog.close()</code></td>
		</tr>
		<tr>
			<td><code>UI.isOpen()</code></td>
			<td><code>Dialog.isOpen()</code></td>
		</tr>
		<tr>
			<td><code>UI.open()</code></td>
			<td><code>Dialog.open()</code></td>
		</tr>
		<tr>
			<td><code>UI.setup()</code></td>
			<td><code>Dialog.setup()</code></td>
		</tr>
	</tbody>
</table>


<!-- ***************************************************************************
	Updating to any version ≥2.0.0 from a lesser version
**************************************************************************** -->
## Updating to any version ≥2.0.0 from a lesser version<!-- legacy --><span id="guide-upgrading-2.0.0"></span><!-- /legacy --> {#guide-code-updates-2.0.0}

<p role="note" class="warning"><b>Warning:</b>
All changes within this version are <strong>breaking changes</strong> that you <strong><em>must</em></strong> address immediately.
</p>

### HTML &amp; CSS

The HTML &amp; CSS have undergone ***significant*** changes.  See the [`HTML`](#html) and [`CSS`](#css) docs for more information.

### Special passages

<table>
	<thead>
		<tr>
			<th>Passage</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>MenuOptions</code></td>
			<td>The <code>MenuOptions</code> special passage has been removed.  See the <a href="#guide-code-updates-2.0.0-options">Options system section</a> for more information.</td>
		</tr>
		<tr>
			<td><code>MenuShare</code></td>
			<td>The <code>MenuShare</code> special passage has been removed.  See the <a href="#special-passage-storyshare"><code>StoryShare</code> special passage</a>.</td>
		</tr>
		<tr>
			<td><code>MenuStory</code></td>
			<td>The <code>MenuStory</code> special passage has been removed.  See the <a href="#special-passage-storymenu"><code>StoryMenu</code> special passage</a>.</td>
		</tr>
	</tbody>
</table>

### `config` object

The `config` object has been renamed to `Config` and some of its properties have also changed.  See the [`Config` API](#config-api) docs for more information.

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>config.altPassageDescription</code></td>
			<td>Changed the <code>config.altPassageDescription</code> property to <a href="#config-api-property-passages-descriptions"><code>Config.passages.descriptions</code></a>.</td>
		</tr>
		<tr>
			<td><code>config.disableHistoryControls</code></td>
			<td>Changed the <code>config.disableHistoryControls</code> property to <a href="#config-api-property-history-controls"><code>Config.history.controls</code></a>.  This change also inverted the meaning of the property, so take note of that.</td>
		</tr>
		<tr>
			<td><code>config.disableHistoryTracking</code></td>
			<td>Replaced the <code>config.disableHistoryTracking</code> property with <a href="#config-api-property-history-maxstates"><code>Config.history.maxStates</code></a>.  The new property works differently, so take note of that.</td>
		</tr>
		<tr>
			<td><code>config.displayPassageTitles</code></td>
			<td>Changed the <code>config.displayPassageTitles</code> property to <a href="#config-api-property-passages-displaytitles"><code>Config.passages.displayTitles</code></a>.</td>
		</tr>
		<tr>
			<td><code>config.historyMode</code></td>
			<td>Removed the <code>config.historyMode</code> property.  It's unnecessary since there's now only one history mode in the engine.</td>
		</tr>
		<tr>
			<td><code>config.macros.disableIfAssignmentError</code></td>
			<td>Changed the <code>config.macros.disableIfAssignmentError</code> property to <a href="#config-api-property-macros-ifassignmenterror"><code>Config.macros.ifAssignmentError</code></a>.  This change also inverted the meaning of the property, so take note of that.</td>
		</tr>
		<tr>
			<td><code>config.passageTransitionOut</code></td>
			<td>Changed the <code>config.passageTransitionOut</code> property to <a href="#config-api-property-passages-transitionout"><code>Config.passages.transitionOut</code></a>.  Additionally, it no longer accepts a boolean value, which has been replaced by the name of the animating property (necessitated by changes to browser handling of transition animations).</td>
		</tr>
		<tr>
			<td><code>config.startPassage</code></td>
			<td>Changed the <code>config.startPassage</code> property to <a href="#config-api-property-passages-start"><code>Config.passages.start</code></a>.</td>
		</tr>
		<tr>
			<td><code>config.updatePageElements</code></td>
			<td>Changed the <code>config.updatePageElements</code> property to <a href="#config-api-property-ui-updatestoryelements"><code>Config.ui.updateStoryElements</code></a>.</td>
		</tr>
	</tbody>
</table>

### History object &amp; prototype (instance: `state`)

The `History` API object has been renamed to `State` and some of its methods have also changed.  Furthermore, it is no longer instantiated into the legacy `state` object—which still exists, so legacy code will continue to work.  See the [`State` API](#state-api) docs for more information.

The `State.display()` method—formerly `state.display()`—is no longer overridable, meaning it cannot be wrapped—e.g., the "StoryRegions" 3rd-party add-ons do this.  See [Navigation Events or Tasks](#navigation-events-tasks).

Calling the [`State.prng.init()` method](#state-api-method-prng-init)—formerly `History.initPRNG()`—outside of story initialization will now throw an error.  It has always been required that the call happen during story initialization, the only change is the throwing of the error.

### Seedable pseudo-random number generator (PRNG)

`Math.random()` is no longer replaced by the integrated seedable PRNG when `State.prng.init()` is called.  See either the built-in functions [`random()`](#functions-function-random) &amp; [`randomFloat()`](#functions-function-randomfloat) or the [`State.random()` method](#state-api-method-random), if you need direct access to the PRNG—since it returns a call to either `Math.random()` or the seedable PRNG, as appropriate.

### Macro system

The `Macros` API object has been renamed to `Macro` and several of its methods have also changed, for better consistency with the other APIs.  Furthermore, it is no longer instantiated into the legacy `macros` object—which still exists, so SugarCube-compatible legacy macros will continue to work.  See the [`Macro` API](#macro-api) docs for more information.

### Macro library

<table>
	<thead>
		<tr>
			<th>Macro</th>
			<th>Change</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>&lt;&lt;back&gt;&gt;</code> &amp; <code>&lt;&lt;return&gt;&gt;</code></td>
			<td>Replaced the ungainly link text syntax—<code>&lt;&lt;back::linktext "…"&gt;&gt;</code>/<code>&lt;&lt;return::linktext "…"&gt;&gt;</code>—with <a href="#guide-localization"><code>l10nStrings</code> object</a> properties—<code>l10nStrings.macroBackText</code> and <code>l10nStrings.macroReturnText</code>.</td>
		</tr>
		<tr>
			<td><code>&lt;&lt;if&gt;&gt;</code> &amp; <code>&lt;&lt;elseif&gt;&gt;</code></td>
			<td>The <code>&lt;&lt;if&gt;&gt;</code> macro will now, optionally, return an error if the JavaScript <code>=</code> assignment operator is used (default: enabled).  Configured via the <a href="#config-api-property-macros-ifassignmenterror"><code>Config.macros.ifAssignmentError</code> config property</a>.</td>
		</tr>
		<tr>
			<td>Options macros</td>
			<td>The various Options macros have been removed.  See the <a href="#guide-code-updates-2.0.0-options">Options system section</a> for more information.</td>
		</tr>
	</tbody>
</table>

### <span id="guide-code-updates-2.0.0-options">Options system</span>

The entire Options system—`MenuOptions` special passage, `options` special variable, and associated macros—has been scrapped for numerous reasons—it was always a hack, required copious amounts of boilerplate code to be useful, etc.  It is replaced by the `Setting` API and `settings` special variable.  See the [`Setting` API](#setting-api) docs for more information.

### Save system

The `SaveSystem` API object has been renamed to `Save` and several of its methods have also changed, for better consistency with the other APIs.  See the [`Save` API](#save-api) docs for more information.

### UI system

The `UISystem` API object has been split into two APIs `Dialog` and `UI`, and some of its methods have also changed.  In particular, the parameter list for the [`Dialog.setup()` method](#dialog-api-method-setup) has changed.  See the [`Dialog` API](#dialog-api) and [`UI` API](#ui-api) docs for more information.
