import { parseBackup } from '../progress/backup'
import { course, progress } from '../session'
import { DECO, mascot } from '../ui/icons'
import { phraseHTML } from '../ui/phrase'
import { celebrate, setTopbar, show, toast } from '../ui/shell'
import { go } from '../nav'

function previewPhrase() {
  const unit = course.units[1] || course.units[0]
  return unit?.phrases[1] || unit?.phrases[0]
}

export function viewSettings(): void {
  setTopbar('Settings', '#/')
  const kana = progress.setting('showKana')
  const rm = progress.setting('romaji')
  const dn = progress.setting('dailyNew')
  const sample = previewPhrase()
  show(`
    <article class="card settings">
      <div class="set-block">
        <div class="set-title">New phrases per day</div>
        <div class="set-sub">How many brand-new phrases today’s lesson unlocks.</div>
        <div class="seg" role="radiogroup" aria-label="Daily new phrases">
          ${[3, 5, 7]
            .map(
              (v) =>
                `<button type="button" role="radio" aria-checked="${dn === v}" class="seg-btn ${dn === v ? 'on' : ''}" data-dn="${v}">${v}</button>`,
            )
            .join('')}
        </div>
      </div>
      <label class="switch-row">
        <div>
          <div class="set-title">Hiragana reading</div>
          <div class="set-sub">Show the kana under phrases with kanji, like <span class="jp" lang="ja">お母さん</span> → <span class="jp" lang="ja">おかあさん</span>.</div>
        </div>
        <input type="checkbox" id="set-kana" ${kana ? 'checked' : ''}><span class="switch" aria-hidden="true"></span>
      </label>
      <div class="set-block">
        <div class="set-title">Romaji</div>
        <div class="set-sub">Fade hides romaji (tap to peek) once a phrase is in review box 3 or higher.</div>
        <div class="seg" role="radiogroup" aria-label="Romaji">
          ${[
            ['show', 'Show'],
            ['fade', 'Fade'],
            ['hide', 'Hide'],
          ]
            .map(
              ([v, l]) =>
                `<button type="button" role="radio" aria-checked="${rm === v}" class="seg-btn ${rm === v ? 'on' : ''}" data-rm="${v}">${l}</button>`,
            )
            .join('')}
        </div>
      </div>
      ${sample ? `<div class="set-preview">${phraseHTML(sample, { big: false, known: progress.box(`${(course.units[1] || course.units[0]).id}:${sample.jp}`) >= 3 })}</div>` : ''}
    </article>
    <article class="card settings backup-card" id="backup-section">
      <div class="backup-deco" aria-hidden="true">${DECO.bow}${DECO.skull}${DECO.bow}</div>
      <div class="set-title">Back up my progress ${DECO.heart}</div>
      <div class="set-sub">Progress is saved on this phone. Make a backup code now and then, or before switching phones. About once a week is a good rhythm.</div>
      <div class="set-block">
        <div class="set-title">Export</div>
        <div class="set-sub">A compact code with your streak, phrases, review boxes, and settings.</div>
        <textarea class="backup-code" id="backup-export" readonly rows="4" aria-label="Backup code" placeholder="Tap “Make backup code”…"></textarea>
        <div class="backup-actions">
          <button type="button" class="btn primary" id="backup-make">Make backup code</button>
          <button type="button" class="btn ghost" id="backup-copy" disabled>Copy code</button>
          <button type="button" class="btn ghost" id="backup-share" hidden>Share</button>
        </div>
      </div>
      <div class="set-block">
        <div class="set-title">Restore</div>
        <div class="set-sub">Paste a code from another phone. Older codes that start with EJP1. work too.</div>
        <textarea class="backup-code" id="backup-import" rows="4" aria-label="Paste backup code" placeholder="Paste EJP1.… code here"></textarea>
        <p class="backup-err" id="backup-err" hidden role="alert"></p>
        <button type="button" class="btn primary" id="backup-restore">Restore</button>
      </div>
      <div class="backup-cheer" id="backup-cheer" hidden>
        ${mascot('cheer', 'backup-cheer-mascot')}
        <p class="jp" lang="ja">やった！</p>
        <p>Progress restored on this phone.</p>
      </div>
    </article>
    <article class="card settings">
      <div class="set-title">Progress</div>
      <div class="set-sub">Saved on this device. Missing a day never wipes your streak — you just resume.</div>
      <button type="button" class="btn ghost" id="reset">Reset progress</button>
    </article>`)

  document.getElementById('set-kana')?.addEventListener('change', (e) => {
    progress.setting('showKana', (e.target as HTMLInputElement).checked)
    viewSettings()
  })
  document.querySelectorAll<HTMLButtonElement>('[data-rm]').forEach((b) => {
    b.addEventListener('click', () => {
      const mode = b.dataset.rm
      if (mode === 'show' || mode === 'fade' || mode === 'hide') {
        progress.setting('romaji', mode)
        viewSettings()
      }
    })
  })
  document.querySelectorAll<HTMLButtonElement>('[data-dn]').forEach((b) => {
    b.addEventListener('click', () => {
      const n = Number(b.dataset.dn)
      if (n === 3 || n === 5 || n === 7) {
        progress.setting('dailyNew', n)
        viewSettings()
      }
    })
  })
  document.getElementById('reset')?.addEventListener('click', () => {
    if (confirm('Reset all progress on this device?')) {
      progress.reset()
      toast('Progress reset')
      go('#/')
    }
  })
  wireBackup()
}

