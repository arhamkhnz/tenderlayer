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

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: isMac ? "hiddenInset" : "default",
    titleBarOverlay: isMac,
    ...(isMac
      ? {
          trafficLightPosition: {
            x: 16,
            y: 16,
          },
        }
      : {}),
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
    if (!mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  };

  mainWindow.once("ready-to-show", showWindow);

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isTrustedRendererUrl(url)) {
      event.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url).catch((error) => {
        console.error("[electron] failed to open external URL", error);
      });
    }

    return { action: "deny" };
  });

  void mainWindow.loadURL(rendererPageUrl).catch((error) => {
    console.error(`[electron] failed to load renderer at ${rendererPageUrl}`, error);
    mainWindow.removeListener("ready-to-show", showWindow);
    showWindow();
  });
}
