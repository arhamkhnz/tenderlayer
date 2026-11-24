import { Outlet } from "@tanstack/react-router";
import { SearchIcon } from "@keyline-icons/react";
import type { CSSProperties } from "react";
import { cn } from "cn";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@tenderlayer/ui/components/input-group";
import { SidebarProvider, useSidebar } from "@tenderlayer/ui/components/sidebar";
import { TooltipProvider } from "@tenderlayer/ui/components/tooltip";
import { usePreferences } from "@/app/preferences";

import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./app-header";
import { HeaderActions } from "./header-actions";
import { useWindowFullscreen } from "./use-window-fullscreen";

function MainHeader({ isFullscreen }: { isFullscreen: boolean }) {
  const { isMobile, open } = useSidebar();

  return (
    <div
      className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center border-b border-sidebar-border bg-background pr-4"
      style={{
        gridColumn: isFullscreen && !isMobile ? "2" : "1 / -1",
        gridRow: "1",
      }}
    >
      {(!isFullscreen || isMobile || !open) && (
        <div
          aria-hidden="true"
          className="shrink-0"
          style={{
            width:
              !isFullscreen || isMobile
                ? "var(--header-controls-width)"
                : "max(0px, calc(var(--header-controls-width) - var(--sidebar-width-icon)))",
          }}
        />
      )}
      <div
        className={cn(
          "w-48 min-w-0 shrink sm:w-72 [app-region:no-drag] [-webkit-app-region:no-drag]",
          isFullscreen ? "pl-4" : "pl-1.5",
        )}
      >
        <InputGroup className="w-full border-transparent bg-muted/50 dark:bg-muted/50">
          <InputGroupInput type="search" placeholder="Search…" aria-label="Search application" />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="h-full min-w-2 flex-1 [app-region:drag]" />
      <HeaderActions />
    </div>
  );
}

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
          <AppSidebar />
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
