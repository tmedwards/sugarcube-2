########################################################################################################################
#
# sugarcube-2.py
#
# Copyright (c) 2013-2025 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.
#
########################################################################################################################

import os, os.path, header
from collections import OrderedDict

class Header (header.Header):

	def filesToEmbed(self):
		userLibPath = self.path + os.sep + 'userlib.js'
		if os.path.isfile(userLibPath):
			return OrderedDict([
				('"USER_LIB"', userLibPath)
			])
		else:
			return OrderedDict()

	def storySettings(self):
		return "SugarCube 2.x does not support the StorySettings special passage.\n\nInstead, you should use its configuration object, Config.\n    See: http://www.motoslave.net/sugarcube/2/docs/#config-api"

	def isEndTag(self, name, tag):
		return (name == ('/' + tag) or name == ('end' + tag))

	def nestedMacros(self):
		return [
				# standard macros
				'append',
				'button',
				'capture',
				'createaudiogroup',
				'createplaylist',
				'cycle',
				'for',
				'if',
				'link',
				'linkappend',
				'linkprepend',
				'linkreplace',
				'listbox',
				'nobr',
				'prepend',
				'repeat',
				'replace',
				'script',
				'switch',
				'silently',
				'timed',
				'type',
				'widget',
				# deprecated macros
				'click'
			]

	def passageTitleColor(self, passage):
		additionalSpecialPassages = [
				'PassageDone',
				'PassageFooter',
				'PassageHeader',
				'PassageReady',
				'StoryBanner',
				'StoryCaption',
				'StoryDisplayTitle',
				'StoryInterface',
				'StoryShare'
			]
		if passage.isStylesheet():
			return ((111, 49, 83), (234, 123, 184))
		elif passage.isScript():
			return ((89, 66, 28), (226, 170, 80))
		elif ('widget' in passage.tags):
			return ((80, 106, 26), (134, 178, 44))
		elif passage.isInfoPassage() or (passage.title in additionalSpecialPassages):
			return ((28, 89, 74), (41, 214, 113))
		elif passage.title == 'Start':
			return ('#4ca333', '#4bdb24')

	def passageChecks(self):
		return super(Header, self).passageChecks()
