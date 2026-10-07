import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "electron";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const drizzleKitEntry = path.join(root, "node_modules", "drizzle-kit", "bin.cjs");

// The Electron CLI identifies this helper as "Electron" unless the app name
// is set explicitly before resolving the userData path.
app.setName("tenderlayer");

app
  .whenReady()
  .then(() => {
    const databasePath = process.env.TENDERLAYER_DB_PATH ?? path.join(app.getPath("userData"), "tenderlayer.db");
    const nodeExecutable = process.env.npm_node_execpath ?? process.execPath;
    const studio = spawn(nodeExecutable, [drizzleKitEntry, "studio"], {
      cwd: root,
      env: {
        ...process.env,
        TENDERLAYER_DB_PATH: databasePath,
      },
      stdio: "inherit",
    });

    studio.on("error", (error) => {
      console.error("[db] failed to start Drizzle Studio", error);
      app.exit(1);
    });

    studio.on("exit", (code, signal) => {
      if (signal) {
        app.exit(1);
        return;
      }

      app.exit(code ?? 0);
    });
  })
  .catch((error) => {
    console.error("[db] failed to resolve the application database path", error);
    app.exit(1);
  });
