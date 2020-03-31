<!-- ***********************************************************************************************
	Guide: Installation
************************************************************************************************ -->
# Guide: Installation {#guide-installation}

This is a reference on how to install SugarCube in Tweego, Twine&nbsp;2, and Twine&nbsp;1/Twee.

<p role="note"><b>Note (Twine&nbsp;2):</b>
Newer versions of Twine&nbsp;2 come bundled with a version of SugarCube v2, so you only need to read these instructions if you want to install a newer version of SugarCube v2 than is bundled or a non-standard release.
</p>


<!-- ***************************************************************************
	Local Installation For Tweego
**************************************************************************** -->
## Local Install For Tweego {#guide-installation-tweego}

See [Tweego's documentation](http://www.motoslave.net/tweego/docs/) for more information.


<!-- ***************************************************************************
	Local Installation For Twine 2
**************************************************************************** -->
## Local Install For Twine&nbsp;2 {#guide-installation-twine2}

There are two primary branches of Twine&nbsp;2 as far as SugarCube is concerned:

* Those that bundle SugarCube v2: Any series of Twine&nbsp;2 with a version ≥2.1.
* Those that do not bundle SugarCube v2: Only the older Twine&nbsp;2.0 series.

Regardless of the version of Twine&nbsp;2 you're using, follow these instructions to install a local copy of SugarCube v2:

1. Download the current version of [SugarCube v2 for Twine&nbsp;2](http://www.motoslave.net/sugarcube/2/#downloads)—comes as a ZIP archive.  **NOTE:** There are separate downloads for Twine&nbsp;≥2.1 and Twine&nbsp;2.0, so you ***must*** ensure that you download the one that matches your version of Twine&nbsp;2 or you will likely run into issues.
2. Extract the archive to a safe location on your computer and make note of the path to it.  Make sure to keep the files together if you move them out of the included directory.
3. Launch Twine&nbsp;2.
4. Click on the `Formats` link in the Twine&nbsp;2 sidebar.
5. In the dialog that opens, click on the `Add a New Format` tab.
6. Finally, paste a [file URL](http://en.wikipedia.org/wiki/File_URI_scheme) to the `format.js` file, based upon the path from step #2, into the textbox and click the `+Add` button (see below for examples).

### UNIX (and similar) file URL examples

<p role="note"><b>Note:</b>
If constructing the file URL from a shell path, ensure that either it does not contain escapes or you properly convert them into the correct URL percent-encoded form.
</p>

If the full path to the contents of the archive is something like:

```
/home/soandso/Twine/StoryFormats/SugarCube-2/format.js
```

Then the file URL to it would be:

```
file:///home/soandso/Twine/StoryFormats/SugarCube-2/format.js
```

### Windows file URL examples
If the full path to the contents of the archive is something like:

```
C:\Users\soandso\Documents\Twine\StoryFormats\SugarCube-2\format.js
```

Then the file URL to it would be (note the changed slashes):

```
file:///C:/Users/soandso/Documents/Twine/StoryFormats/SugarCube-2/format.js
```


<!-- ***************************************************************************
	Online Installation For Twine 2
**************************************************************************** -->
## Online Install For Twine&nbsp;2 {#guide-installation-twine2-online}

The online SugarCube install, delivered by the [jsDelivr CDN](https://www.jsdelivr.com/), supports only versions of Twine&nbsp;2 ≥2.1.

Copy the following URL and paste it into the *Add a New Format* tab of the *Formats* menu, from Twine&nbsp;2's sidebar.

**URL:** [https://cdn.jsdelivr.net/gh/tmedwards/sugarcube-2/dist/format.js](https://cdn.jsdelivr.net/gh/tmedwards/sugarcube-2/dist/format.js)


<!-- ***************************************************************************
	Local Installation For Twine 1/Twee
**************************************************************************** -->
## Local Install For Twine&nbsp;1/Twee {#guide-installation-twine1-twee}

Follow these instructions to install a local copy of SugarCube v2:

1. Download the current version of [SugarCube v2 for Twine&nbsp;1/Twee](http://www.motoslave.net/sugarcube/2/#downloads)—comes as a ZIP archive.
2. Go to your Twine&nbsp;1/Twee installation directory and open the `targets` directory within.
3. Move the downloaded archive into the `targets` directory and extract it, included directory and all.

If you followed the steps correctly, within Twine&nbsp;1/Twee's `targets` directory you should now have a `sugarcube-2` directory, which contains several files—e.g., `header.html`, `sugarcube-2.py`, etc.

<div role="note" class="warning"><b>Warning (Twine&nbsp;1):</b>
<p>
Due to a flaw in the current release of Twine&nbsp;1/Twee (<code>v1.4.2</code>), if you rename the directory included in the archive (or simply copy its contents to your current SugarCube v2 install), then you <strong><em>must</em></strong> ensure that the file with the extension <code>.py</code> (the story format's custom Twine&nbsp;1 Header class file) within is named the same as the directory—i.e., the name of the directory and <code>.py</code> file must match.
</p>
<p>
For example, if the name of SugarCube's directory is <code>sugarcube</code>, then the name of the <code>.py</code> file within must be <code>sugarcube.py</code>.  Similarly, if the directory is <code>sugarcube-2</code>, then the name of the <code>.py</code> file within must be <code>sugarcube-2.py</code>.  Etc.
</p>
<p>
The directory and <code>.py</code> file names within the archive available for download are already properly matched—as <code>sugarcube-2</code> and <code>sugarcube-2.py</code>—and to avoid issues it recommended that you simply do not rename them.
</p>
</div>
