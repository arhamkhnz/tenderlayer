import { Outlet } from "@tanstack/react-router";
import { SearchIcon } from "@keyline-icons/react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@tenderlayer/ui/components/input-group";
import { SidebarProvider, useSidebar } from "@tenderlayer/ui/components/sidebar";
import { TooltipProvider } from "@tenderlayer/ui/components/tooltip";
import { usePreferences } from "@/app/preferences";

import { AppSidebar } from "./sidebar/app-sidebar";
import { AppHeader } from "./app-header";
import { ThemeToggle } from "./theme-toggle";

function MainHeader() {
  const { isMobile, open } = useSidebar();

  return (
    <div className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center border-b bg-background pr-4">
      {(isMobile || !open) && <div aria-hidden="true" className="w-(--header-controls-width) shrink-0" />}
      <div className="min-w-0 pl-4 [app-region:no-drag] [-webkit-app-region:no-drag]">
        <InputGroup className="w-40 bg-background sm:w-64 dark:bg-background">
          <InputGroupInput type="search" placeholder="Search…" aria-label="Search application" />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="h-full min-w-2 flex-1 [app-region:drag]" />
      <ThemeToggle />
    </div>
  );
}

export function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = usePreferences();

  return (
    <TooltipProvider>
      <SidebarProvider
        className="relative [--header-height:env(titlebar-area-height,46px)]"
        open={sidebarOpen}
        onOpenChange={(open) => {
          void setSidebarOpen(open);
        }}
      >
        <AppHeader />
        <AppSidebar />
        <main className="relative flex min-w-0 flex-1 flex-col bg-background">
          <MainHeader />
          <div className="min-h-0 w-full min-w-0 p-4 has-data-[content-padding=false]:p-0">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
