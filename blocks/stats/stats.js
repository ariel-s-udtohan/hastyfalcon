export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('stats-item');
    const cells = [...row.children];
    cells.forEach((cell, i) => {
      cell.className = i === 0 ? 'stats-value' : 'stats-label';
    });
  });
}
