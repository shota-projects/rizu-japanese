
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
