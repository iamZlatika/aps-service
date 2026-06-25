import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Customer } from "@/features/auth/website/types";
import { customerProfileApi } from "@/features/website/modules/profile/api";
import { queryKeys } from "@/shared/api/queryKeys";
import { notifyError } from "@/shared/lib/errors/services";

type UseDeletePhoneReturn = {
  submit: (id: number, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

export const useDeletePhone = (): UseDeletePhoneReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number>({
    mutationFn: (id) => customerProfileApi.deletePhone(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Customer>(queryKeys.customer.me(), (old) => {
        if (!old) return old;
        return { ...old, phones: old.phones.filter((p) => p.id !== id) };
      });
    },
    onError: (error) => {
      notifyError(error);
    },
  });

  return {
    submit: (id, options) =>
      mutation.mutate(id, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};
