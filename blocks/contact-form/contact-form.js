export default function decorate(block) {
  // Row 1 = heading (optional). Row 2 = subject options (comma/newline separated).
  const rows = [...block.children];
  const heading = rows[0]?.textContent.trim() || 'Send a message';
  const subjectsRaw = rows[1]?.textContent.trim() || '';
  const subjects = subjectsRaw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const options = ['Choose a topic…', ...subjects]
    .map((s) => `<option>${s}</option>`)
    .join('');

  block.textContent = '';

  const title = document.createElement('h2');
  title.className = 'contact-form-title';
  title.textContent = heading;

  const form = document.createElement('form');
  form.className = 'contact-form-grid';
  form.noValidate = true;
  form.innerHTML = `
    <div class="form-group">
      <label for="cf-first">First name</label>
      <input type="text" id="cf-first" placeholder="Sarah" />
    </div>
    <div class="form-group">
      <label for="cf-last">Last name</label>
      <input type="text" id="cf-last" placeholder="Alderton" />
    </div>
    <div class="form-group">
      <label for="cf-email">Email</label>
      <input type="email" id="cf-email" placeholder="sarah@example.com" required />
    </div>
    <div class="form-group">
      <label for="cf-account">Account number (optional)</label>
      <input type="text" id="cf-account" placeholder="VT-123456" />
    </div>
    <div class="form-group full">
      <label for="cf-subject">Subject</label>
      <select id="cf-subject">${options}</select>
    </div>
    <div class="form-group full">
      <label for="cf-message">Message</label>
      <textarea id="cf-message" placeholder="Tell us how we can help…" required></textarea>
    </div>
    <div class="form-group full">
      <button type="submit" class="btn-submit">Send message</button>
      <span class="contact-form-status" role="status" aria-live="polite"></span>
    </div>`;

  const status = form.querySelector('.contact-form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('#cf-email').value.trim();
    const msg = form.querySelector('#cf-message').value.trim();
    if (!email || !msg) {
      status.textContent = 'Please fill in the email and message fields.';
      status.classList.add('error');
      return;
    }
    status.classList.remove('error');
    status.textContent = '✓ Message sent — we\'ll reply within 4 hours';
    form.reset();
  });

  block.append(title, form);
}
