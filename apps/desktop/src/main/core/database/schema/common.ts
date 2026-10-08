import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

export const id = () => text("id").primaryKey().$defaultFn(randomUUID);

export const syncColumns = () => ({
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  deletedAt: integer("deleted_at"),
  revision: integer("revision").notNull().default(1),
});
