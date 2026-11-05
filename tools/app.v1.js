// UI: hash router + views. Content lives in /data/*.json.
(function () {
  const $app = document.getElementById('app');
  const $top = document.getElementById('topbar');
  const $toast = document.getElementById('toast');
  let SPEAK = null, READ = null;
  const phraseIndex = {}; // id -> { phrase, unit }

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pid = (u, p) => `${u.id}:${p.jp}`;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const go = (h) => { location.hash = h; };

  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
    slow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="10.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
  };

  function toast(msg) {
    $toast.textContent = msg; $toast.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => $toast.classList.remove('show'), 2200);
  }

  function topbar(title, back) {
    $top.innerHTML = back
      ? `<a class="iconbtn" href="${back}" aria-label="Back">${ICON.back}</a><div class="topbar-title">${title}</div><span class="streak-mini" title="Day streak">${Store.streak()}日</span>`
      : '';
    $top.classList.toggle('hidden', !back);
  }

  function audioButtons(text, extra = '') {
    return `<div class="audio-row ${extra}">
      <button class="pill" data-say="${esc(text)}" aria-label="Play">${ICON.play}<span>Play</span></button>
      <button class="pill ghost" data-say="${esc(text)}" data-slow="1" aria-label="Play slowly">${ICON.slow}<span>Slow</span></button>
    </div>`;
  }

  // Global delegated audio buttons.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (!b) return;
    if (!Speech.canSpeak) { toast('Audio isn’t available in this browser'); return; }
    b.classList.add('playing');
    Speech.speak(b.dataset.say, { slow: !!b.dataset.slow, fast: !!b.dataset.fast }).then(() => b.classList.remove('playing'));
  });

  // ---------- progress helpers ----------
  function unitStats(u) {
    const seen = u.phrases.filter((p) => Store.state.seen[pid(u, p)]).length;
    const us = Store.unit(u.id);
    const done = seen === u.phrases.length && us.roleplayDone && us.quizBest >= 70;
    return { seen, total: u.phrases.length, roleplay: us.roleplayDone, quiz: us.quizBest, done };
  }
  function speakStats() {
    let seen = 0, total = 0, done = 0;
    SPEAK.units.forEach((u) => { const s = unitStats(u); seen += s.seen; total += s.total; if (s.done) done++; });
    return { seen, total, done, units: SPEAK.units.length };
  }

  // ---------- HOME ----------
  function greeting() {
    const h = new Date().getHours();
    if (h < 11) return ['おはよう、エリズ', 'Good morning, Eliz'];
    if (h < 18) return ['こんにちは、エリズ', 'Hello, Eliz'];
    return ['こんばんは、エリズ', 'Good evening, Eliz'];
  }

  function viewHome() {
    topbar('', null);
    const st = speakStats();
    const due = Store.dueIds().length;
    const [gj, ge] = greeting();
    const streak = Store.streak();
    const readOpen = READ.lessons.filter((l) => l.open);
    const readDone = readOpen.filter((l) => Store.state.read[l.id]).length;
    const next = SPEAK.units.find((u) => !unitStats(u).done) || SPEAK.units[0];
    const pct = Math.round((st.seen / st.total) * 100);

    $app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">for Eliz</p>
        <h1 class="jp hero-jp">${gj}</h1>
        <p class="hero-en">${ge}. A little Japanese every day.</p>
        <div class="stats">
          <div class="stat"><span class="stat-num">${streak}</span><span class="stat-label">day streak</span></div>
          <div class="stat"><span class="stat-num">${st.seen}</span><span class="stat-label">phrases learned</span></div>
          <div class="stat"><span class="stat-num">${due}</span><span class="stat-label">to review</span></div>
        </div>
        <div class="cta-row">
          <a class="btn primary" href="#/unit/${next.id}"><span class="cta-main">${st.seen ? 'Continue' : 'Start'}</span><span class="cta-sub">${esc(next.title)}</span></a>
          <a class="btn ${due ? 'soft' : 'ghost'}" href="#/review" id="review-cta">${due ? `Review ${due}` : 'Review'}</a>
        </div>
      </section>

      <h2 class="section-title">Your path</h2>
      <ol class="path">
        <li class="stage open">
          <a href="#/speak" class="stage-card">
            <span class="stage-num">1</span>
            <div class="stage-body">
              <div class="stage-head"><span class="jp stage-jp">はなす</span><span class="stage-name">Speak</span><span class="tag ok">Open</span></div>
              <p>Survival conversation: greetings, ordering, directions, shopping, small talk.</p>
              <div class="bar"><span style="width:${pct}%"></span></div>
              <p class="meta">${st.done} of ${st.units} units complete · ${pct}% of phrases</p>
            </div>
          </a>
        </li>
        <li class="stage preview">
          <a href="#/read" class="stage-card">
            <span class="stage-num">2</span>
            <div class="stage-body">
              <div class="stage-head"><span class="jp stage-jp">よむ</span><span class="stage-name">Read</span><span class="tag">Preview</span></div>
              <p>Hiragana, then katakana. Try the first lesson: the five vowels.</p>
              <p class="meta">${readDone ? 'First lesson done' : '1 lesson open'}</p>
            </div>
          </a>
        </li>
        <li class="stage locked">
          <div class="stage-card" aria-disabled="true">
            <span class="stage-num">3</span>
            <div class="stage-body">
              <div class="stage-head"><span class="jp stage-jp">かく</span><span class="stage-name">Write</span><span class="tag muted">Coming soon</span></div>
              <p>Stroke order for kana, then your first kanji.</p>
            </div>
          </div>
        </li>
      </ol>
      <footer class="foot">
        <button class="linkbtn" id="reset">Reset progress</button>
      </footer>`;
    document.getElementById('reset').onclick = () => {
      if (confirm('Reset all progress on this device?')) { Store.reset(); render(); }
    };
  }

  // ---------- SPEAK: unit list ----------
  function viewSpeak() {
    topbar('Speak · はなす', '#/');
    $app.innerHTML = `
      <p class="lede">Six short units. Each one: phrase cards, a role-play, and a quick quiz. Go in order or jump around.</p>
      <div class="units">
        ${SPEAK.units.map((u, i) => {
          const s = unitStats(u);
          return `<a class="unit-card ${s.done ? 'done' : ''}" href="#/unit/${u.id}">
            <span class="unit-num">${s.done ? ICON.check : i + 1}</span>
            <div class="unit-body">
              <div class="unit-title">${esc(u.title)} <span class="jp unit-jp">${esc(u.jpTitle)}</span></div>
              <div class="unit-sub">${esc(u.summary)}</div>
              <div class="bar small"><span style="width:${Math.round((s.seen / s.total) * 100)}%"></span></div>
            </div>
          </a>`;
        }).join('')}
      </div>`;
  }

  // ---------- UNIT overview ----------
  function viewUnit(u) {
    topbar(esc(u.title), '#/speak');
    const s = unitStats(u);
    $app.innerHTML = `
      <section class="unit-hero">
        <p class="eyebrow jp">${esc(u.jpTitle)}</p>
        <h1>${esc(u.title)}</h1>
        <p class="lede">${esc(u.summary)}</p>
      </section>
      <div class="steps">
        <a class="step" href="#/unit/${u.id}/cards/0">
          <span class="step-num ${s.seen === s.total ? 'ok' : ''}">${s.seen === s.total ? ICON.check : '1'}</span>
          <div><div class="step-title">Phrase cards</div><div class="step-sub">${s.seen} of ${s.total} learned · listen and say each one</div></div>
        </a>
        <a class="step" href="#/unit/${u.id}/roleplay">
          <span class="step-num ${s.roleplay ? 'ok' : ''}">${s.roleplay ? ICON.check : '2'}</span>
          <div><div class="step-title">Role-play</div><div class="step-sub">${esc(u.roleplay.title)}</div></div>
        </a>
        <a class="step" href="#/unit/${u.id}/quiz">
          <span class="step-num ${s.quiz >= 70 ? 'ok' : ''}">${s.quiz >= 70 ? ICON.check : '3'}</span>
          <div><div class="step-title">Quick quiz</div><div class="step-sub">${s.quiz ? `Best score ${s.quiz}%` : '6 questions'}</div></div>
        </a>
      </div>`;
  }

  // ---------- PHRASE CARDS ----------
  function speakCheck(container, targets, onResult) {
    // Renders mic practice if recognition exists, otherwise self-rating.
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
          const label = score >= 80 ? ['great', 'すごい! Great'] : score >= 55 ? ['close', 'Close, nice'] : ['again', 'Let’s try again'];
          out.innerHTML = `<div class="score ${label[0]}"><span class="score-num">${score}%</span><span>${label[1]}</span></div><p class="heard">Heard: <span class="jp">${esc(heard)}</span></p>`;
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
      onResult && onResult(b.dataset.rate === '1', true);
    });
  }

  function phraseHTML(p, { big = true } = {}) {
    const hasKanji = p.kana && Speech.norm(p.kana) !== Speech.norm(p.jp);
    const len = [...p.jp].length;
    const size = len > 12 ? 'xlong' : len > 8 ? 'long' : '';
    return `<div class="phrase ${big ? 'big' : ''} ${size}">
      <div class="jp phrase-jp" lang="ja">${esc(p.jp)}</div>
      ${hasKanji ? `<div class="jp phrase-kana" lang="ja">${esc(p.kana)}</div>` : ''}
      <div class="phrase-romaji">${esc(p.romaji)}</div>
      <div class="phrase-en">${esc(p.en)}</div>
    </div>`;
  }

  function viewCards(u, i) {
    i = Math.max(0, Math.min(u.phrases.length - 1, i | 0));
    const p = u.phrases[i];
    const id = pid(u, p);
    Store.markSeen(id);
    topbar(esc(u.title), `#/unit/${u.id}`);
    const last = i === u.phrases.length - 1;
    $app.innerHTML = `
      <div class="progress-dots" aria-label="Card ${i + 1} of ${u.phrases.length}">
        ${u.phrases.map((_, k) => `<span class="${k < i ? 'past' : k === i ? 'now' : ''}"></span>`).join('')}
      </div>
      <article class="card" id="phrase-card">
        ${phraseHTML(p)}
        ${audioButtons(p.jp)}
        ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
        <div class="practice" id="practice"></div>
      </article>
      <div class="nav-row">
        <a class="btn ghost" href="#/unit/${u.id}/cards/${i - 1}" ${i === 0 ? 'aria-disabled="true" tabindex="-1"' : ''}>Back</a>
        <a class="btn primary" id="next" href="${last ? `#/unit/${u.id}/roleplay` : `#/unit/${u.id}/cards/${i + 1}`}">${last ? 'On to the role-play' : 'Next'}</a>
      </div>`;
    speakCheck(document.getElementById('practice'), [p.jp, p.kana].filter(Boolean), (ok, self) => {
      if (!ok) { Store.grade(id, false); if (self) Speech.speak(p.jp, { slow: true }); }
    });
    // Auto-play once when the card opens (may be blocked until the first tap on some phones).
    setTimeout(() => Speech.speak(p.jp), 250);
  }

  // ---------- ROLE-PLAY ----------
  function viewRoleplay(u) {
    topbar('Role-play', `#/unit/${u.id}`);
    const rp = u.roleplay;
    let step = 0, correct = 0, asked = 0;
    $app.innerHTML = `
      <section class="rp-head">
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
      el.innerHTML = `${who === 'them' ? `<div class="who">${esc(line.name || '')}</div>` : ''}
        <div class="jp" lang="ja">${esc(line.jp)}</div>
        <div class="bubble-romaji">${esc(line.romaji)}</div>
        <div class="bubble-en">${esc(line.en)}</div>
        <button class="mini" data-say="${esc(line.jp)}" ${line.fast ? 'data-fast="1"' : ''} aria-label="Play">${ICON.play}</button>
        <button class="mini" data-say="${esc(line.jp)}" data-slow="1" aria-label="Play slowly">${ICON.slow}</button>`;
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
        Speech.speak(line.jp, { fast: !!line.fast }).then(() => {});
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
          ${opts.map((o) => `<button class="option" data-jp="${esc(o.jp)}"><span class="jp" lang="ja">${esc(o.jp)}</span><span class="opt-romaji">${esc(o.romaji)}</span></button>`).join('')}
        </div>
        ${Speech.canListen ? `<button class="mic small" id="rp-mic">${ICON.mic}<span>Or say your reply</span></button><div class="result" id="rp-result"></div>` : ''}`;
      const choose = (jp) => {
        const ok = jp === right.jp;
        if (ok) correct++;
        reply.querySelectorAll('.option').forEach((b) => {
          b.disabled = true;
          if (b.dataset.jp === right.jp) b.classList.add('right');
          else if (b.dataset.jp === jp) b.classList.add('wrong');
        });
        const mic = document.getElementById('rp-mic'); if (mic) mic.disabled = true;
        const fb = document.createElement('div');
        fb.className = `feedback ${ok ? 'good' : 'bad'}`;
        fb.innerHTML = `<p><strong>${ok ? 'そうです! That’s it.' : 'Not quite. The natural reply is:'}</strong></p>
          ${ok ? '' : `<p class="jp" lang="ja">${esc(right.jp)}</p>`}
          <p class="muted">${esc(right.en)}</p>
          ${line.note ? `<p class="note">${esc(line.note)}</p>` : ''}
          <button class="btn primary" id="rp-next">Continue</button>`;
        reply.appendChild(fb);
        document.getElementById('rp-next').onclick = () => { bubble(right, 'you', ok ? '' : 'corrected'); reply.innerHTML = ''; setTimeout(nextLine, 300); };
        fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        Speech.speak(right.jp);
      };
      reply.querySelectorAll('.option').forEach((b) => b.onclick = () => choose(b.dataset.jp));
      const mic = document.getElementById('rp-mic');
      if (mic) mic.onclick = async () => {
        const out = document.getElementById('rp-result');
        mic.classList.add('listening');
        try {
          const alts = await Speech.listen();
          // Which option did she say?
          let best = null;
          line.options.forEach((o) => { const r = Speech.score(alts, [o.jp]); if (!best || r.score > best.score) best = { ...r, o }; });
          if (!alts.length || best.score < 45) { out.innerHTML = `<p class="muted">Heard “${esc(alts[0] || '…')}”. Try again or tap an answer.</p>`; return; }
          out.innerHTML = `<p class="muted">Heard “<span class="jp">${esc(best.heard)}</span>” (${best.score}% match)</p>`;
          choose(best.o.jp);
        } catch (e) {
          out.innerHTML = '<p class="muted">Mic isn’t available. Tap an answer instead.</p>';
        } finally { mic.classList.remove('listening'); }
      };
      reply.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function finish() {
      Store.setUnit(u.id, { roleplayDone: true });
      reply.innerHTML = `<div class="done-card">
        <p class="jp big-jp">おつかれさま！</p>
        <p>Nice work. You chose the natural reply ${correct} of ${asked} times.</p>
        <div class="nav-row">
          <button class="btn ghost" id="rp-again">Play again</button>
          <a class="btn primary" href="#/unit/${u.id}/quiz">Take the quiz</a>
        </div></div>`;
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
      const all = shuffle([p, ...distract]);
      return { type, p, all };
    });
  }

  function viewQuiz(u) {
    topbar('Quick quiz', `#/unit/${u.id}`);
    const qs = buildQuiz(u);
    let k = 0, score = 0;
    const show = () => {
      if (k >= qs.length) return end();
      const q = qs[k];
      const head = q.type === 'en2jp'
        ? `<p class="q-label">How do you say…</p><p class="q-main">${esc(q.p.en)}</p>`
        : q.type === 'jp2en'
          ? `<p class="q-label">What does this mean?</p><p class="q-main jp" lang="ja">${esc(q.p.jp)}</p><p class="q-sub">${esc(q.p.romaji)}</p>`
          : `<p class="q-label">Listen. What did you hear?</p>${audioButtons(q.p.jp, 'center')}`;
      $app.innerHTML = `
        <div class="quiz-top"><span>Question ${k + 1} of ${qs.length}</span><div class="bar small"><span style="width:${(k / qs.length) * 100}%"></span></div></div>
        <article class="card quiz-card">${head}</article>
        <div class="options" id="opts">
          ${q.all.map((o, i) => `<button class="option" data-i="${i}">${q.type === 'en2jp'
            ? `<span class="jp" lang="ja">${esc(o.jp)}</span><span class="opt-romaji">${esc(o.romaji)}</span>`
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
        document.getElementById('qfb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">
          <p><strong>${ok ? 'Correct!' : 'Not this time.'}</strong></p>
          ${phraseHTML(q.p, { big: false })}
          <button class="btn primary" id="qnext">${k === qs.length - 1 ? 'See results' : 'Next'}</button></div>`;
        if (q.type !== 'listen') Speech.speak(q.p.jp);
        document.getElementById('qnext').onclick = () => { k++; show(); };
        document.getElementById('qfb').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    };
    const end = () => {
      const pct = Math.round((score / qs.length) * 100);
      const prev = Store.unit(u.id).quizBest;
      Store.setUnit(u.id, { quizBest: Math.max(prev, pct) });
      $app.innerHTML = `<div class="done-card">
        <p class="jp big-jp">${pct >= 70 ? 'よくできました！' : 'もう一回！'}</p>
        <p class="score-big">${score} / ${qs.length}</p>
        <p class="muted">${pct >= 70 ? 'Unit complete. Missed phrases were added to your review queue.' : 'Score 70% or more to complete the unit. Missed phrases were added to your review queue.'}</p>
        <div class="nav-row">
          <button class="btn ghost" id="qagain">Try again</button>
          <a class="btn primary" href="${pct >= 70 ? '#/speak' : `#/unit/${u.id}/cards/0`}">${pct >= 70 ? 'Back to units' : 'Review the cards'}</a>
        </div></div>`;
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
        <p class="jp big-jp">${total ? 'ばっちり！' : 'まだです'}</p>
        <p>${total ? 'Nothing to review right now. Come back tomorrow.' : 'Learn a few phrases first and they’ll show up here.'}</p>
        ${boxBar}
        <p class="muted small">Phrases move up a box each time you get them right, and come back less often: same day, 1, 3, 7, then 16 days.</p>
        <a class="btn primary" href="#/speak">Learn phrases</a></div>`;
      return;
    }
    const session = queue.slice(0, 20);
    const retry = new Set();
    let k = 0, got = 0;
    const show = () => {
      if (k >= session.length) {
        $app.innerHTML = `<div class="done-card"><p class="jp big-jp">おつかれさま！</p>
          <p>You reviewed ${session.length - retry.size} card${session.length - retry.size > 1 ? 's' : ''} and got ${got} on the first try.</p>${boxBarHTML()}
          <a class="btn primary" href="#/">Home</a></div>`;
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
          <div id="answer" class="answer hidden">${phraseHTML(p, { big: false })}${audioButtons(p.jp, 'center')}</div>
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
        document.getElementById('gotit').onclick = () => {
          if (!retry.has(id)) { Store.grade(id, true); got++; }
          k++; show();
        };
      };
    };
    show();
  }
  // ---------- READ (preview) ----------
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
    if (window.speechSynthesis) speechSynthesis.cancel();
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
    const unit = (id) => SPEAK.units.find((u) => u.id === id);
    try {
      if (!parts.length) viewHome();
      else if (parts[0] === 'speak') viewSpeak();
      else if (parts[0] === 'unit' && unit(parts[1])) {
        const u = unit(parts[1]);
        if (parts[2] === 'cards') viewCards(u, parseInt(parts[3] || '0', 10));
        else if (parts[2] === 'roleplay') viewRoleplay(u);
        else if (parts[2] === 'quiz') viewQuiz(u);
        else viewUnit(u);
      } else if (parts[0] === 'review') viewReview();
      else if (parts[0] === 'read' && parts[1]) {
        const l = READ.lessons.find((x) => x.id === parts[1] && x.open);
        l ? viewReadLesson(l) : go('#/read');
      } else if (parts[0] === 'read') viewRead();
      else go('#/');
    } catch (err) {
      console.error(err);
      $app.innerHTML = `<p class="muted">Something went wrong. <a href="#/">Go home</a></p>`;
    }
    window.scrollTo(0, 0);
  }

  async function boot() {
    try {
      const [s, r] = await Promise.all([fetch('./data/speak.json').then((x) => x.json()), fetch('./data/read.json').then((x) => x.json())]);
      SPEAK = s; READ = r;
    } catch (e) {
      $app.innerHTML = '<p class="muted">Couldn’t load lessons. If you opened the file directly, serve the folder instead (python3 -m http.server).</p>';
      return;
    }
    SPEAK.units.forEach((u) => u.phrases.forEach((p) => { phraseIndex[pid(u, p)] = { phrase: p, unit: u }; }));
    window.addEventListener('hashchange', render);
    render();
  }
  boot();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
