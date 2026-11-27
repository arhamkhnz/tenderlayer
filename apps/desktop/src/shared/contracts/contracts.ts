import type {
  ContractFormValues,
  CreateContractInput,
  DeleteContractInput,
  UpdateContractInput,
} from "../schemas/contracts.js";

export const contractIpcChannels = {
  create: "contracts:create",
  delete: "contracts:delete",
  list: "contracts:list",
  update: "contracts:update",
} as const;

export interface ContractRecord {
  id: string;
  title: string;
  gemReference: string | null;
  departmentId: string | null;
  departmentName: string | null;
  status: ContractFormValues["status"];
  amount: number | null;
  currency: string;
  includesTax: boolean;
  locationState: string | null;
  locationCity: string | null;
  locationAddress: string | null;
  workOrderReceivedDate: string | null;
  startDate: string | null;
  duration: number | null;
  durationUnit: ContractFormValues["durationUnit"];
  endDate: string | null;
  requiredHeadcount: number | null;
  deployedHeadcount: number;
  notes: string | null;
}

export type ContractSaveResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors: { field: keyof ContractFormValues; message: string }[];
      formError?: string;
    };

export interface ContractsApi {
  create: (input: CreateContractInput) => Promise<ContractSaveResult>;
  delete: (input: DeleteContractInput) => Promise<boolean>;
  list: (organizationId: string) => Promise<ContractRecord[]>;
  update: (input: UpdateContractInput) => Promise<ContractSaveResult>;
}
