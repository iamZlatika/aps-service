import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

type UseCustomerTelegramReturn = {
  isPending: boolean;
  generateLink: () => void;
  revokeLink: () => void;
  isRevokePending: boolean;
};

export const useCustomerTelegram = (
  customerId: number,
  onSuccess?: () => void,
): UseCustomerTelegramReturn => {
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: () => customersApi.getTelegramLink(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customerId),
      });
      onSuccess?.();
    },
    onError: (error) => notifyError(error),
  });

  const revokeMutation = useMutation({
    mutationFn: () => customersApi.revokeTelegramLink(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customerId),
      });
      toast.success(i18next.t("customers.profile.telegram_revoked"));
    },
    onError: (error) => notifyError(error),
  });

  return {
    isPending: generateMutation.isPending,
    generateLink: () => generateMutation.mutate(),
    revokeLink: () => revokeMutation.mutate(),
    isRevokePending: revokeMutation.isPending,
  };
};
