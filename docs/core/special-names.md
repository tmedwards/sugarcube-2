<!-- ***********************************************************************************************
	Special Names
************************************************************************************************ -->
<h1 id="special-names">Special Names</h1>

Passage, tag, and variable names that have special meaning to SugarCube.

#### Notes

1. All special names listed herein are case sensitive, so their spelling and capitalization must be *exactly* as shown.
2. *Never* combine special passages with special tags.  By doing so, you will probably break things in subtle and hard to detect ways.


<!-- ***************************************************************************
	Special Passages
**************************************************************************** -->
<span id="special-passages"></span>
## Passage Names

<!-- *********************************************************************** -->

<span id="special-passage-passagedone"></span>
### `PassageDone`

Used for post-passage-display tasks, like redoing dynamic changes (happens after the rendering and display of each passage).  Roughly equivalent to the [`:passagedisplay` event](#navigation-event-passagedisplay).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-passagefooter"></span>
### `PassageFooter`

Appended to each rendered passage.  Roughly equivalent to the [`:passagerender` event](#navigation-event-passagerender).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-passageheader"></span>
### `PassageHeader`

Prepended to each rendered passage.  Roughly equivalent to the [`:passagestart` event](#navigation-event-passagestart).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-passageready"></span>
### `PassageReady`

Used for pre-passage-display tasks, like redoing dynamic changes (happens before the rendering of each passage).  Roughly equivalent to the [`:passagestart` event](#navigation-event-passagestart).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-start"></span>
### `Start`

**Twine&nbsp;2:**  *Not special.*  Any passage may be chosen as the starting passage by selecting it via the *Start Story Here* passage context-menu item—n.b. older versions of Twine&nbsp;2 used a <i class="fa fa-rocket"></i> (rocket ship icon) for the same purpose.

**Twine&nbsp;1/Twee:**  *Required.*  The starting passage, the first passage displayed.  Configurable, see [`Config.passages.start`](#config-api-property-passages-start) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storyauthor"></span>
### `StoryAuthor`

Used to populate the authorial byline area in the UI bar (element ID: `story-author`).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storybanner"></span>
### `StoryBanner`

Used to populate the story's banner area in the UI bar (element ID: `story-banner`).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storycaption"></span>
### `StoryCaption`

Used to populate the story's caption area in the UI bar (element ID: `story-caption`).  May also be, and often is, used to add additional story UI elements and content to the UI bar.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storyinit"></span>
### `StoryInit`

Used for pre-story-start initialization tasks, like variable initialization (happens at the beginning of story initialization).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storyinterface"></span>
### `StoryInterface`

Used to replace SugarCube's default UI.  Its contents are treated as raw HTML markup—i.e., *none* of SugarCube's special HTML processing is performed.  It must contain, at least, an element with the ID `passages`, which will be the main passage display area.  Elements, aside from the `#passages` element, may include a `data-passage` content attribute, which denotes that the element should be updated via the specified passage—the passage will be processed as normal, meaning that markup and macros will work as expected.

**NOTE:** Elements that include a `data-passage` content attribute must not themselves contain additional elements—since such elements' contents are replaced each turn via their associated passage, any child elements would be lost.

#### Since:

* `v2.18.0`: Basic syntax.
* `v2.28.0`: Added processing of the `data-passage` content attribute.

#### Example:

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

<span id="special-passage-storymenu"></span>
### `StoryMenu`

Used to populate the story's menu items in the UI bar (element ID: `menu-story`).

**NOTE:** The story menu only displays links—specifically, anything that creates an anchor element (`<a>`).  While it renders content just as any other passage does, instead of displaying the rendered output as-is, it sifts through the output and builds its menu from the generated links contained therein.

#### Since:

* `v2.0.0`

#### Example:

```
[[Inventory]]
<<link "Schedule">>…<</link>>
```

<!-- *********************************************************************** -->

<span id="special-passage-storysettings"></span>
### `StorySettings`<i class="fa fa-fw fa-ban fa-margin-left warn"></i>

***Unused by SugarCube.***  The [Configuration API](#config-api) serves the same basic purpose.

<!-- *********************************************************************** -->

<span id="special-passage-storyshare"></span>
### `StoryShare`

Used to populate the contents of the Share dialog.  Intended for social media links.

**NOTE:** The Share dialog only displays links—specifically, anything that creates an anchor element (`<a>`).  While it renders content just as any other passage does, instead of displaying the rendered output as-is, it sifts through the output and builds its menu from the generated links contained therein.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storysubtitle"></span>
### `StorySubtitle`

Sets the story's subtitle in the UI bar (element ID: `story-subtitle`).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-passage-storytitle"></span>
### `StoryTitle`

**Twine&nbsp;2:**  *Unused.*  The story's title/name is part of the story project.

**Twine&nbsp;1/Twee:**  *Required.*  Sets the story's title in the UI bar and elsewhere (element ID: `story-title`).  **NOTE:** The story title should the project's plain text title and contain no markup.

#### Since:

* `v2.0.0`


<!-- ***************************************************************************
	Special Tags
**************************************************************************** -->
<span id="special-tags"></span>
## Tag Names

<!-- *********************************************************************** -->

<span id="special-tag-bookmark"></span>
### `bookmark`

Registers the passage into the *Jump To* menu.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-tag-nobr"></span>
### `nobr`

Causes leading/trailing newlines to be removed and all remaining sequences of newlines to be replaced with single spaces before the passage is rendered.  Equivalent to wrapping the entire passage in a [`<<nobr>>` macro](#macros-macro-nobr).  See the [`Config.passages.nobr` setting](#config-api-property-passages-nobr) for a way to apply the same processing to all passages at once.

<p role="note"><b>Note:</b>
Does not affect <code>script</code> or <code>stylesheet</code> tagged passages, for Twine&nbsp;1/Twee.
</p>

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-tag-script"></span>
### `script`

**Twine&nbsp;2:**  *Not special.*  Use the *Edit Story JavaScript* story editor menu item for scripts.

**Twine&nbsp;1/Twee:**  Registers the passage as JavaScript code, which is executed during startup.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-tag-stylesheet"></span>
### `stylesheet`

**Twine&nbsp;2:**  *Not special.*  Use the *Edit Story Stylesheet* story editor menu item for styles.

**Twine&nbsp;1/Twee:**  Registers the passage as a CSS stylesheet, which is loaded during startup.  It is ***strongly*** recommended that you use only one stylesheet passage.  Additionally, see the [tagged stylesheet warning](#css-warnings).

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-tag-twine-audio"></span>
### `Twine.audio`

Registers the passage as an audio passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.24.0`

<!-- *********************************************************************** -->

<span id="special-tag-twine-image"></span>
### `Twine.image`

Registers the passage as an image passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-tag-twine-video"></span>
### `Twine.video`

Registers the passage as a video passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.24.0`

<!-- *********************************************************************** -->

<span id="special-tag-twine-vtt"></span>
### `Twine.vtt`

Registers the passage as a <abbr title="Video Text Track">VTT</abbr> passage.  See [Guide: Media Passages](#guide-media-passages) for more information.

#### Since:

* `v2.24.0`

<!-- *********************************************************************** -->

<span id="special-tag-widget"></span>
### `widget`

Registers the passage as [`<<widget>>` macro](#macros-macro-widget) definitions, which are loaded during startup.

#### Since:

* `v2.0.0`


<!-- ***************************************************************************
	Special Variables
**************************************************************************** -->
<span id="special-variables"></span>
## Variable Names

<!-- *********************************************************************** -->

<span id="special-variable-dollar"></span>
### `$`

Alias for `jQuery`, by default.  **NOTE:** This should not be confused with [story variables](#twinescript-variables), which start with a `$`—e.g., `$foo`.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-dollar-args"></span>
### `$args`

Widget arguments array (only inside widgets).  See [`<<widget>>`](#macros-macro-widget) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-config"></span>
### `Config`

Configuration API.  See [`Config` API](#config-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-dialog"></span>
### `Dialog`

Dialog API.  See [`Dialog` API](#dialog-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-engine"></span>
### `Engine`

Engine API.  See [`Engine` API](#engine-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-jquery"></span>
### `jQuery`

jQuery library function.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-l10nstrings"></span>
### `l10nStrings`

Strings localization object.  See [Localization](#guide-localization) for more information.

#### Since:

* `v2.10.0`

<!-- *********************************************************************** -->

<span id="special-variable-loadscreen"></span>
### `LoadScreen`

LoadScreen API.  See [`LoadScreen` API](#loadscreen-api) for more information.

#### Since:

* `v2.15.0`

<!-- *********************************************************************** -->

<span id="special-variable-macro"></span>
### `Macro`

Macro API.  See [`Macro` API](#macro-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-passage"></span>
### `Passage`

Passage API.  See [`Passage` API](#passage-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-postdisplay"></span>
### `postdisplay`

Post-display task callback object, set up by the author/developer.  See [navigation tasks](#navigation-tasks) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-postrender"></span>
### `postrender`

Post-render task callback object, set up by the author/developer.  See [navigation tasks](#navigation-tasks) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-predisplay"></span>
### `predisplay`

Pre-display task callback object, set up by the author/developer.  See [navigation tasks](#navigation-tasks) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-prehistory"></span>
### `prehistory`

Pre-history task callback object, set up by the author/developer.  See [navigation tasks](#navigation-tasks) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-prerender"></span>
### `prerender`

Pre-render task callback object, set up by the author/developer.  See [navigation tasks](#navigation-tasks) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-save"></span>
### `Save`

Save API.  See [`Save` API](#save-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-setting"></span>
### `Setting`

Setting API.  See [`Setting` API](#setting-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-settings"></span>
### `settings`

Player settings object, set up by the author/developer.  See [`Setting` API](#setting-api) for more information.

#### Since:

* `v2.0.0`
<!-- *********************************************************************** -->


<span id="special-variable-setup"></span>
### `setup`

Object that authors/developers may use to set up various bits of static data.  Generally, you would use this for data that does not change and should not be stored within story variables, which would make it part of the history.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-state"></span>
### `State`

State API.  See [`State` API](#state-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-story"></span>
### `Story`

Story API.  See [`Story` API](#story-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-ui"></span>
### `UI`

UI API.  See [`UI` API](#ui-api) for more information.

#### Since:

* `v2.0.0`

<!-- *********************************************************************** -->

<span id="special-variable-uibar"></span>
### `UIBar`

UIBar API.  See [`UIBar` API](#uibar-api) for more information.

#### Since:

* `v2.17.0`
