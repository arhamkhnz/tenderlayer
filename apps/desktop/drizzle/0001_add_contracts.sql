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
