<!-- ***********************************************************************************************
	Guide: Non-generic object types (classes)
************************************************************************************************ -->
# Guide: Non-generic object types (classes)<!-- legacy --><span id="guide-tips-non-generic-object-types"></span><!-- /legacy --> {#guide-non-generic-object-types}

As a basic working definition, non-generic object types—i.e., classes—are instantiable objects whose own prototype is not `Object`—e.g., `Array` is a native non-generic object type.

Many of the commonly used native non-generic object types are already fully compatible with and supported for use within story variables—e.g., `Array`, `Date`, `Map`, and `Set`.  All other non-generic object types, on the other hand, must be made compatible to be successfully stored within story variables.

Making custom non-generic object types fully compatible requires that two methods be added to their prototype, `.clone()` and `.toJSON()`, to support cloning—i.e., deep copying—instances of the type.

* The `.clone()` method needs to return a clone of the instance.
* The `.toJSON()` method needs to return a code string that when evaluated will return a clone of the instance.

In both cases, since the end goal is roughly the same, this means creating a new instance of the base object type and populating it with clones of the original instance's data.  There is no one size fits all example for either of these methods because an instance's properties, and the data contained therein, are what determine what you need to do.

<p role="note" class="see"><b>See Also:</b>
The <a href="#methods-serial-method-createreviver"><code>Serial.createReviver()</code> method</a> for additional information on implementing the <code>.toJSON()</code> method.
</p>

## Examples: *(not an exhaustive list)*

<!-- *********************************************************************** -->

### `class`-based syntax (newer, preferred) {#guide-non-generic-object-types-class-syntax}

#### Configuration object parameter constructor (w/ automatic copying of own data)

Here's a simple example whose constructor takes a single configuration object parameter:

```js
window.Character = class Character {
	constructor(config) {
		// Set up our own data properties with some defaults.
		this.name = '(none)';
		this.race = '(none)';
		this.st   = 10;
		this.dx   = 10;
		this.iq   = 10;
		this.ht   = 10;
		this.hp   = 10;

		// Clone the given config object's own properties into our own properties.
		//
		// NOTE: We use the SugarCube built-in `clone()` function to make deep
		// copies of each of the properties' values.
		Object.keys(config).forEach(prop => {
			this[prop] = clone(config[prop]);
		});
	}

	clone() {
		// Return a new instance containing our own data.
		return new this.constructor(this);
	}

	toJSON() {
		// Return a code string that will create a new instance containing our
		// own data.
		//
		// NOTE: Supplying `this` directly as the `reviveData` parameter to the
		// `Serial.createReviver()` call will trigger out of control recursion in
		// the serializer, so we must pass it a clone of our own data instead.
		var ownData = {};
		Object.keys(this).forEach(prop => {
			ownData[prop] = clone(this[prop]);
		});
		return Serial.createReviver(`new ${this.constructor.name}($ReviveData$)`, ownData);
	}
};
```

Creating a new instance of this `Character` example would be something like:

```js
<<set $Joe to new Character({
	name : 'Joe the Barbarian',
	race : 'human',
	st   : 20,
	dx   : 12,
	iq   : 9,
	ht   : 18,
	hp   : 18
})>>
```

#### Discrete parameters constructor (w/ manual copying of own data)

Here's a simple example whose constructor takes multiple discrete parameters:

```js
window.Character = class Character {
	constructor(
		name,
		race,
		st,
		dx,
		iq,
		ht,
		hp
	) {
		// Set up our own data properties with the given values or defaults.
		this.name = name ?? '(none)';
		this.race = race ?? '(none)';
		this.st   = st ?? 10;
		this.dx   = dx ?? 10;
		this.iq   = iq ?? 10;
		this.ht   = ht ?? 10;
		this.hp   = hp ?? 10;
	}

	clone() {
		// Return a new instance containing our own data.
		return new this.constructor(
			this.name,
			this.race,
			this.st,
			this.dx,
			this.iq,
			this.ht,
			this.hp
		);
	}

	toJSON() {
		// Return a code string that will create a new instance containing our
		// own data.
		return Serial.createReviver(String.format(
			'new {0}({1},{2},{3},{4},{5},{6},{7})',
			this.constructor.name,
			JSON.stringify(this.name),
			JSON.stringify(this.race),
			JSON.stringify(this.st),
			JSON.stringify(this.dx),
			JSON.stringify(this.iq),
			JSON.stringify(this.ht),
			JSON.stringify(this.hp)
		));
	}
};
```

