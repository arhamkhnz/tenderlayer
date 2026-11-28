import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import type { ContractRecord } from "@shared/contracts/contracts";
import type { EmployeeFormValues } from "@shared/schemas/employees";

import { employmentTypeLabels } from "../../-components/employee-display";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

function SummaryRows({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="max-w-2xl">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="grid items-baseline gap-x-5 gap-y-0.5 py-1.5 @min-[24rem]:grid-cols-[10rem_minmax(0,1fr)]"
        >
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="min-w-0 wrap-anywhere whitespace-pre-wrap">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmployeeOverview({
  values,
  contract,
}: {
  values: EmployeeFormValues;
  contract: ContractRecord | undefined;
}) {
  const location = values.useContractLocation
    ? [contract?.locationAddress, contract?.locationCity, contract?.locationState]
    : [values.siteLocation, values.workCity, values.workState];
  const joiningDate = new Date(`${values.joiningDate}T00:00:00Z`);
  const rows = [
    { label: "Employment type", value: employmentTypeLabels[values.employmentType] },
    { label: "Joining date", value: Number.isNaN(joiningDate.getTime()) ? "" : dateFormatter.format(joiningDate) },
    {
      label: "Contract",
      value: contract ? (
        <Link
          from="/dashboard/$organizationId/employees/$employeeId"
          to="/dashboard/$organizationId/contracts/$contractId"
          params={{ contractId: contract.id }}
          className="underline-offset-4 hover:underline focus-visible:underline"
        >
          {contract.title}
        </Link>
      ) : values.contractId ? (
        "Unavailable contract"
      ) : (
        "Unassigned"
      ),
    },
    { label: "Department", value: contract?.departmentName },
    { label: "Work location", value: location.filter(Boolean).join(", ") },
    { label: "Phone", value: values.phone },
    { label: "Email", value: values.email },
    { label: "Residential address", value: values.address },
    { label: "Notes", value: values.notes },
  ];

  return <SummaryRows rows={rows} />;
}

function maskIdentifier(value: string) {
  if (!value) return "";
  return <span className="font-mono">{value.length <= 4 ? "••••" : `•••• ${value.slice(-4)}`}</span>;
}

export function EmployeePayroll({ values }: { values: EmployeeFormValues }) {
  const wage = new Intl.NumberFormat("en-IN", { style: "currency", currency: values.currency }).format(
    values.monthlyPay as `${number}`,
  );
  const rows = [
    { label: "Monthly wage", value: wage },
    { label: "PAN", value: maskIdentifier(values.pan) },
    { label: "UAN", value: maskIdentifier(values.uan) },
    { label: "Account holder", value: values.accountHolder },
    { label: "Bank name", value: values.bankName },
    { label: "Account number", value: maskIdentifier(values.accountNumber) },
    { label: "IFSC", value: values.ifsc },
  ];

  return <SummaryRows rows={rows} />;
}
