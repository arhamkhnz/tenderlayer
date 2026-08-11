import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/renderer/src", import.meta.url)),
    },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
  root: "src/renderer",
  build: {
    emptyOutDir: true,
    outDir: "../../dist/renderer",
  },
});
