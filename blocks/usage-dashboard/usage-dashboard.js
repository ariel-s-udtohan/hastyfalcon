function pct(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export default function decorate(block) {
  const rows = [...block.children];

  // Rows: [0]=promo, [1]=cardHeading, [2]=spendLabel, [3]=spendValue, [4..]=bars
  const promoRow = rows[0];
  const cardTitleText = rows[1]?.textContent.trim() || '';
  const spendLabelText = rows[2]?.textContent.trim() || '';
  const spendValueText = rows[3]?.textContent.trim() || '';
  const barRows = rows.slice(4);

  // ---- LEFT: promo column ----
  const left = document.createElement('div');
  left.className = 'usage-promo';
  if (promoRow) {
    const cell = promoRow.children.length === 1 ? promoRow.firstElementChild : promoRow;
    while (cell.firstChild) left.append(cell.firstChild);
    const heading = left.querySelector('h1, h2, h3, h4, h5, h6');
    const firstP = left.querySelector('p');
    const firstEl = left.firstElementChild;
    if (firstP && heading && firstP === firstEl) {
      firstP.classList.add('usage-label');
    }
    const link = left.querySelector('a');
    if (link) link.classList.add('button', 'usage-cta');
  }

  // ---- RIGHT: dashboard card ----
  const card = document.createElement('div');
  card.className = 'usage-card';

  if (cardTitleText) {
    const title = document.createElement('div');
    title.className = 'usage-card-title';
    title.textContent = cardTitleText;
    card.append(title);
  }

  const bars = document.createElement('div');
  bars.className = 'usage-bars';
  barRows.forEach((row) => {
    const [label, value, percent, tone] = [...row.children].map((c) => c.textContent.trim());
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

  if (spendLabelText || spendValueText) {
    const footer = document.createElement('div');
    footer.className = 'usage-spend';
    footer.innerHTML = `
      <span class="usage-spend-label">${spendLabelText}</span>
      <span class="usage-spend-value">${spendValueText}</span>`;
    card.append(footer);
  }

  block.textContent = '';
  block.append(left, card);
}
