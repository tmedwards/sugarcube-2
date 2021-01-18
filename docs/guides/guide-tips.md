<!-- ***********************************************************************************************
	Guide: Tips
************************************************************************************************ -->
# Guide: Tips {#guide-tips}

This is a collection of tips, from how-tos to best practices.

Suggestions for new entries may be submitted by [creating a new issue](https://github.com/tmedwards/sugarcube-2/issues) at SugarCube's [source code repository](https://github.com/tmedwards/sugarcube-2).

<!-- *********************************************************************** -->

### Arbitrarily long return {#guide-tips-arbitrarily-long-return}

<p role="note" class="warning"><b>Warning:</b>
Navigating back to a previous passage, for whatever reason, can be problematic.  There's no way for the system to know ahead of time whether it's safe to re-execute a passage's contents.  Even if it did know that, there's no way for it to know which operations may or may not have side-effects—e.g., changing variables.  Thus, if you allow players to return to passages, then you should either: ensure the passages contain no code that has side-effects or wrap that code in something to prevent re-execution—e.g., <code>&lt;&lt;if visited() is 1&gt;&gt;side-effects&lt;&lt;/if&gt;&gt;</code>.
</p>
<p role="note" class="note"><b>Note:</b>
An alternative to navigating to passages to create menus, inventories, and the like would be to use the <a href="#dialog-api"><code>Dialog</code> API</a>.
</p>

When you have a situation where you're using a set of passages as some kind of menu/inventory/etc and it's possible for the player to interact with several of those passages, or even simply the same one multiple times, then returning them to the passage they were at before entering the menu can be problematic as they're possibly several passages removed from that originating passage—thus, the `<<return>>` macro and link constructs like `[[Return|previous()]]` will not work.

The most common way to resolve this arbitrarily long return issue is to use a bit of JavaScript to record the last non-menu passage the player visited into a story variable and then to create a link with that.

For example, you may use the following JavaScript code to record the last non-menu passage into the `$return` story variable: (Twine&nbsp;2: the Story JavaScript, Twine&nbsp;1/Twee: a `script`-tagged passage)

```
$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.title;
	}
});
```

You'll need to tag each and every one of your menu passages with `noreturn`—you may use any tag you wish (e.g., `menu`, `inventory`), just ensure you change the name in the code if you decide upon another.  If necessary, you may also use multiple tags by switching from [`<Array>.includes()`](#methods-array-prototype-method-includes) to [`<Array>.includesAny()`](#methods-array-prototype-method-includesany) in the above example.

In your menu passages, your long return links will simply reference the `$return` story variable, like so:

```
→ Using link markup
[[Return|$return]]

→ Using <<link>> macro (separate argument form)
<<link "Return" $return>><</link>>
```

<p role="note" class="warning"><b>Warning (Twine&nbsp;2):</b>
Due to how the Twine&nbsp;2 automatic passage creation feature currently works, using the link markup form will cause a passage named <code>$return</code> to be created that will need to be deleted.  To avoid this problem, it's suggested that you use the separate argument form of the <a href="#macros-macro-link"><code>&lt;&lt;link&gt;&gt;</code> macro</a> in Twine&nbsp;2—as shown above.
</p>

<!-- *********************************************************************** -->

### Non-generic object types (a.k.a. classes) {#guide-tips-non-generic-object-types}

As a basic working definition, non-generic object types—a.k.a. classes—are instantiable objects whose own prototype is not `Object`—e.g., `Array` is a native non-generic object type.

Many of the commonly used native non-generic object types are already fully compatible with and supported for use within story variables—e.g., `Array`, `Date`, `Map`, and `Set`.  All other non-generic object types, on the other hand, must be made compatible to be successfully stored within story variables.

Making custom non-generic object types fully compatible requires that two methods be added to their prototype, `.clone()` and `.toJSON()`, to support cloning—i.e., deep copying—instances of the type.

* The `.clone()` method needs to return a clone of the instance.
* The `.toJSON()` method needs to return a code string that when evaluated will return a clone of the instance.

In both cases, since the end goal is roughly the same, this means creating a new instance of the base object type and populating it with clones of the original instance's data.  There is no one size fits all example for either of these methods because an instance's properties, and the data contained therein, are what determine what you need to do.

<p role="note" class="see"><b>See Also:</b>
The <a href="#methods-json-method-revivewrapper"><code>JSON.reviveWrapper()</code> method</a> for additional information on implementing the <code>.toJSON()</code> method.
</p>

#### Examples: *(not an exhaustive list)*

##### Config/option object parameter constructor (automatic copying of own data)

Here's a simple example whose constructor takes a single config/option object parameter:

```
window.ContactInfo = function (config) {
	// Set up our own data properties with some defaults.
	this.name    = '';
	this.address = '';
	this.phone   = '';
	this.email   = '';

	// Clone the given config object's own properties into our own properties.
	//
	// NOTE: We use the SugarCube built-in `clone()` function to make deep
	// copies of each of the properties' values.
	Object.keys(config).forEach(function (pn) {
		this[pn] = clone(config[pn]);
	}, this);
};

ContactInfo.prototype.clone = function () {
	// Return a new instance containing our own data.
	return new ContactInfo(this);
};

ContactInfo.prototype.toJSON = function () {
	// Return a code string that will create a new instance containing our
	// own data.
	//
	// NOTE: Supplying `this` directly as the `reviveData` parameter to the
	// `JSON.reviveWrapper()` call will trigger out of control recursion in
	// the serializer, so we must pass it a clone of our own data instead.
	var ownData = {};
	Object.keys(this).forEach(function (pn) {
		ownData[pn] = clone(this[pn]);
	}, this);
	return JSON.reviveWrapper('new ContactInfo($ReviveData$)', ownData);
};
```

Creating a new instance of this `ContactInfo` example would be something like:

```
<<set $Joe to new ContactInfo({
	name  : 'Joe Blow',
	phone : '1 555 555 1212',
	email : 'joe@blow.com'
})>>
```

##### Discrete parameters constructor (manual copying of own data)

Here's a simple example whose constructor takes multiple discrete parameters:

```
window.ContactInfo = function (name, addr, phone, email) {
	// Set up our own data properties with the given values or defaults.
	this.name    = name || '';
	this.address = addr || '';
	this.phone   = phone || '';
	this.email   = email || '';
};

ContactInfo.prototype.clone = function () {
	// Return a new instance containing our own data.
	return new ContactInfo(
		this.name,
		this.address,
		this.phone,
		this.email
	);
};

ContactInfo.prototype.toJSON = function () {
	// Return a code string that will create a new instance containing our
	// own data.
	return JSON.reviveWrapper(String.format(
		'new ContactInfo({0},{1},{2},{3})',
		JSON.stringify(this.name),
		JSON.stringify(this.address),
		JSON.stringify(this.phone),
		JSON.stringify(this.email)
	));
};
```

Creating a new instance of this `ContactInfo` example would be something like:

```
<<set $Joe to new ContactInfo(
	'Joe Blow',
	'',
	'1 555 555 1212',
	'joe@blow.com'
)>>
```

##### Discrete parameters constructor (automatic copying of own data)

Here's a simple example whose constructor takes multiple discrete parameters, but also includes an `._init()` helper method to allow the `.clone()` and `.toJSON()` methods to require less manual tinkering than the previous discrete parameters example by automatically copying an instance's own data:

```
window.ContactInfo = function (name, addr, phone, email) {
	// Set up our own data properties with the given values or defaults.
	this.name    = name || '';
	this.address = addr || '';
	this.phone   = phone || '';
	this.email   = email || '';
};

ContactInfo.prototype._init = function (obj) {
	// Clone the given object's own properties into our own properties.
	Object.keys(obj).forEach(function (pn) {
		this[pn] = clone(obj[pn]);
	}, this);

	// Return `this` to make usage easier.
	return this;
};

ContactInfo.prototype.clone = function () {
	// Return a new instance containing our own data.
	return (new ContactInfo())._init(this);
};

ContactInfo.prototype.toJSON = function () {
	// Return a code string that will create a new instance containing our
	// own data.
	//
	// NOTE: Supplying `this` directly as the `reviveData` parameter to the
	// `JSON.reviveWrapper()` call will trigger out of control recursion in
	// the serializer, so we must pass it a clone of our own data instead.
	var ownData = {};
	Object.keys(this).forEach(function (pn) {
		ownData[pn] = clone(this[pn]);
	}, this);
	return JSON.reviveWrapper('(new ContactInfo())._init($ReviveData$)', ownData);
};
```

Creating a new instance of this `ContactInfo` example would be something like:

```
<<set $Joe to new ContactInfo(
	'Joe Blow',
	'',
	'1 555 555 1212',
	'joe@blow.com'
)>>
```
