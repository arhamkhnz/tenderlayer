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
  | { ok: true; organizationId: string }
  | { ok: false; fieldErrors: { field: "name"; message: string }[]; formError?: string };

export interface OrganizationsApi {
  create: (input: CreateOrganizationInput) => Promise<CreateOrganizationResult>;
  list: () => Promise<OrganizationRecord[]>;
}
