
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
