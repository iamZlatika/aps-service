import { router } from "@/app/router.ts";
import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { authService } from "@/features/auth/lib/authService.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { destroyEcho } from "@/shared/lib/echo.ts";

let isLoggingOut = false;

export const logout = (redirectTo?: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  authService.clearToken();
  destroyEcho();
  queryClient.clear();

  void router.navigate(redirectTo ?? AuthRoutes.linkToLogin());

  queueMicrotask(() => {
    isLoggingOut = false;
  });
};
