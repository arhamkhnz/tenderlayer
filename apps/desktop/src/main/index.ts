import { app, BrowserWindow, dialog } from "electron/main";

import { isMacOS } from "@shared/platform";

import { closeDatabase, initializeDatabase } from "./core/database/client.js";
import { createMainWindow } from "./core/main-window.js";
import { registerRendererProtocol, registerRendererScheme } from "./core/renderer-protocol.js";
import { configureSmokeTest, isSmokeTest, smokeTestWindow } from "./core/smoke-test.js";
import { registerIpcHandlers } from "./modules/index.js";

configureSmokeTest();
registerRendererScheme();

app
  .whenReady()
  .then(async () => {
    try {
      initializeDatabase();
    } catch (error) {
      if (!isSmokeTest) {
        dialog.showErrorBox("TenderLayer couldn’t start", "The local database couldn’t be opened or prepared.");
      }
      throw error;
    }
    registerRendererProtocol();
    registerIpcHandlers();
    const window = createMainWindow();
    if (isSmokeTest) {
      await smokeTestWindow(window);
      return;
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  })
  .catch((error) => {
    console.error("[electron] failed to initialize the application", error);
    app.exit(1);
  });

app.on("will-quit", closeDatabase);

app.on("window-all-closed", () => {
  if (!isMacOS(process.platform)) {
    app.quit();
  }
});
