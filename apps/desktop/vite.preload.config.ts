import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const sandboxExternals = new Set(["electron", "electron/renderer"]);

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
    },
  },
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      entry: "src/preload/index.ts",
      fileName: () => "index.cjs",
      formats: ["cjs"],
    },
    minify: false,
    outDir: "dist/preload",
    reportCompressedSize: false,
    rolldownOptions: {
      external: (id) => sandboxExternals.has(id),
    },
    sourcemap: mode === "development",
    target: "node22",
  },
}));
