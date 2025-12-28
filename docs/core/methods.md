<!-- ***********************************************************************************************
	Methods
************************************************************************************************ -->
# Methods {#methods}

Most of the methods listed below are SugarCube extensions, with the rest being either JavaScript built-ins or bundled library methods that are listed here for their utility—though, this is not an exhaustive list.

For more information see:

* [MDN's JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) for JavaScript built-in methods—and more.
* [jQuery API reference](https://api.jquery.com/) for jQuery built-in methods.


<!-- ***************************************************************************
	Array
**************************************************************************** -->
## Array Methods {#methods-array}

<!-- *********************************************************************** -->

### `<Array>.concat(members…)` → `Array<any>` {#methods-array-prototype-method-concat}

Concatenates one or more members to the end of the base array and returns the result as a new array.  Does not modify the original.

#### History: *JavaScript built-in*

#### Parameters:

* **`members`:** (`any`…) The members to concatenate.  Members that are arrays will be merged—i.e., their members will be concatenated, rather than the array itself.

#### Returns:

A new `Array` formed from concatenating all array members in order.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits1 to ['Apples', 'Oranges']>>
<<set $fruits2 to ['Pears', 'Plums']>>

<<set $result to $fruits1.concat($fruits2)>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Plums'] */

<<set $result to $fruits1.concat($fruits2, $fruits2)>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Plums', 'Pears', 'Plums'] */

<<set $result to $fruits1.concat('Pears')>>
/* Returns ['Apples', 'Oranges', 'Pears'] */

<<set $result to $fruits1.concat('Pears', 'Pears')>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Pears'] */

<<set $result to $fruits1.concat($fruits2, 'Pears')>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Plums', 'Pears'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits1 = ['Apples', 'Oranges'];
let fruits2 = ['Pears', 'Plums'];

let result = fruits1.concat(fruits2);
// Returns ['Apples', 'Oranges', 'Pears', 'Plums']

let result = fruits1.concat(fruits2, fruits2);
// Returns ['Apples', 'Oranges', 'Pears', 'Plums', 'Pears', 'Plums']

let result = fruits1.concat('Pears');
// Returns ['Apples', 'Oranges', 'Pears']

let result = fruits1.concat('Pears', 'Pears');
// Returns ['Apples', 'Oranges', 'Pears', 'Pears']

let result = fruits1.concat(fruits2, 'Pears');
// Returns ['Apples', 'Oranges', 'Pears', 'Plums', 'Pears']
```

<!-- *********************************************************************** -->

### `<Array>.concatUnique(members…)` → `Array<any>` {#methods-array-prototype-method-concatunique}

Concatenates one or more unique members to the end of the base array and returns the result as a new array.  Does not modify the original.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`members`:** (`any`…) The members to concatenate.  Members that are arrays will be merged—i.e., their members will be concatenated, rather than the array itself.

#### Returns:

A new `Array` formed from concatenating all unique array members in order.

#### Examples:

##### Basic usage (in macros):

```
/* Given the following: */
<<set $fruits1 to ['Apples', 'Oranges']>>
<<set $fruits2 to ['Pears', 'Plums']>>

<<set $result to $fruits1.concatUnique($fruits2)>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Plums'] */

<<set $result to $fruits1.concatUnique($fruits2, $fruits2)>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Plums'] */

<<set $result to $fruits1.concatUnique('Pears')>>
/* Returns ['Apples', 'Oranges', 'Pears'] */

<<set $result to $fruits1.concatUnique('Pears', 'Pears')>>
/* Returns ['Apples', 'Oranges', 'Pears'] */

<<set $result to $fruits1.concatUnique($fruits2, 'Pears')>>
/* Returns ['Apples', 'Oranges', 'Pears', 'Plums'] */
```

##### Basic usage (in JavaScript):

```javascript
// Given the following:
let fruits1 = ['Apples', 'Oranges'];
let fruits2 = ['Pears', 'Plums'];

let result = fruits1.concatUnique(fruits2);
// Returns ['Apples', 'Oranges', 'Pears', 'Plums']

let result = fruits1.concatUnique(fruits2, fruits2);
// Returns ['Apples', 'Oranges', 'Pears', 'Plums']

let result = fruits1.concatUnique('Pears');
// Returns ['Apples', 'Oranges', 'Pears']

let result = fruits1.concatUnique('Pears', 'Pears');
// Returns ['Apples', 'Oranges', 'Pears']

let result = fruits1.concatUnique(fruits2, 'Pears');
// Returns ['Apples', 'Oranges', 'Pears', 'Plums']
```

<!-- *********************************************************************** -->

### `<Array>.count(needle [, position])` → *integer* `number` {#methods-array-prototype-method-count}

Returns the number of times that the given member was found within the array, starting the search at `position`.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`needle`:** (`any`) The member to count.
* **`position`:** (optional, *integer* `number`) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Returns:

An *integer* `number` whose value is the number of times the given member was found within the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Oranges']>>

<<set $result to $fruits.count('Oranges')>>
/* Returns 2 */

<<set $result to $fruits.count('Oranges', 2)>>
/* Returns 1 */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Oranges'];

let result = fruits.count('Oranges');
// Returns 2

let result = fruits.count('Oranges', 2);
// Returns 1
```

<!-- *********************************************************************** -->

### `<Array>.countWith(predicate [, thisArg])` → *integer* `number` {#methods-array-prototype-method-countwith}

Returns the number of times that members within the array pass the test implemented by the given predicate function.

#### History:

* `v2.36.0`: Introduced.

#### Parameters:

* **`predicate`:** (`Function`) The function used to test each member.  It is called with three arguments:
	* **`value`:** (`any`) The member being processed.
	* **`index`:** (optional, *integer* `number`) The index of member being processed.
	* **`array`:** (optional, `array`) The array being processed.
* **`thisArg`:** (optional, `any`) The value to use as `this` when executing `predicate`.

#### Returns:

An *integer* `number` whose value is the number of times members passed the test.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Oranges']>>

<<set $result to $fruits.countWith((fruit) => fruit === 'Oranges')>>
/* Returns 2 */
```

```
/* Given the following: */
<<set $numbers to [1, 2.3, 4, 76, 3.1]>>

<<set $result to $numbers.countWith(Number.isInteger)>>
/* Returns 3 */
```

```
/* Given the following: */
<<set $items to [
	{ name : 'Arming sword',   kind : 'weapon' },
	{ name : 'Crested helm',   kind : 'armor' },
	{ name : 'Dead rat',       kind : 'junk' },
	{ name : 'Healing potion', kind : 'potion' }
]>>

<<set $result to $items.countWith((item) => item.kind === 'junk')>>
/* Returns 1 */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Oranges'];

let result = fruits.countWith((fruit) => fruit === 'Oranges');
// Returns 2
```

```javascript
// Given the following:
let numbers = [1, 2.3, 4, 76, 3.1];

let result = numbers.countWith(Number.isInteger);
// Returns 3
```

```javascript
// Given the following:
let items = [
	{ name : 'Arming sword',   kind : 'weapon' },
	{ name : 'Crested helm',   kind : 'armor' },
	{ name : 'Dead rat',       kind : 'junk' },
	{ name : 'Healing potion', kind : 'potion' }
];

let result = items.countWith((item) => item.kind === 'junk');
// Returns 1
```

<!-- *********************************************************************** -->

### `<Array>.deleteAll(needles…)` → `Array<any>` {#methods-array-prototype-method-deleteall}

Removes all instances of the given members from the array and returns a new array containing the removed members.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`needles`:** (`any`… | `Array<any>`) The members to remove.  May be a list of members or an array.

#### Returns:

A new `Array` containing the removed members.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Oranges']>>

<<set $result to $fruits.deleteAll('Oranges')>>
/* Returns ['Oranges', 'Oranges'] */
/* $fruits ['Apples', 'Plums'] */

<<set $result to $fruits.deleteAll('Apples', 'Plums')>>
/* Returns ['Apples', 'Plums'] */
/* $fruits ['Oranges', 'Oranges'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Oranges'];

let result = fruits.deleteAll('Oranges');
// Returns ['Oranges', 'Oranges']
// $fruits ['Apples', 'Plums']

let result = fruits.deleteAll('Apples', 'Plums');
// Returns ['Apples', 'Plums']
// $fruits ['Oranges', 'Oranges']
```

<!-- *********************************************************************** -->

### `<Array>.deleteAt(indices…)` → `Array<any>` {#methods-array-prototype-method-deleteat}

Removes all of the members at the given indices from the array and returns a new array containing the removed members.

#### History:

* `v2.5.0`: Introduced.

#### Parameters:

* **`indices`:** (*integer* `number`… | *integers* `Array<number>`) The indices of the members to remove.  May be a list or array of indices.

#### Returns:

A new `Array` containing the removed members.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Oranges']>>

<<set $result to $fruits.deleteAt(2)>>
/* Returns ['Plums'] */
/* $fruits ['Apples', 'Oranges', 'Oranges'] */

<<set $result to $fruits.deleteAt(1, 3)>>
/* Returns ['Oranges', 'Oranges'] */
/* $fruits ['Apples', 'Plums'] */

<<set $result to $fruits.deleteAt(0, 2)>>
/* Returns ['Apples', 'Plums'] */
/* $fruits ['Oranges', 'Oranges'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Oranges'];

let result = fruits.deleteAt(2);
// Returns ['Plums']
// fruits ['Apples', 'Oranges', 'Oranges']

let result = fruits.deleteAt(1, 3);
// Returns ['Oranges', 'Oranges']
// fruits ['Apples', 'Plums']

let result = fruits.deleteAt(0, 2);
// Returns ['Apples', 'Plums']
// fruits ['Oranges', 'Oranges']
```

<!-- *********************************************************************** -->

### `<Array>.deleteFirst(needles…)` → `Array<any>` {#methods-array-prototype-method-deletefirst}

Removes the first instance of the given members from the array and returns a new array containing the removed members.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`needles`:** (`any`… | `Array<any>`) The members to remove.  May be a list of members or an array.

#### Returns:

A new `Array` containing the removed members.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Oranges']>>

<<set $result to $fruits.deleteFirst('Oranges')>>
/* Returns ['Oranges'] */
/* $fruits ['Apples', 'Plums', 'Oranges'] */

<<set $result to $fruits.deleteFirst('Apples', 'Plums')>>
/* Returns ['Apples', 'Plums'] */
/* $fruits ['Oranges', 'Oranges'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Oranges'];

let result = fruits.deleteFirst('Oranges');
// Returns ['Oranges']
// fruits ['Apples', 'Plums', 'Oranges']

let result = fruits.deleteFirst('Apples', 'Plums');
// Returns ['Apples', 'Plums']
// fruits ['Oranges', 'Oranges']
```

<!-- *********************************************************************** -->

### `<Array>.deleteLast(needles…)` → `Array<any>` {#methods-array-prototype-method-deletelast}

Removes the last instance of the given members from the array and returns a new array containing the removed members.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`needles`:** (`any`… | `Array<any>`) The members to remove.  May be a list of members or an array.

#### Returns:

A new `Array` containing the removed members.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Oranges']>>

<<set $result to $fruits.deleteLast('Oranges')>>
/* Returns ['Oranges'] */
/* $fruits ['Apples', 'Oranges', 'Plums'] */

<<set $result to $fruits.deleteLast('Apples', 'Plums')>>
/* Returns ['Apples', 'Plums'] */
/* $fruits ['Oranges', 'Oranges'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Oranges'];

let result = fruits.deleteLast('Oranges');
// Returns ['Oranges']
// fruits ['Apples', 'Oranges', 'Plums']

let result = fruits.deleteLast('Apples', 'Plums');
// Returns ['Apples', 'Plums']
// fruits ['Oranges', 'Oranges']
```

<!-- *********************************************************************** -->

### `<Array>.deleteWith(predicate [, thisArg])` → `Array<any>` {#methods-array-prototype-method-deletewith}

Removes all of the members from the array that pass the test implemented by the given predicate function and returns a new array containing the removed members.

#### History:

* `v2.25.0`: Introduced.

#### Parameters:

* **`predicate`:** (`Function`) The function used to test each member.  It is called with three arguments:
	* **`value`:** (`any`) The member being processed.
	* **`index`:** (optional, *integer* `number`) The index of member being processed.
	* **`array`:** (optional, `array`) The array being processed.
* **`thisArg`:** (optional, `any`) The value to use as `this` when executing `predicate`.

#### Returns:

A new `Array` containing the removed members.

#### Examples:

##### Basic usage (in macros)

Usage with primitive values.

```
/* Given the following: */
<<set $fruits to ['Apples', 'Apricots', 'Oranges']>>

$fruits.deleteWith((val) => val === 'Apricots')
/* Returns ['Apricots'] */
/* $fruits ['Apples', 'Oranges'] */

$fruits.deleteWith((val) => val.startsWith('Ap'))
/* Returns ['Apples', 'Apricots'] */
/* $fruits ['Oranges'] */
```

Usage with object values.

```
/* Given the following: */
<<set $fruits to [{ name : 'Apples' }, { name : 'Apricots' }, { name : 'Oranges' }]>>

$fruits.deleteWith((val) => val.name === 'Apricots')
/* Returns [{ name : 'Apricots' }] */
/* $fruits [{ name : 'Apples' }, { name : 'Oranges' }] */

$fruits.deleteWith((val) => val.name.startsWith('Ap'))
/* Returns [{ name : 'Apples' }, { name : 'Apricots' }] */
/* $fruits [{ name : 'Oranges' }] */
```

##### Basic usage (in JavaScript)

Usage with primitive values.

```javascript
// Given the following:
let fruits = ['Apples', 'Apricots', 'Oranges'];

let result = fruits.deleteWith((val) => val === 'Apricots');
// Returns ['Apricots']
// fruits ['Apples', 'Oranges']

let result = fruits.deleteWith((val) => val.startsWith('Ap'));
// Returns ['Apples', 'Apricots']
// fruits ['Oranges']
```

Usage with object values.

```javascript
// Given the following:
let fruits = [{ name : 'Apples' }, { name : 'Apricots' }, { name : 'Oranges' }];

let result = fruits.deleteWith((val) => val.name === 'Apricots');
// Returns [{ name : 'Apricots' }]
// fruits [{ name : 'Apples' }, { name : 'Oranges' }]

let result = fruits.deleteWith((val) => val.name.startsWith('Ap'));
// Returns [{ name : 'Apples' }, { name : 'Apricots' }]
// fruits [{ name : 'Oranges' }]
```

<!-- *********************************************************************** -->

### `<Array>.first()` → `any` {#methods-array-prototype-method-first}

Returns the first member from the array.  Does not modify the original.

#### History:

* `v2.27.0`: Introduced.

#### Parameters: *none*

The first member's value (`any`).

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

<<set $result to $pies.first()>>
/* Returns 'Blueberry' */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

let result = pies.first();
// Returns 'Blueberry'
```

<!-- *********************************************************************** -->

### `<Array>.flat(depth)` → `Array<any>` {#methods-array-prototype-method-flat}

Returns a new array consisting of the source array with all sub-array elements concatenated into it recursively up to the given depth.  Does not modify the original.

#### History: *JavaScript built-in*

#### Parameters:

* **`depth`:** (optional, *integer* `number`) The number of nested array levels should be flattened.  If omitted, will default to `1`.

#### Returns:

A new `Array` consisting of all members flattened up to the given depth.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $npa to [['Alfa', 'Bravo'], [[['Charlie'], 'Delta'], ['Echo']], 'Foxtrot']>>

<<set $result to $npa.flat()>>
/* Returns ['Alfa', 'Bravo', [['Charlie'], 'Delta'], ['Echo'], 'Foxtrot'] */

<<set $result to $npa.flat(1)>>
/* Returns ['Alfa', 'Bravo', [['Charlie'], 'Delta'], ['Echo'], 'Foxtrot'] */

<<set $result to $npa.flat(2)>>
/* Returns ['Alfa', 'Bravo', ['Charlie'], 'Delta', 'Echo', 'Foxtrot'] */

<<set $result to $npa.flat(Infinity)>>
/* Returns ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let npa = [['Alfa', 'Bravo'], [[['Charlie'], 'Delta'], ['Echo']], 'Foxtrot'];

let result = npa.flat();
// Returns ['Alfa', 'Bravo', [['Charlie'], 'Delta'], ['Echo'], 'Foxtrot']

let result = npa.flat(1);
// Returns ['Alfa', 'Bravo', [['Charlie'], 'Delta'], ['Echo'], 'Foxtrot']

let result = npa.flat(2);
// Returns ['Alfa', 'Bravo', ['Charlie'], 'Delta', 'Echo', 'Foxtrot']

let result = npa.flat(Infinity);
// Returns ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']
```

<!-- *********************************************************************** -->

### `<Array>.flatMap(callback [, thisArg])` → `Array<any>` {#methods-array-prototype-method-flatmap}

Returns a new array consisting of the result of calling the given mapping function on every element in the source array and then concatenating all sub-array elements into it recursively up to a depth of `1`.  Does not modify the original.

<p role="note"><b>Note:</b>
Identical to calling <code>&lt;Array&gt;.map(…).flat()</code>.
</p>

#### History: *JavaScript built-in*

#### Parameters:

* **`callback`:** (`Function`) The function used to produce members of the new array.  It is called with three arguments:
	* **`value`:** (`any`) The member being processed.
	* **`index`:** (optional, *integer* `number`) The index of member being processed.
	* **`array`:** (optional, `array`) The array being processed.
* **`thisArg`:** (optional, `any`) The value to use as `this` when executing `callback`.

#### Returns:

A new `Array` consisting of all members flattened up to the given depth.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $npa to ['Alfa', 'Bravo Charlie', 'Delta Echo Foxtrot']>>

<<set $result to $npa.flatMap((val) => val.split(' '))>>
/* Returns ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let npa = ['Alfa', 'Bravo Charlie', 'Delta Echo Foxtrot'];

let result = npa.flatMap((val) => val.split(' '));
// Returns ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']
```

<!-- *********************************************************************** -->

### `<Array>.includes(needle [, position])` → `boolean` {#methods-array-prototype-method-includes}

Returns whether the given member was found within the array, starting the search at `position`.

#### History: *JavaScript built-in*

#### Parameters:

* **`needle`:** (`any`) The member to find.
* **`position`:** (optional, *integer* `number`) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Returns:

A `boolean` denoting whether the given member was found within the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

<<set $result to $pies.includes('Cherry')>>
/* Returns true */

<<set $result to $pies.includes('Pecan', 3)>>
/* Returns true */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

let result = pies.includes('Cherry');
// Returns true

let result = pies.includes('Pecan', 3);
// Returns true
```

<!-- *********************************************************************** -->

### `<Array>.includesAll(needles…)` → `boolean` {#methods-array-prototype-method-includesall}

Returns whether all of the given members were found within the array.

#### History:

* `v2.10.0`: Introduced.

#### Parameters:

* **`needles`:** (`any`… | `Array<any>`) The members to find.  May be a list of members or an array.

#### Returns:

A `boolean` denoting whether all of the given members were found within the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

<<set $result to $pies.includesAll('Cherry', 'Raspberry')>>
/* Returns false */

<<set $result to $pies.includesAll('Blueberry', 'Cream')>>
/* Returns true */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

let result = pies.includesAll('Cherry', 'Raspberry');
// Returns false

let result = pies.includesAll('Blueberry', 'Cream');
// Returns true
```

<!-- *********************************************************************** -->

### `<Array>.includesAny(needles…)` → `boolean` {#methods-array-prototype-method-includesany}

Returns whether any of the given members were found within the array.

#### History:

* `v2.10.0`: Introduced.

#### Parameters:

* **`needles`:** (`any`… | `Array<any>`) The members to find.  May be a list of members or an array.

#### Returns:

A `boolean` denoting whether any of the given members were found within the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

<<set $result to $pies.includesAny('Cherry', 'Coconut')>>
/* Returns true */

<<set $result to $pies.includesAny('Coconut')>>
/* Returns false */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

let result = pies.includesAny('Cherry', 'Coconut');
// Returns true

let result = pies.includesAny('Coconut');
// Returns false
```

<!-- *********************************************************************** -->

### `<Array>.last()` → `any` {#methods-array-prototype-method-last}

Returns the last member from the array.  Does not modify the original.

#### History:

* `v2.27.0`: Introduced.

#### Parameters: *none*

#### Returns:

The last member's value (`any`).

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

<<set $result to $pies.last()>>
/* Returns 'Pumpkin' */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

let result = $pies.last();
// Returns 'Pumpkin'
```

<!-- *********************************************************************** -->

### `<Array>.pluck()` → `any` {#methods-array-prototype-method-pluck}

Removes and returns a random member from the base array.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns:

The removed member's value (`any`).

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

<<set $result to $pies.pluck()>>
/* Removes and returns a random pie from the array */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

// Removes and returns a random pie from the array
let result = $pies.pluck();
```

<!-- *********************************************************************** -->

### `<Array>.pluckMany(want)` → `Array<any>` {#methods-array-prototype-method-pluckmany}

Randomly removes the given number of members from the base array and returns the removed members as a new array.

#### History:

* `v2.20.0`: Introduced.

#### Parameters:

* **`want`:** (*integer* `number`) The number of members to pluck.  Cannot pluck more members than the base array contains.

#### Returns:

A new `Array` containing the randomly removed members.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']

/* Removes three random pies from the array and returns them as a new array */
<<set $result to $pies.pluckMany(3)>>
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

// Removes three random pies from the array and returns them as a new array
let result = pies.pluckMany(3);
```

<!-- *********************************************************************** -->

### `<Array>.pop()` → `any` {#methods-array-prototype-method-pop}

Removes and returns the last member from the array, or `undefined` if the array is empty.

#### History: *JavaScript built-in*

#### Parameters: *none*

#### Returns:

The last member's value (`any`).

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Pears']>>

<<set $result to $fruits.pop()>>
/* Returns 'Pears' */
/* $fruits ['Apples', 'Oranges'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Pears'];

let result = fruits.pop();
// Returns 'Pears'
// fruits ['Apples', 'Oranges']
```

<!-- *********************************************************************** -->

### `<Array>.push(members…)` → *integer* `number` {#methods-array-prototype-method-push}

Appends one or more members to the end of the base array and returns its new length.

#### History: *JavaScript built-in*

#### Parameters:

* **`members`:** (`any`…) The members to append.

#### Returns:

An *integer* `number` whose value is the new length of the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges']>>

<<set $result to $fruits.push('Apples')>>
/* Returns 3 */
/* $fruits ['Apples', 'Oranges', 'Apples'] */

<<set $result to $fruits.push('Plums', 'Plums')>>
/* Returns 4 */
/* $fruits ['Apples', 'Oranges', 'Plums', 'Plums'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges'];

let result = fruits.push('Apples');
// Returns 3
// fruits ['Apples', 'Oranges', 'Apples']

let result = fruits.push('Plums', 'Plums');
// Returns 4
// fruits ['Apples', 'Oranges', 'Plums', 'Plums']
```

<!-- *********************************************************************** -->

### `<Array>.pushUnique(members…)` → *integer* `number` {#methods-array-prototype-method-pushunique}

Appends one or more unique members to the end of the base array and returns its new length.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`members`:** (`any`…) The members to append.

#### Returns:

An *integer* `number` whose value is the new length of the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges']>>

<<set $result to $fruits.pushUnique('Apples')>>
/* Returns 2 */
/* $fruits ['Apples', 'Oranges'] */

<<set $result to $fruits.pushUnique('Plums', 'Plums')>>
/* Returns 3 */
/* $fruits ['Apples', 'Oranges', 'Plums'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges'];

let result = fruits.pushUnique('Apples');
// Returns 2
// fruits ['Apples', 'Oranges']

let result = fruits.pushUnique('Plums', 'Plums');
// Returns 3
// fruits ['Apples', 'Oranges', 'Plums']
```

<!-- *********************************************************************** -->

### `<Array>.random()` → `any` {#methods-array-prototype-method-random}

Returns a random member from the base array.  Does not modify the original.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns:

The selected member's value (`any`).

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

/* Returns a random pie from the array */
<<set $result to $pies.random()>>
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

// Returns a random pie from the array
let result = pies.random();
```

<!-- *********************************************************************** -->

### `<Array>.randomMany(want)` → `Array<any>` {#methods-array-prototype-method-randommany}

Randomly selects the given number of unique members from the base array and returns the selected members as a new array.  Does not modify the original.

#### History:

* `v2.20.0`: Introduced.

#### Parameters:

* **`want`:** (*integer* `number`) The number of members to select.  Cannot select more members than the base array contains.

#### Returns:

A new `Array` containing the randomly selected members.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

/* Returns a new array containing three unique random pies from the array */
<<set $result to $pies.randomMany(3)>>
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

// Returns a new array containing three unique random pies from the array
let result = pies.randomMany(3);
```

<!-- *********************************************************************** -->

### `<Array>.shift()` → `any` {#methods-array-prototype-method-shift}

Removes and returns the first member from the array, or `undefined` if the array is empty.

#### History: *JavaScript built-in*

#### Parameters: *none*

#### Returns:

The first member's value (`any`) or `undefined`, if the array is empty.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Pears']>>

<<set $result to $fruits.shift()>>
/* Returns 'Apples' */
/* $fruits ['Oranges', 'Pears'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Pears'];

let result = fruits.shift();
// Returns 'Apples'
// fruits ['Oranges', 'Pears']
```

<!-- *********************************************************************** -->

### `<Array>.shuffle()` → `Array<any>` {#methods-array-prototype-method-shuffle}

Randomly shuffles the array.

#### History:

* `v2.0.0`: Introduced.

#### Parameters: *none*

#### Returns:

The original `Array` randomly shuffled.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

/* Randomizes the order of the array */
<<run $pies.shuffle()>>
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

// Randomizes the order of the array
pies.shuffle();
```

<!-- *********************************************************************** -->

### `<Array>.toShuffled()` → `Array<any>` {#methods-array-prototype-method-toshuffled}

Returns a new copy of the base array created by shuffling the array.  Does not modify the original.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

A new `Array` consisting of the original array randomly shuffled.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $pies to ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin']>>

/* Randomizes the order of the array without modifying the original */
<<set $result to $pies.toShuffled()>>
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let pies = ['Blueberry', 'Cherry', 'Cream', 'Pecan', 'Pumpkin'];

// Randomizes the order of the array without modifying the original
let result = pies.toShuffled();
```

<!-- *********************************************************************** -->

### `<Array>.toUnique()` → `Array<any>` {#methods-array-prototype-method-tounique}

Returns a new copy of the base array created by removing all duplicate members.  Does not modify the original.

#### History:

* `v2.37.0`: Introduced.

#### Parameters: *none*

#### Returns:

A new `Array` consisting of the original array with all duplicates removed.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Apples', 'Oranges', 'Plums', 'Plums', 'Apples']>>

<<set $result to $fruits.toUnique()>>
/* Returns ['Apples', 'Oranges', 'Plums'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Apples', 'Oranges', 'Plums', 'Plums', 'Apples'];

let result = fruits.toUnique();
// Returns ['Apples', 'Oranges', 'Plums']
```

<!-- *********************************************************************** -->

### `<Array>.unshift(members…)` → *integer* `number` {#methods-array-prototype-method-unshift}

Prepends one or more members to the beginning of the base array and returns its new length.

#### History: *JavaScript built-in*

#### Parameters:

* **`members`:** (`any`…) The members to append.

#### Returns:

An *integer* `number` whose value is the new length of the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Oranges', 'Plums']>>

<<set $result to $fruits.unshift('Oranges')>>
/* Returns 3 */
/* $fruits ['Oranges', 'Oranges', 'Plums'] */

<<set $result to $fruits.unshift('Apples', 'Apples')>>
/* Returns 4 */
/* $fruits ['Apples', 'Apples', 'Oranges', 'Plums'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Oranges', 'Plums'];

let result = fruits.unshift('Oranges');
// Returns 3
// fruits ['Oranges', 'Oranges', 'Plums']

let result = fruits.unshift('Apples', 'Apples');
// Returns 4
// fruits ['Apples', 'Apples', 'Oranges', 'Plums']
```

<!-- *********************************************************************** -->

### `<Array>.unshiftUnique(members…)` → *integer* `number` {#methods-array-prototype-method-unshiftunique}

Prepends one or more unique members to the beginning of the base array and returns its new length.

#### History:

* `v2.21.0`: Introduced.

#### Parameters:

* **`members`:** (`any`…) The members to append.

#### Returns:

An *integer* `number` whose value is the new length of the array.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $fruits to ['Oranges', 'Plums']>>

<<set $result to $fruits.unshiftUnique('Oranges')>>
/* Returns 2 */
/* $fruits ['Oranges', 'Plums'] */

<<set $result to $fruits.unshiftUnique('Apples', 'Apples')>>
/* Returns 3 */
/* $fruits ['Apples', 'Oranges', 'Plums'] */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let fruits = ['Oranges', 'Plums'];

let result = fruits.unshiftUnique('Oranges');
// Returns 2
// fruits ['Oranges', 'Plums']

let result = fruits.unshiftUnique('Apples', 'Apples');
// Returns 3
// fruits ['Apples', 'Oranges', 'Plums']
```

<!-- *********************************************************************** -->

### <span class="deprecated">`<Array>.delete(needles…)` → `Array<any>` {#methods-array-prototype-method-delete}

<p role="note" class="warning"><b>Deprecated:</b>
This instance method has been deprecated and should no longer be used.  See the <a href="#methods-array-prototype-method-deleteall"><code>&lt;Array&gt;.deleteAll()</code></a> instance method.
</p>

#### History:

* `v2.5.0`: Introduced.
* `v2.37.0`: Deprecated in favor of `<Array>.deleteAll()`.


<!-- ***************************************************************************
	jQuery
**************************************************************************** -->
## jQuery Methods {#methods-jquery}

<!-- *********************************************************************** -->

### `<jQuery>.ariaClick([options ,] handler)` → `jQuery` {#methods-jquery-prototype-method-ariaclick}

Makes the target element(s) WAI-ARIA-compatible clickables—meaning that various accessibility attributes are set and, in addition to mouse clicks, enter/return and spacebar key presses also activate them.  Returns a reference to the current `jQuery` instance for chaining.

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Add `tabindex` option.

#### Parameters:

* **`options`:** (optional, `Object`) The options to be used when creating the clickables.  See below for details.
* **`handler`:** (`Function`) The callback to invoke when the target element(s) are activated.

#### Options object:

An options object should have some of the following properties:

* **`namespace`:** (`string`) A period-separated list of event namespaces.
* **`one`:** (`boolean`) Whether the clickables are single-use—i.e., the handler callback runs only once and then removes itself.  If omitted, defaults to `false`.
* **`selector`:** (`string`) A selector applied to the target element(s) to filter the descendants that triggered the event. If omitted or `null`, the event is always handled when it reaches the target element(s).
* **`data`:** (`any`) Data to be passed to the handler in [`event.data`](http://api.jquery.com/event.data/) when an event is triggered.
* **`tabindex`:** (*integer* `number`) Value for the `tabindex` attribute.  If omitted, defaults to `0`.
* **`controls`:** (`string`) Value for the `aria-controls` attribute.
* **`pressed`:** (`string`) Value for the `aria-pressed` attribute (valid values: `"true"`, `"false"`).
* **`label`:** (`string`) Value for the `aria-label` and `title` attributes.

#### Returns:

The current `jQuery` instance.

#### Examples:

##### Basic usage (in macros)

<p role="note"><b>Note:</b>
The macro examples would be exactly the same as the JavaScript examples, just wrapped in a <code>&lt;&lt;script&gt;&gt;</code> macro.
</p>

##### Basic usage (in JavaScript)

```javascript
// Given an existing element: <a id="so-clicky">Click me</a>
$('#so-clicky').ariaClick((event) => {
	/* do stuff */
});

// Creates a basic link and appends it to the `output` element
$('<a>Click me</a>')
	.ariaClick((event) => {
		/* do stuff */
	})
	.appendTo(output);

// Creates a basic button and appends it to the `output` element
$('<button>Click me</button>')
	.ariaClick((event) => {
		/* do stuff */
	})
	.appendTo(output);

// Creates a link with options and appends it to the `output` element
$('<a>Click me</a>')
	.ariaClick({
		one   : true,
		label : 'This single-use link does stuff.'
	}, (event) => {
		/* do stuff */
	})
	.appendTo(output);
```

<!-- *********************************************************************** -->

### `<jQuery>.ariaDisabled(state)` → `jQuery` {#methods-jquery-prototype-method-ariadisabled}

Changes the disabled state of the target WAI-ARIA-compatible clickable element(s).  Returns a reference to the current `jQuery` instance for chaining.

<p role="note"><b>Note:</b>
This method is meant to work with clickables created via <a href="#methods-jquery-prototype-method-ariaclick"><code>&lt;jQuery&gt;.ariaClick()</code></a> and may not work with clickables from other sources.  SugarCube uses <code>&lt;jQuery&gt;.ariaClick()</code> internally to handle all of its various link markup and macros.
</p>

#### History:

* `v2.26.0`: Introduced.

#### Parameters:

* **`state`:** (`boolean`) The disabled state to apply.  Truthy to disable the element(s), falsy to enable them.

#### Returns:

The current `jQuery` instance.

#### Examples:

##### Basic usage (in macros)

```
/* Given an existing WAI-ARIA-compatible clickable element with the ID "so-clicky" */

/* Disables the target element */
<<run $('#so-clicky').ariaDisabled(true)>>

/* Enables the target element */
<<run $('#so-clicky').ariaDisabled(false)>>
````

##### Basic usage (in JavaScript)

```javascript
/* Given an existing WAI-ARIA-compatible clickable element with the ID "so-clicky" */

// Disables the target element
$('#so-clicky').ariaDisabled(true);

// Enables the target element
$('#so-clicky').ariaDisabled(false);
````

<!-- *********************************************************************** -->

### `<jQuery>.ariaIsDisabled()` → `boolean` {#methods-jquery-prototype-method-ariaisdisabled}
Returns whether any of the target WAI-ARIA-compatible clickable element(s) are disabled.

<p role="note"><b>Note:</b>
This method is meant to work with clickables created via <a href="#methods-jquery-prototype-method-ariaclick"><code>&lt;jQuery&gt;.ariaClick()</code></a> and may not work with clickables from other sources.  SugarCube uses <code>&lt;jQuery&gt;.ariaClick()</code> internally to handle all of its various link markup and macros.
</p>

#### History:

* `v2.26.0`: Introduced.

#### Parameters: *none*

#### Returns:

A `boolean` denoting whether any of the elements are disabled.

#### Examples:

##### Basic usage (in macros)

```javascript
/* Given an existing WAI-ARIA-compatible clickable element with the ID "so-clicky" */

<<set $result to $('#so-clicky').ariaIsDisabled()>>
/* Returns true, if "#so-clicky" is disabled */

<<set $result to $('#so-clicky').ariaIsDisabled()>>
/* Returns false, if "#so-clicky" is enabled */
```

##### Basic usage (in JavaScript)

```javascript
/* Given an existing WAI-ARIA-compatible clickable element with the ID "so-clicky" */

let result = $('#so-clicky').ariaIsDisabled();
// Returns true, if "#so-clicky" is disabled

let result = $('#so-clicky').ariaIsDisabled();
// Returns false, if "#so-clicky" is enabled
```

<!-- *********************************************************************** -->

### `jQuery.wiki(sources…)` {#methods-jquery-method-wiki}

Wikifies the given content source(s) and discards the result.  If there were errors, an exception is thrown.  This is only really useful when you want to invoke a macro for its side-effects and aren't interested in its output.

#### History:

* `v2.17.0`: Introduced.

#### Parameters:

* **`sources`:** (`string`…) The list of content sources.

#### Returns: *none*

#### Examples:

##### Basic usage (in macros)

```
/* Invokes the <<somemacro>> macro, discarding any output */
<<run $.wiki('<<somemacro>>')>>
```

##### Basic usage (in JavaScript)

```javascript
// Invokes the <<somemacro>> macro, discarding any output
$.wiki('<<somemacro>>');
```

<!-- *********************************************************************** -->

### `jQuery.wikiPassage(passageName)` {#methods-jquery-method-wikipassage}

Wikifies the passage by the given name and discards the result.  If there were errors, an exception is thrown.  This is only really useful when you want to invoke a macro for its side-effects and aren't interested in its output.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`passageName`:** (`string`) The name of the passage.

#### Returns: *none*

#### Examples:

##### Basic usage (in macros)

```
/* Renders the passage, discarding any output */
<<run $.wikiPassage('Fight Init')>>
```

##### Basic usage (in JavaScript)

```javascript
// Renders the passage, discarding any output
$.wikiPassage('Fight Init');
```

<!-- *********************************************************************** -->

### `<jQuery>.wiki(sources…)` → `jQuery` {#methods-jquery-prototype-method-wiki}

Wikifies the given content source(s) and appends the result to the target element(s).  Returns a reference to the current `jQuery` instance for chaining.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`sources`:** (`string`…) The list of content sources.

#### Returns:

The current `jQuery` instance.

#### Examples:

##### Basic usage (in macros)

```
/* Given an element: <div id="the-box"></div> */

/* Appends "Who <em>are</em> you?" to the target element */
<<run $('#the-box').wiki('Who //are// you?')>>
```

##### Basic usage (in JavaScript)

```javascript
/* Given an element: <div id="the-box"></div> */

// Appends "Who <em>are</em> you?" to the target element
$('#the-box').wiki('Who //are// you?');
```

<!-- *********************************************************************** -->

### `<jQuery>.wikiPassage(passageName)` → `jQuery` {#methods-jquery-prototype-method-wikipassage}

Wikifies the passage by the given name and appends the result to the target element(s).  Returns a reference to the current `jQuery` instance for chaining.

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`passageName`:** (`string`) The name of the passage.

#### Returns:

The current `jQuery` instance.

#### Examples:

##### Basic usage (in macros)

```
/* Given an element: <div id="notebook"></div> */

/* Appends the rendered passage to the target element */
<<run $('#notebook').wikiPassage('Notes')>>
```

##### Basic usage (in JavaScript)

```javascript
/* Given an element: <div id="notebook"></div> */

// Appends the rendered passage to the target element
$('#notebook').wikiPassage('Notes');
```


<!-- ***************************************************************************
	JSON
**************************************************************************** -->
## JSON Methods {#methods-json}

<!-- *********************************************************************** -->

### <span class="deprecated">`JSON.reviveWrapper(code [, data])` → `Array`</span> {#methods-json-method-revivewrapper}

<p role="note" class="warning"><b>Deprecated:</b>
This static method has been deprecated and should no longer be used.  See the <a href="#methods-serial-method-createreviver"><code>Serial.createReviver()</code></a> static method.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.9.0`: Added `data` parameter.
* `v2.37.0`: Deprecated in favor of `Serial.createReviver()`.


<!-- ***************************************************************************
	Math
**************************************************************************** -->
## Math Methods {#methods-math}

<!-- *********************************************************************** -->

### `Math.clamp(num , min , max)` → `number` {#methods-math-method-clamp}

Returns the given number clamped to the specified bounds.  Does not modify the original.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`num`:** (`number`) The number to clamp.  May be an actual number or a numerical string.
* **`min`:** (`number`) The lower bound of the number.
* **`max`:** (`number`) The upper bound of the number.

#### Returns:

A new `number`.

#### Examples:

##### Basic usage (in macros)

```
/* Returns a copy of the original clamped to the bounds 0–200 */
<<set $result to Math.clamp($stat, 0, 200)>>

/* Returns a copy of the original clamped to the bounds 1–6.6 */
<<set $result to Math.clamp($stat, 1, 6.6)>>
```

##### Basic usage (in JavaScript)

```javascript
// Returns a copy of the original clamped to the bounds 0–200
let result = Math.clamp(stat, 0, 200);

// Returns a copy of the original clamped to the bounds 1–6.6
let result = Math.clamp(stat, 1, 6.6);
```

<!-- *********************************************************************** -->

### `Math.trunc(num)` → *integer* `number` {#methods-math-method-trunc}

Returns the whole (integer) part of the given number by removing its fractional part, if any.  Does not modify the original.

#### History: *JavaScript built-in*

#### Parameters:

* **`num`:** (`number`) The number to truncate to an integer.

#### Returns:

A new *integer* `number`.

#### Examples:

##### Basic usage (in macros)

```
<<set $result to Math.trunc(12.7)>>
/* Returns 12 */

<<set $result to Math.trunc(-12.7)>>
/* Returns -12 */
```

##### Basic usage (in JavaScript)

```javascript
let result = Math.trunc(12.7);
// Returns 12

let result = Math.trunc(-12.7);
// Returns -12
```


<!-- ***************************************************************************
	Number
**************************************************************************** -->
## Number Methods {#methods-number}

<!-- *********************************************************************** -->

### <span class="deprecated">`<Number>.clamp(min , max)` → `number`</span> {#methods-number-prototype-method-clamp}

<p role="note" class="warning"><b>Deprecated:</b>
This static method has been deprecated and should no longer be used.  See the <a href="#methods-math-method-clamp"><code>Math.clamp()</code></a> static method.
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.37.0`: Deprecated.


<!-- ***************************************************************************
	RegExp
**************************************************************************** -->
## RegExp Methods {#methods-regexp}

<!-- *********************************************************************** -->

### `RegExp.escape(text)` → `string` {#methods-regexp-method-escape}

Returns the given string with all regular expression metacharacters escaped.  Does not modify the original.

#### History: *JavaScript built-in*

#### Parameters:

* **`text`:** (`string`) The string to escape.

#### Returns:

A new `string` that can be safely used as a literal pattern.

#### Examples:

##### Basic usage (in macros)

```
<<set $result to RegExp.escape('That will be $15, cash only.')>>
/* Returns '\x54hat\x20will\x20be\x20\$15\x2c\x20cash\x20only\.' */
```

##### Basic usage (in JavaScript)

```javascript
let result = RegExp.escape('That will be $15, cash only.');
// Returns '\x54hat\x20will\x20be\x20\$15\x2c\x20cash\x20only\.'
```


<!-- ***************************************************************************
	Serial
**************************************************************************** -->
## `Serial` Methods {#methods-serial}

<!-- *********************************************************************** -->

### `Serial.createReviver(code [, data])` → *Array<any>* {#methods-serial-method-createreviver}

Returns the given code string, and optional data, wrapped within the deserialization reviver.  Intended to allow authors to easily create the reviver required to revive their custom object types (classes).  The reviver should be returned from an object instance's `.toJSON()` method, so that the instance may be properly revived upon deserialization.

<p role="note" class="see"><b>See:</b>
The <a href="#guide-non-generic-object-types"><em>Non-generic object types (classes)</em> guide</a> for more detailed information.
</p>

#### History:

* `v2.37.0`: Introduced.

#### Parameters:

* **`code`:** (`string`) The revival code string.
* **`data`:** (optional, `any`) The data that should be made available to the evaluated revival code during deserialization via the special `$ReviveData$` variable.  **WARNING:** Attempting to pass the value of an object instance's `this` directly as the `reviveData` parameter will trigger out of control recursion in the serializer, so a clone of the instance's own data must be passed instead.

#### Returns:

A reviver array containing the serialized code.

#### Examples:

##### Basic usage (in macros)

<p role="note"><b>Note:</b>
The macro examples would be exactly the same as the JavaScript examples, just wrapped in a <code>&lt;&lt;script&gt;&gt;</code> macro.
</p>

##### Basic usage (in JavaScript)

```javascript
Serial.createReviver(/* JavaScript code string */);            // without data chunk
Serial.createReviver(/* JavaScript code string */, myOwnData); // with data chunk
```

```javascript
// Assume that you're attempting to revive an instance of a custom class named
// `Character`, which is assigned to a story variable named `$pc`.  The call
// to `Serial.createReviver()` might look something like the following.
const ownData = {};
Object.keys(this).forEach((pn) => ownData[pn] = clone(this[pn]));
return Serial.createReviver('new Character($ReviveData$)', ownData);
```

<!-- *********************************************************************** -->

### `Serial.createRegisteredReviver(name, data)` → *Array<any>* {#methods-serial-method-createregisteredreviver}

Packages the given custom object type (class) name and data chunk for the deserialization reviver.  Intended to allow authors to easily create the reviver required to revive their registered custom object types (classes).  The reviver should be returned from an object instance's `.toJSON()` method, so that the instance may be properly revived upon deserialization.

<p role="note"><b>Note:</b>
This reviver works even if <a href="#config-api-property-saves-isevalenabled"><code>Config.saves.isEvalEnabled</code></a> is `false`, making it safer to use than the <a href="#methods-serial-method-createreviver"><code>Serial.createReviver()</code></a> method.
</p>

<p role="note"><b>Note:</b>
This method requires that the custom object type (class) be registered with the serializer via <a href="#methods-serial-method-registerusertype"><code>Serial.registerUserType()</code></a>.
</p>

<p role="note" class="see"><b>See:</b>
<a href="#methods-serial-method-registerusertype"><code>Serial.registerUserType()</code></a> for a more detailed information.
</p>

#### History:

* `v2.38.0`: Introduced.

#### Parameters:

* **`name`:** (`string`) The name of the custom object type (class). Must match the `name` parameter used when calling <a href="#methods-serial-method-registerusertype"><code>Serial.registerUserType()</code></a>.
* **`data`:** (`any`) The data chunk that should be passed to the custom object type's (class's) reviver function during deserialization.

#### Returns:

A reviver array containing the serialized data.

<!-- *********************************************************************** -->

### `Serial.registerUserType(name, typeInfo)` {#methods-serial-method-registerusertype}

Registers a custom object type (class) with the serializer, allowing instances of that type to be automatically deserialized.  The object should also implement a `.toJSON()` method that returns the appropriate reviver code via the <a href="#methods-serial-method-createregisteredreviver"><code>Serial.createRegisteredReviver()</code></a> static method.

#### History:

* `v2.38.0`: Introduced.

#### Parameters:

* **`name`:** (`string`) The name of the custom object type (class). Must match the `name` parameter used when calling <a href="#methods-serial-method-createregisteredreviver"><code>Serial.createRegisteredReviver()</code></a>.
* **`typeInfo`:** (`Object`) The type information object.  See below for details.

#### Type information object:

An type information object should have the following properties:

* **`revive`:** (`Function`) A function that takes a single parameter, the data chunk passed to <a href="#methods-serial-method-createregisteredreviver"><code>Serial.createRegisteredReviver()</code></a>, and returns a new instance of the custom object type (class) initialized with that data.

#### Examples:

##### Basic usage (in macros)

<p role="note"><b>Note:</b>
The macro examples would be exactly the same as the JavaScript examples, just wrapped in a <code>&lt;&lt;script&gt;&gt;</code> macro.
</p>

##### Basic usage (in JavaScript)

```javascript
// Assume that you have a custom class named `Character` that you wish to
// register with the serializer. Note that the class doesn't need to be in the
// global scope for this to work.
class Character {
	static serialId = 'Character'; // unique identifier for this class, could also be a UUID
	constructor(data) {
		// initialize the instance with the given data...
	}
	// class implementation...
	toJSON() {
		return Serial.createRegisteredReviver(Character.serialId, /* own data chunk */);
	}
	// more class implementation...
}
// Register the `Character` class with the serializer.
Serial.registerUserType(Character.serialId, {
	revive : (data) => {
		return new Character(data);
	}
});
```


<!-- ***************************************************************************
	String
**************************************************************************** -->
## String Methods {#methods-string}

<span id="methods-string-notes"></span><!-- legacy --><span id="methods-string-note"></span><!-- /legacy -->
Strings in TwineScript/JavaScript are Unicode, however, due to historic reasons they are comprised of, and sometimes indexed by, individual UTF-16 code *units* rather than code *points*.  This means that some code points may span multiple code units—e.g., the emoji 💩 is one code point (U+1F4A9), but two code units (U+D83D, U+DCA9).

Newer JavaScript functionality does actually yield Unicode code points, rather than code units.  Anything using the [`String.prototype[Symbol.iterator]()` instance method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Symbol.iterator) will do so, for example: `for…of` loops and the spread syntax (`…variable`).  The range form of the [`<<for>>` macro](#macros-macro-for) also returns code points, like the aforementioned `for…of` loop.

<!-- *********************************************************************** -->

### `<String>.count(needle [, position])` → *integer* `number` {#methods-string-prototype-method-count}

Returns the number of times that the given substring was found within the string, starting the search at `position`.  Substring searches are case-sensitive.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`needle`:** (`any`) The substring to count.
* **`position`:** (optional, *integer* `number`) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Returns:

An *integer* `number` denoting the number of times that the given substring was found within the string.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'How now, brown cow.'>>

<<set $result to $text.count('ow')>>
/* Returns 4 */

<<set $result to $text.count('ow', 8)>>
/* Returns 2 */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'How now, brown cow.';

let result = text.count('ow');
// Returns 4

let result = text.count('ow', 8);
// Returns 2
```

<!-- *********************************************************************** -->

### `<String>.first()` → `string` {#methods-string-prototype-method-first}

Returns the first Unicode code point within the string.  Does not modify the original.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.27.0`: Introduced.

#### Parameters: *none*

#### Returns:

A new `string` containing the first Unicode code point.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'abc'>>

<<set $result to $text.first()>>
/* Returns 'a' */
```

```
/* Given the following: */
<<set $text to '🙈🙉🙊'>>

<<set $result to $text.first()>>
/* Returns '🙈' */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'abc';

let result = text.first();
// Returns 'a'
```

```javascript
// Given the following:
let text = '🙈🙉🙊';

let result = text.first();
// Returns '🙈'
```

<!-- *********************************************************************** -->

### `String.format(format , arguments…)` → `string` {#methods-string-method-format}

Returns a formatted string, after replacing each format item in the given format string with the text equivalent of the corresponding argument's value.

#### History:

* `v2.0.0`: Introduced.

#### Parameters:

* **`format`:** (`string`) The format string, which consists of normal text and format items.
* **`arguments`:** (`any`… | `Array<any>`) Either a list of arguments, which correspond by-index to the format items within the format string, or an array, whose members correspond by-index.

#### Format items:

A format item has the syntax `{index[,alignment]}`, square-brackets denoting optional elements.

* **`index`:** (*integer* `number`) The (zero-based) index of the argument whose string representation will replace the format item.
* **`alignment`:** (optional, *integer* `number`) The total length of the field into which the argument is inserted, and whether it's right- or left-aligned (positive aligns right, negative aligns left).

#### Returns:

A new `string` based on the format and arguments.

#### Examples:

##### Basic usage (in macros)

Using a list of arguments.

```
<<set $result to String.format('{0}, {1}!', 'Hello', 'World')>>
/* Returns 'Hello, World!' */
```

Using an array argument.

```
<<set $result to String.format('{0}, {1}!', ['Hello', 'World'])>>
/* Returns 'Hello, World!' */
```

Using alignments.

```
<<set $result to String.format('{0,6}', 'foo')>>
/* Returns '   foo' */

<<set $result to String.format('{0,-6}', 'foo')>>
/* Returns 'foo   ' */
```

##### Basic usage (in JavaScript)

Using a list of arguments.

```javascript
let result = String.format('{0}, {1}!', 'Hello', 'World');
// Returns 'Hello, World!'
```

Using an array argument.

```javascript
let result = String.format('{0}, {1}!', ['Hello', 'World']);
// Returns 'Hello, World!'
```

Using alignments.

```javascript
let result = String.format('{0,6}', 'foo');
// Returns '   foo'

let result = String.format('{0,-6}', 'foo');
// Returns 'foo   '
```

<!-- *********************************************************************** -->

### `<String>.includes(needle [, position])` → `boolean` {#methods-string-prototype-method-includes}

Returns whether the given substring was found within the string, starting the search at `position`.  Substring searches are case-sensitive.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History: *JavaScript built-in*

#### Parameters:

* **`needle`:** (`string`) The substring to find.
* **`position`:** (optional, *integer* `number`) The zero-based index at which to begin searching for `needle`.  If omitted, will default to `0`.

#### Returns:

A `boolean` denoting whether the given substring was found within the string.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'How now, brown cow.'>>

<<set $result to $text.includes('row')>>
/* Returns true */

<<set $result to $text.includes('row', 14)>>
/* Returns false */

<<set $result to $text.includes('cow', 14)>>
/* Returns true */

<<set $result to $text.includes('pow')>>
/* Returns false */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'How now, brown cow.';

let result = text.includes('row');
// Returns true

let result = text.includes('row', 14);
// Returns false

let result = text.includes('cow', 14);
// Returns true

let result = text.includes('pow');
// Returns false
```

<!-- *********************************************************************** -->

### `<String>.includesAll(needles…)` → `boolean` {#methods-string-prototype-method-includesall}

Returns whether all of the given substrings were found within the string.  Substring searches are case-sensitive.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.38.0`: Introduced.

#### Parameters:

* **`needles`:** (`string`… | `Array<string>`) The substrings to find.  May be a list or an array of substrings.

#### Returns:

A `boolean` denoting whether all of the given substrings were found within the string.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'How now, brown cow.'>>

<<set $result to $text.includesAll('cow', 'row', 'now')>>
/* Returns true */

<<set $result to $text.includesAll('yowza', 'How')>>
/* Returns false */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'How now, brown cow.';

let result = text.includesAll('cow', 'row', 'now');
// Returns true

let result = text.includesAll('yowza', 'How');
// Returns false
```

<!-- *********************************************************************** -->

### `<String>.includesAny(needles…)` → `boolean` {#methods-string-prototype-method-includesany}

Returns whether any of the given substrings were found within the string.  Substring searches are case-sensitive.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.38.0`: Introduced.

#### Parameters:

* **`needles`:** (`string`… | `Array<string>`) The substrings to find.  May be a list or an array of substrings.

#### Returns:

A `boolean` denoting whether any of the given substrings were found within the string.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'How now, brown cow.'>>

<<set $result to $text.includesAny('bird', 'row', 'then')>>
/* Returns true */

<<set $result to $text.includesAny('yowza', 'how')>>
/* Returns false */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'How now, brown cow.';

let result = text.includesAny('bird', 'row', 'then');
// Returns true

let result = text.includesAny('yowza', 'how');
// Returns false
```

<!-- *********************************************************************** -->

### `<String>.last()` → `string` {#methods-string-prototype-method-last}

Returns the last Unicode code point within the string.  Does not modify the original.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.27.0`: Introduced.

#### Parameters: *none*

#### Returns:

A new `string` containing the last Unicode code point.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'abc'>>

<<set $result to $text.last()>>
/* Returns 'c' */
```

```
/* Given the following: */
<<set $text to '🙈🙉🙊'>>

<<set $result to $text.last()>>
/* Returns '🙊' */
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'abc';

let result = text.last();
// Returns 'c'
```

```javascript
// Given the following:
let text = '🙈🙉🙊';

let result = text.last();
// Returns '🙊'
```

<!-- *********************************************************************** -->

### `<String>.toLocaleUpperFirst()` → `string` {#methods-string-prototype-method-tolocaleupperfirst}

Returns the string with its first Unicode code point converted to upper case, according to any locale-specific rules.  Does not modify the original.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.9.0`: Introduced.

#### Parameters: *none*

#### Returns:

A new `string` with its first Unicode code point uppercased according to locale-specific rules.

#### Examples:

##### Basic usage (in macros)

Using the Turkish (Türkçe) locale.

```
/* Given the following: */
<<set $text to 'ışık'>>

<<set $result to $text.toLocaleUpperFirst()>>
/* Returns 'Işık' */
```

```
/* Given the following: */
<<set $text to 'iki'>>

<<set $result to $text.toLocaleUpperFirst()>>
/* Returns 'İki' */
```

##### Basic usage (in JavaScript)

Using the Turkish (Türkçe) locale.

```javascript
// Given the following:
let text = 'ışık';

let result = text.toLocaleUpperFirst();
// Returns 'Işık'
```

```javascript
// Given the following:
let text = 'iki';

let result = text.toLocaleUpperFirst();
// Returns 'İki'
```

<!-- *********************************************************************** -->

### `<String>.toUpperFirst()` → `string` {#methods-string-prototype-method-toupperfirst}

Returns the string with its first Unicode code point converted to upper case.  Does not modify the original.

<p role="note" class="see"><b>See:</b>
<a href="#methods-string-notes">String methods notes</a>.
</p>

#### History:

* `v2.9.0`: Introduced.

#### Parameters: *none*

#### Returns:

A new `string` with its first Unicode code point uppercased.

#### Examples:

##### Basic usage (in macros)

```
/* Given the following: */
<<set $text to 'hello.'>>

<<set $result to $text.toUpperFirst()>>
/* Returns 'Hello.'*/
```

```
/* Given the following: */
<<set $text to 'χαίρετε.'>>

<<set $result to $text.toUpperFirst()>>
/* Returns 'Χαίρετε.'*/
```

##### Basic usage (in JavaScript)

```javascript
// Given the following:
let text = 'hello.';

let result = text.toUpperFirst();
// Returns 'Hello.'
```

```javascript
// Given the following:
let text = 'χαίρετε.';

let result = text.toUpperFirst();
// Returns 'Χαίρετε.'
```
