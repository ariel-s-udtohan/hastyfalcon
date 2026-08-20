function pct(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export default function decorate(block) {
  const rows = [...block.children];

  // ---- LEFT: promo column ----
  const left = document.createElement('div');
  left.className = 'usage-promo';
  const intro = rows[0];
  if (intro) {
    while (intro.firstElementChild) {
      const cell = intro.firstElementChild;
      // move meaningful children out of the cell wrapper
      while (cell.firstChild) left.append(cell.firstChild);
      cell.remove();
    }
    // first paragraph before the heading is the eyebrow label
    const heading = left.querySelector('h1, h2, h3, h4, h5, h6');
    const firstP = left.querySelector('p');
    const firstEl = left.firstElementChild;
    if (firstP && heading && firstP === firstEl) {
      firstP.classList.add('usage-label');
    }
    // style CTA if present
    const link = left.querySelector('a');
    if (link) link.classList.add('button', 'usage-cta');
  }

  // ---- RIGHT: dashboard card ----
  const card = document.createElement('div');
  card.className = 'usage-card';

  // Row 1 = card title
  const titleRow = rows[1];
  if (titleRow) {
    const title = document.createElement('div');
    title.className = 'usage-card-title';
    title.textContent = titleRow.textContent.trim();
    card.append(title);
  }

  const bars = document.createElement('div');
  bars.className = 'usage-bars';

  // Middle rows = usage bars [label, value, percent, tone]
  const barRows = rows.slice(2, rows.length - 1);
  barRows.forEach((row) => {
    const cells = [...row.children].map((c) => c.textContent.trim());
    const [label, value, percent, tone] = cells;
    const bar = document.createElement('div');
    bar.className = 'usage-bar';
    bar.innerHTML = `
      <div class="usage-bar-head">
        <span class="usage-bar-label">${label || ''}</span>
        <span class="usage-bar-value">${value || ''}</span>
      </div>
      <div class="usage-bar-track">
        <div class="usage-bar-fill usage-tone-${(tone || 'brand').toLowerCase()}" style="width:${pct(percent)}%"></div>
      </div>`;
    bars.append(bar);
  });
  card.append(bars);

  // Last row = spend footer [label, value]
  const spendRow = rows[rows.length - 1];
  if (spendRow && barRows.length) {
    const cells = [...spendRow.children].map((c) => c.textContent.trim());
    const footer = document.createElement('div');
    footer.className = 'usage-spend';
    footer.innerHTML = `
      <span class="usage-spend-label">${cells[0] || ''}</span>
      <span class="usage-spend-value">${cells[1] || ''}</span>`;
    card.append(footer);
  }

  block.textContent = '';
  block.append(left, card);
}
