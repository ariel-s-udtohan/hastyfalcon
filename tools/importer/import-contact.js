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

function buildContactForm(document, page) {
  const form = page.querySelector('.cf-form');
  if (!form) return null;
  const heading = clean(form.querySelector('.cf-heading')?.textContent);
  const subjects = clean(form.querySelector('.cf-subjects')?.textContent);
  return WebImporter.DOMUtils.createTable([
    ['Contact Form'],
    [heading],
    [subjects],
  ], document);
}

function buildContactMethods(document, page) {
  const methods = page.querySelector('.cf-methods');
  if (!methods) return null;
  const heading = clean(methods.querySelector('.cm-heading')?.textContent);
  const cells = [['Contact Methods'], [heading]];
  [...methods.querySelectorAll('.cm-card')].forEach((card) => {
    const title = clean(card.querySelector('.cm-title')?.textContent);
    const bodyEl = document.createElement('div');
    const bodySrc = card.querySelector('.cm-body');
    if (bodySrc) {
      const p = document.createElement('p');
      p.innerHTML = bodySrc.innerHTML;
      bodyEl.append(p);
    }
    cells.push([title, bodyEl]);
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
    const page = document.querySelector('#page-contact') || document.body;
    const main = document.createElement('main');

    const header = buildPageHeader(document, page);
    if (header) main.append(header);
    main.append(document.createElement('hr'));

    // Section 2: contact form | methods sidebar (two-column)
    const form = buildContactForm(document, page);
    if (form) main.append(form);
    const methods = buildContactMethods(document, page);
    if (methods) main.append(methods);
    appendSectionMetadata(main, document, 'contact-layout, page-body');

    return main;
  },

  generateDocumentPath: () => '/contact',
};
