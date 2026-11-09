import { cpSync, rmSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(repo, 'dist')

if (!existsSync(resolve(dist, 'index.html')) || !existsSync(resolve(dist, 'sw.js'))) {
  console.error('dist/ is missing a build. Run vite build first.')
  process.exit(1)
}

rmSync(resolve(repo, 'assets'), { recursive: true, force: true })
cpSync(resolve(dist, 'assets'), resolve(repo, 'assets'), { recursive: true })
cpSync(resolve(dist, 'index.html'), resolve(repo, 'index.html'))
cpSync(resolve(dist, 'sw.js'), resolve(repo, 'sw.js'))
cpSync(resolve(dist, 'manifest.webmanifest'), resolve(repo, 'manifest.webmanifest'))
console.log('Synced built shell to the repository root for GitHub Pages.')
