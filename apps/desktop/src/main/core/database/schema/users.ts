import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { id, syncColumns } from "./common.js";
import { organizations } from "./organizations.js";

export const users = sqliteTable(
  "users",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email"),
    ...syncColumns(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const organizationMemberships = sqliteTable(
  "organization_memberships",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "admin", "member"] })
      .notNull()
      .default("member"),
    status: text("status", { enum: ["invited", "active", "suspended"] })
      .notNull()
      .default("active"),
    joinedAt: integer("joined_at"),
    ...syncColumns(),
  },
  (table) => [
    uniqueIndex("organization_memberships_org_user_unique").on(table.organizationId, table.userId),
    index("organization_memberships_organization_idx").on(table.organizationId),
    index("organization_memberships_user_idx").on(table.userId),
  ],
);
