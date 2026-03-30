import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { type UserTheme } from "@/shared/types.ts";

export const useUpdateTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (theme: UserTheme) => usersApi.updateTheme(theme),
    onSuccess: (_data, theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
};
