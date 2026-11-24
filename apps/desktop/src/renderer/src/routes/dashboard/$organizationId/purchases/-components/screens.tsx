import {
  BriefcaseIcon,
  Building,
  CalendarIcon,
  HashIcon,
  IndianRupeeIcon,
  ReceiptIcon,
  TagIcon,
} from "@keyline-icons/react";

import { FinanceStatusBadge } from "../../-components/finance-status-badge";
import { RecordsTable, type RecordColumn } from "../../-components/records-table";
import { formatAmount, purchases } from "./data";
import { NewPurchaseDrawer } from "./new-purchase-drawer";

const columns: RecordColumn<(typeof purchases)[number]>[] = [
  {
    id: "invoice",
    label: "Invoice",
    icon: HashIcon,
    cell: (record) => <span className="font-mono">{record.invoice}</span>,
  },
  {
    id: "vendor",
    label: "Vendor",
    icon: Building,
    cell: (record) => <span className="font-450">{record.vendor}</span>,
  },
  { id: "category", label: "Category", icon: TagIcon, cell: (record) => record.category },
  { id: "contract", label: "Contract", icon: BriefcaseIcon, cell: (record) => record.contract || "—" },
  {
    id: "date",
    label: "Date",
    icon: CalendarIcon,
    cell: (record) => <span className="text-muted-foreground tabular-nums">{record.date}</span>,
  },
  { id: "gst", label: "GST", icon: IndianRupeeIcon, numeric: true, cell: (record) => formatAmount(record.gst) },
  {
    id: "total",
    label: "Total",
    icon: IndianRupeeIcon,
    numeric: true,
    cell: (record) => formatAmount(record.amount + record.gst),
  },
  {
    id: "status",
    label: "Payment",
    icon: ReceiptIcon,
    cell: (record) => <FinanceStatusBadge status={record.status} />,
  },
];

export function PurchasesScreen() {
  return (
    <section
      data-content-padding="false"
      aria-labelledby="purchases-title"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background"
    >
      <header className="flex shrink-0 flex-col gap-4 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 id="purchases-title" className="text-3xl tracking-tighter leading-none">
            Purchases <span className="font-mono text-muted-foreground text-xl leading-none">[{purchases.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Track materials, equipment, and other purchases for your company.
          </p>
        </div>
        <NewPurchaseDrawer />
      </header>
      <RecordsTable
        records={purchases}
        columns={columns}
        label="Purchases"
        searchText={(record) => Object.values(record).join(" ")}
      />
    </section>
  );
}
