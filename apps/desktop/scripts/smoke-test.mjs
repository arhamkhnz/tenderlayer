import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "out");
const migrations = path.join(root, "drizzle");
const journal = JSON.parse(readFileSync(path.join(migrations, "meta/_journal.json"), "utf8"));
const tables = ["organizations", "departments", "contracts"];

function workspaceRows(database) {
  return {
    organizations: database.prepare("SELECT id, name FROM organizations ORDER BY id").all(),
    departments: database.prepare("SELECT id, organization_id, name, code FROM departments ORDER BY id").all(),
  };
}

function schemaObjects(database) {
  return database.prepare("SELECT type, name, sql FROM sqlite_schema ORDER BY type, name").all();
}

function migrationCount(database) {
  return database.prepare("SELECT COUNT(*) AS count FROM __drizzle_migrations").get().count;
}

function seedBaseline(filename, invalid = false) {
  const [baseline] = journal.entries;
  const sql = readFileSync(path.join(migrations, `${baseline.tag}.sql`), "utf8");
  const database = new DatabaseSync(filename, { enableForeignKeyConstraints: !invalid });
  try {
    database.exec(sql.replaceAll("--> statement-breakpoint", ""));
    database.exec(`
      CREATE TABLE __drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at numeric);
      INSERT INTO organizations (id, name, slug) VALUES ('sample-org', 'Sample organization', 'sample-org');
    `);
    database
      .prepare("INSERT INTO departments (id, organization_id, name, code) VALUES (?, ?, ?, ?)")
      .run("sample-department", invalid ? "missing-org" : "sample-org", "Sample department", "SD");
    database
      .prepare("INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)")
      .run(createHash("sha256").update(sql).digest("hex"), baseline.when);
    return { rows: workspaceRows(database), schema: schemaObjects(database) };
  } finally {
    database.close();
  }
}

async function checkMigration(executable, temporary, invalid = false) {
  const directory = path.join(temporary, invalid ? "rollback" : "upgrade");
  mkdirSync(directory);
  const filename = path.join(directory, "tenderlayer.db");
  const before = seedBaseline(filename, invalid);

  if (invalid) {
    await assert.rejects(launch(executable, directory), /foreign-key validation/);
  } else {
    await launch(executable, directory);
  }

  const database = new DatabaseSync(filename, { readOnly: true });
  try {
    assert.deepEqual(workspaceRows(database), before.rows);
    assert.equal(migrationCount(database), invalid ? 1 : journal.entries.length);
    if (invalid) assert.deepEqual(schemaObjects(database), before.schema);
    else assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
  } finally {
    database.close();
  }

  const backup = readdirSync(directory).find((name) => name.includes(".before-migration-") && name.endsWith(".bak"));
  assert.ok(backup, "Expected a backup of the baseline database");
  const backupDatabase = new DatabaseSync(path.join(directory, backup), { readOnly: true });
  try {
    assert.deepEqual(workspaceRows(backupDatabase), before.rows);
    assert.equal(migrationCount(backupDatabase), 1);
  } finally {
    backupDatabase.close();
  }
  console.log(
    invalid ? "Packaged smoke test passed: migration rollback" : "Packaged smoke test passed: baseline upgrade",
  );
}

function launch(executable, directory) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ["--smoke-test"], {
      cwd: directory,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "",
        TENDERLAYER_SMOKE_TEST_DIR: directory,
        TENDERLAYER_DB_PATH: path.join(directory, "tenderlayer.db"),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let logs = "";
    child.stdout.on("data", (chunk) => {
      logs += chunk;
    });
    child.stderr.on("data", (chunk) => {
      logs += chunk;
    });
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 60_000);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("close", (code, signal) => {
      clearTimeout(timeout);
      if (timedOut) {
        reject(new Error(`Packaged app timed out\n${logs}`));
      } else if (code !== 0 || !logs.includes("TENDERLAYER_SMOKE_TEST_OK")) {
        reject(new Error(`Packaged app exited with ${signal ?? code}\n${logs}`));
      } else resolve();
    });
  });
}

if (!["darwin", "win32"].includes(process.platform)) {
  throw new Error("Packaged smoke tests currently support macOS and Windows");
}

const temporary = mkdtempSync(path.join(tmpdir(), "tenderlayer-smoke-"));
try {
  let executable;
  if (process.platform === "darwin") {
    const candidates = readdirSync(output, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("mac"))
      .flatMap((entry) =>
        readdirSync(path.join(output, entry.name))
          .filter((name) => name.endsWith(".app"))
          .map((name) => path.join(output, entry.name, name)),
      );
    assert.equal(candidates.length, 1, "Expected exactly one packaged macOS app");
    const app = path.join(temporary, "TenderLayer.app");
    // Preserve macOS bundle metadata and framework symlinks without changing the built signature.
    execFileSync("/usr/bin/ditto", [candidates[0], app]);
    executable = path.join(app, "Contents/MacOS/TenderLayer");
  } else {
    const app = path.join(temporary, "app");
    cpSync(path.join(output, "win-unpacked"), app, { recursive: true, verbatimSymlinks: true });
    executable = path.join(app, "TenderLayer.exe");
  }

  // Running outside the checkout prevents missing dependencies resolving from its node_modules.
  const directory = path.join(temporary, "fresh");
  mkdirSync(directory);
  await launch(executable, directory);

  const database = new DatabaseSync(path.join(directory, "tenderlayer.db"), { readOnly: true });
  try {
    assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
    assert.equal(migrationCount(database), journal.entries.length);
    const createdTables = new Set(
      database
        .prepare("SELECT name FROM sqlite_schema WHERE type = 'table'")
        .all()
        .map(({ name }) => name),
    );
    for (const table of tables) assert.ok(createdTables.has(table), `Missing table ${table}`);
  } finally {
    database.close();
  }
  console.log("Packaged smoke test passed: fresh database");
  if (journal.entries.length > 1) {
    await checkMigration(executable, temporary);
    await checkMigration(executable, temporary, true);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
