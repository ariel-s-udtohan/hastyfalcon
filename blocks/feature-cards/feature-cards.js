import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    li.className = 'feature-card';
    const cells = [...row.children];

    // Fixed field order: [icon, title, description, link]
    const [iconCell, titleCell, bodyCell, linkCell] = cells;

    if (iconCell) {
      const icon = document.createElement('div');
      icon.className = 'feature-card-icon';
      icon.textContent = iconCell.textContent.trim();
      li.append(icon);
    }

    if (titleCell) {
      const title = document.createElement('h3');
      title.className = 'feature-card-title';
      title.textContent = titleCell.textContent.trim();
      li.append(title);
    }

    if (bodyCell) {
      const body = document.createElement('div');
      body.className = 'feature-card-body';
      while (bodyCell.firstChild) body.append(bodyCell.firstChild);
      li.append(body);
    }

    const link = linkCell?.querySelector('a');
    if (link) {
      link.className = 'feature-card-link';
      li.append(link);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
