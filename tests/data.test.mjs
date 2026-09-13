/** Data-contract regression tests. Each mutation starts from the real archive. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateData } from '../js/validate-data.js';

const archive = JSON.parse(await readFile(new URL('../data/content.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(archive);
const invalid = (name, mutate) => test(name, () => {
  const record = copy();
  mutate(record);
  assert.throws(() => validateData(record), Error);
});

test('the researched archive satisfies the schema and is returned for rendering', () => {
  const data = copy();
  assert.equal(validateData(data), data);
});

test('both lifetime endpoints and percentage endpoints are valid', () => {
  const data = copy();
  data.milestones[0].year = 1997;
  data.milestones.at(-1).year = 2025;
  data.statistics[0].value = 0;
  data.statistics[1].value = 100;
  assert.doesNotThrow(() => validateData(data));
});

for (const value of [null, [], 'archive', 42]) {
  test(`rejects a non-record root (${JSON.stringify(value)})`, () => {
    assert.throws(() => validateData(value), Error);
  });
}
for (const collection of ['milestones', 'statistics', 'sources']) {
  invalid(`rejects a missing ${collection} collection`, data => { delete data[collection]; });
  invalid(`rejects an object instead of the ${collection} array`, data => { data[collection] = {}; });
  invalid(`rejects an empty ${collection} collection`, data => { data[collection] = []; });
  invalid(`rejects duplicate ${collection} identifiers`, data => { data[collection].push(structuredClone(data[collection][0])); });
}
for (const year of [1996, 2026, 2001.5, '2013', null]) {
  invalid(`rejects invalid milestone year ${JSON.stringify(year)}`, data => { data.milestones[0].year = year; });
}
for (const value of [-0.1, 100.1, '78.2', null, NaN, Infinity]) {
  invalid(`rejects invalid percentage ${String(value)}`, data => { data.statistics[0].value = value; });
}
for (const collection of ['milestones', 'statistics']) {
  invalid(`rejects a dangling ${collection} source reference`, data => { data[collection][0].sourceId = 'no-such-source'; });
}
for (const url of ['javascript:alert(1)', 'data:text/html,<h1>unsafe</h1>', 'ftp://example.org/file', '//example.org/file', 'not a URL']) {
  invalid(`rejects unsafe or malformed source URL ${url}`, data => { data.sources[0].url = url; });
}
for (const [collection, field] of [
  ['milestones', 'title'], ['milestones', 'body'], ['milestones', 'category'],
  ['statistics', 'label'], ['sources', 'publisher'], ['sources', 'title'],
  ['sources', 'supports'], ['sources', 'accessed'],
]) {
  invalid(`rejects missing ${collection}.${field}`, data => { delete data[collection][0][field]; });
  invalid(`rejects wrong type for ${collection}.${field}`, data => { data[collection][0][field] = 123; });
}
invalid('rejects an unsafe identifier before insertion into an HTML attribute', data => { data.milestones[0].id = '\" onclick=\"alert(1)'; });

// Date.parse normalises some impossible dates instead of rejecting them.
for (const date of ['2025-02-29', '2025-02-31', '2025-04-31']) {
  invalid(`rejects a nonexistent calendar date ${date}`, data => { data.sources[0].accessed = date; });
}
test('accepts a real leap day in an access date', () => {
  const data = copy();
  data.sources[0].accessed = '2024-02-29';
  assert.doesNotThrow(() => validateData(data));
});
