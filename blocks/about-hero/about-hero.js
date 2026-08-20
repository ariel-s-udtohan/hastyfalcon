export default function decorate(block) {
  const rows = [...block.children];

  // Left column: intro content (label, heading, text)
  const intro = document.createElement('div');
  intro.className = 'about-hero-intro';
  const introRow = rows[0];
  if (introRow) {
    const cell = introRow.children.length === 1 ? introRow.firstElementChild : introRow;
    while (cell.firstChild) intro.append(cell.firstChild);
    const firstP = intro.querySelector('p');
    const heading = intro.querySelector('h1, h2, h3');
    if (firstP && heading && firstP === intro.firstElementChild) {
      firstP.classList.add('about-hero-label');
    }
  }

  // Remaining rows: stat cards [value, label]
  const grid = document.createElement('div');
  grid.className = 'about-hero-stats';
  rows.slice(1).forEach((row) => {
    const [value, label] = [...row.children].map((c) => c.textContent.trim());
    if (!value) return;
    const card = document.createElement('div');
    card.className = 'about-stat-card';
    card.innerHTML = `<div class="about-stat-value">${value}</div><div class="about-stat-label">${label || ''}</div>`;
    grid.append(card);
  });

  block.textContent = '';
  block.append(intro, grid);
}
