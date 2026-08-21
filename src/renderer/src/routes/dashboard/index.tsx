import {
  BriefcaseIcon,
  ClockCountdownIcon,
  FileTextIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";

import { MetricStrip } from "./-components/screen";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl tracking-tight leading-none">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Here's an overview of your firm's operations.</p>
      </div>

      <MetricStrip
        variant="cards"
        items={[
          { label: "Active contracts", value: "12", detail: "Across 5 departments", icon: BriefcaseIcon },
          { label: "Ending in 30 days", value: "3", detail: "₹18.4L total value", icon: ClockCountdownIcon },
          { label: "Draft contracts", value: "4", detail: "2 awaiting review", icon: FileTextIcon },
          { label: "Open invoices", value: "₹7.8L", detail: "6 invoices", icon: ReceiptIcon },
        ]}
      />
    </div>
  );
}
