import { sql } from "drizzle-orm";
import { check, foreignKey, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { contractStatuses } from "@shared/contract-statuses";

import { id, syncColumns } from "./common.js";
import { departments } from "./departments.js";
import { organizations } from "./organizations.js";

const contractStatusValues = sql.join(
  contractStatuses.map((status) => sql`${status}`),
  sql`, `,
);

export const contracts = sqliteTable(
  "contracts",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    departmentId: text("department_id"),
    title: text("title").notNull(),
    gemReference: text("gem_reference"),
    locationState: text("location_state"),
    locationCity: text("location_city"),
    locationAddress: text("location_address"),
    status: text("status", { enum: contractStatuses }).notNull().default("draft"),
    // Store whole minor units, such as paise for INR or cents for USD.
    amount: integer("amount"),
    currency: text("currency").notNull().default("INR"),
    includesTax: integer("includes_tax", { mode: "boolean" }).notNull().default(false),
    workOrderReceivedDate: text("work_order_received_date"),
    startDate: text("start_date"),
    duration: integer("duration"),
    durationUnit: text("duration_unit", { enum: ["days", "months", "years"] })
      .notNull()
      .default("months"),
    endDate: text("end_date"),
    requiredHeadcount: integer("required_headcount"),
    deployedHeadcount: integer("deployed_headcount").notNull().default(0),
    notes: text("notes"),
    ...syncColumns(),
  },
  (table) => [
    foreignKey({
      name: "contracts_department_organization_fk",
      columns: [table.organizationId, table.departmentId],
      foreignColumns: [departments.organizationId, departments.id],
    }),
    index("contracts_organization_department_idx").on(table.organizationId, table.departmentId),
    check("contracts_title_check", sql`length(${table.title}) > 0 and ${table.title} = trim(${table.title})`),
    check("contracts_status_check", sql`${table.status} in (${contractStatusValues})`.inlineParams()),
    check(
      "contracts_non_draft_fields_check",
      sql`${table.status} = 'draft' or (
        ${table.departmentId} is not null
        and coalesce(length(trim(${table.gemReference})), 0) > 0
        and coalesce(length(trim(${table.locationState})), 0) > 0
        and coalesce(length(trim(${table.locationCity})), 0) > 0
        and ${table.amount} is not null
        and ${table.startDate} is not null
        and ${table.duration} is not null
        and ${table.requiredHeadcount} is not null
      )`,
    ),
    check(
      "contracts_amount_check",
      sql`${table.amount} is null or (typeof(${table.amount}) = 'integer' and ${table.amount} >= 0)`,
    ),
    check("contracts_currency_check", sql`${table.currency} glob '[A-Z][A-Z][A-Z]'`),
    check("contracts_includes_tax_check", sql`${table.includesTax} in (0, 1)`),
    check(
      "contracts_duration_check",
      sql`${table.duration} is null or (typeof(${table.duration}) = 'integer' and ${table.duration} > 0)`,
    ),
    check("contracts_duration_unit_check", sql`${table.durationUnit} in ('days', 'months', 'years')`),
    check(
      "contracts_date_order_check",
      sql`${table.startDate} is null or ${table.endDate} is null or ${table.endDate} >= ${table.startDate}`,
    ),
    check(
      "contracts_required_headcount_check",
      sql`${table.requiredHeadcount} is null or (typeof(${table.requiredHeadcount}) = 'integer' and ${table.requiredHeadcount} >= 0)`,
    ),
    check(
      "contracts_deployed_headcount_check",
      sql`typeof(${table.deployedHeadcount}) = 'integer' and ${table.deployedHeadcount} >= 0`,
    ),
  ],
);
