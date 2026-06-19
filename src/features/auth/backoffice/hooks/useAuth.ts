import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { backofficeAuthService } from "@/features/auth/lib/authService.ts";
import { logout as sessionLogout } from "@/features/auth/lib/sessionManager.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { getEcho, initEcho } from "@/shared/lib/echo.ts";

import { authApi } from "../api";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = backofficeAuthService.getToken();

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
      void i18n.changeLanguage(user.locale);
    }
  }, [i18n, user?.locale]);

  useEffect(() => {
    const currentToken = backofficeAuthService.getToken();
    if (user && currentToken && !getEcho()) {
      void initEcho(currentToken);
    }
  }, [user]);

  useEffect(() => {
    if (isError) {
      sessionLogout("backoffice");
    }
  }, [isError]);
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.token) {
        backofficeAuthService.setToken(response.token);
        return queryClient.invalidateQueries({
          queryKey: queryKeys.auth.user(),
        });
      }
    },
  });

  useEffect(() => {
    const applyDark = (isDark: boolean) =>
      document.documentElement.classList.toggle("dark", isDark);

    if (!user?.theme || user.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyDark(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => applyDark(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }

    applyDark(user.theme === "dark");
  }, [user?.theme]);

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    meta: { silent: true },
    onSettled: () => {
      sessionLogout("backoffice");
    },
  });

  return {
    user,
    role: user?.role,
    isAuthenticated: !!token && !isError,
    isLoading: isLoading || (!!token && !user && !isError),
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
};
