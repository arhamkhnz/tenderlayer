import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: [
    "**/.next/**",
    "**/next-env.d.ts",
    "**/dist/**",
    "**/out/**",
    "**/coverage/**",
    "apps/desktop/assets/**",
    "apps/desktop/drizzle/**",
    "apps/desktop/src/renderer/src/components/ui/**",
    "apps/desktop/src/renderer/src/routeTree.gen.ts",
  ],
  plugins: ["react", "typescript", "oxc"],
  rules: {
    "react/rules-of-hooks": "error",
  },
  overrides: [
    {
      files: ["apps/desktop/src/renderer/src/**/*.{ts,tsx}", "packages/ui/src/**/*.{ts,tsx}"],
      rules: {
        "react/only-export-components": ["warn", { allowConstantExport: true }],
      },
    },
    {
      files: ["apps/desktop/src/renderer/src/routes/**/*.tsx"],
      rules: {
        "react/only-export-components": "off",
      },
    },
    {
      files: ["apps/site/**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
      plugins: ["react", "typescript", "oxc", "nextjs"],
      rules: {
        "nextjs/no-img-element": "off",
      },
    },
  ],
});
