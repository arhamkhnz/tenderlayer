import { useState } from "react";

import { ArrowLeftIcon, PenLineIcon } from "@keyline-icons/react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { cn } from "cn";

import { Badge } from "@tenderlayer/ui/components/badge";
import { Button, buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tenderlayer/ui/components/tabs";
import { toast } from "@tenderlayer/ui/components/toast";

import { RouteErrorScreen } from "@/app/route-error-screen";
import type { ContractFormValues } from "@shared/schemas/contracts";

import { contractStatusDisplay } from "../-components/contract-display";
import { ContractDrawer } from "../-components/contract-drawer";
import { ContractRecordPanels, ContractRecordTabs } from "./-components/contract-related-records";
import { ContractSummary } from "./-components/contract-summary";

export const Route = createFileRoute("/dashboard/$organizationId/contracts/$contractId")({
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ params: { organizationId, contractId } }) => {
      const contract = await window.electronAPI.contracts.get({ organizationId, contractId });
      if (!contract) throw notFound({ routeId: Route.id });
      const departments = await window.electronAPI.departments.list(organizationId);
      return { contract, departments };
    },
  },
  component: ContractDetailsPage,
  errorComponent: ContractLoadError,
  notFoundComponent: ContractNotFound,
});

function ContractLoadError() {
  const router = useRouter();

  return (
    <RouteErrorScreen
      title="Couldn’t load the contract"
      onRetry={() => void router.invalidate({ filter: (match) => match.routeId === Route.id })}
    />
  );
}

function ContractsLink() {
  return (
    <Link
      from={Route.fullPath}
      to="/dashboard/$organizationId/contracts"
      aria-label="Back to contracts"
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
      Back
    </Link>
  );
}

function ContractNotFound() {
  return (
    <section
      data-content-padding="false"
      className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center p-6"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle role="heading" aria-level={1}>
            Contract not found
          </CardTitle>
          <CardDescription>This contract isn’t available in the current organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContractsLink />
        </CardContent>
      </Card>
    </section>
  );
}

function ContractDetailsPage() {
  const router = useRouter();
  const { organizationId, contractId } = Route.useParams();
  const { contract, departments } = Route.useLoaderData();
  const [editOpen, setEditOpen] = useState(false);
  const status = contractStatusDisplay[contract.status];

  async function updateContract(values: ContractFormValues) {
    const result = await window.electronAPI.contracts.update({ ...values, organizationId, contractId });
    if (!result.ok) return result;

    setEditOpen(false);
    toast.add({ title: "Contract updated", type: "success" });
    void router.invalidate({
      filter: (match) => match.routeId === Route.id || match.routeId === "/dashboard/$organizationId/contracts/",
    });
    return result;
  }

  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col"
    >
      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 p-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="min-w-0 text-3xl leading-tight tracking-tighter wrap-anywhere">{contract.title}</h1>
          <Badge variant="secondary" className={cn("rounded-md px-1.5 font-450", status.className)}>
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" size="sm" aria-haspopup="dialog" onClick={() => setEditOpen(true)}>
            <PenLineIcon data-icon="inline-start" aria-hidden="true" />
            Edit contract
          </Button>
          <ContractsLink />
        </div>
      </div>

      <Tabs key={contract.id} defaultValue="overview" className="min-h-0 min-w-0 flex-1 gap-0">
        <div className="shrink-0 overflow-x-auto border-b border-border/60 ps-0.75 pe-4 pb-0.5">
          <TabsList
            variant="line"
            aria-label="Contract sections"
            className="h-10! px-0 *:data-[slot=tabs-trigger]:px-3"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <ContractRecordTabs />
          </TabsList>
        </div>
        <TabsContent value="overview" className="@container min-h-0 min-w-0 overflow-y-auto px-4 pt-1 pb-4">
          <ContractSummary contract={contract} />
        </TabsContent>
        <ContractRecordPanels />
      </Tabs>
      <ContractDrawer
        open={editOpen}
        contract={contract}
        departments={departments}
        onClose={() => setEditOpen(false)}
        onSave={updateContract}
      />
    </section>
  );
}
