import { isNull, sql } from "drizzle-orm";
import { check, index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { id, syncColumns } from "./common.js";
import { organizations } from "./organizations.js";

export const departments = sqliteTable(
  "departments",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code"),
    ...syncColumns(),
  },
  (table) => [
    index("departments_organization_idx").on(table.organizationId),
    uniqueIndex("departments_organization_department_unique").on(table.organizationId, table.id),
    uniqueIndex("departments_organization_name_unique")
      .on(table.organizationId, sql`lower(${sql.identifier(table.name.name)})`)
      .where(isNull(table.deletedAt)),
    uniqueIndex("departments_organization_code_unique")
      .on(table.organizationId, sql`lower(${sql.identifier(table.code.name)})`)
      .where(isNull(table.deletedAt)),
    check(
      "departments_name_check",
      sql`length(${table.name}) > 0 and ${table.name} = trim(${table.name}) and instr(${table.name}, char(0)) = 0`,
    ),
    check(
      "departments_code_check",
      sql`${table.code} is null or (length(${table.code}) > 0 and ${table.code} = trim(${table.code}) and instr(${table.code}, char(0)) = 0)`,
    ),
  ],
);
