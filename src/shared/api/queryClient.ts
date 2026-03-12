import { MutationCache, QueryClient } from "@tanstack/react-query";

import { notifyError } from "@/shared/lib/errors/services.ts";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.meta?.silent) return;
      if (mutation.options.onError) return;

      notifyError(error);
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
