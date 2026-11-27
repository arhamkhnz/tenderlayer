CREATE TABLE `departments` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`code` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	`revision` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "departments_name_check" CHECK(length("departments"."name") > 0 and "departments"."name" = trim("departments"."name") and instr("departments"."name", char(0)) = 0),
	CONSTRAINT "departments_code_check" CHECK("departments"."code" is null or (length("departments"."code") > 0 and "departments"."code" = trim("departments"."code") and instr("departments"."code", char(0)) = 0))
);
--> statement-breakpoint
CREATE INDEX `departments_organization_idx` ON `departments` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `departments_organization_name_unique` ON `departments` (`organization_id`,lower("name")) WHERE "departments"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX `departments_organization_code_unique` ON `departments` (`organization_id`,lower("code")) WHERE "departments"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	`revision` integer DEFAULT 1 NOT NULL,
	CONSTRAINT "organizations_name_check" CHECK(length("organizations"."name") between 2 and 120 and "organizations"."name" = trim("organizations"."name")),
	CONSTRAINT "organizations_slug_check" CHECK(length("organizations"."slug") between 1 and 80 and "organizations"."slug" not glob '*[^a-z0-9-]*' and substr("organizations"."slug", 1, 1) <> '-' and substr("organizations"."slug", -1, 1) <> '-' and instr("organizations"."slug", '--') = 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_name_unique` ON `organizations` (lower("name")) WHERE "organizations"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);
