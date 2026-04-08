import { type SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import { type Filters } from "@/features/backoffice/widgets/table/models/types.ts";

const makeEntityKey =
  (base: readonly string[], name: string) =>
  (
    page?: number,
    perPage?: number,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Filters,
  ) =>
    [
      ...base,
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
    list: makeEntityKey(["users"], "list"),
    me: () => ["users", "me"] as const,
  },

  customers: {
    all: ["customers"] as const,
    list: makeEntityKey(["customers"], "list"),
    detail: (id: number) => ["customers", "detail", id] as const,
  },

  orders: {
    all: ["orders"] as const,
    list: makeEntityKey(["orders"], "list"),
    detail: (id: number) => ["orders", "detail", id] as const,
  },

  dictionaries: {
    all: ["dictionaries"] as const,
    accessories: makeEntityKey(["dictionaries"], "accessories"),
    deviceConditions: makeEntityKey(["dictionaries"], "device-conditions"),
    issueTypes: makeEntityKey(["dictionaries"], "issue-types"),
    deviceModels: makeEntityKey(["dictionaries"], "device-models"),
    deviceTypes: makeEntityKey(["dictionaries"], "device-types"),
    intakeNotes: makeEntityKey(["dictionaries"], "intake-notes"),
    manufacturers: makeEntityKey(["dictionaries"], "manufacturers"),
    repairOperations: makeEntityKey(["dictionaries"], "repair-operations"),
    orderStatuses: makeEntityKey(["dictionaries"], "order-statuses"),
  },
} as const;
