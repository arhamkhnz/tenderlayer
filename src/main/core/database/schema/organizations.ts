import { sql } from "drizzle-orm";
import { check, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, syncColumns } from "./common.js";

export const organizations = sqliteTable(
  "organizations",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    ...syncColumns(),
  },
  (table) => [
    check(
      "organizations_name_check",
      sql`length(${table.name}) between 2 and 120 and ${table.name} = trim(${table.name})`,
    ),
    check(
      "organizations_slug_check",
      sql`length(${table.slug}) between 1 and 80 and ${table.slug} not glob '*[^a-z0-9-]*' and substr(${table.slug}, 1, 1) <> '-' and substr(${table.slug}, -1, 1) <> '-' and instr(${table.slug}, '--') = 0`,
    ),
    uniqueIndex("organizations_slug_unique").on(table.slug),
  ],
);

export type Organization = typeof organizations.$inferSelect;
