export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cell = row.children.length === 1 ? row.firstElementChild : row;
    const hasHeading = cell.querySelector('h1, h2, h3');

    if (hasHeading) {
      row.className = 'page-header-title';
    } else if (row === block.firstElementChild) {
      row.className = 'page-header-label';
    } else {
      row.className = 'page-header-subtitle';
    }
  });
}
