/* Generated. Cache 5530c3d395a7. Do not edit by hand. */
const VERSION = 'rizu-5530c3d395a7';
const PRECACHE = [
  "./assets/index-DYsxMB7u.js",
  "./assets/index-g3qERxmD.css",
  "./assets/mplus-rounded-500-CIlnqefN.woff2",
  "./assets/mplus-rounded-700-CxxCDv8p.woff2",
  "./assets/mplus-rounded-800-CAZoDTON.woff2",
  "./assets/quicksand-500-_DbwbYKP.woff2",
  "./assets/quicksand-600-DTBPeRoM.woff2",
  "./assets/quicksand-700-Dpk7G9Y6.woff2",
  "./data/audio-manifest.json",
  "./data/speak.json",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./img/mascot-cheer.png",
  "./img/mascot-think.png",
  "./img/mascot-wave.png",
  "./index.html",
  "./manifest.webmanifest"
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;
  const indexUrl = new URL('./index.html', self.registration.scope).href;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(indexUrl, res.clone());
        return res;
      } catch (err) {
        return (await cache.match(indexUrl)) || (await cache.match('./index.html')) || (await cache.match('./')) || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (hit) {
      event.waitUntil(network);
      return hit;
    }
    const res = await network;
    if (res) return res;
    return new Response('', { status: 504, statusText: 'Offline' });
  })());
});
