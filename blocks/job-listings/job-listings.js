export default function decorate(block) {
  const jobs = [...block.children].map((row) => {
    const [title, dept, type, location, description] = [...row.children]
      .map((c) => c.textContent.trim());
    return {
      title, dept, type, location, description,
    };
  }).filter((j) => j.title);

  // Build filter bar from unique departments
  const depts = [...new Set(jobs.map((j) => j.dept).filter(Boolean))];
  const filters = document.createElement('div');
  filters.className = 'job-filters';
  const makeBtn = (label, value, active) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-btn${active ? ' active' : ''}`;
    btn.dataset.filter = value;
    btn.textContent = label;
    return btn;
  };
  filters.append(makeBtn('All roles', 'all', true));
  depts.forEach((d) => filters.append(makeBtn(d, d, false)));

  // Build job cards
  const list = document.createElement('div');
  list.className = 'job-list';
  jobs.forEach((job) => {
    const card = document.createElement('div');
    card.className = 'job-card';
    if (job.dept) card.dataset.dept = job.dept;

    const tags = [
      job.dept ? `<span class="job-tag tag-dept">${job.dept}</span>` : '',
      job.type ? `<span class="job-tag tag-type">${job.type}</span>` : '',
      job.location ? `<span class="job-tag tag-loc">${job.location}</span>` : '',
    ].join('');

    card.innerHTML = `
      <div class="job-info">
        <div class="job-title">${job.title}</div>
        <div class="job-meta">${tags}</div>
        ${job.description ? `<div class="job-desc">${job.description}</div>` : ''}
      </div>
      <button type="button" class="apply-btn">Apply</button>`;
    list.append(card);
  });

  // Filtering behavior
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const { filter } = btn.dataset;
    filters.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
    list.querySelectorAll('.job-card').forEach((c) => {
      const show = filter === 'all' || c.dataset.dept === filter;
      c.style.display = show ? '' : 'none';
    });
  });

  block.textContent = '';
  block.append(filters, list);
}
