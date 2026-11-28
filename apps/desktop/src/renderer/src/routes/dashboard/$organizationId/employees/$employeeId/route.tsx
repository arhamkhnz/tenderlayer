import { useState, type CSSProperties } from "react";

import { ArrowLeftIcon, PenLineIcon } from "@keyline-icons/react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { cn } from "cn";

import { Avatar, AvatarFallback } from "@tenderlayer/ui/components/avatar";
import { Badge } from "@tenderlayer/ui/components/badge";
import { Button, buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tenderlayer/ui/components/tabs";
import { toast } from "@tenderlayer/ui/components/toast";
import { getAvatarColors } from "@tenderlayer/ui/lib/avatar-colors";
import { getInitials } from "@tenderlayer/ui/lib/utils";

import { RouteErrorScreen } from "@/app/route-error-screen";
import type { EmployeeFormValues } from "@shared/schemas/employees";

import { employeeStatusDisplay } from "../-components/employee-display";
import { EmployeeDrawer } from "../-components/employee-drawer";
import { EmployeeOverview, EmployeePayroll } from "./-components/employee-summary";

export const Route = createFileRoute("/dashboard/$organizationId/employees/$employeeId")({
  gcTime: 0,
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ params: { organizationId, employeeId } }) => {
      const employee = await window.electronAPI.employees.get({ organizationId, employeeId });
      if (!employee) throw notFound({ routeId: Route.id });
      const contracts = await window.electronAPI.contracts.list(organizationId);
      return { employee, contracts };
    },
  },
  remountDeps: ({ params }) => [params.organizationId, params.employeeId],
  component: EmployeeDetailsPage,
  errorComponent: EmployeeLoadError,
  notFoundComponent: EmployeeNotFound,
});

function EmployeeLoadError() {
  const router = useRouter();

  return (
    <RouteErrorScreen
      title="Couldn’t load the employee"
      onRetry={() => void router.invalidate({ filter: (match) => match.routeId === Route.id })}
    />
  );
}

function EmployeesLink() {
  return (
    <Link
      from={Route.fullPath}
      to="/dashboard/$organizationId/employees"
      aria-label="Back to employees"
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
      Back
    </Link>
  );
}

function EmployeeNotFound() {
  return (
    <section
      data-content-padding="false"
      className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center p-6"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle role="heading" aria-level={1}>
            Employee not found
          </CardTitle>
          <CardDescription>This employee isn’t available in the current organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesLink />
        </CardContent>
      </Card>
    </section>
  );
}

function EmployeeDetailsPage() {
  const router = useRouter();
  const { organizationId, employeeId } = Route.useParams();
  const { employee, contracts } = Route.useLoaderData();
  const [editOpen, setEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(employee);
  const [loadingEditor, setLoadingEditor] = useState(false);
  const { name, jobTitle, contractId } = employee.values;
  const avatarColors = getAvatarColors(name);
  const status = employeeStatusDisplay[employee.values.status];
  const contract = contracts.find(({ id }) => id === contractId);

  async function openEditor() {
    setLoadingEditor(true);
    try {
      const currentEmployee = await window.electronAPI.employees.get({ organizationId, employeeId });
      if (!currentEmployee) {
        void router.invalidate({ filter: (match) => match.routeId === Route.id });
        return;
      }
      setEditingEmployee(currentEmployee);
      setEditOpen(true);
    } catch {
      toast.add({ title: "Couldn’t load the employee", type: "error" });
    } finally {
      setLoadingEditor(false);
    }
  }

  async function updateEmployee(values: EmployeeFormValues) {
    const result = await window.electronAPI.employees.update({
      ...values,
      organizationId,
      employeeId,
      revision: editingEmployee.revision,
    });
    if (!result.ok) return result;

    setEditOpen(false);
    toast.add({ title: "Employee updated", type: "success" });
    void router.invalidate({
      filter: (match) => match.routeId === Route.id || match.routeId === "/dashboard/$organizationId/employees/",
    });
    return result;
  }

  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col"
    >
      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg" className="rounded-sm after:hidden data-[size=lg]:size-12" aria-hidden="true">
            <AvatarFallback
              className="rounded-sm bg-(--avatar-bg) font-mono text-2xl text-(--avatar-fg) ring-1 ring-inset ring-(--avatar-outline) dark:bg-(--avatar-dark-bg) dark:text-(--avatar-dark-fg) dark:ring-(--avatar-dark-outline)"
              style={
                {
                  "--avatar-bg": avatarColors.light.background,
                  "--avatar-fg": avatarColors.light.foreground,
                  "--avatar-outline": avatarColors.light.outline,
                  "--avatar-dark-bg": avatarColors.dark.background,
                  "--avatar-dark-fg": avatarColors.dark.foreground,
                  "--avatar-dark-outline": avatarColors.dark.outline,
                } as CSSProperties
              }
            >
              {getInitials(name, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="min-w-0 text-3xl leading-tight tracking-tighter wrap-anywhere">{name}</h1>
              <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", status.className)}>
                {status.label}
              </Badge>
            </div>
            <p className="flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground">
              <span className="font-mono">{employee.code}</span>
              <span aria-hidden="true">·</span>
              <span className="min-w-0 wrap-anywhere">{jobTitle}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            aria-haspopup="dialog"
            disabled={loadingEditor}
            onClick={() => void openEditor()}
          >
            <PenLineIcon data-icon="inline-start" aria-hidden="true" />
            Edit employee
          </Button>
          <EmployeesLink />
        </div>
      </div>

      <Tabs defaultValue="overview" className="min-h-0 min-w-0 flex-1 gap-0">
        <div className="shrink-0 overflow-x-auto border-b border-border/60 ps-0.75 pe-4 pb-0.5">
          <TabsList
            variant="line"
            aria-label="Employee sections"
            className="h-10! px-0 *:data-[slot=tabs-trigger]:px-3"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="@container min-h-0 min-w-0 overflow-y-auto px-4 pt-1 pb-4">
          <EmployeeOverview values={employee.values} contract={contract} />
        </TabsContent>
        <TabsContent value="payroll" className="@container min-h-0 min-w-0 overflow-y-auto px-4 pt-1 pb-4">
          <EmployeePayroll values={employee.values} />
        </TabsContent>
      </Tabs>
      <EmployeeDrawer
        open={editOpen}
        employee={editingEmployee}
        contracts={contracts}
        onClose={() => setEditOpen(false)}
        onSave={updateEmployee}
      />
    </section>
  );
}
