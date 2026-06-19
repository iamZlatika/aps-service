import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Customer } from "@/features/auth/website/types";
import { customerProfileApi } from "@/features/website/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services";

export const useAvatarUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<Customer, Error, File>({
    mutationFn: customerProfileApi.uploadAvatar,
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.me(), customer);
    },
    onError: (error) => notifyError(error),
  });
};
