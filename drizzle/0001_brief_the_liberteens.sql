PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	`revision` integer DEFAULT 1 NOT NULL,
	CONSTRAINT "organizations_name_check" CHECK(length("__new_organizations"."name") between 2 and 120 and "__new_organizations"."name" = trim("__new_organizations"."name")),
	CONSTRAINT "organizations_slug_check" CHECK(length("__new_organizations"."slug") between 1 and 80 and "__new_organizations"."slug" not glob '*[^a-z0-9-]*' and substr("__new_organizations"."slug", 1, 1) <> '-' and substr("__new_organizations"."slug", -1, 1) <> '-' and instr("__new_organizations"."slug", '--') = 0)
);
--> statement-breakpoint
INSERT INTO `__new_organizations`("id", "name", "slug", "created_at", "updated_at", "deleted_at", "revision") SELECT "id", "name", "slug", "created_at", "updated_at", "deleted_at", "revision" FROM `organizations`;--> statement-breakpoint
DROP TABLE `organizations`;--> statement-breakpoint
ALTER TABLE `__new_organizations` RENAME TO `organizations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);