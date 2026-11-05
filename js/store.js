// Progress storage (localStorage) + Leitner spaced repetition + streak + daily curriculum.
(function () {
  const KEY = 'eliz-jp-v1';
  // Days until the next review for each Leitner box (box 1 = due right away).
  const INTERVAL_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };
  const DAY = 86400000;

  const DEFAULT_SETTINGS = { showKana: true, romaji: 'show', dailyNew: 3 }; // dailyNew: 3 | 5 | 7
  const blank = () => ({
    seen: {}, srs: {}, units: {}, read: {}, days: [],
    settings: { ...DEFAULT_SETTINGS },
    curriculum: { unlocked: 0 }, // how many phrases unlocked along the interleaved path
    daily: null, // { date, warmDone, newIds, newDone, convoDone, listenDone, done }
    lastBackupAt: 0
  });
  let state;
  try { state = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch (e) { state = blank(); }
  // Graceful migration from earlier builds.
  state.settings = Object.assign({ ...DEFAULT_SETTINGS }, state.settings || {});
  if (![3, 5, 7].includes(state.settings.dailyNew)) state.settings.dailyNew = 3;
  if (!state.curriculum || typeof state.curriculum.unlocked !== 'number') {
    // Seed unlocked from already-seen phrases so returning users don't restart at zero.
    const seenN = Object.keys(state.seen || {}).length;
    state.curriculum = { unlocked: seenN };
  }
  if (!('days' in state) || !Array.isArray(state.days)) state.days = [];
  if (!state.units) state.units = {};
  if (!state.srs) state.srs = {};
  if (!state.seen) state.seen = {};
  if (!state.read) state.read = {};
  if (typeof state.lastBackupAt !== 'number') state.lastBackupAt = 0;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
  const today = (d = new Date()) => {
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  };

  function touchDay() {
    const t = today();
    if (!state.days.includes(t)) { state.days.push(t); state.days = state.days.slice(-400); save(); }
  }

  function streak() {
    const set = new Set(state.days);
    const d = new Date();
    if (!set.has(today(d))) d.setDate(d.getDate() - 1); // streak survives until the end of today
    let n = 0;
    while (set.has(today(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function markSeen(id) {
    touchDay();
    if (!state.seen[id]) state.seen[id] = Date.now();
    if (!state.srs[id]) state.srs[id] = { box: 1, due: Date.now() };
    save();
  }

  function grade(id, ok) {
    touchDay();
    const s = state.srs[id] || { box: 1, due: 0 };
    s.box = ok ? Math.min(5, s.box + 1) : 1;
    s.due = Date.now() + INTERVAL_DAYS[s.box] * DAY;
    state.srs[id] = s;
    save();
  }

  function dueIds(now = Date.now()) {
    return Object.keys(state.srs).filter((id) => state.srs[id].due <= now)
      .sort((a, b) => state.srs[a].box - state.srs[b].box || state.srs[a].due - state.srs[b].due);
  }

  function unit(id) { return state.units[id] || (state.units[id] = { quizBest: 0, roleplayDone: false, listenDone: false }); }
  function setUnit(id, patch) { touchDay(); Object.assign(unit(id), patch); save(); }
  function markRead(id) { touchDay(); state.read[id] = true; save(); }

  function setting(k, v) { if (v === undefined) return state.settings[k]; state.settings[k] = v; save(); }
  function box(id) { return (state.srs[id] && state.srs[id].box) || 0; }
  function reset() { const keep = state.settings; state = blank(); state.settings = keep; save(); }

  /** Ensure today's daily record exists (missing days = no penalty; just a fresh session). */
  function ensureDaily() {
    const t = today();
    if (!state.daily || state.daily.date !== t) {
      state.daily = { date: t, warmDone: false, newIds: [], newDone: false, convoDone: false, listenDone: false, done: false };
      save();
    }
    return state.daily;
  }

  function setDaily(patch) {
    const d = ensureDaily();
    Object.assign(d, patch);
    save();
    return d;
  }

  function unlockMore(n) {
    state.curriculum.unlocked = (state.curriculum.unlocked || 0) + n;
    save();
  }


  // ---------- Progress backup (EJP1. codes) ----------
  const BACKUP_PREFIX = 'EJP1.';
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function bytesToB64Url(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64UrlToBytes(s) {
    const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  async function deflateOrRaw(utf8) {
    // Flag byte: 1 = deflate, 0 = raw utf8. Prefer CompressionStream when available.
    if (typeof CompressionStream === 'function') {
      try {
        const cs = new CompressionStream('deflate');
        const w = cs.writable.getWriter();
        w.write(utf8);
        w.close();
        const compressed = new Uint8Array(await new Response(cs.readable).arrayBuffer());
        const out = new Uint8Array(1 + compressed.length);
        out[0] = 1;
        out.set(compressed, 1);
        return out;
      } catch (e) { /* fall through */ }
    }
    const out = new Uint8Array(1 + utf8.length);
    out[0] = 0;
    out.set(utf8, 1);
    return out;
  }
  async function inflateOrRaw(bytes) {
    if (!bytes.length) throw new Error('empty');
    const flag = bytes[0];
    const body = bytes.subarray(1);
    if (flag === 0) return body;
    if (flag === 1) {
      if (typeof DecompressionStream !== 'function') throw new Error('This browser can’t read compressed backups');
      const ds = new DecompressionStream('deflate');
      const w = ds.writable.getWriter();
      w.write(body);
      w.close();
      return new Uint8Array(await new Response(ds.readable).arrayBuffer());
    }
    throw new Error('Unknown backup format');
  }
  function looksLikeState(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
    // Accept any plausible Eliz progress snapshot (settings and/or learning maps).
    const hasMaps = ['seen', 'srs', 'units', 'read', 'days', 'settings', 'curriculum', 'daily']
      .some((k) => k in o);
    return hasMaps;
  }
  function applyState(data) {
    state = Object.assign(blank(), data);
    state.settings = Object.assign({ ...DEFAULT_SETTINGS }, state.settings || {});
    if (![3, 5, 7].includes(state.settings.dailyNew)) state.settings.dailyNew = 3;
    if (!state.curriculum || typeof state.curriculum.unlocked !== 'number') {
      state.curriculum = { unlocked: Object.keys(state.seen || {}).length };
    }
    if (!Array.isArray(state.days)) state.days = [];
    if (!state.units) state.units = {};
    if (!state.srs) state.srs = {};
    if (!state.seen) state.seen = {};
    if (!state.read) state.read = {};
    if (typeof state.lastBackupAt !== 'number') state.lastBackupAt = 0;
    save();
  }

  async function exportBackup() {
    const utf8 = enc.encode(JSON.stringify(state));
    const packed = await deflateOrRaw(utf8);
    return BACKUP_PREFIX + bytesToB64Url(packed);
  }

  async function parseBackup(code) {
    const cleaned = String(code || '').trim().replace(/\s+/g, '');
    if (!cleaned.startsWith(BACKUP_PREFIX)) {
      throw new Error('That doesn’t look like a backup code. It should start with EJP1.');
    }
    let jsonBytes;
    try {
      jsonBytes = await inflateOrRaw(b64UrlToBytes(cleaned.slice(BACKUP_PREFIX.length)));
    } catch (e) {
      throw new Error('Couldn’t read that code. Double-check you copied the whole thing.');
    }
    let data;
    try {
      data = JSON.parse(dec.decode(jsonBytes));
    } catch (e) {
      throw new Error('That code isn’t valid. Try copying it again.');
    }
    if (!looksLikeState(data)) {
      throw new Error('That code doesn’t have progress data in it.');
    }
    return data;
  }

  async function importBackup(code) {
    const data = await parseBackup(code);
    applyState(data);
    state.lastBackupAt = Date.now();
    save();
    return state;
  }

  function markBackup() {
    state.lastBackupAt = Date.now();
    save();
  }

  function needsBackupReminder(days = 7) {
    const t = state.lastBackupAt || 0;
    if (!t) return true;
    return (Date.now() - t) >= days * DAY;
  }

  window.Store = {
    get state() { return state; },
    save, touchDay, streak, markSeen, grade, dueIds, unit, setUnit, markRead, reset, setting, box,
    INTERVAL_DAYS, today, ensureDaily, setDaily, unlockMore,
    exportBackup, parseBackup, importBackup, markBackup, needsBackupReminder,
    BACKUP_PREFIX
  };
})();

