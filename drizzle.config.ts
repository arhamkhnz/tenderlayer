import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/main/core/database/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./.data/tenderlayer.dev.db",
  },
});
