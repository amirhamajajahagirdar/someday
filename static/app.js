const app = document.querySelector('#app');
const today = new Date();
const dateAt = (months) => { const d = new Date(); d.setMonth(d.getMonth() + months); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const formatDate = value => new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
const isOpen = letter => letter.open_date <= new Date().toISOString().slice(0, 10);
function bindDeleteButtons(afterDelete) {
  app.querySelectorAll('[data-delete-letter]').forEach(button => button.addEventListener('click', async () => {
    if (!confirm('Delete this letter permanently for everyone? This cannot be undone.')) return;
    button.disabled = true;
    try { await api(`/api/letters/${button.dataset.deleteLetter}`, { method: 'DELETE' }); await afterDelete(); }
    catch (error) { showError(error.message); button.disabled = false; }
  }));
}
function showError(text) {
  let note = app.querySelector('.notice');
  if (!note) { note = document.createElement('p'); note.className = 'notice'; note.setAttribute('role', 'alert'); app.prepend(note); }
  note.textContent = text;
}
async function api(path, options = {}) {
  const res = await fetch(path, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
  const data = await res.json().catch(() => ({})); if (!res.ok) throw new Error(data.error || `Something went wrong (${res.status}).`); return data;
}
function shellNotice(text) { return `<p class="notice" role="alert">${esc(text)}</p>`; }
function home() {
  app.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">A little letter to the person you’ll become.</p><h1>Some things are<br>worth saving for<br><em>later.</em></h1><p class="hero-text">Write a letter today and choose when it should open. It’s saved on this server and stays sealed on every device until that day.</p><div class="hero-actions"><a class="button" href="/write">Write your future self <span>→</span></a><a class="quiet-link" href="#steps">Explore an example <span>→</span></a></div></div><div class="hero-art" aria-label="A sealed letter waiting for its opening date"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><article class="paper"><small>For the you</small><strong>who comes next.</strong><div class="seal">s</div><span>OPEN WHEN<br>THE TIME IS RIGHT</span></article><span class="spark">✳</span></div></section><section class="pause"><p class="eyebrow">A quiet pause in the present</p><h2>The future can<br><em>wait a little.</em></h2><p>Some thoughts are worth keeping. Mark a beginning, save a promise, or leave a reminder for the person you’re becoming. Your letter stays sealed for everyone until its chosen day.</p></section><section class="steps" id="steps"><p class="eyebrow">As simple as a note</p><h2>Three little steps.</h2><div class="step-grid"><article><span>01</span><h3>Write your thoughts</h3><p>Tell your future self what feels worth remembering today. It can be a few honest lines.</p></article><article><span>02</span><h3>Choose when to open it</h3><p>Pick a day ahead. Your letter stays sealed until that date arrives.</p></article><article><span>03</span><h3>Read it from any device</h3><p>When it opens, every device connected to the server can read the same letter.</p></article></div></section><section class="closing"><p class="eyebrow">Whenever you’re ready</p><h2>A note can go<br>a long way.</h2><p>Start with what you know today.</p><a class="button" href="/write">Write a letter <span>→</span></a></section>`;
}
async function capsules() {
  app.innerHTML = `<section class="page-head"><p class="eyebrow">A little time, kept</p><h1>Your letters.</h1><p>Each one is a small piece of today, waiting for a day of its own.</p></section><div id="letters" class="letters"><p class="loading">Gathering your letters…</p></div>`;
  try {
    const letters = await api('/api/letters');
    document.querySelector('#nav-count').textContent = letters.length || '';
    const holder = document.querySelector('#letters'); if (!holder) return;
    if (!letters.length) { holder.innerHTML = `<section class="empty"><span class="empty-stamp">✉</span><p class="eyebrow">A blank page, for now</p><h2>Nothing tucked away yet.</h2><p>Your future self is out there. Leave them a note to find when the time is right.</p><a class="text-link" href="/write">Write your first letter →</a></section>`; return; }
    holder.innerHTML = letters.map(letter => `<article class="letter-card ${isOpen(letter) ? 'ready' : 'sealed'}"><div class="letter-icon">${isOpen(letter) ? '✉' : '⌑'}</div><div class="letter-info"><p class="eyebrow">${isOpen(letter) ? 'Ready to read' : 'Sealed until'}</p><h2>${esc(letter.title)}</h2><p class="letter-date">Written ${formatDate(letter.created_at.slice(0, 10))} · Opens ${formatDate(letter.open_date)}</p></div>${isOpen(letter) ? `<a class="open-link" href="/letter/${letter.id}">Read letter <span>→</span></a>` : `<span class="sealed-note">Still sealed</span>`}<button class="delete-letter" data-delete-letter="${letter.id}" type="button" aria-label="Delete letter">Delete</button></article>`).join('');
    bindDeleteButtons(capsules);
  } catch (error) { document.querySelector('#letters').innerHTML = shellNotice(`${error.message} Is the Someday server running?`); }
}
function writePage() {
  app.innerHTML = `<section class="write-layout"><div class="write-main"><p class="eyebrow">A letter to your future self</p><h1>Write from today.</h1><p class="subhead">It doesn’t have to be perfect. It just has to be yours.</p><form id="letter-form"><label for="letter-title">Give this letter a name</label><input id="letter-title" name="title" maxlength="120" required placeholder="A note for when I need it"><label for="letter-body">Your message</label><textarea id="letter-body" name="body" maxlength="20000" rows="11" required placeholder="What would you like your future self to remember?"></textarea><div class="writing-tools"><span id="char-count">0 characters</span><span>A thought to get you started</span></div><div class="prompts"><button type="button" data-prompt="What feels important right now?">What feels important right now?</button><button type="button" data-prompt="What are you hoping for?">What are you hoping for?</button><button type="button" data-prompt="What do you want to remember?">What do you want to remember?</button></div><div id="form-message"></div><button class="button seal-button" type="submit">Save letter <span>→</span></button></form></div><aside class="date-panel"><p class="eyebrow">Choose your someday</p><h2>A date to remember.</h2><p>Your note is shared across devices, but stays sealed for everyone until this date.</p><label for="open-date">Open on</label><input type="date" id="open-date" min="${dateAt(0)}" value="${dateAt(1)}"><div class="date-shortcuts"><button type="button" data-months="1"><strong>1 month</strong><span>${formatDate(dateAt(1))}</span></button><button type="button" data-months="6"><strong>6 months</strong><span>${formatDate(dateAt(6))}</span></button><button type="button" data-months="12"><strong>1 year</strong><span>${formatDate(dateAt(12))}</span></button></div><p class="shared-note">✳ &nbsp; Admin can preview sealed notes; everyone else waits for the opening day.</p></aside></section>`;
  const date = document.querySelector('#open-date');
  document.querySelector('#letter-body').addEventListener('input', e => { document.querySelector('#char-count').textContent = `${e.target.value.length} characters`; });
  document.querySelector('.prompts').addEventListener('click', e => { const b = e.target.closest('[data-prompt]'); if (!b) return; const text = document.querySelector('#letter-body'); text.value += `${text.value ? '\n\n' : ''}${b.dataset.prompt}\n`; text.focus(); text.dispatchEvent(new Event('input')); });
  document.querySelector('.date-shortcuts').addEventListener('click', e => { const b = e.target.closest('[data-months]'); if (b) date.value = dateAt(Number(b.dataset.months)); });
  document.querySelector('#letter-form').addEventListener('submit', async e => {
    e.preventDefault(); const btn = e.submitter; btn.disabled = true; const msg = document.querySelector('#form-message'); msg.innerHTML = '';
    try { const record = await api('/api/letters', { method: 'POST', body: JSON.stringify({ title: document.querySelector('#letter-title').value, body: document.querySelector('#letter-body').value, open_date: date.value }) }); location.href = `/letter/${record.id}`; }
    catch (error) { msg.innerHTML = shellNotice(error.message); btn.disabled = false; }
  });
}
async function readPage(id) {
  app.innerHTML = `<section class="reading"><p class="eyebrow">A message from an earlier you</p><div class="letter-sheet"><span class="sheet-flower">✳</span><p class="loading">Finding your letter…</p></div></section>`;
  try { const letter = await api(`/api/letters/${id}`); app.innerHTML = `<section class="reading"><p class="eyebrow">A note shared on Someday</p><article class="letter-sheet"><span class="sheet-flower">✳</span><p class="eyebrow">Written ${formatDate(letter.created_at.slice(0, 10))} · Opens ${formatDate(letter.open_date)}</p><h1>${esc(letter.title)}</h1><div class="letter-content">${esc(letter.body)}</div><p class="letter-signoff">With care,<br>from a Someday writer</p></article><div class="reading-actions"><a class="text-link" href="/capsules">← Back to all letters</a><button class="delete-letter" data-delete-letter="${letter.id}" type="button">Delete this letter</button></div></section>`; bindDeleteButtons(() => { location.href = '/capsules'; }); }
  catch (error) { const sealed = error.message.includes('still sealed'); app.innerHTML = `<section class="reading"><p class="eyebrow">A note shared on Someday</p><div class="letter-sheet sealed-sheet"><span class="sheet-flower">✳</span><p class="eyebrow">${sealed ? 'Sealed for later' : 'Letter unavailable'}</p><h1>${sealed ? 'Not quite time yet.' : 'We couldn’t find it.'}</h1><p>${esc(error.message)}</p><a class="text-link" href="/capsules">← Back to all letters</a></div></section>`; }
}
async function adminPage() {
  app.innerHTML = `<section class="page-head"><p class="eyebrow">Shared site activity</p><h1>Admin dashboard.</h1><p>Every letter written on this Someday server, with its saved time.</p></section><div id="admin-letters" class="admin-list"><p class="loading">Loading letters…</p></div>`;
  try {
    const letters = await api('/api/admin/letters');
    const holder = document.querySelector('#admin-letters'); if (!holder) return;
    holder.innerHTML = letters.length ? letters.map(letter => `<article class="admin-card"><div class="admin-row"><div><p class="eyebrow">Written ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(letter.created_at))}</p><h2>${esc(letter.title)}</h2><p class="letter-date">Opening date: ${formatDate(letter.open_date)}</p></div><div class="admin-actions"><a class="open-link" href="/letter/${letter.id}">View note →</a><button class="delete-letter" data-delete-letter="${letter.id}" type="button">Delete</button></div></div><div class="admin-body">${esc(letter.body)}</div></article>`).join('') : `<section class="empty"><span class="empty-stamp">✉</span><h2>No letters have been written yet.</h2><p>New letters saved on this server will appear here for every visitor.</p></section>`;
    bindDeleteButtons(adminPage);
    document.querySelector('.page-head').insertAdjacentHTML('beforeend', '<button class="admin-logout" id="admin-logout" type="button">Sign out</button>');
    document.querySelector('#admin-logout').addEventListener('click', async () => { await api('/api/admin/logout', { method: 'POST', body: '{}' }); adminPage(); });
  } catch (error) {
    const holder = document.querySelector('#admin-letters'); if (!holder) return;
    if (error.message === 'Admin sign-in is required.') {
      holder.innerHTML = `<form class="admin-login" id="admin-login"><span class="empty-stamp">⌑</span><p class="eyebrow">Restricted area</p><h2>Admin sign-in</h2><p>Enter the admin password to view letters, including sealed notes, and their saved times.</p><label for="admin-password">Password</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required><div id="admin-login-error"></div><button class="button" type="submit">Sign in <span>→</span></button></form>`;
      document.querySelector('#admin-login').addEventListener('submit', async event => { event.preventDefault(); const button = event.submitter; button.disabled = true; try { await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: document.querySelector('#admin-password').value }) }); adminPage(); } catch (loginError) { document.querySelector('#admin-login-error').innerHTML = shellNotice(loginError.message); button.disabled = false; } });
    } else holder.innerHTML = shellNotice(error.message);
  }
}
const path = location.pathname;
document.querySelectorAll('nav a[data-page]').forEach(link => link.classList.toggle('current', link.dataset.page === (path === '/' ? 'home' : path === '/capsules' ? 'capsules' : path === '/admin' ? 'admin' : '')));
if (path === '/write') writePage(); else if (path === '/capsules') capsules(); else if (path === '/admin') adminPage(); else if (/^\/letter\/\d+$/.test(path)) readPage(path.split('/').pop()); else home();
if (path !== '/capsules') api('/api/letters').then(letters => { document.querySelector('#nav-count').textContent = letters.length || ''; }).catch(() => {});
