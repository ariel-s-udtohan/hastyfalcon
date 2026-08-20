/**
 * Import script for the Voltara nav fragment.
 * Produces three top-level sections consumed by the header block:
 *   1. brand   — the logo link
 *   2. sections — the primary nav link list
 *   3. tools   — the "View plans" CTA
 */
export default {
  transformDOM: ({ document }) => {
    const src = document.querySelector('#nav-source') || document.body;
    const main = document.createElement('main');

    const brand = src.querySelector('.nav-brand');
    const sections = src.querySelector('.nav-sections');
    const tools = src.querySelector('.nav-tools');

    // Section 1: brand — clickable logo image (link wrapping an icon span)
    if (brand) {
      const div = document.createElement('div');
      const p = document.createElement('p');
      const a = brand.querySelector('a');
      if (a) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href') || '/';
        const img = a.querySelector('img');
        if (img) {
          // Clickable logo image — survives the markdown round-trip as an image.
          const logo = document.createElement('img');
          logo.src = img.getAttribute('src');
          logo.alt = img.getAttribute('alt') || 'Voltara';
          link.append(logo);
        } else {
          link.textContent = a.textContent.trim();
        }
        p.append(link);
      }
      div.append(p);
      main.append(div);
    }

    main.append(document.createElement('hr'));

    // Section 2: nav links
    if (sections) {
      const div = document.createElement('div');
      const ul = document.createElement('ul');
      sections.querySelectorAll('li').forEach((li) => {
        const item = document.createElement('li');
        const a = li.querySelector('a');
        if (a) {
          const link = document.createElement('a');
          link.href = a.getAttribute('href') || '/';
          link.textContent = a.textContent.trim();
          item.append(link);
        } else {
          item.textContent = li.textContent.trim();
        }
        ul.append(item);
      });
      div.append(ul);
      main.append(div);
    }

    main.append(document.createElement('hr'));

    // Section 3: tools / CTA
    if (tools) {
      const div = document.createElement('div');
      const p = document.createElement('p');
      const a = tools.querySelector('a');
      if (a) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href') || '/';
        link.textContent = a.textContent.trim();
        p.append(link);
      }
      div.append(p);
      main.append(div);
    }

    return main;
  },

  generateDocumentPath: () => '/nav',
};
