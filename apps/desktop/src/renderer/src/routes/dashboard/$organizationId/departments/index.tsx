import { useState } from "react";

import { PlusIcon } from "@keyline-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@tenderlayer/ui/components/button";
import { toast } from "@tenderlayer/ui/components/toast";

import { RouteErrorScreen } from "@/app/route-error-screen";
import type { DepartmentRecord } from "@shared/contracts/departments";

import { DepartmentDeleteDialog } from "./-components/department-delete-dialog";
import { DepartmentDrawer, type DepartmentFormValues } from "./-components/department-drawer";
import { DepartmentsTable } from "./-components/table/departments-table";

export const Route = createFileRoute("/dashboard/$organizationId/departments/")({
  loader: ({ params }) => window.electronAPI.departments.list(params.organizationId),
  component: DepartmentsPage,
  errorComponent: DepartmentsLoadError,
});

function DepartmentsLoadError() {
  const router = useRouter();

  return (
    <RouteErrorScreen
      title="Couldn’t load departments"
      onRetry={() => void router.invalidate({ filter: (match) => match.routeId === Route.id })}
    />
  );
}

function DepartmentsPage() {
  const router = useRouter();
  const { organizationId } = Route.useParams();
  const departments = Route.useLoaderData();
  const [drawer, setDrawer] = useState<{ open: boolean; department?: DepartmentRecord }>({ open: false });
  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentRecord>();

  function closeDrawer() {
    setDrawer((current) => ({ ...current, open: false }));
  }

  async function saveDepartment(values: DepartmentFormValues) {
    const input = { ...values, organizationId };
    const { department } = drawer;
    const api = window.electronAPI.departments;

    const result = await (department ? api.update({ ...input, departmentId: department.id }) : api.create(input));
    if (!result.ok) return result;

    closeDrawer();
    toast.add({ title: department ? "Department updated" : "Department created", type: "success" });
    void router.invalidate({ filter: (match) => match.routeId === Route.id });

    return result;
  }

  async function deleteDepartment(departmentId: string) {
    const deleted = await window.electronAPI.departments.delete({ organizationId, departmentId });
    void router.invalidate({ filter: (match) => match.routeId === Route.id });
    if (deleted) toast.add({ title: "Department deleted", type: "success" });
    return deleted;
  }

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
        <Button type="button" size="sm" aria-haspopup="dialog" onClick={() => setDrawer({ open: true })}>
          <PlusIcon data-icon="inline-start" />
          New department
        </Button>
      </header>
      <DepartmentsTable
        departments={departments}
        onEdit={(department) => setDrawer({ open: true, department })}
        onDelete={setDepartmentToDelete}
      />
      <DepartmentDrawer
        open={drawer.open}
        department={drawer.department}
        onClose={closeDrawer}
        onSave={saveDepartment}
      />
      <DepartmentDeleteDialog
        department={departmentToDelete}
        onClose={() => setDepartmentToDelete(undefined)}
        onDelete={deleteDepartment}
      />
    </section>
  );
}
