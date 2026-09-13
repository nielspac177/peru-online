/**
 * Reproducible coursework audit: authored HTML and JSON-rendered HTML.
 * Run `npm run audit` for the current result, or use --phase before to preserve
 * a first-pass report. The before report cannot be overwritten accidentally.
 *
 * jsdom has no layout or paint engine. This audit deliberately does not claim
 * to check colour contrast, responsive reflow, focus visibility, or all WCAG.
 * Complement these results with the real-browser checklist in evidence/tests.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { HtmlValidate, DynamicValue } from 'html-validate';
import { JSDOM, VirtualConsole } from 'jsdom';
import axe from 'axe-core';

const root = fileURLToPath(new URL('../', import.meta.url));
const phaseIndex = process.argv.indexOf('--phase');
const phase = phaseIndex >= 0 ? process.argv[phaseIndex + 1] : 'after';
if (!['before', 'after'].includes(phase)) throw new Error('--phase must be before or after');
const sourceOnly = process.argv.includes('--source-only');
const outputDirectory = path.join(root, 'evidence', 'tests', phase);
const outputFile = path.join(outputDirectory, sourceOnly ? 'source-baseline.json' : 'report.json');
if (phase === 'before') {
  try {
    await access(outputFile);
    throw new Error(`Preserved baseline already exists: ${outputFile}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const config = {
  extends: ['html-validate:recommended'],
  // The only inline property is a chart width generated from a validated 0–100
  // percentage. All visual styling remains in the stylesheet.
  rules: { 'no-inline-style': ['error', { allowedProperties: ['width'] }] },
};
const validator = new HtmlValidate(config);
const renderedConfig = {
  ...config,
  // DOM serialization and removing inert templates leave indentation text
  // nodes. Source formatting is checked above; generated whitespace is not
  // an HTML validity or accessibility defect.
  // DOM serialization expands hidden to hidden=""; that is valid HTML.
  // Enforce formatting preferences in source, not in browser serialization.
  rules: { ...config.rules, 'no-trailing-whitespace': 'off', 'attribute-boolean-style': 'off' },
};
const renderedValidator = new HtmlValidate(renderedConfig);
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const pages = ['index.html', 'timeline.html', 'connections.html', 'about.html', '404.html'];
const report = {
  generatedAt: new Date().toISOString(), phase,
  scope: sourceOnly ? 'Authored HTML before JavaScript content is loaded' : 'Authored HTML and actual templates rendered from validated project JSON',
  tools: { 'html-validate': '10.1.2', 'axe-core': axe.version, jsdom: '26.1.0' },
  htmlConfiguration: config,
  renderedHtmlConfiguration: renderedConfig,
  templateHandling: 'Authored id="{{id}}" and id="event-{{id}}" attributes are marked DynamicValue through the validator API. Rendered documents have inert template definitions removed and all generated IDs checked strictly.',
  accessibilityConfiguration: { wcagTags, disabledRules: ['color-contrast'] },
  limitations: [
    'jsdom does not implement a browser layout/paint engine. Colour contrast is explicitly disabled, not recorded as passing.',
    'Keyboard navigation, focus visibility, target size, zoom/reflow, motion, and screen-reader usability require separate browser/manual checks.',
    'An automated report with no violations does not establish WCAG conformance.',
    'Rendered checks use the production template engine and data validator directly. They do not execute browser module loading, search, filtering, or animation.',
    'HTML source line numbers refer to the source; rendered HTML line numbers refer to the serialized DOM.',
  ],
  inputHashes: {},
  pages: [],
};
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

let data;
let renderTemplate;
if (!sourceOnly) {
  const rawData = await readFile(path.join(root, 'data/content.json'), 'utf8');
  ({ renderTemplate } = await import('../js/template-engine.js'));
  const { validateData } = await import('../js/validate-data.js');
  data = validateData(JSON.parse(rawData));
  report.inputHashes['data/content.json'] = sha256(rawData);
  for (const name of ['js/template-engine.js', 'js/validate-data.js']) {
    report.inputHashes[name] = sha256(await readFile(path.join(root, name), 'utf8'));
  }
}

function renderCollection(document, targetId, templateId, rows) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const template = document.getElementById(templateId);
  if (!template) throw new Error(`Missing template ${templateId} for ${targetId}`);
  target.innerHTML = rows.map(row => renderTemplate(template.innerHTML, row)).join('');
}

function renderData(document) {
  const sourceMap = new Map(data.sources.map(source => [source.id, source]));
  const statistics = data.statistics.map(statistic => ({ ...statistic, display: statistic.value.toFixed(1) }));
  renderCollection(document, 'home-stats', 'stat-template', statistics.filter(statistic => ['national', 'lima', 'rural'].includes(statistic.id)));
  renderCollection(document, 'access-bars', 'bar-template', statistics);
  renderCollection(document, 'source-list', 'source-template', data.sources);
  const milestones = [...data.milestones].sort((a, b) => a.year - b.year).map(milestone => ({
    ...milestone,
    age: milestone.year - 1997,
    eraLabel: milestone.year < 2010 ? 'SHARED SCREENS' : milestone.year < 2020 ? 'A MOBILE COUNTRY' : 'THE LAST MILE',
    sourceUrl: `about.html#${milestone.sourceId}`,
    sourceLabel: `Source: ${sourceMap.get(milestone.sourceId).publisher}`,
  }));
  renderCollection(document, 'timeline-list', 'milestone-template', milestones);
  const count = document.getElementById('result-count');
  if (count) count.textContent = `${milestones.length} OF ${milestones.length} MILESTONES · AGE = YEARS SINCE 1997 (APPROXIMATE)`;
}

async function htmlCheck(markup, filename, authored = false) {
  const hooks = authored ? {
    *processAttribute(attribute) {
      // Recognise only the two ID token patterns used by our inert templates.
      if (attribute.key === 'id' && typeof attribute.value === 'string'
        && /^(?:event-)?{{id}}$/.test(attribute.value)) {
        yield { ...attribute, value: new DynamicValue(attribute.value) };
      } else yield attribute;
    },
  } : {};
  const result = await (authored ? validator : renderedValidator).validateString(markup, filename, hooks);
  return {
    valid: result.valid, errorCount: result.errorCount, warningCount: result.warningCount,
    messages: result.results.flatMap(file => file.messages.map(message => ({
      ruleId: message.ruleId, severity: message.severity, message: message.message,
      line: message.line, column: message.column, selector: message.selector,
      ruleUrl: message.ruleUrl,
    }))),
  };
}

function summarizeAxeItems(items) {
  return items.map(item => ({
    id: item.id, impact: item.impact, description: item.description,
    help: item.help, helpUrl: item.helpUrl, tags: item.tags,
    nodes: item.nodes.map(node => ({
      target: node.target, html: node.html, failureSummary: node.failureSummary,
    })),
  }));
}

async function accessibilityCheck(dom) {
  dom.window.eval(axe.source);
  const result = await dom.window.axe.run(dom.window.document, {
    runOnly: { type: 'tag', values: wcagTags },
    rules: { 'color-contrast': { enabled: false } },
  });
  return {
    violationCount: result.violations.length,
    failingNodeCount: result.violations.reduce((sum, item) => sum + item.nodes.length, 0),
    passRuleCount: result.passes.length,
    incompleteRuleCount: result.incomplete.length,
    inapplicableRuleCount: result.inapplicable.length,
    violations: summarizeAxeItems(result.violations),
    incomplete: summarizeAxeItems(result.incomplete),
  };
}

for (const page of pages) {
  const html = await readFile(path.join(root, page), 'utf8');
  report.inputHashes[page] = sha256(html);
  const dom = new JSDOM(html, {
    url: `https://example.test/peru-online/${page}`,
    runScripts: 'outside-only', pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
  });
  const entry = {
    page,
    source: { html: await htmlCheck(html, page, true), accessibility: await accessibilityCheck(dom) },
  };
  if (!sourceOnly) {
    renderData(dom.window.document);
    // Template definitions are inert source, already checked above. Removing
    // them exposes the generated markup to strict ID validation without hooks.
    dom.window.document.querySelectorAll('template').forEach(template => template.remove());
    entry.rendered = {
      html: await htmlCheck(dom.serialize(), `${page} (rendered)`),
      accessibility: await accessibilityCheck(dom),
      recordCounts: {
        milestones: dom.window.document.querySelectorAll('#timeline-list .milestone').length,
        statistics: dom.window.document.querySelectorAll('#home-stats .stat, #access-bars .bar-row').length,
        sources: dom.window.document.querySelectorAll('#source-list .source-item').length,
      },
    };
  }
  dom.window.close();
  report.pages.push(entry);
  const htmlErrors = entry.source.html.errorCount + (entry.rendered?.html.errorCount || 0);
  const a11yErrors = entry.source.accessibility.violationCount + (entry.rendered?.accessibility.violationCount || 0);
  console.log(`${page}: ${htmlErrors} HTML findings; ${a11yErrors} axe violations across tested states`);
}

report.totals = report.pages.reduce((total, page) => {
  for (const state of [page.source, page.rendered].filter(Boolean)) {
    total.htmlErrors += state.html.errorCount;
    total.htmlWarnings += state.html.warningCount;
    total.axeViolations += state.accessibility.violationCount;
    total.axeIncomplete += state.accessibility.incompleteRuleCount;
  }
  return total;
}, { htmlErrors: 0, htmlWarnings: 0, axeViolations: 0, axeIncomplete: 0 });
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Saved ${path.relative(root, outputFile)}`);
if (report.totals.htmlErrors || report.totals.axeViolations) process.exitCode = 1;
