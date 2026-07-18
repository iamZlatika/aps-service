import { router } from "@/app/router.ts";
import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import { backofficeAuthService } from "@/features/auth/lib/authService.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { destroyEcho } from "@/shared/lib/echo.ts";

let isLoggingOut = false;

export const logout = (redirectTo?: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  backofficeAuthService.clearToken();
  destroyEcho();
  queryClient.clear();

  void router.navigate(redirectTo ?? AuthRoutes.linkToLogin());

  queueMicrotask(() => {
    isLoggingOut = false;
  });
};
