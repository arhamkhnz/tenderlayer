import { CircleQuestionIcon } from "@keyline-icons/react";
import { Avatar, AvatarFallback } from "@tenderlayer/ui/components/avatar";
import { Button } from "@tenderlayer/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";

import { ThemeToggle } from "./theme-toggle";

export function HeaderActions() {
  return (
    <div className="flex shrink-0 items-center gap-1.5 [app-region:no-drag] [-webkit-app-region:no-drag]">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Help" title="Help" />}>
          <CircleQuestionIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Help & support</DropdownMenuLabel>
            <DropdownMenuItem disabled>Documentation</DropdownMenuItem>
            <DropdownMenuItem disabled>Contact support</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Demo User profile — coming soon"
              className="border-0 p-0 hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent"
            />
          }
        >
          <Avatar className="rounded-lg after:rounded-lg">
            <AvatarFallback className="rounded-lg">DU</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Demo User</DropdownMenuLabel>
            <DropdownMenuItem disabled>Profile — coming soon</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
