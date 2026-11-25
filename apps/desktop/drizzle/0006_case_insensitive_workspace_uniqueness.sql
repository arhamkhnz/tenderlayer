DROP INDEX `departments_organization_name_unique`;--> statement-breakpoint
DROP INDEX `departments_organization_code_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `departments_organization_name_unique` ON `departments` (`organization_id`,lower("name")) WHERE "departments"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX `departments_organization_code_unique` ON `departments` (`organization_id`,lower("code")) WHERE "departments"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_name_unique` ON `organizations` (lower("name"));