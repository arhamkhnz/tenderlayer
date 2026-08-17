import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/main/core/database/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TENDERLAYER_DB_PATH ?? "./.data/tenderlayer.dev.db",
  },
});
