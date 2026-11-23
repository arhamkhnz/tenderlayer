import type Database from "better-sqlite3";
import { readMigrationFiles } from "drizzle-orm/migrator";

export function migrateDatabase(sqlite: Database.Database, migrationsFolder: string) {
  const migrations = readMigrationFiles({ migrationsFolder });
  sqlite.exec(`CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at numeric
  )`);
  const last = sqlite.prepare("SELECT created_at FROM __drizzle_migrations ORDER BY created_at DESC LIMIT 1").get() as
    | { created_at: number }
    | undefined;
  const pending = migrations.filter((migration) => !last || Number(last.created_at) < migration.folderMillis);

  if (pending.length === 0) return;

  // Keep a recoverable copy of an existing database before upgrading it.
  if (last && sqlite.name !== ":memory:") {
    sqlite.prepare("VACUUM INTO ?").run(`${sqlite.name}.before-migration-${Date.now()}.bak`);
  }

  // SQLite ignores this pragma inside a transaction. Table rebuilds must not cascade-delete child rows.
  sqlite.pragma("foreign_keys = OFF");
  try {
    sqlite.transaction(() => {
      for (const migration of pending) {
        for (const statement of migration.sql) sqlite.exec(statement);
        sqlite
          .prepare("INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)")
          .run(migration.hash, migration.folderMillis);
      }
      const violations = sqlite.pragma("foreign_key_check");
      if (!Array.isArray(violations) || violations.length > 0) {
        throw new Error("Database upgrade failed foreign-key validation; changes were rolled back");
      }
    })();
  } finally {
    sqlite.pragma("foreign_keys = ON");
  }
}
