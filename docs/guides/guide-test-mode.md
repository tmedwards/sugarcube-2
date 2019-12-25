<!-- ***********************************************************************************************
	Guide: Test Mode
************************************************************************************************ -->
<h1 id="guide-test-mode">Guide: Test Mode</h1>

#### Since:

* `v2.2.0`


<!-- ***************************************************************************
	Introduction
**************************************************************************** -->
<span id="guide-test-mode-introduction"></span>
## Introduction

In test mode, SugarCube will wrap all macros, and some non-macro markup—e.g., link &amp; image markup—within additional HTML elements, called "debug views" ("views" for short).  Views make their associated code visible, thus providing onscreen feedback—they may also be hovered over which, generally, exposes additional information about the underlying code.

**WARNING:** Because of the additional HTML elements added by the debug views, some nested markup and selectors may be broken.  This only affects test mode.

In versions of SugarCube ≥v2.23.0, the debugging interface offers additional tools, namely variable watches and arbitrary history navigation.


<!-- ***************************************************************************
	Enabling Test Mode
**************************************************************************** -->
<span id="guide-test-mode-enabling"></span>
## Enabling Test Mode

### Automatically

#### In Tweego

To enable test mode, use the testing option (`-t, --test`).

#### In Twine&nbsp;2 (≥v2.2)

To enable test mode from the *Stories* screen, click on the story's gear menu and select the *Test Story* menu item.

To enable test mode from the story editor/map screen, click on the *<i class="fa fa-bug"></i>Test* menu item (right side of the bottom bar).

To enable test mode from the story editor/map screen while starting at a specific passage, hover over a passage and select the *<i class="fa fa-play" title="Test story starting here"></i>* menu item.

#### In Twine&nbsp;2 (<v2.2)

To enable test mode from the *Stories* screen, click on the story's gear menu and select the *Test Play* menu item.

To enable test mode from the story editor/map screen, click on the *<i class="fa fa-bug"></i>Test* menu item (right side of the bottom bar).

To enable test mode from the story editor/map screen while starting at a specific passage, hover over a passage and select the *<i class="fa fa-bug" title="Test story starting here"></i>* menu item.

#### In Twine&nbsp;1

To enable test mode while starting at a specific passage, right-click on a passage and select the *Test Play From Here* context menu item.

**NOTE:** Unfortunately, due to limitations in the current release of Twine&nbsp;1, the *Build* menu's *Test Play* menu item is not able to trigger test mode.  You may, however, simply use the *Test Play From Here* context menu item on the `Start` passage to achieve the same result.

### Manually

You may forcibly enable test mode manually by setting the `Config` object's `debug` property to `true`.  For example:

```
Config.debug = true; // forcibly enable test mode
```

See [`Config.debug`](#config-api-property-debug) for more information.


<!-- ***************************************************************************
	Debug Bar (≥v2.23.0)
**************************************************************************** -->
<span id="guide-test-mode-debug-bar"></span>
## Debug Bar (≥v2.23.0)

The debug bar (bottom right corner of the page) allows you to: watch the values of story and temporary variables, toggle the debug views, and jump to any moment/turn within the history.

The variable watch panel may be toggled via the *Watch&nbsp;<i class="fa fa-toggle-off"></i>* button.  To add a watch for a variable, type its name into the *Add* field and then either press enter/return or click the *<i class="fa fa-plus" title="Add watch"></i>* button—n.b. depending on the age of your browser, you may also see a list of all current variables when interacting with the *Add* field.  To delete a watch, click the *<i class="fa fa-times" title="Delete watch"></i>* button next to its name in the watch panel.  To add watches for all current variables, click the *<i class="fa fa-magic" title="Watch all"></i>* button.  To delete all current watches, click the *<i class="fa fa-trash" title="Delete all"></i>* button.

The debug views may be toggled via the *Views&nbsp;<i class="fa fa-toggle-off"></i>* button.

To jump to any moment/turn within the available history, select the moment/turn from the *Turn* select field.


<!-- ***************************************************************************
	Debug Views (≤v2.22.0)
**************************************************************************** -->
<span id="guide-test-mode-debug-views"></span>
## Debug Views (≤v2.22.0)

The debug views themselves may be toggled on and off (default: on) via the *<i class="fa fa-bug"></i>Debug View* button (top of the UI bar).

If you've removed/hidden the UI bar, a construct like the following will allow you to toggle the views on and off:

```
<<button "Toggle Debug Views">><<script>>DebugView.toggle()<</script>><</button>>
```

**NOTE:** That only toggles the views, test mode must still be enabled first.
