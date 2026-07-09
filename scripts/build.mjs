import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const configFiles = [
  'vite.main.config.ts',
  'vite.preload.config.ts',
  'vite.config.ts',
]

process.env.NODE_ENV = 'production'

await rm(path.join(root, 'dist'), { force: true, recursive: true })

for (const configFile of configFiles) {
  await build({
    configFile: path.join(root, configFile),
    mode: 'production',
  })
}
