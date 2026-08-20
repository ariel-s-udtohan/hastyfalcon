export default function decorate(block) {
  const rows = [...block.children];

  const text = document.createElement('div');
  text.className = 'cta-band-text';

  const actions = document.createElement('div');
  actions.className = 'cta-band-actions';

  rows.forEach((row) => {
    const cell = row.children.length === 1 ? row.firstElementChild : row;
    const link = cell.querySelector('a');
    if (link) {
      link.classList.add('button', 'cta-band-btn');
      actions.append(link);
    } else {
      while (cell.firstChild) text.append(cell.firstChild);
    }
  });

  // Promote first line to heading if plain text
  const firstP = text.querySelector('p');
  if (firstP && !text.querySelector('h1, h2, h3, h4')) {
    const h = document.createElement('div');
    h.className = 'cta-band-title';
    h.textContent = firstP.textContent;
    firstP.replaceWith(h);
    // subsequent paragraphs become subtitle
    text.querySelectorAll('p').forEach((p) => p.classList.add('cta-band-sub'));
  }

  block.textContent = '';
  block.append(text, actions);
}
