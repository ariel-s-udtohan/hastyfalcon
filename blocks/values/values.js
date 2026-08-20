export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'value-item';
    const [title, desc] = [...row.children].map((c) => c.textContent.trim());
    row.textContent = '';
    row.innerHTML = `
      <div class="value-title">${title || ''}</div>
      <div class="value-desc">${desc || ''}</div>`;
  });
}
