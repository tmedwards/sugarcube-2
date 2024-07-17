<!-- ***********************************************************************************************
	Setting API
************************************************************************************************ -->
# `Setting` API {#setting-api}

Manages the Settings dialog and [`settings` object](#setting-api-object-settings).

<p role="note" class="warning"><b>Warning:</b>
<code>Setting</code> API method calls <strong><em>must</em></strong> be placed within your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage) or settings will not function correctly.
</p>

<!-- *********************************************************************** -->

### `Setting.addHeader(name [, desc])` {#setting-api-method-addheader}

Adds a header to the Settings dialog.

#### History:

* `v2.7.1`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the header.
* **`desc`:** (optional, *string*) Description explaining the header in greater detail.  May contain markup.

#### Examples:

```js
// Setting up a basic header
Setting.addHeader("Content Settings");

// Setting up a header w/ a description
Setting.addHeader("Content Settings", "Settings controlling what content is made available in the game.");
```

<!-- *********************************************************************** -->

### `Setting.addList(name, definition)` {#setting-api-method-addlist}

Adds the named property to the `settings` object and a list control for it to the Settings dialog.

#### History:

* `v2.0.0`: Introduced.
* `v2.26.0`: Added `desc` property to definition object.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add, which the control will manage.
* **`definition`:** (*object*) Definition of the setting and control.

#### Definition object:

A list-type definition object should have some of the following properties:

* **`label`:** (*string*) Label to use for the control.
* **`list`:** (*Array&lt;string&gt;*) The array of members.
* **`desc`:** (optional, *string*) Description explaining the control in greater detail.  May contain markup.
* **`default`:** (optional, *[as **`list`** array]*) The default value for the setting and default state of the control.  It should have the same value as one of the members of the **`list`** array.  Leaving it undefined means to use the first array member as the default.
* **`onInit`:** (optional, *function*) The function to call during initialization.  It is called with a result object as its sole parameter and, if possible, set as its `this`.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.  It is called with a result object as its sole parameter and, if possible, set as its `this`.

#### Result object:

* **`name`:** (*string*) Name of the `settings` property.
* **`value`:** (*[as **`list`** array]*) The current value of the setting.
* **`default`:** (*[as **`list`** array]*) The default value for the setting.
* **`list`:** (*Array&lt;string&gt;*) The array of members.

#### Examples:

```js
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

### `Setting.addRange(name, definition)` {#setting-api-method-addrange}

Adds the named property to the `settings` object and a range control for it to the Settings dialog.

#### History:

* `v2.26.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add, which the control will manage.
* **`definition`:** (*object*) Definition of the setting and control.

#### Definition object:

A range-type definition object should have some of the following properties:

* **`label`:** (*string*) Label to use for the control.
* **`max`:** (*number*) The maximum value.
* **`min`:** (*number*) The minimum value.
* **`step`:** (*number*) Limits the increments to which the value may be set.  It must be evenly divisible into the full range—i.e., `max - min`.
* **`desc`:** (optional, *string*) Description explaining the control in greater detail.  May contain markup.
* **`default`:** (optional, *number*) The default value for the setting and default state of the control.  Leaving it undefined means to use the value of `max` as the default.
* **`onInit`:** (optional, *function*) The function to call during initialization.  It is called with a result object as its sole parameter and, if possible, set as its `this`.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.  It is called with a result object as its sole parameter and, if possible, set as its `this`.

#### Result object:

* **`name`:** (*string*) Name of the `settings` property.
* **`value`:** (*number*) The current value of the setting.
* **`default`:** (*number*) The default value for the setting.
* **`max`:** (*number*) The maximum value for the setting.
* **`min`:** (*number*) The minimum value for the setting.
* **`step`:** (*number*) The step value for the setting.

#### Examples:

```js
// Setting up a volume control for the settings property 'masterVolume' w/ callback
var settingMasterVolumeHandler = function () {
	SimpleAudio.volume(settings.masterVolume / 10);
};
Setting.addRange("masterVolume", {
	label    : "Master volume.",
	min      : 0,
	max      : 10,
	step     : 1,
	onInit   : settingMasterVolumeHandler,
	onChange : settingMasterVolumeHandler
}); // default value not defined, so max value (10) is used
```
<!--
// NOTE: Whole numbers (range: 0–10) are used within the control itself for
// the sake of Internet Explorer, whose range input value tooltip only does
// something useful if the value is an integer.  The value is divided by 10
// when passed to SimpleAudio.volume(), since volume levels range 0–1.
-->

<!-- *********************************************************************** -->

### `Setting.addToggle(name, definition)` {#setting-api-method-addtoggle}

Adds the named property to the `settings` object and a toggle control for it to the Settings dialog.

#### History:

* `v2.0.0`: Introduced.
* `v2.26.0`: Added `desc` property to definition object.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add, which the control will manage.
* **`definition`:** (*object*) Definition of the setting and control.

#### Definition object:

A toggle-type definition object should have some of the following properties:

* **`label`:** (*string*) Label to use for the control.
* **`desc`:** (optional, *string*) Description explaining the control in greater detail.  May contain markup.
* **`default`:** (optional, *boolean*) The default value for the setting and default state of the control.  Leaving it undefined means to use `false` as the default.
* **`onInit`:** (optional, *function*) The function to call during initialization.  It is called with a result object as its sole parameter and, if possible, set as its `this`.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.  It is called with a result object as its sole parameter and, if possible, set as its `this`.

