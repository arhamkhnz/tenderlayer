import { departments } from "./data";
import { DepartmentsTable } from "./departments-table";
import { NewDepartmentDrawer } from "./new-department-drawer";

export function DepartmentsScreen() {
  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background"
    >
      <header className="flex shrink-0 flex-col gap-4 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tighter leading-none">
            Departments{" "}
            <span className="font-mono text-muted-foreground text-xl leading-none">[{departments.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">Manage the departments in your organization.</p>
        </div>
        <NewDepartmentDrawer />
      </header>
      <DepartmentsTable departments={departments} />
    </section>
  );
}
