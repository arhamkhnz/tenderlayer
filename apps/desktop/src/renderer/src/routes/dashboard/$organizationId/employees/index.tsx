import { useEffect, useState } from "react";

import { PlusIcon } from "@keyline-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@tenderlayer/ui/components/button";
import { toast } from "@tenderlayer/ui/components/toast";

import { RouteErrorScreen } from "@/app/route-error-screen";
import type { EmployeeEditorRecord, EmployeeRecord } from "@shared/contracts/employees";
import type { EmployeeFormValues } from "@shared/schemas/employees";

import { EmployeeDeleteDialog } from "./-components/employee-delete-dialog";
import { EmployeeDrawer } from "./-components/employee-drawer";
import { EmployeeDataTable } from "./-components/table/employee-data-table";

export const Route = createFileRoute("/dashboard/$organizationId/employees/")({
  validateSearch: (search): { new?: boolean } => (search.new === undefined ? {} : { new: search.new === true }),
  shouldReload: ({ cause }) => cause === "enter",
  loader: async ({ params }) => {
    const [employees, contracts] = await Promise.all([
      window.electronAPI.employees.list(params.organizationId),
      window.electronAPI.contracts.list(params.organizationId),
    ]);
    return { employees, contracts };
  },
  remountDeps: ({ params }) => params.organizationId,
  component: EmployeesPage,
  errorComponent: EmployeesLoadError,
});

function EmployeesLoadError() {
  const router = useRouter();

  return (
    <RouteErrorScreen
      title="Couldn’t load employees"
      onRetry={() => void router.invalidate({ filter: (match) => match.routeId === Route.id })}
    />
  );
}

function EmployeesPage() {
  const router = useRouter();
  const { organizationId } = Route.useParams();
  const { employees, contracts } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { new: openNewEmployee } = Route.useSearch();
  const [drawer, setDrawer] = useState<{ open: boolean; employee?: EmployeeEditorRecord }>({
    open: openNewEmployee === true,
  });
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeRecord>();

  useEffect(() => {
    if (openNewEmployee === undefined) return;
    if (openNewEmployee) setDrawer({ open: true });
    void navigate({ search: (search) => ({ ...search, new: undefined }), replace: true });
  }, [navigate, openNewEmployee]);

  function closeDrawer() {
    setDrawer((current) => ({ ...current, open: false }));
  }

  async function editEmployee(employeeId: string) {
    if (loadingEmployee) return;
    setLoadingEmployee(true);
    try {
      const employee = await window.electronAPI.employees.get({ organizationId, employeeId });
      if (employee) setDrawer({ open: true, employee });
      else {
        toast.add({ title: "This employee is no longer available", type: "error" });
        void router.invalidate({ filter: (match) => match.routeId === Route.id });
      }
    } catch {
      toast.add({ title: "Couldn’t load the employee", type: "error" });
    } finally {
      setLoadingEmployee(false);
    }
  }

  async function saveEmployee(values: EmployeeFormValues) {
    const { employee } = drawer;
    const input = { ...values, organizationId };
    const api = window.electronAPI.employees;
    const result = await (employee
      ? api.update({ ...input, employeeId: employee.id, revision: employee.revision })
      : api.create(input));

    if (result.ok) {
      closeDrawer();
      toast.add({ title: employee ? "Employee updated" : "Employee created", type: "success" });
      void router.invalidate({ filter: (match) => match.routeId === Route.id });
    }
    return result;
  }

  async function deleteEmployee(employeeId: string) {
    const deleted = await window.electronAPI.employees.delete({ organizationId, employeeId });
    void router.invalidate({ filter: (match) => match.routeId === Route.id });
    if (deleted) toast.add({ title: "Employee deleted", type: "success" });
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
            Employees <span className="font-mono text-muted-foreground text-xl leading-none">[{employees.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Track employee records, contract assignments, and payroll details.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          aria-haspopup="dialog"
          disabled={loadingEmployee}
          onClick={() => setDrawer({ open: true })}
        >
          <PlusIcon data-icon="inline-start" />
          Add employee
        </Button>
      </header>

      <EmployeeDataTable
        data={employees}
        contracts={contracts}
        onEdit={(employeeId) => void editEmployee(employeeId)}
        onDelete={setEmployeeToDelete}
        loadingEmployee={loadingEmployee}
      />
      <EmployeeDrawer
        open={drawer.open}
        employee={drawer.employee}
        contracts={contracts}
        onClose={closeDrawer}
        onSave={saveEmployee}
      />
      <EmployeeDeleteDialog
        employee={employeeToDelete}
        onClose={() => setEmployeeToDelete(undefined)}
        onDelete={deleteEmployee}
      />
    </section>
  );
}
