<!-- ***********************************************************************************************
	Setting API
************************************************************************************************ -->
<h1 id="setting-api"><code>Setting</code> API</h1>

Manages the Settings dialog and [`settings` object](#setting-api-object-settings).

<!-- *********************************************************************** -->

<span id="setting-api-method-addheader"></span>
### `Setting.addHeader(name [, desc])`

Adds a header to the Settings dialog.

#### Since:

* `v2.7.1`

#### Parameters:

* **`name`:** (*string*) Name of the header.
* **`desc`:** (optional, *string*) Description explaining the header in greater detail.

#### Example:

```
// Setting up a basic header
Setting.addHeader("Content Settings");

// Setting up a header w/ a description
Setting.addHeader("Content Settings", "Settings controlling what content is made available in the game.");
```

<!-- *********************************************************************** -->

<span id="setting-api-method-addtoggle"></span>
### `Setting.addToggle(name, definition)`

Adds the named property to the `settings` object and a toggle control for it to the Settings dialog.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.26.0`: Added `desc` property to definition object.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add, which the control will manage.
* **`definition`:** (*object*) Definition of the control.

#### Definition object:

A toggle definition object should have some of the following properties:

* **`label`:** (*string*) Label to use for the control.
* **`desc`:** (optional, *string*) Description explaining the control in greater detail.
* **`default`:** (optional, *boolean*) The default value for the setting and default state of the control.  Leaving it undefined means to use `false` as the default.
* **`onInit`:** (optional, *function*) The function to call during initialization.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.

#### Example:

##### Basic toggle setting

```
// Setting up a basic toggle control for the settings property 'mature'
Setting.addToggle("mature", {
	label : "Content for mature audiences?"
}); // default value not defined, so false is used
```

##### Toggle that adds/removes a CSS class

```
// Setting up a toggle control for the settings property 'widescreen' w/ callbacks
var settingWidescreenHandler = function () {
	if (settings.widescreen) { // is true
		$("html").addClass("widescreen");
	}
	else { // is false
		$("html").removeClass("widescreen");
	}
};
Setting.addToggle("widescreen", {
	label    : "Allow the story to use the full width of your browser window?",
	default  : false,
	onInit   : settingWidescreenHandler,
	onChange : settingWidescreenHandler
});
```

And the requisite CSS style rule:

```
html.widescreen #passages {
	max-width: none;
}
```

<!-- *********************************************************************** -->

<span id="setting-api-method-addlist"></span>
### `Setting.addList(name, definition)`

Adds the named property to the `settings` object and a list control for it to the Settings dialog.

#### Since:

* `v2.0.0`: Basic syntax.
* `v2.26.0`: Added `desc` property to definition object.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add, which the control will manage.
* **`definition`:** (*object*) Definition of the control.

#### Definition object:

A list definition object should have some of the following properties:

* **`label`:** (*string*) Label to use for the control.
* **`list`:** (*array*) The array of items.
* **`desc`:** (optional, *string*) Description explaining the control in greater detail.
* **`default`:** (optional, *[as **`list`** array]*) The default value for the setting and default state of the control.  It should have the same value as one of the members of the **`list`** array.  Leaving it undefined means to use the first array member as the default.
* **`onInit`:** (optional, *function*) The function to call during initialization.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.

#### Example:

```
// Setting up a basic list control for the settings property 'difficulty'
Setting.addList("difficulty", {
	label   : "Choose a difficulty level.",
	list    : ["Easy", "Normal", "Hard", "INSANE"],
	default : "Normal"
});

