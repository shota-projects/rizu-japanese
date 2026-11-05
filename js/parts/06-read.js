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
