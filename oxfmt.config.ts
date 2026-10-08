import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "apps/desktop/assets/**",
    "apps/desktop/drizzle/**",
    "apps/desktop/src/renderer/src/components/ui/**",
    "apps/desktop/src/renderer/src/routeTree.gen.ts",
    "apps/site/public/**",
  ],
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  insertFinalNewline: true,
  objectWrap: "preserve",
  embeddedLanguageFormatting: "auto",
  sortPackageJson: false,
});
