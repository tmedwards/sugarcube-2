<!-- ***********************************************************************************************
	Guide: Media Passages
************************************************************************************************ -->
# Guide: Media Passages {#guide-media-passages}

Media passages are simply a way to embed media into your project—specially tagged passages that contain the [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) of a Base64-encoded media source.  Audio, image, video, and <abbr title="Video Text Track">VTT</abbr> passages are supported.

For example, the following is the data URI of a Base64-encoded PNG image of a red dot (<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot">):

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHE
lEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
```

#### History:

* `v2.0.0`: Image passages.
* `v2.24.0`: Added audio, video, and <abbr title="Video Text Track">VTT</abbr> passages.


<!-- ***************************************************************************
	Creation
**************************************************************************** -->
## Creation {#guide-media-passages-creation}

Generally, it's expected that you will use a compiler that supports the automatic creation of media passages, however, they may be created manually.

### Automatically

Compilers supporting automatic creation of media passages:

* [Tweego](http://www.motoslave.net/tweego/) supports all media passages.
* [Twine&nbsp;1](http://www.twinery.org/) supports image passages.

### Manually

<p role="note" class="warning"><b>Warning (Twine&nbsp;2):</b>
Due to various limitations in its design, if you're using Twine&nbsp;2 as your IDE/compiler, then it is <strong><em>strongly</em></strong> recommended that you do not create more than a few media passages and definitely do not use large sources.
</p>

To manually create a media passage:

1. Create a new passage, which will only be used as a media passage—one per media source.
2. Tag it with the appropriate media passage special tag, and only that tag—see below.
3. Paste in the Base64-encoded media source as the passage's content.

See the MDN article [<i>Media formats for HTML audio and video</i>](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) for more information on formats commonly supported in browsers—pay special attention to the [<i>Browser compatibility</i>](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility) section.

#### Media passage special tags

<p role="note"><b>Note:</b>
As with all special tags, media passage tags are case sensitive, so their spelling and capitalization must be <em>exactly</em> as shown.
</p>

<table>
<thead>
	<tr>
		<th>Passage type</th>
		<th>Tag</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Audio passage</td>
		<td><code>Twine.audio</code></td>
	</tr>
	<tr>
		<td>Image passage</td>
		<td><code>Twine.image</code></td>
	</tr>
	<tr>
		<td>Video passage</td>
		<td><code>Twine.video</code></td>
	</tr>
	<tr>
		<td><abbr title="Video Text Track">VTT</abbr> passage</td>
		<td><code>Twine.vtt</code></td>
	</tr>
</tbody>
</table>
