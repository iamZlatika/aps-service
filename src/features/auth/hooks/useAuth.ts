import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { authService } from "@/features/auth/lib/authService.ts";
import { logout as sessionLogout } from "@/features/auth/lib/sessionManager.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

import { authApi } from "../api";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = authService.getToken();

  const { i18n } = useTranslation();

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
    if (user?.locale && user.locale !== i18n.language) {
      i18n.changeLanguage(user.locale);
    }
  }, [i18n, user?.locale]);

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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", user?.theme === "dark");
  }, [user?.theme]);

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
