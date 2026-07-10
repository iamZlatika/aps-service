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

  const logout = () => {
    const token = customerAuthService.getToken();
    sessionLogout("customer", redirectTo);
    if (token) mutate(token);
  };

  return { logout, isLoggingOut };
};
