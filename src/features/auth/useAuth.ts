import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/shared/api/apiClient";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Запрос данных профиля, если есть токен
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      // Здесь вызов вашего АПИ для получения профиля
      // return await getProfile();
    },
    enabled: !!authService.getToken(), // Запрос идет только если есть токен
    retry: false,
  });

  const logout = () => {
    authService.clearToken();
    queryClient.setQueryData(["auth-user"], null);
    window.location.href = "/login";
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    // role: user?.role,
    logout,
  };
};
