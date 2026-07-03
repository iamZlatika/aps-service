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
    customerResetCheck: (token: string, email: string) =>
      [...queryKeys.auth.all, "customerResetCheck", token, email] as const,
    emailVerify: (verifyUrl: string) =>
      [...queryKeys.auth.all, "emailVerify", verifyUrl] as const,
    googleCallback: (code: string) =>
      [...queryKeys.auth.all, "googleCallback", code] as const,
  },

  // Everything owned by the logged-in customer (profile, future orders, etc.)
  // must nest under this root so logout can clear it in one prefix removal.
  customer: {
    all: ["customer"] as const,
    me: () => [...queryKeys.customer.all, "me"] as const,
    orders: (page?: number) =>
      [
        ...queryKeys.customer.all,
        "orders",
        ...(page !== undefined ? [page] : []),
      ] as const,
    orderDetail: (id: number) =>
      [...queryKeys.customer.all, "orders", "detail", id] as const,
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
  },

  orders: {
    all: ["orders"] as const,
    list: makeEntityKey(["orders"], "list"),
    detail: (id: number) => [...queryKeys.orders.all, "detail", id] as const,
    byCustomer: (customerId: number, page?: number) =>
      [
        ...queryKeys.orders.all,
        "byCustomer",
        customerId,
        ...(page !== undefined ? [page] : []),
      ] as const,
  },

  tracking: {
    all: ["tracking"] as const,
    detail: (token: string) =>
      [...queryKeys.tracking.all, "detail", token] as const,
  },

  works: {
    all: ["works"] as const,
    list: makeEntityKey(["works"], "list"),
    detail: (id: number) => [...queryKeys.works.all, "detail", id] as const,
  },

  website: {
    all: ["website"] as const,
    locations: () => ["website", "locations"] as const,
    landing: () => ["website", "landing"] as const,
    priceList: (categories: string[]) =>
      ["website", "price-list", categories] as const,
    priceListAll: () => ["website", "price-list", "all"] as const,
    works: () => ["website", "works"] as const,
    reviews: () => ["website", "reviews"] as const,
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
} as const;
