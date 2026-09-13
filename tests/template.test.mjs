/** Security-sensitive escaping is checked by parsing the result as real HTML. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { renderTemplate, escapeHTML } from '../js/template-engine.js';

test('renders repeated tokens, numerical values, and Unicode text', () => {
  const output = renderTemplate('<p>{{year}} — {{title}} / {{title}}</p>', { year: 1997, title: 'Perú: conexión' });
  assert.equal(output, '<p>1997 — Perú: conexión / Perú: conexión</p>');
});

test('text tokens cannot create injected HTML elements', () => {
  const attack = '<img class="injected" src=x onerror="alert(1)"> & " \' ';
  const dom = new JSDOM(renderTemplate('<p>{{body}}</p>', { body: attack }));
  assert.equal(dom.window.document.querySelector('p').textContent, attack);
  assert.equal(dom.window.document.querySelector('.injected'), null);
  dom.window.close();
});

test('attribute tokens cannot escape their quoted attribute', () => {
  const attack = '\" autofocus onfocus=\"alert(1)';
  const dom = new JSDOM(renderTemplate('<p data-label="{{label}}">Safe element</p>', { label: attack }));
  const element = dom.window.document.querySelector('p');
  assert.equal(element.getAttribute('data-label'), attack);
  assert.equal(element.hasAttribute('autofocus'), false);
  assert.equal(element.hasAttribute('onfocus'), false);
  dom.window.close();
});

test('existing entity-looking content remains literal text', () => {
  const body = '&lt;script&gt; &amp;';
  const dom = new JSDOM(renderTemplate('<p>{{body}}</p>', { body }));
  assert.equal(dom.window.document.querySelector('p').textContent, body);
  assert.equal(dom.window.document.querySelector('script'), null);
  dom.window.close();
});

test('escapeHTML safely preserves all HTML-significant characters as text', () => {
  const input = '& < > " \' Perú';
  const dom = new JSDOM(`<p>${escapeHTML(input)}</p>`);
  assert.equal(dom.window.document.querySelector('p').textContent, input);
  assert.equal(dom.window.document.querySelector('p').children.length, 0);
  dom.window.close();
});

test('substitution treats regular-expression replacement symbols literally', () => {
  const value = '$& $` $\' $$';
  const dom = new JSDOM(renderTemplate('<p>{{body}}</p>', { body: value }));
  assert.equal(dom.window.document.querySelector('p').textContent, value);
  dom.window.close();
});

test('missing fields fail instead of silently publishing incomplete content', () => {
  assert.throws(() => renderTemplate('<p>{{title}}</p>', {}), /Missing template field/);
});

test('inherited properties cannot supply template data', () => {
  const record = Object.create({ title: 'inherited value' });
  assert.throws(() => renderTemplate('<p>{{title}}</p>', record), /Missing template field/);
});

test('object or function values cannot become template content', () => {
  for (const title of [{ text: 'nested' }, () => 'executable', null, undefined]) {
    assert.throws(() => renderTemplate('<p>{{title}}</p>', { title }), /primitive/);
  }
});
