export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'pricing-plans-grid';

  [...block.children].forEach((row) => {
    const card = document.createElement('div');
    card.className = 'plan-card';

    // Fixed field order: [badge, name, price, standingCharge, features, ctaText]
    const [badgeCell, nameCell, priceCell, chargeCell, featuresCell, ctaCell] = [...row.children];

    const badge = badgeCell?.textContent.trim();
    if (badge) {
      card.classList.add('featured');
      const b = document.createElement('div');
      b.className = 'plan-badge';
      b.textContent = badge;
      card.append(b);
    }

    if (nameCell) {
      const name = document.createElement('div');
      name.className = 'plan-name';
      name.textContent = nameCell.textContent.trim();
      card.append(name);
    }

    if (priceCell) {
      const price = document.createElement('div');
      price.className = 'plan-price';
      // Normalise the price text: markdown round-trips can split "£0.22/kWh"
      // across nodes, so rebuild it as <sup>£</sup>0.22<span>/kWh</span>.
      const raw = priceCell.textContent.replace(/\s+/g, ' ').trim();
      const m = raw.match(/£?\s*([\d.]+)\s*\/?\s*(.*)$/);
      if (m) {
        const unit = m[2] ? `<span>/${m[2].replace(/^\//, '')}</span>` : '';
        price.innerHTML = `<sup>£</sup>${m[1]}${unit}`;
      } else {
        price.textContent = raw;
      }
      card.append(price);
    }

    const charge = chargeCell?.textContent.trim();
    if (charge) {
      const c = document.createElement('div');
      c.className = 'plan-charge';
      c.textContent = charge;
      card.append(c);
    }

    if (featuresCell) {
      const ul = featuresCell.querySelector('ul');
      if (ul) {
        ul.className = 'plan-features';
        card.append(ul);
      }
    }

    const ctaText = ctaCell?.textContent.trim();
    if (ctaText) {
      const cta = document.createElement('button');
      cta.className = 'plan-cta';
      cta.type = 'button';
      cta.textContent = ctaText;
      card.append(cta);
    }

    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
