import { useMutation } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type AuthResponse } from "@/features/auth/website/types";

type UseConfirmAccountReturn = {
  confirm: (token: string) => void;
  isPending: boolean;
  isError: boolean;
  data: AuthResponse | undefined;
};

export const useConfirmAccount = (): UseConfirmAccountReturn => {
  const { mutate, isPending, isError, data } = useMutation<
    AuthResponse,
    Error,
    string
  >({
    mutationFn: (token) => websiteAuthApi.emailVerifyToken(token),
  });

  return { confirm: mutate, isPending, isError, data };
};
