import { type SortType } from "@/shared/components/table/hooks/useSortParams.ts";

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
    accessories: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "accessories",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    deviceConditions: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "device-conditions",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    issueTypes: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "issue-types",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    deviceModels: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "device-models",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    deviceTypes: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "device-types",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    intakeNotes: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "intake-notes",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    manufacturers: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "manufacturers",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
    repairOperations: (
      page?: number,
      perPage?: number,
      sortColumn?: string | null,
      sortType?: SortType,
    ) =>
      [
        ...queryKeys.dictionaries.all,
        "repair-operations",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
        ...(sortColumn ? [sortColumn] : []),
        ...(sortType && sortType !== "none" ? [sortType] : []),
      ] as const,
  },
} as const;
