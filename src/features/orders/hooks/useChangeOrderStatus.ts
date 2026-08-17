import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { type OrderStatus } from "@/entities/order-status/types";
import { orderStatusesApi } from "@/features/dictionaries/api";
import { ordersApi } from "@/features/orders/api";
import { waitForOrderDocument } from "@/features/orders/lib/waitForOrderDocument";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const READY_STATUS_KEY = "ready";
const PAYMENT_INVOICE_WAIT_MS = 15_000;

type UseChangeOrderStatusReturn = {
  statuses: OrderStatus[];
  changeStatus: (id: number, key: string) => void;
  isPending: boolean;
};

export const useChangeOrderStatus = (
  orderId: number,
  onSuccess?: () => void,
): UseChangeOrderStatusReturn => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: queryKeys.dictionaries.orderStatuses(),
    queryFn: () => orderStatusesApi.getAll(1, 100),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, key }: { id: number; key: string }) => {
      await ordersApi.changeStatus(orderId, id);

      if (key === READY_STATUS_KEY) {
        const invoice = await waitForOrderDocument(
          queryClient,
          orderId,
          "payment_invoice",
          PAYMENT_INVOICE_WAIT_MS,
        );
        if (!invoice) {
          toast.error(t("orders.print.payment_invoice_timeout"));
        }
      }
    },
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      // Closing an order finalizes pending referral_income into the
      // referral's balance — refresh referrals so amounts/statuses stay in sync.
      void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all });
    },
  });

  return {
    statuses: data?.items ?? [],
    changeStatus: (id, key) => mutate({ id, key }),
    isPending,
  };
};
