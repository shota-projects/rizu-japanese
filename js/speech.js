// Text-to-speech (speechSynthesis) and speech recognition (webkitSpeechRecognition), ja-JP.
(function () {
  const synth = window.speechSynthesis;
  let voice = null;

  function pickVoice() {
    if (!synth) return null;
    const vs = synth.getVoices().filter((v) => /^ja(-|_|$)/i.test(v.lang));
    // Prefer higher-quality voices when the device has them.
    const pref = [/google/i, /kyoko|o-ren|otoya|hattori/i, /natural|premium|enhanced/i];
    for (const re of pref) { const v = vs.find((x) => re.test(x.name)); if (v) return v; }
    return vs[0] || null;
  }
  if (synth) {
    voice = pickVoice();
    synth.addEventListener && synth.addEventListener('voiceschanged', () => { voice = pickVoice(); });
  }

  function speak(text, { slow = false, fast = false } = {}) {
    return new Promise((resolve) => {
      if (!synth || !text) return resolve(false);
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      if (voice) u.voice = voice;
      u.rate = slow ? 0.6 : fast ? 1.15 : 0.95;
      u.onend = () => resolve(true);
      u.onerror = () => resolve(false);
      synth.speak(u);
      setTimeout(() => resolve(false), 12000); // never hang the UI
    });
  }

  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let active = null;

  function listen() {
    return new Promise((resolve, reject) => {
      if (!Rec) return reject(new Error('unsupported'));
      if (active) { try { active.abort(); } catch (e) {} }
      if (synth) synth.cancel();
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

  // ---- forgiving match ----
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

  // Score 0..100: best similarity between any recognizer alternative and any accepted target.
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
    get canSpeak() { return !!synth; },
    get hasVoice() { return !!voice; },
    canListen: !!Rec,
    speak, listen, stop, score, norm
  };
})();
