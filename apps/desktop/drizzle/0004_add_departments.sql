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
	CONSTRAINT "departments_name_check" CHECK(length("departments"."name") > 0 and "departments"."name" = trim("departments"."name")),
	CONSTRAINT "departments_code_check" CHECK("departments"."code" is null or (length("departments"."code") > 0 and "departments"."code" = trim("departments"."code")))
);
--> statement-breakpoint
CREATE INDEX `departments_organization_idx` ON `departments` (`organization_id`);