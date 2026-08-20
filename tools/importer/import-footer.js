/**
 * Import script for the Voltara footer fragment.
 * Produces default content: a brand blurb, three link columns, and a
 * legal/copyright line — each as its own section.
 */
export default {
  transformDOM: ({ document }) => {
    const src = document.querySelector('#footer-source') || document.body;
    const main = document.createElement('main');

    const appendSection = (buildFn) => {
      const div = document.createElement('div');
      buildFn(div);
      main.append(div);
    };

    // Brand blurb
    const brand = src.querySelector('.footer-brand');
    if (brand) {
      appendSection((div) => {
        brand.querySelectorAll('p').forEach((p) => {
          const el = document.createElement('p');
          el.innerHTML = p.innerHTML;
          div.append(el);
        });
      });
    }

    // Link columns
    src.querySelectorAll('.footer-col').forEach((col) => {
      main.append(document.createElement('hr'));
      appendSection((div) => {
        const heading = col.querySelector('strong');
        if (heading) {
          const h = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = heading.textContent.trim();
          h.append(strong);
          div.append(h);
        }
        const ul = document.createElement('ul');
        col.querySelectorAll('li').forEach((li) => {
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
      });
    });

    // Legal line
    const legal = src.querySelector('.footer-legal');
    if (legal) {
      main.append(document.createElement('hr'));
      appendSection((div) => {
        const p = document.createElement('p');
        p.textContent = legal.textContent.trim();
        div.append(p);
      });
    }

    return main;
  },

  generateDocumentPath: () => '/footer',
};
