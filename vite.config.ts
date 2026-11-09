import { createHash } from 'node:crypto'
import { cpSync, createReadStream, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'
import { defineConfig } from 'vite'

const repo = resolve(dirname(fileURLToPath(import.meta.url)))
const TYPES: Record<string, string> = {
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
}

function sendFile(res: Connect.ServerResponse, file: string) {
  res.statusCode = 200
  res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream')
  res.setHeader('Cache-Control', 'no-cache')
  createReadStream(file).pipe(res)
}

function serveStatic(): Plugin {
  return {
    name: 'rizu-static',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const match = url.match(/^\/(data|audio|fonts|icons|img)\/(.+)$/)
        if (!match) return next()
        const file = join(repo, match[1], match[2])
        if (!file.startsWith(join(repo, match[1])) || !existsSync(file) || !statSync(file).isFile()) return next()
        sendFile(res, file)
      })
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(/(href|src)="\/(?!\/)/g, '$1="./')
      },
    },
  }
}

function serviceWorker(): Plugin {
  return {
    name: 'rizu-sw',
    apply: 'build',
    closeBundle() {
      const dist = join(repo, 'dist')
      const precache = new Set<string>(['./index.html', './manifest.webmanifest'])
      const assetsDir = join(dist, 'assets')
      if (existsSync(assetsDir)) {
        for (const name of readdirSync(assetsDir)) {
          if (name.endsWith('.map')) continue
          precache.add(`./assets/${name}`)
        }
      }
      for (const extra of [
        './data/speak.json',
        './data/audio-manifest.json',
        './icons/icon-192.png',
        './icons/icon-512.png',
        './icons/icon-maskable-512.png',
        './icons/apple-touch-icon.png',
        './img/mascot-wave.png',
        './img/mascot-cheer.png',
        './img/mascot-think.png',
      ]) precache.add(extra)
      const list = [...precache].sort()
      const buildId = createHash('sha256').update(list.join('\n')).digest('hex').slice(0, 12)
      const sw = `/* Generated. Cache ${buildId}. Do not edit by hand. */
const VERSION = 'rizu-${buildId}';
const PRECACHE = ${JSON.stringify(list, null, 2)};
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
`
      writeFileSync(join(dist, 'sw.js'), sw)
      const manifestSrc = join(repo, 'web/public/manifest.webmanifest')
      if (existsSync(manifestSrc) && !existsSync(join(dist, 'manifest.webmanifest'))) {
        cpSync(manifestSrc, join(dist, 'manifest.webmanifest'))
      }
    },
  }
}

export default defineConfig({
  root: join(repo, 'web'),
  base: './',
  publicDir: join(repo, 'web/public'),
  build: {
    outDir: join(repo, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: 'assets',
  },
  server: {
    fs: { allow: [repo] },
  },
  plugins: [serveStatic(), serviceWorker()],
})
