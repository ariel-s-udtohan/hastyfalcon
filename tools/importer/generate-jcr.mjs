/*
 * Generate JCR content (.md + .xml) for xwalk / Universal Editor authoring.
 *
 * For each page: load the source HTML in a headless browser, inject the helix
 * importer + the page's bundled import script, run html2md to get gridtable
 * markdown, then convert that markdown to JCR XML via @adobe/helix-md2jcr using
 * the project's component model definitions.
 *
 * Usage:
 *   node tools/importer/generate-jcr.mjs <name>=<sourceUrl> [<name>=<url> ...]
 * Example:
 *   node tools/importer/generate-jcr.mjs index=http://localhost:8899/energy_provider_mvp.html
 */
import {
  readFileSync, writeFileSync, existsSync, mkdirSync,
} from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const SCRIPTS_DIR = '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts';
const playwright = await import(join(SCRIPTS_DIR, 'node_modules/playwright/index.js'));
const { chromium } = playwright.default || playwright;
const HELIX_IMPORTER = join(SCRIPTS_DIR, 'static/inject/helix-importer.js');
const MD2JCR_ENTRY = join(SCRIPTS_DIR, 'node_modules/@adobe/helix-md2jcr/src/index.js');

const REPO = resolve(fileURLToPath(import.meta.url), '../../..');
const OUT_DIR = join(REPO, 'migration-work/jcr-content');
const IMPORTER_DIR = join(REPO, 'tools/importer');

const { md2jcr } = await import(MD2JCR_ENTRY);

const models = JSON.parse(readFileSync(join(REPO, 'component-models.json'), 'utf-8'));
const definition = JSON.parse(readFileSync(join(REPO, 'component-definition.json'), 'utf-8'));
const filters = JSON.parse(readFileSync(join(REPO, 'component-filters.json'), 'utf-8'));

const helixImporterScript = readFileSync(HELIX_IMPORTER, 'utf-8');

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function getMarkdown(page, url, importScriptContent) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Inject helix importer bundle
  await page.evaluate((script) => {
    const originalDefine = window.define;
    if (typeof window.define !== 'undefined') delete window.define;
    const el = document.createElement('script');
    el.textContent = script;
    document.head.appendChild(el);
    if (originalDefine) window.define = originalDefine;
  }, helixImporterScript);

  // Inject the page's import script as CustomImportScript
  await page.evaluate((script) => {
    const wrapped = script.replace(/export\s+default/, 'window.CustomImportScript = ');
    const el = document.createElement('script');
    el.textContent = wrapped;
    document.head.appendChild(el);
  }, importScriptContent);

  return page.evaluate(async (pageUrl) => {
    const cfg = window.CustomImportScript?.default || window.CustomImportScript;
    const result = await window.WebImporter.html2md(pageUrl, document, cfg, {
      toDocx: false, toMd: true, originalURL: pageUrl,
    });
    return result.md;
  }, url);
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    process.stderr.write('Usage: node generate-jcr.mjs <name>=<url> ...\n');
    process.exit(1);
  }

  ensureDir(OUT_DIR);
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext();

  // Process pages sequentially, reusing one browser context.
  await args.reduce((chain, arg) => chain.then(async () => {
    const idx = arg.indexOf('=');
    const name = arg.slice(0, idx);
    const url = arg.slice(idx + 1);
    // import script name: index page uses import-home.js
    const scriptName = name === 'index' ? 'home' : name;
    const importScript = readFileSync(join(IMPORTER_DIR, `import-${scriptName}.js`), 'utf-8');

    const page = await context.newPage();
    try {
      const md = await getMarkdown(page, url, importScript);
      const xml = await md2jcr(md, { models, definition, filters });
      writeFileSync(join(OUT_DIR, `${name}.md`), md, 'utf-8');
      writeFileSync(join(OUT_DIR, `${name}.xml`), xml, 'utf-8');
      process.stdout.write(`✅ ${name}: md ${md.length}b, xml ${xml.length}b\n`);
    } catch (e) {
      process.stdout.write(`❌ ${name}: ${e.message}\n`);
    } finally {
      await page.close();
    }
  }), Promise.resolve());

  await context.close();
  await browser.close();
}

await main();
