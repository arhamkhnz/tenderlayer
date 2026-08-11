import { app, BrowserWindow } from "electron/main";
import squirrelStartup from "electron-squirrel-startup";
import { closeDatabase, initializeDatabase } from "./core/database/client.js";
import { createMainWindow } from "./core/main-window.js";
import { registerRendererProtocol, registerRendererScheme } from "./core/renderer-protocol.js";
import { registerIpcHandlers } from "./modules/index.js";

if (squirrelStartup) {
  app.quit();
}

registerRendererScheme();

app
  .whenReady()
  .then(() => {
    initializeDatabase();
    registerRendererProtocol();
    registerIpcHandlers();
    createMainWindow();

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
  if (process.platform !== "darwin") {
    app.quit();
  }
});
