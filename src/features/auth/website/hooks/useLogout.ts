import { useMutation } from "@tanstack/react-query";

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
    onSettled: () => {
      sessionLogout("customer", redirectTo);
    },
  });

  return { logout: () => mutate(), isLoggingOut };
};
