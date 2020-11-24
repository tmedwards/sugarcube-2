<!-- ***********************************************************************************************
	Guide: Localization
************************************************************************************************ -->
# Guide: Localization {#guide-localization}

This is a reference for localizing SugarCube's default UI text, in general, and its `l10nStrings` object specifically.

<p role="note"><b>Note:</b>
If you're simply looking to download ready-to-use localizations, see <a href="http://www.motoslave.net/sugarcube/2/#downloads">SugarCube's website</a> (under <em>Downloads &gt; Localizations</em>).
</p>

#### History:

* `v2.0.0`: Introduced.
* `v2.10.0`: Added `l10nStrings` object.  Deprecated `strings` object.

#### A note about `strings` vs. `l10nStrings`

Prior to SugarCube `v2.10.0`, the strings localization object was named `strings`.  The new `l10nStrings` object has a simpler, flatter, set of properties and better support for replacement strings.  Unfortunately, this means that the two objects are incompatible.

To ensure backwards compatibility of existing `strings` objects, if one exists within a project's scripts, the older object is mapped to the new `l10nStrings` object.


<!-- ***************************************************************************
	Translation Notes
**************************************************************************** -->
## Translation Notes {#guide-localization-translation-notes}

The capitalization and punctuation used within the default replacement strings is deliberate, especially within the error and warning strings.  You would do well to keep your translations similar when possible.

Replacement patterns have the format `{NAME}`—e.g., `{identity}`—where NAME is the name of a property within either the `l10nStrings` object or, in a few cases, an object supplied locally where the string is used—these instances will be commented.

By convention, properties starting with an underscore—e.g., `_warningIntroLacking`—are used as templates, only being included within other localized strings.  Feel free to add your own if that makes localization easier—e.g., for gender, plurals, and whatnot.  As an example, the default replacement strings make use of this to handle various warning intros and outros.

In use, replacement patterns are replaced recursively, so replacement strings may contain patterns whose replacements contain other patterns.  Because replacement is recursive, care must be taken to ensure infinite loops are not created—the system will detect an infinite loop and throw an error.


<!-- ***************************************************************************
	Usage
**************************************************************************** -->
## Usage {#guide-localization-usage}

Properties on the strings localization object (`l10nStrings`) should be set within your project's JavaScript section (Twine&nbsp;2: the Story JavaScript; Twine&nbsp;1/Twee: a <code>script</code>-tagged passage) to override the defaults.

For the template that should be used as the basis of localizations, see the [`locale/l10n-template.js` file @github.com](https://github.com/tmedwards/sugarcube-2/tree/develop/locale/).

### Examples

```
// Changing the project's reported identity to "story"
l10nStrings.identity = "story";

// Changing the text of all dialog OK buttons to "Eeyup"
l10nStrings.ok = "Eeyup";

// Localizing the title of the Restart dialog (n.b. machine translations, for example only)
l10nStrings.restartTitle = "Neustart";  // German (de)
l10nStrings.restartTitle = "Reiniciar"; // Spanish (es)
```
