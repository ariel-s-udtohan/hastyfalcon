export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'tl-item';
    const [year, title, desc] = [...row.children].map((c) => c.textContent.trim());

    row.textContent = '';
    const dotWrap = document.createElement('div');
    dotWrap.className = 'tl-dot-wrap';
    dotWrap.innerHTML = '<span class="tl-dot"></span>';

    const content = document.createElement('div');
    content.className = 'tl-content';
    content.innerHTML = `
      <div class="tl-year">${year || ''}</div>
      <div class="tl-title">${title || ''}</div>
      <div class="tl-desc">${desc || ''}</div>`;

    row.append(dotWrap, content);
  });
}
