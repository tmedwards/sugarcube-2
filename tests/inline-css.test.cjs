const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const context = vm.createContext({});
for (const file of ['lib/patterns.js', 'util/enumfrom.js', 'util/cssproptodomprop.js', 'markup/lexer.js', 'markup/wikifier-util.js']) {
	vm.runInContext(fs.readFileSync(path.join(__dirname, '../src', file), 'utf8'), context);
}
const inlineCss = context.WikifierUtil.inlineCss;

for (const prefix of ['.A;', '#first;', 'color:red;']) {
	test(`custom style content with a colon stays inside its span: ${prefix}`, () => {
		const source = `@@${prefix}Character: first.@@ @@.B;Character: second.@@ @@.C;Character: third.@@`;
		const state = { source, nextMatch: 2 };
		inlineCss(state, '@@');
		assert.equal(state.nextMatch, 2 + prefix.length);
	});
}

test('valid styles and classes before a terminator are consumed', () => {
	const state = { source: '@@.A;color:red;Text@@', nextMatch: 2 };
	const css = inlineCss(state, '@@');
	assert.equal(state.nextMatch, state.source.indexOf('Text'));
	assert.equal(css.classes[0], 'A');
	assert.equal(css.styles.color, 'red');
});

test('an unterminated custom style still parses its CSS prefix', () => {
	const state = { source: '@@color:red;Text', nextMatch: 2 };
	assert.equal(inlineCss(state, '@@').styles.color, 'red');
	assert.equal(state.nextMatch, state.source.indexOf('Text'));
});

test('table and existing utility callers retain CSS values containing @@', () => {
	const state = { source: 'content:@@;Text|', nextMatch: 0 };
	assert.equal(inlineCss(state).styles.content, '@@');
	assert.equal(state.nextMatch, state.source.indexOf('Text'));
});
