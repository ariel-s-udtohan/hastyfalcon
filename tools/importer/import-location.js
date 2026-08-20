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

function buildOutageBanner(document, page) {
  const banner = page.querySelector('.outage-banner');
  if (!banner) return null;
  const content = document.createElement('div');
  const p = document.createElement('p');
  // preserve the leading bold segment + link
  p.innerHTML = banner.innerHTML;
  content.append(p);
  return WebImporter.DOMUtils.createTable([['Outage Banner'], [content]], document);
}

function buildAreaFinder(document, page) {
  const split = page.querySelector('.geo-split');
  if (!split) return null;

  const cells = [['Area Finder']];
  const heading = clean(split.querySelector('.finder-heading')?.textContent);
  cells.push([heading]);

  [...split.querySelectorAll('.coverage-row')].forEach((row) => {
    const region = clean(row.querySelector('.cov-region')?.textContent);
    const status = clean(row.querySelector('.cov-status')?.textContent);
    const tone = clean(row.querySelector('.cov-tone')?.textContent);
    cells.push([region, status, tone]);
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
    const page = document.querySelector('#page-location') || document.body;
    const main = document.createElement('main');

    const header = buildPageHeader(document, page);
    if (header) main.append(header);
    main.append(document.createElement('hr'));

    const banner = buildOutageBanner(document, page);
    if (banner) main.append(banner);
    const finder = buildAreaFinder(document, page);
    if (finder) main.append(finder);
    appendSectionMetadata(main, document, 'page-body');

    return main;
  },

  generateDocumentPath: () => '/location',
};
