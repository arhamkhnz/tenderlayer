import { BrowserWindow, ipcMain } from "electron/main";
import { windowStateIpcChannels } from "../../../shared/contracts/window-state.js";
import { assertTrustedSender } from "../../core/ipc-security.js";

export function registerWindowStateIpcHandlers() {
  ipcMain.handle(windowStateIpcChannels.getFullscreen, (event) => {
    assertTrustedSender(event);
    return BrowserWindow.fromWebContents(event.sender)?.isFullScreen() ?? false;
  });
}
