import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";
import { captureError } from "@/shared/lib/sentry.ts";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!isApiError(error)) {
        captureError(error, { source: "queryCache", queryKey: query.queryKey });
      }
    },
  }),
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
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status && error.status < 500)
          return false;
        return failureCount < 1;
      },
    },
  },
});
