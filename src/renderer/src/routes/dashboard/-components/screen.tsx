import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

type MetricItem = {
  label: string;
  value: string;
  detail?: string;
  icon?: Icon;
};

export function MetricStrip({ items, variant = "strip" }: { items: MetricItem[]; variant?: "strip" | "cards" }) {
  if (variant === "cards") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const ItemIcon = item.icon;

          return (
            <Card key={item.label} size="sm" className="gap-0 py-0">
              <CardHeader className="gap-1 rounded-b-none bg-muted/50 py-3">
                <CardDescription className="flex items-center gap-2">
                  {ItemIcon ? (
                    <span className="flex size-5 items-center justify-center rounded-sm bg-background ring-1 ring-foreground/10 [&_svg]:size-3">
                      <ItemIcon weight="fill" aria-hidden="true" />
                    </span>
                  ) : null}
                  {item.label}
                </CardDescription>
                <CardTitle className="text-xl font-medium tracking-tight tabular-nums">{item.value}</CardTitle>
              </CardHeader>
              {item.detail ? (
                <>
                  <Separator />
                  <CardFooter className="py-2 text-muted-foreground">{item.detail}</CardFooter>
                </>
              ) : null}
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="grid p-0 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex min-w-0 flex-col gap-1 px-4 py-3",
              index === 1 && "border-t sm:border-t-0 sm:border-l",
              index === 2 && "border-t xl:border-t-0 xl:border-l",
              index === 3 && "border-t sm:border-l xl:border-t-0",
            )}
          >
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <strong className="text-xl font-medium tracking-tight tabular-nums">{item.value}</strong>
            {item.detail ? <span className="text-xs text-muted-foreground">{item.detail}</span> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type DataCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function DataCard({ title, description, action, children, className, contentClassName }: DataCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export type StaticColumn<Row> = {
  key: keyof Row;
  label: string;
  className?: string;
  render?: (value: Row[keyof Row], row: Row) => ReactNode;
};

export function StaticTable<Row extends { id: string }>({
  rows,
  columns,
}: {
  rows: Row[];
  columns: StaticColumn<Row>[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead key={String(column.key)} className={column.className}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => {
              const value = row[column.key];
              return (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render ? column.render(value, row) : String(value)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function KeyValueGrid({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StaticStatus({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}
