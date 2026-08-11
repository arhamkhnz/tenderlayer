import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["drizzle/**", "src/renderer/src/components/ui/**"],
  plugins: ["react", "typescript", "oxc"],
  rules: {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { allowConstantExport: true }],
  },
});
