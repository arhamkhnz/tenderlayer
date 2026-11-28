CREATE TABLE IF NOT EXISTS `departments` (
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
CREATE INDEX IF NOT EXISTS `departments_organization_idx` ON `departments` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `departments_organization_name_unique` ON `departments` (`organization_id`,lower("name")) WHERE "departments"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `departments_organization_code_unique` ON `departments` (`organization_id`,lower("code")) WHERE "departments"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organizations` (
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
CREATE UNIQUE INDEX IF NOT EXISTS `organizations_name_unique` ON `organizations` (lower("name")) WHERE "organizations"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `organizations_slug_unique` ON `organizations` (`slug`);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`department_id` text,
	`title` text NOT NULL,
	`gem_reference` text,
	`location_state` text,
	`location_city` text,
	`location_address` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`amount` integer,
	`currency` text DEFAULT 'INR' NOT NULL,
	`includes_tax` integer DEFAULT false NOT NULL,
	`work_order_received_date` text,
	`start_date` text,
	`duration` integer,
	`duration_unit` text DEFAULT 'months' NOT NULL,
	`end_date` text,
	`required_headcount` integer,
	`deployed_headcount` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	`revision` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`,`department_id`) REFERENCES `departments`(`organization_id`,`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "contracts_title_check" CHECK(length("contracts"."title") > 0 and "contracts"."title" = trim("contracts"."title")),
	CONSTRAINT "contracts_status_check" CHECK("contracts"."status" in ('draft', 'wo-received', 'scheduled', 'active', 'on-hold', 'completed', 'terminated')),
	CONSTRAINT "contracts_non_draft_fields_check" CHECK("contracts"."status" = 'draft' or (
        "contracts"."department_id" is not null
        and coalesce(length(trim("contracts"."gem_reference")), 0) > 0
        and coalesce(length(trim("contracts"."location_state")), 0) > 0
        and coalesce(length(trim("contracts"."location_city")), 0) > 0
        and "contracts"."amount" is not null
        and "contracts"."start_date" is not null
        and "contracts"."duration" is not null
        and "contracts"."required_headcount" is not null
      )),
	CONSTRAINT "contracts_amount_check" CHECK("contracts"."amount" is null or (typeof("contracts"."amount") = 'integer' and "contracts"."amount" >= 0)),
	CONSTRAINT "contracts_currency_check" CHECK("contracts"."currency" glob '[A-Z][A-Z][A-Z]'),
	CONSTRAINT "contracts_includes_tax_check" CHECK("contracts"."includes_tax" in (0, 1)),
	CONSTRAINT "contracts_duration_check" CHECK("contracts"."duration" is null or (typeof("contracts"."duration") = 'integer' and "contracts"."duration" > 0)),
	CONSTRAINT "contracts_duration_unit_check" CHECK("contracts"."duration_unit" in ('days', 'months', 'years')),
	CONSTRAINT "contracts_date_order_check" CHECK("contracts"."start_date" is null or "contracts"."end_date" is null or "contracts"."end_date" >= "contracts"."start_date"),
	CONSTRAINT "contracts_required_headcount_check" CHECK("contracts"."required_headcount" is null or (typeof("contracts"."required_headcount") = 'integer' and "contracts"."required_headcount" >= 0)),
	CONSTRAINT "contracts_deployed_headcount_check" CHECK(typeof("contracts"."deployed_headcount") = 'integer' and "contracts"."deployed_headcount" >= 0)
);
--> statement-breakpoint
CREATE INDEX `contracts_organization_department_idx` ON `contracts` (`organization_id`,`department_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `departments_organization_department_unique` ON `departments` (`organization_id`,`id`);