// Setting up a list control for the settings property 'theme' w/ callbacks
var settingThemeNames = ["(none)", "Bright Lights", "Charcoal", "Midnight", "Tinsel City"];
var settingThemeHandler = function () {
	// cache the jQuery-wrapped <html> element
	var $html = $("html");

	// remove any existing theme class
	$html.removeClass("theme-bright-lights theme-charcoal theme-midnight theme-tinsel-city");

	// switch on the theme name to add the requested theme class
	switch (settings.theme) {
	case "Bright Lights":
		$html.addClass("theme-bright-lights");
		break;
	case "Charcoal":
		$html.addClass("theme-charcoal");
		break;
	case "Midnight":
		$html.addClass("theme-midnight");
		break;
	case "Tinsel City":
		$html.addClass("theme-tinsel-city");
		break;
	}
};
Setting.addList("theme", {
	label    : "Choose a theme.",
	list     : settingThemeNames,
	onInit   : settingThemeHandler,
	onChange : settingThemeHandler
}); // default value not defined, so the first array member "(none)" is used
```
<!--

// remove any existing theme class and add the requested one
$("html")
	.removeClass(this.list.slice(1).map(function (name) {
		return Util.slugify("theme-" + name);
	}).join(" "))
	.addClass(Util.slugify("theme-" + this.value));
-->

<!-- *********************************************************************** -->

<span id="setting-api-method-addrange"></span>
### `Setting.addRange(name, definition)`

Adds the named property to the `settings` object and a range control for it to the Settings dialog.

#### Since:

* `v2.26.0`

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add, which the control will manage.
* **`definition`:** (*object*) Definition of the control.

#### Definition object:

A range definition object should have some of the following properties:

* **`label`:** (*string*) Label to use for the control.
* **`min`:** (*number*) The minimum value.
* **`max`:** (*number*) The maximum value.
* **`step`:** (*number*) Limits the increments to which the value may be set.  It must be evenly divisible into the full range—i.e., `max - min`.
* **`desc`:** (optional, *string*) Description explaining the control in greater detail.
* **`default`:** (optional, *number*) The default value for the setting and default state of the control.  Leaving it undefined means to use the value of `max` as the default.
* **`onInit`:** (optional, *function*) The function to call during initialization.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.

#### Example:

```
// Setting up a volume control for the settings property 'masterVolume' w/ callback
Setting.addRange("masterVolume", {
	label    : "Master volume.",
	min      : 0,
	max      : 10,
	step     : 1,
	onChange : function () {
		$.wiki("<<masteraudio volume " + (settings["masterVolume"] / 10) + ">>");
	}
}); // default value not defined, so max value (10) is used
```
<!--
// NOTE: Whole numbers (range: 0–10) are used within the control itself for
// the sake of Internet Explorer, whose range input value tooltip only does
// something useful if the value is an integer.  The value is divided by 10
// when passed to <<masteraudio>>, since volume levels range from 0 to 1.
-->

<!-- *********************************************************************** -->

<span id="setting-api-method-load"></span>
### `Setting.load()`

Loads the settings from storage.

**NOTE:** The API automatically calls this method at startup, so you should never need to call this method manually.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
Setting.load();
```

<!-- *********************************************************************** -->

<span id="setting-api-method-reset"></span>
### `Setting.reset([name])`

Resets the setting with the given name to its default value.  If no name is given, resets all settings.

#### Since:

* `v2.0.0`

#### Parameters:

* **`name`:** (optional, *string*) Name of the `settings` object property to reset.

#### Example:

```
// Reset the setting 'difficulty'
Setting.reset("difficulty");

// Reset all settings
Setting.reset();
```

<!-- *********************************************************************** -->

<span id="setting-api-method-save"></span>
### `Setting.save()`

Saves the settings to storage.

**NOTE:** The controls of the Settings dialog automatically call this method when settings are changed, so you should normally never need to call this method manually.  Only when manually modifying the values of `settings` object properties, outside of the controls, would you need to call this method.

#### Since:

* `v2.0.0`

#### Parameters: *none*

#### Example:

```
Setting.save();
```

<!-- *********************************************************************** -->

<span id="setting-api-object-settings"></span>
### `settings` object

A prototype-less generic object whose properties and values are defined by the [`Setting.addToggle()`](#setting-api-method-addtoggle), [`Setting.addList()`](#setting-api-method-addlist), and [`Setting.addRange()`](#setting-api-method-addrange) methods.

Normally, the values of its properties are automatically managed by their associated Settings dialog control.  If necessary, however, you may manually change their values—n.b. you'll need to call the [`Setting.save()`](#setting-api-method-save) after having done so.

#### Since:

* `v2.0.0`
