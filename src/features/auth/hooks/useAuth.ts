import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { authService } from "@/features/auth/lib/authService.ts";
import { logout as sessionLogout } from "@/features/auth/lib/sessionManager.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

import { authApi } from "../api";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = authService.getToken();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
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
        return queryClient.invalidateQueries({
          queryKey: queryKeys.auth.user(),
        });
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
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};
