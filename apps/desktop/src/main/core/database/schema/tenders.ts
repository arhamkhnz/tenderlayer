import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, syncColumns } from "./common.js";
import { organizations } from "./organizations.js";

export const opportunities = sqliteTable(
  "opportunities",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    source: text("source"),
    externalReference: text("external_reference"),
    status: text("status", { enum: ["draft", "open", "closed", "archived"] })
      .notNull()
      .default("draft"),
    publishedOn: text("published_on"),
    closesOn: text("closes_on"),
    ...syncColumns(),
  },
  (table) => [
    index("opportunities_organization_idx").on(table.organizationId),
    index("opportunities_org_status_idx").on(table.organizationId, table.status),
  ],
);

export const bids = sqliteTable(
  "bids",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    opportunityId: text("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    reference: text("reference"),
    status: text("status", {
      enum: ["draft", "preparing", "submitted", "won", "lost", "withdrawn", "archived"],
    })
      .notNull()
      .default("draft"),
    submittedAt: integer("submitted_at"),
    ...syncColumns(),
  },
  (table) => [
    index("bids_organization_idx").on(table.organizationId),
    index("bids_opportunity_idx").on(table.opportunityId),
    index("bids_org_status_idx").on(table.organizationId, table.status),
  ],
);

export const contracts = sqliteTable(
  "contracts",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    bidId: text("bid_id").references(() => bids.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    reference: text("reference"),
    status: text("status", { enum: ["draft", "active", "completed", "terminated", "archived"] })
      .notNull()
      .default("draft"),
    startsOn: text("starts_on"),
    endsOn: text("ends_on"),
    ...syncColumns(),
  },
  (table) => [
    index("contracts_organization_idx").on(table.organizationId),
    index("contracts_bid_idx").on(table.bidId),
    index("contracts_org_status_idx").on(table.organizationId, table.status),
  ],
);
