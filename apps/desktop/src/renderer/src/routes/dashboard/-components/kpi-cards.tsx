import { ArrowRightIcon, type IconProps } from "@keyline-icons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import type { ComponentType } from "react";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";

type KpiItem = {
  label: string;
  value: string;
  icon: ComponentType<IconProps>;
  to: LinkProps["to"];
};

export function KpiCards({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, to }) => (
        <Card key={label} className="pb-0">
          <CardHeader className="flex gap-2 px-3">
            <div className="grid shrink-0 place-items-center size-9 bg-muted text-muted-foreground rounded-md border shadow-xs">
              <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </div>

            <div className="min-w-0 flex-1">
              <CardDescription className="leading-none">{label}</CardDescription>
              <CardTitle className="text-lg font-medium tracking-tight tabular-nums">{value}</CardTitle>
            </div>
          </CardHeader>
          <CardFooter className="bg-muted p-0">
            <Link
              to={to}
              aria-label={`View ${label.toLowerCase()} details`}
              className="flex w-full items-center justify-between px-(--card-spacing) py-2 text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              View details
              <ArrowRightIcon aria-hidden="true" className="size-3.5" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
