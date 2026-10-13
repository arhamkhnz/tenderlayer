import { PanelLeftIcon, PanelLeftOpenIcon } from "@keyline-icons/react";
import { Button } from "@tenderlayer/ui/components/button";
import { useSidebar } from "@tenderlayer/ui/components/sidebar";

export function AppHeader() {
  const isMac = window.electronAPI.platform === "darwin";
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;
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
          className="-ml-2 text-muted-foreground"
        >
          {isSidebarOpen ? <PanelLeftIcon /> : <PanelLeftOpenIcon />}
        </Button>
      </div>
    </header>
  );
}
