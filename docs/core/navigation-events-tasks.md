<!-- ***********************************************************************************************
	Navigation Events & Tasks
************************************************************************************************ -->
<h1 id="navigation-events-tasks">Navigation Events &amp; Tasks</h1>


<!-- ***************************************************************************
	Overview
**************************************************************************** -->
<span id="navigation-overview"></span>
## Overview

Navigation events and tasks allow the execution of JavaScript code at specific points during passage navigation.

In order of processing: *(for reference, this also shows the `Passage…` and UI bar special passages)*

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
5. UI bar special passages update—e.g., `StoryCaption`.  Happens before the end of passage navigation.
6. Passage end.  Happens at the end of passage navigation.
	1. `:passageend` event.


<!-- ***************************************************************************
	Events
**************************************************************************** -->
<span id="navigation-events"></span>
## Events

Navigation events are global synthetic events that are triggered at specific points during passage navigation.

<!-- *********************************************************************** -->

<span id="navigation-event-passageinit"></span>
### `:passageinit` event

Triggered before the modification of the state history.

#### Since:

* `v2.20.0`

#### Event object properties:

* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Example:

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

<span id="navigation-event-passagestart"></span>
### `:passagestart` event

Triggered before the rendering of the incoming passage.

#### Since:

* `v2.20.0`

#### Event object properties:

* **`content`:** (*`HTMLElement` object*) The, currently, empty element that will eventually hold the rendered content of the incoming passage.
* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Example:

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

Modifying the content buffer:

```
/*
	Process the markup "Begin at the //beginning//." and append the result
	to the incoming passage's element.
*/
$(document).on(':passagestart', function (ev) {
	$(ev.content).wiki("Begin at the //beginning//.");
});
```

<!-- *********************************************************************** -->

<span id="navigation-event-passagerender"></span>
### `:passagerender` event

Triggered after the rendering of the incoming passage.

#### Since:

* `v2.20.0`

#### Event object properties:

* **`content`:** (*`HTMLElement` object*) The element holding the fully rendered content of the incoming passage.
* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Example:

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

Modifying the content buffer:

```
/*
	Process the markup "At the //end// of all things." and append the result
	to the incoming passage's element.
*/
$(document).on(':passagerender', function (ev) {
	$(ev.content).wiki("At the //end// of all things.");
});
```

<!-- *********************************************************************** -->

<span id="navigation-event-passagedisplay"></span>
### `:passagedisplay` event

Triggered after the display—i.e., output—of the incoming passage.

#### Since:

* `v2.20.0`

#### Event object properties:

* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Example:

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

<!-- *********************************************************************** -->

<span id="navigation-event-passageend"></span>
### `:passageend` event

Triggered at the end of passage navigation.

#### Since:

* `v2.20.0`

#### Event object properties:

* **`passage`:** (*`Passage` object*) The incoming passage object.  See the [`Passage` API](#passage-api) for more information.

#### Example:

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


<!-- ***************************************************************************
	Tasks
**************************************************************************** -->
<span id="navigation-tasks"></span>
## Tasks

Navigation tasks are functions that are called at specific points during passage navigation.

**NOTE:** Tasks are an older method of enabling passage navigation events and you are encouraged to use [navigation events](#navigation-events) instead as they allow for easier control and are triggered at better points during navigation.

<!-- *********************************************************************** -->

<span id="navigation-task-prehistory"></span>
### `prehistory` task functions

Executed before the modification of the state history.

#### Since:

* `v2.0.0`

#### Parameters:

* **`taskName`:** (*string*) The name of the executing task.

#### Example:

```
prehistory["Some Task Name"] = function (taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="navigation-task-predisplay"></span>
### `predisplay` task functions

Executed before the rendering of the incoming passage.

#### Since:

* `v2.0.0`

#### Parameters:

* **`taskName`:** (*string*) The name of the executing task.

#### Example:

```
predisplay["Some Task Name"] = function (taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="navigation-task-prerender"></span>
### `prerender` task functions

Executed before the rendering of the incoming passage.

#### Since:

* `v2.0.0`

#### Parameters:

* **`content`:** (*`HTMLElement` object*) The, likely, empty element that will eventually hold the rendered content of the incoming passage.
* **`taskName`:** (*string*) The name of the executing task.

#### Example:

```
prerender["Some Task Name"] = function (content, taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="navigation-task-postrender"></span>
### `postrender` task functions

Executed after the rendering of the incoming passage.

#### Since:

* `v2.0.0`

#### Parameters:

* **`content`:** (*`HTMLElement` object*) The element holding the fully rendered content of the incoming passage.
* **`taskName`:** (*string*) The name of the executing task.

#### Example:

```
postrender["Some Task Name"] = function (content, taskName) {
	/* JavaScript code */
};
```

<!-- *********************************************************************** -->

<span id="navigation-task-postdisplay"></span>
### `postdisplay` task functions

Executed after the display—i.e., output—of the incoming passage.

#### Since:

* `v2.0.0`

#### Parameters:

* **`taskName`:** (*string*) The name of the executing task.

#### Example:

```
postdisplay["Some Task Name"] = function (taskName) {
	/* JavaScript code */
};
```
