import { SearchIcon } from "@keyline-icons/react";
import { cn } from "cn";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@tenderlayer/ui/components/input-group";
import { useSidebar } from "@tenderlayer/ui/components/sidebar";

import { HeaderActions } from "./header-actions";

export function MainHeader({ isFullscreen }: { isFullscreen: boolean }) {
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
