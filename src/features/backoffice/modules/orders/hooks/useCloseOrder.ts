import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { useDocumentActions } from "@/features/backoffice/modules/orders/hooks/useDocumentActions";
import {
  type OrderDocument,
  type OrderInfo,
} from "@/features/backoffice/modules/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";
import {
  PAYMENT_METHODS,
  type PaymentMethodType,
  PAYMENTS,
} from "@/shared/types";

type UseCloseOrderParams = {
  orderId: number;
  statusId: number;
  remainingToPay: string;
  onSuccess?: () => void;
  onClose: () => void;
};

type UseCloseOrderReturn = {
  close: (withPrint: boolean) => void;
  isPending: boolean;
  method: PaymentMethodType;
  setMethod: (method: PaymentMethodType) => void;
  isOverpayment: boolean;
  hasBalance: boolean;
  displayAmount: string;
};

export function useCloseOrder({
  orderId,
  statusId,
  remainingToPay,
  onSuccess,
  onClose,
}: UseCloseOrderParams): UseCloseOrderReturn {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { printAsync } = useDocumentActions();
  const queryClient = useQueryClient();

  const [method, setMethod] = useState<PaymentMethodType>(PAYMENT_METHODS.CASH);

  const remaining = parseFloat(remainingToPay);
  const isOverpayment = remaining < 0;
  const hasBalance = remaining !== 0;
  const displayAmount = parseFloat(Math.abs(remaining).toFixed(2)).toString();

  const waitForClosingReceipt = (): Promise<OrderDocument | undefined> => {
    return new Promise((resolve) => {
      const queryKey = queryKeys.orders.detail(orderId);

      const existing = queryClient.getQueryData<OrderInfo>(queryKey);
      const existingDoc = existing?.documents.find(
        (d) => d.type === "closing_receipt",
      );
      if (existingDoc) {
        resolve(existingDoc);
        return;
      }

      const timer = setTimeout(() => {
        unsubscribe();
        resolve(undefined);
      }, 15_000);

      const unsubscribe = queryClient.getQueryCache().subscribe(() => {
        const data = queryClient.getQueryData<OrderInfo>(queryKey);
        const doc = data?.documents.find((d) => d.type === "closing_receipt");
        if (doc) {
          clearTimeout(timer);
          unsubscribe();
          resolve(doc);
        }
      });
    });
  };

  const { mutate: close, isPending } = useMutation({
    mutationFn: async (withPrint: boolean) => {
      if (hasBalance && user) {
        await ordersApi.makePayment(orderId, {
          type: isOverpayment ? PAYMENTS.REFUND : PAYMENTS.PAYMENT,
          method,
          amount: String(Math.abs(remaining)),
          note: isOverpayment
            ? t("orders.refundNoteOnClose")
            : t("orders.paymentNoteOnClose"),
          managerId: user.id,
        });
      }

      await ordersApi.changeStatus(orderId, statusId);

      if (withPrint) {
        const closingDoc = await waitForClosingReceipt();
        if (closingDoc) {
          await printAsync([{ orderId, documentId: closingDoc.id }]);
        } else {
          toast.error(t("orders.print.print_document_timeout"));
        }
      }
    },
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  return {
    close,
    isPending,
    method,
    setMethod,
    isOverpayment,
    hasBalance,
    displayAmount,
  };
}
