/** Show the banner only when a new worker is waiting and a page is already controlled. */
export function shouldOfferUpdate(hasController: boolean, hasWaiting: boolean): boolean {
  return hasController && hasWaiting
}

let reloading = false

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return
  const start = () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './', updateViaCache: 'none' })
      .then((reg) => {
        const banner = document.getElementById('update-banner')
        const button = document.getElementById('update-apply')
        const offer = () => {
          if (!shouldOfferUpdate(!!navigator.serviceWorker.controller, !!reg.waiting)) return
          if (banner) banner.hidden = false
        }
        offer()
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed') offer()
          })
        })
        button?.addEventListener('click', () => {
          reg.waiting?.postMessage({ type: 'SKIP_WAITING' })
          reloading = true
        })
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!reloading) return
          window.location.reload()
        })
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update().catch(() => {})
        })
        window.setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000)
      })
      .catch(() => {})
  }
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start)
}
