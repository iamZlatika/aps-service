import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { useCallback } from "react";
import { toast } from "sonner";

import { customersApi } from "@/features/backoffice/modules/customers/api";
import { updateCustomerCache } from "@/features/backoffice/modules/customers/lib/cache.ts";

type UseCustomerSmsReturn = {
  toggleSms: (enabled: boolean) => void;
  isSmsPending: boolean;
};

export const useCustomerSms = (customerId: number): UseCustomerSmsReturn => {
  const smsNotificationsMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      customersApi.setSmsNotifications(id, enabled),
    onSuccess: async (updatedCustomer) => {
      await updateCustomerCache(updatedCustomer);
      toast.success(i18next.t("customers.profile.sms_updated"));
    },
  });

  const toggleSms = useCallback(
    (enabled: boolean) => {
      smsNotificationsMutation.mutate({ id: customerId, enabled });
    },
    [smsNotificationsMutation, customerId],
  );

  return {
    toggleSms,
    isSmsPending: smsNotificationsMutation.isPending,
  };
};
