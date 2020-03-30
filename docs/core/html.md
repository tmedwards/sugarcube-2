<!-- ***********************************************************************************************
	HTML
************************************************************************************************ -->
# <abbr title="HyperText Markup Language">HTML</abbr> {#html}

The hierarchy of the document body, including associated HTML IDs and class names is as follows.

#### Notes:

* Periods of ellipsis (`…`) signify data that is dynamically generated at run time.
* The `#story-title-separator` element is normally unused.
* The story menu, `#menu-story`, will only exist if the [`StoryMenu` special passage](#special-passage-storymenu) is used.
* The core menu item for the Settings dialog, `#menu-item-settings`, will only exist if the [`Setting` API](#setting-api) is used.
* The core menu item for the Share dialog, `#menu-item-share`, will only exist if the [`StoryShare` special passage](#special-passage-storyshare) is used.

```
<body class="…">
	<div id="init-screen"></div>
	<div id="ui-overlay" class="ui-close"></div>
	<div id="ui-dialog" tabindex="0" role="dialog" aria-labelledby="ui-dialog-title">
		<div id="ui-dialog-titlebar">
			<h1 id="ui-dialog-title"></h1>
			<button id="ui-dialog-close" class="ui-close" tabindex="0" aria-label="…"></button>
		</div>
		<div id="ui-dialog-body"></div>
	</div>
	<div id="ui-bar">
		<div id="ui-bar-tray">
			<button id="ui-bar-toggle" tabindex="0" title="…" aria-label="…"></button>
			<div id="ui-bar-history">
				<button id="history-backward" tabindex="0" title="…" aria-label="…">…</button>
				<button id="history-jumpto" tabindex="0" title="…" aria-label="…">…</button>
				<button id="history-forward" tabindex="0" title="…" aria-label="…">…</button>
			</div>
		</div>
		<div id="ui-bar-body">
			<header id="title" role="banner">
				<div id="story-banner"></div>
				<h1 id="story-title"></h1>
				<div id="story-subtitle"></div>
				<div id="story-title-separator"></div>
				<p id="story-author"></p>
			</header>
			<div id="story-caption"></div>
			<nav id="menu" role="navigation">
				<ul id="menu-story">…<ul>
				<ul id="menu-core">
					<li id="menu-item-saves"><a tabindex="0">…</a></li>
					<li id="menu-item-settings"><a tabindex="0">…</a></li>
					<li id="menu-item-restart"><a tabindex="0">…</a></li>
					<li id="menu-item-share"><a tabindex="0">…</a></li>
				</ul>
			</nav>
		</div>
	</div>
	<div id="story" role="main">
		<div id="passages">
			<div class="passage …" id="…" data-passage="…">
				<!-- The active (present) passage content -->
			</div>
		</div>
	</div>
	<!-- The story data chunk, which depends on the compiler release (see below) -->
	<script id="script-sugarcube" type="text/javascript"><!-- The main SugarCube module --></script>
</body>
```

#### Story data chunks:

Periods of ellipsis (`…`) signify data that is generated at compile time.

##### Twine 2 style data chunk

```
<tw-storydata name="…" startnode="…" creator="…" creator-version="…"
	ifid="…" zoom="…" format="…" format-version="…" options="…" hidden>
	<!-- Passage data nodes… -->
</tw-storydata>
```

##### Twine 1 style data chunk

```
<div id="store-area" data-size="…" hidden>
	<!-- Passage data nodes… -->
</div>
```
