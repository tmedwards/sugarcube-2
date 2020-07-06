# Guide: State, Sessions, and Saving {#guide-state-sessions-and-saving}

SugarCube preserves the state of the game as it's being played in a number of ways to allow players to save games and to prevent the loss of progress. This guide will detail how these features work.

## Moments {#guide-state-sessions-and-saving-moments}

The state is a collection of **moments**. A new moment is created whenever passage navigation occurs, and **only when passage navigation occurs**. Each moment contains data regarding the active passage and the state of all [story variables](#twinescript-variables) (that is, the ones you use the `$` sigil to interact with) as they exist when the moment is created. The history system allows players to navigate through these moments. If you aren't using the history, that is, you have set Config.history.maxStates`](#config-api-property-history-maxstates) to `1`, then there will only ever be one moment in the history, but passage navigation is still required for a new moment to be created.

Note that the `visited()` family of functions work independently of the history and moments, so said functions will work even if the history is limited to just one state as described above.

Saving the game records the game's state up until the last moment that was created. This is not necessarily the same as the current state of the game: because moment creation is tied to passage navigation, changes that occur *between* one passage navigation and the next are *not* part of the current moment and will not be preserved by a moment until the *next* navigation, when the next moment is created.

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

In the above example, if you save the game after reaching the passage called **`another passage`**, the `$var` variable will be saved in the state as `1`, as you would expect. If you click the link that sets the variable to `2`, and then save the game, the `$var` variable will *still* be saved as `1`, because a new moment has not yet been created.

## Session Preservation {#guide-state-sessions-and-session-preservation}

SugarCube automatically stores the current state to the [browser's session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) whenever a new moment is created. This can be thought of as a special, temporary saved game; it will be automatically deleted after the player's current browsing session ends. This is **not the autosave** (we'll cover the autosave feature in a moment). Instead, this temporary save is intended to prevent players from losing data. Some browsers, particularly mobile ones, will free up memory by unloading web pages that are running in the background. This functionally refreshes the webpage, and can cause users to lose their progress. When SugarCube is reloaded by the browser, it checks if session data exists and loads it to prevent any inadvertent loss of progress.

This feature also prevents players from losing progress if they try to use the browser back and forward buttons to navigate, or if they refresh their browser for any reason. The built-in **`Restart`** button, along with the methods [`UI.restart()`](#ui-api-method-restart) and [`Engine.restart()`](#engine-api-method-restart) are provided so that the game can be restarted without restoring a session.

To recap:

* When a new moment is created, SugarCube saves the state to session storage.
* If SugarCube is reloaded by the browser (due to a refresh, back/forward navigation, being unloaded in the background, etc) the session is restored. **This is not the autosave/autoload feature.**
* If SugarCube is reloaded by one of its own built-in restart methods, the session is not restored.

## The Autosave {#guide-state-sessions-and-saving-the-autosave}

See: [`Config.saves.autosave`](#config-api-property-saves-autosave) and [`Save` API: Autosave](#save-api-autosave).

SugarCube features a configurable autosave system. The autosave is, for the most part, a normal save slot, but with a few special features and APIs built in. You can set the autosave to save on every passage, or on certain passages, and set the autoload feature as well to prompt users to load the autosave on start up, or to load it automatically. Users occasionally confuse the session preservation feature as some effect of the autosave system, but they are in fact distinct systems.

## What Happens When a Save is Loaded? {#guide-state-sessions-and-saving-what-happens-when-a-save-is-loaded}

When a saved game is loaded, the state loaded from the save *replaces* the current state. This process is the same regardless of where the loaded state is coming from: it could be a normal save, the autosave, or the session state. The previous state is completely lost; the new state is not added to or combined with the current state, instead it **replaces it in its entirety**. The easiest way to understand this is to look at what happens when you make some changes to [`StoryInit`]([`StoryInit`](#special-passage-storyinit)) and then load a saved game from before those changes were made.

```
:: StoryInit
<<set $x to 0>>

:: Start
$x
```

If you run the above, you'll see `0`. Create a save, then edit the code:

```
:: StoryInit
<<set $x to 0>>
<<set $y to 1>>

:: Start
$x
$y
```

You'll see `0` and  `1` and when you run this code. Now try loading the saved game from before the changes were made, and you'll see that `$y` is now undefined, since it doesn't exist at all in the loaded state.

## Refreshing and Restarting {#guide-state-sessions-and-saving-refreshing-and-restarting}

When the browser is refreshed, your game is restarted and the state from session storage is loaded. Since the game is restarted, `StoryInit` runs, but the state is thrown out when the state from session storage is loaded. **`StoryInit` is run anytime the game is started or restarted**, regardless of how it happens or whether a saved game is to be loaded. Some users have the false impression that `StoryInit` is not run when the game is refreshed or restarted due to the behavior described in the previous section; lines like `<<set $y to 1>>` *seem* to have no effect because of the incoming state, **but they are still executed** by the engine. You can see this effect by changing data *outside* the state. For example, let's return to the example above and change it again.

```
:: StoryInit
<<set $x to 0>>
<<set setup.y to 1>>

:: Start
$x
<<= setup.y>>
```

You'll see that `setup.y` is being set to `1` and displayed properly regardless of whether you load a saved game or not, because it is not part of the state.

When the game is restarted by SugarCube rather than refreshed via the browser, the state in session storage, if any, is not loaded. `StoryInit` is run as normal, and the start passage is rendered. If the game is [configured to automatically load the autosave](#config-api-property-saves-autoload) then the autosave is loaded and the state is replaced by the autosave's state and the active passage is rendered, just as if the user had loaded any other save.