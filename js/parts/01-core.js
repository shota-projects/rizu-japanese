// UI: hash router + views. Lesson content lives in ./data/speak.json.
// Built from js/parts/*.js by tools/build_app.sh (edit the parts, then rebuild).
(function () {
  // The reading course (data/read.json + viewRead/viewReadLesson below) is kept but switched off
  // while the app focuses on speaking. Set read: true to fetch, route and link it again.
  const FEATURES = { read: false };

  const $app = document.getElementById('app');
  const $top = document.getElementById('topbar');
  const $toast = document.getElementById('toast');
  let SPEAK = null, READ = null;
  const phraseIndex = {}; // id -> { phrase, unit }

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pid = (u, p) => `${u.id}:${p.jp}`;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const go = (h) => { location.hash = h; };
  const unitById = (id) => SPEAK.units.find((u) => u.id === id);
  const trackById = (id) => SPEAK.tracks.find((t) => t.id === id);
  const unitsOf = (tid) => SPEAK.units.filter((u) => u.track === tid);

  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
    slow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="10.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    ear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9.5a5 5 0 0 1 10 0c0 3-3 3.6-3 6.5a2.5 2.5 0 0 1-4.6 1.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M10 10a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'
  };
  // Little decorative motifs (inline SVG so they work offline).
  const DECO = {
    skull: '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-4.6 0-8 3.1-8 7.3 0 2.4 1.2 4.3 3 5.4V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.3c1.8-1.1 3-3 3-5.4C20 6.1 16.6 3 12 3z" fill="currentColor"/><circle cx="9" cy="11" r="1.9" fill="#fff"/><circle cx="15" cy="11" r="1.9" fill="#fff"/><path d="M11 14.6h2l-1 1.6z" fill="#fff"/></svg>',
    heart: '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z" fill="currentColor"/></svg>',
    star: '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16l-5.1 2.9L8 13.2l-4.3-4 5.8-.7z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    bow: '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12 4 7.5c-1.2-.6-2 .2-2 1.3v6.4c0 1.1.8 1.9 2 1.3zM12 12l8-4.5c1.2-.6 2 .2 2 1.3v6.4c0 1.1-.8 1.9-2 1.3z" fill="currentColor"/><rect x="10" y="9.8" width="4" height="4.4" rx="1.4" fill="currentColor" stroke="#fff" stroke-width="1"/></svg>'
  };
  const MASCOT = { wave: './img/mascot-wave.png', cheer: './img/mascot-cheer.png', think: './img/mascot-think.png' };
  const mascot = (pose, cls = '') => `<img class="mascot mascot-${pose} ${cls}" src="${MASCOT[pose]}" alt="" aria-hidden="true" width="120" height="120">`;

  function toast(msg) {
    $toast.textContent = msg; $toast.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => $toast.classList.remove('show'), 2200);
  }

  // Sparkle burst around an element (skipped for reduced-motion users).
  function sparkle(el) {
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'sparkles';
    layer.style.left = `${r.left + r.width / 2}px`;
    layer.style.top = `${r.top + Math.min(r.height / 2, 80)}px`;
    const kinds = [DECO.star, DECO.heart, DECO.star, DECO.bow];
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      const a = (i / 10) * Math.PI * 2, d = 50 + Math.random() * 40;
      s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
      s.style.setProperty('--dy', `${Math.sin(a) * d}px`);
      s.style.animationDelay = `${Math.random() * 80}ms`;
      s.className = `spark c${i % 3}`;
      s.innerHTML = kinds[i % kinds.length];
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1000);
  }
  function bounce(el) { if (!el) return; el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
  function celebrate(el) { bounce(el); sparkle(el); }

  function topbar(title, back) {
    $top.innerHTML = back
      ? `<a class="iconbtn" href="${back}" aria-label="Back">${ICON.back}</a><div class="topbar-title">${title}</div><span class="streak-mini" title="Day streak">${DECO.star}${Store.streak()}日</span>`
      : '';
    $top.classList.toggle('hidden', !back);
  }

  function audioButtons(text, extra = '') {
    return `<div class="audio-row ${extra}">
      <button class="pill" data-say="${esc(text)}" aria-label="Play">${ICON.play}<span>Play</span></button>
      <button class="pill ghost" data-say="${esc(text)}" data-slow="1" aria-label="Play slowly">${ICON.slow}<span>Slow</span></button>
    </div>`;
  }

  // Global delegated handlers: audio buttons and tap-to-reveal romaji.
  document.addEventListener('click', (e) => {
    const r = e.target.closest('[data-reveal]');
    if (r) { e.stopPropagation(); r.outerHTML = `<span class="${r.dataset.cls}">${esc(r.dataset.reveal)}</span>`; return; }
    const b = e.target.closest('[data-say]');
    if (!b) return;
    if (!Speech.canSpeak) { toast('Audio isn’t available in this browser'); return; }
    b.classList.add('playing');
    Speech.speak(b.dataset.say, { slow: !!b.dataset.slow, fast: !!b.dataset.fast }).then(() => b.classList.remove('playing'));
  });

  // ---------- display settings ----------
  // Kana reading line: shown when enabled and when it differs from the main line (i.e. there's kanji).
  function kanaFor(x) {
    if (!Store.setting('showKana') || !x.kana) return '';
    return Speech.norm(x.kana) !== Speech.norm(x.jp) ? x.kana : '';
  }
  // Romaji: 'show' always, 'hide' never, 'fade' hides it (tap to reveal) once you know the item.
  function romajiHTML(text, cls, known) {
    const mode = Store.setting('romaji');
    if (mode === 'hide') return '';
    if (mode === 'fade' && known) return `<button type="button" class="romaji-peek ${cls}" data-reveal="${esc(text)}" data-cls="${cls}">tap for romaji</button>`;
    return `<span class="${cls}">${esc(text)}</span>`;
  }
  const phraseKnown = (u, p) => Store.box(pid(u, p)) >= 3;
