export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('metrics-item');
    const cells = [...row.children];
    cells.forEach((cell, i) => {
      if (i === 0) cell.className = 'metrics-value';
      else if (i === 1) cell.className = 'metrics-label';
      else cell.className = 'metrics-change';
    });
  });
}
