/* global WebImporter */

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

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

function buildJobListings(document, page) {
  const list = page.querySelector('.job-list');
  if (!list) return null;
  const cells = [['Job Listings']];
  [...list.querySelectorAll('.job-card')].forEach((card) => {
    const title = clean(card.querySelector('.j-title')?.textContent);
    const dept = clean(card.querySelector('.j-dept')?.textContent);
    const type = clean(card.querySelector('.j-type')?.textContent);
    const loc = clean(card.querySelector('.j-loc')?.textContent);
    const desc = clean(card.querySelector('.j-desc')?.textContent);
    cells.push([title, dept, type, loc, desc]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildCtaBand(document, page) {
  const cta = page.querySelector('.careers-cta');
  if (!cta) return null;
  const heading = clean(cta.querySelector('.cta-heading')?.textContent);
  const sub = clean(cta.querySelector('.cta-sub')?.textContent);
  const btnText = clean(cta.querySelector('.cta-btn')?.textContent);

  const text = document.createElement('div');
  if (heading) { const p = document.createElement('p'); p.textContent = heading; text.append(p); }
  if (sub) { const p = document.createElement('p'); p.textContent = sub; text.append(p); }

  const linkEl = document.createElement('div');
  if (btnText) {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = btnText;
    linkEl.append(a);
  }
  return WebImporter.DOMUtils.createTable([['CTA Band'], [text], [linkEl]], document);
}

function appendSectionMetadata(main, document, style) {
  main.append(WebImporter.DOMUtils.createTable([
    ['Section Metadata'],
    ['Style', style],
  ], document));
}

export default {
  transformDOM: ({ document }) => {
    const page = document.querySelector('#page-careers') || document.body;
    const main = document.createElement('main');

    const header = buildPageHeader(document, page);
    if (header) main.append(header);
    main.append(document.createElement('hr'));

    const jobs = buildJobListings(document, page);
    if (jobs) main.append(jobs);
    const cta = buildCtaBand(document, page);
    if (cta) main.append(cta);
    appendSectionMetadata(main, document, 'page-body');

    return main;
  },

  generateDocumentPath: () => '/careers',
};
