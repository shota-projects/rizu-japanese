import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

const BASE = 'http://127.0.0.1:8765/'
const SS = new URL('../screenshots/', import.meta.url)

const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], {
  cwd: new URL('..', import.meta.url).pathname,
  stdio: 'ignore',
})

process.on('exit', () => server.kill())
await delay(400)
mkdirSync(SS, { recursive: true })

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const errors = []

function track(page, label) {
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${label}] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[${label}] ${e.message}`))
}

async function mobile(label) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await ctx.addInitScript(() => {
    delete window.webkitSpeechRecognition
    delete window.SpeechRecognition
  })
  const page = await ctx.newPage()
  track(page, label)
  return { ctx, page }
}

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

{
  const { ctx, page } = await mobile('home')
  await page.goto(BASE)
  await page.waitForSelector('#start-cta')
  await page.evaluate(() => document.fonts.ready)
  const text = await page.locator('#app').innerText()
  assert(/Today’s lesson/.test(text), 'daily cta')
  assert(/リズちゃん/.test(text), 'uses リズちゃん')
  assert(!/Kuromi|Sanrio/i.test(text), 'no trademark names')
  assert(!/\b(Read|Write)\b/.test(text), 'speaking only')
  await page.screenshot({ path: SS.pathname + 'home.png' })
  await ctx.close()
}

{
  const { ctx, page } = await mobile('lesson')
  await page.goto(BASE)
  await page.waitForSelector('#start-cta')
  await page.click('#start-cta')
  await page.waitForSelector('#warm-next, #phrase-card')
  if (await page.locator('a[href="#/today/new"]').count()) await page.click('a[href="#/today/new"]')
  await page.waitForSelector('#phrase-card .phrase-jp')
  const jp = await page.locator('#phrase-card .phrase-jp').innerText()
  assert(jp.includes('久しぶり'), 'first new phrase: ' + jp)
  await page.screenshot({ path: SS.pathname + 'daily-lesson.png' })
  for (let i = 0; i < 3; i++) {
    await page.waitForSelector('#phrase-card')
    const got = page.locator('[data-rate="1"]')
    if (await got.count()) await got.click()
    await page.click('#new-next')
  }
  await page.waitForSelector('a[href="#/today/convo"]')
  await page.click('a[href="#/today/convo"]')
  for (let guard = 0; guard < 20; guard++) {
    if (await page.locator('a[href="#/today/listen"]').count()) break
    const opt = page.locator('.reply .option:not([disabled])')
    if (await opt.count()) {
      await opt.first().click()
      await delay(800)
    } else await delay(300)
  }
  assert(await page.locator('a[href="#/today/listen"]').count(), 'conversation finished')
  await page.click('a[href="#/today/listen"]')
  for (let guard = 0; guard < 30; guard++) {
    if (page.url().includes('#/today/done')) break
    const meaning = page.locator('#mopts .option:not([disabled])')
    if (await meaning.count()) {
      await meaning.first().click()
      await delay(150)
      const reply = page.locator('#ropts .option:not([disabled])')
      if (await reply.count()) await reply.first().click()
      const next = page.locator('#l-next')
      if (await next.count()) await next.click()
      continue
    }
    await delay(250)
  }
  await page.waitForURL(/#\/today\/done/, { timeout: 15000 })
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('rizu-jp-v2')))
  assert(saved.daily.value.done, 'daily marked done')
  assert(saved.curriculum.value.unlocked >= 3, 'curriculum moved')
  assert(saved.days && Object.keys(saved.days).length >= 1, 'practice day saved')
  await ctx.close()
}

{
  const { ctx, page } = await mobile('warm')
  await ctx.addInitScript(() => {
    const legacy = {
      seen: {
        'f-meet:久しぶりです': 10,
        'f-meet:また会えてうれしいです': 10,
        'f-meet:お邪魔します': 10,
      },
      srs: {
        'f-meet:久しぶりです': { box: 1, due: 1 },
        'f-meet:また会えてうれしいです': { box: 1, due: 1 },
        'f-meet:お邪魔します': { box: 1, due: 1 },
      },
      curriculum: { unlocked: 3 },
      settings: { showKana: true, romaji: 'show', dailyNew: 3 },
      days: [],
      units: {},
      read: {},
      daily: null,
      lastBackupAt: 0,
    }
    localStorage.setItem('eliz-jp-v1', JSON.stringify(legacy))
  })
  await page.goto(BASE + '#/today/warm')
  await page.waitForSelector('.warm-en')
  const hidden = await page.evaluate(() => {
    const ans = document.getElementById('warm-answer')
    return !!(ans && ans.classList.contains('hidden') && ans.querySelector('.audio-row'))
  })
  assert(hidden, 'japanese and audio hidden')
  assert(await page.locator('[data-show-answer]').count(), 'show answer')
  await page.screenshot({ path: SS.pathname + 'warmup-hidden.png' })
  await page.click('[data-show-answer]')
  await page.waitForSelector('#warm-answer:not(.hidden) .phrase-jp')
  assert(await page.locator('#warm-next').isDisabled(), 'next disabled before rating')
  assert(await page.locator('[data-rate="1"]').count(), 'got it')
  await page.screenshot({ path: SS.pathname + 'warmup-revealed.png' })
  await page.click('[data-rate="1"]')
  await page.waitForSelector('#warm-next:not([disabled])')
  const migrated = await page.evaluate(() => !!localStorage.getItem('rizu-jp-v2') && !!localStorage.getItem('eliz-jp-v1'))
  assert(migrated, 'migrated v1 without deleting it')
  await ctx.close()
}

{
  const { ctx, page } = await mobile('backup')
  await page.goto(BASE + '#/settings')
  await page.waitForSelector('#backup-make')
  await page.click('#backup-make')
  await page.waitForFunction(() => document.getElementById('backup-export')?.value?.startsWith('EJP1.'))
  await page.locator('#backup-section').scrollIntoViewIfNeeded()
  await delay(200)
  await page.screenshot({ path: SS.pathname + 'backup.png' })
  const code = await page.locator('#backup-export').inputValue()
  await page.evaluate(() => localStorage.clear())
  await page.goto(BASE + '#/')
  await page.waitForSelector('#start-cta')
  await page.goto(BASE + '#/settings')
  await page.fill('#backup-import', 'NOT-A-BACKUP')
  await page.click('#backup-restore')
  await page.waitForSelector('#backup-err:not([hidden])')
  await page.fill('#backup-import', code)
  page.once('dialog', (d) => d.accept())
  await page.click('#backup-restore')
  await page.waitForFunction(() => localStorage.getItem('rizu-jp-v2'))
  await ctx.close()
}

{
  const { ctx, page } = await mobile('audio-sw')
  await page.goto(BASE)
  await page.waitForSelector('#start-cta')
  const audio = await page.evaluate(async () => {
    const res = await fetch('./data/audio-manifest.json')
    const manifest = await res.json()
    const entry = manifest.byText['久しぶりです']
    const file = await fetch(entry.src)
    return { ok: file.ok, voice: entry.voice, bytes: Number(file.headers.get('content-length') || 0) }
  })
  assert(audio.ok && audio.bytes > 500, 'mp3 ' + JSON.stringify(audio))
  assert(audio.voice.includes('Nanami'), 'nanami voice')
  const ready = await page
    .waitForFunction(() => !!navigator.serviceWorker?.controller, null, { timeout: 12000 })
    .then(() => true)
    .catch(async () => {
      const info = await page.evaluate(async () => {
        const reg = await navigator.serviceWorker.getRegistration()
        return { controller: !!navigator.serviceWorker.controller, active: reg?.active?.state || null, waiting: !!reg?.waiting, scope: reg?.scope || null }
      })
      console.error('sw state', info)
      return false
    })
  assert(ready, 'service worker took control')
  assert(await page.locator('#update-banner').isHidden(), 'no update banner on first install')
  await page.context().setOffline(true)
  await page.reload()
  await page.waitForSelector('#start-cta', { timeout: 8000 })
  await ctx.close()
}

await browser.close()
server.kill()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('ui ok')
