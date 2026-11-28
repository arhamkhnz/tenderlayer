import type { CSSProperties } from "react";

import { Outlet } from "@tanstack/react-router";

import { SidebarProvider } from "@tenderlayer/ui/components/sidebar";
import { TooltipProvider } from "@tenderlayer/ui/components/tooltip";

import { usePreferences } from "@/app/preferences";
import { useWindowFullscreen } from "@/hooks/use-window-fullscreen";

import { AppHeader } from "./header/app-header";
import { MainHeader } from "./header/main-header";
import { AppSidebar } from "./sidebar/app-sidebar";

export function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = usePreferences();
  const isFullscreen = useWindowFullscreen();

  return (
    <TooltipProvider>
      <SidebarProvider
        className="relative grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[var(--header-height)_1fr] [--header-height:env(titlebar-area-height,46px)]"
        data-fullscreen={isFullscreen}
        style={{ "--sidebar-top": isFullscreen ? "0px" : "var(--header-height)" } as CSSProperties}
        open={sidebarOpen}
        onOpenChange={(open) => {
          void setSidebarOpen(open);
        }}
      >
        <AppHeader isFullscreen={isFullscreen} />
        <MainHeader isFullscreen={isFullscreen} />
        <div className="col-start-1 row-start-2">
          <AppSidebar isFullscreen={isFullscreen} />
        </div>
        <main className="relative col-start-2 row-start-2 flex min-w-0 flex-col bg-background">
          <div className="min-h-0 w-full min-w-0 p-4 has-data-[content-padding=false]:p-0">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
