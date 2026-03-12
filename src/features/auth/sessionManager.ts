import { router } from "@/app/router";
import { AuthRoutes } from "@/features/auth/routes.ts";

import { queryClient } from "@/shared/api/queryClient";
import { authService } from "@/shared/api/authService.ts";

export const logout = (redirectToLogin = true) => {
  authService.clearToken();
  queryClient.clear();

  if (redirectToLogin) {
    void router.navigate(AuthRoutes.linkToLogin());
  }
};
