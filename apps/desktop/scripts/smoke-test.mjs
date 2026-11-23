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
const tables = ["organizations", "users", "organization_memberships", "opportunities", "bids", "contracts"];

function snapshot(database) {
  return Object.fromEntries(
    tables.map((table) => [table, database.prepare(`SELECT * FROM ${table} ORDER BY id`).all()]),
  );
}

function seedDatabase(filename, count) {
  const database = new DatabaseSync(filename);
  try {
    database.exec("PRAGMA foreign_keys=OFF");
    database.exec("CREATE TABLE __drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at numeric)");
    for (const entry of journal.entries.slice(0, count)) {
      let sql = readFileSync(path.join(migrations, `${entry.tag}.sql`), "utf8");
      // Reproduce the already-released three-character constraint, too.
      if (entry.idx === 2) sql = sql.replace("between 2 and 120", "between 3 and 120");
      database.exec(sql.replaceAll("--> statement-breakpoint", ""));
      database
        .prepare("INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)")
        .run(createHash("sha256").update(sql).digest("hex"), entry.when);
    }
    database.exec("PRAGMA foreign_keys=ON");
    database
      .prepare("INSERT INTO organizations (id, name, slug) VALUES (?, ?, ?)")
      .run("legacy-org", count < 3 ? "AB" : "Legacy organization", "legacy-org");
    database.exec(`
      INSERT INTO users (id, name, email) VALUES ('legacy-user', 'Legacy user', 'legacy@example.test');
      INSERT INTO organization_memberships (id, organization_id, user_id) VALUES ('legacy-membership', 'legacy-org', 'legacy-user');
      INSERT INTO opportunities (id, organization_id, title) VALUES ('legacy-opportunity', 'legacy-org', 'Legacy opportunity');
      INSERT INTO bids (id, organization_id, opportunity_id) VALUES ('legacy-bid', 'legacy-org', 'legacy-opportunity');
      INSERT INTO contracts (id, organization_id, bid_id, title) VALUES ('legacy-contract', 'legacy-org', 'legacy-bid', 'Legacy contract');
    `);
    return snapshot(database);
  } finally {
    database.close();
  }
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
  for (const count of [0, 1, 2, 3]) {
    const directory = path.join(temporary, count === 0 ? "fresh" : `upgrade-${count}`);
    mkdirSync(directory);
    const filename = path.join(directory, "tenderlayer.db");
    const before = count === 0 ? undefined : seedDatabase(filename, count);
    await launch(executable, directory);
    const database = new DatabaseSync(filename, { readOnly: true });
    try {
      assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
      assert.equal(
        database.prepare("SELECT COUNT(*) AS count FROM __drizzle_migrations").get().count,
        journal.entries.length,
      );
      if (before) {
        assert.deepEqual(snapshot(database), before, "Upgrade must preserve all related records");
        const backupName = readdirSync(directory).find(
          (name) => name.includes(".before-migration-") && name.endsWith(".bak"),
        );
        assert.ok(backupName, "Existing databases must be backed up before migration");
        const backup = new DatabaseSync(path.join(directory, backupName), { readOnly: true });
        try {
          assert.deepEqual(snapshot(backup), before);
        } finally {
          backup.close();
        }
      }
    } finally {
      database.close();
    }
    console.log(
      `Packaged smoke test passed: ${count === 0 ? "fresh database" : `upgrade from migration ${count - 1}`}`,
    );
  }

  const directory = path.join(temporary, "rollback");
  mkdirSync(directory);
  const filename = path.join(directory, "tenderlayer.db");
  seedDatabase(filename, 1);
  const invalid = new DatabaseSync(filename);
  let before;
  try {
    invalid.exec("PRAGMA foreign_keys=OFF; UPDATE contracts SET organization_id='missing-org'");
    before = snapshot(invalid);
  } finally {
    invalid.close();
  }
  await assert.rejects(launch(executable, directory), /foreign-key validation/);
  const rolledBack = new DatabaseSync(filename, { readOnly: true });
  try {
    assert.deepEqual(snapshot(rolledBack), before, "Failed migrations must preserve the original rows");
    assert.equal(rolledBack.prepare("SELECT COUNT(*) AS count FROM __drizzle_migrations").get().count, 1);
  } finally {
    rolledBack.close();
  }
  console.log("Packaged smoke test passed: invalid upgrade rolls back");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
