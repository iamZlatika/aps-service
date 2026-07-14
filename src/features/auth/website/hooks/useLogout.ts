import { useMutation } from "@tanstack/react-query";

import { customerAuthService } from "@/features/auth/lib/authService";
import { logout as sessionLogout } from "@/features/auth/lib/sessionManager";
import { websiteAuthApi } from "@/features/auth/website/api";

type UseLogoutReturn = {
  logout: () => void;
  isLoggingOut: boolean;
};

export const useLogout = (redirectTo: string): UseLogoutReturn => {
  const { mutate, isPending: isLoggingOut } = useMutation({
    mutationFn: websiteAuthApi.logout,
    meta: { silent: true },
  });

  // Session is cleared synchronously (not in onSettled) for instant UI feedback.
  // Reverting to an onSettled-based clear reintroduces a login->logout->login
  // race that previously broke the app (fixed in 895896e) — see PROJECT audit
  // notes before changing this.
  const logout = () => {
    const token = customerAuthService.getToken();
    sessionLogout("customer", redirectTo);
    if (token) mutate(token);
  };

  return { logout, isLoggingOut };
};
