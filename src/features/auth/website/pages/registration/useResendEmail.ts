import { useMutation } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";

type UseResendEmailReturn = {
  resend: (email: string, onSuccess: () => void) => void;
  isPending: boolean;
};

export const useResendEmail = (): UseResendEmailReturn => {
  const mutation = useMutation<void, Error, string>({
    mutationFn: (email) => websiteAuthApi.emailResend(email),
  });

  return {
    resend: (email, onSuccess) => mutation.mutate(email, { onSuccess }),
    isPending: mutation.isPending,
  };
};
