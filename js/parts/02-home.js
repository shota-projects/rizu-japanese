
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
    if (h < 11) return ['おはよう、エリズ', 'Good morning, Eliz'];
    if (h < 18) return ['こんにちは、エリズ', 'Hello, Eliz'];
    return ['こんばんは、エリズ', 'Good evening, Eliz'];
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
