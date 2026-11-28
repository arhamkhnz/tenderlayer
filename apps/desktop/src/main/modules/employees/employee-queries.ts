import { and, eq, isNull } from "drizzle-orm";

import type { DatabaseClient } from "@db/client";
import { contracts } from "@db/schema/contracts";
import { employees } from "@db/schema/employees";
import { parseMoneyAmount } from "@shared/money";
import {
  hasContractWorkLocation,
  type CreateEmployeeInput,
  type EmployeeFormValues,
  type EmployeeIdentity,
} from "@shared/schemas/employees";

export const employeeFormColumns = {
  name: employees.name,
  phone: employees.phone,
  email: employees.email,
  address: employees.address,
  contractId: employees.contractId,
  jobTitle: employees.jobTitle,
  employmentType: employees.employmentType,
  joiningDate: employees.joiningDate,
  monthlyPay: employees.monthlyPay,
  currency: employees.currency,
  workState: employees.workState,
  workCity: employees.workCity,
  siteLocation: employees.siteLocation,
  status: employees.status,
  pan: employees.pan,
  uan: employees.uan,
  accountHolder: employees.accountHolder,
  bankName: employees.bankName,
  accountNumber: employees.accountNumber,
  ifsc: employees.ifsc,
  notes: employees.notes,
};

export function employeeScope({ organizationId, employeeId }: EmployeeIdentity) {
  return and(eq(employees.id, employeeId), eq(employees.organizationId, organizationId), isNull(employees.deletedAt));
}

export function getEmployeeContractError(
  database: Pick<DatabaseClient, "select">,
  { organizationId, contractId, useContractLocation }: CreateEmployeeInput,
  currentContractId?: string | null,
) {
  if (!contractId || (contractId === currentContractId && !useContractLocation)) return;

  const contract = database
    .select({ locationState: contracts.locationState, locationCity: contracts.locationCity })
    .from(contracts)
    .where(and(eq(contracts.id, contractId), eq(contracts.organizationId, organizationId), isNull(contracts.deletedAt)))
    .get();
  if (!contract) {
    return contractId === currentContractId
      ? "Enter a work location manually for this contract."
      : "Select an available contract.";
  }
  if (useContractLocation && !hasContractWorkLocation(contract)) {
    return "This contract has no work location yet. Enter a work location manually.";
  }
}

export function employeeValues(input: EmployeeFormValues) {
  const monthlyPay = parseMoneyAmount(input.monthlyPay, input.currency);
  if (monthlyPay === null || monthlyPay <= 0) throw new Error("Invalid monthly wage");

  const inheritLocation = Boolean(input.contractId && input.useContractLocation);
  return {
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    address: input.address || null,
    contractId: input.contractId || null,
    jobTitle: input.jobTitle,
    employmentType: input.employmentType,
    joiningDate: input.joiningDate,
    monthlyPay,
    currency: input.currency,
    workState: inheritLocation ? null : input.workState || null,
    workCity: inheritLocation ? null : input.workCity || null,
    siteLocation: inheritLocation ? null : input.siteLocation || null,
    status: input.status,
    pan: input.pan || null,
    uan: input.uan || null,
    accountHolder: input.accountHolder || null,
    bankName: input.bankName || null,
    accountNumber: input.accountNumber || null,
    ifsc: input.ifsc || null,
    notes: input.notes || null,
  };
}
