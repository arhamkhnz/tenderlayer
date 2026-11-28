import type { ReactNode } from "react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-3xl tracking-tighter leading-none">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

type DataCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function DataCard({ title, description, action, children, contentClassName }: DataCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

type StaticColumn<Row> = {
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
