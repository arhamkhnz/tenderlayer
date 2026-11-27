import { ipcMain } from "electron/main";

import { assertTrustedSender } from "@core/ipc-security";
import {
  type CreateOrganizationResult,
  organizationIpcChannels,
  type OrganizationRecord,
} from "@shared/contracts/organizations";
import { createOrganizationSchema } from "@shared/schemas/organizations";

import { createOrganization } from "./create-organization.js";
import { listOrganizations } from "./list-organizations.js";

export function registerOrganizationIpcHandlers() {
  ipcMain.handle(organizationIpcChannels.create, (event, input: unknown): CreateOrganizationResult => {
    assertTrustedSender(event);
    const result = createOrganizationSchema.safeParse(input);
    if (!result.success) {
      const issue = result.error.issues[0];
      if (issue?.path[0] === "name") {
        return { ok: false, fieldErrors: [{ field: "name", message: issue.message }] };
      }
      return { ok: false, fieldErrors: [], formError: issue?.message ?? "Invalid organization input" };
    }

    try {
      return createOrganization(result.data);
    } catch (error) {
      console.error("[organizations] failed to create an organization", error);
      return { ok: false, fieldErrors: [], formError: "Unable to create the organization. Please try again." };
    }
  });

  ipcMain.handle(organizationIpcChannels.list, (event): OrganizationRecord[] => {
    assertTrustedSender(event);
    try {
      return listOrganizations();
    } catch (error) {
      console.error("[organizations] failed to list organizations", error);
      throw new Error("Could not load organizations");
    }
  });
}
