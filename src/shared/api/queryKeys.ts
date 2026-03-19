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
    accessories: () => [...queryKeys.dictionaries.all, "accessories"] as const,
  },
} as const;
