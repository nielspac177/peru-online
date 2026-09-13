/** Catch missing packaged files and broken internal research/page anchors. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'timeline.html', 'connections.html', 'about.html', '404.html'];
const archive = JSON.parse(await readFile(new URL('data/content.json', root), 'utf8'));
const documents = new Map();
for (const page of pages) documents.set(page, new JSDOM(await readFile(new URL(page, root), 'utf8')).window.document);

test('every local page link, stylesheet, image and script refers to a packaged file', async () => {
  for (const [page, document] of documents) {
    for (const element of document.querySelectorAll('[href], [src]')) {
      const reference = element.getAttribute('href') ?? element.getAttribute('src');
      if (!reference || reference.includes('{{')) continue;
      const target = new URL(reference, `https://example.test/peru-online/${page}`);
      if (target.origin !== 'https://example.test') continue;
      const filename = decodeURIComponent(target.pathname.replace('/peru-online/', ''));
      await assert.doesNotReject(access(new URL(filename, root)), `${page}: missing ${reference}`);
      if (target.hash && documents.has(filename)) {
        const id = decodeURIComponent(target.hash.slice(1));
        const isSourceRecord = filename === 'about.html' && archive.sources.some(source => source.id === id);
        assert.ok(documents.get(filename).getElementById(id) || isSourceRecord, `${page}: missing anchor ${reference}`);
      }
    }
  }
});

test('every CSS font and image URL refers to a packaged asset', async () => {
  const stylesheetUrl = new URL('css/style.css', root);
  const stylesheet = await readFile(stylesheetUrl, 'utf8');
  for (const [, quoted] of stylesheet.matchAll(/url\(([^)]+)\)/g)) {
    const reference = quoted.trim().replace(/^['"]|['"]$/g, '');
    if (/^(data:|https?:)/.test(reference)) continue;
    await assert.doesNotReject(access(new URL(reference, stylesheetUrl)), `Missing CSS asset: ${reference}`);
  }
});

test('404 recovery links and styling resolve to real site files from nested missing paths', async () => {
  const document = documents.get('404.html');
  for (const missingPath of ['missing', 'unknown/deep/missing']) {
    const request = new URL(`https://nielspac177.github.io/peru-online/${missingPath}`);
    for (const element of document.querySelectorAll('[href], [src]')) {
      const reference = element.getAttribute('href') ?? element.getAttribute('src');
      if (reference.startsWith('#')) {
        assert.ok(document.getElementById(reference.slice(1)), `Missing 404 in-page target: ${reference}`);
        continue;
      }
      const target = new URL(reference, request);
      assert.equal(target.origin, request.origin);
      assert.ok(target.pathname.startsWith('/peru-online/'));
      const filename = target.pathname.slice('/peru-online/'.length);
      await assert.doesNotReject(access(new URL(filename, root)), `404 recovery from ${missingPath} points to missing ${target.href}`);
    }
  }
});
