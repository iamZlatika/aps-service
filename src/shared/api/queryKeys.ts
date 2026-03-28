import { type SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import { type Filters } from "@/features/backoffice/widgets/table/models/types.ts";

const makeDictKey =
  (name: string) =>
  (
    page?: number,
    perPage?: number,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Filters,
  ) =>
    [
      ...queryKeys.dictionaries.all,
      name,
      ...(page !== undefined ? [page] : []),
      ...(perPage !== undefined ? [perPage] : []),
      ...(sortColumn ? [sortColumn] : []),
      ...(sortType && sortType !== "none" ? [sortType] : []),
      ...(filters && Object.keys(filters).length > 0 ? [filters] : []),
    ] as const;

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    resetCheck: (token: string, email: string) =>
      [...queryKeys.auth.all, "resetCheck", token, email] as const,
  },

  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
  },

  customers: {
    all: ["customers"] as const,
    list: () => [...queryKeys.customers.all, "list"] as const,
  },

  dictionaries: {
    all: ["dictionaries"] as const,
    accessories: makeDictKey("accessories"),
    deviceConditions: makeDictKey("device-conditions"),
    issueTypes: makeDictKey("issue-types"),
    deviceModels: makeDictKey("device-models"),
    deviceTypes: makeDictKey("device-types"),
    intakeNotes: makeDictKey("intake-notes"),
    manufacturers: makeDictKey("manufacturers"),
    repairOperations: makeDictKey("repair-operations"),
  },
} as const;
