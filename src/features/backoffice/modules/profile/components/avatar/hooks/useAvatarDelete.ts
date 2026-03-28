import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "@/features/backoffice/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

export const useAvatarDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
};
