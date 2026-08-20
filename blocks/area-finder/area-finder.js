const TONE_COLORS = {
  full: '#22c55e',
  partial: '#f59e0b',
  none: 'var(--brand-border-strong, #d1d5db)',
};

function buildFinderPanel(heading) {
  const panel = document.createElement('div');
  panel.className = 'geo-panel';
  panel.innerHTML = `
    <h3 class="geo-panel-title">${heading || 'Find your service area'}</h3>
    <div class="geo-field">
      <label for="af-postcode">Postcode</label>
      <input type="text" id="af-postcode" placeholder="e.g. SW1A 1AA" autocomplete="off" />
    </div>
    <button type="button" class="geo-check">Check availability</button>
    <div class="service-result" hidden>
      <div class="service-status"><span class="status-dot"></span><strong></strong></div>
      <div class="service-detail"></div>
    </div>`;
  return panel;
}

function buildCoveragePanel(rows) {
  const panel = document.createElement('div');
  panel.className = 'geo-panel geo-coverage';
  const title = document.createElement('h4');
  title.textContent = 'Coverage by region';
  panel.append(title);

  const list = document.createElement('div');
  list.className = 'coverage-list';
  rows.forEach(({ region, status, tone }) => {
    const item = document.createElement('div');
    item.className = 'coverage-item';
    const color = TONE_COLORS[tone] || TONE_COLORS.full;
    const statusColor = tone === 'none' ? 'var(--brand-text-muted, #9ca3af)' : 'var(--brand, #0b6e4f)';
    item.innerHTML = `
      <span class="coverage-region">${region}</span>
      <span class="coverage-status" style="color:${statusColor}">
        <span class="coverage-dot" style="background:${color}"></span>${status}
      </span>`;
    list.append(item);
  });
  panel.append(list);
  return panel;
}

function buildMap() {
  const map = document.createElement('div');
  map.className = 'geo-map';
  map.innerHTML = `
    <div class="map-grid"></div>
    <div class="map-placeholder">
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--brand-border-strong,#d1d5db)" stroke-width="1.5"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
      <span>Enter a postcode to see your location</span>
    </div>
    <div class="map-pin" hidden></div>
    <div class="map-label" hidden></div>`;
  return map;
}

function wireUp(root) {
  const input = root.querySelector('#af-postcode');
  const btn = root.querySelector('.geo-check');
  const result = root.querySelector('.service-result');
  const dot = root.querySelector('.service-result .status-dot');
  const strong = root.querySelector('.service-result strong');
  const detail = root.querySelector('.service-detail');
  const pin = root.querySelector('.map-pin');
  const label = root.querySelector('.map-label');
  const placeholder = root.querySelector('.map-placeholder');

  const check = () => {
    const val = input.value.trim().toUpperCase();
    if (!val) { input.focus(); return; }
    input.value = val;
    result.hidden = false;
    const isNI = val.startsWith('BT');
    if (isNI) {
      result.classList.add('unavailable');
      dot.style.background = '#f59e0b';
      strong.textContent = 'Not yet available in your area';
      detail.textContent = 'Voltara does not currently supply Northern Ireland postcodes. Register your interest and we\'ll notify you when we expand.';
      pin.hidden = true;
      label.hidden = true;
      placeholder.style.display = '';
    } else {
      result.classList.remove('unavailable');
      dot.style.background = '#22c55e';
      strong.textContent = 'Service available — 3 plans in your area';
      detail.innerHTML = `Postcode: <strong>${val}</strong> · Distribution network: Northern PowerGrid · Estimated switch time: 2–3 working days`;
      pin.hidden = false;
      label.hidden = false;
      label.textContent = val;
      placeholder.style.display = 'none';
    }
  };

  btn.addEventListener('click', check);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
}

export default function decorate(block) {
  const rows = [...block.children];
  let heading = '';
  const coverage = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length <= 1) {
      // single-cell row = finder heading
      if (!heading) heading = row.textContent.trim();
      return;
    }
    const [region, status, tone] = cells.map((c) => c.textContent.trim());
    if (region) coverage.push({ region, status, tone: (tone || 'full').toLowerCase() });
  });

  const left = document.createElement('div');
  left.className = 'geo-left';
  left.append(buildFinderPanel(heading));
  if (coverage.length) left.append(buildCoveragePanel(coverage));

  block.textContent = '';
  block.append(left, buildMap());
  wireUp(block);
}
