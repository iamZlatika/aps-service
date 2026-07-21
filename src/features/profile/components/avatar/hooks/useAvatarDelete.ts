import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "@/features/profile/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseAvatarDeleteReturn = {
  deleteAvatar: (options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

export const useAvatarDelete = (): UseAvatarDeleteReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: profileApi.deleteAvatar,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });

  return {
    deleteAvatar: (options) => mutate(undefined, options),
    isPending,
  };
};
