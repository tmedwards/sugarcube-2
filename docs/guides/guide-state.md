# Guide: State, Sessions, and Saving {#guide-state-sessions-and-saving}

SugarCube preserves the state of the game as it's being played in a number of ways to allow players to save games and to prevent them from losing progress. This guide will detail how these features work.

## Moments {#guide-state-sessions-and-saving-moments}

The state is a collection of moments. A moment is created whenever passage navigation occurs. Each moment contains data regarding the active passage and the state of all [story variables](#twinescript-variables) (that is, the ones you use the `$` sigil to interact with). The history system allows players to navigate through these moments. If you aren't using the history, that is, you have set [`Config.history.maxStates`](#config-api-property-history-maxstates) to `1`, then there will only ever be one moment tracked, but passage navigation is still required for a new moment to be created.

Note that the `visited()` family of functions work independently of the history and moments, so said functions will work even if you have the history limited to one state.

Saving the game records the state up until the last moment created, not necessarily the current state of the game as it exists. This means that interaction that happens after a passage navigation cannot be saved until the next navigation occurs. For example:

```
:: one passage
<<set $var to 1>>

[[another passage]]

:: another passage
<<link "Click me!">>
	<<set $var to 2>>
<</link>>
```

In the above example, if you save the game after reaching the passage called **`another passage`**, the `$var` variable will be saved in the state as `1` as you would expect. If you click the link that sets the variable to `2`, and then save the game, the `$var` variable will *still* be saved as `1`, because a new moment has not yet been created.

## Session Preservation {#guide-state-sessions-and-session-preservation}

SugarCube automatically stores the current state to the [browser's session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) whenever a new moment is created. This can be thought of as a special, temporary saved game; it will be automatically deleted after the player's current browsing session ends. This is **not the autosave** (we'll cover the autosave feature later). Instead, this temporary save is intended to prevent players from losing data inadvertently. Some browsers, particularly mobile ones, will free up memory by unloading we pages that are running in the background. This functionally refreshes the webpage, and can cause users to lose their progress. When this happens, SugarCube automatically reloads the state from session storage.

This feature also prevents players from losing data if they try to use the browser back and forward buttons to navigate, or if they refresh their browser for any reason. The built-in **`Restart`** button, along with the methods `UI.restart()` and `Engine.restart()` are provided so that the game can be restarted.

## The Autosave {#guide-state-sessions-and-saving-the-autosave}

See: [`Config.saves.autosave`](#config-api-property-saves-autosave) and [`Save` API: Autosave](#save-api-autosave).

SugarCube features a configurable autosave system. The autosave is, for the most part, a normal save slot, but with a few special features and APIs built in. You can set the autosave to save on every passage, or certain passages, and set the autoload feature as well to prompt users to load the autosave on start up, or to load it automatically. Users occasionally confuse the session preservation feature as some effect of the autosave system, but note that, by default, the autosave is inactive.

## What Happens When a Save is Loaded? {#guide-state-sessions-and-saving-what-happens-when-a-save-is-loaded}

When a saved game is loaded, the saved state replaces the current state. This process is the same regardless of where the loaded state is coming from: it could be a normal save, the autosave, or the session state. The current state is completely lost; the new state is not added to the current state, instead it **replaces it in its entirety**. The easiest way to understand this is to look at what happens when you make some changes to `StoryInit` and then load a saved game from before those changes were made.

```
:: StoryInit
<<set $x to 0>>

:: Start
$x
```

If you run the above, you'd see `0` and `1`. Save the game, then edit the code:

```
:: StoryInit
<<set $x to 0>>
<<set $y to 1>>

:: Start
$x
$y
```

You'll see `0`, `1`, and `2` when you run this code. Now try loading the saved game from before the changes were made. `$z` is now undefined, since it doesn't exist at all in the loaded state.

## Refreshing and Restarting {#guide-state-sessions-and-saving-refreshing-and-restarting}

When the browser is refreshed, your game is restarted and the state from session storage is loaded. Since the game is restarted, `StoryInit` is run, but the state is thrown out when the state from session storage is loaded. `StoryInit` is run anytime the game is started or restarted, regardless of how it happens or whether a saved game is to be loaded. Some users have the false impression that `StoryInit` is not run when the game is refreshed or restarted due to the behavior described above; lines like `<<set $z to 2>>` ultimately have no effect because of the loaded state, **but they are still executed**. You can see this effect by changing data outside the state. For example, let's return to the example above and change it again.

```
:: StoryInit
<<set $x to 0>>
<<set $y to 1>>
<<set setup.z to 2>>

:: Start
$x
$y
<<= setup.z>>
```

You'll see that `setup.z` is being set to `2` and displayed properly regardless of whether you load a saved game or not, because it is not part of the state.

When the game is restarted by SugarCube rather than refreshed via the browser, the state in session storage, if any, is not loaded. `StoryInit` is run as normal, and the start passage is rendered. If the game is [configured to automatically load the autosave](#config-api-property-saves-autoload) then the autosave is loaded and the state is replaced by the autosave's state and the active passage is rendered, just as if the user had loaded any other save.