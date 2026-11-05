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
    Speech.unlock && Speech.unlock();
    b.classList.add('playing');
    Speech.speak(b.dataset.say, { slow: !!b.dataset.slow, fast: !!b.dataset.fast }).then((ok) => {
      b.classList.remove('playing');
      if (!ok) toast('Turn up volume / check silent mode');
    });
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

  // Romaji under answer buttons: no tap-to-reveal inside a button, so 'fade' simply hides it once known.
  function optRomaji(o, known) {
    const mode = Store.setting('romaji');
    if (mode === 'hide' || (mode === 'fade' && known)) return '';
    return `<span class="opt-romaji">${esc(o.romaji)}</span>`;
  }

  // ---------- progress helpers ----------
  function unitStats(u) {
    const seen = u.phrases.filter((p) => Store.state.seen[pid(u, p)]).length;
    const us = Store.unit(u.id);
    const done = seen === u.phrases.length && us.listenDone && us.roleplayDone && us.quizBest >= 70;
    const steps = [seen === u.phrases.length, !!us.listenDone, !!us.roleplayDone, us.quizBest >= 70].filter(Boolean).length;
    return { seen, total: u.phrases.length, listen: !!us.listenDone, roleplay: !!us.roleplayDone, quiz: us.quizBest, done, steps };
  }
  function trackStats(tid) {
    const us = unitsOf(tid);
    return { done: us.filter((u) => unitStats(u).done).length, units: us.length };
  }
  const allSeen = () => SPEAK.units.reduce((n, u) => n + unitStats(u).seen, 0);

  // Interleaved curriculum: family ↔ getting-around unit order, phrases flattened.
  function curriculumPath() {
    const fam = unitsOf('family');
    const around = unitsOf('around');
    const order = [];
    const n = Math.max(fam.length, around.length);
    for (let i = 0; i < n; i++) {
      if (fam[i]) order.push(fam[i]);
      if (around[i]) order.push(around[i]);
    }
    const path = [];
    order.forEach((u) => u.phrases.forEach((p) => path.push({ id: pid(u, p), phrase: p, unit: u })));
    return path;
  }
  function nextNewPhrases(count) {
    const path = curriculumPath();
    const unlocked = Store.state.curriculum.unlocked || 0;
    return path.slice(unlocked, unlocked + count);
  }
  function peekTomorrow(count) {
    const path = curriculumPath();
    const unlocked = Store.state.curriculum.unlocked || 0;
    const daily = Store.ensureDaily();
    const todayNew = (daily.newIds && daily.newIds.length) || Math.min(count, path.length - unlocked);
    const start = daily.newDone ? unlocked : unlocked + todayNew;
    return path.slice(start, start + Math.min(3, count));
  }
  function dailyProgress() {
    const d = Store.ensureDaily();
    const parts = ['warmDone', 'newDone', 'convoDone', 'listenDone'];
    const done = parts.filter((k) => d[k]).length;
    return { d, done, total: 4, finished: !!d.done };
  }
  function nextDailyHash() {
    const { d, finished } = dailyProgress();
    if (finished) return '#/today/done';
    if (!d.warmDone) return '#/today/warm';
    if (!d.newDone) return '#/today/new';
    if (!d.convoDone) return '#/today/convo';
    if (!d.listenDone) return '#/today/listen';
    return '#/today/done';
  }

  // ---------- HOME ----------
  function greeting() {
    const h = new Date().getHours();
    // Keep the time phrase + name as unbreakable chunks so こんばんは never wraps mid-word.
    let phrase, en;
    if (h < 11) { phrase = 'おはよう'; en = 'Good morning, Eliz'; }
    else if (h < 18) { phrase = 'こんにちは'; en = 'Hello, Eliz'; }
    else { phrase = 'こんばんは'; en = 'Good evening, Eliz'; }
    const html = `<span class="greet-phrase">${phrase}、</span><span class="greet-name">リズ</span>`;
    return [html, en];
  }

  function heatmapHTML() {
    const set = new Set(Store.state.days || []);
    const cells = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    // 28 days ending today
    d.setDate(d.getDate() - 27);
    for (let i = 0; i < 28; i++) {
      const key = Store.today(d);
      const on = set.has(key);
      const isToday = key === Store.today();
      cells.push(`<span class="hm-cell ${on ? 'on' : ''} ${isToday ? 'today' : ''}" title="${key}"></span>`);
      d.setDate(d.getDate() + 1);
    }
    return `<div class="heatmap" aria-label="Practice days">${cells.join('')}</div>`;
  }

  function encourage() {
    const { finished, done } = dailyProgress();
    const st = Store.streak();
    if (finished) return st >= 3 ? `Streak ${st} — you’re on a roll.` : '今日もおつかれさま！ Come back tomorrow.';
    if (done === 0) return 'A cozy ~10 minutes. Missing a day is fine — we just pick up again.';
    return `${done} of 4 parts done. Keep going when you’re ready.`;
  }

  function unitRow(u, i) {
    const s = unitStats(u);
    return `<a class="unit-card ${s.done ? 'done' : ''}" href="#/unit/${u.id}">
      <span class="unit-num">${s.done ? ICON.check : i + 1}</span>
      <div class="unit-body">
        <div class="unit-title">${esc(u.title)}</div>
        <div class="jp unit-jp" lang="ja">${esc(u.jpTitle)}</div>
        <div class="bar small"><span style="width:${Math.round((s.steps / 4) * 100)}%"></span></div>
      </div>
    </a>`;
  }

  function viewHome() {
    topbar('', null);
    const seen = allSeen();
    const due = Store.dueIds().filter((id) => phraseIndex[id]).length;
    const [gj, ge] = greeting();
    const { finished, done } = dailyProgress();
    const href = nextDailyHash();
    const ctaMain = finished ? 'Lesson complete' : (done ? 'Continue today’s lesson' : "Today’s lesson");
    const ctaSub = finished ? 'Peek at free practice or come back tomorrow' : 'Warm-up · new phrases · chat · listen';
    $app.innerHTML = `
      <section class="hero">
        <a class="iconbtn hero-gear" href="#/settings" aria-label="Settings">${ICON.gear}</a>
        <div class="hero-row">
          <div class="hero-text">
            <p class="eyebrow">${DECO.heart} for Eliz</p>
            <h1 class="jp hero-jp" lang="ja">${gj}</h1>
            <p class="hero-en">${ge}. ${esc(encourage())}</p>
          </div>
          ${mascot(finished ? 'cheer' : 'wave', 'hero-mascot')}
        </div>
        <div class="stats">
          <div class="stat"><span class="stat-num">${Store.streak()}</span><span class="stat-label">day streak</span></div>
          <div class="stat"><span class="stat-num">${seen}</span><span class="stat-label">phrases</span></div>
          <div class="stat"><span class="stat-num">${due}</span><span class="stat-label">due review</span></div>
        </div>
        ${heatmapHTML()}
        <a class="btn primary wide cta daily-cta ${finished ? 'done' : ''}" href="${href}" id="start-cta">
          <span class="cta-main">${ctaMain}</span>
          <span class="cta-sub">${ctaSub}</span>
        </a>
      </section>

      <details class="free-practice" id="free-practice">
        <summary>
          <span class="track-icon">${DECO.star}</span>
          <div>
            <div class="unit-title">Free practice</div>
            <div class="unit-sub">Open any unit’s phrases, role-play, listening, or quiz</div>
          </div>
        </summary>
        ${SPEAK.tracks.map((t) => {
          const ts = trackStats(t.id);
          return `<section class="track track-${t.id}" id="track-${t.id}">
            <div class="track-head">
              <span class="track-icon">${t.id === 'family' ? DECO.heart : DECO.star}</span>
              <div>
                <h2 class="track-title">${esc(t.title)} <span class="jp track-jp" lang="ja">${esc(t.jpTitle)}</span></h2>
                <p class="track-blurb">${esc(t.blurb)}</p>
              </div>
              <span class="tag">${ts.done}/${ts.units}</span>
            </div>
            <div class="units">${unitsOf(t.id).map(unitRow).join('')}</div>
          </section>`;
        }).join('')}
        <a class="review-card-home ${due ? 'has-due' : ''}" href="#/review" id="review-cta">
          <span class="track-icon">${DECO.bow}</span>
          <div><div class="unit-title">Review bank</div><div class="unit-sub">${due ? `${due} phrase${due > 1 ? 's' : ''} ready` : 'Leitner spaced review'}</div></div>
          <span class="tag ${due ? 'hot' : ''}">${due}</span>
        </a>
      </details>
      <footer class="foot">${DECO.skull}<span>がんばって！</span>${DECO.skull}</footer>`;
  }

  // ---------- SETTINGS ----------
  function viewSettings() {
    topbar('Settings', '#/');
    const kana = Store.setting('showKana');
    const rm = Store.setting('romaji');
    const dn = Store.setting('dailyNew');
    $app.innerHTML = `
      <article class="card settings">
        <div class="set-block">
          <div class="set-title">New phrases per day</div>
          <div class="set-sub">How many brand-new phrases today’s lesson unlocks (3 / 5 / 7).</div>
          <div class="seg" role="radiogroup" aria-label="Daily new phrases">
            ${[3, 5, 7].map((v) => `<button role="radio" aria-checked="${dn === v}" class="seg-btn ${dn === v ? 'on' : ''}" data-dn="${v}">${v}</button>`).join('')}
          </div>
        </div>
        <label class="switch-row">
          <div><div class="set-title">Hiragana reading</div><div class="set-sub">Show the kana reading under phrases that have kanji, e.g. <span class="jp" lang="ja">お母さん</span> → <span class="jp" lang="ja">おかあさん</span>.</div></div>
          <input type="checkbox" id="set-kana" ${kana ? 'checked' : ''}><span class="switch" aria-hidden="true"></span>
        </label>
        <div class="set-block">
          <div class="set-title">Romaji</div>
          <div class="set-sub">Fade hides romaji (tap to peek) on phrases you know well (review box 3+) and in units you’ve finished.</div>
          <div class="seg" role="radiogroup" aria-label="Romaji">
            ${[['show', 'Show'], ['fade', 'Fade'], ['hide', 'Hide']].map(([v, l]) => `<button role="radio" aria-checked="${rm === v}" class="seg-btn ${rm === v ? 'on' : ''}" data-rm="${v}">${l}</button>`).join('')}
          </div>
        </div>
        <div class="set-preview">${phraseHTML(SPEAK.units[1].phrases[1], { big: false })}</div>
      </article>
      <article class="card settings backup-card" id="backup-section">
        <div class="backup-deco" aria-hidden="true">${DECO.bow}${DECO.skull}${DECO.bow}</div>
        <div class="set-title">Back up my progress ${DECO.heart}</div>
        <div class="set-sub">Progress is saved on this phone. Make a backup code now and then, or before switching phones.</div>
        <div class="set-block">
          <div class="set-title" style="font-size:.95rem">Export</div>
          <div class="set-sub">A compact code with your streak, phrases, review boxes, and settings.</div>
          <textarea class="backup-code" id="backup-export" readonly rows="4" aria-label="Backup code" placeholder="Tap “Make backup code”…"></textarea>
          <div class="backup-actions">
            <button type="button" class="btn primary" id="backup-make">Make backup code</button>
            <button type="button" class="btn ghost" id="backup-copy" disabled>Copy code</button>
            <button type="button" class="btn ghost" id="backup-share" hidden>Share</button>
          </div>
        </div>
        <div class="set-block">
          <div class="set-title" style="font-size:.95rem">Restore</div>
          <div class="set-sub">Paste a code from another phone (or an older backup) to bring progress back.</div>
          <textarea class="backup-code" id="backup-import" rows="4" aria-label="Paste backup code" placeholder="Paste EJP1.… code here"></textarea>
          <p class="backup-err" id="backup-err" hidden role="alert"></p>
          <button type="button" class="btn primary" id="backup-restore">Restore</button>
        </div>
        <div class="backup-cheer" id="backup-cheer" hidden>
          ${mascot('cheer', 'backup-cheer-mascot')}
          <p class="jp" lang="ja">やった！</p>
          <p>Progress restored on this phone.</p>
        </div>
      </article>
      <article class="card settings">
        <div class="set-title">Progress</div>
        <div class="set-sub">Saved on this device only. Missing a day never resets your streak countdown — you just resume.</div>
        <button class="btn ghost" id="reset">Reset progress</button>
      </article>`;
    document.getElementById('set-kana').onchange = (e) => { Store.setting('showKana', e.target.checked); viewSettings(); };
    document.querySelectorAll('[data-rm]').forEach((b) => b.onclick = () => { Store.setting('romaji', b.dataset.rm); viewSettings(); });
    document.querySelectorAll('[data-dn]').forEach((b) => b.onclick = () => { Store.setting('dailyNew', parseInt(b.dataset.dn, 10)); viewSettings(); });
    document.getElementById('reset').onclick = () => {
      if (confirm('Reset all progress on this device?')) { Store.reset(); toast('Progress reset'); go('#/'); }
    };
    wireBackupUI();
  }

  function wireBackupUI() {
    const out = document.getElementById('backup-export');
    const inn = document.getElementById('backup-import');
    const err = document.getElementById('backup-err');
    const copyBtn = document.getElementById('backup-copy');
    const shareBtn = document.getElementById('backup-share');
    const cheer = document.getElementById('backup-cheer');
    const showErr = (msg) => { err.hidden = !msg; err.textContent = msg || ''; };
    showErr('');

    document.getElementById('backup-make').onclick = async () => {
      try {
        Store.markBackup();
        const code = await Store.exportBackup();
        out.value = code;
        copyBtn.disabled = false;
        toast('Backup code ready');
      } catch (e) {
        toast('Couldn’t make a backup code');
      }
    };

    const copyCode = async () => {
      const code = out.value.trim();
      if (!code) return;
      let ok = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(code);
          ok = true;
        }
      } catch (e) { /* fallback below */ }
      if (!ok) {
        out.focus(); out.select();
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      }
      if (ok) { Store.markBackup(); toast('Copied!'); }
      else toast('Couldn’t copy — long-press to select');
    };
    copyBtn.onclick = copyCode;

    if (navigator.share) {
      shareBtn.hidden = false;
      shareBtn.onclick = async () => {
        const code = out.value.trim();
        if (!code) {
          try {
            out.value = await Store.exportBackup();
            copyBtn.disabled = false;
          } catch (e) { toast('Couldn’t make a backup code'); return; }
        }
        try {
          await navigator.share({ title: 'にほんご backup', text: out.value.trim() });
          Store.markBackup();
        } catch (e) {
          if (e && e.name === 'AbortError') return;
          toast('Share didn’t work — try Copy instead');
        }
      };
    }

    document.getElementById('backup-restore').onclick = async () => {
      showErr('');
      const code = (inn.value || '').trim();
      if (!code) { showErr('Paste a backup code first.'); return; }
      try {
        await Store.parseBackup(code);
      } catch (e) {
        showErr((e && e.message) || 'Couldn’t restore that code.');
        return;
      }
      if (!confirm('This will replace progress on this device. Continue?')) return;
      try {
        await Store.importBackup(code);
        cheer.hidden = false;
        celebrate(cheer.querySelector('.backup-cheer-mascot') || cheer);
        toast('Progress restored!');
        setTimeout(() => viewSettings(), 1600);
      } catch (e) {
        showErr((e && e.message) || 'Couldn’t restore that code.');
      }
    };
  }

  // ---------- UNIT overview ----------
  function viewUnit(u) {
    topbar(esc(trackById(u.track).title), '#/');
    const s = unitStats(u);
    const step = (n, ok, href, title, sub) => `<a class="step" href="${href}">
      <span class="step-num ${ok ? 'ok' : ''}">${ok ? ICON.check : n}</span>
      <div><div class="step-title">${title}</div><div class="step-sub">${sub}</div></div></a>`;
    $app.innerHTML = `
      <section class="unit-hero">
        <p class="eyebrow jp" lang="ja">${esc(u.jpTitle)}</p>
        <h1>${esc(u.title)}</h1>
        <p class="lede">${esc(u.summary)}</p>
        ${s.done ? `<p class="tag ok">${DECO.star} Unit complete</p>` : ''}
      </section>
      <div class="steps">
        ${step(1, s.seen === s.total, `#/unit/${u.id}/cards/0`, 'Phrases', `${s.seen} of ${s.total} learned · listen and say each one`)}
        ${step(2, s.listen, `#/unit/${u.id}/listen`, 'Listening drill', `${u.listening.length} lines at natural speed, no text`)}
        ${step(3, s.roleplay, `#/unit/${u.id}/roleplay`, 'Role-play', esc(u.roleplay.title))}
        ${step(4, s.quiz >= 70, `#/unit/${u.id}/quiz`, 'Quick quiz', s.quiz ? `Best score ${s.quiz}%` : '6 questions · 70% to pass')}
      </div>`;
  }

  // ---------- feedback ----------
  function feedbackHTML(ok, title, body = '') {
    return `<div class="feedback ${ok ? 'good' : 'bad'}">
      ${mascot(ok ? 'cheer' : 'think', 'fb-mascot')}
      <div class="fb-body"><p class="fb-title"><strong>${title}</strong></p>${body}</div>
    </div>`;
  }
  function afterFeedback(container, ok) {
    const all = container.querySelectorAll('.feedback'); const fb = all[all.length - 1] || container;
    if (ok) celebrate(fb.querySelector('.fb-mascot') || fb); else bounce(fb.querySelector('.fb-mascot'));
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ---------- speaking practice ----------
  function speakCheck(container, targets, onResult) {
    // Mic practice if recognition exists, otherwise honest self-rating.
    if (Speech.canListen) {
      container.innerHTML = `
        <button class="mic" data-mic>${ICON.mic}<span>Tap and say it</span></button>
        <div class="result" data-result></div>`;
      const btn = container.querySelector('[data-mic]');
      const out = container.querySelector('[data-result]');
      btn.onclick = async () => {
        btn.classList.add('listening'); btn.querySelector('span').textContent = 'Listening…';
        try {
          const alts = await Speech.listen();
          if (!alts.length) { out.innerHTML = '<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>'; return; }
          const { score, heard } = Speech.score(alts, targets);
          const label = score >= 80 ? ['great', 'すごい！ Great'] : score >= 55 ? ['close', 'Close, nice'] : ['again', 'Let’s try again'];
          out.innerHTML = `<div class="score ${label[0]}"><span class="score-num">${score}%</span><span>${label[1]}</span></div><p class="heard">Heard: <span class="jp">${esc(heard)}</span></p>`;
          if (score >= 80) celebrate(out.querySelector('.score'));
          onResult && onResult(score >= 55);
        } catch (err) {
          const msg = /not-allowed|service-not-allowed/.test(err.message) ? 'Microphone access is blocked. You can rate yourself instead.' : 'Speech check isn’t working right now. Rate yourself instead.';
          out.innerHTML = `<p class="muted">${msg}</p>`;
          selfRate(container, onResult, true);
        } finally {
          btn.classList.remove('listening'); btn.querySelector('span').textContent = 'Tap and say it';
        }
      };
    } else {
      selfRate(container, onResult);
    }
  }
  function selfRate(container, onResult, append) {
    const html = `<p class="muted small">Say it out loud, then be honest:</p>
      <div class="rate-row"><button class="btn ghost" data-rate="0">Again</button><button class="btn soft" data-rate="1">Got it</button></div>`;
    if (append) container.insertAdjacentHTML('beforeend', html); else container.innerHTML = html;
    container.querySelectorAll('[data-rate]').forEach((b) => b.onclick = () => {
      container.querySelectorAll('[data-rate]').forEach((x) => x.classList.remove('chosen'));
      b.classList.add('chosen');
      if (b.dataset.rate === '1') bounce(b);
      onResult && onResult(b.dataset.rate === '1', true);
    });
  }

  function phraseHTML(p, { big = true, known = false } = {}) {
    const kana = kanaFor(p);
    const len = [...p.jp].length;
    const size = len > 12 ? 'xlong' : len > 8 ? 'long' : '';
    return `<div class="phrase ${big ? 'big' : ''} ${size}">
      <div class="jp phrase-jp" lang="ja">${esc(p.jp)}</div>
      ${kana ? `<div class="jp phrase-kana" lang="ja">${esc(kana)}</div>` : ''}
      <div class="phrase-romaji-wrap">${romajiHTML(p.romaji, 'phrase-romaji', known)}</div>
      <div class="phrase-en">${esc(p.en)}</div>
    </div>`;
  }

  // ---------- PHRASE CARDS ----------
  function viewCards(u, i) {
    i = Math.max(0, Math.min(u.phrases.length - 1, i | 0));
    const p = u.phrases[i];
    const id = pid(u, p);
    const known = phraseKnown(u, p);
    Store.markSeen(id);
    topbar(esc(u.title), `#/unit/${u.id}`);
    const last = i === u.phrases.length - 1;
    $app.innerHTML = `
      <div class="progress-dots" aria-label="Card ${i + 1} of ${u.phrases.length}">
        ${u.phrases.map((_, k) => `<span class="${k < i ? 'past' : k === i ? 'now' : ''}"></span>`).join('')}
      </div>
      <article class="card phrase-card" id="phrase-card">
        <span class="card-deco">${DECO.bow}</span>
        ${phraseHTML(p, { known })}
        ${audioButtons(p.jp)}
        ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
        ${p.grammar ? `<details class="grammar"><summary>${DECO.star} Grammar bite</summary><p>${esc(p.grammar)}</p></details>` : ''}
        <div class="practice" id="practice"></div>
      </article>
      <div class="nav-row">
        <a class="btn ghost" href="#/unit/${u.id}/cards/${i - 1}" ${i === 0 ? 'aria-disabled="true" tabindex="-1"' : ''}>Back</a>
        <a class="btn primary" id="next" href="${last ? `#/unit/${u.id}/listen` : `#/unit/${u.id}/cards/${i + 1}`}">${last ? 'On to listening' : 'Next'}</a>
      </div>`;
    speakCheck(document.getElementById('practice'), [p.jp, p.kana].filter(Boolean), (ok, self) => {
      if (!ok) { Store.grade(id, false); if (self) Speech.speak(p.jp, { slow: true }); }
    });
    // Auto-play once when the card opens (may be blocked until the first tap on some phones).
    setTimeout(() => Speech.speak(p.jp), 250);
  }

  // ---------- LISTENING DRILL ----------
  // Natural-speed audio with no text → pick the meaning → try a reply → reveal the text.
  function viewListen(u) {
    topbar('Listening', `#/unit/${u.id}`);
    const items = u.listening;
    let k = 0, right = 0;
    const done = unitStats(u).done; // romaji fades in dialogue once the unit is complete
    const show = () => {
      if (k >= items.length) return end();
      const it = items[k];
      const meanings = shuffle(it.meanings.map((m, i) => ({ m, ok: i === 0 })));
      $app.innerHTML = `
        <div class="quiz-top"><span>Line ${k + 1} of ${items.length}</span><div class="bar small"><span style="width:${(k / items.length) * 100}%"></span></div></div>
        <article class="card listen-card" id="listen-card">
          <p class="q-label">${ICON.ear} Listen. No text yet!</p>
          <div class="listen-play">
            <button class="big-play" data-say="${esc(it.jp)}" aria-label="Play at natural speed">${ICON.play}</button>
            <button class="pill ghost" data-say="${esc(it.jp)}" data-slow="1">${ICON.slow}<span>Slow</span></button>
          </div>
          <div class="listen-text hidden" id="listen-text">
            ${phraseHTML(it, { big: false, known: done })}
            ${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}
          </div>
        </article>
        <div id="lstage">
          <p class="prompt"><span class="eyebrow">Step 1</span> What does it mean?</p>
          <div class="options" id="mopts">${meanings.map((o, i) => `<button class="option" data-i="${i}"><span>${esc(o.m)}</span></button>`).join('')}</div>
        </div>`;
      setTimeout(() => Speech.speak(it.jp), 350);
      document.querySelectorAll('#mopts .option').forEach((b) => b.onclick = () => {
        const pick = meanings[+b.dataset.i];
        if (pick.ok) right++;
        document.querySelectorAll('#mopts .option').forEach((x) => {
          x.disabled = true;
          const o = meanings[+x.dataset.i];
          if (o.ok) x.classList.add('right'); else if (o === pick) x.classList.add('wrong');
        });
        const st = document.getElementById('lstage');
        st.insertAdjacentHTML('beforeend', feedbackHTML(pick.ok, pick.ok ? 'そうそう！ You understood it.' : 'Close! It means:', `<p>${esc(it.en)}</p>`) +
          `<button class="btn primary wide" id="to-reply">Now reply</button>`);
        afterFeedback(st, pick.ok);
        document.getElementById('to-reply').onclick = () => replyStage(it);
      });
    };
    const replyStage = (it) => {
      const opts = shuffle(it.reply.options);
      const correct = it.reply.options[0];
      const st = document.getElementById('lstage');
      st.innerHTML = `
        <p class="prompt"><span class="eyebrow">Step 2</span> ${esc(it.reply.prompt)}</p>
        <div class="options" id="ropts">${opts.map((o, i) => `<button class="option" data-i="${i}"><span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, done)}</button>`).join('')}</div>
        ${Speech.canListen ? `<button class="mic small" id="l-mic">${ICON.mic}<span>Or say your reply</span></button><div class="result" id="l-result"></div>` : ''}`;
      const choose = (o) => {
        const ok = o === correct;
        st.querySelectorAll('#ropts .option').forEach((x) => {
          x.disabled = true;
          const y = opts[+x.dataset.i];
          if (y === correct) x.classList.add('right'); else if (y === o) x.classList.add('wrong');
        });
        const mic = document.getElementById('l-mic'); if (mic) mic.disabled = true;
        document.getElementById('listen-text').classList.remove('hidden');
        st.insertAdjacentHTML('beforeend', feedbackHTML(ok, ok ? 'Perfect reply!' : 'A natural reply is:',
          `${ok ? '' : `<p class="jp" lang="ja">${esc(correct.jp)}</p>`}<p class="muted">${esc(correct.en)}</p><p class="small muted">The line is shown above now. Play it again and follow along.</p>`) +
          `<button class="btn primary wide" id="l-next">${k === items.length - 1 ? 'Finish' : 'Next line'}</button>`);
        afterFeedback(st, ok);
        Speech.speak(correct.jp);
        document.getElementById('l-next').onclick = () => { k++; show(); };
      };
      st.querySelectorAll('#ropts .option').forEach((b) => b.onclick = () => choose(opts[+b.dataset.i]));
      const mic = document.getElementById('l-mic');
      if (mic) mic.onclick = async () => {
        const out = document.getElementById('l-result');
        mic.classList.add('listening');
        try {
          const alts = await Speech.listen();
          let best = null;
          opts.forEach((o) => { const r = Speech.score(alts, [o.jp, o.kana].filter(Boolean)); if (!best || r.score > best.score) best = { ...r, o }; });
          if (!alts.length || best.score < 45) { out.innerHTML = `<p class="muted">Heard “${esc(alts[0] || '…')}”. Try again or tap an answer.</p>`; return; }
          out.innerHTML = `<p class="muted">Heard “<span class="jp">${esc(best.heard)}</span>” (${best.score}% match)</p>`;
          choose(best.o);
        } catch (e) { out.innerHTML = '<p class="muted">Mic isn’t available. Tap an answer instead.</p>'; }
        finally { mic.classList.remove('listening'); }
      };
    };
    const end = () => {
      Store.setUnit(u.id, { listenDone: true });
      $app.innerHTML = `<div class="done-card" id="done-card">
        ${mascot('cheer', 'done-mascot')}
        <p class="jp big-jp" lang="ja">きけた！</p>
        <p>You understood ${right} of ${items.length} lines at natural speed.</p>
        <div class="nav-row">
          <button class="btn ghost" id="l-again">Again</button>
          <a class="btn primary" href="#/unit/${u.id}/roleplay">Role-play</a>
        </div></div>`;
      celebrate(document.querySelector('.done-mascot'));
      document.getElementById('l-again').onclick = () => viewListen(u);
    };
    show();
  }

  // ---------- DAILY LESSON (~10–12 min) ----------
  function dailyStepBar(part) {
    const labels = ['Warm-up', 'New', 'Chat', 'Listen'];
    const keys = ['warmDone', 'newDone', 'convoDone', 'listenDone'];
    const d = Store.ensureDaily();
    return `<div class="daily-steps" aria-label="Today’s lesson progress">
      ${labels.map((l, i) => {
        const done = d[keys[i]];
        const now = part === keys[i] || (part === 'warm' && i === 0) || (part === 'new' && i === 1) || (part === 'convo' && i === 2) || (part === 'listen' && i === 3);
        return `<span class="ds ${done ? 'done' : ''} ${now ? 'now' : ''}">${done ? ICON.check : (i + 1)}<em>${l}</em></span>`;
      }).join('')}
    </div>`;
  }

  function viewTodayGate() {
    go(nextDailyHash());
  }

  // (a) Warm-up: up to 8 due Leitner phrases, speak aloud
  function viewTodayWarm() {
    const d = Store.ensureDaily();
    if (d.warmDone) return go(nextDailyHash());
    topbar('Warm-up', '#/');
    const due = Store.dueIds().map((id) => phraseIndex[id]).filter(Boolean).slice(0, 8);
    if (!due.length) {
      Store.setDaily({ warmDone: true });
      $app.innerHTML = `<div class="done-card">${mascot('wave', 'done-mascot')}${dailyStepBar('warm')}
        <p class="jp big-jp" lang="ja">まだ大丈夫！</p>
        <p>Nothing is due for review yet — first day magic.</p>
        <a class="btn primary wide" id="warm-next" href="#/today/new">New phrases</a></div>`;
      return;
    }
    let i = 0;
    const show = () => {
      if (i >= due.length) {
        Store.setDaily({ warmDone: true });
        $app.innerHTML = `<div class="done-card">${mascot('cheer', 'done-mascot')}${dailyStepBar('warm')}
          <p class="jp big-jp" lang="ja">おつかれ！</p>
          <p>Warm-up done — ${due.length} phrase${due.length > 1 ? 's' : ''} refreshed.</p>
          <a class="btn primary wide" href="#/today/new">New phrases</a></div>`;
        celebrate(document.querySelector('.done-mascot'));
        return;
      }
      const { phrase: p, unit: u } = due[i];
      const id = pid(u, p);
      $app.innerHTML = `
        ${dailyStepBar('warm')}
        <div class="quiz-top"><span>Review ${i + 1} of ${due.length}</span><div class="bar small"><span style="width:${(i / due.length) * 100}%"></span></div></div>
        <article class="card phrase-card" id="phrase-card">
          <span class="card-deco">${DECO.bow}</span>
          ${phraseHTML(p, { known: phraseKnown(u, p) })}
          ${audioButtons(p.jp)}
          <div class="practice" id="practice"></div>
        </article>
        <button class="btn primary wide" id="warm-next" disabled>Next</button>`;
      let rated = false;
      speakCheck(document.getElementById('practice'), [p.jp, p.kana].filter(Boolean), (ok) => {
        Store.grade(id, !!ok);
        rated = true;
        document.getElementById('warm-next').disabled = false;
      });
      document.getElementById('warm-next').onclick = () => {
        if (!rated) Store.grade(id, true); // skipped rating → gentle pass so flow continues
        i++; show();
      };
      setTimeout(() => Speech.speak(p.jp), 250);
    };
    show();
  }

  // (b) New phrases: 3/5/7 along interleaved curriculum
  function viewTodayNew() {
    const d = Store.ensureDaily();
    if (d.newDone) return go(nextDailyHash());
    topbar('New phrases', '#/');
    const n = Store.setting('dailyNew') || 3;
    let batch = (d.newIds && d.newIds.length)
      ? d.newIds.map((id) => phraseIndex[id]).filter(Boolean)
      : nextNewPhrases(n);
    if (!batch.length) {
      Store.setDaily({ newDone: true, newIds: [] });
      $app.innerHTML = `<div class="done-card">${mascot('cheer', 'done-mascot')}${dailyStepBar('new')}
        <p class="jp big-jp" lang="ja">全部おぼえた！</p>
        <p>You’ve unlocked every phrase. Free practice keeps the conversation going.</p>
        <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`;
      return;
    }
    if (!d.newIds || !d.newIds.length) {
      Store.setDaily({ newIds: batch.map((x) => x.id) });
    }
    let i = 0;
    const show = () => {
      if (i >= batch.length) {
        Store.unlockMore(batch.length);
        Store.setDaily({ newDone: true });
        $app.innerHTML = `<div class="done-card">${mascot('cheer', 'done-mascot')}${dailyStepBar('new')}
          <p class="jp big-jp" lang="ja">新しいことば！</p>
          <p>${batch.length} new phrase${batch.length > 1 ? 's' : ''} unlocked.</p>
          <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`;
        celebrate(document.querySelector('.done-mascot'));
        return;
      }
      const { phrase: p, unit: u, id } = batch[i];
      Store.markSeen(id);
      $app.innerHTML = `
        ${dailyStepBar('new')}
        <div class="quiz-top"><span>New ${i + 1} of ${batch.length}</span><div class="bar small"><span style="width:${(i / batch.length) * 100}%"></span></div></div>
        <article class="card phrase-card" id="phrase-card">
          <span class="card-deco">${DECO.heart}</span>
          ${phraseHTML(p, { known: false })}
          ${audioButtons(p.jp)}
          ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
          ${p.grammar ? `<details class="grammar"><summary>${DECO.star} Grammar bite</summary><p>${esc(p.grammar)}</p></details>` : ''}
          <div class="practice" id="practice"></div>
        </article>
        <button class="btn primary wide" id="new-next">Next</button>`;
      speakCheck(document.getElementById('practice'), [p.jp, p.kana].filter(Boolean), (ok) => {
        Store.grade(id, !!ok);
      });
      document.getElementById('new-next').onclick = () => { i++; show(); };
      setTimeout(() => Speech.speak(p.jp), 250);
    };
    show();
  }

  // (c) Mini conversation: short role-play mixing today's new + learned phrases
  function viewTodayConvo() {
    const d = Store.ensureDaily();
    if (d.convoDone) return go(nextDailyHash());
    topbar('Mini conversation', '#/');
    const script = buildDailyConvo();
    let step = 0, asked = 0, correct = 0;
    $app.innerHTML = `
      ${dailyStepBar('convo')}
      <section class="rp-head">
        <p class="eyebrow">${DECO.heart} Mini conversation</p>
        <h1>${esc(script.title)}</h1>
        <p class="lede">${esc(script.setting)}</p>
      </section>
      <div class="chat" id="chat"></div>
      <div class="reply" id="reply"></div>`;
    const chat = document.getElementById('chat');
    const reply = document.getElementById('reply');
    const bubble = (line, who) => {
      const el = document.createElement('div');
      el.className = `bubble ${who}`;
      const kana = kanaFor(line);
      el.innerHTML = `${who === 'them' ? `<div class="who">${esc(line.name || '')}</div>` : '<div class="who">You</div>'}
        <div class="jp bubble-jp" lang="ja">${esc(line.jp)}</div>
        ${kana ? `<div class="jp bubble-kana" lang="ja">${esc(kana)}</div>` : ''}
        <div>${romajiHTML(line.romaji, 'bubble-romaji', false)}</div>
        <div class="bubble-en">${esc(line.en)}</div>
        <div class="bubble-audio"><button class="mini" data-say="${esc(line.jp)}" aria-label="Play">${ICON.play}</button>
        <button class="mini" data-say="${esc(line.jp)}" data-slow="1" aria-label="Play slowly">${ICON.slow}</button></div>`;
      chat.appendChild(el);
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    const finish = () => {
      Store.setDaily({ convoDone: true });
      reply.innerHTML = `<div class="done-card">${mascot('cheer', 'done-mascot')}
        <p class="jp big-jp" lang="ja">いい会話！</p>
        <p>${correct} of ${asked} replies on point.</p>
        <a class="btn primary wide" href="#/today/listen">Quick listen</a></div>`;
      celebrate(reply.querySelector('.done-mascot'));
    };
    const next = () => {
      if (step >= script.lines.length) return finish();
      const line = script.lines[step++];
      if (line.speaker === 'them') {
        bubble(line, 'them');
        reply.innerHTML = '';
        Speech.speak(line.jp);
        setTimeout(next, 650);
      } else {
        const opts = shuffle(line.options.slice());
        const correctOpt = line.options[0];
        reply.innerHTML = `<p class="prompt">${esc(line.prompt)}</p>
          <div class="options">${opts.map((o, i) => `<button class="option" data-i="${i}"><span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, false)}</button>`).join('')}</div>`;
        reply.querySelectorAll('.option').forEach((b) => b.onclick = () => {
          const pick = opts[+b.dataset.i];
          asked++;
          const ok = pick === correctOpt || pick.jp === correctOpt.jp;
          if (ok) correct++;
          reply.querySelectorAll('.option').forEach((x) => {
            x.disabled = true;
            const y = opts[+x.dataset.i];
            if (y.jp === correctOpt.jp) x.classList.add('right');
            else if (y === pick) x.classList.add('wrong');
          });
          bubble({ jp: correctOpt.jp, kana: correctOpt.kana, romaji: correctOpt.romaji, en: correctOpt.en }, 'you');
          Speech.speak(correctOpt.jp);
          setTimeout(next, 700);
        });
      }
    };
    next();
  }

  function buildDailyConvo() {
    const d = Store.ensureDaily();
    const newItems = (d.newIds || []).map((id) => phraseIndex[id]).filter(Boolean);
    // Prefer a role-play from the unit of the first new phrase; fall back to first family unit.
    const u = (newItems[0] && newItems[0].unit) || SPEAK.units[0];
    const rp = u.roleplay;
    // Keep it short: first ~6 lines of the unit role-play (or all if shorter).
    const lines = rp.lines.slice(0, 6);
    return {
      title: rp.title,
      setting: `${rp.setting} (today’s phrases mixed in)`,
      lines
    };
  }

  // (d) Quick listen: 3–4 lines from unlocked units
  function viewTodayListen() {
    const d = Store.ensureDaily();
    if (d.listenDone) return go('#/today/done');
    topbar('Quick listen', '#/');
    const items = pickDailyListen(4);
    if (!items.length) {
      Store.setDaily({ listenDone: true, done: true });
      return go('#/today/done');
    }
    let k = 0, right = 0;
    const show = () => {
      if (k >= items.length) {
        Store.setDaily({ listenDone: true, done: true });
        Store.touchDay();
        return go('#/today/done');
      }
      const it = items[k];
      const meanings = shuffle(it.meanings.map((m, i) => ({ m, ok: i === 0 })));
      $app.innerHTML = `
        ${dailyStepBar('listen')}
        <div class="quiz-top"><span>Listen ${k + 1} of ${items.length}</span><div class="bar small"><span style="width:${(k / items.length) * 100}%"></span></div></div>
        <article class="card listen-card" id="listen-card">
          <p class="q-label">${ICON.ear} Listen. No text yet!</p>
          <div class="listen-play">
            <button class="big-play" data-say="${esc(it.jp)}" aria-label="Play at natural speed">${ICON.play}</button>
            <button class="pill ghost" data-say="${esc(it.jp)}" data-slow="1">${ICON.slow}<span>Slow</span></button>
          </div>
          <div class="listen-text hidden" id="listen-text">${phraseHTML(it, { big: false })}</div>
        </article>
        <div id="lstage">
          <p class="prompt"><span class="eyebrow">Meaning</span> What did you hear?</p>
          <div class="options" id="mopts">${meanings.map((o, i) => `<button class="option" data-i="${i}"><span>${esc(o.m)}</span></button>`).join('')}</div>
        </div>`;
      setTimeout(() => Speech.speak(it.jp), 350);
      document.querySelectorAll('#mopts .option').forEach((b) => b.onclick = () => {
        const pick = meanings[+b.dataset.i];
        if (pick.ok) right++;
        document.querySelectorAll('#mopts .option').forEach((x) => {
          x.disabled = true;
          const o = meanings[+x.dataset.i];
          if (o.ok) x.classList.add('right'); else if (o === pick) x.classList.add('wrong');
        });
        const st = document.getElementById('lstage');
        const opts = shuffle(it.reply.options.slice());
        const correct = it.reply.options[0];
        st.innerHTML = `
          <p class="prompt"><span class="eyebrow">Reply out loud</span> ${esc(it.reply.prompt)}</p>
          <div class="options" id="ropts">${opts.map((o, i) => `<button class="option" data-i="${i}"><span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, false)}</button>`).join('')}</div>
          <div class="practice" id="practice"></div>`;
        document.getElementById('listen-text').classList.remove('hidden');
        speakCheck(document.getElementById('practice'), [correct.jp, correct.kana].filter(Boolean), () => {});
        st.querySelectorAll('#ropts .option').forEach((btn) => btn.onclick = () => {
          const o = opts[+btn.dataset.i];
          st.querySelectorAll('#ropts .option').forEach((x) => {
            x.disabled = true;
            const y = opts[+x.dataset.i];
            if (y.jp === correct.jp) x.classList.add('right');
            else if (y === o) x.classList.add('wrong');
          });
          st.insertAdjacentHTML('beforeend', `<button class="btn primary wide" id="l-next">${k === items.length - 1 ? 'Finish' : 'Next'}</button>`);
          Speech.speak(correct.jp);
          document.getElementById('l-next').onclick = () => { k++; show(); };
        });
      });
    };
    show();
  }

  function pickDailyListen(n) {
    const unlockedUnits = new Set();
    const path = curriculumPath();
    const upto = Store.state.curriculum.unlocked || 0;
    path.slice(0, Math.max(upto, 1)).forEach((x) => unlockedUnits.add(x.unit.id));
    // Always include at least the first unit so day-1 listen works before unlock settles.
    unlockedUnits.add(SPEAK.units[0].id);
    const pool = [];
    SPEAK.units.forEach((u) => {
      if (!unlockedUnits.has(u.id)) return;
      u.listening.forEach((it) => pool.push(it));
    });
    return shuffle(pool).slice(0, Math.min(n, pool.length));
  }

  function viewTodayDone() {
    const d = Store.ensureDaily();
    if (!d.done) {
      // Mark complete if user navigates here after all parts.
      if (d.warmDone && d.newDone && d.convoDone && d.listenDone) Store.setDaily({ done: true });
    }
    Store.touchDay();
    topbar('今日もおつかれさま', '#/');
    const tomorrow = peekTomorrow(Store.setting('dailyNew') || 3);
    const preview = tomorrow.length
      ? `<ul class="tomorrow-list">${tomorrow.map((x) => `<li><span class="jp" lang="ja">${esc(x.phrase.jp)}</span> <span class="muted">${esc(x.phrase.en)}</span></li>`).join('')}</ul>`
      : `<p class="muted">More free practice tomorrow — the curriculum is complete.</p>`;
    const backupNudge = Store.needsBackupReminder(7)
      ? `<aside class="backup-nudge" role="note">
          <span class="backup-nudge-deco" aria-hidden="true">${DECO.bow}</span>
          <div>
            <strong>Save a backup?</strong>
            <p>It’s been a little while. A backup code keeps your streak safe if you switch phones.</p>
            <a class="btn ghost" href="#/settings">Back up my progress</a>
          </div>
        </aside>`
      : '';
    $app.innerHTML = `<div class="done-card end-card">
      ${mascot('cheer', 'done-mascot')}
      <p class="jp big-jp" lang="ja">おつかれさま！</p>
      <p>Streak: <strong>${Store.streak()}</strong> day${Store.streak() === 1 ? '' : 's'}. Missing a day never punishes you — just come back when you can.</p>
      ${backupNudge}
      <div class="tomorrow">
        <div class="set-title">Coming tomorrow</div>
        ${preview}
      </div>
      <a class="btn primary wide" href="#/">Home</a>
      <a class="btn ghost wide" href="#/" id="open-free">Free practice</a>
    </div>`;
    celebrate(document.querySelector('.done-mascot'));
  }

  // Shown once, the moment a unit becomes complete.
  function unitCompleteBanner(u, wasDone) {
    if (wasDone || !unitStats(u).done) return '';
    return `<div class="complete-banner">${DECO.star}<span>Unit complete: ${esc(u.title)}</span>${DECO.star}</div>`;
  }

  // ---------- ROLE-PLAY ----------
  function viewRoleplay(u) {
    topbar('Role-play', `#/unit/${u.id}`);
    const rp = u.roleplay;
    const known = unitStats(u).done;
    const wasDone = known;
    let step = 0, correct = 0, asked = 0;
    $app.innerHTML = `
      <section class="rp-head">
        <p class="eyebrow">${DECO.heart} Role-play</p>
        <h1>${esc(rp.title)}</h1>
        <p class="lede">${esc(rp.setting)}</p>
      </section>
      <div class="chat" id="chat"></div>
      <div class="reply" id="reply"></div>`;
    const chat = document.getElementById('chat');
    const reply = document.getElementById('reply');

    const bubble = (line, who, extraClass = '') => {
      const el = document.createElement('div');
      el.className = `bubble ${who} ${extraClass}`;
      const kana = kanaFor(line);
      el.innerHTML = `${who === 'them' ? `<div class="who">${esc(line.name || '')}</div>` : '<div class="who">You</div>'}
        <div class="jp bubble-jp" lang="ja">${esc(line.jp)}</div>
        ${kana ? `<div class="jp bubble-kana" lang="ja">${esc(kana)}</div>` : ''}
        <div>${romajiHTML(line.romaji, 'bubble-romaji', known)}</div>
        <div class="bubble-en">${esc(line.en)}</div>
        ${line.note && who === 'them' ? `<div class="bubble-note">${esc(line.note)}</div>` : ''}
        <div class="bubble-audio"><button class="mini" data-say="${esc(line.jp)}" ${line.fast ? 'data-fast="1"' : ''} aria-label="Play">${ICON.play}</button>
        <button class="mini" data-say="${esc(line.jp)}" data-slow="1" aria-label="Play slowly">${ICON.slow}</button></div>`;
      chat.appendChild(el);
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      return el;
    };

    function nextLine() {
      if (step >= rp.lines.length) return finish();
      const line = rp.lines[step++];
      if (line.speaker === 'them') {
        bubble(line, 'them');
        reply.innerHTML = '';
        Speech.speak(line.jp, { fast: !!line.fast });
        setTimeout(nextLine, 700);
      } else {
        askYou(line);
      }
    }

    function askYou(line) {
      asked++;
      const right = line.options[0];
      const opts = shuffle(line.options);
      reply.innerHTML = `
        <p class="prompt"><span class="eyebrow">Your turn</span> ${esc(line.prompt)}</p>
        <div class="options">
          ${opts.map((o, i) => `<button class="option" data-i="${i}"><span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, known)}</button>`).join('')}
        </div>
        ${Speech.canListen ? `<button class="mic small" id="rp-mic">${ICON.mic}<span>Or say your reply</span></button><div class="result" id="rp-result"></div>` : ''}`;
      const choose = (o) => {
        const ok = o === right;
        if (ok) correct++;
        reply.querySelectorAll('.option').forEach((b) => {
          b.disabled = true;
          const y = opts[+b.dataset.i];
          if (y === right) b.classList.add('right'); else if (y === o) b.classList.add('wrong');
        });
        const mic = document.getElementById('rp-mic'); if (mic) mic.disabled = true;
        reply.insertAdjacentHTML('beforeend', feedbackHTML(ok, ok ? 'そうです！ That’s it.' : 'Not quite. The natural reply is:',
          `${ok ? '' : `<p class="jp" lang="ja">${esc(right.jp)}</p>`}<p class="muted">${esc(right.en)}</p>${line.note ? `<p class="note">${esc(line.note)}</p>` : ''}`) +
          '<button class="btn primary wide" id="rp-next">Continue</button>');
        afterFeedback(reply, ok);
        document.getElementById('rp-next').onclick = () => { bubble(right, 'you', ok ? '' : 'corrected'); reply.innerHTML = ''; setTimeout(nextLine, 300); };
        Speech.speak(right.jp);
      };
      reply.querySelectorAll('.option').forEach((b) => b.onclick = () => choose(opts[+b.dataset.i]));
      const mic = document.getElementById('rp-mic');
      if (mic) mic.onclick = async () => {
        const out = document.getElementById('rp-result');
        mic.classList.add('listening');
        try {
          const alts = await Speech.listen();
          let best = null;
          opts.forEach((o) => { const r = Speech.score(alts, [o.jp, o.kana].filter(Boolean)); if (!best || r.score > best.score) best = { ...r, o }; });
          if (!alts.length || best.score < 45) { out.innerHTML = `<p class="muted">Heard “${esc(alts[0] || '…')}”. Try again or tap an answer.</p>`; return; }
          out.innerHTML = `<p class="muted">Heard “<span class="jp">${esc(best.heard)}</span>” (${best.score}% match)</p>`;
          choose(best.o);
        } catch (e) {
          out.innerHTML = '<p class="muted">Mic isn’t available. Tap an answer instead.</p>';
        } finally { mic.classList.remove('listening'); }
      };
      reply.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function finish() {
      Store.setUnit(u.id, { roleplayDone: true });
      reply.innerHTML = `<div class="done-card">
        ${mascot('cheer', 'done-mascot')}
        ${unitCompleteBanner(u, wasDone)}
        <p class="jp big-jp" lang="ja">おつかれさま！</p>
        <p>You chose the natural reply ${correct} of ${asked} times.</p>
        <div class="nav-row">
          <button class="btn ghost" id="rp-again">Play again</button>
          <a class="btn primary" href="#/unit/${u.id}/quiz">Take the quiz</a>
        </div></div>`;
      celebrate(reply.querySelector('.done-mascot'));
      document.getElementById('rp-again').onclick = () => viewRoleplay(u);
      reply.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    nextLine();
  }

  // ---------- QUIZ ----------
  function buildQuiz(u, n = 6) {
    const ps = shuffle(u.phrases).slice(0, n);
    const types = ['en2jp', 'jp2en', 'listen'];
    return ps.map((p, k) => {
      const type = types[k % types.length];
      const distract = shuffle(u.phrases.filter((x) => x !== p)).slice(0, 3);
      return { type, p, all: shuffle([p, ...distract]) };
    });
  }

  function viewQuiz(u) {
    topbar('Quick quiz', `#/unit/${u.id}`);
    const qs = buildQuiz(u);
    const wasDone = unitStats(u).done;
    let k = 0, score = 0;
    const show = () => {
      if (k >= qs.length) return end();
      const q = qs[k];
      const known = phraseKnown(u, q.p);
      const kana = kanaFor(q.p);
      const head = q.type === 'en2jp'
        ? `<p class="q-label">How do you say…</p><p class="q-main">${esc(q.p.en)}</p>`
        : q.type === 'jp2en'
          ? `<p class="q-label">What does this mean?</p><p class="q-main jp" lang="ja">${esc(q.p.jp)}</p>${kana ? `<p class="q-kana jp" lang="ja">${esc(kana)}</p>` : ''}<p class="q-sub">${romajiHTML(q.p.romaji, 'q-romaji', known)}</p>`
          : `<p class="q-label">${ICON.ear} Listen. What did you hear?</p>${audioButtons(q.p.jp, 'center')}`;
      $app.innerHTML = `
        <div class="quiz-top"><span>Question ${k + 1} of ${qs.length}</span><div class="bar small"><span style="width:${(k / qs.length) * 100}%"></span></div></div>
        <article class="card quiz-card">${head}</article>
        <div class="options" id="opts">
          ${q.all.map((o, i) => `<button class="option" data-i="${i}">${q.type === 'en2jp'
            ? `<span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, phraseKnown(u, o))}`
            : `<span>${esc(o.en)}</span>`}</button>`).join('')}
        </div>
        <div id="qfb"></div>`;
      if (q.type === 'listen') setTimeout(() => Speech.speak(q.p.jp), 300);
      document.querySelectorAll('#opts .option').forEach((b) => b.onclick = () => {
        const pick = q.all[+b.dataset.i];
        const ok = pick === q.p;
        if (ok) score++;
        const id = pid(u, q.p);
        Store.markSeen(id);
        if (!ok) Store.grade(id, false); // mistakes go back to the front of the review queue
        document.querySelectorAll('#opts .option').forEach((x) => {
          x.disabled = true;
          const o = q.all[+x.dataset.i];
          if (o === q.p) x.classList.add('right'); else if (o === pick) x.classList.add('wrong');
        });
        const fbBox = document.getElementById('qfb');
        fbBox.innerHTML = feedbackHTML(ok, ok ? 'せいかい！ Correct!' : 'Not this time. Here it is:', phraseHTML(q.p, { big: false, known })) +
          `<button class="btn primary wide" id="qnext">${k === qs.length - 1 ? 'See results' : 'Next'}</button>`;
        afterFeedback(fbBox, ok);
        if (q.type !== 'listen') Speech.speak(q.p.jp);
        document.getElementById('qnext').onclick = () => { k++; show(); };
      });
    };
    const end = () => {
      const pct = Math.round((score / qs.length) * 100);
      const prev = Store.unit(u.id).quizBest;
      Store.setUnit(u.id, { quizBest: Math.max(prev, pct) });
      const pass = pct >= 70;
      const s = unitStats(u);
      $app.innerHTML = `<div class="done-card">
        ${mascot(pass ? 'cheer' : 'think', 'done-mascot')}
        ${unitCompleteBanner(u, wasDone)}
        <p class="jp big-jp" lang="ja">${pass ? 'よくできました！' : 'もう一回！'}</p>
        <p class="score-big">${score} / ${qs.length}</p>
        <p class="muted">${pass
          ? (s.done ? 'Missed phrases were added to your review queue.' : 'Quiz passed! Finish the other steps to complete the unit.')
          : 'Score 70% or more to pass. Missed phrases were added to your review queue.'}</p>
        <div class="nav-row">
          <button class="btn ghost" id="qagain">Try again</button>
          <a class="btn primary" href="${pass ? (s.done ? `#/unit/${nextUnit().id}` : `#/unit/${u.id}`) : `#/unit/${u.id}/cards/0`}">${pass ? (s.done ? 'Next unit' : 'Back to unit') : 'Review the cards'}</a>
        </div></div>`;
      const m = document.querySelector('.done-mascot');
      if (pass) celebrate(m); else bounce(m);
      document.getElementById('qagain').onclick = () => viewQuiz(u);
    };
    show();
  }

  // ---------- REVIEW (Leitner) ----------
  function viewReview() {
    topbar('Review', '#/');
    const queue = Store.dueIds().filter((id) => phraseIndex[id]);
    const boxBarHTML = () => {
      const boxes = [1, 2, 3, 4, 5].map((b) => Object.keys(Store.state.srs).filter((id) => phraseIndex[id] && Store.state.srs[id].box === b).length);
      return `<div class="boxes" aria-label="Leitner boxes">${boxes.map((n, i) => `<div class="box"><span class="box-n">${n}</span><span class="box-l">Box ${i + 1}</span></div>`).join('')}</div>`;
    };
    const boxBar = boxBarHTML();
    if (!queue.length) {
      const total = Object.keys(Store.state.srs).length;
      $app.innerHTML = `<div class="done-card">
        ${mascot(total ? 'cheer' : 'wave', 'done-mascot')}
        <p class="jp big-jp">${total ? 'ばっちり！' : 'まだです'}</p>
        <p>${total ? 'Nothing to review right now. Come back tomorrow.' : 'Learn a few phrases first and they’ll show up here.'}</p>
        ${boxBar}
        <p class="muted small">Phrases move up a box each time you get them right, and come back less often: same day, 1, 3, 7, then 16 days.</p>
        <a class="btn primary" href="#/unit/${nextUnit().id}">Learn phrases</a></div>`;
      return;
    }
    const session = queue.slice(0, 20);
    const retry = new Set();
    let k = 0, got = 0;
    const show = () => {
      if (k >= session.length) {
        $app.innerHTML = `<div class="done-card">${mascot('cheer', 'done-mascot')}<p class="jp big-jp">おつかれさま！</p>
          <p>You reviewed ${session.length - retry.size} card${session.length - retry.size > 1 ? 's' : ''} and got ${got} on the first try.</p>${boxBarHTML()}
          <a class="btn primary" href="#/">Home</a></div>`;
        celebrate(document.querySelector('.done-mascot'));
        return;
      }
      const id = session[k];
      const { phrase: p, unit: u } = phraseIndex[id];
      const box = Store.state.srs[id].box;
      $app.innerHTML = `
        <div class="quiz-top"><span>${k + 1} of ${session.length} · Box ${box}</span><div class="bar small"><span style="width:${(k / session.length) * 100}%"></span></div></div>
        <article class="card review-card">
          <p class="q-label">Say it in Japanese</p>
          <p class="q-main">${esc(p.en)}</p>
          <p class="muted small">from “${esc(u.title)}”</p>
          <div id="answer" class="answer hidden">${phraseHTML(p, { big: false, known: Store.box(id) >= 3 })}${audioButtons(p.jp, 'center')}</div>
        </article>
        <div id="rv-actions">
          <div id="rv-speak" class="practice"></div>
          <button class="btn primary wide" id="reveal">Show answer</button>
        </div>`;
      const speakBox = document.getElementById('rv-speak');
      if (Speech.canListen) speakCheck(speakBox, [p.jp, p.kana].filter(Boolean), () => {}); else speakBox.remove();
      document.getElementById('reveal').onclick = () => {
        document.getElementById('answer').classList.remove('hidden');
        Speech.speak(p.jp);
        document.getElementById('rv-actions').innerHTML = `<div class="rate-row">
          <button class="btn ghost" id="again">Again</button><button class="btn soft" id="gotit">Got it</button></div>`;
        document.getElementById('again').onclick = () => {
          Store.grade(id, false);
          if (!retry.has(id)) { retry.add(id); session.push(id); }
          k++; show();
        };
        document.getElementById('gotit').onclick = (ev) => {
          if (!retry.has(id)) { Store.grade(id, true); got++; }
          celebrate(ev.currentTarget);
          setTimeout(() => { k++; show(); }, 380);
        };
      };
    };
    show();
  }
  // ---------- READ (kept for later; unlinked while FEATURES.read is false) ----------
  function viewRead() {
    topbar('Read · よむ', '#/');
    $app.innerHTML = `
      <p class="lede">${esc(READ.intro)}</p>
      <div class="units">
        ${READ.lessons.map((l) => l.open
          ? `<a class="unit-card" href="#/read/${l.id}"><span class="unit-num ${Store.state.read[l.id] ? 'ok' : ''}">${Store.state.read[l.id] ? ICON.check : 'あ'}</span>
              <div class="unit-body"><div class="unit-title">${esc(l.title)}</div><div class="unit-sub">${esc(l.script)} · ${l.kana.length} characters</div></div></a>`
          : `<div class="unit-card locked"><span class="unit-num">${ICON.lock}</span>
              <div class="unit-body"><div class="unit-title">${esc(l.title)}</div><div class="unit-sub">${esc(l.script)} · coming soon</div></div></div>`).join('')}
      </div>`;
  }

  function viewReadLesson(l) {
    topbar(esc(l.title), '#/read');
    Store.markRead(l.id);
    $app.innerHTML = `
      <p class="lede">Tap a character to hear it. Each one is a single sound, and they never change.</p>
      <div class="kana-grid">
        ${l.kana.map((k) => `<button class="kana" data-say="${esc(k.char)}"><span class="jp kana-char" lang="ja">${esc(k.char)}</span><span class="kana-romaji">${esc(k.romaji)}</span></button>`).join('')}
      </div>
      <div class="kana-list">
        ${l.kana.map((k) => `<article class="card kana-card">
          <div class="kana-row"><span class="jp kana-char-lg" lang="ja">${esc(k.char)}</span>
            <div><p class="note">${esc(k.hint)}</p>
            <p><span class="jp" lang="ja">${esc(k.word)}</span> <span class="muted">${esc(k.wordRomaji)} · ${esc(k.wordEn)}</span>
            <button class="mini" data-say="${esc(k.word)}" aria-label="Play word">${ICON.play}</button></p></div></div>
        </article>`).join('')}
      </div>
      <a class="btn primary wide" href="#/read">Done</a>`;
  }

  // ---------- router ----------
  function render() {
    Speech.stop && Speech.stop();
    if (window.Speech && Speech.stopSpeak) Speech.stopSpeak(); else if (window.speechSynthesis) speechSynthesis.cancel();
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
    try {
      if (!parts.length) viewHome();
      else if (parts[0] === 'today') {
        if (!parts[1]) viewTodayGate();
        else if (parts[1] === 'warm') viewTodayWarm();
        else if (parts[1] === 'new') viewTodayNew();
        else if (parts[1] === 'convo') viewTodayConvo();
        else if (parts[1] === 'listen') viewTodayListen();
        else if (parts[1] === 'done') viewTodayDone();
        else go('#/today');
      } else if (parts[0] === 'unit' && unitById(parts[1])) {
        const u = unitById(parts[1]);
        if (parts[2] === 'cards') viewCards(u, parseInt(parts[3] || '0', 10));
        else if (parts[2] === 'listen') viewListen(u);
        else if (parts[2] === 'roleplay') viewRoleplay(u);
        else if (parts[2] === 'quiz') viewQuiz(u);
        else viewUnit(u);
      } else if (parts[0] === 'review') viewReview();
      else if (parts[0] === 'settings') viewSettings();
      else if (FEATURES.read && READ && parts[0] === 'read' && parts[1]) {
        const l = READ.lessons.find((x) => x.id === parts[1] && x.open);
        l ? viewReadLesson(l) : go('#/read');
      } else if (FEATURES.read && READ && parts[0] === 'read') viewRead();
      else go('#/');
    } catch (err) {
      console.error(err);
      $app.innerHTML = `<p class="muted">Something went wrong. <a href="#/">Go home</a></p>`;
    }
    window.scrollTo(0, 0);
  }

  function migrateCurriculum() {
    // Align unlocked index with the first not-yet-seen phrase on the interleaved path.
    const path = curriculumPath();
    let i = 0;
    while (i < path.length && Store.state.seen[path[i].id]) i++;
    // Never shrink progress mid-day after new phrases were already counted.
    const cur = Store.state.curriculum.unlocked || 0;
    if (i > cur) {
      Store.state.curriculum.unlocked = i;
      Store.save();
    }
  }

  async function boot() {
    try {
      SPEAK = await fetch('./data/speak.json').then((x) => x.json());
      if (FEATURES.read) READ = await fetch('./data/read.json').then((x) => x.json()).catch(() => null);
    } catch (e) {
      $app.innerHTML = '<p class="muted">Couldn’t load lessons. If you opened the file directly, serve the folder instead (python3 -m http.server).</p>';
      return;
    }
    SPEAK.units.forEach((u) => u.phrases.forEach((p) => { phraseIndex[pid(u, p)] = { phrase: p, unit: u, id: pid(u, p) }; }));
    migrateCurriculum();
    Store.ensureDaily();
    window.addEventListener('hashchange', render);
    render();
  }
  boot();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
