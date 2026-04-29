import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type { NewPaymentSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type { OrderPayment } from "@/features/backoffice/modules/orders/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

type UsePaymentSubmitParams = {
  orderId: number;
  onSuccess: () => void;
};

type UsePaymentSubmitReturn = {
  onSubmit: (data: NewPaymentSchema) => void;
  isPending: boolean;
};

export const usePaymentSubmit = ({
  orderId,
  onSuccess,
}: UsePaymentSubmitParams): UsePaymentSubmitReturn => {
  const mutation = useMutation<OrderPayment, Error, NewPaymentSchema>({
    mutationFn: (data) =>
      ordersApi.makePayment(orderId, {
        type: data.type,
        amount: data.amount,
        note: data.note || null,
        managerId: data.managerId,
      }),
    onSuccess: () => {
      toast.success(i18next.t("orders.payments.successAdd"));
      onSuccess();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
  });

  return { onSubmit: mutation.mutate, isPending: mutation.isPending };
};
