export const windowStateIpcChannels = {
  getFullscreen: "window-state:get-fullscreen",
  fullscreenChanged: "window-state:fullscreen-changed",
} as const;

export interface WindowStateApi {
  getFullscreen: () => Promise<boolean>;
  onFullscreenChange: (listener: (isFullscreen: boolean) => void) => () => void;
}
