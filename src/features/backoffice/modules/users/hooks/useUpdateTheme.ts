import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { type UserTheme } from "@/shared/types.ts";

export const useUpdateTheme = (): UseMutationResult<void, Error, UserTheme> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (theme: UserTheme) => usersApi.updateTheme(theme),
    onSuccess: (_data, theme) => {
      if (theme === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        document.documentElement.classList.toggle("dark", isDark);
      } else {
        document.documentElement.classList.toggle("dark", theme === "dark");
      }
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
};
