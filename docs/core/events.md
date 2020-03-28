<!-- ***********************************************************************************************
	Events & Tasks
************************************************************************************************ -->
<h1 id="events">Events &amp; Tasks</h1>

Events are messages that are sent (a.k.a.: fired, triggered) to notify code that something has taken place, from player interactions to automated happenings.  Each event is represented by an object that has properties that may be used to get additional information about what happened.

This section offers a list of SugarCube-specific events, triggered at various points during story operation.

<p role="note" class="see"><b>See Also:</b>
For standard browser/DOM events, see the <a href="https://developer.mozilla.org/en-US/docs/Web/Events"><i>Event reference</i> @MDN</a>.
</p>


<!-- ***************************************************************************
	`Dialog` Events
**************************************************************************** -->
<span id="events-dialog"></span>
## `Dialog` Events

`Dialog` events allow the execution of JavaScript code at specific points during the opening and closing of dialogs.

<p role="note" class="see"><b>See:</b>
<a href="#dialog-api"><code>Dialog</code> API</a>.
</p>

<!-- *********************************************************************** -->

<span id="events-dialog-event-dialogclosed"></span><span id="dialog-api-event-dialogclosed"></span>
### `:dialogclosed` event

Global event triggered as the last step in closing the dialog when [`Dialog.close()`](#dialog-api-method-close) is called.

<p role="note" class="warning"><b>Warning:</b>
You cannot obtain data about the closing dialog from the dialog itself—e.g., title or classes—when using the <code>:dialogclosed</code> event, as the dialog has already closed and been reset by the time the event is fired.  If you need that kind of information from the dialog itself, then you may use the <a href="#dialog-api-event-dialogclosing"><code>:dialogclosing</code> event</a> instead.
</p>

#### Since:

* `v2.29.0`

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

<span id="events-dialog-event-dialogclosing"></span><span id="dialog-api-event-dialogclosing"></span>
### `:dialogclosing` event

Global event triggered as the first step in closing the dialog when [`Dialog.close()`](#dialog-api-method-close) is called.

#### Since:

* `v2.29.0`

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

<span id="events-dialog-event-dialogopened"></span><span id="dialog-api-event-dialogopened"></span>
### `:dialogopened` event

Global event triggered as the last step in opening the dialog when [`Dialog.open()`](#dialog-api-method-open) is called.

#### Since:

* `v2.29.0`

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

<span id="events-dialog-event-dialogopening"></span><span id="dialog-api-event-dialogopening"></span>
### `:dialogopening` event

Global event triggered as the first step in opening the dialog when [`Dialog.open()`](#dialog-api-method-open) is called.

#### Since:

* `v2.29.0`

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
	Navigation Events & Tasks
**************************************************************************** -->
<span id="events-navigation"></span><span id="navigation-events-tasks"></span><span id="navigation-overview"></span><span id="navigation-events"></span><span id="navigation-tasks"></span>

## Navigation Events &amp; Tasks

Navigation events, and tasks, allow the execution of JavaScript code at specific points during passage navigation.

In order of processing: *(for reference, this also shows tasks and various special passages)*

1. Passage init.  Happens before the modification of the state history.
	1. `:passageinit` event.
	2. `prehistory` tasks.
2. Passage start. Happens before the rendering of the incoming passage.
	1. `predisplay` tasks.
	2. [`PassageReady` special passage](#special-passage-passageready).
	3. `:passagestart` event.
	4. `prerender` tasks.
	5. [`PassageHeader` special passage](#special-passage-passageheader).
3. Passage render.  Happens after the rendering of the incoming passage.
	1. [`PassageFooter` special passage](#special-passage-passagefooter).
	2. `:passagerender` event.
	3. `postrender` tasks.
4. Passage display.  Happens after the display—i.e., output—of the incoming passage.
	1. [`PassageDone` special passage](#special-passage-passagedone).
	2. `:passagedisplay` event.
	3. `postdisplay` tasks.
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

<span id="events-navigation-event-passageinit"></span><span id="navigation-event-passageinit"></span>
### `:passageinit` event

Triggered before the modification of the state history.

#### Since:

* `v2.20.0`

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

<span id="events-navigation-event-passagestart"></span><span id="navigation-event-passagestart"></span>
### `:passagestart` event

Triggered before the rendering of the incoming passage.

#### Since:

* `v2.20.0`

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

<span id="events-navigation-event-passagerender"></span><span id="navigation-event-passagerender"></span>
### `:passagerender` event

Triggered after the rendering of the incoming passage.

#### Since:

* `v2.20.0`

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

<span id="events-navigation-event-passagedisplay"></span><span id="navigation-event-passagedisplay"></span>
### `:passagedisplay` event

Triggered after the display—i.e., output—of the incoming passage.

#### Since:

* `v2.20.0`: Basic syntax.
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

<span id="events-navigation-event-passageend"></span><span id="navigation-event-passageend"></span>
### `:passageend` event

Triggered at the end of passage navigation.

#### Since:

* `v2.20.0`: Basic syntax.
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

<span id="events-navigation-task-prehistory"></span><span id="navigation-task-prehistory"></span>
### `prehistory` tasks

Executed before the modification of the state history.

<p role="note"><b>Note:</b>
Tasks are an older method of enabling passage navigation events and you are encouraged to use <a href="#events-navigation">Navigation Events</a> instead as they allow for easier control and are triggered at better points during navigation.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`taskName`:** (*string*) The name of the executing task.

#### Examples:

```
prehistory["Some Task Name"] = function (taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="events-navigation-task-predisplay"></span><span id="navigation-task-predisplay"></span>
### `predisplay` tasks

Executed before the rendering of the incoming passage.

<p role="note"><b>Note:</b>
Tasks are an older method of enabling passage navigation events and you are encouraged to use <a href="#events-navigation">Navigation Events</a> instead as they allow for easier control and are triggered at better points during navigation.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`taskName`:** (*string*) The name of the executing task.

#### Examples:

```
predisplay["Some Task Name"] = function (taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="events-navigation-task-prerender"></span><span id="navigation-task-prerender"></span>
### `prerender` tasks

Executed before the rendering of the incoming passage.

<p role="note"><b>Note:</b>
Tasks are an older method of enabling passage navigation events and you are encouraged to use <a href="#events-navigation">Navigation Events</a> instead as they allow for easier control and are triggered at better points during navigation.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`content`:** (*`HTMLElement` object*) The, likely, empty element that will eventually hold the rendered content of the incoming passage.
* **`taskName`:** (*string*) The name of the executing task.

#### Examples:

```
prerender["Some Task Name"] = function (content, taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="events-navigation-task-postrender"></span><span id="navigation-task-postrender"></span>
### `postrender` tasks

Executed after the rendering of the incoming passage.

<p role="note"><b>Note:</b>
Tasks are an older method of enabling passage navigation events and you are encouraged to use <a href="#events-navigation">Navigation Events</a> instead as they allow for easier control and are triggered at better points during navigation.
</p>

#### Since:

* `v2.0.0`

#### Parameters:

* **`content`:** (*`HTMLElement` object*) The element holding the fully rendered content of the incoming passage.
* **`taskName`:** (*string*) The name of the executing task.

#### Examples:

```
postrender["Some Task Name"] = function (content, taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="events-navigation-task-postdisplay"></span><span id="navigation-task-postdisplay"></span>
### `postdisplay` tasks

Executed after the display—i.e., output—of the incoming passage.

#### Since:

* `v2.0.0`

#### Parameters:

* **`taskName`:** (*string*) The name of the executing task.

#### Examples:

```
postdisplay["Some Task Name"] = function (taskName) {
	/* JavaScript code */
};
```


<!-- ***************************************************************************
	`SimpleAudio` Events
**************************************************************************** -->
<span id="events-simpleaudio"></span>
## `SimpleAudio` Events

`SimpleAudio` events allow the execution of JavaScript code at specific points during audio playback.

<div role="note" class="see"><b>See:</b>
To add or remove event listeners to audio tracks managed by the <a href="#simpleaudio-api"><code>SimpleAudio</code> API</a> see:
<ul>
<li><a href="#audiotrack-api"><code>AudioTrack</code> API</a> methods: <a href="#audiotrack-api-prototype-method-off"><code>&lt;AudioTrack&gt;.off()</code></a>, <a href="#audiotrack-api-prototype-method-on"><code>&lt;AudioTrack&gt;.on()</code></a>, <a href="#audiotrack-api-prototype-method-one"><code>&lt;AudioTrack&gt;.one()</code></a>.</li>
<li><a href="#audiorunner-api"><code>AudioRunner</code> API</a> methods: <a href="#audiorunner-api-prototype-method-off"><code>&lt;AudioRunner&gt;.off()</code></a>, <a href="#audiorunner-api-prototype-method-on"><code>&lt;AudioRunner&gt;.on()</code></a>, <a href="#audiorunner-api-prototype-method-one"><code>&lt;AudioRunner&gt;.one()</code></a>.</li>
</ul>
</div>

<!-- *********************************************************************** -->

<span id="events-simpleaudio-event-faded"></span><span id="audiotrack-api-event-faded"></span>
### `:faded` event

Track event triggered when a fade completes normally.

#### Since:

* `v2.29.0`

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

<span id="events-simpleaudio-event-fading"></span><span id="audiotrack-api-event-fading"></span>
### `:fading` event

Track event triggered when a fade starts.

#### Since:

* `v2.29.0`

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

<span id="events-simpleaudio-event-stopped"></span><span id="audiotrack-api-event-stopped"></span>
### `:stopped` event

Track event triggered when playback is stopped after [`<AudioTrack>.stop()`](#audiotrack-api-prototype-method-stop) or [`<AudioRunner>.stop()`](#audiorunner-api-prototype-method-stop) is called—either manually or as part of another process.

<p role="note" class="see"><b>See Also:</b>
<a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event"><code>ended</code></a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event"><code>pause</code></a> for information on somewhat similar native events.
</p>

#### Since:

* `v2.29.0`

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
<span id="events-system"></span>
## System Events

System events allow the execution of JavaScript code at specific points during story startup and teardown.

<!-- *********************************************************************** -->

<span id="events-system-event-storyready"></span>
### `:storyready` event

Global event triggered once just before the dismissal of the loading screen at startup.

#### Since:

* `v2.31.0`

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function exactly once, since it's only fired once. */
$(document).one(':storyready', function (ev) {
	/* JavaScript code */
});
```

<!-- *********************************************************************** -->

<span id="events-system-event-enginerestart"></span><span id="engine-api-event-enginerestart"></span>
### `:enginerestart` event

Global event triggered once just before the page is reloaded when [`Engine.restart()`](#engine-api-method-restart) is called.

#### Since:

* `v2.23.0`

#### Event object properties: *none*

#### Examples:

```
/* Execute the handler function when the event triggers. */
$(document).one(':enginerestart', function (ev) {
	/* JavaScript code */
});
```
