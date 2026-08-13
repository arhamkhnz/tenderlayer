import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["assets/**", "drizzle/**", "src/renderer/src/components/ui/**", "src/renderer/src/routeTree.gen.ts"],
  plugins: ["react", "typescript", "oxc"],
  rules: {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { allowConstantExport: true }],
  },
  overrides: [
    {
      files: ["src/renderer/src/routes/**/*.tsx"],
      rules: {
        "react/only-export-components": "off",
      },
    },
  ],
});
