// Service worker: precache the app shell, then stale-while-revalidate.
// Bump VERSION after editing files if you want returning visitors to refresh right away.
const VERSION = 'eliz-jp-v12';
const SHELL = [
  './', './index.html', './manifest.json',
  './css/style.css', './js/store.js', './js/speech.js', './js/app.js',
  './data/speak.json', './data/audio-manifest.json',
  './fonts/mplus-rounded-500.woff2', './fonts/mplus-rounded-700.woff2', './fonts/mplus-rounded-800.woff2',
  './fonts/quicksand-500.woff2', './fonts/quicksand-600.woff2', './fonts/quicksand-700.woff2',
  './img/mascot-wave.png', './img/mascot-cheer.png', './img/mascot-think.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return;

  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) { e.waitUntil(network); return cached; }
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') return cache.match('./index.html');
      return new Response('', { status: 504, statusText: 'Offline' });
    })
  );
});
