import { useQuery } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { queryKeys } from "@/shared/api/queryKeys";

type UseResetCheckTokenReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useResetCheckToken = (
  token: string,
  email: string,
): UseResetCheckTokenReturn => {
  const { isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: queryKeys.auth.customerResetCheck(token, email),
    queryFn: async () => {
      await websiteAuthApi.resetCheckToken({ token, email });
      return true;
    },
    enabled: !!token && !!email,
    retry: false,
  });

  return { isLoading, isSuccess, isError, error, refetch };
};
