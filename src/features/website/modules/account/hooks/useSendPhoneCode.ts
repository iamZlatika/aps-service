import { useMutation } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { notifyError } from "@/shared/lib/errors/services";

type UseSendPhoneCodeReturn = {
  submit: (phone: string, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

export const useSendPhoneCode = (): UseSendPhoneCodeReturn => {
  const mutation = useMutation<void, Error, string>({
    mutationFn: (phone) => websiteAuthApi.sendPhoneCode({ phone }),
    onError: (error) => notifyError(error),
  });

  return {
    submit: (phone, options) =>
      mutation.mutate(phone, { onSuccess: options?.onSuccess }),
    isPending: mutation.isPending,
  };
};
