import { ipcMain } from "electron/main";

import { assertTrustedSender } from "@core/ipc-security";
import type { Organization } from "@db/schema/organizations";
import {
  type CreateOrganizationResult,
  organizationIpcChannels,
  type OrganizationRecord,
} from "@shared/contracts/organizations";
import { createOrganizationSchema } from "@shared/schemas/organizations";

import { createOrganization } from "./create-organization.js";
import { listOrganizations } from "./list-organizations.js";

function toOrganizationRecord({ id, name }: Organization): OrganizationRecord {
  return { id, name };
}

export function registerOrganizationIpcHandlers() {
  ipcMain.handle(organizationIpcChannels.create, (event, input: unknown): CreateOrganizationResult => {
    assertTrustedSender(event);
    const result = createOrganizationSchema.safeParse(input);
    if (!result.success) throw new TypeError(result.error.issues[0]?.message ?? "Invalid organization input");

    try {
      const organization = createOrganization(result.data);
      return organization
        ? { ok: true, organization: toOrganizationRecord(organization) }
        : { ok: false, reason: "duplicate-name" };
    } catch (error) {
      console.error("[organizations] failed to create an organization", error);
      throw new Error("Could not create organization");
    }
  });

  ipcMain.handle(organizationIpcChannels.list, (event): OrganizationRecord[] => {
    assertTrustedSender(event);
    try {
      return listOrganizations().map(toOrganizationRecord);
    } catch (error) {
      console.error("[organizations] failed to list organizations", error);
      throw new Error("Could not load organizations");
    }
  });
}
