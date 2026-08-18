import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, LayoutAlignLeftIcon, PanelLeftIcon } from "@hugeicons/core-free-icons";
import { router } from "@/app/router";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const isMac = window.electronAPI.platform === "darwin";
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;
  const canGoBack = useRouterState({
    select: () => router.history.canGoBack(),
  });
  useEffect(() => window.electronAPI.onFullScreenChange(setIsFullScreen), []);

  return (
    <header
      className="absolute inset-x-0 top-0 z-50 flex items-center border-b px-4 [app-region:drag]"
      style={{
        height: "env(titlebar-area-height, 3rem)",
        paddingLeft: isMac && !isFullScreen ? "env(titlebar-area-x, 72px)" : undefined,
      }}
    >
      <div className="flex h-full items-center gap-1.5 [app-region:no-drag] [-webkit-app-region:no-drag]">
        <Button
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={toggleSidebar}
          className="text-muted-foreground"
        >
          <HugeiconsIcon icon={isSidebarOpen ? PanelLeftIcon : LayoutAlignLeftIcon} strokeWidth={2} />
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            disabled={!canGoBack}
            onClick={() => router.history.back()}
            className="text-muted-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go forward"
            onClick={() => router.history.forward()}
            className="text-muted-foreground"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </header>
  );
}
