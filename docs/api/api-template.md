<!-- ***********************************************************************************************
	Template API
************************************************************************************************ -->
<h1 id="template-api"><code>Template</code> API</h1>

<!-- *********************************************************************** -->

<span id="template-api-getter-size"></span>
### `Template.size` → *number*

Returns the number of existing templates.

#### Since:

* `v2.29.0`

#### Examples:

```
if (Template.size === 0) {
	/* No templates exist. */
}
```

<!-- *********************************************************************** -->

<span id="template-api-method-add"></span>
### `Template.add(name , definition)`

Add new template(s).

#### Since:

* `v2.29.0`

#### Parameters:

* **`name`:** (*string* | *string array*) Name, or array of names, of the template(s) to add.  **NOTE:** Names must consist of characters from the basic Latin alphabet and start with a letter, which may be optionally followed by any number of letters, numbers, the underscore, or the hyphen.
* **`definition`:** (*function* | *string* | *array*) Definition of the template(s), which may be a: function, string, or an array of either.  **NOTE:** Each time array definitions are referenced, one of their member templates is randomly selected to be the output source.

#### Function templates:

Function templates should return a string, which may itself contain markup.  They are called with no arguments, but with their `this` set to a template (execution) context object that contains the following data properties:

* **`name`:** (*string*) The template's name.

#### String templates:

String templates consist solely of a string, which may itself contain markup.

#### Examples:

##### Basic usage

```
/* Define a function template named ?yolo. */
Template.add('yolo', function () {
	return either('YOLO', 'You Only Live Once');
});

/* Define a string template named ?nolf. */
Template.add('nolf', 'No One Lives Forever');

/* Define an array of string templates named ?alsoYolo. */
Template.add('alsoYolo', ['YOLO', 'You Only Live Once']);

/* Define an array of mixed string and function templates named ?cmyk. */
Template.add('cmyk', [
	'Cyan',
	function () {
		return either('Magenta', 'Yellow');
	},
	'Black'
]);
```

##### Using the context object (`this`)

```
/* Define a function template with two names, ?color and ?Color, whose output changes based on its name. */
Template.add(['color', 'Color'], function () {
	var color = either('red', 'green', 'blue');
	return this.name === 'Color' ? color.toUpperFirst() : color;
});
```

<!-- *********************************************************************** -->

<span id="template-api-method-delete"></span>
### `Template.delete(name)`

Remove existing template(s).

#### Since:

* `v2.29.0`

#### Parameters:

* **`name`:** (*string* | *string array*) Name, or array of names, of the template(s) to remove.

#### Examples:

```
/* Deletes the template ?yolo. */
Template.delete('yolo');

/* Deletes the templates ?yolo and ?nolf. */
Template.delete(['yolo', 'nolf']);
```

<!-- *********************************************************************** -->

<span id="template-api-method-get"></span>
### `Template.get(name)` → *function* | *string* | *array*

Return the named template definition, or `null` on failure.

#### Since:

* `v2.29.0`

#### Parameters:

* **`name`:** (*string*) Name of the template whose definition should be returned.

#### Examples:

```
/* Returns the template ?yolo, or null if it doesn't exist. */
var yolo = Template.get('yolo');
```

<!-- *********************************************************************** -->

<span id="template-api-method-has"></span>
### `Template.has(name)` → *boolean*

Returns whether the named template exists.

#### Since:

* `v2.29.0`

#### Parameters:

* **`name`:** (*string*) Name of the template to search for.

#### Examples:

```
if (Template.has('yolo')) {
	/* A ?yolo template exists. */
}
```
