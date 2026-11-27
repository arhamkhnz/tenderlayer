import { CopyIcon } from "@keyline-icons/react";

import { Button } from "@tenderlayer/ui/components/button";
import { toast } from "@tenderlayer/ui/components/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@tenderlayer/ui/components/tooltip";

import { calculateEndDate } from "@shared/contract-dates";
import type { ContractRecord } from "@shared/contracts/contracts";

import { formatContractAmount, formatContractDate } from "../../-components/contract-display";

async function copyGemReference(reference: string) {
  try {
    await navigator.clipboard.writeText(reference);
  } catch {
    toast.add({ title: "Couldn’t copy GeM reference", type: "error" });
    return;
  }

  toast.add({ title: "GeM reference copied", type: "success" });
}

export function ContractSummary({ contract }: { contract: ContractRecord }) {
  const { gemReference } = contract;
  const location = [contract.locationAddress, contract.locationCity, contract.locationState].filter(Boolean).join(", ");
  const durationUnit = contract.duration === 1 ? contract.durationUnit.slice(0, -1) : contract.durationUnit;
  const scheduledEndDate = calculateEndDate(
    contract.startDate ?? "",
    contract.duration?.toString() ?? "",
    contract.durationUnit,
  );
  const amount = contract.amount === null ? null : formatContractAmount(contract.amount, contract.currency);
  const rows = [
    { label: "Department", value: contract.departmentName ?? "—" },
    {
      label: "GeM reference",
      value: gemReference ? (
        <span className="inline-flex max-w-full items-center gap-1">
          <code className="min-w-0 font-mono wrap-anywhere select-text">{gemReference}</code>
          <Tooltip>
            <TooltipTrigger
              render={<Button type="button" variant="ghost" size="icon-xs" className="text-muted-foreground" />}
              aria-label="Copy GeM reference"
              onClick={() => void copyGemReference(gemReference)}
            >
              <CopyIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Copy GeM reference</TooltipContent>
          </Tooltip>
        </span>
      ) : (
        "—"
      ),
    },
    { label: "Work location", value: location || "—" },
    {
      label: "Contract value",
      value: amount ?? "—",
      detail: amount && (contract.includesTax ? "Tax included" : "Tax excluded"),
    },
    { label: "Work order received", value: formatContractDate(contract.workOrderReceivedDate) },
    { label: "Start date", value: formatContractDate(contract.startDate) },
    { label: "Scheduled end date", value: formatContractDate(scheduledEndDate) },
    { label: "Ended on", value: formatContractDate(contract.endDate) },
    { label: "Duration", value: contract.duration === null ? "—" : `${contract.duration} ${durationUnit}` },
    { label: "Employees required", value: contract.requiredHeadcount ?? "—" },
    { label: "Employees deployed", value: contract.deployedHeadcount },
    { label: "Notes", value: contract.notes || "—" },
  ];

  return (
    <dl className="max-w-2xl">
      {rows.map(({ label, value, detail }) => (
        <div
          key={label}
          className="grid items-baseline gap-x-5 gap-y-0.5 py-1.5 @min-[24rem]:grid-cols-[10rem_minmax(0,1fr)]"
        >
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className="min-w-0 wrap-anywhere whitespace-pre-wrap">{value}</span>
            {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
