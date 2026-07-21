import { type SortType } from "@/widgets/table/hooks/useSortParams.ts";
import { type Filters } from "@/widgets/table/models/types.ts";

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
    me: () => [...queryKeys.users.all, "me"] as const,
    detail: (id: number) => [...queryKeys.users.all, "detail", id] as const,
  },

  permissions: {
    all: ["permissions"] as const,
    list: () => [...queryKeys.permissions.all, "list"] as const,
  },

  roles: {
    all: ["roles"] as const,
    list: () => [...queryKeys.roles.all, "list"] as const,
  },

  customers: {
    all: ["customers"] as const,
    list: makeEntityKey(["customers"], "list"),
    detail: (id: number) => [...queryKeys.customers.all, "detail", id] as const,
    searchByName: () => [...queryKeys.customers.all, "search-by-name"] as const,
    searchByPhone: () =>
      [...queryKeys.customers.all, "search-by-phone"] as const,
    mergeSurvivor: (excludeId: number | null) =>
      [...queryKeys.customers.all, "merge-survivor", excludeId] as const,
    mergeAbsorbed: (excludeId: number | null) =>
      [...queryKeys.customers.all, "merge-absorbed", excludeId] as const,
  },

  orders: {
    all: ["orders"] as const,
    list: makeEntityKey(["orders"], "list"),
    detail: (id: number) => [...queryKeys.orders.all, "detail", id] as const,
    detailAll: () => [...queryKeys.orders.all, "detail"] as const,
    byCustomer: (customerId: number, page?: number) =>
      [
        ...queryKeys.orders.all,
        "byCustomer",
        customerId,
        ...(page !== undefined ? [page] : []),
      ] as const,
  },

  quickOrders: {
    all: ["quickOrders"] as const,
    list: makeEntityKey(["quickOrders"], "list"),
    detail: (id: number) =>
      [...queryKeys.quickOrders.all, "detail", id] as const,
  },

  works: {
    all: ["works"] as const,
    list: makeEntityKey(["works"], "list"),
    detail: (id: number) => [...queryKeys.works.all, "detail", id] as const,
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
    services: makeEntityKey(["dictionaries"], "services"),
    orderStatuses: makeEntityKey(["dictionaries"], "order-statuses"),
    suppliers: makeEntityKey(["dictionaries"], "suppliers"),
    outsourcers: makeEntityKey(["dictionaries"], "outsourcers"),
    products: makeEntityKey(["dictionaries"], "products"),
    locations: makeEntityKey(["dictionaries"], "locations"),
    bankCards: makeEntityKey(["dictionaries"], "bank-cards"),
    priceList: makeEntityKey(["dictionaries"], "price-list"),
  },

  billing: {
    all: ["billing"] as const,
    balances: makeEntityKey(["billing"], "balances"),
    allTransactions: makeEntityKey(["billing"], "allTransactions"),
    myTransactions: makeEntityKey(["billing"], "myTransactions"),
    withdrawalRequests: makeEntityKey(["billing"], "withdrawalRequests"),
    systemBalance: () => [...queryKeys.billing.all, "systemBalance"] as const,
  },

  smsIntegration: {
    all: ["smsIntegration"] as const,
    balance: () => [...queryKeys.smsIntegration.all, "balance"] as const,
    messages: makeEntityKey(["smsIntegration"], "messages"),
  },

  referrals: {
    all: ["referrals"] as const,
    list: makeEntityKey(["referrals"], "list"),
    detail: (id: number) => [...queryKeys.referrals.all, "detail", id] as const,
    transactions: (referralId: number) =>
      makeEntityKey(["referrals"], `transactions-${referralId}`),
    searchByName: () => [...queryKeys.referrals.all, "search-by-name"] as const,
  },
} as const;
