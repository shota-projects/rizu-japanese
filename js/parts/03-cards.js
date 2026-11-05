
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
