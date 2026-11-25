import { BrowserWindow, ipcMain } from "electron/main";

import { assertTrustedSender } from "@core/ipc-security";
import { windowStateIpcChannels } from "@shared/contracts/window-state";

export function registerWindowStateIpcHandlers() {
  ipcMain.handle(windowStateIpcChannels.getFullscreen, (event) => {
    assertTrustedSender(event);
    return BrowserWindow.fromWebContents(event.sender)?.isFullScreen() ?? false;
  });
}
