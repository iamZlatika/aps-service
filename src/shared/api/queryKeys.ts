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
    accessories: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "accessories",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
    deviceConditions: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "device-conditions",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
    issueTypes: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "issue-types",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
    deviceModels: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "device-models",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
    deviceTypes: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "device-types",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
    intakeNotes: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "intake-notes",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
    manufacturers: (page?: number, perPage?: number) =>
      [
        ...queryKeys.dictionaries.all,
        "manufacturers",
        ...(page !== undefined ? [page] : []),
        ...(perPage !== undefined ? [perPage] : []),
      ] as const,
  },
} as const;
