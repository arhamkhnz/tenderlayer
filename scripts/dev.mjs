import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";
import electronPath from "electron";
import { build, createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mainConfig = path.join(root, "vite.main.config.ts");
const preloadConfig = path.join(root, "vite.preload.config.ts");
const rendererConfig = path.join(root, "vite.config.ts");

process.env.NODE_ENV = "development";

let electronProcess;
let rendererServer;
let shuttingDown = false;
let shutdownPromise;
let restartPending = false;
let restartRunning = false;
const expectedElectronExits = new WeakSet();
const watchers = [];

function isWatcher(result) {
  return (
    result &&
    typeof result === "object" &&
    "on" in result &&
    typeof result.on === "function" &&
    "close" in result &&
    typeof result.close === "function"
  );
}

async function createBuildWatcher(name, configFile, onRebuild) {
  let initialBuild = true;
  let resolveInitialBuild;
  let rejectInitialBuild;

  const initialBuildComplete = new Promise((resolve, reject) => {
    resolveInitialBuild = resolve;
    rejectInitialBuild = reject;
  });

  const result = await build({
    build: {
      watch: {},
    },
    clearScreen: false,
    configFile,
    mode: "development",
    plugins: [
      {
        name: `electron-dev:${name}`,
        buildEnd(error) {
          if (initialBuild && error) {
            initialBuild = false;
            rejectInitialBuild(error);
          }
        },
        closeBundle() {
          if (initialBuild) {
            initialBuild = false;
            console.log(`[electron] ${name} built`);
            resolveInitialBuild();
            return;
          }

          console.log(`[electron] ${name} rebuilt`);
          Promise.resolve(onRebuild()).catch((error) => {
            console.error(`[electron] ${name} rebuild hook failed`, error);
          });
        },
      },
    ],
  });

  if (!isWatcher(result)) {
    throw new TypeError(`Vite did not return a watcher for ${name}`);
  }

  watchers.push(result);

  result.on("event", (event) => {
    if (event.code === "ERROR") {
      console.error(`[electron] ${name} build failed`, event.error);

      if (initialBuild) {
        initialBuild = false;
        rejectInitialBuild(event.error);
      }
    }
  });

  await initialBuildComplete;
  return result;
}

function startElectron(rendererUrl) {
  const child = spawn(electronPath, ["."], {
    cwd: root,
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: rendererUrl,
    },
    stdio: "inherit",
  });

  electronProcess = child;

  child.on("error", (error) => {
    console.error("[electron] failed to start", error);

    if (electronProcess === child) {
      electronProcess = undefined;
    }

    if (!shuttingDown) {
      void shutdown(1);
    }
  });

  child.on("exit", (code, signal) => {
    if (electronProcess === child) {
      electronProcess = undefined;
    }

    if (expectedElectronExits.delete(child) || shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.log(`[electron] exited with ${reason}`);
    void shutdown(code ?? 0);
  });

  console.log("[electron] app started");
}

async function stopElectron() {
  const child = electronProcess;

  if (!child) {
    return;
  }

  electronProcess = undefined;
  expectedElectronExits.add(child);

  const exited = new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve(undefined);
      return;
    }

    void once(child, "exit").then(resolve, resolve);
  });

  if (child.exitCode === null && child.signalCode === null) {
    child.kill();
  }

  const forceKill = setTimeout(() => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
    }
  }, 3_000);

  forceKill.unref();
  await exited;
  clearTimeout(forceKill);
}

async function restartElectron(rendererUrl) {
  restartPending = true;

  if (restartRunning) {
    return;
  }

  restartRunning = true;

  try {
    while (restartPending && !shuttingDown) {
      restartPending = false;
      console.log("[electron] restarting app");
      await stopElectron();

      if (!shuttingDown) {
        startElectron(rendererUrl);
      }
    }
  } finally {
    restartRunning = false;
  }
}

async function shutdown(exitCode = 0) {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shuttingDown = true;
  shutdownPromise = (async () => {
    await stopElectron();
    await Promise.allSettled(watchers.map((watcher) => watcher.close()));

    if (rendererServer) {
      await rendererServer.close();
    }

    process.exitCode = exitCode;
  })();

  return shutdownPromise;
}

async function main() {
  rendererServer = await createServer({
    clearScreen: false,
    configFile: rendererConfig,
    mode: "development",
  });
  await rendererServer.listen();
  rendererServer.printUrls();

  const rendererUrl = rendererServer.resolvedUrls?.local[0] ?? rendererServer.resolvedUrls?.network[0];

  if (!rendererUrl) {
    throw new Error("Vite did not expose a renderer URL");
  }

  await Promise.all([
    createBuildWatcher("main", mainConfig, () => restartElectron(rendererUrl)),
    createBuildWatcher("preload", preloadConfig, () => {
      rendererServer?.ws.send({ type: "full-reload" });
    }),
  ]);

  startElectron(rendererUrl);
}

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});

process.once("uncaughtException", (error) => {
  console.error(error);
  void shutdown(1);
});

process.once("unhandledRejection", (error) => {
  console.error(error);
  void shutdown(1);
});

main().catch(async (error) => {
  console.error(error);
  await shutdown(1);
});
