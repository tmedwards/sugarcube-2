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

For instance, you may use ***one*** of the following examples—they both do the same thing—to record the last non-menu passage into the `$return` story variable.

**Via JavaScript** (Twine&nbsp;2: the Story JavaScript, Twine&nbsp;1/Twee: a `script`-tagged passage)

```js
$(document).on(':passagestart', function (ev) {
	if (!ev.passage.tags.includes('noreturn')) {
		State.variables.return = ev.passage.name;
	}
});
```

**Via macros** (best used in the `PassageReady` special passage)

```
<<if not tags().includes("noreturn")>>
	<<set $return to passage()>>
<</if>>
```

You'll need to tag each and every one of your menu passages with `noreturn`—you may use any tag you wish (e.g., `menu`, `inventory`), just ensure you change the name in the code if you decide upon another.  If necessary, you may also use multiple tags by switching from [`<Array>.includes()`](#methods-array-prototype-method-includes) to [`<Array>.includesAny()`](#methods-array-prototype-method-includesany) in whichever of the above examples you choose to use.

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
