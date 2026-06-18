import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";

import { type Customer } from "@/features/auth/website/types";
import { customerProfileApi } from "@/features/website/modules/profile/api";
import { mapProfileNameToRequestBody } from "@/features/website/modules/profile/lib/adapters";
import { type ProfileNameFormValues } from "@/features/website/modules/profile/profile.schema";
import { queryKeys } from "@/shared/api/queryKeys";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseUpdateProfileNameReturn = {
  submit: (
    values: ProfileNameFormValues,
    options?: { onSuccess?: (customer: Customer) => void },
  ) => void;
  isPending: boolean;
};

export const useUpdateProfileName = (
  setError: UseFormSetError<ProfileNameFormValues>,
): UseUpdateProfileNameReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Customer, Error, ProfileNameFormValues>({
    mutationFn: (values) =>
      customerProfileApi.updateName(mapProfileNameToRequestBody(values)),
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.auth.customer(), customer);
    },
    onError: (error) => {
      notifyError(error);
      handleFormError<ProfileNameFormValues>(error, setError, {
        fieldMap: { portal_name: "portalName" },
      });
    },
  });

  return {
    submit: (values, options) =>
      mutation.mutate(values, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};
