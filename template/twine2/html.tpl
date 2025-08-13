<!DOCTYPE html>
<html data-init="no-js">
<head>
<meta charset="UTF-8" />
<title>{{STORY_NAME}}</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="application-name" content="SugarCube" />
<meta name="version" content="'{{BUILD_VERSION_VERSION}}'" />
<!--

SugarCube (v'{{BUILD_VERSION_VERSION}}'): A free (gratis and libre) story format.

Copyright © 2013–2025 Thomas Michael Edwards <thomasmedwards@gmail.com>.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

-->
<script id="script-libraries" type="text/javascript">
if(document.head&&document.addEventListener&&document.querySelector&&Object.create&&Object.freeze&&JSON){document.documentElement.setAttribute("data-init", "loading");
'{{BUILD_LIB_SOURCE}}'
}else{document.documentElement.setAttribute("data-init", "lacking");}
</script>
'{{BUILD_CSS_SOURCE}}'
</head>
<body>
	<div id="init-screen">
		<div id="init-no-js"><noscript>JavaScript must be enabled to play.</noscript></div>
		<div id="init-lacking"><p>Browser lacks capabilities required to play.</p><p>Upgrade or switch to another browser.</p></div>
		<div id="init-loading"><div>Loading&hellip;</div></div>
	</div>
	{{STORY_DATA}}
	<script id="script-sugarcube" type="text/javascript">
	/*! SugarCube JS */
	if(document.documentElement.getAttribute("data-init")==="loading"){'{{BUILD_APP_SOURCE}}'}
	</script>
</body>
</html>
