import type { CreateOrganizationInput } from "../schemas/organizations.js";

export type { CreateOrganizationInput } from "../schemas/organizations.js";

export const organizationIpcChannels = {
  create: "organizations:create",
  list: "organizations:list",
} as const;

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
  revision: number;
}

export type OrganizationIpcContract = {
  [organizationIpcChannels.create]: {
    args: [input: CreateOrganizationInput];
    result: OrganizationRecord;
  };
  [organizationIpcChannels.list]: {
    args: [];
    result: OrganizationRecord[];
  };
};

export interface OrganizationsApi {
  create: (
    input: CreateOrganizationInput,
  ) => Promise<OrganizationIpcContract[typeof organizationIpcChannels.create]["result"]>;
  list: () => Promise<OrganizationIpcContract[typeof organizationIpcChannels.list]["result"]>;
}
