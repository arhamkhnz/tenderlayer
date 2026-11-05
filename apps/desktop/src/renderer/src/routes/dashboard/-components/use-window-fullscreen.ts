import { useEffect, useState } from "react";

export function useWindowFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let active = true;
    let receivedChange = false;
    const unsubscribe = window.electronAPI.windowState.onFullscreenChange((fullscreen) => {
      receivedChange = true;
      if (active) setIsFullscreen(fullscreen);
    });

    void window.electronAPI.windowState.getFullscreen().then(
      (fullscreen) => {
        if (active && !receivedChange) setIsFullscreen(fullscreen);
      },
      (error: unknown) => {
        console.error("Failed to read window fullscreen state", error);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return isFullscreen;
}
