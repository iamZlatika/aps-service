import "@tanstack/react-query";

import { type ApiError } from "@/shared/lib/errors/services.ts";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
    mutationMeta: {
      silent?: boolean;
    };
  }
}
