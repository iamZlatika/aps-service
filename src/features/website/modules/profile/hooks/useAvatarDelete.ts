import { useMutation, useQueryClient } from "@tanstack/react-query";

import { customerProfileApi } from "@/features/website/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services";

export const useAvatarDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: customerProfileApi.deleteAvatar,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.auth.customer(),
      });
    },
    onError: (error) => notifyError(error),
  });
};
