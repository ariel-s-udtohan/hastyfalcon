export default function decorate(block) {
  const rows = [...block.children];
  const actionLinks = [];
  let badgeDone = false;

  rows.forEach((row, i) => {
    const cell = row.children.length === 1 ? row.firstElementChild : row;
    const hasHeading = cell.querySelector('h1, h2, h3');
    const links = [...cell.querySelectorAll('a')];
    const text = cell.textContent.trim();

    if (hasHeading) {
      row.className = 'hero-heading';
    } else if (links.length) {
      // collect links as CTAs, remove the original row
      actionLinks.push(...links);
      row.remove();
    } else if (!badgeDone && i === 0 && text) {
      row.className = 'hero-badge';
      const dot = document.createElement('span');
      dot.className = 'hero-badge-dot';
      cell.prepend(dot);
      badgeDone = true;
    } else if (text) {
      row.className = 'hero-subtitle';
    } else {
      row.remove();
    }
  });

  if (actionLinks.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    actionLinks.forEach((a, i) => {
      a.classList.remove('secondary', 'primary');
      a.classList.add('button', i === 0 ? 'hero-btn-primary' : 'hero-btn-ghost');
      actions.append(a);
    });
    block.append(actions);
  }
}
