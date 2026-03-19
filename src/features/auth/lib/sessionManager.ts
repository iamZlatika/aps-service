import { router } from "@/app/router.ts";
import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { authService } from "@/features/auth/lib/authService.ts";
import { queryClient } from "@/shared/api/queryClient.ts";

let isLoggingOut = false;

export const logout = (redirectToLogin = true) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  authService.clearToken();
  queryClient.clear();

  if (redirectToLogin) {
    void router.navigate(AuthRoutes.linkToLogin());
  }
  queueMicrotask(() => {
    isLoggingOut = false;
  });
};
