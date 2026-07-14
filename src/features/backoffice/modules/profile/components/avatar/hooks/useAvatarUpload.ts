import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "@/features/backoffice/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UseAvatarUploadReturn = {
  upload: (file: File, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });

  return {
    upload: (file, options) => mutate(file, options),
    isPending,
  };
};
