import { and, eq, isNull } from "drizzle-orm";

import { getDatabase } from "@db/client";
import { employees } from "@db/schema/employees";
import { organizations } from "@db/schema/organizations";
import type { EmployeeEditorRecord } from "@shared/contracts/employees";
import { getCurrencyFractionDigits } from "@shared/money";
import type { EmployeeIdentity } from "@shared/schemas/employees";

import { employeeFormColumns, employeeScope } from "./employee-queries.js";

export function getEmployee(input: EmployeeIdentity): EmployeeEditorRecord | null {
  const employee = getDatabase()
    .select({ ...employeeFormColumns, id: employees.id, code: employees.code, revision: employees.revision })
    .from(employees)
    .innerJoin(organizations, eq(organizations.id, employees.organizationId))
    .where(and(employeeScope(input), isNull(organizations.deletedAt)))
    .get();
  if (!employee) return null;

  const { id, code, revision, monthlyPay, contractId, workState, workCity, siteLocation, ...fields } = employee;
  const fractionDigits = getCurrencyFractionDigits(fields.currency);
  const wage = String(monthlyPay).padStart(fractionDigits + 1, "0");

  return {
    id,
    code,
    revision,
    values: {
      ...fields,
      contractId: contractId ?? "",
      workState: workState ?? "",
      workCity: workCity ?? "",
      siteLocation: siteLocation ?? "",
      useContractLocation: !workState && !workCity && !siteLocation,
      monthlyPay: fractionDigits ? `${wage.slice(0, -fractionDigits)}.${wage.slice(-fractionDigits)}` : wage,
      email: fields.email ?? "",
      address: fields.address ?? "",
      pan: fields.pan ?? "",
      uan: fields.uan ?? "",
      accountHolder: fields.accountHolder ?? "",
      bankName: fields.bankName ?? "",
      accountNumber: fields.accountNumber ?? "",
      ifsc: fields.ifsc ?? "",
      notes: fields.notes ?? "",
    },
  };
}
