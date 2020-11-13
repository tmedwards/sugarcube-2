<!-- ***********************************************************************************************
	Events
************************************************************************************************ -->
# Events {#events}

Events are messages that are sent (a.k.a.: fired, triggered) to notify code that something has taken place, from player interactions to automated happenings.  Each event is represented by an object that has properties that may be used to get additional information about what happened.

This section offers a list of SugarCube-specific events, triggered at various points during story operation.

<p role="note" class="see"><b>See Also:</b>
For standard browser/DOM events, see the <a href="https://developer.mozilla.org/en-US/docs/Web/Events"><i>Event reference</i> @MDN</a>.
</p>


<!-- ***************************************************************************
	`Dialog` Events
**************************************************************************** -->
## `Dialog` Events {#events-dialog}

`Dialog` events allow the execution of JavaScript code at specific points during the opening and closing of dialogs.

<p role="note" class="see"><b>See:</b>
<a href="#dialog-api"><code>Dialog</code> API</a>.
</p>

<!-- *********************************************************************** -->

### `:dialogclosed` event<!-- legacy --><span id="dialog-api-event-dialogclosed"></span><!-- /legacy --> {#events-dialog-event-dialogclosed}

Global event triggered as the last step in closing the dialog when [`Dialog.close()`](#dialog-api-method-close) is called.

<p role="note" class="warning"><b>Warning:</b>
You cannot obtain data about the closing dialog from the dialog itself—e.g., title or classes—when using the <code>:dialogclosed</code> event, as the dialog has already closed and been reset by the time the event is fired.  If you need that kind of information from the dialog itself, then you may use the <a href="#events-dialog-event-dialogclosing"><code>:dialogclosing</code> event</a> instead.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

<p role="note"><b>Note:</b>
While there are no custom properties, the event is fired from the dialog's body, thus the <code>target</code> property will refer to its body element—i.e., <code>#ui-dialog-body</code>.
</p>

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogclosed', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogclosed', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:dialogclosing` event<!-- legacy --><span id="dialog-api-event-dialogclosing"></span><!-- /legacy --> {#events-dialog-event-dialogclosing}

Global event triggered as the first step in closing the dialog when [`Dialog.close()`](#dialog-api-method-close) is called.

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

<p role="note"><b>Note:</b>
While there are no custom properties, the event is fired from the dialog's body, thus the <code>target</code> property will refer to its body element—i.e., <code>#ui-dialog-body</code>.
</p>

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogclosing', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogclosing', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:dialogopened` event<!-- legacy --><span id="dialog-api-event-dialogopened"></span><!-- /legacy --> {#events-dialog-event-dialogopened}

Global event triggered as the last step in opening the dialog when [`Dialog.open()`](#dialog-api-method-open) is called.

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

<p role="note"><b>Note:</b>
While there are no custom properties, the event is fired from the dialog's body, thus the <code>target</code> property will refer to its body element—i.e., <code>#ui-dialog-body</code>.
</p>

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogopened', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogopened', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:dialogopening` event<!-- legacy --><span id="dialog-api-event-dialogopening"></span><!-- /legacy --> {#events-dialog-event-dialogopening}

Global event triggered as the first step in opening the dialog when [`Dialog.open()`](#dialog-api-method-open) is called.

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

<p role="note"><b>Note:</b>
While there are no custom properties, the event is fired from the dialog's body, thus the <code>target</code> property will refer to its body element—i.e., <code>#ui-dialog-body</code>.
</p>

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':dialogopening', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':dialogopening', function (ev) {
	/* JavaScript code */
});
```


<!-- ***************************************************************************
	Navigation Events
**************************************************************************** -->
## Navigation Events<!-- legacy --><span id="navigation-events-tasks"></span><span id="navigation-overview"></span><span id="navigation-events"></span><span id="navigation-tasks"></span><!-- /legacy --> {#events-navigation}

Navigation events allow the execution of JavaScript code at specific points during passage navigation.

In order of processing: *(for reference, this also shows tasks and various special passages)*

1. Passage init.  Happens before the modification of the state history.
	1. `:passageinit` event.
	2. <span class="deprecated">`prehistory` tasks.</span> *(deprecated)*
2. Passage start. Happens before the rendering of the incoming passage.
	1. <span class="deprecated">`predisplay` tasks.</span> *(deprecated)*
	2. [`PassageReady` special passage](#special-passage-passageready).
	3. `:passagestart` event.
	4. <span class="deprecated">`prerender` tasks.</span> *(deprecated)*
	5. [`PassageHeader` special passage](#special-passage-passageheader).
3. Passage render.  Happens after the rendering of the incoming passage.
	1. [`PassageFooter` special passage](#special-passage-passagefooter).
	2. `:passagerender` event.
	3. <span class="deprecated">`postrender` tasks.</span> *(deprecated)*
4. Passage display.  Happens after the display—i.e., output—of the incoming passage.
	1. [`PassageDone` special passage](#special-passage-passagedone).
	2. `:passagedisplay` event.
	3. <span class="deprecated">`postdisplay` tasks.</span> *(deprecated)*
5. UI bar special passages update.  Happens before the end of passage navigation.
	1. [`StoryBanner` special passage](#special-passage-storybanner).
	2. [`StoryDisplayTitle` special passage](#special-passage-storydisplaytitle).
	3. [`StorySubtitle` special passage](#special-passage-storysubtitle).
	4. [`StoryAuthor` special passage](#special-passage-storyauthor).
	5. [`StoryCaption` special passage](#special-passage-storycaption).
	6. [`StoryMenu` special passage](#special-passage-storymenu).
6. Passage end.  Happens at the end of passage navigation.
	1. `:passageend` event.

<!-- *********************************************************************** -->

### `:passageinit` event<!-- legacy --><span id="navigation-event-passageinit"></span><!-- /legacy --> {#events-navigation-event-passageinit}

Triggered before the modification of the state history.

#### History:

* `v2.20.0`: Introduced.

#### Event object properties:

* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Examples:

```
/* Execute the handler function each time the event triggers. */
$(document).on(':passageinit', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':passageinit', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:passagestart` event<!-- legacy --><span id="navigation-event-passagestart"></span><!-- /legacy --> {#events-navigation-event-passagestart}

Triggered before the rendering of the incoming passage.

#### History:

* `v2.20.0`: Introduced.

#### Event object properties:

* **`content`:** (*`HTMLElement` object*) The, currently, empty element that will eventually hold the rendered content of the incoming passage.
* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Examples:

##### Basic usage

```
/* Execute the handler function each time the event triggers. */
$(document).on(':passagestart', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':passagestart', function (ev) {
	/* JavaScript code */
});
```

##### Modifying the content buffer

```
/*
	Process the markup "In the //beginning//." and append the result
	to the incoming passage's element.
*/
$(document).on(':passagestart', function (ev) {
	$(ev.content).wiki("In the //beginning//.");
});
```

<!-- *********************************************************************** -->

### `:passagerender` event<!-- legacy --><span id="navigation-event-passagerender"></span><!-- /legacy --> {#events-navigation-event-passagerender}

Triggered after the rendering of the incoming passage.

#### History:

* `v2.20.0`: Introduced.

#### Event object properties:

* **`content`:** (*`HTMLElement` object*) The element holding the fully rendered content of the incoming passage.
* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Examples:

##### Basic usage

```
/* Execute the handler function each time the event triggers. */
$(document).on(':passagerender', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':passagerender', function (ev) {
	/* JavaScript code */
});
```

##### Modifying the content buffer

```
/*
	Process the markup "At the //end// of some renderings." and append the result
	to the incoming passage's element.
*/
$(document).on(':passagerender', function (ev) {
	$(ev.content).wiki("At the //end// of some renderings.");
});
```

<!-- *********************************************************************** -->

### `:passagedisplay` event<!-- legacy --><span id="navigation-event-passagedisplay"></span><!-- /legacy --> {#events-navigation-event-passagedisplay}

Triggered after the display—i.e., output—of the incoming passage.

#### History:

* `v2.20.0`: Introduced.
* `v2.31.0`: Added `content` property to event object.

#### Event object properties:

* **`content`:** (*`HTMLElement` object*) The element holding the fully rendered content of the incoming passage.
* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Examples:

##### Basic usage

```
/* Execute the handler function each time the event triggers. */
$(document).on(':passagedisplay', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':passagedisplay', function (ev) {
	/* JavaScript code */
});
```

##### Modifying the content buffer

```
/*
	Process the markup "It's //showtime//!" and append the result
	to the incoming passage's element.
*/
$(document).on(':passagedisplay', function (ev) {
	$(ev.content).wiki("It's //showtime//!");
});
```

<!-- *********************************************************************** -->

### `:passageend` event<!-- legacy --><span id="navigation-event-passageend"></span><!-- /legacy --> {#events-navigation-event-passageend}

Triggered at the end of passage navigation.

#### History:

* `v2.20.0`: Introduced.
* `v2.31.0`: Added `content` property to event object.

#### Event object properties:

* **`content`:** (*`HTMLElement` object*) The element holding the fully rendered content of the incoming passage.
* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Examples:

##### Basic usage

```
/* Execute the handler function each time the event triggers. */
$(document).on(':passageend', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function exactly once. */
$(document).one(':passageend', function (ev) {
	/* JavaScript code */
});
```

##### Modifying the content buffer

```
/*
	Process the markup "So long and //thanks for all the fish//!" and append the result
	to the incoming passage's element.
*/
$(document).on(':passageend', function (ev) {
	$(ev.content).wiki("So long and //thanks for all the fish//!");
});
```

<!-- *********************************************************************** -->

### <span class="deprecated">`prehistory` tasks</span><!-- legacy --><span id="navigation-task-prehistory"></span><!-- /legacy --> {#events-navigation-task-prehistory}

<p role="note" class="warning"><b>Deprecated:</b>
<code>prehistory</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passageinit"><code>:passageinit</code> event</a> for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`predisplay` tasks</span><!-- legacy --><span id="navigation-task-predisplay"></span><!-- /legacy --> {#events-navigation-task-predisplay}

<p role="note" class="warning"><b>Deprecated:</b>
<code>predisplay</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagestart"><code>:passagestart</code> event</a> for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`prerender` tasks</span><!-- legacy --><span id="navigation-task-prerender"></span><!-- /legacy --> {#events-navigation-task-prerender}

<p role="note" class="warning"><b>Deprecated:</b>
<code>prerender</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagestart"><code>:passagestart</code> event</a> for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`postrender` tasks</span><!-- legacy --><span id="navigation-task-postrender"></span><!-- /legacy --> {#events-navigation-task-postrender}

<p role="note" class="warning"><b>Deprecated:</b>
<code>postrender</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagerender"><code>:passagerender</code> event</a> for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.31.0`: Deprecated.

<!-- *********************************************************************** -->

### <span class="deprecated">`postdisplay` tasks</span><!-- legacy --><span id="navigation-task-postdisplay"></span><!-- /legacy --> {#events-navigation-task-postdisplay}

<p role="note" class="warning"><b>Deprecated:</b>
<code>postdisplay</code> tasks have been deprecated and should no longer be used.  See the <a href="#events-navigation-event-passagedisplay"><code>:passagedisplay</code> event</a> for its replacement.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.31.0`: Deprecated.


<!-- ***************************************************************************
	`SimpleAudio` Events
**************************************************************************** -->
## `SimpleAudio` Events {#events-simpleaudio}

`SimpleAudio` events allow the execution of JavaScript code at specific points during audio playback.

<div role="note" class="see"><b>See:</b>
To add or remove event listeners to audio tracks managed by the <a href="#simpleaudio-api"><code>SimpleAudio</code> API</a> see:
<ul>
<li><a href="#audiotrack-api"><code>AudioTrack</code> API</a> methods: <a href="#audiotrack-api-prototype-method-off"><code>&lt;AudioTrack&gt;.off()</code></a>, <a href="#audiotrack-api-prototype-method-on"><code>&lt;AudioTrack&gt;.on()</code></a>, <a href="#audiotrack-api-prototype-method-one"><code>&lt;AudioTrack&gt;.one()</code></a>.</li>
<li><a href="#audiorunner-api"><code>AudioRunner</code> API</a> methods: <a href="#audiorunner-api-prototype-method-off"><code>&lt;AudioRunner&gt;.off()</code></a>, <a href="#audiorunner-api-prototype-method-on"><code>&lt;AudioRunner&gt;.on()</code></a>, <a href="#audiorunner-api-prototype-method-one"><code>&lt;AudioRunner&gt;.one()</code></a>.</li>
</ul>
</div>

<!-- *********************************************************************** -->

### `:faded` event<!-- legacy --><span id="audiotrack-api-event-faded"></span><!-- /legacy --> {#events-simpleaudio-event-faded}

Track event triggered when a fade completes normally.

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers for one track via <AudioTrack>. */
aTrack.on(':faded', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function when the event triggers for multiple tracks via <AudioRunner>. */
someTracks.on(':faded', function (ev) {
	/* do something */
});
```

<!-- *********************************************************************** -->

### `:fading` event<!-- legacy --><span id="audiotrack-api-event-fading"></span><!-- /legacy --> {#events-simpleaudio-event-fading}

Track event triggered when a fade starts.

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers for one track via <AudioTrack>. */
aTrack.on(':fading', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function when the event triggers for multiple tracks via <AudioRunner>. */
someTracks.on(':fading', function (ev) {
	/* do something */
});
```

<!-- *********************************************************************** -->

### `:stopped` event<!-- legacy --><span id="audiotrack-api-event-stopped"></span><!-- /legacy --> {#events-simpleaudio-event-stopped}

Track event triggered when playback is stopped after [`<AudioTrack>.stop()`](#audiotrack-api-prototype-method-stop) or [`<AudioRunner>.stop()`](#audiorunner-api-prototype-method-stop) is called—either manually or as part of another process.

<p role="note" class="see"><b>See Also:</b>
<a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event"><code>ended</code></a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event"><code>pause</code></a> for information on somewhat similar native events.
</p>

#### History:

* `v2.29.0`: Introduced.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers for one track via <AudioTrack>. */
aTrack.on(':stopped', function (ev) {
	/* JavaScript code */
});

/* Execute the handler function when the event triggers for multiple tracks via <AudioRunner>. */
someTracks.on(':stopped', function (ev) {
	/* do something */
});
```


<!-- ***************************************************************************
	System Events
**************************************************************************** -->
## System Events {#events-system}

System events allow the execution of JavaScript code at specific points during story startup and teardown.

<!-- *********************************************************************** -->

### `:storyready` event {#events-system-event-storyready}

Global event triggered once just before the dismissal of the loading screen at startup.

#### History:

* `v2.31.0`: Introduced.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function exactly once, since it's only fired once. */
$(document).one(':storyready', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:enginerestart` event<!-- legacy --><span id="engine-api-event-enginerestart"></span><!-- /legacy --> {#events-system-event-enginerestart}

Global event triggered once just before the page is reloaded when [`Engine.restart()`](#engine-api-method-restart) is called.

#### History:

* `v2.23.0`: Introduced.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).one(':enginerestart', function (ev) {
	/* JavaScript code */
});
```


<!-- ***************************************************************************
	`<<type>>` Events
**************************************************************************** -->
## `<<type>>` Events {#events-type-macro}

`<<type>>` macro events allow the execution of JavaScript code at specific points during typing.

<!-- *********************************************************************** -->

### `:typingcomplete` event {#events-type-macro-event-typingcomplete}

Global event triggered when all `<<type>>` macros within a passage have completed.

<p role="note"><b>Note:</b>
Injecting additional <code>&lt;&lt;type&gt;&gt;</code> macro invocations <em>after</em> a <code>:typingcomplete</code> event has been fired will cause another event to eventually be generated, since you're creating a new sequence of typing.
</p>

#### History:

* `v2.32.0`: Introduced.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':typingcomplete', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:typingstart` event {#events-type-macro-event-typingstart}

Local event triggered on the typing wrapper when the typing of a section starts.

#### History:

* `v2.32.0`: Introduced
* `v2.33.0`: Changed to a local event that bubbles up the DOM tree.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':typingstart', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

### `:typingstop` event {#events-type-macro-event-typingstop}

Local event triggered on the typing wrapper when the typing of a section stops.

#### History:

* `v2.32.0`: Introduced
* `v2.33.0`: Changed to a local event that bubbles up the DOM tree.

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).on(':typingstop', function (ev) {
	/* JavaScript code */
});
```
