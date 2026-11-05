// Headless smoke test + 390x844 screenshots. Run from a folder with playwright installed:
//   NODE_PATH=/workspace/pwtest/node_modules node /workspace/eliz-japanese/tests/smoke.playwright.js
const { chromium } = require('playwright');
const fs = require('fs');
const ROOT = '/workspace/eliz-japanese/';
const speak = JSON.parse(fs.readFileSync(ROOT + 'data/speak.json'));
const BASE = 'http://localhost:8765/';
const SS = ROOT + 'screenshots/';
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); };

(async () => {
  fs.mkdirSync(SS, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errors = [];
  const mk = async (label, opts = {}) => {
    const ctx = await browser.newContext(opts.desktop
      ? { viewport: { width: 1280, height: 860 } }
      : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    if (opts.noRec) await ctx.addInitScript(() => { delete window.webkitSpeechRecognition; delete window.SpeechRecognition; });
    // Fresh progress unless opts.keepStorage
    if (!opts.keepStorage) {
      await ctx.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
    }
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${label}] console: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`[${label}] pageerror: ${e.message}`));
    page.on('requestfailed', (r) => { if (!/fonts\.g/.test(r.url())) errors.push(`[${label}] requestfailed: ${r.url()}`); });
    return { ctx, page };
  };
  const settle = (page, ms = 450) => page.waitForTimeout(ms);
  const shot = async (page, n, full) => { await settle(page); await page.screenshot({ path: SS + n, fullPage: !!full }); console.log('  shot', n); };

  // ---------- main mobile: home + daily flow ----------
  {
    const { ctx, page } = await mk('mobile', { noRec: true });
    await page.goto(BASE); await page.waitForSelector('.hero');
    await page.evaluate(() => document.fonts.ready);

    assert(await page.$('#start-cta'), 'today CTA');
    assert(await page.$('.heatmap'), 'heatmap');
    assert(await page.$('#free-practice'), 'free practice');
    const bodyText = await page.textContent('#app');
    assert(/Today|today/.test(bodyText) || /lesson/i.test(bodyText), 'daily lesson copy');
    assert(!/\b(Read|Write|Stage)\b/.test(bodyText), 'no Read/Write/Stage');
    assert(!/Kuromi|Sanrio/i.test(bodyText), 'no Kuromi/Sanrio branding');
    assert(await page.$eval('.hero-mascot', (i) => i.complete && i.naturalWidth > 0), 'mascot');
    // Family first unit is reuniting, not first-meeting
    assert(speak.units[0].title === 'Seeing them again', 'family unit retitled');
    assert(!speak.units[0].phrases.some((p) => p.jp === 'はじめまして'), 'no hajimemashite in first unit');
    await shot(page, '01-home.png');
    await shot(page, '01b-home-full.png', true);

    // Open free practice
    await page.click('#free-practice > summary');
    await page.waitForSelector('#track-family');
    assert((await page.$$('#track-family .unit-card')).length === 7, 'family units');
    assert((await page.$$('#track-around .unit-card')).length === 5, 'around units');
    await shot(page, '09-free-practice.png', true);

    // Settings: daily new count (default 3 on fresh install)
    await page.click('a[href="#/settings"]');
    await page.waitForSelector('[data-dn]');
    assert((await page.$$('[data-dn]')).length === 3, 'dailyNew 3/5/7');
    const defDn = await page.evaluate(() => JSON.parse(localStorage.getItem('eliz-jp-v1')).settings.dailyNew);
    assert(defDn === 3, 'default dailyNew is 3');
    assert(await page.$eval('[data-dn="3"]', (el) => el.getAttribute('aria-checked') === 'true'), '3 selected by default');
    await page.click('[data-dn="5"]');
    await page.click('[data-dn="3"]');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('eliz-jp-v1')).settings.dailyNew);
    assert(saved === 3, 'dailyNew persisted');
    assert(await page.$('#backup-section'), 'backup section');
    assert(/Back up my progress/.test(await page.textContent('#backup-section')), 'backup title');
    assert(/Progress is saved on this phone/.test(await page.textContent('#backup-section')), 'backup note');
    await shot(page, '07-settings.png');
    // Scroll backup into view for dedicated shot
    await page.$eval('#backup-section', (el) => el.scrollIntoView({ block: 'start' }));
    await settle(page, 300);
    await shot(page, '15-backup.png');
    await page.click('a[aria-label="Back"]');
    await page.waitForSelector('#start-cta');

    // Start today's lesson — warm-up (nothing due on fresh install)
    const streakBefore = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('eliz-jp-v1') || '{}');
      return (s.days || []).length;
    });
    await page.click('#start-cta');
    await page.waitForURL(/#\/today\/warm/);
    await page.waitForSelector('.done-card, #phrase-card, .daily-steps');
    await shot(page, '10-daily-warmup.png');
    // Skip empty warm-up
    if (await page.$('a[href="#/today/new"]')) await page.click('a[href="#/today/new"]');
    else if (await page.$('#warm-next')) {
      // rated path — shouldn't happen with empty due, but be safe
      const rate = await page.$('[data-rate="1"]'); if (rate) await rate.click();
      await page.click('#warm-next');
    }
    await page.waitForURL(/#\/today\/new/);
    await page.waitForSelector('#phrase-card');
    await shot(page, '11-daily-new.png');

    // Complete 3 new phrases (dailyNew=3)
    for (let i = 0; i < 3; i++) {
      await page.waitForSelector('#phrase-card');
      const rate = await page.$('[data-rate="1"]'); if (rate) await rate.click();
      await page.click('#new-next');
      await page.waitForTimeout(80);
    }
    await page.waitForSelector('a[href="#/today/convo"]');
    await page.click('a[href="#/today/convo"]');
    await page.waitForURL(/#\/today\/convo/);
    await page.waitForSelector('.chat, .rp-head');
    await shot(page, '12-daily-convo.png');

    // Finish mini convo by answering every you-turn
    for (let guard = 0; guard < 20; guard++) {
      if (await page.$('a[href="#/today/listen"]')) break;
      const opt = await page.$('.reply .option:not([disabled])');
      if (opt) { await opt.click(); await page.waitForTimeout(750); }
      else await page.waitForTimeout(400);
    }
    assert(await page.$('a[href="#/today/listen"]'), 'convo finished');
    await page.click('a[href="#/today/listen"]');
    await page.waitForURL(/#\/today\/listen/);
    await page.waitForSelector('#listen-card, .done-card');
    await shot(page, '13-daily-listen.png');

    // Complete listen items (up to 4)
    for (let guard = 0; guard < 30; guard++) {
      if (page.url().includes('#/today/done')) break;
      const m = await page.$('#mopts .option:not([disabled])');
      if (m) {
        await m.click();
        await page.waitForTimeout(200);
        const r = await page.$('#ropts .option:not([disabled])');
        if (r) { await r.click(); await page.waitForTimeout(200); }
        const next = await page.$('#l-next');
        if (next) { await next.click(); await page.waitForTimeout(300); }
        continue;
      }
      await page.waitForTimeout(300);
    }
    await page.waitForURL(/#\/today\/done/, { timeout: 15000 });
    await shot(page, '14-daily-end.png');

    const after = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('eliz-jp-v1'));
      return {
        days: s.days.length,
        streak: s.days.includes(new Date().toISOString().slice(0, 10)) || s.days.length > 0,
        daily: s.daily,
        unlocked: s.curriculum.unlocked,
        due: Object.keys(s.srs || {}).length
      };
    });
    assert(after.daily && after.daily.done, 'daily marked done');
    assert(after.daily.warmDone && after.daily.newDone && after.daily.convoDone && after.daily.listenDone, 'all 4 parts');
    assert(after.unlocked >= 3, 'curriculum advanced');
    assert(after.days >= 1, 'practice day recorded');
    console.log('daily ok', after);

    // Review scheduling: graded phrases should be in srs
    assert(after.due >= 3, 'srs entries for new phrases');

    // Home again shows complete state
    await page.click('a[href="#/"]');
    await page.waitForSelector('#start-cta');
    const cta = await page.textContent('#start-cta');
    assert(/complete|Lesson/i.test(cta), 'home shows complete: ' + cta);
    await shot(page, '01c-home-after-lesson.png');

    // Offline SW
    await page.evaluate(async () => { if (navigator.serviceWorker) await navigator.serviceWorker.ready; });
    await settle(page, 800);
    console.log('sw controller:', !!(await page.evaluate(() => navigator.serviceWorker.controller)));

    await ctx.close();
  }

  // ---------- free-practice unit smoke (family phrase card) ----------
  {
    const { ctx, page } = await mk('unit', { noRec: true });
    await page.goto(BASE + '#/unit/f-meet/cards/0');
    await page.waitForSelector('#phrase-card');
    assert(await page.$eval('#phrase-card .phrase-jp', (e) => e.textContent).then((t) => t.includes('久しぶり')), 'reunion phrase');
    await shot(page, '02-family-phrase-card.png');
    await page.goto(BASE + '#/unit/f-meet/roleplay');
    await page.waitForSelector('.chat, .rp-head');
    await settle(page, 900);
    await shot(page, '03-family-roleplay.png');
    await ctx.close();
  }

  // ---------- progress backup: export → clear → import ----------
  {
    const { ctx, page } = await mk('backup', { noRec: true, keepStorage: true });
    await page.goto(BASE); await page.waitForSelector('.hero');
    await page.evaluate(() => localStorage.clear());
    // Seed distinctive progress (keepStorage so reload doesn't wipe via init script)
    const seeded = await page.evaluate(() => {
      const s = {
        seen: { 'f-meet:久しぶり': Date.now() },
        srs: { 'f-meet:久しぶり': { box: 3, due: Date.now() + 86400000 } },
        units: { 'f-meet': { quizBest: 83, roleplayDone: true, listenDone: true } },
        read: {},
        days: ['2026-11-01', '2026-11-02', '2026-11-03'],
        settings: { showKana: false, romaji: 'fade', dailyNew: 5 },
        curriculum: { unlocked: 9 },
        daily: { date: '2026-11-03', warmDone: true, newIds: [], newDone: true, convoDone: true, listenDone: true, done: true },
        lastBackupAt: 0
      };
      localStorage.setItem('eliz-jp-v1', JSON.stringify(s));
      return s;
    });
    await page.reload();
    await page.waitForSelector('.hero');
    await page.click('a[href="#/settings"]');
    await page.waitForSelector('#backup-make');
    await page.click('#backup-make');
    await page.waitForFunction(() => {
      const t = document.getElementById('backup-export');
      return t && t.value && t.value.startsWith('EJP1.');
    });
    const code = await page.$eval('#backup-export', (el) => el.value);
    assert(code.startsWith('EJP1.'), 'prefix EJP1.');
    assert(code.length > 20, 'code has body');

    // Snapshot state before wipe (normalize lastBackupAt which Make updates)
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('eliz-jp-v1')));
    assert(before.settings.dailyNew === 5, 'seeded dailyNew');
    assert(before.curriculum.unlocked === 9, 'seeded unlocked');
    assert(before.srs['f-meet:久しぶり'].box === 3, 'seeded srs box');

    // Clear storage and open a fresh home (hash may still be #/settings)
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE + '#/');
    await page.waitForSelector('.hero');
    const wiped = await page.evaluate(() => JSON.parse(localStorage.getItem('eliz-jp-v1') || '{}'));
    assert(!wiped.srs || !wiped.srs['f-meet:久しぶり'], 'storage cleared');

    // Invalid code shows friendly error (no overwrite)
    await page.click('a[href="#/settings"]');
    await page.waitForSelector('#backup-import');
    await page.fill('#backup-import', 'NOT-A-BACKUP');
    let badConfirm = false;
    const badHandler = async (d) => { badConfirm = true; await d.dismiss(); };
    page.on('dialog', badHandler);
    await page.click('#backup-restore');
    await page.waitForSelector('#backup-err:not([hidden])');
    page.off('dialog', badHandler);
    assert(!badConfirm, 'invalid code must not open overwrite confirm');
    const errText = await page.textContent('#backup-err');
    assert(/EJP1|backup code|doesn.t look/i.test(errText), 'friendly invalid: ' + errText);

    // Valid restore
    await page.fill('#backup-import', code);
    page.once('dialog', async (d) => {
      const msg = d.message() || '';
      assert(/replace progress/i.test(msg), 'confirm overwrite: ' + JSON.stringify(msg));
      await d.accept();
    });
    await page.click('#backup-restore');
    await page.waitForFunction(() => {
      const s = JSON.parse(localStorage.getItem('eliz-jp-v1') || '{}');
      return s && s.curriculum && s.curriculum.unlocked === 9;
    });
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('eliz-jp-v1')));
    // Compare learning maps / settings (lastBackupAt may bump on import)
    const pick = (s) => JSON.stringify({
      seen: s.seen, srs: s.srs, units: s.units, read: s.read, days: s.days,
      settings: s.settings, curriculum: s.curriculum, daily: s.daily
    });
    assert(pick(before) === pick(after), 'state identical after import');
    assert(after.lastBackupAt > 0, 'lastBackupAt set');
    console.log('backup roundtrip ok', code.slice(0, 12) + '…', 'len', code.length);
    await ctx.close();
  }

    // ---------- desktop ----------
  {
    const { ctx, page } = await mk('desktop', { desktop: true, noRec: true });
    await page.goto(BASE); await page.waitForSelector('.hero');
    await page.evaluate(() => document.fonts.ready);
    await shot(page, '08-desktop-home.png');
    await ctx.close();
  }

  // ---------- pre-generated audio (iOS-reliable) ----------
  {
    const manifest = JSON.parse(fs.readFileSync(ROOT + 'data/audio-manifest.json', 'utf8'));
    assert(manifest.count >= 300, 'audio manifest count');
    const samples = ['久しぶりです', 'お邪魔します', 'はい、元気ですよ。もう九十歳です。'];
    for (const jp of samples) {
      const e = manifest.byText[jp];
      assert(e && e.src, 'manifest entry for ' + jp);
      const file = ROOT + e.src.replace(/^\.\//, '');
      assert(fs.existsSync(file), 'audio file on disk ' + file);
      assert(fs.statSync(file).size > 500, 'audio file non-empty ' + file);
    }
    // Live-ish: local static server must 200 the src (same origin as app)
    const { ctx, page } = await mk('audio', { noRec: true });
    await page.goto(BASE); await page.waitForSelector('.hero');
    const checks = await page.evaluate(async (samples) => {
      // wait briefly for Speech manifest
      for (let i = 0; i < 40; i++) {
        if (window.Speech && Speech.audioSrc && Speech.audioSrc(samples[0])) break;
        await new Promise((r) => setTimeout(r, 50));
      }
      const out = [];
      for (const jp of samples) {
        const src = Speech.audioSrc(jp);
        if (!src) { out.push({ jp, ok: false, reason: 'no src' }); continue; }
        const url = new URL(src, location.href).href;
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        out.push({ jp, ok: res.ok, status: res.status, src, bytes: +(res.headers.get('content-length') || 0) });
      }
      // Tap-play path: unlock + speak should wire the shared Audio element to the mp3.
      // Headless Chrome often never fires onended / may autoplay-block, so we only assert
      // that speak() selects the file src (not TTS-only) within a short window.
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      Speech.unlock && Speech.unlock();
      const src0 = Speech.audioSrc(samples[0]);
      const abs = new URL(src0, location.href).href;
      const speakP = Speech.speak(samples[0]);
      await new Promise((r) => setTimeout(r, 200));
      const cur = (Speech.playerSrc && Speech.playerSrc()) || '';
      out.push({ jp: samples[0], expectedSrc: abs, playerSrc: cur, wired: cur.indexOf('f80d2c3a4092') >= 0 || cur === abs });
      speakP.catch(() => {});
      return out;
    }, samples);
    console.log('audio checks', JSON.stringify(checks));
    for (const c of checks) {
      if ('status' in c) assert(c.ok && c.status === 200, 'audio HTTP 200 for ' + c.jp + ' ' + JSON.stringify(c));
      if ('wired' in c) assert(c.wired, 'Speech.speak wired audio element to mp3 ' + JSON.stringify(c));
    }
    await ctx.close();
  }

  await browser.close();
  if (errors.length) {
    console.error('CONSOLE ERRORS:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('ZERO console errors');
})().catch((e) => { console.error(e); process.exit(1); });
