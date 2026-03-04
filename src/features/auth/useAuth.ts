import { useQuery } from "@tanstack/react-query";

import { logout as sessionLogout } from "@/features/auth/sessionManager.ts";
import { usersApi } from "@/features/backoffice/modules/users/api/api";
import { authService } from "@/shared/api/apiClient";

export const useAuth = () => {
  const token = authService.getToken();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: usersApi.getMe,
    enabled: !!authService.getToken(),
    retry: false,
    staleTime: Infinity,
  });

  const logout = () => {
    sessionLogout(true);
  };

  return {
    user,
    role: user?.role,
    isAuthenticated: !!token && !isError,
    isLoading: isLoading || (!!token && !user && !isError),
    logout,
  };
};
