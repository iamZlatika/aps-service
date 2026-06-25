import { useQuery } from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type AuthResponse } from "@/features/auth/website/types";
import { queryKeys } from "@/shared/api/queryKeys";

type UseGoogleCallbackReturn = {
  data: AuthResponse | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export const useGoogleCallback = (
  code: string | null,
): UseGoogleCallbackReturn => {
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: queryKeys.auth.googleCallback(code ?? ""),
    queryFn: () => websiteAuthApi.googleCallback(code!),
    enabled: !!code,
    retry: false,
    staleTime: Infinity,
  });

  return { data, isLoading, isSuccess, isError };
};
