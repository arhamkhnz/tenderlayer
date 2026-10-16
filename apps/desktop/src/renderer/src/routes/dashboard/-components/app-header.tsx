import { ArrowLeftIcon, ArrowRightIcon, PanelLeftIcon, PanelLeftOpenIcon } from "@keyline-icons/react";
import { useCanGoBack, useRouter, useRouterState } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";
import { cn } from "cn";
import { Button } from "@tenderlayer/ui/components/button";
import { useSidebar } from "@tenderlayer/ui/components/sidebar";
import { isMacOS } from "../../../../../shared/platform";

export function AppHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const historyIndex = useRouterState({ select: (state) => state.location.state.__TSR_index });
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;

  useLayoutEffect(() => {
    const header = headerRef.current;
    const layout = header?.parentElement;
    if (!header || !layout) return;

    const updateWidth = () => {
      layout.style.setProperty("--header-controls-width", `${header.getBoundingClientRect().width}px`);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(header);
    return () => {
      observer.disconnect();
      layout.style.removeProperty("--header-controls-width");
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "absolute top-0 left-0 z-50 flex h-(--header-height) w-fit items-center [app-region:drag]",
        !isMobile && open && "border-b",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-between gap-1.5 pl-4 pr-2",
          !isMobile && open && "md:w-(--sidebar-width)",
        )}
        style={{
          paddingLeft: isMacOS(window.electronAPI.platform) ? "max(1rem, env(titlebar-area-x, 0px))" : undefined,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={toggleSidebar}
          className="-ml-2 [app-region:no-drag] [-webkit-app-region:no-drag]"
        >
          {isSidebarOpen ? <PanelLeftIcon /> : <PanelLeftOpenIcon />}
        </Button>
        <div className="hidden items-center gap-1.5 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            disabled={!canGoBack}
            onClick={() => router.history.back()}
            className="[app-region:no-drag] [-webkit-app-region:no-drag]"
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go forward"
            disabled={historyIndex >= router.history.length - 1}
            onClick={() => router.history.forward()}
            className="[app-region:no-drag] [-webkit-app-region:no-drag]"
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
