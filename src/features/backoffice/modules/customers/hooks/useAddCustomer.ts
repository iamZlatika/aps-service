import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import { newCustomerSchema } from "@/features/backoffice/modules/customers/lib/schemas.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseAddCustomerReturn = {
  onSubmit: (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useAddCustomer = (
  onSuccess?: () => void,
): UseAddCustomerReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ReturnType<typeof newCustomerSchema.parse>) =>
      customersApi.addNewCustomer(data),
    onSuccess: () => {
      onSuccess?.();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.customers.all,
      });
    },
  });

  const onSubmit = async (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync(newCustomerSchema.parse(values));
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};
