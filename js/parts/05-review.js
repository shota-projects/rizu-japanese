
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