function wireBackup(): void {
  const out = document.getElementById('backup-export') as HTMLTextAreaElement
  const inn = document.getElementById('backup-import') as HTMLTextAreaElement
  const err = document.getElementById('backup-err') as HTMLElement
  const copyBtn = document.getElementById('backup-copy') as HTMLButtonElement
  const shareBtn = document.getElementById('backup-share') as HTMLButtonElement
  const cheer = document.getElementById('backup-cheer') as HTMLElement
  const showErr = (msg: string) => {
    err.hidden = !msg
    err.textContent = msg
  }
  document.getElementById('backup-make')?.addEventListener('click', async () => {
    try {
      progress.markBackup()
      out.value = await progress.exportBackup()
      copyBtn.disabled = false
      toast('Backup code ready')
    } catch {
      toast('Couldn’t make a backup code')
    }
  })
  const copyCode = async () => {
    const code = out.value.trim()
    if (!code) return
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
        ok = true
      }
    } catch {
      ok = false
    }
    if (!ok) {
      out.focus()
      out.select()
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
    }
    if (ok) {
      progress.markBackup()
      toast('Copied!')
    } else toast('Couldn’t copy — long-press to select')
  }
  copyBtn.addEventListener('click', () => void copyCode())
  if (navigator.share) {
    shareBtn.hidden = false
    shareBtn.addEventListener('click', async () => {
      if (!out.value.trim()) {
        try {
          out.value = await progress.exportBackup()
          copyBtn.disabled = false
        } catch {
          toast('Couldn’t make a backup code')
          return
        }
      }
      try {
        await navigator.share({ title: 'にほんご backup', text: out.value.trim() })
        progress.markBackup()
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        toast('Share didn’t work — try Copy instead')
      }
    })
  }
  document.getElementById('backup-restore')?.addEventListener('click', async () => {
    showErr('')
    const code = inn.value.trim()
    if (!code) {
      showErr('Paste a backup code first.')
      return
    }
    try {
      await parseBackup(code)
    } catch (err) {
      showErr(err instanceof Error ? err.message : 'Couldn’t restore that code.')
      return
    }
    if (!confirm('This will replace progress on this device. Continue?')) return
    try {
      await progress.importBackup(code)
      cheer.hidden = false
      celebrate(cheer.querySelector('.backup-cheer-mascot') || cheer)
      toast('Progress restored!')
      window.setTimeout(() => viewSettings(), 900)
    } catch (err) {
      showErr(err instanceof Error ? err.message : 'Couldn’t restore that code.')
    }
  })
}
