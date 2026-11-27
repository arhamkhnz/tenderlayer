import { useEffect, useState } from "react";

import { FilePlusIcon } from "@keyline-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@tenderlayer/ui/components/button";
import { toast } from "@tenderlayer/ui/components/toast";

import { RouteErrorScreen } from "@/app/route-error-screen";
import type { ContractRecord } from "@shared/contracts/contracts";
import type { ContractFormValues } from "@shared/schemas/contracts";

import { ContractDeleteDialog } from "./-components/contract-delete-dialog";
import { ContractDrawer } from "./-components/contract-drawer";
import { ContractsTable } from "./-components/table/contracts-table";

export const Route = createFileRoute("/dashboard/$organizationId/contracts/")({
  validateSearch: (search): { new?: boolean } => (search.new === undefined ? {} : { new: search.new === true }),
  shouldReload: ({ cause }) => cause === "enter",
  loader: async ({ params }) => {
    const [contracts, departments] = await Promise.all([
      window.electronAPI.contracts.list(params.organizationId),
      window.electronAPI.departments.list(params.organizationId),
    ]);
    return { contracts, departments };
  },
  component: ContractsPage,
  errorComponent: ContractsLoadError,
});

function ContractsLoadError() {
  const router = useRouter();

  return (
    <RouteErrorScreen
      title="Couldn’t load contracts"
      onRetry={() => void router.invalidate({ filter: (match) => match.routeId === Route.id })}
    />
  );
}

function ContractsPage() {
  const router = useRouter();
  const { organizationId } = Route.useParams();
  const { contracts, departments } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { new: openNewContract } = Route.useSearch();
  const [drawer, setDrawer] = useState<{ open: boolean; contract?: ContractRecord }>({
    open: openNewContract === true,
  });
  const [contractToDelete, setContractToDelete] = useState<ContractRecord>();

  useEffect(() => {
    if (openNewContract === undefined) return;
    if (openNewContract) setDrawer({ open: true });
    void navigate({ search: (search) => ({ ...search, new: undefined }), replace: true });
  }, [navigate, openNewContract]);

  function closeDrawer() {
    setDrawer((current) => ({ ...current, open: false }));
  }

  async function saveContract(values: ContractFormValues) {
    const input = { ...values, organizationId };
    const { contract } = drawer;
    const api = window.electronAPI.contracts;

    const result = await (contract ? api.update({ ...input, contractId: contract.id }) : api.create(input));
    if (!result.ok) return result;

    closeDrawer();
    toast.add({
      title: contract ? "Contract updated" : values.status === "draft" ? "Draft saved" : "Contract created",
      type: "success",
    });
    void router.invalidate({ filter: (match) => match.routeId === Route.id });

    return result;
  }

  async function deleteContract(contractId: string) {
    const deleted = await window.electronAPI.contracts.delete({ organizationId, contractId });
    void router.invalidate({ filter: (match) => match.routeId === Route.id });
    if (deleted) toast.add({ title: "Contract deleted", type: "success" });
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
            Contracts <span className="font-mono text-muted-foreground text-xl leading-none">[{contracts.length}]</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Track awarded work, delivery periods, assigned teams, and commercial records.
          </p>
        </div>
        <Button type="button" size="sm" aria-haspopup="dialog" onClick={() => setDrawer({ open: true })}>
          <FilePlusIcon data-icon="inline-start" />
          New contract
        </Button>
      </header>

      <ContractsTable
        contracts={contracts}
        onEdit={(contract) => setDrawer({ open: true, contract })}
        onDelete={setContractToDelete}
      />
      <ContractDrawer
        open={drawer.open}
        contract={drawer.contract}
        departments={departments}
        onClose={closeDrawer}
        onSave={saveContract}
      />
      <ContractDeleteDialog
        contract={contractToDelete}
        onClose={() => setContractToDelete(undefined)}
        onDelete={deleteContract}
      />
    </section>
  );
}
