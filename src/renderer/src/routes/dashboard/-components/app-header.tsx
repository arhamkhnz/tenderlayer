import { useRouterState } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, SidebarIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { router } from "@/app/router";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const isMac = window.electronAPI.platform === "darwin";
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;
  const canGoBack = useRouterState({
    select: () => router.history.canGoBack(),
  });
  return (
    <header
      className="absolute inset-x-0 top-0 z-50 flex items-center border-b px-4 [app-region:drag]"
      style={{
        height: "env(titlebar-area-height, 3rem)",
        paddingLeft: isMac ? "max(1rem, env(titlebar-area-x, 0px))" : undefined,
      }}
    >
      <div className="flex h-full items-center gap-1.5 [app-region:no-drag] [-webkit-app-region:no-drag]">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={toggleSidebar}
          className="text-muted-foreground"
        >
          {isSidebarOpen ? <SidebarIcon weight="fill" /> : <SidebarSimpleIcon weight="fill" />}
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
            <ArrowLeftIcon weight="regular" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go forward"
            onClick={() => router.history.forward()}
            className="text-muted-foreground"
          >
            <ArrowRightIcon weight="regular" />
          </Button>
        </div>
      </div>
    </header>
  );
}
