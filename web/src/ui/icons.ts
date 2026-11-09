export const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  slow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  ear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9.5a5 5 0 0 1 10 0c0 3-3 3.6-3 6.5a2.5 2.5 0 0 1-4.6 1.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M10 10a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
}

export const DECO = {
  skull:
    '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-4.6 0-8 3.1-8 7.3 0 2.4 1.2 4.3 3 5.4V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.3c1.8-1.1 3-3 3-5.4C20 6.1 16.6 3 12 3z" fill="currentColor"/><circle cx="9" cy="11" r="1.7" fill="#1b1522"/><circle cx="15" cy="11" r="1.7" fill="#1b1522"/><path d="M9.2 16.2h1.3v1.4H9.2zm2.15 0h1.3v1.4h-1.3zm2.15 0h1.3v1.4h-1.3z" fill="#1b1522"/></svg>',
  heart:
    '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-7.2-4.4-7.2-9.6A4 4 0 0 1 12 8.2a4 4 0 0 1 7.2 2.4c0 5.2-7.2 9.6-7.2 9.6z" fill="currentColor"/></svg>',
  star:
    '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.4 8.4l5.7.7-4.2 3.9 1.1 5.6L12 16.1 6.9 18.6 8 13 3.8 9.1l5.8-.7z" fill="currentColor"/></svg>',
  bow:
    '<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12 4.2 7.6c-1.2-.6-2 .2-2 1.3v6.2c0 1.1.8 1.9 2 1.3zM12 12l7.8-4.4c1.2-.6 2 .2 2 1.3v6.2c0 1.1-.8 1.9-2 1.3z" fill="currentColor"/><rect x="10.2" y="10" width="3.6" height="4" rx="1.2" fill="currentColor"/></svg>',
}

export const MASCOT = {
  wave: './img/mascot-wave.png',
  cheer: './img/mascot-cheer.png',
  think: './img/mascot-think.png',
} as const

export function mascot(pose: keyof typeof MASCOT, cls = ''): string {
  return `<img class="mascot mascot-${pose} ${cls}" src="${MASCOT[pose]}" alt="" width="120" height="120">`
}
