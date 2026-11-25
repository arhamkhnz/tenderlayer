import path from "node:path";

import { app, type BrowserWindow } from "electron/main";

export const isSmokeTest = process.argv.includes("--smoke-test");

export function configureSmokeTest() {
  if (!isSmokeTest) return;
  const directory = process.env.TENDERLAYER_SMOKE_TEST_DIR;
  const database = process.env.TENDERLAYER_DB_PATH;
  if (!directory || !path.isAbsolute(directory) || database !== path.join(directory, "tenderlayer.db")) {
    throw new Error("Smoke tests require an isolated directory and database");
  }
  app.setPath("userData", directory);
}

export async function smokeTestWindow(window: BrowserWindow) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (!window.webContents.isLoading()) {
      const ready = await window.webContents.executeJavaScript(`(async () => {
        const root = document.getElementById("root");
        if (!root?.children.length || !root.textContent.trim()) return false;
        if (root.textContent.includes("Something went wrong")) throw new Error("Renderer route failed");
        const organizations = await window.electronAPI.organizations.list();
        const preferences = await window.electronAPI.preferences.get();
        if (!Array.isArray(organizations) || !preferences.theme) throw new Error("Invalid IPC response");
        return true;
      })()`);
      if (ready) {
        console.log("TENDERLAYER_SMOKE_TEST_OK");
        app.quit();
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Packaged renderer did not mount and respond through IPC");
}
