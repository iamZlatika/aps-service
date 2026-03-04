import { router } from "@/app/router";
import { AuthRoutes } from "@/features/auth/routes.ts";
import { authService } from "@/shared/api/apiClient.ts";
import { queryClient } from "@/shared/api/queryClient";

export const logout = (redirectToLogin = true) => {
  authService.clearToken();
  queryClient.clear();

  if (redirectToLogin) {
    void router.navigate(AuthRoutes.linkToLogin());
  }
};
