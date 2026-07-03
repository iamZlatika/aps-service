import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { registerUserSchema } from "@/features/backoffice/modules/users/lib/registerUserSchema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

type UseRegisterUserReturn = {
  onSubmit: (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ) => Promise<void>;
  isPending: boolean;
};

export const useRegisterUser = (
  onSuccess?: () => void,
): UseRegisterUserReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ReturnType<typeof registerUserSchema.parse>) =>
      usersApi.registerUser(data),
    onSuccess: () => {
      onSuccess?.();
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const onSubmit = async (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync(registerUserSchema.parse(values));
    } catch (error) {
      handleFormError(error, setError, {
        fieldMap: { "roles.0": "roles", "permissions.0": "permissions" },
      });
    }
  };

  return { onSubmit, isPending: mutation.isPending };
};
