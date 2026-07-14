import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { type Me } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { type UserTheme } from "@/shared/types.ts";

export const useUpdateTheme = (): UseMutationResult<void, Error, UserTheme> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (theme: UserTheme) => usersApi.updateTheme(theme),
    onSuccess: (_data, theme) => {
      queryClient.setQueryData<Me>(queryKeys.auth.user(), (old) =>
        old ? { ...old, theme } : old,
      );
    },
  });
};
