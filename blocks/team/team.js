function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'team-grid';

  [...block.children].forEach((row) => {
    const cells = [...row.children].map((c) => c.textContent.trim());
    // [avatar (optional initials), name, role] OR [name, role]
    let avatar; let name; let role;
    if (cells.length >= 3) {
      [avatar, name, role] = cells;
    } else {
      [name, role] = cells;
    }
    if (!name) return;

    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `
      <div class="team-avatar">${avatar || initials(name)}</div>
      <div class="team-name">${name}</div>
      <div class="team-role">${role || ''}</div>`;
    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
