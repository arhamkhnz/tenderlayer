import Database from "better-sqlite3";
import { app } from "electron/main";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import * as schema from "./schema/index.js";

export type DatabaseClient = BetterSQLite3Database<typeof schema>;

let sqliteClient: Database.Database | undefined;
let databaseClient: DatabaseClient | undefined;

export function initializeDatabase(): DatabaseClient {
  if (databaseClient) {
    return databaseClient;
  }

  const databasePath =
    process.env.TENDERLAYER_DB_PATH ?? path.join(app.getPath("userData"), "tenderlayer.db");
  const sqlite = new Database(databasePath, { timeout: 5_000 });

  try {
    sqlite.pragma("foreign_keys = ON");
    sqlite.pragma("journal_mode = WAL");

    const database = drizzle(sqlite, { schema });
    const migrationsFolder = path.join(app.getAppPath(), "drizzle");

    migrate(database, { migrationsFolder });

    sqliteClient = sqlite;
    databaseClient = database;

    return database;
  } catch (error) {
    sqlite.close();
    throw error;
  }
}

export function getDatabase(): DatabaseClient {
  if (!databaseClient) {
    throw new Error("Database has not been initialized");
  }

  return databaseClient;
}

export function closeDatabase() {
  sqliteClient?.close();
  sqliteClient = undefined;
  databaseClient = undefined;
}
