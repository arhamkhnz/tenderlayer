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
CREATE UNIQUE INDEX `contracts_organization_contract_unique` ON `contracts` (`organization_id`,`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `departments_organization_department_unique` ON `departments` (`organization_id`,`id`);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`contract_id` text,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`address` text,
	`job_title` text NOT NULL,
	`employment_type` text DEFAULT 'full-time' NOT NULL,
	`joining_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`work_state` text,
	`work_city` text,
	`site_location` text,
	`monthly_pay` integer NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`pan` text,
	`uan` text,
	`account_holder` text,
	`bank_name` text,
	`account_number` text,
	`ifsc` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	`revision` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`,`contract_id`) REFERENCES `contracts`(`organization_id`,`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "employees_name_check" CHECK(length("employees"."name") > 0 and "employees"."name" = trim("employees"."name") and instr("employees"."name", char(0)) = 0),
	CONSTRAINT "employees_code_check" CHECK("employees"."code" glob 'EMP-[0-9]*' and substr("employees"."code", 5) not glob '*[^0-9]*' and instr("employees"."code", char(0)) = 0),
	CONSTRAINT "employees_phone_check" CHECK(length(trim("employees"."phone")) > 0 and instr("employees"."phone", char(0)) = 0),
	CONSTRAINT "employees_job_title_check" CHECK(length(trim("employees"."job_title")) > 0 and instr("employees"."job_title", char(0)) = 0),
	CONSTRAINT "employees_employment_type_check" CHECK("employees"."employment_type" in ('full-time', 'contractual', 'temporary', 'part-time')),
	CONSTRAINT "employees_status_check" CHECK("employees"."status" in ('active', 'on-leave', 'inactive')),
	CONSTRAINT "employees_joining_date_check" CHECK(date("employees"."joining_date", '+0 days') is "employees"."joining_date"),
	CONSTRAINT "employees_monthly_pay_check" CHECK(typeof("employees"."monthly_pay") = 'integer' and "employees"."monthly_pay" > 0),
	CONSTRAINT "employees_currency_check" CHECK("employees"."currency" glob '[A-Z][A-Z][A-Z]')
);
--> statement-breakpoint
CREATE INDEX `employees_organization_contract_idx` ON `employees` (`organization_id`,`contract_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `employees_organization_code_unique` ON `employees` (`organization_id`,`code`);
