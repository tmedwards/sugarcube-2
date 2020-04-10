<!-- ***********************************************************************************************
	Special Names
************************************************************************************************ -->
# Special Names {#special-names}

Passage, tag, and variable names that have special meaning to SugarCube.

#### Warning {#special-names-warning}

1. All special names listed herein are case sensitive, so their spelling and capitalization must be ***exactly*** as shown.
2. ***Never*** combine special passages with special tags.  By doing so, you will probably break things in subtle and hard to detect ways.


<!-- ***************************************************************************
	Special Passages
**************************************************************************** -->
## Passage Names {#special-passages}

<!-- *********************************************************************** -->

### `PassageDone` {#special-passage-passagedone}

Used for post-passage-display tasks, like redoing dynamic changes (happens after the rendering and display of each passage).  Roughly equivalent to the [`:passagedisplay` event](#events-navigation-event-passagedisplay).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `PassageFooter` {#special-passage-passagefooter}

Appended to each rendered passage.  Roughly equivalent to the [`:passagerender` event](#events-navigation-event-passagerender).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `PassageHeader` {#special-passage-passageheader}

Prepended to each rendered passage.  Roughly equivalent to the [`:passagestart` event](#events-navigation-event-passagestart).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `PassageReady` {#special-passage-passageready}

Used for pre-passage-display tasks, like redoing dynamic changes (happens before the rendering of each passage).  Roughly equivalent to the [`:passagestart` event](#events-navigation-event-passagestart).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Start` {#special-passage-start}

**Twine&nbsp;2:**  *Not special.*  Any passage may be chosen as the starting passage by selecting it via the *Start Story Here* passage context-menu item—n.b. older versions of Twine&nbsp;2 used a <i class="icon rocket" title="rocket ship" aria-label="rocket ship"></i> icon for the same purpose.

**Twine&nbsp;1/Twee:**  *Required.*  The starting passage, the first passage displayed.  Configurable, see [`Config.passages.start`](#config-api-property-passages-start) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StoryAuthor` {#special-passage-storyauthor}

Used to populate the authorial byline area in the UI bar (element ID: `story-author`).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StoryBanner` {#special-passage-storybanner}

Used to populate the story's banner area in the UI bar (element ID: `story-banner`).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StoryCaption` {#special-passage-storycaption}

Used to populate the story's caption area in the UI bar (element ID: `story-caption`).  May also be, and often is, used to add additional story UI elements and content to the UI bar.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StoryDisplayTitle` {#special-passage-storydisplaytitle}

Sets the story's display title in the browser's titlebar and the UI bar (element ID: `story-title`).  If omitted, the story title will be used instead.

#### Since:

* `v2.31.0`

<!-- *********************************************************************** -->

### `StoryInit` {#special-passage-storyinit}

Used for pre-story-start initialization tasks, like variable initialization (happens at the beginning of story initialization).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StoryInterface` {#special-passage-storyinterface}

Used to replace SugarCube's default UI.  Its contents are treated as raw HTML markup—i.e., *none* of SugarCube's special HTML processing is performed.  It must contain, at least, an element with the ID `passages`, which will be the main passage display area.  Elements, aside from the `#passages` element, may include a `data-passage` content attribute, which denotes that the element should be updated via the specified passage—the passage will be processed as normal, meaning that markup and macros will work as expected.

<p role="note" class="warning"><b>Warning:</b>
Elements that include a <code>data-passage</code> content attribute <em>should not</em> themselves contain additional elements—since such elements' contents are replaced each turn via their associated passage, any child elements would be lost.
</p>

#### Since:

* `v2.18.0`: Basic syntax.
* `v2.28.0`: Added processing of the `data-passage` content attribute.

#### Examples:

##### Minimal working example

```
<div id="passages"></div>
```

##### With `data-passage` content attributes

```
<div id="interface">
	<div id="menu" data-passage="Menu"></div>
	<div id="notifications" data-passage="Notifications"></div>
	<div id="passages"></div>
</div>
```

<!-- *********************************************************************** -->

### `StoryMenu` {#special-passage-storymenu}

Used to populate the story's menu items in the UI bar (element ID: `menu-story`).

<p role="note"><b>Note:</b>
The story menu only displays links—specifically, anything that creates an anchor element (<code>&lt;a&gt;</code>).  While it renders content just as any other passage does, instead of displaying the rendered output as-is, it sifts through the output and builds its menu from the generated links contained therein.
</p>

#### Since:

* `v2.0.0`

#### Examples:

```
[[Inventory]]
<<link "Schedule">>…<</link>>
```

<!-- *********************************************************************** -->

### `StorySettings` {#special-passage-storysettings}

<p role="note" class="warning"><b>Warning:</b>
Unused by SugarCube.  The <a href="#config-api"><code>Config</code> API</a> serves the same basic purpose.
</p>

<!-- *********************************************************************** -->

### `StoryShare` {#special-passage-storyshare}

Used to populate the contents of the Share dialog.  Intended for social media links.

<p role="note"><b>Note:</b>
The Share dialog only displays links—specifically, anything that creates an anchor element (<code>&lt;a&gt;</code>).  While it renders content just as any other passage does, instead of displaying the rendered output as-is, it sifts through the output and builds its contents from the generated links contained therein.
</p>

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StorySubtitle` {#special-passage-storysubtitle}

Sets the story's subtitle in the UI bar (element ID: `story-subtitle`).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `StoryTitle` {#special-passage-storytitle}

<p role="note" class="warning"><b>Warning:</b>
The story title is used to create the storage ID that is used to store all player data, both temporary and persistent.  It should be plain text, containing no code, markup, or macros of any kind.
</p>

<p role="note" class="tip"><b>Tip:</b>
If you want to set a title for display that contains code, markup, or macros, see the <a href="#special-passage-storydisplaytitle"><code>StoryDisplayTitle</code> special passage</a>.
</p>

**Twine&nbsp;2:**  *Unused.*  The story's title is part of the story project.

**Twine&nbsp;1/Twee:**  *Required.*  Sets the story's title.

#### Since:

* `v2.0.0`


<!-- ***************************************************************************
	Special Tags
**************************************************************************** -->
## Tag Names {#special-tags}

<!-- *********************************************************************** -->

### `bookmark` {#special-tag-bookmark}

Registers the passage into the *Jump To* menu.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `nobr` {#special-tag-nobr}

Causes leading/trailing newlines to be removed and all remaining sequences of newlines to be replaced with single spaces before the passage is rendered.  Equivalent to wrapping the entire passage in a [`<<nobr>>` macro](#macros-macro-nobr).  See the [`Config.passages.nobr` setting](#config-api-property-passages-nobr) for a way to apply the same processing to all passages at once.

<p role="note"><b>Note:</b>
Does not affect <code>script</code> or <code>stylesheet</code> tagged passages, for Twine&nbsp;1/Twee.
</p>

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `script` {#special-tag-script}

**Twine&nbsp;2:**  *Not special.*  Use the *Edit Story JavaScript* story editor menu item for scripts.

**Twine&nbsp;1/Twee:**  Registers the passage as JavaScript code, which is executed during startup.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `stylesheet` {#special-tag-stylesheet}

**Twine&nbsp;2:**  *Not special.*  Use the *Edit Story Stylesheet* story editor menu item for styles.

**Twine&nbsp;1/Twee:**  Registers the passage as a CSS stylesheet, which is loaded during startup.  It is ***strongly*** recommended that you use only one stylesheet passage.  Additionally, see the [tagged stylesheet warning](#css-warnings).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Twine.audio` {#special-tag-twine-audio}

Registers the passage as an audio passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.24.0`

<!-- *********************************************************************** -->

### `Twine.image` {#special-tag-twine-image}

Registers the passage as an image passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Twine.video` {#special-tag-twine-video}

Registers the passage as a video passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.24.0`

<!-- *********************************************************************** -->

### `Twine.vtt` {#special-tag-twine-vtt}

Registers the passage as a <abbr title="Video Text Track">VTT</abbr> passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.24.0`

<!-- *********************************************************************** -->

### `widget` {#special-tag-widget}

Registers the passage as [`<<widget>>` macro](#macros-macro-widget) definitions, which are loaded during startup.

#### Since:

* `v2.0.0`


<!-- ***************************************************************************
	Special Variables
**************************************************************************** -->
## Variable Names {#special-variables}

<!-- *********************************************************************** -->

### `$` {#special-variable-dollar}

Alias for `jQuery`, by default.  **NOTE:** This should not be confused with [story variables](#twinescript-variables), which start with a `$`—e.g., `$foo`.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `$args` {#special-variable-dollar-args}

Widget arguments array (only inside widgets).  See [`<<widget>>`](#macros-macro-widget) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Config` {#special-variable-config}

Configuration API.  See [`Config` API](#config-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Dialog` {#special-variable-dialog}

Dialog API.  See [`Dialog` API](#dialog-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Engine` {#special-variable-engine}

Engine API.  See [`Engine` API](#engine-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Fullscreen` {#special-variable-fullscreen}

Fullscreen API.  See [`Fullscreen` API](#fullscreen-api) for more information.

#### Since:

* `v2.31.0`

<!-- *********************************************************************** -->

### `jQuery` {#special-variable-jquery}

jQuery library function.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `l10nStrings` {#special-variable-l10nstrings}

Strings localization object.  See [Localization](#guide-localization) for more information.

#### Since:

* `v2.10.0`

<!-- *********************************************************************** -->

### `LoadScreen` {#special-variable-loadscreen}

LoadScreen API.  See [`LoadScreen` API](#loadscreen-api) for more information.

#### Since:

* `v2.15.0`

<!-- *********************************************************************** -->

### `Macro` {#special-variable-macro}

Macro API.  See [`Macro` API](#macro-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Passage` {#special-variable-passage}

Passage API.  See [`Passage` API](#passage-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Save` {#special-variable-save}

Save API.  See [`Save` API](#save-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Setting` {#special-variable-setting}

Setting API.  See [`Setting` API](#setting-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `settings` {#special-variable-settings}

Player settings object, set up by the author/developer.  See [`Setting` API](#setting-api) for more information.

#### Since:

* `v2.0.0`
<!-- *********************************************************************** -->

### `setup` {#special-variable-setup}

Object that authors/developers may use to set up various bits of static data.  Generally, you would use this for data that does not change and should not be stored within story variables, which would make it part of the history.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `SimpleAudio` {#special-variable-simpleaudio}

SimpleAudio API.  See [`SimpleAudio` API](#simpleaudio-api) for more information.

#### Since:

* `v2.28.0`

<!-- *********************************************************************** -->

### `State` {#special-variable-state}

State API.  See [`State` API](#state-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Story` {#special-variable-story}

Story API.  See [`Story` API](#story-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `Template` {#special-variable-template}

Template API.  See [`Template` API](#template-api) for more information.

#### Since:

* `v2.29.0`

<!-- *********************************************************************** -->

### `UI` {#special-variable-ui}

UI API.  See [`UI` API](#ui-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

### `UIBar` {#special-variable-uibar}

UIBar API.  See [`UIBar` API](#uibar-api) for more information.

#### Since:

* `v2.17.0`

<!-- *********************************************************************** -->

### <span class="deprecated">`postdisplay`</span> {#special-variable-postdisplay}

<p role="note" class="warning"><b>Deprecated:</b>
<code>postdisplay</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagedisplay"><code>:passagedisplay</code> event</a> for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic support.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`postrender`</span> {#special-variable-postrender}

<p role="note" class="warning"><b>Deprecated:</b>
<code>postrender</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagerender"><code>:passagerender</code> event</a> for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic support.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`predisplay`</span> {#special-variable-predisplay}

<p role="note" class="warning"><b>Deprecated:</b>
<code>predisplay</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagestart"><code>:passagestart</code> event</a> for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic support.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`prehistory`</span> {#special-variable-prehistory}

<p role="note" class="warning"><b>Deprecated:</b>
<code>prehistory</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passageinit"><code>:passageinit</code> event</a> for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic support.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`prerender`</span> {#special-variable-prerender}

<p role="note" class="warning"><b>Deprecated:</b>
<code>prerender</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagestart"><code>:passagestart</code> event</a> for its replacement.
</p>

#### Since:

* `v2.0.0`: Basic support.
* `v2.31.0`: Deprecated.
