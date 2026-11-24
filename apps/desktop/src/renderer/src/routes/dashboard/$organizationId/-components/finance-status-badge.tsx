import { cn } from "cn";

import { Badge } from "@tenderlayer/ui/components/badge";

const statusColors: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Review: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Unpaid: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Partially paid": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Ready: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function FinanceStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", statusColors[status] ?? statusColors.Draft)}>
      {status}
    </Badge>
  );
}
