import { defineConfig } from "oxfmt";

export default defineConfig({
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
