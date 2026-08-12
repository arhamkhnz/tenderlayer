import { BrowserWindow, nativeTheme } from "electron/main";
import { shell } from "electron";
import { isTrustedRendererUrl, preloadPath, rendererPageUrl } from "./renderer-protocol.js";

function isSafeExternalUrl(url: string) {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export function createMainWindow() {
  const isMac = process.platform === "darwin";

  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: isMac ? "hiddenInset" : "default",
    titleBarOverlay: isMac,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#16171d" : "#ffffff",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: preloadPath,
      sandbox: true,
    },
  });

  const showWindow = () => {
    if (!window.isDestroyed()) {
      window.show();
    }
  };

  window.once("ready-to-show", showWindow);

  window.webContents.on("will-navigate", (event, url) => {
    if (!isTrustedRendererUrl(url)) {
      event.preventDefault();
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url).catch((error) => {
        console.error("[electron] failed to open external URL", error);
      });
    }

    return { action: "deny" };
  });

  void window.loadURL(rendererPageUrl).catch((error) => {
    console.error(`[electron] failed to load renderer at ${rendererPageUrl}`, error);
    window.removeListener("ready-to-show", showWindow);
    showWindow();
  });
}
