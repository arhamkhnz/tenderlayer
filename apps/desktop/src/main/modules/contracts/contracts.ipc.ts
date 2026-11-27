import { ipcMain } from "electron/main";
import type { z } from "zod";

import { assertTrustedSender } from "@core/ipc-security";
import { contractIpcChannels, type ContractSaveResult } from "@shared/contracts/contracts";
import {
  contractFormSchema,
  contractOrganizationIdSchema,
  createContractSchema,
  deleteContractSchema,
  updateContractSchema,
  type ContractFormValues,
} from "@shared/schemas/contracts";

import { createContract } from "./create-contract.js";
import { deleteContract } from "./delete-contract.js";
import { listContracts } from "./list-contracts.js";
import { updateContract } from "./update-contract.js";

function handleContractSave<Input>(
  schema: z.ZodType<Input>,
  input: unknown,
  save: (values: Input) => ContractSaveResult,
): ContractSaveResult {
  const result = schema.safeParse(input);
  if (!result.success) {
    const failure: Extract<ContractSaveResult, { ok: false }> = { ok: false, fieldErrors: [] };
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && field !== "currency" && Object.hasOwn(contractFormSchema.shape, field)) {
        failure.fieldErrors.push({ field: field as keyof ContractFormValues, message: issue.message });
      } else {
        failure.formError ??= issue.message;
      }
    }
    return failure;
  }

  try {
    return save(result.data);
  } catch (error) {
    console.error("[contracts] failed to save a contract", error);
    return { ok: false, fieldErrors: [], formError: "Couldn’t save the contract. Please try again." };
  }
}

export function registerContractIpcHandlers() {
  ipcMain.handle(contractIpcChannels.list, (event, input: unknown) => {
    assertTrustedSender(event);
    const organizationId = contractOrganizationIdSchema.parse(input);

    try {
      return listContracts(organizationId);
    } catch (error) {
      console.error("[contracts] failed to list contracts", error);
      throw new Error("Could not load contracts");
    }
  });

  ipcMain.handle(contractIpcChannels.create, (event, input: unknown): ContractSaveResult => {
    assertTrustedSender(event);
    return handleContractSave(createContractSchema, input, createContract);
  });

  ipcMain.handle(contractIpcChannels.update, (event, input: unknown): ContractSaveResult => {
    assertTrustedSender(event);
    return handleContractSave(updateContractSchema, input, updateContract);
  });

  ipcMain.handle(contractIpcChannels.delete, (event, input: unknown) => {
    assertTrustedSender(event);

    try {
      return deleteContract(deleteContractSchema.parse(input));
    } catch (error) {
      console.error("[contracts] failed to delete a contract", error);
      throw new Error("Could not delete the contract");
    }
  });
}
