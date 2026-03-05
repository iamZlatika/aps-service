import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { logout as sessionLogout } from "@/features/auth/sessionManager.ts";
import { usersApi } from "@/features/backoffice/modules/users/api/api";
import { authService } from "@/shared/api/apiClient";

import { authApi } from "./api";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = authService.getToken();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: usersApi.getMe,
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isError) {
      sessionLogout(true);
    }
  }, [isError]);
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.token) {
        authService.setToken(response.token);
        return queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      }
    },
  });

  const logout = () => {
    sessionLogout(true);
  };

  return {
    user,
    role: user?.role,
    isAuthenticated: !!token && !isError,
    isLoading: isLoading || (!!token && !user && !isError),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};
