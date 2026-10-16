import { ipcMain, nativeTheme } from "electron/main";
import { z } from "zod";
import { preferenceIpcChannels } from "../../../shared/contracts/preferences.js";
import { assertTrustedSender } from "../../core/ipc-security.js";
import { getPreferences, setSidebarOpen, setTheme } from "../../core/preferences.js";

const themeSchema = z.enum(["light", "dark", "system"]);
const sidebarOpenSchema = z.boolean();

export function registerPreferenceIpcHandlers() {
  nativeTheme.themeSource = getPreferences().theme;

  ipcMain.handle(preferenceIpcChannels.get, (event) => {
    assertTrustedSender(event);
    return getPreferences();
  });

  ipcMain.handle(preferenceIpcChannels.setTheme, (event, theme: unknown) => {
    assertTrustedSender(event);
    setTheme(themeSchema.parse(theme));
  });

  ipcMain.handle(preferenceIpcChannels.setSidebarOpen, (event, open: unknown) => {
    assertTrustedSender(event);
    setSidebarOpen(sidebarOpenSchema.parse(open));
  });
}
