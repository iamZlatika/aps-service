import { useQuery } from "@tanstack/react-query";

import { smsIntegrationApi } from "@/features/sms-integration/api";
import { type SmsBalance } from "@/features/sms-integration/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { isApiError } from "@/shared/lib/errors/services.ts";

type UseSmsBalanceReturn = {
  smsBalance: SmsBalance | undefined;
  isLoading: boolean;
  isUnavailable: boolean;
};

export const useSmsBalance = (): UseSmsBalanceReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.smsIntegration.balance(),
    queryFn: smsIntegrationApi.getBalance,
  });

  const isUnavailable = isApiError(error) && error.status === 503;

  return { smsBalance: data, isLoading, isUnavailable };
};
