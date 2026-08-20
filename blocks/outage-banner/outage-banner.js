export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block.firstElementChild;
  const content = document.createElement('div');
  content.className = 'outage-banner-content';
  if (cell) {
    while (cell.firstChild) content.append(cell.firstChild);
  }

  const icon = document.createElement('span');
  icon.className = 'outage-banner-icon';
  icon.textContent = '⚠️';

  block.textContent = '';
  block.append(icon, content);
}
