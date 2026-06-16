import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authService } from "@/features/auth/lib/authService";
import { websiteAuthApi } from "@/features/auth/website/api";

type UseLogoutReturn = {
  logout: () => void;
  isLoggingOut: boolean;
};

export const useLogout = (redirectTo: string): UseLogoutReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoggingOut } = useMutation({
    mutationFn: websiteAuthApi.logout,
    meta: { silent: true },
    onSettled: () => {
      authService.clearToken();
      queryClient.clear();
      void navigate(redirectTo);
    },
  });

  return { logout: () => mutate(), isLoggingOut };
};
