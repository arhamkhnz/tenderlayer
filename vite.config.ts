import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  root: 'src/renderer',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',
  },
})
