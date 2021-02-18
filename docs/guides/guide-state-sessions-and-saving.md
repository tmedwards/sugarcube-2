# Guide: State, Sessions, and Saving {#guide-state-sessions-and-saving}

SugarCube preserves the state of the story as it's being played in a number of ways to both prevent the loss of progress and allow players to save stories.  This guide will detail how these features work.

## Story History {#guide-state-sessions-and-saving-story-history}

The story history is a collection of **moments**.  A new moment is created whenever passage navigation occurs, and **only when passage navigation occurs**.  Each moment contains data regarding the active passage and the state of all [story variables](#twinescript-variables)—that is, the ones you use the `$` sigil to interact with—as they exist when the moment is created.  The history allows players to navigate through these moments.

The number of moments contained within the story history is, generally, limited, via the [`Config.history.maxStates` setting](#config-api-property-history-maxstates).  As new moments are added, older moments that exceed the maximum number are expired in order of age, oldest first.  Expired moments are recorded in a separate expired collection and can no longer be navigated to.  If you limit the moments within the history to `1`, via setting `Config.history.maxStates` to `1`, then there will only ever be one moment in the history, but passage navigation is still required for new moments to be created.

<p role="note"><b>Note:</b>
All user functions and macros that check for the existence of moments within the history check both the story history and expired moments, so will work as expected even if the history is limited to a single moment as described above.
</p>

Saving the story records the story's state up until the last moment that was created.  This is not necessarily the same as the current state of the story: because moment creation is tied to passage navigation, changes that occur *between* one passage navigation and the next are *not* part of the current moment and will not be preserved by a moment until the *next* navigation, when the next moment is created.

Consider the following:

```
:: one passage
<<set $var to 1>>

[[another passage]]

:: another passage
<<link "Click me!">>
	<<set $var to 2>>
<</link>>
```

In the above example, if you save the story after reaching the passage called *`another passage`*, the `$var` variable will be saved in the state as `1`, as you would expect.  If you click the link that sets the variable to `2`, and then save the story, the `$var` variable will *still* be saved as `1`, because a new moment has not yet been created.

## Playthrough Session {#guide-state-sessions-and-saving-playthrough-session}

<p role="note"><b>Note:</b>
The <a href="#guide-state-sessions-and-saving-autosave">autosave feature</a> is occasionally confused with the playthrough session feature, but they are in fact distinct systems.
</p>

SugarCube automatically stores the current playthrough state to the [browser's session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) whenever a new moment is created.  This can be thought of as a special, temporary saved story, which is automatically deleted after the player's current browsing session ends.  This temporary playthrough session is intended to prevent players from losing data.  Some browsers, particularly mobile ones, will free up memory by unloading web pages that are running in the background.  This functionally refreshes the webpage, and can cause users to lose their progress.  When SugarCube is reloaded by the browser, it checks if a playthrough session exists and loads it to prevent any inadvertent loss of progress.

This feature also prevents players from losing progress if they try to use the browser back and forward buttons to navigate, or if they refresh their browser for any reason.  The built-in *`Restart`* button, along with the methods [`UI.restart()`](#ui-api-method-restart) and [`Engine.restart()`](#engine-api-method-restart) are provided so that the story can be restarted without restoring a session.

To recap:

* When a new moment is created, SugarCube stores the playthrough state to session storage.
* If SugarCube is reloaded by the browser for whatever reason—e.g., due to a refresh, back/forward navigation, being unloaded in the background, etc.—then the session is restored.
* If SugarCube is reloaded by one of its own built-in restart methods, then the session is *not* restored.

## Autosave {#guide-state-sessions-and-saving-autosave}

<p role="note"><b>Note:</b>
The <a href="#guide-state-sessions-and-saving-playthrough-session">playthrough session feature</a> is occasionally confused with the autosave feature, but they are in fact distinct systems.
</p>

SugarCube features a configurable autosave system.  The autosave is, for the most part, a normal save slot, but with a few special features built in.  You can set the autosave to save either on every passage or only on certain passages.  It can be loaded manually by the player or automatically by the autoload feature, which can be configured to, upon start up, either load the autosave automatically or prompt the player about loading it.

<p role="note" class="see"><b>See:</b>
<a href="#config-api-property-saves-autosave"><code>Config.saves.autosave</code> setting</a>, <a href="#config-api-property-saves-autoload"><code>Config.saves.autoload</code> setting</a>, and <a href="#save-api-autosave"><code>Save</code> API: Autosave</a>.
</p>

## What Happens When a Save is Loaded? {#guide-state-sessions-and-saving-what-happens-when-a-save-is-loaded}

When a saved story is loaded, the state loaded from the save *replaces* the current state.  This process is the same regardless of where the loaded state is coming from: it could be a normal save, the autosave, or the playthrough session.  The previous state is completely lost—the new state is not added to or combined with the current state, instead it **replaces it in its entirety**.  The easiest way to understand this is to look at what happens when you make some changes to [`StoryInit`](#special-passage-storyinit) and then load a saved story from before those changes were made.  For example:

```
:: StoryInit
<<set $x to 0>>

:: Start
$$x is <<if def $x>> $x <<else>> undefined <</if>>
```

If you run the above, you'll see `$x is 0`.  Create a save, then edit the code as follows:

```
:: StoryInit
<<set $x to 0>>
<<set $y to 1>>

:: Start
$$x is <<if def $x>> $x <<else>> undefined <</if>>
$$y is <<if def $y>> $y <<else>> undefined <</if>>
```

Running that, you'll see `$x is 0` and `$y is 1`.  Now, load the saved story from before the changes were made, and you'll see `$y is undefined`, since it doesn't exist at all in the loaded state.

## Refreshing and Restarting {#guide-state-sessions-and-saving-refreshing-and-restarting}

Whenever your story is first started or, *for any reason*, restarted—e.g., the browser window/tab was refreshed/reloaded—it undergoes its startup sequence.  Several things occur **each and every time startup happens**, regardless of whether or not a playthrough session will be restored, an autosave loaded, or the starting passage run.  First, the CSS, JavaScript, and Widget sections are processed.  Next, the `StoryInit` special passage is processed.  Finally, one of three things happen (in order): the existing playthrough session is restored, if it exists, else the autosave is loaded, if it exists and is configured to do so, else the starting passage is run.

Some users have the false impression that `StoryInit` is not run when the story is restarted when the playthrough session is restored or autosave is loaded.  Code like `<<set $y to 1>>` *seems* to have no effect because the startup state is replaced by the of the incoming state, **but they are still executed by the engine**.  You can see this effect by changing data *outside* the state.  For example, let's return to the example above and change it again:

```
:: StoryInit
<<set $x to 0>>
<<set setup.y to 1>>

:: Start
$$x is <<if def $x>> $x <<else>> undefined <</if>>
setup.y is <<if def setup.y>> <<= setup.y>> <<else>> undefined <</if>>
```

You'll see that `setup.y` is being set to `1` and displayed properly regardless of whether you load a saved story or not, because it is not part of the state.

When the story is restarted by SugarCube rather than refreshed via the browser, the playthrough session, if any, is not loaded.  `StoryInit` is run, as always.  If the autosave exists and the story is [configured to automatically load it](#config-api-property-saves-autoload), then the autosave is loaded and the state is replaced by the autosave's state and the active passage is rendered, just as if the user had loaded any other save.  If no autosave exists, then the starting passage is rendered.
