// Phrase audio (pre-generated MP3) + speechSynthesis fallback + speech recognition.
// iOS/WebKit: HTMLAudioElement.play() and speechSynthesis.speak() must start inside a
// user gesture; we unlock a shared Audio element on first pointerdown and reuse it.
(function () {
  const synth = window.speechSynthesis;
  let voice = null;
  let heldUtter = null; // keep utterance reachable until onend (iOS GC bug)
  let unlocked = false;
  let manifest = null; // { byText: { [jp]: { src, voice, gender, hash } } }
  let manifestPromise = null;

  // Shared player — unlocked once, then reusable outside gestures on iOS.
  const player = new Audio();
  player.preload = 'auto';

  // ~0.05s silent WAV (mono) for unlock without audible click.
  const SILENT =
    'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';

  function loadManifest() {
    if (manifestPromise) return manifestPromise;
    manifestPromise = fetch('./data/audio-manifest.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => { manifest = m; return m; })
      .catch(() => null);
    return manifestPromise;
  }
  loadManifest();

  function pickVoice() {
    if (!synth) return null;
    const vs = synth.getVoices().filter((v) => /^ja(-|_|$)/i.test(v.lang));
    const pref = [/google/i, /kyoko|o-ren|otoya|hattori|nanami|kyoko/i, /natural|premium|enhanced/i];
    for (const re of pref) { const v = vs.find((x) => re.test(x.name)); if (v) return v; }
    return vs[0] || null;
  }
  if (synth) {
    voice = pickVoice(); // may be empty on iOS until voiceschanged — don't block speak
    synth.addEventListener && synth.addEventListener('voiceschanged', () => { voice = pickVoice(); });
  }

  // Separate element so unlock never races with phrase playback on `player`.
  const unlockPlayer = new Audio();

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      unlockPlayer.muted = true;
      unlockPlayer.src = SILENT;
      const p = unlockPlayer.play();
      if (p && p.then) p.catch(() => {});
    } catch (e) {}
    // Warm speechSynthesis too (empty utter) in case we fall back.
    if (synth) {
      try {
        synth.cancel();
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0; u.rate = 1; u.lang = 'ja-JP';
        heldUtter = u;
        synth.speak(u);
        setTimeout(() => { try { synth.cancel(); } catch (e) {} }, 30);
      } catch (e) {}
    }
  }

  function onFirstGesture() {
    unlock();
    document.removeEventListener('pointerdown', onFirstGesture, true);
    document.removeEventListener('touchstart', onFirstGesture, true);
    document.removeEventListener('click', onFirstGesture, true);
  }
  document.addEventListener('pointerdown', onFirstGesture, true);
  document.addEventListener('touchstart', onFirstGesture, true);
  document.addEventListener('click', onFirstGesture, true);

  function entryFor(text) {
    if (!manifest || !manifest.byText) return null;
    return manifest.byText[text] || null;
  }

  function speakFile(src, { slow = false, fast = false } = {}) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (ok) => { if (!settled) { settled = true; resolve(ok); } };
      try {
        unlock();
        player.onended = () => done(true);
        player.onerror = () => done(false);
        player.pause();
        try { player.currentTime = 0; } catch (e) {}
        player.volume = 1;
        player.muted = false;
        player.playbackRate = slow ? 0.75 : fast ? 1.15 : 1;
        // Absolute URL so SW cache-on-play + relative pages base both work.
        player.src = new URL(src, document.baseURI || location.href).href;
        const pr = player.play(); // must stay sync with caller gesture when possible
        if (pr && pr.then) pr.catch(() => done(false));
        setTimeout(() => done(false), 20000);
      } catch (e) { done(false); }
    });
  }

  function speakTTS(text, { slow = false, fast = false } = {}) {
    return new Promise((resolve) => {
      if (!synth || !text) return resolve(false);
      let settled = false;
      const done = (ok) => {
        if (!settled) { settled = true; if (heldUtter) heldUtter = null; resolve(ok); }
      };
      try {
        unlock();
        try { if (synth.paused) synth.resume(); } catch (e) {}
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        heldUtter = u; // prevent GC before speaking finishes
        u.lang = 'ja-JP';
        const v = voice || pickVoice();
        if (v) u.voice = v; // only set if already loaded — don't await voiceschanged
        u.rate = slow ? 0.6 : fast ? 1.15 : 0.9;
        u.volume = 1;
        u.onend = () => done(true);
        u.onerror = () => done(false);
        synth.speak(u); // sync in tap handler path
        try { synth.resume(); } catch (e) {}
        setTimeout(() => done(false), 12000);
      } catch (e) { done(false); }
    });
  }

  // IMPORTANT (iOS): do not await anything before player.play() / synth.speak().
  // Manifest is fetched on boot; if it is not ready yet, fall back to TTS immediately.
  function speak(text, opts = {}) {
    if (!text) return Promise.resolve(false);
    unlock();
    const entry = entryFor(text);
    if (entry && entry.src) {
      return speakFile(entry.src, opts).then((ok) => (ok ? true : speakTTS(text, opts)));
    }
    if (!manifest) loadManifest(); // warm for next tap; do not block this one
    return speakTTS(text, opts);
  }

  function stopSpeak() {
    try { player.pause(); } catch (e) {}
    if (synth) try { synth.cancel(); } catch (e) {}
  }

  // ---- recognition (unchanged) ----
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let active = null;

  function listen() {
    return new Promise((resolve, reject) => {
      if (!Rec) return reject(new Error('unsupported'));
      if (active) { try { active.abort(); } catch (e) {} }
      stopSpeak();
      const r = new Rec();
      active = r;
      r.lang = 'ja-JP';
      r.interimResults = false;
      r.maxAlternatives = 5;
      let done = false;
      r.onresult = (ev) => {
        done = true;
        const alts = [];
        for (const res of ev.results) for (const a of res) alts.push(a.transcript);
        resolve(alts);
      };
      r.onerror = (ev) => { if (!done) { done = true; reject(new Error(ev.error || 'error')); } };
      r.onend = () => { active = null; if (!done) { done = true; resolve([]); } };
      try { r.start(); } catch (e) { reject(e); }
    });
  }
  function stop() { if (active) try { active.stop(); } catch (e) {} }

  const toHira = (s) => s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const norm = (s) => toHira((s || '').normalize('NFKC').toLowerCase())
    .replace(/[\s、。！？!?,.・「」『』（）()〜~ー-]/g, '');

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const sim = (a, b) => { a = norm(a); b = norm(b); if (!a || !b) return 0; return 1 - lev(a, b) / Math.max(a.length, b.length); };

  function score(heard, targets) {
    let best = 0, bestHeard = heard[0] || '';
    for (const h of heard) for (const t of targets) {
      let s = sim(h, t);
      if (norm(h).includes(norm(t)) && norm(t).length >= 2) s = Math.max(s, 0.95);
      if (s > best) { best = s; bestHeard = h; }
    }
    return { score: Math.round(best * 100), heard: bestHeard };
  }

  window.Speech = {
    // Files make speak available even when speechSynthesis is missing/broken.
    get canSpeak() { return true; },
    get hasVoice() { return !!(manifest || (synth && (voice || pickVoice()))); },
    get unlocked() { return unlocked; },
    canListen: !!Rec,
    unlock, speak, stopSpeak, listen, stop, score, norm,
    audioSrc(text) { const e = entryFor(text); return e ? e.src : null; },
    // Test/debug: current shared HTMLAudioElement src (absolute).
    playerSrc() { return player.currentSrc || player.src || ''; }
  };
})();
