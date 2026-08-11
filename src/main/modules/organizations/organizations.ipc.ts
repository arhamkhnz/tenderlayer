import { ipcMain } from "electron/main";
import { organizationIpcChannels, type OrganizationRecord } from "../../../shared/contracts/organizations.js";
import { assertTrustedSender } from "../../core/ipc-security.js";
import { createOrganization } from "./create-organization.js";
import { listOrganizations } from "./list-organizations.js";

function toOrganizationRecord(organization: ReturnType<typeof createOrganization>): OrganizationRecord {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
    deletedAt: organization.deletedAt,
    revision: organization.revision,
  };
}

export function registerOrganizationIpcHandlers() {
  ipcMain.handle(organizationIpcChannels.create, (event, input: unknown): OrganizationRecord => {
    assertTrustedSender(event);
    return toOrganizationRecord(createOrganization(input));
  });

  ipcMain.handle(organizationIpcChannels.list, (event): OrganizationRecord[] => {
    assertTrustedSender(event);
    return listOrganizations().map(toOrganizationRecord);
  });
}
