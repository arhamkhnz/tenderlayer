import { purchases } from "./data";
import { NewPurchaseDrawer } from "./new-purchase-drawer";
import { PurchasesTable } from "./table/purchases-table";

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
      <PurchasesTable records={purchases} />
    </section>
  );
}
