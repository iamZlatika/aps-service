import { useQuery } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UseEmailVerifyReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export const useEmailVerify = (
  verifyUrl: string | null,
): UseEmailVerifyReturn => {
  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: queryKeys.auth.emailVerify(verifyUrl ?? ""),
    queryFn: async () => {
      await websiteAuthApi.emailVerify(verifyUrl!);
      return true;
    },
    enabled: !!verifyUrl,
    retry: false,
  });

  return { isLoading, isSuccess, isError };
};
