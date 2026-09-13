/** Exercise the authored timeline application with real templates and archive data. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { renderTemplate } from '../js/template-engine.js';
import { validateData } from '../js/validate-data.js';

test('clear filters recovers an empty search and resets the URL, era and focus', async () => {
  const [html, source, archive] = await Promise.all([
    readFile(new URL('../timeline.html', import.meta.url), 'utf8'),
    readFile(new URL('../js/app.js', import.meta.url), 'utf8'),
    readFile(new URL('../data/content.json', import.meta.url), 'utf8'),
  ]);
  const data = JSON.parse(archive);
  const dom = new JSDOM(html, {
    url: 'https://example.test/peru-online/timeline.html?era=mobile',
    runScripts: 'outside-only',
  });
  try {
    const context = dom.getInternalVMContext();
    // Supply real imported functions; only network transport is substituted.
    context.renderTemplate = renderTemplate;
    context.validateData = validateData;
    context.startGlobe = () => assert.fail('The timeline should not start a globe');
    context.fetch = async () => ({ ok: true, json: async () => structuredClone(data) });
    vm.runInContext(source.replace(/^import .*;\r?\n/gm, ''), context);
    // The application has one asynchronous JSON request before initial rendering.
    await new Promise(resolve => setImmediate(resolve));
    const document = dom.window.document;
    const search = document.getElementById('search');
    assert.equal(document.querySelector('[data-era="mobile"]').getAttribute('aria-pressed'), 'true');
    assert.ok(document.querySelectorAll('.milestone').length > 0);

    search.value = 'unfindableterm';
    search.dispatchEvent(new dom.window.Event('input'));
    assert.equal(document.querySelectorAll('.milestone').length, 0);
    assert.ok(document.querySelector('.empty-state'));

    const reset = document.getElementById('clear-filters');
    assert.ok(reset, 'Empty-result recovery needs a clear-filters control');
    reset.focus();
    reset.click();
    assert.equal(search.value, '');
    assert.equal(document.querySelectorAll('.milestone').length, data.milestones.length);
    assert.match(document.getElementById('result-count').textContent, /^10 OF 10 MILESTONES/);
    assert.equal(document.querySelector('.empty-state'), null);
    assert.equal(document.querySelector('[data-era="all"]').getAttribute('aria-pressed'), 'true');
    assert.equal(document.querySelector('[data-era="mobile"]').getAttribute('aria-pressed'), 'false');
    assert.equal(new URL(dom.window.location.href).searchParams.has('era'), false);
    assert.equal(document.activeElement, search);
  } finally {
    dom.window.close();
  }
});