#### Result object:

* **`name`:** (*string*) Name of the `settings` property.
* **`value`:** (*boolean*) The current value of the setting.
* **`default`:** (*boolean*) The default value for the setting.

#### Examples:

##### Basic toggle setting

```js
// Setting up a basic toggle control for the settings property 'mature'
Setting.addToggle("mature", {
	label : "Content for mature audiences?"
}); // default value not defined, so false is used
```

##### Toggle that adds/removes a CSS class

```js
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

```js
html.widescreen #passages {
	max-width: none;
}
```

<!-- *********************************************************************** -->

### `Setting.addValue(name [, definition])` {#setting-api-method-addvalue}

Adds the named property to the `settings` object.

<p role="note"><b>Note:</b>
Does not add a control to the Settings dialog.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property to add.
* **`definition`:** (optional, *object*) Definition of the setting.  May be omitted.

#### Definition object:

A value-type definition object should have some of the following properties:

* **`default`:** (optional, *any*) The default value for the setting.
* **`onInit`:** (optional, *function*) The function to call during initialization.  It is called with a result object as its sole parameter and, if possible, set as its `this`.
* **`onChange`:** (optional, *function*) The function to call when the control's state is changed.  It is called with a result object as its sole parameter and, if possible, set as its `this`.

#### Result object:

* **`name`:** (*string*) Name of the `settings` property.
* **`value`:** (*any*) The current value of the setting.
* **`default`:** (*any*) The default value for the setting.

#### Examples:

##### Basic usage

```js
Setting.addValue("someSetting");
```

##### With a definition object

```js
Setting.addValue("anotherSetting", {
	default  : 42,
	onInit   : function () {
		/* Do something when the setting is initialized. */
	},
	onChange : function () {
		/* Do something when the setting is changed. */
	}
});
```

<!-- *********************************************************************** -->

### `Setting.getValue(name)` → *`any`* {#setting-api-method-getvalue}

Returns the setting's current value.

<p role="note"><b>Note:</b>
Calling this method is equivalent to using <code>settings[name]</code>.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
// Assume `disableAudio` is a toggle-type setting.
if (Setting.getValue("disableAudio")) {
	/* Audio should be disabled. */
}
```

<!-- *********************************************************************** -->

### `Setting.load()` {#setting-api-method-load}

Loads the settings from storage.

<p role="note"><b>Note:</b>
This method is automatically called during startup, so you <em>should</em> never need to call it manually.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
Setting.load();
```

<!-- *********************************************************************** -->

### `Setting.reset([name])` {#setting-api-method-reset}

Resets the setting with the given name to its default value.  If no name is given, resets all settings.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`name`:** (optional, *string*) Name of the `settings` object property to reset.

#### Examples:

```js
// Reset the setting 'difficulty'
Setting.reset("difficulty");
```

```js
// Reset all settings
Setting.reset();
```

<!-- *********************************************************************** -->

### `Setting.save()` {#setting-api-method-save}

Saves the settings to storage.

<p role="note"><b>Note:</b>
The controls of the Settings dialog and the <a href="#setting-api-method-setvalue"><code>Setting.setValue()</code> method</a> automatically call this method when settings are changed, so you should normally never need to call this method manually.  Only when directly modifying the values of <code>settings</code> object properties, outside of the controls or <code>Setting.setValue()</code> method, would you need to call this method.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Examples:

```js
Setting.save();
```

<!-- *********************************************************************** -->

### `Setting.setValue(name, value)` {#setting-api-method-setvalue}

Sets the setting's value.

<p role="note"><b>Note:</b>
This method automatically calls the <a href="#setting-api-method-save"><code>Setting.save()</code> method</a>.
</p>

<p role="note" class="warning"><b>Warning:</b>
If manually changing a setting that has an associated control, be mindful that the value you set makes sense for the setting in question, elsewise shenanigans could occur—e.g., don't set a range-type setting to non-number or out-of-range values.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`name`:** (*string*) Name of the `settings` property.
* **`value`:** (*any*) The new value for the setting.

#### Examples:

```js
Setting.setValue("theme", "dark");
```

<!-- *********************************************************************** -->

### `settings` object {#setting-api-object-settings}

A prototype-less generic object whose properties and values are defined by the [`Setting.addList()`](#setting-api-method-addlist), [`Setting.addRange()`](#setting-api-method-addrange), [`Setting.addToggle()`](#setting-api-method-addtoggle), and [`Setting.addValue()`](#setting-api-method-addvalue) methods.

For all types of setting types except value-types, the values of its properties are automatically managed by the Settings dialog controls.  If necessary, you may manually change setting values via the <a href="#setting-api-method-setvalue"><code>Setting.setValue()</code> method</a>.

<p role="note"><b>Note:</b>
You may also manually change setting values by assigning directly to the associated property—e.g., <code>settings["mode"] = "day"</code>.  Doing so, however, <strong><em>does not</em></strong> automatically save any values so updated, thus you <strong><em>must</em></strong> manually call the <a href="#setting-api-method-save"><code>Setting.save()</code> method</a> afterwards.
</p>

<p role="note" class="warning"><b>Warning:</b>
If manually changing a setting that has an associated control, be mindful that the value you set makes sense for the setting in question, elsewise shenanigans could occur—e.g., don't set a range-type setting to non-number or out-of-range values.
</p>

#### History:

* `v2.0.0`: Introduced.
