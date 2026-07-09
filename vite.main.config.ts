import { builtinModules } from 'node:module'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

interface PackageJson {
  dependencies?: Record<string, string>
}

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as PackageJson
const dependencies = Object.keys(packageJson.dependencies ?? {})
const nodeBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map((module) => `node:${module}`),
])

function isExternal(id: string) {
  return (
    id === 'electron' ||
    id.startsWith('electron/') ||
    nodeBuiltins.has(id) ||
    dependencies.some(
      (dependency) => id === dependency || id.startsWith(`${dependency}/`),
    )
  )
}

export default defineConfig(({ mode }) => ({
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      entry: 'src/main/index.ts',
      fileName: () => 'index.js',
      formats: ['es'],
    },
    minify: false,
    outDir: 'dist/main',
    reportCompressedSize: false,
    rolldownOptions: {
      external: isExternal,
    },
    sourcemap: mode === 'development',
    target: 'node22',
  },
}))
