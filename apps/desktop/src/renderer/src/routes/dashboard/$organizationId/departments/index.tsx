import { useState } from "react";

import { PlusIcon } from "@keyline-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tenderlayer/ui/components/alert-dialog";
import { Button } from "@tenderlayer/ui/components/button";
import { FieldError } from "@tenderlayer/ui/components/field";
import { toast } from "@tenderlayer/ui/components/toast";

import { RouteErrorScreen } from "@/app/route-error-screen";
import type { DepartmentRecord } from "@shared/contracts/departments";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  async function deleteDepartment() {
    if (!departmentToDelete || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      const deleted = await window.electronAPI.departments.delete({
        organizationId,
        departmentId: departmentToDelete.id,
      });
      void router.invalidate({ filter: (match) => match.routeId === Route.id });

      if (!deleted) {
        setDeleteError("This department is no longer available in this organization.");
        return;
      }

      setDepartmentToDelete(undefined);
      toast.add({ title: "Department deleted", type: "success" });
    } catch {
      setDeleteError("Couldn’t delete the department. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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
          Add department
        </Button>
      </header>
      <DepartmentsTable
        departments={departments}
        onEdit={(department) => setDrawer({ open: true, department })}
        onDelete={(department) => {
          setDeleteError("");
          setDepartmentToDelete(department);
        }}
      />
      <DepartmentDrawer
        open={drawer.open}
        department={drawer.department}
        onClose={closeDrawer}
        onSave={saveDepartment}
      />
      <AlertDialog
        open={Boolean(departmentToDelete)}
        onOpenChange={(open, eventDetails) => {
          if (open) return;
          if (isDeleting) eventDetails.cancel();
          else setDepartmentToDelete(undefined);
        }}
      >
        <AlertDialogContent className="w-[calc(100%-3rem)] bg-card text-card-foreground data-[size=default]:max-w-md data-[size=default]:sm:max-w-md">
          <AlertDialogHeader className="flex flex-col items-start gap-1 text-left">
            <AlertDialogTitle className="leading-snug">Delete department?</AlertDialogTitle>
            <AlertDialogDescription className="text-wrap wrap-anywhere md:text-wrap">
              Remove {departmentToDelete?.name} from this organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <FieldError>{deleteError}</FieldError>}
          <AlertDialogFooter className="mx-0 mb-0 border-0 bg-transparent p-0">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void deleteDepartment()}
            >
              {isDeleting ? "Deleting…" : "Delete department"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
