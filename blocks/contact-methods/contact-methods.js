export default function decorate(block) {
  const rows = [...block.children];
  const heading = rows[0]?.children.length === 1 ? rows[0] : null;

  const wrap = document.createElement('div');
  wrap.className = 'contact-methods-wrap';

  const title = document.createElement('h3');
  title.className = 'contact-methods-title';
  title.textContent = (heading || rows[0])?.textContent.trim() || 'Other ways to reach us';

  const cards = document.createElement('div');
  cards.className = 'contact-methods-cards';

  // Each remaining row = [title, body]
  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const card = document.createElement('div');
    card.className = 'contact-method-card';

    const cardTitle = document.createElement('div');
    cardTitle.className = 'contact-method-name';
    cardTitle.textContent = cells[0].textContent.trim();
    card.append(cardTitle);

    if (cells[1]) {
      const body = document.createElement('div');
      body.className = 'contact-method-body';
      while (cells[1].firstChild) body.append(cells[1].firstChild);
      const link = body.querySelector('a');
      if (link) link.classList.add('button', 'contact-method-btn');
      card.append(body);
    }

    cards.append(card);
  });

  block.textContent = '';
  wrap.append(title, cards);
  block.append(wrap);
}
