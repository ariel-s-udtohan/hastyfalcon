/* global WebImporter */

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function buildAboutHero(document, page) {
  const header = page.querySelector('.about-header');
  if (!header) return null;

  const label = clean(header.querySelector('.ah-label')?.textContent);
  const title = clean(header.querySelector('h1')?.textContent);
  const desc = clean(header.querySelector('.ah-intro p')?.textContent);

  const intro = document.createElement('div');
  if (label) { const p = document.createElement('p'); p.textContent = label; intro.append(p); }
  if (title) { const h = document.createElement('h1'); h.textContent = title; intro.append(h); }
  if (desc) { const p = document.createElement('p'); p.textContent = desc; intro.append(p); }

  const cells = [['About Hero'], [intro]];
  [...header.querySelectorAll('.ah-stat')].forEach((stat) => {
    const val = clean(stat.querySelector('.ah-val')?.textContent);
    const lbl = clean(stat.querySelector('.ah-lbl')?.textContent);
    cells.push([val, lbl]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildLabelledIntro(document, scope) {
  const label = clean(scope.querySelector('.section-label')?.textContent);
  const title = clean(scope.querySelector('.section-title')?.textContent);
  const wrap = document.createElement('div');
  if (label) { const p = document.createElement('p'); p.textContent = label; wrap.append(p); }
  if (title) { const h = document.createElement('h2'); h.textContent = title; wrap.append(h); }
  return wrap;
}

function buildTimeline(document, scope) {
  const tl = scope.querySelector('.timeline');
  if (!tl) return null;
  const cells = [['Timeline']];
  [...tl.querySelectorAll('.tl-item')].forEach((item) => {
    const year = clean(item.querySelector('.tl-year')?.textContent);
    const title = clean(item.querySelector('.tl-title')?.textContent);
    const desc = clean(item.querySelector('.tl-desc')?.textContent);
    cells.push([year, title, desc]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildValues(document, scope) {
  const list = scope.querySelector('.values-list');
  if (!list) return null;
  const cells = [['Values']];
  [...list.querySelectorAll('.value-item')].forEach((item) => {
    const title = clean(item.querySelector('.v-title')?.textContent);
    const desc = clean(item.querySelector('.v-desc')?.textContent);
    cells.push([title, desc]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildTeam(document, page) {
  const grid = page.querySelector('.team-grid');
  if (!grid) return null;
  const cells = [['Team']];
  [...grid.querySelectorAll('.team-card')].forEach((card) => {
    const avatar = clean(card.querySelector('.tm-avatar')?.textContent);
    const name = clean(card.querySelector('.tm-name')?.textContent);
    const role = clean(card.querySelector('.tm-role')?.textContent);
    cells.push([avatar, name, role]);
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
    const page = document.querySelector('#page-about') || document.body;
    const main = document.createElement('main');

    // Section 1: about hero (green two-col + stats)
    const hero = buildAboutHero(document, page);
    if (hero) main.append(hero);
    main.append(document.createElement('hr'));

    // Section 2: our story (timeline)
    const story = page.querySelector('.story');
    if (story) {
      main.append(buildLabelledIntro(document, story));
      const timeline = buildTimeline(document, story);
      if (timeline) main.append(timeline);
      appendSectionMetadata(main, document, 'labelled-section, page-body');
      main.append(document.createElement('hr'));
    }

    // Section 3: our values
    const values = page.querySelector('.values');
    if (values) {
      main.append(buildLabelledIntro(document, values));
      const valuesBlock = buildValues(document, values);
      if (valuesBlock) main.append(valuesBlock);
      appendSectionMetadata(main, document, 'labelled-section, page-body');
      main.append(document.createElement('hr'));
    }

    // Section 3: leadership team
    const leadership = page.querySelector('.leadership');
    if (leadership) {
      main.append(buildLabelledIntro(document, leadership));
      const team = buildTeam(document, page);
      if (team) main.append(team);
      appendSectionMetadata(main, document, 'labelled-section, page-body');
    }

    return main;
  },

  generateDocumentPath: () => '/about',
};
