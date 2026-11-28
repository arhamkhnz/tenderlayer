import { sql } from "drizzle-orm";
import { check, foreignKey, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { employeeEmploymentTypes, employeeStatuses } from "@shared/schemas/employees";

import { id, syncColumns } from "./common.js";
import { contracts } from "./contracts.js";
import { organizations } from "./organizations.js";

const employmentTypeValues = sql.join(
  employeeEmploymentTypes.map((type) => sql`${type}`),
  sql`, `,
);
const employeeStatusValues = sql.join(
  employeeStatuses.map((status) => sql`${status}`),
  sql`, `,
);

export const employees = sqliteTable(
  "employees",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    contractId: text("contract_id"),
    name: text("name").notNull(),
    code: text("code").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    address: text("address"),
    jobTitle: text("job_title").notNull(),
    employmentType: text("employment_type", { enum: employeeEmploymentTypes }).notNull().default("full-time"),
    joiningDate: text("joining_date").notNull(),
    status: text("status", { enum: employeeStatuses }).notNull().default("active"),
    workState: text("work_state"),
    workCity: text("work_city"),
    siteLocation: text("site_location"),
    // Store monthly pay in whole minor units, such as paise for INR.
    monthlyPay: integer("monthly_pay").notNull(),
    currency: text("currency").notNull().default("INR"),
    pan: text("pan"),
    uan: text("uan"),
    accountHolder: text("account_holder"),
    bankName: text("bank_name"),
    accountNumber: text("account_number"),
    ifsc: text("ifsc"),
    notes: text("notes"),
    ...syncColumns(),
  },
  (table) => [
    foreignKey({
      name: "employees_contract_organization_fk",
      columns: [table.organizationId, table.contractId],
      foreignColumns: [contracts.organizationId, contracts.id],
    }),
    index("employees_organization_contract_idx").on(table.organizationId, table.contractId),
    uniqueIndex("employees_organization_code_unique").on(table.organizationId, table.code),
    check(
      "employees_name_check",
      sql`length(${table.name}) > 0 and ${table.name} = trim(${table.name}) and instr(${table.name}, char(0)) = 0`,
    ),
    check(
      "employees_code_check",
      sql`${table.code} glob 'EMP-[0-9]*' and substr(${table.code}, 5) not glob '*[^0-9]*' and instr(${table.code}, char(0)) = 0`,
    ),
    check("employees_phone_check", sql`length(trim(${table.phone})) > 0 and instr(${table.phone}, char(0)) = 0`),
    check(
      "employees_job_title_check",
      sql`length(trim(${table.jobTitle})) > 0 and instr(${table.jobTitle}, char(0)) = 0`,
    ),
    check("employees_employment_type_check", sql`${table.employmentType} in (${employmentTypeValues})`.inlineParams()),
    check("employees_status_check", sql`${table.status} in (${employeeStatusValues})`.inlineParams()),
    check("employees_joining_date_check", sql`date(${table.joiningDate}, '+0 days') is ${table.joiningDate}`),
    check("employees_monthly_pay_check", sql`typeof(${table.monthlyPay}) = 'integer' and ${table.monthlyPay} > 0`),
    check("employees_currency_check", sql`${table.currency} glob '[A-Z][A-Z][A-Z]'`),
  ],
);
