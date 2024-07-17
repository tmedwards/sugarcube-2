<!-- ***********************************************************************************************
	Guide: Icon Font
************************************************************************************************ -->
# Guide: Icon Font {#guide-icon-font}

This guide is a reference to the icon font used by SugarCube, `sc-icons`.

The `sc-icons` font is a custom subset of Font Awesome Free (Solid) v5.15.2 (https://fontawesome.com), which is licensed under the SIL OFL 1.1 (https://scripts.sil.org/OFL).

<!-- *********************************************************************** -->

### Icon Styling {#guide-icon-font-styling}

The following CSS properties should used with any icon style rule.

```css
font-family: sc-icons !important;
font-style: normal;
font-weight: normal;
font-variant: normal;
line-height: 1;
speak: never;
text-rendering: auto;
text-transform: none;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

<!-- *********************************************************************** -->

### Icon Reference {#guide-icon-font-reference}

Each icon's hexadecimal reference ID is listed below it.  How to use the reference IDs varies based on where you're using them.

* **JavaScript strings:** Prefix with `\u`.  E.g., `\uf004`.
* **CSS styles:** Prefix with `\`.  E.g., `\f004`.
* **HTML entities:** Prefix with `&#x` and append `;`.  E.g., `&#xf004;`.

<div id="icon-font-view">
	<div>
		<span title="icon-search" aria-label="icon-search">&#xf002;</span>
		<code>f002</code>
	</div>
	<div>
		<span title="icon-heart" aria-label="icon-heart">&#xf004;</span>
		<code>f004</code>
	</div>
	<div>
		<span title="icon-star" aria-label="icon-star">&#xf005;</span>
		<code>f005</code>
	</div>
	<div>
		<span title="icon-check" aria-label="icon-check">&#xf00c;</span>
		<code>f00c</code>
	</div>
	<div>
		<span title="icon-times" aria-label="icon-times">&#xf00d;</span>
		<code>f00d</code>
	</div>
	<div>
		<span title="icon-search-plus" aria-label="icon-search-plus">&#xf00e;</span>
		<code>f00e</code>
	</div>
	<div>
		<span title="icon-search-minus" aria-label="icon-search-minus">&#xf010;</span>
		<code>f010</code>
	</div>
	<div>
		<span title="icon-power-off" aria-label="icon-power-off">&#xf011;</span>
		<code>f011</code>
	</div>
	<div>
		<span title="icon-cog" aria-label="icon-cog">&#xf013;</span>
		<code>f013</code>
	</div>
	<div>
		<span title="icon-home" aria-label="icon-home">&#xf015;</span>
		<code>f015</code>
	</div>
	<div>
		<span title="icon-download" aria-label="icon-download">&#xf019;</span>
		<code>f019</code>
	</div>
	<div>
		<span title="icon-lock" aria-label="icon-lock">&#xf023;</span>
		<code>f023</code>
	</div>
	<div>
		<span title="icon-volume-off" aria-label="icon-volume-off">&#xf026;</span>
		<code>f026</code>
	</div>
	<div>
		<span title="icon-volume-down" aria-label="icon-volume-down">&#xf027;</span>
		<code>f027</code>
	</div>
	<div>
		<span title="icon-volume-up" aria-label="icon-volume-up">&#xf028;</span>
		<code>f028</code>
	</div>
	<div>
		<span title="icon-bookmark" aria-label="icon-bookmark">&#xf02e;</span>
		<code>f02e</code>
	</div>
	<div>
		<span title="icon-step-backward" aria-label="icon-step-backward">&#xf048;</span>
		<code>f048</code>
	</div>
	<div>
		<span title="icon-fast-backward" aria-label="icon-fast-backward">&#xf049;</span>
		<code>f049</code>
	</div>
	<div>
		<span title="icon-backward" aria-label="icon-backward">&#xf04a;</span>
		<code>f04a</code>
	</div>
	<div>
		<span title="icon-play" aria-label="icon-play">&#xf04b;</span>
		<code>f04b</code>
	</div>
	<div>
		<span title="icon-pause" aria-label="icon-pause">&#xf04c;</span>
		<code>f04c</code>
	</div>
	<div>
		<span title="icon-stop" aria-label="icon-stop">&#xf04d;</span>
		<code>f04d</code>
	</div>
	<div>
		<span title="icon-forward" aria-label="icon-forward">&#xf04e;</span>
		<code>f04e</code>
	</div>
	<div>
		<span title="icon-fast-forward" aria-label="icon-fast-forward">&#xf050;</span>
		<code>f050</code>
	</div>
	<div>
		<span title="icon-step-forward" aria-label="icon-step-forward">&#xf051;</span>
		<code>f051</code>
	</div>
	<div>
		<span title="icon-eject" aria-label="icon-eject">&#xf052;</span>
		<code>f052</code>
	</div>
	<div>
		<span title="icon-chevron-left" aria-label="icon-chevron-left">&#xf053;</span>
		<code>f053</code>
	</div>
	<div>
		<span title="icon-chevron-right" aria-label="icon-chevron-right">&#xf054;</span>
		<code>f054</code>
	</div>
	<div>
		<span title="icon-plus-circle" aria-label="icon-plus-circle">&#xf055;</span>
		<code>f055</code>
	</div>
	<div>
		<span title="icon-minus-circle" aria-label="icon-minus-circle">&#xf056;</span>
		<code>f056</code>
	</div>
	<div>
		<span title="icon-times-circle" aria-label="icon-times-circle">&#xf057;</span>
		<code>f057</code>
	</div>
	<div>
		<span title="icon-check-circle" aria-label="icon-check-circle">&#xf058;</span>
		<code>f058</code>
	</div>
	<div>
		<span title="icon-question-circle" aria-label="icon-question-circle">&#xf059;</span>
		<code>f059</code>
	</div>
	<div>
		<span title="icon-info-circle" aria-label="icon-info-circle">&#xf05a;</span>
		<code>f05a</code>
	</div>
	<div>
		<span title="icon-ban" aria-label="icon-ban">&#xf05e;</span>
		<code>f05e</code>
	</div>
	<div>
		<span title="icon-arrow-left" aria-label="icon-arrow-left">&#xf060;</span>
		<code>f060</code>
	</div>
	<div>
		<span title="icon-arrow-right" aria-label="icon-arrow-right">&#xf061;</span>
		<code>f061</code>
	</div>
	<div>
		<span title="icon-arrow-up" aria-label="icon-arrow-up">&#xf062;</span>
		<code>f062</code>
	</div>
	<div>
		<span title="icon-arrow-down" aria-label="icon-arrow-down">&#xf063;</span>
		<code>f063</code>
	</div>
	<div>
		<span title="icon-expand" aria-label="icon-expand">&#xf065;</span>
		<code>f065</code>
	</div>
	<div>
		<span title="icon-compress" aria-label="icon-compress">&#xf066;</span>
		<code>f066</code>
	</div>
	<div>
		<span title="icon-plus" aria-label="icon-plus">&#xf067;</span>
		<code>f067</code>
	</div>
	<div>
		<span title="icon-minus" aria-label="icon-minus">&#xf068;</span>
		<code>f068</code>
	</div>
	<div>
		<span title="icon-exclamation-circle" aria-label="icon-exclamation-circle">&#xf06a;</span>
		<code>f06a</code>
	</div>
	<div>
		<span title="icon-eye" aria-label="icon-eye">&#xf06e;</span>
		<code>f06e</code>
	</div>
	<div>
		<span title="icon-eye-slash" aria-label="icon-eye-slash">&#xf070;</span>
		<code>f070</code>
	</div>
	<div>
		<span title="icon-exclamation-triangle" aria-label="icon-exclamation-triangle">&#xf071;</span>
		<code>f071</code>
	</div>
	<div>
		<span title="icon-chevron-up" aria-label="icon-chevron-up">&#xf077;</span>
		<code>f077</code>
	</div>
	<div>
		<span title="icon-chevron-down" aria-label="icon-chevron-down">&#xf078;</span>
		<code>f078</code>
	</div>
	<div>
		<span title="icon-star-half" aria-label="icon-star-half">&#xf089;</span>
		<code>f089</code>
	</div>
	<div>
		<span title="icon-thumbtack" aria-label="icon-thumbtack">&#xf08d;</span>
		<code>f08d</code>
	</div>
	<div>
		<span title="icon-upload" aria-label="icon-upload">&#xf093;</span>
		<code>f093</code>
	</div>
	<div>
		<span title="icon-unlock" aria-label="icon-unlock">&#xf09c;</span>
		<code>f09c</code>
	</div>
	<div>
		<span title="icon-hdd" aria-label="icon-hdd">&#xf0a0;</span>
		<code>f0a0</code>
	</div>
	<div>
		<span title="icon-link" aria-label="icon-link">&#xf0c1;</span>
		<code>f0c1</code>
	</div>
	<div>
		<span title="icon-cloud" aria-label="icon-cloud">&#xf0c2;</span>
		<code>f0c2</code>
	</div>
	<div>
		<span title="icon-save" aria-label="icon-save">&#xf0c7;</span>
		<code>f0c7</code>
	</div>
	<div>
		<span title="icon-bars" aria-label="icon-bars">&#xf0c9;</span>
		<code>f0c9</code>
	</div>
	<div>
		<span title="icon-magic" aria-label="icon-magic">&#xf0d0;</span>
		<code>f0d0</code>
	</div>
	<div>
		<span title="icon-caret-down" aria-label="icon-caret-down">&#xf0d7;</span>
		<code>f0d7</code>
	</div>
	<div>
		<span title="icon-caret-up" aria-label="icon-caret-up">&#xf0d8;</span>
		<code>f0d8</code>
	</div>
	<div>
		<span title="icon-caret-left" aria-label="icon-caret-left">&#xf0d9;</span>
		<code>f0d9</code>
	</div>
	<div>
		<span title="icon-caret-right" aria-label="icon-caret-right">&#xf0da;</span>
		<code>f0da</code>
	</div>
	<div>
		<span title="icon-bolt" aria-label="icon-bolt">&#xf0e7;</span>
		<code>f0e7</code>
	</div>
	<div>
		<span title="icon-lightbulb" aria-label="icon-lightbulb">&#xf0eb;</span>
		<code>f0eb</code>
	</div>
	<div>
		<span title="icon-plus-square" aria-label="icon-plus-square">&#xf0fe;</span>
		<code>f0fe</code>
	</div>
	<div>
		<span title="icon-quote-left" aria-label="icon-quote-left">&#xf10d;</span>
		<code>f10d</code>
	</div>
	<div>
		<span title="icon-quote-right" aria-label="icon-quote-right">&#xf10e;</span>
		<code>f10e</code>
	</div>
	<div>
		<span title="icon-spinner" aria-label="icon-spinner">&#xf110;</span>
		<code>f110</code>
	</div>
	<div>
		<span title="icon-unlink" aria-label="icon-unlink">&#xf127;</span>
		<code>f127</code>
	</div>
	<div>
		<span title="icon-chevron-circle-left" aria-label="icon-chevron-circle-left">&#xf137;</span>
		<code>f137</code>
	</div>
	<div>
		<span title="icon-chevron-circle-right" aria-label="icon-chevron-circle-right">&#xf138;</span>
		<code>f138</code>
	</div>
	<div>
		<span title="icon-chevron-circle-up" aria-label="icon-chevron-circle-up">&#xf139;</span>
		<code>f139</code>
	</div>
	<div>
		<span title="icon-chevron-circle-down" aria-label="icon-chevron-circle-down">&#xf13a;</span>
		<code>f13a</code>
	</div>
	<div>
		<span title="icon-unlock-alt" aria-label="icon-unlock-alt">&#xf13e;</span>
		<code>f13e</code>
	</div>
	<div>
		<span title="icon-ellipsis-h" aria-label="icon-ellipsis-h">&#xf141;</span>
		<code>f141</code>
	</div>
	<div>
		<span title="icon-ellipsis-v" aria-label="icon-ellipsis-v">&#xf142;</span>
		<code>f142</code>
	</div>
	<div>
		<span title="icon-play-circle" aria-label="icon-play-circle">&#xf144;</span>
		<code>f144</code>
	</div>
	<div>
		<span title="icon-minus-square" aria-label="icon-minus-square">&#xf146;</span>
		<code>f146</code>
	</div>
	<div>
		<span title="icon-check-square" aria-label="icon-check-square">&#xf14a;</span>
		<code>f14a</code>
	</div>
	<div>
		<span title="icon-caret-square-down" aria-label="icon-caret-square-down">&#xf150;</span>
		<code>f150</code>
	</div>
	<div>
		<span title="icon-caret-square-up" aria-label="icon-caret-square-up">&#xf151;</span>
		<code>f151</code>
	</div>
	<div>
		<span title="icon-caret-square-right" aria-label="icon-caret-square-right">&#xf152;</span>
		<code>f152</code>
	</div>
	<div>
		<span title="icon-sun" aria-label="icon-sun">&#xf185;</span>
		<code>f185</code>
	</div>
	<div>
		<span title="icon-moon" aria-label="icon-moon">&#xf186;</span>
		<code>f186</code>
	</div>
	<div>
		<span title="icon-bug" aria-label="icon-bug">&#xf188;</span>
		<code>f188</code>
	</div>
	<div>
		<span title="icon-caret-square-left" aria-label="icon-caret-square-left">&#xf191;</span>
		<code>f191</code>
	</div>
	<div>
		<span title="icon-language" aria-label="icon-language">&#xf1ab;</span>
		<code>f1ab</code>
	</div>
	<div>
		<span title="icon-paragraph" aria-label="icon-paragraph">&#xf1dd;</span>
		<code>f1dd</code>
	</div>
	<div>
		<span title="icon-share-alt" aria-label="icon-share-alt">&#xf1e0;</span>
		<code>f1e0</code>
	</div>
	<div>
		<span title="icon-trash" aria-label="icon-trash">&#xf1f8;</span>
		<code>f1f8</code>
	</div>
	<div>
		<span title="icon-toggle-off" aria-label="icon-toggle-off">&#xf204;</span>
		<code>f204</code>
	</div>
	<div>
		<span title="icon-toggle-on" aria-label="icon-toggle-on">&#xf205;</span>
		<code>f205</code>
	</div>
	<div>
		<span title="icon-battery-full" aria-label="icon-battery-full">&#xf240;</span>
		<code>f240</code>
	</div>
	<div>
		<span title="icon-battery-three-quarters" aria-label="icon-battery-three-quarters">&#xf241;</span>
		<code>f241</code>
	</div>
	<div>
		<span title="icon-battery-half" aria-label="icon-battery-half">&#xf242;</span>
		<code>f242</code>
	</div>
	<div>
		<span title="icon-battery-quarter" aria-label="icon-battery-quarter">&#xf243;</span>
		<code>f243</code>
	</div>
	<div>
		<span title="icon-battery-empty" aria-label="icon-battery-empty">&#xf244;</span>
		<code>f244</code>
	</div>
	<div>
		<span title="icon-pause-circle" aria-label="icon-pause-circle">&#xf28b;</span>
		<code>f28b</code>
	</div>
	<div>
		<span title="icon-stop-circle" aria-label="icon-stop-circle">&#xf28d;</span>
		<code>f28d</code>
	</div>
	<div>
		<span title="icon-undo-alt" aria-label="icon-undo-alt">&#xf2ea;</span>
		<code>f2ea</code>
	</div>
	<div>
		<span title="icon-trash-alt" aria-label="icon-trash-alt">&#xf2ed;</span>
		<code>f2ed</code>
	</div>
	<div>
		<span title="icon-sync-alt" aria-label="icon-sync-alt">&#xf2f1;</span>
		<code>f2f1</code>
	</div>
	<div>
		<span title="icon-redo-alt" aria-label="icon-redo-alt">&#xf2f9;</span>
		<code>f2f9</code>
	</div>
	<div>
		<span title="icon-expand-arrows-alt" aria-label="icon-expand-arrows-alt">&#xf31e;</span>
		<code>f31e</code>
	</div>
	<div>
		<span title="icon-external-link-alt" aria-label="icon-external-link-alt">&#xf35d;</span>
		<code>f35d</code>
	</div>
	<div>
		<span title="icon-cloud-download-alt" aria-label="icon-cloud-download-alt">&#xf381;</span>
		<code>f381</code>
	</div>
	<div>
		<span title="icon-cloud-upload-alt" aria-label="icon-cloud-upload-alt">&#xf382;</span>
		<code>f382</code>
	</div>
	<div>
		<span title="icon-window-close" aria-label="icon-window-close">&#xf410;</span>
		<code>f410</code>
	</div>
	<div>
		<span title="icon-backspace" aria-label="icon-backspace">&#xf55a;</span>
		<code>f55a</code>
	</div>
	<div>
		<span title="icon-file-download" aria-label="icon-file-download">&#xf56d;</span>
		<code>f56d</code>
	</div>
	<div>
		<span title="icon-file-export" aria-label="icon-file-export">&#xf56e;</span>
		<code>f56e</code>
	</div>
	<div>
		<span title="icon-file-import" aria-label="icon-file-import">&#xf56f;</span>
		<code>f56f</code>
	</div>
	<div>
		<span title="icon-file-upload" aria-label="icon-file-upload">&#xf574;</span>
		<code>f574</code>
	</div>
	<div>
		<span title="icon-star-half-alt" aria-label="icon-star-half-alt">&#xf5c0;</span>
		<code>f5c0</code>
	</div>
	<div>
		<span title="icon-volume-mute" aria-label="icon-volume-mute">&#xf6a9;</span>
		<code>f6a9</code>
	</div>
	<div>
		<span title="icon-compress-arrows-alt" aria-label="icon-compress-arrows-alt">&#xf78c;</span>
		<code>f78c</code>
	</div>
	<div>
		<span title="icon-tools" aria-label="icon-tools">&#xf7d9;</span>
		<code>f7d9</code>
	</div>
	<div>
		<span title="icon-trash-restore" aria-label="icon-trash-restore">&#xf829;</span>
		<code>f829</code>
	</div>
	<div>
		<span title="icon-trash-restore-alt" aria-label="icon-trash-restore-alt">&#xf82a;</span>
		<code>f82a</code>
	</div>
</div>
