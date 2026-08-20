/* global WebImporter */

/**
 * Import script for the Voltara Energy Home page.
 *
 * Transforms the source prototype DOM (SPA "home" page) into AEM Edge Delivery
 * block tables for the custom blocks: Hero, Metrics, Stats, Feature Cards,
 * Usage Dashboard. Section breaks (<hr>) and Section Metadata tables control
 * section styling.
 */

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

/** Build the Hero block table. */
function buildHero(document, home) {
  const hero = home.querySelector('.hero');
  if (!hero) return null;

  const badge = clean(hero.querySelector('.hero-badge')?.textContent);
  const h1 = hero.querySelector('h1');
  const subtitle = clean(hero.querySelector(':scope > p')?.textContent);
  const buttons = [...hero.querySelectorAll('.hero-actions button')]
    .map((b) => clean(b.textContent));

  // heading with accent span → em
  const headingEl = document.createElement('div');
  if (h1) {
    const clone = h1.cloneNode(true);
    clone.querySelectorAll('span').forEach((span) => {
      const em = document.createElement('em');
      em.textContent = span.textContent;
      span.replaceWith(em);
    });
    const hEl = document.createElement('h1');
    hEl.innerHTML = clone.innerHTML.replace(/<br\s*\/?>/gi, ' ');
    headingEl.append(hEl);
  }

  const cells = [['Hero']];
  if (badge) cells.push([badge]);
  cells.push([headingEl]);
  if (subtitle) cells.push([subtitle]);

  // CTA links (prototype used buttons — represent as links so EDS decorates them)
  const actions = document.createElement('div');
  buttons.forEach((label) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = label.replace(/\s*→\s*$/, '');
    p.append(a);
    actions.append(p);
  });
  if (buttons.length) cells.push([actions]);

  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Build the Metrics block table (glass energy meter). */
function buildMetrics(document, home) {
  const meter = home.querySelector('.energy-meter');
  if (!meter) return null;

  const cells = [['Metrics']];
  [...meter.children].forEach((item) => {
    const value = clean(item.querySelector('.meter-val')?.textContent);
    const label = clean(item.querySelector('.meter-label')?.textContent);
    const change = clean(item.querySelector('.meter-change')?.textContent);
    cells.push([value, label, change]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Build the Stats block table. */
function buildStats(document, home) {
  const strip = home.querySelector('.stats-inner');
  if (!strip) return null;

  const cells = [['Stats']];
  [...strip.querySelectorAll('.stat-item')].forEach((item) => {
    const value = clean(item.querySelector('.stat-value')?.textContent);
    const label = clean(item.querySelector('.stat-label')?.textContent);
    cells.push([value, label]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Build the Feature Cards block table. */
function buildFeatureCards(document, home) {
  const grid = home.querySelector('.card-grid');
  if (!grid) return null;

  const cells = [['Feature Cards']];
  [...grid.querySelectorAll('.card')].forEach((card) => {
    const icon = clean(card.querySelector('.card-icon')?.textContent);
    const title = clean(card.querySelector('h3')?.textContent);
    const desc = clean(card.querySelector('p')?.textContent);
    const linkText = clean(card.querySelector('.card-link')?.textContent);

    const body = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = desc;
    body.append(p);

    const linkEl = document.createElement('div');
    if (linkText) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = linkText.replace(/\s*→\s*$/, '');
      linkEl.append(a);
    }

    cells.push([icon, title, body, linkEl]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Build the section intro (label + title + subtitle) as default content. */
function buildIntro(document, home) {
  const section = home.querySelector('.section');
  if (!section) return null;
  const label = clean(section.querySelector('.section-label')?.textContent);
  const title = clean(section.querySelector('.section-title')?.textContent);
  const subtitle = clean(section.querySelector('.section-subtitle')?.textContent);

  const wrap = document.createElement('div');
  if (label) {
    const p = document.createElement('p');
    p.textContent = label;
    wrap.append(p);
  }
  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title;
    wrap.append(h2);
  }
  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle;
    wrap.append(p);
  }
  return wrap;
}

/** Build the Usage Dashboard block table (smart metering). */
function buildUsageDashboard(document, home) {
  const band = home.querySelector('.smart-metering-band');
  if (!band) return null;

  const promoCol = band.querySelector('.two-col > div');
  const panel = band.querySelector('.usage-panel');
  if (!promoCol || !panel) return null;

  const label = clean(promoCol.querySelector('.section-label')?.textContent);
  const title = clean(promoCol.querySelector('.section-title')?.textContent);
  const desc = clean(promoCol.querySelector('p')?.textContent);
  const ctaText = clean(promoCol.querySelector('button')?.textContent);

  // Left promo cell
  const promo = document.createElement('div');
  if (label) { const p = document.createElement('p'); p.textContent = label; promo.append(p); }
  if (title) { const h = document.createElement('h2'); h.textContent = title; promo.append(h); }
  if (desc) { const p = document.createElement('p'); p.textContent = desc; promo.append(p); }
  if (ctaText) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = ctaText;
    p.append(a);
    promo.append(p);
  }

  const cells = [['Usage Dashboard']];
  cells.push([promo]);

  // Card title row
  const cardTitle = clean(panel.querySelector('.usage-panel-title')?.textContent);
  cells.push([cardTitle]);

  // Usage bar rows: [label, value, percent, tone]
  [...panel.querySelectorAll('.usage-row')].forEach((row) => {
    const barLabel = clean(row.querySelector('.usage-row-label')?.textContent);
    const barValue = clean(row.querySelector('.usage-row-value')?.textContent);
    const pctEl = row.querySelector('.usage-row-pct');
    const pct = pctEl?.getAttribute('data-pct') || '';
    const tone = pctEl?.getAttribute('data-tone') || 'brand';
    cells.push([barLabel, barValue, pct, tone]);
  });

  // Spend footer row
  const spendLabel = clean(panel.querySelector('.usage-spend-label')?.textContent);
  const spendValue = clean(panel.querySelector('.usage-spend-value')?.textContent);
  cells.push([spendLabel, spendValue]);

  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Append a Section Metadata table with the given style. */
function appendSectionMetadata(main, document, style) {
  const table = WebImporter.DOMUtils.createTable([
    ['Section Metadata'],
    ['Style', style],
  ], document);
  main.append(table);
}

export default {
  transformDOM: ({ document }) => {
    const home = document.querySelector('#page-home') || document.body;
    const main = document.createElement('main');

    // --- Section 1: Hero + Metrics (dark gradient shell) ---
    const hero = buildHero(document, home);
    if (hero) main.append(hero);
    const metrics = buildMetrics(document, home);
    if (metrics) main.append(metrics);
    appendSectionMetadata(main, document, 'hero-section');
    main.append(document.createElement('hr'));

    // --- Section 2: Stats strip ---
    const stats = buildStats(document, home);
    if (stats) {
      main.append(stats);
      main.append(document.createElement('hr'));
    }

    // --- Section 3: Why Voltara intro + feature cards ---
    const intro = buildIntro(document, home);
    if (intro) main.append(intro);
    const cards = buildFeatureCards(document, home);
    if (cards) main.append(cards);
    appendSectionMetadata(main, document, 'section-intro');
    main.append(document.createElement('hr'));

    // --- Section 4: Smart metering usage dashboard ---
    const usage = buildUsageDashboard(document, home);
    if (usage) main.append(usage);

    return main;
  },

  generateDocumentPath: () => '/index',
};
