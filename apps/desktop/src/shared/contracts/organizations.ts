import type { CreateOrganizationInput } from "../schemas/organizations.js";

export const organizationIpcChannels = {
  create: "organizations:create",
  list: "organizations:list",
} as const;

export interface OrganizationRecord {
  id: string;
  name: string;
}

export type CreateOrganizationResult =
  | { ok: true; organization: OrganizationRecord }
  | { ok: false; reason: "duplicate-name" };

export interface OrganizationsApi {
  create: (input: CreateOrganizationInput) => Promise<CreateOrganizationResult>;
  list: () => Promise<OrganizationRecord[]>;
}
