import { router } from "@/app/router.ts";
import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import {
  type AuthScope,
  backofficeAuthService,
  customerAuthService,
} from "@/features/auth/lib/authService.ts";
import { WEBSITE_LINKS } from "@/features/website/navigation.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { destroyEcho } from "@/shared/lib/echo.ts";

const isLoggingOutByScope: Record<AuthScope, boolean> = {
  backoffice: false,
  customer: false,
};

const DEFAULT_REDIRECT_BY_SCOPE: Record<AuthScope, string> = {
  backoffice: AuthRoutes.linkToLogin(),
  customer: WEBSITE_LINKS.home,
};

export const logout = (scope: AuthScope, redirectTo?: string) => {
  if (isLoggingOutByScope[scope]) return;
  isLoggingOutByScope[scope] = true;

  if (scope === "backoffice") {
    backofficeAuthService.clearToken();
    destroyEcho();
    queryClient.clear();
  } else {
    customerAuthService.clearToken();
    queryClient.removeQueries({ queryKey: queryKeys.customer.all });
  }

  void router.navigate(redirectTo ?? DEFAULT_REDIRECT_BY_SCOPE[scope]);

  queueMicrotask(() => {
    isLoggingOutByScope[scope] = false;
  });
};
