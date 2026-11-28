import { Columns3Icon } from "@keyline-icons/react";
import type { ColumnVisibilityState } from "@tanstack/react-table";

import { Button } from "@tenderlayer/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@tenderlayer/ui/components/dropdown-menu";

type ViewColumn = {
  id: string;
  columnDef: { header?: unknown; meta?: { label?: string } };
  getCanHide: () => boolean;
  toggleVisibility: (visible: boolean) => void;
};

export function DataTableViewOptions({
  columns,
  columnVisibility,
  className,
  iconLabel,
}: {
  columns: readonly ViewColumn[];
  columnVisibility: ColumnVisibilityState;
  className?: string;
  iconLabel?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size={iconLabel ? "icon-sm" : "sm"} className={className} />}
        aria-label={iconLabel}
      >
        <Columns3Icon data-icon={iconLabel ? undefined : "inline-start"} aria-hidden="true" />
        {!iconLabel && "View"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={iconLabel ? "font-450" : "w-48 font-450"}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          {columns
            .filter((column) => column.getCanHide())
            .map((column) => {
              const { header, meta } = column.columnDef;
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={columnVisibility[column.id] ?? true}
                  onCheckedChange={(checked) => column.toggleVisibility(checked)}
                >
                  {meta?.label ?? (typeof header === "string" ? header : column.id)}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
