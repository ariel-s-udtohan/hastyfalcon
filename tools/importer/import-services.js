/* global WebImporter */

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

/** Page Header block. */
function buildPageHeader(document, page) {
  const header = page.querySelector('.page-header');
  if (!header) return null;
  const label = clean(header.querySelector('.ph-label')?.textContent);
  const title = clean(header.querySelector('h1')?.textContent);
  const sub = clean(header.querySelector('.ph-sub')?.textContent);

  const titleEl = document.createElement('h1');
  titleEl.textContent = title;

  const cells = [['Page Header']];
  if (label) cells.push([label]);
  cells.push([titleEl]);
  if (sub) cells.push([sub]);
  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Pricing Plans block. */
function buildPricingPlans(document, page) {
  const wrap = page.querySelector('.plan-cards');
  if (!wrap) return null;

  const cells = [['Pricing Plans']];
  [...wrap.querySelectorAll('.plan-card')].forEach((card) => {
    const badge = clean(card.querySelector('.plan-badge')?.textContent);
    const name = clean(card.querySelector('.plan-name')?.textContent);
    const charge = clean(card.querySelector('.plan-charge')?.textContent);
    const ctaText = clean(card.querySelector('.plan-cta')?.textContent);

    // Price with £ superscript + /unit suffix
    const rawPrice = clean(card.querySelector('.plan-price')?.textContent);
    const priceEl = document.createElement('div');
    const m = rawPrice.match(/^£\s*([\d.]+)\s*\/\s*(.+)$/);
    if (m) {
      priceEl.innerHTML = `<sup>£</sup>${m[1]}<span>/${m[2]}</span>`;
    } else {
      priceEl.textContent = rawPrice;
    }

    // Features list — reuse original <ul>
    const featuresEl = document.createElement('div');
    const ul = card.querySelector('.plan-features');
    if (ul) {
      const cleanUl = document.createElement('ul');
      [...ul.querySelectorAll('li')].forEach((li) => {
        const item = document.createElement('li');
        item.textContent = clean(li.textContent);
        cleanUl.append(item);
      });
      featuresEl.append(cleanUl);
    }

    cells.push([badge, name, priceEl, charge, featuresEl, ctaText]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

/** Business energy intro (default content). */
function buildBusinessIntro(document, page) {
  const section = page.querySelector('.business-section');
  if (!section) return null;
  const label = clean(section.querySelector('.section-label')?.textContent);
  const title = clean(section.querySelector('.section-title')?.textContent);
  const sub = clean(section.querySelector('.section-subtitle')?.textContent);

  const wrap = document.createElement('div');
  if (label) { const p = document.createElement('p'); p.textContent = label; wrap.append(p); }
  if (title) { const h = document.createElement('h2'); h.textContent = title; wrap.append(h); }
  if (sub) { const p = document.createElement('p'); p.textContent = sub; wrap.append(p); }
  return wrap;
}

/** Business energy Feature Cards block. */
function buildBusinessCards(document, page) {
  const grid = page.querySelector('.business-section .card-grid');
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

function appendSectionMetadata(main, document, style) {
  main.append(WebImporter.DOMUtils.createTable([
    ['Section Metadata'],
    ['Style', style],
  ], document));
}

export default {
  transformDOM: ({ document }) => {
    const page = document.querySelector('#page-services') || document.body;
    const main = document.createElement('main');

    // Section 1: header banner
    const header = buildPageHeader(document, page);
    if (header) main.append(header);
    main.append(document.createElement('hr'));

    // Section 2: pricing plans (padded body)
    const plans = buildPricingPlans(document, page);
    if (plans) main.append(plans);
    appendSectionMetadata(main, document, 'page-body');
    main.append(document.createElement('hr'));

    // Section 3: business energy intro + cards
    const intro = buildBusinessIntro(document, page);
    if (intro) main.append(intro);
    const cards = buildBusinessCards(document, page);
    if (cards) main.append(cards);
    appendSectionMetadata(main, document, 'labelled-section, page-body');

    return main;
  },

  generateDocumentPath: () => '/services',
};
