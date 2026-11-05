
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