Creating a new instance of this `Character` example would be something like:

```
<<set $Joe to new Character(
	'Joe the Barbarian',
	'human',
	20,
	12,
	9,
	18,
	18
)>>
```

<!-- *********************************************************************** -->

### `function`-based syntax (classic, not recommended) {#guide-non-generic-object-types-function-syntax}

#### Configuration object parameter constructor (w/ automatic copying of own data)

Here's a simple example whose constructor takes a single configuration object parameter:

```js
window.Character = function Character(config) {
	// Set up our own data properties with some defaults.
	this.name = '(none)';
	this.race = '(none)';
	this.st   = 10;
	this.dx   = 10;
	this.iq   = 10;
	this.ht   = 10;
	this.hp   = 10;

	// Clone the given config object's own properties into our own properties.
	//
	// NOTE: We use the SugarCube built-in `clone()` function to make deep
	// copies of each of the properties' values.
	Object.keys(config).forEach(function (prop) {
		this[prop] = clone(config[prop]);
	}, this);
};

Character.prototype.clone = function () {
	// Return a new instance containing our own data.
	return new Character(this);
};

Character.prototype.toJSON = function () {
	// Return a code string that will create a new instance containing our
	// own data.
	//
	// NOTE: Supplying `this` directly as the `reviveData` parameter to the
	// `Serial.createReviver()` call will trigger out of control recursion in
	// the serializer, so we must pass it a clone of our own data instead.
	var ownData = {};
	Object.keys(this).forEach(function (prop) {
		ownData[prop] = clone(this[prop]);
	}, this);
	return Serial.createReviver('new Character($ReviveData$)', ownData);
};
```

Creating a new instance of this `Character` example would be something like:

```js
<<set $Joe to new Character({
	name : 'Joe the Barbarian',
	race : 'human',
	st   : 20,
	dx   : 12,
	iq   : 9,
	ht   : 18,
	hp   : 18
})>>
```

#### Discrete parameters constructor (w/ manual copying of own data)

Here's a simple example whose constructor takes multiple discrete parameters:

```js
window.Character = function (
	name,
	race,
	st,
	dx,
	iq,
	ht,
	hp
) {
	// Set up our own data properties with the given values or defaults.
	this.name = name || '(none)';
	this.race = race || '(none)';
	this.st   = st || 10;
	this.dx   = dx || 10;
	this.iq   = iq || 10;
	this.ht   = ht || 10;
	this.hp   = hp || 10;
};

Character.prototype.clone = function () {
	// Return a new instance containing our own data.
	return new Character(
		this.name,
		this.race,
		this.st,
		this.dx,
		this.iq,
		this.ht,
		this.hp
	);
};

Character.prototype.toJSON = function () {
	// Return a code string that will create a new instance containing our
	// own data.
	return Serial.createReviver(String.format(
		'new Character({0},{1},{2},{3},{4},{5},{6})',
		JSON.stringify(this.name),
		JSON.stringify(this.race),
		JSON.stringify(this.st),
		JSON.stringify(this.dx),
		JSON.stringify(this.iq),
		JSON.stringify(this.ht),
		JSON.stringify(this.hp)
	));
};
```

Creating a new instance of this `Character` example would be something like:

```
<<set $Joe to new Character(
	'Joe the Barbarian',
	'human',
	20,
	12,
	9,
	18,
	18
)>>
```
